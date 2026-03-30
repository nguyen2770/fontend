import { useState, useEffect } from "react";
import {
    ArrowLeftOutlined,
    PlusOutlined,
    SaveOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import {
    Row,
    Col,
    Card,
    Button,
    Input,
    Form,
    Tooltip,
    Table,
    Divider,
    Select,
    message,
    Space
} from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import AddReqestPurchaseDetail from "./AddReqestPurchaseDetail";
import useHeader from "../../../contexts/headerContext";
import { parsePriceVnd } from "../../../helper/price-helper";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";
import { notiAction } from "../../../helper/noti-action-helper";

export default function UpdateRequestPurchase() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useCustomNav();
    const { user } = useAuth();
    const { setHeaderTitle } = useHeader();

    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [editingDetail, setEditingDetail] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalVatAmount, setTotalVatAmount] = useState(0);
    const [branchInput, setBranchInput] = useState("");
    const [departmentInput, setDepartmentInput] = useState("");
    const [supplierInputValue, setSupplierInputValue] = useState("");

    const { id } = useParams();

    useEffect(() => {
        form.setFieldsValue({
            createdName: user.fullName,
            createBy: user.id
        });
        setHeaderTitle(t("requestPurchase.list.title"));
        fetchRequestPurchaseById(id);
        fetchDepartments();
        fetchBranches();
        fetchDataTable();
        fetchSuppliers();
    }, [t, setHeaderTitle]);

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
        const res =
            await _unitOfWork.requestPurchase.getRequestPurchaseById({ id: id });
        if (res) {
            form.setFieldsValue({ ...res, createdName: res.createdBy?.fullName });
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
            await _unitOfWork.requestPurchase.getRequestPurchasesDetailById({
                id: id
            });
        if (res.data) {
            const dataTable = await Promise.all(
                res.data.map(async (item) => {
                    if (item.itemType == "SpareParts") {
                        return {
                            ...item,
                            code: item.sparePart?.code,
                            name: item.sparePart?.sparePartsName,
                            uomName: item.sparePart?.uomId?.uomName,
                            needDate: item.needDate
                                ? dayjs(item.needDate).format(FORMAT_DATE)
                                : undefined,
                            vatAmount:
                                (parseFloat(item.vatPercent || 0) / 100) *
                                parseFloat(item.qty || 0) *
                                parseFloat(item.unitPrice || 0),
                            totalAmount:
                                (parseFloat(item.vatPercent || 0) / 100) *
                                parseFloat(item.qty || 0) *
                                parseFloat(item.unitPrice || 0) +
                                parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0)
                        };
                    } else {
                        return {
                            ...item,
                            code: item.assetModel?.assetModelName || "",
                            name: item.asset?.assetName,
                            needDate: item.needDate
                                ? dayjs(item.needDate).format(FORMAT_DATE)
                                : undefined,
                            vatAmount:
                                (parseFloat(item.vatPercent || 0) / 100) *
                                parseFloat(item.qty || 0) *
                                parseFloat(item.unitPrice || 0),
                            totalAmount:
                                (parseFloat(item.vatPercent || 0) / 100) *
                                parseFloat(item.qty || 0) *
                                parseFloat(item.unitPrice || 0) +
                                parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0),
                            uom: item.uom?.id,
                            uomName: item.uom?.uomName
                        };
                    }
                })
            );

            setData(dataTable);
        }
    };

    const handleAddDetail = async (newData) => {
        if (editingIndex !== null) {
            const newList = [...data];
            newList[editingIndex] = newData;
            setData(newList);
            setEditingIndex(null);
            setEditingDetail(null);
        } else {
            setData((prev) => [...prev, newData]);
        }
        setIsOpenModalDetail(false);
    };

    const handleDelete = async (record) => {
        setData((prev) =>
            prev.filter((item) => {
                if (item.id) {
                    return item.id !== record.id;
                } else {
                    return item.key !== record.key;
                }
            })
        );
    };

    const onFinish = async () => {
        const values = form.getFieldsValue();
        const convertedDetails = data.map((item) => ({
            ...item,
            needDate: dayjs(item.needDate, FORMAT_DATE).toDate(),
            sparePart: item.sparePart ? item.sparePart?.id || item.sparePart : null,
            asset: item.asset ? item.asset?.id || item.asset : null,
            assetModel: item.assetModel
                ? item.assetModel?.id || item.assetModel
                : null,
            assetTypeCategory: item.assetTypeCategory?.id
                ? item.assetTypeCategory?.id
                : null,
            manufacturer: item.manufacturer?.id ? item.manufacturer.id : null,
            uom: item.sparePart ? null : item.uom
        }));
        const payload = {
            requestPurchase: {
                ...values
            },
            requestPurchaseDetail: [...convertedDetails]
        };
        const suppilersNeed =
            await _unitOfWork.requestPurchase.updateRequestPurchase({
                RequestPurchase: { id: id, payload }
            });
        if (suppilersNeed) {
            message.success(t("purchase.messages.update_success"));
            navigate(-1);
        }
    };

    const addBranch = async (name) => {
        if (!name || !name.trim()) return;
        const response = await _unitOfWork.branch.createBranch({
            name: name,
        });
        notiAction(t, response);
        if (response) {
            fetchBranches();
            setBranchInput("");
        }
    };

    const addDepartment = async (name) => {
        if (!name || !name.trim()) return;
        const response = await _unitOfWork.department.createDepartment({
            departmentName: name,
        });
        notiAction(t, response);
        if (response) {
            fetchDepartments();
            setDepartmentInput("");
        }
    };

    const addSupplier = async (name) => {
        if (!name || !name.trim()) return;
        const response = await _unitOfWork.supplier.createSupplier({
            supplierName: name,
        });
        notiAction(t, response);
        if (response) {
            fetchSuppliers();
            setSupplierInputValue("");
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
            width: 120,
            align: "center"
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
        },
        {
            title: t("requestPurchase.tableDetail.action"),
            key: "action",
            dataIndex: "action",
            fixed: "right",
            width: 100,
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                    <Tooltip title={t("purchase.actions.edit")}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {
                                const index1 = data.findIndex(
                                    (item) => item._id === record._id
                                );

                                if (index1 != -1 && record._id) {
                                    setEditingIndex(index1);
                                } else if (record.key) {
                                    const index2 = data.findIndex(
                                        (item) => item.key === record.key
                                    );
                                    setEditingIndex(index2);
                                }
                                setEditingDetail(record);
                                setIsOpenModalDetail(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={t("purchase.actions.delete")}>
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <div>
            <Form
labelWrap
                form={form}
                labelCol={{
                    span: 8
                }}
                wrapperCol={{
                    span: 16
                }}
                onFinish={() =>
                    Confirm(
                        t("purchase.messages.confirm_update") || "Xác nhận cập nhật?",
                        () => onFinish()
                    )
                }
            >
                <Card
                    title={t("requestPurchase.form.update_title")}
                    extra={
                        <>
                            <Button className="mr-2" onClick={() => navigate(-1)}>
                                <ArrowLeftOutlined />
                                {t("purchase.buttons.back")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                <SaveOutlined />
                                {t("purchase.buttons.save")}
                            </Button>
                        </>
                    }
                >
                    <Row gutter={32}>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.code")}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "requestPurchase.form.validation.required_code"
                                        ) || "Vui lòng nhập mã"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.creator")}
                                name="createdName"
                            >
                                <Input disabled value={user.fullName} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.branch")}
                                name="branch"
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder={t("users.create.placeholders.branch")}
                                    options={branches}
                                    filterOption={filterOption}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <div style={{ padding: 8 }}>
                                                <Space>
                                                    <Input
                                                        maxLength={250}
                                                        value={branchInput}
                                                        onChange={(e) => setBranchInput(e.target.value)}
                                                        placeholder={t(
                                                            "assetModel.model.fields.add_new"
                                                        )}
                                                    />
                                                    <Button
                                                        icon={<PlusOutlined />}
                                                        disabled={!branchInput.trim()}
                                                        onClick={() => addBranch(branchInput)}
                                                    />
                                                    <div>{`${branchInput.length}/250`}</div>
                                                </Space>
                                            </div>
                                        </>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.department")}
                                name="department"
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder={t("users.create.placeholders.department")}
                                    options={departments}
                                    filterOption={filterOption}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <div style={{ padding: 8 }}>
                                                <Space>
                                                    <Input
                                                        maxLength={250}
                                                        value={departmentInput}
                                                        onChange={(e) => setDepartmentInput(e.target.value)}
                                                        placeholder={t(
                                                            "assetModel.model.fields.add_new"
                                                        )}
                                                    />
                                                    <Button
                                                        icon={<PlusOutlined />}
                                                        disabled={!departmentInput.trim()}
                                                        onClick={() => addDepartment(departmentInput)}
                                                    />
                                                    <div>{`${departmentInput.length}/250`}</div>
                                                </Space>
                                            </div>
                                        </>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.supplier")}
                                name="supplier"
                            >
                                <Select
                                    allowClear
                                    placeholder={t(
                                        "assetModel.model.fields.supplier_placeholder"
                                    )}
                                    showSearch
                                    options={suppliers}
                                    filterOption={filterOption}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <div style={{ padding: 8 }}>
                                                <Space>
                                                    <Input
                                                        maxLength={250}
                                                        value={supplierInputValue}
                                                        onChange={(e) => setSupplierInputValue(e.target.value)}
                                                        placeholder={t(
                                                            "assetModel.model.fields.add_new"
                                                        )}
                                                    />
                                                    <Button
                                                        icon={<PlusOutlined />}
                                                        disabled={!supplierInputValue.trim()}
                                                        onClick={() => addSupplier(supplierInputValue)}
                                                    />
                                                    <div>{`${supplierInputValue.length}/250`}</div>
                                                </Space>
                                            </div>
                                        </>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("requestPurchase.form.fields.description")}
                                name="description"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left" size="small">
                        {t("requestPurchase.form.fields.materials_section")}
                    </Divider>
                    <Row className="float-right mb-2">
                        <Button
                            type="primary"
                            htmlType="button"
                            className="bt-green float-right"
                            onClick={() => setIsOpenModalDetail(true)}
                        >
                            <PlusOutlined />
                            {t("requestPurchase.form.fields.add_item_btn")}
                        </Button>
                    </Row>
                    <Table
                        rowKey="id"
                        columns={columns}
                        scroll={{ x: 1800 }}
                        className="wp-100"
                        key={"id"}
                        dataSource={data}
                        bordered
                        pagination={false}
                    ></Table>
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
                    <AddReqestPurchaseDetail
                        open={isOpenModalDetail}
                        handleOk={handleAddDetail}
                        handleCancel={() => {
                            setIsOpenModalDetail(false);
                            setEditingDetail(null);
                            setEditingIndex(null);
                        }}
                        initialData={editingDetail}
                    ></AddReqestPurchaseDetail>
                </Card>
            </Form>
        </div>
    );
}