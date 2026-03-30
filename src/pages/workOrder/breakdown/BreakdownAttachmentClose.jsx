import React, { useRef } from "react";
import { Button, Table, Input, message, Tooltip } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function BreakdownAttachmentClose({
  value = [],
  onChange,
  maxSizeMB = 10,
}) {
  const { t } = useTranslation();
  const fileInputRefs = useRef({});

  const handleAddRow = () => {
    const newList = [
      ...value,
      {
        uid: `${Date.now()}`,
        name: "",
        size: 0,
        type: "",
        src: "",
        originFileObj: null,
        position: "",
      },
    ];
    onChange?.(newList);
  };

  const handleRemove = (index) => {
    const newList = [...value];
    newList.splice(index, 1);
    onChange?.(newList);
  };

  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      message.error(
        t("breakdown.attachment.errors.file_exceed", {
          name: file.name,
          max: maxSizeMB,
        })
      );
      return;
    }

    const src = await toBase64(file);
    const newList = [...value];
    newList[index] = {
      ...newList[index],
      name: file.name,
      size: file.size,
      type: file.type,
      src,
      originFileObj: file,
    };
    onChange?.(newList);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const columns = [
    {
      title: t("breakdown.attachment.columns.index"),
      render: (_, __, index) => index + 1,
      width: 50,
      align: "center",
    },
    {
      title: t("breakdown.attachment.columns.position"),
      dataIndex: "position",
      render: (text, record, index) => (
        <Input
          placeholder={t("breakdown.attachment.placeholders.position")}
          value={text}
          onChange={(e) => {
            const newList = [...value];
            newList[index].position = e.target.value;
            onChange?.(newList);
          }}
          status={!text?.trim() ? "error" : ""}
        />
      ),
    },
    {
      title: t("breakdown.attachment.columns.file"),
      render: (_, record, index) => (
        <>
          <input
            type="file"
            style={{ display: "none" }}
            ref={(el) => (fileInputRefs.current[record.uid] = el)}
            onChange={(e) => handleFileChange(e, index)}
          />
          <Button
            icon={<UploadOutlined />}
            onClick={() => fileInputRefs.current[record.uid]?.click()}
            size="small"
          >
            {t("breakdown.close.fields.attachments_file")}
          </Button>
        </>
      ),
    },
    {
      title: (
        <>
          <PaperClipOutlined /> {t("breakdown.attachment.columns.name")}
        </>
      ),
      dataIndex: "name",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ wordBreak: "break-all" }}>{text || "---"}</span>
        </Tooltip>
      ),
    },
    {
      title: t("breakdown.attachment.columns.size"),
      dataIndex: "size",
      width: 120,
      render: (size) => (size ? `${(size / 1024).toFixed(1)} KB` : "---"),
    },
    {
      title: t("breakdown.attachment.columns.action"),
      width: 100,
      align: "center",
      render: (_, __, index) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          size="small"
          onClick={() => handleRemove(index)}
        />
      ),
    },
  ];

  return (
    <div className="mb-4">
      <div style={{ textAlign: "right", marginBottom: 12 }}>
        <Button icon={<PlusOutlined />} onClick={handleAddRow} type="primary">
          {t("breakdown.attachment.add_row")}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={value}
        rowKey="uid"
        pagination={false}
        size="small"
        locale={{ emptyText: t("breakdown.attachment.empty") }}
      />
    </div>
  );
}