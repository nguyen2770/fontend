import { useState, useEffect } from "react";
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import {
    Row,
    Col,
    Card,
    Button,
    Input,
    Form,
    Table,
    Divider,
    Select,
    message
} from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import Confirm from "../../../components/modal/Confirm";
import ConfirmWithReasonModal from "../../../components/modal/ConfirmWithReason";
import { parsePriceVnd } from "../../../helper/price-helper";
import { useTranslation } from "react-i18next";

export default function ApproveRequestPurchase() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useCustomNav();
    const { id } = useParams();
    const { user } = useAuth();

    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isOpenModalReject, setIsOpenModalReject] = useState();
    const [action, setAction] = useState();
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalVatAmount, setTotalVatAmount] = useState(0);

    useEffect(() => {
        fetchRequestPurchaseById(id);
        fetchDepartments();
        fetchBranches();
        fetchDataTable();
        fetchSuppliers();
    }, []);

    useEffect(() => {
        if (data?.length) {
            setTotalVatAmount(
                data.reduce((sum, item) => sum + (parseFloat(item.vatAmount) || 0), 0)
            );
            setTotalAmount(
                data.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0)
            );
        } else {
            setTotalVatAmount(0);
            setTotalAmount(0);
        }
    }, [data]);

    const fetchRequestPurchaseById = async (id) => {
        const res = await _unitOfWork.requestPurchase.getRequestPurchaseById({ id });
        if (res) {
            form.setFieldsValue({ ...res, createdName: res.createdBy?.fullName });
            setAction(res.action);
        }
    };

    const fetchDepartments = async () => {
        const department = await _unitOfWork.department.getAllDepartment();
        if (department?.data) {
            const option = department.data.map((item) => ({
                label: item.departmentName,
                value: item.id
            }));
            setDepartments(option);
        }
    };

    const fetchBranches = async () => {
        const branch = await _unitOfWork.branch.getAllBranch();
        if (branch?.data) {
            const option = branch.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setBranches(option);
        }
    };

    const fetchSuppliers = async () => {
        const supplier = await _unitOfWork.supplier.getAllSupplier();
        if (supplier?.data) {
            const option = supplier.data.map((item) => ({
                label: item.supplierName,
                value: item.id
            }));
            setSuppliers(option);
        }
    };

    const fetchDataTable = async () => {
        const res =
            await _unitOfWork.requestPurchase.getRequestPurchasesDetailById({ id });
        if (res.data) {
            const dataTable = await Promise.all(
                res.data.map(async (item) => {
                    const vatAmount =
                        (parseFloat(item.vatPercent || 0) / 100) *
                        parseFloat(item.qty || 0) *
                        parseFloat(item.unitPrice || 0);
                    const totalAmount =
                        vatAmount +
                        parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0);

                    if (item.itemType === "SpareParts") {
                        return {
                            ...item,
                            code: item.sparePart?.code,
                            name: item.sparePart?.sparePartsName,
                            uomName: item.sparePart?.uomId?.uomName,
                            needDate: item.needDate
                                ? dayjs(item.needDate).format(FORMAT_DATE)
                                : null,
                            vatAmount,
                            totalAmount
                        };
                    } else {
                        return {
                            ...item,
                            code: item.assetModel?.assetModelName || "",
                            name: item.asset?.assetName,
                            needDate: item.needDate
                                ? dayjs(item.needDate).format(FORMAT_DATE)
                                : null,
                            vatAmount,
                            totalAmount,
                            uom: item.uom?.id,
                            uomName: item.uom?.uomName
                        };
                    }
                })
            );
            setData(dataTable);
        }
    };

    const handleApprove = async () => {
        Confirm(t("purchase.messages.confirm_approve"), async () => {
            const result =
                await _unitOfWork.requestPurchase.updateRequestPurchaseStatus({
                    RequestPurchase: { id, action: "approved" }
                });
            if (result) {
                message.success(t("purchase.messages.approve_success"));
                navigate(-1);
            }
        });
    };

    const handleReject = async (reason) => {
        const result =
            await _unitOfWork.requestPurchase.updateRequestPurchaseStatus({
                RequestPurchase: { id, action: "rejected", comment: reason }
            });
        if (result) {
            message.success(t("purchase.messages.reject_success"));
            navigate(-1);
        }
    };

    const columns = [
        {
            title: t("requestPurchase.tableDetail.index"),
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1
        },
        {
            title: t("requestPurchase.tableDetail.code"),
            dataIndex: "code",
            key: "code",
            width: 120
        },
        {
            title: t("requestPurchase.tableDetail.name"),
            dataIndex: "name",
            key: "name",
            width: 200
        },
        {
            title: t("requestPurchase.tableDetail.uom"),
            dataIndex: "uomName",
            key: "uomName",
            width: 80,
            align: "center"
        },
        {
            title: t("requestPurchase.tableDetail.qty"),
            dataIndex: "qty",
            key: "qty",
            width: 100,
            align: "right"
        },
        {
            title: t("requestPurchase.tableDetail.unit_price"),
            dataIndex: "unitPrice",
            key: "unitPrice",
            width: 120,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("requestPurchase.tableDetail.vat_percent"),
            dataIndex: "vatPercent",
            key: "vatPercent",
            width: 100,
            align: "right"
        },
        {
            title: t("requestPurchase.tableDetail.vat_amount"),
            dataIndex: "vatAmount",
            key: "vatAmount",
            width: 120,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("requestPurchase.tableDetail.total_amount"),
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 140,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("requestPurchase.tableDetail.supplier"),
            dataIndex: "supplier",
            key: "supplier",
            width: 160
        },
        {
            title: t("requestPurchase.tableDetail.need_date"),
            dataIndex: "needDate",
            key: "needDate",
            width: 120
        },
        {
            title: t("requestPurchase.tableDetail.usage_purpose"),
            dataIndex: "usagePurpose",
            key: "usagePurpose",
            width: 180
        },
        {
            title: t("requestPurchase.tableDetail.note"),
            dataIndex: "note",
            key: "note",
            width: 150
        }
    ];

    return (
        <div>
            <Form labelWrap form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Card
                    title={
                        action === "pendingApproval"
                            ? t("requestPurchase.form.approve_title")
                            : t("requestPurchase.form.detail_title")
                    }
                    extra={
                        <>
                            <Button className="mr-2" onClick={() => navigate(-1)}>
                                <ArrowLeftOutlined /> {t("purchase.buttons.back")}
                            </Button>
                            {action && action === "pendingApproval" && (
                                <>
                                    <Button
                                        type="primary"
                                        className="mr-2"
                                        icon={<CheckCircleOutlined />}
                                        onClick={handleApprove}
                                    >
                                        {t("purchase.buttons.approve")}
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => setIsOpenModalReject(true)}
                                    >
                                        {t("purchase.buttons.reject")}
                                    </Button>
                                </>
                            )}
                        </>
                    }
                >
                    <Row gutter={32}>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.code")}
                                name="code"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.creator")}
                                name="createdName"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.branch")}
                                name="branch"
                            >
                                <Select options={branches} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.department")}
                                name="department"
                            >
                                <Select options={departments} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.supplier")}
                                name="supplier"
                            >
                                <Select options={suppliers} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.description")}
                                name="description"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left" size="small">
                        {t("requestPurchase.form.fields.materials_list_section")}
                    </Divider>
                    <Table
                        rowKey="id"
                        columns={columns}
                        scroll={{ x: 1800 }}
                        className="wp-100"
                        dataSource={data}
                        bordered
                        pagination={false}
                    />
                    <Row gutter={16} className="mt-3" justify="end">
                        <Form.Item
                            label={t("requestPurchase.form.totals.vat_total_label")}
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Input value={parsePriceVnd(totalVatAmount)} disabled />
                        </Form.Item>
                        <Col span={6}>
                            <Form.Item
                                label={t("requestPurchase.form.totals.grand_total_label")}
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 12 }}
                            >
                                <Input value={parsePriceVnd(totalAmount)} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <ConfirmWithReasonModal
                        visible={isOpenModalReject}
                        onConfirm={handleReject}
                        onCancel={() => setIsOpenModalReject(false)}
                        title={t("purchase.reject.reason_title")}
                    />
                </Card>
            </Form>
        </div>
    );
}