import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Row,
  Col,
  Card,
  Collapse,
  Table,
  Typography,
  Menu,
  InputNumber,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { optionServicePackageType } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import "./index.scss";
import ServicePackageService from "./ServicePackageService";
import { useTranslation } from "react-i18next";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
const { Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const serviceOptions = [
  {
    label: "Hard Service",
  },
];

export default function ContarctMetaDatas() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [servicePackageServices, setServicePackageServices] = useState([]);
  const [durationType, setDurationType] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const navigate = useNavigate();
  const [servicePackageSpareParts, setServicePackageSpareParts] = useState([]);
  const unlimitedCallout = Form.useWatch("unlimitedCallout", form);
  const noCharge = Form.useWatch("noChargeSpares", form);
  useEffect(() => {
    getAllSparePart();
    getAllServices();
  }, []);
  useEffect(() => {
    if (unlimitedCallout) {
      form.setFieldsValue({ callout: undefined });
    }
  }, [unlimitedCallout, form]);
  const getAllSparePart = async () => {
    const res = await _unitOfWork.sparePart.getSpareParts();
    if (res) {
      const options = res.data.map((item) => ({
        label: item.sparePartsName + " - " + item.description,
        value: item.id,
      }));
      setSpareParts(options);
    }
  };
  const getAllServices = async () => {
    const res = await _unitOfWork.service.getAllServices();
    if (res && res.code === 1) {
      setServices(res.data);
    }
  };
  const handleSubmit = async (values) => {
    let payload = {
      servicePackage: {
        ...values,
        durationType,
      },
      servicePackageServices: servicePackageServices,
      servicePackageSpareParts: servicePackageSpareParts,
    };
    let res = await _unitOfWork.servicePackage.createServicePackage(payload);
  };

  const handleAdd = () => {
    const newKey = servicePackageSpareParts.length
      ? Math.max(...servicePackageSpareParts.map((d) => d.key)) + 1
      : 1;
    setServicePackageSpareParts([
      ...servicePackageSpareParts,
      { key: newKey, spareId: "", spareName: "" },
    ]);
  };

  const handleDelete = (key) => {
    const newData = servicePackageSpareParts.filter((item) => item.key !== key);
    setServicePackageSpareParts(newData);
  };

  const handleChange = (key, field, value) => {
    const newData = servicePackageSpareParts.map((item) =>
      item.key === key ? { ...item, [field]: value } : item,
    );
    setServicePackageSpareParts(newData);
  };
  const handleMenuClick = async (e) => {
    const selectedKey = e.key;
    let res = await _unitOfWork.service.getServiceById(selectedKey);
    if (res && res.code === 1) {
      setServicePackageServices((prev) => [...prev, { service: res.service }]);
    }
  };

  const handleValueChange = (_idx, field, value) => {
    let newServicePackageServices = [...servicePackageServices];
    newServicePackageServices[_idx][field] = value;
    setServicePackageServices(newServicePackageServices);
  };

  const handleDeleteService = (_idx) => {
    let newServicePackageServices = [...servicePackageServices];
    newServicePackageServices.splice(_idx, 1);
    setServicePackageServices(newServicePackageServices);
  };
  const addServiceTask = (_idx) => {
    let newServicePackageServices = [...servicePackageServices];
    if (!newServicePackageServices[_idx].servicePackageServiceTasks) {
      newServicePackageServices[_idx].servicePackageServiceTasks = [];
    }
    newServicePackageServices[_idx].servicePackageServiceTasks.push({
      serviceTasks: newServicePackageServices[_idx].service.serviceTasks,
    });
    setServicePackageServices(newServicePackageServices);
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      {services.map((_service) => (
        <Menu.Item key={_service.id}>{_service.serviceName}</Menu.Item>
      ))}
    </Menu>
  );
  const handleChangeServiceTask = (_idx, field, value) => {
    let newServicePackageServices = [...servicePackageServices];
    newServicePackageServices[_idx][field] = value;
    setServicePackageServices(newServicePackageServices);
  };
  const handleDeleteServiceTask = () => {};
  const columnServicePackageTask = [
    {
      title: "#",
      dataIndex: "key",
      width: "60px",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("servicePackage.common.labels.task_name"),
      width: "40%",
      dataIndex: "serviceTask",
      render: (_, record, _idx) => (
        <Select
          value={record.serviceTask}
          onChange={(value) =>
            handleChangeServiceTask(_idx, "serviceTask", value)
          }
          style={{ width: "100%" }}
          options={(record.serviceTasks || []).map((item, key) => ({
            key: key,
            value: item._id,
            label: item.taskName,
          }))}
        ></Select>
      ),
    },
    {
      title: t("servicePackage.common.labels.task_price_qty"),
      dataIndex: "totalPrice",
      render: (_, record, _idx) => (
        <InputNumber
          value={record.totalPrice}
          onChange={(e) => handleChangeServiceTask(_idx, "totalPrice", e)}
          style={{ width: "100%" }}
          formatter={formatCurrency}
          parser={parseCurrency}
        ></InputNumber>
      ),
    },
    {
      title: t("servicePackage.common.labels.action"),
      width: 80,
      align: "center",
      render: (_, record, _idx) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteServiceTask(_idx)}
          danger
        />
      ),
    },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("servicePackage.common.labels.replacement_part_select"),
      dataIndex: "sparePart",
      render: (_, record) => (
        <Select
          value={record.sparePart}
          onChange={(value) => handleChange(record.key, "sparePart", value)}
          style={{ width: "100%" }}
          options={(spareParts || []).map((item, key) => ({
            key: key,
            value: item.value,
            label: item.label,
          }))}
        ></Select>
      ),
    },
    {
      title: t("servicePackage.common.labels.action"),
      width: 80,
      align: "center",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
          danger
        />
      ),
    },
  ];
  return (
    <Form
      form={form}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      onFinish={handleSubmit}
    >
      <Card
        title={t("servicePackage.titles.create")}
        extra={
          <>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => navigate(-1)}
            >
              <ArrowLeftOutlined />
              {t("servicePackage.common.buttons.back")}
            </Button>
            <Button className="" type="primary" htmlType="submit">
              <PlusCircleOutlined />
              {t("servicePackage.common.buttons.create")}
            </Button>
          </>
        }
      >
        <Row gutter={32}>
          <Col span={24}>
            <Row gutter={32} justify="end" style={{ marginBottom: "10px" }}>
              <Col>
                <Form.Item
                  name="unlimitedCallout"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>
                    {t("servicePackage.common.labels.no_charge")}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="noChargeSpare" valuePropName="checked" noStyle>
                  <Checkbox>
                    {t("servicePackage.common.labels.no_charge_spare")}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("servicePackage.common.labels.service_package_type")}
              name="servicePackageType"
              rules={[
                {
                  required: true,
                  message: "Contract Type không được để trống!",
                },
              ]}
            >
              <Select
                allowClear
                placeholder={t(
                  "servicePackage.common.placeholders.service_package_type",
                )}
                options={(optionServicePackageType || []).map((item, key) => ({
                  key: key,
                  value: item.value,
                  label: t(item.label),
                }))}
              ></Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.package_name")}
              name="servicePackageName"
              rules={[{ required: true, message: "Please enter package name" }]}
            >
              <Input
                placeholder={t(
                  "servicePackage.common.placeholders.package_name",
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.package_code")}
              name="servicePackageCode"
              rules={[{ required: true, message: "Please enter package code" }]}
            >
              <Input
                placeholder={t(
                  "servicePackage.common.placeholders.package_code",
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.contract_duration")}
              name="contractPeriod"
              rules={[
                { required: true, message: "Please enter contract period" },
              ]}
            >
              <Input
                placeholder={t(
                  "servicePackage.common.placeholders.contract_duration",
                )}
                value={durationType}
                addonAfter={
                  <Select
                    onChange={(e) => setDurationType(e)}
                    placeholder="Chọn"
                  >
                    <Option value="day">
                      {t("servicePackage.common.labels.day")}
                    </Option>
                    <Option value="month">
                      {t("servicePackage.common.labels.month")}
                    </Option>
                    <Option value="year">
                      {t("servicePackage.common.labels.year")}
                    </Option>
                  </Select>
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {!unlimitedCallout && (
              <Form.Item
                labelAlign="left"
                label={t("servicePackage.common.labels.cost_limit")}
                name="numberOfCallout"
                rules={[
                  { required: true, message: "Please enter number of callout" },
                ]}
                tooltip="Upto entered value service is free of cost. Above that, chargeable."
              >
                <InputNumber
                  formatter={formatCurrency}
                  parser={parseCurrency}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.grand_total")}
              name="grandTotal"
            >
              <Input
                placeholder={t(
                  "servicePackage.common.placeholders.grand_total",
                )}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {!noCharge && (
        <Row className="p-3 wp-100">
          <Col span={24}>
            <Collapse
              defaultActiveKey={["1"]}
              style={{ background: "#ffffff" }}
            >
              <Panel
                header={t("servicePackage.titles.replacement_parts_section")}
                key="1"
              >
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  style={{ marginBottom: 16 }}
                >
                  {t("servicePackage.common.buttons.add_replacement_part")}
                </Button>
                <Table
                  columns={columns}
                  dataSource={servicePackageSpareParts}
                  pagination={false}
                  rowKey="key"
                  bordered
                />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      )}
      <Row justify="end" gutter={32} className="p-3 ">
        <Col className="mb-2">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="default">
              {t("servicePackage.common.buttons.add_service")} <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          <div className="header-service-package-service">
            {servicePackageServices.map((servicePackageService, _idx) => {
              return (
                <ServicePackageService
                  serviceIndex={_idx}
                  servicePackageService={servicePackageService}
                  servicePackageServices={servicePackageServices}
                  setServicePackageServices={setServicePackageServices}
                />
              );
            })}
          </div>
        </Col>
      </Row>
    </Form>
  );
}
