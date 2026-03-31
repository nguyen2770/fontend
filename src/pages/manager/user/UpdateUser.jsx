import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  message,
  Card,
  Button,
  Avatar,
  Upload,
  Space,
} from "antd";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import { PlusOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { filterOption } from "../../../helper/search-select-helper";
import { notiAction } from "../../../helper/noti-action-helper";

export default function UpdateUser({
  open,
  onCancel,
  onRefresh,
  id,
  branchs,
  roles,
  departments,
  fetchRoles,
  fetchAllBranchs,
  fetchDepartments,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [roleInput, setRoleInput] = useState("");
  const [branchInput, setBranchInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");

  useEffect(() => {
    if (id && open) {
      fetchUserDetails(id);
    }
  }, [id, open]);

  const fetchUserDetails = async (userId) => {
    try {
      const res = await _unitOfWork.user.getUserById({ userId });
      if (res) {
        form.setFieldsValue({
          ...res.User,
        });
      }
      if (res?.User?.avatar) {
        setFileList([
          {
            uid: res?.User?.avatar,
            url: _unitOfWork.resource.getImage(res?.User?.avatar),
            supportDocumentId: res?.User?.avatar,
            name: "avatar",
          },
        ]);
      }
    } catch (error) {
      message.error(t("users.update.messages.load_error"));
    }
  };

  const handleConfirm = async () => {
    try {
      let avatar = null;
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          const resUpload = await _unitOfWork.resource.uploadImage({
            file: fileList[0]?.originFileObj,
          });
          if (resUpload && resUpload.code === 1) {
            avatar = resUpload?.resourceId;
          }
        } else {
          avatar = fileList[0].supportDocumentId;
        }
      }
      const values = await form.validateFields();
      const result = {
        ...values,
        id,
      };
      if (avatar) {
        result.avatar = avatar;
      }
      const res = await _unitOfWork.user.updateUser(id, result);
      if (res) {
        message.success(t("users.update.messages.success"));
        onRefresh();
        form.resetFields();
        onCancel();
      } else {
        message.error(res?.message || t("users.update.messages.error"));
      }
    } catch {
      message.error(t("users.update.messages.validate_error"));
    }
  };
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
  const handleChangeUpload = async (info) => {
    let newFileList = info.fileList.slice(-1);
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(newFileList[0].originFileObj);
      reader.onload = () => setAvatarUrl(reader.result);
    } else {
      setAvatarUrl(null);
    }
  };

  const addRole = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.role.createRole({
      name: name,
    });
    notiAction(t, response);
    if (response) {
      fetchRoles();
      setRoleInput("");
    }
  };

  const addBranch = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.branch.createBranch({
      name: name,
    });
    notiAction(t, response);
    if (response) {
      fetchAllBranchs();
      setBranchInput("");
    }
  };

  const addDepartment = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.department.createDepartment({
      departmentName: name,
    });
    notiAction(t, response);
    if (response) {
      fetchDepartments();
      setDepartmentInput("");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      className="custom-modal"
      closable={false}
      footer={null}
      width={1200}
    >
      <Form labelWrap form={form} layout="vertical" onFinish={handleConfirm}>
        <Card title={t("users.update.title")}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="fullName"
                label={t("users.create.fields.fullName")}
                rules={[
                  {
                    required: true,
                    message: t("users.create.validation.fullName_required"),
                  },
                ]}
              >
                <Input placeholder={t("users.create.placeholders.fullName")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="email" label={t("users.create.fields.email")}>
                <Input placeholder={t("users.create.placeholders.email")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contactNo"
                label={t("users.create.fields.contactNo")}
                rules={[
                  {
                    required: true,
                    message: t("users.create.validation.contactNo_required"),
                  },
                ]}
              >
                <Input placeholder={t("users.create.placeholders.contactNo")} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="role"
                label={t("users.create.fields.role")}
                rules={[
                  {
                    required: true,
                    message: t("users.create.validation.role_required"),
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("users.create.placeholders.role")}
                  options={roles.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  filterOption={filterOption}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ padding: 8 }}>
                        <Space>
                          <Input
                            maxLength={250}
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            placeholder={t("assetModel.model.fields.add_new")}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!roleInput.trim()}
                            onClick={() => addRole(roleInput)}
                          />
                          <div>{`${roleInput.length}/250`}</div>
                        </Space>
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="department"
                label={t("users.create.fields.department")}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("users.create.placeholders.department")}
                  options={departments.map((item) => ({
                    value: item.id,
                    label: item.departmentName,
                  }))}
                  filterOption={filterOption}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ padding: 8 }}>
                        <Space>
                          <Input
                            maxLength={250}
                            value={departmentInput}
                            onChange={(e) => setDepartmentInput(e.target.value)}
                            placeholder={t("assetModel.model.fields.add_new")}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!departmentInput.trim()}
                            onClick={() => addDepartment(departmentInput)}
                          />
                          <div>{`${departmentInput.length}/250`}</div>
                        </Space>
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="username"
                label={t("users.create.fields.username")}
                rules={[
                  {
                    required: true,
                    message: t("users.create.validation.username_required"),
                  },
                ]}
              >
                <Input placeholder={t("users.create.placeholders.username")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="positionName" label={t("users.position")}>
                <Input placeholder={t("users.position_placeholder")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("users.create.fields.avatar")}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar
                    size={64}
                    src={
                      avatarUrl || (fileList.length > 0 && fileList[0].url)
                        ? avatarUrl || fileList[0].url
                        : undefined
                    }
                    icon={<UserOutlined />}
                    style={{ background: "#f0f0f0" }}
                  />
                  <Upload
                    accept="image/png,image/jpeg,image/jpg"
                    showUploadList={false}
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={handleChangeUpload}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>
                      {t("users.create.buttons.upload_avatar")}
                    </Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <div className="modal-footer">
              <Button onClick={handleCancel}>
                {t("users.update.buttons.cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                {t("users.update.buttons.submit")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
