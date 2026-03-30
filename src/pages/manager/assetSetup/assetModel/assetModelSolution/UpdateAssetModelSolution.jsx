import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Card
} from "antd";
import {
  dropdownRender,
  filterOption
} from "../../../../../helper/search-select-helper";
import * as _unitOfWork from "../../../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateAssetModelSolution({
  open,
  onCancel,
  onRefresh,
  assetModel,
  assetModelSolutionChange
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [failureTypes, setFailureTypes] = useState([]);

  useEffect(() => {
    if (open) fetchFailureTypes();
  }, [open]);

  useEffect(() => {
    if (assetModelSolutionChange) {
      form.setFieldsValue({
        assetModelFailureType:
          assetModelSolutionChange.assetModelFailureType?._id,
        reasonOrigin: assetModelSolutionChange.reasonOrigin,
        solutionContent: assetModelSolutionChange.solutionContent,
        tags: assetModelSolutionChange.tags.map((t) => t.name)
      });
    }
  }, [assetModelSolutionChange]);

  const fetchFailureTypes = async () => {
    const res =
      await _unitOfWork.assetModelFailureType.getAssetModelFailureTypeUnusedsSolution(
        {
          assetModel: assetModel.id,
          ignoreIds: [
            assetModelSolutionChange.assetModelFailureType?._id
          ]
        }
      );
    if (res?.code === 1) setFailureTypes(res.data);
  };

  const handleOk = async () => {
    const values = form.getFieldsValue();
    const payload = {
      ...values,
      assetModel: assetModel.id,
      tags: (values.tags || []).map((name, i) => ({
        name,
        sortIndex: i
      }))
    };
    const res =
      await _unitOfWork.assetModelSolution.updateAssetModelSolution(
        assetModelSolutionChange._id,
        payload
      );
    if (res?.code === 1) {
      handleCancelLocal();
      onRefresh();
    }
  };

  const handleCancelLocal = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      className="custom-modal"
      onCancel={handleCancelLocal}
      closable={false}
      width={"70%"}
      footer={false}
      destroyOnClose
    >
      <Form labelWrap form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Card title={t("assetModel.solution.update_title")}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="assetModelFailureType"
                label={t("assetModel.solution.fields.failure_type")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.solution.validation.required_failure_type"
                    )
                  }
                ]}
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetModel.solution.fields.failure_type_placeholder"
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
                  placeholder={t(
                    "assetModel.solution.fields.tags_placeholder"
                  )}
                  mode="tags"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("assetModel.solution.fields.reason_origin")}
                name="reasonOrigin"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.solution.validation.required_reason_origin"
                    )
                  }
                ]}
              >
                <Input
                  placeholder={t(
                    "assetModel.solution.fields.reason_origin_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("assetModel.solution.fields.solution_content")}
                name="solutionContent"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.solution.validation.required_solution_content"
                    )
                  }
                ]}
              >
                <Input
                  placeholder={t(
                    "assetModel.solution.fields.solution_content_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <div className="modal-footer">
              <Button onClick={handleCancelLocal}>
                {t("assetModel.common.buttons.close")}
              </Button>
              <Button type="primary" onClick={handleOk}>
                {t("assetModel.common.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}