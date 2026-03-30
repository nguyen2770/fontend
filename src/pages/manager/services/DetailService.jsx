import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Radio, Row, Select } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DetailService() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [value, setValue] = useState("High");

  const onChange = (e) => {
    setValue(e.target.value);
  };
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
          title={t("service.detail.title")}
          extra={
            <>
              <Button
                style={{ marginRight: "10px" }}
                onClick={() => navigate(-1)}
              >
                <ArrowLeftOutlined />
                {t("service.common.buttons.back")}
              </Button>
              <Button className="" type="primary" htmlType="submit">
                <PlusCircleOutlined />
                {t("service.common.buttons.create")}
              </Button>
            </>
          }
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                id=""
                label="Service Name"
                name=""
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("service.common.messages.name_required"),
                  },
                ]}
              >
                <Input placeholder={t("service.common.placeholders.service_name")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id=""
                labelAlign="left"
                label="Service Type"
                name="agencyId"
                rules={[
                  {
                    required: true,
                    message: t("service.common.messages.type_required"),
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder={t("service.common.placeholders.service_type")}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Radio.Group onChange={onChange} value={value}>
                <Radio value="High">{t("service.detail.radio.high")}</Radio>
                <Radio value="Medium">{t("service.detail.radio.medium")}</Radio>
                <Radio value="Low">{t("service.detail.radio.low")}</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}