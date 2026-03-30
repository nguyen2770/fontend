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
import { useNavigate, useParams } from "react-router-dom";
import { FORMAT_DATE, optionDurationType } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import { filterOption } from "../../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";
import dayjs from "dayjs";
import TabAttachment from "../../../components/fileViewer/TabAttachment";
import useAuth from "../../../contexts/authContext";

export default function UpdateCalibrationContract() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const isCalloutRestirction = Form.useWatch("isCalloutRestirction", form);
  const [customers, setCustomers] = useState([]);
  const [serviceContractors, setServiceContractors] = useState([]);
  const [fileList, setFileList] = useState([]);
  const inputRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    fetchAmc();
  }, []);

  useEffect(() => {
    getAllCustomers();
    getAllServiceContractor();
  }, []);
  useEffect(() => {
    if (isCalloutRestirction) {
      form.setFieldsValue({ callout: undefined });
    }
  }, [isCalloutRestirction, form]);

  const fetchAmc = async () => {
    let res = await _unitOfWork.calibrationContract.getCalibrationContractById(
      params.id
    );
    if (res && res.code === 1) {
      form.setFieldsValue({
        ...res.calibrationContractObj,
        signedDate: res?.calibrationContractObj?.signedDate
          ? dayjs(res?.calibrationContractObj?.signedDate)
          : null,
        effectiveDate: res?.calibrationContractObj?.effectiveDate
          ? dayjs(res?.calibrationContractObj?.effectiveDate)
          : null,
        expirationDate: res?.calibrationContractObj?.expirationDate
          ? dayjs(res?.calibrationContractObj?.expirationDate)
          : null,
      });
      // const resources = res?.calibrationContractObj?.listResource?.map(
      //   (data) => data?.resource
      // );
      // const fileList = resources?.map((doc) => ({
      //   ...doc,
      //   id: doc?.id,
      //   name: doc?.fileName + doc?.extension,
      //   src: _unitOfWork.resource.getImage(doc?.id),
      //   supportDocumentId: doc?.id,
      // }));
      setFileList(res?.calibrationContractObj?.listResource);
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
        } else {
          newSupportDocuments.push({ resource: file?.resource?.id });
        }
      }
    }
    let payload = {
      id: params.id,
      calibrationContract: {
        ...values,
      },
      listResource: newSupportDocuments,
    };
    let res = await _unitOfWork.calibrationContract.updateCalibrationContract(
      payload
    );
    if (res && res.code === 1) {
      navigate(-1);
    }
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
      onFinish={handleSubmit}
    >
      <Card
        title={t("calibration_contract.title_update_alibration_contract")}
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
              {t("amc.form.update")}
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
              {/* <Col>
                <Form.Item
                  name="isSparepartCharge"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>{t("amc.form.no_spare_charge")}</Checkbox>
                </Form.Item>
              </Col> */}
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
                label={t("calibration_contract.number_of_calibrations")}
                name="numberOfCalibrations"
                rules={[
                  {
                    required: true,
                    message: t(
                      "calibration_contract.placeholder.number_of_calibrations"
                    ),
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
      </Row>
    </Form>
  );
}
