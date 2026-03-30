import { RetweetOutlined, SwapOutlined } from "@ant-design/icons";
import { Col, Row, Card, Form, Select, Button } from "antd";
import { Column } from "@ant-design/plots";
import React, { useEffect, useState } from "react";
import "./index.scss";
import * as _unitOfWork from "../../api";
import { filterOption } from "../../helper/search-select-helper";
import CompareSchedulePreventiveScheduleAndCompleteChart from "./components/CompareSchedulePreventiveScheduleAndCompleteChart";
import CompareBreakdownScheduleAndCompleteChart from "./components/CompareBreakdownScheduleAndCompleteChart";
import { parseToLabel } from "../../helper/parse-helper";
import { ticketSchedulePreventiveStatus } from "../../utils/constant";
import { useTranslation } from "react-i18next";

export default function ComparisonDashbroard() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [dateRangeType] = useState("day");
  const [tabKeyPreventiveAndBreakdown, setTabKeyPreventiveAndBreakdown] =
    useState("1");
  const [dataConpareSchedules, setDataConpareSchedules] = useState([]);
  const [dataConpareBreakdowns, setDataConpareBreakdowns] = useState([]);
  const [dataConpareCalibrationWorks, setDataConpareCalibrationWorks] =
    useState([]);
  useEffect(() => {
    fetchGetAllCustomer();
  }, []);

  const fetchCompare = async () => {
    let values = form.getFieldsValue();
    let res =
      await _unitOfWork.report.compareStatusSchedulePreventiveAndBreakdownByCustomer(
        {
          customer1: values.customer1,
          customer2: values.customer2,
        },
      );
    if (res && res.code === 1) {
      const { customer1ScheduleData, customer2ScheduleData } =
        res.data?.dataSchedule;
      const { customer1BreakdownData, customer2BreakdownData } =
        res.data?.dataBreakdown;
      const { customer1CalibrationWork, customer2CalibrationWork } =
        res.data?.dataCalibrationWork;
      if (customer1ScheduleData.name === customer2ScheduleData.name) {
        customer1ScheduleData.name = customer1ScheduleData.name + `(1)`;
        customer2ScheduleData.name = customer2ScheduleData.name + `(2)`;
      }
      if (customer1BreakdownData.name === customer2BreakdownData.name) {
        customer1BreakdownData.name = customer1BreakdownData.name + `(1)`;
        customer2BreakdownData.name = customer2BreakdownData.name + `(2)`;
      }
      if (customer1CalibrationWork.name === customer2CalibrationWork.name) {
        customer1CalibrationWork.name = customer1CalibrationWork.name + `(1)`;
        customer2CalibrationWork.name = customer2CalibrationWork.name + `(2)`;
      }
      const mapStatus = (statusKey) =>
        t(
          "dashboard.status." +
            (statusKey === "inProgress" ? "in_progress" : statusKey),
        );

      const dataScheduleCustomer1Map = [
        {
          customerName: customer1ScheduleData.name,
          value: customer1ScheduleData.new,
          type: mapStatus("new"),
        },
        {
          customerName: customer1ScheduleData.name,
          value: customer1ScheduleData.inProgress,
          type: mapStatus("inProgress"),
        },
        {
          customerName: customer1ScheduleData.name,
          value: customer1ScheduleData.overdue,
          type: mapStatus("overdue"),
        },
      ];
      const dataScheduleCustomer2Map = [
        {
          customerName: customer2ScheduleData.name,
          value: customer2ScheduleData.new,
          type: mapStatus("new"),
        },
        {
          customerName: customer2ScheduleData.name,
          value: customer2ScheduleData.inProgress,
          type: mapStatus("inProgress"),
        },
        {
          customerName: customer2ScheduleData.name,
          value: customer2ScheduleData.overdue,
          type: mapStatus("overdue"),
        },
      ];
      const dataCalibrationWorkCustomer1Map = [
        {
          customerName: customer1CalibrationWork.name,
          value: customer1CalibrationWork.new,
          type: mapStatus("new"),
        },
        {
          customerName: customer1CalibrationWork.name,
          value: customer1CalibrationWork.inProgress,
          type: mapStatus("inProgress"),
        },
        {
          customerName: customer1CalibrationWork.name,
          value: customer1CalibrationWork.overdue,
          type: mapStatus("overdue"),
        },
      ];
      const dataCalibrationWorkCustomer2Map = [
        {
          customerName: customer2CalibrationWork.name,
          value: customer2CalibrationWork.new,
          type: mapStatus("new"),
        },
        {
          customerName: customer2CalibrationWork.name,
          value: customer2CalibrationWork.inProgress,
          type: mapStatus("inProgress"),
        },
        {
          customerName: customer2CalibrationWork.name,
          value: customer2CalibrationWork.overdue,
          type: mapStatus("overdue"),
        },
      ];
      const dataBreakdownCustomer1Map = [
        {
          customerName: customer1BreakdownData.name,
          value: customer1BreakdownData.new,
          type: mapStatus("new"),
        },
        {
          customerName: customer1BreakdownData.name,
          value: customer1BreakdownData.inProgress,
          type: mapStatus("inProgress"),
        },
        {
          customerName: customer1BreakdownData.name,
          value: customer1BreakdownData.overdue,
          type: mapStatus("overdue"),
        },
      ];
      const dataBreakdownCustomer2Map = [
        {
          customerName: customer2BreakdownData.name,
          value: customer2BreakdownData.new,
          type: mapStatus("new"),
        },
        {
          customerName: customer2BreakdownData.name,
          value: customer2BreakdownData.inProgress,
          type: mapStatus("inProgress"),
        },
        {
          customerName: customer2BreakdownData.name,
          value: customer2BreakdownData.overdue,
          type: mapStatus("overdue"),
        },
      ];

      setDataConpareBreakdowns([
        ...dataBreakdownCustomer1Map,
        ...dataBreakdownCustomer2Map,
      ]);
      setDataConpareSchedules([
        ...dataScheduleCustomer1Map,
        ...dataScheduleCustomer2Map,
      ]);
      setDataConpareCalibrationWorks([
        ...dataCalibrationWorkCustomer1Map,
        ...dataCalibrationWorkCustomer2Map,
      ]);
    }
  };

  const fetchGetAllCustomer = async () => {
    let res = await _unitOfWork.customer.getAllCustomer();
    if (res && res.code === 1) {
      setCustomers(res?.data);
    }
  };
  const onFinish = () => {
    fetchCompare();
  };
  const configSchedule = (_data) => ({
    data: _data,
    xField: "customerName",
    yField: "value",
    stack: true,
    colorField: "type",
    style: { maxWidth: 80 },
    label: {
      text: (datum) => (datum.value === 0 ? "" : datum.value),
      textBaseline: "bottom",
      position: "inside",
    },
  });
  const onClickReset = () => {
    form.setFieldsValue({
      customer1: null,
      customer2: null,
    });
    setDataConpareBreakdowns([]);
    setDataConpareSchedules([]);
  };

  return (
    <div className="mt-3 dashbroad-tab" >
      <Form
        labelWrap
        className="search-form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]} className="mb-3">
          <Col span={8}>
            <Form.Item
              label={t("dashboard.comparison.user1_label")}
              name="customer1"
              rules={[
                {
                  required: true,
                  message: t("dashboard.comparison.user1_required"),
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder={t("dashboard.comparison.user1_placeholder")}
                options={(customers || []).map((item) => ({
                  key: item.id,
                  value: item.id,
                  label: item.customerName,
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t("dashboard.comparison.user2_label")}
              name="customer2"
              rules={[
                {
                  required: true,
                  message: t("dashboard.comparison.user2_required"),
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder={t("dashboard.comparison.user2_placeholder")}
                options={(customers || []).map((item) => ({
                  key: item.id,
                  value: item.id,
                  label: item.customerName,
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={8} className="mt-4">
            <Button type="primary" htmlType="submit" className="ml-2">
              <SwapOutlined />
              {t("dashboard.comparison.compare")}
            </Button>
            <Button
              type="default"
              onClick={onClickReset}
              className="ml-2 bt-green"
            >
              <RetweetOutlined />
              {t("dashboard.comparison.reset")}
            </Button>
          </Col>
        </Row>

        {dataConpareSchedules.length > 0 &&
          dataConpareBreakdowns.length > 0 && (
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title={t("dashboard.comparison.schedule_status_card")}>
                  <Row className="mt-3">
                    <Column {...configSchedule(dataConpareSchedules)} />
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card title={t("dashboard.comparison.breakdown_status_card")}>
                  <Row className="mt-3">
                    <Column {...configSchedule(dataConpareBreakdowns)} />
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card title={t("dashboard.comparison.calibration_status_card")}>
                  <Row className="mt-3">
                    <Column {...configSchedule(dataConpareCalibrationWorks)} />
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
      </Form>
    </div>
  );
}
