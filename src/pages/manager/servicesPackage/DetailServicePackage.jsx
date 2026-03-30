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
  InputNumber,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  optionDurationType,
  optionServicePackageType,
} from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import "./index.scss";
import ViewServicePackageService from "./ViewServicePackageService";
import { useTranslation } from "react-i18next";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";

const { Panel } = Collapse;

export default function DetailServicePackage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const [services, setServices] = useState([]);
  const [servicePackageServices, setServicePackageServices] = useState([]);
  const [durationType, setDurationType] = useState(null);
  const [servicePackage, setServicePackage] = useState(null);
  const navigate = useNavigate();
  const [servicePackageSpareParts, setServicePackageSpareParts] = useState([]);
  const isCostLimit = Form.useWatch("isCostLimit", form);
  const noCharge = Form.useWatch("noChargeSpares", form);
  useEffect(() => {
    fetchServicePackage();
    getAllServices();
  }, []);
  useEffect(() => {
    if (isCostLimit) {
      form.setFieldsValue({ callout: undefined });
    }
  }, [isCostLimit, form]);
  const fetchServicePackage = async () => {
    let res = await _unitOfWork.servicePackage.getServicePackageById(
      params.id,
      { havePopulate: true },
    );
    if (res && res.code === 1) {
      setServicePackageSpareParts(res.servicePackageSpareParts);
      setServicePackage(res.servicePackage);
      setDurationType(res.servicePackage.durationType);
      setServicePackageServices(res.servicePackageServices);
    }
  };
  const getAllServices = async () => {
    const res = await _unitOfWork.service.getAllServices();
    if (res && res.code === 1) {
      setServices(res.data);
    }
  };

  const columns = [
    {
      title: t("servicePackage.common.table.index"),
      dataIndex: "key",
      render: (_, __, index) => index + 1,
      width: "50px",
      align: "center",
    },
    {
      title: t("servicePackage.common.labels.replacement_part"),
      dataIndex: "sparePart",
      render: (_, record) => <span>{record?.sparePart.sparePartsName}</span>,
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
      labelWrap
      form={form}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
    >
      <Card
        title={t("servicePackage.titles.detail")}
        extra={
          <>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeftOutlined />
              {t("servicePackage.common.buttons.back")}
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
              labelAlign="left"
              label={t("servicePackage.common.labels.service_package_type")}
            >
              <span>
                {t(
                  optionServicePackageType.find(
                    (c) => c.value === servicePackage?.servicePackageType,
                  )?.label,
                )}
              </span>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.package_name")}
            >
              <span>{servicePackage?.servicePackageName}</span>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.package_code")}
            >
              <span>{servicePackage?.servicePackageCode}</span>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.contract_duration")}
            >
              <spam>
                {servicePackage?.durationValue}{" "}
                {
                  optionDurationType.find(
                    (c) => c.value === servicePackage?.durationType,
                  )?.label
                }
              </spam>
            </Form.Item>
          </Col>
          <Col span={12}>
            {!isCostLimit && (
              <Form.Item
                labelAlign="left"
                label={t("servicePackage.common.labels.cost_limit")}
                name="costLimit"
                tooltip="Upto entered value service is free of cost. Above that, chargeable."
              >
                <span style={{ display: "inline-block", width: "100%" }}>
                  {formatCurrency(servicePackage?.costLimit)}
                </span>
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("servicePackage.common.labels.grand_total")}
              name="grandTotal"
            >
              <span style={{ display: "inline-block", width: "100%" }}>
                {formatCurrency(calTotalPrice())}
              </span>
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {!noCharge && (
        <Row className="p-3 wp-100">
          <Col span={24}>
            <Collapse defaultActiveKey={["1"]}>
              <Panel
                header={t("servicePackage.titles.replacement_parts_section")}
                key="1"
              >
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
        <Col span={24}>
          <div className="header-service-package-service">
            {servicePackageServices.map((servicePackageService, _idx) => {
              return (
                <ViewServicePackageService
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
