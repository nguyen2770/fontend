import { PAGINATION } from "../../../utils/constant";
import { useEffect, useState } from "react";
import { Button, Col, Divider, Form, Input, Pagination, Row, Select, Table, Tooltip } from "antd";
import * as _unitOfWork from "../../../api";
import { EyeOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import useHeader from "../../../contexts/headerContext";
import { filterOption } from "../../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
import ModelDetailStock from "../../../components/modal/ModelDetailStock";

const AssetsInventory = () => {
    const [page, setPage] = useState(1);
    const { setHeaderTitle } = useHeader();
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [data, setData] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [searchForm] = Form.useForm();
    const { t } = useTranslation();
    const [locationData, setLocationData] = useState([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [detailData, setDetailData] = useState();

    useEffect(() => {
        setHeaderTitle(t("inventory.header.assets"));
        fetchAssetModel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        fetchGetListAssetModel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const fetchAssetModel = async () => {
        const res = await _unitOfWork.assetModel.getAllAssetModel();
        if (res) {
            setAssetModels(res.data);
        }
    }

    const onChangePagination = (value) => {
        setPage(value);
    };
    const onSearch = () => {
        pagination.page = 1;
        fetchGetListAssetModel();
    };
    const resetSearch = () => {
        searchForm.resetFields();
        fetchGetListAssetModel();
    };
    const fetchGetListAssetModel = async () => {
        let payload = {
            page: page,
            limit: PAGINATION.limit,
            ...searchForm.getFieldValue(),
        };
        const res = await _unitOfWork.inventory.getAssetModels(payload);
        if (res) {
            setData(res?.totalLocation?.results);
            setLocationData(res.locationData)
            setTotalRecord(res.totalLocation?.totalResults);
        }
    };

    const handleShowDetail = async (data) => {
        setIsOpenDetail(true);
        setDetailData(data);
    };

    const columns = [
        {
            title: t("inventory.table.stt"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("inventory.table.deviceName"),
            dataIndex: "asset",
            key: "asset",
            className: "text-left-column",
            render: (text) => {
                return <span>{text?.assetName ?? null}</span>;
            },
        },
        {
            title: t("inventory.table.model"),
            dataIndex: "assetModelInfo",
            key: "assetModelName",
            render: (text) => {
                return <span>{text?.assetModelName ?? null}</span>;
            },
        },
        {
            title: t("inventory.table.importQty"),
            dataIndex: "importQty",
            align: "center",
            className: "text-left-column",

        },
        {
            title: t("inventory.table.exportQty"),
            dataIndex: "exportQty",
            align: "center",
            className: "text-left-column",

        },
        {
            title: t("inventory.table.inStock"),
            dataIndex: "totalQty",
            align: "center",
            className: "text-left-column",
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
        },
    ];

    return (
        <div className="p-3">
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
                            label={t("inventory.assets.form.deviceName")}
                            name="assetName"
                        >
                            <Input placeholder={t("inventory.assets.placeholders.enterDeviceName")} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item id="" label={t("inventory.assets.form.modelName")} name="assetModelId">
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("inventory.assets.placeholders.selectModel")}
                                options={(assetModels).map((item) => ({
                                    key: item.id,
                                    value: item.id,
                                    label: item.assetModelName,
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
                </Row>

                <Divider style={{ color: "#fff" }}> Tổng kho </Divider>

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

                {
                    locationData
                        .filter(ld => ld.inventory?.results?.length > 0)
                        .map(ld => (
                            <>
                                <Divider style={{ color: "#fff" }} >{ld.name} </Divider>
                                <Table
                                    rowKey="id"
                                    columns={columns}
                                    key={"id"}
                                    dataSource={ld.inventory?.results}
                                    bordered
                                />
                            </>
                        ))
                }

                <ModelDetailStock
                    open={isOpenDetail}
                    handleCancel={() => setIsOpenDetail(false)}
                    data={detailData}
                />
            </Form>
        </div>
    );
};

export default AssetsInventory;