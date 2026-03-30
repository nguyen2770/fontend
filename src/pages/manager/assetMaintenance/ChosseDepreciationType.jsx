import { Col, Form, Input, InputNumber, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { depreciationBases } from "../../../utils/constant";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";

export default function ChosseDepreciationType({ selectedDepreciationType, isDisable }) {
  const { t } = useTranslation();
  return (
    <>
      {selectedDepreciationType === "straightLine" && (
        <>
          <Col span={24}>
            <Form.Item
              id=""
              name="salvageValue"
              labelAlign="left"
              label={t("assetMaintenance.depreciation.salvage_value_label")}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.salvage_value_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item
              label={t("assetMaintenance.depreciation.depreciation_base_label")}
              labelAlign="left"
              name="depreciationBase"
            >
              <Select
                placeholder={t(
                  "assetMaintenance.depreciation.depreciation_base_placeholder"
                )}
                options={(depreciationBases.Option || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                disabled={isDisable}
              ></Select>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item
              id=""
              name="assetLifespan"
              labelAlign="left"
              label={t("assetMaintenance.depreciation.asset_lifespan_label")}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.asset_lifespan_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
        </>
      )}
      {selectedDepreciationType === "doubleDecliningBalance" && (
        <>
          <Col span={24}>
            <Form.Item
              id=""
              name="salvageValue"
              labelAlign="left"
              label={t("assetMaintenance.depreciation.salvage_value_label")}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.salvage_value_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item
              label={t("assetMaintenance.depreciation.depreciation_base_label")}
              labelAlign="left"
              name="depreciationBase"
            >
              <Select
                placeholder={t(
                  "assetMaintenance.depreciation.depreciation_base_placeholder"
                )}
                options={(depreciationBases.Option || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                disabled={isDisable}
              ></Select>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item
              id=""
              name="assetLifespan"
              labelAlign="left"
              label={t("assetMaintenance.depreciation.asset_lifespan_label")}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.asset_lifespan_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
        </>
      )}
      {selectedDepreciationType === "unitOfProductionDepreciationMethod" && (
        <>
          <Col span={24}>
            <Form.Item
              id=""
              name="salvageValue"
              labelAlign="left"
              label={t("assetMaintenance.depreciation.salvage_value_label")}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.salvage_value_placeholder"
                )}
                defaultValue={0}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              id=""
              name="productionCapability"
              labelAlign="left"
              label={t(
                "assetMaintenance.depreciation.production_capability_label"
              )}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.production_capability_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              id=""
              name="productionCapabilityPerMonth"
              labelAlign="left"
              label={t(
                "assetMaintenance.depreciation.production_capability_per_month"
              )}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.production_capability_per_month_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
        </>
      )}
      {selectedDepreciationType === "sumOfTheYearsDigitsDepreciationMethod" && (
        <>
          <Col span={24}>
            <Form.Item
              id=""
              name="salvageValue"
              labelAlign="left"
              label={t("assetMaintenance.depreciation.salvage_value_label")}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.salvage_value_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              id=""
              name="assetLifespan"
              labelAlign="left"
              label={t("assetMaintenance.depreciation.asset_lifespan_label")}
            >
              <InputNumber
                placeholder={t(
                  "assetMaintenance.depreciation.asset_lifespan_placeholder"
                )}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
                disabled={isDisable}
              />
            </Form.Item>
          </Col>
        </>
      )}
    </>
  );
}
