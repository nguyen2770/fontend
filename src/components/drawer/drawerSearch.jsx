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
import React, { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import {
  assetType,
  breakdownSpareRequestStatus,
  breakdownStatus,
  calibrationWorkAssignUserStatus,
  FORMAT_DATE,
  priorityLevelStatus,
  priorityType,
  schedulePreventiveStatus,
  schedulePreventiveTaskAssignUserStatus,
  schedulePreventiveTaskRequestSparePartStatus,
} from "../../utils/constant";
import { filterOption } from "../../helper/search-select-helper";

const ComponentMap = {
  Input: Input,
  Select: Select,
  DatePicker: DatePicker,
};

const OptionsMap = {
  schedulePreventiveStatus: schedulePreventiveStatus.Options,
  assetType: assetType.Options,
  priorityType: priorityType.Option,
  calibrationWorkAssignUserStatus: calibrationWorkAssignUserStatus.Options,
  priorityLevelStatus: priorityLevelStatus.Options,
  breakdownSpareRequestStatus: breakdownSpareRequestStatus.Option,
  schedulePreventiveTaskRequestSparePartStatus:
    schedulePreventiveTaskRequestSparePartStatus.Options,
  breakdownStatus: breakdownStatus.Option,
  schedulePreventiveTaskAssignUserStatus:
    schedulePreventiveTaskAssignUserStatus.Options,
};

const DrawerSearch = forwardRef(
  (
    {
      isOpen,
      onCallBack,
      onClose,
      fieldsConfig = [],
      drawerTitle = "common_buttons.advanced_search",
    },
    ref,
  ) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const handleFinish = async () => {
      const value = form.getFieldsValue();
      onCallBack(value);
      onClose();
    };
    const handleClose = () => {
      const values = form.getFieldsValue();
      values.isClose = true;
      onCallBack(values);
      onClose();
    };

    const onReset = () => form.resetFields();
    useImperativeHandle(ref, () => ({
      resetForm: () => {
        onReset();
      },
    }));

    const renderFormField = (field) => {
      const FormComponent = ComponentMap[field.component];
      if (!FormComponent) return null;

      let componentProps = {};

      if (field.component === "Input") {
        componentProps = {
          ...componentProps,
          placeholder: t(field.placeholderKey),
        };
      } else {
        componentProps = {
          ...componentProps,
          placeholder: t(field.placeholderKey),
        };
      }

      if (field.component === "Select") {
        const optionsData = Array.isArray(field.options)
          ? field.options
          : OptionsMap[field.options] || [];
        componentProps = {
          showSearch: true,
          allowClear: true,
          filterOption: filterOption,
          options: optionsData.map((item) => ({
            value: item.value,
            label: t(item.label),
          })),
          placeholder: t(field.placeholderKey),
        };
      }

      if (field.component === "DatePicker") {
        componentProps = {
          format: field.format || FORMAT_DATE,
          style: { width: "100%" },
          allowClear: true,
          placeholder: t(field.placeholderKey),
        };
      }

      return (
        <Col span={12} key={field.name}>
          <Form.Item
            label={t(field.labelKey)}
            name={field.name}
            id={field.id} // Nếu có id
            labelAlign={field.labelAlign} // Nếu có labelAlign
          >
            <FormComponent {...componentProps} />
          </Form.Item>
        </Col>
      );
    };

    return (
      <Drawer
        title={t(drawerTitle)}
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
          <Row gutter={16}>{fieldsConfig.map(renderFormField)}</Row>
        </Form>
      </Drawer>
    );
  },
);

export default React.memo(DrawerSearch);
