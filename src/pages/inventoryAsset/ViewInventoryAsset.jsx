import {
    ArrowLeftOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    CloseOutlined,
    DeleteOutlined,
    ExportOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Dropdown, Row, Select, Collapse, Checkbox, notification, Divider, DatePicker, Tooltip, Table } from "antd";
import React, { useEffect, useState } from "react";
import useHeader from "../../contexts/headerContext";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from '../../api'
import { array_move } from "../../helper/array-helper";
import { useTranslation } from "react-i18next";
import { FORMAT_DATE } from "../../utils/constant";
import InventoryAssetAssignUserModal from "./InventoryAssetAssignUserModal";
import ExpandRowInventoryAssetDepartment from './ExpandRowInventoryAssetDepartment';
import './index.scss'
import dayjs from "dayjs";
import TabAttachment from "../../components/fileViewer/TabAttachment";
import AttachmentModel from "../../components/modal/attachmentModel/AttachmentModel";
import { inventoryAssetStatus } from "../../utils/inventoryAssetConstant";
import { parseToLabel } from "../../helper/parse-helper";
const CheckboxGroup = Checkbox.Group;
export default function ViewInventoryAsset() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();
    const { setHeaderTitle } = useHeader();
    const [departments, setDepartments] = useState([]);
    const [inventoryAssetDepartments, setInventoryAssetDepartments] = useState([]);
    const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [inventoryAsset, setInventoryAsset] = useState(null);
    useEffect(() => {
        setHeaderTitle("Chi tiết lịch kiểm kê");
        fetchAllDepartments();
        fetchInventoryAssetById();
    }, []);
    const fetchInventoryAssetById = async () => {
        let res = await _unitOfWork.inventoryAsset.getInventoryAssetById({ id: params.id })
        if (res && res.code === 1) {
            form.setFieldsValue({
                ...res.data.inventoryAsset,
                startDate: res.data?.inventoryAsset?.startDate
                    ? dayjs(res.data?.inventoryAsset?.startDate).add(7, "hour")
                    : null,
                endDate: res.data?.inventoryAsset?.endDate
                    ? dayjs(res.data?.inventoryAsset?.endDate).add(7, "hour")
                    : null,
            })
            setInventoryAsset(res.data?.inventoryAsset);
            setInventoryAssetDepartments(res.data.inventoryAssetDepartments);
        }
    }
    const onFinish = async (values) => {
        let payload = {
            inventoryAsset: {
                ...values
            },
            id: params.id,
            inventoryAssetDepartments: inventoryAssetDepartments
        }
        let res = await _unitOfWork.inventoryAsset.updateInventoryAsset(payload);
        if (res && res.code === 1) {
            navigate(-1);
        }
    };
    const fetchAllDepartments = async () => {
        let res = await _unitOfWork.department.getAllDepartment();
        if (res && res.code === 1) {
            setDepartments(res.data)
        }
    }
    const columnDepartments = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 60,
            align: "center",
            render: (_text, _record, idx) => idx + 1,
        },
        {
            title: "Khoa/phòng",
            dataIndex: "departmentName",
            width: '35%'
        },
        {
            title: "Người kiểm kê",
            dataIndex: "fullName",
            render: (_text, _record, idx) => _record?.assignUsers?.map(_user => {
                return <div style={{ borderBottom: '1px solid #ccc', padding: '5px 0' }}>
                    <Row>
                        <Col span={12}>
                            <b>{_user?.fullName}</b>
                        </Col>
                        <Col span={12}>
                            <span>Chức vụ: </span><b>{_user?.positionName}</b>
                        </Col>
                    </Row>
                </div>
            }),
        },
        {
            title: "",
            dataIndex: "action",
            width: 50,
            align: "center",
            render: (_text, _record, idx) => (
                <Tooltip title="Xuất file">
                    <Button
                        type="primary"
                        className="bt-green"
                        danger
                        icon={<ExportOutlined />}
                    // onClick={() => handleDelete(idx)}
                    // disabled={listSparePart.length < 1}
                    />
                </Tooltip>
            ),
        },
        // {
        //     title: "",
        //     dataIndex: "action",
        //     width: 50,
        //     align: "center",
        //     render: (_text, _record, idx) => (
        //         <Tooltip title="Xóa">
        //             <Button
        //                 type="primary"
        //                 icon={<EyeOutlined />}
        //             />
        //         </Tooltip>
        //     ),
        // },
    ];
    const handleAdd = () => {
        setIsOpenAssignUser(true);
    };
    const handleDelete = (idx) => {
        // if (listSparePart.length < 1) return;
        setInventoryAssetDepartments(inventoryAssetDepartments.filter((_, i) => i !== idx));
    };
    const callbackAssignUser = (data) => {
        let newinventoryAssetDepartments = [...inventoryAssetDepartments];
        newinventoryAssetDepartments.push(data);
        setInventoryAssetDepartments(newinventoryAssetDepartments);
        setIsOpenAssignUser(false);
    }
    const onClickCloseInventoryAsset = async () => {
        let res = await _unitOfWork.inventoryAsset.closeInventoryAsset({
            inventoryAssetId: params.id
        })
        if (res && res.code === 1) {
            fetchInventoryAssetById();
        }
    }
    return (
        <>
            <Form
                labelWrap
                form={form}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{ padding: "15px" }}
                labelAlign="left"
                onFinish={onFinish}

            >

                <Card
                    style={{
                        marginBottom: 24,
                        borderRadius: 12,
                        boxShadow: "0 2px 8px #f0f1f2",
                    }}
                    extra={
                        <>
                            <span className={"inventory-asset-status-" + inventoryAsset?.status}>
                                {parseToLabel(inventoryAssetStatus.Options, inventoryAsset?.status)}
                            </span>
                            <Button
                                className="ml-2"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeftOutlined />
                                {t("service.common.buttons.back")}
                            </Button>
                            {
                                inventoryAsset?.status === inventoryAssetStatus.inProgress && <Button
                                    className="mr-2 ml-2 bt-green"
                                    onClick={onClickCloseInventoryAsset}
                                >
                                    <CloseOutlined />
                                    Đóng kiểm kê
                                </Button>
                            }

                        </>
                    }
                    className="create-inventory-asset-container"
                >
                    <Row gutter={32}>
                        <Col span={12} style={{ display: 'none' }}>
                            <Form.Item
                                name="isConfirm"
                                valuePropName="checked"
                            >
                                <Checkbox />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                id=""
                                label="Tên lịch"
                                name="title"

                                rules={[
                                    {
                                        required: true,
                                        message: ""
                                    },
                                ]}
                            >
                                <Input disabled placeholder={"Tên lịch kiểm kê"} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="startDate"
                                label={"Ngày bắt đầu"}
                                rules={[
                                    {
                                        required: true,
                                        message: ""
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder="Chọn ngày bắt đầu"
                                    format={FORMAT_DATE}
                                    style={{ width: "100%" }}
                                    allowClear
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="endDate"
                                label={"Ngày kết thúc"}
                                rules={[
                                    {
                                        required: true,
                                        message: ""
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder="Chọn ngày kết thúc"
                                    format={FORMAT_DATE}
                                    style={{ width: "100%" }}
                                    allowClear
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left">Chọn khoa/phòng để kiểm kê</Divider>
                    <Row>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            className="mb-2"
                        >
                            Thêm khoa/phòng kiểm kê
                        </Button>
                        <Table
                            columns={columnDepartments}
                            rowKey="_id"
                            key={"_id"}
                            dataSource={inventoryAssetDepartments}
                            className="custom-table wp-100"
                            pagination={false}
                            bordered
                            expandable={{
                                expandedRowRender: (record, index) => (
                                    <ExpandRowInventoryAssetDepartment
                                        inventoryAssetDepartment={record}
                                    />
                                ),
                            }}
                        ></Table>
                    </Row>
                    <Divider orientation="left">Tệp đính kèm</Divider>
                    <AttachmentModel
                        value={fileList}
                        onChange={setFileList}
                        notSize={true}
                    />
                </Card>
            </Form>
            <InventoryAssetAssignUserModal
                open={isOpenAssignUser}
                hanldeClose={() => setIsOpenAssignUser(false)}
                callbackAssignUser={callbackAssignUser}
                // preventiveTask={schedulePreventiveTaskChange}
                departments={departments}
                inventoryAssetDepartments={inventoryAssetDepartments}
            />
        </>
    );
}