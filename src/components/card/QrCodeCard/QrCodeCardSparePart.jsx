import { EnvironmentOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "./qrCodeCard.scss";
import useAuth from "../../../contexts/authContext";
export default function QrCodeCardSparePart({ sparePartDetail, companyCode }) {
  const { user } = useAuth();
  return (
    <>
      {sparePartDetail && (
        <div className="qr-code-card-container ">
          {/* <div className="asset-maintenance-customer-name">
            {sparePartDetail?.customer?.customerName}
          </div>
          <div className="asset-maintenance-asset-name">
            {sparePartDetail?.assetModel?.asset?.assetName}
          </div>
          <div className="asset-maintenance-asset-number">
            {sparePartDetail?.assetNumber}
          </div> */}
          <div className="asset-maintenance-asset-name">
            {sparePartDetail?.sparePart?.sparePartsName}
          </div>
          {/* <div className="asset-maintenance-qrcode">
            <QRCode
              value={
                "http://192.168.1.57:3003/spare-part/spare-part-detail?qrcode=" +
                sparePartDetail.qrCode + "&sparePart=" +
                sparePartDetail.sparePart.id
              }
            // value={JSON.stringify({ sparePartDetail: sparePartDetail.id, sparePart: sparePartDetail.sparePart, qrCode: sparePartDetail.qrCode, companyCode: companyCode })}
            />
          </div> */}
          <div className="asset-maintenance-qrcode">
            <QRCode
              value={
                "https://m.medicmms.vn/create-breakdown?sparePartDetail=" +
                sparePartDetail.id +
                "&companyCode=" +
                user?.company?.code
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
