/* i18n adjustments only */
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Tabs,
  Upload,
  Table,
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeftCircleFilled, UploadOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import {
  filterOption,
  dropdownRender,
} from "../../../helper/search-select-helper";
import ChosseDepreciationType from "./ChosseDepreciationType";
import TabPane from "antd/es/tabs/TabPane";
import TabsMap from "./TabsMap";
import ChangeAssetModelModal from "../../../components/modal/assetModel/ChangeAssetModelModal";
import useHeader from "../../../contexts/headerContext";
import dayjs from "dayjs";
import {
  assetStyleMap,
  createNewUsingAFormulaType,
  depreciationTypes,
  FORMAT_DATE,
  frequencyOptions,
  FUNDING_SOFURCES,
} from "../../../utils/constant";
import QrCodeTab from "./QrCodeTab";
import DownTimeAssetMaintenanceTabs from "./DownTimeAssetMaintenanceTabs";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import { useTranslation } from "react-i18next";
import GenPreventiveByPreventiveOfModel from "./GenPreventiveByPreventiveOfModel";
import AssetIncidentHistory from "./tabPaneView/AssetIncidentHistory";
import AssetSchedulePreventiveHistory from "./tabPaneView/AssetSchedulePreventiveHistory";
import AssetCalibrationWorkHistory from "./tabPaneView/AssetCalibrationWorkHistory";
import AssetMaintenanceDocument from "./asetMaintenaceDocument";
import AssetMaintenanceChecklist from "./AssetMaintenanceChecklist";
import useAuth from "../../../contexts/authContext";

