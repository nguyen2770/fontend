import React, { useEffect, useRef, useState } from 'react';
import useHeader from '../../../contexts/headerContext';
import { Button, Card, Col, DatePicker, Form, Pagination, Radio, Row, Table, Tooltip } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FilterOutlined, MenuOutlined, PrinterOutlined, RedoOutlined, SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import { breakdownStatus, breakdownUserStatus, FORMAT_DATE, PAGINATION, reportView } from '../../../utils/constant';
import dayjs from 'dayjs';
import * as _unitOfWork from "../../../api"
import ShowError from '../../../components/modal/result/errorNotification';
import { formatMillisToHHMMSS, formatWorkingTime, parseDate } from '../../../helper/date-helper';
import { parseToLabel } from '../../../helper/parse-helper';
import { useNavigate } from 'react-router-dom';
import "./index.scss"
import { useTranslation } from 'react-i18next';
import DrawerSearch from '../../../components/drawer/drawerSearch';
import { cleanEmptyValues } from '../../../helper/check-search-value';
import { utils, write } from 'xlsx';
import FileSaver from 'file-saver';
import { exportToExcel, transformColumnsForExcel } from '../exportToExcel/exportData';
import PdfReportEngineerPerformanceInBreakdown from './PdfReportEngineerPerformanceInBreakdown';
import { pdf } from '@react-pdf/renderer';

