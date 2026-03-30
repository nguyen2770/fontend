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

export default function PurchaseQuotationDetail({
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
                        sparePart: initialData.item || initialData.sparePart?.id,
                        sparePartsName: initialData.name,
                        deliveryTime: initialData.deliveryTime
                            ? dayjs(initialData.deliveryTime, FORMAT_DATE)
                            : undefined
                    };
                } else {
                    data = {
                        ...initialData,
                        assetModelName: initialData.code,
                        assetName: initialData.name,
                        assetModel: initialData.item || initialData.assetModel?.id,
                        asset: initialData.asset?.id,
                        deliveryTime: initialData.deliveryTime
                            ? dayjs(initialData.deliveryTime, FORMAT_DATE)
                            : undefined,
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
        let result = {
            ...values,
            key: Date.now() + Math.random(),
            deliveryTime: values.deliveryTime
                ? dayjs(values.deliveryTime).format(FORMAT_DATE)
                : undefined,
            itemType: type,
            vatPercent: values.vatPercent || 0
        };

        if (type === "SpareParts") {
            result = {
                ...result,
                item: values.sparePart || initialData.item,
                code: selectedSparepart?.code || initialData?.code,
                name: selectedSparepart?.sparePartsName || initialData.name,
                uomName:
                    selectedSparepart?.uomId?.uomName || initialData.uomName,
                uom: selectedSparepart?.uomId?.id,
                vatAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0),
                totalAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0) +
                    parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0)
            };
        } else if (type === "AssetModel") {
            result = {
                ...result,
                item: values.assetModel || initialData.item,
                name: values.assetName || initialData.name,
                code: values.assetModelName || initialData.code,
                uomName: values.uom?.label,
                uom: values.uom?.value,
                vatAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0),
                totalAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0) +
                    parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0)
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
                <Card
                    title={t("purchaseQuotation.detailModal.title_create")}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name="type"
                                label={t("purchaseQuotation.detailModal.type_label")}
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
                                        {t("purchaseQuotation.detailModal.radio_spare")}
                                    </Radio>
                                    <Radio value="AssetModel">
                                        {t("purchaseQuotation.detailModal.radio_asset")}
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
                                    label={t("purchaseQuotation.detailModal.spare_part_label")}
                                    name="sparePartsName"
                                    rules={[
                                        {
                                            required: true,
                                            message: t(
                                                "purchaseQuotation.detailModal.validation.required_spare_part"
                                            )
                                        }
                                    ]}
                                >
                                    <Input
                                        readOnly
                                        placeholder={t(
                                            "purchaseQuotation.detailModal.spare_part_placeholder"
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
                                        label={t(
                                            "purchaseQuotation.detailModal.device_label"
                                        )}
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    "purchaseQuotation.detailModal.validation.required_device"
                                                )
                                            }
                                        ]}
                                    >
                                        <Input
                                            readOnly
                                            style={{ cursor: "pointer" }}
                                            placeholder={t(
                                                "purchaseQuotation.detailModal.device_placeholder"
                                            )}
                                            onClick={() => setIsOpenAssetModel(true)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="assetModelName"
                                        label={t("purchaseQuotation.detailModal.model_label")}
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    "purchaseQuotation.detailModal.validation.required_model"
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
                                        label={t("purchaseQuotation.detailModal.uom_label")}
                                    >
                                        <Select
                                            placeholder={t(
                                                "purchaseQuotation.detailModal.uom_label"
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
                                label={t("purchaseQuotation.detailModal.qty_label")}
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "purchaseQuotation.detailModal.validation.required_qty"
                                        )
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder={t(
                                        "purchaseQuotation.detailModal.qty_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="unitPrice"
                                label={t(
                                    "purchaseQuotation.detailModal.unit_price_label"
                                )}
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "purchaseQuotation.detailModal.validation.required_unit_price"
                                        )
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder={t(
                                        "purchaseQuotation.detailModal.unit_price_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="vatPercent"
                                label={t(
                                    "purchaseQuotation.detailModal.vat_percent_label"
                                )}
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value > 100
                                                ? Promise.reject(
                                                    t(
                                                        "purchaseQuotation.detailModal.validation.vat_too_large"
                                                    )
                                                )
                                                : Promise.resolve()
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder={t(
                                        "purchaseQuotation.detailModal.vat_percent_placeholder"
                                    )}
                                    min={0}
                                    max={100}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="supplier"
                                label={t("purchaseQuotation.detailModal.supplier_label")}
                            >
                                <Input
                                    placeholder={t(
                                        "purchaseQuotation.detailModal.supplier_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="deliveryTime"
                                label={t(
                                    "purchaseQuotation.detailModal.delivery_time_label"
                                )}
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="note"
                                label={t("purchaseQuotation.detailModal.note_label")}
                            >
                                <Input.TextArea
                                    placeholder={t(
                                        "purchaseQuotation.detailModal.note_placeholder"
                                    )}
                                    rows={3}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <div className="modal-footer">
                            <Button onClick={onCancel}>
                                {t("purchaseQuotation.detailModal.cancel")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("purchaseQuotation.detailModal.confirm")}
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
                        form.setFieldsValue({
                            sparePart: sp.id,
                            sparePartsName: sp.sparePartsName
                        });
                        setSelectorVisible(false);
                    }}
                />

                <ChangeAssetModelModal
                    open={isOpenAssetModel}
                    handleCancel={() => setIsOpenAssetModel(false)}
                    form={form}
                    data={{
                        assetName: initialData?.name,
                        manufacturer: initialData?.manufacturer?.id,
                        assetTypeCategory: initialData?.assetTypeCategory?.id
                    }}
                    assetModelChange={assetModelChange}
                    onSelectAssetModel={(_assetModel) => {
                        setAssetModelChange(_assetModel);
                        form.setFieldsValue({
                            asset: _assetModel?.asset._id,
                            assetName: _assetModel?.asset.assetName,
                            manufacturer:
                                _assetModel.manufacturer?.manufacturerName,
                            category: _assetModel.category?.categoryName,
                            assetType: _assetModel.assetType?.name,
                            subCategory:
                                _assetModel.subCategory?.subCategoryName,
                            assetModelName: _assetModel.assetModelName,
                            assetModel: _assetModel.id,
                            assetTypeCategory: _assetModel.assetTypeCategory?._id,
                            supplier: _assetModel.supplier?.supplierName
                        });
                    }}
                />
            </Form>
        </Modal>
    );
}