import React, { useEffect, useRef, useState } from "react";
import useHeader from "../../../contexts/headerContext";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Pagination,
  Row,
  Table,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeFilled,
  FilePdfOutlined,
  FilterOutlined,
  MenuOutlined,
  PieChartOutlined,
  PrinterOutlined,
  RedoOutlined,
  SearchOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import {
  assetType,
  breakdownStatus,
  FORMAT_DATE,
  jobSummaryStatus,
  jobSummaryType,
  PAGINATION,
  priorityLevelStatus,
  reportView,
  schedulePreventiveStatus,
  typeReportAssetMaintenanceResquest,
} from "../../../utils/constant";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import ShowError from "../../../components/modal/result/errorNotification";
import { formatMillisToHHMMSS, parseDate } from "../../../helper/date-helper";
import { parseToLabel } from "../../../helper/parse-helper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import {
  exportToExcel,
  transformColumnsForExcel,
} from "../exportToExcel/exportData";
import { LabelValue } from "../../../helper/label-value";
import "./index.scss";
import { staticPath } from "../../../router/routerConfig";
const ReportAssetMaintenanceRequest = () => {
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeader();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [datas, setDatas] = useState([]);
  const navigate = useNavigate();
  const [totalBreakdown, setTotalBreakdown] = useState(null);
  const [totalSchedulePreventive, setTotalSchedulePreventive] = useState(null);
  const [totalCalibration, setTotalCalibration] = useState(null);
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  useEffect(() => {
    setHeaderTitle(t("report.maintenanceRequest.title"));
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchAssetMaintenanceRequests(page, searchFilter);
    } else {
      fetchAssetMaintenanceRequests(1, searchFilter);
    }
  }, [page]);

  const fetchAssetMaintenanceRequests = async (_page, searchValue) => {
    let filterValue = cleanEmptyValues(searchValue || {});
    const value = form.getFieldsValue();
    if (value.startDate === null || value.endDate === null) {
      return ShowError(
        "topRight",
        t("common.notifications"),
        t("common.messages.fill_in_complete_date"),
      );
    }
    let res =
      await _unitOfWork.reportAssetMaintenanceRequest.getReportAssetMaintenanceRequest(
        {
          page: _page || page,
          limit: PAGINATION.limit,
          startDate: value.startDate,
          endDate: value.endDate,
          ...filterValue,
        },
      );
    if (res && res.code === 1) {
      setDatas(res?.data);
      setTotalRecord(res?.totalResults);
      setTotalBreakdown(res?.totalBreakdown);
      setTotalSchedulePreventive(res?.totalSchedulePreventive);
      setTotalCalibration(res?.totalCalibrationWork);
    }
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    setPage(1);
    fetchAssetMaintenanceRequests(1);
  };
  const onFinish = async () => {
    setPage(1);
    fetchAssetMaintenanceRequests(1, searchFilter);
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const handleExportExcel = async () => {
    const value = form.getFieldsValue();
    if (value.startDate === null || value.endDate === null) {
      return ShowError(
        "topRight",
        t("common.notifications"),
        t("common.messages.fill_in_complete_date"),
      );
    }
    try {
      const payload = {
        page: 1,
        limit: totalRecord,
        startDate: value.startDate,
        endDate: value.endDate,
        ...cleanEmptyValues(searchFilter),
      };
      const res =
        await _unitOfWork.reportAssetMaintenanceRequest.getReportAssetMaintenanceRequest(
          payload,
        );
      const list = res?.data;

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
    return list.map((item) => {
      const priorityPreventiveName =
        item.type === typeReportAssetMaintenanceResquest.schedulePreventive
          ? item?.preventive?.preventiveName || "-"
          : t(
              parseToLabel(priorityLevelStatus.Options, item?.priorityLevel) ||
                "-",
            );
      const statusLabel =
        item.type === typeReportAssetMaintenanceResquest.schedulePreventive
          ? schedulePreventiveStatus.Options
          : breakdownStatus.Option;
      return {
        ...item,
        type: t(
          parseToLabel(typeReportAssetMaintenanceResquest.Options, item?.type),
        ),
        ["priority-preventiveName"]: priorityPreventiveName,
        status: t(parseToLabel(statusLabel, item?.status)),
      };
    });
  };
  const onClicView = (value) => {
    if (value.type === jobSummaryType.BREAKDOWN) {
      navigate(
        staticPath.viewWorkOrderBreakdown + "/" + (value.id || value._id),
      );
    } else if (value.type === jobSummaryType.SCHEDULE_PREVENTIVE) {
      navigate(
        staticPath.viewSchedulePreventive + "/" + (value.id || value._id),
      );
    } else {
      navigate(staticPath.calibrationTaskView + "/" + (value.id || value._id));
    }
  };
  const onClickPdfExport = async (record) => {};
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
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "assetMaintenance",
      render: (text) => (
        <div>
          <LabelValue
            label={t("breakdown.list.columns.asset_type")}
            value={t(parseToLabel(assetType.Options, text?.assetStyle))}
          />
          <LabelValue
            label={t("breakdown.list.columns.asset_name")}
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
                {text?.assetModel?.asset?.assetName}
              </span>
            }
          />
          <LabelValue
            label={t("breakdown.list.columns.model")}
            value={text?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("breakdown.list.columns.serial")}
            value={text?.serial}
          />
          <LabelValue
            label={t("assetMaintenance.asset_number")}
            value={text?.assetNumber}
          />
        </div>
      ),
    },
    {
      title: t("report.maintenanceRequest.columns.code"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("report.maintenanceRequest.columns.type"),
      dataIndex: "type",
      key: "type",
      render: (text) => t(parseToLabel(jobSummaryType.Options, text)),
    },
    {
      title: t("report.maintenanceRequest.columns.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = jobSummaryStatus.Options.find(
          (opt) => opt.value === status,
        );
        const label = option ? t(option.label) : status;
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
      title: t("report.maintenanceRequest.columns.work_order_date"),
      dataIndex: "startDate",
      align: "center",
      render: (_, record) => parseDate(record.startDate || record.createdAt),
    },
    {
      title: t("report.maintenanceRequest.columns.closing_date"),
      dataIndex: "closingDate",
      align: "center",
      render: (text) => parseDate(text),
    },
    {
      title: t("breakdown.list.columns.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <Tooltip title={t("breakdown.list.tooltips.view")}>
              <Button
                icon={<EyeFilled />}
                size="small"
                className="ml-2"
                onClick={() => onClicView(record)}
              />
            </Tooltip>
            <Tooltip title={t("report.common.buttons.export_pdf")}>
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                size="small"
                className="ml-2"
                onClick={() => onClickPdfExport(record)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const fieldsConfig = [
    {
      name: "code",
      labelKey: "report.maintenanceRequest.columns.code",
      placeholderKey: "report.maintenanceRequest.columns.code",
      component: "Input",
    },
    {
      name: "type",
      labelKey: "report.maintenanceRequest.columns.type",
      placeholderKey: "report.maintenanceRequest.columns.type",
      component: "Select",
      options: jobSummaryType.Options,
    },
    {
      name: "status",
      labelKey: "report.maintenanceRequest.columns.status",
      placeholderKey: "report.maintenanceRequest.columns.status",
      component: "Select",
      options: jobSummaryStatus.Options,
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
            <Form.Item name="endDate" label={t("report.common.labels.to_date")}>
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
            style={{ textAlign: "end", fontSize: 18, fontWeight: 600 }}
          >
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
          </Col>
          <Col
            span={16}
            style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
          >
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className="ml-2"
              htmlType="submit"
            >
              {t("report.common.buttons.search")}{" "}
            </Button>
            <Button className="bt-green ml-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("purchase.buttons.reset")}
            </Button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={24}>
            <Row gutter={16} className="summary-cards">
              <Col span={6}>
                <div className="summary-card blue">
                  <div className="summary-icon">🕒</div>
                  <div className="summary-title">
                    {t("report.maintenanceRequest.summary_card.est_total")}
                  </div>
                  <div className="summary-value">{totalRecord || 0}</div>
                </div>
              </Col>

              <Col span={6}>
                <div className="summary-card green">
                  <div className="summary-icon">🛠</div>
                  <div className="summary-title">
                    {t("report.maintenanceRequest.summary_card.total_jobs")}
                  </div>
                  <div className="summary-value">
                    {totalSchedulePreventive || 0}
                  </div>
                </div>
              </Col>

              <Col span={6}>
                <div className="summary-card red">
                  <div className="summary-icon">⚠️</div>
                  <div className="summary-title">
                    {t(
                      "report.maintenanceRequest.summary_card.total_breakdowns",
                    )}
                  </div>
                  <div className="summary-value">{totalBreakdown || 0}</div>
                </div>
              </Col>

              <Col span={6}>
                <div className="summary-card yellow">
                  <div className="summary-icon">⏱</div>
                  <div className="summary-title">
                    {t(
                      "report.maintenanceRequest.summary_card.total_calibrations",
                    )}
                  </div>
                  <div className="summary-value">{totalCalibration || 0}</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={24}>
            <Table
              rowKey="id"
              columns={columns}
              key="id"
              dataSource={datas}
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
        </Row>
        <DrawerSearch
          isOpen={isOpenSearchAdvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            // searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchAssetMaintenanceRequests(1, value);
            }
          }}
          onClose={() => {
            setIsOpenSearchAdvanced(false);
          }}
          fieldsConfig={fieldsConfig}
        />
      </Form>
    </Card>
  );
};

export default ReportAssetMaintenanceRequest;
