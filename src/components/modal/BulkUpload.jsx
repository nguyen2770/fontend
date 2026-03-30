import React, { useState } from "react";
import { Modal, Upload, Button, Input, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text, Link } = Typography;

const BulkUploadModal = ({ open, onCancel, onUpload, templateUrl }) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState([]);
  const [uploadNote, setUploadNote] = useState("");

  const props = {
    beforeUpload: (file) => {
      const isExcel = file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isExcel) {
        message.error(t("modal.bulkUpload.errors.only_excel"));
        return Upload.LIST_IGNORE;
      }
      if (!isLt10M) {
        message.error(t("modal.bulkUpload.errors.max_size"));
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList,
  };

  return (
    <Modal
      open={open}
      title={t("modal.bulkUpload.title")}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t("modal.bulkUpload.buttons.cancel")}
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={() => onUpload(fileList[0], uploadNote)}
          disabled={fileList.length === 0}
        >
          {t("modal.bulkUpload.buttons.upload")}
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/888/888879.png"
          alt="Excel Icon"
          width={24}
          style={{ verticalAlign: "middle", marginRight: 8 }}
        />
        <Link href={templateUrl} target="_blank">
          {t("modal.bulkUpload.download_link")}
        </Link>{" "}
        {t("modal.bulkUpload.download_suffix")}
      </div>

      <Upload.Dragger {...props} accept=".xls,.xlsx">
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">{t("modal.bulkUpload.drag_text")}</p>
        <p className="ant-upload-hint">
          {t("modal.bulkUpload.hint")}
        </p>
      </Upload.Dragger>

      <Text className="text-danger">
        * Lưu ý: Đọc kỹ ghi chú của mẫu để tránh lỗi upload
      </Text>
      <div style={{ marginTop: 12 }}>
        <Text strong>{t("modal.bulkUpload.note_label")}</Text>
        <Input
          placeholder={t("modal.bulkUpload.note_placeholder")}
          value={uploadNote}
          onChange={(e) => setUploadNote(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default BulkUploadModal;