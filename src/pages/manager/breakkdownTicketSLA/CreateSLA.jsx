import React from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
  Typography,
  Button,
} from "antd";
import { EyeInvisibleOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const timeUnits = ["Minutes", "Hours", "Days"];
const { Option } = Select;
const { Title, Text } = Typography;
export default function CreateSLA() {
  const statuses = [
    "Resolve Time",
    "New",
    "Assigned",
    "Accepted",
    "Re-Assign",
    "In Progress",
    "Waiting for Customer Spare Parts Approval",
  ];

  const SLARow = ({ label, field }) => (
    <Row
      gutter={16}
      align="middle"
      style={{ marginBottom: 16}}
    >
      <Col span={7}>
        <Text strong>{label}</Text>
      </Col>
      <Col span={7}>
        <Form.Item name={[field, "duration"]} style={{ margin: 0 }}>
          <Input placeholder="Duration" />
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item name={[field, "unit"]} style={{ margin: 0 }}>
          <Select placeholder="Select unit">
            {timeUnits.map((unit) => (
              <Option key={unit} value={unit}>
                {unit}
              </Option>
            ))}
          </Select>
        </Form.Item> 
      </Col>
      <Col span={3}>
        <Form.Item
          name={[field, "enabled"]}
          valuePropName="checked"
          initialValue={true}
          style={{ margin: 0 }}
        >
          <Switch
            checkedChildren={<EyeInvisibleOutlined />}
            unCheckedChildren={<EyeInvisibleOutlined />}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <div className="content-manager" style={{padding:"10px"}}>
      <div className="header-all justify-content-space-between ">
        <h4 className="title-content ">Add Breakdown Ticket SLA</h4>
        <div>
          <Button style={{ background: "#ecedf0", marginRight: "5px" }}>
            Quay lại
          </Button>
          <Button style={{ background: "#ecedf0", marginRight: "5px" }}>
            <UsergroupAddOutlined />
            Save & Next
          </Button>
        </div>
      </div>
      <div className="">
        <Form
labelWrap
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Row gutter={32}>
            <Col span={24}></Col>
            <Col span={8}>
              <Form.Item
                labelAlign="left"
                name="slaName"
                label="SLA Name"
                rules={[{ required: true, message: "Please input SLA name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={16}></Col>
            <Col span={12}>
              <div
                style={{
                  background: "#2b579a",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Title level={5} style={{ color: "white" }}>
                  Compliant (Running - But with Fault)
                </Title>
              </div>
              {statuses.map((status, idx) => (
                <SLARow
                  key={idx}
                  label={status}
                  field={["compliant", status]}
                />
              ))}
            </Col>

            {/* RIGHT COLUMN */}
            <Col span={12}>
              <div
                style={{
                  background: "#2b579a",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Title level={5} style={{ color: "white" }}>
                  Down (Stopped - Due to Fault)
                </Title>
              </div>
              {statuses.map((status, idx) => (
                <SLARow key={idx} label={status} field={["down", status]} />
              ))}
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
