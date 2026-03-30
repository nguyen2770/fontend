import React, { useEffect, useRef, useState } from 'react';
import useHeader from '../../../contexts/headerContext';
import { Button, Card, Col, DatePicker, Form, Pagination, Radio, Row, Table, Tooltip } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FilterOutlined, MenuOutlined, PrinterOutlined, RedoOutlined, SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import { FORMAT_DATE, PAGINATION, frequencyAllOptions, reportView, schedulePreventiveStatus } from '../../../utils/constant';
import dayjs from 'dayjs';
import { Pie } from '@ant-design/plots';
import * as _unitOfWork from "../../../api"
import ShowError from '../../../components/modal/result/errorNotification';
import { formatMillisToHHMMSS, formatWorkingTime, parseDate } from '../../../helper/date-helper';
import { parseToLabel } from '../../../helper/parse-helper';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DrawerSearch from '../../../components/drawer/drawerSearch';
import { cleanEmptyValues } from '../../../helper/check-search-value';
import FileSaver from 'file-saver';
import { utils, write } from 'xlsx';
import { exportToExcel, transformColumnsForExcel } from '../exportToExcel/exportData';
import PdfProcessingStatusReportSchedulePreventive from './PdfProcessingStatusReportSchedulePreventive';
import { pdf } from '@react-pdf/renderer';

