import React from "react";
import { Card, Row, Col, Avatar, Switch, Tooltip } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleTwoTone,
  EditOutlined,
  TeamOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  ContactsOutlined,
  HistoryOutlined,
  DeleteOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const CustomerListItem = ({
  data,
  onUpdateStatus,
  onClickUpdate,
  onDeleteCustomer,
  Confirm,
  formatDate,
}) => {
  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.3s ease",
        backgroundColor: "#fff",
      }}
      key={data.id}
    >
      <Row gutter={16} align="middle"  style={{ display: "flex", flexWrap: "nowrap" }}>
        <Col style={{ flexShrink: 0 }}>
          <Avatar size={64} src={data.avatarUrl} />
        </Col>
        <Col flex="auto">
          <Row
            style={{ borderBottom: "1px solid #ccc", marginBottom: "2px" }}
            align="middle"
          >
            <Col flex="auto">
              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.customerName}
              </div>
              <div>{`${data.firstName} ${data.lastName} `}</div>
              <div>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {formatDate(data.createdAt)}
              </div>
            </Col>

            <Col style={{ marginRight: 36 }}>
              <Switch
                checked={data.status}
                checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                unCheckedChildren="x"
                onChange={(checked) => {
                  Confirm("xác nhận thay đổi trạng thái?", () =>
                    onUpdateStatus(data.id, checked)
                  );
                }}
              />
            </Col>

            <Col style={{ marginLeft: "auto" }}>
              <Tooltip title="Sửa">
                <EditOutlined
                  style={{ fontSize: 18, marginRight: 12 }}
                  onClick={() => onClickUpdate(data.id)}
                />
              </Tooltip>
              <Tooltip title="Người dùng">
                <TeamOutlined style={{ fontSize: 18, marginRight: 12 }} />
              </Tooltip>
              <Tooltip title="Sơ đồ">
                <ApartmentOutlined style={{ fontSize: 18, marginRight: 12 }} />
              </Tooltip>
              <Tooltip title="Vị trí">
                <EnvironmentOutlined style={{ fontSize: 18, marginRight: 12 }} />
              </Tooltip>
              <Tooltip title="Liên hệ">
                <ContactsOutlined style={{ fontSize: 18, marginRight: 12 }} />
              </Tooltip>
              <Tooltip title="Lịch sử">
                <HistoryOutlined style={{ fontSize: 18, marginRight: 12 }} />
              </Tooltip>
              <Tooltip title="Xóa">
                <DeleteOutlined
                  style={{ fontSize: 18 }}
                  onClick={() => {
                    Confirm("Xác nhận xóa ?", () =>
                      onDeleteCustomer(data.id)
                    );
                  }}
                />
              </Tooltip>
              <Tooltip title="...">
                <DashboardOutlined
                  style={{ fontSize: 18, marginLeft: 24 }}
                />
              </Tooltip>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 8 }}>
            <Col style={{ maxWidth: "20%" }}>
              <div>Số điện thoại</div>
              <div
                style={{
                  fontWeight: 500,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {data.contactNumber}
              </div>
            </Col>
            <Col
              style={{
                borderLeft: "1px solid #ccc",
                paddingLeft: 16,
                maxWidth: "20%",
              }}
            >
              <div>Email</div>
              <div
                style={{
                  fontWeight: 500,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {data.contactEmail}
              </div>
            </Col>
            {(data.addressOne || data.addressTwo) && (
              <Col
                style={{
                  borderLeft: "1px solid #ccc",
                  paddingLeft: 16,
                  maxWidth: "60%",
                }}
              >
                <div>Địa chỉ</div>
                <div
                  style={{
                    fontWeight: 500,
                    
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.addressOne || data.addressTwo}
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CustomerListItem;
