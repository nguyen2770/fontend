import React, { useEffect, useState } from 'react';
import { Modal, Card, Row, Col, Input, Form, Tooltip, Button, Table, Space, message, Radio } from 'antd';
import { BookOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import * as _unitOfWork from "../../../../api";
import { assetType, breakdownSpareRequestDetailStatus, breakdownSpareRequestStatus } from '../../../../utils/constant';
import { parseToLabel } from '../../../../helper/parse-helper';
import Confirm from '../../../../components/modal/Confirm';
import AssignUser from '../AssignUser';
import { useTranslation } from 'react-i18next';

const ApproveSparePartModal = ({ open, onCancel, data, onSubmit }) => {
    const breakdown = data?.breakdown;
    const [form] = Form.useForm();
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
    const [currentRejectingItem, setCurrentRejectingItem] = useState(null);
    const [breakdownSpareRequestDetails, setBreakdownSpareRequestDetails] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [assignUser, setAssignUser] = useState([]);
    const { t } = useTranslation();
    
    useEffect(() => {
        if (open && data?.id) {
            getAllBreakdownSpareRequestBySpareRequestId();
        }
        if (data.requestStatus !== breakdownSpareRequestStatus.approved && data.requestStatus !== breakdownSpareRequestStatus.submitted) {
            columns.push({
                title: "Action",
                dataIndex: "action",
                align: "center",
                fixed: "right",
                render: (_, record) => (
                    <Space>
                        {
                            showButtonRejeced(record) && <Tooltip title="Từ chối">
                                <Button icon={<CloseOutlined />} size="small" onClick={() => openCommentModal(record)} />
                            </Tooltip>
                        }
                        {
                            showButtonRecovered(record) && <>
                                <Tooltip title="Khôi phục">
                                    <Button icon={<CheckOutlined />} size="small" onClick={() => restoreRejectedItem(record)} />
                                </Tooltip>
                                <Tooltip title="Xem lý do">
                                    <Button icon={<BookOutlined />} size="small" onClick={() => showComment(record)} />
                                </Tooltip>
                            </>
                        }
                    </Space>
                )
            })
        }
    }, [open, data]);
    const columns = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: "Tên phụ tùng",
            dataIndex: "sparePart",
            key: "sparePartName",
            render: (text, record) => (
                <span>{(text.sparePartsName || "-")}</span>

            )
        },
        {
            title: "Số lượng",
            dataIndex: "qty",
            key: "qty",
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.qty}
                    min={0}
                    onChange={(e) => handleFieldChange(e.target.value, record, 'qty')}
                />
            )
        },
        {
            title: "Giá tiền",
            dataIndex: "unitCost",
            key: "unitCost",
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.unitCost}
                    min={0}
                    onChange={(e) => handleFieldChange(e.target.value, record, 'unitCost')}
                />
            )
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (_, record) => (
                <span>{(record.totalCost || 0).toLocaleString()}</span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "requestStatus",
            key: "requestStatus"
        },
    ];
    const getAllBreakdownSpareRequestBySpareRequestId = async () => {
        const res = await _unitOfWork.breakdownSpareRequest.getAllBreakdownSpareRequestBySpareRequestId({ id: data.id });
        if (res?.code === 1) {
            const withTotal = res.data?.map(item => ({
                ...item,
                totalCost: item.qty * item.unitCost,
                currentStatus: item.requestStatus
            }))
            setBreakdownSpareRequestDetails(withTotal);
        }
    };
    const handleFieldChange = (value, record, field) => {
        const updated = breakdownSpareRequestDetails.map(item => {
            if (item.id === record.id) {
                const updatedItem = {
                    ...item,
                    [field]: Number(value) || 0
                };
                updatedItem.totalCost = updatedItem.qty * updatedItem.unitCost;
                return updatedItem;
            }
            return item;
        });
        setBreakdownSpareRequestDetails(updated);

    };

    const getTotalCost = () => {
        return breakdownSpareRequestDetails.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    };

    const openCommentModal = (item) => {
        setCurrentRejectingItem(item);
        setCommentText("");
        setCommentModalVisible(true);
    };

    const handleRejectWithComment = () => {
        const newDetails = [...breakdownSpareRequestDetails];
        let idxReject = newDetails.findIndex(item => item.id === currentRejectingItem.id);
        if (idxReject > -1) {
            newDetails[idxReject].requestStatus = breakdownSpareRequestDetailStatus.rejected;
            newDetails[idxReject].comment = commentText;
        }
        setBreakdownSpareRequestDetails(newDetails);
        setCommentModalVisible(false);
        setCurrentRejectingItem(null);
    };

    const restoreRejectedItem = (item) => {
        const newDetails = [...breakdownSpareRequestDetails];
        let idxReject = newDetails.findIndex(newDetail => newDetail.id === item.id);
        if (idxReject > -1) {
            newDetails[idxReject].requestStatus = item.currentStatus;
            newDetails[idxReject].comment = commentText;
        }
        setBreakdownSpareRequestDetails(newDetails);
    };

    const showComment = (item) => {
        Modal.info({
            title: "Lý do từ chối phụ tùng",
            content: item.comment || "(Không có ghi chú)",
            okText: "Đóng"
        });
    };

    const onClickAssginUser = (value) => {
        setIsOpenAssignUser(true);
        setAssignUser(value);
    };

    // nếu sparePartRequest rỗng thì chuyển trạng thái của breakdownSpareRequest bằng reject
    const onFinishSave = async () => {
        const payload = {
            breakdownSpareRequestDetails: breakdownSpareRequestDetails
        }
        let res = await _unitOfWork.breakdownSpareRequest.approved(data.id, payload);
        if (res?.code === 1) {
            message.success(t("common.messages.success.successfully"))
            onSubmit()
        } else {
            message.error( t("common.messages.errors.failed"))
        }
    };
    const showButtonRejeced = (item) => {
        if ((item.requestStatus === breakdownSpareRequestDetailStatus.waiting_customer_confirmation || item.requestStatus === breakdownSpareRequestDetailStatus.waiting_service_agent_confirmation)
            && data.requestStatus !== breakdownSpareRequestStatus.approved && data.requestStatus !== breakdownSpareRequestStatus.submitted
        ) {
            return true;
        }
        return false;
    }
    const showButtonRecovered = (item) => {
        if (item.requestStatus === breakdownSpareRequestDetailStatus.rejected
            && data.requestStatus !== breakdownSpareRequestStatus.approved && data.requestStatus !== breakdownSpareRequestStatus.submitted
        ) {
            return true;
        }
        return false;
    }

    return (
        <>
            <Modal
                open={open}
                onCancel={onCancel}
                footer={null}
                className="custom-modal"
                width={1200}
            >
                <Form labelWrap layout="vertical" form={form}>
                    <Card title="Chi tiết yêu cầu phụ tùng">
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <Form.Item label="ID của thẻ">
                                    <Input readOnly value={breakdown?.code || "--"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Nhà sản xuất">
                                    <Input readOnly value={breakdown?.assetMaintenance?.assetModel?.manufacturer?.manufacturerName || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Danh mục">
                                    <Input readOnly value={t(parseToLabel(assetType.Options, breakdown?.assetMaintenance?.assetStyle)) || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Loại">
                                    <Input readOnly value={breakdown?.assetMaintenance?.assetModel?.asset?.assetName || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Tên tài sản">
                                    <Input readOnly value={breakdown?.assetMaintenance?.assetModel?.asset?.assetName || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Số hiệu mẫu">
                                    <Input readOnly value={breakdown?.assetMaintenance?.assetModel?.assetModelName || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Số sê-ri">
                                    <Input readOnly value={breakdown?.assetMaintenance?.serial || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Tên của KTV dịch vụ">
                                    <Input readOnly value={breakdown?.createdBy?.fullName || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Chi phí ước tính">
                                    <Input readOnly value={data?.unitCost?.toLocaleString() || "0"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Ngày yêu cầu">
                                    <Input readOnly value={new Date(breakdown?.createdAt).toLocaleString() || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Trạng thái">
                                    <Input readOnly value={data?.requestStatus === "waiting_customer_confirmation" ? "Đang chờ sự công nhận của " : data?.requestStatus || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Tên người dùng tài sản">
                                    <Input readOnly value={breakdown?.assetMaintenance?.customer?.customerName || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Tên vị trí">
                                    <Input readOnly value={breakdown?.assetMaintenance?.location?.locationName || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Tòa nhà">
                                    <Input readOnly value={breakdown?.assetMaintenance?.location?.building || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Tầng">
                                    <Input readOnly value={breakdown?.assetMaintenance?.location?.floor || "-"} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Phòng ban">
                                    <Input readOnly value={breakdown?.assetMaintenance?.location?.department || "-"} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Table
                            rowKey="id"
                            columns={columns}
                            dataSource={[...breakdownSpareRequestDetails]}
                            bordered
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />


                        <Row justify="end" style={{ marginTop: 16 }}>
                            <Col>
                                <strong>Tổng tiền:</strong>{" "}
                                <span style={{ fontSize: 16, color: "#1890ff" }}>
                                    {getTotalCost().toLocaleString()} VNĐ
                                </span>
                            </Col>
                        </Row>

                        {data.requestStatus === "approved" && (
                            <>
                                <strong>Gửi qua</strong>
                                <Form.Item
                                    name="sendType"
                                    rules={[{ required: true, message: 'Vui lòng chọn hình thức gửi' }]}
                                >
                                    <Radio.Group
                                        onChange={(e) => {
                                            if (e.target.value === 'technician') {
                                                onClickAssginUser(data.breakdown);
                                            }
                                        }}
                                    >
                                        <Radio value="technician">Kỹ thuật viên dịch vụ</Radio>
                                        <Radio value="postman">Bưu tá</Radio>
                                    </Radio.Group>
                                </Form.Item>


                                <Col span={24}>
                                    <Form.Item
                                        label="Ghi chú"
                                        name="comment"
                                        rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </>
                        )}


                        <Row justify="end" style={{ marginTop: 24 }}>
                            <Space>
                                <Button onClick={onCancel}>Hủy</Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        form
                                            .validateFields()
                                            .then(() => {
                                                Confirm("Bạn có chắc chắn muốn lưu các thay đổi?", () => onFinishSave());
                                            })
                                            .catch((errorInfo) => {
                                                console.log("Validation Failed:", errorInfo);
                                            });
                                    }}
                                >
                                    Lưu
                                </Button>
                            </Space>
                        </Row>


                    </Card>
                </Form>
            </Modal>

            {/* Modal nhập comment */}
            < Modal
                title="Nhập lý do từ chối"
                open={commentModalVisible}
                onOk={handleRejectWithComment}
                onCancel={() => setCommentModalVisible(false)}
                okText="Xác nhận từ chối"
                cancelText="Hủy"
            >
                <Input.TextArea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                />
            </ Modal>

            <AssignUser
                open={isOpenAssignUser}
                hanldeColse={() => setIsOpenAssignUser(false)}
                assignUser={assignUser}
                onReset={getAllBreakdownSpareRequestBySpareRequestId}
            />

        </>
    );
};

export default ApproveSparePartModal;
