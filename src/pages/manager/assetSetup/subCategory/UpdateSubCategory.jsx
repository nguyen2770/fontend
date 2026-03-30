import { Button, Card, Col, Form, Input, Modal, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../api";
import {
  filterOption,
  dropdownRender,
} from "../../../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { notiAction } from "../../../../helper/noti-action-helper";

export default function UpdateSubCategory({
  open,
  handleOk,
  handleCancel,
  id,
  onRefresh,
  categorys,
  fetchGetAllCategory,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  // const [categorys, setCategorys] = useState([]);
  const [categoryInputValue, setCategoryInputValue] = useState("");

  useEffect(() => {
    if (open && id) {
      fetchGetCategoryById();
      // fetchGetAllCategory();
    }
  }, [open, id]);

  // const fetchGetAllCategory = async () => {
  //   const res = await _unitOfWork.category.getAllCategory();
  //   if (res && res.code === 1) {
  //     setCategorys(res.data);
  //   }
  // };

  const fetchGetCategoryById = async () => {
    const res = await _unitOfWork.subCategory.getSubCategoryById({ id });
    if (res) {
      form.setFieldsValue({ ...res?.subCategory });
    }
  };

  const addCategory = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.category.createCategory({
      categoryName: name,
    });
    notiAction(t, response);
    if (response) {
      fetchGetAllCategory();
      setCategoryInputValue("");
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.subCategory.updateSubCategory({
      subCategory: {
        id,
        ...form.getFieldsValue(),
      },
    });
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
    }
  };

  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      closable={false}
      className="custom-modal"
      footer={false}
      destroyOnClose
      width={"40%"}
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
        <Card title={t("subCategory.form.update_title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="categoryId"
                label={t("subCategory.form.fields.parent")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("subCategory.form.validation.required_parent"),
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder={t("subCategory.form.fields.parent_placeholder")}
                  showSearch
                  options={categorys.map((item) => ({
                    value: item.id,
                    label: item.categoryName,
                  }))}
                  filterOption={filterOption}
                  // dropdownStyle={dropdownRender}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ padding: 8 }}>
                        <Space>
                          <Input
                            maxLength={250}
                            value={categoryInputValue}
                            onChange={(e) => setCategoryInputValue(e.target.value)}
                            placeholder={t(
                              "assetModel.model.fields.add_new"
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!categoryInputValue.trim()}
                            onClick={() => addCategory(categoryInputValue)}
                          />
                          <div>{`${categoryInputValue.length}/250`}</div>
                        </Space>
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="subCategoryName"
                label={t("subCategory.form.fields.name")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("subCategory.form.validation.required_name"),
                  },
                ]}
              >
                <Input
                  placeholder={t("subCategory.form.fields.name_placeholder")}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button onClick={onCancel}>
                <CloseCircleOutlined />
                {t("subCategory.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined /> {t("subCategory.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
