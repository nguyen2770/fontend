import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  Card,
  InputNumber,
  Input,
  Button,
  Radio,
} from "antd";
import { dateType, frequencyOptions } from "../../../utils/constant";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import {
  DeleteOutlined,
  LeftOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import ShowError from "../../../components/modal/result/errorNotification";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import AssetMaintenanceModel from "../../../components/modal/assetModel/AssetMaintenanceModel";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";
import dayjs from "dayjs";
const { Search } = Input;

export default function UpdateCalibration() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isOpenAsseMaintenancetModel, setIsOpenAssetMaintenanceModel] =
    useState(false);
  const [assetMaintenceChange, setAssetMaintenceChange] = useState(null);
  const params = useParams();
  const [calibrationContracts, setCalibrationContracts] = useState([]);
  const { search } = useLocation();
  const isClone = new URLSearchParams(search).get("mode") === "clone";

  useEffect(() => {
    if (assetMaintenceChange) {
      form.setFieldsValue({
        assetModel: assetMaintenceChange?.assetModel?.assetModelName,
        asset: assetMaintenceChange?.assetModel?.asset?.assetName,
        serial: assetMaintenceChange?.serial,
        assetNumber: assetMaintenceChange?.assetNumber,
        customer: assetMaintenceChange?.customer?.customerName,
      });
      fetchGetCalibrationContractMappingAssetMaintenanceByRes(
        assetMaintenceChange?.id || assetMaintenceChange?._id,
      );
    }
  }, [assetMaintenceChange]);

  useEffect(() => {
    fetchGetCalibrationById();
  }, []);

  const fetchGetCalibrationById = async () => {
    let res = await _unitOfWork.calibration.getCalibrationById({
      id: params?.id,
    });
    if (res && res.code === 1) {
      form.setFieldsValue({
        ...res?.calibration,
        calibrationName: isClone ? null : res.calibration.calibrationName,
      });
      setAssetMaintenceChange(res?.calibration?.assetMaintenance);
    }
  };
  const onFinish = async () => {
    if (!assetMaintenceChange) {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("calibration.placeholder.serial"),
      );
    }
    const values = form.getFieldsValue();
    let payload = {
      id: params?.id,
      ...values,
      assetMaintenance: assetMaintenceChange?.id,
    };
    if (isClone) {
      const res = await _unitOfWork.calibration.createCalibration({
        calibration: payload,
      });
      if (res && res.code === 1) {
        navigate(-1);
        ShowSuccess(
          "topRight",
          t("common.notifications"),
          t("common.messages.success.successfully"),
        );
      } else {
        ShowError(
          "topRight",
          t("common.notifications"),
          t("common.messages.errors.failed"),
        );
      }
    } else {
      const res = await _unitOfWork.calibration.updateCalibrationById(payload);
      if (res && res.code === 1) {
        navigate(-1);
        ShowSuccess(
          "topRight",
          t("common.notifications"),
          t("common.messages.success.successfully"),
        );
      } else {
        ShowError(
          "topRight",
          t("common.notifications"),
          t("common.messages.errors.failed"),
        );
      }
    }
  };

  const onClickSearchAssetMaintenance = () => {
    setIsOpenAssetMaintenanceModel(true);
    form.setFieldsValue({
      serial: null,
      customer: null,
      asset: null,
      assetModel: null,
      category: null,
      amc: null,
      assetNumber: null,
    });
  };
  const fetchGetCalibrationContractMappingAssetMaintenanceByRes = async (
    id,
  ) => {
    let res =
      await _unitOfWork.calibrationContract.getCalibrationContractMappingAssetMaintenanceByRes(
        { assetMaintenance: id },
      );
    if (res && res.code === 1) {
      const calibrationContractMappingAssetMaintenances =
        res?.calibrationContractMappingAssetMaintenances;
      setCalibrationContracts(
        calibrationContractMappingAssetMaintenances?.map(
          (item) => item?.calibrationContract,
        ),
      );
    }
  };
  return (
    <Form
      layout="horizontal"
      form={form}
      labelCol={{
        span: 9,
      }}
      wrapperCol={{
        span: 15,
      }}
      onFinish={onFinish}
      style={{ padding: "15px" }}
    >
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px #f0f1f2",
        }}
        bodyStyle={{ padding: 32 }}
        extra={
          <>
            <Button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>
              <LeftOutlined />
              {t("preventive.buttons.back")}
            </Button>
            <Button type="primary" htmlType="submit">
              <PlusCircleFilled />
              {t("Lưu lại")}
            </Button>
          </>
        }
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label={t("calibration.calibration_name")}
              name="calibrationName"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("calibration.placeholder.calibration_name"),
                },
              ]}
            >
              <Input
                placeholder={t("calibration.placeholder.calibration_name")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
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
              label={t("calibration.customer")}
              name="customer"
              labelAlign="left"
            >
              <Input
                placeholder={t("calibration.placeholder.customer")}
                disabled
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("calibration.asset_name")}
              name="asset"
              labelAlign="left"
            >
              <Input
                placeholder={t("calibration.placeholder.asset_name")}
                disabled
              ></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("calibration.asset_model_name")}
              name="assetModel"
              labelAlign="left"
            >
              <Input
                placeholder={t("calibration.placeholder.asset_model_name")}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("calibration.importance")}
              name="importance"
              labelAlign="left"
              initialValue="High"
            >
              <Radio.Group>
                <Radio value="High">{t("constant.priorityType.high")}</Radio>
                <Radio value="Medium">
                  {t("constant.priorityType.medium")}
                </Radio>
                <Radio value="Low">{t("constant.priorityType.low")}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("calibration.cycle")}
              name="numberNext"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("calibration.placeholder.cycle"),
                },
              ]}
            >
              <InputNumber
                placeholder={t("assetMaintenance.form.placeholders.cycle")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateType"
              label={t("calibration.cycle_type")}
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("calibration.placeholder.cycle_type"),
                },
              ]}
            >
              <Select
                placeholder={t("calibration.placeholder.cycle_type")}
                options={(dateType.Options || []).map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: item.label,
                }))}
              />
            </Form.Item>
          </Col>{" "}
          <Col span={12}>
            <Form.Item
              label={t("calibration.calibration_time")}
              labelAlign="left"
            >
              <Input.Group compact>
                <Form.Item
                  name="calibrationTimeHr"
                  noStyle
                  rules={[{ type: "number", min: 0, message: "Giờ >= 0" }]}
                >
                  <InputNumber
                    style={{ width: "49%" }}
                    placeholder={t(
                      "calibration.placeholder.enter_calibration_time_hr",
                    )}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                    addonAfter={t("preventive.common.hours")}
                    className="mr-2"
                  />
                </Form.Item>
                <Form.Item
                  name="calibrationTimeMin"
                  noStyle
                  rules={[{ type: "number", min: 0, message: "Phút >= 0" }]}
                >
                  <InputNumber
                    style={{ width: "48%" }}
                    placeholder={t(
                      "calibration.placeholder.enter_calibration_time_min",
                    )}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                    addonAfter={t("preventive.common.minutes")}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          {form.getFieldValue("assetNumber") && (
            <Col span={12}>
              <Form.Item
                label={t("preventive.form.contract")}
                name="calibrationContract"
                labelAlign="left"
              >
                <Select
                  placeholder={t("preventive.form.contract_placeholder")}
                  showSearch
                  allowClear
                  options={(calibrationContracts || []).map((item) => ({
                    value: item.id,
                    label: item.contractNo,
                  }))}
                  filterOption={filterOption}
                  // onChange={handleService}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <AssetMaintenanceModel
              open={isOpenAsseMaintenancetModel}
              handleCancel={() => setIsOpenAssetMaintenanceModel(false)}
              form={form}
              assetChange={assetMaintenceChange}
              onSelectAssetMaintenance={(assetMaintenance) => {
                setAssetMaintenceChange(assetMaintenance);
              }}
            />
          </Col>
        </Row>
      </Card>
    </Form>
  );
}
