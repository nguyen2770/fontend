import { Button, Col, Divider, Row } from "antd";
import React, { useEffect, useState } from "react";
import QrCodeCard from "../../../components/card/QrCodeCard/QrCodeCard";
import SettingQrCodeModal from "../../../components/modal/SettingQrCodeModal";
import { useTranslation } from "react-i18next";
import * as _unitOfWork from "../../../api";
export default function QrCodeTab({ assetMaintenance }) {
  const { t } = useTranslation();
  const [showSetting, setShowSetting] = useState(false);
  const [assetMaintenances, setAssetMaintenances] = useState([]);

  useEffect(() => {
    fetcGetPropertyAccessoriesByAssetMaintenance();
  }, [assetMaintenance]);

  const printDiv = (divName) => {
    var win = window.open(
      "",
      "",
      "left=0,top=0,fullscreen=1,toolbar=0,scrollbars=0,status=0,titlebar=1",
    );

    var content = "<html>";
    content += `<head>
		<link rel="stylesheet" href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'/>
        <link rel="stylesheet" href='https://cmms.vn/qrcode.css'/>
		<style>
			@page { font-size: 23px;  margin: 5mm; }
			.col-form-label {
				padding-bottom: 0 !important;
				padding-top: 0 !important;
				font-weight: 700 !important;
			}
			span { font-weight: 500 !important; }
			body { font-weight: 500; padding: 20px; }
        </style>
		</head>`;
    content += '<body onload="window.print(); window.close();">';
    content += document.getElementById(divName).innerHTML;
    content += "</body>";
    content += "</html>";
    win.document.write(content);
    win.document.close();
  };
  const fetcGetPropertyAccessoriesByAssetMaintenance = async () => {
    const res =
      await _unitOfWork.assetMaintenance.getPropertyAccessoriesByAssetMaintenance(
        {
          id: assetMaintenance?.id || assetMaintenance?._id,
        },
      );
    if (res && res.data) {
      setAssetMaintenances(res.data);
    }
  };
  return (
    <>
      <Row className="mb-2">
        <Button
          type="primary"
          onClick={() => printDiv("printableArea")}
          disabled={false}
        >
          {t("assetMaintenance.actions.print_qrcode")}
        </Button>
        <Button
          className="bt-green ml-2"
          onClick={() => setShowSetting(true)}
          disabled={false}
        >
          {t("assetMaintenance.actions.setting_qrcode")}
        </Button>
      </Row>
      <Row>
        <div id="printableArea">
          <QrCodeCard assetMaintenance={assetMaintenance} />
        </div>
      </Row>
      <Divider>Danh sách mã QR thiết bị phụ</Divider>
      <Row gutter={[16, 16]}>
        {assetMaintenances.map((item) => (
          <Col span={6} key={item.id}>
            <QrCodeCard assetMaintenance={item} />
          </Col>
        ))}
      </Row>
      <SettingQrCodeModal
        open={showSetting}
        handleCancel={() => setShowSetting(false)}
      />
    </>
  );
}
