import { Button, Card, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../../components/modal/Confirm";
import * as _unitOfWork from '../../../../api'

export default function CreateServiceCategory({ open, handleOk, handleCancel, spareCategories, serviceCategory }) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(serviceCategory);
  }, [serviceCategory])
  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue()
    }
    let res = await _unitOfWork.serviceCategory.update(serviceCategory.id, payload);
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
      <Form labelWrap form={form}>
        <Card title="Update Service Category">
          <Row>
            <Col span={24}>
              <Form.Item
                id="serviceCategoryName"
                name="serviceCategoryName"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "!",
                  },
                ]}
              >
                <Input placeholder="Service category name" />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
                Thoát
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() => Confirm("Xác nhận cập nhật?", () => onFinish())}
              >
                Cập nhật
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
