import React, { useEffect, useState } from "react";
import {
    CheckCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    RedoOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, message, Pagination, Radio, Row, Select, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../utils/constant";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import Comfirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import ModalReason from "../../../components/modal/ModalReason"
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import useAuth from "../../../contexts/authContext";
import SearchSelectInput from "../../../components/common/SearchSelectInput";
import DrawerSearchPurchase from "../../../components/drawer/drawerSearchPurchase";

export default function SuppliesNeed() {
    const [form] = Form.useForm();
    const { permissions } = useAuth();
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const navigate = useCustomNav();
    const [purchaseOrder, setPurchaseOrder] = useState([]);
    const { setHeaderTitle } = useHeader();
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [action, setAction] = useState("pendingApproval");
    const [selectedReason, setSelectedReason] = useState("");
    const [showReasonModal, setShowReasonModal] = useState(false);
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useState({
        code: "",
        branch: "",
        department: "",
        startDate: "",
        endDate: "",
    });
    const [searchField, setSearchField] = useState("code");
    const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);

    useEffect(() => {
        setHeaderTitle(t("receiptPurchase.header.title"));
        // fetchDepartments();
        // fetchBranches();
    }, []);

    useEffect(() => {
        fetchPurchaseOrder();
    }, [page, searchParams, action]);

    const onChangePagination = (value) => {
        setPage(value);
    };

    const fetchPurchaseOrder = async (page = 1, value) => {
        try {
            let payload = {
                page: page,
                limit: PAGINATION.limit,
                ...value,
                state: action,
            };
            const res = await _unitOfWork.receiptPurchase.getListReceiptPurchase(payload);

            if (res && res.results && res.results?.results) {
                const data = res.results.results;
                const dataWithNames = await Promise.all(
                    data.map(async (item) => {
                        const createdAt = dayjs(item.createdAt).format(FORMAT_DATE);
                        return {
                            ...item,
                            branchName: item.branch?.name,
                            departmentName: item.department?.departmentName,
                            createdAt,
                        };
                    })
                );
                setPurchaseOrder(dataWithNames);
                setTotalRecord(res.results.totalResults);
            }
        } catch (error) {
            console.error("Failed to fetch receipt purchases:", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const department = await _unitOfWork.department.getAllDepartment();
            if (department?.data) {
                const options = department.data.map((item) => ({
                    label: item.departmentName,
                    value: item.id,
                }));
                setDepartments(options);
            }
        } catch (error) {
            console.error("Failed to fetch departments:", error);
        }
    };

    const fetchBranches = async () => {
        try {
            const branch = await _unitOfWork.branch.getAllBranch();
            if (branch?.data) {
                const options = branch.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }));
                setBranches(options);
            }
        } catch (error) {
            console.error("Failed to fetch branches:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await _unitOfWork.receiptPurchase.deleteReceiptPurchase({ id });
            if (res && res.code === 1) {
                fetchPurchaseOrder();
                message.success(t("receiptPurchase.messages.deleteSuccess"));
            } else {
                message.error(t("receiptPurchase.messages.deleteError"));
            }
        } catch (error) {
            console.error("Failed to delete receipt purchase:", error);
            message.error(t("receiptPurchase.messages.deleteError"));
        }
    };

    const showCancelReason = (record) => {
        setSelectedReason(record.comment || "");
        setShowReasonModal(true);
    };

    const columns = [
        {
            title: t("receiptPurchase.table.stt"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) => (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("receiptPurchase.fields.orderCode"),
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Nhà cung cấp",
            dataIndex: ["supplier", ""],
            key: "code",
        },
        {
            title: "Người lập",
            dataIndex: ["createdBy", "fullName"],
            key: "code",
        },
        {
            title: "Phòng ban",
            dataIndex: ["department", "departmentName"],
            key: "code",
        },
        {
            title: t("receiptPurchase.fields.note"),
            dataIndex: "description",
            key: "note",
        },
        {
            title: t("receiptPurchase.fields.createdAt"),
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            sorter: (a, b) =>
                dayjs(a.createdAt, FORMAT_DATE).toDate() - dayjs(b.createdAt, FORMAT_DATE).toDate(),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: t("receiptPurchase.table.action"),
            dataIndex: "action",
            align: "center",
            width: "120px",
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>

                    {
                        checkPermission(permissions, permissionCodeConstant.stock_receipt_approve) && (

                            <Tooltip title={action === "pendingApproval" ? t("receiptPurchase.tooltips.approve") : t("receiptPurchase.tooltips.viewDetail")}>
                                <Button
                                    type="primary"
                                    icon={action === "pendingApproval" ? <CheckCircleOutlined /> : <EyeOutlined />}
                                    size="small"
                                    style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}
                                    onClick={() => navigate(`${staticPath.approveStockReceipt}/${record.id}`)}
                                />
                            </Tooltip>
                        )
                    }

                    {action === "pendingApproval" && (
                        <>
                            {checkPermission(
                                permissions,
                                permissionCodeConstant.stock_receipt_edit
                            ) && (

                                    <Tooltip title={t("receiptPurchase.actions.edit")}>
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            size="small"
                                            onClick={() => navigate(`${staticPath.updateStockReceipt}/${record.id}`)}
                                        />
                                    </Tooltip>
                                )}

                            {checkPermission(
                                permissions,
                                permissionCodeConstant.stock_receipt_delete
                            ) && (


                                    <Tooltip title={t("receiptPurchase.actions.delete")}>
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            onClick={() => Comfirm(t("receiptPurchase.confirm.delete"), () => handleDelete(record.id))}
                                        />
                                    </Tooltip>
                                )}

                        </>
                    )}

                    {action === "rejected" && checkPermission(permissions, permissionCodeConstant.stock_receipt_reject_reason) && (
                        <Tooltip title={t("receiptPurchase.tooltips.viewRejectReason")}>
                            <Button
                                type="default"
                                icon={<InfoCircleOutlined />}
                                size="small"
                                onClick={() => showCancelReason(record)}
                            />
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];

    const onClickGoToCreate = () => {
        navigate(staticPath.createStockReceipt);
    };

    const handleSearch = () => {
        setPage(1);
        if (page > 1) {
            setPage(1);
        } else {
            fetchPurchaseOrder();
        }
    };

    const handleReset = () => {
        form.resetFields();
        if (page > 1) {
            setPage(1);
        } else {
            fetchPurchaseOrder();
        }
    };

    return (
        <div className="p-3">
            <Form
                labelWrap
                form={form}
                layout="vertical"
                onFinish={handleSearch}
                initialValues={{
                    code: "",
                    startDate: "",
                    endDate: "",
                }}
            >
                <Row gutter={16} className="mb-1">
                    <Col span={24}>
                        <Form.Item
                            label=""
                            name="action"
                            initialValue="pendingApproval"
                            style={{ marginBottom: 16 }}
                        >
                            <Radio.Group
                                buttonStyle="solid"
                                style={{ width: "100%" }}
                                onChange={(e) => {
                                    setPage(1);
                                    setAction(e.target.value);
                                    form.resetFields(['code', 'branch', 'department', 'startDate', 'endDate']);
                                    setSearchParams({
                                        code: "",
                                        branch: "",
                                        department: "",
                                        startDate: "",
                                        endDate: "",
                                    })
                                }}
                            >
                                <Radio.Button
                                    value="pendingApproval"
                                    style={{ width: "15%", textAlign: "center" }}
                                >
                                    {t("receiptPurchase.status.pendingApproval")}
                                </Radio.Button>
                                <Radio.Button
                                    value="approved"
                                    style={{ width: "15%", textAlign: "center" }}
                                >
                                    {t("receiptPurchase.status.approved")}
                                </Radio.Button>
                                <Radio.Button
                                    value="rejected"
                                    style={{ width: "15%", textAlign: "center" }}
                                >
                                    {t("receiptPurchase.status.rejected")}
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={8} className="mb-1">
                        <SearchSelectInput
                            form={form}
                            fieldValue={searchField}
                            onFieldChange={setSearchField}
                            options={[
                                { value: "code", label: t("receiptPurchase.fields.orderCode") },
                            ]}
                        />
                    </Col>
                    {/* <Col span={4}>
                        <Form.Item name="code" label={t("receiptPurchase.fields.orderCode")}>
                            <Input placeholder={t("receiptPurchase.placeholders.enterOrderCode")} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="branch" label={t("receiptPurchase.form.branch")}>
                            <Select options={branches} placeholder={t("receiptPurchase.placeholders.selectBranch")} allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="department" label={t("receiptPurchase.form.department")}>
                            <Select options={departments} placeholder={t("receiptPurchase.placeholders.selectDepartment")} allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="startDate" label={t("receiptPurchase.fields.startDate")}>
                            <DatePicker
                                placeholder={t("receiptPurchase.placeholders.selectStartDate")}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="endDate" label={t("receiptPurchase.fields.endDate")}>
                            <DatePicker
                                placeholder={t("receiptPurchase.placeholders.selectEndDate")}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col> */}

                    <Col span={8} style={{ textAlign: "left" }}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            {t("receiptPurchase.actions.search")}
                        </Button>
                        <Button onClick={handleReset} className="bt-green mr-2">
                            <RedoOutlined />
                            {t("receiptPurchase.actions.reset")}
                        </Button>
                        <Button
                            icon={<FilterOutlined style={{ fontSize: 20, position: "relative", top: 1 }} />}
                            title={t("preventive.buttons.advanced_search")}
                            onClick={() => setIsOpenSearchAdvanced(true)}

                        />
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                        {/* <Tooltip title={t("receiptPurchase.actions.help")} color="#616263">
                            <QuestionCircleOutlined
                                style={{ fontSize: 20, cursor: "pointer", marginLeft: 10 }}
                            />
                        </Tooltip> */}
                        {checkPermission(
                            permissions,
                            permissionCodeConstant.stock_receipt_create
                        ) && (


                                <Button
                                    key="1"
                                    type="primary"
                                    onClick={onClickGoToCreate}
                                    className="ml-3"
                                >
                                    <PlusOutlined /> {t("receiptPurchase.actions.addNew")}
                                </Button>
                            )}
                    </Col>
                    <Col
                        span={24}
                        style={{ fontSize: 16, color: "#fff", textAlign: "right" }}
                    >
                        <b>
                            {t("purchaseQuotation.list.total", {
                                count: totalRecord || 0
                            })}
                        </b>
                    </Col>
                </Row>
            </Form>
            <Table
                rowKey="id"
                columns={columns}
                key="id"
                dataSource={purchaseOrder}
                bordered
                pagination={false}
            />
            <Pagination
                className="pagination-table mt-2"
                onChange={onChangePagination}
                pageSize={pagination.limit}
                total={totalRecord}
            />
            <ModalReason
                open={showReasonModal}
                onCancel={() => setShowReasonModal(false)}
                reason={selectedReason}
            />
            <DrawerSearchPurchase
                isOpen={isOpenSearchAdvanced}
                onCallBack={(value) => {
                    form.resetFields(["searchValue"]);
                    fetchPurchaseOrder(1, value);
                }}
                onClose={() => { setIsOpenSearchAdvanced(false) }}
            />
        </div>
    );
}