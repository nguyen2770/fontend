import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Switch, Table, Tooltip } from "antd";
import CreateAssetModelSolution from "./CreateAssetModelSolution";
import UpdateAssetModelSolution from "./UpdateAssetModelSolution";
import * as _unitOfWork from "../../../../../api";
import Comfirm from "../../../../../components/modal/Confirm";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ShowError from "../../../../../components/modal/result/errorNotification";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import DialogModal from "../../../../../components/modal/result/DialogNotification";
import BulkUploadModal from "../../../../../components/modal/BulkUpload";

export default function AssetModelSolution({ assetModel }) {
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
      await _unitOfWork.assetModelSolution.getAllAssetModelSolution(
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
      await _unitOfWork.assetModelSolution.deleteAssetModelSolution({
        id: record._id
      });
    if (res?.code === 1) fetchData();
  };

  const onUpdateStatus = async (record) => {
    const res =
      await _unitOfWork.assetModelSolution.updateAssetModelSolutionStatus(
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
    let res = await _unitOfWork.assetModelSolution.uploadAssetModelSolutionExcel(
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
      title: t("assetModel.solution.table.index"),
      dataIndex: "key",
      width: 60,
      align: "center",
      render: (_t, _r, i) => i + 1
    },
    {
      title: t("assetModel.solution.table.failure_type"),
      dataIndex: "assetModelFailureType",
      align: "center",
      className: "text-left-column",
      render: (_t, record) =>
        record?.assetModelFailureType?.name || ""
    },
    {
      title: t("assetModel.solution.table.tags"),
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
      title: t("assetModel.solution.table.reason_origin"),
      dataIndex: "reasonOrigin",
      className: "text-left-column"
    },
    {
      title: t("assetModel.solution.table.solution_content"),
      dataIndex: "solutionContent",
      className: "text-left-column"
    },
    // {
    //   title: t("assetModel.common.table.status"),
    //   dataIndex: "status",
    //   width: 90,
    //   align: "center",
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
      width: 110,
      align: "center",
      render: (_, record) => (
        <div>
          <Tooltip title={t("assetModel.common.buttons.update")}>
            <Button
              icon={<EditOutlined />}
              type="primary"
              size="small"
              onClick={() => onClickUpdate(record)}
            />
          </Tooltip>
          <Tooltip title={t("assetModel.common.buttons.delete")}>
            <Button
              icon={<DeleteOutlined />}
              danger
              type="primary"
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
            {t("assetModel.common.buttons.add_solution")}
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
      <CreateAssetModelSolution
        open={isOpenCreate}
        onCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchData}
        assetModel={assetModel}
      />
      <UpdateAssetModelSolution
        open={isOpenUpdate}
        onCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        assetModelSolutionChange={changeItem}
        assetModel={assetModel}
        onRefresh={fetchData}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateAssetModelSolution.xlsx"
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