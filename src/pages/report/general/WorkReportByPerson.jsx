import React, { useEffect, useRef, useState } from 'react';
import useHeader from '../../../contexts/headerContext';
import { Button, Card, Col, ConfigProvider, DatePicker, Form, Input, Pagination, Row, Table } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, PrinterOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { FORMAT_DATE, PAGINATION } from '../../../utils/constant';
import dayjs from 'dayjs';
import * as _unitOfWork from "../../../api"
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reportStaticPath } from '../../../router/reportRouteConfig';
import ShowError from '../../../components/modal/result/errorNotification';
import { utils, write } from "xlsx";
import FileSaver from "file-saver";
import useSchedulePreventive from '../../../contexts/schedulePreventiveContext';
import { Pie } from '@ant-design/plots';

const WorkReportByPerson = () => {
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
    const { valueSearch, setValueSearch } = useSchedulePreventive();
    const [dataConfig, setDataConfig] = useState([]);
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        setHeaderTitle(t("report.selection.work_report_by_person"));
        if (valueSearch) {
            form.setFieldsValue(valueSearch);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [page, sortBy, sortOrder]);
    const loadData = async () => {
        const latestTotal = await fetchGetReport();
        fetchGetTotalReport(latestTotal);
    };

    const fetchGetReport = async () => {
        const payload = {
            page: page,
            limit: 10,
            sortBy: sortBy,
            sortOrder: sortOrder,
            ...form.getFieldValue(),
        }
        setValueSearch({
            ...form.getFieldValue(),
        });
        const res = await _unitOfWork.workReportByPerson.getWorkReportByPerson(
            payload
        );
        if (res && res.code === 1) {
            setWorkReportByPerson(res?.reports);
            setTotalRecord(res?.totalResults);
            return res?.totalResults;
        }
        return 0;
    }
    const fetchGetTotalReport = async (forceTotal) => {
        const payload = {
            page: 1,
            limit: forceTotal || 99999999,
            sortBy: sortBy,
            sortOrder: sortOrder,
            ...form.getFieldValue(),
        }
        const res = await _unitOfWork.workReportByPerson.getWorkReportByPerson(
            payload
        );
        if (res && res.code === 1) {
            const data = res?.reports;
            let completedOnTimeP = 0;
            let completedLateP = 0;
            let onScheduleP = 0;
            let currentlyBehindScheduleP = 0;
            let totalJobsP = 0;
            data.forEach(item => {
                completedOnTimeP += item?.completedOnTime;
                completedLateP += item?.completedLate;
                onScheduleP += item?.onSchedule;
                currentlyBehindScheduleP += item?.currentlyBehindSchedule;
                totalJobsP += item?.totalJobs;
            })
            let _dataConfig = []
            _dataConfig.push({
                item: t("workReportByPerson.chart.in_progress_on_time"),
                percent: (onScheduleP / totalJobsP)
            })
            _dataConfig.push({
                item: t("workReportByPerson.chart.completed_on_time"),
                percent: (completedOnTimeP / totalJobsP)
            })
            _dataConfig.push({
                item: t("workReportByPerson.chart.completed_late"),
                percent: (completedLateP / totalJobsP)
            })
            _dataConfig.push({
                item: t("workReportByPerson.chart.in_progress_late"),
                percent: (currentlyBehindScheduleP / totalJobsP)
            })
            setDataConfig(_dataConfig);
            setSummary([{
                completedOnTime: completedOnTimeP,
                completedLate: completedLateP,
                onSchedule: onScheduleP,
                currentlyBehindSchedule: currentlyBehindScheduleP,
                totalJobs: totalJobsP,
            }])
        }
    }
    const onFinish = async () => {
        if (page !== 1)
            setPage(1);
        else {
            loadData();
        }
    }
    const resetSearch = () => {
        form.resetFields();
        if (page !== 1)
            setPage(1);
        else {
            loadData();
        }
    };
    const onChangePagination = (value) => {
        setPage(value);
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

    const handleExportExcel = async () => {
        const value = form.getFieldsValue();
        if (value.startDate === null || value.endDate === null) {
            return ShowError('topRight', t("common.notifications"), t("common.messages.fill_in_complete_date"))
        }
        try {
            const payload = {
                page: 1,
                limit: totalRecord,
                ...value,
            };
            const res = await _unitOfWork.workReportByPerson.getWorkReportByPerson(payload)
            const list = res?.reports;

            const processedData = prepareDataForExcel(list, t);
            const excelCols = [
                { header: t("customer.export.index"), key: "stt" },
                ...transformColumnsForExcel(columns),
            ];
            exportExcel(processedData, excelCols, "BaoCao.xlsx", t);
        } catch (error) {
            console.error("Lỗi xuất Excel: ", error);
        }
    };
    const prepareDataForExcel = (list, t) => {
        return list.map(item => {
            return {
                ...item,
            }
        });
    };
    const transformColumnsForExcel = (antdColumns) => {
        return antdColumns
            .filter(col => col.key !== "action" && col.dataIndex !== "action" && col.key !== "id")
            .map(col => {
                if (col.excelKey === 'no_value') {
                    return;
                }
                const base = {
                    header: col.title,
                    key: col.excelKey || (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex) || col.key,
                };
                if (col.children) {
                    base.children = transformColumnsForExcel(col.children); // Đệ quy giữ lại con
                }
                return base;
            }).filter(Boolean);;
    };
    const exportExcel = (data, columns, fileName = "BaoCao.xlsx", t) => {
        const headerRow1 = []; // Hàng tiêu đề chính (cấp 1)
        const headerRow2 = []; // Hàng tiêu đề phụ (cấp 2)
        const merges = [];      // Mảng gộp ô
        const flattenedCols = []; // map dữ liệu dòng 

        let currentColIdx = 0;

        columns.forEach((col) => {
            if (col.children) {
                headerRow1.push(col.header);
                // Gộp hàng 1 từ vị trí hiện tại đến hết số lượng con
                merges.push({
                    s: { r: 0, c: currentColIdx },
                    e: { r: 0, c: currentColIdx + col.children.length - 1 }
                });

                col.children.forEach((child, idx) => {
                    if (idx > 0) headerRow1.push(""); // Đẩy ô trống cho hàng 1 để giữ vị trí
                    headerRow2.push(child.header);
                    flattenedCols.push(child);
                });
                currentColIdx += col.children.length;
            } else {
                headerRow1.push(col.header);
                headerRow2.push(""); // Ô trống ở hàng 2 bên dưới
                // Gộp hàng 1 và hàng 2 theo chiều dọc (Vertical Merge)
                merges.push({
                    s: { r: 0, c: currentColIdx },
                    e: { r: 1, c: currentColIdx }
                });
                flattenedCols.push(col);
                currentColIdx++;
            }
        });

        // 2. Chuẩn bị dữ liệu các hàng (Rows)
        const worksheetData = [headerRow1, headerRow2];

        data.forEach((item, index) => {
            const row = flattenedCols.map(col => {
                if (col.key === "stt") return index + 1;
                const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
                return (value !== null && value !== undefined) ? value : "";
            });
            worksheetData.push(row);
        });

        const ws = utils.aoa_to_sheet(worksheetData);
        ws["!merges"] = merges; // Gán cấu trúc gộp ô

        const range = utils.decode_range(ws['!ref']);
        for (let R = 2; R <= range.e.r; ++R) {
            for (let C = 0; C <= range.e.c; ++C) {
                const cell = ws[utils.encode_cell({ r: R, c: C })];
                if (cell && typeof cell.v === 'number') {
                    cell.t = 'n';
                    cell.z = '#,##0'; // Định dạng 1,000,000
                }
            }
        }

        ws["!cols"] = flattenedCols.map((_, i) => ({ wpx: i === 0 ? 50 : 120 }));

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "BaoCao");
        const wbout = write(wb, { bookType: "xlsx", type: "array" });

        FileSaver.saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
    };

    const listWorkPath = reportStaticPath.listWorkReportByPerson;
    const renderLink = (value, record, listKey, label, color) => {
        // Nếu giá trị = 0 hoặc không có danh sách ID thì chỉ hiện số
        if (!value || value === 0 || (!record[listKey] && listKey !== 'all')) {
            return value;
        }
        const allWork = [
            ...record.completedOnTimeIds,
            ...record.completedLateIds,
            ...record.onScheduleIds,
            ...record.currentlyBehindScheduleIds,
        ];

        return (
            <a
                style={{ fontWeight: 'bold', color: color, textDecoration: 'underline' }}
                onClick={() => {
                    navigate(listWorkPath, {
                        state: {
                            userId: record._id,
                            userName: record.userName,
                            workList: listKey === 'all' ? allWork : record[listKey],
                            typeLabel: label,
                            dateRange: {
                                startDate: form.getFieldValue('startDate')?.toISOString(),
                                endDate: form.getFieldValue('endDate')?.toISOString()
                            }
                        }
                    });
                }}
            >
                {value}
            </a>
        );
    };
    const STATUS_COLORS = {
        completedOnTime: '#52c41a',        // xanh lá
        completedLate: '#faad14',          // vàng
        onSchedule: '#1890ff',             // xanh dương
        currentlyBehindSchedule: '#f5222d',// đỏ
        noData: '#d9d9d9' // xám
    };

    const WorkProgressBar = ({ record }) => {
        const {
            completedOnTime = 0,
            completedLate = 0,
            onSchedule = 0,
            currentlyBehindSchedule = 0,
            totalJobs = 0
        } = record;

        const hasData =
            completedOnTime +
            completedLate +
            onSchedule +
            currentlyBehindSchedule > 0;

        // Không có dữ liệu
        if (!hasData) {
            return (
                <div
                    style={{
                        height: 14,
                        width: '100%',
                        background: STATUS_COLORS.noData,
                        borderRadius: 4
                    }}
                    title="Không có công việc"
                />
            );
        }

        const calcWidth = (value) => `${(value / totalJobs) * 100}%`;

        return (
            <div
                style={{
                    display: 'flex',
                    height: 14,
                    width: '100%',
                    background: '#f0f0f0',
                    borderRadius: 4,
                    overflow: 'hidden'
                }}
                title={`Tổng công việc: ${totalJobs}`}
            >
                {completedOnTime > 0 && (
                    <div
                        style={{
                            width: calcWidth(completedOnTime),
                            background: STATUS_COLORS.completedOnTime
                        }}
                        title={`Hoàn thành đúng hạn: ${completedOnTime}`}
                    />
                )}
                {completedLate > 0 && (
                    <div
                        style={{
                            width: calcWidth(completedLate),
                            background: STATUS_COLORS.completedLate
                        }}
                        title={`Hoàn thành trễ: ${completedLate}`}
                    />
                )}
                {onSchedule > 0 && (
                    <div
                        style={{
                            width: calcWidth(onSchedule),
                            background: STATUS_COLORS.onSchedule
                        }}
                        title={`Đang làm đúng hạn: ${onSchedule}`}
                    />
                )}
                {currentlyBehindSchedule > 0 && (
                    <div
                        style={{
                            width: calcWidth(currentlyBehindSchedule),
                            background: STATUS_COLORS.currentlyBehindSchedule
                        }}
                        title={`Đang trễ: ${currentlyBehindSchedule}`}
                    />
                )}
            </div>
        );
    };


    const columns = [
        {
            title: t("modal.common.table.index"),
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t("workReportByPerson.name"),
            dataIndex: "userName",
            sorter: true,
            sortIcon: ({ sortOrder }) => {
                if (sortOrder === 'ascend') return <CaretUpOutlined style={{ color: '#1890ff' }} />;
                if (sortOrder === 'descend') return <CaretDownOutlined style={{ color: '#1890ff' }} />;
                return <CaretUpOutlined style={{ color: '#1890ff' }} />;
            },
            sortDirections: ['descend', 'ascend', 'descend'],
            width: 250,
            excelKey: "userName",
            render: (text) => <span>{text}</span>
        },
        {
            title: "",
            width: 150,
            excelKey: "no_value",
            render: (_, record) => <WorkProgressBar record={record} />
        },
        {
            title: t("workReportByPerson.work"),
            dataIndex: "totalJobs",
            align: "center",
            render: (value, record) =>
                <span style={{ color: '#1d1919', fontWeight: 600 }}>
                    {renderLink(value, record, 'all', "", '#1d1919')}
                </span>
        },
        {
            title: t("workReportByPerson.completed"),
            align: "center",
            children: [
                {
                    title: t("workReportByPerson.on_time"),
                    dataIndex: "completedOnTime",
                    align: "center",
                    render: (value, record) =>
                        <span style={{ color: STATUS_COLORS.completedOnTime, fontWeight: 600 }}>
                            {renderLink(value, record, 'completedOnTimeIds', t("workReportByPerson.on_time"), STATUS_COLORS.completedOnTime)}
                        </span>
                },
                {
                    title: t("workReportByPerson.late"),
                    dataIndex: "completedLate",
                    align: "center",
                    render: (value, record) =>
                        <span style={{ color: STATUS_COLORS.completedLate, fontWeight: 600 }}>
                            {renderLink(value, record, 'completedLateIds', t("workReportByPerson.late"), STATUS_COLORS.completedLate)}
                        </span>
                },
            ]
        },
        {
            title: t("workReportByPerson.in_progress"),
            align: "center",
            children: [
                {
                    title: t("workReportByPerson.on_time"),
                    dataIndex: "onSchedule",
                    align: "center",
                    render: (value, record) =>
                        <span style={{ color: STATUS_COLORS.onSchedule, fontWeight: 600 }}>
                            {renderLink(value, record, 'onScheduleIds', `${t("workReportByPerson.in_progress")} - ${t("workReportByPerson.on_time")}`, STATUS_COLORS.onSchedule)}
                        </span>
                },
                {
                    title: t("workReportByPerson.late"),
                    dataIndex: "currentlyBehindSchedule",
                    align: "center",
                    render: (value, record) =>
                        <span style={{ color: STATUS_COLORS.currentlyBehindSchedule, fontWeight: 600 }}>
                            {renderLink(value, record, 'currentlyBehindScheduleIds', `${t("workReportByPerson.in_progress")} - ${t("workReportByPerson.late")}`, STATUS_COLORS.currentlyBehindSchedule)}
                        </span>
                },
            ]
        },
    ];
    const config = {
        data: dataConfig,
        angleField: 'percent',
        colorField: 'item',
        radius: 0.8,
        height: 330,
        label: {
            position: 'outside',
            text: (data) => data.percent > 0 ? `${data.item}: ${(data.percent * 100).toFixed(2)}%` : '',
        },
        tooltip: {
            items: [
                (data) => ({
                    name: data.item,
                    value: `${(data.percent * 100).toFixed(2)}%`,
                }),
            ],
        },
    };
    return (
        <Card className='p-3'>
            <Form form={form} onFinish={onFinish}
                initialValues={{
                    startDate: dayjs().subtract(7, "day").startOf("day"),
                    endDate: dayjs().endOf("day"),
                }}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={16}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label={t("serviceContractor.userMapping.columns.user_name")}
                                    name="userName"
                                >
                                    <Input
                                        placeholder={t("serviceContractor.userMapping.columns.user_name")}
                                    />
                                </Form.Item>
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
                        </Row>
                        <Row gutter={16}>
                            <Col span={18} style={{ marginTop: 0 }}>
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
                        </Row>
                        <Row>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontWeight: 600,
                                    border: "1px solid #bdbdbd",
                                    marginTop: "16px"
                                }}
                            >
                                <thead>
                                    <tr style={{ background: "#19a7b7", color: "#fff" }}>
                                        <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("workReportByPerson.work")}</th>
                                        <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("workReportByPerson.chart.completed_on_time")}</th>
                                        <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("workReportByPerson.chart.completed_late")}</th>
                                        <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("workReportByPerson.chart.in_progress_on_time")}</th>
                                        <th style={{ border: "1px solid #bdbdbd", padding: 3 }}>{t("workReportByPerson.chart.in_progress_late")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ background: "#ccc", color: "#fff", textAlign: "center" }}>
                                        <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{summary[0]?.totalJobs}</td>
                                        <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{summary[0]?.completedOnTime}</td>
                                        <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{summary[0]?.completedLate}</td>
                                        <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{summary[0]?.onSchedule}</td>
                                        <td style={{ border: "1px solid #bdbdbd", padding: 3 }}>{summary[0]?.currentlyBehindSchedule}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Pie {...config} />
                    </Col>
                </Row>
                <Col span={24} style={{ textAlign: "right", marginTop: "auto" }}>
                    <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
                        {t("breakdown.common.total", {
                            count: totalRecord ? totalRecord : 0,
                        })}
                    </span>
                </Col>
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
            </Form>
        </Card>
    );
};

export default WorkReportByPerson;