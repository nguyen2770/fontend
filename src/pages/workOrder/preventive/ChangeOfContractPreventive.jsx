import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  Card,
  Button,
  Input,
  Table,
  Tooltip,
  InputNumber,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import { filterOption } from "../../../helper/search-select-helper";
import ShowSuccess from "../../../components/modal/result/successNotification";
import {
  DeleteOutlined,
  LeftOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import ServiceTaskComponent from "../../../components/common/WorkTaskComponent";
import dayjs from "dayjs";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
const { Search } = Input;

export default function ChangeOfContractPreventive() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [serviceTasks, setServiceTasks] = useState([]);
  const [preventive, setPreventive] = useState([]);
  const [amcs, setAmcs] = useState([]);
  const [assetMaintenceChange, setAssetMaintenceChange] = useState(null);
  const [listSparePart, setListSparePart] = useState([
    { key: 1, sparePart: "", quantity: "" },
  ]);
  const [sparePart, setSparePart] = useState([]);
  useEffect(() => {
    fetchGetPreventive();
    getAllSparePart();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      assetModel: assetMaintenceChange?.assetModel?.assetModelName,
      asset: assetMaintenceChange?.assetModel?.asset?.assetName,
      serial: assetMaintenceChange?.serial,
      customer: assetMaintenceChange?.customer?.customerName,
    });
    if (assetMaintenceChange) {
      fetchGetAllAmcByAssetMaintenance(
        assetMaintenceChange?.id || assetMaintenceChange?._id
      );
    }
  }, [assetMaintenceChange]);

  const fetchGetPreventive = async () => {
    let res = await _unitOfWork.preventive.getPreventiveById({
      id: params.id,
    });
    if (res && res.code === 1) {
      const data = res.data?.assetMaintenance;
      setAssetMaintenceChange(data);
      form.setFieldsValue({
        ...res.data,
        serial: data?.serial,
      });
      setPreventive(res.data);
      let serivceTasks = res.data.preventiveTask;
      serivceTasks.forEach((_serviceTask) => {
        if (_serviceTask.taskItems && _serviceTask.taskItems.length > 0) {
          _serviceTask.taskItems.forEach((_taskItem, _idxItem) => {
            form.setFieldsValue({
              ["taskItemDescription" + _idxItem]: _taskItem.taskItemDescription,
            });
          });
        }
      });
      setServiceTasks(serivceTasks);
      let sparePart = res.data.preventiveSparePart;
      setListSparePart(
        sparePart.map((item) => ({
          key: item.id,
          sparePart: item.sparePart,
          quantity: item.quantity,
        }))
      );
    }
  };
  const getAllSparePart = async () => {
    const res = await _unitOfWork.sparePart.getSpareParts();
    if (res && res.code === 1) {
      setSparePart(res?.data);
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
  const onFinish = async () => {
    if (!checkSpareParts()) {
      return;
    }
    const values = form.getFieldsValue();
    let payload = {
      data: {
        id: params.id,
        preventive: {
          id: params.id,
          ...values,
        },
        preventiveTasks: serviceTasks,
        preventiveSpareParts: listSparePart,
      },
    };
    const res = await _unitOfWork.preventive.changeOfContractPreventive(
      payload
    );
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.update_success")
      );
    } else {
      ShowError(
        "topRight",
        t("preventive.list.title"),
        t("preventive.messages.update_error")
      );
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
    // if (listSparePart.length < 2) return;
    setListSparePart(listSparePart.filter((_, i) => i !== idx));
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
            // disabled={listSparePart.length < 2}
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
              {t("common_buttons.back")}
            </Button>
            <Button type="primary" htmlType="submit">
              <SaveOutlined />
              {t("common_buttons.update")}
            </Button>
          </>
        }
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.contract")}
              name="amc"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("calibration.please_select_a_contract"),
                },
              ]}
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
        <ServiceTaskComponent
          workTasks={serviceTasks}
          setWorkTasks={setServiceTasks}
        />
      </Card>
    </Form>
  );
}
