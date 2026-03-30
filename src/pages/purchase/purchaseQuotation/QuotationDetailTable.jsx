import { Table, Button, Tooltip, Row, Col, Form, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { parsePriceVnd } from "../../../helper/price-helper";
import { useTranslation } from "react-i18next";

export default function QuotationDetailTable({ data, onAdd, onEdit, onDelete }) {
    const { t } = useTranslation();
    const columns = [
        {
            title: t("purchaseQuotation.tableDetail.index"),
            render: (_t, _r, i) => i + 1,
            width: 60
        },
        {
            title: t("purchaseQuotation.tableDetail.code"),
            dataIndex: "code",
            width: 120
        },
        {
            title: t("purchaseQuotation.tableDetail.name"),
            dataIndex: "name",
            width: 200
        },
        {
            title: t("purchaseQuotation.tableDetail.uom"),
            dataIndex: "uomName",
            width: 80
        },
        {
            title: t("purchaseQuotation.tableDetail.qty"),
            dataIndex: "qty",
            align: "right",
            width: 100
        },
        {
            title: t("purchaseQuotation.tableDetail.unit_price"),
            dataIndex: "unitPrice",
            align: "right",
            width: 120,
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("purchaseQuotation.tableDetail.vat_percent"),
            dataIndex: "vatPercent",
            align: "right",
            width: 100
        },
        {
            title: t("purchaseQuotation.tableDetail.vat_amount"),
            dataIndex: "vatAmount",
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("purchaseQuotation.tableDetail.total_amount"),
            dataIndex: "totalAmount",
            align: "right",
            width: 140,
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("purchaseQuotation.tableDetail.supplier"),
            dataIndex: "supplier",
            key: "supplier",
            width: 160
        },
        {
            title: t("purchaseQuotation.tableDetail.delivery_time"),
            dataIndex: "deliveryTime",
            key: "deliveryTime",
            width: 120
        },
        {
            title: t("purchaseQuotation.tableDetail.note"),
            dataIndex: "note",
            key: "note",
            width: 150
        },
        {
            title: t("purchaseQuotation.tableDetail.action"),
            key: "action",
            fixed: "right",
            align: "center",
            width: 100,
            render: (_, record, index) => (
                <div
                    style={{ display: "flex", justifyContent: "center", gap: 4 }}
                >
                    <Tooltip title={t("purchase.actions.edit")}>
                        <Button
                            size="small"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record, index)}
                        />
                    </Tooltip>
                    <Tooltip title={t("purchase.actions.delete")}>
                        <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(record)}
                        />
                    </Tooltip>
                </div>
            )
        }
    ];
    const totalVatAmount = data.reduce(
        (sum, item) => sum + (parseFloat(item.vatAmount) || 0),
        0
    );
    const totalAmount = data.reduce(
        (sum, item) => sum + (parseFloat(item.totalAmount) || 0),
        0
    );

    return (
        <>
            <div className="float-right mb-2">
                <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                    {t("purchaseQuotation.tableDetail.add_item_btn")}
                </Button>
            </div>
            <Table
                rowKey={(r) => r.id || r.key}
                dataSource={data}
                columns={columns}
                pagination={false}
                bordered
                scroll={{ x: 1800 }}
            />
            <Row gutter={16} className="mt-3" justify="end">
                <Form.Item
                    label={t(
                        "purchaseQuotation.tableDetail.totals.vat_total"
                    )}
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                >
                    <Input value={parsePriceVnd(totalVatAmount)} disabled />
                </Form.Item>
                <Col span={6}>
                    <Form.Item
                        label={t(
                            "purchaseQuotation.tableDetail.totals.grand_total"
                        )}
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                    >
                        <Input value={parsePriceVnd(totalAmount)} disabled />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}