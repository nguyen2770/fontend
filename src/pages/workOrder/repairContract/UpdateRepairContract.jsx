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
  DatePicker,
  InputNumber,
  Collapse,
  Table,
  message,
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
import useAuth from "../../../contexts/authContext";

export default function UpdateRepairContract() {
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
  const inputRef = useRef();
  const { user } = useAuth();
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
      setFileList(res?.repairContractWithRes?.listResource || []);
      setAmcSpareParts(res?.repairContractWithRes?.repairContractSpareParts);
    }
  };
  const handleSubmit = async (values) => {
    const newSupportDocuments = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.new) {
          const resUpload = await _unitOfWork.resource.uploadImage({
            file: file?.originFileObj,
          });
          if (resUpload && resUpload.code === 1) {
            newSupportDocuments.push({
              resource: resUpload.resourceId,
            });
          }
        } else {
          newSupportDocuments.push({ resource: file?.resource?.id });
        }
      }
    }
    let payload = {
      id: params?.id,
      repairContract: {
        ...values,
      },
      spareParts: amcSpareParts,
      listResource: newSupportDocuments,
    };
    let res = await _unitOfWork.repairContract.updateRepairContract(payload);
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.update")
      );
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
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    let newFileList = [...fileList];
    for (let file of files) {
      if (file.size > 100 * 1024 * 1024) {
        message.error(
          t("modal.attachmentUpload.messages.file_too_large", {
            name: file.name,
            max: 100,
          })
        );
        continue;
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      newFileList.push({
        id: `${Date.now()}-${file.name}`,
        originFileObj: file,
        resource: {
          fileName: file.name,
          createdBy: {
            fullName: user.fullName,
          }
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
    setFileList(prev => prev.filter(data => data.id !== item.id));
  }
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
      onFinish={handleSubmit}
    >
      <Card
        title={t("repair_contract.title_update_repair_contract")}
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
              <SaveOutlined />
              {t("common_buttons.update")}
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
              rules={[
                { required: true, message: t("amc.form.contract_no_required") },
              ]}
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
              required
              rules={[
                {
                  required: true,
                  message: t("calibration_contract.placeholder.effective_date"),
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format={FORMAT_DATE} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("calibration_contract.expiration_date")}
              name="expirationDate"
              labelAlign="left"
              required
              rules={[
                {
                  required: true,
                  message: t(
                    "calibration_contract.placeholder.expiration_date"
                  ),
                },
              ]}
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
                rules={[
                  {
                    required: true,
                    message: t("repair_contract.enter_the_number_of_repairs"),
                  },
                ]}
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
          /> */}
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
                  icon={<PlusCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd();
                  }}
                  style={{ marginBottom: 16 }}
                >
                  {t("common_buttons.create")}
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
      </Row>
    </Form>
  );
}
