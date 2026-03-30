import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  RedoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import CreateBranch from "./CreateBranch";
import UpdateBranch from "./UpdateBranch";
import Confirm from "../../../components/modal/Confirm";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import DialogModal from "../../../components/modal/result/DialogNotification";

export default function Branch() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [branches, setBranches] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [branchId, setBranchId] = useState();
  const [totalRecord, setTotalRecord] = useState(0);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  // useEffect(() => {
  //   setHeaderTitle(t("branch.list.title"));
  // }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchGetListBranch();
  }, [page]);

  const fetchGetListBranch = async () => {
    let payload = {
      page: page,
      limit: pagination.limit,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.branch.getListBranches(payload);
    if (res && res.results && res.results?.results) {
      setBranches(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onSearch = () => {
    pagination.page = 1;
    fetchGetListBranch();
  };
  const resetSearch = () => {
    pagination.page = 1;
    searchForm.resetFields();
    fetchGetListBranch();
  };
  const onChangePagination = (value) => {
    setPage(value);
  };

  const onClickCreate = () => {
    setIsOpenCreate(true);
  };
  const onClickUpdate = (values) => {
    setIsOpenEdit(true);
    setBranchId(values.id);
  };
  const onClikDelete = async (values) => {
    const res = await _unitOfWork.branch.deleteBranch({
      id: values.id,
    });
    if (res && res.code === 1) {
      fetchGetListBranch();
    }
  };

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.branch.uploadBranchExcel(
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
    fetchGetListBranch();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("branch.export.index"),
      dataIndex: "key",
      width: "5%",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("branch.list.table.name"),
      dataIndex: "name",
    },
    {
      title: t("branch.table.action"),
      dataIndex: "action",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(permissions, permissionCodeConstant.branch_update) && (
            <Tooltip title={t("branch.actions.edit")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="ml-2"
                size="small"
                onClick={() => onClickUpdate(record)}
              ></Button>
            </Tooltip>
          )}
          {checkPermission(permissions, permissionCodeConstant.branch_delete) && (
            <Tooltip title={t("branch.actions.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="ml-2"
                onClick={() =>
                  Confirm(
                    t("branch.messages.confirm_delete"),
                    () => onClikDelete(record)
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
    <div className="p-3">
      <Form
labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row>
          <Col span={6}>
            <Form.Item
              label={t("branch.list.search.name_label")}
              name="name"
            >
              <Input
                placeholder={t(
                  "branch.list.search.placeholder_name"
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-1">
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
              className="button"
              onClick={() => setOpenBulkUpload(true)}
            >
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button>
            {checkPermission(
              permissions,
              permissionCodeConstant.branch_create
            ) && (
                <Button
                  className="ml-3"
                  type="primary"
                  onClick={() => onClickCreate()}
                >
                  <PlusOutlined />
                  {t("branch.form.buttons.submit_create")}
                </Button>
              )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("branch.list.total", { count: totalRecord })}</b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={branches}
          bordered
          pagination={false}
        ></Table>
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
      <CreateBranch
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        handleOk={() => setIsOpenCreate()}
        onRefresh={fetchGetListBranch}
      />
      <UpdateBranch
        open={isOpenEdit}
        handleCancel={() => setIsOpenEdit(false)}
        handleOk={() => setIsOpenEdit()}
        id={branchId}
        onRefresh={fetchGetListBranch}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateBranch.xlsx"
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