import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Row, Select, Space } from "antd";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  assetType,
  preventiveStatus,
  priorityType,
} from "../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";

const DrawerSearchPreventive = forwardRef(
  ({ isOpen, onCallBack, onClose }, ref) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const handleFinish = async () => {
      const value = form.getFieldsValue();
      onCallBack(value);
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
                label={t("preventive.common.priority")}
                name="importance"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("preventive.common.priority")}
                  options={(priorityType.Option || []).map((item) => ({
                    value: item.value,
                    label: t(item.label),
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id=""
                labelAlign="left"
                label={t("preventive.list.table.asset_style")}
                name="assetStyle"
              >
                <Select
                  allowClear
                  placeholder={t("preventive.list.table.asset_style")}
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
              <Form.Item label={t("preventive.common.status")} name="status">
                <Select
                  showSearch
                  allowClear
                  placeholder={t("preventive.common.status")}
                  options={(preventiveStatus.Options || []).map((item) => ({
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

export default React.memo(DrawerSearchPreventive);
