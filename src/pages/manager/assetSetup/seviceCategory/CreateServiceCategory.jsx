import { Button, Card, Checkbox, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import Confirm from "../../../../components/modal/Confirm";

import * as _unitOfWork from "../../../../api";
export default function CreateServiceCategory({ open, handleOk, handleCancel }) {
  const [form] = Form.useForm();

  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue()
    }
    let res = await _unitOfWork.serviceCategory.createServiceCategory(payload);
    if (res) {
      form.resetFields();
      handleOk();
    }
  };
  return (
    <Modal
      open={open}
      onOk={handleOk}
      closable={false}
      className="custom-modal"
      footer={false}
    >
      <Form labelWrap form={form} onFinish={() => onFinish()}>
        <Card title="Create ServiceCategory">
          <Row>
            <Col span={24}>
              <Form.Item
                id=""
                name="serviceCategoryName"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập  Service Category Name!",
                  },
                ]}
              >
                <Input placeholder="Service Category Name" />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" className="mr-2" onClick={() => {
                form.resetFields();
                handleCancel();
              }}>
                Thoát
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() => Confirm("Xác nhận thêm mới?", () => onFinish())}
              >
                Thêm mới
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
