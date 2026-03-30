import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import {
  createNewUsingAFormulaType,
  STORAGE_KEY,
} from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import useHeader from "../../../contexts/headerContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";

export default function CompanySetting() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const { permissions, user } = useAuth();
  const { t } = useTranslation();
  const [stockLocations, setStockLocations] = useState([]);

  useEffect(() => {
    setHeaderTitle(t("configuration.title"));
    const companySetting = JSON.parse(
      localStorage.getItem(STORAGE_KEY.COMPANY_SETTING),
    );
    if (companySetting) {
      form.setFieldsValue(companySetting);
    }
    fetchStockLocations();
  }, []);

  const onClickFinish = async () => {
    const payload = {
      companySetting: {
        ...form.getFieldsValue(),
      },
    };
    let res = await _unitOfWork.user.updateCompanySetting(payload);
    if (res && res.code === 1) {
      ShowSuccess(t("configuration.update_success"));
      localStorage.setItem(
        STORAGE_KEY.COMPANY_SETTING,
        JSON.stringify(res.data),
      );
      form.resetFields();
      window.location.reload();
    }
  };
  const fetchStockLocations = async () => {
    const res = await _unitOfWork.stockLocation.getListStockLocation({
      page: 1,
      limit: 100,
    });
    if (res?.code === 1 && res?.results) {
      const option = res.results?.results.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setStockLocations(option);
    }
  };
  return (
    <div className="">
      <Form
        labelWrap
        className="search-form"
        form={form}
        onFinish={onClickFinish}
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 8 }}
      >
        <Card
          extra={
            <>
              {/* <Button
                            style={{ marginRight: "10px" }}
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeftOutlined />
                            {t("configuration.come_back_button")}
                        </Button> */}
              {checkPermission(
                permissions,
                permissionCodeConstant.company_setting_update,
              ) && (
                  <Button className="" type="primary" htmlType="submit">
                    <PlusCircleOutlined />
                    {t("configuration.update_button")}
                  </Button>
                )}
            </>
          }
        >
          <Row gutter={[16]} className="mb-1">
            <Col span={24}>
              <b>
                {t(
                  "configuration.config_warehouse_when_reviewing_parts_requests",
                )}
              </b>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ color: "#000" }}>
                    {t(
                      "configuration.approve_the_warehouse_release_form_for_use",
                    )}
                  </span>
                }
                name="issueAutoApprovedOnSpareRequest"
                labelAlign="left"
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ color: "#000" }}>
                    {t("configuration.default_pickup_warehouse")}
                  </span>
                }
                name="locationDefault"
                labelAlign="left"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 10 }}
              >
                <Select options={stockLocations}></Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider>{t("configuration.config_company")}</Divider>
          <Row gutter={[16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ color: "#000" }}>
                    {t("configuration.filter_data_by_branch")}
                  </span>
                }
                name="branchDataHierarchy"
                labelAlign="left"
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col
              span={11}
              style={{
                textAlign: "end",
                fontSize: 25,
                fontWeight: 700,
              }}
            >
              <Tooltip title={t("note.title_note_setting_with_branch")}>
                {" "}
                <QuestionCircleOutlined />
              </Tooltip>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ color: "#000" }}>
                    {t("configuration.automatically_generate_asset_codes")}
                  </span>
                }
                name="autoGenerateAssetNumber"
                labelAlign="left"
                valuePropName="checked"
              >
                <Checkbox disabled></Checkbox>
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: "start" }}>
              <Form.Item
                label={
                  <span style={{ color: "#000" }}>
                    {t("configuration.generate_asset_codes_according_to")}
                  </span>
                }
                name="createNewUsingAFormula"
                labelAlign="left"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 10 }}
              >
                <Select
                  // disabled
                  allowClear
                  placeholder={t(
                    "configuration.approve_the_warehouse_release_form_for_use",
                  )}
                  showSearch
                  options={(createNewUsingAFormulaType.Options || []).map(
                    (item) => ({
                      value: item.value,
                      label: item.label,
                    }),
                  )}
                  filterOption={filterOption}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ color: "#000" }}>
                    {t("configuration.property_viewing_rights_by_department")}
                  </span>
                }
                name="filterByAccount"
                labelAlign="left"
                valuePropName="checked"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col
              span={11}
              style={{
                textAlign: "end",
                fontSize: 25,
                fontWeight: 700,
              }}
            >
              <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{t("note.title_note_role_view_by_department")}</span>}>
                <QuestionCircleOutlined />
              </Tooltip>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}
