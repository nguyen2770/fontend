import { useState, useEffect } from "react";
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
    Row, Col, Card, Button, Input, Form, Table, Divider, message,
    Modal,
} from "antd";
import * as _unitOfWork from "../../api";
import Confirm from '../../components/modal/Confirm'
import ConfirmWithReasonModal from "../../components/modal/ConfirmWithReason";
import { useTranslation } from "react-i18next";

const ApproveSupplierNeed = ({ id, open, handleClose, onfinish }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [isOpenModalReject, setIsOpenModalReject] = useState();
    const [action, setAction] = useState()

    useEffect(() => {
        if (open) {
            fetchSuppliesNeed();
            fetchMaterialsBySuppliesNeed();
        }
    }, [open]);

    const fetchSuppliesNeed = async () => {
        const res = await _unitOfWork.suppliesNeed.getSuppliesNeedById({ id });
        if (res) {
            form.setFieldsValue({
                ...res,
                createdName: res.createdBy?.fullName,
                branch: res.branch?.name,
                department: res.department?.departmentName
            });
            setAction(res.action)
        }
    };

    const fetchMaterialsBySuppliesNeed = async () => {
        try {
            const res = await _unitOfWork.suppliesNeed.getSuppliesNeedDetailById({ id });
            const dataTable = await Promise.all(
                res.data.map(async (item) => {
                    if (item.itemType === "SpareParts") {
                        // const uom = await _unitOfWork.uom.getNameUomById({ id: item.sparePart.uomId });
                        return {
                            ...item,
                            code: item.sparePart?.code,
                            name: item.sparePart?.sparePartsName,
                            uomName: item.sparePart?.uomId?.uomName
                        };
                    } else {
                        return {
                            ...item,
                            code: item.assetModel?.assetModelName || "",
                            name: item.asset?.assetName,
                            uom: item.uom?.id,
                            uomName: item.uom?.uomName
                        };
                    }
                })
            );
            setData(dataTable);
        } catch { }
    };

    const handleApprove = async () => {
        Confirm(t("modal.messages.approve_confirm"), async () => {
            const result = await _unitOfWork.suppliesNeed.updateSuppliesNeedAction({ SuppliesNeed: { id, action: "approved" } });
            if (result) {
                message.success(t("modal.messages.approve_success"));
                onfinish()
            }
        });
    };

    const handleReject = async (reason) => {
        const result = await _unitOfWork.suppliesNeed.updateSuppliesNeedAction({ SuppliesNeed: { id, action: "rejected", comment: reason } });
        if (result) {
            message.success(t("modal.messages.reject_success"));
            onfinish()
        }
    };

    const columns = [
        {
            title: t("modal.common.table.index"),
            key: "stt",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t("modal.supplierNeed.table.code"),
            dataIndex: "code",
            key: "code",
            width: 120,
            ellipsis: true,
        },
        {
            title: t("modal.supplierNeed.table.name"),
            dataIndex: "name",
            key: "name",
            width: 200,
            ellipsis: true,
        },
        {
            title: t("modal.supplierNeed.table.uom"),
            dataIndex: "uomName",
            key: "uomName",
            width: 100,
            align: "center",
            ellipsis: true,
        },
        {
            title: t("modal.supplierNeed.table.qty"),
            dataIndex: "qty",
            key: "qty",
            width: 100,
            align: "right",
        }
    ];

    return (
        <Modal
            open={open}
            footer={null}
            width={"80%"}
            closable={false}
            className="custom-modal"
        >
            <Form
labelWrap
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
                <Card
                    title={
                        action === "pendingApproval"
                            ? t("modal.supplierNeed.title_pending")
                            : t("modal.supplierNeed.title_detail")
                    }
                    extra={
                        <>
                            <Button className="mr-2" onClick={handleClose}>
                                <ArrowLeftOutlined /> {t("modal.common.buttons.close")}
                            </Button>
                            {action && action === "pendingApproval" && (
                                <>
                                    <Button
                                        type="primary"
                                        className="mr-2"
                                        icon={<CheckCircleOutlined />}
                                        onClick={handleApprove}
                                    >
                                        {t("modal.common.buttons.approve")}
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => setIsOpenModalReject(true)}
                                    >
                                        {t("modal.common.buttons.reject")}
                                    </Button>
                                </>
                            )}
                        </>
                    }
                >
                    <Row gutter={32}>
                        <Col span={12}>
                            <Form.Item label={t("modal.supplierNeed.form.code")} name="code" labelAlign="left">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t("modal.supplierNeed.form.created_by")} name="createdName" labelAlign="left">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t("modal.supplierNeed.form.branch")} name="branch" labelAlign="left">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t("modal.supplierNeed.form.department")} name="department" labelAlign="left">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t("modal.supplierNeed.form.note")} name="description" labelAlign="left">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" size="small">{t("modal.supplierNeed.divider_items")}</Divider>

                    <Table
                        rowKey="id"
                        columns={columns}
                        className="wp-100"
                        dataSource={data}
                        bordered
                        pagination={false}
                    />
                    <ConfirmWithReasonModal
                        visible={isOpenModalReject}
                        onConfirm={handleReject}
                        onCancel={() => setIsOpenModalReject(false)}
                    />
                </Card>
            </Form>
        </Modal>
    );
}

export default ApproveSupplierNeed;