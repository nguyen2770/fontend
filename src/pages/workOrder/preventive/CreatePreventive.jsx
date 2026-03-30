import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  Card,
  Divider,
  InputNumber,
  Input,
  Button,
  Table,
  Tooltip,
  Radio,
  message,
} from "antd";
import { assetType, ScheduleBasedOnType } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import { filterOption } from "../../../helper/search-select-helper";
import Calendar from "../../../components/modal/ScheduleModel/Calendar";
import ShowSuccess from "../../../components/modal/result/successNotification";
import {
  DeleteOutlined,
  LeftOutlined,
  PlusCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import ServiceTaskComponent from "../../../components/common/WorkTaskComponent";
import ShowError from "../../../components/modal/result/errorNotification";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import AssetMaintenanceModel from "../../../components/modal/assetModel/AssetMaintenanceModel";
import { useTranslation } from "react-i18next";
import ConditionBasedMaintenanceSchedule from "../../../components/modal/ScheduleModel/ConditionBasedMaintenanceSchedule";
const { Search } = Input;

export default function CreatePreventive() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [monitoringPointOptions, setMonitoringPointOptions] = useState([]);
  const scheduleBasedOn = Form.useWatch("scheduleType", form);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [listSparePart, setListSparePart] = useState([
    { key: 1, sparePart: "", quantity: "" },
  ]);
  const [isOpenAsseMaintenancetModel, setIsOpenAssetMaintenanceModel] =
    useState(false);
  const [assetMaintenceChange, setAssetMaintenceChange] = useState(null);
  const [sparePart, setSparePart] = useState([]);
  const [services, setServices] = useState([]);
  const [amcs, setAmcs] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [
    conditionBasedMaintenanceSchedules,
    setConditionBasedMaintenanceSchedules,
  ] = useState([]);
  useEffect(() => {
    getAllSparePart();
    getAllService();
    fetchGetAllUom();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      assetModel: assetMaintenceChange?.assetModel?.assetModelName,
      asset: assetMaintenceChange?.assetModel?.asset?.assetName,
      serial: assetMaintenceChange?.serial,
      assetNumber: assetMaintenceChange?.assetNumber,
      customer: assetMaintenceChange?.customer?.customerName,
    });
    if (assetMaintenceChange) {
      fetchGetAllAmcByAssetMaintenance(
        assetMaintenceChange.id || assetMaintenceChange._id,
      );
      setMonitoringPointOptions();
      fetchGetMonitoringPointByRes();
    }
  }, [assetMaintenceChange]);

  const fetchGetMonitoringPointByRes = async () => {
    let res = await _unitOfWork.assetModelMonitoringPoint.getResById({
      assetModelId: assetMaintenceChange?.assetModel?.id,
    });
    if (res && res.code === 1) {
      setMonitoringPointOptions(res.data);
    }
  };
  const fetchGetAllUom = async () => {
    let res = await _unitOfWork.uom.getAllUom();
    if (res && res.code === 1) {
      setUoms(res?.data);
    }
  };
  const getAllSparePart = async () => {
    const res = await _unitOfWork.sparePart.getSpareParts();
    if (res && res.code === 1) {
      setSparePart(res?.data);
    }
  };
  const getAllService = async () => {
    let res = await _unitOfWork.service.getAllServices();
    if (res && res.code === 1) {
      setServices(res.data);
    }
  };
  const fetchGetAllAmcByAssetMaintenance = async (assetMaintenanceId) => {
    let res = await _unitOfWork.amc.getAmcMappingAssetMaintenanceByRes({
      assetMaintenance: assetMaintenanceId,
    });
    if (res && res.code === 1) {
      const data = res?.data;
      setAmcs(data.map((item) => item?.amc) || []);
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
  const checkSpareParts = () => {
    if (listSparePart.length === 0) return true;
    if (listSparePart.find((s) => !s.sparePart)) {
      message.error(t("preventive.messages.invalid_spare_parts"));
      return false;
    }
    if (listSparePart.find((s) => !s.quantity)) {
      message.error(t("preventive.messages.invalid_quantity"));
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
      message.error(
        t("Điền đầy đủ thông tin tài sản của lịch bảo trì theo điều kiện!"),
      );
      return false;
    }
    return true;
  };
  const onFinish = async () => {
    if (!assetMaintenceChange) {
      ShowError(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.not_selected_serial"),
      );
    }
    if (
      !checkServiceTasks() ||
      !checkSpareParts() ||
      !checkConditionBasedMaintenanceSchedules
    ) {
      return;
    }
    const values = form.getFieldsValue();
    let payload = {
      preventive: {
        ...values,
        assetMaintenance: assetMaintenceChange?.id,
      },
      preventiveTasks: serviceTasks,
      preventiveSpareParts: listSparePart,
      preventiveConditionBaseds: conditionBasedMaintenanceSchedules,
    };
    const res = await _unitOfWork.preventive.createPreventive(payload);
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.create_success"),
      );
    } else {
      ShowError(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.create_error"),
      );
    }
  };

  const handleService = async (value) => {
    setServiceTasks([]);
    if (!form.getFieldValue("amc")) {
      return;
    }
    let res = await _unitOfWork.amc.getAmcServiceTasksByAmc({ amc: value });
    if (res && res.code === 1) {
      setServiceTasks(res?.amcServiceTasksWithserviceTaskItems);
      const spareParts = res?.amcSparePartByAmcWithSpareParts;
      if (spareParts.length > 0) {
        const mapped = spareParts.map((sp, idx) => ({
          key: sp?.id ?? sp._id ?? `${Date.now()}-${idx}`,
          sparePart: sp?.id ?? sp?._id ?? "",
          // quantity: sp?.quantity ?? sp?.amount ?? 1,
        }));
        setListSparePart(mapped);
      } else {
        setListSparePart([{ key: Date.now(), sparePart: "", quantity: "" }]);
      }
    }
  };

  const onClickSearchAssetMaintenance = () => {
    setIsOpenAssetMaintenanceModel(true);
    form.setFieldsValue({
      serial: null,
      customer: null,
      asset: null,
      assetModel: null,
      category: null,
      amc: null,
      assetNumber: null,
    });
  };
  const handleConditionChange = (data) => {
    setConditionBasedMaintenanceSchedules(data);
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
    // if (listSparePart.length < 1) return;
    setListSparePart(listSparePart.filter((_, i) => i !== idx));
  };
  const onChangeService = async (value) => {
    setServiceTasks([]);
    let res = await _unitOfWork.service.getServiceById(value);
    if (res.code === 1) {
      let serivceTasks = res.service.serviceTasks;
      setServiceTasks(serivceTasks);
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
            // disabled={listSparePart.length < 1}
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
              {t("preventive.buttons.create")}
            </Button>
          </>
        }
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
              label={t("assetMaintenance.asset_number")}
              name="assetNumber"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("assetMaintenance.please_select_an_asset"),
                },
              ]}
            >
              <Search
                placeholder={t("preventive.form.serial_placeholder")}
                allowClear
                enterButton={t("preventive.buttons.find_asset")}
                onSearch={onClickSearchAssetMaintenance}
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.serial")}
              name="serial"
              labelAlign="left"
            >
              <Input placeholder={t("preventive.form.serial")} disabled></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.customer")}
              name="customer"
              labelAlign="left"
            >
              <Input
                placeholder={t("preventive.form.customer")}
                disabled
              ></Input>
            </Form.Item>
          </Col>
          {form.getFieldValue("assetNumber") && (
            <Col span={12}>
              <Form.Item
                label={t("preventive.form.contract")}
                name="amc"
                labelAlign="left"
              >
                <Select
                  placeholder={t("preventive.form.contract_placeholder")}
                  showSearch
                  allowClear
                  options={(amcs || []).map((item) => ({
                    value: item.id,
                    label: item.amcNo,
                  }))}
                  filterOption={filterOption}
                  onChange={handleService}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.asset")}
              name="asset"
              labelAlign="left"
            >
              <Input
                placeholder={t("preventive.form.asset_placeholder")}
                disabled
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.model")}
              name="assetModel"
              labelAlign="left"
            >
              <Input
                placeholder={t("preventive.form.model_placeholder")}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.schedule_type")}
              name="scheduleType"
              required
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("preventive.validation.required_schedule_type"),
                },
              ]}
            >
              <Select
                options={(ScheduleBasedOnType.Option || []).map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: t(item.label),
                }))}
                onDropdownVisibleChange={(open) => {
                  if (open) {
                    form.setFieldsValue({
                      assetMaintenanceMonitoringPoint: null,
                    });
                  }
                }}
                placeholder={t("preventive.form.schedule_type_placeholder")}
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
                  rules={[{ type: "number", min: 0, message: "Giờ >= 0" }]}
                >
                  <InputNumber
                    style={{ width: "50%" }}
                    placeholder={t("preventive.common.hours")}
                  />
                </Form.Item>
                <Form.Item
                  name="maintenanceDurationMin"
                  noStyle
                  rules={[{ type: "number", min: 0, message: "Phút >= 0" }]}
                >
                  <InputNumber
                    style={{ width: "50%" }}
                    placeholder={t("preventive.common.minutes")}
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
              initialValue="High"
            >
              <Radio.Group>
                <Radio value="High">
                  {t("service.common.labels.priority_high")}
                </Radio>
                <Radio value="Medium">
                  {t("service.common.labels.priority_medium")}
                </Radio>
                <Radio value="Low">
                  {t("service.common.labels.priority_low")}
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {!form.getFieldValue("amc") && (
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
                />
              </Form.Item>
            </Col>
          )}

          <Divider></Divider>
          <Row gutter={32}>
            {scheduleBasedOn === ScheduleBasedOnType.Calendar && (
              <Calendar form={form} />
            )}
            {/* {scheduleBasedOn === ScheduleBasedOnType.Monitoring && (
              <Monitoring
                form={form}
                monitoringPointOptions={monitoringPointOptions}
              />
            )} */}
            {/* {scheduleBasedOn === ScheduleBasedOnType.CalendarOrMonitoring && (
              <CalendarOrMonitoring
                form={form}
                monitoringPointOptions={monitoringPointOptions}
              />
            )} */}
            {scheduleBasedOn === ScheduleBasedOnType.ConditionBasedSchedule && (
              <Col span={24} style={{ width: "100vw" }}>
                <ConditionBasedMaintenanceSchedule
                  form={form}
                  onChange={handleConditionChange}
                  uoms={uoms}
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
          <Col span={24}>
            <AssetMaintenanceModel
              open={isOpenAsseMaintenancetModel}
              handleCancel={() => setIsOpenAssetMaintenanceModel(false)}
              form={form}
              assetChange={assetMaintenceChange}
              onSelectAssetMaintenance={(assetMaintenance) => {
                setAssetMaintenceChange(assetMaintenance);
              }}
            />
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
