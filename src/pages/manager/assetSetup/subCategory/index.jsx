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
import CreateSubCategory from "./CreateSubCategory";
import UpdateSubCategory from "./UpdateSubCategory";
import { PAGINATION } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import useHeader from "../../../../contexts/headerContext";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import BulkUploadModal from "../../../../components/modal/BulkUpload";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import ShowError from "../../../../components/modal/result/errorNotification";
import DialogModal from "../../../../components/modal/result/DialogNotification";

export default function SubCategory() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [subCategorys, setSubCategorys] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState();
  const [searchForm] = Form.useForm();
  const [categorys, setCategorys] = useState([]);
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  // useEffect(() => {
  //   setHeaderTitle(t("subCategory.list.title"));
  //   fetchGetAllCategory();
  // }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchGetAllCategory();
    fetchGetListSubCategory();
  }, [page]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetAllCategory = async () => {
    let res = await _unitOfWork.category.getAllCategory();
    if (res && res.code === 1) {
      setCategorys(res.data);
    }
  };

  const fetchGetListSubCategory = async () => {
    let payload = {
      page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue()
    };
    const res =
      await _unitOfWork.subCategory.getListSubCategories(payload);
    if (res && res.results && res.results?.results) {
      setSubCategorys(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onClickUpdate = (values) => {
    setSubCategoryId(values.id);
    setIsOpenUpdate(true);
  };

  const onDeleteSubCategory = async (values) => {
    const res = await _unitOfWork.subCategory.deleteSubCategory({
      id: values.id
    });
    if (res && res.code === 1) {
      if (subCategorys.length === 1 && page > 1) {
        setPage(1);
      } else {
        fetchGetListSubCategory();
      }
    }
  };

  const resetSearch = () => {
    searchForm.resetFields();
    fetchGetListSubCategory();
  };

  const onSearch = () => {
    pagination.page = 1;
    fetchGetListSubCategory();
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.importData.uploadSubCategoryExcel(
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
    fetchGetAllCategory();
    fetchGetListSubCategory();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("subCategory.list.table.index"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1
    },
    {
      title: t("subCategory.list.table.parent"),
      dataIndex: "categoryId",
      key: "parent",
      className: "text-left-column",
      render: (text) => <span>{text?.categoryName}</span>
    },
    {
      title: t("subCategory.list.table.name"),
      dataIndex: "subCategoryName",
      key: "name",
      className: "text-left-column"
    },
    {
      title: t("subCategory.list.table.action"),
      width: "15%",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.sub_equipment_update
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
            permissionCodeConstant.sub_equipment_delete
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
                      t("subCategory.messages.confirm_delete"),
                      () => onDeleteSubCategory(record)
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
              label={t("subCategory.list.search.parent_label")}
              name="categoryId"
            >
              <Select
                allowClear
                placeholder={t(
                  "subCategory.list.search.placeholder_parent"
                )}
                options={(categorys || []).map((item) => ({
                  key: item.id,
                  value: item.id,
                  label: item?.categoryName
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("subCategory.list.search.name_label")}
              name="subCategoryName"
            >
              <Input
                placeholder={t(
                  "subCategory.list.search.placeholder_name"
                )}
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
              permissionCodeConstant.sub_equipment_create
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
              {t("subCategory.list.total", {
                count: totalRecord || 0
              })}
            </b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={subCategorys}
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
        <CreateSubCategory
          open={isOpenCreate}
          handleCancel={() => setIsOpenCreate(false)}
          handleOk={() => setIsOpenCreate(false)}
          onRefresh={fetchGetListSubCategory}
          categorys={categorys}
          fetchGetAllCategory={fetchGetAllCategory}
        />
        <UpdateSubCategory
          open={isOpenUpdate}
          handleCancel={() => setIsOpenUpdate(false)}
          handleOk={() => setIsOpenUpdate(false)}
          id={subCategoryId}
          onRefresh={fetchGetListSubCategory}
          categorys={categorys}
          fetchGetAllCategory={fetchGetAllCategory}
        />
        <BulkUploadModal
          open={isOpenBulkUpload}
          onCancel={() => setOpenBulkUpload(false)}
          onUpload={handleUpload}
          templateUrl="/file/TemplateSubCategory.xlsx"
        />
        <DialogModal
          open={isModalOpen}
          handleOk={() => setIsModalOpen(false)}
          type={modalType}
          message={messages}
        />
      </Form>
    </div>
  );
}