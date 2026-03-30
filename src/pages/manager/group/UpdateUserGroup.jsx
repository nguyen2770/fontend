import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";


export default function UpdateUserGroup({ open, handleOk, handleCancel, id, onRefresh }) {
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


  const onFinish = async () => {

    const res = await _unitOfWork.group.updateGroup({
      group: {
        id: id,
        ...form.getFieldsValue(),
      }
    });


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
        <Card title="Cập nhật thanh toán">
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
                onClick={() => Confirm("Xác nhận cập nhật ?", () => onFinish())}
              >
                Lưu lại
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
