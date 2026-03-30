/* i18n additions only */
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import {
  AppstoreOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MenuOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Option } from "antd/es/mentions";
import { pdf } from "@react-pdf/renderer";
import * as _unitOfWork from "../../../api";
import { FORMAT_DATE, PAGINATION } from "../../../utils/constant";
import { utils, write } from "xlsx";
import FileSaver from "file-saver";
import {
  dropdownRender,
  filterOption,
} from "../../../helper/search-select-helper";
import useHeader from "../../../contexts/headerContext";
import ExportPdf from "./exportPdf";
import { parseDate } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function AssetMaintenanceReport() {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("report.assetMaintenanceReport.columns.index"),
      dataIndex: "stt",
      key: "stt",
      align: "center",
      fixed: "left",
      width: 70,
      disabled: true,
      render(_, record, index) {
        return (
          <span>{(pagination.page - 1) * pagination.limit + index + 1}</span>
        );
      },
    },
    {
      title: t("report.assetMaintenanceReport.columns.customer_name"),
      dataIndex: "customer",
      key: "customerName",
      width: 120,
      disabled: true,
      render: (text) => <span>{text?.customerName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.contact_number"),
      dataIndex: "customer",
      key: "contactNumber",
      defaultVisible: false,
      width: 180,
      render: (text) => <span>{text?.contactNumber}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.address"),
      dataIndex: "customer",
      key: "address",
      width: 200,
      defaultVisible: false,
      render: (text) => <span>{text?.addressTwo}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.building"),
      dataIndex: "building",
      key: "building",
      width: 160,
      defaultVisible: false,
      render: (text) => <span>{text?.buildingName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.floor"),
      dataIndex: "floor",
      key: "floor",
      width: 120,
      disabled: true,
      render: (text) => <span>{text?.floorName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.department"),
      dataIndex: "department",
      key: "department",
      width: 200,
      render: (text) => <span>{text?.departmentName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.manufacturer"),
      dataIndex: "assetModel",
      key: "manufacturer",
      width: 220,
      render: (text) => <span>{text?.manufacturer?.manufacturerName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.category"),
      dataIndex: "assetModel",
      key: "category",
      width: 220,
      render: (text) => <span>{text?.category?.categoryName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.sub_category"),
      dataIndex: "assetModel",
      key: "subCategory",
      width: 220,
      defaultVisible: false,
      render: (text) => <span>{text?.subCategory?.subCategoryName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.asset_name"),
      dataIndex: "assetModel",
      key: "asset",
      width: 220,
      defaultVisible: false,
      render: (text) => <span>{text?.asset?.assetName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.asset_model"),
      dataIndex: "assetModel",
      key: "assetModelName",
      width: 220,
      defaultVisible: false,
      render: (text) => <span>{text?.assetModelName}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.asset_id"),
      dataIndex: "serial",
      key: "serial",
      width: 220,
    },
    {
      title: t("report.assetMaintenanceReport.columns.asset_number"),
      dataIndex: "assetNumber",
      key: "assetNumber",
      width: 220,
      defaultVisible: false,
    },
    {
      title: t("report.assetMaintenanceReport.columns.criticality"),
      dataIndex: "criticality",
      key: "criticality",
      width: 220,
      defaultVisible: false,
    },
    {
      title: t("report.assetMaintenanceReport.columns.capacity_rating"),
      dataIndex: "capacityRating",
      key: "capacityRating",
      width: 220,
      defaultVisible: false,
    },
    {
      title: t("report.assetMaintenanceReport.columns.service_provider_name"),
      dataIndex: "serviceProvider",
      key: "serviceProvider",
      width: 220,
      defaultVisible: false,
    },
    {
      title: t("report.assetMaintenanceReport.columns.purchase_date"),
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      width: 120,
      defaultVisible: false,
      align: "center",
      render: (text) => <span>{parseDate(text)}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.installation_date"),
      dataIndex: "installationDate",
      key: "installationDate",
      width: 120,
      defaultVisible: false,
      align: "center",
      render: (text) => <span>{parseDate(text)}</span>,
    },
    {
      title: t("report.assetMaintenanceReport.columns.year_of_manufacturing"),
      dataIndex: "yearOfManufacturing",
      key: "yearOfManufacturing",
      width: 100,
      defaultVisible: false,
      align: "center",
    },
    {
      title: t("report.assetMaintenanceReport.columns.configured_count"),
      dataIndex: ["counts", "configuredCount"],
      key: "configuredCount",
      align: "right",
      width: 100,
    },
    {
      title: t("report.assetMaintenanceReport.columns.created_count"),
      dataIndex: ["counts", "createdCount"],
      key: "createdCount",
      align: "right",
      width: 100,
    },
    {
      title: t("report.assetMaintenanceReport.columns.assigned_count"),
      dataIndex: ["counts", "assignedCount"],
      key: "assignedCount",
      align: "right",
      width: 100,
    },
  ];

  const columns2 = [
    {
      title: t("report.assetMaintenanceReport.summary_headers.customer"),
      dataIndex: "customerCount",
      key: "customer",
      align: "center",
    },
    {
      title: t("report.assetMaintenanceReport.summary_headers.building"),
      dataIndex: "buildingCount",
      key: "building",
      align: "center",
    },
    {
      title: t("report.assetMaintenanceReport.summary_headers.floor"),
      dataIndex: "floorCount",
      key: "floor",
      align: "center",
    },
    {
      title: t("report.assetMaintenanceReport.summary_headers.department"),
      dataIndex: "departmentCount",
      key: "department",
      align: "center",
    },
    {
      title: t("report.assetMaintenanceReport.summary_headers.configured"),
      dataIndex: "totalConfigured",
      key: "configured",
      align: "center",
    },
    {
      title: t("report.assetMaintenanceReport.summary_headers.created"),
      dataIndex: "totalCreated",
      key: "initiated",
      align: "center",
    },
    {
      title: t("report.assetMaintenanceReport.summary_headers.assigned"),
      dataIndex: "totalAssigned",
      key: "assigned",
      align: "center",
    },
  ];

  const firstDayOfMonth = dayjs().startOf("month");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState([
    ...columns
      .filter((c) => c.disabled || c.defaultVisible !== false)
      .map((c) => c.key),
  ]);
  const [tempKeys, setTempKeys] = useState(selectedKeys);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetStyle, setAssetStyle] = useState(null);
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetModels, setAssetModels] = useState([]);
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    setHeaderTitle(t("report.assetMaintenanceReport.title"));
    initData();
  }, []);

  useEffect(() => {
    if (
      isOpenSearchAdvanced &&
      floors.length === 0 &&
      departments.length === 0 &&
      buildings.length === 0
    ) {
      SearchAdvanced();
    }
  }, [isOpenSearchAdvanced]);

  useEffect(() => {
    getSpareMovementReport();
  }, [page, searchParams, pagination]);

  useEffect(() => {
    if (totalRecord > 0) {
      getTotal();
    }
  }, [searchParams, totalRecord]);

  const onChangePagination = (value) => {
    setPage(value);
    setPagination((prev) => ({ ...prev, page: value }));
  };

  const handleApply = () => {
    setSelectedKeys(tempKeys);
  };

  const handleCancel = () => {
    setTempKeys(selectedKeys);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    searchForm.setFieldsValue({ startDate: firstDayOfMonth });
    setSearchParams({
      ...searchForm.getFieldsValue(),
      startDate: firstDayOfMonth,
    });
    setPage(1);
  };

  const initData = async () => {
    const customersRes = await _unitOfWork.customer.getAllCustomer();
    if (customersRes?.data) {
      setCustomers(customersRes.data);
    }
  };

  const SearchAdvanced = async () => {
    const buildingsRes = await _unitOfWork.building.getAllBuilding();
    if (buildingsRes?.data) {
      setBuildings(buildingsRes.data);
    }
    const floorsRes = await _unitOfWork.floor.getAllFloor();
    if (floorsRes?.data) {
      setFloors(floorsRes.data);
    }
    const departmentsRes = await _unitOfWork.department.getAllDepartment();
    if (departmentsRes?.data) {
      setDepartments(departmentsRes.data);
    }
    const manufacturersRes =
      await _unitOfWork.manufacturer.getAllManufacturer();
    if (manufacturersRes?.data) {
      setManufacturers(manufacturersRes.data);
    }
    const assetsRes = await _unitOfWork.asset.getAllAsset();
    if (assetsRes?.data) {
      setAssets(assetsRes.data);
    }
    const assetModelsRes = await _unitOfWork.assetModel.getAllAssetModel();
    if (assetModelsRes?.data) {
      setAssetModels(assetModelsRes.data);
    }
    const assetMaintenancesRes =
      await _unitOfWork.assetMaintenance.getAllAssetMaintenance();
    if (assetMaintenancesRes?.data) {
      setAssetMaintenances(assetMaintenancesRes.data);
    }
    const categoryRes = await _unitOfWork.category.getListCategories();
    if (categoryRes) {
      setCategories(categoryRes?.results?.results);
    }
  };

  const onSearch = (values) => {
    setSearchParams({
      ...values,
      startDate: values.startDate,
      endDate: values.endDate,
    });
    setPage(1);
  };

  const getSpareMovementReport = async () => {
    const payload = {
      page: page,
      limit: pagination.limit,
      ...searchParams,
    };
    const res = await _unitOfWork.report.getAssetMaintenanceReport(payload);
    if (res && res.code === 1) {
      setData(res.results);
      setTotalRecord(res.totalResults);
    }
  };

  const getTotal = async () => {
    const payload = {
      page: page,
      limit: pagination.limit,
      ...searchParams,
    };
    const summaryRes = await _unitOfWork.report.getAssetMaintenanceReport({
      ...payload,
      limit: totalRecord,
    });
    if (summaryRes && summaryRes.code == 1) {
      setSummary(summaryRes.summary);
    }
  };

  const menu = (
    <div
      style={{
        width: 220,
        padding: 8,
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        borderRadius: 4,
      }}
    >
      <div
        style={{
          maxHeight: 180,
          overflowY: "auto",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          padding: "8px 0",
          marginBottom: 8,
        }}
      >
        <Checkbox.Group
          value={tempKeys}
          onChange={setTempKeys}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          {columns.map((c) => (
            <Checkbox key={c.key} value={c.key} disabled={c.disabled}>
              {c.title}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <div style={{ textAlign: "right" }}>
        <Button size="small" onClick={handleCancel} style={{ marginRight: 8 }}>
          {t("report.assetMaintenanceReport.column_selector.cancel")}
        </Button>
        <Button size="small" type="primary" onClick={handleApply}>
          {t("report.assetMaintenanceReport.column_selector.apply")}
        </Button>
      </div>
    </div>
  );

  const filteredColumns = columns.filter((c) => selectedKeys.includes(c.key));

  const getValueByDataIndex = (row, dataIndex) => {
    if (Array.isArray(dataIndex)) {
      return dataIndex.reduce((acc, key) => acc?.[key], row);
    }
    return row?.[dataIndex];
  };

  const transformExportData = (data, selectedCols) => {
    return data.map((row, index) => {
      const obj = {};
      selectedCols.forEach((col) => {
        let value;

        if (col.render) {
          const cellValue = getValueByDataIndex(row, col.dataIndex);
          value = col.render(cellValue, row, index);
          if (typeof value === "object" && value?.props?.children) {
            value = value.props.children;
          }
        } else {
          value = getValueByDataIndex(row, col.dataIndex);
        }

        obj[col.title] = value ?? "";
      });
      return obj;
    });
  };

  const exportToExcel = async () => {
    const dataExport = await _unitOfWork.report.getAssetMaintenanceReport({
      ...searchParams,
      limit: totalRecord,
    });
    const exportData = transformExportData(
      dataExport?.results,
      filteredColumns,
    );

    const ws = utils.json_to_sheet(exportData);
    const colWidths = Object.keys(exportData[0] || {}).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) => (row[key] ? row[key].toString().length : 0)),
      );
      return { wch: maxLength + 2 };
    });

    ws["!cols"] = colWidths;

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "data");
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const timestamp = new Date().getTime();
    FileSaver.saveAs(blob, `asset_report_${timestamp}.xlsx`);
  };

  const normalizeData = (rawData, columns) => {
    return rawData.map((item, index) => {
      const obj = {};
      obj["stt"] = index + 1;
      columns.forEach((col) => {
        if (col.dataIndex === "stt") return;
        obj[col.dataIndex] = item[col.title] ?? "";
      });
      return obj;
    });
  };

  const onClickPDFExport = async () => {
    try {
      const dataExport = await _unitOfWork.report.getAssetMaintenanceReport({
        ...searchParams,
        limit: totalRecord,
      });
      const transform = transformExportData(
        dataExport?.results,
        filteredColumns,
      );
      const startDate = searchParams?.startDate
        ? dayjs(searchParams.startDate).format("DD/MM/YYYY")
        : "";
      const endDate = searchParams?.endDate
        ? dayjs(searchParams.endDate).format("DD/MM/YYYY")
        : "";

      const exportData = normalizeData(transform, filteredColumns);
      const blob = await pdf(
        <ExportPdf
          data={exportData}
          columns={filteredColumns}
          summary={dataExport?.summary}
        />,
      ).toBlob();
      const timestamp = new Date().getTime();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AssetMaintenanceReport_${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export PDF error:", err);
    }
  };

  return (
    <Card>
      <Form
        labelWrap
        className="search-form report-filter-row"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              label={t("report.common.labels.asset_type")}
              labelAlign="left"
              name="assetStyle"
            >
              <Select
                allowClear
                placeholder={t("report.common.placeholders.choose_asset_type")}
                onChange={(value) => {
                  setAssetStyle(value);
                }}
              >
                <Option value="1">Máy móc / Thiết bị</Option>
                <Option value="2">Thiết bị đo lường</Option>
                <Option value="3">Thiết bị phụ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("report.common.labels.customer_name")}
              labelAlign="left"
              name="customer"
            >
              <Select
                allowClear
                placeholder={t("report.common.placeholders.choose_customer")}
                showSearch
                options={customers?.map((item) => ({
                  value: item._id,
                  label: item.customerName,
                }))}
                mode="multiple"
                dropdownStyle={dropdownRender}
                filterOption={filterOption}
              ></Select>
            </Form.Item>
          </Col>

          {isOpenSearchAdvanced && (
            <>
              <Col span={6}>
                <Form.Item
                  label={t("report.common.labels.building")}
                  name="building"
                >
                  <Select
                    allowClear
                    placeholder={t(
                      "report.common.placeholders.choose_building",
                    )}
                    showSearch
                    options={buildings?.map((item) => ({
                      value: item.id,
                      label: item.buildingName,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label={t("report.common.labels.floor")} name="floor">
                  <Select
                    allowClear
                    placeholder={t("report.common.placeholders.choose_floor")}
                    showSearch
                    options={floors?.map((item) => ({
                      value: item.id,
                      label: item.floorName,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label={t("report.common.labels.department")}
                  name="department"
                >
                  <Select
                    allowClear
                    placeholder={t(
                      "report.common.placeholders.choose_department",
                    )}
                    showSearch
                    options={departments?.map((item) => ({
                      value: item.id,
                      label: item.departmentName,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label={t("report.common.labels.category")}
                  name="category"
                >
                  <Select
                    allowClear
                    placeholder={t(
                      "report.common.placeholders.choose_category",
                    )}
                    showSearch
                    options={categories?.map((item) => ({
                      value: item.id,
                      label: item.categoryName,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>

              {assetStyle != 3 && (
                <Col span={6}>
                  <Form.Item
                    label={t("report.common.labels.manufacturer")}
                    name="manufacturer"
                  >
                    <Select
                      allowClear
                      placeholder={t(
                        "report.common.placeholders.choose_manufacturer",
                      )}
                      showSearch
                      options={manufacturers?.map((item) => ({
                        value: item.id,
                        label: `${item.manufacturerName}  ${item.origin ? " - " + item?.origin?.originName : ""}`,
                      }))}
                      mode="multiple"
                      dropdownStyle={dropdownRender}
                      filterOption={filterOption}
                    ></Select>
                  </Form.Item>
                </Col>
              )}

              <Col span={6}>
                <Form.Item
                  label={t("report.common.labels.asset_name")}
                  name="asset"
                >
                  <Select
                    allowClear
                    placeholder={t(
                      "report.common.placeholders.choose_asset_name",
                    )}
                    showSearch
                    options={assets?.map((item) => ({
                      value: item.id,
                      label: item.assetName,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label={t("report.common.labels.asset_model")}
                  name="assetModel"
                >
                  <Select
                    allowClear
                    placeholder={t(
                      "report.common.placeholders.choose_asset_model",
                    )}
                    showSearch
                    options={assetModels?.map((item) => ({
                      value: item.id,
                      label: item.assetModelName,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label={t("report.common.labels.asset_id")}
                  name="assetMaintenance"
                >
                  <Select
                    allowClear
                    placeholder={t(
                      "report.common.placeholders.choose_asset_id",
                    )}
                    showSearch
                    options={assetMaintenances?.map((item) => ({
                      value: item.id,
                      label: item.serial,
                    }))}
                    mode="multiple"
                    dropdownStyle={dropdownRender}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("report.common.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("report.common.buttons.reset")}
            </Button>
            <Button
              className="bt-green mr-2"
              onClick={() => setIsOpenSearchAdvanced(!isOpenSearchAdvanced)}
            >
              <PlusCircleFilled />
              {t("report.common.buttons.advanced_search")}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Tooltip title={t("report.common.misc.add_column")}>
              <Dropdown overlay={menu} trigger={["click"]} type="primary">
                <Button className="button mr-2">
                  <MenuOutlined />
                </Button>
              </Dropdown>
            </Tooltip>

            <Tooltip title={t("report.common.buttons.export_excel")}>
              <Button className="button mr-2" onClick={() => exportToExcel()}>
                <FileExcelOutlined />
              </Button>
            </Tooltip>

            <Tooltip title={t("report.common.buttons.export_pdf")}>
              <Button
                className="button"
                onClick={() => {
                  onClickPDFExport();
                }}
              >
                <FilePdfOutlined />
              </Button>
            </Tooltip>
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>{t("report.common.table.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col span={24}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontWeight: 600,
                border: "1px solid #bdbdbd",
              }}
            >
              <thead>
                <tr style={{ background: "#19a7b7", color: "#fff" }}>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t(
                      "report.assetMaintenanceReport.summary_headers.customer",
                    )}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t(
                      "report.assetMaintenanceReport.summary_headers.building",
                    )}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.assetMaintenanceReport.summary_headers.floor")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t(
                      "report.assetMaintenanceReport.summary_headers.department",
                    )}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t(
                      "report.assetMaintenanceReport.summary_headers.configured",
                    )}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.assetMaintenanceReport.summary_headers.created")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t(
                      "report.assetMaintenanceReport.summary_headers.assigned",
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    background: "#ccc",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {summary?.customerCount || 0}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {summary?.buildingCount || 0}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {summary?.floorCount || 0}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {summary?.departmentCount || 0}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {summary?.totalConfigured || 0}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {summary?.totalCreated || 0}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {summary?.totalAssigned || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Table
          columns={filteredColumns}
          bordered
          scroll={{ x: "max-content" }}
          dataSource={data}
          pagination={false}
        ></Table>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            justifyContent: "flex-end",
            marginTop: 3,
          }}
        >
          <span>{t("report.common.table.records")}</span>
          <Select
            value={pagination.limit}
            onChange={(value) => {
              setPagination((prev) => ({
                ...prev,
                limit: value,
                page: 1,
              }));
              setPage(1);
            }}
            style={{ width: 80 }}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
            <Option value={100}>100</Option>
          </Select>
          <Pagination
            className="pagination-table"
            onChange={onChangePagination}
            pageSize={pagination.limit}
            total={totalRecord}
            current={page}
          />
        </div>
      </Form>
    </Card>
  );
}
