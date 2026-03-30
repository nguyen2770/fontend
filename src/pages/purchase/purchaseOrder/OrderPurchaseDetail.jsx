import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Radio,
    Row,
    Select
} from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { FORMAT_DATE } from "../../../utils/constant";
import dayjs from "dayjs";
import SparepartSelector from "../SparePartSelectionModal";
import ChangeAssetModelModal from "../../../components/modal/assetModel/ChangeAssetModelModal";
import { useTranslation } from "react-i18next";

export default function OrderPurchaseDetail({
    open,
    handleOk,
    handleCancel,
    initialData
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [uom, setUom] = useState([]);
    const [type, setType] = useState("SpareParts");
    const [selectedSparepart, setSelectedSparepart] = useState(null);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [isOpenAssetModel, setIsOpenAssetModel] = useState(false);
    const [assetModelChange, setAssetModelChange] = useState(null);

    useEffect(() => {
        if (open) {
            getAllUom();
            form.resetFields();
            setType("SpareParts");
        }
    }, [open]);

    useEffect(() => {
        const fetchData = async () => {
            if (initialData) {
                setType(initialData.itemType);
                let data;
                if (initialData.itemType === "SpareParts") {
                    data = {
                        ...initialData,
                        sparePart: initialData.item,
                        needDate: initialData.needDate
                            ? dayjs(initialData.needDate, FORMAT_DATE)
                            : null
                    };
                } else {
                    data = {
                        ...initialData,
                        assetModelName: initialData.code,
                        assetName: initialData.name,
                        assetModel: initialData.item || initialData.assetModel,
                        asset: initialData.asset?.id,
                        needDate: initialData.needDate
                            ? dayjs(initialData.needDate, FORMAT_DATE)
                            : null,
                        uom: {
                            value: initialData.uom,
                            label: initialData.uomName
                        }
                    };
                }
                form.setFieldsValue({
                    type: initialData.itemType || "SpareParts",
                    ...data
                });
            } else {
                form.resetFields();
                setType("SpareParts");
            }
        };
        fetchData();
    }, [initialData, form]);

    const getAllUom = async () => {
        const res = await _unitOfWork.uom.getAllUom();
        if (res) setUom(res.data);
    };

    const onFinish = async () => {
        const values = form.getFieldsValue();
        const qty = parseFloat(values.qty || 0);
        const unitPrice = parseFloat(values.unitPrice || 0);
        const vatPercent = parseFloat(values.vatPercent || 0);
        const vatAmount = (vatPercent / 100) * qty * unitPrice;
        const totalAmount = qty * unitPrice + vatAmount;

        let result = {
            ...values,
            key: Date.now() + Math.random(),
            needDate: values.needDate
                ? dayjs(values.needDate).format(FORMAT_DATE)
                : undefined,
            itemType: type,
            vatPercent,
            vatAmount,
            totalAmount,
            purchaseRequestDetail: initialData?.purchaseRequestDetail ? initialData?.purchaseRequestDetail : null,

        };

        if (type === "SpareParts") {
            result = {
                ...result,
                item: values.sparePart || initialData.item,
                code: selectedSparepart?.code || initialData?.code,
                name:
                    selectedSparepart?.sparePartsName || initialData.name,
                uomName:
                    selectedSparepart?.uomId?.uomName || initialData.uomName,
                uom: selectedSparepart?.uomId?.id
            };
        } else if (type === "AssetModel") {
            result = {
                ...result,
                item: values.assetModel || initialData.item,
                name: values.assetName || initialData.name,
                code: values.assetModelName || initialData.code,
                uomName: values.uom?.label,
                uom: values.uom?.value
            };
        }
        handleOk(result);
        form.resetFields();
        handleCancel();
    };

    const onCancel = () => {
        form.resetFields();
        handleCancel();
    };

    return (
        <Modal
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            className="custom-modal"
            closable={true}
            footer={null}
            width={800}
        >
            <Form labelWrap form={form} onFinish={onFinish} layout="vertical">
                <Card title={t("orderPurchase.detailModal.title_create")}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name="type"
                                label={t("orderPurchase.detailModal.type_label")}
                                initialValue="SpareParts"
                            >
                                <Radio.Group
                                    value={type}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setType(value);
                                        form.setFieldsValue({
                                            type: value,
                                            sparePart: undefined,
                                            asset: undefined,
                                            assetModel: undefined
                                        });
                                    }}
                                >
                                    <Radio value="SpareParts">
                                        {t("orderPurchase.detailModal.radio_spare")}
                                    </Radio>
                                    <Radio value="AssetModel">
                                        {t("orderPurchase.detailModal.radio_asset")}
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        {type === "SpareParts" && (
                            <Col span={24}>
                                <Form.Item name="sparePart" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label={t("orderPurchase.detailModal.spare_part_label")}
                                >
                                    <Input
                                        readOnly
                                        value={
                                            selectedSparepart?.sparePartsName ||
                                            initialData?.name ||
                                            ""
                                        }
                                        placeholder={t(
                                            "orderPurchase.detailModal.spare_part_placeholder"
                                        )}
                                        onClick={() => setSelectorVisible(true)}
                                    />
                                </Form.Item>
                            </Col>
                        )}
                        {type === "AssetModel" && (
                            <>
                                <Col span={12}>
                                    <Form.Item
                                        name="assetName"
                                        label={t("orderPurchase.detailModal.device_label")}
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    "orderPurchase.detailModal.validation.required_device"
                                                )
                                            }
                                        ]}
                                    >
                                        <Input
                                            readOnly
                                            style={{ cursor: "pointer" }}
                                            placeholder={t(
                                                "orderPurchase.detailModal.device_placeholder"
                                            )}
                                            onClick={() => setIsOpenAssetModel(true)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="assetModelName"
                                        label={t("orderPurchase.detailModal.model_label")}
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    "orderPurchase.detailModal.validation.required_model"
                                                )
                                            }
                                        ]}
                                    >
                                        <Input disabled placeholder="Asset Model Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="uom"
                                        label={t("orderPurchase.detailModal.uom_label")}
                                    >
                                        <Select
                                            placeholder={t(
                                                "orderPurchase.detailModal.uom_label"
                                            )}
                                            options={uom.map((item) => ({
                                                label: item.uomName,
                                                value: item.id
                                            }))}
                                            labelInValue
                                        />
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                        <Col span={12}>
                            <Form.Item
                                name="qty"
                                label={t("orderPurchase.detailModal.qty_label")}
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "orderPurchase.detailModal.validation.required_qty"
                                        )
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder={t(
                                        "orderPurchase.detailModal.qty_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="unitPrice"
                                label={t("orderPurchase.detailModal.unit_price_label")}
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "orderPurchase.detailModal.validation.required_unit_price"
                                        )
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder={t(
                                        "orderPurchase.detailModal.unit_price_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="vatPercent"
                                label={t("orderPurchase.detailModal.vat_percent_label")}
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value > 100
                                                ? Promise.reject(
                                                    t(
                                                        "orderPurchase.detailModal.validation.vat_too_large"
                                                    )
                                                )
                                                : Promise.resolve()
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder={t(
                                        "orderPurchase.detailModal.vat_percent_placeholder"
                                    )}
                                    min={0}
                                    max={100}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="needDate"
                                label={t("orderPurchase.detailModal.need_date_label")}
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="usagePurpose"
                                label={t(
                                    "orderPurchase.detailModal.usage_purpose_label"
                                )}
                            >
                                <Input
                                    placeholder={t(
                                        "orderPurchase.detailModal.usage_purpose_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="note"
                                label={t("orderPurchase.detailModal.note_label")}
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder={t(
                                        "orderPurchase.detailModal.note_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <div className="modal-footer">
                            <Button onClick={onCancel}>
                                {t("orderPurchase.detailModal.cancel")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("orderPurchase.detailModal.confirm")}
                            </Button>
                        </div>
                    </Row>
                    <Form.Item name="asset" noStyle>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item name="assetModel" noStyle>
                        <Input type="hidden" />
                    </Form.Item>
                </Card>
                <SparepartSelector
                    value={form.getFieldValue("sparePart")}
                    visible={selectorVisible}
                    onClose={() => setSelectorVisible(false)}
                    onSelect={(sp) => {
                        setSelectedSparepart(sp);
                        form.setFieldsValue({ sparePart: sp.id });
                        setSelectorVisible(false);
                    }}
                />
                <ChangeAssetModelModal
                    open={isOpenAssetModel}
                    handleCancel={() => setIsOpenAssetModel(false)}
                    form={form}
                    assetModelChange={assetModelChange}
                    onSelectAssetModel={(_assetModel) => {
                        setAssetModelChange(_assetModel);
                        form.setFieldsValue({
                            asset: _assetModel?.asset._id,
                            assetName: _assetModel?.asset.assetName,
                            manufacturer: _assetModel.manufacturer?.manufacturerName,
                            category: _assetModel.category?.categoryName,
                            assetType: _assetModel.assetType?.name,
                            subCategory: _assetModel.subCategory?.subCategoryName,
                            assetModelName: _assetModel.assetModelName,
                            assetModel: _assetModel.id,
                            assetTypeCategory: _assetModel.assetTypeCategory?._id,
                            supplier: _assetModel.supplier?.supplierName
                        });
                    }}
                    data={{
                        assetName: initialData?.name,
                        manufacturer: initialData?.manufacturer?.id,
                        assetTypeCategory: initialData?.assetTypeCategory?.id
                    }}
                />
            </Form>
        </Modal>
    );
}