export default function ViewAssetMaintaenance() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const { setHeaderTitle } = useHeader();
  const assetStyle = Form.useWatch("assetStyle", form);
  const [assetModelChange, setAssetModelChange] = useState(null);
  const [assetMaintaenance, setAssetMaintaenance] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isOpenAssetModel, setIsOpenAssetModel] = useState(false);
  const depreciationType = Form.useWatch("depreciationType", form);
  const [assetModelSpareParts, setAssetModelSpareParts] = useState([]);
  const lifeSpan = Form.useWatch("lifeSpan", form);
  const Period = Form.useWatch("Period", form);
  const { companySetting } = useAuth();

  useEffect(() => {
    setHeaderTitle(t("assetMaintenance.form.view_title"));
    fetchGetAllCustomer();
    fetGetAssetMaintenanceById();
  }, []);

  useEffect(() => {
    if (assetModelChange) {
      fetchAssetModels(assetModelChange);
      fetchAssetModelSpareParts(assetModelChange);
    }
  }, [assetModelChange]);

  const fetGetAssetMaintenanceById = async () => {
    const res = await _unitOfWork.assetMaintenance.getAssetMaintenanceById({
      id: params.id,
    });
    if (res && res.code === 1) {
      setAssetMaintaenance(res.data);
      form.setFieldsValue({
        ...res.data,
        assetModelName: res.data?.assetModel?.assetModelName,
        assetName: res?.asset?.asset?.assetName,
        assetType: res.data?.assetModel?.assetType?.name,
        assetTypeCategory: res.data?.assetModel?.assetTypeCategory?.name,
        category: res.data?.assetModel?.category?.categoryName,
        manufacturer: res.data?.assetModel?.manufacturer?.manufacturerName,
        subCategory: res.data?.assetModel?.subCategory?.subCategoryName,
        supplier: res.data?.assetModel?.supplier?.supplierName,
        isMovable:
          res.data?.isMovable === true ||
            res.data?.isMovable === 1 ||
            res.data?.isMovable === "true"
            ? true
            : false,
        purchaseDate: res.data?.purchaseDate
          ? dayjs(res.data?.purchaseDate).add(7, "hour")
          : null,
        installationDate: res.data?.installationDate
          ? dayjs(res.data?.installationDate).add(7, "hours")
          : null,
        firstInspectionDate: res.data?.firstInspectionDate
          ? dayjs(res.data?.firstInspectionDate).add(7, "hours")
          : null,
        depreciationType: res.data?.depreciationType,
        depreciationBase: res.data?.depreciationBase,
        customer: res.data?.customer?.id,
      });

      setAssetModelChange(res.data?.assetModel);

      if (res.data?.resource) {
        setFileList([
          {
            uid: res.data?.resource?.id,
            name: res.data?.resource?.fileName,
            url: _unitOfWork.resource.getImage(res.data?.resource?.id),
            supportDocumentId: res.data?.resource?.id,
          },
        ]);
      }
    }
  };

  const fetchAssetModelSpareParts = async (assetModelId) => {
    let res = await _unitOfWork.assetModelSparePart.getResById({
      id: assetModelId?.id,
    });
    if (res && res.code === 1) {
      setAssetModelSpareParts(res?.data);
    }
  };
  const fetchGetAllCustomer = async () => {
    let res = await _unitOfWork.customer.getAllCustomer();
    if (res && res.code === 1) {
      setCustomers(res.data);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChangeUpload = async (info) => {
    let newFileList = info.fileList.slice(-1);
    for (let i = 0; i < newFileList.length; i++) {
      if (!newFileList[i].src && newFileList[i].originFileObj) {
        newFileList[i].src = await getBase64(newFileList[i].originFileObj);
      }
    }
    setFileList(newFileList);
  };

  const propss = {
    onChange: handleChangeUpload,
    multiple: true,
    fileList: fileList,
  };

  const fetchAssetModels = async () => { };
  const generateNextInspectionDate = (lasttInspectionDate) => {
    let _firstInspectionDate = dayjs(lasttInspectionDate);
    let _nextDay = nextDay(_firstInspectionDate, lifeSpan);
    if (_nextDay > dayjs()) {
      return _nextDay;
    } else {
      return generateNextInspectionDate(_nextDay);
    }
  };

  const nextDay = (date, interval) => {
    switch (Period) {
      case 1: {
        return date.add(interval, "day");
      }
      case 2: {
        return date.add(interval, "week");
      }
      case 3: {
        return date.add(interval, "month");
      }
      case 4: {
        return date.add(interval, "year");
      }
    }
  };

  const columnParameters = [
    {
      title: t("assetMaintenance.export.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("assetMaintenance.form.fields.parameter_name"),
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "50%",
    },
    {
      title: t("assetMaintenance.form.fields.parameter_value"),
      dataIndex: "value",
      key: "value",
      align: "center",
    },
  ];
  const assetModelSparePartsColumns = [
    {
      title: t("sparePart.list.table.index"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("sparePart.list.table.name"),
      dataIndex: "sparePart",
      key: "sparePart",
      render: (_text, record) => record.sparePart?.sparePartsName,
    },
    {
      title: t("sparePart.list.table.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
    },
    {
      title: t("sparePart.list.table.replacement_cycle"),
      dataIndex: "sparePart",
      key: "sparePart",
      align: "right",
      render: (_text, record) =>
        record.sparePart?.lifeSpan
          ? record.sparePart?.lifeSpan +
          " " +
          frequencyOptions.Option.find(
            (item) => item.value === record.sparePart?.Period,
          )?.label
          : "",
    },
  ];
  const itemDataAssetModel = [
    {
      label: t("assetMaintenance.form.fields.parameter_name"),
      key: 1,
      children: (
        <Table
          rowKey="id"
          columns={columnParameters}
          key={"id"}
          dataSource={assetModelChange?.assetModelParameters ?? []}
          bordered
          pagination={false}
        ></Table>
      ),
    },
    {
      label: t("common.modal.sparepartSelector.title"),
      key: 2,
      children: (
        <Table
          rowKey="id"
          columns={assetModelSparePartsColumns}
          key={"id"}
          dataSource={assetModelSpareParts || []}
          bordered
          pagination={false}
        ></Table>
      ),
    },
  ];
  return (
    <>
      <Card
        title=""
        extra={
          <Button key="back" onClick={() => navigate(-1)}>
            <LeftCircleFilled />
            {t("assetMaintenance.form.buttons.back")}
          </Button>
        }
      >
        <Form
          labelWrap
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab={t("assetMaintenance.form.tabs.basic_info")} key="1">
              <Row gutter={[16]}>
                <Col span={12}>
                  <Form.Item
                    labelAlign="left"
                    label={t("assetMaintenance.form.fields.asset_style")}
                    name={"assetStyle"}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Radio.Group>
                      <Radio value={1}>
                        {t(
                          "assetMaintenance.list.search.asset_type_option.machine",
                        )}
                      </Radio>
                      <Radio value={2}>
                        {t(
                          "assetMaintenance.list.search.asset_type_option.measuring",
                        )}
                      </Radio>
                      <Radio value={3}>
                        {t(
                          "assetMaintenance.list.search.asset_type_option.facility",
                        )}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                {companySetting.createNewUsingAFormula &&
                  companySetting?.autoGenerateAssetNumber &&
                 (companySetting.createNewUsingAFormula ===
                         createNewUsingAFormulaType.healthInsurance ||
                         companySetting.createNewUsingAFormula ===
                           createNewUsingAFormulaType.healthInsuranceDecree3176) && (
                    <Col span={12}>
                      <Form.Item
                        labelAlign="left"
                        label={t("assetMaintenance.funding_sources")}
                        name="fundingSources"
                      >
                        <Radio.Group>
                          {FUNDING_SOFURCES.map((item) => (
                            <Radio key={item.value} value={item.value}>
                              {t(item.label)}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  )}
              </Row>
              <Row gutter={[16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.asset_name")}
                    labelAlign="left"
                    name="assetName"
                  >
                    <Input
                      disabled
                      placeholder={t(
                        "assetMaintenance.form.placeholders.asset_name",
                      )}
                    />
                  </Form.Item>
                </Col>
                {(assetStyle === 1 || assetStyle === 2) && (
                  <>
                    <Col span={12}>
                      <Form.Item
                        label={t("assetMaintenance.form.fields.manufacturer")}
                        labelAlign="left"
                        name="manufacturer"
                      >
                        <Input
                          placeholder={t(
                            "assetMaintenance.form.placeholders.manufacturer",
                          )}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={t("assetMaintenance.form.fields.supplier")}
                        labelAlign="left"
                        name="supplier"
                      >
                        <Input placeholder="" disabled />
                      </Form.Item>
                    </Col>
                  </>
                )}
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.asset_type")}
                    labelAlign="left"
                    name="assetTypeCategory"
                  >
                    <Input
                      placeholder={t("assetMaintenance.form.fields.asset_type")}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.category")}
                    labelAlign="left"
                    name="category"
                  >
                    <Input
                      placeholder={t("assetMaintenance.form.fields.category")}
                      disabled
                    />
                  </Form.Item>
                </Col>
                {(assetStyle === 1 || assetStyle === 2) && (
                  <Col span={12}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.sub_category")}
                      labelAlign="left"
                      name="subCategory"
                    >
                      <Input
                        placeholder={t(
                          "assetMaintenance.form.fields.sub_category",
                        )}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                )}
                {assetStyle === 3 && (
                  <Col span={12}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.model")}
                      labelAlign="left"
                      name="assetModelName"
                    >
                      <Input
                        placeholder={t(
                          "assetMaintenance.form.placeholders.model",
                        )}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row gutter={[16]}>
                <Col span={12} className="p-0">
                  <Col span={24}>
                    <Form.Item
                      label={t(
                        "assetMaintenance.form.fields.installation_date",
                      )}
                      name="installationDate"
                      labelAlign="left"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder={t(
                          "assetMaintenance.form.placeholders.installation_date",
                        )}
                        format={FORMAT_DATE}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.asset_number")}
                      name="assetNumber"
                      labelAlign="left"
                    >
                      <Input
                        disabled
                        placeholder={t("assetMaintenance.asset_number")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.serial")}
                      name="serial"
                      labelAlign="left"
                    >
                      <Input
                        disabled
                        placeholder={t(
                          "assetMaintenance.form.placeholders.serial",
                        )}
                      />
                    </Form.Item>
                  </Col>

                  {(assetStyle === 1 || assetStyle === 2) && (
                    <Col span={24}>
                      <Form.Item
                        label={t("assetMaintenance.form.fields.movable")}
                        labelAlign="left"
                        name="isMovable"
                        initialValue={false}
                      >
                        <Select
                          disabled
                          placeholder={t(
                            "assetMaintenance.form.placeholders.movable",
                          )}
                          options={[
                            {
                              label: t("assetMaintenance.form.options.yes"),
                              value: true,
                            },
                            {
                              label: t("assetMaintenance.form.options.no"),
                              value: false,
                            },
                          ]}
                        ></Select>
                      </Form.Item>
                    </Col>
                  )}
                  <Col span={24}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.note")}
                      name="description"
                      labelAlign="left"
                    >
                      <Input
                        disabled
                        placeholder={t(
                          "assetMaintenance.form.placeholders.note",
                        )}
                      />
                    </Form.Item>
                  </Col>
                  {assetStyle === 1 && (
                    <>
                      <Col span={24}>
                        <Form.Item
                          label={t(
                            "assetMaintenance.form.fields.depreciation_type",
                          )}
                          labelAlign="left"
                          name="depreciationType"
                        >
                          <Select
                            placeholder={t(
                              "assetMaintenance.form.placeholders.depreciation_type",
                            )}
                            disabled
                            options={(depreciationTypes.Options || []).map(
                              (item) => ({
                                value: item.value,
                                label: t(item.label),
                              }),
                            )}
                            filterOption={filterOption}
                            dropdownStyle={dropdownRender}
                          ></Select>
                        </Form.Item>
                      </Col>
                      <ChosseDepreciationType
                        selectedDepreciationType={depreciationType}
                      />
                    </>
                  )}
                </Col>
                <Col span={12} className="p-0">
                  {assetStyle !== 3 && (
                    <Col span={24}>
                      <Form.Item
                        label={t("assetMaintenance.form.fields.model")}
                        labelAlign="left"
                        name="assetModelName"
                      >
                        <Input
                          placeholder={t(
                            "assetMaintenance.form.placeholders.model",
                          )}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  )}
                  <Col span={24}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.image")}
                      name="image"
                      labelAlign="left"
                    >
                      <div className="remove-tolltip">
                        <Upload
                          {...propss}
                          disabled
                          name="image"
                          accept="image/png,image/jpeg,image/jpg"
                          listType="picture-card"
                          maxCount={1}
                          showUploadList={{
                            showPreviewIcon: false,
                            showRemoveIcon: true,
                          }}
                          beforeUpload={(file) => {
                            const isImage =
                              file.type === "image/png" ||
                              file.type === "image/jpeg" ||
                              file.type === "image/jpg";
                            if (!isImage) {
                              window?.message?.error?.("PNG/JPG only");
                            }
                            return isImage || Upload.LIST_IGNORE;
                          }}
                          fileList={fileList}
                        ></Upload>
                      </div>
                    </Form.Item>
                  </Col>
                </Col>
              </Row>
              {assetModelChange && (
                <>
                  <Tabs type="card" items={itemDataAssetModel} />
                </>
              )}
            </TabPane>
            <TabPane
              tab={t("assetMaintenance.form.tabs.additional_info")}
              key="2"
            >
              <Row gutter={[16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.purchase_date")}
                    name="purchaseDate"
                    labelAlign="left"
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder={t(
                        "assetMaintenance.form.placeholders.purchase_date",
                      )}
                      format={FORMAT_DATE}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.purchase_value")}
                    name="purchaseValue"
                    labelAlign="left"
                  >
                    <InputNumber
                      placeholder={t(
                        "assetMaintenance.form.placeholders.purchase_value",
                      )}
                      style={{ width: "100%" }}
                      formatter={formatCurrency}
                      parser={parseCurrency}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.purchase_number")}
                    name="purchaseNumber"
                    labelAlign="left"
                  >
                    <Input
                      placeholder={t(
                        "assetMaintenance.form.placeholders.purchase_number",
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t(
                      "assetMaintenance.form.fields.service_provider_name",
                    )}
                    name="serviceProviderName"
                    labelAlign="left"
                  >
                    <Input
                      placeholder={t(
                        "assetMaintenance.form.placeholders.service_provider_name",
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t(
                      "assetMaintenance.form.fields.year_of_manufacturing",
                    )}
                    name="yearOfManufacturing"
                    labelAlign="left"
                  >
                    <InputNumber
                      placeholder={t(
                        "assetMaintenance.form.placeholders.year_of_manufacturing",
                      )}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.capacity_rating")}
                    name="capacityRating"
                    labelAlign="left"
                  >
                    <Input
                      placeholder={t(
                        "assetMaintenance.form.placeholders.capacity_rating",
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.criticality")}
                    name="criticality"
                    labelAlign="left"
                  >
                    <Input
                      placeholder={t(
                        "assetMaintenance.form.placeholders.criticality",
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.customer")}
                    name="customer"
                    labelAlign="left"
                  >
                    <Select
                      placeholder={t(
                        "assetMaintenance.form.placeholders.customer",
                      )}
                      options={(customers || []).map((item) => ({
                        value: item.id,
                        label:
                          item.customerName +
                          (item.contactNumber
                            ? ` - ( ${item.contactNumber} )`
                            : ""),
                      }))}
                      allowClear
                      filterOption={filterOption}
                      dropdownStyle={dropdownRender}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t(
                      "assetMaintenance.form.fields.registration_number",
                    )}
                    name="registrationNumber"
                    labelAlign="left"
                  >
                    <Input
                      placeholder={t(
                        "assetMaintenance.form.placeholders.registration_number",
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={t("assetMaintenance.form.tabs.location")} key="3">
              <TabsMap form={form} />
            </TabPane>
            {assetMaintaenance?.assetStyle !== assetStyleMap.accessories && (
              <TabPane tab={t("assetMaintenance.form.tabs.downtime")} key="4">
                <DownTimeAssetMaintenanceTabs
                  assetMaintenance={assetMaintaenance}
                />
              </TabPane>
            )}
            {/* <TabPane
              tab={t("assetMaintenance.form.tabs.inspection_cycle")}
              key="5"
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={t(
                      "assetMaintenance.form.fields.first_inspection_date"
                    )}
                    name="firstInspectionDate"
                    labelAlign="left"
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder={t(
                        "assetMaintenance.form.placeholders.first_inspection_date"
                      )}
                      format={FORMAT_DATE}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        label={t("assetMaintenance.form.fields.cycle")}
                        name="lifeSpan"
                        labelAlign="left"
                      >
                        <Input
                          placeholder={t(
                            "assetMaintenance.form.placeholders.cycle"
                          )}
                          type="number"
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="Period">
                        <Select
                          placeholder={t(
                            "assetMaintenance.form.placeholders.period"
                          )}
                          options={(frequencyOptions.Option || []).map(
                            (item) => ({
                              key: item.value,
                              value: item.value,
                              label: item.label,
                            })
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t(
                      "assetMaintenance.form.fields.inspection_date_next"
                    )}
                    labelAlign="left"
                  >
                    <b>
                      {" "}
                      {firstInspectionDate &&
                        Period &&
                        lifeSpan &&
                        parseDate(
                          generateNextInspectionDate(firstInspectionDate)
                        )}
                    </b>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane> */}
            <TabPane tab={t("assetMaintenance.form.tabs.qrcode")} key="6">
              <QrCodeTab assetMaintenance={assetMaintaenance} />
            </TabPane>
            {assetMaintaenance?.assetStyle !== assetStyleMap.accessories && (
              <>
                {/* <TabPane
                  tab={t(
                    "assetMaintenance.form.tabs.genPreventiveByPreventiveOfModel",
                  )}
                  key="7"
                >
                  <GenPreventiveByPreventiveOfModel
                    assetMaintenance={assetMaintaenance}
                  />
                </TabPane> */}
                <TabPane
                  tab={t("assetMaintenance.form.tabs.asset_incident_history")}
                  key="8"
                >
                  <AssetIncidentHistory assetMaintenance={assetMaintaenance} />
                </TabPane>
                <TabPane
                  tab={t(
                    "assetMaintenance.form.tabs.asset_schedule_preventive_history",
                  )}
                  key="9"
                >
                  <AssetSchedulePreventiveHistory
                    assetMaintenance={assetMaintaenance}
                  />
                </TabPane>
                <TabPane
                  tab={t(
                    "assetMaintenance.form.tabs.asset_calibration_work_history",
                  )}
                  key="10"
                >
                  <AssetCalibrationWorkHistory
                    assetMaintenance={assetMaintaenance}
                  />
                </TabPane>
              </>
            )}
            <TabPane tab={t("assetModel.model.tabs.documents")} key="11">
              <AssetMaintenanceDocument AssetMaintenance={assetMaintaenance} />
            </TabPane>
          </Tabs>
        </Form>
      </Card>
      <ChangeAssetModelModal
        open={isOpenAssetModel}
        handleCancel={() => setIsOpenAssetModel(false)}
        form={form}
        assetModelChange={assetModelChange}
        onSelectAssetModel={(_assetModel) => {
          setAssetModelChange(_assetModel);
          form.setFieldsValue({
            asset: _assetModel?.asset.id,
            assetName: _assetModel?.asset.assetName,
            manufacturer: _assetModel.manufacturer?.manufacturerName,
            category: _assetModel.category?.categoryName,
            assetTypeCategory: _assetModel.assetTypeCategory?.name,
            subCategory: _assetModel.subCategory?.subCategoryName,
            assetModelName: _assetModel.assetModelName,
            supplier: _assetModel.supplier?.supplierName,
          });
        }}
      />
    </>
  );
}
