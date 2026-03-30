import React from 'react';
import { Button, Card, Modal } from 'antd';
import { formatWorkingTime } from '../../../helper/date-helper';
import { useTranslation } from 'react-i18next';

export default function ViewWorkingTime({ open, workingTime, onCancel }) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"40%"}
    >
      <Card title={t("breakdown.workingTime.title")}>
        <span
          style={{
            display: "block",
            fontSize: "2rem",
            color: "#1976d2",
            fontWeight: 700,
            margin: "24px 0",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {formatWorkingTime(workingTime?.workingTime?.time)}
        </span>
        <div style={{ textAlign: "end" }}>
          <Button onClick={onCancel}>{t("breakdown.workingTime.buttons.cancel")}</Button>
        </div>
      </Card>
    </Modal>
  );
}