import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip
} from "antd";
import { PAGINATION, formatFloat } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../../router/routerConfig";
import useHeader from "../../../../contexts/headerContext";
import { filterOption } from "../../../../helper/search-select-helper";
import {
  formatCurrency,
  parseCurrency,
  parsePriceVnd
} from "../../../../helper/price-helper";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";

export default function AssetType() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetTypes, setAssetTypes] = useState([]);
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const [assetTypeCategorys, setAssetTypeCategorys] = useState([]);
  const [assets, setAssets] = useState([]);
  const { permissions } = useAuth();

  useEffect(() => {
    fetchGetListAsset();
  }, [page]);

  useEffect(() => {
    setHeaderTitle(t("assetType.list.title"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchGetAllAssetTypeCategory();
    fetchGetAllAsset();
  }, []);

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
  const onChangePagination = (value) => setPage(value);

  const onSearch = () => {
    fetchGetListAsset(true);
  };
  const resetSearch = () => {
    searchForm.resetFields();
    fetchGetListAsset(true);
  };
  const fetchGetListAsset = async (resetPage = false) => {
    if (resetPage) setPage(1);
    const values = searchForm.getFieldsValue();
    let payload = {
      page: resetPage ? 1 : page,
      limit: PAGINATION.limit,
      ...values
    };
    const res = await _unitOfWork.assetType.getListAssetTypes(payload);
    if (res && res.results && res.results?.results) {
      setAssetTypes(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onDeleteAssetType = async (values) => {
    const res = await _unitOfWork.assetType.deleteAssetType({
      id: values.id
    });
    if (res && res.code === 1) {
      if (assetTypes.length === 1 && page > 1) {
        setPage(1);
      } else {
        fetchGetListAsset();
      }
    }
  };

  const onClickUpdate = (value) => {
    navigate(staticPath.updateAssetType + "/" + value.id);
  };
  const onClickCreate = () => {
    navigate(staticPath.createAssetType);
  };
  const goToDetail = (value) => {
    navigate(staticPath.viewAssetType + "/" + value.id);
  };

  const columns = [
    {
      title: t("assetType.list.table.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1
    },
    {
      title: t("assetType.list.table.asset"),
      dataIndex: "asset",
      key: "asset",
      render: (text) => <span>{text?.assetName || ""}</span>
    },
    {
      title: t("assetType.list.table.category"),
      dataIndex: "assetTypeCategory",
      key: "assetTypeCategory",
      render: (text) => <span>{text?.name || ""}</span>
    },
    {
      title: t("assetType.list.table.expected_price"),
      dataIndex: "expectedPrice",
      align: "right",
      key: "expectedPrice",
      render: (text) => parsePriceVnd(text)
    },
    {
      title: t("assetType.list.table.note"),
      dataIndex: "note",
      key: "note"
    },
    {
      title: t("assetType.list.table.action"),
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.equipment_hierarchy_update
          ) && (
              <Tooltip title={t("assetType.list.buttons.edit")}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => onClickUpdate(record)}
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.equipment_hierarchy_details
          ) && (
              <Tooltip title={t("assetType.list.buttons.detail")}>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  size="small"
                  className="bt-green ml-2"
                  onClick={() => goToDetail(record)}
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.equipment_hierarchy_delete
          ) && (
              <Tooltip title={t("assetType.list.buttons.delete")}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="ml-2"
                  onClick={() =>
                    Comfirm(
                      t("assetType.messages.confirm_delete"),
                      () => onDeleteAssetType(record)
                    )
                  }
                />
              </Tooltip>
            )}
        </div>
      )
    }
  ];

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
              label={t(
                "assetType.list.search.category_label"
              )}
              name="assetTypeCategory"
            >
              <Select
                allowClear
                showSearch
                placeholder={t(
                  "assetType.list.search.placeholder_category"
                )}
                options={(assetTypeCategorys || []).map(
                  (item, key) => ({
                    key,
                    value: item.id,
                    label: item.name
                  })
                )}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetType.list.search.asset_label")}
              name="asset"
            >
              <Select
                allowClear
                showSearch
                placeholder={t(
                  "assetType.list.search.placeholder_asset"
                )}
                options={(assets || []).map((item, key) => ({
                  key,
                  value: item.id,
                  label: item.assetName
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t(
                "assetType.list.search.price_from_label"
              )}
              name="expectedPriceFrom"
            >
              <InputNumber
                placeholder={t(
                  "assetType.list.search.placeholder_price_from"
                )}
                formatter={formatCurrency}
                parser={parseCurrency}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t(
                "assetType.list.search.price_to_label"
              )}
              name="expectedPriceTo"
            >
              <InputNumber
                placeholder={t(
                  "assetType.list.search.placeholder_price_to"
                )}
                formatter={formatCurrency}
                parser={parseCurrency}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("assetType.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("assetType.buttons.reset")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {checkPermission(
              permissions,
              permissionCodeConstant.equipment_hierarchy_create
            ) && (
                <Button
                  key="1"
                  type="primary"
                  onClick={() => onClickCreate()}
                  className="ml-3"
                >
                  <PlusOutlined />
                  {t("assetType.buttons.create")}
                </Button>
              )}
          </Col>
          <Col
            span={24}
            style={{ fontSize: 16, textAlign: "right" }}
          >
            <b>
              {t("assetType.list.total", { count: totalRecord || 0 })}
            </b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={assetTypes}
          bordered
          pagination={false}
        />
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
      </Form>
    </div>
  );
}