import React, { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Pagination,
    Row,
    Table,
    Tooltip
} from "antd";
import CreateAssetTypeMapAssetModel from "./CreateAssetTypeMapAssetModel";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import { PAGINATION } from "../../../../../utils/constant";
import ExpandRowAsset from "../../../../../components/modal/assetModel/ExpandRowAsset";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function AssetTypeMapAssetModel({ assetType }) {
    const { t } = useTranslation();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [assetModels, setAssetModels] = useState([]);

    useEffect(() => {
        if (assetType) {
            fetchGetListAsset();
        }
    }, [assetType, page]);

    const fetchGetListAsset = async () => {
        let payload = {
            page,
            limit: PAGINATION.limit,
            asset:
                assetType?.asset?.id || assetType?.asset?._id,
            assetTypeCategory:
                assetType?.assetTypeCategory?.id ||
                assetType?.assetTypeCategory?._id
        };
        const res =
            await _unitOfWork.assetModel.getListAssetModel(payload);

        if (res && res.results && res.results?.results) {
            setAssetModels(res.results?.results);
            setTotalRecord(res.results.totalResults);
        }
    };
    const onClickDelete = async (value) => {
        const res = await _unitOfWork.assetModel.updateAssetModel(
            value.id,
            { assetTypeCategory: null }
        );
        if (res && res.code === 1) {
            fetchGetListAsset();
            ShowSuccess(
                "topRight",
                t("assetType.notifications.title", { ns: "assetType" }),
                t("assetType.mapManufacturer.messages.delete_success")
            );
        }
    };

    const onChangePagination = (value) => {
        setPage(value);
    };

    const columns = [
        {
            title: t("assetType.mapModel.table.index"),
            dataIndex: "key",
            align: "center",
            width: "60px",
            render: (_text, _record, index) => index + 1
        },
        {
            title: t("assetType.mapModel.table.model"),
            dataIndex: "assetModelName",
            className: "text-left-column",
            align: "center"
        },
        {
            title: t("assetType.mapModel.table.manufacturer"),
            dataIndex: "manufacturer",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.manufacturerName || ""}</span>
        },
        {
            title: t("assetType.mapModel.table.supplier"),
            dataIndex: "supplier",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.supplierName || ""}</span>
        },
        {
            title: t("assetType.mapModel.table.category"),
            dataIndex: "category",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.categoryName || ""}</span>
        },
        {
            title: t("assetType.mapModel.table.sub_category"),
            dataIndex: "subCategory",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.subCategoryName || ""}</span>
        },
        {
            title: t("assetType.mapModel.table.action"),
            dataIndex: "action",
            align: "center",
            width: "80px",
            render: (_, record) => (
                <div>
                    <Tooltip
                        title={t("assetType.buttons.delete")}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            className="ml-2"
                            onClick={() =>
                                Comfirm(
                                    t("assetType.messages.confirm_delete"),
                                    () => onClickDelete(record)
                                )
                            }
                        />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <div>
            <Row className="mb-1">
                <Col span={24} style={{ textAlign: "right" }}>
                    <Button
                        key="1"
                        type="primary"
                        onClick={() => setIsOpenCreate(true)}
                        className="ml-3"
                    >
                        <PlusOutlined />
                        {t("assetType.mapModel.add_button")}
                    </Button>
                </Col>
            </Row>
            <Table
                rowKey="id"
                columns={columns}
                key={"id"}
                dataSource={assetModels}
                bordered
                pagination={false}
                expandable={{
                    expandedRowRender: (record) => (
                        <ExpandRowAsset assetModel={record} />
                    )
                }}
            />
            <Pagination
                className="pagination-table mt-2"
                onChange={onChangePagination}
                pageSize={PAGINATION.limit}
                total={totalRecord}
                current={page}
            />
            <CreateAssetTypeMapAssetModel
                open={isOpenCreate}
                handleCancel={() => setIsOpenCreate(false)}
                onRefresh={fetchGetListAsset}
                assetType={assetType}
            />
        </div>
    );
}