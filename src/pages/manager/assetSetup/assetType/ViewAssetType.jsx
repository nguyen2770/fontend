import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../../api";
import AssetTypeParameter from "./assetTypeParameter/AssetTypeParameter";
import AssetTypeMapAssetModel from "./assetTypeMapAssetModel/AssetTypeMapAssetModel";
import AssetTypeMapManufacturer from "./assetTypeMapManufacturer/assetTypeMapManufacturer";
import { parsePriceVnd } from "../../../../helper/price-helper";
import { useTranslation } from "react-i18next";

export default function ViewAssetType() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const params = useParams();
    const [assetType, setAssetType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssetType();
    }, []);
    const fetchAssetType = async () => {
        let res = await _unitOfWork.assetType.getAssetTypeById({
            id: params.id
        });
        if (res) {
            setAssetType({ ...res });
        }
    };
    return (
        <div className="content-manager">
            <Form
labelWrap
                form={form}
                labelCol={{
                    span: 8
                }}
                wrapperCol={{
                    span: 16
                }}
            >
                <Card
                    title={t("assetType.detail.title")}
                    extra={
                        <>
                            <Button
                                style={{ marginRight: 10 }}
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeftOutlined />
                                {t("assetType.buttons.back")}
                            </Button>
                        </>
                    }
                >
                    <Row gutter={32}>
                        <Col span={12}>
                            <Form.Item
                                label={t(
                                    "assetType.detail.fields.asset_type_category"
                                )}
                                labelAlign="left"
                            >
                                <span>
                                    {assetType?.assetTypeCategory?.name || ""}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("assetType.detail.fields.asset")}
                                labelAlign="left"
                            >
                                <span>{assetType?.asset?.assetName}</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("assetType.detail.fields.expected_price")}
                                labelAlign="left"
                            >
                                <span>{parsePriceVnd(assetType?.expectedPrice)}</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("assetType.detail.fields.note")}
                                labelAlign="left"
                            >
                                <span>{assetType?.note}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Tabs
                            defaultActiveKey="assetTypeParameter"
                            style={{
                                marginBottom: 24,
                                background: "#fff",
                                borderRadius: 8
                            }}
                            className="wp-100"
                            items={[
                                {
                                    key: "assetTypeParameter",
                                    label: t(
                                        "assetType.detail.tabs.parameters"
                                    ),
                                    children: (
                                        <AssetTypeParameter assetType={assetType} />
                                    )
                                },
                                {
                                    key: "assetTypeMapAssetModel",
                                    label: t("assetType.detail.tabs.models"),
                                    children: (
                                        <AssetTypeMapAssetModel assetType={assetType} />
                                    )
                                },
                                {
                                    key: "assetTypeMap",
                                    label: t(
                                        "assetType.detail.tabs.manufacturers"
                                    ),
                                    children: (
                                        <AssetTypeMapManufacturer assetType={assetType} />
                                    )
                                }
                            ]}
                        />
                    </Row>
                </Card>
            </Form>
        </div>
    );
}