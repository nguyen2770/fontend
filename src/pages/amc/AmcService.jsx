import React from "react";
import {
  Form,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Collapse,
  Table,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  formatCurrency,
  parseCurrency,
  priceFormatter,
} from "../../helper/price-helper";
import { filterOption } from "../../helper/search-select-helper";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export default function AmcService({
  amcService,
  serviceIndex,
  amcServices,
  setAmcServices,
  assetModels = [],
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleValueChange = (field, value) => {
    let newAmcServices = [...amcServices];
    newAmcServices[serviceIndex][field] = value;
    setAmcServices(newAmcServices);
  };

  const handleDeleteService = () => {
    let newAmcServices = [...amcServices];
    newAmcServices.splice(serviceIndex, 1);
    setAmcServices(newAmcServices);
  };
  const addServiceTask = () => {
    let newAmcServices = [...amcServices];
    if (!newAmcServices[serviceIndex].amcServiceTasks) {
      newAmcServices[serviceIndex].amcServiceTasks = [];
    }
    newAmcServices[serviceIndex].amcServiceTasks.push({
      serviceTasks: newAmcServices[serviceIndex].service.serviceTasks,
    });
    setAmcServices(newAmcServices);
  };
  const handleChangeServiceTask = (_idx, field, value) => {
    let newAmcServices = [...amcServices];
    newAmcServices[serviceIndex].amcServiceTasks[_idx][field] = value;
    setAmcServices(newAmcServices);
  };
  const handleDeleteServiceTask = (_idx) => {
    let newAmcServices = [...amcServices];
    newAmcServices[serviceIndex].amcServiceTasks.splice(_idx, 1);
    setAmcServices(newAmcServices);
  };
  const columnServicePackageTask = [
    {
      title: "#",
      dataIndex: "key",
      width: "60px",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("amc.service.work_name"),
      width: "40%",
      dataIndex: "serviceTask",
      render: (_, record, _idx) => (
        <Select
          value={record.serviceTask}
          onChange={(value) =>
            handleChangeServiceTask(_idx, "serviceTask", value)
          }
          style={{ width: "100%" }}
          options={(amcService?.service?.serviceTasks || []).map(
            (item, key) => ({
              key: key,
              value: item.id || item._id,
              label: item.taskName,
            }),
          )}
          allowClear
          filterOption={filterOption}
          showSearch={true}
        />
      ),
    },
    {
      title: t("amc.service.price_quantity"),
      dataIndex: "totalPrice",
      render: (_, record, _idx) => (
        <InputNumber
          value={record.totalPrice}
          onChange={(e) => handleChangeServiceTask(_idx, "totalPrice", e)}
          style={{ width: "100%" }}
          formatter={formatCurrency}
          parser={parseCurrency}
        />
      ),
    },
    {
      title: t("amc.service.action"),
      width: 80,
      align: "center",
      render: (_, __, _idx) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteServiceTask(_idx)}
          danger
        />
      ),
    },
  ];
  const calTotalPrice = () => {
    let _totalPrice = 0;
    if (!amcService.amcServiceTasks) return _totalPrice;
    amcService.amcServiceTasks.forEach((element) => {
      _totalPrice +=
        (element.totalPrice ?? 0) *
        (amcService.frequencyNumber ?? 0) *
        (amcService.noOfAsset ?? 0);
    });
    return _totalPrice;
  };
  return (
    <Collapse
      className="mb-2"
      items={[
        {
          key: serviceIndex,
          label: (
            <Row gutter={16} align="middle">
              <Col span={24}>
                <Text strong>
                  {t("amc.service.service_label", {
                    name: amcService?.service?.serviceName,
                  })}
                </Text>
              </Col>
              <Col span={5}>
                <span>
                  {t("amc.service.frequency")}:{" "}
                  <InputNumber
                    min={1}
                    value={amcService.frequencyNumber}
                    onChange={(val) =>
                      handleValueChange("frequencyNumber", val)
                    }
                    style={{ width: "100%" }}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                  />
                </span>
              </Col>
              <Col span={5}>
                <span>
                  {t("amc.service.asset_count")}:{" "}
                  <InputNumber
                    min={1}
                    value={amcService.noOfAsset}
                    onChange={(val) => handleValueChange("noOfAsset", val)}
                    style={{ width: "100%" }}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                  />
                </span>
              </Col>
              <Col span={6}>
                <span>
                  {t("amc.service.model")}
                  <Select
                    value={amcService.assetModel}
                    onChange={(val) => handleValueChange("assetModel", val)}
                    style={{ width: "100%" }}
                    placeholder={t("amc.service.model")}
                    options={(assetModels || []).map((item, key) => ({
                      key: key,
                      value: item.id,
                      label:
                        item?.assetModelName +
                        (item?.asset ? " - " + item?.asset?.assetName : ""),
                    }))}
                    filterOption={filterOption}
                    showSearch={true}
                  />
                </span>
              </Col>
              <Col span={5}>
                <span>
                  {t("amc.service.service_price")}:{" "}
                  <div>{priceFormatter(calTotalPrice())}</div>
                </span>
              </Col>
              <Col span={2}>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteService()}
                  danger
                  type="text"
                />
              </Col>
            </Row>
          ),
          children: (
            <div>
              <Row justify="end" className="mb-2">
                <Col>
                  <Button
                    type="primary"
                    className="bt-green"
                    onClick={() => addServiceTask()}
                  >
                    {t("amc.service.add_work")}
                  </Button>
                </Col>
              </Row>
              <Table
                columns={columnServicePackageTask}
                dataSource={amcService.amcServiceTasks ?? []}
                pagination={false}
                rowKey="key"
                bordered
              />
            </div>
          ),
        },
      ]}
      defaultActiveKey={["0"]}
      collapsible="icon"
    />
  );
}
