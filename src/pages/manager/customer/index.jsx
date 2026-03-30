import { useEffect, useRef, useState } from "react";
import {
  ClusterOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelFilled,
  FilterOutlined,
  RedoOutlined,
  SearchOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Tooltip,
  Row,
  message,
  Pagination,
  Form,
  Col,
  Input,
  Table,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import CreateCustomer from "./CreateCustomer";
import UpdateCustomer from "./UpdateCustomer";
import Confirm from "../../../components/modal/Confirm";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import { read, utils, write } from "xlsx";
import * as FileSaver from "file-saver";
import useHeader from "../../../contexts/headerContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { assetMaintenanceStaticPath } from "../../../router/assetMaintenanceRouteConfig";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import ShowError from "../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../components/modal/result/successNotification";
import DialogModal from "../../../components/modal/result/DialogNotification";

export default function Customer() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [Customers, setCustomers] = useState([]);
  const [CustomerId, setCustomerId] = useState([]);
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    setHeaderTitle(t("customer.list.title"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    if (page > 1) {
      fetchGetListCustomer(page, searchFilter);
    } else
      fetchGetListCustomer(1, searchFilter);
  }, [page]);

  useEffect(() => {
    const totalPages = Math.ceil(totalRecord / pagination.limit);
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalRecord, page, pagination.limit]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetListCustomer = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      // ...searchForm.getFieldsValue(),
      ...filterValue,
      [searchField]: searchValue,
    };
    const res = await _unitOfWork.customer.getListCustomers(payload);

    if (res && res.results && res.results?.results) {
      const customersWithAvatar = await Promise.all(
        res.results.results.map(async (item) => {
          let avatarUrl = null;
          if (item.resourceId) {
            try {
              const response = await _unitOfWork.resource.getImage(item.resourceId);
              avatarUrl = response || null;
            } catch (_error) {
              // silent
            }
          }
          return { ...item, avatarUrl };
        })
      );

      setCustomers(customersWithAvatar);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onClickViewMaintenances = (value) => {
    navigate(assetMaintenanceStaticPath.customerAsset + "/" + value);
    console.log(assetMaintenanceStaticPath.customerAsset + "/" + value);
  };

  const onClickUpdate = (values) => {
    setCustomerId(values);
    setIsOpenUpdate(true);
  };

  const onDeleteCustomer = async (values) => {
    try {
      const res = await _unitOfWork.customer.deleteCustomer({
        id: values,
      });
      if (res && res.code === 1) {
        fetchGetListCustomer(1, searchFilter);
        message.success(t("customer.messages.delete_success"));
      }
    } catch {
      message.error(t("customer.messages.delete_error"));
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // const handleUpload = async (file, _note) => {
  //   const reader = new FileReader();

  //   reader.onload = async (e) => {
  //     try {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = read(data, { type: "array" });
  //       const firstSheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[firstSheetName];
  //       const jsonData = utils.sheet_to_json(worksheet);

  //       const customers = jsonData
  //         .filter((row) => row.customerName)
  //         .map((row) => ({
  //           contactEmail: row.email || "",
  //           contactNumber: row.phone || "",
  //           customerName: row.customerName,
  //           address: row.address || "",
  //         }));

  //       if (customers.length === 0) {
  //         message.warning(t("customer.messages.import_no_valid_rows"));
  //         return;
  //       }

  //       const res = await _unitOfWork.customer.insertManyCustomer(customers);
  //       if (res?.code === 1) {
  //         message.success(
  //           t("customer.messages.import_success", { count: customers.length })
  //         );
  //         setOpenBulkUpload(false);
  //         fetchGetListCustomer();
  //       }
  //     } catch (error) {
  //       message.error(t("customer.messages.import_error"));
  //     }
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.customer.uploadCustomerExcel(
      formData
    );
    if (res && res.code === 1 && res.result.success) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.upload_count", { count: res?.result?.insertCount || 0 })
      );
      if (res?.result?.warnings) {
        setMessages(res?.result?.warnings);
        setModalType("warning")
        setIsModalOpen(true);
      }
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res?.message || t("common.messages.errors.upload_failed")
      );
      setMessages(res?.result?.errors);
      setModalType("error");
      setIsModalOpen(true);
    }
    fetchGetListCustomer();
    setOpenBulkUpload(false);
  };

  const transformExportData = async (rawData, unitOfWork) => {
    const transformedData = await Promise.all(
      rawData.map(async (item, index) => {
        const taxGroup = item.taxGroupId
          ? await unitOfWork.taxGroup.getTaxGroupById({ id: item.taxGroupId })
          : null;

        return {
          [t("customer.export.index")]: index + 1,
          [t("customer.form.fields.customer_name")]: item.customerName,
          [t("customer.form.fields.customer_email")]: item.contactEmail,
          [t("customer.form.fields.customer_phone_number")]: item.contactNumber,
          [t("customer.form.fields.customer_address")]: item.addressTwo,
          [t("customer.form.fields.customer_tax_group")]: taxGroup?.groupName || "",
          [t("customer.form.fields.customer_tax_code")]: item.customer_gst_number,
          [t("customer.export.created_at")]: formatDate(item.createdAt),
          [t("customer.export.updated_at")]: formatDate(item.updatedAt),
        };
      })
    );
    return transformedData;
  };

  const exportToCSV = async (fileName) => {
    let payload = {
      page: page,
      limit: totalRecord,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.customer.getListCustomers(payload);
    if (res && res.results && res.results?.results) {
      const exportData = await transformExportData(
        res.results.results,
        _unitOfWork
      );
      if (!exportData.length) {
        message.info(t("customer.messages.no_data"));
        return;
      }
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      const ws = utils.json_to_sheet(exportData);

      const colWidths = Object.keys(exportData[0] || {}).map((key) => {
        const maxLength = Math.max(
          key.length,
          ...exportData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        );
        return { wch: maxLength + 2 };
      });

      ws["!cols"] = colWidths;

      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
      message.success(t("customer.messages.export_success"));
    }
  };

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current)
      drawerRef.current.resetForm();
    setPage(1);
    searchForm.resetFields();
    fetchGetListCustomer();
  };
  const onSearch = () => {
    setPage(1);
    fetchGetListCustomer(1, searchFilter);
  };

  const columns = [
    {
      title: t("customer.export.index"),
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("customer.list.table.name"),
      dataIndex: "customerName",
      align: "left",
      width: 200,
    },
    {
      title: t("customer.form.fields.customer_email"),
      dataIndex: "contactEmail",
      align: "left",
      width: 220,
    },
    {
      title: t("customer.list.table.phone_number"),
      dataIndex: "contactNumber",
      align: "left",
      width: 150,
    },
    {
      title: t("customer.list.table.address"),
      dataIndex: "address",
      align: "left",
      width: 250,
      ellipsis: true,
    },
    {
      title: t("customer.table.action"),
      dataIndex: "action",
      key: "action",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_text, record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {checkPermission(
            permissions,
            permissionCodeConstant.customer_assetmaintenance_list
          ) && (
              <Tooltip title={t("common_buttons.mapping_asset")}>
                <Button
                  icon={<ClusterOutlined />}
                  size="small"
                  onClick={() => onClickViewMaintenances(record.id)}
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.customer_update
          ) && (
              <Tooltip title={t("customer.actions.edit")}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => onClickUpdate(record.id)}
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.customer_delete
          ) && (
              <Tooltip title={t("customer.actions.delete")}>
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    Confirm(
                      t("customer.messages.confirm_delete"),
                      () => onDeleteCustomer(record.id)
                    )
                  }
                />
              </Tooltip>
            )}
        </div>
      ),
    },
  ];

  const customerFieldsConfig = [
    {
      name: "customerName",
      labelKey: "customer.list.search.name_label",
      placeholderKey: "customer.list.search.placeholder_name",
      component: "Input",
    },
    {
      name: "contactNumber",
      labelKey: "customer.list.search.phone_label",
      placeholderKey: "customer.list.search.placeholder_phone",
      component: "Input",
    },
    {
      name: "contactEmail",
      labelKey: "customer.form.fields.customer_email",
      placeholderKey: "customer.list.search.placeholder_email",
      component: "Input",
    },
    {
      name: "addressTwo",
      labelKey: "customer.list.search.address_label",
      placeholderKey: "customer.list.search.placeholder_address",
      component: "Input",
    },
  ];

  const placeholderMap = {
    searchText: t("preventive.common.all"),
    customerName: t("customer.list.search.name_label"),
    contactNumber: t("customer.list.search.phone_label"),
    contactEmail: t("customer.form.fields.customer_email"),
    addressTwo: t("customer.list.search.address_label"),
  };

  return (
    <div className="">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <div className="header-all justify-content-space-between">
          {/* <div className="pl-3 pr-3 pt-3">
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item
                  label={t("customer.list.search.name_label")}
                  name="customerName"
                >
                  <Input
                    placeholder={t(
                      "customer.list.search.placeholder_name"
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("customer.list.search.phone_label")}
                  name="contactNumber"
                >
                  <Input
                    placeholder={t(
                      "customer.list.search.placeholder_phone"
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("customer.form.fields.customer_email")}
                  name="contactEmail"
                >
                  <Input
                    placeholder={t(
                      "customer.list.search.placeholder_email"
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("customer.list.search.address_label")}
                  name="addressTwo"
                >
                  <Input
                    placeholder={t(
                      "customer.list.search.placeholder_address"
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "15px 15px 2px 15px",
            }}
          >
            <Col span={8} className="mt-2">
              <Form.Item>
                <Input.Group compact>
                  <Select

                    value={searchField}
                    style={{ width: "30%", height: 32, lineHeight: "32px" }}
                    onChange={(value) => {
                      setSearchField(value);
                      searchForm.setFieldValue("searchValue", "");
                    }}
                    options={[
                      { value: "searchText", label: t("preventive.common.all") },
                      { value: "customerName", label: t("customer.list.search.name_label") },
                      { value: "contactNumber", label: t("customer.list.search.phone_label") },
                      { value: "contactEmail", label: t("customer.form.fields.customer_email") },
                      { value: "addressTwo", label: t("customer.list.search.address_label") },

                    ]}
                  />

                  <Form.Item
                    name="searchValue"
                    noStyle
                  >
                    <Input
                      style={{ width: "70%", height: 32, lineHeight: "32px" }}
                      placeholder={placeholderMap[searchField]}
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col span={8}
              style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
              <Button type="primary" className="mx-2" htmlType="submit">
                <SearchOutlined />
                {t("common.buttons.search")}
              </Button>
              <Button className="bt-green mr-2" onClick={resetSearch}>
                <RedoOutlined />
                {t("common.buttons.reset")}
              </Button>
              <Button
                title={t("preventive.buttons.advanced_search")}
                className="px-2 mr-2"
                onClick={() => setIsOpenSearchAdvanced(true)}
              >
                <FilterOutlined
                  style={{ fontSize: 20, cursor: "pointer" }}
                />
              </Button>
            </Col>
            <Col span={8} style={{ display: "flex", gap: "8px", marginTop: 8, justifyContent: 'flex-end' }}>
              <Button
                className="button"
                onClick={() => {
                  exportToCSV("customers");
                }}
              >
                <FileExcelFilled />
                {t("customer.actions.export_excel")}
              </Button>
              <Button
                className="button"
                onClick={() => setOpenBulkUpload(true)}
              >
                <UploadOutlined />
                {t("customer.actions.bulk_upload")}
              </Button>
              {checkPermission(
                permissions,
                permissionCodeConstant.customer_create
              ) && (
                  <Button
                    type="primary"
                    onClick={() => setIsOpenCreate(true)}
                    icon={<UserAddOutlined />}
                  >
                    {t("common.buttons.create")}
                  </Button>
                )}
            </Col>
          </div>
          <div className="pl-3 pr-3">
            <div style={{ fontSize: 16, textAlign: "right" }}>
              <b>
                {t("customer.list.total", {
                  count: totalRecord,
                })}
              </b>
            </div>
            <Table
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={Customers}
              pagination={false}
              bordered
              rowKey="_id"
              locale={{
                emptyText: t("customer.messages.no_data"),
              }}
            />
            <Pagination
              className="pagination-table mt-2 pb-3"
              onChange={onChangePagination}
              pageSize={pagination.limit}
              total={totalRecord}
              current={page}
            />
          </div>
        </div>
      </Form>

      <CreateCustomer
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchGetListCustomer}
      />
      <UpdateCustomer
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        id={CustomerId}
        onRefresh={fetchGetListCustomer}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/templateCustomer.xlsx"
      />
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetListCustomer(1, value);
          }
        }}
        onClose={() => { setIsOpenSearchAdvanced(false) }}
        fieldsConfig={customerFieldsConfig}
      />
      <DialogModal
        open={isModalOpen}
        handleOk={() => setIsModalOpen(false)}
        type={modalType}
        message={messages}
      />
    </div>
  );
}