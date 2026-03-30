import { useEffect, useState } from "react";
import {
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
} from "antd";
import { useNavigate } from "react-router-dom";
import { assetType } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import QrCodeCardSparePart from "../../../components/card/QrCodeCard/QrCodeCardSparePart";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";

export default function SearchSparePartQrCode() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [totalRecord, setTotalRecord] = useState(0);
  const [sparePartDetails, setSparePartDetails] = useState([]);
  const [searchForm] = Form.useForm();
  const [sparePartDetailSelecteds, setSparePartDetailSelecteds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [stockReceipts, setStockReceipts] = useState([]);


  const [spareParts, setSpareParts] = useState([]);

  useEffect(() => {
    setHeaderTitle(t("sparePart.form.buttons.search_qr"));
    getSpareParts();
    // fetchStockReceipts();
    fetchSuppliers();
    fetchManufacturers();
  }, []);


  const fetchGetListSparePartDetail = async () => {
    let payload = {
      page: page,
      limit: 10000,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.sparePart.getSparePartDetails(
      payload
    );
    if (res && res.results && res.results?.results) {
      setSparePartDetails(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const getSpareParts = async () => {
    const res = await _unitOfWork.sparePart.getSpareParts({});
    if (res && res.data) {
      setSpareParts(res.data);
    }
    return [];
  };

  const fetchSuppliers = async () => {
    const res = await _unitOfWork.supplier.getAllSupplier();
    if (res && res.data) {
      setSuppliers(res.data);
    }
  }

  const fetchManufacturers = async () => {
    const res = await _unitOfWork.manufacturer.getAllManufacturer();
    if (res && res.data) {
      setManufacturers(res.data);
    }
  }

  const fetchStockReceipts = async () => {
    const res = await _unitOfWork.receiptPurchase.getAllReceiptPurchase();
    if (res && res.data) {
      setStockReceipts(res.data);
    }
  }

  const onSearch = () => {
    fetchGetListSparePartDetail();
  };
  const resetSearch = () => {
    searchForm.resetFields();
    setSparePartDetails([]);
    setSparePartDetailSelecteds([]);
  };
  const onChangeCheckboxAssetSparePartDetail = (_val, _id) => {
    var newData = [...sparePartDetailSelecteds];
    if (_val) {
      newData.push(_id);
    } else {
      let _idx = newData.findIndex((s) => s === _id);
      if (_idx > -1) {
        newData.splice(_idx, 1);
      }
    }
    setSparePartDetailSelecteds(newData);
  };
  const printAssetMaintennances = (isAll) => {
    var win = window.open(
      "",
      "",
      "left=0,top=0,fullscreen=1,toolbar=0,scrollbars=0,status=0,titlebar=1"
    );
    var content = "<html>";
    content += `<head>
		<link rel="stylesheet" href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'/>
		<style>
			@page { font-size: 23px;  margin: 20px; }
			.col-form-label { padding-bottom: 0 !important; padding-top: 0 !important; font-weight: 700 !important; }
			span { font-weight: 500 !important; }
			body { font-weight: 500; padding: 20px; }
            .qr-code-card-container { width: 100%; border: 1px solid; text-align: center; height : calc(100vh - 40px); }
            .qr-code-card-container .asset-SparePartDetail-customer-name { border-bottom: 1px solid; font-weight: 600; font-size: 28px; }
            .qr-code-card-container .asset-SparePartDetail-qrcode { padding: 8px; text-align: center; border-bottom: 1px solid; }
            .qr-code-card-container .asset-SparePartDetail-qrcode svg { width: 90% !important; height: 90% !important; }
            .qr-code-card-container .asset-SparePartDetail-asset-name { border-bottom: 1px solid; text-align: center; font-weight: 600; font-size: 28px; }
            .qr-code-card-container .asset-SparePartDetail-asset-number { text-align: center; font-weight: 600; font-size: 28px; }
            .div-asset { height : 100vh; }
		</style>
		</head>`;
    content += '<body onload="window.print(); window.close();">';
    if (isAll) {
      sparePartDetails.forEach((_assetSparePartDetail, _idx) => {
        if (_idx > 0) {
          content += "<div style='break-after:page'></div>";
        }
        content += document.getElementById(_assetSparePartDetail.id).innerHTML;
      });
    } else {
      sparePartDetailSelecteds.forEach((_id, _idx) => {
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
              label={t("sparePart.form.fields.origin")}
              name="origin"
              labelAlign="left"
            >
              {/* <Select
                allowClear
                showSearch
                filterOption={filterOption}
                options={stockReceipts.map((sp) => ({
                  key: sp.id,
                  value: sp.code,
                  label: sp.code,
                }))}
              ></Select> */}
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("sparePart.form.fields.sparePart")}
              name="sparePart"
              labelAlign="left"
            >
              <Select
                allowClear
                showSearch
                filterOption={filterOption}
                options={spareParts.map((sp) => ({
                  key: sp.id,
                  value: sp.id,
                  label: sp.sparePartsName,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("sparePart.form.fields.supplier")}
              name="supplier"
              labelAlign="left"
            >
              <Select
                allowClear
                showSearch
                filterOption={filterOption}
                options={suppliers.map((sp) => ({
                  key: sp.id,
                  value: sp.id,
                  label: sp.supplierName,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("sparePart.form.fields.manufacturer")}
              name="manufacturer"
              labelAlign="left"
            >
              <Select
                allowClear
                showSearch
                filterOption={filterOption}
                options={manufacturers.map((sp) => ({
                  key: sp.id,
                  value: sp.id,
                  label: sp.manufacturerName,
                }))}
              ></Select>
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
            {sparePartDetailSelecteds.length > 0 && (
              <Button
                onClick={() => printAssetMaintennances(false)}
                type="primary"
                className="mr-2"
              >
                <PrinterOutlined />
                {t("sparePart.form.buttons.print_selected", {
                  count: sparePartDetailSelecteds.length,
                })}


              </Button>
            )}
            <Button
              className="bt-green mr-2"
              onClick={() => printAssetMaintennances(true)}
            >
              <PrinterOutlined />
              {t("sparePart.form.buttons.print_all")}
            </Button>
          </Col>
        </Row>
        <Row gutter={[16]}>
          {sparePartDetails &&
            sparePartDetails.length > 0 &&
            sparePartDetails.map((am) => {
              return (
                <Col span={4} className="mb-4 text-center" key={am.id}>
                  <Checkbox
                    onChange={(e) =>
                      onChangeCheckboxAssetSparePartDetail(e.target.checked, am.id)
                    }
                  />
                  <div id={am.id} className="div-asset">
                    <QrCodeCardSparePart sparePartDetail={am} />
                  </div>
                </Col>
              );
            })}
        </Row>
      </Form>
    </div>
  );
}