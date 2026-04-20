import { Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { filterOption } from "../../../helper/search-select-helper";
import { useTranslation } from "react-i18next";

export default function TabsMap({ form }) {
  const { t } = useTranslation();
  const [buildings, setBuildings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [floors, setFloors] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    fetchAllProvince();
    fetchAllFloor();
    fetchAllDepartment();
    fetchAllBuilding();
    // fetchAllBranch();
  }, []);

  useEffect(() => {
    const provinceValue = form.getFieldValue("province");
    if (provinceValue) {
      fetchAllCommunesByProvince(provinceValue);
    }
  }, [form]);

  const fetchAllFloor = async () => {
    let res = await _unitOfWork.floor.getAllFloor();
    if (res && res.code === 1) {
      setFloors(res.data);
    }
  };
  const fetchAllBranch = async () => {
    let res = await _unitOfWork.branch.getAllBranch();
    if (res && res.code === 1) {
      setBranchs(res.data);
    }
  };
  const fetchAllDepartment = async () => {
    let res = await _unitOfWork.department.getAllDepartment();
    if (res && res.code === 1) {
      setDepartments(res.data);
    }
  };
  const fetchAllBuilding = async () => {
    let res = await _unitOfWork.building.getAllBuilding();
    if (res && res.code === 1) {
      setBuildings(res.data);
    }
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
    <>
      <Row gutter={[16]}>
        {/* <Col span={12}>
          <Form.Item
            name="province"
            label={t("assetMaintenance.form.fields.province")}
            labelAlign="left"
          >
            <Select
              placeholder={t("assetMaintenance.form.placeholders.province")}
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
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="commune"
            label={t("assetMaintenance.form.fields.commune")}
            labelAlign="left"
          >
            <Select
              placeholder={t("assetMaintenance.form.placeholders.commune")}
              options={communes}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col> */}

        {/* <Col span={12}>
          <Form.Item
            name="branch"
            label={t("assetMaintenance.form.fields.branch")}
            labelAlign="left"
          >
            <Select
              showSearch
              placeholder={t("assetMaintenance.form.placeholders.branch")}
              options={branchs?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              filterOption={filterOption}
            />
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item
            name="building"
            label={t("assetMaintenance.form.fields.building")}
            labelAlign="left"
          >
            <Select
              showSearch
              placeholder={t("assetMaintenance.form.placeholders.building")}
              options={buildings?.map((item) => ({
                value: item.id,
                label: item.buildingName,
              }))}
              onChange={(value, option) => {
                form.setFieldValue("buildingName", option.label);
              }}
              filterOption={filterOption}
            />
          </Form.Item>
          <Form.Item name="buildingName" hidden>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="floor"
            label={t("assetMaintenance.form.fields.floor")}
            labelAlign="left"
          >
            <Select
              showSearch
              placeholder={t("assetMaintenance.form.placeholders.floor")}
              options={floors?.map((item) => ({
                value: item.id,
                label: item.floorName,
              }))}
              onChange={(value, option) => {
                form.setFieldValue("floorName", option.label);
              }}
              filterOption={filterOption}
            />
          </Form.Item>
          <Form.Item name="floorName" hidden>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="department"
            label={t("assetMaintenance.form.fields.department")}
            labelAlign="left"
          >
            <Select
              showSearch
              placeholder={t("assetMaintenance.form.placeholders.department")}
              options={departments?.map((item) => ({
                value: item.id,
                label: item.departmentName,
              }))}
              filterOption={filterOption}
              onChange={(value, option) => {
                form.setFieldValue("departmentName", option.label);
              }}
            />
          </Form.Item>
          <Form.Item name="departmentName" hidden>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="addressNote"
            label={t("assetMaintenance.form.fields.address")}
            labelAlign="left"
          >
            <Input
              placeholder={t("assetMaintenance.form.placeholders.address")}
            ></Input>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
