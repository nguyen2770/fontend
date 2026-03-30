import { MenuOutlined } from "@ant-design/icons";
import { Col, Row, Radio } from "antd";
import { Column } from "@ant-design/plots";
import React, { useEffect, useState, useMemo } from "react";
import {
  parseDate,
  parseDateMonth,
  parseDateYear,
  parseWeekOfYear,
} from "../../helper/date-helper";
import "./index.scss";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";

export default function KPBIndicators() {
  const { t } = useTranslation();
  const [dateRangeType, setDateRangeType] = useState("day");
  const [dataKPBIndicators, setDataKPBIndicators] = useState([]);

  const optionDateType = useMemo(
    () => [
      { label: t("dashboard.period.day"), value: "day" },
      { label: t("dashboard.period.week"), value: "week" },
      { label: t("dashboard.period.month"), value: "month" },
      { label: t("dashboard.period.year"), value: "year" },
    ],
    [t]
  );

  useEffect(() => {
    if (dateRangeType) {
      fetchGetDataKPBIndicators();
    }
  }, [dateRangeType]);

  const fetchGetDataKPBIndicators = async () => {
    let res = await _unitOfWork.report.getDataKPBIndicators({
      type: dateRangeType,
    });
    if (res && res.code === 1) {
      let data = [];
      res.data.forEach((element) => {
        const date = generateColumnName(element.date);
        data.push({
          date: date,
          name: t("dashboard.kpb.asset"),
          value: element.totalAssetMaintenance,
        });
        data.push({
          date: date,
          name: t("dashboard.kpb.breakdown"),
          value: element.totalBreakdown,
        });
        data.push({
          date: date,
          name: t("dashboard.kpb.spare_usage"),
          value: element.totalQtySparePart,
        });
      });
      setDataKPBIndicators(data);
    }
  };
  const generateColumnName = (_date) => {
    if (dateRangeType === "day") {
      return parseDate(_date);
    }
    if (dateRangeType === "week") {
      return parseWeekOfYear(_date);
    }
    if (dateRangeType === "month") {
      return parseDateMonth(_date);
    }
    if (dateRangeType === "year") {
      return parseDateYear(_date);
    }
  };
  const config = {
    data: dataKPBIndicators,
    xField: "date",
    yField: "value",
    colorField: "name",
    group: true,
    style: {
      inset: 2,
    },
    label: {
      text: (datum) => (datum.value === 0 ? "-" : datum.value),
      textBaseline: "bottom",
      position: "inside",
    },
  };

  return (
    <div className="mt-3 dashbroad-tab" style={{height:"80vh"}}>
      <Row>
        <div style={{ fontWeight: 600 }}>{t("dashboard.kpb.title")}</div>
      </Row>
      <div
        style={{ borderBottom: "1px solid #e0e0e0", marginBottom: 10 }}
      ></div>
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
      <Row gutter={[16, 16]} className="pt-2 pl-3 pr-3">
        <Col span={12}>{t("dashboard.kpb.asset_users")}</Col>
        <Col span={12} style={{ textAlign: "end" }}>
          <MenuOutlined style={{ fontWeight: "bold", fontSize: 16 }} />
        </Col>
      </Row>
      <div className="mt-2 preventive-schedule-complete-chart wp-100">
        <Column className="wp-100" {...config} />
      </div>
    </div>
  );
}
