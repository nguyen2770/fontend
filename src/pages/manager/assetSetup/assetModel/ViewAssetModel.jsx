import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../../api";
import AssetModelParameter from "./assetModelParameter";
import AssetModelFailureType from "./assetModelFailureType";
import AssetModelSeftDiagnosia from "./assetModelSeftDiagnosia";
import AssetModelSparePart from "./assetModelSparePart";
import AssetModelSolution from "./assetModelSolution";
import AssetModelDocument from "./assetModelDocument";
import AssetModelChecklist from "./assetModelChecklist";
import { useTranslation } from "react-i18next";

export default function ViewAssetModel() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const [assetModel, setAssetModel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssetModel();
  }, []);

  const fetchAssetModel = async () => {
    let res = await _unitOfWork.assetModel.getAssetModelById(params.id);
    if (res?.code === 1) {
      setAssetModel(res.assetModel);
    }
  };

  return (
    <div className="content-manager">
      <Form
        labelWrap
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card
          title={
            t("assetModel.model.detail_title_prefix") +
            (assetModel?.assetModelName || "")
          }
          extra={
            <Button style={{ marginRight: 10 }} onClick={() => navigate(-1)}>
              <ArrowLeftOutlined />
              {t("assetModel.common.buttons.back")}
            </Button>
          }
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.model.fields.asset")}
                labelAlign="left"
              >
                <span>{assetModel?.asset?.assetName}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.model.fields.supplier")}
                labelAlign="left"
              >
                <span>{assetModel?.supplier?.supplierName || ""}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.model.fields.manufacturer")}
                labelAlign="left"
              >
                <span>{assetModel?.manufacturer?.manufacturerName || ""}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.model.fields.model_name")}
                labelAlign="left"
              >
                <span>{assetModel?.assetModelName}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.model.fields.asset_type_category")}
                labelAlign="left"
              >
                <span>{assetModel?.assetTypeCategory?.name || ""}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.model.fields.category")}
                labelAlign="left"
              >
                <span>{assetModel?.category?.categoryName || ""}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.model.fields.sub_category")}
                labelAlign="left"
              >
                <span>{assetModel?.subCategory?.subCategoryName || ""}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Tabs
              defaultActiveKey="assetModelParameter"
              className="wp-100"
              items={[
                {
                  key: "assetModelParameter",
                  label: t("assetModel.model.tabs.parameters"),
                  children: <AssetModelParameter assetModel={assetModel} />,
                },
                {
                  key: "assetModelSparePart",
                  label: t("assetModel.model.tabs.spare_parts"),
                  children: <AssetModelSparePart assetModel={assetModel} />,
                },
                {
                  key: "assetModelFailureType",
                  label: t("assetModel.model.tabs.failure_types"),
                  children: <AssetModelFailureType assetModel={assetModel} />,
                },
                {
                  key: "assetModelSeftDiagnosia",
                  label: t("assetModel.model.tabs.self_diagnosis"),
                  children: <AssetModelSeftDiagnosia assetModel={assetModel} />,
                },
                {
                  key: "assetModelSolution",
                  label: t("assetModel.model.tabs.solutions"),
                  children: <AssetModelSolution assetModel={assetModel} />,
                },
                /* { // tạm ẩn
                  key: "assetModelMonitoring",
                  label: t(
                    "assetModel.model.tabs.monitoring_points"
                  ),
                  children: (
                    <AssetModelMonitoringPoint
                      assetModel={assetModel}
                    />
                  )
                },*/
                {
                  key: "assetModelDocument",
                  label: t("assetModel.model.tabs.documents"),
                  children: <AssetModelDocument assetModel={assetModel} />,
                },
              ]}
            />
          </Row>
        </Card>
      </Form>
    </div>
  );
}
