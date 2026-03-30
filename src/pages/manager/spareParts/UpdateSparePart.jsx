import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  PlusOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  InboxOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import { frequencyOptions } from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import { notiAction } from "../../../helper/noti-action-helper";

export default function UpdateSparePart({ id, open, onClose, onFinish }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uom, setUom] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [subCategoryInputValue, setSubCategoryInputValue] = useState("");
  const [uomInputValue, setUomInputValue] = useState("");
  const [manufacturerInputValue, setManufacturerInputValue] = useState("");

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchSparePartById(id);
      fetchManufacturers();
      fetchUom();
    }
  }, [open, id]);

  const fetchSparePartById = async (id) => {
    try {
      const res = await _unitOfWork.sparePart.getSparePartById({ id });
      if (res) {
        onChangeCategory(res?.sparePart?.spareCategoryId?.id);
        form.setFieldsValue({
          ...res?.sparePart,
          spareCategoryId: res?.sparePart?.spareCategoryId?.id,
          spareSubCategoryId: res?.sparePart?.spareSubCategoryId?.id,
          manufacturer: res?.sparePart?.manufacturer?.id,
          uomId: res?.sparePart?.uomId?.id,
        });
        if (res?.sparePart?.resourceId) {
          setFileList([
            {
              uid: res?.sparePart?.sparePart?.resourceId,
              url: _unitOfWork.resource.getImage(res?.sparePart?.resourceId),
              supportDocumentId: res?.sparePart?.resourceId,
              name: "Ảnh phụ tùng",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch spare part:", error);
    }
  };

  const fetchManufacturers = async () => {
    const response = await _unitOfWork.manufacturer.getAllManufacturer();
    if (response && response.code === 1) {
      setManufacturers(
        response.data.map((item) => ({
          value: item.id,
          label: item.manufacturerName,
        }))
      );
    }
  };

  const onChangeCategory = async (categoryId) => {
    const response = await _unitOfWork.spareSubCategory.getBySpareCategoryId({
      categoryId,
    });
    if (response && response.code === 1) {
      setSubCategories(response.data);
    }
  };

  const addCategory = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.spareCategory.createSpareCategory({
      spareCategoryName: name,
    });
    notiAction(t, response);
    if (response) {
      fetchCategories();
      setCategoryInputValue("");
    }
  };

  const addSubCategory = async (name) => {
    if (!name || !name.trim() || !form.getFieldValue("spareCategoryId")) return;
    const response = await _unitOfWork.spareSubCategory.createSpareSubCategory({
      spareSubCategoryName: name,
      spareCategory: form.getFieldValue("spareCategoryId"),
    });
    notiAction(t, response);
    if (response) {
      const categoryId = form.getFieldValue("spareCategoryId");
      const subResponse =
        await _unitOfWork.spareSubCategory.getBySpareCategoryId({ categoryId });
      setSubCategories(subResponse.data);
      setSubCategoryInputValue("");
    }
  };

  const addUom = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.uom.createUom({
      name: name,
      uomName: name,
    });
    notiAction(t, response);
    if (response && response.code === 1) {
      fetchUom();
      setUomInputValue("");
    }
  };

  const addManufacturer = async (name) => {
    if (!name || !name.trim()) return;
    const response = await _unitOfWork.manufacturer.createManufacturer({
      name: name,
      manufacturerName: name,
    });
    notiAction(t, response);
    if (response && response.code === 1) {
      fetchManufacturers();
      setManufacturerInputValue("");
    }
  };

  const fetchCategories = async () => {
    const res = await _unitOfWork.spareCategory.getAllSpareCategories();
    if (res) {
      setCategories(res?.data);
    }
  };

  const fetchUom = async () => {
    const res = await _unitOfWork.uom.getAllUom();
    if (res && res.code === 1) {
      setUom(res.data);
    }
  };

  const handleSubmit = async () => {
    const values = await form.getFieldsValue();
    if (values) {
      if (values.lifeSpan && values.Period) {
        let unitMs = 0;

        switch (values.Period) {
          case 1: // ngày
            unitMs = 24 * 60 * 60 * 1000;
            break;
          case 2: // tuần
            unitMs = 7 * 24 * 60 * 60 * 1000;
            break;
          case 3: // tháng
            unitMs = 30 * 24 * 60 * 60 * 1000;
            break;
          case 4: // năm
            unitMs = 365 * 24 * 60 * 60 * 1000;
            break;
          default:
            unitMs = 0;
        }

        values.cycleMiles = values.lifeSpan * unitMs;
      }

      const sparePart = await handleUpdateSparePart({ ...values });
      if (sparePart) {
        message.success(t("sparePart.messages.update_success"));
        form.resetFields();
        setFileList([]);
        onFinish();
      }
    }
  };

  const handleUpdateSparePart = async (values) => {
    return await _unitOfWork.sparePart.updateSparePart({
      sparePart: { ...values, id },
    });
  };

  return (
    <Modal
      open={open}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"80%"}
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
        onFinish={handleSubmit}
      >
        <Card
          title={t("sparePart.form.update_title")}
          extra={
            <>
              <Button
                onClick={() => {
                  form.resetFields();
                  setFileList([]);
                  onClose();
                }}
                style={{ marginRight: "8px" }}
                icon={<CloseCircleOutlined />}
              >
                {t("common_buttons.cancel")}
              </Button>

              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {t("sparePart.form.buttons.save")}
              </Button>
            </>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.category_main")}
                name="spareCategoryId"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("sparePart.validation.required_category_main"),
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("sparePart.form.placeholders.category_main")}
                  onChange={(value) => {
                    onChangeCategory(value);
                    form.setFieldsValue({ spareSubCategoryId: null });
                  }}
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
                              "sparePart.form.placeholders.add_new_category"
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
                  options={categories.map((item) => ({
                    value: item.id,
                    label: item.spareCategoryName,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.category_sub")}
                name="spareSubCategoryId"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("sparePart.validation.required_category_sub"),
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("sparePart.form.placeholders.category_sub")}
                  disabled={!form.getFieldValue("spareCategoryId")}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ padding: 8 }}>
                        <Space>
                          <Input
                            maxLength={250}
                            value={subCategoryInputValue}
                            onChange={(e) => setSubCategoryInputValue(e.target.value)}
                            placeholder={t(
                              "sparePart.form.placeholders.add_new_sub_category"
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!subCategoryInputValue.trim()}
                            onClick={() => addSubCategory(subCategoryInputValue)}
                          />
                          <div>{`${subCategoryInputValue.length}/250`}</div>
                        </Space>
                      </div>
                    </>
                  )}
                  options={subCategories.map((item) => ({
                    value: item.id,
                    label: item.spareSubCategoryName,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.name")}
                name="sparePartsName"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("sparePart.validation.required_name"),
                  },
                ]}
              >
                <Input
                  placeholder={t("sparePart.form.placeholders.name")}
                  maxLength={250}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.uom")}
                name="uomId"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("sparePart.validation.required_uom"),
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("sparePart.form.placeholders.uom")}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ padding: 8 }}>
                        <Space>
                          <Input
                            maxLength={250}
                            value={uomInputValue}
                            onChange={(e) => setUomInputValue(e.target.value)}
                            placeholder={t(
                              "sparePart.form.placeholders.add_new_unit"
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!uomInputValue.trim()}
                            onClick={() => addUom(uomInputValue)}
                          />
                          <div>{`${uomInputValue.length}/250`}</div>
                        </Space>
                      </div>
                    </>
                  )}
                  options={uom.map((item) => ({
                    value: item.id,
                    label: item.uomName,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.code")}
                name="code"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("sparePart.validation.required_code"),
                  },
                ]}
              >
                <Input placeholder={t("sparePart.form.placeholders.code")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.manufacturer")}
                name="manufacturer"
                labelAlign="left"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("sparePart.form.placeholders.manufacturer")}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ padding: 8 }}>
                        <Space>
                          <Input
                            maxLength={250}
                            value={manufacturerInputValue}
                            onChange={(e) => setManufacturerInputValue(e.target.value)}
                            placeholder={t(
                              "sparePart.form.placeholders.add_new_manufacturer"
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!manufacturerInputValue.trim()}
                            onClick={() => addManufacturer(manufacturerInputValue)}
                          />
                          <div>{`${manufacturerInputValue.length}/250`}</div>
                        </Space>
                      </div>
                    </>
                  )}
                  options={manufacturers}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.description")}
                name="description"
                labelAlign="left"
              >
                <Input.TextArea
                  placeholder={t("sparePart.form.placeholders.description")}
                  rows={1}
                />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                label={t("sparePart.form.fields.qr_code")}
                name="qrCode"
                labelAlign="left"
              >
                <Input placeholder={t("sparePart.form.placeholders.qr_code")} />
              </Form.Item>
            </Col> */}
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="resourceId" hidden labelAlign="left">
                <Input />
              </Form.Item>
              <Form.Item
                label={t("sparePart.form.fields.image")}
                name="Image"
                labelAlign="left"
              >
                <Upload
                  name="file"
                  accept=".png,.jpg,.jpeg"
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList: newList }) =>
                    setFileList(newList.slice(-1))
                  }
                  beforeUpload={(file) => {
                    const isImage = [
                      "image/png",
                      "image/jpeg",
                      "image/jpg",
                    ].includes(file.type);
                    if (!isImage)
                      message.error(
                        t("sparePart.messages.upload_invalid_type")
                      );
                    return isImage || Upload.LIST_IGNORE;
                  }}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await _unitOfWork.resource.uploadImage(
                        formData
                      );
                      if (res) {
                        form.setFieldsValue({ resourceId: res.resourceId });
                        setFileList([{ ...file, url: res.url }]);
                        onSuccess(t("sparePart.messages.upload_success"));
                      } else throw new Error("Upload failed");
                    } catch (err) {
                      onError(t("sparePart.messages.upload_error"));
                    }
                  }}
                  onRemove={() => {
                    setFileList([]);
                    form.setFieldsValue({ resourceId: null });
                    return true;
                  }}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <InboxOutlined style={{ fontSize: 24 }} />
                    </div>
                  )}
                </Upload>
                <p>
                  PNG, JPG, JPEG. {t("sparePart.messages.upload_invalid_type")}
                </p>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ display: "flex", gap: 8 }}>
                <Form.Item
                  label={t("sparePart.form.fields.life_span")}
                  name="lifeSpan"
                  labelAlign="left"
                  style={{ width: "50%", marginBottom: 0 }}
                >
                  <Input
                    placeholder={t("sparePart.form.placeholders.life_span")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("sparePart.form.fields.period")}
                  name="Period"
                  labelAlign="left"
                  style={{ width: "50%", marginBottom: 0 }}
                >
                  <Select
                    placeholder={t("sparePart.form.placeholders.period")}
                    options={(frequencyOptions.Option || []).map((item) => ({
                      key: item.value,
                      value: item.value,
                      label: item.label,
                    }))}
                  />
                </Form.Item>
              </div>
              <b>{t("sparePart.form.fields.note_usage")}: </b>{" "}
              {t("sparePart.form.note_text")}
            </Col>
          </Row>

          <Divider />
        </Card>
      </Form>
    </Modal>
  );
}
