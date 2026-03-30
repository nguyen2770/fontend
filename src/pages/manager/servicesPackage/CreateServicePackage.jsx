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

export default function CreateServicePackage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [servicePackageServices, setServicePackageServices] = useState([]);
  const [durationType, setDurationType] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const navigate = useNavigate();
  const [servicePackageSpareParts, setServicePackageSpareParts] = useState([]);
  const isCostLimit = Form.useWatch("isCostLimit", form);
  const noCharge = Form.useWatch("noChargeSpares", form);
  useEffect(() => {
    getAllSparePart();
    getAllServices();
  }, []);
  useEffect(() => {
    if (isCostLimit) {
      form.setFieldsValue({ callout: undefined });
    }
  }, [isCostLimit, form]);
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
    if (res && res.code === 1) {
      navigate(-1);
    }
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

  const handleDelete = (_idx) => {
    const newData = [...servicePackageSpareParts];
    newData.splice(_idx, 1);
    setServicePackageSpareParts(newData);
  };

  const handleChange = (_idx, field, value) => {
    const newData = [...servicePackageSpareParts];
    newData[_idx][field] = value;
    setServicePackageSpareParts(newData);
  };
  const handleMenuClick = async (e) => {
    const selectedKey = e.key;
    let res = await _unitOfWork.service.getServiceById(selectedKey);
    if (res && res.code === 1) {
      setServicePackageServices((prev) => [...prev, { service: res.service }]);
    }
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
      title: t("servicePackage.common.table.index"),
      dataIndex: "key",
      render: (_, __, index) => index + 1,
      width: "50px",
      align: "center",
    },
    {
      title: t("servicePackage.common.labels.replacement_part_select"),
      dataIndex: "sparePart",
      render: (_, record, _idx) => (
        <Select
          value={record.sparePart}
          onChange={(value) => handleChange(_idx, "sparePart", value)}
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
      render: (_, record, _idx) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(_idx)}
          danger
        />
      ),
    },
  ];
  const calTotalPrice = () => {
    let _totalPrice = 0;
    servicePackageServices.forEach((item) => {
      _totalPrice += calTotalPriceService(item);
    });
    return _totalPrice;
  };
  const calTotalPriceService = (_service) => {
    let _totalPrice = 0;
    if (!_service.servicePackageServiceTasks) return _totalPrice;
    _service.servicePackageServiceTasks.forEach((element) => {
      _totalPrice +=
        (element.totalPrice ?? 0) *
        (_service.frequencyNumber ?? 0) *
        (_service.noOfAsset ?? 0);
    });
    return _totalPrice;
  };
  return (
    <Form
      form={form}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      className="create-service-package-container"
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
                <Form.Item name="isCostLimit" valuePropName="checked" noStyle>
                  <Checkbox>
                    {t("servicePackage.common.labels.no_charge")}
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="isSparepartCharge"
                  valuePropName="checked"
                  noStyle
                >
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
              name="durationValue"
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
            {!isCostLimit && (
              <Form.Item
                labelAlign="left"
                label={t("servicePackage.common.labels.cost_limit")}
                name="costLimit"
                rules={[
                  { required: true, message: "Please enter number of callout" },
                ]}
              >
                <InputNumber
                  formatter={formatCurrency}
                  parser={parseCurrency}
                  tooltip="Upto entered value service is free of cost. Above that, chargeable."
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
              {calTotalPrice()}
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
                  className="float-right bt-green"
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
            <Button type="primary" className="bt-green">
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
