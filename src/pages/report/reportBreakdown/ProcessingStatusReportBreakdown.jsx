import React, { useEffect, useRef, useState } from "react";
import useHeader from "../../../contexts/headerContext";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Pagination,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FilterOutlined,
  MenuOutlined,
  PrinterOutlined,
  RedoOutlined,
  SearchOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import {
  assetType,
  breakdownStatus,
  filterByProcessingBreakdown,
  FORMAT_DATE,
  PAGINATION,
  priorityLevelStatus,
  reportView,
} from "../../../utils/constant";
import dayjs from "dayjs";
import { Pie } from "@ant-design/plots";
import * as _unitOfWork from "../../../api";
import ShowError from "../../../components/modal/result/errorNotification";
import {
  formatMillisToHHMMSS,
  formatWorkingTime,
  parseDate,
} from "../../../helper/date-helper";
import { parseToLabel } from "../../../helper/parse-helper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { utils, write } from "xlsx";
import FileSaver from "file-saver";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import {
  exportToExcel,
  transformColumnsForExcel,
} from "../exportToExcel/exportData";
import PdfProcessingStatusReportBreakdown from "./PdfProcessingStatusReportBreakdown";
import { pdf } from "@react-pdf/renderer";
import { LabelValue } from "../../../helper/label-value";
import { staticPath } from "../../../router/routerConfig";
import useAuth from "../../../contexts/authContext";

