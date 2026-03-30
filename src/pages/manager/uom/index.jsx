import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Space, Table, Tooltip } from "antd";
import CreateUom from "./CreateUom";
import UpdateUom from "./UpdateUom";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import { useTranslation } from "react-i18next";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import DialogModal from "../../../components/modal/result/DialogNotification";

export default function UomPage() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { setHeaderTitle } = useHeader();
  const [uoms, setUoms] = useState([]);
  const [uomUpdate, setUomUpdate] = useState(null);
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    setHeaderTitle(t("uom.list.title"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchUoms();
  }, []);

  const fetchUoms = async () => {
    const res = await _unitOfWork.uom.getAllUom({});
    if (res && res.code === 1) {
      setUoms(res?.data);
    }
  };

  const onClickCreate = () => setIsOpenCreate(true);
  const onClickUpdate = (record) => {
    setIsOpenEdit(true);
    setUomUpdate(record);
  };
  const onClikDelete = async (record) => {
    const res = await _unitOfWork.uom.deleteUom({ id: record.id });
    if (res && res.code === 1) {
      fetchUoms();
      message.success(t("uom.messages.delete_success"));
    } else {
      message.error(t("uom.messages.delete_error"));
    }
  };

  const onFinish = () => {
    // giữ nguyên (chưa có tìm kiếm thực tế)
  };
  const handleUpload = async (file, note) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("note", note);
    // console.log("file, note", file, note);
    let res = await _unitOfWork.uom.uploadUomExcel(
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
    fetchUoms();
    setOpenBulkUpload(false);
  };

  const columns = [
    {
      title: t("uom.export.index"),
      dataIndex: "key",
      width: 50,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("uom.list.table.name"),
      dataIndex: "uomName",
      className: "text-left-column",
      align: "center",
    },
    {
      title: t("uom.table.action", { defaultValue: "Action" }),
      dataIndex: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission(permissions, permissionCodeConstant.uom_update) && (
            <Tooltip title={t("uom.actions.edit")}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="ml-2"
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(permissions, permissionCodeConstant.uom_delete) && (
            <Tooltip title={t("uom.actions.delete")}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="ml-2"
                onClick={() =>
                  Confirm(t("uom.messages.confirm_delete"), () => onClikDelete(record))
                }
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Form
labelWrap
        form={searchForm}
        className="mb-3"
        onFinish={onFinish}
        layout="vertical"
      >
        <Row className="mb-1">
          <Col span={12}>
            {/* Chưa dùng search – giữ nguyên logic */}
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              className="button"
              onClick={() => setOpenBulkUpload(true)}
            >
              <UploadOutlined />
              {t("customer.actions.bulk_upload")}
            </Button>
            {checkPermission(permissions, permissionCodeConstant.uom_create) && (
              <Button
                className="ml-3"
                type="primary"
                onClick={() => onClickCreate()}
              >
                <PlusOutlined />
                {t("uom.form.buttons.submit_create")}
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      <Row>
        <Col
          span={24}
          style={{ fontSize: 16, textAlign: "right" }}
          className="mt-1"
        >
          <b>{t("uom.list.total", { count: uoms.length || 0 })}</b>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        key={"id"}
        dataSource={uoms}
        bordered
      />

      <CreateUom
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        handleOk={() => setIsOpenCreate()}
        onRefresh={fetchUoms}
      />
      <UpdateUom
        open={isOpenEdit}
        handleCancel={() => setIsOpenEdit(false)}
        handleOk={() => setIsOpenEdit()}
        uom={uomUpdate}
        onRefresh={fetchUoms}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/TemplateUom.xlsx"
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