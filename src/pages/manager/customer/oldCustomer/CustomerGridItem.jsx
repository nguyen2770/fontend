import React from "react";
import { Card, Col, Avatar, Switch, Tooltip } from "antd";
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
    PhoneOutlined,
    MailOutlined,
} from "@ant-design/icons";

const CustomerGridItem = ({
    data,
    onUpdateStatus,
    onClickUpdate,
    onDeleteCustomer,
    Confirm,
    formatDate,
}) => {
    return (
        <Col xs={24} sm={12} md={8} key={data.id}>
            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    position: "relative",
                    backgroundColor: "#fff",
                }}
                bodyStyle={{
                    padding: 20,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 340,
                }}
            >
                <div style={{ position: "absolute", left: 12, top: 12 }}>
                    <Switch
                        checked={data.status}
                        checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                        unCheckedChildren="x"
                        onChange={(checked) => {
                            Confirm("Xác nhận thay đổi trạng thái?", () =>
                                onUpdateStatus(data.id, checked)
                            );
                        }}
                    />
                </div>

                <Avatar size={72} src={data.avatarUrl} style={{ margin: "8px auto" }} />

                <div style={{ fontWeight: 600, fontSize: 16 }}>{data.customerName}</div>
                <div style={{ color: "#555" }}>{`${data.firstName} ${data.lastName}`}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {formatDate(data.createdAt)}
                </div>

                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                        flexWrap: "nowrap",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            width: "50%",
                            overflow: "hidden",
                        }}
                    >
                        <PhoneOutlined />
                        <span
                            style={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {data.contactNumber}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            width: "50%",
                            overflow: "hidden",
                        }}
                    >
                        <MailOutlined />
                        <span
                            style={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {data.contactEmail}
                        </span>
                    </div>
                </div>

                {(data.addressOne || data.addressTwo) && (
                    <div
                        style={{
                            marginTop: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                        }}
                    >
                        <EnvironmentOutlined />
                        <span
                            style={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2, 
                                WebkitBoxOrient: "vertical",
                                whiteSpace: "normal", 
                            }}
                        >
                            {data.addressOne || data.addressTwo}
                        </span>
                    </div>
                )}

                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 14,
                    }}
                >
                    <Tooltip title="Sửa">
                        <EditOutlined onClick={() => onClickUpdate(data.id)} />
                    </Tooltip>
                    <Tooltip title="Người dùng">
                        <TeamOutlined />
                    </Tooltip>
                    <Tooltip title="Sơ đồ">
                        <ApartmentOutlined />
                    </Tooltip>
                    <Tooltip title="Vị trí">
                        <EnvironmentOutlined />
                    </Tooltip>
                    <Tooltip title="Liên hệ">
                        <ContactsOutlined />
                    </Tooltip>
                    <Tooltip title="Lịch sử">
                        <HistoryOutlined />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <DeleteOutlined
                            onClick={() => Confirm("Xác nhận xóa ?", () => onDeleteCustomer(data.id))}
                        />
                    </Tooltip>
                    <Tooltip title="Khác">
                        <DashboardOutlined />
                    </Tooltip>
                </div>
            </Card>
        </Col>
    );
};

export default CustomerGridItem;
