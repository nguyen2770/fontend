import { Button, Card, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import React, { useState } from "react";
import * as _unitOfWork from "../../../../api";
import ChangeAssetModelModal from "../../../../components/modal/assetModel/ChangeAssetModelModal";
export default function CreateAssetType({
  open,
  handleOk,
  handleCancel,
  onRefresh,
}) {
  const [form] = Form.useForm();
  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const formatedValues = {
      ...values,
    };
    const response = await _unitOfWork.assetTypeCategory.createAssetTypeCategory(
      formatedValues
    );
    if (response && response.code === 1) {
      handleCancel();
      form.resetFields();
      onRefresh();
    }
  };
  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"40%"}
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card title="Thêm mới loại thiết bị">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                id="name"
                name="name"
                label="Tên loại thiết bị"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại thiết bị!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên loại thiết bị" />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={onCancel}>
                Thoát
              </Button>
              <Button key="button" type="primary" htmlType="submit">
                Thêm mới
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
