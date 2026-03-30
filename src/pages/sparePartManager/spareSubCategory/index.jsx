import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  RedoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from '../../../api';
import {
  Row,
  Col,
  Table,
  Button,
  Space,
  Tooltip,
  Pagination,
  Form,
  Input,
  Select,
  Card
} from "antd";
import { PAGINATION } from "../../../utils/constant";
import CreateSpareSubCategory from "./CreateSpareSubCategory";
import UpdateSpareSubCategory from "./UpdateSpareSubCategory";
import useHeader from "../../../contexts/headerContext";
import { filterOption } from "../../../helper/search-select-helper";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import DialogModal from "../../../components/modal/result/DialogNotification";

export default function SpareSubCategory() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState(PAGINATION);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [spareSubCategories, setSpareSubCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [spareSubCategoryUpdate, setSpareSubCategoryUpdate] = useState(null);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const [spareCategories, setSpareCategories] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const { permissions } = useAuth();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  // useEffect(() => {
  //   setHeaderTitle(t("spareSubCategory.list.title"));
  // }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchSpareCategories();
  }, []);

  useEffect(() => {
    fetchSubSpareCategories();
  }, [page]);

  const fetchSpareCategories = async () => {
    const res = await _unitOfWork.spareCategory.getSpareCategories({ page: 1, limit: 999 });
    if (res && res.data && res.data.results) {
      setSpareCategories(res.data.results);
    }
  };

  const fetchSubSpareCategories = async () => {
    const payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.spareSubCategory.getSpareSubCategories(payload);
    if (res && res.data && res.data.results) {
      setSpareSubCategories(res.data.results);
      setTotalRecord(res.data.totalResults);
    }
  };

  const onClickCreate = () => {
    setIsOpenCreate(true);
  };
  const onCallbackCreate = () => {
    setIsOpenCreate(false);
    fetchSubSpareCategories();
  };
  const onCancelCreate = () => {
    setIsOpenCreate(false);
  };
  const onCallbackUpdate = () => {
    setIsOpenUpdate(false);
    fetchSubSpareCategories();
  };
  const onClickUpdate = (record) => {
    setSpareSubCategoryUpdate(record);
    setIsOpenUpdate(true);
  };
  const onCancelUpdate = () => {
    setIsOpenUpdate(false);
  };
  const onClickDelete = async (record) => {
    await _unitOfWork.spareSubCategory.deleteSpareSubCategory(record._id);
    fetchSubSpareCategories();
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onSearch = () => {
    pagination.page = 1;
    fetchSubSpareCategories();
  };
  const resetSearch = () => {
    searchForm.resetFields();
    pagination.page = 1;
    fetchSubSpareCategories();
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.importData.uploadSpareSubCategoryExcel(
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
    fetchSubSpareCategories();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("spareSubCategory.export.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_t, _r, idx) => (
        <span>{idx + 1 + PAGINATION.limit * (page - 1)}</span>
      ),
    },
    {
      title: t("spareSubCategory.list.table.parent"),
      dataIndex: "spareCategoryName",
      key: "spareCategoryName",
      render: (_text, record) =>
        record?.spareCategoryObj?.spareCategoryName || "",
    },
    {
      title: t("spareSubCategory.list.table.sub"),
      dataIndex: "spareSubCategoryName",
      key: "spareSubCategoryName",
    },
    {
      title: t("spareSubCategory.table.action"),
      dataIndex: "action",
      align: "center",
      width: 150,
      render: (_text, record) => (
        <Space size="middle">
          {checkPermission(
            permissions,
            permissionCodeConstant.sub_spare_part_category_update
          ) && (
              <Tooltip title={t("spareSubCategory.actions.edit")}>
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
            permissionCodeConstant.sub_spare_part_category_delete
          ) && (
              <Tooltip title={t("spareSubCategory.actions.delete")}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() =>
                    Confirm(
                      t("spareSubCategory.messages.confirm_delete"),
                      () => onClickDelete(record)
                    )
                  }
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
              label={t("spareSubCategory.list.search.parent_label")}
              name="spareCategory"
            >
              <Select
                allowClear
                showSearch
                placeholder={t(
                  "spareSubCategory.list.search.placeholder_parent"
                )}
                options={(spareCategories || []).map(item => ({
                  key: item.id,
                  value: item.id,
                  label: item.spareCategoryName,
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("spareSubCategory.list.search.sub_label")}
              name="spareSubCategoryName"
            >
              <Input
                placeholder={t(
                  "spareSubCategory.list.search.placeholder_sub"
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
              permissionCodeConstant.sub_spare_part_category_create
            ) && (
                <Button type="primary" onClick={onClickCreate}>
                  <PlusOutlined />
                  {t("spareSubCategory.form.buttons.submit_create")}
                </Button>
              )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("spareSubCategory.list.total", {
                count: totalRecord || 0,
              })}
            </b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={spareSubCategories}
          bordered
          pagination={false}
        />
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
      <CreateSpareSubCategory
        spareCategories={spareCategories}
        fetchSpareCategories={fetchSpareCategories}
        open={isOpenCreate}
        handleCancel={onCancelCreate}
        handleOk={onCallbackCreate}
      />
      <UpdateSpareSubCategory
        open={isOpenUpdate}
        spareCategories={spareCategories}
        fetchSpareCategories={fetchSpareCategories}
        handleCancel={onCancelUpdate}
        handleOk={onCallbackUpdate}
        spareSubCategory={spareSubCategoryUpdate}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateSpareSubCategory.xlsx"
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