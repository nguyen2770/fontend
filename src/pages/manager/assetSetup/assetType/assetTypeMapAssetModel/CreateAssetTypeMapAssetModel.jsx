import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../../api";
import { PAGINATION } from "../../../../../utils/constant";
import {
  dropdownRender,
  filterOption,
} from "../../../../../helper/search-select-helper";
import {
  CloseCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import ExpandRowAsset from "../../../../../components/modal/assetModel/ExpandRowAsset";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function CreateAssetTypeMapAssetModel({
  open,
  handleCancel,
  assetType,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [formSearchAsset] = Form.useForm();
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetModels, setAssetModels] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState();

  useEffect(() => {
    if (open) {
      fetchGetAllManfacturers();
      fetchGetAllCategorys();
      fetchgetAllSupplier();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchGetListAsset();
    }
  }, [open, page]);

  const fetchgetAllSupplier = async () => {
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
  const fetchGetAllCategorys = async () => {
    let res = await _unitOfWork.category.getAllCategory();
    if (res && res.code === 1) {
      setCategories(res.data);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetListAsset = async () => {
    const values = formSearchAsset.getFieldsValue();
    let payload = {
      page,
      limit: PAGINATION.limit,
      asset: assetType?.asset?.id || assetType?.asset?._id,
      ...values,
    };
    const res =
      await _unitOfWork.assetModel.getAssetModelByAssetTypeAndAsset(payload);
    if (res && res.results && res.results?.results) {
      setAssetModels(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const handleConfirm = async () => {
    let res = await _unitOfWork.assetModel.updateAssetModel(selectedRowKey, {
      assetTypeCategory: assetType?.assetTypeCategory?.id,
    });
    if (res && res.code === 1) {
      onCancel();
      setSelectedRowKey(undefined);
      setPage(1);
      setAssetModels([]);
      ShowSuccess(
        "topRight",
        t("assetType.notifications.title", { ns: "assetType" }),
        t("assetType.messages.create_success"),
      );
    }
  };
  const onSearch = () => {
    fetchGetListAsset();
  };
  const onCancel = () => {
    handleCancel();
    formSearchAsset.resetFields();
    onRefresh();
  };
  const onClickRefresh = () => {
    formSearchAsset.resetFields();
    fetchGetListAsset();
  };
  const selectedAssetModel = assetModels.find(
    (item) => item.id === selectedRowKey,
  );
  const columns = [
    {
      title: t("assetType.mapModel.table.model"),
      dataIndex: "assetModelName",
      key: "assetModelName",
      align: "center",
      className: "text-left-column",
    },
    {
      title: t("assetType.mapModel.table.manufacturer"),
      dataIndex: "manufacturer",
      align: "center",
      className: "text-left-column",
      render: (text) => <span>{text?.manufacturerName || ""}</span>,
    },
    {
      title: t("assetType.mapModel.table.supplier"),
      dataIndex: "supplier",
      align: "center",
      className: "text-left-column",
      render: (text) => <span>{text?.supplierName || ""}</span>,
    },
    {
      title: t("assetType.mapModel.table.category"),
      dataIndex: "category",
      align: "center",
      className: "text-left-column",
      render: (text) => <span>{text?.categoryName || ""}</span>,
    },
    {
      title: t("assetType.mapModel.table.sub_category"),
      dataIndex: "subCategory",
      align: "center",
      className: "text-left-column",
      render: (text) => <span>{text?.subCategoryName || ""}</span>,
    },
  ];
  return (
    <Modal
      open={open}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"80%"}
      destroyOnClose
    >
      <Form
        labelWrap
        form={formSearchAsset}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
      >
        <Card title={t("assetType.mapModel.modal.title")}>
          <Row className="mb-3" gutter={16}>
            <Col span={6}>
              <Form.Item
                label={t("assetType.mapModel.modal.search.model_name")}
                name="assetModelName"
              >
                <Input
                  placeholder={t(
                    "assetType.mapModel.modal.search.model_name_placeholder",
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("assetType.mapModel.modal.search.manufacturer")}
                name="manufacturer"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetType.mapModel.modal.search.manufacturer_placeholder",
                  )}
                  showSearch
                  options={manufacturers?.map((item) => ({
                    value: item.id,
                    label: `${item.manufacturerName}  ${item.origin ? " - " + item?.origin?.originName : ""}`,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("assetType.mapModel.modal.search.supplier")}
                name="supplier"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetType.mapModel.modal.search.supplier_placeholder",
                  )}
                  showSearch
                  options={suppliers?.map((item) => ({
                    value: item.id,
                    label: item.supplierName,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("assetType.mapModel.modal.search.category")}
                name="category"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetType.mapModel.modal.search.category_placeholder",
                  )}
                  showSearch
                  options={categories?.map((item) => ({
                    value: item.id,
                    label: item.categoryName,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col flex="auto" style={{ textAlign: "left" }}>
              <Button
                className="mr-2"
                type="primary"
                onClick={onClickRefresh}
                style={{ background: "#008444" }}
              >
                <SyncOutlined />
                {t("assetType.mapModel.modal.buttons.refresh")}
              </Button>
              <Button type="primary" onClick={onSearch}>
                <SearchOutlined />
                {t("assetType.mapModel.modal.buttons.search")}
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button onClick={handleCancel} className="ml-3">
                <CloseCircleOutlined />
                {t("assetType.mapModel.modal.buttons.cancel")}
              </Button>
              <Button
                className="ml-3"
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedAssetModel}
              >
                <CloseCircleOutlined />
                {t("assetType.mapModel.modal.buttons.confirm")}
              </Button>
            </Col>
          </Row>
          <Table
            rowKey="id"
            columns={columns}
            key={"id"}
            dataSource={assetModels}
            bordered
            pagination={false}
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
              onChange: (selectedKeys) => setSelectedRowKey(selectedKeys[0]),
            }}
            expandable={{
              expandedRowRender: (record) => (
                <ExpandRowAsset assetModel={record} />
              ),
            }}
          />
          <Pagination
            className="pagination-table mt-2"
            onChange={onChangePagination}
            pageSize={PAGINATION.limit}
            total={totalRecord}
            current={page}
          />
        </Card>
      </Form>
    </Modal>
  );
}
