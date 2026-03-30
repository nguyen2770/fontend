import React from "react";
import { Button, Image } from "antd";
import configError from "../../assets/images/configError.png";
import "./index.scss";
import { CloseOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const LogConfigError = ({ configErrors }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Image
        src={configError}
        alt="config-error"
        preview={false}
        style={{ width: "100vw", height: "100vh" }}
      />
      <Button
        className="btn-close"
        onClick={() => window.location.reload()}
      >
        <CloseOutlined />
      </Button>
      <div className="config-error">
        <p className="text-title">{t("modal.configError.title")}</p>
        <p className="text">{t("modal.configError.maintaining")}</p>
        <p className="text">{t("modal.configError.system")}</p>
        <p className="text-phone">
          <PhoneOutlined /> +84 852 391 816
        </p>
        <p className="text-discription">{configErrors.discription}</p>
        <p className="text-end">{t("modal.configError.end_line")}</p>
      </div>
    </div>
  );
};
export default LogConfigError;