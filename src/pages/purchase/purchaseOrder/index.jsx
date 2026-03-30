import { useEffect, useState } from "react";
import {
    DeleteOutlined,
    EditOutlined,
    FilterOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    RedoOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Pagination,
    Row,
    Select,
    Table,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../utils/constant";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import Comfirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import SearchSelectInput from "../../../components/common/SearchSelectInput";
import DrawerSearchPurchase from "../../../components/drawer/drawerSearchPurchase";

export default function SuppliesNeed() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const navigate = useCustomNav();
    const [purchaseOrder, setPurchaseOrder] = useState([]);
    const { setHeaderTitle } = useHeader();
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const { permissions } = useAuth();
    const [searchParams, setSearchParams] = useState({
        code: "",
        branch: "",
        department: "",
        startDate: "",
        endDate: ""
    });
    const [searchField, setSearchField] = useState("code");
    const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);

    useEffect(() => {
        setHeaderTitle(t("orderPurchase.list.title"));
        // fetchDepartments();
        // fetchBranches();
    }, [t, setHeaderTitle]);

    useEffect(() => {
        fetchPurchaseOrder();
    }, [page]);

    const onChangePagination = (value) => {
        setPage(value);
    };

    const fetchPurchaseOrder = async (page = 1, value) => {
        const searchValue = form.getFieldValue("searchValue");
        try {
            let payload = {
                page: page,
                limit: PAGINATION.limit,
                ...value,
                [searchField]: searchValue,
            };
            const res =
                await _unitOfWork.purchaseOrder.getListPurchaseOrder(payload);
            if (res && res.results && res.results?.results) {
                const data = res.results.results;
                const dataWithNames = await Promise.all(
                    data.map(async (item) => {
                        const createdAt = dayjs(item.createdAt).format(FORMAT_DATE);
                        const branchName = item.branch?.name;
                        const departmentName =
                            item.department?.departmentName;
                        return {
                            ...item,
                            branchName,
                            departmentName,
                            createdAt
                        };
                    })
                );
                setPurchaseOrder(dataWithNames);
                setTotalRecord(res.results.totalResults);
            }
        } catch (error) {
            // silent log
        }
    };

    const fetchDepartments = async () => {
        try {
            const department = await _unitOfWork.department.getAllDepartment();
            if (department?.data) {
                const options = department.data.map((item) => ({
                    label: item.departmentName,
                    value: item.id
                }));
                setDepartments(options);
            }
        } catch { }
    };

    const fetchBranches = async () => {
        try {
            const branch = await _unitOfWork.branch.getAllBranch();
            if (branch?.data) {
                const options = branch.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setBranches(options);
            }
        } catch { }
    };

    const handleDelete = async (id) => {
        try {
            const res =
                await _unitOfWork.purchaseOrder.deleteOrderPurchase({ id });
            if (res && res.code === 1) {
                fetchPurchaseOrder();
                message.success(t("orderPurchase.messages.delete_success"));
            } else {
                message.error(t("orderPurchase.messages.delete_error"));
            }
        } catch {
            message.error(t("orderPurchase.messages.delete_error"));
        }
    };

    const columns = [
        {
            title: t("orderPurchase.list.table.index"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1
        },
        {
            title: t("orderPurchase.list.table.code"),
            dataIndex: "code",
            key: "code"
        },
        {
            title: t("orderPurchase.list.table.branch"),
            dataIndex: "branchName",
            key: "branch"
        },
        {
            title: t("orderPurchase.list.table.department"),
            dataIndex: "departmentName",
            key: "department"
        },
        {
            title: t("orderPurchase.list.table.description"),
            dataIndex: "description",
            key: "note"
        },
        {
            title: t("orderPurchase.list.table.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            sorter: (a, b) =>
                dayjs(a.createdAt, FORMAT_DATE).toDate() -
                dayjs(b.createdAt, FORMAT_DATE).toDate(),
            sortDirections: ["ascend", "descend"]
        },
        {
            title: t("orderPurchase.list.table.action"),
            dataIndex: "action",
            align: "center",
            width: "120px",
            render: (_, record) => (
                <div>
                    {checkPermission(
                        permissions,
                        permissionCodeConstant.purchase_order_edit
                    ) && (
                            <Tooltip title={t("purchase.actions.edit")}>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    size="small"
                                    onClick={() =>
                                        navigate(
                                            `${staticPath.updateOrderPurchase}/${record.id}`
                                        )
                                    }
                                />
                            </Tooltip>
                        )}
                    {checkPermission(
                        permissions,
                        permissionCodeConstant.purchase_order_delete
                    ) && (
                            <Tooltip title={t("purchase.actions.delete")}>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    className="ml-2"
                                    onClick={() =>
                                        Comfirm(
                                            t("orderPurchase.messages.confirm_delete"),
                                            () => handleDelete(record.id)
                                        )
                                    }
                                />
                            </Tooltip>
                        )}
                </div>
            )
        }
    ];

    const onClickGoToCreate = () => {
        navigate(staticPath.createOrderPurchase);
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
                    endDate: ""
                }}
            >
                <Row align="middle" gutter={16} style={{ marginBottom: 2 }}>
                    <Col span={8}>
                        <SearchSelectInput
                            form={form}
                            fieldValue={searchField}
                            onFieldChange={setSearchField}
                            options={[

                                { value: "code", label: t("orderPurchase.list.search.code_label") },


                            ]}
                        />
                    </Col>
                    {/* <Col span={4}>
                        <Form.Item
                            name="code"
                            label={t("orderPurchase.list.search.code_label")}
                        >
                            <Input
                                placeholder={t(
                                    "orderPurchase.list.search.placeholder_code"
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="branch"
                            label={t("orderPurchase.list.search.branch_label")}
                        >
                            <Select
                                options={branches}
                                placeholder={t(
                                    "orderPurchase.list.search.placeholder_branch"
                                )}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="department"
                            label={t(
                                "orderPurchase.list.search.department_label"
                            )}
                        >
                            <Select
                                options={departments}
                                placeholder={t(
                                    "orderPurchase.list.search.placeholder_department"
                                )}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="startDate"
                            label={t("orderPurchase.list.search.start_label")}
                        >
                            <DatePicker
                                placeholder={t(
                                    "orderPurchase.list.search.placeholder_start"
                                )}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="endDate"
                            label={t("orderPurchase.list.search.end_label")}
                        >
                            <DatePicker
                                placeholder={t(
                                    "orderPurchase.list.search.placeholder_end"
                                )}
                                format={FORMAT_DATE}
                                style={{ width: "100%" }}
                                allowClear
                            />
                        </Form.Item>
                    </Col> */}

                    <Col span={8} style={{ textAlign: "left" }}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            {t("purchase.buttons.search")}
                        </Button>
                        <Button onClick={handleReset} className="bt-green mr-2">
                            <RedoOutlined />
                            {t("purchase.buttons.reset")}
                        </Button>
                        <Button
                            icon={<FilterOutlined style={{ fontSize: 20, position: "relative", top: 1 }} />}
                            title={t("preventive.buttons.advanced_search")}
                            onClick={() => setIsOpenSearchAdvanced(true)}

                        />
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                        {/* <Tooltip
                            title={t("purchase.actions.help")}
                            color="#616263"
                        >
                            <QuestionCircleOutlined
                                style={{ fontSize: 20, cursor: "pointer", marginLeft: 10 }}
                            />
                        </Tooltip> */}
                        {checkPermission(
                            permissions,
                            permissionCodeConstant.purchase_order_create
                        ) && (
                                <Button
                                    key="1"
                                    type="primary"
                                    onClick={onClickGoToCreate}
                                    className="ml-3"
                                >
                                    <PlusOutlined /> {t("purchase.buttons.create")}
                                </Button>
                            )}
                    </Col>
                    <Col
                        span={24}
                        style={{ fontSize: 16, textAlign: "right" }}
                    >
                        <b>
                            {t("orderPurchase.list.total", {
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
                current={page}
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