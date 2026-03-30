import { Button, Col, Drawer, Form, Row, Space, Select } from "antd";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as _unitOfWork from "../../api";
import { filterOption } from "../../helper/search-select-helper";
import { assetStatusOptions, assetType } from "../../utils/constant";
import { useTranslation } from "react-i18next";

const DrawerSearchAssetMaintenance = forwardRef(
  ({ isOpen, onCallBack, onClose, showAssetStatus }, ref) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [assets, setAssets] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [filteredAssetModels, setFilteredAssetModels] = useState([]);
    useEffect(() => {
      if (isOpen) {
        if (assetModels.length === 0) fetchGetAllAssetModel();
        if (assets.length === 0) fetchGetAllAsset();
        if (manufacturers.length === 0) fetchGetAllManufacturer();
        if (categories.length === 0) fetchGetAllCategory();
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

    const handlerChangeAsset = async (value) => {
      form.setFieldValue("assetModel", null);
      const filter = await assetModels.filter(
        (item) => item.asset?.id === value,
      );
      setFilteredAssetModels(filter);
    };

    const handleChangeManufacturer = async (value) => {
      form.setFieldValue("assetModel", null);
      const filter = await assetModels.filter(
        (item) => item.manufacturer === value,
      );
      setFilteredAssetModels(filter);
    };

    const handleChangeCategory = async (value) => {
      form.setFieldValue("assetModel", null);
      const filter = await assetModels.filter(
        (item) => item.asset?.id === value,
      );
      setFilteredAssetModels(filter);
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
            {/* <Button onClick={onClose} icon={<CloseOutlined />}>
                        Đóng
                    </Button> */}

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
        <Form
          labelWrap
          form={form}
          layout="vertical"
          onFinish={onCallBack}
          // initialValues={{
          //   assetStatuses: assetStatusOptions.Options.slice(0, 3).map(
          //     (i) => i.value,
          //   ),
          // }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("preventive.pdf.asset")} name="asset">
                <Select
                  showSearch
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_asset",
                  )}
                  options={(assets || []).map((item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.assetName,
                  }))}
                  filterOption={filterOption}
                  onChange={(value) => {
                    handlerChangeAsset(value);
                  }}
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
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_manufacturer",
                  )}
                  options={(manufacturers || []).map((item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.manufacturerName,
                  }))}
                  filterOption={filterOption}
                  onChange={(value) => {
                    handleChangeManufacturer(value);
                  }}
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
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_category",
                  )}
                  options={(categories || []).map((item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.categoryName,
                  }))}
                  filterOption={filterOption}
                  onChange={(value) => {
                    handleChangeCategory(value);
                  }}
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
                  options={(filteredAssetModels || []).map((item) => ({
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

            <Col span={12}>
              <Form.Item
                label={t("assetMaintenance.list.search.asset_age_label")}
                name="assetAges"
              >
                <Select
                  allowClear
                  filterOption={filterOption}
                  showSearch={true}
                  mode="tags"
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_asset_age",
                  )}
                  options={Array.from({ length: 10 }, (_, i) => ({
                    label: `${i + 1} năm`,
                    value: i + 1,
                  }))}
                />
              </Form.Item>
            </Col>
            {showAssetStatus && (
              <Col span={12}>
                <Form.Item label={t("Trạng thái tài sản")} name="assetStatuses">
                  <Select
                    allowClear
                    filterOption={filterOption}
                    showSearch={true}
                    mode="tags"
                    placeholder={t("Chọn trạng thái tài sản")}
                    options={(assetStatusOptions.Options || []).map((item) => ({
                      key: item.value,
                      value: item.value,
                      label: t(item.label),
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* <Row className="mt-4">
                    <Col span={24}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mr-2"
                            icon={<SearchOutlined />}
                            onClick={handleFinish}
                        >
                            Tìm kiếm
                        </Button>

                        <Button onClick={onReset} icon={<RedoOutlined />}>
                            Làm mới
                        </Button>
                    </Col>
                </Row> */}
        </Form>
      </Drawer>
    );
  },
);

export default React.memo(DrawerSearchAssetMaintenance);
