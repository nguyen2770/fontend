import { Button, Card, Col, DatePicker, Form, Input, Modal, Radio, Row, Select } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { FORMAT_DATE } from "../../../utils/constant";
import dayjs from "dayjs";
import SparepartSelector from "../SparePartSelectionModal";
import ChangeAssetModelModal from "../../../components/modal/assetModel/ChangeAssetModelModal";
import { useTranslation } from "react-i18next";

export default function OrderPurchaseDetail({ open, handleOk, handleCancel, initialData }) {
    const [form] = Form.useForm();
    const [uoms, setUoms] = useState([]);
    const [uomName, setUomName] = useState();
    const [type, setType] = useState("SpareParts");
    const [id, setId] = useState()
    const [selectedSparepart, setSelectedSparepart] = useState(null);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [isOpenAssetModel, setIsOpenAssetModel] = useState(false);
    const [assetModelChange, setAssetModelChange] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (open) {
            form.resetFields();
            fetchUoms();
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
                        sparePartName: initialData.name,
                        productionDate: initialData.productionDate ? dayjs(initialData.productionDate, FORMAT_DATE) : null,

                    };
                } else {
                    data = {
                        ...initialData,
                        assetModel: initialData.item,
                        assetModelName: initialData.code,
                        assetName: initialData.name,
                        asset: initialData.asset?.id,
                        productionDate: initialData.productionDate ? dayjs(initialData.productionDate, FORMAT_DATE) : null,

                    };
                }
                form.setFieldsValue({
                    type: initialData.itemType || "SpareParts",
                    ...data
                });
                if (initialData.id) setId(initialData.id)
            } else {
                form.resetFields();
                setType("SpareParts");
            }
        };
        fetchData();
    }, [initialData]);

    const fetchUoms = async () => {
        const res = await _unitOfWork.uom.getAllUom();
        if (res) setUoms(res.data);
    }

    const onFinish = async () => {
        const values = form.getFieldsValue();
        let result = {
            ...values,
            key: Date.now() + Math.random(),
            itemType: type,
            id: id ? id : null,
            purchaseOrderDetail: initialData?.purchaseOrderDetail ? initialData?.purchaseOrderDetail : null,
        };

        if (type === "SpareParts") {
            result = {
                ...result,
                item: values.sparePart || initialData.item,
                code: selectedSparepart?.code || initialData?.code,
                name: selectedSparepart?.sparePartsName || initialData.name,
                uomName: selectedSparepart?.uomId?.uomName || initialData.uomName,
                uom: selectedSparepart?.uomId?.id,
                vatAmount: (parseFloat(values.vatPercent || 0) / 100) * parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
                totalAmount:
                    (parseFloat(values.vatPercent || 0) / 100) * parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0) +
                    parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
            };
        } else if (type === "AssetModel") {
            result = {
                ...result,
                item: values.assetModel || initialData.item,
                name: values.assetName || initialData.name,
                uomName: uomName || initialData.uomName,
                uomId: values?.uom,
                code: values?.assetModelName || initialData.code,
                vatAmount: (parseFloat(values.vatPercent || 0) / 100) * parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
                totalAmount:
                    (parseFloat(values.vatPercent || 0) / 100) * parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0) +
                    parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
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
            <Form
labelWrap
                form={form}
                onFinish={onFinish}
                layout="vertical"

                initialValues={{
                    vatPercent: 0,
                }}
            >
                <Card title={t("receiptPurchase.detailModal.title")}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item name="type" label={t("receiptPurchase.detailModal.type.label")} initialValue="SpareParts">
                                <Radio.Group
                                    value={type}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setType(value);
                                        form.setFieldsValue({
                                            type: value,
                                            sparePart: undefined,
                                            asset: undefined,
                                            assetModel: undefined,
                                        });
                                    }}
                                >
                                    <Radio value="SpareParts">{t("receiptPurchase.detailModal.type.spareParts")}</Radio>
                                    <Radio value="AssetModel">{t("receiptPurchase.detailModal.type.assetModel")}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        {type === "SpareParts" && (
                            <Col span={24}>
                                <Form.Item
                                    name="sparePart"
                                    hidden
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label={t("receiptPurchase.detailModal.fields.sparePart")}
                                    name="sparePartName"
                                    rules={[{ required: true, message: t("receiptPurchase.detailModal.validate.requireSparePart") }]}
                                >
                                    <Input
                                        readOnly
                                        placeholder={t("receiptPurchase.detailModal.placeholders.clickToSelectSparePart")}
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
                                        label={t("receiptPurchase.detailModal.fields.asset")}
                                        rules={[{ required: true, message: t("receiptPurchase.detailModal.validate.requireAsset") }]}
                                    >
                                        <Input
                                            readOnly
                                            style={{ cursor: 'pointer' }}
                                            placeholder={t("receiptPurchase.detailModal.placeholders.clickToSelectAsset")}
                                            onClick={() => setIsOpenAssetModel(true)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="assetModelName"
                                        label={t("receiptPurchase.detailModal.fields.assetModel")}
                                        rules={[{ required: true, message: t("receiptPurchase.detailModal.validate.requireModel") }]}
                                    >
                                        <Input
                                            disabled
                                            placeholder={t("receiptPurchase.detailModal.fields.assetModel")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="uom"
                                        label={t("receiptPurchase.detailModal.fields.uom")}
                                        rules={[{ required: true, message: t("receiptPurchase.detailModal.validate.requireUom") }]}
                                    >
                                        <Select
                                            placeholder={t("receiptPurchase.detailModal.placeholders.selectUom")}
                                            options={(uoms).map((item) => ({
                                                value: item.id,
                                                label: item.uomName,
                                            }))}
                                            onChange={(value, option) => {
                                                setUomName(option.label)
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </>
                        )}

                        <Col span={12}>
                            <Form.Item
                                name="qty"
                                label={t("receiptPurchase.detailModal.fields.qty")}
                                rules={[
                                    { required: true, message: t("receiptPurchase.detailModal.validate.requireQty") },
                                ]}
                            >
                                <Input type="number" placeholder={t("receiptPurchase.detailModal.placeholders.enterQty")} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="unitPrice"
                                label={t("receiptPurchase.detailModal.fields.unitPrice")}
                                rules={[{ required: true, message: t("receiptPurchase.detailModal.validate.requireUnitPrice") }]}
                            >
                                <Input type="number" placeholder={t("receiptPurchase.detailModal.placeholders.enterUnitPrice")} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="vatPercent"
                                label={t("receiptPurchase.detailModal.fields.vatPercent")}
                                rules={[
                                    { required: true, message: t("receiptPurchase.detailModal.validate.requireVat") },
                                    {
                                        validator: (_, value) =>
                                            value > 100
                                                ? Promise.reject(t("receiptPurchase.detailModal.validate.vatMax"))
                                                : Promise.resolve()
                                    }
                                ]}
                            >
                                <Input type="number" placeholder="VD: 10" min={0} max={100} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="usagePurpose" label={t("receiptPurchase.detailModal.fields.usagePurpose")}>
                                <Input placeholder={t("receiptPurchase.detailModal.placeholders.enterUsagePurpose")} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="productionDate" label={t("receiptPurchase.detailModal.fields.productionDate")}>
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="note" label={t("receiptPurchase.detailModal.fields.note")}>
                                <Input.TextArea placeholder={t("receiptPurchase.detailModal.placeholders.enterNote")} rows={3} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <div className="modal-footer">
                            <Button onClick={onCancel}>
                                {t("receiptPurchase.detailModal.actions.cancel")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("receiptPurchase.detailModal.actions.confirm")}
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
                        form.setFieldsValue({ sparePart: sp.id, sparePartName: sp.sparePartsName });
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
                            supplier: _assetModel.supplier?.supplierName,
                        });
                    }}
                />
            </Form>
        </Modal>
    );
}