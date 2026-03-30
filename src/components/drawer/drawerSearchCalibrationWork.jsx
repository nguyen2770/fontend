import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect } from "react";
import {
  assetType,
  FORMAT_DATE,
  priorityType,
  schedulePreventiveStatus,
} from "../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";

const DrawerSearchCalibrationWork = ({ isOpen, onCallBack, onClose }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleFinish = async () => {
    const value = form.getFieldsValue();
    onCallBack(value);
    onClose();
  };

  const onReset = () => form.resetFields();

  return (
    <Drawer
      title={t("common_buttons.advanced_search")}
      width={"40%"}
      open={isOpen}
      onClose={onClose}
      extra={
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            onClick={handleFinish}
          >
            {t("myTask.myTask.buttons.search")}
          </Button>

          <Button onClick={onReset} icon={<RedoOutlined />}>
            {t("myTask.myTask.buttons.reset")}
          </Button>
        </Space>
      }
    >
      <Form labelWrap form={form} layout="vertical" onFinish={onCallBack}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item id="" label={t("calibration.code")} name="code">
              <Input
                placeholder={t("calibration.placeholder.enter_code")}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              label={t("calibration.calibration_name")}
              name="calibrationName"
            >
              <Input
                placeholder={t("calibration.placeholder.calibration_name")}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item id="" label={t("calibration.serial")} name="serial">
              <Input placeholder={t("calibration.placeholder.serial")}></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              label={t("calibration.asset_model_name")}
              name="assetModelName"
            >
              <Input
                placeholder={t("calibration.placeholder.asset_model_name")}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("calibration.status")} name="status">
              <Select
                showSearch
                allowClear
                placeholder={t("calibration.placeholder.status")}
                options={(schedulePreventiveStatus.Options || []).map(
                  (item) => ({
                    value: item.value,
                    label: t(item.label),
                  })
                )}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("calibration.asset_style")}
              name="assetStyle"
            >
              <Select
                allowClear
                placeholder={t("calibration.placeholder.asset_style")}
                options={(assetType.Options || []).map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
                showSearch={true}
              ></Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="startDate"
              label={t("preventiveSchedule.list.search.start_date_from")}
            >
              <DatePicker
                placeholder={t(
                  "preventiveSchedule.list.search.start_date_from"
                )}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label={t("preventiveSchedule.list.search.end_date_to")}
            >
              <DatePicker
                placeholder={t("preventiveSchedule.list.search.end_date_to")}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventiveSchedule.list.search.priority")}
              name="importance"
            >
              <Select
                showSearch
                allowClear
                placeholder={t("preventiveSchedule.list.search.priority")}
                options={(priorityType.Option || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default React.memo(DrawerSearchCalibrationWork);
