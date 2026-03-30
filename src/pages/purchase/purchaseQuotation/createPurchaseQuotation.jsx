import { useState, useEffect } from "react";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Row,
    Col,
    Card,
    Button,
    Input,
    Form,
    Select,
    message,
    DatePicker,
    Tabs
} from "antd";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { FORMAT_DATE } from "../../../utils/constant";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import QuotationDetailTable from "./QuotationDetailTable";
import PurchaseQuotationDetail from "./PurchaseQuotationDetail";
import QuotationAttachment from "./QuotationAttachment";
import CreateQuotationAttachment from "./QuotationAttachment/createQuotationAttachment";
import { useTranslation } from "react-i18next";

export default function CreateQuotation() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useCustomNav();
    const { user } = useAuth();

    const [data, setData] = useState([]);
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    const [purchaseRequest, setPurchaseRequest] = useState([]);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [files, setFiles] = useState([]);

    const onClickDelete = async (record) => {
        setAttachments(attachments.filter((a) => a.resourceId !== record.resourceId));
        setFiles(files.filter((a) => a.key !== record.key));
    };

    const handleAddAttachments = (newItems) => {
        setAttachments((prev) => [...prev, ...newItems]);
    };

    useEffect(() => {
        form.setFieldsValue({ createdName: user.fullName, createdBy: user.id });
        fetchPurchaseRequest();
    }, []);

    const fetchPurchaseRequest = async () => {
        const res = await _unitOfWork.requestPurchase.getAllRequestPurchase();
        if (res?.data) {
            const option = res.data.map((item) => ({
                label: item.code,
                value: item.id
            }));
            setPurchaseRequest(option);
        }
    };

    const handleChangePurchaseRequest = async (id) => {
        const res =
            await _unitOfWork.requestPurchase.getRequestPurchasesDetailById({ id });
        if (res?.data) {
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
                            item: item.sparePart?.id,
                            name: item.sparePart?.sparePartsName,
                            uomName: item.sparePart?.uomId?.uomName,
                            needDate: item.needDate
                                ? dayjs(item.needDate).format(FORMAT_DATE)
                                : undefined,
                            vatAmount,
                            totalAmount
                        };
                    }
                    return {
                        ...item,
                        code: item.assetModel?.assetModelName || "",
                        name:
                            item.assetModel?.asset?.assetName || item.asset?.assetName,
                        item: item.assetModel?.id,
                        needDate: item.needDate
                            ? dayjs(item.needDate).format(FORMAT_DATE)
                            : undefined,
                        vatAmount,
                        totalAmount,
                        uomName: item.uom?.uomName,
                        uom: item.uom?.id
                    };
                })
            );
            setData(dataTable);
        }
    };

    const handleAddDetail = (newData) => {
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

    const handleDelete = (record) => {
        setData((prev) =>
            prev.filter((item) =>
                item.id ? item.id !== record.id : item.key !== record.key
            )
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
        let values = form.getFieldsValue();
        values = {
            ...values,
            quotationDate: values.quotationDate ?? undefined
        };
        const detailData = data.map((item) => ({
            ...item,
            deliveryTime: item.deliveryTime
                ? dayjs(item.deliveryTime, FORMAT_DATE).toDate()
                : null
        }));

        // upload file
        const uploadedItems = await Promise.all(
            files.map(async (item) => {
                if (item.file) {
                    const formData = new FormData();
                    formData.append("file", item.file);
                    const res = await _unitOfWork.resource.uploadImage(formData);
                    if (res) {
                        return { ...res, resourceType: item.resourceType };
                    }
                }
            })
        );
        const payload = {
            quotation: values,
            quotationDetail: detailData,
            attachments: uploadedItems
        };
        const res =
            await _unitOfWork.purchaseQuotation.createPurchaseQuotation(payload);
        if (res?.code === 1) {
            message.success(t("purchaseQuotation.messages.create_success"));
            navigate(-1);
        }
    };

    return (
        <Form
            labelWrap
            form={form}
            onFinish={() =>
                Confirm(
                    t("purchaseQuotation.messages.confirm_create"),
                    onFinish
                )
            }
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <Card
                title={t("purchaseQuotation.form.create_title")}
                extra={
                    <>
                        <Button onClick={() => navigate(-1)}>
                            <ArrowLeftOutlined /> {t("purchase.buttons.back")}
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="ml-2"
                        >
                            <SaveOutlined /> {t("purchase.buttons.save")}
                        </Button>
                    </>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("purchaseQuotation.form.fields.creator")}
                            name="createdName"
                            labelAlign="left"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("purchaseQuotation.form.fields.supplier")}
                            name="supplier"
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t(
                                "purchaseQuotation.form.fields.contact_phone"
                            )}
                            name="contactPhone"
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t(
                                "purchaseQuotation.form.fields.contact_address"
                            )}
                            name="contactAddress"
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("purchaseQuotation.form.fields.email")}
                            name="email"
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t(
                                "purchaseQuotation.form.fields.quotation_date"
                            )}
                            name="quotationDate"
                            labelAlign="left"
                        >
                            <DatePicker format={FORMAT_DATE} className="w-100" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t(
                                "purchaseQuotation.form.fields.request_purchase"
                            )}
                            name="requestPurchase"
                            labelAlign="left"
                        >
                            <Select
                                options={purchaseRequest}
                                onChange={(value) => {
                                    if (data) {
                                        setData([]);
                                    }
                                    Confirm(
                                        t(
                                            "purchaseQuotation.messages.confirm_import_request"
                                        ),
                                        () => {
                                            handleChangePurchaseRequest(value);
                                        }
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("purchaseQuotation.form.fields.note")}
                            name="note"
                            labelAlign="left"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Tabs
                    defaultActiveKey="detail"
                    items={[
                        {
                            key: "detail",
                            label: t("purchaseQuotation.tabs.detail"),
                            children: (
                                <QuotationDetailTable
                                    data={data}
                                    onEdit={(record, index) => {
                                        setEditingIndex(index);
                                        setEditingDetail(record);
                                        setIsOpenModalDetail(true);
                                    }}
                                    onDelete={handleDelete}
                                    onAdd={() => {
                                        setEditingDetail(null);
                                        setEditingIndex(null);
                                        setIsOpenModalDetail(true);
                                    }}
                                />
                            )
                        },
                        {
                            key: "attachment",
                            label: t("purchaseQuotation.tabs.attachment"),
                            children: (
                                <QuotationAttachment
                                    attachments={files}
                                    handleAdd={() => {
                                        setIsOpenCreate(true);
                                    }}
                                    handleDelete={onClickDelete}
                                />
                            )
                        }
                    ]}
                />
                <PurchaseQuotationDetail
                    open={isOpenModalDetail}
                    handleOk={handleAddDetail}
                    handleCancel={() => {
                        setIsOpenModalDetail(false);
                        setEditingDetail(null);
                        setEditingIndex(null);
                    }}
                    initialData={editingDetail}
                />
                <CreateQuotationAttachment
                    open={isOpenCreate}
                    handleCancel={() => setIsOpenCreate(false)}
                    handleOk={handleAddAttachments}
                    handleFinish={(data) => setFiles([...files, ...data])}
                />
            </Card>
        </Form>
    );
}