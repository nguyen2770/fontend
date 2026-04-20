import { Button, Card, Col, Form, Input, InputNumber, Modal, Radio, Row, Select } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as _unitOfWork from "../../api";
import SparepartSelector from "../../pages/purchase/SparePartSelectionModal";
import ChangeAssetModelModal from "./assetModel/ChangeAssetModelModal";
import { useTranslation } from "react-i18next";

export default function ModalStockIssue({ open, handleOk, handleCancel, initialData, locationId }) {
    const [form] = Form.useForm();
    const [type, setType] = useState("SpareParts");
    const [id, setId] = useState();
    const [uoms, setUoms] = useState([]);
    const [selectedSparepart, setSelectedSparepart] = useState(null);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [isOpenAssetModel, setIsOpenAssetModel] = useState(false);
    const [assetModelChange, setAssetModelChange] = useState(null);
    const [uomName, setUomName] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        if (open) {
            form.resetFields();
            setType("SpareParts");
            fetchUoms();
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
                        sparePartsName: initialData.name,
                        needDate: initialData.needDate ? dayjs(initialData.needDate) : null,
                    };
                    fetchTotalSparePartInventory(initialData.item);
                } else {
                    data = {
                        ...initialData,
                        assetModelName: initialData.code,
                        assetName: initialData.name,
                        assetModel: initialData.item,
                        needDate: initialData.needDate ? dayjs(initialData.needDate) : null,
                    };
                    fetchTotalAssetModelInventory(initialData.item);
                }
                form.setFieldsValue({
                    type: initialData.itemType || "SpareParts",
                    ...data
                });
                if (initialData.id) setId(initialData.id);
            } else {
                form.resetFields();
                setType("SpareParts");
            }
        };
        fetchData();
    }, [initialData]);

    const onFinish = async () => {
        const values = form.getFieldsValue();
        let result = {
            ...values,
            key: Date.now() + Math.random(),
            itemType: type,
            id: id ? id : null,
        };

        if (type === "SpareParts") {
            result = {
                ...result,
                item: values.sparePart || initialData?.item,
                code: selectedSparepart?.code || initialData?.code,
                name: selectedSparepart?.sparePartsName || initialData?.name,
                uomName: selectedSparepart?.uomId?.uomName || initialData?.uomName,
                uom: selectedSparepart?.uomId?.id,
                vatAmount: (parseFloat(values.vatPercent || 0) / 100) * parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
                totalAmount:
                    (parseFloat(values.vatPercent || 0) / 100) * parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0) +
                    parseFloat(values.qty || 0) * parseFloat(values.unitPrice || 0),
            };
        } else if (type === "AssetModel") {
            result = {
                ...result,
                item: values.assetModel || initialData?.item,
                name: values.assetName || initialData?.name,
                code: values?.assetModelName || initialData?.code,
                uomName: uomName || initialData?.uomName,
                uomId: values?.uom,
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

    const fetchUoms = async () => {
        const res = await _unitOfWork.uom.getAllUom();
        if (res) setUoms(res.data);
    };

    const fetchTotalAssetModelInventory = async (assetModelId) => {
        const res = await _unitOfWork.inventory.getAssetModels({ page: 1, limit: 1, assetModelId, locationId });
        if (res) {
            form.setFieldsValue({
                totalInventory: res.locationData?.[0]?.inventory?.results?.[0]?.totalQty || 0
            });
        }
    };

    const fetchTotalSparePartInventory = async (sparePartId) => {
        const res = await _unitOfWork.inventory.getSpareParts({ page: 1, limit: 1, sparePartId, locationId });
        if (res) {
            form.setFieldsValue({
                totalInventory: res.locationData?.[0]?.inventory?.results?.[0]?.totalQty || 0
            });
        }
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
                <Card title={t("modal.stockIssueDetail.title")}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item name="type" label={t("modal.stockIssueDetail.type.label")} initialValue="SpareParts">
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
                                    <Radio value="SpareParts">{t("modal.stockIssueDetail.type.spareParts")}</Radio>
                                    <Radio value="AssetModel">{t("modal.stockIssueDetail.type.assetModel")}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        {type === "SpareParts" && (
                            <Col span={24}>
                                <Form.Item
                                    name="sparePart"
                                    hidden
                                    rules={[{ required: true, message: t("modal.stockIssueDetail.validate.requireSparePart") }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label={t("modal.stockIssueDetail.fields.sparePart")}
                                    name="sparePartsName"
                                    rules={[{ required: true, message: t("modal.stockIssueDetail.validate.requireSparePart") }]}
                                >
                                    <Input
                                        readOnly
                                        placeholder={t("modal.stockIssueDetail.placeholders.clickToSelectSparePart")}
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
                                        label={t("modal.stockIssueDetail.fields.asset")}
                                        rules={[{ required: true, message: t("modal.stockIssueDetail.validate.requireAsset") }]}
                                    >
                                        <Input
                                            readOnly
                                            style={{ cursor: 'pointer' }}
                                            placeholder={t("modal.stockIssueDetail.placeholders.clickToSelectAsset")}
                                            onClick={() => setIsOpenAssetModel(true)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="assetModelName"
                                        label={t("modal.stockIssueDetail.fields.assetModel")}
                                        rules={[{ required: true, message: t("modal.stockIssueDetail.validate.requireModel") }]}
                                    >
                                        <Input disabled placeholder={t("modal.stockIssueDetail.fields.assetModel")} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="uom"
                                        label={t("modal.stockIssueDetail.fields.uom")}
                                        rules={[{ required: true, message: t("modal.stockIssueDetail.validate.requireUom") }]}
                                    >
                                        <Select
                                            placeholder={t("modal.stockIssueDetail.placeholders.selectUom")}
                                            options={(uoms || []).map((item) => ({
                                                value: item.id,
                                                label: item.uomName,
                                            }))}
                                            onChange={(value, option) => {
                                                setUomName(option.label);
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </>
                        )}

                        <Col span={12}>
                            <Form.Item
                                name="qty"
                                label={t("modal.stockIssueDetail.fields.qty")}
                                rules={[
                                    { required: true, message: t("modal.stockIssueDetail.validate.requireQty") },
                                    {
                                        validator: (_, value) => {
                                            const qty = form.getFieldValue("totalInventory");
                                            if (value > qty) {
                                                return Promise.reject(new Error(t("modal.stockIssueDetail.validate.qtyExceedInventory")));
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input type="number" placeholder={t("modal.stockIssueDetail.placeholders.enterQty")} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="totalInventory"
                                label={t("modal.stockIssueDetail.fields.totalInventory")}
                            >
                                <Input disabled type="number" placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="unitPrice"
                                label={t("modal.stockIssueDetail.fields.unitPrice")}
                                rules={[{ required: true, message: t("modal.stockIssueDetail.validate.requireUnitPrice") }]}
                            >
                                <Input type="number" placeholder={t("modal.stockIssueDetail.placeholders.enterUnitPrice")} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="vatPercent"
                                label={t("modal.stockIssueDetail.fields.vatPercent")}
                                initialValue={0}
                                rules={[
                                    { required: true, message: t("modal.stockIssueDetail.validate.requireVat") },
                                    {
                                        validator: (_, value) =>
                                            value > 100
                                                ? Promise.reject(t("modal.stockIssueDetail.validate.vatMax"))
                                                : Promise.resolve()
                                    }
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} min={0} max={100} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="note" label={t("modal.stockIssueDetail.fields.note")}>
                                <Input.TextArea placeholder={t("modal.stockIssueDetail.placeholders.enterNote")} rows={3} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <div
                            className="modal-footer"
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                            }}
                        >
                            <Button onClick={onCancel}>
                                {t("modal.common.buttons.cancel")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("modal.common.buttons.confirm")}
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
                        fetchTotalSparePartInventory(sp.id);
                        form.setFieldsValue({ sparePart: sp.id, sparePartsName: sp.sparePartsName });
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
                        fetchTotalAssetModelInventory(_assetModel.id);
                        form.setFieldsValue({
                            asset: _assetModel?.asset._id,
                            assetName: _assetModel?.asset.assetName,
                            assetModelName: _assetModel.assetModelName,
                            assetModel: _assetModel.id
                        });
                    }}
                />
            </Form>
        </Modal>
    );
}