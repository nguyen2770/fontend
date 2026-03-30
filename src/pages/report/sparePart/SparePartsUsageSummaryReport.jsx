import { useEffect, useState } from "react";
import { Button, Card, Checkbox, Col, DatePicker, Dropdown, Form, Pagination, Row, Select, Table, Tooltip } from "antd";
import { FileExcelOutlined, FilePdfOutlined, MenuOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import { FORMAT_DATE, PAGINATION } from "../../../utils/constant";
import { utils, write } from "xlsx";
import FileSaver from "file-saver";
import { dropdownRender, filterOption } from "../../../helper/search-select-helper";
import ExportPdf from "./exportPdf";
import { pdf } from "@react-pdf/renderer";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import useHeader from "../../../contexts/headerContext";
import { staticPath } from "../../../router/routerConfig";
import { useTranslation } from "react-i18next";
import "../../report/assetMaintenance/index.scss";

export default function SparePartsUsageSummaryReport() {
    const { t } = useTranslation();
    const firstDayOfMonth = dayjs().startOf("month");
    const [searchParams, setSearchParams] = useState({
        spareSubCategoryId: "",
        sparePart: "",
        spareCategoryId: "",
        startDate: firstDayOfMonth,
        endDate: "",
    });
    const columns = [
        {
            title: t("report.spareUsageSummary.columns.index"),
            dataIndex: "stt",
            key: "stt",
            align: "center",
            width: 50,
            disabled: true,
            render(_, record, index) {
                return <span>{(pagination.page - 1) * pagination.limit + index + 1}</span>
            }
        },
        {
            title: t("report.spareUsageSummary.columns.spare_category"),
            dataIndex: "spareCategory",
            key: "spareCategoryId",
            defaultVisible: false,
            width: 180,
            render: (text) => (
                <span>{text?.spareCategoryName}</span>
            )
        },
        {
            title: t("report.spareUsageSummary.columns.spare_sub_category"),
            dataIndex: "spareSubCategory",
            key: "spareSubCategoryId",
            width: 200,
            defaultVisible: false,
            render: (text) => (
                <span>{text?.spareSubCategoryName}</span>
            )
        },
        {
            title: t("report.spareUsageSummary.columns.manufacturer"),
            dataIndex: "manufacturer",
            key: "manufacturer",
            width: 160,
            defaultVisible: false,
            render: (text) => (
                <span>{text?.manufacturerName}</span>
            )
        },
        {
            title: t("report.spareUsageSummary.columns.spare_part_id"),
            dataIndex: "sparePart",
            key: "code",
            width: 120,
            disabled: true,
            render: (text) => (
                <span>{text?.code}</span>
            )
        },
        {
            title: t("report.spareUsageSummary.columns.spare_part_name"),
            dataIndex: "sparePart",
            key: "sparePartsName",
            width: 200,
            render: (text) => (
                <span>{text?.sparePartsName}</span>
            )
        },
        {
            title: t("report.spareUsageSummary.columns.transaction_qty"),
            dataIndex: "qty",
            key: "transactionQty",
            align: "right",
            width: 120,
        },
        {
            title: t("report.spareUsageSummary.columns.uom"),
            dataIndex: "uom",
            key: "uom",
            align: "center",
            width: 70,
            render: (text) => (
                <span>{text?.uomName}</span>
            )
        },
        {
            title: t("report.spareUsageSummary.columns.description"),
            dataIndex: "sparePart",
            key: "description",
            width: 220,
            defaultVisible: false,
            render: (text) => (
                <span>{text?.description}</span>
            )
        },
        {
            title: "Action", 
            dataIndex: "action",
            align: "center",
            fixed: "right",
            width: 80,
            disabled: true,
            render: (_, record) => (
                <Tooltip title={t("report.spareUsageSummary.action_goto_detail")}>
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        size="small"
                        onClick={() => {
                            const params = Object.fromEntries(
                                Object.entries({
                                    ...searchParams,
                                    sparePart: record.sparePart._id,
                                    startDate: searchParams.startDate
                                        ? dayjs(searchParams.startDate).toISOString()
                                        : undefined,
                                    endDate: searchParams.endDate
                                        ? dayjs(searchParams.endDate).toISOString()
                                        : undefined,
                                }).filter(([_, v]) => v !== undefined && v !== null && v !== "")
                            );

                            const query = new URLSearchParams(params).toString();
                            window.open(`${staticPath.spareMovementReport}?${query}`, "_blank");
                        }}

                    >

                    </Button>
                </Tooltip>
            )
        }
    ];
    const { setHeaderTitle } = useHeader();
    const [searchForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState(
        [
            ...columns.filter(c => c.disabled || c.defaultVisible !== false).map(c => c.key)
        ]
    );
    const [tempKeys, setTempKeys] = useState(selectedKeys);
    const [data, setData] = useState([])
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [spareParts, setSpareParts] = useState([]);
    const [spareCategories, setSpareCategories] = useState([]);
    const [spareSubCategories, setSubSpareCategories] = useState([]);


    useEffect(() => {
        setHeaderTitle(t("report.spareUsageSummary.title"))
        getSpareParts();
        getSpareCategories();
        getSpareSubCategories();
        searchForm.setFieldsValue({ startDate: firstDayOfMonth })
    }, [])


    useEffect(() => {
        getSparePartsUsageSummary();
    }, [page, searchParams, pagination])

    const onChangePagination = (value) => {
        setPage(value);
        setPagination(prev => ({ ...prev, page: value }));
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
            spareSubCategoryId: "",
            sparePart: "",
            spareCategoryId: "",
            startDate: firstDayOfMonth,
            endDate: "",
        });
        setPage(1);

    };

    const getSpareParts = async () => {
        const res = await _unitOfWork.sparePart.getSpareParts();
        if (res?.data) {
            setSpareParts(res.data)
        }
    }

    const getSpareCategories = async () => {
        const res = await _unitOfWork.spareCategory.getSpareCategories();
        if (res?.data) {
            setSpareCategories(res.data.results)
        }
    }

    const getSpareSubCategories = async () => {
        const res = await _unitOfWork.spareSubCategory.getSpareSubCategories();
        if (res?.data) {
            setSubSpareCategories(res.data.results)
        }
    }


    const onSearch = (values) => {
        setSearchParams({
            ...values,
        });
        setPage(1);
    };

    const getSparePartsUsageSummary = async () => {
        const payload = {
            page: page,
            limit: pagination.limit,
            ...searchForm.getFieldsValue()
        }
        const res = await _unitOfWork.report.getSparePartsUsageSummary(payload);
        if (res && res.code === 1) {
            setData(res.data.data)
            setTotalRecord(res.data.total)
        }

    }

    const menu = (
        <div
            style={{
                width: 220,
                padding: 8,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                borderRadius: 4
            }}>

            <div
                style={{
                    maxHeight: 180,
                    overflowY: "auto",
                    borderTop: "1px solid #eee",
                    borderBottom: "1px solid #eee",
                    padding: "8px 0",
                    marginBottom: 8
                }}
            >
                <Checkbox.Group
                    value={tempKeys}
                    onChange={setTempKeys}
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    {columns.map(c => (
                        <Checkbox key={c.key} value={c.key} disabled={c.disabled}>
                            {c.title}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            </div>

            <div style={{ textAlign: "right" }}>
                <Button size="small" onClick={handleCancel} style={{ marginRight: 8 }}>
                    {t("report.spareUsageDetail.column_selector.cancel")}
                </Button>
                <Button size="small" type="primary" onClick={handleApply}>
                    {t("report.spareUsageDetail.column_selector.apply")}
                </Button>
            </div>
        </div>
    );



    const filteredColumns = columns.filter(c => selectedKeys.includes(c.key));


    const transformExportData = (data, selectedCols) => {
        return data.map((row, index) => {
            const obj = {};
            selectedCols.forEach((col) => {
                let value;
                if (col.render) {
                    value = col.render(row[col.dataIndex], row, index);
                    if (typeof value === "object" && value?.props?.children) {
                        value = value.props.children;
                    }
                } else {
                    value = row[col.dataIndex];
                }
                obj[col.title] = value ?? "";
            });
            return obj;
        });
    };

    const exportToExcel = async () => {
        const dataExport = await _unitOfWork.report.getSparePartsUsageSummary({ limit: totalRecord });
        const columnsFiltered = filteredColumns.filter(item => item.title != "Action")
        const exportData = transformExportData(dataExport?.data?.data, columnsFiltered);

        const ws = utils.json_to_sheet(exportData);
        const colWidths = Object.keys(exportData[0] || {}).map((key) => {
            const maxLength = Math.max(
                key.length,
                ...exportData.map((row) => (row[key] ? row[key].toString().length : 0))
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
        FileSaver.saveAs(blob, `spare_parts_${timestamp}.xlsx`);
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
            const dataExport = await _unitOfWork.report.getSparePartsUsageSummary({ limit: totalRecord });
            const columnsFiltered = filteredColumns.filter(item => item.title !== "Action")
            const transform = transformExportData(dataExport.data.data, columnsFiltered);
            const startDate = searchParams?.startDate
                ? dayjs(searchParams.startDate).format("DD/MM/YYYY")
                : "";
            const endDate = searchParams?.endDate
                ? dayjs(searchParams.endDate).format("DD/MM/YYYY")
                : "";

            const exportData = normalizeData(transform, columnsFiltered)
            const blob = await pdf(<ExportPdf
                data={exportData}
                columns={columnsFiltered}
                dateHeader={{
                    startDate,
                    endDate
                }} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Export PDF error:", err);
        }
    }


    return (
        <Card >

            <Form
labelWrap
                className="search-form report-filter-row"
                form={searchForm}
                layout="vertical"
                onFinish={onSearch}
            >
                <Row gutter={32}>
                    <Col span={6}>
                        <Form.Item label={t("report.common.labels.spare_category")} labelAlign="left" name="spareCategoryId">
                            <Select
                                allowClear
                                placeholder={t("report.common.placeholders.choose_spare_category")}
                                showSearch
                                options={spareCategories?.map((item) => ({
                                    value: item.id,
                                    label: item.spareCategoryName,
                                }))}
                                mode="multiple"
                                dropdownStyle={dropdownRender}
                                filterOption={filterOption}
                            ></Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label={t("report.common.labels.spare_sub_category")} labelAlign="left" name="spareSubCategoryId">
                            <Select
                                allowClear
                                placeholder={t("report.common.placeholders.choose_spare_sub_category")}
                                showSearch
                                options={spareSubCategories?.map((item) => ({
                                    value: item._id,
                                    label: item.spareSubCategoryName,
                                }))}
                                mode="multiple"
                                dropdownStyle={dropdownRender}
                                filterOption={filterOption}
                            ></Select>
                        </Form.Item>
                    </Col>


                    <Col span={6}>
                        <Form.Item name="startDate" label={t("report.common.labels.from_date")}>
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

                    <Col span={6}>
                        <Form.Item label={t("report.common.labels.spare_part")} name="sparePart">
                            <Select
                                allowClear
                                placeholder={t("report.common.placeholders.choose_spare_part")}
                                showSearch
                                options={spareParts?.map((item) => ({
                                    value: item.id,
                                    label: item.sparePartsName,
                                }))}
                                mode="multiple"
                                dropdownStyle={dropdownRender}
                                filterOption={filterOption}
                            ></Select>
                        </Form.Item>
                    </Col>



                </Row>
                <Row className="mb-1">
                    <Col span={12}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            {t("report.common.buttons.search")}
                        </Button>
                        <Button className="bt-green mr-2" onClick={resetSearch}>
                            <RedoOutlined />
                            {t("report.common.buttons.reset")}
                        </Button>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>

                        <Tooltip title={t("report.common.misc.add_column")}>

                            <Dropdown
                                overlay={menu}
                                trigger={["click"]}
                                type="primary"

                            >
                                <Button
                                    className="button mr-2"
                                >

                                    <MenuOutlined />
                                </Button>

                            </Dropdown>
                        </Tooltip>

                        <Tooltip title={t("report.common.buttons.export_excel")}>
                            <Button
                                className="button mr-2"
                                onClick={() => exportToExcel()}
                            >
                                <FileExcelOutlined />
                            </Button>
                        </Tooltip>

                        <Tooltip title={t("report.common.buttons.export_pdf")}>
                            <Button
                                className="button"
                                onClick={() => { onClickPDFExport() }}
                            >
                                <FilePdfOutlined />
                            </Button>
                        </Tooltip>


                    </Col>
                    <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
                        <b>{t("report.common.table.total", { count: totalRecord || 0 })}</b>
                    </Col>

                </Row>




                <Table
                    columns={filteredColumns}
                    bordered
                    scroll={{ x: "max-content" }}
                    dataSource={data}
                    pagination={false}
                    rowKey={(record) => record._id || record.id}
                >

                </Table>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    justifyContent: "flex-end",
                    marginTop: 3
                }}>
                    <span>{t("report.common.table.records")}</span>
                    <Select
                        value={pagination.limit}
                        onChange={(value) => {

                            setPagination((prev) => ({
                                ...prev,
                                limit: value,
                                page: 1,
                            }))
                            setPage(1)
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

        </Card >
    );
}