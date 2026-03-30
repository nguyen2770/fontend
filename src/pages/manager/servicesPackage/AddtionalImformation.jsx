import { Button, Col, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

const placeholderTemplate = `
<div style="background:#3b6bb3;color:white;padding:10px;font-weight:bold;">
  QUOTATION FOR PROJECT AND MAINTENANCE WORKS
</div>

<table style="width:100%; border-collapse: collapse;" border="1">
  <tr>
    <td><strong>Customer</strong></td>
    <td>%%customer_name%%</td>
    <td><strong>Date</strong></td>
    <td>%%requested_date%%</td>
  </tr>
  <tr>
    <td><strong>Location</strong></td>
    <td>%%customer_location%%</td>
    <td><strong>Quote Ref #</strong></td>
    <td>%%amc_reference_number%%</td>
  </tr>
  <tr>
    <td><strong>Contact Person</strong></td>
    <td>%%contactperson%%</td>
    <td><strong>Mob #</strong></td>
    <td>%%customer_mobile%%</td>
  </tr>
  <tr>
    <td><strong>Quote Prepared</strong></td>
    <td>%%username%%</td>
    <td><strong>Email</strong></td>
    <td>%%customer_email%%</td>
  </tr>
  <tr>
    <td><strong>Reference</strong></td>
    <td colspan="3">%%requesttype%%</td>
  </tr>
</table>

<div>%%jobs%%</div>
`;

export default function AddtionalImformation() {
  const { t } = useTranslation();
  const [content, setContent] = useState(placeholderTemplate);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
      ["code-block"],
    ],
  };

  return (
    <div
      className="p-4"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Row gutter={32}>
        <Col span={17}>
          {/* Editor disabled */}
        </Col>
        <Col span={6}>
          <ul>
            <li>amc_reference_number</li> <li>requested_date</li>{" "}
            <li>customer_name</li> <li>customer_location</li>
            <li>customer_mobile</li> <li>customer_email jobs contactperson</li>{" "}
            <li>username</li>
          </ul>
        </Col>
      </Row>
      <Row justify="end" gutter={32} style={{ marginTop: "10px" }}>
        <Col>
          <Button>{t("servicePackage.common.buttons.cancel")}</Button>
        </Col>
        <Col style={{ marginRight: "20px" }}>
          <Button type="primary" htmlType="submit">
            {t("servicePackage.common.buttons.confirm")}
          </Button>
        </Col>
      </Row>
    </div>
  );
}