import { useState, useEffect } from "react";
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
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
} from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from '../../../contexts/authContext';
import OrderPurchaseDetail from "./OrderPurchaseDetail";
import ConfirmWithReasonModal from "../../../components/modal/ConfirmWithReason";
import { parsePriceVnd } from "../../../helper/price-helper";
import { parseDate } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";

export default function ApproveReceiptPurchase() {
    const [form] = Form.useForm();
    const navigate = useCustomNav();
    const { user } = useAuth();
    const { t } = useTranslation();

    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
    const [data, setData] = useState([])
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([])
    const [editingDetail, setEditingDetail] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [purchaseOrder, setPurchaseOrder] = useState([]);
    const [action, setAction] = useState()
    const [isOpenModalReject, setIsOpenModalReject] = useState();
    const [suppliers, setSuppliers] = useState([]);
    const [locationDest, setLocationDest] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        fetchReceiptPurchaseById(id);
        fetchDepartments();
        fetchBranches();
        fetchSuppliers();
        fetchDataTable();
        fetchStockLocation();

    }, []);

    const fetchReceiptPurchaseById = async (id) => {
        const res = await _unitOfWork.receiptPurchase.getReceiptPurchaseById({ id: id })
        if (res) {
            const converted = {
                ...res,
                warehouseReceivedDate: res.warehouseReceivedDate ? dayjs(res.warehouseReceivedDate) : null,
                productionDate: res.productionDate ? dayjs(res.productionDate).format(FORMAT_DATE) : null,
                createdName: res.createdBy?.fullName,
                purchaseOrder: res.purchaseOrder?.id,
            };
            form.setFieldsValue(converted); setAction(res.state);
            setPurchaseOrder(prev => ([
                ...prev,
                {
                    label: res.purchaseOrder?.code,
                    value: res.purchaseOrder?.id,
                }
            ]));
        }
    }

    const fetchSuppliers = async () => {
        const supplier = await _unitOfWork.supplier.getAllSupplier();
        if (supplier?.data) {
            setSuppliers(supplier.data);
        }
    }
    const fetchStockLocation = async () => {
        const payload = {
            page: 1,
            limit: 100,
        }
        const res = await _unitOfWork.stockLocation.getListStockLocation(payload);
        if (res?.code === 1 && res?.results) {
            const option = res.results?.results.map(item => ({
                label: item.name,
                value: item.id,
            }));
            setLocationDest(option)
        }
    }
    const fetchDepartments = async () => {
        const department = await _unitOfWork.department.getAllDepartment();
        if (department?.data) {
            const option = department.data.map(item => ({
                label: item.departmentName,
                value: item.id,
            }))
            setDepartments(option)
        }
    }

    const fetchBranches = async () => {
        const branch = await _unitOfWork.branch.getAllBranch();
        if (branch?.data) {
            const option = branch.data.map(item => ({
                label: item.name,
                value: item.id,
            }))
            setBranches(option)
        }
    }

    const handleChangePurchaseOrder = async (id) => {
        const res = await _unitOfWork.purchaseOrder.getPurchaseOrderDetailById({ id })
        if (res.data) {
            const dataTable = await Promise.all(
                res.data.map(async (item) => {
                    if (item.itemType == "SpareParts") {
                        return {
                            ...item,
                            code: item.item?.code,
                            name: item.item?.sparePartsName,
                            item: item.item.id || item.item,
                            uomName: item.item.uomId?.uomName,
                            purchaseOrderDetail: item.id || item._id,
                            vatAmount: (parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0),
                            totalAmount:
                                (parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0) +
                                parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0),
                        };
                    } else {
                        return {
                            ...item,
                            code: item.item?.assetModelName,
                            name: item.item.asset?.assetName,
                            item: item.item.id || item.item,
                            purchaseOrderDetail: item.id || item._id,
                            vatAmount: (parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0),
                            totalAmount:
                                (parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0) +
                                parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0),
                        };
                    }
                })
            );
            setData(dataTable);
        }
    }

    const fetchDataTable = async () => {
        const res = await _unitOfWork.receiptPurchase.getReceiptPurchaseDetailById({ id: id });
        if (res.data) {
            const dataTable = await Promise.all(
                res.data.map(async (item) => {
                    if (item.itemType == "SpareParts") {
                        return {
                            ...item,
                            code: item.item?.code,
                            name: item.item?.sparePartsName,
                            item: item.item.id,
                            uomName: item.item.uomId?.uomName,
                            productionDate: item.productionDate ? dayjs(item.productionDate).format(FORMAT_DATE) : null,
                            vatAmount: ((parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0)),
                            totalAmount:
                                ((parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0) +
                                    parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0)),
                        };
                    } else {
                        return {
                            ...item,
                            code: item.item?.assetModelName,
                            name: item.item.asset?.assetName,
                            item: item.item.id,
                            uomName: item.uomId?.uomName,
                            uom: item.uomId?.id,
                            productionDate: item.productionDate ? dayjs(item.productionDate).format(FORMAT_DATE) : null,
                            vatAmount: ((parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0)),
                            totalAmount:
                                ((parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0) +
                                    parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0)),

                        };
                    }
                })
            );
            setData(dataTable);
        }
    }

    const handleAddDetail = async (newData) => {
        if (editingIndex !== null) {
            const newList = [...data];
            newList[editingIndex] = newData;
            setData(newList);
            setEditingIndex(null);
            setEditingDetail(null);
        } else {
            setData(prev => [...prev, newData]);
        }
        setIsOpenModalDetail(false);
    }

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
    }

    const onFinish = async () => {
        const values = form.getFieldsValue();
        const convertedDetails = data.map(item => ({
            ...item,
            item: (item?.item?.id) || item.item,
            productionDate: dayjs(item.productionDate, FORMAT_DATE).toDate(),
            uomId: item.uomId?.id,
        }));
        const payload = {
            stockReceipt: {
                ...values,
                state: "approved",
            },
            stockReceiptDetail: [...convertedDetails]
        }
        const suppilersNeed = await _unitOfWork.receiptPurchase.approve({ id: id, payload });
        if (suppilersNeed) {
            message.success(t("receiptPurchase.messages.approveSuccess"))
            navigate(-1)
        }
    };

    const handleReject = async (reason) => {
        const payload = {
            stockReceipt: {
                state: "rejected",
                comment: reason,
            },
        }
        const res = await _unitOfWork.receiptPurchase.updateReceiptPurchase({ id: id, payload });
        if (res) {
            message.success(t("receiptPurchase.messages.rejectSuccess"))
            navigate(-1)
        }
    };

    const columns = [
        {
            title: t("receiptPurchase.table.stt"),
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t("receiptPurchase.table.itemCode"),
            dataIndex: "code",
            key: "code",
            width: 120,
        },
        {
            title: t("receiptPurchase.table.itemName"),
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: t("receiptPurchase.table.uom"),
            dataIndex: "uomName",
            key: "uomName",
            width: 80,
            align: "center",
        },
        {
            title: t("receiptPurchase.table.qty"),
            dataIndex: "qty",
            key: "qty",
            width: 100,
            align: "right",
        },
        {
            title: t("receiptPurchase.table.unitPrice"),
            dataIndex: "unitPrice",
            key: "unitPrice",
            width: 120,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ"),
        },
        {
            title: t("receiptPurchase.table.vatPercent"),
            dataIndex: "vatPercent",
            key: "vatPercent",
            width: 100,
            align: "right",
        },
        {
            title: t("receiptPurchase.table.vatAmount"),
            dataIndex: "vatAmount",
            key: "vatAmount",
            width: 120,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ"),
        },
        {
            title: t("receiptPurchase.table.totalAmount"),
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 140,
            align: "right",
            render: (text) => (text ? parsePriceVnd(text) : "0 đ"),
        },
        {
            title: t("receiptPurchase.fields.usagePurpose"),
            dataIndex: "usagePurpose",
            key: "usagePurpose",
            width: 180,
        },
        {
            title: t("receiptPurchase.table.note"),
            dataIndex: "note",
            key: "note",
            width: 150,
        },
        {
            title: t("receiptPurchase.table.action"),
            key: "action",
            dataIndex: "action",
            fixed: "right",
            width: 100,
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                    <Tooltip title={t("receiptPurchase.actions.edit")}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {
                                const index1 = data.findIndex(item => (item.id === record.id));
                                if (index1 != -1 && record.id) {
                                    setEditingIndex(index1)
                                } else if (record.key) {
                                    const index2 = data.findIndex(item => (item.key === record.key));
                                    setEditingIndex(index2)
                                }
                                setEditingDetail(record);
                                setIsOpenModalDetail(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={t("receiptPurchase.actions.delete")}>
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Form
labelWrap
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={() => Confirm(t("receiptPurchase.confirm.approve"), () => onFinish())}
            >
                <Card
                    title={
                        action === "pendingApproval"
                            ? t("receiptPurchase.titles.approval")
                            : t("receiptPurchase.titles.detail")
                    }
                    extra={
                        <>
                            <Button className="mr-2" onClick={() => navigate(-1)}>
                                <ArrowLeftOutlined /> {t("receiptPurchase.actions.back")}
                            </Button>
                            {action && action === "pendingApproval" && (
                                <>
                                    <Button
                                        type="primary"
                                        className="mr-2"
                                        icon={<CheckCircleOutlined />}
                                        onClick={onFinish}
                                    >
                                        {t("receiptPurchase.actions.approve")}
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => setIsOpenModalReject(true)}
                                    >
                                        {t("receiptPurchase.actions.reject")}
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
                                label={t("receiptPurchase.form.createdBy")}
                                name="createdName"
                            >
                                <Input disabled value={user.fullName} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.locationDest")}
                                name="locationDest"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Không bỏ trống"),
                                    },
                                ]}
                            >
                                <Select options={locationDest}></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.branch")}
                                name="branch"
                            >
                                <Select options={branches}></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.department")}
                                name="department"
                            >
                                <Select options={departments}></Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.warehouseReceivedDate")}
                                name="warehouseReceivedDate"
                                rules={[
                                    {
                                        required: true,
                                        message: t("receiptPurchase.validate.selectWarehouseReceivedDate"),
                                    },
                                ]}
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.supplier")}
                                name="supplier"
                                rules={[
                                    {
                                        required: true,
                                        message: t("receiptPurchase.validate.enterSupplier"),
                                    },
                                ]}
                            >
                                <Select
                                    options={suppliers.map(item => ({
                                        label: item.supplierName,
                                        value: item.id,
                                    }))}
                                    showSearch
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.phoneNumber")}
                                name="phoneNumber"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.address")}
                                name="address"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.description")}
                                name="description"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("receiptPurchase.form.purchaseOrder")}
                                name="purchaseOrder"
                            >
                                <Select
                                    options={purchaseOrder}
                                    onChange={(value) => handleChangePurchaseOrder(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left" size="small">{t("receiptPurchase.section.materials")}</Divider>
                    {action === "pendingApproval" && (
                        <Row className="float-right mb-2">
                            <Button type="primary" htmlType="button" className="bt-green float-right" onClick={() => setIsOpenModalDetail(true)}>
                                <PlusOutlined />
                                {t("receiptPurchase.actions.addItem")}
                            </Button>
                        </Row>
                    )}
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
                    <ConfirmWithReasonModal
                        visible={isOpenModalReject}
                        onConfirm={handleReject}
                        onCancel={() => setIsOpenModalReject(false)}
                    />
                </Card>
            </Form>
        </div>
    );
}