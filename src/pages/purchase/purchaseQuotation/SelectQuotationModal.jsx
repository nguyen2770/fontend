import React, { useEffect, useState } from "react";
import {
    Modal,
    Table,
    Button,
    Card,
    Row,
    Input,
    Form,
    Pagination,
    message,
    Col
} from "antd";
import * as _unitOfWork from "../../../api";
import { PAGINATION } from "../../../utils/constant";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const SelectQuotationModal = ({ visible, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [quotations, setQuotations] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        code: "",
        requestPurchaseCode: ""
    });

    useEffect(() => {
        if (visible) {
            fetchQuotations();
            setSelectedRowKeys([]);
            setPage(1);
        }
    }, [visible, page, searchParams]);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const payload = {
                page,
                limit: PAGINATION.limit,
                code: searchParams.code,
                requestPurchaseCode: searchParams.requestPurchaseCode
            };
            const res =
                await _unitOfWork.purchaseQuotation.getListPurchaseQuotation(
                    payload
                );
            if (res && res.results && res.results.results) {
                setQuotations(res.results.results);
                setTotal(res.results.totalResults);
            } else {
                message.error( t("common.messages.errors.failed"));
            }
        } catch (err) {
            message.error( t("common.messages.errors.failed"));
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: t("purchaseQuotation.selectModal.search.code_label"),
            dataIndex: "code",
            key: "code"
        },
        {
            title: t(
                "purchaseQuotation.selectModal.search.request_purchase_label"
            ),
            render: (_, record) => record.requestPurchase?.code || "-",
            key: "requestPurchase"
        },
        {
            title: t("purchaseQuotation.form.fields.supplier"),
            render: (_, record) => record.supplier || "-",
            key: "supplier"
        },
        {
            title: t("requestPurchase.list.table.created_at"),
            dataIndex: "createdAt",
            render: (text) =>
                text ? new Date(text).toLocaleDateString("vi-VN") : "-"
        }
    ];

    const rowSelection = {
        type: "checkbox",
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        }
    };

    const handleSearch = (values) => {
        setSearchParams({
            code: values.code || "",
            requestPurchaseCode: values.requestPurchase || ""
        });
        setPage(1);
    };

    const handleReset = () => {
        form.resetFields();
        setSearchParams({ code: "", requestPurchaseCode: "" });
        setPage(1);
    };

    const handleOk = () => {
        onConfirm(selectedRowKeys);
        onClose();
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            className="custom-modal"
            width={1200}
        >
            <Card title={t("purchaseQuotation.selectModal.title")}>
                <Form
labelWrap
                    form={form}
                    onFinish={handleSearch}
                    style={{ marginBottom: 16 }}
                    layout="vertical"
                >
                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item
                                name="code"
                                label={t(
                                    "purchaseQuotation.selectModal.search.code_label"
                                )}
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="requestPurchase"
                                label={t(
                                    "purchaseQuotation.selectModal.search.request_purchase_label"
                                )}
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ textAlign: "right" }}>
                            <Form.Item label=" ">
                                <Button
                                    type="primary"
                                    className="mr-2"
                                    htmlType="submit"
                                >
                                    <SearchOutlined />
                                    {t("purchase.buttons.search")}
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    className="bt-green mr-2"
                                >
                                    <RedoOutlined />
                                    {t("purchase.buttons.reset")}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={quotations}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />

                <Row justify="end" style={{ marginTop: 12 }}>
                    <Pagination
                        current={page}
                        total={total}
                        pageSize={PAGINATION.limit}
                        onChange={(p) => setPage(p)}
                    />
                </Row>

                <Row justify="end" style={{ marginTop: 16 }}>
                    <div className="modal-footer">
                        <Button onClick={onClose}>
                            {t("purchase.buttons.cancel")}
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleOk}
                            className="ml-2"
                        >
                            {t("purchase.buttons.confirm")}
                        </Button>
                    </div>
                </Row>
            </Card>
        </Modal>
    );
};

export default SelectQuotationModal;