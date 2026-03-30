import React, { useEffect, useState } from "react";
import {
    Modal,
    Table,
    Checkbox,
    Pagination,
    Button,
    Card,
    Row,
    Col,
    Form,
    Input
} from "antd";
import * as _unitOfWork from "../../../../../api";
import { PAGINATION } from "../../../../../utils/constant";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function CreateAssetTypeMapManufacturer({
    open,
    handleCancel,
    onSubmit,
    assetType,
    selectedIds = []
}) {
    const { t } = useTranslation();
    const [dataSource, setDataSource] = useState([]);
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [selected, setSelected] = useState([]);
    const [form] = Form.useForm();
    const [searchParams, setSearchParams] = useState({});

    useEffect(() => {
        if (open) {
            fetchGetListManufacturer();
            setSelected(selectedIds);
        }
    }, [open, page, selectedIds, searchParams]);

    const handleSearch = (values) => {
        setSearchParams({ ...values });
        setPage(1);
    };

    const handleReset = () => {
        form.resetFields();
        setSearchParams({
            manufacturerName: ""
        });
        setPage(1);
    };

    const fetchGetListManufacturer = async () => {
        const res = await _unitOfWork.manufacturer.getListManufacturers({
            page,
            limit: PAGINATION.limit,
            ...searchParams
        });
        if (res?.results?.results) {
            setDataSource(res.results.results);
            setTotalRecord(res.results.totalResults);
        }
    };

    const onToggleSelect = (checked, id) => {
        let updated = checked
            ? [...selected, id]
            : selected.filter((item) => item !== id);
        setSelected(updated);
    };

    const handleOk = () => {
        onSubmit(selected);
    };

    const columns = [
        {
            title: "",
            width: 60,
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={selected.includes(record.id)}
                    onChange={(e) =>
                        onToggleSelect(e.target.checked, record.id)
                    }
                />
            )
        },
        {
            title: t("assetType.mapManufacturer.modal.table.index"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1
        },
        {
            title: t("assetType.mapManufacturer.modal.table.name"),
            dataIndex: "manufacturerName"
        },
        {
            title: t("assetType.mapManufacturer.modal.table.origin"),
            dataIndex: "origin",
            render: (origin) => origin?.originName || "-"
        }
    ];

    return (
        <Modal
            open={open}
            className="custom-modal"
            width={1200}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            <Card
                title={t("assetType.mapManufacturer.modal.title")}
            >
                <Form
labelWrap
                    form={form}
                    layout="vertical"
                    onFinish={handleSearch}
                    initialValues={{
                        manufacturerName: ""
                    }}
                >
                    <Row gutter={[16, 16]} className="mb-1">
                        <Col span={8}>
                            <Form.Item
                                name="manufacturerName"
                                label={t(
                                    "assetType.mapManufacturer.modal.search.manufacturer_name"
                                )}
                            >
                                <Input
                                    placeholder={t(
                                        "assetType.mapManufacturer.modal.search.manufacturer_name_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 2 }}>
                        <Col span={12} style={{ textAlign: "left" }}>
                            <Button
                                type="primary"
                                className="mr-2"
                                htmlType="submit"
                            >
                                <SearchOutlined />
                                {t(
                                    "assetType.mapManufacturer.modal.buttons.search"
                                )}
                            </Button>
                            <Button
                                onClick={handleReset}
                                className="bt-green mr-2"
                            >
                                <RedoOutlined />
                                {t(
                                    "assetType.mapManufacturer.modal.buttons.reset"
                                )}
                            </Button>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Button onClick={handleCancel}>
                                {t(
                                    "assetType.mapManufacturer.modal.buttons.cancel"
                                )}
                            </Button>
                            <Button
                                key="1"
                                type="primary"
                                onClick={handleOk}
                                className="ml-2"
                                disabled={!selected.length}
                            >
                                {t(
                                    "assetType.mapManufacturer.modal.buttons.confirm"
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                />
                <Pagination
                    className="pagination-table mt-2"
                    onChange={(val) => setPage(val)}
                    pageSize={PAGINATION.limit}
                    total={totalRecord}
                    current={page}
                />
            </Card>
        </Modal>
    );
}