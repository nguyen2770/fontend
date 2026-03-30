import Modal from "antd/es/modal/Modal";
import React, { useEffect, useState } from "react";
import {
    CloseCircleOutlined,
    PlayCircleOutlined,
    SearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Form,
    Input,
    Pagination,
    Row,
    Select,
    Table,
    Card,
    Tag,
} from "antd";
import { assetStyleMap, assetType, PAGINATION } from "../../../../../utils/constant";
import * as _unitOfWork from "../../../../../api";
import { filterOption } from "../../../../../helper/search-select-helper";
import { parseToLabel } from "../../../../../helper/parse-helper";
import { useTranslation } from "react-i18next";
import ComfirmStartDate from "../../../../../components/modal/ComfirmStartDate";
import ShowSuccess from "../../../../../components/modal/result/successNotification";

export default function AssetMaintenanceOfModel({
    open,
    handleCancel,
    onSelectAssetMaintenance,
    assetChange,
    assetModel,
    preventiveOfModel,
}) {
    const { t } = useTranslation();
    const [formSearchAsset] = Form.useForm();
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [assetMaintenances, setAssetMaintenances] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedRowKey, setSelectedRowKey] = useState([]);
    const [assetModels, setAssetModels] = useState([]);
    const [assets, setAssets] = useState([]);
    const [showComfirmStartDate, setShowComfirmStartDate] = useState(false);

    useEffect(() => {
        if (assetChange) {
            setSelectedRowKey([assetChange.id]);
        }
    }, [assetChange]);
    useEffect(() => {
        if (open) {
            fetchGetAllManfacturers();
            fetchGetAllCategorys();
            fetchGetAllCustomers();
            fetchGetAllAssetModels();
            fetchGetAllAssets();
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            fetchGetListAsset();
        }
    }, [page, open]);

    const fetchGetAllAssets = async () => {
        let res = await _unitOfWork.asset.getAllAsset();
        if (res && res.code === 1) {
            setAssets(res.data);
        }
    };
    const fetchGetAllAssetModels = async () => {
        let res = await _unitOfWork.assetModel.getAllAssetModel();
        if (res && res.code === 1) {
            setAssetModels(res.data);
        }
    };

    const fetchGetAllCustomers = async () => {
        let res = await _unitOfWork.customer.getAllCustomer();
        if (res && res.code === 1) {
            setCustomers(res.data);
        }
    };

    const fetchGetAllManfacturers = async () => {
        let res = await _unitOfWork.manufacturer.getAllManufacturer();
        if (res && res.code === 1) {
            setManufacturers(res.data);
        }
    };
    const fetchGetAllCategorys = async () => {
        let res = await _unitOfWork.category.getAllCategory();
        if (res && res.code === 1) {
            setCategories(res.data);
        }
    };
    const onSearch = () => {
        const values = formSearchAsset.getFieldsValue();
        fetchGetListAsset(values);
    };
    const onRefresh = () => {
        formSearchAsset.resetFields();
        setPage(1);
        fetchGetListAsset();
    };

    const fetchGetListAsset = async (values) => {
        let payload = {
            page: page,
            limit: PAGINATION.limit,
            ...values,
            assetModel,
        };
        const res =
            await _unitOfWork.assetMaintenance.getListAssetMaintenances(payload);

        if (res && res.results && res.results?.results) {
            const list = res.results?.results || [];
            const listWithTotal = await Promise.all(
                list.filter(item => item.assetStyle !== assetStyleMap.accessories).map(async (item) => {
                    const totalRes =
                        await _unitOfWork.preventiveOfModel.getTotalPreventiveByPreventiveOfModel(
                            {
                                assetMaintenance: item?._id || item?.id,
                                preventiveOfModel: preventiveOfModel?.id || preventiveOfModel?._id,
                            }
                        );
                    return {
                        ...item,
                        totalPreventive: totalRes?.countPrevetive || 0,
                    };
                })
            );
            setAssetMaintenances(listWithTotal);
            setTotalRecord(res.results.totalResults);
        }
    };

    const onChangePagination = (value) => {
        setPage(value);
    };
    const handleClose = () => {
        formSearchAsset.resetFields();
        setPage(1);
        setSelectedRowKey([]);
        handleCancel();
    };
    // const selectedAssetMaintenance = assetMaintenances.filter((item) =>
    //     (selectedRowKey || []).includes(item.id)
    // );
    // const handleConfirm = () => {
    //     if (onSelectAssetMaintenance && selectedRowKey?.length > 0) {
    //         onSelectAssetMaintenance(selectedAssetMaintenance);
    //     }
    //     handleClose();
    // };
    const onClickStart = (record) => {
        // setPreventiveOfModel(record);
        setShowComfirmStartDate(true);
    };
    const onCallBack = async (date, initialValue) => {
        const data = {
            preventiveOfModel: preventiveOfModel?._id || preventiveOfModel?.id,
            assetMaintenances: selectedRowKey,
            actualScheduleDate: date,
        };
        if (initialValue) {
            data.initialValue = initialValue;
        }
        const res = await _unitOfWork.preventiveOfModel.startManyPreventiveOfModel({
            data,
        });

        if (res && res.code === 1) {
            ShowSuccess(
                "topRight",
                t("common.notifications"),
                t("common.messages.success.successfully")
            );
            //   fetchGetPreventiveOfModels();
            handleClose();
        }
    };

    const columns = [
        {
            title: t("assetMaintenance.asset_number"),
            dataIndex: "assetNumber",
            align: "center",
            className: "text-left-column",
        },
        {
            title: t("modal.assetSelect.table.serial"),
            dataIndex: "serial",
            align: "center",
            className: "text-left-column",
        },
        {
            title: t("modal.assetSelect.table.asset_name"),
            dataIndex: "assetModel",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.asset?.assetName}</span>,
        },
        {
            title: t("modal.assetSelect.table.asset_style"),
            dataIndex: "assetStyle",
            align: "center",
            className: "text-left-column",
            render: (text) => t(parseToLabel(assetType.Options, text)),
        },
        {
            title: t("modal.assetSelect.table.model"),
            dataIndex: "assetModel",
            align: "center",
            className: "text-left-column",
            render: (_text, record) => (
                <span>{record?.assetModel?.assetModelName || []}</span>
            ),
        },
        {
            title: t("modal.assetSelect.table.manufacturer"),
            dataIndex: "assetModel",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.manufacturer?.manufacturerName}</span>,
        },
        {
            title: t("modal.assetSelect.table.category"),
            dataIndex: "assetModel",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.category?.categoryName}</span>,
        },
        {
            title: t("modal.assetSelect.table.customer"),
            dataIndex: "customer",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.customerName || []}</span>,
        },
        {
            title: t("preventive.list.table.status"),
            dataIndex: "totalPreventive",
            align: "center",
            render: (totalPreventive) => {
                if (totalPreventive > 0) {
                    return <Tag color="error">{t("preventive.tag.already_scheduled")}</Tag>;
                }
                return <Tag color="success">{t("preventive.tag.ready")}</Tag>;
            }
        }
    ];

    return (
        <Modal
            open={open}
            closable={false}
            className="custom-modal"
            footer={false}
            width={"85%"}
        >
            <Form labelWrap form={formSearchAsset} layout="vertical">
                <Card title={t("modal.assetSelect.title")}>
                    <Row className="mb-3" gutter={32}>
                        <Col span={6}>
                            <Form.Item
                                label={t("assetMaintenance.asset_number")}
                                name="assetNumber"
                                labelAlign="left"
                            >
                                <Input
                                    placeholder={t(
                                        "assetMaintenance.list.search.placeholder_asset_number",
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t("modal.assetSelect.search.serial")}
                                name="serial"
                                labelAlign="left"
                            >
                                <Input
                                    placeholder={t("modal.assetSelect.search.serial_placeholder")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t("modal.assetSelect.search.asset_style")}
                                name="assetStyle"
                                labelAlign="left"
                            >
                                <Select
                                    placeholder={t(
                                        "modal.assetSelect.search.asset_style_placeholder",
                                    )}
                                    options={(assetType.Options || []).map((item) => ({
                                        value: item.value,
                                        label: t(item.label),
                                    }))}
                                    allowClear
                                    filterOption={filterOption}
                                    showSearch={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t("modal.assetSelect.search.manufacturer")}
                                name="manufacturer"
                                labelAlign="left"
                            >
                                <Select
                                    placeholder={t(
                                        "modal.assetSelect.search.manufacturer_placeholder",
                                    )}
                                    showSearch
                                    allowClear
                                    options={(manufacturers || []).map((item) => ({
                                        value: item.id,
                                        label: item.manufacturerName,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t("modal.assetSelect.search.category")}
                                name="category"
                                labelAlign="left"
                            >
                                <Select
                                    placeholder={t(
                                        "modal.assetSelect.search.category_placeholder",
                                    )}
                                    showSearch
                                    allowClear
                                    options={(categories || []).map((item) => ({
                                        value: item.id,
                                        label: item.categoryName,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t("modal.assetSelect.search.sub_category")}
                                name="subcCategory"
                                labelAlign="left"
                            >
                                <Select
                                    placeholder={t(
                                        "modal.assetSelect.search.sub_category_placeholder",
                                    )}
                                    showSearch
                                    allowClear
                                    options={(categories || []).map((item) => ({
                                        value: item.id,
                                        label: item.categoryName,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t("modal.assetSelect.search.customer")}
                                name="customer"
                                labelAlign="left"
                            >
                                <Select
                                    placeholder={t(
                                        "modal.assetSelect.search.customer_placeholder",
                                    )}
                                    showSearch
                                    allowClear
                                    options={(customers || []).map((item) => ({
                                        value: item.id,
                                        label:
                                            item.customerName +
                                            (item.contactNumber
                                                ? ` - ( ${item.contactNumber} )`
                                                : ""),
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t("modal.assetSelect.search.asset")}
                                name="asset"
                                labelAlign="left"
                            >
                                <Select
                                    placeholder={t("modal.assetSelect.search.asset_placeholder")}
                                    showSearch
                                    allowClear
                                    options={(assets || []).map((item) => ({
                                        value: item.id,
                                        label: item.assetName,
                                    }))}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col flex="auto" style={{ textAlign: "left" }}>
                            <Button type="primary" onClick={onSearch} className="mr-2">
                                <SearchOutlined />
                                {t("modal.assetSelect.buttons.search")}
                            </Button>
                            <Button
                                type="primary"
                                onClick={onRefresh}
                                style={{ background: "#008444" }}
                            >
                                <SyncOutlined />
                                {t("modal.assetSelect.buttons.refresh")}
                            </Button>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Button onClick={handleClose} className="ml-3">
                                <CloseCircleOutlined />
                                {t("modal.assetSelect.buttons.cancel")}
                            </Button>
                            <Button
                                className="ml-3"
                                type="primary"
                                onClick={onClickStart}
                                disabled={!selectedRowKey || selectedRowKey.length === 0}
                            >
                                <PlayCircleOutlined />
                                {t("preventive.buttons.start")}
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        rowKey="id"
                        columns={columns}
                        key={"id"}
                        dataSource={assetMaintenances}
                        bordered
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            selectedRowKeys: selectedRowKey,
                            preserveSelectedRowKeys: true,
                            onChange: (selectedKeys) => setSelectedRowKey(selectedKeys),
                            // disable tài sản đã bắt đầu lịch bảo trì
                            getCheckboxProps: (record) => ({
                                disabled: record.totalPreventive > 0,
                                name: record.assetNumber,
                            }),
                        }}
                        onRow={(record) => ({
                            onClick: () => {
                                if (record.totalPreventive > 0) {
                                    return;
                                }
                                const isSelected = selectedRowKey.includes(record.id);
                                const newSelectedRowKeys = isSelected
                                    ? selectedRowKey.filter((key) => key !== record.id)
                                    : [...selectedRowKey, record.id];
                                setSelectedRowKey(newSelectedRowKeys);
                            },
                            style: { cursor: record.totalPreventive > 0 ? 'not-allowed' : 'pointer' }
                        })}
                    ></Table>
                    <Pagination
                        className="pagination-table mt-2"
                        onChange={onChangePagination}
                        pageSize={pagination.limit}
                        total={totalRecord}
                        current={page}
                    />
                </Card>
            </Form>
            <ComfirmStartDate
                open={showComfirmStartDate}
                hanldeColse={() => setShowComfirmStartDate(false)}
                onCallBack={onCallBack}
                preventiveOfModel={preventiveOfModel}
            />
        </Modal>
    );
}
