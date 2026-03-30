import { useEffect, useRef, useState } from "react";
import {
  Button,
  Tooltip,
  Row,
  Col,
  Input,
  Table,
  Space,
  Pagination,
  message,
  Form,
  Select,
} from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  QrcodeOutlined,
  UserAddOutlined,
  DeleteFilled,
  EditOutlined,
  SearchOutlined,
  RedoOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { PAGINATION } from "../../../utils/constant";
import QRCodeModal from "./QRCodeModal";
import useHeader from "../../../contexts/headerContext";
import CreateSparePart from "./CreateSparePart";
import UpdateSparePart from "./UpdateSparePart";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import useAuth from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import DialogModal from "../../../components/modal/result/DialogNotification";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";

export default function StockManager() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const { setHeaderTitle } = useHeader();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openModalQrCode, setOpenModalQrCode] = useState(false);
  const [SpacePartId, setSpacePartId] = useState();
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    code: null,
    sparePartName: null,
    manufacturer: null,
    spareCategory: null,
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [spareCategories, setSpareCategories] = useState([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const { permissions } = useAuth();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    setHeaderTitle(t("sparePart.list.title"));
    initData();
  }, [t, setHeaderTitle]);

  useEffect(() => {
    if (page > 1) {
      fetchSpareParts(page, searchFilter);
    } else
      fetchSpareParts(1, searchFilter);
  }, [page, searchParams]);

  useEffect(() => {
    const totalPages = Math.ceil(totalRecord / pagination.limit);
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalRecord, page, pagination.limit]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    Confirm(t("sparePart.list.bulk.confirm_delete_selected"), async () => {
      try {
        for (const id of selectedIds) {
          await handleDelete(id);
        }
        setSelectedIds([]);
        fetchSpareParts(1, searchFilter);
      } catch (error) {
        message.error(t("sparePart.messages.delete_error"));
      }
    });
  };

  const initData = async () => {
    const manufacturerRes = await _unitOfWork.manufacturer.getAllManufacturer();
    if (manufacturerRes?.code === 1) {
      setManufacturers(manufacturerRes.data);
    }
    const spareCategoriesRes =
      await _unitOfWork.spareCategory.getSpareCategories();
    if (spareCategoriesRes?.data?.results) {
      setSpareCategories(spareCategoriesRes?.data?.results);
    }
  };

  const fetchSpareParts = async (_page, value) => {
    let filterValue = cleanEmptyValues(value || {});
    try {
      const payload = {
        page: _page || page,
        limit: PAGINATION.limit,
        ...filterValue,
        ...searchForm.getFieldValue(),
      };
      const res = await _unitOfWork.sparePart.getListSpareParts({
        ...payload,
      });
      if (res && res.results && res.results?.results) {
        setData(res.results?.results);
        setTotalRecord(res.results.totalResults);
      }
    } catch (error) {
      console.error("Failed to fetch spare parts:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await _unitOfWork.sparePart.deleteSparePart({ id });
      if (res && res.code === 1) {
        fetchSpareParts(1, searchFilter);
        message.success(t("sparePart.messages.delete_success"));
      } else {
        message.error(res?.message || t("sparePart.messages.delete_error"));
      }
    } catch {
      message.error(t("sparePart.messages.delete_error"));
    }
  };

  const onClickOpenSparePartSearch = () => {
    console.log(staticPath.searchQRCodeSparePart)
    navigate(staticPath.searchQRCodeSparePart)
  }

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (selectedRowKeys) => {
      setSelectedIds(selectedRowKeys);
    },
  };

  const onSearch = () => {
    setSearchParams({
      ...searchForm.getFieldsValue(),
    });
    // setPage(1);
    fetchSpareParts(1, searchFilter);
  };

  const onReset = () => {
    setSearchFilter({});
    if (drawerRef.current)
      drawerRef.current.resetForm();
    searchForm.resetFields();
    // setSearchParams({
    //   code: null,
    //   sparePartName: null,
    //   manufacturer: null,
    //   spareCategory: null,
    // });
    // setPage(1);
    fetchSpareParts(1);
  };
  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.sparePart.uploadSparePartExcel(
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
    fetchSpareParts();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("sparePart.list.table.index"),
      dataIndex: "key",
      width: 40,
      align: "center",
      render: (_t, _r, index) => (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("sparePart.list.table.code"),
      dataIndex: "code",
      width: 100,
      className: "text-left-column",
      align: "center",
    },
    {
      title: t("sparePart.list.table.name"),
      dataIndex: "sparePartsName",
      width: 200,
      className: "text-left-column",
      align: "center",
    },
    {
      title: t("sparePart.list.table.category_main"),
      dataIndex: "spareCategoryId",
      width: 200,
      className: "text-left-column",
      align: "center",
      render: (text) => <span>{text?.spareCategoryName}</span>,
    },
    {
      title: t("sparePart.list.table.category_sub"),
      dataIndex: "spareSubCategoryId",
      width: 200,
      className: "text-left-column",
      align: "center",
      render: (text) => <span>{text?.spareSubCategoryName}</span>,
    },
    {
      title: t("sparePart.list.table.manufacturer"),
      dataIndex: "manufacturer",
      width: 200,
      className: "text-left-column",
      align: "center",
      render: (text) => <span>{text?.manufacturerName}</span>,
    },
    {
      title: t("sparePart.list.table.action"),
      dataIndex: "action",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t("sparePart.actions.edit")}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setIsOpenUpdateModal(true);
                setSpacePartId(record.id);
              }}
            />
          </Tooltip>
          <Tooltip title={t("sparePart.actions.delete")}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() =>
                Confirm(t("sparePart.messages.confirm_delete"), () =>
                  handleDelete(record.id)
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const sparePartFieldsConfig = [
    {
      name: "code",
      labelKey: "sparePart.list.search.code_label",
      placeholderKey: "sparePart.list.search.placeholder_code",
      component: "Input",
    },
    {
      name: "sparePartsName",
      labelKey: "sparePart.list.search.name_label",
      placeholderKey: "sparePart.list.search.placeholder_name",
      component: "Input",
    },
    {
      name: "manufacturer",
      labelKey: "sparePart.list.search.manufacturer_label",
      placeholderKey: "sparePart.list.search.placeholder_manufacturer",
      component: "Select",
      options: manufacturers.map((item) => ({
        value: item.id,
        label: item.manufacturerName,
      })),
    },
    {
      name: "spareCategoryId",
      labelKey: "sparePart.list.search.category_main_label",
      placeholderKey: "sparePart.list.search.placeholder_category_main",
      component: "Select",
      options: spareCategories.map((item) => ({
        value: item.id,
        label: item.spareCategoryName,
      })),
    },
  ];

  return (
    <div>
      <div className="p-3">
        <Form
labelWrap
          className="search-form"
          form={searchForm}
          layout="vertical"
          onFinish={onSearch}
        >
          {/* <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="code"
                label={t("sparePart.list.search.code_label")}
              >
                <Input
                  placeholder={t("sparePart.list.search.placeholder_code")}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="sparePartsName"
                label={t("sparePart.list.search.name_label")}
              >
                <Input
                  placeholder={t("sparePart.list.search.placeholder_name")}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="manufacturer"
                label={t("sparePart.list.search.manufacturer_label")}
              >
                <Select
                  placeholder={t(
                    "sparePart.list.search.placeholder_manufacturer"
                  )}
                  options={(manufacturers || []).map((item) => ({
                    value: item.id,
                    label: item.manufacturerName,
                  }))}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="spareCategoryId"
                label={t("sparePart.list.search.category_main_label")}
              >
                <Select
                  placeholder={t(
                    "sparePart.list.search.placeholder_category_main"
                  )}
                  options={(spareCategories || []).map((item) => ({
                    value: item.id,
                    label: item.spareCategoryName,
                  }))}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row> */}

          <Row>
            <Col span={6}>
              <Form.Item
                label={t("sparePart.list.search.name_label")}
                name="sparePartsName"
              >
                <Input placeholder={t("sparePart.list.search.placeholder_name")}></Input>
              </Form.Item>
            </Col>
            <Col span={7}
              className="pt-3 pl-2"
              style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
              <Button type="primary" className="mr-2" htmlType="submit">
                <SearchOutlined />
                {t("common.buttons.search")}
              </Button>
              <Button className="bt-green mr-2" onClick={onReset}>
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
            <Col span={11} style={{ textAlign: "end", marginTop: 24 }}>
              <div>

                <Button
                  className="button mr-1"
                  onClick={() => setOpenBulkUpload(true)}
                >
                  <UploadOutlined />
                  {t("customer.actions.bulk_upload")}
                </Button>
                <Button
                  className="button"
                  onClick={onClickOpenSparePartSearch}
                >
                  <SearchOutlined />
                  {t("sparePart.form.buttons.search_qr")}
                  {/* Tìm kiếm mã QR */}
                </Button>

                {checkPermission(
                  permissions,
                  permissionCodeConstant.spare_part_replacement_delete
                ) && (
                    <Button
                      type="secondary"
                      className="button ml-2"
                      onClick={handleDeleteSelected}
                      disabled={selectedIds.length === 0}
                    >
                      <DeleteFilled />
                      {t("sparePart.list.bulk.delete_selected")}
                    </Button>
                  )}
                {checkPermission(
                  permissions,
                  permissionCodeConstant.spare_part_replacement_create
                ) && (
                    <Button
                      type="primary"
                      onClick={() => setIsOpenCreateModal(true)}
                      className="ml-2"
                    >
                      <UserAddOutlined />
                      {t("sparePart.form.buttons.create")}
                    </Button>
                  )}
              </div>
            </Col>
            <Col
              span={24}
              style={{
                textAlign: "right",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <b>
                {t("sparePart.list.total", {
                  count: totalRecord || 0,
                })}
              </b>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
          rowSelection={rowSelection}
        />
        <QRCodeModal
          id={SpacePartId}
          open={openModalQrCode}
          handleCancel={() => setOpenModalQrCode(false)}
        />

        <Pagination
          className="pagination-table mt-3"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
        <CreateSparePart
          open={isOpenCreateModal}
          onClose={() => {
            setIsOpenCreateModal(false);
          }}
          onFinish={() => {
            setIsOpenCreateModal(false);
            fetchSpareParts();
          }}
        />
        <UpdateSparePart
          open={isOpenUpdateModal}
          onClose={() => {
            setIsOpenUpdateModal(false);
          }}
          onFinish={() => {
            setIsOpenUpdateModal(false);
            fetchSpareParts();
          }}
          id={SpacePartId}
        />
        <DrawerSearch
          isOpen={isOpenSearchAdvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["sparePartsName"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchSpareParts(1, value);
            }
          }}
          onClose={() => { setIsOpenSearchAdvanced(false) }}
          fieldsConfig={sparePartFieldsConfig}
        />
        <BulkUploadModal
          open={isOpenBulkUpload}
          onCancel={() => setOpenBulkUpload(false)}
          onUpload={handleUpload}
          templateUrl="/file/TemplateSpareParts.xlsx"
        />
        <DialogModal
          open={isModalOpen}
          handleOk={() => setIsModalOpen(false)}
          type={modalType}
          message={messages}
        />
      </div>
    </div>
  );
}
