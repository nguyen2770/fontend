import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Row,
  Space,
  Input,
  Select,
} from "antd";
import { RedoOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as _unitOfWork from "../../api";
import { filterOption } from "../../helper/search-select-helper";
import { assetType } from "../../utils/constant";
import { useTranslation } from "react-i18next";

const DrawerSearchPropertyInspection = forwardRef(
  ({ isOpen, onCallBack, onClose }, ref) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [assets, setAssets] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [assetModels, setAssetModels] = useState([]);

    useEffect(() => {
      if (isOpen) {
        fetchGetAllAssetModel();
        fetchGetAllAsset();
        fetchGetAllManufacturer();
        fetchGetAllCategory();
      }
    }, [isOpen]);

    const onReset = () => form.resetFields();
    useImperativeHandle(ref, () => ({
      resetForm: () => {
        onReset();
      },
    }));
    const fetchGetAllAssetModel = async () => {
      let res = await _unitOfWork.assetModel.getAllAssetModel();
      if (res && res.code === 1) {
        setAssetModels(res.data);
      }
    };
    const fetchGetAllAsset = async () => {
      let res = await _unitOfWork.asset.getAllAsset();
      if (res && res.code === 1) {
        setAssets(res.data);
      }
    };
    const fetchGetAllManufacturer = async () => {
      let res = await _unitOfWork.manufacturer.getAllManufacturer();
      if (res && res.code === 1) {
        setManufacturers(res.data);
      }
    };
    const fetchGetAllCategory = async () => {
      let res = await _unitOfWork.category.getAllCategory();
      if (res && res.code === 1) {
        setCategories(res.data);
      }
    };
    const handleFinish = async () => {
      const value = form.getFieldsValue();
      onCallBack(value);
      onClose();
    };
    const handleClose = () => {
      const value = form.getFieldsValue();
      value.isClose = true;
      onCallBack(value);
      onClose();
    };
    return (
      <Drawer
        title={t("common_buttons.advanced_search")}
        width={"40%"}
        open={isOpen}
        onClose={handleClose}
        extra={
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              onClick={handleFinish}
            >
              {t("myTask.myTask.buttons.search")}
            </Button>

            <Button onClick={onReset} icon={<RedoOutlined />}>
              {t("myTask.myTask.buttons.reset")}
            </Button>
          </Space>
        }
      >
        <Form labelWrap form={form} layout="vertical" onFinish={onCallBack}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("preventive.pdf.asset")} name="asset">
                <Select
                  showSearch
                  allowClear
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_asset",
                  )}
                  options={(assets || []).map((item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.assetName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("sparePart.list.search.manufacturer_label")}
                name="manufacturer"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_manufacturer",
                  )}
                  options={(manufacturers || []).map((item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.manufacturerName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("assetMaintenance.list.search.category_label")}
                name="category"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_category",
                  )}
                  options={(categories || []).map((item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.categoryName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("assetMaintenance.list.search.model_label")}
                name="assetModel"
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_model",
                  )}
                  options={(assetModels || []).map((item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.assetModelName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("assetMaintenance.list.search.asset_style_label")}
                name="assetStyle"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_asset_style",
                  )}
                  options={(assetType.Options || []).map((item) => ({
                    key: item.value,
                    value: item.value,
                    label: item.label,
                  }))}
                  filterOption={filterOption}
                  showSearch={true}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    );
  },
);

export default React.memo(DrawerSearchPropertyInspection);
