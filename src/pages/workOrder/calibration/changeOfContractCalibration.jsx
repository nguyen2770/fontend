import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  Card,
  Button,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import { filterOption } from "../../../helper/search-select-helper";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";

export default function ChangeOfContractCalibration() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [calibrationContracts, setCalibrationContracts] = useState([]);

  useEffect(() => {
    fetchGetCalibrationById();
  }, []);

  const fetchGetCalibrationById = async () => {
    let res = await _unitOfWork.calibration.getCalibrationById({
      id: params?.id,
    });
    if (res && res.code === 1) {
      form.setFieldsValue({
        ...res?.calibration,
      });
      setCalibrationContracts(res?.calibrationContracts || []);
    }
  };
  const onFinish = async () => {
    const values = form.getFieldsValue();
    const payload = {
      id: params?.id,
      calibrationContract: values?.calibrationContract,
    };
    const res = await _unitOfWork.calibration.changeOfContractCalibration(payload);
    if (res && res.code === 1) {
      ShowSuccess(t("calibration.change_contract_success"));
      navigate(-1);
    } else {
      ShowError(t("calibration.change_contract_failed"));
    }
  };
  return (
    <Form
      layout="horizontal"
      form={form}
      labelCol={{
        span: 9,
      }}
      wrapperCol={{
        span: 15,
      }}
      onFinish={onFinish}
      style={{ padding: "15px" }}
    >
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px #f0f1f2",
        }}
        bodyStyle={{ padding: 32 }}
        extra={
          <>
            <Button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>
              <LeftOutlined />
              {t("common_buttons.back")}
            </Button>
            <Button type="primary" htmlType="submit">
              <SaveOutlined />
              {t("common_buttons.update")}
            </Button>
          </>
        }
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label={t("preventive.form.contract")}
              name="calibrationContract"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: t("calibration.please_select_a_contract"),
                },
              ]}
            >
              <Select
                placeholder={t("preventive.form.contract_placeholder")}
                showSearch
                allowClear
                options={(calibrationContracts || []).map((item) => ({
                  value: item?.id,
                  label: item?.contractNo,
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
}
