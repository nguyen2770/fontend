import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  FORMAT_DATE,
  frequencyAllOptions,
  weekDaysOptions,
} from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import { filterOption } from "../../../helper/search-select-helper";

export default function Calendar({
  form,
  assetMaintenanceSchedule,
  preventive,
}) {
  const { t } = useTranslation();
  const [calendarEndType, setCalendarEndType] = useState("no-end-date");
  const [frequencyValue, setFrequencyValue] = useState();

  useEffect(() => {
    if (assetMaintenanceSchedule) {
      setFrequencyValue(assetMaintenanceSchedule.meter_frequency_type);
      setCalendarEndType(assetMaintenanceSchedule.schedule_stop_interval);
    }
  }, [assetMaintenanceSchedule]);

  useEffect(() => {
    if (preventive) {
      setCalendarEndType(preventive.calendarType || "no-end-date");
      setFrequencyValue(preventive.frequencyType);
    }
  }, [preventive]);

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i,
  }));

  return (
    <Col span={20} className="ml-2">
      <Card
        title={
          <span>
            <ClockCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
            {t("common.modal.calendarSchedule.titles.calendar_based")}
          </span>
        }
        style={{ minHeight: 300 }}
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label={t("common.modal.calendarSchedule.fields.frequency_type")}
              name="frequencyType"
              required
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t(
                    "common.modal.calendarSchedule.validation.required_frequency"
                  ),
                },
              ]}
            >
              <Select
                options={(frequencyAllOptions.Option || []).map((item) => ({
                  key: item.value,
                  value: item.value,
                  // item.label đã có thể là i18n key, nếu đúng thì:
                  label: t(item.label),
                }))}
                placeholder={t(
                  "common.modal.calendarSchedule.placeholders.select_frequency"
                )}
                onChange={(value) => {
                  setFrequencyValue(value);
                  form.setFieldsValue({
                    calenderFrequencyDuration: undefined,
                    scheduleRepeatDays: undefined,
                    scheduleRepeatHours: undefined,
                    scheduleDate: undefined,
                  });
                }}
                allowClear
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>

          {frequencyValue === "Hours" && (
            <>
              <Col span={12}>
                <Form.Item
                  label={t("common.modal.calendarSchedule.fields.hours")}
                  name="calenderFrequencyDuration"
                  required
                  rules={[
                    {
                      required: true,
                      message: t(
                        "common.modal.calendarSchedule.validation.required_hours"
                      ),
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                    placeholder={t(
                      "common.modal.calendarSchedule.placeholders.input_hours"
                    )}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t(
                    "common.modal.calendarSchedule.fields.repeat_week_days"
                  )}
                  name="scheduleRepeatDays"
                  labelAlign="left"
                  required
                  rules={[
                    {
                      required: true,
                      message: t(
                        "common.modal.calendarSchedule.validation.required_week_days"
                      ),
                    },
                  ]}
                >
                  <Checkbox.Group
                    options={weekDaysOptions.map((o) => ({
                      ...o,
                      label: t(o.label),
                    }))}
                    style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          {frequencyValue === "RepeatHours" && (
            <>
              <Col span={24}>
                <Form.Item
                  label={t(
                    "common.modal.calendarSchedule.fields.repeat_week_days"
                  )}
                  name="scheduleRepeatDays"
                  labelAlign="left"
                  required
                  rules={[
                    {
                      required: true,
                      message: t(
                        "common.modal.calendarSchedule.validation.required_week_days"
                      ),
                    },
                  ]}
                >
                  <Checkbox.Group
                    options={weekDaysOptions.map((o) => ({
                      ...o,
                      label: t(o.label),
                    }))}
                    style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t("common.modal.calendarSchedule.fields.repeat_hours")}
                  name="scheduleRepeatHours"
                  labelAlign="left"
                >
                  <Checkbox.Group
                    options={hourOptions}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 60px)",
                      gap: 8,
                    }}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          {frequencyValue === "Days" && (
            <Col span={12}>
              <Form.Item
                label={t("common.modal.calendarSchedule.fields.days")}
                name="calenderFrequencyDuration"
                required
                rules={[
                  {
                    required: true,
                    message: t(
                      "common.modal.calendarSchedule.validation.required_days"
                    ),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  placeholder={t(
                    "common.modal.calendarSchedule.placeholders.input_days"
                  )}
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            </Col>
          )}

          {frequencyValue === "Date" && (
            <Col span={12}>
              <Form.Item
                label={t("common.modal.calendarSchedule.fields.date")}
                name="scheduleDate"
                required
                rules={[
                  {
                    required: true,
                    message: t(
                      "common.modal.calendarSchedule.validation.required_date"
                    ),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={FORMAT_DATE}
                  placeholder={t(
                    "common.modal.calendarSchedule.placeholders.input_date"
                  )}
                />
              </Form.Item>
            </Col>
          )}

          {frequencyValue === "RepeaetWeekDays" && (
            <Col span={24}>
              <Form.Item
                label={t(
                  "common.modal.calendarSchedule.fields.repeat_week_days"
                )}
                name="scheduleRepeatDays"
                labelAlign="left"
                required
                rules={[
                  {
                    required: true,
                    message: t(
                      "common.modal.calendarSchedule.validation.required_week_days"
                    ),
                  },
                ]}
              >
                <Checkbox.Group
                  options={weekDaysOptions.map((o) => ({
                    ...o,
                    label: t(o.label),
                  }))}
                  style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
                />
              </Form.Item>
            </Col>
          )}

          {frequencyValue === "Weeks" && (
            <Col span={12}>
              <Form.Item
                label={t("common.modal.calendarSchedule.fields.weeks")}
                name="calenderFrequencyDuration"
                required
                rules={[
                  {
                    required: true,
                    message: t(
                      "common.modal.calendarSchedule.validation.required_weeks"
                    ),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  placeholder={t(
                    "common.modal.calendarSchedule.placeholders.input_weeks"
                  )}
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            </Col>
          )}

          {frequencyValue === "Months" && (
            <Col span={12}>
              <Form.Item
                label={t("common.modal.calendarSchedule.fields.months")}
                name="calenderFrequencyDuration"
                required
                rules={[
                  {
                    required: true,
                    message: t(
                      "common.modal.calendarSchedule.validation.required_months"
                    ),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  placeholder={t(
                    "common.modal.calendarSchedule.placeholders.input_months"
                  )}
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            </Col>
          )}

          {frequencyValue === "Years" && (
            <Col span={12}>
              <Form.Item
                label={t("common.modal.calendarSchedule.fields.years")}
                name="calenderFrequencyDuration"
                required
                rules={[
                  {
                    required: true,
                    message: t(
                      "common.modal.calendarSchedule.validation.required_years"
                    ),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  placeholder={t(
                    "common.modal.calendarSchedule.placeholders.input_years"
                  )}
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Form.Item>
          <Radio.Group
            value={calendarEndType}
            onChange={(e) => {
              setCalendarEndType(e.target.value);
              form.setFieldValue("calendarType", e.target.value);
              if (e.target.value === "no-end-date") {
                form.setFieldValue("calendarEndBy", null);
                form.setFieldValue("calendarEndAfter", null);
              } else if (e.target.value === "end-after") {
                form.setFieldValue("calendarEndBy", null);
              } else if (e.target.value === "end-by") {
                form.setFieldValue("calendarEndAfter", null);
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
            labelAlign="left"
          >
            {frequencyValue !== "Date" && (
              <Row gutter={32} style={{ gap: 10 }}>
                <Col span={10}>
                  <Radio value="no-end-date">
                    {t("common.modal.calendarSchedule.fields.end_type_no_end")}
                  </Radio>
                </Col>
                <Col span={12}></Col>
                <Col span={10}>
                  <Radio value="end-after">
                    {t("common.modal.calendarSchedule.fields.end_type_after")}
                  </Radio>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="calendarEndAfter"
                    noStyle
                    rules={[
                      {
                        required: calendarEndType === "end-after",
                        message:
                          t(
                            "common.modal.calendarSchedule.placeholders.input_end_after"
                          ) || "Nhập kết thúc sau",
                      },
                    ]}
                  >
                    <Input
                      disabled={calendarEndType !== "end-after"}
                      style={{ width: "100%", margin: "0 10px" }}
                      placeholder={t(
                        "common.modal.calendarSchedule.placeholders.input_end_after"
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Radio value="end-by">
                    {t("common.modal.calendarSchedule.fields.end_type_by")}
                  </Radio>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="calendarEndBy"
                    noStyle
                    rules={[
                      {
                        required: calendarEndType === "end-by",
                        message:
                          t(
                            "common.modal.calendarSchedule.placeholders.input_end_by"
                          ) || "Nhập kết vào",
                      },
                    ]}
                  >
                    <DatePicker
                      disabled={calendarEndType !== "end-by"}
                      style={{ width: "100%", marginLeft: 10 }}
                      format={FORMAT_DATE}
                      placeholder={t(
                        "common.modal.calendarSchedule.placeholders.input_end_by"
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Radio.Group>
          <Form.Item name="calendarType" initialValue={calendarEndType} hidden>
            <Input />
          </Form.Item>
        </Form.Item>
      </Card>
    </Col>
  );
}
