import { DeleteOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col, Tooltip, Table, message } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assetType } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import Confirm from "../../../components/modal/Confirm";
import AssetMaintenanceModal from "./assetMaintenanceModal";

export default function MappingAssetMainteanceForCustomer() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [assetMaintenances, setAssetMaintenances] = useState([]);
    const [isOpenModal, setIsOpenModel] = useState(false);

    useEffect(() => {
        fetchAssetMaintenanceByCustomer();
    }, [id]);

    const fetchAssetMaintenanceByCustomer = async () => {
        let res = await _unitOfWork.assetMaintenanceCustomer.getAssetMaintenanceByCustomer({
            id
        });
        if (res && res.code === 1) {
            setAssetMaintenances(res.data || []);
        }
    };

    const onDelete = async (recordId) => {
        const res = await _unitOfWork.assetMaintenanceCustomer.deleteAssetMaintenanceCustomer({
            id: recordId
        })
        if (res && res.code === 1) {
            fetchAssetMaintenanceByCustomer();
            message.success(t("users.mappingAsset.messages.delete_success"));
        } else {
            message.error(t("users.mappingAsset.messages.delete_error"));
        }
    };

    // const resetSearch = () => {
    //     searchForm.resetFields();
    //     fetchGetListAssetMaintenance();
    // };

    const columns = [
        {
            title: t("users.mappingAsset.columns.index"),
            dataIndex: "key",
            width: 70,
            align: "center",
            render: (_text, _record, index) => <span>{index + 1}</span>
        },
        {
            title: t("users.mappingAsset.columns.asset_name"),
            dataIndex: "assetName"
        },
        {
            title: t("users.mappingAsset.columns.serial"),
            dataIndex: "serial",
        },
        {
            title: t("users.mappingAsset.columns.asset_number"),
            dataIndex: "assetNumber",
        },
        {
            title: t("users.mappingAsset.columns.model"),
            dataIndex: "assetModelName",
        },
        {
            title: t("users.mappingAsset.columns.asset_style"),
            dataIndex: "assetStyle",
            render: (text) => (
                <span>{t(parseToLabel(assetType.Options, text))}</span>
            )
        },
        {
            title: t("users.mappingAsset.columns.action"),
            align: "center",
            render: (_, record) => (
                <Tooltip title={t("users.list.tooltips.delete")}>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() =>
                            Confirm(
                                t("users.mappingAsset.buttons.confirm_delete"),
                                () => onDelete(record.id)
                            )
                        }
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <Card title={t("users.mappingAsset.title")}>
            <Row className="mb-2">
                <Col span={24} style={{ textAlign: "right" }}>
                    <Button onClick={() => navigate(-1)} className="ml-3">
                        <LeftOutlined /> {t("users.mappingAsset.buttons.back")}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setIsOpenModel(true);
                        }}
                        className="ml-3"
                    >
                        <PlusOutlined /> {t("users.mappingAsset.buttons.add")}
                    </Button>
                </Col>
            </Row>
            <Table
                key={"id"}
                rowKey="id"
                columns={columns}
                dataSource={assetMaintenances}
                className="custom-table"
                bordered
            />
            <AssetMaintenanceModal
                open={isOpenModal}
                id={id}
                onRefresh={fetchAssetMaintenanceByCustomer}
                onClose={() => {
                    setIsOpenModel(false);
                }}
            />
        </Card>
    );
}