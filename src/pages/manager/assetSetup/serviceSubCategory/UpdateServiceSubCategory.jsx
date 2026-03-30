import { Button, Card, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../../components/modal/Confirm";
import * as _unitOfWork from '../../../../api'

export default function CreateServiceSubCategory({ open, handleOk, handleCancel, serviceCategories, serviceSubCategory }) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(serviceSubCategory);
  }, [serviceSubCategory])
  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue()
    }
    let res = await _unitOfWork.serviceSubCategory.update(serviceSubCategory._id, payload);
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
        <Card title="Update Service Sub Category">
          <Row>
            <Col span={24}>
              <Form.Item id="" name="serviceCategory">
                <Select
                  allowClear
                  placeholder="Service category"
                  showSearch
                  options={serviceCategories.map((item) => ({
                    value: item.id,
                    label: item.serviceCategoryName,
                  }))}
                // filterOption={filterOption}
                // dropdownStyle={dropdownRender}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                id="serviceSubCategoryName"
                name="serviceSubCategoryName"
                // label="Service sub category name"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "!",
                  },
                ]}
              >
                <Input placeholder="Service sub category name" />
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
