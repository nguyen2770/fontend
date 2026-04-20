import { useEffect, useState } from "react";
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
import { exportTypeStockIssue, FORMAT_DATE } from "../../../utils/constant";
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

export default function RequestIssue() {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { permissions } = useAuth();
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const navigate = useCustomNav();
    const [requestIssue, setRequestIssue] = useState([]);
    const { setHeaderTitle } = useHeader();
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [action, setAction] = useState("pendingApproval");
    const [selectedReason, setSelectedReason] = useState("");
    const [showReasonModal, setShowReasonModal] = useState(false);
    // State cho các ô tìm kiếm
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
        setHeaderTitle(t("stockIssue.header.general"));
        // fetchDepartments();
    }, []);

    useEffect(() => {
        fetchRequestIssue();
    }, [page, action]);

    const onChangePagination = (value) => {
        setPage(value);
    };

    const fetchRequestIssue = async (page = 1, value) => {
        const searchValue = form.getFieldValue("searchValue");

        try {
            let payload = {
                page: page,
                limit: PAGINATION.limit,
                exportType: "USAGE",
                [searchField]: searchValue,
                action,
                ...value,
            };
            const res = await _unitOfWork.receiptIssue.getListReceiptIssue(payload);

            if (res && res.results && res.results?.results) {
                const data = res.results.results;
                const newData = await Promise.all(
                    data.map(async (item) => {
                        const createdAt = dayjs(item.createdAt).format(FORMAT_DATE);
                        return {
                            ...item,
                            departmentName: item.department?.departmentName,
                            createdAt,
                        };
                    })
                );
                setRequestIssue(newData);
                setTotalRecord(res.results.totalResults);
            }
        } catch (error) {
            console.error("Failed to fetch receipt issues:", error);
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
            const res = await _unitOfWork.receiptIssue.deleteReceiptIssue({ id });
            if (res && res.code === 1) {
                fetchRequestIssue();
                message.success(t("stockIssue.messages.deleteSuccess"));
            } else {
                message.error(t("common.messages.errors.failed"));
            }
        } catch (error) {
            message.error(t("stockIssue.messages.deleteError"));
        }
    };

    const showCancelReason = (record) => {
        setSelectedReason(record.comment || "");
        setShowReasonModal(true);
    };

    const columns = [
        {
            title: t("stockIssue.table.stt"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) => (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("stockIssue.fields.orderCode"),
            dataIndex: "code",
            key: "code",
        },
        {
            title: t("stockIssue.form.department"),
            dataIndex: "departmentName",
            key: "department",
        },
        {
            title: t("stockIssue.fields.exportType"),
            dataIndex: "exportType",
            key: "exportType",
            align: "center",
            render: (_text) => {
                const option = exportTypeStockIssue.Options.find(
                    (opt) => opt.value === _text
                );
                const label = option ? t(option.label) : _text;
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
            }
        },
        {
            title: t("stockIssue.fields.note"),
            dataIndex: "description",
            key: "note",
        },
        {
            title: t("stockIssue.fields.createdAt"),
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            sorter: (a, b) =>
                dayjs(a.createdAt, FORMAT_DATE).toDate() - dayjs(b.createdAt, FORMAT_DATE).toDate(),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: t("stockIssue.table.action"),
            dataIndex: "action",
            align: "center",
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {
                        checkPermission(permissions,
                            permissionCodeConstant.stock_issue_use_approve

                        ) && (
                            <Tooltip title={action === "pendingApproval" ? t("stockIssue.tooltips.approve") : t("stockIssue.tooltips.viewDetail")}>
                                <Button
                                    type="primary"
                                    icon={action === "pendingApproval" ? <CheckCircleOutlined /> : <EyeOutlined />}
                                    size="small"
                                    style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}
                                    onClick={() => navigate(`${staticPath.usedWarehouseDeliveryApproved}/${record.id}`)}
                                />
                            </Tooltip>
                        )
                    }

                    {action === "pendingApproval" && (
                        <>
                            {
                                checkPermission(permissions,
                                    permissionCodeConstant.stock_issue_use_edit

                                ) && (
                                    <Tooltip title={t("stockIssue.actions.edit")}>
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            size="small"
                                            onClick={() => navigate(`${staticPath.usedWarehouseDeliveryUpdate}/${record.id}`)}
                                        />
                                    </Tooltip>
                                )}

                            {
                                checkPermission(permissions,
                                    permissionCodeConstant.stock_issue_use_delete

                                ) && (
                                    <Tooltip title={t("stockIssue.actions.delete")}>
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            onClick={() => Comfirm(t("stockIssue.confirm.delete"), () => handleDelete(record.id))}
                                        />
                                    </Tooltip>
                                )}
                        </>
                    )}

                    {action === "rejected" && (
                        <Tooltip title={t("stockIssue.tooltips.viewRejectReason")}>
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
        navigate(staticPath.usedWarehouseDeliveryCreate);
    };

    const handleSearch = (values) => {
        if (page > 1) {
            setPage(1);
        } else {
            fetchRequestIssue();
        }
    };

    const handleReset = () => {
        form.resetFields();
        if (page > 1) {
            setPage(1);
        } else {
            fetchRequestIssue();
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

                                }}
                            >
                                <Radio.Button
                                    value="pendingApproval"
                                    style={{ width: "15%", textAlign: "center" }}
                                >
                                    {t("stockIssue.status.pendingApproval")}
                                </Radio.Button>
                                <Radio.Button
                                    value="approved"
                                    style={{ width: "15%", textAlign: "center" }}
                                >
                                    {t("stockIssue.status.approved")}
                                </Radio.Button>
                                <Radio.Button
                                    value="rejected"
                                    style={{ width: "15%", textAlign: "center" }}
                                >
                                    {t("stockIssue.status.rejected")}
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <SearchSelectInput
                            form={form}
                            fieldValue={searchField}
                            onFieldChange={setSearchField}
                            options={[
                                { value: "code", label: t("stockIssue.fields.orderCode") },
                            ]}
                        />
                    </Col>
                    {/* <Col span={4}>
                        <Form.Item name="code" label={t("stockIssue.fields.orderCode")}>
                            <Input placeholder={t("stockIssue.placeholders.enterOrderCode")} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="branch" label={t("stockIssue.form.branch")}>
                            <Select options={branches} placeholder={t("stockIssue.placeholders.selectBranch")} allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="department" label={t("stockIssue.form.department")}>
                            <Select options={departments} placeholder={t("stockIssue.placeholders.selectDepartment")} allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="startDate" label={t("stockIssue.fields.startDate")}>
                            <DatePicker
                                placeholder={t("stockIssue.placeholders.selectStartDate")}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="endDate" label={t("stockIssue.fields.endDate")}>
                            <DatePicker
                                placeholder={t("stockIssue.placeholders.selectEndDate")}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col> */}

                    <Col span={8} style={{ textAlign: "left" }}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            {t("stockIssue.actions.search")}
                        </Button>
                        <Button onClick={handleReset} className="bt-green mr-2">
                            <RedoOutlined />
                            {t("stockIssue.actions.reset")}
                        </Button>
                        <Button
                            icon={<FilterOutlined style={{ fontSize: 20, position: "relative", top: 1 }} />}
                            title={t("preventive.buttons.advanced_search")}
                            onClick={() => setIsOpenSearchAdvanced(true)}

                        />
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                        <Tooltip title={t("stockIssue.actions.help")} color="#616263">
                            <QuestionCircleOutlined
                                style={{ fontSize: 20, cursor: "pointer", marginLeft: 10 }}
                            />
                        </Tooltip>
                        {
                            checkPermission(permissions,
                                permissionCodeConstant.stock_issue_use_create

                            ) && (
                                <Button
                                    key="1"
                                    type="primary"
                                    onClick={onClickGoToCreate}
                                    className="ml-3"
                                >
                                    <PlusOutlined /> {t("stockIssue.actions.addNew")}
                                </Button>
                            )
                        }
                    </Col>
                    <Col
                        span={24}
                        style={{ fontSize: 16, textAlign: "right" }}
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
                dataSource={requestIssue}
                bordered
                pagination={false}
            />
            <Pagination
                className="pagination-table mt-2"
                onChange={onChangePagination}
                pageSize={pagination.limit}
                total={totalRecord}
                current={page}
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
                    fetchRequestIssue(1, value);
                }}
                onClose={() => { setIsOpenSearchAdvanced(false) }}
            />

        </div>
    );
}