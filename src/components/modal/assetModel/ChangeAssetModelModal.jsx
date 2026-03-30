import Modal from "antd/es/modal/Modal";
import React, { useEffect, useState } from "react";
import {
  CloseCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Card,
} from "antd";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import {
  dropdownRender,
  filterOption,
} from "../../../helper/search-select-helper";
import ExpandRowAsset from "./ExpandRowAsset";
import { useTranslation } from "react-i18next";

export default function ChangeAssetModelModal({
  open,
  handleCancel,
  onSelectAssetModel,
  assetModelChange,
  data,
}) {
  const { t } = useTranslation();
  const [formSearchAsset] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetModels, setAssetModels] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assetTypeCategorys, setAssetTypeCategorys] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState();

  useEffect(() => {
    if (assetModelChange) {
      setSelectedRowKey(assetModelChange.id);
    }
  }, [assetModelChange]);

  useEffect(() => {
    if (open) {
      fetchGetAllManfacturers();
      fetchGetAllCategorys();
      fetchGetAllAssetTypeCategory();
      fetchgetAllSupplier();
      if (data) {
        formSearchAsset.setFieldsValue({ ...data });
        onSearch();
      }
    }
  }, [open, data]);

  useEffect(() => {
    const values = formSearchAsset.getFieldsValue();
    fetchGetListAsset(values);
  }, [page]);

  const fetchgetAllSupplier = async () => {
    let res = await _unitOfWork.supplier.getAllSupplier();
    if (res && res.code === 1) {
      setSuppliers(res.data);
    }
  };
  const fetchGetAllAssetTypeCategory = async () => {
    let res = await _unitOfWork.assetTypeCategory.getAllAssetTypeCategory();
    if (res && res.code === 1) {
      setAssetTypeCategorys(res.data);
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
  const onSearch = () => {
    const values = formSearchAsset.getFieldsValue();
    fetchGetListAsset(values);
  };
  const onRefresh = () => {
    formSearchAsset.resetFields();
    setPage(1);
    fetchGetListAsset();
  };

  const fetchGetListAsset = async (values) => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...values,
    };
    let res;
    res = await _unitOfWork.assetModel.getListAssetModel(payload);

    if (res && res.results && res.results?.results) {
      setAssetModels(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onChangePagination = (value) => {
    setPage(value);
  };

  const selectedAssetModel = assetModels.find(
    (item) => item.id === selectedRowKey,
  );

  const handleConfirm = () => {
    if (onSelectAssetModel && selectedAssetModel) {
      onSelectAssetModel(selectedAssetModel);
    }
    handleCancel();
  };

  const columns = [
    {
      title: t("common.modal.assetModelSelector.table.asset_name"),
      dataIndex: "assetName",
      key: "assetName",
      align: "center",
      className: "text-left-column",
      render: (_text, record) => {
        return <span>{record?.asset?.assetName ?? null}</span>;
      },
    },
    {
      title: t("common.modal.assetModelSelector.table.model"),
      dataIndex: "assetModelName",
      key: "assetModelName",
      align: "center",
      className: "text-left-column",
    },
    {
      title: t("common.modal.assetModelSelector.table.asset_type_category"),
      dataIndex: "assetTypeCategory",
      align: "center",
      className: "text-left-column",
      render: (_text, record) => {
        return <span>{record?.assetTypeCategory?.name ?? null}</span>;
      },
    },
    {
      title: t("common.modal.assetModelSelector.table.manufacturer"),
      dataIndex: "manufacturer",
      align: "center",
      className: "text-left-column",
      render: (text) => {
        return <span>{text?.manufacturerName || ""}</span>;
      },
    },
    {
      title: t("common.modal.assetModelSelector.table.supplier"),
      dataIndex: "supplier",
      align: "center",
      className: "text-left-column",
      render: (text) => {
        return <span>{text?.supplierName || ""}</span>;
      },
    },
    {
      title: t("common.modal.assetModelSelector.table.category"),
      dataIndex: "category",
      align: "center",
      className: "text-left-column",
      render: (text) => {
        return <span>{text?.categoryName || ""}</span>;
      },
    },
    {
      title: t("common.modal.assetModelSelector.table.sub_category"),
      dataIndex: "subCategory",
      align: "center",
      className: "text-left-column",
      render: (text) => {
        return <span>{text?.subCategoryName || ""}</span>;
      },
    },
  ];

  return (
    <Modal
      open={open}
      onOk={handleCancel}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"95%"}
      destroyOnClose
    >
      <Form
        labelWrap
        form={formSearchAsset}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Card title={t("common.modal.assetModelSelector.title")}>
          <Row className="mb-3" gutter={8}>
            <Col span={6}>
              <Form.Item
                label={t("common.modal.assetModelSelector.search.asset_name")}
                name="assetName"
              >
                <Input
                  placeholder={t(
                    "common.modal.assetModelSelector.search.placeholder_asset_name",
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("common.modal.assetModelSelector.search.model_name")}
                name="assetModelName"
              >
                <Input
                  placeholder={t(
                    "common.modal.assetModelSelector.search.placeholder_model_name",
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t(
                  "common.modal.assetModelSelector.search.asset_type_category",
                )}
                name="assetTypeCategory"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "common.modal.assetModelSelector.search.placeholder_asset_type_category",
                  )}
                  showSearch
                  options={assetTypeCategorys?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t("common.modal.assetModelSelector.search.supplier")}
                name="supplier"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "common.modal.assetModelSelector.search.placeholder_supplier",
                  )}
                  showSearch
                  options={suppliers?.map((item) => ({
                    value: item.id,
                    label: item.supplierName,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t("common.modal.assetModelSelector.search.manufacturer")}
                name="manufacturer"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "common.modal.assetModelSelector.search.placeholder_manufacturer",
                  )}
                  showSearch
                  options={manufacturers?.map((item) => ({
                    value: item.id,
                    label: `${item.manufacturerName}  ${item.origin ? " - " + item?.origin?.originName : ""}`,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t("common.modal.assetModelSelector.search.category")}
                name="category"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "common.modal.assetModelSelector.search.placeholder_category",
                  )}
                  showSearch
                  options={categories?.map((item) => ({
                    value: item.id,
                    label: item.categoryName,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col flex="auto" style={{ textAlign: "left" }}>
              <Button type="primary" onClick={onSearch} className="mr-2">
                <SearchOutlined />
                {t("common.modal.assetModelSelector.buttons.search")}
              </Button>
              <Button
                type="primary"
                onClick={() => onRefresh()}
                style={{ background: "#008444" }}
              >
                <SyncOutlined />
                {t("common.modal.assetModelSelector.buttons.refresh")}
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button onClick={handleCancel} className="ml-3">
                <CloseCircleOutlined />
                {t("common.modal.assetModelSelector.buttons.cancel")}
              </Button>
              <Button
                className="ml-3"
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedAssetModel}
              >
                <CloseCircleOutlined />
                {t("common.modal.assetModelSelector.buttons.confirm")}
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
            onRow={(record) => ({
              onClick: () => {
                setSelectedRowKey(record.id);
              },
            })}
          ></Table>
          <Pagination
            className="pagination-table mt-2"
            onChange={onChangePagination}
            pageSize={pagination.limit}
            total={totalRecord}
            current={page}
            showSizeChanger={false}
          />
        </Card>
      </Form>
    </Modal>
  );
}
