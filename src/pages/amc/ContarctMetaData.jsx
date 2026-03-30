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
import { optionServicePackageType } from "../../utils/constant";
import * as _unitOfWork from "../../api";
import "./index.scss";
import { formatCurrency, parseCurrency } from "../../helper/price-helper";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";
const { Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

export default function ContarctMetaDatas() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [servicePackageServices, setServicePackageServices] = useState([]);
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
  const handleSubmit = (values) => {
    console.log("Submitted Values:", values);
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
      item.key === key ? { ...item, [field]: value } : item
    );
    setServicePackageSpareParts(newData);
  };

  const handleMenuClick = async (e) => {
    const selectedKey = e.key;
    let res = await _unitOfWork.service.getServiceById(selectedKey);
    if (res && res.code === 1) {
      setServicePackageServices((prev) => [...prev, res.service]);
    }
  };

  const handleValueChange = (key, field, value) => {
    setServicePackageServices((prev) =>
      prev.map((service) =>
        service.key === key ? { ...service, [field]: value } : service
      )
    );
  };

  const handleDeleteService = (key) => {
    setServicePackageServices((prev) =>
      prev.filter((service) => service.key !== key)
    );
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      {services.map((_service) => (
        <Menu.Item key={_service.id}>{_service.serviceName}</Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("amc.service.select_spare"),
      dataIndex: "spareId",
      render: (_, record) => (
        <Select
          value={record.spareId}
          onChange={(value) => handleChange(record.key, "spareId", value)}
          style={{ width: "100%" }}
          options={(spareParts || []).map((item, key) => ({
            key: key,
            value: item.value,
            label: item.label,
          }))}
          allowClear
          filterOption={filterOption}
          showSearch={true}
        />
      ),
    },
    {
      title: t("amc.service.action"),
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
        title={t("amc.form.service_package_create_title")}
        extra={
          <>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => navigate(-1)}
            >
              <ArrowLeftOutlined />
              {t("amc.form.back")}
            </Button>
            <Button className="" type="primary" htmlType="submit">
              <PlusCircleOutlined />
              {t("amc.form.create")}
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
                  <Checkbox>{t("amc.form.no_spare_charge")}</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="noChargeSpare" valuePropName="checked" noStyle>
                  <Checkbox>{t("amc.form.no_spare_charge")}</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("amc.form.service_package")}
              name="serviceContractType"
              rules={[
                {
                  required: true,
                  message: "Contract Type không được để trống!",
                },
              ]}
            >
              <Select
                allowClear
                placeholder={t("amc.form.service_package")}
                options={(optionServicePackageType || []).map((item, key) => ({
                  key: key,
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("amc.form.package_name")}
              name="packageName"
              rules={[
                {
                  required: true,
                  message: t("amc.form.package_name_required"),
                },
              ]}
            >
              <Input placeholder={t("amc.form.package_name_placeholder")} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("amc.form.package_code")}
              name="packageCode"
              rules={[
                {
                  required: true,
                  message: t("amc.form.package_code_required"),
                },
              ]}
            >
              <Input placeholder={t("amc.form.package_code_placeholder")} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("amc.form.contract_period")}
              name="contractPeriod"
              rules={[
                { required: true, message: "Please enter contract period" },
              ]}
            >
              <Input
                placeholder={t("amc.form.contract_period_input")}
                addonAfter={
                  <Select placeholder={t("amc.form.duration_unit.day")}>
                    <Option value="day">
                      {t("amc.form.duration_unit.day")}
                    </Option>
                    <Option value="month">
                      {t("amc.form.duration_unit.month")}
                    </Option>
                    <Option value="year">
                      {t("amc.form.duration_unit.year")}
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
                label={t("amc.form.spare_limit_package")}
                name="numberOfCallout"
                rules={[
                  { required: true, message: "Please enter number of callout" },
                ]}
                tooltip="Upto entered value service is free of cost. Above that, chargeable."
              >
                <Input type="number" min={1} />
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item labelAlign="left" label="Grand Total" name="grandTotal">
              <Input placeholder={t("amc.form.grand_total_placeholder")} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {!noCharge && (
        <Collapse defaultActiveKey={["1"]}>
          <Panel header={t("amc.service.spare_title")} key="1">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ marginBottom: 16 }}
            >
              {t("amc.service.add_spare_button")}
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
      )}
      <Row justify="end" gutter={32} className="p-3">
        <Col>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="default">
              {t("amc.service.add_service")} <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          <div>
            {servicePackageServices.map((service) => (
              <Card
                key={service._id}
                style={{
                  marginTop: 16,
                  borderColor: "#faad14",
                  borderWidth: 1,
                  borderRadius: 6,
                }}
                size="small"
              >
                <Row gutter={16} align="middle">
                  <Col span={7}>
                    <Text strong>
                      {t("amc.service.service_label", {
                        name: service.serviceName,
                      })}
                    </Text>
                  </Col>
                  <Col span={5}>
                    <span>
                      {t("amc.service.frequency_count")}:{" "}
                      <InputNumber
                        min={1}
                        value={service.frequency}
                        onChange={(val) =>
                          handleValueChange(service.key, "frequency", val)
                        }
                        style={{ width: "100%" }}
                        formatter={formatCurrency}
                        parser={parseCurrency}
                      />
                    </span>
                  </Col>
                  <Col span={5}>
                    <span>
                      {t("amc.service.asset_count")}:{" "}
                      <InputNumber
                        min={1}
                        value={service.asset}
                        onChange={(val) =>
                          handleValueChange(service.key, "asset", val)
                        }
                        style={{ width: "100%" }}
                        formatter={formatCurrency}
                        parser={parseCurrency}
                      />
                    </span>
                  </Col>
                  <Col span={5}>
                    <span>
                      {t("amc.service.service_price")}:{" "}
                      <InputNumber
                        min={0}
                        value={service.price}
                        onChange={(val) =>
                          handleValueChange(service.key, "price", val)
                        }
                        style={{ width: "100%" }}
                        formatter={formatCurrency}
                        parser={parseCurrency}
                      />
                    </span>
                  </Col>
                  <Col span={2}>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteService(service.key)}
                      danger
                      type="text"
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Form>
  );
}
