import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import * as _unitOfWork from "../../../api";

export default function CreateSupplier({
  open,
  handleOk,
  handleCancel,
  onRefresh,
}) {
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const res = await _unitOfWork.supplier.createSupplier(values);
    if (res && res.code === 1) {
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
    >
      <Form labelWrap form={form} onFinish={onFinish}>
        <Card title="Thêm mới nhà cung cấp">
          <Row>
            <Col span={24}>
              <Form.Item
                id=""
                name="supplierName"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhà cung cấp!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên nhà cung cấp" />
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
