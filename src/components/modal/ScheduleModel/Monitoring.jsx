import { ClockCircleOutlined } from "@ant-design/icons";
import { Card, Col, Form, Input, InputNumber, Radio, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import { filterOption } from "../../../helper/search-select-helper";

export default function Monitoring({
  form,
  monitoringPointOptions,
  assetMaintenanceSchedule,
  preventive,
  preventiveOfModel,
}) {
  const { t } = useTranslation();
  const [monitoringType, setMonitoringType] = useState("on");
  const [selectedMonitoringPoint, setSelectedMonitoringPoint] = useState(null);

  useEffect(() => {
    if (preventive) {
      setMonitoringType(preventive.monitoringType || "on");
    }
  }, [preventive]);
  useEffect(() => {
    if (preventiveOfModel) {
      setMonitoringType(preventiveOfModel?.monitoringType || "on");
    }
  }, [preventiveOfModel]);
  useEffect(() => {
    if (assetMaintenanceSchedule) {
      setMonitoringType(assetMaintenanceSchedule.monitoringType || "on");
    }
    if (monitoringPointOptions && assetMaintenanceSchedule) {
      const selected = monitoringPointOptions.find(
        (item) => item.id === assetMaintenanceSchedule?.assetMaintenance
      );
      setSelectedMonitoringPoint(selected || null);
    }
  }, [assetMaintenanceSchedule, monitoringPointOptions]);

  return (
    <Col span={24} className="ml-2" style={{ width: "50vw" }}>
      <Card
        title={
          <span>
            <ClockCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
            {t("common.modal.calendarSchedule.titles.monitoring_based")}
          </span>
        }
        // style={{ minHeight: 300 }}
      >
        <Form.Item
          label={t("common.modal.calendarSchedule.fields.monitoring_point")}
          name="assetMaintenanceMonitoringPoint"
          required
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t(
                "common.modal.calendarSchedule.placeholders.select_monitoring_point"
              ),
            },
          ]}
        >
          <Select
            options={(monitoringPointOptions || []).map((item) => ({
              key: item.value,
              value: item.id,
              label: item.name,
            }))}
            placeholder={t(
              "common.modal.calendarSchedule.placeholders.select_monitoring_point"
            )}
            onChange={(id) => {
              const selected = (monitoringPointOptions || []).find(
                (item) => item.id === id
              );
              setSelectedMonitoringPoint(selected);
            }}
            allowClear
            filterOption={filterOption}
            showSearch={true}
          />
        </Form.Item>

        <Form.Item>
          <Radio.Group
            value={monitoringType}
            onChange={(e) => {
              setMonitoringType(e.target.value);
              form.setFieldValue("monitoringType", e.target.value);
              if (e.target.value === "every") {
                form.setFieldValue("monitoringOn", null);
              } else if (e.target.value === "on") {
                form.setFieldValue("monitoringEvery", null);
              }
            }}
            style={{ width: "100%" }}
          >
            <Row gutter={16}>
              {/* <Col span={8}>
                <Radio value="every">
                  {t("common.modal.calendarSchedule.fields.every")}
                </Radio>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  required
                  name="monitoringEvery"
                  rules={[
                    {
                      required: monitoringType === "every",
                      message: t(
                        "common.modal.calendarSchedule.validation.required_monitoring_every"
                      ),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={monitoringType !== "every"}
                    style={{ width: "100%" }}
                    placeholder={t(
                      "common.modal.calendarSchedule.placeholders.monitoring_every"
                    )}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                {selectedMonitoringPoint && (
                  <span style={{ marginLeft: 2 }}>
                    {selectedMonitoringPoint?.uomId?.uomName}
                  </span>
                )}
              </Col> */}

              <Col span={8}>
                <Radio value="on">
                  {t("common.modal.calendarSchedule.fields.on")}
                </Radio>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  required
                  name="monitoringOn"
                  rules={[
                    {
                      required: monitoringType === "on",
                      message: t(
                        "common.modal.calendarSchedule.validation.required_monitoring_on"
                      ),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={monitoringType !== "on"}
                    style={{ width: "100%" }}
                    placeholder={t(
                      "common.modal.calendarSchedule.placeholders.monitoring_on"
                    )}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                {selectedMonitoringPoint && (
                  <span style={{ marginLeft: 2 }}>
                    {selectedMonitoringPoint?.uomId?.uomName}
                  </span>
                )}
              </Col>
            </Row>
          </Radio.Group>
          <Form.Item name="monitoringType" initialValue={monitoringType} hidden>
            <Input />
          </Form.Item>
        </Form.Item>
      </Card>
    </Col>
  );
}
