import {
  Input,
  Form,
  Modal,
  Button,
  message,
  Avatar,
  Upload,
  Card,
  Row,
  Col,
} from "antd";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { STORAGE_KEY } from "../../../utils/constant";
import useAuth from "../../../contexts/authContext";

export default function UpdateProfileModal({
  open,
  onCallback,
  onCancel,
  user,
}) {
  const { t } = useTranslation();
  const { setUser } = useAuth();
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    form.setFieldsValue({ ...user });
    setFileList([
      {
        url: _unitOfWork.resource.getImage(user?.avatar),
        supportDocumentId: user?.avatar,
        name: "avatar",
      },
    ]);
  }, [open, form, user]);

  const onFinish = async () => {
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
        id: user?.id,
      };
      if (avatar) {
        result.avatar = avatar;
      }
      const res = await _unitOfWork.user.updateUser(user?.id, result);
      if (res) {
        message.success(t("users.update.messages.success"));
        onCallback();
        form.resetFields();
        setUser(res);
        localStorage.setItem(STORAGE_KEY.USER, JSON.stringify({ ...res }));
      } else {
        message.error(res?.message || t("users.update.messages.error"));
      }
    } catch {
      message.error(t("users.update.messages.validate_error"));
    }
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
  return (
    <Modal
      centered
      open={open}
      onCancel={onCancel}
      closable={false}
      width={"30%"}
      className="custom-modal"
      footer={false}
    >
      <Card title={t("users.profile.update_title")}>
        <Form
labelWrap
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item label={t("users.profile.avatar")} labelAlign="left">
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
                      {t("users.profile.upload_avatar")}
                    </Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item
              label={t("users.profile.username")}
              name="username"
              rules={[
                {
                  required: true,
                  message: t("users.profile.userName_required"),
                },
              ]}
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t("users.profile.full_name")}
              name="fullName"
              rules={[
                {
                  required: true,
                  message: t("users.profile.full_name_required"),
                },
              ]}
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t("users.profile.email")}
              name="email"
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t("users.profile.phoneNumber")}
              name="contactNo"
              labelAlign="left"
            >
              <Input />
            </Form.Item>
          </Col>
        </Form>
        <Col span={24} style={{ textAlign: "end" }}>
          <Button key="back" onClick={onCancel}>
            {t("common_buttons.cancel")}
          </Button>
          <Button
            key="button"
            type="primary"
            onClick={() => form.submit()}
            className="ml-2"
          >
            {t("common_buttons.save")}
          </Button>
        </Col>
      </Card>
    </Modal>
  );
}
