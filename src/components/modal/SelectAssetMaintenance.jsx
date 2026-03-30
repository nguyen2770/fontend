import React, { useEffect, useState } from "react";
import { PlusOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
} from "antd";
import { assetType, PAGINATION } from "../../utils/constant";
import * as _unitOfWork from "../../api";
import { parseToLabel } from "../../helper/parse-helper";
import { filterOption } from "../../helper/search-select-helper";
import { useTranslation } from "react-i18next";

const SelectAssetMaintenance = ({
  open,
  onClose,
  id,
  onSubmitBack = () => {},
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [assetModels, setAssetModels] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [searchForm] = Form.useForm();

  useEffect(() => {
    if (open) {
      fetchGetListAssetMiantenance();
    }
  }, [page, open]);

  useEffect(() => {
    if (open) {
      fetchGetAllAssetModel();
    }
  }, [open]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const fetchGetAllAssetModel = async () => {
    let res = await _unitOfWork.assetModel.getAllAssetModel();
    if (res && res.code === 1) {
      setAssetModels(res.data);
    }
  };
  const fetchGetListAssetMiantenance = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
    };
    const res =
      await _unitOfWork.assetMaintenance.getPropertyAccessoriesNotMap(payload);
    if (res && res.data && res.data?.results) {
      setAssetMaintenances(res.data?.results);
      setTotalRecord(res.data.totalResults);
    }
  };

  const onSearch = () => {
    pagination.page = 1;
    fetchGetListAssetMiantenance();
  };
  const resetSearch = () => {
    searchForm.resetFields();
    fetchGetListAssetMiantenance();
  };
  const columns = [
    {
      title: t("assetMaintenance.export.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("assetMaintenance.list.search.serial_label"),
      dataIndex: "serial",
      align: "center",
      className: "text-left-column",
    },
    {
      title: t("assetMaintenance.list.search.asset_number_label"),
      dataIndex: "assetNumber",
      align: "center",
      className: "text-left-column",
    },
    {
      title: t("assetMaintenance.list.table.asset_name"),
      dataIndex: "assetModel",
      align: "center",
      className: "text-left-column",
      render: (text) => {
        return <span>{text?.asset?.assetName}</span>;
      },
    },
    {
      title: t("assetMaintenance.list.table.model"),
      dataIndex: "assetModel",
      align: "center",
      className: "text-left-column",
      render: (_text, record) => {
        return <span>{record?.assetModel?.assetModelName || []}</span>;
      },
    },
    {
      title: t("assetMaintenance.list.table.asset_style"),
      dataIndex: "assetStyle",
      align: "center",
      className: "text-left-column",
      render: (text) => t(parseToLabel(assetType.Options, text)),
    },
    {
      title: t("assetMaintenance.list.table.image"),
      dataIndex: "resource",
      align: "center",
      render: (_text, record) => {
        return (
          <img
            src={_unitOfWork.resource.getImage(record?.resource?.id)}
            alt="asset"
            style={{
              width: 80,
              height: 50,
              objectFit: "cover",
            }}
          />
        );
      },
    },
  ];

  const onSubmit = async () => {
    setSelectedRowKeys([]);
    searchForm.resetFields();
    onSubmitBack(selectedRowKeys);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={() => onClose()}
      className="custom-modal"
      footer={null}
      width={"70%"}
    >
      <Card title={t("assetMaintenance.list.title")}>
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
                id=""
                label={t("assetMaintenance.list.search.serial_label")}
                name="serial"
              >
                <Input
                  placeholder={t(
                    "assetMaintenance.list.search.placeholder_serial",
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                id=""
                label={t("assetMaintenance.list.search.asset_number_label")}
                name="assetNumber"
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
                id=""
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
            <Col span={6}>
              <Form.Item
                id=""
                labelAlign="left"
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
                    label: t(item.label),
                  }))}
                />
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

            <Col span={12} style={{ textAlign: "right" }}>
              <Button key="1" type="default" onClick={onClose} className="ml-2">
                <SearchOutlined />
                {t("common.modal.sparepartSelector.buttons.cancel")}
              </Button>
              <Button
                key="1"
                type="primary"
                onClick={() => onSubmit()}
                className="ml-2"
              >
                <PlusOutlined />
                {t("common.modal.sparepartSelector.buttons.confirm")}
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
              selectedRowKeys,
              onChange: onSelectChange,
            }}
          />
          <Pagination
            className="pagination-table mt-2"
            onChange={onChangePagination}
            pageSize={pagination.limit}
            total={totalRecord}
            current={page}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default SelectAssetMaintenance;
