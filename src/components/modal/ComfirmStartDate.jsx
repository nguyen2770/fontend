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
  Card,
} from "antd";
import {
  CheckSquareFilled,
  CloseCircleOutlined,
  CloseSquareFilled,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  measuringTypeOptions,
  monitoringType,
  ScheduleBasedOnType,
} from "../../utils/constant";
import { formatCurrency, parseCurrency } from "../../helper/price-helper";
import TimeInput from "../common/TimeInput";

export default function ComfirmStartDate({
  open,
  hanldeColse,
  onCallBack,
  preventiveOfModel,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => { }, [open]);
  const onFinish = () => {
    const values = form.getFieldsValue();
    const date = values.date;
    const time = values.time;
    const dateTime = dayjs(date)
      .hour(time.hour())
      .minute(time.minute())
      .second(0)
      .toDate();

    onCallBack(dateTime, values?.initialValue);
    form.resetFields();
    hanldeColse();
  };

  return (
    <Modal
      open={open}
      footer={null}
      width={"40%"}
      destroyOnClose
      closable={false}
      className="custom-modal"
    >
      <Card title={t("preventive.start_modal.title_start")}>
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
                  labelAlign="left"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: t("preventive.validation.required_date"),
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
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
                  rules={[
                    {
                      required: true,
                      message: t("preventive.validation.required_time"),
                    },
                  ]}
                >
                  <TimeInput format="HH:mm" placeholder="Enter time" />

                </Form.Item>
              </Col>
              {preventiveOfModel?.assetMaintenanceMonitoringPoint
                ?.measuringType === measuringTypeOptions.Incremental && (
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
                      />
                    </Form.Item>
                  </Col>
                )}
            </Row>
            <Row justify="center" gutter={8}>
              <Col>
                <Button onClick={hanldeColse}>
                  <CloseCircleOutlined /> {t("preventive.buttons.cancel")}
                </Button>
              </Col>
              <Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<CheckSquareFilled />}
                    htmlType="submit"
                  >
                    {t("preventive.buttons.start")}
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
