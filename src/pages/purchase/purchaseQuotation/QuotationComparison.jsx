import React, { use, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "antd";
import * as _unitOfWork from "../../../api";
import QuotationCardList from "./QuotationCardList";
import QuotationComparisonTable from "./QuotationComparisonTable";
import SelectQuotationModal from "./SelectQuotationModal";
import {
  FileOutlined,
  LeftOutlined,
  ProfileOutlined,
  SearchOutlined
} from "@ant-design/icons";
import useHeader from "../../../contexts/headerContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import useAuth from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const QuotationComparison = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [QuotationId, setQuotationId] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [modalVisible, setModalVisible] = useState(false);
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderTitle(t("purchaseQuotation.comparison.title"));
  }, [t, setHeaderTitle]);

  useEffect(() => {
    if (QuotationId.length > 0) {
      fetchData();
    }
  }, [QuotationId]);

  const fetchData = async () => {
    const results = [];
    for (const id of QuotationId) {
      const res =
        await _unitOfWork.purchaseQuotation.getPurchaseQuotation({
          id
        });
      if (res && res.code === 1) {
        results.push(res.data);
      }
    }
    setData(results);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "card" ? "table" : "card");
  };

  const handleConfirmQuotations = (selectedIds) => {
    setQuotationId(selectedIds);
  };

  return (
    <div className="m-3">
      <Row
        gutter={[16, 16]}
        align="middle"
        className="mb-1"
        justify="space-between"
      >
        <Col span={12}>
          {checkPermission(
            permissions,
            permissionCodeConstant.quotation_compare_select_quotation
          ) && (
              <Form.Item  name="code" label="">
                <Button icon={<SearchOutlined />} type="primary" onClick={() => setModalVisible(true)}>
                  {t(
                    "purchaseQuotation.comparison.buttons.select_quotation"
                  )}
                </Button>
                <Button icon={<LeftOutlined/>}  className="m-2" onClick={() => navigate(-1)}>{t("common_buttons.back")}</Button>
              </Form.Item>
            )}

        </Col>

        <Col span={12} style={{ textAlign: "right" }}>
          <Form.Item label="">
            <Button
              className="button"
              icon={
                viewMode === "card" ? <FileOutlined /> : <ProfileOutlined />
              }
              onClick={toggleViewMode}
            >
              {viewMode === "card"
                ? t(
                  "purchaseQuotation.comparison.buttons.view_attachments"
                )
                : t(
                  "purchaseQuotation.comparison.buttons.view_details"
                )}
            </Button>
          </Form.Item>
        </Col>
      </Row>

      {viewMode === "card" ? (
        <QuotationCardList data={data} />
      ) : (
        <QuotationComparisonTable quotations={data} />
      )}

      <SelectQuotationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmQuotations}
      />
    </div>
  );
};

export default QuotationComparison;