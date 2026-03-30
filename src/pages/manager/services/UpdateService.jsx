import {
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Dropdown, Row, Select, Collapse, Tooltip, notification, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from '../../../api'
import { array_move } from "../../../helper/array-helper";
import ServiceTaskComponent from "../../../components/common/WorkTaskComponent";
import { useTranslation } from "react-i18next";
const servicePriorities = [
  {
    label: 'Cao',
    value: 'high'
  },
  {
    label: 'Trung bình',
    value: 'medium'
  },
  {
    label: 'Thấp',
    value: 'low'
  }
]
const itemTasks = [
  {
    label: 'Inspection task',
    key: 'inspection',
  }, {
    label: 'Monitoring Task',
    key: 'monitoring',
  }, {
    label: 'Calibration task',
    key: 'calibration',
  }, {
    label: 'Review task',
    key: 'review',
  }, {
    label: 'Approval task',
    key: 'Approval',
  }, {
    label: 'Spare Replacement task',
    key: 'spare-replacement',
  },
];
export default function UpdateService() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [serviceTasks, setServiceTasks] = useState([]);
  const params = useParams();
  useEffect(() => {
    fetchService();
  }, [])
  const navigate = useNavigate();
  const onFinish = async () => {
    let payload = {
      service: {
        ...form.getFieldsValue()
      },
      serviceTasks: serviceTasks
    }
    let res = await _unitOfWork.service.update(params.id, payload);
    if (res && res.code === 1) {
      form.resetFields();
      navigate(-1)
    }
  };
  const fetchService = async () => {
    let res = await _unitOfWork.service.getServiceById(params.id)
    if (res.code === 1) {
      form.setFieldsValue({
        serviceName: res.service.serviceName,
        servicePriority: res.service.servicePriority
      })
      let serivceTasks = res.service.serviceTasks;
      setServiceTasks(serivceTasks)
    }
  }
  return (
    <div className="content-manager">
      <Form
labelWrap
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
      >
        <Card
          title={t("service.update.title")}
          extra={
            <>
              <Button
                style={{ marginRight: "10px" }}
                onClick={() => navigate(-1)}
              >
                <ArrowLeftOutlined />
                {t("service.common.buttons.back")}
              </Button>
              <Button className="" type="primary" htmlType="submit">
                <PlusCircleOutlined />
                {t("service.common.buttons.update")}
              </Button>
            </>
          }
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                id=""
                label={t("service.common.labels.service_name")}
                name="serviceName"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("service.common.messages.name_required"),
                  },
                ]}
              >
                <Input placeholder={t("service.common.placeholders.service_name")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id=""
                labelAlign="left"
                label={t("service.common.labels.service_priority")}
                name="servicePriority"
                rules={[
                  {
                    required: true,
                    message: t("service.common.messages.priority_required"),
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder={t("service.common.placeholders.service_priority")}
                  options={(servicePriorities || []).map((item, key) => ({
                    key: key,
                    value: item.value,
                    label: item.label,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <ServiceTaskComponent workTasks={serviceTasks} setWorkTasks={setServiceTasks} />
        </Card>
      </Form>
    </div>
  );
}