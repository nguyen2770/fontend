import { Card, Modal, Table, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

const ViewTaskItemsModal = ({ open, onCancel, data }) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("preventive.task_items_modal.columns.description"),
            dataIndex: "taskItemDescription",
            key: "taskItemDescription",
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text || "-"}</span>
                </Tooltip>
            ),
        },
        {
            title: t("preventive.task_items_modal.columns.answer_type"),
            dataIndex: "answerTypeInspection",
            key: "answerTypeInspection",
            render: (type) => {
                const map = t("preventive.task_items_modal.answer_type_map", { returnObjects: true });
                return map[type] || type;
            },
        },
        {
            title: t("preventive.task_items_modal.columns.condition"),
            dataIndex: "condition",
            key: "condition",
            render: (cond) => {
                const map = t("preventive.task_items_modal.condition_map", { returnObjects: true });
                return map[cond] || cond;
            },
        },
        {
            title: t("preventive.task_items_modal.columns.value1"),
            dataIndex: "value1",
            key: "value1",
            align: "right",
        },
        {
            title: t("preventive.task_items_modal.columns.value2"),
            dataIndex: "value2",
            key: "value2",
            align: "right",
        },
        {
            title: t("preventive.task_items_modal.columns.uom"),
            dataIndex: ["uom", "uomName"],
            key: "uom",
            render: (uomName) => uomName || "-",
        },
        {
            title: t("preventive.task_items_modal.columns.monitoring_point"),
            dataIndex: "monitoringPoints",
            key: "monitoringPoints",
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text || "-"}</span>
                </Tooltip>
            ),
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
            <Card title={t("preventive.task_items_modal.title")}>
                <Table
                    dataSource={data}
                    columns={columns}
                    bordered
                    footer={null}
                    rowKey="id"
                />
            </Card>
        </Modal>
    )
}

export default ViewTaskItemsModal;