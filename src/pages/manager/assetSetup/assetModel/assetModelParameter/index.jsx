import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Table, Tooltip } from "antd";
import CreateAssetModelParameter from "./CreateAssetModelParameter";
import UpdateAssetModelParameter from "./UpdateAssetModelParameter";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import ShowError from "../../../../../components/modal/result/errorNotification";
import DialogModal from "../../../../../components/modal/result/DialogNotification";
import BulkUploadModal from "../../../../../components/modal/BulkUpload";

export default function AssetModelParameter({ assetModel }) {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [items, setItems] = useState([]);
  const [changeItem, setChangeItem] = useState(null);
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    if (assetModel) fetchData();
  }, [assetModel]);

  const fetchData = async () => {
    const res =
      await _unitOfWork.assetModelParameter.getAllAssetModelParameter({
        assetModel: assetModel.id
      });
    if (res?.code === 1) setItems(res.data);
  };

  const onClickUpdate = (record) => {
    setChangeItem(record);
    setIsOpenUpdate(true);
  };

  const onClickDelete = async (record) => {
    const res =
      await _unitOfWork.assetModelParameter.deleteAssetModelParameter({
        id: record.id
      });
    if (res?.code === 1) fetchData();
  };
  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    formData.append("assetModel", assetModel.id);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.assetModelParameter.uploadAssetModelParameterExcel(
      formData
    );
    if (res && res.code === 1 && res.result.success) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.upload_count", { count: res?.result?.insertCount || 0 })
      );
      if (res?.result?.warnings) {
        setMessages(res?.result?.warnings);
        setModalType("warning")
        setIsModalOpen(true);
      }
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        res?.message || t("common.messages.errors.upload_failed")
      );
      setMessages(res?.result?.errors);
      setModalType("error");
      setIsModalOpen(true);
    }
    fetchData();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("assetModel.common.table.index"),
      dataIndex: "key",
      width: 60,
      align: "center",
      render: (_t, _r, i) => i + 1
    },
    {
      title: t("assetModel.parameter.fields.name"),
      dataIndex: "name",
      align: "center",
      className: "text-left-column"
    },
    {
      title: t("assetModel.parameter.fields.value"),
      dataIndex: "value",
      align: "center",
      className: "text-left-column"
    },
    {
      title: t("assetModel.common.table.action"),
      dataIndex: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div>
          <Tooltip title={t("assetModel.common.buttons.update")}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onClickUpdate(record)}
            />
          </Tooltip>
          <Tooltip title={t("assetModel.common.buttons.delete")}>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              size="small"
              className="ml-2"
              onClick={() =>
                Comfirm(
                  t("assetModel.common.messages.confirm_delete"),
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
            className="button"
            onClick={() => setOpenBulkUpload(true)}
          >
            <UploadOutlined />
            {t("customer.actions.bulk_upload")}
          </Button>
          <Button
            type="primary"
            onClick={() => setIsOpenCreate(true)}
            className="ml-3"
          >
            <PlusOutlined />{" "}
            {t("assetModel.common.buttons.add_parameter")}
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
      <CreateAssetModelParameter
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchData}
        assetModel={assetModel}
      />
      <UpdateAssetModelParameter
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        assetModelParameterChange={changeItem}
        assetModel={assetModel}
        onRefresh={fetchData}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateAssetModelParameter.xlsx"
      />
      <DialogModal
        open={isModalOpen}
        handleOk={() => setIsModalOpen(false)}
        type={modalType}
        message={messages}
      />
    </div>
  );
}