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
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  statusMyTaskMap,
  FORMAT_DATE,
  priorityType,
  schedulePreventiveStatus,
  schedulePreventiveTaskAssignUserStatus,
  priorityLevelStatus,
  breakdownStatus,
  assetType,
} from "../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";

const DrawerSearchBreakdown = forwardRef(
  ({ isOpen, onCallBack, onClose }, ref) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const handleFinish = async () => {
      const value = form.getFieldsValue();
      onCallBack({
        ...value,
      });
      onClose();
    };

    const handleClose = () => {
      const value = form.getFieldsValue();
      value.isClose = true;
      onCallBack(value);
      onClose();
    };

    const onReset = () => form.resetFields();
    useImperativeHandle(ref, () => ({
      resetForm: () => {
        onReset();
      },
    }));
    return (
      <Drawer
        title={t("common_buttons.advanced_search")}
        width={"40%"}
        open={isOpen}
        onClose={handleClose}
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
              <Form.Item
                id=""
                labelAlign="left"
                label={t("breakdown.common.asset_type")}
                name="assetStyle"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("breakdown.common.asset_type")}
                  options={(assetType.Options || []).map((item) => ({
                    key: item.value,
                    value: item.value,
                    label: t(item.label),
                  }))}
                  filterOption={filterOption}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.common.priority")}
                name="priorityLevel"
                labelAlign="left"
              >
                <Select
                  placeholder={t("breakdown.common.priority")}
                  allowClear
                  options={(priorityLevelStatus.Options || []).map((item) => ({
                    value: item.value,
                    label: t(item.label),
                  }))}
                  filterOption={filterOption}
                  showSearch={true}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.common.status")}
                name="breakdownStatus"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("breakdown.common.status")}
                  options={(breakdownStatus.Option || []).map((item) => ({
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
  }
);

export default React.memo(DrawerSearchBreakdown);
