import { useState, useEffect } from "react";
import {
    ArrowLeftOutlined,
    PlusOutlined,
    SaveOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
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
    Space,
} from "antd";
import * as _unitOfWork from "../../../api";
import Confirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import useAuth from "../../../contexts/authContext";
import AddMaterialsModal from "./AddMaterialsModal";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";
import { notiAction } from "../../../helper/noti-action-helper";

export default function CreateSuppilersNeed() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [form] = Form.useForm();
    const navigate = useCustomNav();

    const [IsAddData, setIsAddData] = useState(false);
    const [data, setData] = useState([]);
    const [departments, setDepartMents] = useState();
    const [branches, setBranches] = useState();
    const [editingDetail, setEditingDetail] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [branchInput, setBranchInput] = useState("");
    const [departmentInput, setDepartmentInput] = useState("");

    useEffect(() => {
        form.setFieldsValue({
            createdName: user.fullName,
            createBy: user.id,
        });
        fetchDepartments();
        fetchBranches();
    }, []);

    const onFinish = async () => {
        const values = form.getFieldsValue();

        const convertedDetails = data.map((item) => ({
            ...item,
            assetTypeCategory: item.assetTypeCategory?.id
                ? item.assetTypeCategory?.id
                : null,
            manufacturer: item.manufacturer?.id ? item.manufacturer.id : null,
            uom: item.uom ? item.uom : null,
        }));
        const payload = {
            suppliesNeed: {
                ...values,
            },
            suppliesNeedSparePart: [...convertedDetails],
        };
        const suppilersNeed =
            await _unitOfWork.suppliesNeed.createSuppliesNeed(payload);
        if (suppilersNeed) {
            message.success(t("purchase.messages.create_success"));
            navigate(-1);
        }
    };

    const handleOk = (newData) => {
        if (editingIndex !== null) {
            const newList = [...data];
            newList[editingIndex] = newData;
            setData(newList);
            setEditingIndex(null);
            setEditingDetail(null);
        } else {
            setData((prev) => [...prev, newData]);
        }
        setIsAddData(false);
    };

    const handleDelete = (record) => {
        setData((prev) =>
            prev.filter((item) => {
                if (item.id) {
                    return item.id !== record.id;
                } else {
                    return item.key !== record.key;
                }
            })
        );
    };

    const fetchDepartments = async () => {
        const department = await _unitOfWork.department.getAllDepartment();
        if (department?.data) {
            const option = department.data.map((item) => ({
                label: item.departmentName,
                value: item.id,
            }));
            setDepartMents(option);
        }
    };

    const fetchBranches = async () => {
        const branch = await _unitOfWork.branch.getAllBranch();
        if (branch?.data) {
            const option = branch.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
            setBranches(option);
        }
    };

    const addBranch = async (name) => {
        if (!name || !name.trim()) return;
        const response = await _unitOfWork.branch.createBranch({
            name: name,
        });
        notiAction(t, response);
        if (response) {
            fetchBranches();
            setBranchInput("");
        }
    };

    const addDepartment = async (name) => {
        if (!name || !name.trim()) return;
        const response = await _unitOfWork.department.createDepartment({
            departmentName: name,
        });
        notiAction(t, response);
        if (response) {
            fetchDepartments();
            setDepartmentInput("");
        }
    };

    const columns = [
        {
            title: t("purchase.tableMaterials.index"),
            key: "stt",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t("purchase.tableMaterials.code"),
            dataIndex: "code",
            key: "code",
            width: 120,
            ellipsis: true,
        },
        {
            title: t("purchase.tableMaterials.name"),
            dataIndex: "name",
            key: "name",
            width: 200,
            ellipsis: true,
        },
        {
            title: t("purchase.tableMaterials.uom"),
            dataIndex: "uomName",
            key: "uomName",
            width: 100,
            align: "center",
            ellipsis: true,
        },
        {
            title: t("purchase.tableMaterials.qty"),
            dataIndex: "qty",
            key: "qty",
            width: 100,
            align: "right",
        },
        {
            title: t("purchase.tableMaterials.action"),
            key: "action",
            width: 100,
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                    <Tooltip title={t("purchase.actions.edit")}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {
                                const index1 = data.findIndex(
                                    (item) => item.id === record.id
                                );

                                if (index1 !== -1 && record.id) {
                                    setEditingIndex(index1);
                                } else if (record.key) {
                                    const index2 = data.findIndex(
                                        (item) => item.key === record.key
                                    );
                                    setEditingIndex(index2);
                                }
                                setEditingDetail(record);
                                setIsAddData(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={t("purchase.actions.delete")}>
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() =>
                                Confirm(
                                    t("purchase.messages.confirm_delete"),
                                    () => handleDelete(record)
                                )
                            }
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
                onFinish={() =>
                    Confirm(t("suppliesNeed.messages.confirm_create"), () => onFinish())
                }
            >
                <Card
                    title={t("suppliesNeed.form.create_title")}
                    extra={
                        <>
                            <Button className="mr-2" onClick={() => navigate(-1)}>
                                <ArrowLeftOutlined />
                                {t("purchase.buttons.back")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                <SaveOutlined />
                                {t("purchase.buttons.save")}
                            </Button>
                        </>
                    }
                >
                    <Row gutter={32}>
                        <Col span={12}>
                            <Form.Item
                                id=""
                                labelAlign="left"
                                label={t("suppliesNeed.form.fields.creator")}
                                name="createdName"
                            >
                                <Input disabled value={user.fullName}></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                id=""
                                labelAlign="left"
                                label={t("suppliesNeed.form.fields.branch")}
                                name="branch"
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder={t("users.create.placeholders.branch")}
                                    options={branches}
                                    filterOption={filterOption}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <div style={{ padding: 8 }}>
                                                <Space>
                                                    <Input
                                                        maxLength={250}
                                                        value={branchInput}
                                                        onChange={(e) => setBranchInput(e.target.value)}
                                                        placeholder={t(
                                                            "assetModel.model.fields.add_new"
                                                        )}
                                                    />
                                                    <Button
                                                        icon={<PlusOutlined />}
                                                        disabled={!branchInput.trim()}
                                                        onClick={() => addBranch(branchInput)}
                                                    />
                                                    <div>{`${branchInput.length}/250`}</div>
                                                </Space>
                                            </div>
                                        </>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                id=""
                                labelAlign="left"
                                label={t("suppliesNeed.form.fields.department")}
                                name="department"
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder={t("users.create.placeholders.department")}
                                    options={departments}
                                    filterOption={filterOption}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <div style={{ padding: 8 }}>
                                                <Space>
                                                    <Input
                                                        maxLength={250}
                                                        value={departmentInput}
                                                        onChange={(e) => setDepartmentInput(e.target.value)}
                                                        placeholder={t(
                                                            "assetModel.model.fields.add_new"
                                                        )}
                                                    />
                                                    <Button
                                                        icon={<PlusOutlined />}
                                                        disabled={!departmentInput.trim()}
                                                        onClick={() => addDepartment(departmentInput)}
                                                    />
                                                    <div>{`${departmentInput.length}/250`}</div>
                                                </Space>
                                            </div>
                                        </>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                id=""
                                labelAlign="left"
                                label={t("suppliesNeed.form.fields.description")}
                                name="description"
                            >
                                <Input></Input>
                            </Form.Item>
                        </Col>

                        <Form.Item name="createBy" noStyle>
                            <Input type="hidden" />
                        </Form.Item>
                    </Row>
                    <Divider orientation="left" size="small">
                        {t("suppliesNeed.form.fields.materials_section")}
                    </Divider>
                    <Row className="float-right mb-2">
                        <Button
                            type="primary"
                            htmlType="button"
                            className="bt-green float-right"
                            onClick={() => setIsAddData(true)}
                        >
                            <PlusOutlined />
                            {t("suppliesNeed.form.fields.add_material_btn")}
                        </Button>
                    </Row>
                    <Table
                        rowKey="id"
                        columns={columns}
                        className="wp-100"
                        key={"id"}
                        dataSource={data}
                        bordered
                        pagination={false}
                    ></Table>

                    <AddMaterialsModal
                        open={IsAddData}
                        handleOk={handleOk}
                        handleCancel={() => {
                            setIsAddData(false);
                            setEditingDetail(null);
                            setEditingIndex(null);
                        }}
                        initialData={editingDetail}
                    ></AddMaterialsModal>
                </Card>
            </Form>
        </div>
    );
}