import { Button, Card, Descriptions, Divider, Modal, Table, Tag, Tooltip, List } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import { parseDateHH } from "../../../helper/date-helper";
import { DownloadOutlined } from "@ant-design/icons";
import AttachmentModel from "../attachmentModel/AttachmentModel";

export default function ViewDetailHistory({ isOpen, isClose, data }) {
    const { t } = useTranslation();
    const [checkInCheckOut, setCheckInCheckOut] = useState([]);
    const [attachment, setAttachment] = useState([]);

    useEffect(() => {
        if (isOpen) fetchData();
    }, [isOpen]);

    const fetchData = async () => {
        const res = await _unitOfWork.calibrationWork.getCalibrationWorkHistory({ id: data.id });
        if (res && res.code === 1) {
            setAttachment(res.data.attachment);
            setCheckInCheckOut(res.data.checkInCheckOut);
        }
    };

    const downloadFile = async (id, fileName) => {
        const blob = await _unitOfWork.resource.downloadImage(id);
        if (blob) {
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();

            URL.revokeObjectURL(url);
        }
    }



    const columnCheckInCheckout = [
        {
            title: "STT",
            align: "center",
            width: 60,
            render: (_text, _record, index) => <span>{index + 1}</span>,
        },
        {
            title: "Check In",
            dataIndex: "checkInDateTime",
            render: (text) => <span>{parseDateHH(text)}</span>,
        },
        {
            title: "Check Out",
            dataIndex: "checkOutDateTime",
            render: (text) => <span>{parseDateHH(text)}</span>,
        },
    ];

    const columnAttachment = [
        {
            title: "STT",
            align: "center",
            width: 60,
            render: (_text, _record, index) => <span>{index + 1}</span>,
        },
        {
            title: "Tên tệp",
            dataIndex: "resource",
            render: (resource) => <span>{resource.fileName}</span>,
        },
        {
            title: "Thao tác",
            align: "center",
            width: 120,
            render: (_text, record) => (
                <Tooltip title="Tải xuống">
                    <Button
                        type="primary"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => downloadFile(record.resource.id, record.resource.fileName)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <Modal
            footer={null}
            width={"70%"}
            className="custom-modal"
            open={isOpen}
            onCancel={isClose}
        >
            <Card title="Chi tiết lịch sử kiểm định /hiệu chuẩn" bordered={false}>
                <Descriptions column={1} size="middle">
                    <Descriptions.Item label="Kết quả">
                        {data?.isPassed ? (
                            <Tag color="green">
                                {t("calibrationWork.detail.fields.pass")}
                            </Tag>
                        ) : (
                            <Tag color="red">
                                {t("calibrationWork.detail.fields.fail")}
                            </Tag>
                        )}
                    </Descriptions.Item>

                    {data?.isPassed && (
                        <Descriptions.Item label="Thời gian ngừng hoạt động">
                            {data?.downtimeHr} giờ {data?.downtimeMin} phút
                        </Descriptions.Item>
                    )}

                    <Descriptions.Item label="Ghi chú">
                        {data?.comment || "---"}
                    </Descriptions.Item>
                </Descriptions>

                <Divider > Thời gian CheckIn CheckOut </Divider>


                <Table
                    columns={columnCheckInCheckout}
                    dataSource={checkInCheckOut}
                    bordered
                    pagination={false}
                />


                <Divider > Tệp đính kèm </Divider>

                <Table
                    columns={columnAttachment}
                    dataSource={attachment}
                    bordered
                    pagination={false}
                />

            </Card>
        </Modal>
    );
}
