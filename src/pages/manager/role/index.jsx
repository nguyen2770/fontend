import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import CreateRole from "./CreateRole";
import UpdateRole from "./UpdateRole";
import Confirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import { staticPath } from "../../../router/routerConfig";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";

export default function UserGroup() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { setHeaderTitle } = useHeader();
  const [roles, setRoles] = useState([]);
  const [roleUpdate, setRoleUpdate] = useState(null);
  const navigate = useNavigate();
  const { permissions } = useAuth();

  useEffect(() => {
    setHeaderTitle(t("roles.list.title"));
    fetchRoles();
  }, []); // eslint-disable-line

  const fetchRoles = async () => {
    const res = await _unitOfWork.role.getAllRoles([]);
    if (res && res.code === 1) {
      setRoles(res.data);
    }
  };

  const onClickCreate = () => setIsOpenCreate(true);
  const onClickUpdate = (values) => {
    setIsOpenEdit(true);
    setRoleUpdate(values);
  };
  const onClikDelete = async (values) => {
    const res = await _unitOfWork.role.deleteRole(values.id);
    if (res && res.code === 1) {
      fetchRoles();
    }
  };
  const onClickUpdatePermission = (_record) => {
    navigate(staticPath.updateRolePermission + _record.id);
  };

  const columns = [
    {
      title: t("roles.list.columns.index"),
      dataIndex: "key",
      width: 50,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("roles.list.columns.name"),
      dataIndex: "name",
      className: "text-left-column",
      align: "center",
    },
    {
      title: t("roles.list.columns.action"),
      dataIndex: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(permissions, permissionCodeConstant.view_update_role) && (
            <Tooltip title={t("roles.list.tooltips.view_permission_detail")}>
              <Button
                className="bt-green"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onClickUpdatePermission(record)}
              />
            </Tooltip>
          )}
          {checkPermission(permissions, permissionCodeConstant.update_role) && (
            <Tooltip title={t("roles.list.tooltips.update_role")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="ml-2"
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(permissions, permissionCodeConstant.delete_role) && (
            <Tooltip title={t("roles.list.tooltips.delete_role")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="ml-2"
                onClick={() =>
                  Confirm(t("roles.list.confirm.delete"), () => onClikDelete(record))
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
      <Row className="mb-1">
        <Col span={24} style={{ textAlign: "right" }}>
          <Tooltip title={t("roles.list.tooltips.help")} color="#616263">
            <QuestionCircleOutlined
              style={{ fontSize: "20px", cursor: "pointer" }}
            />
          </Tooltip>
          {checkPermission(permissions, permissionCodeConstant.create_role) && (
            <Button
              className="ml-3"
              type="primary"
              onClick={onClickCreate}
            >
              <UsergroupAddOutlined />
              {t("roles.list.buttons.add")}
            </Button>
          )}
        </Col>
        <Col
          span={24}
          style={{ fontSize: 16, textAlign: "right" }}
          className="mt-1"
        >
          <b>{t("roles.list.total", { count: roles.length || 0 })}</b>
        </Col>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        key={"id"}
        dataSource={roles}
        bordered
      />
      <CreateRole
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        handleOk={() => setIsOpenCreate()}
        onRefresh={fetchRoles}
      />
      <UpdateRole
        open={isOpenEdit}
        handleCancel={() => setIsOpenEdit(false)}
        handleOk={() => setIsOpenEdit()}
        role={roleUpdate}
        onRefresh={fetchRoles}
      />
    </div>
  );
}