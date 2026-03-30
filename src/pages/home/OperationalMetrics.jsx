import { FileUnknownOutlined } from "@ant-design/icons";
import { Col, Row, Card, Radio, Popover, Tooltip } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { formatMillisToHHMM } from "../../helper/date-helper";
import "./index.scss";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";

export default function OperationalMetrics() {
  const { t } = useTranslation();
  const [dateRangeType, setDateRangeType] = useState("oneMonth");
  const [operationalMetrics, setOperationalMetrics] = useState([]);

  const optionDateType = useMemo(
    () => [
      { label: t("dashboard.period.oneMonth"), value: "oneMonth" },
      { label: t("dashboard.period.threeMonth"), value: "threeMonth" },
      { label: t("dashboard.period.sixMonth"), value: "sixMonth" },
    ],
    [t],
  );

  useEffect(() => {
    if (dateRangeType) {
      fetchGetDataKPBIndicators();
    }
  }, [dateRangeType]);

  const fetchGetDataKPBIndicators = async () => {
    let res = await _unitOfWork.report.totalOperationalMetrics({
      type: dateRangeType,
    });
    if (res && res.code === 1) {
      setOperationalMetrics(res.data);
    }
  };

  const formulaContentTotalDowntimeHrs = (
    <div style={{ minWidth: 250 }} className="p-2">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.operational.formula.downtime_title")}
      </div>
      <div style={{ fontWeight: "600" }}>
        {t("dashboard.operational.formula.downtime_note")}
      </div>
    </div>
  );
  const formulaContentTotalMTBF = (
    <div style={{ minWidth: 250 }} className="p-2">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.operational.formula.mtbf_title")}
      </div>
      <div style={{ fontWeight: "600" }}>
        {t("dashboard.operational.formula.mtbf_note")}
      </div>
    </div>
  );
  const formulaContentTotalMTTR = (
    <div style={{ minWidth: 250 }} className="p-2">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.operational.formula.mttr_title")}
      </div>
      <div style={{ fontWeight: "600" }}>
        {t("dashboard.operational.formula.mttr_note")}
      </div>
    </div>
  );
  const formulaContentTotalSpendTime = (
    <div style={{ minWidth: 250 }} className="p-2">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.operational.formula.spend_title")}
      </div>
      <div style={{ fontWeight: "600" }}>
        {t("dashboard.operational.formula.spend_note")}
      </div>
    </div>
  );

  return (
    <div className="mt-3 dashbroad-tab">
      <Row>
        <Radio.Group
          block
          options={optionDateType}
          value={dateRangeType}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => setDateRangeType(e.target.value)}
        />
      </Row>
      <Row gutter={[16, 16]} className="mt-2">
        <Col span={6}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px #f0f1f2",
              minHeight: 120,
            }}
            bodyStyle={{ padding: 24, position: "relative" }}
          >
            <div className="p-3">
              <div style={{ fontWeight: 600, color: "#444" }}>
                {t("dashboard.operational.total_downtime")}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "12px 0",
                }}
              >
                <Tooltip title="HH : MM">
                  {formatMillisToHHMM(operationalMetrics?.totalDowntimeHrs)}
                </Tooltip>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: "40px",
                fontSize: 18,
                fontWeight: "bold",
                padding: 2,
              }}
            >
              <Popover
                placement="top"
                title={null}
                content={formulaContentTotalDowntimeHrs}
                trigger="click"
                className="mr-4"
              >
                <FileUnknownOutlined
                  className="mr-2"
                  style={{ cursor: "pointer" }}
                />
              </Popover>
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 60,
                height: 60,
                background: "#FFB84D",
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/icon-sheet.png"
                alt=""
                style={{ width: 20, marginRight: 4 }}
              />
              <span style={{ fontSize: 24, color: "#fff" }}>
                <i className="anticon anticon-clock-circle" />
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px #f0f1f2",
              minHeight: 120,
            }}
            bodyStyle={{ padding: 24, position: "relative" }}
          >
            <div className="p-3">
              <div style={{ fontWeight: 600, color: "#444" }}>
                {t("dashboard.operational.total_mtbf")}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "12px 0",
                }}
              >
                {formatMillisToHHMM(operationalMetrics?.totalMTBFBreakdown)}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: "40px",
                fontSize: 18,
                fontWeight: "bold",
                padding: 2,
              }}
            >
              <Popover
                placement="top"
                title={null}
                content={formulaContentTotalMTBF}
                trigger="click"
                className="mr-4"
              >
                <FileUnknownOutlined
                  className="mr-2"
                  style={{ cursor: "pointer" }}
                />
              </Popover>
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 60,
                height: 60,
                background: "#FF5C5C",
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/icon-sheet.png"
                alt=""
                style={{ width: 20, marginRight: 4 }}
              />
              <span style={{ fontSize: 24, color: "#fff" }}>
                <i className="anticon anticon-clock-circle" />
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px #f0f1f2",
              minHeight: 120,
            }}
            bodyStyle={{ padding: 24, position: "relative" }}
          >
            <div className="p-3">
              <div style={{ fontWeight: 600, color: "#444" }}>
                {t("dashboard.operational.total_mttr")}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "12px 0",
                }}
              >
                {formatMillisToHHMM(operationalMetrics?.totalMTTRBreakdown) ||
                  0}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: "40px",
                fontSize: 18,
                fontWeight: "bold",
                padding: 2,
              }}
            >
              <Popover
                placement="top"
                title={null}
                content={formulaContentTotalMTTR}
                trigger="click"
                className="mr-4"
              >
                <FileUnknownOutlined
                  className="mr-2"
                  style={{ cursor: "pointer" }}
                />
              </Popover>
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 60,
                height: 60,
                background: "#3B82F6",
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 24, color: "#fff" }}>
                <i className="anticon anticon-clock-circle" />
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px #f0f1f2",
              minHeight: 120,
            }}
            bodyStyle={{ padding: 24, position: "relative" }}
          >
            <div className="p-3">
              <div style={{ fontWeight: 600, color: "#444" }}>
                {t("dashboard.operational.total_spend_time")}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "12px 0",
                }}
              >
                {formatMillisToHHMM(operationalMetrics?.totalSpendTimeMs) || 0}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 40,
                fontSize: 18,
                fontWeight: "bold",
                padding: 2,
              }}
            >
              <Popover
                placement="top"
                title={null}
                content={formulaContentTotalSpendTime}
                trigger="click"
                className="mr-4"
              >
                <FileUnknownOutlined
                  className="mr-2"
                  style={{ cursor: "pointer" }}
                />
              </Popover>
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 60,
                height: 60,
                background: "#7AC943",
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/icon-sheet.png"
                alt=""
                style={{ width: 20, marginRight: 4 }}
              />
              <span style={{ fontSize: 24, color: "#fff" }}>
                <i className="anticon anticon-clock-circle" />
              </span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
