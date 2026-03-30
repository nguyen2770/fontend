import {
  ArrowLeftOutlined,
  PlusOutlined,
  SaveOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Space,
  Row,
  Select,
  Divider,
  Input
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import {
  formatCurrency,
  parseCurrency
} from "../../../../helper/price-helper";
import * as _unitOfWork from "../../../../api";
import ShowError from "../../../../components/modal/result/errorNotification";
import CreateAssetTypeCategory from "./CreateAssetTypeCategory";
import { useTranslation } from "react-i18next";
import CustomSelectAdd from "../../../../components/common/CustomSelectAdd";
import { notiAction } from "../../../../helper/noti-action-helper";

export default function UpdateAssetType() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [assetTypeCategorys, setAssetTypeCategorys] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isOpenCreateAssetTypeCategory, setIsOpenCreateAssetTypeCategory] =
    useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchGetAssetById();
    fetchGetAllAssetTypeCategory();
    fetchGetAllAsset();
  }, []);

  const fetchGetAssetById = async () => {
    const res = await _unitOfWork.assetType.getAssetTypeById({
      id: params.id
    });
    if (res) {
      form.setFieldsValue({
        ...res,
        asset: res?.asset?.id || res?.asset?._id,
        assetTypeCategory:
          res?.assetTypeCategory?.id || res?.assetTypeCategory?._id
      });
    }
  };
  const fetchGetAllAsset = async () => {
    const res = await _unitOfWork.asset.getAllAsset();
    if (res && res.code === 1) {
      setAssets(res.data);
    }
  };
  const fetchGetAllAssetTypeCategory = async () => {
    const res =
      await _unitOfWork.assetTypeCategory.getAllAssetTypeCategory();
    if (res && res.code === 1) {
      setAssetTypeCategorys(res.data);
    }
  };

  const onFinish = async () => {
    const values = form.getFieldsValue();
    let res = await _unitOfWork.assetType.updateAssetType({
      data: {
        id: params.id,
        ...values
      }
    });
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("assetType.messages.update_success")
      );
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("assetType.messages.update_error")
      );
    }
  };
  const onClickCreateAssetTypeCategory = () => {
    setIsOpenCreateAssetTypeCategory(true);
  };
  const onCancelCreateAssetTypeCategory = () => {
    setIsOpenCreateAssetTypeCategory(false);
  };
  const onCallbackCreateAssetTypeCategory = () => {
    setIsOpenCreateAssetTypeCategory(false);
    fetchGetAllAssetTypeCategory();
  };
  const addAsset = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.asset.createAsset({
      asset: {
        assetName: name,
      }
    });
    notiAction(t, response);
    if (response) {
      fetchGetAllAsset();
    }
  };
  const addAssetTypeCategory = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.assetTypeCategory.createAssetTypeCategory({
      name: name,
    });
    notiAction(t, response);
    if (response) {
      fetchGetAllAssetTypeCategory();
    }
  };


  return (
    <div className="content-manager">
      <Form
labelWrap
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Card
          title={t("assetType.form.update_title")}
          extra={
            <>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => navigate(-1)}
              >
                <ArrowLeftOutlined />
                {t("assetType.buttons.back")}
              </Button>
              <Button
                style={{ marginRight: 10 }}
                type="primary"
                htmlType="submit"
              >
                <SaveOutlined />
                {t("assetType.buttons.save")}
              </Button>
            </>
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={t(
                  "assetType.form.fields.asset_type_category"
                )}
                name="assetTypeCategory"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetType.form.validation.required_asset_type_category"
                    )
                  }
                ]}
              >
                {/* <Select
                  allowClear
                  placeholder={t(
                    "assetType.form.fields.asset_type_category_placeholder"
                  )}
                  options={(assetTypeCategorys || []).map(
                    (item, key) => ({
                      key,
                      value: item.id,
                      label: item.name
                    })
                  )}
                  popupRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Space style={{ padding: "0 8px 4px" }}>
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={onClickCreateAssetTypeCategory}
                        >
                          {t(
                            "assetType.form.fields.add_asset_type_category"
                          )}
                        </Button>
                      </Space>
                    </>
                  )}
                /> */}
                <CustomSelectAdd
                  placeholder={t(
                    "assetType.form.fields.asset_type_category_placeholder"
                  )}
                  options={assetTypeCategorys}
                  onAdd={addAssetTypeCategory}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetType.form.fields.asset")}
                name="asset"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetType.form.validation.required_asset"
                    )
                  }
                ]}
              >
                {/* <Select
                  allowClear
                  placeholder={t(
                    "assetType.form.fields.asset_placeholder"
                  )}
                  options={(assets || []).map((item, key) => ({
                    key,
                    value: item.id,
                    label: item.assetName
                  }))}
                /> */}
                <CustomSelectAdd
                  placeholder={t(
                    "assetType.form.fields.asset_placeholder"
                  )}
                  options={assets}
                  labelKey="assetName"
                  onAdd={addAsset}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetType.form.fields.expected_price")}
                name="expectedPrice"
                labelAlign="left"
              >
                <InputNumber
                  placeholder={t(
                    "assetType.form.fields.expected_price_placeholder"
                  )}
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetType.form.fields.note")}
                name="note"
                labelAlign="left"
              >
                <Input.TextArea
                  placeholder={t(
                    "assetType.form.fields.note_placeholder"
                  )}
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
      <CreateAssetTypeCategory
        open={isOpenCreateAssetTypeCategory}
        handleCancel={onCancelCreateAssetTypeCategory}
        handleOk={onCallbackCreateAssetTypeCategory}
      />
    </div>
  );
}