const ProcessingStatusReportSchedulePreventive = () => {
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();
    const [form] = Form.useForm();
    const [onChangeOption, setOnChangeOption] = useState(reportView.summary)
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [datas, setDatas] = useState([]);
    const [schedulePreventives, setSchedulePreventives] = useState([]);
    const [dataConfig, setDataConfig] = useState([]);
    const navigate = useNavigate();
    const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
    const [searchFilter, setSearchFilter] = useState({});
    const drawerRef = useRef();

    useEffect(() => {
        setHeaderTitle(t("report.processingSchedulePreventive.title"))
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
            return ShowError('topRight', t("common.notifications"), t("common.messages.fill_in_complete_date"))
        }
        if (onChangeOption === reportView.summary) {
            let res = await _unitOfWork.reportSchedulePreventive.getSumaryProcecssingSattusSchedulePreventive({
                page: _page || page,
                limit: PAGINATION.limit,
                startDate: value.startDate,
                endDate: value.endDate,
                ...filterValue,
            })
            if (res && res.code === 1) {
                setDatas(res?.data)
                setTotalRecord(res?.data?.totalResults)
                setSchedulePreventives(res?.data?.scheduleGroups)
                const data = res?.data;
                let _dataConfig = []
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.new"),
                    percent: (data?.totalSchedulePreventiveNews / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.in_progress"),
                    percent: (data?.totalSchedulePreventiveInProgress / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.completed"),
                    percent: (data?.totalSchedulePreventiveCompleteds / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.cancelled"),
                    percent: (data?.totalSchedulePreventiveCancelleds / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.skipped"),
                    percent: (data?.totalSchedulePreventiveSkippeds / data?.totalAllSchedulePreventives)
                })
                setDataConfig(_dataConfig);
            }
        }
        else {
            let res = await _unitOfWork.reportSchedulePreventive.getDetailsProcecssingSattusSchedulePreventive({
                page: _page || page,
                limit: PAGINATION.limit,
                startDate: value.startDate,
                endDate: value.endDate,
                ...filterValue,
            })
            if (res && res.code === 1) {
                setDatas(res?.data)
                setTotalRecord(res?.data?.totalResults)
                setSchedulePreventives(res?.data?.schedulePreventives)
                const data = res?.data;
                let _dataConfig = []
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.new"),
                    percent: (data?.totalSchedulePreventiveNews / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.in_progress"),
                    percent: (data?.totalSchedulePreventiveInProgress / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.completed"),
                    percent: (data?.totalSchedulePreventiveCompleteds / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.cancelled"),
                    percent: (data?.totalSchedulePreventiveCancelleds / data?.totalAllSchedulePreventives)
                })
                _dataConfig.push({
                    item: t("report.processingSchedulePreventive.table_headers.skipped"),
                    percent: (data?.totalSchedulePreventiveSkippeds / data?.totalAllSchedulePreventives)
                })
                setDataConfig(_dataConfig);
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
        fetchGetSchedulePreventives(1, searchFilter);
        setPage(1)
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
            // const formValues = searchForm.getFieldsValue();
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
                ? await _unitOfWork.reportSchedulePreventive.getSumaryProcecssingSattusSchedulePreventive(payload)
                : await _unitOfWork.reportSchedulePreventive.getDetailsProcecssingSattusSchedulePreventive(payload)
            const list = res?.data?.scheduleGroups || res?.data?.schedulePreventives || [];

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
                plannedHours: formatMillisToHHMMSS(item?.plannedHours),
                downtime: formatMillisToHHMMSS(item?.downtime),
            }))
            : list.map(item => {
                const frequencyLabel = t(parseToLabel(
                    frequencyAllOptions.Option,
                    item?.preventive?.frequencyType
                ));
                const fullFrequency = item?.preventive?.calenderFrequencyDuration
                    ? `${item?.preventive?.calenderFrequencyDuration} ${frequencyLabel}`
                    : frequencyLabel;
                return {
                    ...item,
                    frequency: fullFrequency,
                    status: t(parseToLabel(schedulePreventiveStatus.Options, item?.status)),
                    startDate: parseDate(item?.startDate),
                    closingDate: parseDate(item?.closingDate),
                    plannedHours: formatMillisToHHMMSS(item?.plannedHours),
                    downtime: formatMillisToHHMMSS(item?.downtime),
                }
            });
    }
    const config = {
        data: dataConfig,
        angleField: 'percent',
        colorField: 'item',
        radius: 0.6,
        height: 330,
        label: {
            position: 'outside',
            text: (data) => data.percent > 0 ? `${data.item}: ${(data.percent * 100).toFixed(2)}%` : '',
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
                <PdfProcessingStatusReportSchedulePreventive data={values} />
            ).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Export PDF error:", err);
        }
    };
    const detailColumns = [
        {
            title: t("report.processingSchedulePreventive.detail_columns.customer"),
            dataIndex: "customer",
            key: "customer",
            excelKey: "customer.customerName",
            render: (text) => <span>{text?.customerName}</span>
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.code"),
            dataIndex: "code",
            key: "code",
        },

        {
            title: t("report.processingSchedulePreventive.detail_columns.schedule_name"),
            dataIndex: "preventive",
            key: "preventive",
            excelKey: "preventive.preventiveName",
            render: (text) => <span>{text?.preventiveName}</span>
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.frequency"),
            dataIndex: "preventive",
            key: "preventive",
            excelKey: "frequency",
            render: (_text) => {
                const label = t(parseToLabel(
                    frequencyAllOptions.Option,
                    _text?.frequencyType
                ));
                return _text?.calenderFrequencyDuration
                    ? ` ${_text?.calenderFrequencyDuration} ${label}`
                    : label;
            },
        },

        {
            title: t("report.processingSchedulePreventive.detail_columns.asset"),
            dataIndex: "assetMaintenance",
            key: "assetMaintenance",
            excelKey: "assetMaintenance.assetModel.asset.assetName",
            render: (text) => <span>{text?.assetModel?.asset?.assetName}</span>
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.model"),
            dataIndex: "assetMaintenance",
            key: "assetMaintenance",
            excelKey: "assetMaintenance.assetModel.assetModelName",
            render: (text) => <span>{text?.assetModel?.assetModelName}</span>
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.status"),
            dataIndex: "status",
            key: "status",
            render: (text) => t(parseToLabel(schedulePreventiveStatus.Options, text))
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.start_date"),
            dataIndex: "startDate",
            align: 'center',
            render: (text) => parseDate(text)
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.closing_date"),
            dataIndex: "closingDate",
            align: 'center',
            render: (text) => parseDate(text)
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.planned_hours"),
            dataIndex: "plannedHours",
            align: 'center',
            render: (text) => formatMillisToHHMMSS(text)
        },
        {
            title: t("report.processingSchedulePreventive.detail_columns.downtime"),
            dataIndex: "downtime",
            align: 'center',
            render: (text) => formatMillisToHHMMSS(text)
        },
    ];
    const summaryColumns = [
        {
            title: t("report.processingSchedulePreventive.summary_columns.customer"),
            dataIndex: "customerName",
            key: "customer",
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.model"),
            dataIndex: "assetModelName",
            key: "assetModelName",
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.new"),
            dataIndex: "totalNew",
            key: "totalNew",
            align: 'end'
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.in_progress"),
            dataIndex: "totalInProgress",
            key: "totalInProgress",
            align: 'end'
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.overdue"),
            dataIndex: "totalOverdue",
            key: "totalOverdue",
            align: 'end'
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.completed"),
            dataIndex: "totalCompleted",
            key: "totalCompleted",
            align: 'end'
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.cancelled"),
            dataIndex: "totalCancelled",
            key: "totalCancelled",
            align: 'end'
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.skipped"),
            dataIndex: "totalSkipped",
            key: "totalSkipped",
            align: 'end'
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.all"),
            dataIndex: "total",
            key: "total",
            align: 'end'
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.planned_hours"),
            dataIndex: "plannedHours",
            align: 'center',
            render: (text) => formatMillisToHHMMSS(text)
        },
        {
            title: t("report.processingSchedulePreventive.summary_columns.downtime"),
            dataIndex: "downtime",
            align: 'center',
            render: (text) => formatMillisToHHMMSS(text)
        },
    ];
    const baseColumns = [
        {
            title: t("report.assetMaintenanceReport.columns.index"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) => (page - 1) * PAGINATION.limit + index + 1,
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
    ];
    const columns = onChangeOption === reportView.details
        ? [
            ...baseColumns.slice(0, 1),
            ...detailColumns,
            ...baseColumns.slice(1)
        ]
        : [
            ...baseColumns.slice(0, 1),
            ...summaryColumns,
            // ...baseColumns.slice(1)
        ];
    const fieldsConfig = onChangeOption === reportView.summary
        ? [
            {
                name: "customerName",
                labelKey: "report.processingSchedulePreventive.summary_columns.customer",
                placeholderKey: "report.processingSchedulePreventive.summary_columns.customer",
                component: "Input",
            },
            {
                name: "assetModelName",
                labelKey: "report.processingSchedulePreventive.summary_columns.model",
                placeholderKey: "report.processingSchedulePreventive.summary_columns.model",
                component: "Input",
            },
        ] : [
            {
                name: "customerName",
                labelKey: "report.processingSchedulePreventive.summary_columns.customer",
                placeholderKey: "report.processingSchedulePreventive.summary_columns.customer",
                component: "Input",
            },
            {
                name: "code",
                labelKey: "report.processingSchedulePreventive.detail_columns.code",
                placeholderKey: "report.processingSchedulePreventive.detail_columns.code",
                component: "Input",
            },
            {
                name: "preventiveName",
                labelKey: "report.processingSchedulePreventive.detail_columns.schedule_name",
                placeholderKey: "report.processingSchedulePreventive.detail_columns.schedule_name",
                component: "Input",
            },
            {
                name: "assetName",
                labelKey: "report.processingSchedulePreventive.detail_columns.asset",
                placeholderKey: "report.processingSchedulePreventive.detail_columns.asset",
                component: "Input",
            },
            {
                name: "assetModelName",
                labelKey: "report.processingSchedulePreventive.detail_columns.model",
                placeholderKey: "report.processingSchedulePreventive.detail_columns.model",
                component: "Input",
            },
            {
                name: "status",
                labelKey: "report.processingBreakdown.detail_columns.status",
                placeholderKey: "report.processingBreakdown.detail_columns.status",
                component: "Select",
                options: "schedulePreventiveStatus"
            },
        ];
    return (
        <Card className='p-2'>
            <Form labelWrap form={form} onFinish={onFinish}
                initialValues={{
                    startDate: dayjs().subtract(9, "day").startOf("day"),
                    endDate: dayjs().endOf("day"),
                }}>
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Row gutter={[16, 16]}>
                            <Col span={8} style={{ textAlign: 'end' }}>
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
                            <Col span={8}></Col>
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
                            <Col span={8}>
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    className=''
                                    htmlType='submit'
                                >
                                    {t("report.common.buttons.search")}
                                </Button>
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
                    {onChangeOption === reportView.summary && (
                        <Col span={8} style={{ textAlign: 'center' }}>
                            <Pie {...config} />
                        </Col>
                    )}
                    {onChangeOption === reportView.details && (
                        <Col span={8}>
                        </Col>
                    )}
                </Row>
                <Row >
                    <Col span={24}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontWeight: 600,
                                border: "1px solid #bdbdbd"
                            }}
                        >
                            <thead>
                                <tr style={{ background: "#19a7b7", color: "#fff" }}>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.new")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.in_progress")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.overdue")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.completed")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.cancelled")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.skipped")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.all")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.total_planned_hours")}</th>
                                    <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("report.processingSchedulePreventive.table_headers.total_downtime")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: "#ccc", color: "#fff", textAlign: "center" }}>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{datas?.totalSchedulePreventiveNews || 0}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{datas?.totalSchedulePreventiveInProgress || 0}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{datas?.totalSchedulePreventiveOverdues || 0}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{datas?.totalSchedulePreventiveCompleteds || 0}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{datas?.totalSchedulePreventiveCancelleds || 0}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{datas?.totalSchedulePreventiveSkippeds || 0}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{datas?.totalAllSchedulePreventives || 0}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3, fontWeight: 700 }}>{formatMillisToHHMMSS(datas?.totalPlannedHours)}</td>
                                    <td style={{ border: "1px solid #bdbdbd", padding: 3, fontWeight: 700 }}>{formatMillisToHHMMSS(datas?.totalDowntime)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col span={24}>
                        <Table
                            rowKey="id"
                            columns={columns}
                            key="id"
                            dataSource={schedulePreventives}
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
        </Card >
    );
};

export default ProcessingStatusReportSchedulePreventive;