import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  UploadOutlined
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
  Tooltip
} from "antd";
import CreateManufacturer from "../../../manager/assetSetup/manufacturer/CreateManufacturer";
import UpdateManufacturer from "../../../manager/assetSetup/manufacturer/UpdateManufacturer";
import { PAGINATION } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import useHeader from "../../../../contexts/headerContext";
import { filterOption } from "../../../../helper/search-select-helper";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import ShowError from "../../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import DialogModal from "../../../../components/modal/result/DialogNotification";
import BulkUploadModal from "../../../../components/modal/BulkUpload";

export default function Manufacturer() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pagination, setPagination] = useState(PAGINATION);
  const [manufacturerId, setManufacturerId] = useState();
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const [origins, setOrigins] = useState([]);
  const { permissions } = useAuth();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    fetchGetListManufacturer();
  }, [page]);

  useEffect(() => {
    setHeaderTitle(t("manufacturer.list.title"));
    fetGetAllOrigins();
  }, [t, setHeaderTitle]);

  const fetchGetListManufacturer = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue()
    };
    const res =
      await _unitOfWork.manufacturer.getListManufacturers(payload);
    if (res && res.results && res.results?.results) {
      setDataSource(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onChangePagination = (value) => {
    setPage(value);
  };

  const onClickUpdate = (values) => {
    setIsOpenUpdate(true);
    setManufacturerId(values.id);
  };

  const fetGetAllOrigins = async () => {
    let res = await _unitOfWork.origin.getAllOrigin();
    if (res && res.code === 1) {
      setOrigins(res.data);
    }
  };

  const onClickDelete = async (values) => {
    const res = await _unitOfWork.manufacturer.deleteManufacturer({
      id: values.id,
      ...searchForm.getFieldsValue()
    });
    if (res && res.code === 1) {
      if (dataSource.length === 1 && page > 1) {
        setPage(1);
      } else {
        fetchGetListManufacturer();
      }
    }
  };

  const onSearch = () => {
    setPage(1);
    fetchGetListManufacturer();
  };

  const resetSearch = () => {
    setPage(1);
    searchForm.resetFields();
    fetchGetListManufacturer();
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.importData.uploadManufacturerExcel(
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
    fetchGetListManufacturer();
    fetGetAllOrigins();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("manufacturer.list.table.index"),
      dataIndex: "key",
      align: "center",
      width: "5%",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1
    },
    {
      title: t("manufacturer.list.table.name"),
      dataIndex: "manufacturerName",
      className: "text-left-column",
      align: "center"
    },
    {
      title: t("manufacturer.list.table.origin"),
      dataIndex: "origin",
      render: (_text) => (_text ? _text.originName : _text)
    },
    {
      title: t("manufacturer.list.table.action"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.manufacturer_update
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
            permissionCodeConstant.manufacturer_delete
          ) && (
              <Tooltip title={t("purchase.actions.delete")}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="ml-2"
                  onClick={() =>
                    Comfirm(
                      t("manufacturer.messages.confirm_delete"),
                      () => onClickDelete(record)
                    )
                  }
                />
              </Tooltip>
            )}
        </div>
      )
    }
  ];

  return (
    <div className="p-3">
      <Form
labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              label={t("manufacturer.list.search.name_label")}
              name="manufacturerName"
            >
              <Input
                placeholder={t(
                  "manufacturer.list.search.placeholder_name"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("manufacturer.list.search.origin_label")}
              name="origin"
            >
              <Select
                allowClear
                showSearch
                placeholder={t(
                  "manufacturer.list.search.placeholder_origin"
                )}
                options={(origins || []).map((item, key) => ({
                  key: key,
                  value: item.id,
                  label: item.originName
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("purchase.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("purchase.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              className="button"
              onClick={() => setOpenBulkUpload(true)}
            >
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button>
            {checkPermission(
              permissions,
              permissionCodeConstant.manufacturer_create
            ) && (
                <Button
                  key="1"
                  type="primary"
                  onClick={() => setIsOpenCreate(true)}
                  className="ml-3"
                >
                  <PlusOutlined />
                  {t("purchase.buttons.create")}
                </Button>
              )}
          </Col>
          <Col
            span={24}
            style={{ fontSize: 16, textAlign: "right" }}
          >
            <b>
              {t("manufacturer.list.total", {
                count: totalRecord || 0
              })}
            </b>
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
      <CreateManufacturer
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchGetListManufacturer}
      />
      <UpdateManufacturer
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        id={manufacturerId}
        onRefresh={fetchGetListManufacturer}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateManufacturer.xlsx"
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