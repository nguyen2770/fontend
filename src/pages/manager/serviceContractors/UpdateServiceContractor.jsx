import { Button, Card, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateServiceContractor({
  serviceContractor,
  open,
  handleOk,
  handleCancel,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    if (open) {
      fetchAllProvince();
    }
  }, [open]);

  useEffect(() => {
    if (!serviceContractor || !provinces.length) return;

    const selectedProvince = provinces.find(
      (item) => String(item.value) === String(serviceContractor?.province)
    );

    if (selectedProvince) {
      fetchAllCommunesByProvince(selectedProvince.data.id);
    }

    form.setFieldsValue({
      ...serviceContractor,
    });
  }, [serviceContractor, provinces]);

  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue(),
    };
    let res = await _unitOfWork.serviceContractor.update(
      serviceContractor.id,
      payload
    );
    if (res && res.code === 1) {
      form.resetFields();
      handleOk();
    }
  };

  const onClickCancel = () => {
    handleCancel();
  };

  const fetchAllCommunesByProvince = async (id) => {
    const res = await _unitOfWork.geography.getAllCommunesByProvince({ id });
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.name,
        value: item.id,
        data: item,
      }));
      setCommunes(options);
    }
  };

  const fetchAllProvince = async () => {
    const res = await _unitOfWork.geography.getAllProvinces();
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.name,
        value: item.id,
        data: item,
      }));
      setProvinces(options);
    }
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      width={"60%"}
      closable={false}
      className="custom-modal"
      footer={false}
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Card title={t("serviceContractor.update.title")}>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                id="spareSubCategoryName"
                name="serviceContractorName"
                label={t("serviceContractor.common.labels.name")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t(
                      "serviceContractor.common.messages.name_required"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={t("serviceContractor.common.placeholders.name")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label={t("serviceContractor.common.labels.contact_person")}
                labelAlign="left"
              >
                <Input
                  placeholder={t(
                    "serviceContractor.common.placeholders.contact_person"
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label={t("serviceContractor.common.labels.email")}
                labelAlign="left"
              >
                <Input
                  placeholder={t("serviceContractor.common.placeholders.email")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhoneNumber"
                label={t("serviceContractor.common.labels.phone")}
                labelAlign="left"
              >
                <Input
                  placeholder={t("serviceContractor.common.placeholders.phone")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name="address"
                label={t("serviceContractor.common.labels.address")}
                labelAlign="left"
              >
                <Input
                  placeholder={t(
                    "serviceContractor.common.placeholders.address"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="zipCode"
                label={t("serviceContractor.common.labels.zipCode")}
                labelAlign="left"
              >
                <Input
                  placeholder={t(
                    "serviceContractor.common.placeholders.zipCode"
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name="province"
                label={t("serviceContractor.common.labels.province")}
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "serviceContractor.common.placeholders.province"
                  )}
                  options={provinces}
                  onChange={(value) => {
                    form.setFieldsValue({ commune: null });
                    setCommunes([]);
                    fetchAllCommunesByProvince(value);
                  }}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="commune"
                label={t("serviceContractor.common.labels.commune")}
                labelAlign="left"
              >
                <Select
                  placeholder={t(
                    "serviceContractor.common.placeholders.commune"
                  )}
                  options={communes}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <div className="modal-footer">
              <Button key="back" onClick={onClickCancel}>
                {t("serviceContractor.common.buttons.cancel")}
              </Button>
              <Button key="button" type="primary" htmlType="submit">
                {t("serviceContractor.common.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
