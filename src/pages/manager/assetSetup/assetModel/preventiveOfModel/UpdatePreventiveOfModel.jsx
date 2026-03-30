import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  Card,
  DatePicker,
  Divider,
  InputNumber,
  Button,
  Table,
  Tooltip,
  Radio,
  Input,
  message,
} from "antd";
import { ScheduleBasedOnType } from "../../../../../utils/constant";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as _unitOfWork from "../../../../../api";
import { filterOption } from "../../../../../helper/search-select-helper";
import Monitoring from "../../../../../components/modal/ScheduleModel/Monitoring";
import Calendar from "../../../../../components/modal/ScheduleModel/Calendar";
import CalendarOrMonitoring from "../../../../../components/modal/ScheduleModel/CalendarOrMonitoring";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import {
  DeleteOutlined,
  LeftOutlined,
  PlusCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import ServiceTaskComponent from "../../../../../components/common/WorkTaskComponent";
import dayjs from "dayjs";
import ShowError from "../../../../../components/modal/result/errorNotification";
import {
  formatCurrency,
  parseCurrency,
} from "../../../../../helper/price-helper";
import { useTranslation } from "react-i18next";
import ConditionBasedMaintenanceSchedule from "../../../../../components/modal/ScheduleModel/ConditionBasedMaintenanceSchedule";

export default function UpdatePreventiveOfModel() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [monitoringPointOptions, setMonitoringPointOptions] = useState([]);
  const scheduleBasedOn = Form.useWatch("scheduleType", form);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [listSparePart, setListSparePart] = useState([
    { key: 1, sparePart: "", quantity: "" },
  ]);
  const [sparePart, setSparePart] = useState([]);
  const [services, setServices] = useState([]);
  const [searchParams] = useSearchParams();
  const assetModelId = searchParams.get("assetModel");
  const [uoms, setUoms] = useState([]);
  const [
    conditionBasedMaintenanceSchedules,
    setConditionBasedMaintenanceSchedules,
  ] = useState([]);
  const [preventiveOfModel, setPreventiveOfModel] = useState(null);
  useEffect(() => {
    getAllSparePart();
    getAllService();
    fetchGetPreventiveOfMdoelById();
    fetchGetAllUom();
    fetchGetMonitoringPointByRes();
  }, []);

  const fetchGetAllUom = async () => {
    let res = await _unitOfWork.uom.getAllUom();
    if (res && res.code === 1) {
      setUoms(res?.data);
    }
  };
  const fetchGetMonitoringPointByRes = async () => {
    let res = await _unitOfWork.assetModelMonitoringPoint.getResById({
      assetModelId: assetModelId,
    });
    if (res && res.code === 1) {
      setMonitoringPointOptions(res.data);
    }
  };

  const getAllSparePart = async () => {
    const res = await _unitOfWork.sparePart.getSpareParts();
    if (res && res.code === 1) {
      setSparePart(res?.data);
    }
  };
  const fetchGetPreventiveOfMdoelById = async () => {
    let res = await _unitOfWork.preventiveOfModel.getPreventiveOfModelById({
      id: params?.id,
    });
    if (res && res.code === 1) {
      const data = res?.data;
      setPreventiveOfModel(res?.data);
      form.setFieldsValue({
        ...res.data,
        calendarEndBy: data?.calendarEndBy ? dayjs(data?.calendarEndBy) : null,
        scheduleDate: data?.scheduleDate ? dayjs(data?.scheduleDate) : null,
      });
      let serivceTasks = res?.data?.preventiveOfModelTasks;
      serivceTasks.forEach((_serviceTask) => {
        if (_serviceTask.taskItems && _serviceTask.taskItems.length > 0) {
          _serviceTask.taskItems.forEach((_taskItem, _idxItem) => {
            form.setFieldsValue({
              ["taskItemDescription" + _idxItem]: _taskItem.taskItemDescription,
            });
          });
        }
      });
      setConditionBasedMaintenanceSchedules(
        res?.data?.preventiveOfModelConditionBaseds || [],
      );
      // let preventiveOfModelConditionBaseds =
      //   res?.data?.preventiveOfModelConditionBaseds || [];

      setServiceTasks(serivceTasks);
      let sparePart = res.data?.preventiveOfModelSpareParts;
      setListSparePart(
        sparePart.map((item) => ({
          key: item.id,
          sparePart: item?.sparePart,
          quantity: item?.quantity,
        })),
      );
    }
  };

  const getAllService = async () => {
    let res = await _unitOfWork.service.getAllServices();
    if (res && res.code === 1) {
      setServices(res.data);
    }
  };
  const checkServiceTasks = () => {
    if (serviceTasks.length === 0)
      return ShowError(
        "topRight",
        t("common.notifications"),
        t(
          "preventive.notification.please_enter_at_least_one_job_for_the_maintenance_plan",
        ),
      );
    if (
      serviceTasks.find(
        (s) =>
          !s.taskName ||
          (s.taskItems.length > 0 &&
            s.taskItems.find((ti) => !ti.taskItemDescription)),
      )
    ) {
      message.error(t("preventive.messages.invalid_service_tasks"));
      return false;
    }
    return true;
  };
  const checkConditionBasedMaintenanceSchedules = () => {
    if (
      !conditionBasedMaintenanceSchedules ||
      conditionBasedMaintenanceSchedules.length === 0
    )
      return true;
    const hasInvalid = conditionBasedMaintenanceSchedules.some(
      (s) => !s?.condition || !s?.uom || s?.value == null,
    );
    if (hasInvalid) {
      message.error(t("preventive.notification.notification_please_condition"));
      return false;
    }
    return true;
  };
  const checkSpareParts = () => {
    if (listSparePart.length === 0) return true;
    if (listSparePart.find((s) => !s.sparePart)) {
      message.error(t("preventive.messages.invalid_spare_parts"));
      return false;
    }
    return true;
  };
  const onFinish = async () => {
    if (
      !checkServiceTasks() ||
      !checkSpareParts() ||
      !checkConditionBasedMaintenanceSchedules()
    ) {
      return;
    }
    const values = form.getFieldsValue();
    let payload = {
      data: {
        id: params?.id,
        preventiveOfModel: {
          assetModel: params?.assetModel,
          ...values,
        },
        preventiveOfModelTasks: serviceTasks,
        preventiveOfModelSpareParts: listSparePart,
        preventiveOfModelConditionBaseds: conditionBasedMaintenanceSchedules,
      },
    };
    const res =
      await _unitOfWork.preventiveOfModel.updatePreventiveOfModel(payload);
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.update_success"),
      );
    } else {
      ShowError(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.update_error"),
      );
    }
  };
  const handleConditionChange = (data) => {
    setConditionBasedMaintenanceSchedules(data);
  };

  const onChangeService = async (value) => {
    let res = await _unitOfWork.service.getServiceById(value);
    if (res.code === 1) {
      let serivceTasks = res.service.serviceTasks;
      setServiceTasks(serivceTasks);
    }
  };

  const handleChange = (field, value, idx) => {
    const newItems = [...listSparePart];
    newItems[idx][field] = value;
    setListSparePart(newItems);
  };
  const handleAdd = () => {
    setListSparePart([
      ...listSparePart,
      { key: Date.now(), sparePart: "", quantity: "" },
    ]);
  };

  const handleDelete = (idx) => {
    if (listSparePart.length < 2) return;
    setListSparePart(listSparePart.filter((_, i) => i !== idx));
  };
  const handleService = async (value) => {
    if (!form.getFieldValue("amc")) {
      return;
    }
    let res = await _unitOfWork.amc.getAmcById(value, { havePopulate: true });
    if (res && res.code === 1) {
      let newServices = res?.amcServices.map((s) => s.service);
      newServices.forEach((_) => {
        _.id = _._id;
      });
      setServices(newServices);
      form.setFieldsValue({ service: null });
      setServiceTasks([]);
    }
  };
  const columns = [
    {
      title: t("preventive.list.table.index"),
      dataIndex: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, idx) => idx + 1,
    },
    {
      title: t("preventive.common.spare_part"),
      dataIndex: "sparePart",
      textAlign: "end",
      render: (text, record, idx) => (
        <Select
          value={record?.sparePart}
          onChange={(v) => handleChange("sparePart", v, idx)}
          placeholder={t("preventive.form.spare_part_placeholder")}
          options={(sparePart || [])
            .filter((item) => item)
            .map((item) => ({
              label: item.sparePartsName,
              value: item.id,
            }))}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: t("preventive.common.quantity"),
      dataIndex: "quantity",
      render: (text, record, idx) => (
        <InputNumber
          value={record?.quantity}
          onChange={(value) => handleChange("quantity", value, idx)}
          placeholder={t("preventive.form.quantity_placeholder")}
          style={{ width: "100%" }}
          formatter={formatCurrency}
          parser={parseCurrency}
        />
      ),
    },
    {
      title: t("preventive.common.action"),
      dataIndex: "action",
      width: 100,
      align: "center",
      render: (_text, _record, idx) => (
        <Tooltip title={t("preventive.buttons.delete")}>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(idx)}
            disabled={listSparePart.length < 2}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Form
      layout="horizontal"
      form={form}
      labelCol={{
        span: 9,
      }}
      wrapperCol={{
        span: 15,
      }}
      onFinish={onFinish}
      style={{ padding: "15px" }}
    >
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px #f0f1f2",
        }}
        bodyStyle={{ padding: 32 }}
        extra={
          <>
            <Button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>
              <LeftOutlined />
              {t("preventive.buttons.back")}
            </Button>
            <Button type="primary" htmlType="submit">
              <PlusCircleFilled />
              {t("preventive.buttons.update")}
            </Button>
          </>
        }
        title={t(`assetModel.model.title_preventive_of_model_update`)}
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.preventive_name")}
              name="preventiveName"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("preventive.validation.required_plan_name"),
                },
              ]}
            >
              <Input
                placeholder={t("preventive.form.preventive_name_placeholder")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.schedule_type")}
              name="scheduleType"
              required
              labelAlign="left"
            >
              <Select
                options={(ScheduleBasedOnType.Option || []).map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: t(item.label),
                }))}
                placeholder={t("preventive.form.schedule_type_placeholder")}
                onDropdownVisibleChange={(open) => {
                  if (open) {
                    form.setFieldsValue({
                      assetMaintenanceMonitoringPoint: null,
                    });
                  }
                }}
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("preventive.common.maintenance_time")}
              labelAlign="left"
            >
              <Input.Group compact>
                <Form.Item
                  name="maintenanceDurationHr"
                  noStyle
                  rules={[
                    { type: "number", min: 0, message: "Hours must be >= 0" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "50%" }}
                    placeholder={t("preventive.common.hours")}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                  />
                </Form.Item>
                <Form.Item
                  name="maintenanceDurationMin"
                  noStyle
                  rules={[
                    { type: "number", min: 0, message: "Minutes must be >= 0" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "50%" }}
                    placeholder={t("preventive.common.minutes")}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventive.common.priority")}
              name="importance"
              labelAlign="left"
            >
              <Radio.Group>
                <Radio value="High">High</Radio>
                <Radio value="Medium">Medium</Radio>
                <Radio value="Low">Low</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.service")}
              name="service"
              labelAlign="left"
            >
              <Select
                placeholder={t("preventive.form.service_placeholder")}
                options={(services || []).map((item) => ({
                  value: item.id,
                  label: item.serviceName,
                }))}
                onChange={(value) => onChangeService(value)}
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>
          <Divider></Divider>
          <Row gutter={32}>
            {scheduleBasedOn === ScheduleBasedOnType.Calendar && (
              <Calendar form={form} />
            )}
            {/* {scheduleBasedOn === ScheduleBasedOnType.Monitoring && (
              <Monitoring
                form={form}
                monitoringPointOptions={monitoringPointOptions}
                preventiveOfModel={preventiveOfModel}
              />
            )}
            {scheduleBasedOn === ScheduleBasedOnType.CalendarOrMonitoring && (
              <CalendarOrMonitoring
                form={form}
                monitoringPointOptions={monitoringPointOptions}
                preventiveOfModel={preventiveOfModel}
              />
            )} */}
            {scheduleBasedOn === ScheduleBasedOnType.ConditionBasedSchedule && (
              <Col span={24} style={{ width: "100vw" }}>
                <ConditionBasedMaintenanceSchedule
                  form={form}
                  onChange={handleConditionChange}
                  uoms={uoms}
                  conditionBasedMaintenanceSchedules={
                    conditionBasedMaintenanceSchedules
                  }
                />
              </Col>
            )}
          </Row>
          <Col span={24} className="mb-4" style={{ textAlign: "end" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="mb-2"
            >
              {t("preventive.buttons.add_spare_part")}
            </Button>
            <Table
              columns={columns}
              dataSource={listSparePart}
              className="custom-table wp-100"
              pagination={false}
            ></Table>
          </Col>
        </Row>
        <ServiceTaskComponent
          workTasks={serviceTasks}
          setWorkTasks={setServiceTasks}
        />
      </Card>
    </Form>
  );
}
