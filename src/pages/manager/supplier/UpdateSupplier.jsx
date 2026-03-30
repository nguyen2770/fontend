import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import { useEffect } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
export default function UpdateSupplier({ open, handleOk, handleCancel,  id, onRefresh }) {
  const [form] = Form.useForm();

useEffect(() => {
    if (open && id) {
      fetchGetSupplierById();
    }
  }, [open, id]);

  const fetchGetSupplierById = async () => {
    const res = await _unitOfWork.supplier.getSupplierById({
      id: id,
    });
    if (res) {
      form.setFieldsValue({ ...res });
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.supplier.updateSupplier({
         Supplier: {
           id: id,
           ...form.getFieldsValue(),
         },
       });
       if (res && res.code === 1) {
         onRefresh();
         handleCancel();
         form.resetFields();
       }
  };
  const onCancel = () => {
    handleCancel();
    form.resetFields();
  }
  return (
    <Modal
      open={open}
      onOk={handleOk}
      closable={false}
       className="custom-modal"
      footer={false}
    >
      <Form labelWrap form={form} onFinish={onFinish}>
        <Card title="Cập nhập nhà cung cấp">
          <Row>
            <Col span={24}>
              <Form.Item
                id=""
                name="supplierName"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nhà cung cấp!",
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
              <Button
                key="button"
                type="primary"
                htmlType="submit"
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