const ReportEngineerPerformanceInBreakdown = () => {
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();
    const [form] = Form.useForm();
    const [onChangeOption, setOnChangeOption] = useState(reportView.summary)
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [breakdownAssignUsers, setBreakdownAssignUsers] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
    const [searchFilter, setSearchFilter] = useState({});
    const drawerRef = useRef();

    useEffect(() => {
        setHeaderTitle(t("report.engineerBreakdown.title"));
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchGetSchedulePreventives(page, searchFilter);
        } else { fetchGetSchedulePreventives(1, searchFilter); }
    }, [onChangeOption, page]);

    const fetchGetSchedulePreventives = async (_page, searchValue) => {
        let filterValue = cleanEmptyValues(searchValue || {});
        const value = form.getFieldsValue();
        if (value.startDate === null || value.endDate === null) {
            return ShowError('topRight', t("common.notifications"), t("common.messages.fill_in_complete_date"))
        }

        if (onChangeOption === reportView.summary) {
            let res = await _unitOfWork.reportBreakdown.getSummaryReportEngineerPerformanceInBreakdown({
                page: _page || page,
                limit: PAGINATION.limit,
                startDate: value.startDate,
                endDate: value.endDate,
                ...filterValue,
            })
            if (res && res.code === 1) {
                setBreakdownAssignUsers(res?.breakdownAssignUsers);
                setTotalRecord(res?.totalResults)
                const _data = [];
                _data.push({
                    title: t("report.engineerBreakdown.columns.new"),
                    value: res?.totalBreakdownAssignUserStatusNews
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.in_progress"),
                    value: res?.totalBreakdownAssignUserStatusInProgress
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.rejected"),
                    value: res?.totalBreakdownAssignUserStatusRejecteds
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.completed"),
                    value: res?.totalBreakdownAssignUserStatusCompleteds
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.closed"),
                    value: res?.totalBreakdownAssignUserStatusCloseds
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.total_tickets"),
                    value: res?.totalBreakdownAssignUsers
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.total_usage_time"),
                    value: formatMillisToHHMMSS(res?.totalConsumedMs)
                })
                setData(_data)
            }
        } else {
            let res = await _unitOfWork.reportBreakdown.getDetailsReportEngineerPerformanceInBreakdown({
                page: _page || page,
                limit: PAGINATION.limit,
                startDate: value.startDate,
                endDate: value.endDate,
                ...filterValue,
            })
            if (res && res.code === 1) {
                setBreakdownAssignUsers(res?.breakdownAssignUsers);
                setTotalRecord(res?.totalResults)
                const _data = [];
                _data.push({
                    title: t("report.engineerBreakdown.columns.new"),
                    value: res?.totalBreakdownAssignUserStatusNews
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.in_progress"),
                    value: res?.totalBreakdownAssignUserStatusInProgress
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.rejected"),
                    value: res?.totalBreakdownAssignUserStatusRejecteds
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.closed"),
                    value: res?.totalBreakdownAssignUserStatusCloseds
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.total_tickets"),
                    value: res?.totalBreakdownAssignUsers
                })
                _data.push({
                    title: t("report.engineerBreakdown.columns.total_usage_time"),
                    value: formatMillisToHHMMSS(res?.totalConsumedMs)
                })
                setData(_data)
            }
        }
    }
    const resetSearch = () => {
        setSearchFilter({});
        if (drawerRef.current)
            drawerRef.current.resetForm();
        setPage(1);
        fetchGetSchedulePreventives(1);
    };
    const onFinish = async () => {
        setPage(1)
        fetchGetSchedulePreventives(1, searchFilter)
    }
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
                reportView: onChangeOption,
                // ...formValues,
                ...cleanEmptyValues(searchFilter),
            };
            const res = isSummary
                ? await _unitOfWork.reportBreakdown.getSummaryReportEngineerPerformanceInBreakdown(payload)
                : await _unitOfWork.reportBreakdown.getDetailsReportEngineerPerformanceInBreakdown(payload);
            const list = res?.breakdownAssignUsers;

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
                totalUsageTime: formatMillisToHHMMSS(item?.totalUsageTime),
            }))
            : list.map(item => ({
                ...item,
                createdAt: parseDate(item?.createdAt),
                status: t(parseToLabel(breakdownUserStatus.Option, item?.status)),
                totalTimeCosumed: formatMillisToHHMMSS(item?.totalTimeCosumed),
            }));
    }
    const onClickPdfExport = async (values) => {
        try {
            const blob = await pdf(
                <PdfReportEngineerPerformanceInBreakdown data={values} />
            ).toBlob();
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
            render: (_text, _record, index) => (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("report.engineerBreakdown.columns.user"),
            dataIndex: "user",
            key: "user",
            excelKey: "user.fullName",
            render: (text) => <span>{text?.fullName}</span>
        },
        ...(onChangeOption === reportView.summary ? [{
            title: t("report.engineerBreakdown.columns.total_tickets"),
            dataIndex: "totalBreakdowns",
            key: "totalBreakdowns",
            align: 'end'
        }, {
            title: t("report.engineerBreakdown.columns.new"),
            dataIndex: "newCount",
            key: "newCount",
            align: 'end'
        },
        {
            title: t("report.engineerBreakdown.columns.in_progress"),
            dataIndex: "inProgressCount",
            key: "inProgressCount",
            align: 'end'
        },
        {
            title: t("report.engineerBreakdown.columns.completed"),
            dataIndex: "completedCount",
            key: "completedCount",
            align: 'right'

        },
        {
            title: t("report.engineerBreakdown.columns.rejected"),
            dataIndex: "rejectedCount",
            key: "rejectedCount",
            align: 'right'
        },
        {
            title: t("report.engineerBreakdown.columns.closed"),
            dataIndex: "closedCount",
            key: "closedCount",
            align: 'end'
        },
        {
            title: t("report.engineerBreakdown.columns.total_usage_time"),
            dataIndex: "totalUsageTime",
            align: 'center',
            render: (text) => formatMillisToHHMMSS(text)
        },] : []),
        ...(onChangeOption === reportView.details
            ? [
                {
                    title: t("report.processingBreakdown.detail_columns.code"),
                    dataIndex: "breakdown",
                    key: "breakdown",
                    excelKey: "breakdown.code",
                    render: (text) => <span>{text?.code}</span>
                },
                {
                    title: t("report.processingBreakdown.detail_columns.opened_date"),
                    dataIndex: "createdAt",
                    align: 'center',
                    render: (text) => parseDate(text)
                },
                {
                    title: t("report.processingBreakdown.detail_columns.opened_by"),
                    dataIndex: "breakdown",
                    excelKey: "breakdown.createdBy.fullName",
                    render: (text) => <span>{text?.createdBy?.fullName}</span>
                },
                {
                    title: t("report.processingBreakdown.detail_columns.status"),
                    dataIndex: "status",
                    align: 'center',
                    render: (text) => t(parseToLabel(breakdownUserStatus.Option, text))
                },
                {
                    title: t("report.engineerBreakdown.columns.time_used"),
                    dataIndex: "totalTimeCosumed",
                    align: 'center',
                    render: (text) => formatMillisToHHMMSS(text)
                },
                {
                    title: "Action",
                    dataIndex: "action",
                    align: "center",
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
            ] : []),
    ];
    const fieldsConfig = onChangeOption === reportView.summary
        ? [
            {
                name: "fullName",
                labelKey: "report.engineerBreakdown.columns.user",
                placeholderKey: "report.engineerBreakdown.columns.user",
                component: "Input",
            },
        ] : [
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
        <Card className='p-2'>
            <Form labelWrap form={form} onFinish={onFinish}
                initialValues={{
                    startDate: dayjs().subtract(9, "day").startOf("day"),
                    endDate: dayjs().endOf("day"),
                }}
                layout="vertical"
            >
                <Row gutter={[16, 16]}>
                    <Col span={20}>
                        <Row gutter={[16, 16]}>
                            <Col span={6} style={{ textAlign: 'end' }}>
                                <Radio.Group
                                    block
                                    options={reportView.Options.map(opt => ({
                                        ...opt,
                                        label: t(opt.label),
                                    }))}
                                    value={onChangeOption}
                                    onChange={(e) => setOnChangeOption(e.target.value)}
                                />
                            </Col>
                            <Col span={10}></Col>
                            <Col span={8} style={{ textAlign: 'start', fontSize: 18, fontWeight: 600 }}>
                                {/* <Tooltip title={t("report.common.misc.add_column")} className='mr-4'>
                                    <MenuOutlined />
                                </Tooltip> */}
                                <Tooltip
                                    title={t("report.common.misc.export")}
                                    className='mr-4'
                                    onClick={() => handleExportExcel()}
                                >
                                    <PrinterOutlined />
                                </Tooltip>
                                <Tooltip
                                    title={t("report.common.misc.advanced_search")}
                                    className='mr-4'
                                    onClick={() => setIsOpenSearchAdvanced(true)}
                                >
                                    <FilterOutlined />
                                </Tooltip>
                                {/* <Tooltip title={t("report.common.misc.customize_report")} className='mr-4'>
                                    <SlidersOutlined />
                                </Tooltip> */}
                            </Col>
                            <Col span={8}>
                                <Form.Item name="startDate" label={t("report.common.labels.from_date")} >
                                    <DatePicker
                                        placeholder={t("report.common.placeholders.choose_from_date")}
                                        format={FORMAT_DATE}
                                        style={{ width: "100%" }}
                                        allowClear

                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
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
                                span={8}
                                style={{ marginTop: 20 }}
                            >
                                <Button type="primary" icon={<SearchOutlined />} className='' htmlType='submit'>{t("report.common.buttons.search")} </Button>
                                <Button className="bt-green ml-2" onClick={resetSearch}>
                                    <RedoOutlined />
                                    {t("purchase.buttons.reset")}
                                </Button>
                                {/* <Button
                                    onClick={() => navigate(-1)}
                                    className='ml-3' icon=<ArrowLeftOutlined />>
                                    {t("report.common.buttons.back")}
                                </Button> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Card title={t("report.engineerBreakdown.summary_title")} style={{ borderRadius: 8 }}>
                    <Row align="middle" justify="center" className="summary-row">
                        {data.map((item, index) => (
                            <Col
                                key={index}
                                flex="1"
                                className={`summary-col ${index !== data.length - 1 ? "border-right" : ""}`}
                            >
                                <div className="summary-item">
                                    <div className="summary-title">{item.title}</div>
                                    <div className="summary-value">{item.value}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card>
                <Row className='mt-4'>
                    <Col span={24}>
                        <Table
                            rowKey="id"
                            columns={columns}
                            key="id"
                            dataSource={breakdownAssignUsers}
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
                            fetchGetSchedulePreventives(1, value);
                        }
                    }}
                    onClose={() => { setIsOpenSearchAdvanced(false) }}
                    fieldsConfig={fieldsConfig}
                />
            </Form>
        </Card>
    );
};

export default ReportEngineerPerformanceInBreakdown;