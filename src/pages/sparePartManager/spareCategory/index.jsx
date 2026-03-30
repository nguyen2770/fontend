import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  // CheckCircleTwoTone,
  RedoOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import {
  Row,
  Col,
  Table,
  // Switch,
  Button,
  Space,
  Tooltip,
  Pagination,
  Form,
  Input,
  Card,
} from "antd";
import { PAGINATION } from "../../../utils/constant";

import CreateSpareCategory from "./CreateSpareCategory";
import UpdateSpareCategory from "./UpdateSpareCategory";
import useHeader from "../../../contexts/headerContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import DialogModal from "../../../components/modal/result/DialogNotification";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import ShowError from "../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../components/modal/result/successNotification";

export default function SpareCategory() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState(PAGINATION);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [spareCategories, setSpareCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [spareCategoryUpdate, setSpareCategoryUpdate] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    fetchSpareCategories();
  }, [page]);

  // useEffect(() => {
  //   setHeaderTitle(t("spareCategory.list.title"));
  // }, [t, setHeaderTitle]);

  const fetchSpareCategories = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    let res = await _unitOfWork.spareCategory.getSpareCategories(payload);
    if (res && res.data && res.data.results) {
      setSpareCategories(res.data.results);
      setTotalRecord(res.data.totalResults);
    }
  };

  const onSearch = () => {
    pagination.page = 1;
    fetchSpareCategories();
  };

  const onClickCreate = () => {
    setIsOpenCreate(true);
  };
  const onCallbackCreate = () => {
    setIsOpenCreate(false);
    fetchSpareCategories();
  };
  const onCancelCreate = () => {
    setIsOpenCreate(false);
  };
  const onCallbackUpdate = () => {
    setIsOpenUpdate(false);
    fetchSpareCategories();
  };
  const onClickUpdate = (record) => {
    setSpareCategoryUpdate(record);
    setIsOpenUpdate(true);
  };
  const onCancelUpdate = () => {
    setIsOpenUpdate(false);
  };
  const onClickDelete = async (record) => {
    await _unitOfWork.spareCategory.deleteSpareCategory(record.id);
    fetchSpareCategories();
  };
  const onChangePagination = (value) => {
    setPage(value);
  };

  const resetSearch = () => {
    pagination.page = 1;
    searchForm.resetFields();
    fetchSpareCategories();
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.importData.uploadSpareCategoryExcel(
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
    fetchSpareCategories();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("spareCategory.export.index", { defaultValue: "STT" }),
      dataIndex: "id",
      key: "id",
      width: "5%",
      align: "center",
      render: (_1, _2, idx) => (
        <span>{idx + 1 + PAGINATION.limit * (page - 1)}</span>
      ),
    },
    {
      title: t("spareCategory.list.table.name"),
      dataIndex: "spareCategoryName",
      key: "spareCategoryName",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   width: 150,
    //   align: "center",
    //   render: (isActive, record) => (
    //     <Switch
    //       checked={isActive}
    //       autoFocus={true}
    //       onChange={() => onClickUpdateStatus(record)}
    //       checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
    //       unCheckedChildren="x"
    //     />
    //   ),
    // },
    {
      title: t("spareCategory.table.action", { defaultValue: "Action" }),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_text, record) => (
        <Space size="middle">
          {checkPermission(
            permissions,
            permissionCodeConstant.spare_part_category_update
          ) && (
              <Tooltip title={t("spareCategory.actions.edit")}>
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
            permissionCodeConstant.spare_part_category_delete
          ) && (
              <Tooltip title={t("spareCategory.actions.delete")}>
                <Button
                  type="primary"
                  onClick={() =>
                    Confirm(
                      t("spareCategory.messages.confirm_delete"),
                      () => onClickDelete(record)
                    )
                  }
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
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
              label={t("spareCategory.list.search.name_label")}
              name="spareCategoryName"
            >
              <Input
                placeholder={t(
                  "spareCategory.list.search.placeholder_name"
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("common.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              className="button mr-2"
              onClick={() => setOpenBulkUpload(true)}
            >
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button>
            {checkPermission(
              permissions,
              permissionCodeConstant.spare_part_category_create
            ) && (
                <Button type="primary" onClick={onClickCreate}>
                  <PlusOutlined />
                  {t("spareCategory.form.buttons.submit_create")}
                </Button>
              )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("spareCategory.list.total", {
                count: totalRecord || 0,
              })}
            </b>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={spareCategories}
          bordered
          pagination={false}
        />

        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
      <CreateSpareCategory
        open={isOpenCreate}
        handleCancel={onCancelCreate}
        handleOk={onCallbackCreate}
      />
      <UpdateSpareCategory
        open={isOpenUpdate}
        handleCancel={onCancelUpdate}
        handleOk={onCallbackUpdate}
        spareCategory={spareCategoryUpdate}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateSpareCategory.xlsx"
      />
      <DialogModal
        open={isModalOpen}
        handleOk={() => setIsModalOpen(false)}
        type={modalType}
        message={messages}
      />
    </Card>
  );
}