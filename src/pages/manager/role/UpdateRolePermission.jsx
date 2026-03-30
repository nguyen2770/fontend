import { Button, Card, Checkbox, Col, message, Row, Tree } from "antd";
import React, { useEffect, useState } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import useHeader from "../../../contexts/headerContext";
import { FormOutlined, LeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function UpdateRolePermission() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [role, setRole] = useState(null);
  const [functions, setFunctions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const params = useParams();

  useEffect(() => {
    setHeaderTitle(t("roles.permission.page_title"));
    fetchRolePermissions();
  }, []);

  const fetchRolePermissions = async () => {
    let res = await _unitOfWork.role.getRolePermissions(params.id);
    if (res && res.code === 1) {
      let _permissions = [];
      res.functions.forEach((_fun) => {
        _permissions = [..._permissions, ..._fun.children];
      });
      setPermissions(_permissions);
      setRole(res.role);
      setFunctions(res.functions);
      let _selectedKeys = res.rolePermissions.map((_u) => _u.permission);
      setSelectedPermissions([..._selectedKeys]);
    }
  };

  const onFinish = async () => {
    const realPermissions = selectedPermissions.filter(
      (key) => permissions.findIndex((p) => p.key === key) > -1
    );
    let res = await _unitOfWork.role.updateRolePermissions(params.id, {
      permissions: realPermissions,
    });
    if (res && res.code === 1) {
      message.success(t("roles.permission.messages.success"));
      fetchRolePermissions();
    } else {
      message.error(t("roles.permission.messages.error"));
    }
  };

  return (
    <Card>
      <Row>
        <Col span={4}>{t("roles.permission.group_name")}</Col>
        <Col span={10}>
          <b>{role?.name}</b>
        </Col>
        <Col span={3} className="text-right mr-2">
          <Button
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          >
            {t("roles.permission.buttons.back")}
          </Button>
        </Col>
        <Col span={6}>
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() =>
              Confirm(t("roles.permission.confirm.update_permissions"), () =>
                onFinish()
              )
            }
          >
            {t("roles.permission.buttons.update")}
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Col span={4}>{t("roles.permission.permissions_list")}</Col>
        <Col span={2}>
          <Checkbox
            checked={selectedPermissions.length === permissions.length && permissions.length > 0}
            indeterminate={
              selectedPermissions.length > 0 &&
              selectedPermissions.length < permissions.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPermissions(permissions.map((p) => p.key));
              } else {
                setSelectedPermissions([]);
              }
            }}
          >
            {t("roles.permission.select_all")}
          </Checkbox>
        </Col>
        <Col span={18}>
          <Tree
            checkable
            onCheck={(keys) => setSelectedPermissions(keys)}
            treeData={functions}
            autoExpandParent={true}
            checkedKeys={selectedPermissions}
          />
        </Col>
      </Row>
    </Card>
  );
}