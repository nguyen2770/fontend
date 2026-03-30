import React, { useEffect, useRef, useState } from "react";
import {
  ClusterOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  RedoOutlined,
  SearchOutlined,
  SyncOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import CreateUser from "./CreateUser";
import * as _unitOfWork from "../../../api";
import { PAGINATION } from "../../../utils/constant";
import Confirm from "../../../components/modal/Confirm";
import UpdateUser from "./UpdateUser";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import useHeader from "../../../contexts/headerContext";
import { parseDateHH } from "../../../helper/date-helper";
import MappingBranchModal from "./MappingBranchModal";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import { staticPath } from "../../../router/routerConfig";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import DialogModal from "../../../components/modal/result/DialogNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../components/modal/result/successNotification";

export default function UserGroup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const { setHeaderTitle } = useHeader();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [User, setUser] = useState([]);
  const [UserId, setUserId] = useState([]);
  const [userUpdate, setUserUpdate] = useState(null);
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");
  const [roles, setRoles] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { permissions, user } = useAuth();
  const [searchParams, setSearchParams] = useState({
    fullName: null,
    contactNo: null,
    email: null,
    role: null,
    branch: null,
    department: null,
  });
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("users.list.title"));
    fetchAllBranchs();
    fetchRoles();
    fetchDepartments();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (page > 1) {
      fetchGetListUser(page, searchFilter);
    } else {
      fetchGetListUser(1, searchFilter);
    }
  }, [page, searchParams]); // eslint-disable-line

  const fetchRoles = async () => {
    let res = await _unitOfWork.role.getAllRoles();
    if (res && res.code === 1) {
      setRoles(res.data);
    }
  };
  const fetchDepartments = async () => {
    let res = await _unitOfWork.department.getAllDepartment();
    if (res && res.code === 1) {
      setDepartments(res.data);
    }
  };
  const fetchAllBranchs = async () => {
    let res = await _unitOfWork.branch.getAllBranch();
    if (res && res.code === 1) {
      setBranchs(res.data);
    }
  };
  const fetchGetListUser = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      // ...searchParams,
      // ...searchForm.getFieldsValue(),
      ...filterValue,
      [searchField]: searchValue,
    };
    const res = await _unitOfWork.user.getListUser(payload);
    if (res && res.results) {
      setUser(res.results);
      setTotalRecord(res.totalResults);
    }
  };
  const onClickUpdate = (values) => {
    setUserId(values.id);
    setIsOpenUpdate(true);
  };
  const onResetPassword = async (value) => {
    let res = await _unitOfWork.auth.changeResetPassword({
      password: "123456",
      username: value?.username,
    });
    if (res && res.code === 1) {
      message.success(t("users.list.messages.reset_password_success"));
    } else {
      message.error(t("users.list.messages.reset_password_error"));
    }
  };
  const onDeleteUser = async (userId) => {
    try {
      const res = await _unitOfWork.user.deleteUser({
        userId,
      });
      if (res && res.code === 1) {
        fetchGetListUser();
        setSelectedIds((prevSelectedIds) =>
          prevSelectedIds.filter((selectedId) => selectedId !== userId),
        );
        message.success(t("users.list.messages.delete_success"));
      } else {
        message.error(t("users.list.messages.delete_error"));
      }
    } catch {
      message.error(t("users.list.messages.delete_error"));
    }
  };
  const onClickMappingBranch = (_user) => {
    setShowUpdateBranch(true);
    setUserUpdate(_user);
  };
  const onCloseMappingBranch = () => {
    setShowUpdateBranch(false);
    setUserUpdate(null);
    fetchGetListUser();
  };
  const [showUpdateBranch, setShowUpdateBranch] = useState(false);

  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.user.uploadUserExcel(formData);
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
    fetchGetListUser(1);
    fetchAllBranchs();
    fetchRoles();
    fetchDepartments();
    setOpenBulkUpload(false);
  };
  const columns = [
    {
      title: t("users.list.columns.index"),
      dataIndex: "key",
      width: 70,
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("users.list.columns.fullName"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("users.list.columns.phone"),
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: t("users.list.columns.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("users.list.columns.role"),
      dataIndex: ["role", "name"],
      key: "roleName",
      render: (_, record) => record.role?.name,
    },
    {
      title: t("users.list.columns.branch"),
      dataIndex: "branch",
      key: "branch",
      render: (text) => <span>{text?.name || "--"}</span>,
    },
    {
      title: t("users.list.columns.department"),
      dataIndex: "department",
      key: "department",
      render: (text) => <span>{text?.departmentName || "--"}</span>,
    },
    {
      title: t("users.list.columns.username"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t("users.list.columns.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      width: 170,
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(permissions, permissionCodeConstant.update_user) && (
            <Tooltip title={t("users.list.tooltips.edit")}>
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
            permissionCodeConstant.mapping_user_branch,
          ) && (
            <Tooltip title={t("users.list.tooltips.mapping_branch")}>
              <Button
                className="bt-green"
                danger
                icon={<ClusterOutlined />}
                size="small"
                onClick={() => {
                  onClickMappingBranch(record);
                }}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.mapping_user_asset,
          ) && (
            <Tooltip
              title={t("users.list.tooltips.mapping_asset")}
              onClick={() => {
                navigate(staticPath.UserMappingAsset + "/" + record.id);
              }}
            >
              <ClusterOutlined className="icon-table" />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.reset_password,
          ) && (
            <Tooltip title={t("users.list.tooltips.reset_password")}>
              <SyncOutlined
                className="icon-table"
                onClick={() => {
                  Confirm(t("users.list.confirm.reset_password"), () =>
                    onResetPassword(record),
                  );
                }}
              />
            </Tooltip>
          )}
          {checkPermission(permissions, permissionCodeConstant.delete_user) && (
            <Tooltip title={t("users.list.tooltips.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => {
                  Confirm(t("users.list.confirm.delete_one"), () =>
                    onDeleteUser(record.id),
                  );
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const onChangePagination = (value) => {
    setPage(value);
  };

  const handleReset = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setSearchParams({
      fullName: null,
      contactNo: null,
      email: null,
      role: null,
      branch: null,
      department: null,
    });
    setPage(1);
    fetchGetListUser(1);
  };

  const onSearch = () => {
    setSearchParams({ ...searchForm.getFieldsValue() });
    setPage(1);
    fetchGetListUser(1, searchFilter);
  };

  const userFieldsConfig = [
    {
      name: "fullName",
      labelKey: "users.list.search.fullName",
      placeholderKey: "users.list.search.fullName_placeholder",
      component: "Input",
    },
    {
      name: "contactNo",
      labelKey: "users.list.search.phone",
      placeholderKey: "users.list.search.phone_placeholder",
      component: "Input",
    },
    {
      name: "email",
      labelKey: "users.list.search.email",
      placeholderKey: "users.list.search.email_placeholder",
      component: "Input",
    },
    {
      name: "role",
      labelKey: "users.list.search.role",
      placeholderKey: "users.list.search.role_placeholder",
      component: "Select",
      options: roles.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    },
    {
      name: "branch",
      labelKey: "users.list.search.branch",
      placeholderKey: "users.list.search.branch_placeholder",
      component: "Select",
      options: branchs.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    },
    {
      name: "department",
      labelKey: "users.list.search.department",
      placeholderKey: "users.list.search.department_placeholder",
      component: "Select",
      options: departments.map((item) => ({
        value: item.id,
        label: item.departmentName,
      })),
    },
  ];

  const placeholderMap = {
    searchText: t("preventive.common.all"),
    fullName: t("users.list.search.fullName"),
    contactNo: t("users.list.search.phone"),
    email: t("users.list.search.email"),
    // role: t("users.list.search.role"),
    // branch: t("users.list.search.branch"),
    // department: t("users.list.search.department"),
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
        <Row>
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
                      value: "fullName",
                      label: t("users.list.search.fullName"),
                    },
                    { value: "contactNo", label: t("users.list.search.phone") },
                    { value: "email", label: t("users.list.search.email") },
                    // { value: "role", label: t("users.list.search.role") },
                    // { value: "branch", label: t("users.list.search.branch") },
                    // { value: "department", label: t("users.list.search.department") },
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
            span={8}
            style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
          >
            <Button type="primary" className="mx-2" htmlType="submit">
              <SearchOutlined />
              {t("users.list.buttons.search")}
            </Button>
            <Button onClick={handleReset} className="bt-green mr-2">
              <RedoOutlined />
              {t("users.list.buttons.reset")}
            </Button>
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsOpenSearchAdvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>

          <Col style={{ textAlign: "right", marginTop: 8 }} span={8}>
            {/* <Button
              className="button mr-2"
              onClick={() => setOpenBulkUpload(true)}
            >
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button> */}
            {checkPermission(
              permissions,
              permissionCodeConstant.create_user,
            ) && (
              <Button
                className="bt-green"
                onClick={() => setIsOpenCreate(true)}
              >
                <UserAddOutlined />
                {t("users.list.buttons.add")}
              </Button>
            )}
          </Col>
          <Col
            style={{ fontSize: 16, textAlign: "right" }}
            span={24}
            className="mt-1"
          >
            <b>{t("users.list.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>
      </Form>
      <Table
        key={"id"}
        rowKey="id"
        columns={columns}
        dataSource={User}
        className="custom-table"
        bordered
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <CreateUser
        open={isOpenCreate}
        onCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchGetListUser}
        roles={roles}
        branchs={branchs}
        departments={departments}
        fetchRoles={fetchRoles}
        fetchAllBranchs={fetchAllBranchs}
        fetchDepartments={fetchDepartments}
      />
      <UpdateUser
        open={isOpenUpdate}
        onCancel={() => setIsOpenUpdate(false)}
        onRefresh={fetchGetListUser}
        id={UserId}
        roles={roles}
        branchs={branchs}
        departments={departments}
        fetchRoles={fetchRoles}
        fetchAllBranchs={fetchAllBranchs}
        fetchDepartments={fetchDepartments}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/templateUser.xlsx"
      />
      <DialogModal
        open={isModalOpen}
        handleOk={() => setIsModalOpen(false)}
        type={modalType}
        message={messages}
      />
      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={pagination.limit}
        total={totalRecord}
        current={page}
      />
      <MappingBranchModal
        open={showUpdateBranch}
        user={userUpdate}
        onClose={onCloseMappingBranch}
        branchs={branchs}
      />
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetListUser(1, value);
          }
        }}
        onClose={() => {
          setIsOpenSearchAdvanced(false);
        }}
        fieldsConfig={userFieldsConfig}
      />
    </div>
  );
}
