import { Card, Modal, Table, Tooltip, Tag } from "antd";
import { useTranslation } from "react-i18next";

const ViewTaskItemsModal = ({ open, onCancel, data }) => {
    const { t } = useTranslation();

    const answerTypeMap = t("preventiveSchedule.task_item_maps.answer_type", { returnObjects: true });
    const conditionMap = t("preventiveSchedule.task_item_maps.condition", { returnObjects: true });
    const statusMap = t("preventiveSchedule.task_item_maps.status", { returnObjects: true });
    const problemMap = t("preventiveSchedule.task_item_maps.problem", { returnObjects: true });

    const columns = [
        {
            title: t("preventiveSchedule.table.index"),
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: t("preventiveSchedule.table.task_description"),
            dataIndex: "taskDescription",
            key: "taskDescription",
            render: (text, record) => text || record.taskItemDescription || "-",
        },
        {
            title: t("preventiveSchedule.table.monitoring_point"),
            dataIndex: "monitoringPoints",
            key: "monitoringPoints",
            render: (text) => text || "-",
        },
        {
            title: t("preventiveSchedule.table.inspection_type"),
            dataIndex: "answerTypeInspection",
            key: "answerTypeInspection",
            render: (value) => answerTypeMap[value] || value,
        },
        {
            title: t("preventiveSchedule.table.condition"),
            dataIndex: "condition",
            key: "condition",
            render: (value) => conditionMap[value] || value,
        },
        {
            title: t("preventiveSchedule.table.limit"),
            key: "limit",
            render: (_, record) => {
                if (record.condition === "rang") {
                    return `${record.value1 ?? "-"} ~ ${record.value2 ?? "-"}`;
                }
                return record.value1 ?? "-";
            },
        },
        {
            title: t("preventiveSchedule.table.measured_value"),
            dataIndex: "value",
            key: "value",
            render: (val) => val ?? "-",
        },
        {
            title: t("preventiveSchedule.table.problem"),
            dataIndex: "isProblem",
            key: "isProblem",
            align: "center",
            render: (isProblem) =>
                isProblem ? (
                    <Tag color="red">{problemMap.yes}</Tag>
                ) : (
                    <Tag color="green">{problemMap.no}</Tag>
                ),
        },
        {
            title: t("preventiveSchedule.table.status"),
            dataIndex: "status",
            key: "status",
            render: (value) => {
                const st = statusMap[value];
                if (st) {
                    const colorMap = {
                        "Hoàn thành": "green",
                        "Chưa làm": "volcano",
                        "Yes": "blue",
                        "No": "red",
                        "N/A": "default"
                    };
                    return <Tag color={colorMap[st] || "default"}>{st}</Tag>;
                }
                return <Tag>{value}</Tag>;
            },
        },
        {
            title: t("preventiveSchedule.table.problem_comment"),
            dataIndex: "problemComment",
            key: "problemComment",
            render: (text) => text || "-",
        },
        {
            title: t("preventiveSchedule.table.other_comment"),
            dataIndex: "comment",
            key: "comment",
            render: (text) => text || "-",
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            className="custom-modal"
            width={1200}
        >
            <Card title={t("preventiveSchedule.modal.task_items_title")}>
                <Table
                    dataSource={data}
                    columns={columns}
                    bordered
                    footer={null}
                    rowKey={(r, i) => i}
                    locale={{
                        emptyText: <span style={{ color: "red" }}>{t("preventiveSchedule.table.no_records")}</span>
                    }}
                />
            </Card>
        </Modal>
    )
}

export default ViewTaskItemsModal;