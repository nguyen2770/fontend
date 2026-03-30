import { useState, useEffect } from "react";
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import {
    Row,
    Col,
    Card,
    Button,
    Input,
    Form,
    Table,
    Divider,
    message
} from "antd";
import * as _unitOfWork from "../../../api";
import ConfirmWithReasonModal from "../../../components/modal/ConfirmWithReason";
import Confirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import { useParams } from "react-router-dom";
import useHeader from "../../../contexts/headerContext";
import { useTranslation } from "react-i18next";

export default function ApproveSuppliersNeed() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [form] = Form.useForm();
    const navigate = useCustomNav();
    const { setHeaderTitle } = useHeader();
    const [data, setData] = useState([]);
    const [isOpenModalReject, setIsOpenModalReject] = useState(false);
    const [action, setAction] = useState();
    const { id } = useParams();

    useEffect(() => {
        setHeaderTitle(t("suppliesNeed.list.title"));
        fetchSuppliesNeed();
        fetchMaterialsBySuppliesNeed();
    }, [t]);

    const fetchSuppliesNeed = async () => {
        const res = await _unitOfWork.suppliesNeed.getSuppliesNeedById({ id });
        if (res) {
            form.setFieldsValue({
                ...res,
                createdName: res.createdBy?.fullName,
                branch: res.branch?.name,
                department: res.department?.departmentName
            });
            setAction(res.action);
        }
    };

    const fetchMaterialsBySuppliesNeed = async () => {
        try {
            const res = await _unitOfWork.suppliesNeed.getSuppliesNeedDetailById({
                id
            });
            const dataTable = await Promise.all(
                res.data.map(async (item) => {
                    if (item.itemType === "SpareParts") {
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
        } catch {
            // silent
        }
    };

    const handleApprove = async () => {
        Confirm(t("purchase.messages.confirm_approve"), async () => {
            const result =
                await _unitOfWork.suppliesNeed.updateSuppliesNeedAction({
                    SuppliesNeed: { id, action: "approved" }
                });
            if (result) {
                message.success(t("purchase.messages.approve_success"));
                navigate(-1);
            }
        });
    };

    const handleReject = async (reason) => {
        const result =
            await _unitOfWork.suppliesNeed.updateSuppliesNeedAction({
                SuppliesNeed: { id, action: "rejected", comment: reason }
            });
        if (result) {
            message.success(t("purchase.messages.reject_success"));
            navigate(-1);
        }
    };

    const columns = [
        {
            title: t("purchase.tableMaterials.index"),
            key: "stt",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1
        },
        {
            title: t("purchase.tableMaterials.code"),
            dataIndex: "code",
            key: "code",
            width: 120,
            ellipsis: true
        },
        {
            title: t("purchase.tableMaterials.name"),
            dataIndex: "name",
            key: "name",
            width: 200,
            ellipsis: true
        },
        {
            title: t("purchase.tableMaterials.uom"),
            dataIndex: "uomName",
            key: "uomName",
            width: 100,
            align: "center",
            ellipsis: true
        },
        {
            title: t("purchase.tableMaterials.qty"),
            dataIndex: "qty",
            key: "qty",
            width: 100,
            align: "right"
        },
        {
            title: "",
            dataIndex: "",
            key: "",
            width: 10,
            align: "right"
        }
    ];

    return (
        <div>
            <Form labelWrap form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Card
                    title={
                        action === "pendingApproval"
                            ? t("suppliesNeed.form.approve_title")
                            : t("suppliesNeed.form.detail_title")
                    }
                    extra={
                        <>
                            <Button className="mr-2" onClick={() => navigate(-1)}>
                                <ArrowLeftOutlined /> {t("purchase.buttons.back")}
                            </Button>
                            {action && action === "pendingApproval" && (
                                <>
                                    <Button
                                        type="primary"
                                        className="mr-2"
                                        icon={<CheckCircleOutlined />}
                                        onClick={handleApprove}
                                    >
                                        {t("purchase.buttons.approve")}
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => setIsOpenModalReject(true)}
                                    >
                                        {t("purchase.buttons.reject")}
                                    </Button>
                                </>
                            )}
                        </>
                    }
                >
                    <Row gutter={32}>
                        <Col span={12}>
                            <Form.Item
                                label={t("suppliesNeed.form.fields.code")}
                                name="code"
                                labelAlign="left"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("suppliesNeed.form.fields.creator")}
                                name="createdName"
                                labelAlign="left"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("suppliesNeed.form.fields.branch")}
                                name="branch"
                                labelAlign="left"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("suppliesNeed.form.fields.department")}
                                name="department"
                                labelAlign="left"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("suppliesNeed.form.fields.description")}
                                name="description"
                                labelAlign="left"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" size="small">
                        {t("suppliesNeed.form.fields.materials_section")}
                    </Divider>

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
                        title={t("purchase.reject.reason_title")}
                    />
                </Card>
            </Form>
        </div>
    );
}