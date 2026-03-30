import React, { useEffect, useRef, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import CreateSupplier from "./CreateSupplier";
import UpdateSupplier from "./UpdateSupplier";
import { PAGINATION } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import useHeader from "../../../../contexts/headerContext";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import DrawerSearch from "../../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../../helper/check-search-value";
import BulkUploadModal from "../../../../components/modal/BulkUpload";
import DialogModal from "../../../../components/modal/result/DialogNotification";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import ShowError from "../../../../components/modal/result/errorNotification";

export default function Supplier() {
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeader();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pagination, setPagination] = useState(PAGINATION);
  const [supplierId, setSupplierId] = useState();
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    setHeaderTitle(t("supplier.list.title"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    if (page > 1) {
      fetchGetListSupplier(page, searchFilter);
    } else fetchGetListSupplier(1, searchFilter);
  }, [page]);

  const fetchGetListSupplier = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      // ...searchForm.getFieldsValue(),
      ...filterValue,
      [searchField]: searchValue,
    };
    const res = await _unitOfWork.supplier.getListSuppliers(payload);
    if (res && res.results && res.results?.results) {
      setDataSource(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onSearch = () => {
    setPage(1);
    fetchGetListSupplier(1, searchFilter);
  };

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    setPage(1);
    searchForm.resetFields();
    fetchGetListSupplier(1);
  };

  const onChangePagination = (value) => {
    setPage(value);
  };

  const onClickUpdate = (values) => {
    setIsOpenUpdate(true);
    setSupplierId(values.id);
  };

  const onClickDelete = async (values) => {
    const res = await _unitOfWork.supplier.deleteSupplier({ id: values.id });
    if (res && res.code === 1) {
      if (dataSource.length === 1 && page > 1) {
        setPage(1);
      } else {
        fetchGetListSupplier(1, searchFilter);
      }
    }
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.supplier.uploadSupplierExcel(formData);
    if (res && res.code === 1 && res.result.success) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.upload_count", {
          count: res?.result?.insertCount || 0,
        }),
      );
      if (res?.result?.warnings) {
        setMessages(res?.result?.warnings);
        setModalType("warning");
        setIsModalOpen(true);
      }
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res?.message || t("common.messages.errors.upload_failed"),
      );
      setMessages(res?.result?.errors);
      setModalType("error");
      setIsModalOpen(true);
    }
    fetchGetListSupplier();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("supplier.list.table.index"),
      dataIndex: "key",
      align: "center",
      width: "5%",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("supplier.list.table.supplier_name"),
      dataIndex: "supplierName",
      className: "text-left-column",
    },
    {
      title: t("supplier.list.table.phone"),
      dataIndex: "phoneNumber",
      className: "text-left-column",
    },
    {
      title: t("supplier.list.table.email"),
      dataIndex: "email",
      className: "text-left-column",
    },
    {
      title: t("supplier.list.table.address"),
      dataIndex: "address",
      className: "text-left-column",
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: t("supplier.list.table.action"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.supplier_update,
          ) && (
            <Tooltip title={t("purchase.actions.edit")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.supplier_delete,
          ) && (
            <Tooltip title={t("purchase.actions.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="ml-2"
                onClick={() =>
                  Comfirm(t("supplier.messages.confirm_delete"), () =>
                    onClickDelete(record),
                  )
                }
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const supplierFieldsConfig = [
    {
      name: "supplierName",
      labelKey: "supplier.list.search.supplier_name_label",
      placeholderKey: "supplier.list.search.placeholder_supplier_name",
      component: "Input",
    },
    {
      name: "phoneNumber",
      labelKey: "supplier.list.search.phone_label",
      placeholderKey: "supplier.list.search.placeholder_phone",
      component: "Input",
    },
    {
      name: "email",
      labelKey: "supplier.list.search.email_label",
      placeholderKey: "customer.list.search.placeholder_email",
      component: "Input",
    },
    {
      name: "address",
      labelKey: "supplier.list.search.address_label",
      placeholderKey: "supplier.list.search.placeholder_address",
      component: "Input",
    },
  ];

  const placeholderMap = {
    searchText: t("preventive.common.all"),
    supplierName: t("supplier.list.search.supplier_name_label"),
    phoneNumber: t("supplier.list.search.phone_label"),
    email: t("supplier.list.search.email_label"),
    address: t("supplier.list.search.address_label"),
  };

  return (
    <div className="p-2">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        {/* <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              label={t("supplier.list.search.supplier_name_label")}
              name="supplierName"
            >
              <Input
                placeholder={t(
                  "supplier.list.search.placeholder_supplier_name"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("supplier.list.search.phone_label")}
              name="phoneNumber"
            >
              <Input
                placeholder={t("supplier.list.search.placeholder_phone")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("supplier.list.search.email_label")}
              name="email"
            >
              <Input
                placeholder={t("supplier.list.search.placeholder_email")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("supplier.list.search.address_label")}
              name="address"
            >
              <Input
                placeholder={t("supplier.list.search.placeholder_address")}
              />
            </Form.Item>
          </Col>
        </Row> */}

        <Row className="mb-1">
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
                    {
                      value: "supplierName",
                      label: t("supplier.list.search.supplier_name_label"),
                    },
                    {
                      value: "phoneNumber",
                      label: t("supplier.list.search.phone_label"),
                    },
                    {
                      value: "email",
                      label: t("supplier.list.search.email_label"),
                    },
                    {
                      value: "address",
                      label: t("supplier.list.search.address_label"),
                    },
                  ]}
                />

                <Form.Item name="searchValue" noStyle>
                  <Input
                    style={{ width: "70%", height: 32, lineHeight: "32px" }}
                    placeholder={placeholderMap[searchField]}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col
            span={9}
            style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
          >
            <Button type="primary" className="mx-2" htmlType="submit">
              <SearchOutlined />
              {t("purchase.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("purchase.buttons.reset")}
            </Button>
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsOpenSearchAdvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>
          <Col span={7} style={{ textAlign: "right", marginTop: 8 }}>
            <Button className="button" onClick={() => setOpenBulkUpload(true)}>
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button>
            {checkPermission(
              permissions,
              permissionCodeConstant.supplier_create,
            ) && (
              <Button
                key="1"
                type="primary"
                onClick={() => setIsOpenCreate(true)}
                className="ml-2"
              >
                <PlusOutlined />
                {t("purchase.buttons.create")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("supplier.list.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>

        <Table
          key={"id"}
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
        />
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
      <CreateSupplier
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchGetListSupplier}
      />
      <UpdateSupplier
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        id={supplierId}
        onRefresh={fetchGetListSupplier}
      />
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetListSupplier(1, value);
          }
        }}
        onClose={() => {
          setIsOpenSearchAdvanced(false);
        }}
        fieldsConfig={supplierFieldsConfig}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateSupplier.xlsx"
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
