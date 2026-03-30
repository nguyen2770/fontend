import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import Confirm from "../../../components/modal/Confirm";

export default function CreateUserMapping({ open, handleOk, handleCancel }) {
  const [form] = Form.useForm();

  const onFinish = async () => {
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
      <Form labelWrap form={form} onFinish={() => onFinish()}>
        <Card title="Add User Mapping">
          <Row>
            
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
