import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    message,
} from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../utils/constant";
import SparepartSelector from "../SparePartSelectionModal";
import ChangeAssetModelModal from "../../../components/modal/assetModel/ChangeAssetModelModal";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function AddRequestPurchaseDetail({
    open,
    handleOk,
    handleCancel,
    initialData,
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [uom, setUom] = useState([]);
    const [assets, setAssets] = useState([]);
    const [assetTypeCategories, setAssetTypeCategories] = useState([]);
    const [type, setType] = useState("SpareParts");
    const [newAssetName, setNewAssetName] = useState("");
    const [selectedSparepart, setSelectedSparepart] = useState(null);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [isOpenAssetModel, setIsOpenAssetModel] = useState(false);
    const [assetModelChange, setAssetModelChange] = useState(null);
    const [manufacturer, setManufacturer] = useState([]);

    useEffect(() => {
        if (open) {
            fetchAssets();
            fetchAssetTypeCategory();
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
                        sparePart: initialData.sparePart?.id || initialData.sparePart,
                        sparePartsName:
                            initialData.sparePart?.sparePartsName || initialData.name,
                        needDate: initialData.needDate
                            ? dayjs(initialData.needDate, FORMAT_DATE)
                            : undefined,
                    };
                } else {
                    if (initialData.asset?.id || initialData.asset) {
                        const id = initialData.asset?.id || initialData.asset;
                        fetchAssetTypeCategory(id);
                    }
                    data = {
                        ...initialData,
                        assetModelName: initialData.code,
                        assetName: initialData.name,
                        asset: initialData.asset?.id || initialData.asset,
                        assetTypeCategory: {
                            value: initialData.assetTypeCategory?.id,
                            label: initialData.assetTypeCategory?.name,
                        },
                        manufacturer: {
                            value: initialData.manufacturer?.id,
                            label: initialData.manufacturer?.manufacturerName,
                        },
                        needDate: initialData.needDate
                            ? dayjs(initialData.needDate, FORMAT_DATE)
                            : undefined,
                        uom: {
                            value: initialData.uom,
                            label: initialData.uomName,
                        },
                    };
                }

                form.setFieldsValue({
                    type: initialData.itemType || "SpareParts",
                    ...data,
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
            needDate: values.needDate
                ? dayjs(values.needDate).format(FORMAT_DATE)
                : undefined,
            itemType: type,
            vatPercent: values.vatPercent || 0,
        };

        if (type === "SpareParts") {
            result = {
                ...result,
                sparePart: values.sparePart || initialData?.sparePart?.id,
                code: selectedSparepart?.code || initialData?.code,
                name: selectedSparepart?.sparePartsName || initialData?.name,
                uomName:
                    selectedSparepart?.uomId?.uomName || initialData?.uomName,
                uom: selectedSparepart?.uomId?.id,
                vatAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0),
                totalAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0) +
                    parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
            };
        } else if (type === "AssetModel") {
            result = {
                ...result,
                name: values.assetName || initialData?.name,
                code: values.assetModelName || initialData?.code || "",
                asset:
                    values.asset?.value ||
                    values.asset ||
                    initialData?.asset?.id,
                assetModel: values.assetModel || initialData?.assetModel,
                vatAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0),
                totalAmount:
                    (parseFloat(values.vatPercent || 0) / 100) *
                    parseFloat(values.qty || 0) *
                    parseFloat(values.unitPrice || 0) +
                    parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
                manufacturer: {
                    id: values.manufacturer?.value,
                    manufacturerName: values.manufacturer?.label,
                },
                assetTypeCategory: {
                    id: values.assetTypeCategory?.value,
                    name: values.assetTypeCategory?.label,
                },
                uomName: values.uom?.label,
                uom: values.uom?.value,
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

    const fetchAssets = async () => {
        const res = await _unitOfWork.asset.getAllAsset();
        if (res?.data) {
            const options = res.data.map((item) => ({
                label: item.assetName,
                value: item.id,
            }));
            setAssets(options);
        }
    };

    const fetchAssetTypeCategory = async (value) => {
        const res = await _unitOfWork.assetType.getAssetTypeByAsset({
            asset: value,
        });
        if (res?.data) {
            const assetTypeOptions = res.data.map((item) => ({
                label: item.assetTypeCategory?.name,
                value: item.assetTypeCategory?.id,
                assetType: item.id,
            }));
            setAssetTypeCategories(assetTypeOptions);
        }
    };

    const fetchManufacturerByAsset = async (value) => {
        const res =
            await _unitOfWork.assetTypeManufacturer.getAssetTypeManufacturerByAsset({
                asset: value,
            });
        const assetTypeOptions = res.data.map((item) => ({
            label: item.manufacturer?.manufacturerName,
            value: item.manufacturer?.id,
            assetType: item.id,
        }));
        setManufacturer(assetTypeOptions);
    };

    const fetchManufacturer = async (value) => {
        const res =
            await _unitOfWork.assetTypeManufacturer.getAssetTypeManufacturerByAssetType(
                { assetType: value }
            );
        if (res?.data) {
            const assetTypeOptions = res.data.map((item) => ({
                label: item.manufacturer?.manufacturerName,
                value: item.manufacturer?.id,
                assetType: item.id,
            }));
            setManufacturer(assetTypeOptions);
        }
    };

    const addAsset = async (assetName) => {
        if (!assetName) {
            message.error(t("purchase.validation.required_create_asset"));
            return;
        }

        const res = await _unitOfWork.asset.createAsset({
            asset: { assetName: assetName },
        });

        if (res) {
            message.success(t("purchase.messages.create_asset_success"));
            fetchAssets();
        } else {
            message.error(t("purchase.messages.create_asset_error"));
        }
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
                <Card title={t("purchase.materialsModal.title_create")}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name="type"
                                label={t("purchase.materialsModal.type_label")}
                                initialValue="SpareParts"
                            >
                                <Radio.Group
                                    value={type}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        form.resetFields();
                                        setType(value);
                                        form.setFieldsValue({ type: value });
                                        setSelectedSparepart(null);
                                        setAssetModelChange(null);
                                    }}
                                >
                                    <Radio value="SpareParts">
                                        {t("purchase.materialsModal.radio_spare")}
                                    </Radio>
                                    <Radio value="AssetModel">
                                        {t("purchase.materialsModal.radio_asset")}
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
                                    label={t("purchase.materialsModal.spare_part_label")}
                                    name="sparePartsName"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("purchase.validation.required_spare_part"),
                                        },
                                    ]}
                                >
                                    <Input
                                        readOnly
                                        placeholder={t(
                                            "purchase.materialsModal.spare_part_placeholder"
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
                                        name="asset"
                                        label={t("purchase.materialsModal.asset_label")}
                                        rules={[
                                            {
                                                required: true,
                                                message: t("purchase.validation.required_asset"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            labelInValue
                                            options={assets}
                                            showSearch
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(input.toLowerCase())
                                            }
                                            onSelect={(value, option) => {
                                                form.setFieldsValue({
                                                    assetModelName: "",
                                                    assetName: option.label,
                                                    assetTypeCategory: "",
                                                    manufacturer: "",
                                                });
                                                fetchManufacturerByAsset(value?.value);
                                                fetchAssetTypeCategory(value?.value);
                                            }}
                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <div style={{ padding: 8 }}>
                                                        <Space>
                                                            <Input
                                                                maxLength={250}
                                                                value={newAssetName}
                                                                onChange={(e) =>
                                                                    setNewAssetName(e.target.value)
                                                                }
                                                                placeholder={t(
                                                                    "purchase.materialsModal.add_asset_placeholder"
                                                                )}
                                                            />
                                                            <Button
                                                                type="text"
                                                                icon={<PlusOutlined />}
                                                                onClick={() => addAsset(newAssetName)}
                                                            />
                                                        </Space>
                                                    </div>
                                                </div>
                                            )}
                                            placeholder={t("purchase.materialsModal.asset_label")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="assetTypeCategory"
                                        label={t(
                                            "purchase.materialsModal.asset_type_category_label"
                                        )}
                                    >
                                        <Select
                                            options={assetTypeCategories}
                                            labelInValue
                                            showSearch
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(input.toLowerCase())
                                            }
                                            onSelect={(value, option) => {
                                                form.setFieldsValue({ manufacturer: "" });
                                                fetchManufacturer(option.assetType);
                                            }}
                                            placeholder={t(
                                                "purchase.materialsModal.asset_type_category_label"
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="manufacturer"
                                        label={t("purchase.materialsModal.manufacturer_label")}
                                    >
                                        <Select
                                            options={manufacturer}
                                            showSearch
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(input.toLowerCase())
                                            }
                                            labelInValue
                                            placeholder={t(
                                                "purchase.materialsModal.manufacturer_label"
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="assetModelName"
                                        label={t("purchase.materialsModal.asset_model_label")}
                                    >
                                        <Input
                                            readOnly
                                            onClick={() => setIsOpenAssetModel(true)}
                                            placeholder={t(
                                                "purchase.materialsModal.asset_model_placeholder"
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="uom"
                                        label={t("purchase.materialsModal.uom_label")}
                                    >
                                        <Select
                                            placeholder={t(
                                                "purchase.materialsModal.uom_placeholder"
                                            )}
                                            options={uom.map((item) => ({
                                                label: item.uomName,
                                                value: item.id,
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
                                label={t("purchase.materialsModal.qty_label")}
                                rules={[
                                    {
                                        required: true,
                                        message: t("purchase.validation.required_qty"),
                                    },
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder={t(
                                        "purchase.materialsModal.qty_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="unitPrice" label={t("requestPurchase.form.fields.unit_price")}>
                                <Input
                                    type="number"
                                    placeholder={t("requestPurchase.form.placeholders.unit_price")}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="vatPercent"
                                label={t("requestPurchase.form.fields.vat_percent")}
                                defaultValue={0}
                            >
                                <InputNumber type="number" style={{ width: "100%" }} placeholder="VD: 10" defaultValue={0} min={0} max={100} />
                            </Form.Item>
                        </Col>
{/* 
                        <Col span={12}>
                            <Form.Item
                                name="supplier"
                                label={t("requestPurchase.form.fields.supplier")}
                            >
                                <Input
                                    placeholder={t(
                                        "requestPurchase.form.placeholders.supplier"
                                    )}
                                />
                            </Form.Item>
                        </Col> */}

                        <Col span={12}>
                            <Form.Item
                                name="needDate"
                                label={t("requestPurchase.form.fields.need_date")}
                            >
                                <DatePicker format={FORMAT_DATE} className="w-100" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="usagePurpose"
                                label={t("requestPurchase.form.fields.usage_purpose")}
                            >
                                <Input
                                    placeholder={t(
                                        "requestPurchase.form.placeholders.usage_purpose"
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="note"
                                label={t("requestPurchase.form.fields.note")}
                            >
                                <Input.TextArea
                                    placeholder={t("requestPurchase.form.placeholders.note")}
                                    rows={3}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <div className="modal-footer">
                            <Button onClick={onCancel}>
                                {t("purchase.materialsModal.cancel")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("purchase.materialsModal.confirm")}
                            </Button>
                        </div>
                    </Row>
                </Card>
                <Form.Item name="assetName" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item name="assetModel" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                <SparepartSelector
                    value={form.getFieldValue("sparePart")}
                    visible={selectorVisible}
                    onClose={() => setSelectorVisible(false)}
                    onSelect={(sp) => {
                        setSelectedSparepart(sp);
                        form.setFieldsValue({
                            sparePart: sp.id,
                            sparePartsName: sp.sparePartsName,
                        });
                        setSelectorVisible(false);
                    }}
                />
                <ChangeAssetModelModal
                    open={isOpenAssetModel}
                    data={{
                        assetName: form.getFieldValue("assetName"),
                        assetTypeCategory:
                            form.getFieldValue("assetTypeCategory")?.value,
                        manufacturer: form.getFieldValue("manufacturer")?.value,
                    }}
                    handleCancel={() => setIsOpenAssetModel(false)}
                    form={form}
                    assetModelChange={assetModelChange}
                    onSelectAssetModel={async (_assetModel) => {
                        const [res1, res2] = await Promise.all([
                            fetchAssetTypeCategory(_assetModel.asset?._id),
                            fetchManufacturer(_assetModel.assetType?._id),
                        ]);

                        const foundTypeCategory = res1?.find(
                            (item) => item.value === _assetModel.assetTypeCategory?._id
                        );
                        const foundManufacturer = res2?.find(
                            (item) => item.value === _assetModel.manufacturer?._id
                        );

                        if (!foundTypeCategory) {
                            setAssetTypeCategories((prev) => [
                                ...prev,
                                {
                                    label: _assetModel.assetTypeCategory?.name,
                                    value: _assetModel.assetTypeCategory?._id,
                                },
                            ]);
                        }

                        if (!foundManufacturer) {
                            setManufacturer((prev) => [
                                ...prev,
                                {
                                    label: _assetModel.manufacturer?.manufacturerName,
                                    value: _assetModel.manufacturer?._id,
                                },
                            ]);
                        }

                        setAssetModelChange(_assetModel);
                        form.setFieldsValue({
                            asset: _assetModel?.asset?._id,
                            assetName: _assetModel?.asset?.assetName,
                            manufacturer: {
                                label: _assetModel.manufacturer?.manufacturerName,
                                value: _assetModel.manufacturer?._id,
                            },
                            assetModelName: _assetModel.assetModelName,
                            assetModel: _assetModel.id,
                            assetTypeCategory: {
                                value: _assetModel.assetTypeCategory?._id,
                                label: _assetModel.assetTypeCategory?.name,
                            },
                            supplier: _assetModel.supplier?.supplierName,
                        });
                    }}
                />
            </Form>
        </Modal>
    );
}