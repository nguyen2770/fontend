import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../api";


export default function DetailUserGroup({ open, handleOk, handleCancel, id }) {
    const [form] = Form.useForm();
    useEffect(() => {
      if (open && id) {
        fetchGetGroupById();
      }
    }, [open, id]);
  
    const fetchGetGroupById = async () => {
      const res = await _unitOfWork.group.getGroupById({
        id: id,
      });
      if (res) {
        form.setFieldsValue({ ...res });
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

        <Card title="Chi tiết nhóm người dùng">
          <Row span={32}>
            <Col span={24}>
              <Form.Item
                id=""
                name="groupName"
                labelAlign="left"
              >
                <Input  disabled/>
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
                Thoát
              </Button>
              
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
