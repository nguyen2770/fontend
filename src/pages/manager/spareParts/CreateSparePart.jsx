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
  UploadOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import * as QRCode from "qrcode";
import { frequencyOptions } from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import { notiAction } from "../../../helper/noti-action-helper";

export default function CreateSparePart({ open, onClose, onFinish }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [uom, setUom] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [subCategoryInputValue, setSubCategoryInputValue] = useState("");
  const [uomInputValue, setUomInputValue] = useState("");
  const [manufacturerInputValue, setManufacturerInputValue] = useState("");

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchManufacturers();
      fetchUom();
    }
  }, [open]);

  const fetchManufacturers = async () => {
    const response = await _unitOfWork.manufacturer.getAllManufacturer();
    if (response && response.code === 1) {
      setManufacturers(
        response.data.map((item) => ({
          value: item.id,
          label: item.manufacturerName,
        })),
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

  const addSpareCategory = async (name) => {
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

    const createdSparePart = await handleCreateSparePart({ ...values });

    if (
      createdSparePart &&
      createdSparePart.sparePart.id &&
      createdSparePart.sparePart.qrCode
    ) {
      const page = `http://localhost:3000/bao-tri-tai-san/cap-nhat/${createdSparePart.sparePart.id}`;
      const url = await QRCode.toDataURL(page, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 250,
      });
      await handleUpdateSparePart(createdSparePart.sparePart.id, {
        qrCodeImage: url,
      });
    }

    if (createdSparePart) {
      message.success(t("sparePart.messages.create_success"));
      form.resetFields();
      setImageUrl(null);
      onFinish();
    }
  };

  const handleCreateSparePart = async (values) => {
    return await _unitOfWork.sparePart.createSparePart(values);
  };

  const handleUpdateSparePart = async (id, updateValues) => {
    return await _unitOfWork.sparePart.updateSparePart({
      sparePart: { id, ...updateValues },
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
          title={t("sparePart.form.create_title")}
          extra={
            <>
              <Button
                onClick={() => {
                  form.resetFields();
                  setImageUrl(null);
                  onClose();
                }}
                style={{ marginRight: "8px" }}
                icon={<CloseCircleOutlined />}
              >
                {t("common_buttons.cancel")}
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusCircleOutlined />}
              >
                {t("common_buttons.create")}
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
                            onChange={(e) =>
                              setCategoryInputValue(e.target.value)
                            }
                            placeholder={t(
                              "sparePart.form.placeholders.add_new",
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
                  options={categories.map((item) => ({
                    value: item.id,
                    label: item.spareCategoryName,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
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
                            onChange={(e) =>
                              setSubCategoryInputValue(e.target.value)
                            }
                            placeholder={t(
                              "sparePart.form.placeholders.add_new_sub_category",
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!subCategoryInputValue.trim()}
                            onClick={() =>
                              addSubCategory(subCategoryInputValue)
                            }
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
                              "sparePart.form.placeholders.add_new_unit",
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
                            onChange={(e) =>
                              setManufacturerInputValue(e.target.value)
                            }
                            placeholder={t(
                              "sparePart.form.placeholders.add_new_manufacturer",
                            )}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            disabled={!manufacturerInputValue.trim()}
                            onClick={() =>
                              addManufacturer(manufacturerInputValue)
                            }
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
              <Form.Item
                label={t("sparePart.form.fields.attachment")}
                name="resourceId"
                labelAlign="left"
              >
                <Upload
                  name="file"
                  listType="text"
                  maxCount={1}
                  accept=".png,.jpg,.jpeg"
                  customRequest={async ({ file, onSuccess, onError }) => {
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const res =
                        await _unitOfWork.resource.uploadImage(formData);
                      if (res) {
                        form.setFieldsValue({ resourceId: res.resourceId });
                        setImageUrl(URL.createObjectURL(file));
                        onSuccess("OK");
                      } else {
                        throw new Error("Upload failed");
                      }
                    } catch (err) {
                      onError(err);
                    }
                  }}
                  onRemove={() => {
                    setImageUrl(null);
                    form.setFieldsValue({ resourceId: null });
                    return true;
                  }}
                >
                  <Button icon={<UploadOutlined />}>
                    {t("sparePart.form.fields.upload_file_button")}
                  </Button>
                </Upload>
                {imageUrl && (
                  <div style={{ marginTop: 10 }}>
                    <img
                      src={imageUrl}
                      alt="preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 150,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        objectFit: "cover",
                        marginTop: 8,
                      }}
                    />
                  </div>
                )}
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
                  style={{ width: "50%", marginBottom: 0 }}
                  labelAlign="left"
                >
                  <Input
                    placeholder={t("sparePart.form.placeholders.life_span")}
                    type="number"
                  />
                </Form.Item>
                <Form.Item
                  label={t("sparePart.form.fields.period")}
                  name="Period"
                  style={{ width: "50%", marginBottom: 0 }}
                  labelAlign="left"
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
        </Card>
      </Form>
    </Modal>
  );
}
