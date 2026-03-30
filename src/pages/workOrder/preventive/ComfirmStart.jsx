import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  InputNumber,
  Select,
  Input,
} from "antd";
import { CheckSquareFilled } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import dayjs from "dayjs";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";
import {
  dateType,
  frequencyOptions,
  measuringTypeOptions,
  monitoringType,
  ScheduleBasedOnType,
} from "../../../utils/constant";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import Card from "antd/es/card/Card";
import { filterOption } from "../../../helper/search-select-helper";
import TimeInput from "../../../components/common/TimeInput";

export default function ComfirmStart({
  open,
  hanldeColse,
  onReset,
  preventive,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [monitoring, setMonitoring] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (
      open &&
      preventive?.actualScheduleDate &&
      preventive?.isStart === true
    ) {
      const date = dayjs(preventive.actualScheduleDate);
      form.setFieldsValue({
        date: date,
        time: date,
        ...preventive,
      });
    } else {
      form.resetFields();
    }
    if (preventive?.assetMaintenanceMonitoringPoint) {
      fetchGetMonitoring();
    }
    if (open && preventive) {
      fetchGetAllUser();
    }
  }, [open, preventive, form]);
  const fetchGetMonitoring = async () => {
    let res =
      await _unitOfWork.assetModelMonitoringPoint.getAssetModelMonitoringPointById(
        { id: preventive?.assetMaintenanceMonitoringPoint }
      );
    if (res && res.code === 1) {
      setMonitoring(res?.data);
    }
  };
  const fetchGetAllUser = async () => {
    let res = await _unitOfWork.user.getAllUser();
    if (res && res.code === 1) {
      setUsers(res?.data);
    }
  };
  const onFinish = async (values) => {
    if (preventive.isStart === true) {
      let res = await _unitOfWork.preventive.stopPreventive({
        data: {
          preventive: preventive._id,
        },
      });
      if (res && res.code === 1) {
        ShowSuccess(
          "topRight",
          t("preventive.start_modal.title_stop"),
          t("preventive.start_modal.success_stop")
        );
        onReset();
        hanldeColse();
      }
      return;
    }
    if (preventive.isStart === false) {
      const date = values.date;
      const time = values.time;
      const dateTime = dayjs(date)
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .toDate();
      let res = await _unitOfWork.preventive.startPreventive({
        actualScheduleDate: dateTime,
        preventive: preventive._id,
        initialValue: values?.initialValue,
        frequency: values?.frequency,
        cycle: values?.cycle,
        supervisor: values?.supervisor,
      });
      if (res && res.code === 1) {
        ShowSuccess(
          "topRight",
          t("preventive.start_modal.title_start"),
          t("preventive.start_modal.success_start")
        );
        onReset();
        hanldeColse();
        form.resetFields();
      }
    }
  };

  return (
    <Modal
      className="custom-modal"
      open={open}
      footer={null}
      width={"40%"}
      destroyOnClose
      closable={false}
    >
      <Card
        title={
          preventive?.isStart
            ? t("preventive.start_modal.title_stop")
            : t("preventive.start_modal.title_start")
        }
      >
        <Form
labelWrap
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <div style={{ background: "#fff" }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={t("preventive.start_modal.date")}
                  name="date"
                  labelAlign="left"
                  rules={
                    preventive.isStart
                      ? []
                      : [
                          {
                            required: true,
                            message: t("preventive.validation.required_date"),
                          },
                        ]
                  }
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabled={preventive.isStart}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t("preventive.start_modal.time")}
                  name="time"
                  labelAlign="left"
                  rules={
                    preventive.isStart
                      ? []
                      : [
                          {
                            required: true,
                            message: t("preventive.validation.required_time"),
                          },
                        ]
                  }
                >
                  <TimeInput
                    // style={{ width: "100%" }}
                    format="HH:mm"
                    disabled={preventive.isStart}
                  />
                </Form.Item>
              </Col>
              {monitoring?.measuringType ===
                measuringTypeOptions.Incremental && (
                <Col span={24}>
                  <Form.Item
                    label={t("preventive.start_modal.initial_value")}
                    name="initialValue"
                    labelAlign="left"
                  >
                    <InputNumber
                      defaultValue={0}
                      style={{ width: "100%" }}
                      formatter={formatCurrency}
                      parser={parseCurrency}
                      disabled={preventive.isStart}
                    />
                  </Form.Item>
                </Col>
              )}
              {
                // preventive?.scheduleType === ScheduleBasedOnType.Monitoring ||
                // preventive?.scheduleType ===
                //   ScheduleBasedOnType.CalendarOrMonitoring ||
                preventive?.scheduleType ===
                  ScheduleBasedOnType.ConditionBasedSchedule && (
                  <Col span={24}>
                    <Form.Item
                      label={t("preventive.start_modal.supervisor")}
                      name="supervisor"
                      labelAlign="left"
                      rules={
                        preventive.isStart
                          ? []
                          : [
                              {
                                required: true,
                                message: t(
                                  "preventive.validation.required_superviror"
                                ),
                              },
                            ]
                      }
                    >
                      <Select
                        allowClear
                        placeholder={t(
                          "preventive.form.superviror_placeholder"
                        )}
                        showSearch
                        options={users?.map((item) => ({
                          value: item.id,
                          label: item.fullName,
                        }))}
                        filterOption={filterOption}
                        disabled={preventive.isStart}
                      ></Select>
                    </Form.Item>
                  </Col>
                )
              }
              {preventive?.scheduleType ===
                ScheduleBasedOnType.ConditionBasedSchedule && (
                <>
                  {" "}
                  <Col span={12}>
                    <Form.Item
                      label={t("preventive.form.frequency")}
                      name="frequency"
                      labelAlign="left"
                      rules={
                        preventive.isStart
                          ? []
                          : [
                              {
                                required: true,
                                message: t(
                                  "preventive.validation.required_frequency"
                                ),
                              },
                            ]
                      }
                    >
                      <Input
                        disabled={preventive.isStart}
                        placeholder={t(
                          "preventive.validation.required_frequency"
                        )}
                        type="number"
                        min={1}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("preventive.form.cycle")}
                      name="cycle"
                      labelAlign="left"
                      rules={
                        preventive.isStart
                          ? []
                          : [
                              {
                                required: true,
                                message: t(
                                  "preventive.validation.required_cycle"
                                ),
                              },
                            ]
                      }
                    >
                      <Select
                        placeholder={t("preventive.validation.required_cycle")}
                        disabled={preventive.isStart}
                        options={(dateType.Options || []).map((item) => ({
                          key: item.value,
                          value: item.value,
                          label: item.label,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
            <Row justify="center" gutter={8}>
              <Col>
                <Button onClick={hanldeColse}>
                  {t("preventive.buttons.cancel")}
                </Button>
              </Col>
              <Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<CheckSquareFilled />}
                    htmlType="submit"
                  >
                    {preventive.isStart
                      ? t("preventive.buttons.stop")
                      : t("preventive.buttons.start")}
                  </Button>
                </Col>
              </Col>
            </Row>
          </div>
        </Form>
      </Card>
    </Modal>
  );
}
