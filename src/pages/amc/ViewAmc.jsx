import React, { useEffect, useState } from "react";
import {
  Form,
  Checkbox,
  Button,
  Row,
  Col,
  Card,
  Collapse,
  Table,
  Menu,
  Dropdown,
  DatePicker,
  Divider,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { optionDurationType } from "../../utils/constant";
import * as _unitOfWork from "../../api";
import "./index.scss";
import ViewAmcService from "./ViewAmcService";
import useHeader from "../../contexts/headerContext";
import { priceFormatter } from "../../helper/price-helper";
import { parseDate } from "../../helper/date-helper";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../components/modal/attachmentModel/AttachmentModel";
import TabAttachment from "../../components/fileViewer/TabAttachment";
const { Panel } = Collapse;

export default function ViewAmc() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const [amcView, setAmcView] = useState(null);
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const [amcSpareParts, setAmcSpareParts] = useState([]);
  const [assetModels, setAssetModels] = useState([]);
  const [amcServices, setAmcServices] = useState([]);
  const [serviceContractor, setServiceContractor] = useState([]);
  const isCalloutRestirction = Form.useWatch("isCalloutRestirction", form);
  const noCharge = Form.useWatch("noChargeSpares", form);
  const [servicePackageChange, setServicePackageChange] = useState(null);
  const { setHeaderTitle } = useHeader();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setHeaderTitle(t("amc.manager.title"));
    fetchAmc();
  }, []);
  useEffect(() => {
    fetchAssetModels();
  }, []);
  useEffect(() => {
    if (isCalloutRestirction) {
      form.setFieldsValue({ callout: undefined });
    }
  }, [isCalloutRestirction, form]);
  const fetchAmc = async () => {
    let res = await _unitOfWork.amc.getAmcById(params.id, {
      havePopulate: true,
    });
    if (res && res.code === 1) {
      setAmcSpareParts(res.amcSpareParts);
      setAmcView(res.amc);
      setServicePackageChange(res.servicePackage);
      setAmcServices(res.amcServices);
      setCustomer(res.customer);
      setServiceContractor(res.serviceContractor);
      // const resources = res?.amcResources.map((data) => data?.resource);
      // const fileList = resources.map((doc) => ({
      //   ...doc,
      //   id: doc?.id,
      //   name: doc?.fileName + doc?.extension,
      //   src: _unitOfWork.resource.getImage(doc?.id),
      //   supportDocumentId: doc?.id,
      // }));
      setFileList(res?.amcResources || []);
    }
  };
  const fetchAssetModels = async () => {
    let res = await _unitOfWork.assetModel.getAllAssetModel();
    if (res && res.code === 1) {
      setAssetModels(res.data);
    }
  };
  const columnTotals = [
    {
      title: t("amc.service.spare_code"),
      dataIndex: "key",
      render: (_, __, index) => index + 1,
      width: "10%",
      align: "center",
    },
    {
      title: t("amc.service.service_label", { name: "" }).replace(":", ""),
      dataIndex: "service",
      render: (_, record) => record?.service?.serviceName,
      width: "60%",
    },
    {
      title: t("amc.service.service_price"),
      dataIndex: "price",
      render: (_, record) => priceFormatter(calTotalPriceService(record)),
    },
  ];
  const calTotalPrice = () => {
    let _totalPrice = 0;
    amcServices.forEach((item) => {
      _totalPrice += calTotalPriceService(item);
    });
    return _totalPrice;
  };
  const calTotalPriceService = (_service) => {
    let _totalPrice = 0;
    if (!_service.amcServiceTasks) return _totalPrice;
    _service.amcServiceTasks.forEach((element) => {
      _totalPrice +=
        (element.totalPrice ?? 0) *
        (_service.frequencyNumber ?? 0) *
        (_service.noOfAsset ?? 0);
    });
    return _totalPrice;
  };
  const generateDurationType = (_type) => {
    let typeFind = optionDurationType.find((f) => f.value == _type);
    if (typeFind) return t(typeFind.label);
    return "";
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
      className="update-amc-container"
    >
      <Card
        title={t("amc.form.view_title")}
        extra={
          <Button onClick={() => navigate(-1)}>
            <ArrowLeftOutlined />
            {t("amc.form.back")}
          </Button>
        }
      >
        <Row gutter={32}>
          <Col span={24}>
            <Row gutter={32} justify="end" style={{ marginBottom: "10px" }}>
              <Col>
                <Form.Item
                  name="isCalloutRestirction"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>{t("amc.form.callout_unlimited")}</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="isSparepartCharge"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>{t("amc.form.no_spare_charge")}</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Form.Item labelAlign="left" label={t("amc.form.contract_no")}>
              <span>{amcView?.amcNo}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("amc.form.service_contractor")}
            >
              <span>{serviceContractor?.serviceContractorName}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelAlign="left" label={t("amc.form.user")}>
              <span>{customer?.customerName}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelAlign="left" label={t("amc.form.service_package")}>
              <span>{servicePackageChange?.servicePackageName}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("amc.form.date_signed")} labelAlign="left">
              <span>{parseDate(amcView?.signedDate)}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t("amc.form.effective_date")} labelAlign="left">
              <span>{parseDate(amcView?.effectiveDate)}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelAlign="left" label={t("amc.form.contract_period")}>
              <span>
                {servicePackageChange?.durationValue}{" "}
                {generateDurationType(servicePackageChange?.durationType)}
              </span>
            </Form.Item>
          </Col>
          <Col span={12}>
            {!isCalloutRestirction && (
              <Form.Item
                labelAlign="left"
                label={t("amc.form.spare_limit_label")}
              >
                <span>{amcView?.calloutRestirctionNo}</span>
              </Form.Item>
            )}
          </Col>
        </Row>
      </Card>
      <Row>
        <Col span={24} className="mt-2">
          {/* <AttachmentModel
            value={fileList}
            onChange={setFileList}
            notSize={true}
            notDelete={true}
          /> */}
          <TabAttachment listDocuments={fileList} notFileType={true} />
        </Col>
      </Row>
      {!noCharge && (
        <Row className="p-3">
          <Col span={24}>
            <Collapse defaultActiveKey={["1"]}>
              <Panel header={t("amc.service.spare_title")} key="1">
                <Table
                  columns={[
                    {
                      title: t("amc.service.spare_code"),
                      dataIndex: "key",
                      render: (_, __, index) => index + 1,
                      width: "10%",
                      align: "center",
                    },
                    {
                      title: t("amc.service.spare_code"),
                      dataIndex: "sparePart",
                      width: "45%",
                      render: (_, record) => (
                        <span>{record?.sparePart?.code}</span>
                      ),
                    },
                    {
                      title: t("amc.service.spare_name"),
                      dataIndex: "sparePart",
                      render: (_, record) => (
                        <span>{record?.sparePart?.sparePartsName}</span>
                      ),
                    },
                  ]}
                  dataSource={amcSpareParts}
                  pagination={false}
                  rowKey="key"
                  bordered
                />
              </Panel>
            </Collapse>
          </Col>
          <Col span={24} className="text-right mt-2 pr-3">
            <Divider orientation="left">
              {t("amc.view.service_section")}
            </Divider>
          </Col>
          <Col span={24} className="mt-2">
            <div className="header-service-package-service">
              {amcServices.map((amcService, _idx) => {
                return (
                  <ViewAmcService
                    assetModels={assetModels}
                    serviceIndex={_idx}
                    amcService={amcService}
                    amcServices={amcServices}
                    setAmcServices={setAmcServices}
                  />
                );
              })}
            </div>
          </Col>
          {
            <Col span={24} className="mt-2">
              <Card title={t("amc.service.total_header")}>
                <Table
                  columns={columnTotals}
                  dataSource={amcServices}
                  pagination={false}
                  rowKey="key"
                  bordered
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={2} align="right">
                          {t("amc.service.total")}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          {priceFormatter(calTotalPrice())}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              </Card>
            </Col>
          }
        </Row>
      )}
    </Form>
  );
}
