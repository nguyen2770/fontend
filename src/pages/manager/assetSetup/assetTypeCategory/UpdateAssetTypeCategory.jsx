import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../../api";
export default function UpdateAsset({
  open,
  handleOk,
  handleCancel,
  id,
  onRefresh,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && id) {
      fetchGetAssetById();
    }
  }, [open, id]);

  const fetchGetAssetById = async () => {
    const res = await _unitOfWork.assetTypeCategory.getAssetTypeCategoryById({
      id: id,
    });
    if (res && res.code === 1) {
      form.setFieldsValue(res.data);
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.assetTypeCategory.updateAssetTypeCategory({
      data: {
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
        <Card title="Cập nhật loại thiết bị">
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                id="name"
                name="name"
                label="Tên loại thiết bị"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại thiết bị!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên  loại thiết bị" />
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
