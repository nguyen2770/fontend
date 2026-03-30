import {
  ClockCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Card, Form, Input, InputNumber, Button, Table, Select } from "antd";
import { useTranslation } from "react-i18next";
import { use, useEffect, useState } from "react";
import { filterOption } from "../../../helper/search-select-helper";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";

export default function ConditionBasedMaintenanceSchedule({
  form,
  onChange,
  uoms,
  conditionBasedMaintenanceSchedules,
  view,
}) {
  const { t } = useTranslation();
  const [formList] = Form.useForm();
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    formList.setFieldsValue({
      conditions: conditionBasedMaintenanceSchedules || [],
    });
    setConditions(conditionBasedMaintenanceSchedules || []);
  }, [conditionBasedMaintenanceSchedules]);

  // Khi form thay đổi, cập nhật dữ liệu & gửi về cha
  const handleValuesChange = (_, allValues) => {
    const list = allValues.conditions || [];
    console.log("list", list);
    setConditions(list);
    onChange?.(list);
  };

  // Thêm dòng
  const addRow = () => {
    const current = formList.getFieldValue("conditions") || [];
    const newList = [...current, {}];
    formList.setFieldsValue({ conditions: newList });
    setConditions(newList);
    onChange?.(newList);
  };

  // Xóa dòng
  const removeRow = (index) => {
    const current = formList.getFieldValue("conditions") || [];
    const newList = current.filter((_, i) => i !== index);
    formList.setFieldsValue({ conditions: newList });
    setConditions(newList);
    onChange?.(newList);
  };

  const columns = [
    {
      title: "STT",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: t("Điều kiện"),
      render: (_, __, index) => (
        <Form.Item
          name={["conditions", index, "condition"]}
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="Nhập điều kiện..." />
        </Form.Item>
      ),
    },
    {
      title: t("Giá trị"),
      render: (_, __, index) => (
        <Form.Item
          name={["conditions", index, "value"]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            min={0}
            placeholder="0"
            style={{ width: "100%" }}
            formatter={formatCurrency}
            parser={parseCurrency}
          />
        </Form.Item>
      ),
    },
    {
      title: t("Đơn vị"),
      render: (_, __, index) => (
        <Form.Item
          name={["conditions", index, "uom"]}
          style={{ marginBottom: 0 }}
        >
          <Select
            placeholder="Chọn đơn vị"
            showSearch
            allowClear
            options={(uoms || []).map((item) => ({
              value: item._id || item.id,
              label: item?.uomName,
            }))}
            filterOption={filterOption}
          />
        </Form.Item>
      ),
    },
    {
      title: t("Ghi chú"),
      render: (_, __, index) => (
        <Form.Item
          name={["conditions", index, "note"]}
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="Ghi chú..." />
        </Form.Item>
      ),
    },
    !view &&
    {
      title: "",
      width: 60,
      render: (_, __, index) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeRow(index)}
        />
      ),
    },
  ].filter(Boolean);

  return (
    <Card
      title={
        <span>
          <ClockCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
          {t(
            "common.modal.calendarSchedule.titles.condition_based_maintenance_schedule"
          ) || "Lịch bảo trì theo điều kiện"}
        </span>
      }
      extra={
        !view ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={addRow}>
            Thêm dòng
          </Button>
        ) : (
          <></>
        )
      }
      className="mb-2"
      style={{ marginLeft: 5, marginRight: 5 }}
    >
      <Form
labelWrap
        form={formList}
        layout="vertical"
        initialValues={{ conditions: [] }}
        onValuesChange={handleValuesChange}
      >
        <Table
          columns={columns}
          dataSource={conditions}
          pagination={false}
          rowKey={(_, index) => index}
        />
      </Form>
    </Card>
  );
}
