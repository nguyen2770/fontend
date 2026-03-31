import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
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
  Tooltip,
} from "antd";
import CreateAssetModel from "./CreateAssetModel";
import UpdateAssetModel from "./UpdateAssetModel";
import {
  createNewUsingAFormulaType,
  PAGINATION,
} from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import useHeader from "../../../../contexts/headerContext";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../../router/routerConfig";
import {
  dropdownRender,
  filterOption,
} from "../../../../helper/search-select-helper";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import DrawerSearch from "../../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../../helper/check-search-value";

export default function AssetModelList() {
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeader();
  const navigate = useNavigate();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assets, setAssets] = useState([]);
  const [assetModelChange, setAssetModelChange] = useState(null);
  const [assetModels, setAssetModels] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assetTypeCategorys, setAssetTypeCategorys] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchForm] = Form.useForm();
  const { permissions, companySetting } = useAuth();
  const pagination = PAGINATION;
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("assetModel.model.list_title"));
    fetchManufacturers();
    fetchCategories();
    fetchAssetTypeCats();
    fetchSuppliers();
    fetchAssets();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchList(page, searchFilter);
    } else fetchList(1, searchFilter);
  }, [page]);

  const fetchAssets = async () => {
    const res = await _unitOfWork.asset.getAllAsset();
    if (res?.code === 1) setAssets(res.data);
  };
  const fetchSuppliers = async () => {
    const res = await _unitOfWork.supplier.getAllSupplier();
    if (res?.code === 1) setSuppliers(res.data);
  };
  const fetchAssetTypeCats = async () => {
    const res = await _unitOfWork.assetTypeCategory.getAllAssetTypeCategory();
    if (res?.code === 1) setAssetTypeCategorys(res.data);
  };
  const fetchManufacturers = async () => {
    const res = await _unitOfWork.manufacturer.getAllManufacturer();
    if (res?.code === 1) setManufacturers(res.data);
  };
  const fetchCategories = async () => {
    const res = await _unitOfWork.category.getAllCategory();
    if (res?.code === 1) setCategories(res.data);
  };

  const fetchList = async (_page, value) => {
    let filterValue = cleanEmptyValues(value || {});
    const payload = {
      page: _page || page,
      limit: pagination.limit,
      ...filterValue,
      ...searchForm.getFieldsValue(),
    };
    const res = await _unitOfWork.assetModel.getListAssetModel(payload);
    if (res?.results?.results) {
      setAssetModels(res.results.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onClickUpdate = (record) => {
    setAssetModelChange(record);
    setIsOpenUpdate(true);
  };

  const onDelete = async (record) => {
    const res = await _unitOfWork.assetModel.deleteAssetModel({
      id: record.id,
    });
    if (res?.code === 1) {
      setPage(1);
      fetchList(1, searchFilter);
    }
  };

  const goToDetail = (record) => {
    navigate(staticPath.viewAssetModel + "/" + record.id);
  };

  const onViewPreventiveOfModel = (record) => {
    navigate(`${staticPath.preventiveOfModel}/${record.id}`, {
      state: { record },
    });
  };

  const columns = [
    {
      title: t("assetModel.model.table.index"),
      dataIndex: "id",
      width: 60,
      align: "center",
      render: (_t, _r, i) => (page - 1) * pagination.limit + i + 1,
    },
    {
      title: t("assetModel.model.table.asset"),
      dataIndex: "asset",
      className: "text-left-column",
      render: (val) => val?.assetName || "",
    },
    ...((companySetting.createNewUsingAFormula ===
      createNewUsingAFormulaType.healthInsurance ||
      companySetting.createNewUsingAFormula ===
        createNewUsingAFormulaType.healthInsuranceDecree3176) &&
    companySetting?.autoGenerateAssetNumber
      ? [
          {
            title: t("assetModel.model.table.model"),
            dataIndex: "assetModelName",
          },
        ]
      : ""),
    {
      title: t("assetModel.model.table.category"),
      dataIndex: "category",
      className: "text-left-column",
      render: (val) => val?.categoryName || "",
    },
    {
      title: t("assetModel.model.table.asset_type_category"),
      dataIndex: "assetTypeCategory",
      className: "text-left-column",
      render: (val) => val?.name || "",
    },
    {
      title: t("assetModel.model.table.manufacturer"),
      dataIndex: "manufacturer",
      className: "text-left-column",
      render: (val) => val?.manufacturerName || "",
    },
    {
      title: t("assetModel.model.table.supplier"),
      dataIndex: "supplier",
      className: "text-left-column",
      render: (val) => val?.supplierName || "",
    },
    {
      title: t("assetModel.model.table.sub_category"),
      dataIndex: "subCategory",
      className: "text-left-column",
      render: (val) => val?.subCategoryName || "",
    },
    {
      title: t("assetModel.common.table.action"),
      dataIndex: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.equipment_model_update,
          ) && (
            <Tooltip title={t("assetModel.common.buttons.update")}>
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
            permissionCodeConstant.equipment_model_view_detail,
          ) && (
            <Tooltip title={t("assetModel.common.buttons.detail")}>
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
            permissionCodeConstant.equipment_model_delete,
          ) && (
            <Tooltip title={t("assetModel.common.buttons.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="ml-2"
                onClick={() =>
                  Comfirm(t("assetModel.common.messages.confirm_delete"), () =>
                    onDelete(record),
                  )
                }
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const onSearch = () => {
    setPage(1);
    fetchList(1, searchFilter);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchList();
  };
  const onChangePagination = (p) => setPage(p);

  // const assetOptions = useMemo(() => {
  //   return assets.map(item => ({
  //     value: item.id,
  //     label: item.assetName,
  //   })) || [];
  // }, [assets]);

  const assetModelFieldsConfig = [
    {
      name: "asset",
      labelKey: "assetModel.model.search.asset",
      placeholderKey: "assetModel.model.search.placeholder_asset",
      component: "Select",
      options: assets.map((item) => ({
        value: item.id,
        label: item.assetName,
      })),
      // options: assetOptions, // tôc độ vẫn vậy
    },
    {
      name: "assetModelName",
      labelKey: "assetModel.model.search.model",
      placeholderKey: "assetModel.model.search.placeholder_model",
      component: "Input",
    },
    {
      name: "assetTypeCategory",
      labelKey: "assetModel.model.search.asset_type_category",
      placeholderKey: "assetModel.model.search.placeholder_asset_type_category",
      component: "Select",
      options: assetTypeCategorys.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    },
    {
      name: "supplier",
      labelKey: "assetModel.model.search.supplier",
      placeholderKey: "assetModel.model.search.placeholder_supplier",
      component: "Select",
      options: suppliers.map((item) => ({
        value: item.id,
        label: item.supplierName,
      })),
    },
    {
      name: "manufacturer",
      labelKey: "assetModel.model.search.manufacturer",
      placeholderKey: "assetModel.model.search.placeholder_manufacturer",
      component: "Select",
      options: manufacturers.map((item) => ({
        value: item.id,
        label: item.manufacturerName,
      })),
    },
    {
      name: "category",
      labelKey: "assetModel.model.search.category",
      placeholderKey: "assetModel.model.search.placeholder_category",
      component: "Select",
      options: categories.map((item) => ({
        value: item.id,
        label: item.categoryName,
      })),
    },
  ];

  return (
    <div className="p-3">
      <Form
        labelWrap
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
        className="search-form"
      >
        {/* <Row gutter={32}>
          <Col span={6}>
            <Form.Item label={t("assetModel.model.search.asset")} name="asset">
              <Select
                allowClear
                placeholder={t("assetModel.model.search.placeholder_asset")}
                showSearch
                options={assets.map((item) => ({
                  value: item.id,
                  label: item.assetName,
                }))}
                filterOption={filterOption}
                dropdownStyle={dropdownRender}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetModel.model.search.model")}
              name="assetModelName"
            >
              <Input
                placeholder={t("assetModel.model.search.placeholder_model")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetModel.model.search.asset_type_category")}
              name="assetTypeCategory"
            >
              <Select
                allowClear
                placeholder={t(
                  "assetModel.model.search.placeholder_asset_type_category"
                )}
                showSearch
                options={assetTypeCategorys.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                filterOption={filterOption}
                dropdownStyle={dropdownRender}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetModel.model.search.supplier")}
              name="supplier"
            >
              <Select
                allowClear
                placeholder={t("assetModel.model.search.placeholder_supplier")}
                showSearch
                options={suppliers.map((item) => ({
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
              label={t("assetModel.model.search.manufacturer")}
              name="manufacturer"
            >
              <Select
                allowClear
                placeholder={t(
                  "assetModel.model.search.placeholder_manufacturer"
                )}
                showSearch
                options={manufacturers.map((item) => ({
                  value: item.id,
                  label: item.manufacturerName,
                }))}
                filterOption={filterOption}
                dropdownStyle={dropdownRender}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("assetModel.model.search.category")}
              name="category"
            >
              <Select
                allowClear
                placeholder={t("assetModel.model.search.placeholder_category")}
                showSearch
                options={categories.map((item) => ({
                  value: item.id,
                  label: item.categoryName,
                }))}
                filterOption={filterOption}
                dropdownStyle={dropdownRender}
              />
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t("assetModel.model.search.model")}
              name="assetModelName"
            >
              <Input
                placeholder={t("assetModel.model.search.placeholder_model")}
              ></Input>
            </Form.Item>
          </Col>
          <Col
            span={12}
            className="mt-3"
            style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
          >
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined /> {t("assetModel.common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined /> {t("assetModel.common.buttons.reset")}
            </Button>
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
            >
              <FilterOutlined
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => setIsOpenSearchAdvanced(true)}
              />
            </Button>
          </Col>
          <Col span={4} style={{ textAlign: "right", marginTop: 23 }}>
            {checkPermission(
              permissions,
              permissionCodeConstant.equipment_model_create,
            ) && (
              <Button
                type="primary"
                onClick={() => setIsOpenCreate(true)}
                className="ml-3"
              >
                <PlusOutlined /> {t("assetModel.common.buttons.create")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("assetModel.model.total", {
                count: totalRecord || 0,
              })}
            </b>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={assetModels}
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
        <CreateAssetModel
          open={isOpenCreate}
          handleCancel={() => setIsOpenCreate(false)}
          handleOk={() => setIsOpenCreate(false)}
          onRefresh={fetchList}
        />
        <UpdateAssetModel
          open={isOpenUpdate}
          handleCancel={() => setIsOpenUpdate(false)}
          handleOk={() => setIsOpenUpdate(false)}
          assetModelChange={assetModelChange}
          onRefresh={fetchList}
        />
        <DrawerSearch
          isOpen={isOpenSearchAdvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["assetModelName"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchList(1, value);
            }
          }}
          onClose={() => {
            setIsOpenSearchAdvanced(false);
          }}
          fieldsConfig={assetModelFieldsConfig}
        />
      </Form>
    </div>
  );
}
