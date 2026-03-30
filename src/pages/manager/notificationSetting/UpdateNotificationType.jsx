import { Button, Card, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import { advanceNoticeType } from "../../../utils/constant";
import {
  dropdownRender,
  filterOption,
} from "../../../helper/search-select-helper";

export default function UpdateNotificationType({
  open,
  handleOk,
  handleCancel,
  onRefresh,
  notificationType,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [taskItems, setTaskItems] = useState([
    { key: 1, name: "", value: "", content: "" },
  ]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      fetchGetAllUser();
      form.setFieldsValue({
        advanceNoticeDays: notificationType?.advanceNoticeDays || 0,
        users: notificationType?.users?.map((user) => user) || [],
        numberOfNotification: notificationType?.numberOfNotification || 1,
      });
    }
  }, [open]);
  const fetchGetAllUser = async () => {
    let res = await _unitOfWork.user.getAllUser();
    if (res && res.code === 1) {
      setUsers(res?.data);
    }
  };
  const onCancel = () => {
    handleCancel();
    form.resetFields();
    setTaskItems([]);
  };

  const onFinish = async () => {
    const res = await _unitOfWork.notification.updateNotificationType({
      id: notificationType?.id,
      ...form.getFieldsValue(),
    });
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
      ShowSuccess(
        "topRight",
        t("asset.notifications.title"),
        t("asset.notifications.update_success")
      );
    } else {
      ShowError(
        "topRight",
        t("asset.notifications.title"),
        t("asset.notifications.update_error")
      );
    }
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"40%"}
      destroyOnClose
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card title={t("Cập nhật thông tin loại thông báo")}>
          <Row gutter={32}>
            {notificationType?.isPriorNoticeRequired === true && (
              <Col span={24}>
                <Form.Item
                  name="advanceNoticeDays"
                  label={t("Thông báo trước (ngày)")}
                  labelAlign="left"
                >
                  <Input placeholder={t("Nhập thông báo trước ngày")} />
                </Form.Item>
              </Col>
            )}
            {notificationType?.isNumberOfNotification === true && (
              <Col span={24}>
                <Form.Item
                  name="numberOfNotification"
                  label={t("Số lần thông báo")}
                  labelAlign="left"
                >
                  <Input placeholder={t("Nhập số lần thông báo")} />
                </Form.Item>
              </Col>
            )}
            {notificationType?.isNotifyTheManager === true && (
              <Col span={24}>
                <Form.Item
                  name="users"
                  label={t("Người nhận thông báo")}
                  labelAlign="left"
                >
                  <Select
                    allowClear
                    placeholder={t("Chọn người nhận thông báo")}
                    showSearch
                    options={users?.map((item) => ({
                      value: item.id,
                      label: item.fullName,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>
            )}

            <div className="modal-footer">
              <Button onClick={onCancel}>
                <CloseCircleOutlined />
                {t("asset.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined />
                {t("asset.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
