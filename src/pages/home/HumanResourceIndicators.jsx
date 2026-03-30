import { FileUnknownOutlined, MenuOutlined } from "@ant-design/icons";
import { Col, Row, Card, Radio, Popover } from "antd";
import { Tiny } from "@ant-design/plots";
import React, { useEffect, useState } from "react";
import "./index.scss";
import * as _unitOfWork from "../../api";
import { formatMillisToHHMMSS } from "../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const HumanResourceIndicators = () => {
  const { t } = useTranslation();
  const [keyIndicatorsType, setKeyIndicatorsType] = useState("oneMonth");
  const [averageResponseTimeBreakdown, setAverageResponseTimeBreakdown] =
    useState(null);
  const [averageResolutionTimeBreakdown, setAverageResolutionTimeBreakdown] =
    useState(null);

  useEffect(() => {
    fetchGetAverageResponseTimeBreakdown();
    fetchGetAverageResolutionTimeBreakdown();
  }, [keyIndicatorsType]);

  const fetchGetAverageResponseTimeBreakdown = async () => {
    let res = await _unitOfWork.report.getAverageResponseTimeBreakdown({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setAverageResponseTimeBreakdown(res?.data?.avgResponseTime);
    }
  };
  const fetchGetAverageResolutionTimeBreakdown = async () => {
    let res = await _unitOfWork.report.getAverageResolutionTimeBreakdown({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setAverageResolutionTimeBreakdown(res?.data?.avgResolutionTime);
    }
  };
  const optionKeyIndecatorsType = [
    { label: t("dashboard.hr.oneMonth"), value: "oneMonth" },
    { label: t("dashboard.hr.threeMonth"), value: "threeMonth" },
    { label: t("dashboard.hr.sixMonth"), value: "sixMonth" },
  ];

  const formulaContent = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.hr.formula_allocation.title")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span style={{ flex: 1 }}>
          {t("dashboard.hr.formula_allocation.txt1")}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1 }}>
          {t("dashboard.hr.formula_allocation.txt2")}
        </span>
      </div>
    </div>
  );
  const formulaContentResolution = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.hr.formula_resolution.title")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span style={{ flex: 1 }}>
          {t("dashboard.hr.formula_resolution.txt1")}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1 }}>
          {t("dashboard.hr.formula_resolution.txt2")}
        </span>
      </div>
    </div>
  );

  const configAverageResponseTimeBreakdown = {
    percent: 1,
    width: 200,
    height: 200,
    color: ["#E8EFF5", "#66AFF4"],
    annotations: [
      {
        type: "text",
        style: {
          text: `${formatMillisToHHMMSS(
            averageResponseTimeBreakdown
          )}\nHH:MM:SS`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 16,
          fontStyle: "bold",
        },
      },
    ],
  };

  const configAverageResolutionTimeBreakdown = {
    percent: 1,
    width: 200,
    height: 200,
    color: ["#E8EFF5", "#66AFF4"],
    annotations: [
      {
        type: "text",
        style: {
          text: `${formatMillisToHHMMSS(
            averageResolutionTimeBreakdown
          )}\nHH:MM:SS`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 16,
          fontStyle: "bold",
        },
      },
    ],
  };

  return (
    <Card
      title={t("dashboard.hr.title")}
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
                {t("dashboard.hr.response_time")}
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                <Popover
                  placement="top"
                  title={null}
                  content={formulaContent}
                  trigger="click"
                >
                  <FileUnknownOutlined
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  />
                </Popover>
              </Col>
            </Row>
            <Row className="mt-3">
              <Tiny.Ring
                className="tiny-ring"
                {...configAverageResponseTimeBreakdown}
              />
            </Row>
            <Row>
              <Col
                span={24}
                style={{ textAlign: "center", color: "#4680ff" }}
              ></Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="p-2">
            <Row>
              <Col span={16} style={{ fontWeight: 700 }}>
                {t("dashboard.hr.resolution_time")}
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                <Popover
                  placement="top"
                  title={null}
                  content={formulaContentResolution}
                  trigger="click"
                >
                  <FileUnknownOutlined
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  />
                </Popover>
              </Col>
            </Row>
            <Row className="mt-3">
              <Tiny.Ring
                className="tiny-ring"
                {...configAverageResolutionTimeBreakdown}
              />
            </Row>
            <Row>
              <Col
                span={24}
                style={{ textAlign: "center", color: "#4680ff" }}
              ></Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default HumanResourceIndicators;
