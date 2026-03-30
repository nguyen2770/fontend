import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

const ModalReason = ({ open, onCancel, reason }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t("modal.reasonView.title")}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <p>{reason || t("modal.reasonView.empty")}</p>
    </Modal>
  );
};

export default ModalReason;