const ProcessingStatusReportBreakdown = () => {
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeader();
  const [form] = Form.useForm();
  const [onChangeOption, setOnChangeOption] = useState(reportView.summary);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [breakdowns, setBreakdowns] = useState([]);
  const [activityBreakdowns, setActivityBreakdowns] = useState([]);
  const [dataConfig, setDataConfig] = useState([]);
  const navigate = useNavigate();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const filterBy = Form.useWatch("filterBy", form);
  const { user } = useAuth();

  useEffect(() => {
    setHeaderTitle(t("report.processingBreakdown.title"));
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchGetActivityBreakdown(page, searchFilter);
    } else {
      fetchGetActivityBreakdown(1, searchFilter);
    }
  }, [onChangeOption, page]);

  const fetchGetActivityBreakdown = async (_page, searchValue) => {
    let filterValue = cleanEmptyValues(searchValue || {});
    const value = form.getFieldsValue();
    if (value.startDate === null || value.endDate === null) {
      return ShowError(
        "topRight",
        t("common.notifications"),
        t("common.messages.fill_in_complete_date"),
      );
    }
    let res = await _unitOfWork.reportBreakdown.getActivityReportBreakdown({
      page: _page || page,
      limit: PAGINATION.limit,
      startDate: value.startDate,
      endDate: value.endDate,
      reportView: onChangeOption,
      ...filterValue,
      filterBy: value.filterBy,
    });
    if (res && res.code === 1) {
      setActivityBreakdowns(res?.data);
      setBreakdowns(res?.data?.breakdowns);
      setTotalRecord(res?.data?.totalResults);
      const data = res?.data;
      let _dataConfig = [];
      _dataConfig.push({
        item: t("report.processingBreakdown.table_headers.new"),
        percent: data?.totalBreakdownNews / data?.totalAllBreakdowns,
      });
      _dataConfig.push({
        item: t("report.processingBreakdown.table_headers.in_progress"),
        percent: data?.totalBreakdownInProgress / data?.totalAllBreakdowns,
      });
      _dataConfig.push({
        item: t("report.processingBreakdown.table_headers.completed"),
        percent: data?.totalBreakdownCompleted / data?.totalAllBreakdowns,
      });
      _dataConfig.push({
        item: t("report.processingBreakdown.table_headers.closed"),
        percent: data?.totalBreakdownClosed / data?.totalAllBreakdowns,
      });
      _dataConfig.push({
        item: t("report.processingBreakdown.table_headers.cancelled"),
        percent: data?.totalBreakdownCancelled / data?.totalAllBreakdowns,
      });
      setDataConfig(_dataConfig);
    }
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    setPage(1);
    fetchGetActivityBreakdown(1);
  };
  const onFinish = async () => {
    setPage(1);
    fetchGetActivityBreakdown(1, searchFilter);
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
    const isSummary = onChangeOption === reportView.summary;
    try {
      // const formValues = searchForm.getFieldsValue();
      const payload = {
        page: 1,
        limit: totalRecord,
        startDate: value.startDate,
        endDate: value.endDate,
        reportView: onChangeOption,
        // ...formValues,
        ...cleanEmptyValues(searchFilter),
        filterBy: value.filterBy,
      };
      const res =
        await _unitOfWork.reportBreakdown.getActivityReportBreakdown(payload);
      const list = res?.data?.breakdowns;
      // const dataExport = onChangeOption === reportView.summary
      //     ? prepareDataExportExcelSummary(list, t)
      //     : prepareDataExportExcelDetail(list, t);
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
      ? list.map((item) => ({
          ...item,
          _id: t(
            parseToLabel(priorityLevelStatus.Options, item?._id?.priorityLevel),
          ),
          downtime: formatMillisToHHMMSS(item?.downtime),
        }))
      : list.map((item) => ({
          ...item,
          createdAt: parseDate(item?.createdAt),
          priorityLevel: t(
            parseToLabel(priorityLevelStatus.Options, item?.priorityLevel),
          ),
          status: t(parseToLabel(breakdownStatus.Option, item?.status)),
          closingDate: parseDate(item?.closingDate),
          downtime: formatMillisToHHMMSS(item?.downtime?.time),
        }));
  };
  const config = {
    data: dataConfig,
    angleField: "percent",
    colorField: "item",
    radius: 0.8,
    height: 330,
    label: {
      position: "outside",
      text: (data) =>
        data.percent > 0
          ? `${data.item}: ${(data.percent * 100).toFixed(2)}%`
          : "",
    },
    tooltip: {
      items: [
        (data) => ({
          name: data.item,
          value: `${data.percent * 100}%`,
        }),
      ],
    },
  };
  const onClickPdfExport = async (values) => {
    try {
      const blob = await pdf(
        <PdfProcessingStatusReportBreakdown
          data={{ ...values, company: user.company }}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Export PDF error:", err);
    }
  };
  const detailColumns = [
    {
      title: t("report.processingBreakdown.detail_columns.code"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("report.processingBreakdown.detail_columns.opened_date"),
      dataIndex: "createdAt",
      align: "center",
      render: (text) => parseDate(text),
    },
    {
      title: t("report.processingBreakdown.detail_columns.opened_by"),
      dataIndex: "createdBy",
      key: "createdBy",
      excelKey: "createdBy.fullName",
      render: (text) => <span>{text?.fullName}</span>,
    },
    {
      title: t("report.processingBreakdown.detail_columns.priority"),
      dataIndex: "priorityLevel",
      key: "priorityLevel",
      render: (text) => t(parseToLabel(priorityLevelStatus.Options, text)),
    },
    {
      title: t("report.processingBreakdown.detail_columns.description"),
      dataIndex: "defectDescription",
      key: "defectDescription",
    },
    {
      title: t("report.processingBreakdown.detail_columns.status"),
      dataIndex: "status",
      key: "status",
      render: (text) => t(parseToLabel(breakdownStatus.Option, text)),
    },
    {
      title: t("report.processingBreakdown.detail_columns.closing_date"),
      dataIndex: "closingDate",
      align: "center",
      render: (text) => parseDate(text),
    },
    {
      title: t("report.processingBreakdown.detail_columns.downtime"),
      dataIndex: "downtime",
      align: "center",
      render: (text) => formatMillisToHHMMSS(text?.time),
    },
  ];
  const summaryColumns = [
    {
      title: t("report.processingBreakdown.summary_columns.priority"),
      dataIndex: "_id",
      key: "_id",
      render: (text) =>
        t(parseToLabel(priorityLevelStatus.Options, text?.priorityLevel)),
    },
    {
      title: t("report.processingBreakdown.summary_columns.total_tickets"),
      dataIndex: "total",
      key: "total",
      align: "end",
    },
    {
      title: t("report.processingBreakdown.summary_columns.downtime"),
      dataIndex: "downtime",
      align: "center",
      render: (text) => formatMillisToHHMMSS(text),
    },
  ];

  const baseColumns = [
    {
      title: t("report.assetMaintenanceReport.columns.index"),
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("report.common.labels.customer_name"),
      dataIndex: "customer",
      key: "customer",
      excelKey: "customer.customerName",
      render: (text) => <span>{text?.customerName}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <Tooltip title={t("Chi tiết")}>
            <Button
              // type="primary"
              icon={<EyeOutlined />}
              size="small"
              style={{ color: "green" }}
              onClick={() =>
                navigate(staticPath.viewWorkOrderBreakdown + "/" + record.id)
              }
            />
          </Tooltip>
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

  const assetMaintenanceColumn = {
    title: t("assetMaintenance.list.title_info"),
    dataIndex: "assetMaintenance",
    key: "assetMaintenance",
    excelKey: "assetMaintenance",
    render: (text) => (
      <div>
        <LabelValue
          label={t("preventive.list.table.asset_name")}
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
              {text?.assetName}
            </span>
          }
        />
        <LabelValue
          label={t("preventive.list.table.model")}
          value={text?.assetModelName}
        />
        <LabelValue
          label={t("preventive.list.table.serial")}
          value={text?.serial}
        />
      </div>
    ),
  };

  const check = filterBy === filterByProcessingBreakdown.assetMaintenance;
  const dynamicColumns = check ? [assetMaintenanceColumn] : [];
  const columns =
    onChangeOption === reportView.details
      ? [
          ...baseColumns.slice(0, 2),
          ...dynamicColumns,
          ...detailColumns,
          ...baseColumns.slice(2, 3),
        ]
      : [
          ...baseColumns.slice(0, 2),
          ...dynamicColumns,
          ...summaryColumns,
          // ...baseColumns.slice(2)
        ];

  const assetMaintenanceFields = [
    {
      name: "assetName",
      labelKey: "report.common.labels.customer_name",
      placeholderKey: "report.common.labels.customer_name",
      component: "Input",
    },
  ];

  const dynamicFields = check ? [assetMaintenanceFields] : [];
  const fieldsConfig =
    onChangeOption === reportView.summary
      ? [
          {
            name: "customerName",
            labelKey: "report.common.labels.customer_name",
            placeholderKey: "report.common.labels.customer_name",
            component: "Input",
          },
          {
            name: "priorityLevel",
            labelKey: "report.processingBreakdown.summary_columns.priority",
            placeholderKey:
              "report.processingBreakdown.summary_columns.priority",
            component: "Select",
            options: "priorityLevelStatus",
          },
          dynamicFields,
        ]
      : [
          {
            name: "customerName",
            labelKey: "report.common.labels.customer_name",
            placeholderKey: "report.common.labels.customer_name",
            component: "Input",
          },
          dynamicFields,
          {
            name: "code",
            labelKey: "report.processingBreakdown.detail_columns.code",
            placeholderKey: "report.processingBreakdown.detail_columns.code",
            component: "Input",
          },
          {
            name: "priorityLevel",
            labelKey: "report.processingBreakdown.summary_columns.priority",
            placeholderKey:
              "report.processingBreakdown.summary_columns.priority",
            component: "Select",
            options: "priorityLevelStatus",
          },
          {
            name: "status",
            labelKey: "report.processingBreakdown.detail_columns.status",
            placeholderKey: "report.processingBreakdown.detail_columns.status",
            component: "Select",
            options: "breakdownStatus",
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
          filterBy: filterByProcessingBreakdown.Options[1].value,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={10}>
                <Form.Item name="filterBy" label={t("Loại thống kê")}>
                  <Select
                    options={filterByProcessingBreakdown.Options.map((o) => ({
                      ...o,
                      label: t(o.label),
                    }))}
                    onChange={() => onFinish()}
                  ></Select>
                </Form.Item>
              </Col>
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

              <Col
                span={8}
                style={{ textAlign: "start", fontSize: 18, fontWeight: 600 }}
              >
                {/* <Tooltip title={t("report.common.misc.add_column")} className='mr-4'>
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
                {/* <Tooltip title={t("report.common.misc.customize_report")} className='mr-4'>
                                    <SlidersOutlined />
                                </Tooltip> */}
              </Col>
              <Col span={8}>
                <Form.Item
                  name="startDate"
                  label={t("report.common.labels.from_date")}
                >
                  <DatePicker
                    placeholder={t(
                      "report.common.placeholders.choose_from_date",
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
              <Col span={8}>
                <Button
                  type="primary"
                  className="p-2 bd-10 mr-2"
                  htmlType="submit"
                >
                  <SearchOutlined /> {t("report.common.buttons.search")}
                </Button>
                <Button className="bt-green" onClick={resetSearch}>
                  <RedoOutlined />
                  {t("purchase.buttons.reset")}
                </Button>
                {/* <Button
                                    onClick={() => navigate(-1)}
                                    className="p-2 bd-10 ml-2"
                                >
                                    <ArrowLeftOutlined />
                                    {t("report.common.buttons.back")}
                                </Button> */}
              </Col>
            </Row>
          </Col>
          {onChangeOption === reportView.summary && (
            <Col span={8}>
              <Pie {...config} />
            </Col>
          )}
          {onChangeOption === reportView.details && <Col span={8}></Col>}
        </Row>
        <Row>
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
                    {t("report.processingBreakdown.table_headers.new")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.in_progress")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.overdue")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.completed")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.closed")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.cancelled")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.all")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.inactive")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t("report.processingBreakdown.table_headers.active")}
                  </th>
                  <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {t(
                      "report.processingBreakdown.table_headers.total_downtime",
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
                    {activityBreakdowns?.totalBreakdownNews}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalBreakdownInProgress}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalBreakdownOverdues}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalBreakdownCompleted}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalBreakdownClosed}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalBreakdownCancelled}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalAllBreakdowns}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalBreakdownIsNotActives}
                  </td>
                  <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>
                    {activityBreakdowns?.totalBreakdownIsActives}
                  </td>
                  <td
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: 3,
                      fontWeight: 700,
                    }}
                  >
                    {formatMillisToHHMMSS(
                      activityBreakdowns?.totalDownTimeBreakdown,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col span={24}>
            <Table
              rowKey="id"
              columns={columns}
              key="id"
              dataSource={Array.isArray(breakdowns) ? breakdowns : []}
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
              fetchGetActivityBreakdown(1, value);
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

export default ProcessingStatusReportBreakdown;
