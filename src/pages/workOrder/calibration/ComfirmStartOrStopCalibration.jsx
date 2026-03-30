import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Card,
} from "antd";
import { CheckSquareFilled } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import dayjs from "dayjs";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";
import ShowError from "../../../components/modal/result/errorNotification";
import TimeInput from "../../../components/common/TimeInput";

export default function ComfirmStartOrStopCalibration({
  open,
  hanldeColse,
  onReset,
  calibration,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  useEffect(() => {
    if (open && calibration?.startDate && calibration?.isStart === true) {
      const date = dayjs(calibration.startDate);
      form.setFieldsValue({
        date: date,
        time: date,
      });
    } else {
      form.resetFields();
    }
  }, [open, calibration, form]);
  const onFinish = async (values) => {
    if (calibration.isStart === true) {
      let res = await _unitOfWork.calibration.stopCalibration({
        id: calibration?._id,
      });
      if (res && res.code === 1) {
        ShowSuccess(
          "topRight",
          t("common.notifications"),
          t("common.messages.success.successfully")
        );
        onReset();
        hanldeColse();
      }
      return;
    }
    if (calibration?.isStart === false) {
      const date = values.date;
      const time = values.time;
      const dateTime = dayjs(date)
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .toDate();

      let res = await _unitOfWork.calibration.startCalibration({
        startDate: dateTime,
        id: calibration?._id,
      });
      if (res && res.code === 1) {
        ShowSuccess(
          "topRight",
          t("common.notifications"),
          t("common.messages.success.successfully")
        );
        onReset();
        hanldeColse();
        form.resetFields();
      } else {
        ShowError(
          "topRight",
          t("common.notifications"),
          t("common.messages.errors.failed")
        );
      }
    }
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
      <Card
        title={
          calibration?.isStart
            ? t("calibration.buttons.stop")
            : t("calibration.buttons.start")
        }
      >
        <Form labelWrap form={form} onFinish={onFinish}>
          <div style={{ background: "#fff" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("preventive.start_modal.date")}
                  name="date"
                  rules={
                    calibration.isStart
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
                    disabled={calibration.isStart}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("preventive.start_modal.time")}
                  name="time"
                  rules={
                    calibration.isStart
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
                    style={{ width: "100%" }}
                    format="HH:mm"
                    disabled={calibration.isStart}
                  />
                </Form.Item>
              </Col>
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
                    {calibration.isStart
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
