import { Card, Row, Form, Table, Col, Pagination, Input, Button, DatePicker, Radio, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { depreciationTypes, FORMAT_DATE, PAGINATION, reportView } from "../../../utils/constant";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { FilePdfOutlined, FilterOutlined, PrinterOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import useHeader from "../../../contexts/headerContext";
import dayjs from "dayjs";
import './index.scss';
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { formatMillisToHHMM, parseDate } from "../../../helper/date-helper";
import { utils, write } from "xlsx";
import FileSaver from "file-saver";
import ShowError from "../../../components/modal/result/errorNotification";
import { pdf } from "@react-pdf/renderer";
import PdfAssetDepreciationSummary from "./PdfAssetDepreciationSummary";
import PdfAssetDepreciationDetail from "./PdfAssetDepreciationDetail";
import PdfAssetDepreciationDetail2 from "./PdfAssetDepreciationDetail2";

export default function AssetMaintenanceDepreciationReport() {
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeader();
    const [searchForm] = Form.useForm();
    const [onChangeOption, setOnChangeOption] = useState(reportView.summary);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchParams, setSearchParams] = useState(null);
    const [assetMaintenanceDepreciation, setAssetMaintenanceDepreciation] = useState([]);
    const [totalValue, setTotalValue] = useState([]);
    const [selectionType, setSelectionType] = useState('checkbox');
    const [selectedRowDatas, setSelectedRowDatas] = useState([]);

    useEffect(() => {
        setHeaderTitle(t("report.assetDepreciation.title"));
    }, []);

    useEffect(() => {
        fetchGetAssetDepreciationReport();
        fetchGetTotalReport();
    }, [onChangeOption, page]);

    useEffect(() => {
        if (totalRecord > 0)
            fetchGetTotalReport();
    }, [totalRecord]);

    const fetchGetAssetDepreciationReport = async () => {
        const payload = {
            page: page,
            limit: pagination.limit,
            ...searchForm.getFieldValue(),
        }
        if (onChangeOption === reportView.summary) {
            const res = await _unitOfWork.reportAssetDepreciation.getAssetDepreciationReport(payload);
            if (res && res.code === 1) {
                setAssetMaintenanceDepreciation(res?.reports);
                setTotalRecord(res.totalResults);
            }
        } else {
            const res = await _unitOfWork.reportAssetDepreciation.getDetailAssetDepreciationReport(payload);
            if (res && res.code === 1) {
                setAssetMaintenanceDepreciation(res?.reports);
                setTotalRecord(res.totalResults);
            }
        }

    };

    const fetchGetTotalReport = async () => {
        const payload = {
            page: 1,
            limit: totalRecord,
            ...searchForm.getFieldValue(),
        }
        // const t = `Tổng ${totalRecord} bản ghi: `;
        const text = t("report.assetDepreciation.label.total_count", { count: totalRecord });
        if (onChangeOption === reportView.summary) {
            const res = await _unitOfWork.reportAssetDepreciation.getAssetDepreciationReport(payload);
            if (res && res.code === 1) {
                const fieldsToSum = [
                    'originValue',
                    'depreciableValue',
                    'accumulatedValue'
                ];
                const r = [
                    {
                        text: text,
                        ...calculateTotals(res?.reports, fieldsToSum),
                    }
                ];
                setTotalValue(r);
            }
        } else {
            const res = await _unitOfWork.reportAssetDepreciation.getDetailAssetDepreciationReport(payload);
            if (res && res.code === 1) {
                const fieldsToSum = [
                    'originValue',
                ];
                const filedsMonth = [
                    'month_1',
                    'month_2',
                    'month_3',
                    'month_4',
                    'month_5',
                    'month_6',
                    'month_7',
                    'month_8',
                    'month_9',
                    'month_10',
                    'month_11',
                    'month_12',
                    'total',
                ];
                const monthsData = res?.reports.map(record => record.depreciationMonths)
                    .filter(monthData => monthData !== null && monthData !== undefined);
                const r = [
                    {
                        text: text,
                        ...calculateTotals(res?.reports, fieldsToSum),
                        ...calculateTotals(monthsData, filedsMonth),
                    }
                ];
                setTotalValue(r);
            }
        }
    };

    const calculateTotals = (data, fields) => {
        if (!Array.isArray(data)) {
            return {};
        }
        const grandTotals = data.reduce((acc, record) => {
            fields.forEach(field => {
                const value = Number(record[field]) || 0;
                acc[field] = (acc[field] || 0) + value;
            });
            return acc;
        }, {});
        return grandTotals;
    }

    const onSearch = () => {
        setPage(1);;
        fetchGetAssetDepreciationReport();
        fetchGetTotalReport();
        setSelectedRowDatas([]);
    };

    const resetSearch = () => {
        setPage(1);;
        searchForm.resetFields();
        fetchGetAssetDepreciationReport();
        fetchGetTotalReport();
        setSelectedRowDatas([]);
    };

    const onChangePagination = (value) => {
        setPage(value);
        setPagination(prev => ({ ...prev, page: value }));
    };

    const formatNumber = (amount) => {
        if (typeof amount !== 'number' && typeof amount !== 'string') return null;
        const numberValue = parseFloat(amount);
        if (isNaN(numberValue)) return null;

        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2, // Không hiển thị số thập phân
            maximumFractionDigits: 2  // Không hiển thị số thập phân
        }).format(numberValue);
    };

    const handleExportExcel = async () => {
        const value = searchForm.getFieldsValue();
        // if (value.startDate === null || value.endDate === null) {
        //     return ShowError('topRight', t("common.notifications"), t("common.messages.fill_in_complete_date"))
        // }
        const isSummary = onChangeOption === reportView.summary;
        try {
            const payload = {
                page: 1,
                limit: totalRecord,
                // startDate: value.startDate,
                // endDate: value.endDate,
                reportView: onChangeOption,
                ...cleanEmptyValues(value),
            };
            const res = isSummary
                ? await _unitOfWork.reportAssetDepreciation.getAssetDepreciationReport(payload)
                : await _unitOfWork.reportAssetDepreciation.getDetailAssetDepreciationReport(payload);
            const list = res?.reports;

            const processedData = prepareDataForExcel(list, isSummary, t);

            if (totalValue && totalValue.length > 0) {
                const footer = totalValue[0];
                let footerRow = {};
                if (isSummary) {
                    footerRow = {
                        assetName: t(footer.text),
                        originValue: footer.originValue,
                        depreciableValue: footer.depreciableValue,
                        accumulatedValue: footer.accumulatedValue,
                    };
                } else {
                    footerRow = {
                        assetName: t(footer.text),
                        originValue: footer.originValue,
                        depreciationMonths: {
                            month_1: footer.month_1,
                            month_2: footer.month_2,
                            month_3: footer.month_3,
                            month_4: footer.month_4,
                            month_5: footer.month_5,
                            month_6: footer.month_6,
                            month_7: footer.month_7,
                            month_8: footer.month_8,
                            month_9: footer.month_9,
                            month_10: footer.month_10,
                            month_11: footer.month_11,
                            month_12: footer.month_12,
                            total: footer.total,
                        }
                    };
                }
                processedData.push(footerRow);
            }

            const excelCols = [
                { header: t("customer.export.index"), key: "stt" },
                ...transformColumnsForExcel(columns),
            ];
            exportExcel(processedData, excelCols, "BaoCao.xlsx", t);
        } catch (error) {
            console.error("Lỗi xuất Excel: ", error);
        }
    };
    const exportExcel = (data, columns, fileName = "BaoCao.xlsx", t) => {
        // if (!Array.isArray(data) || !columns || columns.length === 0) {
        //     ShowError('topRight', t("common.notifications"), t("Dữ liệu hoặc cấu hình cột không hợp lệ!"));
        //     return;
        // }

        // const header = columns.map(col => col.header);
        // const worksheetData = [header];

        // data.forEach((item, index) => {
        //     const row = columns.map(col => {
        //         if (col.key === "stt") return index + 1;

        //         const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
        //         return (value !== null && value !== undefined) ? value : "";
        //     });
        //     worksheetData.push(row);
        // });

        // const ws = utils.aoa_to_sheet(worksheetData);

        // const range = utils.decode_range(ws['!ref']);
        // for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        //     for (let C = range.s.c; C <= range.e.c; ++C) {
        //         const cellAddress = utils.encode_col(C) + (R + 1);
        //         if (!ws[cellAddress]) continue;

        //         const value = ws[cellAddress].v;
        //         if (typeof value === 'number') {
        //             ws[cellAddress].t = 'n';
        //             ws[cellAddress].z = '#,##0';
        //         }
        //     }
        // }

        // ws["!cols"] = columns.map((_, index) => ({
        //     wpx: index === 0 ? 50 : 120
        // }));
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
    const transformColumnsForExcel = (antdColumns) => {
        return antdColumns
            .filter(col => col.key !== "action" && col.dataIndex !== "action" && col.key !== "id")
            .map(col => {
                const base = {
                    header: col.title,
                    key: col.excelKey || (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex) || col.key,
                };
                if (col.children) {
                    base.children = transformColumnsForExcel(col.children); // Đệ quy giữ lại con
                }
                return base;
            });
    };
    const prepareDataForExcel = (list, isSummary, t) => {
        return isSummary
            ? list.map(item => {
                return {
                    ...item,
                    depreciationStartDate: parseDate(item?.depreciationStartDate),
                    originValue: Number(item?.originValue),
                    depreciableValue: Number(item?.depreciableValue),
                    accumulatedValue: Number(item?.accumulatedValue),
                }
            })
            : list.map(item => ({
                ...item,
                originValue: Number(item?.originValue || 0),
                depreciationMonths: {
                    month_1: Number(item?.depreciationMonths?.month_1 || 0),
                    month_2: Number(item?.depreciationMonths?.month_2 || 0),
                    month_3: Number(item?.depreciationMonths?.month_3 || 0),
                    month_4: Number(item?.depreciationMonths?.month_4 || 0),
                    month_5: Number(item?.depreciationMonths?.month_5 || 0),
                    month_6: Number(item?.depreciationMonths?.month_6 || 0),
                    month_7: Number(item?.depreciationMonths?.month_7 || 0),
                    month_8: Number(item?.depreciationMonths?.month_8 || 0),
                    month_9: Number(item?.depreciationMonths?.month_9 || 0),
                    month_10: Number(item?.depreciationMonths?.month_10 || 0),
                    month_11: Number(item?.depreciationMonths?.month_11 || 0),
                    month_12: Number(item?.depreciationMonths?.month_12 || 0),
                    total: Number(item?.depreciationMonths?.total || 0),
                }
            }));
    }
    const renderFooterTable = () => {
        const reports = totalValue[0];
        if (reports && reports.length === 0) {
            return null;
        }
        return (
            <>
                {onChangeOption === reportView.summary ? (
                    <Table.Summary fixed="bottom">
                        <Table.Summary.Row style={{ backgroundColor: '#f6f6f6', fontWeight: 'bold' }}>
                            <Table.Summary.Cell index={0} colSpan={7}>
                                {t(reports?.text)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7} align="right">
                                {formatNumber(reports?.originValue)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8} align="right">
                                {formatNumber(reports?.depreciableValue)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={9} align="right">
                                {formatNumber(reports?.accumulatedValue)}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                ) : (
                    <Table.Summary fixed="bottom">
                        <Table.Summary.Row style={{ backgroundColor: '#f6f6f6', fontWeight: 'bold' }}>
                            <Table.Summary.Cell index={0} colSpan={4}>
                                {t(reports?.text)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align="right">
                                {formatNumber(reports?.originValue)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align="right">
                                {formatNumber(reports?.month_1)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align="right">
                                {formatNumber(reports?.month_2)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7} align="right">
                                {formatNumber(reports?.month_3)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8} align="right">
                                {formatNumber(reports?.month_4)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={9} align="right">
                                {formatNumber(reports?.month_5)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={10} align="right">
                                {formatNumber(reports?.month_6)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={11} align="right">
                                {formatNumber(reports?.month_7)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={12} align="right">
                                {formatNumber(reports?.month_8)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={13} align="right">
                                {formatNumber(reports?.month_9)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={14} align="right">
                                {formatNumber(reports?.month_10)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={15} align="right">
                                {formatNumber(reports?.month_11)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={16} align="right">
                                {formatNumber(reports?.month_12)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={17} align="right">
                                {formatNumber(reports?.total)}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            </>
        );
    };

    const depreciationTypeMap = depreciationTypes.Options.reduce((acc, option) => {
        acc[option.value] = option.label;
        return acc;
    }, {});

    const onClickPdfExport = async () => {
        try {
            const date = onChangeOption === reportView.summary
                ? searchForm.getFieldValue(["reportCutoffDate"])
                : searchForm.getFieldValue(["reportCutoffYear"]);
            const payload = {
                page: 1,
                limit: selectedRowDatas.length > 0 ? selectedRowDatas.length : totalRecord,
                ...searchForm.getFieldValue(),
                assetIds: selectedRowDatas,
                reportCutoffDate: dayjs(date).endOf("year"),
                reportCutoffYear: date,
            }
            const details = await _unitOfWork.reportAssetDepreciation.getFullAssetDepreciationReport(payload);
            const data = {
                ...details,
                year: onChangeOption === reportView.summary
                    ? dayjs(searchForm.getFieldValue(["reportCutoffDate"])).year()
                    : dayjs(searchForm.getFieldValue(["reportCutoffYear"])).year(),
            };
            const blob = await pdf(<PdfAssetDepreciationDetail2 data={data} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Export PDF error:", err);
        }
    };
    const rowSelection = {
        selectedRowKeys: selectedRowDatas,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowDatas(selectedRowKeys);
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
        preserveSelectedRowKeys: true,
    };
    const columns = [
        {
            title: t("report.assetDepreciation.columns.index"),
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        ...(onChangeOption === reportView.summary
            ? [
                {
                    title: t("report.assetDepreciation.columns.asset_name"),
                    dataIndex: "assetName",
                    align: "left",
                    width: 200,
                },
                {
                    title: t("report.assetDepreciation.columns.serial"),
                    dataIndex: "serial",
                    align: "left",
                    width: 120,
                },
                // {
                //     title: t("assetMaintenance.form.fields.depreciation_type"),
                //     dataIndex: "depreciationType",
                //     align: "left",
                //     width: 160,
                //     render: (text) => {
                //         const labelKey = depreciationTypeMap[text];
                //         return labelKey ? t(labelKey) : text;
                //     }
                // },
                {
                    title: t("report.assetDepreciation.columns.depreciation_start_date"),
                    dataIndex: "depreciationStartDate",
                    align: "center",
                    width: 160,
                    render: (text) => {
                        if (!text) {
                            return null;
                        }
                        return moment(text).format("DD/MM/YYYY");
                    }
                },
                {
                    title: t("report.assetDepreciation.columns.usage_time"),
                    dataIndex: "usageTime",
                    align: "right",
                    width: 160,
                },
                {
                    title: t("report.assetDepreciation.columns.remaining_time"),
                    dataIndex: "remainingTime",
                    align: "right",
                    width: 160,
                },
                {
                    title: t("report.assetDepreciation.columns.origin_value"),
                    dataIndex: "originValue",
                    align: "right",
                    width: 160,
                    render: (text) => formatNumber(text),
                },
                {
                    title: t("report.assetDepreciation.columns.depreciable_value"),
                    dataIndex: "depreciableValue",
                    align: "right",
                    width: 160,
                    render: (text) => formatNumber(text),
                },
                {
                    title: t("report.assetDepreciation.columns.accumulated_value"),
                    dataIndex: "accumulatedValue",
                    align: "right",
                    width: 180,
                    render: (text) => formatNumber(text),
                },
            ]
            : [
                {
                    title: t("report.assetDepreciation.columns_detail.asset_name"),
                    dataIndex: "assetName",
                    align: "left",
                    width: 200,
                },
                {
                    title: t("report.assetDepreciation.columns_detail.serial"),
                    dataIndex: "serial",
                    align: "left",
                    width: 120,
                },
                {
                    title: t("report.assetDepreciation.columns_detail.origin_value"),
                    dataIndex: "originValue",
                    align: "right",
                    width: 120,
                    render: (text) => formatNumber(text),
                },
                {
                    title: t("report.assetDepreciation.columns_detail.monthly_depreciation_value"),
                    align: "center",
                    children: [
                        {
                            title: t("report.assetDepreciation.columns_detail.month_1"),
                            dataIndex: ["depreciationMonths", "month_1"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_2"),
                            dataIndex: ["depreciationMonths", "month_2"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_3"),
                            dataIndex: ["depreciationMonths", "month_3"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_4"),
                            dataIndex: ["depreciationMonths", "month_4"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_5"),
                            dataIndex: ["depreciationMonths", "month_5"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_6"),
                            dataIndex: ["depreciationMonths", "month_6"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_7"),
                            dataIndex: ["depreciationMonths", "month_7"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_8"),
                            dataIndex: ["depreciationMonths", "month_8"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_9"),
                            dataIndex: ["depreciationMonths", "month_9"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_10"),
                            dataIndex: ["depreciationMonths", "month_10"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_11"),
                            dataIndex: ["depreciationMonths", "month_11"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.month_12"),
                            dataIndex: ["depreciationMonths", "month_12"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                        {
                            title: t("report.assetDepreciation.columns_detail.total"),
                            dataIndex: ["depreciationMonths", "total"],
                            align: "right",
                            width: 100,
                            render: (text) => formatNumber(text),
                        },
                    ]
                },
            ]
        ),
        // {
        //     title: t("customer.table.action"),
        //     dataIndex: "action",
        //     align: "center",
        //     width: 100,
        //     render: (_, record) => (
        //         <div>
        //             <Tooltip title={t("report.common.buttons.export_pdf")}>
        //                 <Button
        //                     type="primary"
        //                     icon={<FilePdfOutlined />}
        //                     size="small"
        //                     onClick={() => onClickPdfExport(record)}
        //                 />
        //             </Tooltip>
        //         </div>
        //     ),
        // },
    ];

    return (
        <Card>
            <Form
labelWrap
                className="search-form"
                form={searchForm}
                layout="vertical"
                onFinish={onSearch}
                initialValues={{
                    reportCutoffDate: dayjs().endOf("day"),
                    reportCutoffYear: dayjs(),
                }}
            >
                <Row gutter={[16, 16]}
                    className="my-2"
                >
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
                </Row>
                <Row gutter={32} className="report-filter-row">
                    <Col span={6}>
                        <Form.Item
                            label={t("preventive.common.asset")}
                            name="assetName"
                        >
                            <Input
                                placeholder={t("assetMaintenance.form.placeholders.asset_name")}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={t("preventive.pdf.serial")}
                            name="serial"
                        >
                            <Input
                                placeholder={t("dashboard.inspection_calibration_due_date.enter_serial")}
                            />
                        </Form.Item>
                    </Col>
                    {onChangeOption === reportView.summary ? (
                        <Col span={6}>
                            <Form.Item
                                label={t("report.assetDepreciation.label.report_closing_date")}
                                name="reportCutoffDate"
                            >
                                <DatePicker
                                    format={FORMAT_DATE}
                                    placeholder={t(
                                        "report.assetDepreciation.label.placeholder_date"
                                    )}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    ) : (
                        <Col span={6}>
                            <Form.Item
                                label={t("report.assetDepreciation.label.report_closing_year")}
                                name="reportCutoffYear"
                            >
                                <DatePicker
                                    picker="year"
                                    placeholder={t("report.assetDepreciation.label.placeholder_year")}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>


                <div>
                    <Button type="primary" className="mr-2" htmlType="submit">
                        <SearchOutlined />
                        {t("common.buttons.search")}
                    </Button>
                    <Button className="bt-green mr-2" onClick={resetSearch}>
                        <RedoOutlined />
                        {t("common.buttons.reset")}
                    </Button>
                    <Button
                        title={t("report.common.misc.export")}
                        className='mr-2'
                        onClick={() => handleExportExcel()}
                    >
                        <PrinterOutlined />
                    </Button>
                    <Button
                        title={t("report.common.buttons.export_pdf")}
                        className='mr-2'
                        onClick={() => onClickPdfExport(selectedRowDatas)}
                    >
                        <FilePdfOutlined />
                    </Button>
                </div>
                <Row className="mt-4">
                    <Col span={24}>
                        <Table
                            rowSelection={{ type: selectionType, ...rowSelection }}
                            rowKey="_id"
                            columns={columns}
                            key="_id"
                            dataSource={assetMaintenanceDepreciation}
                            bordered
                            pagination={false}
                            scroll={{ x: "max-content" }}
                            summary={renderFooterTable}
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
}