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
import CreateAssetTypeMapManufacturer from "./createAssetTypeMapManufacturer";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import { PAGINATION } from "../../../../../utils/constant";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function AssetTypeMapManufacturer({ assetType }) {
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
            assetType: assetType?.id || assetType?._id
        };
        const res =
            await _unitOfWork.assetTypeManufacturer.getListAssetTypeManufacturers(
                payload
            );

        if (res && res.results && res.results?.results) {
            setAssetModels(res.results?.results);
            setTotalRecord(res.results.totalResults);
        }
    };
    const onClickDelete = async (value) => {
        const res =
            await _unitOfWork.assetTypeManufacturer.deleteAssetTypeManufacturer(
                { id: value.id }
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
            title: t("assetType.mapManufacturer.table.index"),
            dataIndex: "key",
            align: "center",
            width: "60px",
            render: (_text, _record, index) => index + 1
        },
        {
            title: t("assetType.mapManufacturer.table.manufacturer"),
            dataIndex: "manufacturer",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.manufacturerName || ""}</span>
        },
        {
            title: t("assetType.mapManufacturer.table.origin"),
            dataIndex: "manufacturer",
            align: "center",
            className: "text-left-column",
            render: (text) => <span>{text?.origin?.originName || ""}</span>
        },
        {
            title: t("assetType.mapManufacturer.table.action"),
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
                                    t("assetType.mapManufacturer.messages.confirm_delete"),
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
                        {t("assetType.mapManufacturer.add_button")}
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
            />
            <Pagination
                className="pagination-table mt-2"
                onChange={onChangePagination}
                pageSize={PAGINATION.limit}
                total={totalRecord}
                current={page}
            />
            <CreateAssetTypeMapManufacturer
                open={isOpenCreate}
                handleCancel={() => setIsOpenCreate(false)}
                assetType={assetType}
                selectedIds={assetModels.map(
                    (item) => item.manufacturer?._id || item.manufacturer?.id
                )}
                onSubmit={async (newSelectedIds) => {
                    const res =
                        await _unitOfWork.assetTypeManufacturer.updateManufacturersOfAssetType(
                            {
                                assetTypeId: assetType.id,
                                manufacturerIds: newSelectedIds
                            }
                        );
                    if (res?.code === 1) {
                        ShowSuccess(
                            "topRight",
                            t("assetType.notifications.title", { ns: "assetType" }),
                            t("assetType.messages.update_success")
                        );
                        fetchGetListAsset();
                        setIsOpenCreate(false);
                    }
                }}
            />
        </div>
    );
}