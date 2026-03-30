import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Row,
  Space,
  Input,
  Select,
  Divider,
} from "antd";
import { RedoOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import { filterOption } from "../../helper/search-select-helper";
import { assetType, FORMAT_DATE } from "../../utils/constant";
import { useTranslation } from "react-i18next";

function DrawerSearchPurchase({ isOpen, onCallBack, onClose, type }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (branches.length <= 0 && type != "quotation") fetchBranches();
      if (departments.length <= 0 && type != "quotation") fetchDepartments();
    }
  }, [isOpen]);

  const onReset = () => form.resetFields();

  const fetchDepartments = async () => {
    try {
      const department = await _unitOfWork.department.getAllDepartment();
      if (department?.data) {
        const options = department.data.map((item) => ({
          label: item.departmentName,
          value: item.id,
        }));
        setDepartments(options);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const branch = await _unitOfWork.branch.getAllBranch();
      if (branch?.data) {
        const options = branch.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setBranches(options);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const handleFinish = async () => {
    const value = form.getFieldsValue();
    onCallBack(value);
    onClose();
  };
  return (
    <Drawer
      title={t("common_buttons.advanced_search")}
      width={"40%"}
      open={isOpen}
      onClose={onClose}
      extra={
        <Space>
          {/* <Button onClick={onClose} icon={<CloseOutlined />}>
                        Đóng
                    </Button> */}

          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            onClick={handleFinish}
          >
            {t("myTask.myTask.buttons.search")}
          </Button>

          <Button onClick={onReset} icon={<RedoOutlined />}>
            {t("myTask.myTask.buttons.reset")}
          </Button>
        </Space>
      }
    >
      <Form labelWrap form={form} layout="vertical" onFinish={onCallBack}>
        <Row gutter={16}>
          {/* <Col span={12}>
                        <Form.Item
                            name="code"
                            label={t("suppliesNeed.list.search.code_label")}
                        >
                            <Input
                                placeholder={t(
                                    "suppliesNeed.list.search.placeholder_code"
                                )}
                            />
                        </Form.Item>
                    </Col> */}
          {type != "quotation" && (
            <>
              <Col span={12}>
                <Form.Item
                  name="branch"
                  label={t("suppliesNeed.list.search.branch_label")}
                >
                  <Select
                    options={branches}
                    placeholder={t(
                      "suppliesNeed.list.search.placeholder_branch"
                    )}
                    allowClear
                    filterOption={filterOption}
                    showSearch={true}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="department"
                  label={t("suppliesNeed.list.search.department_label")}
                >
                  <Select
                    options={departments}
                    placeholder={t(
                      "suppliesNeed.list.search.placeholder_department"
                    )}
                    allowClear
                    filterOption={filterOption}
                    showSearch={true}
                  />
                </Form.Item>
              </Col>
              <Divider>Ngày </Divider>
            </>
          )}

          <Col span={12}>
            <Form.Item
              name="startDate"
              label={t("suppliesNeed.list.search.start_label")}
            >
              <DatePicker
                placeholder={t("suppliesNeed.list.search.placeholder_start")}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="endDate"
              label={t("suppliesNeed.list.search.end_label")}
            >
              <DatePicker
                placeholder={t("suppliesNeed.list.search.placeholder_end")}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}

export default React.memo(DrawerSearchPurchase);
