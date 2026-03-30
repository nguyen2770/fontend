import React, { useEffect, useState } from "react";
import {
    Modal,
    Input,
    Button,
    Form,
    Row,
    Col,
    Card,
    Select,
    Divider,
    Space,
} from "antd";
import { CheckSquareFilled, CloseSquareOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { filterOption } from "../../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";

export default function UpdateMapAssetMaintenance({
    open,
    onCancel,
    onReset,
    assetMaintenance,
}) {
    const { t } = useTranslation();
    const [buildings, setBuildings] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [floors, setFloors] = useState([]);
    const [branchs, setBranchs] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            fetchAllProvince();
            fetchAllFloor();
            fetchAllDepartment();
            fetchAllBuilding();
            fetchAllBranch();
            fetchCustomers();
        }
    }, [open]);

    useEffect(() => {
        if (open && assetMaintenance) {
            form.setFieldsValue({
                ...assetMaintenance,
                customer: assetMaintenance?.customer?.id
            });
        }
        if (open && assetMaintenance && assetMaintenance?.province) {
            fetchAllCommunesByProvince(assetMaintenance?.province);
        }
    }, [open, assetMaintenance]);


    const fetchCustomers = async () => {
        let res = await _unitOfWork.customer.getAllCustomer();
        if (res && res.code === 1) {
            setCustomers(res.data);
        }
    }
    const fetchAllFloor = async () => {
        let res = await _unitOfWork.floor.getAllFloor();
        if (res && res.code === 1) {
            setFloors(res.data);
        }
    }
    const fetchAllDepartment = async () => {
        let res = await _unitOfWork.department.getAllDepartment();
        if (res && res.code === 1) {
            setDepartments(res.data);
        }
    }
    const fetchAllBuilding = async () => {
        let res = await _unitOfWork.building.getAllBuilding();
        if (res && res.code === 1) {
            setBuildings(res.data);
        }
    }

    const fetchAllCommunesByProvince = async (id) => {
        const res = await _unitOfWork.geography.getAllCommunesByProvince({ id });
        if (res?.data) {
            const options = res.data.map(item => ({
                label: item.name,
                value: item.id,
                data: item
            }));
            setCommunes(options);
        }
    }

    const fetchAllProvince = async () => {
        const res = await _unitOfWork.geography.getAllProvinces();
        if (res?.data) {
            const options = res.data.map(item => ({
                label: item.name,
                value: item.id,
                data: item
            }));
            setProvinces(options);
        }
    };

    const fetchAllBranch = async () => {
        let res = await _unitOfWork.branch.getAllBranch();
        if (res && res.code === 1) {
            setBranchs(res.data);
        }
    }

    const onFinish = async () => {

        // upload file
        const newSupportDocuments = [];
        if (fileList) {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const resUpload = await _unitOfWork.resource.uploadImage({
                    file: file?.originFileObj,
                });
                if (resUpload && resUpload.code === 1) {
                    newSupportDocuments.push(
                        resUpload.resourceId,
                    );
                }
            }
        }
        const data = {
            assetMaintenance: assetMaintenance?.id || assetMaintenance?._id,
            oldCommune: assetMaintenance?.commune,
            oldProvince: assetMaintenance?.province,
            oldBuilding: assetMaintenance?.building,
            oldFloor: assetMaintenance?.floor,
            oldDepartment: assetMaintenance?.department,
            oldBranch: assetMaintenance?.branch,
            oldAddressNote: assetMaintenance?.addressNote,
            oldCustomer: assetMaintenance?.customer?.id,
            ...form.getFieldsValue(),
            resources: newSupportDocuments,
        };

        const res = await _unitOfWork.assetMaintenance.createAssetMaintenanceLocationHistory(data);
        if (res && res.code === 1) {
            ShowSuccess("topRight", t("common.notifications"), t("common.messages.update_success"));
            form.resetFields();
            onReset();
            onCancel();
        } else {
            ShowError("topRight", t("common.notifications"), res?.message || t("common.messages.update_failed"));
        }
    };

    const onCancelEndReset = () => {
        form.resetFields();
        onCancel();
        setCommunes([]);
    }
    return (
        <Modal
            open={open}
            onCancel={onCancelEndReset}
            footer={null}
            closable={false}
            width="70%"
            className="custom-modal"
        >
            <Form
                labelWrap
                form={form}
                onFinish={onFinish}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}>
                <Card
                    title={t("assetMaintenance.actions.move")}
                    extra={
                        <Space>
                            <Col>
                                <Button onClick={onCancelEndReset}
                                    icon={<CloseSquareOutlined />}>
                                    {t("assetMaintenance.locationHistory.cancel")}</Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<CheckSquareFilled />}
                                    htmlType="submit"
                                >
                                    {t("assetMaintenance.form.buttons.save")}
                                </Button>
                            </Col>
                        </Space>
                    }
                >
                    <Row gutter={32} className="p-3">
                        <Col span={12}>
                            <Form.Item name="customer" label={t("assetMaintenance.form.fields.customer")} labelAlign="left">
                                <Select
                                    placeholder={t("assetMaintenance.form.placeholders.customer")}
                                    showSearch
                                    options={customers?.map((item) => ({
                                        value: item.id,
                                        label: item.customerName,
                                    }))}
                                    filterOption={filterOption}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}></Col>
                        <Divider></Divider>
                        <Col span={12}>
                            <Form.Item name="province" label={t("assetMaintenance.form.fields.province")} labelAlign="left">
                                <Select
                                    placeholder={t("assetMaintenance.form.placeholders.province")}
                                    options={provinces}
                                    onChange={(value) => {
                                        form.setFieldsValue({ commune: null });
                                        setCommunes([]);
                                        fetchAllCommunesByProvince(value);
                                    }}
                                    showSearch
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="commune" label={t("assetMaintenance.form.fields.commune")} labelAlign="left">
                                <Select
                                    placeholder={t("assetMaintenance.form.placeholders.commune")}
                                    options={communes}
                                    showSearch
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="branch" label={t("assetMaintenance.form.fields.branch")} labelAlign="left">
                                <Select
                                    showSearch
                                    placeholder={t("assetMaintenance.form.placeholders.branch")}
                                    options={branchs?.map((item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="building" label={t("assetMaintenance.form.fields.building")} labelAlign="left">
                                <Select
                                    showSearch
                                    placeholder={t("assetMaintenance.form.placeholders.building")}
                                    options={buildings?.map((item) => ({
                                        value: item.id,
                                        label: item.buildingName,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="floor" label={t("assetMaintenance.form.fields.floor")} labelAlign="left">
                                <Select
                                    showSearch
                                    placeholder={t("assetMaintenance.form.placeholders.floor")}
                                    options={floors?.map((item) => ({
                                        value: item.id,
                                        label: item.floorName,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="department" label={t("assetMaintenance.form.fields.department")} labelAlign="left">
                                <Select
                                    showSearch
                                    placeholder={t("assetMaintenance.form.placeholders.department")}
                                    options={departments?.map((item) => ({
                                        value: item.id,
                                        label: item.departmentName,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="addressNote" label={t("assetMaintenance.form.fields.address")} labelAlign="left">
                                <Input placeholder={t("assetMaintenance.form.placeholders.address")}></Input>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* <Row justify="end" gutter={8}>
                        <Col>
                            <Button onClick={onCancelEndReset}
                                icon={<CloseSquareOutlined />}>
                                {t("assetMaintenance.locationHistory.cancel")}</Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<CheckSquareFilled />}
                                htmlType="submit"
                            >
                                {t("assetMaintenance.form.buttons.save")}
                            </Button>
                        </Col>
                    </Row> */}

                    <AttachmentModel
                        value={fileList}
                        onChange={setFileList}
                        notSize={true}
                    >

                    </AttachmentModel>
                </Card>
            </Form>
        </Modal >
    );
}