import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  Upload,
  Typography,
  Radio,
  Button,
  message,
  Card,
} from "antd";
import {
  CloseCircleFilled,
  EnvironmentOutlined,
  InboxOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import * as _unitOfWork from "../../../../api";
import { approvalRequiredOptions } from "../../../../utils/constant";
import MapModal from "./MapModal";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const CreateCustomer = ({ open, handleCancel, onRefresh }) => {
  const [form] = Form.useForm();
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [region, setRegion] = useState([]);
  const [taxGroup, setTaxGroup] = useState([]);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (open) {
      fetchAllCountry();
      fetchAllRegion();
      fetchAllTaxGroup();
    }
  }, [open]);

  const onFinish = async () => {
    try {
      console.log("Form values:", form.getFieldsValue());
      const values = await form.validateFields();
      const { Image, ...rest } = values;
      let addressTwo = null;
      if (
        rest.address &&
        rest.countryId &&
        rest.stateId &&
        rest.cityId &&
        rest.regionId
      ) {
        const country = await _unitOfWork.country.getCountryById({
          id: rest.countryId,
        });
        const state = await _unitOfWork.state.getStateById({
          id: rest.stateId,
        });
        const region = await _unitOfWork.region.getRegionById({
          id: rest.regionId,
        });
        const city = await _unitOfWork.city.getCityById({ id: rest.cityId });

        addressTwo = `${rest.address}, ${city?.name}, ${state?.name}, ${region?.name}, ${country?.name}`;
      }

      const res = await _unitOfWork.customer.createCustomer({
        ...rest,
        addressTwo,
      });

      if (res && res.code === 1) {
        message.success(t("common.messages.success.successfully"));
        onRefresh();
        form.resetFields();
        handleCancel();
      } else {
        message.error(res?.message || t("common.messages.errors.failed"));
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      message.error(t("common.messages.errors.failed"));
    }
  };

  const fetchStateByCountry = async (countryId) => {
    const res = await _unitOfWork.state.getStateByCountryId({ countryId });
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setState(options);
    }
  };

  const fetchAllCountry = async () => {
    const res = await _unitOfWork.country.getAllCountry();
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setCountry(options);
    }
  };

  const fetchCityByState = async (stateId) => {
    const res = await _unitOfWork.city.getCityByStateId({ stateId });
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setCity(options);
    }
  };

  const fetchAllRegion = async () => {
    const res = await _unitOfWork.region.getAllRegion();
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setRegion(options);
    }
  };

  const fetchAllTaxGroup = async () => {
    const res = await _unitOfWork.taxGroup.getTaxGroups();
    if (res?.data) {
      const options = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setTaxGroup(options);
    }
  };

  const handleChangeApprovalRequired = (e) => {
    form.setFieldsValue({ approvalRequired: e.target.value });
  };

  const handleMapSelect = (location) => {
    form.setFieldsValue({
      addressOne: location.addressOne,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setMapModalVisible(false);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      className="custom-modal"
      closable={true}
      footer={null}
      width={800}
    >
      <Form labelWrap form={form} layout="vertical" onFinish={onFinish}>
        <Card title="Thêm mới người dùng tài sản">
          {/* Group 1: Name */}
          <FormItem
            name="customerName"
            label="Customer Name*"
            rules={[{ required: true, message: "Please enter customer name" }]}
          >
            <Input placeholder="Customer Name" />
          </FormItem>

          {/* Group 2: Customer Info */}
          <Title level={4}>Customer Info</Title>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                name="firstName"
                label="First Name*"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="First Name" maxLength={100} showCount />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                name="lastName"
                label="Last Name*"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Last Name" maxLength={100} showCount />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem name="contactEmail" label="Contact Email">
                <Input placeholder="Contact Email" type="email" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="contactNumber" label="Contact Number">
                <Input placeholder="Contact Number" showCount />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem name="taxGroupId" label="Tax Group">
                <Select placeholder="Select Tax Group" options={taxGroup} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="resourceId" hidden>
                <Input />
              </FormItem>
              <FormItem name="Image" label="Image">
                <Upload.Dragger
                  name="file"
                  accept=".png,.jpg,.jpeg"
                  multiple={false}
                  maxCount={1}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await _unitOfWork.resource.uploadImage(
                        formData
                      );
                      if (res) {
                        form.setFieldsValue({ resourceId: res.resourceId });
                        onSuccess("OK");
                      } else {
                        throw new Error("Upload failed");
                      }
                    } catch (err) {
                      console.error("Image upload failed:", err);
                      onError(err);
                    }
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag to upload image
                  </p>
                </Upload.Dragger>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="customer_gst_number" label="GST Number">
                <Input placeholder="GST Number" maxLength={15} showCount />
              </FormItem>
            </Col>
          </Row>

          {/* Group 3: Address */}
          <Title level={4}>Address</Title>
          <FormItem name="addressOne" label="Geo Address">
            <Input
              placeholder="Geo Address"
              suffix={
                <EnvironmentOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => setMapModalVisible(true)}
                />
              }
            />
          </FormItem>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem name="latitude" label="Latitude">
                <Input placeholder="Latitude" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="longitude" label="Longitude">
                <Input placeholder="Longitude" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="regionId" label="Region">
                <Select placeholder="Select Region" options={region} />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem name="address" label="Address">
                <Input placeholder="Address" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                name="zipCode"
                label="Pin code / Zip Code"
                rules={[{ max: 10 }]}
              >
                <Input
                  placeholder="Pin code / Zip Code"
                  maxLength={10}
                  showCount
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem name="countryId" label="Country">
                <Select
                  placeholder="Select Country"
                  options={country}
                  onChange={(value) => {
                    form.setFieldsValue({ stateId: null, cityId: null });
                    setState([]);
                    setCity([]);
                    fetchStateByCountry(value);
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="stateId" label="State">
                <Select
                  placeholder="Select State"
                  options={state}
                  onChange={(value) => {
                    form.setFieldsValue({ cityId: null });
                    setCity([]);
                    fetchCityByState(value);
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="cityId" label="City">
                <Select placeholder="Select City" options={city} />
              </FormItem>
            </Col>
          </Row>

          <Row>
            <FormItem name="approvalRequired" label="Approval Required">
              <Radio.Group onChange={handleChangeApprovalRequired}>
                {approvalRequiredOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Radio.Group>
            </FormItem>
          </Row>

          <Row>
            <div className="modal-footer">
              <Button onClick={handleCancel}>
                <CloseCircleFilled />
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                <PlusCircleFilled />
                Lưu
              </Button>
            </div>
          </Row>

          <MapModal
            visible={mapModalVisible}
            onCancel={() => setMapModalVisible(false)}
            onSelect={handleMapSelect}
            lat={form.getFieldValue("latitude")}
            lng={form.getFieldValue("longitude")}
          />
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateCustomer;
