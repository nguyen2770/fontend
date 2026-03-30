import React, { useRef } from "react";
import { Button, Table, message, Tooltip } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import * as _unitOfWork from "../../../api";
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".json"];

export default function AttachmentModel({
  value = [],
  onChange,
  maxSizeMB = 100,
  notSize,
  notDelete,
  noCreate,
}) {
  const { t } = useTranslation();
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    let newFileList = [...value];
    for (let file of files) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        message.error(
          t("modal.attachmentUpload.messages.file_too_large", {
            name: file.name,
            max: maxSizeMB,
          })
        );
        continue;
      }
      const src = await toBase64(file);
      const previewUrl = URL.createObjectURL(file);
      await new Promise(resolve => setTimeout(resolve, 1000))
      newFileList.push({
        ...file,
        uid: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file,
        src,
        previewUrl
      });
    }
    if (onChange) onChange(newFileList);
    e.target.value = "";
  };

  const handleRemove = (idx) => {
    if (onChange) onChange(value.filter((_, i) => i !== idx));
  };

  const handleDownload = async (file) => {
    if (file.originFileObj) {
      // Nếu là file mới upload (có originFileObj)
      const url = file.src;
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file.src) {
      if (
        file.extension &&
        imageExtensions.includes(file.extension.toLowerCase())
      ) {
        const blob = await _unitOfWork.resource.downloadImage(
          file?.resource?.id
        );
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file?.name;
          a.click();

          URL.revokeObjectURL(url);
        }
      } else {
        // Không phải ảnh → tải về
        const link = document.createElement("a");
        link.href = file.src;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePreview = async (record) => {
    // File mới upload
    if (record.originFileObj && record.previewUrl) {
      window.open(record.previewUrl, "_blank");
      return;
    }

    // File từ backend – ảnh
    if (
      record.extension &&
      imageExtensions.includes(record.extension.toLowerCase())
    ) {
      const blob = await _unitOfWork.resource.downloadImage(
        record?.resource?.id
      );
      if (blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
      return;
    }

    // File thường (pdf, doc, ...)
    if (record.src) {
      window.open(record.src, "_blank");
    }
  };


  const columns = [
    {
      title: t("modal.attachmentUpload.table.index"),
      dataIndex: "index",
      align: "center",
      width: "7vw",
      render: (_, __, idx) => idx + 1,
    },
    {
      title: (
        <>
          <PaperClipOutlined /> {t("modal.attachmentUpload.table.name")}
        </>
      ),
      dataIndex: "name",
    },
    ...(notSize
      ? []
      : [
        {
          title: t("modal.attachmentUpload.table.size"),
          dataIndex: "size",
          width: "15vw",
          render: (size) => `${(size / 1024).toFixed(1)} KB`,
        },
      ]),
    {
      title: t("modal.attachmentUpload.table.action"),
      dataIndex: "action",
      width: "10vw",
      align: "center",
      render: (_, record, idx) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Tooltip title="Xem">
            <Button
              style={{ color: "#39910e" }}
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            >

            </Button>
          </Tooltip>
          <Tooltip title={t("common_buttons.down_load") || "Tải về"}>
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              size="small"
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          {!notDelete && (
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
              onClick={() => handleRemove(idx)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mb-4">
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}
      >
        {!noCreate && (
          <Button
            icon={<PlusOutlined />}
            onClick={() => inputRef.current.click()}
            style={{ marginBottom: 12 }}
            type="primary"
          >
            {t("modal.attachmentUpload.add_button")}
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Table
        columns={columns}
        dataSource={value}
        rowKey="uid"
        pagination={false}
        size="small"
        locale={{ emptyText: t("modal.attachmentUpload.table.empty") }}
      />
    </div>
  );
}
