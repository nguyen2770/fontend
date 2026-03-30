import React, { useEffect } from "react";
import { Form, Input, DatePicker, Button, Card } from "antd";
import { MobileOutlined } from "@ant-design/icons";

export default function AssetMaintenanceReportForm() {
  const [form] = Form.useForm();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const assetId = params.get("assetId");
    if (assetId) {
      form.setFieldsValue({ assetId });
    }
  }, [form]);

  const onFinish = (values) => {
    // Xử lý gửi báo cáo ở đây
    console.log("Report submitted:", values);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 12 }}>
      <Card
        title={
          <span>
            <MobileOutlined /> Báo cáo bảo trì tài sản
          </span>
        }
        bordered={false}
        style={{ borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}
      >
        <Form
labelWrap
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "100%" }}
        >
          <Form.Item
            label="Asset ID"
            name="assetId"
            rules={[{ required: true, message: "Vui lòng nhập Asset ID" }]}
          >
            <Input placeholder="Nhập Asset ID" />
          </Form.Item>
          <Form.Item
            label="Tên tài sản"
            name="assetName"
            rules={[{ required: true, message: "Vui lòng nhập tên tài sản" }]}
          >
            <Input placeholder="Nhập tên tài sản" />
          </Form.Item>
          <Form.Item
            label="Ngày bảo trì"
            name="maintenanceDate"
            rules={[{ required: true, message: "Chọn ngày bảo trì" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày" />
          </Form.Item>
          <Form.Item
            label="Người thực hiện"
            name="performedBy"
            rules={[{ required: true, message: "Nhập người thực hiện" }]}
          >
            <Input placeholder="Nhập tên người thực hiện" />
          </Form.Item>
          <Form.Item
            label="Nội dung bảo trì"
            name="maintenanceContent"
            rules={[{ required: true, message: "Nhập nội dung bảo trì" }]}
          >
            <Input.TextArea
              placeholder="Nhập nội dung bảo trì"
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
              maxLength={500}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", borderRadius: 8 }}
            >
              Gửi báo cáo
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
