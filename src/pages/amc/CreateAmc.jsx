import React, { useEffect, useRef, useState } from "react";
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
  DatePicker,
  message,
} from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  FORMAT_DATE,
  optionDurationType,
  optionServicePackageType,
} from "../../utils/constant";
import * as _unitOfWork from "../../api";
import "./index.scss";
import AmcService from "./AmcService";
import useHeader from "../../contexts/headerContext";
import {
  formatCurrency,
  parseCurrency,
  priceFormatter,
} from "../../helper/price-helper";
import { filterOption } from "../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../components/modal/attachmentModel/AttachmentModel";
import TabAttachment from "../../components/fileViewer/TabAttachment";
import useAuth from "../../contexts/authContext";

const { Text } = Typography;
const { Panel } = Collapse;

export default function CreateAmc() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const navigate = useNavigate();
  const [amcSpareParts, setAmcSpareParts] = useState([]);
  const [assetModels, setAssetModels] = useState([]);
  const [amcServices, setAmcServices] = useState([]);
  const isCalloutRestirction = Form.useWatch("isCalloutRestirction", form);
  const noCharge = Form.useWatch("noChargeSpares", form);
  const servicePackage = Form.useWatch("servicePackage", form);
  const [servicePackageChange, setServicePackageChange] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [serviceContractors, setServiceContractors] = useState([]);
  const [servicePackages, setServicePackages] = useState([]);
  const { setHeaderTitle } = useHeader();
  const [fileList, setFileList] = useState([]);
  const inputRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    setHeaderTitle(t("amc.manager.title"));
  }, []);
  useEffect(() => {
    getAllSparePart();
    getAllServices();
    getAllCustomers();
    getAllServicePackages();
    fetchAssetModels();
    getAllServiceContractor();
  }, []);
  useEffect(() => {
    if (servicePackage) {
      fetchServicePackage();
    }
  }, [servicePackage]);
  useEffect(() => {
    if (isCalloutRestirction) {
      form.setFieldsValue({ callout: undefined });
    }
  }, [isCalloutRestirction, form]);
  const fetchAssetModels = async () => {
    let res = await _unitOfWork.assetModel.getAllAssetModel();
    if (res && res.code === 1) {
      setAssetModels(res.data);
    }
  };
  const fetchServicePackage = async () => {
    let res =
      await _unitOfWork.servicePackage.getServicePackageById(servicePackage);
    if (res && res.code === 1) {
      setServicePackageChange(res.servicePackage);
      setAmcSpareParts(res.servicePackageSpareParts);
      let _servicePackageServices = res.servicePackageServices;
      let _amcServices = _servicePackageServices.map((_) => {
        return {
          ..._,
          amcServiceTasks: _.servicePackageServiceTasks,
        };
      });
      setAmcServices(_amcServices);
    }
  };
  const getAllCustomers = async () => {
    const res = await _unitOfWork.customer.getAllCustomer();
    if (res) {
      const options = res.data.map((item) => ({
        label: item.customerName,
        value: item.id,
      }));
      setCustomers(options);
    }
  };
  const getAllServiceContractor = async () => {
    const res = await _unitOfWork.serviceContractor.getAllServiceContractors();
    if (res) {
      setServiceContractors(res.data);
    }
  };
  const getAllSparePart = async () => {
    const res = await _unitOfWork.sparePart.getSpareParts();
    if (res) {
      const options = res.data.map((item) => ({
        label: item.sparePartsName + " - " + item.code,
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
  const getAllServicePackages = async () => {
    const res = await _unitOfWork.servicePackage.getAllServicePackages();
    if (res && res.code === 1) {
      setServicePackages(res.data);
    }
  };
  const handleSubmit = async (values) => {
    const newSupportDocuments = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const resUpload = await _unitOfWork.resource.uploadImage({
          file: file?.originFileObj,
        });
        if (resUpload && resUpload.code === 1) {
          newSupportDocuments.push({
            resource: resUpload.resourceId,
          });
        }
      }
    }
    let payload = {
      amc: {
        ...values,
      },
      amcServices: amcServices,
      amcSpareParts: amcSpareParts,
      listResource: newSupportDocuments,
    };

    let res = await _unitOfWork.amc.createAmc(payload);
    if (res && res.code === 1) {
      navigate(-1);
    }
  };

  const handleAdd = () => {
    const newAmcSpareParts = [...amcSpareParts];
    newAmcSpareParts.push({});
    setAmcSpareParts(newAmcSpareParts);
  };

  const handleDelete = (_idx) => {
    const newData = [...amcSpareParts];
    newData.splice(_idx, 1);
    setAmcSpareParts(newData);
  };

  const handleChange = (_idx, field, value) => {
    const newData = [...amcSpareParts];
    newData[_idx][field] = value;
    setAmcSpareParts(newData);
  };
  const handleMenuClick = async (e) => {
    const selectedKey = e.key;
    let res = await _unitOfWork.service.getServiceById(selectedKey);
    if (res && res.code === 1) {
      setAmcServices((prev) => [...prev, { service: res.service }]);
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      {services.map((_service) => (
        <Menu.Item key={_service.id}>{_service.serviceName}</Menu.Item>
      ))}
    </Menu>
  );
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    let newFileList = [...fileList];
    for (let file of files) {
      if (file.size > 100 * 1024 * 1024) {
        message.error(
          t("modal.attachmentUpload.messages.file_too_large", {
            name: file.name,
            max: 100,
          }),
        );
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      newFileList.push({
        id: `${Date.now()}-${file.name}`,
        originFileObj: file,
        resource: {
          fileName: file.name,
          createdBy: {
            fullName: user.fullName,
          },
        },
        createdAt: new Date(),
        new: true,
      });
    }
    setFileList(newFileList);
    e.target.value = "";
  };
  const onClickDelete = (item) => {
    // if (!item.new) {
    //   const amcResourceId = {
    //     id: item?.id,
    //     resource: item?.resource?.id
    //   };
    //   if (amcResourceId) {
    //     setDeletedAmcResourceIds(prev => [...prev, amcResourceId]);
    //   }
    // }
    setFileList((prev) => prev.filter((data) => data.id !== item.id));
  };
  const columns = [
    {
      title: t("amc.service.spare_code"),
      dataIndex: "key",
      render: (_, __, index) => index + 1,
      width: "10%",
      align: "center",
    },
    {
      title: t("amc.service.select_spare"),
      dataIndex: "sparePart",
      render: (_, record, _idx) => (
        <Select
          value={record.sparePart}
          onChange={(value) => handleChange(_idx, "sparePart", value)}
          style={{ width: "100%" }}
          showSearch
          allowClear
          options={(spareParts || []).map((item, key) => ({
            key: key,
            value: item.value,
            label: item.label,
          }))}
          filterOption={filterOption}
        />
      ),
    },
    {
      title: t("amc.service.action"),
      width: 80,
      align: "center",
      render: (_, __, _idx) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(_idx)}
          danger
        />
      ),
    },
  ];
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
      render: (_, record) => priceFormatter(0),
    },
  ];
  const calTotalPrice = () => 0;

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
      className="create-amc-container"
      onFinish={handleSubmit}
    >
      <Card
        title={t("amc.form.create_title")}
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
            <Form.Item
              labelAlign="left"
              label={t("amc.form.contract_no")}
              name="amcNo"
              rules={[
                { required: true, message: t("amc.form.contract_no_required") },
              ]}
            >
              <Input placeholder={t("amc.form.contract_no_placeholder")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("amc.form.service_contractor")}
              name="serviceContractor"
              rules={[
                {
                  required: true,
                  message: t("amc.form.service_contractor_rules"),
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                options={(serviceContractors || []).map((item, key) => ({
                  key: key,
                  value: item.id,
                  label: item.serviceContractorName,
                }))}
                placeholder={t("amc.form.service_contractor_rules")}
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("amc.form.user")}
              name="customer"
              // rules={[
              //     {
              //         required: true,
              //         message: t("amc.form.user_required"),
              //     },
              // ]}
            >
              <Select
                style={{ width: "100%" }}
                options={(customers || []).map((item, key) => ({
                  key: key,
                  value: item.value,
                  label: item.label,
                }))}
                placeholder={t("amc.form.user_placeholder")}
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("amc.form.service_package")}
              name="servicePackage"
            >
              <Select
                style={{ width: "100%" }}
                options={(servicePackages || []).map((item, key) => ({
                  key: key,
                  value: item.id,
                  label: item.servicePackageName,
                }))}
                placeholder={t("amc.form.service_package_placeholder")}
                filterOption={filterOption}
                showSearch={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("amc.form.date_signed")}
              name="signedDate"
              labelAlign="left"
            >
              <DatePicker
                style={{ width: "100%" }}
                format={FORMAT_DATE}
                placeholder={t("amc.form.date_signed_required")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("amc.form.effective_date")}
              name="effectiveDate"
              labelAlign="left"
              required
              rules={[
                {
                  required: true,
                  message: t("amc.form.contract_period_input"),
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format={FORMAT_DATE}
                placeholder={t("amc.form.effective_date_placeholder")}
              />
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
                name="calloutRestirctionNo"
                rules={[
                  {
                    required: true,
                    message: t("amc.form.spare_limit_required"),
                  },
                ]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            )}
          </Col>
        </Row>
      </Card>
      <Row>
        <Col span={24} className="mt-2">
          {/* <AttachmentModel value={fileList} onChange={setFileList} /> */}
          <TabAttachment
            listDocuments={fileList}
            onClickCreate={() => inputRef.current.click()}
            notButtonCreateDocument={true}
            onClickDelete={onClickDelete}
            notFileType={true}
            preview={false}
          />
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Col>
      </Row>
      {!noCharge && (
        <Row className="p-3">
          <Col span={24}>
            <Collapse defaultActiveKey={["1"]}>
              <Collapse.Panel
                className="panel-amc-spare-part"
                header={t("amc.service.spare_title")}
                key="1"
                extra={
                  <Button
                    type="dashed"
                    className="float-right bt-green"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd();
                    }}
                    style={{ marginBottom: 16 }}
                  >
                    {t("amc.service.add_spare_button")}
                  </Button>
                }
              >
                <Table
                  columns={columns}
                  dataSource={amcSpareParts}
                  pagination={false}
                  rowKey="key"
                  bordered
                />
              </Collapse.Panel>
            </Collapse>
          </Col>
          <Col span={24} className="text-right mt-2 pr-3">
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button type="primary" className="bt-green">
                {t("amc.service.add_service")} <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
          <Col span={24} className="mt-2">
            <div className="header-service-package-service">
              {amcServices.map((amcService, _idx) => {
                return (
                  <AmcService
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
          {servicePackageChange && (
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
          )}
        </Row>
      )}
    </Form>
  );
}
