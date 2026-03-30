import React, { useEffect, useRef, useState } from 'react';
import useHeader from '../../../contexts/headerContext';
import { Button, Card, Col, DatePicker, Dropdown, Form, Input, Pagination, Row, Select, Table, Tooltip } from 'antd';
import { ArrowLeftOutlined, CaretDownOutlined, CaretUpOutlined, EyeFilled, FileOutlined, FilePdfOutlined, MoreOutlined, PrinterOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { assetType, FORMAT_DATE, jobSummaryStatus, jobSummaryType, PAGINATION } from '../../../utils/constant';
import dayjs from 'dayjs';
import * as _unitOfWork from "../../../api"
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { parseToLabel } from '../../../helper/parse-helper';
import { LabelValue } from '../../../helper/label-value';
import { parseDate } from '../../../helper/date-helper';
import { staticPath } from '../../../router/routerConfig';
import { exportToExcel, transformColumnsForExcel } from '../exportToExcel/exportData';
import ShowError from '../../../components/modal/result/errorNotification';
import { filterOption } from '../../../helper/search-select-helper';
import PdfWorkReportByPersonExport from './PdfWorkReportByPerson';
import { pdf } from '@react-pdf/renderer';
import { rootURL } from '../../../api/config';
import ModalFileInWork from './ModalFileInWork';

const ListWorkReportByPerson = () => {
    const location = useLocation();
    const { userId, workList, typeLabel, dateRange } = location.state || {};
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [sortBy, setSortBy] = useState('userName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [workReportByPerson, setWorkReportByPerson] = useState([]);
    const [isOpenListFile, setIsOpenListFile] = useState(false);
    const [listFiles, setListFiles] = useState([]);

    useEffect(() => {
        setHeaderTitle(t("report.selection.work_report_by_person"))
    }, []);

    useEffect(() => {
        fetchGetList();
    }, [page, sortBy, sortOrder]);

    const fetchGetList = async () => {
        const payload = {
            page: page,
            limit: 10,
            sortBy: sortBy,
            sortOrder: sortOrder,
            userId: userId,
            workList: workList || [],
            ...form.getFieldValue(),
        }
        const res = await _unitOfWork.workReportByPerson.getListWorkReportByPerson(
            payload
        );
        if (res && res.code === 1) {
            setWorkReportByPerson(res?.reports);
            setTotalRecord(res?.totalResults);
        }
    }
    const onFinish = async () => {
        if (page !== 1)
            setPage(1);
        else
            fetchGetList();
    }
    const resetSearch = () => {
        form.resetFields();
        if (page !== 1)
            setPage(1);
        else
            fetchGetList();
    };
    const onChangePagination = (value) => {
        setPage(value);
        setPagination(prev => ({ ...prev, page: value }));
    };
    const handleTableChange = (pagination, filters, sorter) => {
        // sorter.field là dataIndex của cột
        // sorter.order là 'ascend' hoặc 'descend'
        if (sorter.field) {
            setSortBy(sorter.field);
            setSortOrder(sorter.order === 'descend' ? 'desc' : 'asc');
            setPage(1);
        }
    };
    const onClicView = (value) => {
        if (value.jobType === jobSummaryType.BREAKDOWN) {
            navigate(
                staticPath.viewWorkOrderBreakdown + "/" + (value.breakdown._id)
            );
        } else if (value.jobType === jobSummaryType.SCHEDULE_PREVENTIVE) {
            navigate(
                staticPath.viewSchedulePreventive + "/" + (value.schedulePreventiveTask.schedulePreventive._id)
            );
        } else {
            navigate(staticPath.calibrationTaskView + "/" + (value.calibrationWork._id));
        }
    };
    const handleExportExcel = async () => {
        const value = form.getFieldsValue();
        if (value.startDate === null || value.endDate === null) {
            return ShowError('topRight', t("common.notifications"), t("common.messages.fill_in_complete_date"))
        }
        try {
            const payload = {
                page: 1,
                limit: totalRecord,
                sortBy: sortBy,
                sortOrder: sortOrder,
                userId: userId,
                workList: workList || [],
                ...value,
            };
            const res = await _unitOfWork.workReportByPerson.getListWorkReportByPerson(payload);
            const list = res?.reports;

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
        return list.map(item => {
            const assetStyle = item?.jobType === jobSummaryType.BREAKDOWN ? item?.breakdown?.assetMaintenance?.assetStyle
                : item?.jobType === jobSummaryType.CALIBRATION_WORK ? item?.calibrationWork?.assetMaintenance?.assetStyle
                    : item?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? item?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetStyle
                        : "";
            const assetName = item?.jobType === jobSummaryType.BREAKDOWN ? item?.breakdown?.assetMaintenance?.assetName
                : item?.jobType === jobSummaryType.CALIBRATION_WORK ? item?.calibrationWork?.assetMaintenance?.assetName
                    : item?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? item?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetName
                        : "";
            const assetModelName = item?.jobType === jobSummaryType.BREAKDOWN ? item?.breakdown?.assetMaintenance?.assetModelName
                : item?.jobType === jobSummaryType.CALIBRATION_WORK ? item?.calibrationWork?.assetMaintenance?.assetModelName
                    : item?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? item?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetModelName
                        : "";
            const serial = item?.jobType === jobSummaryType.BREAKDOWN ? item?.breakdown?.assetMaintenance?.serial
                : item?.jobType === jobSummaryType.CALIBRATION_WORK ? item?.calibrationWork?.assetMaintenance?.serial
                    : item?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? item?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.serial
                        : "";
            const assetMaintenance = `${t("breakdown.list.columns.asset_type")}: ${t(parseToLabel(assetType.Options, assetStyle))}\n` +
                `${t("breakdown.list.columns.asset_name")}: ${assetName}\n` +
                `${t("breakdown.list.columns.model")}: ${assetModelName}\n` +
                `${t("breakdown.list.columns.serial")}: ${serial}`;
            return {
                ...item,
                jobCode: item?.jobType === jobSummaryType.BREAKDOWN ? item?.breakdown?.code
                    : item?.jobType === jobSummaryType.CALIBRATION_WORK ? item?.calibrationWork?.code
                        : item?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? item?.schedulePreventiveTask?.schedulePreventive?.code
                            : "",
                jobType: t(parseToLabel(jobSummaryType.Options, item?.jobType)),
                assetMaintenance: assetMaintenance,
                status: t(jobSummaryStatus.Options.find((otp) => otp.value === item?.status)?.label) || item?.status,
                date: item?.startDate
                    ? parseDate(item?.startDate)
                    : parseDate(item?.createdAt)
            }
        });
    }
    const openListFile = async (value) => {
        const res = await _unitOfWork.workReportByPerson.getResource({
            jobType: value.jobType,
            id: value.jobType === jobSummaryType.BREAKDOWN ? value?._id
                : value.jobType === jobSummaryType.CALIBRATION_WORK ? value?._id
                    : value.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? value?.schedulePreventiveTask?._id
                        : ""
        });
        let files = [];
        if (res?.listDocuments && res.listDocuments.length > 0) {
            files = await Promise.all(
                res.listDocuments.map(async (doc) => {
                    const rawPath = doc.resource?.filePath;
                    if (!rawPath) return "";
                    const normalizedPath = rawPath.replace(/\\/g, '/');
                    const parts = normalizedPath.split('uploads/');
                    const relativePath = parts.length > 1 ? parts[1] : normalizedPath;
                    return {
                        ...doc,
                        relativePath: relativePath,
                    };
                })
            );
        }
        setListFiles(files);
        setIsOpenListFile(true);
    };
    // const blobToBase64 = (blob) =>
    //     new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             const base64 = reader.result;
    //             resolve(base64);
    //         };
    //         reader.onerror = reject;
    //         reader.readAsDataURL(blob);
    //     });


    // const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".json"];
    // const nonImageExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".rar", ".json"];
    // const onClickPdfExport = async (value) => {
    //     try {
    //         const res = await _unitOfWork.workReportByPerson.getResource({
    //             jobType: value.jobType,
    //             id: value.jobType === jobSummaryType.BREAKDOWN ? value?._id
    //                 : value.jobType === jobSummaryType.CALIBRATION_WORK ? value?._id
    //                     : ""
    //         });
    //         let base64Documents = [];
    //         if (res?.listDocuments && res.listDocuments.length > 0) {
    //             base64Documents = await Promise.all(
    //                 res.listDocuments.map(async (doc) => {
    //                     const extension = doc.resource.extension?.toLowerCase();
    //                     let base64 = null;

    //                     if (imageExtensions.includes(extension)) {
    //                         const blob = await _unitOfWork.resource.downloadImage(
    //                             doc.resource.id
    //                         );

    //                         if (blob) {
    //                             base64 = await blobToBase64(blob);
    //                         }
    //                     }
    //                     if (nonImageExtensions.includes(extension)) {
    //                         return {
    //                             ...doc,
    //                             isImage: false,
    //                         };
    //                     }

    //                     return {
    //                         ...doc,
    //                         base64,
    //                         isImage: !!base64,
    //                     };
    //                 })
    //             );
    //         }

    //         const user = await _unitOfWork.user.getUserById({ userId });
    //         const data = {
    //             ...value,
    //             user: {
    //                 ...user,
    //             },
    //             listDocuments: base64Documents,
    //         }
    //         // console.log(data);
    //         const blob = await pdf(<PdfWorkReportByPersonExport data={data} />).toBlob();
    //         const url = URL.createObjectURL(blob);
    //         window.open(url, "_blank");
    //     } catch (err) {
    //         console.error("Export PDF error:", err);
    //     }
    // };

    const columns = [
        {
            title: t("breakdown.list.columns.stt"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("jobSummaty.code"),
            excelKey: "jobCode",
            render: (text) => {
                const value = text?.jobType === jobSummaryType.BREAKDOWN ? text?.breakdown?.code
                    : text?.jobType === jobSummaryType.CALIBRATION_WORK ? text?.calibrationWork?.code
                        : text?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? text?.schedulePreventiveTask?.schedulePreventive?.code
                            : "";
                return (
                    <span style={{ fontWeight: 600 }}>{value}</span>
                );
            },
        },
        {
            title: t("jobSummaty.jobType"),
            excelKey: "jobType",
            render: (text) => {
                let task = '';
                if (text.jobType === jobSummaryType.SCHEDULE_PREVENTIVE) {
                    task = `${t("preventiveSchedule.history.task_name")}: `
                }
                return (
                    <>
                        {t(parseToLabel(jobSummaryType.Options, text.jobType))}
                        <br></br>
                        <span><strong>{task}</strong>{text?.schedulePreventiveTask?.taskName}</span>

                    </>
                );
            },
        },
        {
            title: t("assetMaintenance.list.title_info"),
            excelKey: "assetMaintenance",
            render: (text) => {
                const assetStyle = text?.jobType === jobSummaryType.BREAKDOWN ? text?.breakdown?.assetMaintenance?.assetStyle
                    : text?.jobType === jobSummaryType.CALIBRATION_WORK ? text?.calibrationWork?.assetMaintenance?.assetStyle
                        : text?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? text?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetStyle
                            : "";
                const assetName = text?.jobType === jobSummaryType.BREAKDOWN ? text?.breakdown?.assetMaintenance?.assetName
                    : text?.jobType === jobSummaryType.CALIBRATION_WORK ? text?.calibrationWork?.assetMaintenance?.assetName
                        : text?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? text?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetName
                            : "";
                const assetModelName = text?.jobType === jobSummaryType.BREAKDOWN ? text?.breakdown?.assetMaintenance?.assetModelName
                    : text?.jobType === jobSummaryType.CALIBRATION_WORK ? text?.calibrationWork?.assetMaintenance?.assetModelName
                        : text?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? text?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetModelName
                            : "";
                const serial = text?.jobType === jobSummaryType.BREAKDOWN ? text?.breakdown?.assetMaintenance?.serial
                    : text?.jobType === jobSummaryType.CALIBRATION_WORK ? text?.calibrationWork?.assetMaintenance?.serial
                        : text?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? text?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.serial
                            : "";
                return (
                    <div>
                        <LabelValue
                            label={t("breakdown.list.columns.asset_type")}
                            value={t(parseToLabel(assetType.Options, assetStyle))}
                        />
                        <LabelValue
                            label={t("breakdown.list.columns.asset_name")}
                            value={assetName}
                        />
                        <LabelValue
                            label={t("breakdown.list.columns.model")}
                            value={assetModelName}
                        />
                        <LabelValue
                            label={t("breakdown.list.columns.serial")}
                            value={serial}
                        />
                    </div>
                );
            },
        },
        {
            title: t("jobSummaty.job_status"),
            excelKey: "status",
            align: "center",
            render: (text) => {
                const status = text?.jobType === jobSummaryType.BREAKDOWN ? text?.breakdown?.status
                    : text?.jobType === jobSummaryType.CALIBRATION_WORK ? text?.calibrationWork?.status
                        : text?.jobType === jobSummaryType.SCHEDULE_PREVENTIVE ? text?.schedulePreventiveTask?.schedulePreventive?.status
                            : "";
                const option = jobSummaryStatus.Options.find(
                    (opt) => opt.value === status
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
            title: t("jobSummaty.date_of_work"),
            align: "center",
            excelKey: "date",
            render: (_, record) => (
                <div>
                    {record?.startDate
                        ? parseDate(record?.startDate)
                        : parseDate(record?.createdAt)}
                </div>
            ),
        },
        {
            title: t("breakdown.list.columns.action"),
            dataIndex: "action",
            fixed: "right",
            align: "center",
            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center">
                        <Tooltip title={t("breakdown.list.tooltips.view")}>
                            <Button
                                icon={<EyeFilled />}
                                size="small"
                                className="ml-2"
                                onClick={() => onClicView(record)}
                            />
                        </Tooltip>
                        <Tooltip title={"File"}>
                            <Button
                                icon={<FileOutlined />}
                                size="small"
                                className="ml-2"
                                onClick={() => openListFile(record)}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];
    return (
        <Card className='p-3'>
            <Form form={form} onFinish={onFinish}
                initialValues={{
                    // startDate: dateRange?.startDate ? dayjs(dateRange.startDate) : dayjs().subtract(7, "day").startOf("day"),
                    // endDate: dateRange?.endDate ? dayjs(dateRange.endDate) : dayjs().endOf("day"),
                    jobType: jobSummaryType.ALL,
                }}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="code" label={t("jobSummaty.code")} >
                            <Input
                                placeholder={t("jobSummaty.code")}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="jobType" label={t("jobSummaty.jobType")}>
                            <Select
                                placeholder={t("jobSummaty.jobType")}
                                showSearch
                                options={(jobSummaryType.Options || []).map((item) => ({
                                    value: item.value,
                                    label: t(item.label),
                                }))}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="assetName" label={t("breakdown.list.columns.asset_name")} >
                            <Input
                                placeholder={t("breakdown.list.columns.asset_name")}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="status" label={t("jobSummaty.job_status")}>
                            <Select
                                placeholder={t("jobSummaty.job_status")}
                                showSearch
                                options={(jobSummaryStatus.Options || []).map((item) => ({
                                    value: item.value,
                                    label: t(item.label),
                                }))}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={18} style={{ marginTop: 0 }}>
                        <Button
                            onClick={() => navigate(-1)}
                            className='mr-2'>
                            <ArrowLeftOutlined />
                            {t("report.common.buttons.back")}
                        </Button>
                        <Button type="primary" className='' htmlType='submit'>
                            <SearchOutlined />
                            {t("report.common.buttons.search")}
                        </Button>
                        <Button className="bt-green ml-2" onClick={resetSearch}>
                            <RedoOutlined />
                            {t("purchase.buttons.reset")}
                        </Button>
                        <Button
                            title={t("report.common.misc.export")}
                            className='ml-2'
                            onClick={() => handleExportExcel()}
                        >
                            <PrinterOutlined />
                            {t("customer.actions.export_excel")}
                        </Button>
                    </Col>
                    <Col span={6} style={{ textAlign: "right", marginTop: "auto" }}>
                        <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
                            {t("breakdown.common.total", {
                                count: totalRecord ? totalRecord : 0,
                            })}
                        </span>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col span={24}>
                        <Table
                            rowKey="id"
                            columns={columns}
                            key="id"
                            dataSource={workReportByPerson}
                            bordered
                            pagination={false}
                            onChange={handleTableChange}
                            showSorterTooltip={false}
                        />
                        <Pagination
                            className="pagination-table mt-2 pb-3"
                            onChange={onChangePagination}
                            pageSize={pagination.limit}
                            total={totalRecord}
                            current={page}
                        />
                    </Col>
                </Row>
                <ModalFileInWork
                    open={isOpenListFile}
                    handleCancel={() => setIsOpenListFile(false)}
                    listDocuments={listFiles}
                />
            </Form>
        </Card>
    );
};

export default ListWorkReportByPerson;