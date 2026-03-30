import { Button, Card, Col, Form, Input, Modal, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { filterOption } from "../../../helper/search-select-helper";
import { notiAction } from "../../../helper/noti-action-helper";

export default function CreateSpareSubCategory({
  open,
  handleOk,
  handleCancel,
  spareCategories,
  fetchSpareCategories
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  // const [spareCategories, setSpareCategories] = useState([]);
  const [categoryInputValue, setCategoryInputValue] = useState("");

  // useEffect(() => {
  //   if (open) {
  //     fetchGetAllSpareCategory();
  //   }
  // }, [open]);

  const onFinish = async () => {
    const payload = {
      ...form.getFieldsValue(),
    };
    const res = await _unitOfWork.spareSubCategory.createSpareSubCategory(
      payload
    );
    if (res) {
      form.resetFields();
      handleOk();
    }
  };

  // const fetchGetAllSpareCategory = async () => {
  //   const res = await _unitOfWork.spareCategory.getAllSpareCategories();
  //   if (res) {
  //     setSpareCategories(res?.data);
  //   }
  // };

  const addSpareCategory = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.spareCategory.createSpareCategory({
      spareCategoryName: name,
    });
    notiAction(t, response);
    if (response) {
      fetchSpareCategories();
      setCategoryInputValue("");
    }
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"40%"}
    >
      <Form
labelWrap
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Card title={t("spareSubCategory.create.title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="spareCategory"
                label={t("spareSubCategory.form.fields.parent")}
                labelAlign="left"
              >
                <Select
                  allowClear
                  placeholder={t("spareSubCategory.form.placeholders.parent")}
                  showSearch
                  options={(spareCategories || []).map((item) => ({
                    value: item.id,
                    label: item.spareCategoryName,
                  }))}
                  filterOption={filterOption}
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
                              "sparePart.form.placeholders.add_new"
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!categoryInputValue.trim()}
                            onClick={() => addSpareCategory(categoryInputValue)}
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
                name="spareSubCategoryName"
                label={t("spareSubCategory.form.fields.sub")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("spareSubCategory.validation.required_sub"),
                  },
                ]}
              >
                <Input
                  placeholder={t("spareSubCategory.form.placeholders.sub")}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
                <CloseCircleOutlined /> {t("common_buttons.cancel")}
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() =>
                  Confirm(t("spareSubCategory.create.confirm"), () =>
                    onFinish()
                  )
                }
              >
                <PlusCircleOutlined />{" "}
                {t("spareSubCategory.form.buttons.submit_create")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
