import { useEffect, useState } from "react";
import useHeader from "../../../contexts/headerContext";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { Button, Col, Divider, Form, Pagination, Row, Select, Table, Tooltip } from "antd";
import { EyeFilled, EyeOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { filterOption } from "../../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
import ModelDetailStock from "../../../components/modal/ModelDetailStock";

const SparePartsInventory = () => {
    const [data, setData] = useState();
    const { setHeaderTitle } = useHeader();
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useState({});
    const [spareParts, setSpareParts] = useState([]);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchForm] = Form.useForm();
    const { t } = useTranslation();
    const [locationData, setLocationData] = useState([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [detailData, setDetailData] = useState();

    useEffect(() => {
        setHeaderTitle(t("inventory.header.spareParts"));
        fetchSpareParts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        fetchSparePartsByStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchParams]);

    useEffect(() => {
        const totalPages = Math.ceil(totalRecord / pagination.limit);
        if (page > totalPages) {
            setPage(totalPages || 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalRecord])

    const onChangePagination = (value) => {
        setPage(value);
    };

    const fetchSparePartsByStatus = async () => {
        try {
            let payload = {
                page: page,
                limit: PAGINATION.limit,
                ...searchParams,
            }
            const res = await _unitOfWork.inventory.getSpareParts({ ...payload });
            if (res) {
                setData(res?.totalLocation?.results);
                setLocationData(res?.locationData)
                setTotalRecord(res?.totalLocation?.totalResults);
            }
        }
        catch (error) {
            console.error("Failed to fetch spare parts:", error);
        }
    }

    const fetchSpareParts = async () => {
        const res = await _unitOfWork.sparePart.getSpareParts();
        if (res) {
            setSpareParts(res.data);
        }
    }

    const onSearch = () => {
        pagination.page = 1;
        setSearchParams({ ...searchForm.getFieldsValue() });
    };
    const resetSearch = () => {
        searchForm.resetFields();
        setSearchParams({});
    };

    const handleShowDetail = async (data) => {
        setIsOpenDetail(true);
        setDetailData(data);
    }

    const columns = [
        {
            title: t("inventory.table.stt"),
            dataIndex: "key",
            width: "60px",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("inventory.table.code"),
            dataIndex: "sparePartInfo",
            className: "text-left-column",
            align: "center",
            render: (text) => (
                <span>{text.code}</span>
            )
        },
        {
            title: t("inventory.table.sparePartName"),
            dataIndex: "sparePartInfo",
            className: "text-left-column",
            align: "center",
            render: (text) => (
                <span>{text.sparePartsName}</span>
            )
        },
        {
            title: t("inventory.table.importQty"),
            dataIndex: "importQty",
            className: "text-right-column",
        },
        {
            title: t("inventory.table.exportQty"),
            dataIndex: "exportQty",
            className: "text-right-column",
            align: "center",
        },
        {
            title: t("inventory.table.inStock"),
            dataIndex: "totalQty",
            className: "text-right-column",
            align: "center",
        },
        {

            dataIndex: "action",
            align: "center",
            render: (_, record) => (
                <>
                    <Tooltip title={t("Chi tiết")}>
                        <Button
                            type="primary"
                            danger
                            icon={<EyeOutlined />}
                            size="small"
                            style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}
                            onClick={() => handleShowDetail(record)}
                        />
                    </Tooltip>
                </>
            )
        }
    ];

    return (
        <div className="p-3" >
            <Form
                labelWrap
                className="search-form"
                form={searchForm}
                layout="vertical"
                onFinish={onSearch}
            >
                <Row gutter={32}>
                    <Col span={6}>
                        <Form.Item
                            id=""
                            labelAlign="left"
                            label={t("inventory.spareParts.form.sparePart")}
                            name="sparePartId"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("inventory.spareParts.placeholders.selectSparePart")}
                                options={spareParts.map(sp => ({
                                    value: sp.id,
                                    label: sp.sparePartsName
                                }))}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="mb-1">
                    <Col span={12}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            {t("inventory.actions.search")}
                        </Button>
                        <Button className="bt-green mr-2" onClick={resetSearch}>
                            <RedoOutlined />
                            {t("inventory.actions.reset")}
                        </Button>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        {/* Optional actions */}
                    </Col>
                </Row>

                <Table
                    rowKey="id"
                    columns={columns}
                    key={"id"}
                    dataSource={data}
                    bordered
                    pagination={false}
                />
                <Pagination
                    className="pagination-table mt-2"
                    onChange={onChangePagination}
                    pageSize={pagination.limit}
                    total={totalRecord}
                />
                {/* {
                    locationData
                        .filter(ld => ld.inventory?.results?.length > 0)
                        .map(ld => (
                            <>
                                <Divider style={{ color: "#fff" }}>{ld.name}</Divider>
                                <Table
                                    rowKey="id"
                                    columns={columns}
                                    dataSource={ld.inventory.results.map(item => ({
                                        ...item,
                                        locationId: ld.id,
                                    }))}
                                    bordered
                                />
                            </>
                        ))
                } */}
                <ModelDetailStock
                    open={isOpenDetail}
                    handleCancel={() => setIsOpenDetail(false)}
                    data={detailData}
                />

            </Form>
        </div>
    );
};

export default SparePartsInventory;