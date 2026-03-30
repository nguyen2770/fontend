import { AuditOutlined, HomeOutlined } from "@ant-design/icons";
import { Col, Row, Card, Radio, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import PreventiveScheduleCompleteChart from "./components/PreventiveScheduleCompleteChart";
import "./index.scss";
import * as _unitOfWork from "../../api";
import BreakdownCompleteChart from "./components/BreakdownCompleteChart";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../router/routerConfig";
import KeyIndicator from "./KeyIndicator";
import HumanResourceIndicators from "./HumanResourceIndicators";
import AssetSummary from "./components/AssetSummary";
import useMyBreakdown from "../../contexts/myBreakdownContext";
import useMySchedulePreventive from "../../contexts/mySchedulePreventiveContext";
import useBreakdown from "../../contexts/breakdownContext";
import useSchedulePreventive from "../../contexts/schedulePreventiveContext";
import { useTranslation } from "react-i18next";
import { calibrationGroupStatus } from "../../utils/constant";
import CalibrationWorkCompleteChart from "./components/CalibrationWorkCompleteChart";

const { Meta } = Card;

export default function Dashbroad() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tabKeyPreventiveAndBreakdown, setTabKeyPreventiveAndBreakdown] =
    useState("1");
  const [totalBreakdownStatues, setTotalBreakdownStatues] = useState([]);
  const [totalSchedulePreventiveStatuses, setTotalSchedulePreventiveStatuses] =
    useState([]);
  const [
    totalMyBreakdownAssignUserStatuses,
    setTotalMyBreakdownAssignUserStatuses,
  ] = useState([]);
  const [
    totalMySchedulePreventiveTaskAssignUserStatuses,
    setTotalMySchedulePreventiveTaskAssignUserStatuses,
  ] = useState([]);
  const [totalAmcByState, setTotalAmcByState] = useState(null);
  const [dateRangeType, setDateRangeType] = useState("day");
  const { setValueSearchMyBreakdown } = useMyBreakdown();
  const { setValueSearchBreakdown } = useBreakdown();
  const { setValueSearch } = useSchedulePreventive();
  const { setValueSearchMySchedule } = useMySchedulePreventive();
  const [
    totalCalibrationWorkByGroupStatus,
    setTotalCalibrationWorkByGroupStatus,
  ] = useState(null);
  const [
    totalCalibrationWorkAssignUserByStatus,
    setTotalCalibrationWorkAssignUserByStatus,
  ] = useState(null);
  const optionDateType = [
    { label: t("dashboard.period.day"), value: "day" },
    { label: t("dashboard.period.week"), value: "week" },
    { label: t("dashboard.period.month"), value: "month" },
    { label: t("dashboard.period.year"), value: "year" },
  ];

  const items = [
    {
      key: "1",
      label: t("dashboard.comparison.tab_schedule_complete"),
      children: (
        <PreventiveScheduleCompleteChart
          dateRangeType={dateRangeType}
          tabKey={tabKeyPreventiveAndBreakdown}
        />
      ),
    },
    {
      key: "2",
      label: t("dashboard.comparison.tab_breakdown_complete"),
      children: (
        <BreakdownCompleteChart
          dateRangeType={dateRangeType}
          tabKey={tabKeyPreventiveAndBreakdown}
        />
      ),
    },
    {
      key: "3",
      label: t("dashboard.comparison.tab_calibration_work"),
      children: (
        <CalibrationWorkCompleteChart
          dateRangeType={dateRangeType}
          tabKey={tabKeyPreventiveAndBreakdown}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchGetTotalBreakdownStatuses();
    fetchGetTotalSchedulePreventiveStatuses();
    fetchGetTotalMySchedulePreventiveTaskAssignUserStatuses();
    fetchGetTotalMyBreakdownAssignUserStatuses();
    fetchGetTotalAmcByState();
    fetchGetTotalCalibrationWorkByGroupStatus();
    fetchGetTotalCalibrationWorkAssignUserByStatus();
  }, []);

  const fetchGetTotalBreakdownStatuses = async () => {
    let res = await _unitOfWork.breakdown.getTotalBreakdwonStatus();
    if (res && res.code === 1) {
      setTotalBreakdownStatues(res.data);
    }
  };
  const fetchGetTotalSchedulePreventiveStatuses = async () => {
    let res =
      await _unitOfWork.schedulePreventive.getTotalSchedulePreventiveStatus();
    if (res && res.code === 1) {
      setTotalSchedulePreventiveStatuses(res.data);
    }
  };
  const fetchGetTotalMySchedulePreventiveTaskAssignUserStatuses = async () => {
    let res =
      await _unitOfWork.schedulePreventive.getTotalMySchedulePreventiveTaskAssignUserStatus();
    if (res && res.code === 1) {
      setTotalMySchedulePreventiveTaskAssignUserStatuses(res.data);
    }
  };
  const fetchGetTotalMyBreakdownAssignUserStatuses = async () => {
    let res =
      await _unitOfWork.breakdownAssignUser.getTotalMyBreakdownAssignUserStatus();
    if (res && res.code === 1) {
      setTotalMyBreakdownAssignUserStatuses(res.data);
    }
  };
  const fetchGetTotalAmcByState = async () => {
    let res = await _unitOfWork.amc.totalAmcByState();
    if (res && res.code === 1) {
      setTotalAmcByState(res.data);
    }
  };
  const fetchGetTotalCalibrationWorkByGroupStatus = async () => {
    let res =
      await _unitOfWork.calibrationWork.getTotalCalibrationWorkByGroupStatus();
    if (res && res.code === 1) {
      setTotalCalibrationWorkByGroupStatus(
        res?.totalCalibrationWorkByGroupStatus,
      );
    }
  };
  const fetchGetTotalCalibrationWorkAssignUserByStatus = async () => {
    let res =
      await _unitOfWork.calibrationWork.getTotalCalibrationWorkAssignUserByStatus();
    if (res && res.code === 1) {
      setTotalCalibrationWorkAssignUserByStatus(
        res?.totalCalibrationWorkAssignUserByStatus,
      );
    }
  };
  return (
    <div className="mt-3 dashbroad-tab">
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={12}>
          <Card variant="borderless" className="wp-100">
            <Meta
              avatar={<HomeOutlined />}
              title={t("dashboard.cards.preventive.title")}
            />
            <div className="preventive-card">
              <div
                className="preventive-item"
                onClick={() => {
                  setValueSearch(null);
                  navigate(
                    `${staticPath.workSchedulePreventive}?ticketStatus=new`,
                  );
                }}
              >
                <div>
                  {totalSchedulePreventiveStatuses
                    ? totalSchedulePreventiveStatuses?.totalSchedulePreventiveTicketStatusNews
                    : 0}
                </div>
                <div>{t("dashboard.status.new")}</div>
              </div>
              <div
                className="preventive-item"
                onClick={() => {
                  setValueSearch(null);
                  navigate(
                    `${staticPath.workSchedulePreventive}?ticketStatus=inProgress`,
                  );
                }}
              >
                <div>
                  {totalSchedulePreventiveStatuses
                    ? totalSchedulePreventiveStatuses?.totalSchedulePreventiveTicketStatusInProgress
                    : 0}
                </div>
                <div>{t("dashboard.status.in_progress")}</div>
              </div>
              <div
                className="preventive-item"
                onClick={() => {
                  setValueSearch(null);
                  navigate(
                    `${staticPath.workSchedulePreventive}?ticketStatus=overdue`,
                  );
                }}
              >
                <div>
                  {totalSchedulePreventiveStatuses
                    ? totalSchedulePreventiveStatuses?.totalSchedulePreventiveStatusOverdues
                    : 0}
                </div>
                <div>{t("dashboard.status.overdue")}</div>
              </div>
              <div
                className="preventive-item"
                onClick={() => {
                  setValueSearch(null);
                  navigate(
                    `${staticPath.workSchedulePreventive}?ticketStatus=upcoming`,
                  );
                }}
              >
                <div>
                  {totalSchedulePreventiveStatuses
                    ? totalSchedulePreventiveStatuses?.totalSchedulePreventiveTicketStatusUpcomings
                    : 0}
                </div>
                <div>{t("dashboard.status.upcoming")}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless" className="wp-100">
            <Meta
              avatar={<HomeOutlined />}
              title={t("dashboard.cards.my_tasks.title")}
            />
            <div className="amc-callout-card">
              <div
                className="amc-callout-item"
                onClick={() => {
                  setValueSearchMySchedule(null);
                  navigate(
                    `${staticPath.mySchedulePreventive}?ticketStatus=new`,
                  );
                }}
              >
                <div>
                  {totalMySchedulePreventiveTaskAssignUserStatuses
                    ? totalMySchedulePreventiveTaskAssignUserStatuses?.totalSchedulePreventiveTaskAssignUserStatusNews
                    : 0}
                </div>
                <div>{t("dashboard.status.new")}</div>
              </div>
              <div
                className="amc-callout-item"
                onClick={() => {
                  setValueSearchMySchedule(null);
                  navigate(
                    `${staticPath.mySchedulePreventive}?ticketStatus=inProgress`,
                  );
                }}
              >
                <div>
                  {totalMySchedulePreventiveTaskAssignUserStatuses
                    ? totalMySchedulePreventiveTaskAssignUserStatuses?.totalSchedulePreventiveTaskAssignUserStatusInProgress
                    : 0}
                </div>
                <div>{t("dashboard.status.in_progress")}</div>
              </div>
              <div
                className="amc-callout-item"
                onClick={() => {
                  setValueSearchMySchedule(null);
                  navigate(
                    `${staticPath.mySchedulePreventive}?ticketStatus=overdue`,
                  );
                }}
              >
                <div>
                  {totalMySchedulePreventiveTaskAssignUserStatuses
                    ? totalMySchedulePreventiveTaskAssignUserStatuses?.totalSchedulePreventiveTaskAssignUserStatusOverdues
                    : 0}
                </div>
                <div>{t("dashboard.status.overdue")}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless" className="wp-100">
            <Meta
              avatar={<HomeOutlined />}
              title={t("dashboard.cards.breakdown.title")}
            />
            <div className="breakdown-card">
              <div
                className="breakdown-item"
                onClick={() => {
                  setValueSearchBreakdown(null);
                  navigate(`${staticPath.workOrderBreakdown}?ticketStatus=new`);
                }}
              >
                <div>
                  {totalBreakdownStatues
                    ? totalBreakdownStatues?.totalBreakdownTicketStatusNews
                    : 0}
                </div>
                <div>{t("dashboard.status.new")}</div>
              </div>
              <div
                className="breakdown-item"
                onClick={() => {
                  setValueSearchBreakdown(null);
                  navigate(
                    `${staticPath.workOrderBreakdown}?ticketStatus=inProgress`,
                  );
                }}
              >
                <div>
                  {totalBreakdownStatues
                    ? totalBreakdownStatues?.totalBreakdownTicketStatusInProgress
                    : 0}
                </div>
                <div>{t("dashboard.status.in_progress")}</div>
              </div>
              <div
                className="breakdown-item"
                onClick={() => {
                  setValueSearchBreakdown(null);
                  navigate(
                    `${staticPath.workOrderBreakdown}?ticketStatus=overdue`,
                  );
                }}
              >
                <div>
                  {totalBreakdownStatues
                    ? totalBreakdownStatues?.totalBreakdownStatusOverdues
                    : 0}
                </div>
                <div>{t("dashboard.status.overdue")}</div>
              </div>
              <div
                className="breakdown-item"
                onClick={() => {
                  setValueSearchBreakdown(null);
                  navigate(
                    `${staticPath.workOrderBreakdown}?ticketStatus=completed`,
                  );
                }}
              >
                <div>
                  {totalBreakdownStatues
                    ? totalBreakdownStatues?.totalBreakdownTicketStatusCompleteds
                    : 0}
                </div>
                <div>{t("dashboard.status.completed")}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless" className="wp-100">
            <Meta
              avatar={<HomeOutlined />}
              title={t("dashboard.cards.my_tickets.title")}
            />
            <div className="nc-callout-card">
              <div
                className="nc-callout-item"
                onClick={() => {
                  setValueSearchMyBreakdown(null);
                  navigate(
                    `${staticPath.workOrderMyBreakdown}?ticketStatus=new`,
                  );
                }}
              >
                <div>
                  {totalMyBreakdownAssignUserStatuses
                    ? totalMyBreakdownAssignUserStatuses?.totalMyBreakdownAssignUserStatusNews
                    : 0}
                </div>
                <div>{t("dashboard.status.new")}</div>
              </div>
              <div
                className="nc-callout-item"
                onClick={() => {
                  setValueSearchMyBreakdown(null);
                  navigate(
                    `${staticPath.workOrderMyBreakdown}?ticketStatus=inProgress`,
                  );
                }}
              >
                <div>
                  {totalMyBreakdownAssignUserStatuses
                    ? totalMyBreakdownAssignUserStatuses?.totalMyBreakdownAssignUserStatusInProgress
                    : 0}
                </div>
                <div>{t("dashboard.status.in_progress")}</div>
              </div>
              <div
                className="nc-callout-item"
                onClick={() => {
                  setValueSearchMyBreakdown(null);
                  navigate(
                    `${staticPath.workOrderMyBreakdown}?ticketStatus=overdue`,
                  );
                }}
              >
                <div>
                  {totalMyBreakdownAssignUserStatuses
                    ? totalMyBreakdownAssignUserStatuses?.totalMyBreakdownAssignUserStatusOverdues
                    : 0}
                </div>
                <div>{t("dashboard.status.overdue")}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless" className="wp-100">
            <Meta
              avatar={<HomeOutlined />}
              title={t("dashboard.cards.calibration")}
            />
            <div className="calibration-card">
              <div
                className="calibration-item"
                onClick={() => {
                  navigate(
                    `${staticPath.calibrationTask}?groupStatus=${calibrationGroupStatus.new}`,
                  );
                }}
              >
                <div>
                  {totalCalibrationWorkByGroupStatus?.totalCalibrationWorkByNews ||
                    0}
                </div>
                <div>{t("dashboard.status.new")}</div>
              </div>
              <div
                className="calibration-item"
                onClick={() => {
                  navigate(
                    `${staticPath.calibrationTask}?groupStatus=${calibrationGroupStatus.inProgress}`,
                  );
                }}
              >
                <div>
                  {totalCalibrationWorkByGroupStatus?.totalCalibrationWorkByinProgress ||
                    0}
                </div>
                <div>{t("dashboard.status.in_progress")}</div>
              </div>
              <div
                className="calibration-item"
                onClick={() => {
                  navigate(
                    `${staticPath.calibrationTask}?groupStatus=${calibrationGroupStatus.overdue}`,
                  );
                }}
              >
                <div>
                  {totalCalibrationWorkByGroupStatus?.totalCalibrationWorkByOverdues ||
                    0}
                </div>
                <div>{t("dashboard.status.overdue")}</div>
              </div>
              <div
                className="calibration-item"
                onClick={() => {
                  navigate(
                    `${staticPath.calibrationTask}?groupStatus=${calibrationGroupStatus.upcoming}`,
                  );
                }}
              >
                <div>
                  {totalCalibrationWorkByGroupStatus?.totalCalibrationWorkByUpcomings ||
                    0}
                </div>
                <div>{t("dashboard.status.upcoming")}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless" className="wp-100">
            <Meta
              avatar={<HomeOutlined />}
              title={t("dashboard.cards.my_calibration_card")}
            />
            <div className="my-calibration-card">
              <div
                className="my-calibration-card-item"
                onClick={() => {
                  navigate(
                    `${staticPath.myCalibrationTask}?groupStatus=${calibrationGroupStatus.new}`,
                  );
                }}
              >
                <div>
                  {totalCalibrationWorkAssignUserByStatus?.totalCalibrationWorkAssignUserByNews ||
                    0}
                </div>
                <div>{t("dashboard.status.new")}</div>
              </div>
              <div
                className="my-calibration-card-item"
                onClick={() => {
                  navigate(
                    `${staticPath.myCalibrationTask}?groupStatus=${calibrationGroupStatus.inProgress}`,
                  );
                }}
              >
                <div>
                  {totalCalibrationWorkAssignUserByStatus?.totalCalibrationWorkAssignUserByinProgress ||
                    0}
                </div>
                <div>{t("dashboard.status.in_progress")}</div>
              </div>
              <div
                className="my-calibration-card-item"
                onClick={() => {
                  navigate(
                    `${staticPath.myCalibrationTask}?groupStatus=${calibrationGroupStatus.overdue}`,
                  );
                }}
              >
                <div>
                  {totalCalibrationWorkAssignUserByStatus?.totalCalibrationWorkAssignUserByOverdues ||
                    0}
                </div>
                <div>{t("dashboard.status.overdue")}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <AssetSummary />
      </Row>
      <Row className="mt-4">
        <Radio.Group
          block
          options={optionDateType}
          value={dateRangeType}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => setDateRangeType(e.target.value)}
        />
        <Tabs
          defaultActiveKey={"1"}
          items={items}
          onChange={(activeKey) => setTabKeyPreventiveAndBreakdown(activeKey)}
          className="tab-all tabs-chart-column wp-100"
        />
      </Row>
      <KeyIndicator />
      <HumanResourceIndicators />
    </div>
  );
}
