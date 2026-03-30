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
import {
  assetStatusOptions,
  assetType,
  PAGINATION,
} from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { filterOption } from "../../../helper/search-select-helper";
import { parseToLabel } from "../../../helper/parse-helper";
import { useTranslation } from "react-i18next";
import { LabelValue } from "../../../helper/label-value";
import noImage from "../../../assets/images/no-image.png";
export default function AssetMaintenanceModel({
  open,
  handleCancel,
  onSelectAssetMaintenance,
  assetChange,
}) {
  const { t } = useTranslation();
  const [formSearchAsset] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState();
  const [assetModels, setAssetModels] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (assetChange) {
      setSelectedRowKey(assetChange.id);
    }
  }, [assetChange]);

  useEffect(() => {
    if (open) {
      fetchGetAllManfacturers();
      fetchGetAllCategorys();
      fetchGetAllCustomers();
      fetchGetAllAssetModels();
      fetchGetAllAssets();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchGetListAsset();
    }
  }, [page, open]);

  const fetchGetAllAssets = async () => {
    let res = await _unitOfWork.asset.getAllAsset();
    if (res && res.code === 1) {
      setAssets(res.data);
    }
  };
  const fetchGetAllAssetModels = async () => {
    let res = await _unitOfWork.assetModel.getAllAssetModel();
    if (res && res.code === 1) {
      setAssetModels(res.data);
    }
  };

  const fetchGetAllCustomers = async () => {
    let res = await _unitOfWork.customer.getAllCustomer();
    if (res && res.code === 1) {
      setCustomers(res.data);
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
      assetStatuses: [
        assetStatusOptions.ACTIVE,
        assetStatusOptions.PAUSED,
        assetStatusOptions.PENDING_CANCEL,
      ],
    };
    const res =
      await _unitOfWork.assetMaintenance.getListAssetMaintenances(payload);

    if (res && res.results && res.results?.results) {
      setAssetMaintenances(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onChangePagination = (value) => {
    setPage(value);
  };
  const selectedAssetMaintenance = assetMaintenances.find(
    (item) => item.id === selectedRowKey,
  );
  const handleClose = () => {
    formSearchAsset.resetFields();
    setPage(1);
    setSelectedRowKey(null);
    fetchGetListAsset();
    handleCancel();
  };
  const handleConfirm = () => {
    if (onSelectAssetMaintenance && selectedAssetMaintenance) {
      onSelectAssetMaintenance(selectedAssetMaintenance);
    }
    handleClose();
  };

  const columns = [
    {
      title: t("assetMaintenance.list.title_info"),
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("modal.assetSelect.table.asset_name")}
            value={
              <span
                style={{
                  display: "block",
                  maxWidth: 150,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {record?.assetModel?.asset?.assetName}
              </span>
            }
          />
          <LabelValue
            label={t("modal.assetSelect.table.model")}
            value={record?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("modal.assetSelect.table.serial")}
            value={record?.serial}
          />
          <LabelValue
            label={t("assetMaintenance.asset_number")}
            value={record?.assetNumber}
          />
        </div>
      ),
    },
    {
      title: t("assetMaintenance.additional_information"),
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("modal.assetSelect.table.asset_style")}
            value={t(parseToLabel(assetType.Options, record?.assetStyle))}
          />
          <LabelValue
            label={t("modal.assetSelect.table.manufacturer")}
            value={record?.assetModel?.manufacturer?.manufacturerName}
          />
          <LabelValue
            label={t("modal.assetSelect.table.category")}
            value={record?.assetModel?.category?.categoryName}
          />
          <LabelValue
            label={t("manufacturer.form.fields.origin")}
            value={record?.assetModel?.manufacturer?.origin?.originName}
          />
        </div>
      ),
    },
    {
      title: t("preventiveSchedule.modal.map_title"),
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("breakdown.map.fields.branch")}
            value={record?.branchName}
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={record?.departmentName}
          />
          <LabelValue
            label={t("modal.assetSelect.table.customer")}
            value={record?.customer?.customerName}
          />
        </div>
      ),
    },
    {
      title: t("schedulePreventiveTask.columns.status"),
      dataIndex: "assetStatus",
      align: "center",
      render: (status, record) => {
        const option = assetStatusOptions.Options.find(
          (opt) => opt.value === record?.assetStatus,
        );
        const label = option ? t(option.label) : record?.assetStatus;
        const color = option?.color || "#d9d9d9";
        return (
          <span
            className="status-badge"
            style={{
              "--color": color,
            }}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: t("assetMaintenance.list.table.image"),
      dataIndex: "resource",
      align: "center",
      render: (text, record) => {
        return record?.resource ? (
          <img
            src={_unitOfWork.resource.getImage(record?.resource?.id)}
            alt="anhthietbi.atl"
            style={{
              width: 80,
              height: 60,
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src={noImage}
            alt="anhthietbi.atl"
            style={{
              width: 80,
              height: 60,
              objectFit: "cover",
            }}
          />
        );
      },
    },
  ];

  return (
    <Modal
      open={open}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"85%"}
    >
      <Form labelWrap form={formSearchAsset} layout="vertical">
        <Card title={t("modal.assetSelect.title")}>
          <Row className="mb-3" gutter={32}>
            <Col span={6}>
              <Form.Item
                label={t("assetMaintenance.asset_number")}
                name="assetNumber"
                labelAlign="left"
              >
                <Input
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_asset_number",
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.serial")}
                name="serial"
                labelAlign="left"
              >
                <Input
                  placeholder={t("modal.assetSelect.search.serial_placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.asset_style")}
                name="assetStyle"
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "modal.assetSelect.search.asset_style_placeholder",
                  )}
                  options={(assetType.Options || []).map((item) => ({
                    value: item.value,
                    label: t(item.label),
                  }))}
                  allowClear
                  filterOption={filterOption}
                  showSearch={true}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.manufacturer")}
                name="manufacturer"
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "modal.assetSelect.search.manufacturer_placeholder",
                  )}
                  showSearch
                  allowClear
                  options={(manufacturers || []).map((item) => ({
                    value: item.id,
                    label: item.manufacturerName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.category")}
                name="category"
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "modal.assetSelect.search.category_placeholder",
                  )}
                  showSearch
                  allowClear
                  options={(categories || []).map((item) => ({
                    value: item.id,
                    label: item.categoryName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.sub_category")}
                name="subcCategory"
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "modal.assetSelect.search.sub_category_placeholder",
                  )}
                  showSearch
                  allowClear
                  options={(categories || []).map((item) => ({
                    value: item.id,
                    label: item.categoryName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.customer")}
                name="customer"
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "modal.assetSelect.search.customer_placeholder",
                  )}
                  showSearch
                  allowClear
                  options={(customers || []).map((item) => ({
                    value: item.id,
                    label:
                      item.customerName +
                      (item.contactNumber
                        ? ` - ( ${item.contactNumber} )`
                        : ""),
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.asset")}
                name="asset"
                labelAlign="left"
              >
                <Select
                  placeholder={t("modal.assetSelect.search.asset_placeholder")}
                  showSearch
                  allowClear
                  options={(assets || []).map((item) => ({
                    value: item.id,
                    label: item.assetName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("modal.assetSelect.search.asset_model")}
                name="assetModel"
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "modal.assetSelect.search.asset_model_placeholder",
                  )}
                  showSearch
                  allowClear
                  options={(assetModels || []).map((item) => ({
                    value: item.id,
                    label: item.assetModelName,
                  }))}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col flex="auto" style={{ textAlign: "left" }}>
              <Button type="primary" onClick={onSearch} className="mr-2">
                <SearchOutlined />
                {t("modal.assetSelect.buttons.search")}
              </Button>
              <Button
                type="primary"
                onClick={onRefresh}
                style={{ background: "#008444" }}
              >
                <SyncOutlined />
                {t("modal.assetSelect.buttons.refresh")}
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button onClick={handleClose} className="ml-3">
                <CloseCircleOutlined />
                {t("modal.assetSelect.buttons.cancel")}
              </Button>
              <Button
                className="ml-3"
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedAssetMaintenance}
              >
                <CloseCircleOutlined />
                {t("modal.assetSelect.buttons.confirm")}
              </Button>
            </Col>
          </Row>
          <Table
            rowKey="id"
            columns={columns}
            key={"id"}
            dataSource={assetMaintenances}
            bordered
            pagination={false}
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
              onChange: (selectedKeys) => setSelectedRowKey(selectedKeys[0]),
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
          />
        </Card>
      </Form>
    </Modal>
  );
}
