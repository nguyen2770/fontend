import { useState, useEffect, useMemo } from "react";
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
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { FORMAT_DATE } from "../../../utils/constant";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from '../../../contexts/authContext';
import ConfirmWithReasonModal from "../../../components/modal/ConfirmWithReason";
import { parsePriceVnd } from "../../../helper/price-helper";
import ModalStockIssue from "../../../components/modal/ModalStockIssue";
import { useTranslation } from "react-i18next";

export default function ApprovalReceiptIssue() {
    const [form] = Form.useForm();
    const navigate = useCustomNav();
    const { user } = useAuth();
    const { t } = useTranslation();

    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
    const [data, setData] = useState([])
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [issuedBy, setIssuedBy] = useState([]);
    const [receiver, setReceiver] = useState([]);
    const [editingDetail, setEditingDetail] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [purchaseOrder, setPurchaseOrder] = useState();
    const [action, setAction] = useState()
    const [isOpenModalReject, setIsOpenModalReject] = useState();
    const [locationSrc, setLocationSrc] = useState([]);
    const department = Form.useWatch("department", form);

    const { id } = useParams();

    useEffect(() => {
        fetchDepartments();
        fetchIssuedBy();
        fetchRequestIssue();
        fetchReceiptIssueById();
        fetchDataTable();
        fetchStockLocation();

    }, []);

    const userFilter = useMemo(() => {
        if (!issuedBy) return;
        return department
            ? issuedBy.filter(u => u.option.department === department)
            : issuedBy;

    }, [issuedBy, department])

    const fetchReceiptIssueById = async () => {
        const res = await _unitOfWork.receiptIssue.getReceiptIssueById({ id: id })
        if (res) {
            const converted = {
                ...res.receiptIssue,
                issueDate: res.receiptIssue?.issueDate ? dayjs(res.receiptIssue?.issueDate) : null,
                createdName: res.receiptIssue?.createdBy?.fullName,
            };
            form.setFieldsValue(converted); setAction(res.receiptIssue?.action);
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
            setLocationSrc(option)
        }
    }

    const fetchRequestIssue = async () => {
        const res = await _unitOfWork.requestIssue.getAllRequestIssue()
        if (res) {
            const option = res.data.map(item => ({
                label: item.code,
                value: item.id,
            }))
            setPurchaseOrder(option)
        }
    }

    const fetchIssuedBy = async () => {
        const res = await _unitOfWork.user.getAllUser()
        if (res) {
            const option = res.data.map(item => ({
                label: item.fullName,
                value: item.id,
                option: item,

            }))
            setIssuedBy(option)
        }
    }


    const handleChangeRequestIssue = async (id) => {
        const res = await _unitOfWork.requestIssue.getRequestIssuesDetailById({ id })
        if (res.data) {
            handleSetDataTable({ ...res.data, create: true })
        }
    }

    const fetchDataTable = async () => {
        const res = await _unitOfWork.receiptIssue.getReceiptIssueDetailById({ id })
        if (res.data) {
            handleSetDataTable(res.data)
        }
    }

    const handleSetDataTable = async (data) => {
        const dataTable = await Promise.all(
            data.map(async (item) => {
                if (item.itemType == "SpareParts") {
                    return {
                        ...item,
                        code: item.item?.code,
                        name: item.item?.sparePartsName,
                        item: item.item.id,
                        purchaseOrderDetail: item.id,
                        uomName: item.item.uomId?.uomName,
                        vatAmount: ((parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0)),
                        totalAmount:
                            ((parseFloat(item.vatPercent || 0) / 100) * parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0) +
                                parseFloat(item.qty || 0) * parseFloat(item.unitPrice || 0)),
                    };
                } else {
                    return {
                        ...item,
                        code: item.item?.assetModelName,
                        name: item.item?.asset?.assetName,
                        item: item.item.id,
                        uomName: item.uomId?.uomName,
                        uom: item.uomId?.id,
                        purchaseOrderDetail: item.id,
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

    const handleAddDetail = async (newData) => {
        if (newData.id) {
            newData = { ...newData, purchaseOrderDetail: newData.id }
        }
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
            item: item.item?.id || item.item,
            issueDate: dayjs(item.needDate, FORMAT_DATE).toDate(),
            uomId: item.uomId?.id,
        }));
        const payload = {
            stockIssue: {
                ...values,
                action: "approved",
            },
            stockIssueDetail: [...convertedDetails],
        }
        const receiptIssue = await _unitOfWork.receiptIssue.approve({ id: id, payload });
        if (receiptIssue) {
            message.success(t("stockIssue.messages.updateSuccess"))
            navigate(-1)
        }
    };

    const handleReject = async (reason) => {
        const payload = {
            stockIssue: {
                action: "rejected",
                comment: reason,
            },

        }
        const res = await _unitOfWork.receiptIssue.updateReceiptIssue({ id: id, payload });
        if (res) {
            message.success(t("stockIssue.messages.rejectSuccess"))
            navigate(-1)
        }
    };

    const columns = [
        {
            title: t("stockIssue.table.stt"),
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t("stockIssue.table.itemCode"),
            dataIndex: "code",
            key: "code",
            width: 120,
        },
        {
            title: t("stockIssue.table.itemName"),
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: t("stockIssue.table.uom"),
            dataIndex: "uomName",
            key: "uomName",
            width: 80,
            align: "center",
        },
        {
            title: t("stockIssue.table.qty"),
            dataIndex: "qty",
            key: "qty",
            width: 100,
            align: "right",
        },
        // {
        //     title: t("stockIssue.table.unitPrice"),
        //     dataIndex: "unitPrice",
        //     key: "unitPrice",
        //     width: 120,
        //     align: "right",
        //     render: (text) => (text ? parsePriceVnd(text) : "0 đ"),

        // },
        // {
        //     title: t("stockIssue.table.vatPercent"),
        //     dataIndex: "vatPercent",
        //     key: "vatPercent",
        //     width: 100,
        //     align: "right",
        // },
        // {
        //     title: t("stockIssue.table.vatAmount"),
        //     dataIndex: "vatAmount",
        //     key: "vatAmount",
        //     width: 120,
        //     align: "right",
        //     render: (text) => (text ? parsePriceVnd(text) : "0 đ"),

        // },
        // {
        //     title: t("stockIssue.table.totalAmount"),
        //     dataIndex: "totalAmount",
        //     key: "totalAmount",
        //     width: 140,
        //     align: "right",
        //     render: (text) => (text ? parsePriceVnd(text) : "0 đ"),

        // },
        {
            title: t("stockIssue.table.note"),
            dataIndex: "note",
            key: "note",
            width: 150,
        },
        {
            title: t("stockIssue.table.action"),
            key: "action",
            dataIndex: "action",
            fixed: "right",
            width: 100,
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                    <Tooltip title={t("stockIssue.actions.edit")}>
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
                                setEditingDetail({ ...record, create: 1 });
                                setIsOpenModalDetail(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={t("stockIssue.actions.delete")}>
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
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                onFinish={() => Confirm(t("stockIssue.confirm.title"), () => onFinish())}
            >
                <Card
                    title={
                        action === "pendingApproval"
                            ? t("stockIssue.titles.approval")
                            : t("stockIssue.titles.detail")
                    }
                    extra={
                        <>
                            <Button className="mr-2" onClick={() => navigate(-1)}>
                                <ArrowLeftOutlined /> {t("stockIssue.actions.back")}
                            </Button>
                            {action && action === "pendingApproval" && (
                                <>
                                    <Button
                                        type="primary"
                                        className="mr-2"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => Confirm(t("stockIssue.confirm.title"), () => onFinish())}
                                    >
                                        {t("stockIssue.actions.approve")}
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => setIsOpenModalReject(true)}

                                    >
                                        {t("stockIssue.actions.reject")}
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
                                label={t("stockIssue.form.createdBy")}
                                name="createdName"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("stockIssue.form.locationSrc")}
                                name="locationSrc"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Không bỏ trống"),
                                    },
                                ]}
                            >
                                <Select options={locationSrc}></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("stockIssue.form.department")}
                                name="department"
                            >
                                <Select
                                    options={departments}
                                    onChange={(value, option) => {
                                        form.setFieldValue("receiverUsers", undefined);
                                    }}
                                ></Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("stockIssue.form.receiver")}
                                name="receiverUsers"
                                rules={[
                                    {
                                        required: true,
                                        message: t("stockIssue.validate.selectReceiver"),
                                    },
                                ]}
                            >
                                <Select
                                    options={issuedBy}
                                    placeholder={t("stockIssue.form.receiver")}
                                    onChange={(value, option) => {

                                        const dep = option?.option?.department;

                                        form.setFieldValue("department", dep);
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("stockIssue.form.issuedBy")}
                                name="issuedBy"
                                rules={[
                                    {
                                        required: true,
                                        message: t("stockIssue.validate.selectIssuedBy"),
                                    },
                                ]}
                            >
                                <Select options={issuedBy}></Select>
                            </Form.Item>
                        </Col>


                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("stockIssue.form.issueDate")}
                                name="issueDate"
                                rules={[
                                    {
                                        required: true,
                                        message: t("stockIssue.validate.selectIssueDate"),
                                    },
                                ]}
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>


                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("stockIssue.form.description")}
                                name="description"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelAlign="left"
                                label={t("stockIssue.form.requestIssue")}
                                name="requestIssue"
                            >
                                <Select
                                    options={purchaseOrder}
                                    onChange={(value) => handleChangeRequestIssue(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left" size="small">{t("stockIssue.section.materials")}</Divider>
                    {action === "pendingApproval" && (
                        <Row className="float-right mb-2">
                            <Button type="primary" htmlType="button" className="bt-green float-right" onClick={() => setIsOpenModalDetail(true)}>
                                <PlusOutlined />
                                {t("stockIssue.actions.addItem")}
                            </Button>
                        </Row>
                    )}
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
                    <ModalStockIssue
                        open={isOpenModalDetail}
                        handleOk={handleAddDetail}
                        handleCancel={() => {
                            setIsOpenModalDetail(false);
                            setEditingDetail(null);
                            setEditingIndex(null);
                        }}
                        initialData={editingDetail}
                    >

                    </ModalStockIssue>
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