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
  assetType,
  FORMAT_DATE,
  preventiveStatus,
  priorityType,
  schedulePreventiveStatus,
} from "../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";

const DrawerSearchSchedulePreventive = forwardRef(
  ({ isOpen, onCallBack, onClose }, ref) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const handleFinish = async () => {
      const value = form.getFieldsValue();
      onCallBack(value);
      onClose();
    };

    const onReset = () => form.resetFields();
    useImperativeHandle(ref, () => ({
      resetForm: () => {
        onReset();
      },
    }));
    const handleClose = () => {
      const value = form.getFieldsValue();
      value.isClose = true;
      onCallBack(value);
      onClose();
    };

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
                label={t("preventiveSchedule.list.search.status")}
                name="schedulePreventiveStatus"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("preventiveSchedule.list.search.status")}
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
                label={t("preventiveSchedule.list.search.asset_style")}
                name="assetStyle"
              >
                <Select
                  allowClear
                  placeholder={t("preventiveSchedule.list.search.asset_style")}
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

            <Divider> {t("myTask.myTask.table.start_date")} </Divider>

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
          </Row>
        </Form>
      </Drawer>
    );
  }
);

export default React.memo(DrawerSearchSchedulePreventive);
