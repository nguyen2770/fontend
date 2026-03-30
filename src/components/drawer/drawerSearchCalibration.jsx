import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect } from "react";
import {
  statusMyTakMap,
  FORMAT_DATE,
  priorityType,
  schedulePreventiveStatus,
  schedulePreventiveTaskAssignUserStatus,
  assetType,
} from "../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";

const DrawerSearchCalibration = ({ isOpen, onCallBack, onClose }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleFinish = async () => {
    const value = form.getFieldsValue();
    onCallBack({
      ...value,
    });
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
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item label={t("calibration.importance")} name="importance">
              <Select
                showSearch
                allowClear
                placeholder={t("calibration.placeholder.importance")}
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

export default React.memo(DrawerSearchCalibration);
