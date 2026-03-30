import { Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../../api";
import {
  dropdownRender,
  filterOption
} from "../../../../../helper/search-select-helper";
import { answerTypeSeftDiagnosia } from "../../../../../utils/constant";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function UpdateAssetModelSeftDiagnosia({
  open,
  handleOk,
  handleCancel,
  onRefresh,
  assetModel,
  assetModelSeftDiagnosiaChange
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const answerType = Form.useWatch("answerType", form);
  const [answers, setAnswers] = useState([]);
  const [failureTypes, setFailureTypes] = useState([]);

  useEffect(() => {
    if (open) fetchFailureTypes();
  }, [open]);

  useEffect(() => {
    if (assetModelSeftDiagnosiaChange) {
      fetchDetail();
      form.setFieldsValue({
        assetModelFailureType:
          assetModelSeftDiagnosiaChange.assetModelFailureType?._id ||
          assetModelSeftDiagnosiaChange.assetModelFailureType?.id,
        question: assetModelSeftDiagnosiaChange.question,
        answerType: assetModelSeftDiagnosiaChange.answerType,
        tags: assetModelSeftDiagnosiaChange.tags.map((t) => t.name)
      });
    }
  }, [assetModelSeftDiagnosiaChange]);

  const fetchFailureTypes = async () => {
    const res =
      await _unitOfWork.assetModelFailureType.getAssetModelFailureTypeUnusedsSeftDiagnosia(
        {
          assetModel: assetModel.id,
          ignoreIds: [assetModelSeftDiagnosiaChange.assetModelFailureType]
        }
      );
    if (res?.code === 1) setFailureTypes(res.data);
  };

  const fetchDetail = async () => {
    const res =
      await _unitOfWork.assetModelSeftDiagnosia.getAssetModelSeftDiagnosiaById(
        assetModelSeftDiagnosiaChange._id
      );
    if (res?.code === 1) {
      setAnswers(res.data.values || []);
    }
  };

  const onAddAnswer = () => {
    setAnswers((prev) => [...prev, {}]);
  };

  const onRemoveAnswer = (idx) => {
    setAnswers((prev) => prev.filter((_, i) => i !== idx));
  };

  const onChangeAnswer = (key, idx, value) => {
    setAnswers((prev) => {
      const clone = [...prev];
      clone[idx][key] = value;
      return clone;
    });
  };

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const payload = {
      ...values,
      assetModel: assetModel.id,
      tags: (values.tags || []).map((name, i) => ({
        name,
        sortIndex: i
      })),
      assetModelSeftDiagnosiaAnswerValues: answers
    };
    const res =
      await _unitOfWork.assetModelSeftDiagnosia.updateAssetModelSeftDiagnosia(
        assetModelSeftDiagnosiaChange._id,
        payload
      );
    if (res?.code === 1) {
      handleCancelLocal();
      onRefresh();
    }
  };

  const handleCancelLocal = () => {
    handleCancel();
    setAnswers([]);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      closable={false}
      footer={false}
      className="custom-modal"
      width={"70%"}
      destroyOnClose
    >
      <Form labelWrap form={form} onFinish={onFinish} layout="vertical">
        <Card title={t("assetModel.self_diagnosis.update_title")}>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="assetModelFailureType"
                label={t(
                  "assetModel.self_diagnosis.fields.failure_type"
                )}
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.self_diagnosis.validation.required_failure_type"
                    )
                  }
                ]}
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetModel.self_diagnosis.fields.failure_type_placeholder"
                  )}
                  showSearch
                  options={failureTypes.map((f) => ({
                    value: f.id,
                    label: f.name
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="tags" label={t("assetModel.common.labels.tags")}>
                <Select
                  allowClear
                  mode="tags"
                  placeholder={t(
                    "assetModel.self_diagnosis.fields.tags_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={18}>
              <Form.Item
                name="question"
                label={t("assetModel.self_diagnosis.fields.question")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.self_diagnosis.validation.required_question"
                    )
                  }
                ]}
              >
                <Input
                  placeholder={t(
                    "assetModel.self_diagnosis.fields.question_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="answerType"
                label={t(
                  "assetModel.self_diagnosis.fields.answer_type"
                )}
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.self_diagnosis.validation.required_answer"
                    )
                  }
                ]}
              >
                <Select
                  placeholder={t(
                    "assetModel.self_diagnosis.fields.answer_type_placeholder"
                  )}
                  options={answerTypeSeftDiagnosia.options.map(opt => ({
                    ...opt,
                    label: t(opt.label),
                  }))}
                />
              </Form.Item>
            </Col>
            {answerType && (
              <Col span={2}>
                <Tooltip
                  title={t(
                    "assetModel.self_diagnosis.fields.add_answer"
                  )}
                >
                  <Button
                    onClick={onAddAnswer}
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                  />
                </Tooltip>
              </Col>
            )}
          </Row>
          <Divider orientation="left">
            {t("assetModel.self_diagnosis.fields.answers_section")}
          </Divider>
          {answers.map((item, idx) => (
            <Row gutter={12} key={idx}>
              {answerType && (
                <>
                  <Col
                    span={
                      answerType === answerTypeSeftDiagnosia.option
                        ? 22
                        : 11
                    }
                  >
                    <Form.Item
                      required
                      rules={[
                        {
                          required: true,
                          message: t(
                            "assetModel.self_diagnosis.validation.required_answer"
                          )
                        }
                      ]}
                    >
                      <Input
                        placeholder={t(
                          "assetModel.self_diagnosis.fields.answer_value"
                        )}
                        value={item.value1}
                        onChange={(e) =>
                          onChangeAnswer("value1", idx, e.target.value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  {answerType ===
                    answerTypeSeftDiagnosia.range && (
                      <Col span={11}>
                        <Form.Item
                          required
                          rules={[
                            {
                              required: true,
                              message: t(
                                "assetModel.self_diagnosis.validation.required_answer"
                              )
                            }
                          ]}
                        >
                          <Input
                            placeholder={t(
                              "assetModel.self_diagnosis.fields.answer_range_to"
                            )}
                            value={item.value2}
                            onChange={(e) =>
                              onChangeAnswer("value2", idx, e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                    )}
                  <Col span={2}>
                    <Tooltip
                      title={t(
                        "assetModel.self_diagnosis.fields.delete_answer_tooltip"
                      )}
                    >
                      <Button
                        onClick={() => onRemoveAnswer(idx)}
                        type="primary"
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Col>
                </>
              )}
            </Row>
          ))}
          <Row>
            <div className="modal-footer">
              <Button onClick={handleCancelLocal}>
                {t("assetModel.common.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                {t("assetModel.common.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}