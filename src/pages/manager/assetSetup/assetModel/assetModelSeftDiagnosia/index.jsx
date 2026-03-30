import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Switch, Table, Tooltip } from "antd";
import CreateAssetModelSeftDiagnosia from "./CreateAssetModelSeftDiagnosia";
import UpdateAssetModelSeftDiagnosia from "./UpdateAssetModelSeftDiagnosia";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import ShowError from "../../../../../components/modal/result/errorNotification";
import BulkUploadModal from "../../../../../components/modal/BulkUpload";
import DialogModal from "../../../../../components/modal/result/DialogNotification";

export default function AssetModelSeftDiagnosia({ assetModel }) {
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
      await _unitOfWork.assetModelSeftDiagnosia.getAllAssetModelSeftDiagnosia(
        { assetModel: assetModel.id }
      );
    if (res?.code === 1) setItems(res.data);
  };

  const onClickUpdate = (record) => {
    setChangeItem(record);
    setIsOpenUpdate(true);
  };

  const onClickDelete = async (record) => {
    const res =
      await _unitOfWork.assetModelSeftDiagnosia.deleteAssetModelSeftDiagnosia(
        { id: record._id }
      );
    if (res?.code === 1) fetchData();
  };

  const onUpdateStatus = async (record) => {
    const res =
      await _unitOfWork.assetModelSeftDiagnosia.updateAssetModelSeftDiagnosiaStatus(
        record._id
      );
    if (res?.code === 1) fetchData();
  };
  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    formData.append("assetModel", assetModel.id);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.assetModelSeftDiagnosia.uploadExcel(
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
      title: t("assetModel.self_diagnosis.table.failure_type"),
      dataIndex: "assetModelFailureType",
      align: "center",
      className: "text-left-column",
      render: (_t, record) => record?.assetModelFailureType?.name || ""
    },
    {
      title: t("assetModel.self_diagnosis.table.tags"),
      dataIndex: "tags",
      align: "center",
      className: "text-left-column",
      render: (_t, record) => (
        <div>
          {record?.tags?.map((tag) => (
            <span
              key={tag.name}
              style={{
                padding: "2px 8px",
                backgroundColor: "#ddd",
                borderRadius: 6,
                marginRight: 5
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )
    },
    {
      title: t("assetModel.self_diagnosis.table.question"),
      dataIndex: "question",
      align: "center",
      className: "text-left-column"
    },
    // {
    //   title: t("assetModel.common.table.status"),
    //   dataIndex: "status",
    //   align: "center",
    //   width: 90,
    //   render: (isActive, record) => (
    //     <Switch
    //       checked={isActive}
    //       checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
    //       unCheckedChildren="x"
    //       onChange={() =>
    //         Comfirm(
    //           t("assetModel.common.messages.confirm_status_change"),
    //           () => onUpdateStatus(record)
    //         )
    //       }
    //     />
    //   )
    // },
    {
      title: t("assetModel.common.table.action"),
      dataIndex: "action",
      align: "center",
      width: 110,
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
            {t("assetModel.common.buttons.add_diagnosis")}
          </Button>
        </Col>
      </Row>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={items}
        bordered
        pagination={false}
      />
      <CreateAssetModelSeftDiagnosia
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchData}
        assetModel={assetModel}
      />
      <UpdateAssetModelSeftDiagnosia
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        assetModelSeftDiagnosiaChange={changeItem}
        assetModel={assetModel}
        onRefresh={fetchData}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateAssetModelSeftDiagnosia.xlsx"
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