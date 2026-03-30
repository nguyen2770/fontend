import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from "antd";
import React, { use, useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { filterOption } from "../../../helper/search-select-helper";
import { CloseCircleOutlined, PlusCircleFilled } from "@ant-design/icons";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";
import AssetMaintenanceModel from "../../../components/modal/assetModel/AssetMaintenanceModel";
import {
  assetMaintenanceStatus,
  FORMAT_DATE,
  priorityLevelStatus,
} from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
const { Search } = Input;
export default function CloneBreakdown({
  open,
  handleCancel,
  onRefresh,
  breakdown,
}) {
  console.log(breakdown);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isOpenAsseMaintenancetModel, setIsOpenAssetMaintenanceModel] =
    useState(false);
  const [assetMaintenceChange, setAssetMaintenceChange] = useState(null);
  const [showSubServiceCategory, setShowSubServiceCategory] = useState(false);
  const [serviceSubCategorys, setServiceSubCategorys] = useState([]);
  const [serviceCategorys, setServiceCategorys] = useState([]);
  const [assetModelFailureTypes, setAssetModelFailureTypes] = useState([]);
  const [amcs, setAmcs] = useState([]);
  const [services, setServices] = useState([]);
  const [amcServices, setAmcServices] = useState(null);
  const [assetMaintenanceStatusHistorys, setAssetMaintenanceStatusHistorys] =
    useState([]);
  useEffect(() => {
    fetchGetAllServiceCategory();
    if (open && breakdown) {
      const asset = breakdown.assetMaintenance;

      setAssetMaintenceChange(asset);
      form.setFieldsValue({
        serial: breakdown?.assetMaintenance?.serial,
        assetNumber: breakdown?.assetMaintenance?.assetNumber,
        customer: breakdown?.assetMaintenance?.customer?.customerName,
        amc: breakdown?.amc?._id || breakdown?.amc?.id,
        service: breakdown?.service?._id || breakdown?.service?.id,
        asset: breakdown?.assetMaintenance?.assetName,
        assetModel: breakdown?.assetMaintenance?.assetModelName,
        serviceCategory:
          breakdown?.serviceCategory?._id || breakdown?.serviceCategory?.id,
        subServiceCategory:
          breakdown?.subServiceCategory?._id ||
          breakdown?.subServiceCategory?.id,
        incidentDeadline: breakdown?.incidentDeadline
          ? dayjs(breakdown.incidentDeadline)
          : null,
        assetMaintenanceStatus: breakdown?.assetMaintenanceStatus,
        priorityLevel: breakdown?.priorityLevel,
        breakdownDefect:
          breakdown?.breakdownDefect?._id || breakdown?.breakdownDefect?.id,
        defectDescription: breakdown?.defectDescription,
      });
      if (breakdown.customer) {
        fetchGetAllAmcByCustomer(breakdown.customer);
      }
    }
  }, [open]);
  useEffect(() => {
    if (assetMaintenceChange) {
      fetchGetAssetModelFailureTypeByAssetModel();
    }
  }, [assetMaintenceChange]);

  useEffect(() => {
    const customer = form.getFieldValue("customer");
    if (customer) {
      fetchGetAllAmcByCustomer(
        assetMaintenceChange.customer?._id || assetMaintenceChange.customer?.id,
      );
    }
  }, [form.getFieldValue("customer")]);

  const fetchGetAssetModelFailureTypeByAssetModel = async () => {
    setAssetModelFailureTypes([]);
    let payload = {
      assetModel:
        assetMaintenceChange?.assetModel?._id ||
        assetMaintenceChange?.assetModel?.id,
    };
    let res =
      await _unitOfWork.assetModelFailureType.getAllAssetModelFailureType(
        payload,
      );
    if (res && res.code === 1) {
      setAssetModelFailureTypes(res.data);
    }
  };

  const fetchGetAllServiceCategory = async () => {
    let res = await _unitOfWork.serviceCategory.getAllServiceCategories();
    if (res && res.code === 1) {
      setServiceCategorys(res.data);
    }
  };

  const fetchGetAllAmcByCustomer = async (customerId) => {
    let res = await _unitOfWork.amc.getAllAmcs({ customer: customerId });
    if (res && res.code === 1) {
      setAmcs(res.data || []);
    }
  };
  const onFinish = async () => {
    const values = await form.getFieldsValue();
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
    const formatedValues = {
      ...values,
      listResource: newSupportDocuments,
      assetMaintenance: assetMaintenceChange?.id || assetMaintenceChange?._id,
    };
    const response =
      await _unitOfWork.breakdown.createBreakdown(formatedValues);
    if (response && response.code === 1) {
      handleCancel();
      form.resetFields();
      onRefresh();
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("breakdown.create.messages.create_success"),
      );
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("breakdown.create.messages.create_error"),
      );
    }
  };

  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  const onClickSearchAssetMaintenance = (value) => {
    setIsOpenAssetMaintenanceModel(true);
    setAssetModelFailureTypes([]);
    form.setFieldsValue({
      serial: null,
      assetNumber: null,
      customer: null,
      asset: null,
      assetModel: null,
      category: null,
      assetMaintenanceStatus: null,
    });
  };

  const handleServiceTypeChange = async (value) => {
    setShowSubServiceCategory(!!value);
    setServiceSubCategorys([]);
    form.setFieldsValue({ subServiceCategory: null });
    const res =
      await _unitOfWork.serviceSubCategory.getServiceSubCategorieByServiceCategory(
        { id: value },
      );
    if (res && res.code === 1) {
      setServiceSubCategorys(res.data);
    }
  };

  const handleService = async (value) => {
    let res = await _unitOfWork.amc.getAmcById(value, { havePopulate: true });
    if (res && res.code === 1) {
      setAmcServices(res.amcServices);
      form.setFieldsValue({ service: null });
    }
  };

  return (
    <Modal
      open={open}
      closable={false}
      className="custom-modal"
      footer={false}
      style={{ top: "50px" }}
      width={"80%"}
    >
      <Form
        labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card
          title={t("breakdown.create.title")}
          extra={
            <>
              <Button onClick={onCancel} style={{ marginRight: 8 }} danger>
                <CloseCircleOutlined />
                {t("breakdown.create.buttons.cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                <PlusCircleFilled />
                {t("breakdown.create.buttons.submit")}
              </Button>
            </>
          }
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                label={t("assetMaintenance.asset_number")}
                name="assetNumber"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("assetMaintenance.please_select_an_asset"),
                  },
                ]}
              >
                <Search
                  placeholder={t("preventive.form.serial_placeholder")}
                  allowClear
                  enterButton={t("preventive.buttons.find_asset")}
                  onSearch={onClickSearchAssetMaintenance}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("preventive.form.serial")}
                name="serial"
                labelAlign="left"
              >
                <Input placeholder={t("preventive.form.serial")} disabled></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.customer")}
                name="customer"
                labelAlign="left"
              >
                <Input
                  placeholder={t("breakdown.create.fields.customer")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            {form.getFieldValue("customer") && (
              <Col span={12}>
                <Form.Item
                  label={t("breakdown.create.fields.amc")}
                  name="amc"
                  labelAlign="left"
                >
                  <Select
                    placeholder={t("breakdown.create.placeholders.contract")}
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
            )}
            {form.getFieldValue("amc") && (
              <Col span={12}>
                <Form.Item
                  label={t("breakdown.create.fields.service")}
                  name="service"
                  labelAlign="left"
                >
                  <Select
                    placeholder={t("breakdown.create.placeholders.service")}
                    showSearch
                    allowClear
                    options={(amcServices || []).map((item) => ({
                      value: item._id || item.id,
                      label: item?.service?.serviceName,
                    }))}
                    filterOption={filterOption}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.asset")}
                name="asset"
                labelAlign="left"
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.asset")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.asset_model")}
                name="assetModel"
                labelAlign="left"
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.model")}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.service_category")}
                name="serviceCategory"
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "breakdown.create.placeholders.service_category",
                  )}
                  showSearch
                  allowClear
                  options={(serviceCategorys || []).map((item) => ({
                    value: item.id,
                    label: item.serviceCategoryName,
                  }))}
                  onChange={handleServiceTypeChange}
                />
              </Form.Item>
            </Col>
            {showSubServiceCategory && (
              <Col span={12}>
                <Form.Item
                  label={t("breakdown.create.fields.service_sub_category")}
                  name="subServiceCategory"
                  labelAlign="left"
                >
                  <Select
                    placeholder={t(
                      "breakdown.create.placeholders.service_sub_category",
                    )}
                    showSearch
                    allowClear
                    options={(serviceSubCategorys || []).map((item) => ({
                      value: item.id,
                      label: item.serviceSubCategoryName,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item
                name="incidentDeadline"
                label={t("breakdown.create.fields.incident_deadline")}
                labelAlign="left"
              >
                <DatePicker
                  placeholder={t(
                    "breakdown.create.placeholders.incident_deadline",
                  )}
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.asset_status")}
                name="assetMaintenanceStatus"
                labelAlign="left"
                // initialValue={assetMaintenanceStatus.isNotActive}
                rules={[
                  {
                    required: true,
                    message: t(
                      "breakdown.create.validation.asset_status_required",
                    ),
                  },
                ]}
              >
                <Select
                  placeholder={t("breakdown.create.placeholders.asset_status")}
                  options={
                    assetMaintenanceStatusHistorys.length > 0
                      ? assetMaintenanceStatus.Options.filter(
                          (item) =>
                            item.value === assetMaintenanceStatus.isNotActive,
                        ).map((item) => ({
                          value: item.value,
                          label: t(item.label),
                        }))
                      : assetMaintenanceStatus.Options.map((item) => ({
                          value: item.value,
                          label: t(item.label),
                        }))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.priority_level")}
                name="priorityLevel"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("breakdown.create.validation.priority_required"),
                  },
                ]}
              >
                <Select
                  placeholder={t(
                    "breakdown.create.placeholders.priority_level",
                  )}
                  options={(priorityLevelStatus.Options || []).map((item) => ({
                    value: item.value,
                    label: t(item.label),
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.failure_type")}
                name="breakdownDefect"
                labelAlign="left"
              >
                <Select
                  placeholder={t("breakdown.create.placeholders.failure_type")}
                  options={(assetModelFailureTypes || []).map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.create.fields.description")}
                name="defectDescription"
                labelAlign="left"
              >
                <Input.TextArea
                  placeholder={t("breakdown.create.placeholders.description")}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <AttachmentModel value={fileList} onChange={setFileList} />
              <AssetMaintenanceModel
                open={isOpenAsseMaintenancetModel}
                handleCancel={() => setIsOpenAssetMaintenanceModel(false)}
                form={form}
                assetChange={assetMaintenceChange}
                onSelectAssetMaintenance={async (assetMaintenance) => {
                  setAssetMaintenceChange(assetMaintenance);
                  const assetMaintenanceIsNotActiveHistorys =
                    await _unitOfWork.assetMaintenanceIsNotActiveHistory.getAssetMaintenanceIsNotActiveHistoryByAssetMaintenance(
                      {
                        assetMaintenance:
                          assetMaintenance.id || assetMaintenance._id,
                      },
                    );
                  setAssetMaintenanceStatusHistorys(
                    assetMaintenanceIsNotActiveHistorys?.data || [],
                  );
                  form.setFieldsValue({
                    assetModel: assetMaintenance?.assetModel?.assetModelName,
                    asset: assetMaintenance?.assetModel?.asset?.assetName,
                    serial: assetMaintenance?.serial,
                    assetNumber: assetMaintenance?.assetNumber,
                    customer: assetMaintenance?.customer?.customerName,
                  });
                }}
              />
            </Col>{" "}
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
