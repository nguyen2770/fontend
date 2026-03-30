import { EnvironmentOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import * as _unitOfWork from "../../../api";
import QrCodeCard from "../../../components/card/QrCodeCard/QrCodeCard";
export default function QrCodeTemplateSetting({ assetMaintenance }) {
    return (
        <>
            <Row>
                <Col span={6}>
                    <QrCodeCard assetMaintenance={assetMaintenance} /></Col>
            </Row>
        </>
    );
}
