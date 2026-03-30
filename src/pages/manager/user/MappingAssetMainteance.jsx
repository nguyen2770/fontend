import { DeleteOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, message, Row, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import AssetMainteanceModal from "./assetMainteanceModal";
import Confirm from "../../../components/modal/Confirm";
import { assetType } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import { useTranslation } from "react-i18next";

const MappingAssetMainteance = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [assetMaintenances, setAssetMaintenances] = useState([]);
  const [isOpenModal, setIsOpenModel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssetMaintenanceByUser();
  }, [id]);

  const fetchAssetMaintenanceByUser = async () => {
    const res =
      await _unitOfWork.assetMaintenanceUser.getAssetMaintenanceUserByUser({
        id,
      });
    if (res && res.data) {
      setAssetMaintenances(res.data);
    }
  };

  const onDelete = async (recordId) => {
    const res =
      await _unitOfWork.assetMaintenanceUser.deleteAssetMaintenanceUser({
        id: recordId,
      });
    if (res && res.code === 1) {
      fetchAssetMaintenanceByUser();
      message.success(t("users.mappingAsset.messages.delete_success"));
    } else {
      message.error(t("users.mappingAsset.messages.delete_error"));
    }
  };

  const columns = [
    {
      title: t("users.mappingAsset.columns.index"),
      dataIndex: "key",
      width: 70,
      align: "center",
      render: (_text, _record, index) => <span>{index + 1}</span>,
    },
    {
      title: t("users.mappingAsset.columns.asset_name"),
      dataIndex: "assetMaintenance",
      render: (text) => <span>{text?.asset?.assetName}</span>,
    },
    {
      title: t("users.mappingAsset.columns.serial"),
      dataIndex: "assetMaintenance",
      render: (text) => <span>{text?.serial}</span>,
    },
    {
      title: t("users.mappingAsset.columns.asset_number"),
      dataIndex: "assetMaintenance",
      render: (text) => <span>{text?.assetNumber}</span>,
    },
    {
      title: t("users.mappingAsset.columns.model"),
      dataIndex: "assetMaintenance",
      render: (text) => <span>{text?.assetModel?.assetModelName}</span>,
    },
    {
      title: t("users.mappingAsset.columns.asset_style"),
      dataIndex: "assetMaintenance",
      render: (text) => (
        <span>{t(parseToLabel(assetType.Options, text?.assetStyle))}</span>
      ),
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
              Confirm(t("users.mappingAsset.buttons.confirm_delete"), () =>
                onDelete(record.id),
              )
            }
          />
        </Tooltip>
      ),
    },
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
        pagination={false}
      />
      <AssetMainteanceModal
        open={isOpenModal}
        id={id}
        onRefresh={() => fetchAssetMaintenanceByUser()}
        onClose={() => {
          setIsOpenModel(false);
        }}
      />
    </Card>
  );
};

export default MappingAssetMainteance;
