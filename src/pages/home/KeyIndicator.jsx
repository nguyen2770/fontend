import { FileUnknownOutlined, MenuOutlined } from "@ant-design/icons";
import { Col, Row, Card, Radio, Popover, Divider } from "antd";
import { Column, Tiny } from "@ant-design/plots";
import React, { useEffect, useState, useMemo } from "react";
import "./index.scss";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";

const optionKeyIndecatorsTypeBase = [
  { key: "oneMonth", value: "oneMonth" },
  { key: "threeMonth", value: "threeMonth" },
  { key: "sixMonth", value: "sixMonth" },
];

const KeyIndicator = () => {
  const { t } = useTranslation();
  const [keyIndicatorsType, setKeyIndicatorsType] = useState("oneMonth");
  const [schedulePreventiveCompliance, setSchedulePreventiveCompliance] =
    useState(null);
  const [calibrationWorkCompliance, setCalibrationWorkCompliance] =
    useState(null);
  const [breakdownCompliance, setBreakdownCompliance] = useState(null);
  const [upTimeAssetMaintenance, setUpTimeAssetMaintenance] = useState(null);
  const [schedulePreventiveVsAssignUser, setSchedulePreventiveVsAssignUser] =
    useState([]);

  const optionKeyIndecatorsType = useMemo(
    () =>
      optionKeyIndecatorsTypeBase.map((o) => ({
        label: t(`dashboard.period.${o.key}`),
        value: o.value,
      })),
    [t],
  );

  useEffect(() => {
    fetchGetSchedulePreventiveCompliance();
    fetchGetBreakdownCompliance();
    fetchGetUpTimeAssetMaintenance();
    fetchGetSchedulePreventiveVsAssignUser();
    fetchGetCalibrationWorkCompliance();
  }, [keyIndicatorsType]);

  const fetchGetSchedulePreventiveCompliance = async () => {
    let res = await _unitOfWork.report.getSchedulePreventiveCompliance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setSchedulePreventiveCompliance(res.percentSchedulePreventive);
    }
  };
  const fetchGetCalibrationWorkCompliance = async () => {
    let res = await _unitOfWork.report.getCalibrationWorkCompliance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setCalibrationWorkCompliance(res.percentCalibrationWork);
    }
  };
  const fetchGetBreakdownCompliance = async () => {
    let res = await _unitOfWork.report.getBreakdownCompliance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setBreakdownCompliance(res.percentBreakdown);
    }
  };
  const fetchGetUpTimeAssetMaintenance = async () => {
    let res = await _unitOfWork.report.getUpTimeAssetMaintenance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setUpTimeAssetMaintenance(res.data);
    }
  };
  const fetchGetSchedulePreventiveVsAssignUser = async () => {
    let res = await _unitOfWork.report.getSchedulePreventiveVsAssignUser({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      let data = [];
      data.push({
        pv: res?.data?.totalSchedulePreventive,
        action: t("dashboard.key.chart.job"),
      });
      data.push({
        pv: res?.data?.totalSchedulePreventiveAssignUser,
        action: t("dashboard.key.chart.assignment"),
      });
      setSchedulePreventiveVsAssignUser(data);
    }
  };

  const configSchedulePreventiveVsAssign = {
    data: schedulePreventiveVsAssignUser,
    xField: "action",
    yField: "pv",
    style: {
      maxWidth: 35,
    },
    label: {
      text: (d) => d.pv,
      textBaseline: "bottom",
    },
    width: 300,
    height: 200,
  };
  const configSchedulePreventive = {
    percent: schedulePreventiveCompliance / 100,
    width: 200,
    height: 200,
    color: ["#E8EFF5", "#66AFF4"],
    annotations: [
      {
        type: "text",
        style: {
          text: `${Number(schedulePreventiveCompliance).toFixed(2)}%`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 16,
          fontStyle: "bold",
        },
      },
    ],
  };
  const configCalibrationWork = {
    percent: calibrationWorkCompliance / 100,
    width: 200,
    height: 200,
    color: ["#E8EFF5", "#66AFF4"],
    annotations: [
      {
        type: "text",
        style: {
          text: `${Number(calibrationWorkCompliance).toFixed(2)}%`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 16,
          fontStyle: "bold",
        },
      },
    ],
  };
  const configBreakdown = {
    percent: breakdownCompliance / 100,
    width: 200,
    height: 200,
    color: ["#E8EFF5", "#66AFF4"],
    annotations: [
      {
        type: "text",
        style: {
          text: `${Number(breakdownCompliance).toFixed(2)}%`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 16,
          fontStyle: "bold",
        },
      },
    ],
  };
  const configUpTimeAssetMaintenance = {
    percent: upTimeAssetMaintenance / 100,
    width: 200,
    height: 200,
    color: ["#E8EFF5", "#66AFF4"],
    annotations: [
      {
        type: "text",
        style: {
          text: `${Number(upTimeAssetMaintenance).toFixed(2)}%`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 16,
          fontStyle: "bold",
        },
      },
    ],
  };

  const formulaPreventive = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.key.formula.preventive_title")}
      </div>
      <div style={{ marginBottom: 4 }}>
        {t("dashboard.key.formula.preventive_num_done")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
        <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>×</span>
        <span style={{ fontWeight: 600, fontSize: 16 }}>100</span>
      </div>
      <div>{t("dashboard.key.formula.preventive_den")}</div>
    </div>
  );
  const formulaCalibrationWork = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.key.formula.preventive_title")}
      </div>
      <div style={{ marginBottom: 4 }}>
        {t("dashboard.key.formula.calibration_work_num_done")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
        <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>×</span>
        <span style={{ fontWeight: 600, fontSize: 16 }}>100</span>
      </div>
      <div>{t("dashboard.key.formula.calibration_work_den")}</div>
    </div>
  );

  const formulaBreakdown = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.key.formula.preventive_title")}
      </div>
      <div style={{ marginBottom: 4 }}>
        {t("dashboard.key.formula.breakdown_num_done")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
        <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>×</span>
        <span style={{ fontWeight: 600, fontSize: 16 }}>100</span>
      </div>
      <div>{t("dashboard.key.formula.breakdown_den")}</div>
    </div>
  );
  const formulaUptime = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.key.formula.preventive_title")}
      </div>
      <div style={{ marginBottom: 4 }}>
        {t("dashboard.key.formula.uptime_num")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
        <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>×</span>
        <span style={{ fontWeight: 600, fontSize: 16 }}>100</span>
      </div>
      <div>{t("dashboard.key.formula.uptime_den")}</div>
    </div>
  );

  return (
    <Card
      title={t("dashboard.key.title")}
      variant="borderless"
      className="wp-100 p-0 m-0 mt-3"
    >
      <Row gutter={[16, 16]} className="mt-3 mb-2">
        <Col>
          <Radio.Group
            block
            options={optionKeyIndecatorsType}
            value={keyIndicatorsType}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => setKeyIndicatorsType(e.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card className="p-2">
            <Row>
              <Col span={16} style={{ fontWeight: 700 }}>
                {t("dashboard.key.preventive")}
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                <Popover
                  placement="top"
                  title={null}
                  content={formulaPreventive}
                  trigger="click"
                >
                  <FileUnknownOutlined
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  />
                </Popover>
                <MenuOutlined style={{ fontWeight: "bold", fontSize: 16 }} />
              </Col>
            </Row>
            <Row className="mt-3">
              <Tiny.Ring className="tiny-ring" {...configSchedulePreventive} />
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center", color: "#4680ff" }}>
                {t("dashboard.key.completion_rate")} -{" "}
                {schedulePreventiveCompliance != null
                  ? `${Number(schedulePreventiveCompliance).toFixed(2)}`
                  : "0.00%"}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="p-2">
            <Row>
              <Col span={16} style={{ fontWeight: 700 }}>
                {t("dashboard.key.breakdown")}
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                <Popover
                  placement="top"
                  title={null}
                  content={formulaBreakdown}
                  trigger="click"
                >
                  <FileUnknownOutlined
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  />
                </Popover>
                <MenuOutlined style={{ fontWeight: "bold", fontSize: 16 }} />
              </Col>
            </Row>
            <Row className="mt-3">
              <Tiny.Ring className="tiny-ring" {...configBreakdown} />
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center", color: "#4680ff" }}>
                {t("dashboard.key.completion_rate")} -{" "}
                {breakdownCompliance != null
                  ? `${Number(breakdownCompliance).toFixed(2)}`
                  : "0.00%"}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="p-2">
            <Row>
              <Col span={16} style={{ fontWeight: 700 }}>
                {t("calibration.calibration_title")}
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                <Popover
                  placement="top"
                  title={null}
                  content={formulaCalibrationWork}
                  trigger="click"
                >
                  <FileUnknownOutlined
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  />
                </Popover>
                <MenuOutlined style={{ fontWeight: "bold", fontSize: 16 }} />
              </Col>
            </Row>
            <Row className="mt-3">
              <Tiny.Ring className="tiny-ring" {...configCalibrationWork} />
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center", color: "#4680ff" }}>
                {t("dashboard.key.completion_rate")} -{" "}
                {calibrationWorkCompliance != null
                  ? `${Number(calibrationWorkCompliance).toFixed(2)}`
                  : "0.00%"}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="p-2">
            <Row>
              <Col span={16} style={{ fontWeight: 700 }}>
                {t("dashboard.key.uptime")}
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                <Popover
                  placement="top"
                  title={null}
                  content={formulaUptime}
                  trigger="click"
                >
                  <FileUnknownOutlined
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  />
                </Popover>
                <MenuOutlined style={{ fontWeight: "bold", fontSize: 16 }} />
              </Col>
            </Row>
            <Row className="mt-3">
              <Tiny.Ring
                className="tiny-ring"
                {...configUpTimeAssetMaintenance}
              />
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center", color: "#4680ff" }}>
                {t("dashboard.key.asset_uptime_rate")} -{" "}
                {upTimeAssetMaintenance != null
                  ? `${Number(upTimeAssetMaintenance).toFixed(2)}`
                  : "0.00%"}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="p-2">
            <Row>
              <Col span={18} style={{ fontWeight: 700 }}>
                {t("dashboard.key.schedule_vs_assign")}
              </Col>
              <Col span={6} style={{ textAlign: "end" }}>
                <MenuOutlined style={{ fontWeight: "bold", fontSize: 16 }} />
              </Col>
            </Row>
            <Row className="mt-3">
              <div className="mt-3 preventive-schedule-complete-chart wp-100">
                <Column
                  className="wp-100"
                  {...configSchedulePreventiveVsAssign}
                />
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default KeyIndicator;
