/* Only i18n changes */
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
import { useNavigate } from "react-router-dom";
import {
  LeftCircleFilled,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import {
  filterOption,
  dropdownRender,
} from "../../../helper/search-select-helper";
import ChosseDepreciationType from "./ChosseDepreciationType";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";

import TabPane from "antd/es/tabs/TabPane";
import TabsMap from "./TabsMap";
import ChangeAssetModelModalWaitUse from "../../../components/modal/assetModel/ChangeAssetModelModalWaitUse";
import useHeader from "../../../contexts/headerContext";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import {
  createNewUsingAFormulaType,
  depreciationTypes,
  FORMAT_DATE,
  frequencyOptions,
  FUNDING_SOFURCES,
} from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import AssetModelCheckListTab from "./AssetModelCheckList";
import useAuth from "../../../contexts/authContext";
import AssetMaintenanceDocument from "./asetMaintenaceDocument";
const { Search } = Input;
export default function CreateAssetMaintenance() {
  const [form] = Form.useForm();
  const { companySetting } = useAuth();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const assetStyle = Form.useWatch("assetStyle", form);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [assetModelChange, setAssetModelChange] = useState(null);
  const depreciationType = Form.useWatch("depreciationType", form);
  const [fileList, setFileList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isOpenAssetModel, setIsOpenAssetModel] = useState(false);
  const { t } = useTranslation();
  const lifeSpan = Form.useWatch("lifeSpan", form);
  const Period = Form.useWatch("Period", form);
  const serial = Form.useWatch("serial", form);
  const fundingSources = Form.useWatch("fundingSources", form);
  const [assetModelSpareParts, setAssetModelSpareParts] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setHeaderTitle(t("assetMaintenance.form.create_title"));
    form.setFieldsValue({
      assetStyle: 1,
    });
    fetchGetAllCustomer();
  }, []);
  useEffect(() => {
    if (assetModelChange) {
      fetchAssetModels(assetModelChange);
      fetchAssetModelSpareParts(assetModelChange);
    }
  }, [assetModelChange]);
  useEffect(() => {
    if (
      fundingSources &&
      assetModelChange &&
      (companySetting.createNewUsingAFormula ===
        createNewUsingAFormulaType.healthInsurance ||
        companySetting.createNewUsingAFormula ===
        createNewUsingAFormulaType.healthInsuranceDecree3176)
    ) {
      generateAssetNumber();
    }
  }, [assetModelChange, fundingSources, serial]);
  const fetchGetAllCustomer = async () => {
    let res = await _unitOfWork.customer.getAllCustomer();
    if (res && res.code === 1) {
      setCustomers(res.data);
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
  const addItem = () => {
    if (inputValue && !items.includes(inputValue)) {
      setItems([...items, inputValue]);
      setInputValue("");
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

  const onFinish = async () => {
    const values = form.getFieldsValue();
    let resourceId = null;
    if (fileList) {
      const resUpload = await _unitOfWork.resource.uploadImage({
        file: fileList[0]?.originFileObj,
      });
      if (resUpload && resUpload.code === 1) {
        resourceId = resUpload.resourceId;
      }
    }

    console.log(files);

    const resourceIds = await Promise.all(
      files.map(async (r) => {
        debugger;
        const fd = new FormData();
        fd.append("file", r.file);
        const res = await _unitOfWork.resource.uploadImage(fd);

        return {
          resource: res?.resourceId,
          documentCategory: r.documentCategory,
        };
      }),
    );
    const data = {
      ...values,
      resource: resourceId,
      asset: assetModelChange?.asset.id || assetModelChange?.asset?._id,
      assetModel: assetModelChange,
      documnets: resourceIds,
    };
    const res = await _unitOfWork.assetMaintenance.createAssetMaintenance(data);
    if (res?.assetNumber) {
      form.setFieldsValue({ assetNumber: res.assetNumber });
      ShowError(
        "topRight",
        t("common.notifications"),
        res?.message || t("common.messages.errors.create_failed"),
      );
      return;
    }
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully"),
      );
      navigate(-1);
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res?.message || t("common.messages.errors.create_failed"),
      );
    }
  };

  const fetchAssetModels = async (asset) => {
    // placeholder
  };

  const onClickSearchAsset = () => {
    setIsOpenAssetModel(true);
  };
  const generateAssetNumber = async () => {
    if (!assetModelChange || !fundingSources) return;
    if (!companySetting?.autoGenerateAssetNumber) return;
    if (assetModelChange) {
      let res = await _unitOfWork.assetMaintenance.getCurrentAssetNumber({
        asset: assetModelChange?.asset?._id || assetModelChange?.asset?.id,
        serial: serial,
        fundingSources: fundingSources,
      });
      if (res && res.code === 1) {
        form.setFieldsValue({
          assetNumber: res.data,
        });
      }
    } else {
      form.setFieldsValue({
        assetNumber: null,
      });
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
      key: "2",
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
      key: "3",
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
      <Form
        labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          fundingSources: "stateBudget",
        }}
      >
        <Card
          title=""
          extra={
            <>
              <Button key="back" onClick={() => navigate(-1)}>
                <LeftCircleFilled />
                {t("assetMaintenance.form.buttons.back")}
              </Button>
              <Button
                key="button"
                type="primary"
                htmlType="submit"
                className="ml-2"
              >
                <PlusCircleFilled />
                {t("assetMaintenance.form.buttons.create")}
              </Button>
            </>
          }
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab={t("assetMaintenance.form.tabs.basic_info")} key="1">
              <Row gutter={[16]}>
                <Col span={12}>
                  <Form.Item
                    labelAlign="left"
                    label={t("assetMaintenance.form.fields.asset_style")}
                    name="assetStyle"
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
                {!companySetting.createNewUsingAFormula ||
                  companySetting.createNewUsingAFormula !==
                  createNewUsingAFormulaType.healthInsurance ||
                  (companySetting.createNewUsingAFormula !==
                    createNewUsingAFormulaType.healthInsuranceDecree3176 && (
                      <Col span={12}></Col>
                    ))}
              </Row>

              <Row gutter={[16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("assetMaintenance.form.fields.asset_name")}
                    labelAlign="left"
                    name="assetName"
                    rules={[
                      {
                        required: true,
                        message: t(
                          "assetMaintenance.form.placeholders.asset_name",
                        ),
                      },
                    ]}
                  >
                    <Search
                      placeholder={t(
                        "assetMaintenance.form.placeholders.asset_name",
                      )}
                      allowClear
                      enterButton={t("assetMaintenance.actions.search")}
                      onSearch={onClickSearchAsset}
                      readOnly
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
                        <Input
                          placeholder={t(
                            "assetMaintenance.form.fields.supplier",
                          )}
                          disabled
                        />
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

              <Row gutter={[16, 16]}>
                <Col span={12} className="p-0">
                  <Col span={24}>
                    <Form.Item
                      label={t(
                        "assetMaintenance.form.fields.installation_date",
                      )}
                      name="installationDate"
                      labelAlign="left"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder={t("assetMaintenance.start_using")}
                        format={FORMAT_DATE}
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
                        placeholder={
                          (companySetting.createNewUsingAFormula ===
                            createNewUsingAFormulaType.healthInsurance ||
                            companySetting.createNewUsingAFormula ===
                            createNewUsingAFormulaType.healthInsuranceDecree3176) &&
                            companySetting?.autoGenerateAssetNumber
                            ? t("assetMaintenance.generated_asset_number")
                            : t("assetMaintenance.asset_number")
                        }
                        disabled={
                          companySetting?.autoGenerateAssetNumber &&
                          (companySetting.createNewUsingAFormula ===
                            createNewUsingAFormulaType.healthInsurance ||
                            companySetting.createNewUsingAFormula ===
                            createNewUsingAFormulaType.healthInsuranceDecree3176)
                        }
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
                        placeholder={t(
                          "assetMaintenance.form.placeholders.serial",
                        )}
                      />
                    </Form.Item>
                  </Col>
                  {assetStyle !== 3 && (
                    <Col span={24}>
                      <Form.Item
                        label={t(
                          "assetMaintenance.form.fields.oneqa_procedure_uri",
                        )}
                        name="oneQaProcedureUri"
                        labelAlign="left"
                      >
                        <Input
                          placeholder={t(
                            "assetMaintenance.form.placeholders.oneqa_procedure_uri",
                          )}
                        />
                      </Form.Item>
                    </Col>
                  )}

                  {(assetStyle === 1 || assetStyle === 2) && (
                    <Col span={24}>
                      <Form.Item
                        label={t("assetMaintenance.form.fields.movable")}
                        labelAlign="left"
                        name="isMovable"
                        initialValue={false}
                      >
                        <Select
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
                        />
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
                            options={(depreciationTypes.Options || []).map(
                              (item) => ({
                                value: item.value,
                                label: t(item.label),
                              }),
                            )}
                            filterOption={filterOption}
                            dropdownStyle={dropdownRender}
                          />
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
                  {/* <Col span={24}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.usage_status")}
                      labelAlign="left"
                      shouldUpdate
                    >
                      {() => (
                        <Form.Item
                          name="usageStatus"
                          valuePropName="checked"
                          noStyle
                          initialValue={true}
                        >
                          <Checkbox>
                            {form.getFieldValue("usageStatus")
                              ? t(
                                  "assetMaintenance.form.fields.currently_in_use",
                                )
                              : t("assetMaintenance.form.fields.discontinued")}
                          </Checkbox>
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Col> */}
                  <Col span={24}>
                    <Form.Item
                      label={t("assetMaintenance.form.fields.image")}
                      name="image"
                      labelAlign="left"
                    >
                      <div className="remove-tolltip">
                        <style>
                          {`
                            .remove-tolltip .ant-tooltip {
                              display: none !important;
                            }
                          `}
                        </style>
                        <Upload
                          {...propss}
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
                              window?.message?.error?.(
                                "Chỉ được chọn file ảnh PNG, JPG, JPEG!",
                              );
                            }
                            return isImage || Upload.LIST_IGNORE;
                          }}
                          fileList={fileList}
                          onChange={handleChangeUpload}
                        >
                          {fileList.length >= 1 ? null : (
                            <Button icon={<UploadOutlined />} type="primary">
                              {t("assetMaintenance.form.placeholders.image")}
                            </Button>
                          )}
                        </Upload>
                      </div>
                    </Form.Item>
                  </Col>
                </Col>
              </Row>
              {assetModelChange && assetModelChange !== null && (
                <>
                  <Tabs type="card" items={itemDataAssetModel} />
                </>
              )}
            </TabPane>

            <TabPane
              tab={t("assetMaintenance.form.tabs.additional_info")}
              key="2"
            >
              <Row gutter={[16, 16]}>
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
                      formatter={formatCurrency}
                      parser={parseCurrency}
                      placeholder={t(
                        "assetMaintenance.form.placeholders.purchase_value",
                      )}
                      style={{ width: "100%" }}
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
                      onChange={(value, option) => {
                        form.setFieldValue("customerName", option.label);
                      }}
                      allowClear
                      filterOption={filterOption}
                      dropdownStyle={dropdownRender}
                    />
                  </Form.Item>
                  <Form.Item name="customerName" hidden>
                    <Input />
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
                <Col span={12}>
                  <Form.Item
                    label={"Hạn bảo hành"}
                    name="warrantyEndDate"
                    labelAlign="left"
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder={"Nhập hạn bảo hành"}
                      format={FORMAT_DATE}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab={t("assetMaintenance.form.tabs.location")} key="3">
              <TabsMap form={form} />
            </TabPane>

            <TabPane tab={t("assetModel.model.tabs.documents")} key="4">
              <AssetMaintenanceDocument
                onChangeFiles={(list) => {
                  setFiles([...files, ...list]);
                  console.log("Danh sách file đã chọn:", list);
                }}
                listFile={files || []}
                isCreate={true}
              />
            </TabPane>

            {/* <TabPane
              tab={t("assetMaintenance.form.tabs.inspection_cycle")}
              key="6"
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
          </Tabs>
        </Card>
      </Form>

      <ChangeAssetModelModalWaitUse
        open={isOpenAssetModel}
        handleCancel={() => setIsOpenAssetModel(false)}
        form={form}
        assetModelChange={assetModelChange}
        onSelectAssetModel={(_assetModel) => {
          setAssetModelChange(_assetModel);
          form.setFieldsValue({
            asset: _assetModel?.asset?.id,
            assetName: _assetModel?.asset?.assetName,
            manufacturer: _assetModel.manufacturer?.manufacturerName,
            category: _assetModel.category?.categoryName,
            assetTypeCategory: _assetModel?.assetTypeCategory?.name,
            subCategory: _assetModel.subCategory?.subCategoryName,
            assetModelName: _assetModel?.assetModelName,
            supplier: _assetModel?.supplier?.supplierName,
          });
        }}
      />
    </>
  );
}
