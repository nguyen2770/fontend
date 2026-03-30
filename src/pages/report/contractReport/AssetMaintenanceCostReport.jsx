import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Select,
  Space,
  Typography,
  Layout,
  Form,
  DatePicker,
  Tooltip,
  Button,
  Pagination,
} from "antd";
import { ArrowUpOutlined, FilterOutlined, PrinterOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import useHeader from "../../../contexts/headerContext";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { FORMAT_DATE, PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { parseDate } from "../../../helper/date-helper";
import { exportToExcel, transformColumnsForExcel } from "../exportToExcel/exportData";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../helper/check-search-value";

const { Content } = Layout;
const { Text } = Typography;

const AssetMaintenanceCostReport = () => {
  const { setHeaderTitle } = useHeader();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [sortBy, setSortBy] = useState('amcNo');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const [amcs, setAmcs] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [amcInUse, setAmcInUse] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const [breakdownArises, setBreakdownArises] = useState(0);
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalSchedulePreventive, setTotalSchedulePreventive] = useState(0);

  useEffect(() => {
    setHeaderTitle(t("Báo cáo chi phí bảo trì tài sản"));
  }, [setHeaderTitle, t]);

  useEffect(() => {
    if (page > 1) {
      fetchGetReport(page, searchFilter);
    } else { fetchGetReport(1, searchFilter); }
  }, [page]);
  const fetchGetReport = async (_page, searchValue) => {
    const payload = {
      page: _page || page,
      limit: 10,
      sortBy: sortBy,
      sortOrder: sortOrder,
      ...form.getFieldValue(),
      ...cleanEmptyValues(searchValue || {}),
    }
    const res = await _unitOfWork.assetMaintenanceCostReport.getReport(payload);
    if (res && res.code === 1) {
      const data = res?.results;
      setAmcs(data?.amcs || []);
      setTotalRecord(data?.totalResults);
      // setTotalAsset(data?.parameter?.totalAsset);
      setTotalCost(data?.parameter?.totalCost);
      setBreakdownArises(data?.parameter?.totalBreakdown);
      setTotalSchedulePreventive(data?.parameter?.totalSchedulePreventive);
      setPercentComplete((data?.parameter?.totalSchedulePreventiveCompleted / data?.parameter?.totalSchedulePreventive * 100) || 0)
    }
  }
  const resetSearch = () => {
    form.resetFields();
    if (page !== 1)
      setPage(1);
    else
      fetchGetReport();
  }
  const onFinish = () => {
    if (page !== 1)
      setPage(1);
    else
      fetchGetReport();
  }
  const onChangePagination = (value) => {
    setPage(value);
  };
  const handleExportExcel = async () => {
    const value = form.getFieldsValue();
    try {
      const payload = {
        page: 1,
        limit: totalRecord,
        startDate: value.startDate,
        endDate: value.endDate,
        // ...formValues,
        // ...cleanEmptyValues(searchFilter),
      };
      const res = await _unitOfWork.assetMaintenanceCostReport.getReport(payload);
      const list = res?.results?.amcs || [];

      const processedData = prepareDataForExcel(list, t);
      const excelCols = [
        { header: t("customer.export.index"), key: "stt" },
        ...transformColumnsForExcel(columns),
      ];
      exportToExcel(processedData, excelCols, "BaoCao.xlsx", t);
    } catch (error) {
      console.error("Lỗi xuất Excel: ", error);
    }
  };
  const prepareDataForExcel = (list, t) => {
    return list.map(item => ({
      ...item,
      effectiveDate: parseDate(item?.effectiveDate),
    }));
  }
  const columns = [
    {
      title: t("assetMaintenanceCostReport.table.amcNo"),
      dataIndex: "amcNo",
    },
    {
      title: t("assetMaintenanceCostReport.table.service_contractor"),
      dataIndex: ["serviceContractor", "serviceContractorName"],
    },
    {
      title: t("assetMaintenanceCostReport.table.effective_date"),
      dataIndex: "effectiveDate",
      align: "center",
      render: (text) => parseDate(text)
    },
    {
      title: t("assetMaintenanceCostReport.table.amc_cost"),
      dataIndex: "amcCost",
      align: "right",
      render: (text) => (
        <b style={{ color: "#1890ff" }}>{text.toLocaleString()}</b>
      ),
    },
    {
      title: t("assetMaintenanceCostReport.table.amount_of_asset"),
      dataIndex: "noOfAsset",
      align: "right",
    },
    {
      title: t("assetMaintenanceCostReport.table.amount_of_maintenance"),
      dataIndex: "maintenanceCount",
      align: "right",
    },
    {
      title: t("assetMaintenanceCostReport.table.number_of_incidents"),
      dataIndex: "breakdownCount",
      align: "right",
    },
  ];
  const fieldsConfig = [
    {
      name: "fullName",
      labelKey: "report.engineerBreakdown.columns.user",
      placeholderKey: "report.engineerBreakdown.columns.user",
      component: "Input",
    },
    {
      name: "code",
      labelKey: "report.processingBreakdown.detail_columns.code",
      placeholderKey: "report.processingBreakdown.detail_columns.code",
      component: "Input",
    },
    {
      name: "status",
      labelKey: "report.processingBreakdown.detail_columns.status",
      placeholderKey: "report.processingBreakdown.detail_columns.status",
      component: "Select",
      options: "breakdownStatus"
    },
  ];
  return (
    <div className="asset-report-container">
      <Content className="report-content">
        <Form form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="startDate"
                label={t("report.common.labels.from_date")}
              >
                <DatePicker
                  placeholder={t("report.common.placeholders.choose_from_date")}
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="endDate"
                label={t("report.common.labels.to_date")}
              >
                <DatePicker
                  placeholder={t("report.common.placeholders.choose_to_date")}
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
            // style={{ textAlign: "end", fontSize: 18, fontWeight: 600 }}
            >
              <Button
                type="primary"
                icon={<SearchOutlined />}
                className="mr-2"
                htmlType="submit"
              >
                {t("report.common.buttons.search")}
              </Button>
              <Button className="bt-green mr-2" onClick={resetSearch}>
                <RedoOutlined />
                {t("purchase.buttons.reset")}
              </Button>
              <Button
                title={t("report.common.misc.export")}
                className="mr-2"
                onClick={() => handleExportExcel()}
              >
                <PrinterOutlined />
              </Button>
              <Button
                title={t("report.common.misc.advanced_search")}
                className="mr-2"
                onClick={() => setIsOpenSearchAdvanced(true)}
              >
                <FilterOutlined />
              </Button>
            </Col>
            <Col
              span={16}
              style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
            >
            </Col>
          </Row>
        </Form>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="white-card">
              <Statistic
                title={<Text className="stat-title">{t("assetMaintenanceCostReport.stat_title.total_cost_maintenance")}</Text>}
                value={totalCost}
                valueStyle={{ color: "#1f1f1f", fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="white-card">
              <Statistic
                title={<Text className="stat-title">{t("assetMaintenanceCostReport.stat_title.percent_complete")}</Text>}
                value={percentComplete.toFixed(2)}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="white-card">
              <Statistic
                title={<Text className="stat-title">{t("assetMaintenanceCostReport.stat_title.amount_of_maintenance")}</Text>}
                value={totalSchedulePreventive}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="white-card">
              <Statistic
                title={<Text className="stat-title">{t("assetMaintenanceCostReport.stat_title.incidents")}</Text>}
                value={breakdownArises}
              />
            </Card>
          </Col>
          {/* <Col xs={24} sm={12} lg={6}>
            <Card className="white-card">
              <Statistic
                title={<Text className="stat-title">TỔNG TÀI SẢN</Text>}
                value={totalAsset}
              />
            </Card>
          </Col> */}
        </Row>

        <Card title="CHI TIẾT HỢP ĐỒNG BẢO TRÌ" className="white-card" extra={<span>{`Tổng số: ${totalRecord}`}</span>}>
          <Table
            rowKey="_id"
            key="_id"
            dataSource={amcs}
            columns={columns}
            bordered
            className="custom-table"
            pagination={false}
          />
          <Pagination
            className="pagination-table mt-2 pb-3"
            onChange={onChangePagination}
            pageSize={pagination.limit}
            total={totalRecord}
            current={page}
          />
        </Card>
      </Content>
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        ref={drawerRef}
        onCallBack={(value) => {
          // searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetReport(1, value);
          }
        }}
        onClose={() => { setIsOpenSearchAdvanced(false) }}
        fieldsConfig={fieldsConfig}
      />
    </div>
  );
};

export default AssetMaintenanceCostReport;
