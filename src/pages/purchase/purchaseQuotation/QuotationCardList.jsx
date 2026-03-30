import React from "react";
import { Card, Col, Form, Input, Row, Table, Typography } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { parsePriceVnd } from "../../../helper/price-helper";
import { parseDate } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const QuotationCardList = ({ data }) => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("purchaseQuotation.tableDetail.name"),
      dataIndex: "name",
      key: "name",
      width: "25%"
    },
    {
      title: t("purchaseQuotation.tableDetail.qty"),
      dataIndex: "qty",
      key: "qty",
      align: "right",
      width: 90
    },
    {
      title: t("purchaseQuotation.tableDetail.unit_price"),
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      width: 120,
      render: (value) => (value ? parsePriceVnd(value) : "0 đ")
    },
    {
      title: t("purchaseQuotation.tableDetail.vat_percent"),
      dataIndex: "vatPercent",
      key: "vatPercent",
      align: "right",
      width: 80,
      render: (value) => `${value}%`
    },
    {
      title: t("purchaseQuotation.tableDetail.total_amount"),
      key: "amount",
      align: "right",
      width: 130,
      render: (_, record) => {
        const amount = record.qty * record.unitPrice;
        return amount ? parsePriceVnd(amount) : "0 đ";
      }
    },
    {
      title: t("purchaseQuotation.tableDetail.vat_amount"),
      key: "vatAmount",
      align: "right",
      width: 130,
      render: (_, record) => {
        const vat =
          record.qty *
          record.unitPrice *
          (record.vatPercent / 100);
        return vat ? parsePriceVnd(vat) : "0 đ";
      }
    },
    {
      title: t("purchaseQuotation.tableDetail.supplier"),
      dataIndex: "supplier",
      key: "supplier",
      width: "20%"
    }
  ];

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "40px 0",
          color: "#888",
          fontSize: "16px",
          border: "1px dashed #d9d9d9",
          borderRadius: 8,
          backgroundColor: "#fafafa"
        }}
      >
        <FileSearchOutlined style={{ fontSize: 48, marginBottom: 12 }} />
        <p style={{ marginBottom: 8 }}>
          {t("purchaseQuotation.card.empty")}
        </p>
      </div>
    );
  }

  const formatData = (data) =>
    data
      .map((entry) => {
        const { itemType, item, ...rest } = entry;
        if (itemType === "SpareParts") {
          return {
            type: itemType,
            id: item.id,
            name: item.sparePartsName,
            code: item.code,
            uomId: item.uomId,
            ...rest
          };
        }
        if (itemType === "AssetModel") {
          return {
            type: itemType,
            id: item.id,
            name: item.assetModelName,
            assetId: item.assetId,
            ...rest
          };
        }
        return null;
      })
      .filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}
    >
      {data.map((quote) => {
        let totalBase = 0;
        let totalVat = 0;
        quote.items.forEach((item) => {
          const base = item.qty * item.unitPrice;
          const vat = base * (item.vatPercent / 100);
          totalBase += base;
          totalVat += vat;
        });

        return (
          <Card
            key={quote.code}
            title={`${t(
              "purchaseQuotation.card.title_prefix"
            )} ${quote.code}`}
            style={{
              width: "100%",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              transition: "all 0.3s"
            }}
          >
            <Row gutter={[16, 16]} style={{ padding: "8px" }}>
              <Col span={12}>
                <Form.Item
                  label={t(
                    "purchaseQuotation.card.supplier_label"
                  )}
                  labelAlign="left"
                >
                  <Input disabled value={quote.supplier} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t(
                    "purchaseQuotation.card.quotation_date_label"
                  )}
                  labelAlign="left"
                >
                  <Input
                    disabled
                    value={parseDate(quote.quotationDate)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Table
                  dataSource={formatData(quote.items)}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  bordered
                  size="small"
                  style={{ marginTop: 12 }}
                />
              </Col>
            </Row>
            <Row gutter={16} className="mt-3" justify="end">
              <Col span={6}>
                <Form.Item
                  label={t(
                    "purchaseQuotation.card.totals.total_base"
                  )}
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input value={parsePriceVnd(totalBase)} disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t(
                    "purchaseQuotation.card.totals.total_vat"
                  )}
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input value={parsePriceVnd(totalVat)} disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t(
                    "purchaseQuotation.card.totals.grand_total"
                  )}
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input
                    value={parsePriceVnd(totalBase - totalVat)}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default QuotationCardList;