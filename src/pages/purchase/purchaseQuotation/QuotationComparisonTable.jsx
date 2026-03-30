import React, { useEffect, useState } from "react";
import QuotationAttachment from "./QuotationAttachment";
import * as _unitOfWork from "../../../api";
import { Card, Typography, Row, Col } from "antd";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const QuotationComparisonTable = ({ quotations }) => {
  const { t } = useTranslation();
  const [attachmentMap, setAttachmentMap] = useState({});

  useEffect(() => {
    const fetchAttachments = async () => {
      const map = {};
      for (const q of quotations) {
        const res =
          await _unitOfWork.purchaseQuotation.getQuotationAttachmentByQuotation(
            { id: q._id }
          );
        if (res?.data) {
          map[q._id] = res.data;
        }
      }
      setAttachmentMap(map);
    };
    fetchAttachments();
  }, [quotations]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        {quotations.map((quotation) => (
          <Col span={24} key={quotation._id}>
            <Card
              title={
                <Title level={4} style={{ margin: 0 }}>
                  {t(
                    "purchaseQuotation.comparison.section.attachments_title"
                  )}
                  : {quotation.supplierName || quotation.code}
                </Title>
              }
              bordered
              style={{ width: "100%" }}
            >
              <QuotationAttachment
                attachments={attachmentMap[quotation._id] || []}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuotationComparisonTable;