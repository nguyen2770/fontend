import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";


export default function CreateUserGroup({ open, handleOk, handleCancel, onRefresh }) {
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.getFieldValue();
    const res = await _unitOfWork.group.createGroup(values);

    if (res && res.code === 1) {
      
      onRefresh()
      handleCancel();
      form.resetFields();
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
        <Card title="Thêm mới thanh toán">
          <Row>
            <Col span={24}>
              <Form.Item
                id=""
                name="groupName"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nhóm người dùng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên nhóm người dùng" />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
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
