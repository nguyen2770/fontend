import React from "react";
import { Row, Col, Collapse, Table, Typography } from "antd";
import { priceFormatter } from "../../helper/price-helper";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export default function ViewAmcService({ amcService, serviceIndex }) {
  const { t } = useTranslation();

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
      render: (_, record) => {
        var serviceTask = amcService.service.serviceTasks.find(
          (s) => s.id == record.serviceTask,
        );
        if (serviceTask) {
          return serviceTask.taskName;
        }
        return "";
      },
    },
    {
      title: t("amc.service.price_quantity"),
      dataIndex: "totalPrice",
      render: (val) => priceFormatter(val),
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
                  <div>
                    <b>{amcService.frequencyNumber}</b>
                  </div>
                </span>
              </Col>
              <Col span={5}>
                <span>
                  {t("amc.service.asset_count")}:{" "}
                  <div>
                    <b>{amcService.noOfAsset}</b>
                  </div>
                </span>
              </Col>
              <Col span={9}>
                <span>
                  {t("amc.service.model")}
                  <div>
                    <b>
                      {amcService.assetModel?.assetModelName}
                      {amcService.assetModel?.asset
                        ? " - " + amcService.assetModel?.asset?.assetName
                        : ""}
                    </b>
                  </div>
                </span>
              </Col>
              <Col span={5}>
                <span>
                  {t("amc.service.service_price")}:{" "}
                  <div>
                    {" "}
                    <b>{priceFormatter(calTotalPrice())}</b>
                  </div>
                </span>
              </Col>
            </Row>
          ),
          children: (
            <div>
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
