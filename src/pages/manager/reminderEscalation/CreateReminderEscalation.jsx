import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Radio, Row, Select } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateReminderEscalation() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async () => {
    form.resetFields();
  };
  return (
    <div className="content-manager">
      <Form
labelWrap
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={() => onFinish()}
      >
        <Card
          title="Thêm mới dịch vụ"
          extra={
            <>
              <Button
                style={{ marginRight: "10px" }}
                onClick={() => navigate(-1)}
              >
                <ArrowLeftOutlined />
                Quay lại
              </Button>
              <Button className="" type="primary" htmlType="submit">
                <PlusCircleOutlined />
                Thêm mới
              </Button>
            </>
          }
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                id=""
                label="Group Name"
                name=""
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thông tin "
                  },
                ]}
              >
                <Input placeholder="Group name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id=""
                labelAlign="left"
                label=" Type"
                name="agencyId"
                rules={[
                  {
                    required: true,
                    message: "Type không được để trống!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Chọn Type"
                  //   showSearch
                  //   options={(agencys || []).map((item, key) => ({
                  //     key: key,
                  //     value: item.id,
                  //     label: item.name,
                  //   }))}
                  //   filterOption={filterOption}
                  //   dropdownStyle={dropdownRender}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}
