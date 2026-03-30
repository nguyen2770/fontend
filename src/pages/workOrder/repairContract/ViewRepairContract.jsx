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
  DatePicker,
  InputNumber,
  Collapse,
  Table,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { FORMAT_DATE } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import { filterOption } from "../../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";
import ShowSuccess from "../../../components/modal/result/successNotification";
import dayjs from "dayjs";
import TabAttachment from "../../../components/fileViewer/TabAttachment";

export default function ViewRepairContract() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const isCalloutRestirction = Form.useWatch("isCalloutRestirction", form);
  const [customers, setCustomers] = useState([]);
  const [serviceContractors, setServiceContractors] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [amcSpareParts, setAmcSpareParts] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  useEffect(() => {
    getAllCustomers();
    getAllServiceContractor();
    getAllSparePart();
    getRepairContractById();
  }, []);

  useEffect(() => {
    if (isCalloutRestirction) {
      form.setFieldsValue({ callout: undefined });
    }
  }, [isCalloutRestirction, form]);

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
  const getRepairContractById = async () => {
    let res = await _unitOfWork.repairContract.getRepairContractById(
      params?.id
    );
    if (res && res.code === 1) {
      form.setFieldsValue({
        ...res?.repairContractWithRes,
        expirationDate: res?.repairContractWithRes?.expirationDate
          ? dayjs(res?.repairContractWithRes?.expirationDate)
          : null,
        effectiveDate: res?.repairContractWithRes?.effectiveDate
          ? dayjs(res?.repairContractWithRes?.effectiveDate)
          : null,
        signedDate: res?.repairContractWithRes?.signedDate
          ? dayjs(res?.repairContractWithRes?.signedDate)
          : null,
      });
      // const resources = res?.repairContractWithRes?.listResource?.map(
      //   (data) => data?.resource
      // );
      // const fileList = resources.map((doc) => ({
      //   ...doc,
      //   id: doc?.id,
      //   name: doc?.fileName + doc?.extension,
      //   src: _unitOfWork.resource.getImage(doc?.id),
      //   supportDocumentId: doc?.id,
      // }));
      setFileList(res?.repairContractWithRes?.listResource);
      setAmcSpareParts(res?.repairContractWithRes?.repairContractSpareParts);
    }
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
  const handleAdd = () => {
    const newAmcSpareParts = [...amcSpareParts];
    newAmcSpareParts.push({});
    setAmcSpareParts(newAmcSpareParts);
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
      width: "7vw",
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
    >
      <Card
        title={t("repair_contract.title_repair_contract_details")}
        extra={
          <>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => navigate(-1)}
            >
              <ArrowLeftOutlined />
              {t("amc.form.back")}
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
              name="contractNo"
            >
              <Input placeholder={t("amc.form.contract_no_placeholder")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign="left"
              label={t("calibration_contract.contract_name")}
              name="contractName"
            >
              <Input
                placeholder={t(
                  "calibration_contract.placeholder.contract_name"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("amc.form.service_contractor")}
              name="serviceContractor"
            >
              <Select
                style={{ width: "100%" }}
                options={(serviceContractors || []).map((item, key) => ({
                  key: key,
                  value: item.id,
                  label: item.serviceContractorName,
                }))}
                allowClear
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
            >
              <Select
                style={{ width: "100%" }}
                options={(customers || []).map((item, key) => ({
                  key: key,
                  value: item.value,
                  label: item.label,
                }))}
                allowClear
                placeholder={t("amc.form.user_placeholder")}
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
              label={t("calibration_contract.effective_date")}
              name="effectiveDate"
              labelAlign="left"
            >
              <DatePicker style={{ width: "100%" }} format={FORMAT_DATE} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("calibration_contract.expiration_date")}
              name="expirationDate"
              labelAlign="left"
            >
              <DatePicker style={{ width: "100%" }} format={FORMAT_DATE} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {!isCalloutRestirction && (
              <Form.Item
                labelAlign="left"
                label={t("repair_contract.number_of_repairs")}
                name="numberOfRepairs"
              >
                <InputNumber
                  defaultValue={0}
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("calibration_contract.total_cost")}
              name="totalCost"
              labelAlign="left"
            >
              <InputNumber
                defaultValue={0}
                style={{ width: "100%" }}
                formatter={formatCurrency}
                parser={parseCurrency}
              />
            </Form.Item>
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
            noCreate={true}
          /> */}
          <TabAttachment
            listDocuments={fileList}
            notFileType={true}
          />
        </Col>
        <Col span={24}>
          <Collapse defaultActiveKey={["1"]}>
            <Collapse.Panel
              className="panel-amc-spare-part"
              header={t("amc.service.spare_title")}
              key="1"
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
      </Row>
    </Form>
  );
}
