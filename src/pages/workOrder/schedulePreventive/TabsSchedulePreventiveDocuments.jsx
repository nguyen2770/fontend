import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, Table, Tooltip, Upload, message } from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import { generateFullUrl } from "../../../api/restApi";
import Comfirm from "../../../components/modal/Confirm";
import ShowSuccess from "../../../components/modal/result/successNotification";
import TabAttachment from "../../../components/fileViewer/TabAttachment";

export default function TabsSchedulePreventiveDocuments({
  schedulePreventiveId,
}) {
  const { t } = useTranslation();
  const [schedulePreventiveDocuments, setSchedulePreventiveDocuments] =
    useState([]);

  useEffect(() => {
    if (schedulePreventiveId) {
      fetchGetSchedulePreventiveDocumentsBySchedulePreventive();
    }
  }, [schedulePreventiveId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGetSchedulePreventiveDocumentsBySchedulePreventive = async () => {
    let res =
      await _unitOfWork.schedulePreventiveDocuments.getSchedulePreventiveDocumentBySchedulePreventive(
        { schedulePreventive: schedulePreventiveId },
      );
    if (res && res.code === 1) {
      setSchedulePreventiveDocuments(res?.schedulePreventiveDocuments);
    }
  };
  const onClickDownLoad = async (record) => {
    if (record.originFileObj && record.previewUrl) {
      window.open(record.previewUrl, "_blank");
      return;
    }
    if (record?.resource) {
      await _unitOfWork.resource.downloadImage(record?.resource?.id);
    }
  };
  const onClickDelete = async (record) => {
    let res =
      await _unitOfWork.schedulePreventiveDocuments.deleteSchedulePreventiveDocumentById(
        record?._id || record?.id,
      );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventiveSchedule.list.title"),
        t("preventive.messages.delete_success"),
      );
      fetchGetSchedulePreventiveDocumentsBySchedulePreventive();
    }
  };
  const onUploadFile = async ({ file }) => {
    if (!file) {
      message.error("preventiveSchedule.the_file_does_not_exist");
      return;
    }
    let resource = null;
    const resUpload = await _unitOfWork.resource.uploadImage({
      file: file,
    });
    if (resUpload && resUpload.code === 1) {
      resource = resUpload.resourceId;
    }
    if (!resource) {
      message.error("preventiveSchedule.file_download_failed");
      return;
    }
    const res =
      await _unitOfWork.schedulePreventiveDocuments.createSchedulePreventiveDocument(
        {
          resource,
          schedulePreventive: schedulePreventiveId,
        },
      );

    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventiveSchedule.list.title"),
        t("assetModel.common.messages.create_success"),
      );
      fetchGetSchedulePreventiveDocumentsBySchedulePreventive();
    }
  };

  const columns = [
    {
      title: t("assetModel.common.table.index"),
      dataIndex: "key",
      align: "center",
      width: "7%",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("assetModel.document.table.file"),
      dataIndex: "resource",
      align: "center",
      className: "text-left-column",
      render: (text) => {
        if (!text) return t("assetModel.common.messages.no_file");
        return (
          <a
            href={`${generateFullUrl()}/resource/image/${text.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text.fileName + text.extension}
          </a>
        );
      },
    },
    {
      title: t("assetModel.common.table.action"),
      dataIndex: "action",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <div>
          {/* <Tooltip title={t("Tải xuống")}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => onClickDownLoad(record)}
            />
          </Tooltip> */}
          <Tooltip title={t("assetModel.common.buttons.delete")}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="ml-2"
              onClick={() =>
                Comfirm(t("assetModel.common.messages.confirm_delete"), () =>
                  onClickDelete(record),
                )
              }
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="mb-3 flex " style={{ textAlign: "end" }}>
        <Upload
          customRequest={onUploadFile}
          showUploadList={false}
          accept=".pdf,.doc,.docx,.jpg,.png"
        >
          <Button type="primary" icon={<UploadOutlined />}>
            {t("purchaseQuotation.attachment.add_button")}
          </Button>
        </Upload>
      </div>

      <TabAttachment listDocuments={schedulePreventiveDocuments}
        onClickDelete={onClickDelete} />
      {/* <Table
        rowKey="id"
        columns={columns}
        dataSource={schedulePreventiveDocuments}
        bordered
        pagination={false}
      /> */}
    </div>
  );
}
