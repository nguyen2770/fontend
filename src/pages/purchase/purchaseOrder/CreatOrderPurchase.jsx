import { useState, useEffect } from "react";
import { ArrowLeftOutlined, PlusOutlined, SaveOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
    DatePicker,
    Space
} from "antd";
import { useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { FORMAT_DATE } from "../../../utils/constant";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import OrderPurchaseDetail from "./OrderPurchaseDetail";
import { parsePriceVnd } from "../../../helper/price-helper";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";
import { notiAction } from "../../../helper/noti-action-helper";

export default function CreateRequestPurchase() {
    const { t } = useTranslation();
    const params = useParams();
    const [form] = Form.useForm();
    const navigate = useCustomNav();
    const { user } = useAuth();
    const location = useLocation();

    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [quotation, setQuotation] = useState([]);
    const [editingDetail, setEditingDetail] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [purchaseRequest, setPurchaseRequest] = useState();
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalVatAmount, setTotalVatAmount] = useState(0);
    const [branchInput, setBranchInput] = useState("");
    const [departmentInput, setDepartmentInput] = useState("");
    const [supplierInputValue, setSupplierInputValue] = useState("");

    useEffect(() => {
        form.setFieldsValue({
            createdName: user.fullName,
            createBy: user.id
        });
        fetchDepartments();
        fetchBranches();
        fetchPurchaseRequest();
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const returnFormData = location.state?.formData;
        if (returnFormData) {
            form.setFieldsValue(returnFormData);
        }
    }, [location.state]);

    useEffect(() => {
        if (data?.length) {
            setTotalVatAmount(data.reduce((sum, item) => sum + (parseFloat(item.vatAmount) || 0), 0));
            setTotalAmount(data.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0));
        } else {
            setTotalVatAmount(0);
            setTotalAmount(0);
        }
    }, [data]);

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

    const fetchPurchaseRequest = async () => {
        const res = await _unitOfWork.requestPurchase.getAllRequestPurchase();
        if (res) {
            const option = res.data.map((item) => ({
                label: item.code,
                value: item.id
            }));
            setPurchaseRequest(option);
        }
    };

    const handleChangePurchaseRequest = async (id) => {
        const res = await _unitOfWork.purchaseQuotation.getQuotationInfo({ id });
        if (res && res.data.length !== 0) {
            setData(null);
            form.setFieldsValue({ quotation: undefined });
            const option = res.data.map((item) => ({
                label: item.code,
                value: item._id
            }));
            setQuotation(option);
        } else {
            setQuotation([]);
            const requestPurchase =
                await _unitOfWork.requestPurchase.getRequestPurchasesDetailById({
                    id
                });
            if (requestPurchase.data) {
                handleSetData(requestPurchase.data);
            }
        }
    };

    const handleChangeQuotation = async (id) => {
        const res =
            await _unitOfWork.purchaseQuotation.getPurchaseQuotationDetailById({
                id
            });
        if (res) {
            handleSetData(res.data);
        }
    };

    const handleSetData = async (values) => {
        const dataTable = await Promise.all(
            values.map(async (item) => {
                const vatAmount =
                    (parseFloat(item.vatPercent || 0) / 100) *
                    parseFloat(item.qty || 0) *
                    parseFloat(item.unitPrice || 0);
                const totalAmount =
                    (parseFloat(item.vatPercent || 0) / 100) *
                    parseFloat(item.qty || 0) *
                    parseFloat(item.unitPrice || 0) +
                    parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0);
                if (item.itemType == "SpareParts") {
                    return {
                        ...item,
                        code: item.item?.code || item.sparePart?.code,
                        name: item.item?.sparePartsName || item.sparePart?.sparePartsName,
                        item: item.item?.id || item.sparePart?.id,
                        purchaseRequestDetail: item._id,
                        uomName:
                            item.item?.uomId?.uomName || item.sparePart?.uomId?.uomName,
                        uom: item.sparePart?.uomId?.id,
                        needDate: item.needDate
                            ? dayjs(item.needDate).format(FORMAT_DATE)
                            : null,
                        vatAmount,
                        totalAmount,
                        qty: item.remainQty,

                    };
                } else {
                    return {
                        ...item,
                        code:
                            item.item?.assetModelName ||
                            item.assetModel?.assetModelName ||
                            "",
                        name:
                            item.item?.asset?.assetName || item.asset?.assetName,
                        item: item.item?.id || item.assetModel?.id || "",
                        purchaseRequestDetail: item._id,
                        needDate: item.needDate
                            ? dayjs(item.needDate).format(FORMAT_DATE)
                            : null,
                        vatAmount,
                        totalAmount,
                        uomName: item.uom?.uomName,
                        uom: item.uom?.id,
                        qty: item.remainQty,

                    };
                }
            })
        );
        setData(dataTable);
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
                if (item._id) {
                    return item._id !== record._id;
                } else {
                    return item.key !== record.key;
                }
            })
        );
    };

    const validateBeforeSubmit = () => {
        const errors = [];
        data.forEach((row, index) => {
            if (!row.code) errors.push(`Dòng ${index + 1}: thiếu Mã hàng`);
            if (!row.name) errors.push(`Dòng ${index + 1}: thiếu Tên hàng`);
            if (row.qty == null || row.qty <= 0)
                errors.push(`Dòng ${index + 1}: Số lượng phải > 0`);
            if (row.unitPrice == null || row.unitPrice < 0)
                errors.push(`Dòng ${index + 1}: Đơn giá không hợp lệ`);
        });
        if (errors.length > 0) {
            message.error(errors.join(" | "));
            return false;
        }
        return true;
    };

    const onFinish = async () => {
        if (!validateBeforeSubmit()) return;
        const values = form.getFieldsValue();
        const convertedDetails = data.map((item) => ({
            ...item,
            needDate: dayjs(item.needDate, FORMAT_DATE).toDate()
        }));
        const payload = {
            purchaseOrders: {
                ...values
            },
            purchaseOrdersDetail: [...convertedDetails]
        };
        const res =
            await _unitOfWork.purchaseOrder.createOrderPurchase(payload);
        if (res) {
            message.success(t("orderPurchase.messages.create_success"));
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
            title: t("orderPurchase.detailTable.index"),
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1
        },
        {
            title: t("orderPurchase.detailTable.code"),
            dataIndex: "code",
            key: "code",
            width: 120
        },
        {
            title: t("orderPurchase.detailTable.name"),
            dataIndex: "name",
            key: "name",
            width: 200
        },
        {
            title: t("orderPurchase.detailTable.uom"),
            dataIndex: "uomName",
            key: "uomName",
            width: 80,
            align: "center"
        },
        {
            title: t("orderPurchase.detailTable.qty"),
            dataIndex: "qty",
            key: "qty",
            width: 100,
            align: "right"
        },
        {
            title: t("orderPurchase.detailTable.unit_price"),
            dataIndex: "unitPrice",
            key: "unitPrice",
            width: 120,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("orderPurchase.detailTable.vat_percent"),
            dataIndex: "vatPercent",
            key: "vatPercent",
            width: 100,
            align: "right"
        },
        {
            title: t("orderPurchase.detailTable.vat_amount"),
            dataIndex: "vatAmount",
            key: "vatAmount",
            width: 120,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        {
            title: t("orderPurchase.detailTable.total_amount"),
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 140,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ")
        },
        // {
        //     title: t("orderPurchase.detailTable.supplier"),
        //     dataIndex: "supplier",
        //     key: "supplier",
        //     width: 160
        // },
        {
            title: t("orderPurchase.detailTable.need_date"),
            dataIndex: "needDate",
            key: "needDate",
            width: 120
        },
        {
            title: t("orderPurchase.detailTable.usage_purpose"),
            dataIndex: "usagePurpose",
            key: "usagePurpose",
            width: 180
        },
        {
            title: t("orderPurchase.detailTable.note"),
            dataIndex: "note",
            key: "note",
            width: 150
        },
        {
            title: t("orderPurchase.detailTable.action"),
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
                                const index1 = data.findIndex((item) => item._id === record._id);
                                if (index1 !== -1 && record._id) {
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
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={() =>
                    Confirm(t("orderPurchase.messages.confirm_create"), () => onFinish())
                }
            >
                <Card
                    title={t("orderPurchase.form.create_title")}
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
                                label={t("orderPurchase.form.fields.contract_number")}
                                name="contractNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "orderPurchase.form.validation.required_contract_number"
                                        )
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("orderPurchase.form.fields.creator")}
                                name="createdName"
                            >
                                <Input disabled value={user.fullName} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("orderPurchase.form.fields.branch")}
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
                                label={t("orderPurchase.form.fields.department")}
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
                                label={t("orderPurchase.form.fields.contract_date")}
                                name="contractDate"
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("orderPurchase.form.fields.need_date")}
                                name="needDate"
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("orderPurchase.form.fields.po_sent_date")}
                                name="poSentDate"
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t(
                                    "orderPurchase.form.fields.supplier_confirm_date"
                                )}
                                name="supplierConfirmDate"
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t(
                                    "orderPurchase.form.fields.supplier_ready_date"
                                )}
                                name="supplierReadyDate"
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t(
                                    "orderPurchase.form.fields.warehouse_received_date"
                                )}
                                name="warehouseReceivedDate"
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("orderPurchase.form.fields.supplier")}
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
                                label={t("orderPurchase.form.fields.phone_number")}
                                name="phoneNumber"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("orderPurchase.form.fields.address")}
                                name="address"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("orderPurchase.form.fields.note")}
                                name="description"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t(
                                    "orderPurchase.form.fields.purchase_request"
                                )}
                                name="purchaseRequest"
                            >
                                <Select
                                    options={purchaseRequest}
                                    onChange={(value) => handleChangePurchaseRequest(value)}
                                />
                            </Form.Item>
                        </Col>
                        {/* {quotation.length !== 0 && (
                            <Col span={12}>
                                <Form.Item
                                    labelAlign="left"
                                    label={t("orderPurchase.form.fields.quotation")}
                                    name="quotation"
                                >
                                    <Select
                                        options={quotation}
                                        onChange={(value) => handleChangeQuotation(value)}
                                    />
                                </Form.Item>
                            </Col>
                        )} */}
                    </Row>
                    <Divider orientation="left" size="small">
                        {t("orderPurchase.form.fields.materials_section")}
                    </Divider>
                    <Row className="float-right mb-2">
                        <Button
                            type="primary"
                            htmlType="button"
                            className="bt-green float-right"
                            onClick={() => setIsOpenModalDetail(true)}
                        >
                            <PlusOutlined />
                            {t("orderPurchase.form.fields.add_material_btn")}
                        </Button>
                    </Row>
                    <Table
                        rowKey="id"
                        columns={columns}
                        className="wp-100"
                        scroll={{ x: 1800 }}
                        key={"id"}
                        dataSource={data}
                        bordered
                        pagination={false}
                    ></Table>
                    <Row gutter={16} className="mt-3" justify="end">
                        <Form.Item
                            label={t("orderPurchase.form.fields.vat_total")}
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Input value={parsePriceVnd(totalVatAmount)} disabled />
                        </Form.Item>
                        <Col span={6}>
                            <Form.Item
                                label={t("orderPurchase.form.fields.grand_total")}
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 12 }}
                            >
                                <Input value={parsePriceVnd(totalAmount)} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <OrderPurchaseDetail
                        open={isOpenModalDetail}
                        handleOk={handleAddDetail}
                        handleCancel={() => {
                            setIsOpenModalDetail(false);
                            setEditingDetail(null);
                            setEditingIndex(null);
                        }}
                        initialData={editingDetail}
                    />
                </Card>
            </Form>
        </div>
    );
}