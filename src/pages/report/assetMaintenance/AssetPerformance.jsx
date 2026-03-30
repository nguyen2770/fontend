import React, { useEffect, useRef, useState } from "react";
import useHeader from "../../../contexts/headerContext";
import {
  breakdownUserStatus,
  FORMAT_DATE,
  PAGINATION,
  reportView,
} from "../../../utils/constant";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import ShowError from "../../../components/modal/result/errorNotification";
import {
  formatMillisToHHMM,
  formatMillisToHHMMSS,
  parseDate,
  parseDateHH,
} from "../../../helper/date-helper";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { render } from "@testing-library/react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Pagination,
  Radio,
  Row,
  Table,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  FilterOutlined,
  MenuOutlined,
  PrinterOutlined,
  RedoOutlined,
  SearchOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { exportToExcel, transformColumnsForExcel } from "../exportToExcel/exportData";
import { pdf } from "@react-pdf/renderer";
import PdfAssetPerformanceSummary from "./PdfAssetPerformanceSummary";
import PdfAssetPerformanceDetail from "./PdfAssetPerformanceDetail";

const AssetPerformance = () => {
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeader();
  const [form] = Form.useForm();
  const [onChangeOption, setOnChangeOption] = useState(reportView.summary);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const navigate = useNavigate();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("report.assetPerformance.title"));
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchGetSchedulePreventives(page, searchFilter);
    } else {
      fetchGetSchedulePreventives(1, searchFilter);
    }
  }, [onChangeOption, page]);

  const fetchGetSchedulePreventives = async (_page, searchValue) => {
    let filterValue = cleanEmptyValues(searchValue || {});
    const value = form.getFieldsValue();
    if (value.startDate === null || value.endDate === null) {
      return ShowError(
        "topRight",
        t("common.notifications"),
        t("common.messages.fill_in_complete_date")
      );
    }
    if (onChangeOption === reportView.summary) {
      let res =
        await _unitOfWork.reportAssetMaintenance.getSummaryReportAssetPerformance(
          {
            page: _page || page,
            limit: PAGINATION.limit,
            startDate: value.startDate,
            endDate: value.endDate,
            ...filterValue,
          }
        );
      if (res && res.code === 1) {
        setAssetMaintenances(res?.assetMaintenanceSummarys);
        setTotalRecord(res?.totalResults);
      }
    } else {
      let res =
        await _unitOfWork.reportAssetMaintenance.getDetailsReportAssetPerformance(
          {
            page: _page || page,
            limit: PAGINATION.limit,
            startDate: value.startDate,
            endDate: value.endDate,
            ...filterValue,
          }
        );
      if (res && res.code === 1) {
        setAssetMaintenances(res?.assetMaintenances);
        setTotalRecord(res?.totalResults);
      }
    }
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current)
      drawerRef.current.resetForm();
    setPage(1);
    fetchGetSchedulePreventives(1);
  };
  const onFinish = async () => {
    setPage(1);
    fetchGetSchedulePreventives(1, searchFilter);
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const handleExportExcel = async () => {
    const value = form.getFieldsValue();
    if (value.startDate === null || value.endDate === null) {
      return ShowError('topRight', t("common.notifications"), t("common.messages.fill_in_complete_date"))
    }
    const isSummary = onChangeOption === reportView.summary;
    try {
      const payload = {
        page: 1,
        limit: totalRecord,
        startDate: value.startDate,
        endDate: value.endDate,
        ...cleanEmptyValues(searchFilter),
      };
      const res = isSummary
        ? await _unitOfWork.reportAssetMaintenance.getSummaryReportAssetPerformance(payload)
        : await _unitOfWork.reportAssetMaintenance.getDetailsReportAssetPerformance(payload);
      const list = res?.assetMaintenanceSummarys || res?.assetMaintenances;

      const processedData = prepareDataForExcel(list, isSummary, t);
      const excelCols = [
        { header: t("customer.export.index"), key: "stt" },
        ...transformColumnsForExcel(columns),
      ];
      exportToExcel(processedData, excelCols, "BaoCao.xlsx", t);
    } catch (error) {
      console.error("Lỗi xuất Excel: ", error);
    }
  };
  const prepareDataForExcel = (list, isSummary, t) => {
    return isSummary
      ? list.map(item => ({
        ...item,
        totalHoursAvailable: formatMillisToHHMMSS(item?.totalHoursAvailable),
        totalDowntimeCheckinCheckout: formatMillisToHHMM(item?.totalDowntimeCheckinCheckout),
        totalDowntime: formatMillisToHHMM(item?.totalDowntime),
        totalAvailability: item?.totalAvailability ? item.totalAvailability.toFixed(2) : "0.00",
        totalMTTR: formatMillisToHHMM(item?.totalMTTR),
        totalMTBF: formatMillisToHHMM(item?.totalMTBF),
      }))
      : list.map(item => ({
        ...item,
        installationDate: item?.installationDate ? parseDateHH(item?.installationDate) : parseDateHH(item?.createdAt),
        totalHoursAvailable: formatMillisToHHMMSS(item?.totalHoursAvailable),
        totalDowntimeCheckinCheckout: formatMillisToHHMM(item?.totalDowntimeCheckinCheckout),
        totalDowntime: formatMillisToHHMM(item?.totalDowntime),
        totalAvailability: item?.totalAvailability ? item.totalAvailability.toFixed(2) : "0.00",
        totalMTTR: formatMillisToHHMM(item?.totalMTTR),
        totalMTBF: formatMillisToHHMM(item?.totalMTBF),
      }));
  }
  const onClickPdfExport = async (values) => {
    try {
      const blob = onChangeOption === reportView.summary
        ? await pdf(
          <PdfAssetPerformanceSummary data={values} />
        ).toBlob()
        : await pdf(<PdfAssetPerformanceDetail data={values} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Export PDF error:", err);
    }
  };
  const columns = [
    {
      title: t("report.assetMaintenanceReport.columns.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    ...(onChangeOption === reportView.summary
      ? [
        {
          title: t("report.assetPerformance.columns_summary.customer"),
          dataIndex: "customer",
          key: "customer",
          excelKey: "customer.customerName",
          render: (text) => <span>{text?.customerName}</span>,
        },
        {
          title: t("report.assetPerformance.columns_summary.total_assets"),
          dataIndex: "totalAssetmaintenances",
          key: "totalAssetmaintenances",
        },
        {
          title: t("report.assetPerformance.columns_summary.hours_available"),
          dataIndex: "totalHoursAvailable",
          key: "totalHoursAvailable",
          render: (text) => formatMillisToHHMMSS(text),
        },
        {
          title: t(
            "report.assetPerformance.columns_summary.actual_project_hours"
          ),
          dataIndex: "totalDowntimeCheckinCheckout",
          key: "totalDowntimeCheckinCheckout",
          render: (text) => formatMillisToHHMM(text),
        },
        {
          title: t("report.assetPerformance.columns_summary.breakdowns"),
          dataIndex: "totalBreakdowns",
          key: "totalBreakdowns",
        },
        {
          title: t("report.assetPerformance.columns_summary.downtime_card"),
          dataIndex: "totalDowntime",
          key: "totalDowntime",
          render: (text) => formatMillisToHHMM(text),
        },
        {
          title: t("report.assetPerformance.columns_summary.availability"),
          dataIndex: "totalAvailability",
          align: "center",
          render: (value) => (value ? value.toFixed(2) : "0.00"),
        },
        {
          title: t("report.assetPerformance.columns_summary.mttr"),
          dataIndex: "totalMTTR",
          align: "center",
          render: (text) => formatMillisToHHMM(text),
        },
        {
          title: t("report.assetPerformance.columns_summary.mtbf"),
          dataIndex: "totalMTBF",
          align: "center",
          render: (text) => formatMillisToHHMM(text),
        },
      ]
      : []),
    ...(onChangeOption === reportView.details
      ? [
        {
          title: t("report.assetPerformance.columns_detail.asset_name"),
          dataIndex: "asset",
          key: "asset",
          excelKey: "asset.assetName",
          render: (text) => <span>{text?.assetName}</span>,
        },
        {
          title: t("report.assetPerformance.columns_detail.model"),
          dataIndex: "assetModel",
          key: "assetModel",
          excelKey: "assetModel.assetModelName",
          render: (text) => <span>{text?.assetModelName}</span>,
        },
        {
          title: t("report.assetPerformance.columns_detail.serial"),
          dataIndex: "serial",
          key: "serial",
        },
        {
          title: t("report.assetPerformance.columns_detail.asset_number"),
          dataIndex: "assetNumber",
          key: "assetNumber",
        },
        {
          title: t("report.assetPerformance.columns_detail.ref_date"),
          dataIndex: "installationDate",
          key: "installationDate",
          align: "center",
          render: (text, record) =>
            record?.installationDate
              ? parseDateHH(record?.installationDate)
              : parseDateHH(record?.createdAt),
        },
        {
          title: t("report.assetPerformance.columns_summary.hours_available"),
          dataIndex: "totalHoursAvailable",
          align: "center",
          render: (text) => formatMillisToHHMMSS(text),
        },
        {
          title: t(
            "report.assetPerformance.columns_summary.actual_project_hours"
          ),
          dataIndex: "totalDowntimeCheckinCheckout",
          align: "center",
          render: (text) => formatMillisToHHMM(text),
        },
        {
          title: t("report.assetPerformance.columns_summary.breakdowns"),
          dataIndex: "totalBreakdowns",
          align: "center",
        },
        {
          title: t("report.assetPerformance.columns_summary.downtime_card"),
          dataIndex: "totalDowntime",
          align: "center",
          render: (text) => formatMillisToHHMM(text),
        },
        {
          title: t("report.assetPerformance.columns_summary.availability"),
          dataIndex: "totalAvailability",
          align: "center",
          render: (value) => (value ? value.toFixed(2) : "0.00"),
        },
        {
          title: t("report.assetPerformance.columns_summary.mttr"),
          dataIndex: "totalMTTR",
          align: "center",
          render: (text) => formatMillisToHHMM(text),
        },
        {
          title: t("report.assetPerformance.columns_summary.mtbf"),
          dataIndex: "totalMTBF",
          align: "center",
          render: (text) => formatMillisToHHMM(text),
        },
      ]
      : []),
    {
      title: t("customer.table.action"),
      dataIndex: "action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div>
          <Tooltip title={t("report.common.buttons.export_pdf")}>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              size="small"
              onClick={() => onClickPdfExport(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  const fieldsConfig = onChangeOption === reportView.summary
    ? [
      {
        name: "customerName",
        labelKey: "report.assetPerformance.columns_summary.customer",
        placeholderKey: "report.assetPerformance.columns_summary.customer",
        component: "Input",
      },
    ] : [
      {
        name: "assetName",
        labelKey: "report.assetPerformance.columns_detail.asset_name",
        placeholderKey: "report.assetPerformance.columns_detail.asset_name",
        component: "Input",
      },
      {
        name: "assetModelName",
        labelKey: "report.assetPerformance.columns_detail.model",
        placeholderKey: "report.assetPerformance.columns_detail.model",
        component: "Input",
      },
      {
        name: "serial",
        labelKey: "report.assetPerformance.columns_detail.serial",
        placeholderKey: "report.assetPerformance.columns_detail.serial",
        component: "Input",
      },
      {
        name: "assetNumber",
        labelKey: "report.assetPerformance.columns_detail.asset_number",
        placeholderKey: "report.assetPerformance.columns_detail.asset_number",
        component: "Input",
      },
    ];
  return (
    <Card className="p-3">
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        initialValues={{
          startDate: dayjs().subtract(9, "day").startOf("day"),
          endDate: dayjs().endOf("day"),
        }}
        layout="vertical"
      >
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={6} style={{ textAlign: "end" }}>
                <Radio.Group
                  block
                  options={reportView.Options.map((opt) => ({
                    ...opt,
                    label: t(opt.label),
                  }))}
                  value={onChangeOption}
                  onChange={(e) => setOnChangeOption(e.target.value)}
                />
              </Col>
              <Col span={10}></Col>
              <Col
                span={8}
                style={{ textAlign: "start", fontSize: 18, fontWeight: 600 }}
              >
                {/* <Tooltip
                  title={t("report.common.misc.add_column")}
                  className="mr-4"
                >
                  <MenuOutlined />
                </Tooltip> */}
                <Tooltip
                  title={t("report.common.misc.export")}
                  className="mr-4"
                  onClick={() => handleExportExcel()}
                >
                  <PrinterOutlined />
                </Tooltip>
                <Tooltip
                  title={t("report.common.misc.advanced_search")}
                  className="mr-4"
                  onClick={() => setIsOpenSearchAdvanced(true)}
                >
                  <FilterOutlined />
                </Tooltip>
                {/* <Tooltip
                  title={t("report.common.misc.customize_report")}
                  className="mr-4"
                >
                  <SlidersOutlined />
                </Tooltip> */}
              </Col>
              <Col span={8}>
                <Form.Item
                  name="startDate"
                  label={t("report.common.labels.start_date")}
                >
                  <DatePicker
                    placeholder={t(
                      "report.common.placeholders.choose_from_date"
                    )}
                    format={FORMAT_DATE}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="endDate"
                  label={t("report.common.labels.end_date")}
                >
                  <DatePicker
                    placeholder={t("report.common.placeholders.choose_to_date")}
                    format={FORMAT_DATE}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8} className="mt-4">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  className=""
                  htmlType="submit"
                >
                  {t("report.common.buttons.search")}{" "}
                </Button>
                <Button
                  className="bt-green ml-2"
                  onClick={resetSearch}
                >
                  <RedoOutlined />
                  {t("purchase.buttons.reset")}
                </Button>
                {/* <Button
                  onClick={() => navigate(-1)}
                  className="ml-3"
                  icon={<ArrowLeftOutlined />}
                >
                  {t("report.common.buttons.back")}
                </Button> */}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col span={24}>
            <Table
              rowKey="id"
              columns={columns}
              key="id"
              dataSource={assetMaintenances}
              bordered
              pagination={false}
            />
            <Pagination
              className="pagination-table mt-2"
              onChange={onChangePagination}
              pageSize={PAGINATION.limit}
              total={totalRecord}
              current={page}
            />
          </Col>
          <DrawerSearch
            isOpen={isOpenSearchAdvanced}
            ref={drawerRef}
            onCallBack={(value) => {
              // searchForm.resetFields(["searchValue"]);
              setSearchFilter(value);
              if (!value.isClose) {
                setPage(1);
                fetchGetSchedulePreventives(1, value);
              }
            }}
            onClose={() => { setIsOpenSearchAdvanced(false) }}
            fieldsConfig={fieldsConfig}
          />
        </Row>
      </Form>
    </Card>
  );
};

export default AssetPerformance;
