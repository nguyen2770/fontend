import {
  PlusCircleOutlined,
  DeleteOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import {
  Button,
  Space,
  Col,
  Form,
  Input,
  Table,
  Row,
  Select,
  Tooltip,
  InputNumber,
  notification,
} from "antd";
import Confirm from "../../components/modal/Confirm";
import { ServiceTaskType } from "../../utils/constant";
import { formatCurrency, parseCurrency } from "../../helper/price-helper";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";

export default function WorkTask({
  task,
  userGroups = [],
  uoms,
  onAddTaskItem,
  onRemoveTaskItem,
  onChangeValue,
  onChangeValueItem,
  idxTask,
  view,
}) {
  const { t } = useTranslation();

  const intervals = [
    { label: t("workTask.intervals.minutes"), value: "minutes" },
    { label: t("workTask.intervals.hours"), value: "hours" },
  ];

  const answerTypes = [
    { label: t("workTask.answerTypes.yes_no_na"), value: "yes/no/na" },
    { label: t("workTask.answerTypes.value"), value: "value" },
    {
      label: t("workTask.answerTypes.numberic_value"),
      value: "numberic-value",
    },
  ];

  const conditions = [
    {
      label: t("workTask.conditions.greater_or_equal"),
      value: "greater-than-or-equal",
    },
    {
      label: t("workTask.conditions.less_or_equal"),
      value: "less-than-or-equal",
    },
    { label: t("workTask.conditions.on"), value: "on" },
    { label: t("workTask.conditions.range"), value: "rang" },
  ];

  const columnInspection = [
    {
      title: t("workTask.columns.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_, __, _idx) => <span>{_idx + 1}</span>,
    },
    {
      title: t("workTask.columns.task_item_description"),
      dataIndex: "taskItemDescription",
      render: (_, record, itemIdx) => (
        <Input
          placeholder={t("workTask.placeholders.task_item_description")}
          onChange={(e) =>
            onChangeValueItem("taskItemDescription", e.target.value, itemIdx)
          }
          value={_}
        />
      ),
    },
    {
      title: t("workTask.columns.answer_type"),
      dataIndex: "answerTypeInspection",
      width: 250,
      align: "center",
      render: (_, __, itemIdx) => (
        <Select
          allowClear
          filterOption={filterOption}
          showSearch={true}
          value={_}
          onChange={(v) =>
            onChangeValueItem("answerTypeInspection", v, itemIdx)
          }
          className="wp-100"
          placeholder={t("workTask.placeholders.select_answer_type")}
          options={(answerTypes || []).map((item, key) => ({
            key: key,
            value: item.value,
            label: item.label,
          }))}
        />
      ),
    },
    (!view &&
    {
      title: t("workTask.columns.action"),
      dataIndex: "action",
      align: "center",
      width: 60,
      render: (_, __, idx) => (
        <Space size="middle">
          <Tooltip title={t("workTask.tooltips.delete")}>
            <Button
              type="primary"
              onClick={() =>
                Confirm(t("workTask.confirm.delete_item"), () =>
                  onClickDeleteItem(idx)
                )
              }
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    }),
  ].filter(Boolean);

  const columnMonitoring = [
    {
      title: t("workTask.columns.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_, __, _idx) => <span>{_idx + 1}</span>,
    },
    {
      title: t("workTask.columns.monitoring_point"),
      dataIndex: "taskItemDescription",
      render: (_, __, itemIdx) => (
        <Input
          placeholder={t("workTask.placeholders.monitoring_point")}
          onChange={(e) =>
            onChangeValueItem("taskItemDescription", e.target.value, itemIdx)
          }
          value={_}
        />
      ),
    },
    {
      title: t("workTask.columns.uom"),
      dataIndex: "uom",
      width: 120,
      align: "center",
      render: (_, __, itemIdx) => (
        <Select
          allowClear
          filterOption={filterOption}
          showSearch={true}
          value={_}
          onChange={(v) => onChangeValueItem("uom", v, itemIdx)}
          className="wp-100"
          placeholder={t("workTask.placeholders.select_uom")}
          options={(uoms || []).map((item) => ({
            value: item.id,
            label: item.uomName,
          }))}
        />
      ),
    },
    {
      title: t("workTask.columns.condition"),
      dataIndex: "condition",
      width: 200,
      align: "center",
      render: (_, __, itemIdx) => (
        <Select
          allowClear
          filterOption={filterOption}
          showSearch={true}
          value={_}
          onChange={(v) => onChangeValueItem("condition", v, itemIdx)}
          className="wp-100"
          placeholder={t("workTask.placeholders.select_condition")}
          options={(conditions || []).map((item, key) => ({
            key: key,
            value: item.value,
            label: item.label,
          }))}
        />
      ),
    },
    {
      title: t("workTask.columns.value"),
      dataIndex: "value",
      width: 300,
      render: (_, record, itemIdx) => (
        <>
          <InputNumber
            onChange={(v) => onChangeValueItem("value1", v, itemIdx)}
            value={record.value1}
            formatter={formatCurrency}
            parser={parseCurrency}
          />
          {record.condition === "rang" && (
            <InputNumber
              className="ml-3"
              onChange={(v) => onChangeValueItem("value2", v, itemIdx)}
              value={record.value2}
              formatter={formatCurrency}
              parser={parseCurrency}
            />
          )}
        </>
      ),
    },
    !view &&
    {
      title: t("workTask.columns.action"),
      dataIndex: "action",
      align: "center",
      width: 60,
      render: (_, __, idx) => (
        <Space size="middle">
          <Tooltip title={t("workTask.tooltips.notify")}>
            <Button
              type="primary"
              className="bt-green"
              danger
              icon={<NotificationOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title={t("workTask.tooltips.delete")}>
            <Button
              type="primary"
              onClick={() =>
                Confirm(t("workTask.confirm.delete_item"), () =>
                  onClickDeleteItem(idx)
                )
              }
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ].filter(Boolean);

  const columnCalibration = [
    {
      title: t("workTask.columns.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_, __, _idx) => <span>{_idx + 1}</span>,
    },
    {
      title: t("workTask.columns.monitoring_point"),
      dataIndex: "taskItemDescription",
      render: (_, __, itemIdx) => (
        <Input
          placeholder={t("workTask.placeholders.monitoring_point")}
          onChange={(e) =>
            onChangeValueItem("taskItemDescription", e.target.value, itemIdx)
          }
          value={_}
        />
      ),
    },
    {
      title: t("workTask.columns.value"),
      dataIndex: "value1",
      width: 300,
      render: (_, __, itemIdx) => (
        <InputNumber
          onChange={(v) => onChangeValueItem("value1", v, itemIdx)}
          value={_}
          className="wp-100"
          formatter={formatCurrency}
          parser={parseCurrency}
        />
      ),
    },
    {
      title: t("workTask.columns.uom"),
      dataIndex: "uom",
      width: 120,
      align: "center",
      render: (_, __, itemIdx) => (
        <Select
          allowClear
          filterOption={filterOption}
          showSearch={true}
          value={_}
          onChange={(v) => onChangeValueItem("uom", v, itemIdx)}
          className="wp-100"
          placeholder={t("workTask.placeholders.select_uom")}
          options={(uoms || []).map((item, key) => ({
            key: key,
            value: item.id,
            label: item.uomName,
          }))}
        />
      ),
    },
    !view &&
    {
      title: t("workTask.columns.action"),
      dataIndex: "action",
      align: "center",
      width: 60,
      render: (_, __, idx) => (
        <Space size="middle">
          <Tooltip title={t("workTask.tooltips.delete")}>
            <Button
              type="primary"
              onClick={() =>
                Confirm(t("workTask.confirm.delete_item"), () =>
                  onClickDeleteItem(idx)
                )
              }
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ].filter(Boolean);

  const onClickDeleteItem = (_idx) => {
    if (task.taskItems.length < 2) {
      notification.warning({
        message: t("workTask.notifications.cannot_delete_item_title"),
        description: t("workTask.notifications.cannot_delete_item_desc"),
      });
      return;
    }
    onRemoveTaskItem(_idx);
  };

  const generateColumnTaskItem = (_taskType) => {
    switch (_taskType) {
      case ServiceTaskType.inspection:
        return columnInspection;
      case ServiceTaskType.calibration:
        return columnCalibration;
      case ServiceTaskType.monitoring:
        return columnMonitoring;
      default:
        return [];
    }
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label={t("workTask.labels.task_name")}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Input
              value={task.taskName}
              onChange={(e) => onChangeValue("taskName", e.target.value)}
              placeholder={t("workTask.placeholders.task_name")}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={t("workTask.labels.sla_time")}
            labelAlign="left"
          >
            <InputNumber
              value={task.sla}
              onChange={(value) => onChangeValue("sla", value)}
              placeholder={t("workTask.placeholders.sla")}
              style={{ width: "100%" }}
              formatter={formatCurrency}
              parser={parseCurrency}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={t("workTask.labels.interval_type")}
          >
            <Select
              allowClear
              filterOption={filterOption}
              showSearch={true}
              placeholder={t("workTask.placeholders.select_interval")}
              value={task.intervalType}
              onChange={(val) => onChangeValue("intervalType", val)}
              options={(intervals || []).map((item, key) => ({
                key: key,
                value: item.value,
                label: item.label,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col className="text-right mb-2" span={24}>
          {!view ? (
            <Button className="bt-green" type="primary" onClick={onAddTaskItem}>
              <PlusCircleOutlined />
              {t("workTask.buttons.add_task_item")}
            </Button>
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <Row>
        <Table
          columns={generateColumnTaskItem(task.key || task.taskType)}
          dataSource={task.taskItems}
          className="custom-table wp-100"
          pagination={false}
        />
      </Row>
    </div>
  );
}
