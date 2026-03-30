import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Table, Tooltip } from "antd";
import CreateSparePart from "./CreateSparePart";
import UpdateSparePart from "./UpdateSparePart";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AssetModelSparePart({ assetModel }) {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [items, setItems] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [changeItem, setChangeItem] = useState(null);
  const [changeId, setChangeId] = useState(null);
  const params = useParams();

  useEffect(() => {
    fetchList();
    fetchAllSparePart();
  }, []);

  const fetchAllSparePart = async () => {
    const res = await _unitOfWork.sparePart.getSpareParts();
    if (res?.code === 1) setSpareParts(res.data);
  };

  const fetchList = async () => {
    const res =
      await _unitOfWork.assetModelSparePart.getResById({
        id: params.id
      });
    if (res?.code === 1) setItems(res.data);
  };

  const onClickUpdate = (record) => {
    setChangeId(record.id);
    setChangeItem(record);
    setIsOpenUpdate(true);
  };

  const onDelete = async (record) => {
    const res =
      await _unitOfWork.assetModelSparePart.deleteAssetModelSparePart({
        id: record.id
      });
    if (res?.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("assetModel.common.messages.update_success")
      );
      fetchList();
    }
  };

  const columns = [
    {
      title: t("assetModel.common.table.index"),
      dataIndex: "id",
      width: 60,
      align: "center",
      render: (_t, _r, i) => i + 1
    },
    {
      title: t("assetModel.spare_part.table.name"),
      dataIndex: "sparePart",
      align: "center",
      className: "text-left-column",
      render: (sp) => sp?.sparePartsName || ""
    },
    {
      title: t("assetModel.spare_part.table.code"),
      dataIndex: "sparePart",
      align: "center",
      render: (sp) => sp?.code || ""
    },
    {
      title: t("assetModel.spare_part.table.manufacturer"),
      dataIndex: "sparePart",
      align: "center",
      render: (sp) =>
        sp?.manufacturer?.manufacturerName || ""
    },
    {
      title: t("assetModel.spare_part.table.quantity"),
      dataIndex: "quantity",
      align: "center",
      className: "text-right-column"
    },
    {
      title: t("assetModel.common.table.action"),
      dataIndex: "action",
      width: 110,
      align: "center",
      render: (_, record) => (
        <div>
          <Tooltip title={t("assetModel.common.buttons.update")}>
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onClickUpdate(record)}
            />
          </Tooltip>
          <Tooltip title={t("assetModel.common.buttons.delete")}>
            <Button
              danger
              size="small"
              type="primary"
              icon={<DeleteOutlined />}
              className="ml-2"
              onClick={() =>
                Comfirm(
                  t("assetModel.common.messages.confirm_delete"),
                  () => onDelete(record)
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
            type="primary"
            onClick={() => setIsOpenCreate(true)}
            className="ml-2"
          >
            <PlusOutlined />{" "}
            {t("assetModel.common.buttons.add_spare_part")}
          </Button>
        </Col>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        bordered
        pagination={false}
      />
      <CreateSparePart
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        handleOk={() => setIsOpenCreate(false)}
        onRefresh={fetchList}
        spareParts={spareParts}
        assetModel={assetModel}
      />
      <UpdateSparePart
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        id={changeId}
        onRefresh={fetchList}
        spareParts={spareParts}
        assetModelId={params.id}
        assetModelSparePart={changeItem}
      />
    </div>
  );
}