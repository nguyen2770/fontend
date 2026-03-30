import React, { useEffect, useState } from "react";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PrinterOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Tooltip,
} from "antd";
import { assetType, PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { useNavigate } from "react-router-dom";
import useHeader from "../../../contexts/headerContext";
import { filterOption } from "../../../helper/search-select-helper";
import QrCodeCard from "../../../components/card/QrCodeCard/QrCodeCard";
import { useTranslation } from "react-i18next";

export default function SearchAssetMaintenanceQrCode() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [categories, setCategories] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetModels, setAssetModels] = useState([]);
  const [sunpliers, setSuppliers] = useState([]);
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [searchForm] = Form.useForm();
  const [assetMaintaniceSelecteds, setAssetMaintaniceSelecteds] = useState([]);

  useEffect(() => {
    setHeaderTitle(t("assetMaintenance.actions.search_qr_code"));
    getAllCustomers();
    fetchGetAllCategories();
    fetchGetAllSuppliers();
    fetchAssetModels();
    fetchAssets();
    fetchGetAllManfacturers();
  }, []);

  const fetchAssetModels = async () => {
    let res = await _unitOfWork.assetModel.getAllAssetModel();
    if (res && res.code === 1) {
      setAssetModels(res.data);
    }
  };
  const fetchAssets = async () => {
    let res = await _unitOfWork.asset.getAllAsset({});
    if (res && res.code === 1) {
      setAssets(res.data);
    }
  };
  const fetchGetAllCategories = async () => {
    let res = await _unitOfWork.category.getAllCategory();
    if (res && res.code === 1) {
      setCategories(res.data);
    }
  };
  const fetchGetAllSuppliers = async () => {
    let res = await _unitOfWork.supplier.getAllSupplier();
    if (res && res.code === 1) {
      setSuppliers(res.data);
    }
  };
  const fetchGetAllManfacturers = async () => {
    let res = await _unitOfWork.manufacturer.getAllManufacturer();
    if (res && res.code === 1) {
      setManufacturers(res.data);
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
  const fetchGetListAssetMiantenance = async () => {
    let payload = {
      page: page,
      limit: 10000,
      ...searchForm.getFieldsValue(),
    };
    const res =
      await _unitOfWork.assetMaintenance.getListAssetMaintenances(payload);
    if (res && res.results && res.results?.results) {
      setAssetMaintenances(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onSearch = () => {
    fetchGetListAssetMiantenance();
  };
  const resetSearch = () => {
    searchForm.resetFields();
    setAssetMaintenances([]);
    setAssetMaintaniceSelecteds([]);
  };
  const onChangeCheckboxAssetMaintenance = (_val, _id) => {
    var newData = [...assetMaintaniceSelecteds];
    if (_val) {
      newData.push(_id);
    } else {
      let _idx = newData.findIndex((s) => s === _id);
      if (_idx > -1) {
        newData.splice(_idx, 1);
      }
    }
    setAssetMaintaniceSelecteds(newData);
  };
  const printAssetMaintennances = (isAll) => {
    var win = window.open(
      "",
      "",
      "left=0,top=0,fullscreen=1,toolbar=0,scrollbars=0,status=0,titlebar=1",
    );
    var content = "<html>";
    content += `<head>
		<link rel="stylesheet" href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'/>
		<link rel="stylesheet" href='https://medicmms.vn/qrcode.css'/>
    <style>
			@page { font-size: 23px;  margin: 20px; }
			.col-form-label { padding-bottom: 0 !important; padding-top: 0 !important; font-weight: 700 !important; }
			span { font-weight: 500 !important; }
			body { font-weight: 500; padding: 20px; }
            .div-asset { height : 100vh; }
		</style>
		</head>`;
    content += '<body onload="window.print(); window.close();">';
    if (isAll) {
      assetMaintenances.forEach((_assetMaintenance, _idx) => {
        if (_idx > 0) {
          content += "<div style='margin-bottom : 50px'></div>";
        }
        content += document.getElementById(_assetMaintenance.id).innerHTML;
      });
    } else {
      assetMaintaniceSelecteds.forEach((_id, _idx) => {
        if (_idx > 0) {
          content += "<div style='break-after:page'></div>";
        }
        content += document.getElementById(_id).innerHTML;
      });
    }
    content += "</body></html>";
    win.document.write(content);
    win.document.close();
  };
  return (
    <div className="p-3">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.list.search.asset_style_label")}
              name="assetStyle"
              labelAlign="left"
            >
              <Select
                allowClear
                placeholder={t(
                  "assetMaintenance.list.search.placeholder_asset_style",
                )}
                options={(assetType.Options || []).map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
                showSearch={true}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.form.fields.customer")}
              name="customer"
              labelAlign="left"
            >
              <Select
                style={{ width: "100%" }}
                options={(customers || []).map((item, key) => ({
                  key: key,
                  value: item.value,
                  label: item.label,
                }))}
                placeholder={t("assetMaintenance.form.placeholders.customer")}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.list.search.manufacturer_label")}
              name="manufacturer"
              labelAlign="left"
            >
              <Select
                allowClear
                placeholder={t(
                  "assetMaintenance.list.search.placeholder_manufacturer",
                )}
                showSearch
                options={manufacturers?.map((item) => ({
                  value: item.id,
                  label: `${item.manufacturerName}  ${item.origin ? " - " + item?.origin?.originName : ""}`,
                }))}
                filterOption={filterOption}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.form.fields.supplier")}
              name="supplier"
              labelAlign="left"
            >
              <Select
                allowClear
                placeholder={t("assetMaintenance.form.fields.supplier")}
                showSearch
                options={sunpliers?.map((item) => ({
                  value: item.id,
                  label: item.supplierName,
                }))}
                filterOption={filterOption}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.list.search.category_label")}
              name="category"
              labelAlign="left"
            >
              <Select
                allowClear
                placeholder={t(
                  "assetMaintenance.list.search.placeholder_category",
                )}
                showSearch
                options={categories?.map((item) => ({
                  value: item.id,
                  label: item.categoryName,
                }))}
                filterOption={filterOption}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.list.search.asset_label")}
              name="asset"
              labelAlign="left"
            >
              <Select
                allowClear
                placeholder={t(
                  "assetMaintenance.list.search.placeholder_asset",
                )}
                showSearch
                options={assets?.map((item) => ({
                  value: item.id,
                  label: item.assetName,
                }))}
                filterOption={filterOption}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.form.fields.model")}
              name="assetModel"
              labelAlign="left"
            >
              <Select
                style={{ width: "100%" }}
                placeholder={t("assetMaintenance.form.placeholders.model")}
                options={(assetModels || []).map((item, key) => ({
                  key: key,
                  value: item.id,
                  label: item?.assetModelName,
                }))}
                filterOption={filterOption}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetMaintenance.list.search.serial_label")}
              name="serial"
              labelAlign="left"
            >
              <Input
                placeholder={t(
                  "assetMaintenance.list.search.placeholder_serial",
                )}
              ></Input>
            </Form.Item>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("common.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} className="text-right">
            {assetMaintaniceSelecteds.length > 0 && (
              <Button
                onClick={() => printAssetMaintennances(false)}
                type="primary"
                className="mr-2"
              >
                <PrinterOutlined />
                {t("assetMaintenance.actions.print_selected", {
                  count: assetMaintaniceSelecteds.length,
                })}
              </Button>
            )}
            <Button
              className="bt-green mr-2"
              onClick={() => printAssetMaintennances(true)}
            >
              <PrinterOutlined />
              {t("assetMaintenance.actions.print_all")}
            </Button>
          </Col>
        </Row>
        <Row gutter={[16]}>
          {assetMaintenances &&
            assetMaintenances.length > 0 &&
            assetMaintenances.map((am) => {
              return (
                <Col span={8} className="mb-4 text-center" key={am.id}>
                  <Checkbox
                    onChange={(e) =>
                      onChangeCheckboxAssetMaintenance(e.target.checked, am.id)
                    }
                  />
                  <div id={am.id} className="div-asset">
                    <QrCodeCard assetMaintenance={am} />
                  </div>
                </Col>
              );
            })}
        </Row>
      </Form>
    </div>
  );
}
