import React from "react";
import { Row, Col, Collapse, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../helper/price-helper";
const { Text } = Typography;

export default function ViewServicePackageService({
  servicePackageService,
  serviceIndex,
}) {
  const { t } = useTranslation();
  const columnServicePackageTask = [
    {
      title: "#",
      dataIndex: "key",
      width: "60px",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("servicePackage.common.labels.task_name"),
      width: "40%",
      dataIndex: "serviceTask",
      render: (_, record) => {
        var serviceTask = servicePackageService.service.serviceTasks.find(
          (s) => s.id == record.serviceTask || s._id == record.serviceTask,
        );
        if (serviceTask) {
          return serviceTask.taskName;
        }
        return "";
      },
    },
    {
      title: t("servicePackage.common.labels.task_price_qty"),
      dataIndex: "totalPrice",
      render: (_, record) => record.totalPrice,
    },
  ];
  const calTotalPrice = () => {
    let _totalPrice = 0;
    servicePackageService.servicePackageServiceTasks.forEach((element) => {
      _totalPrice +=
        (element.totalPrice ?? 0) *
        (servicePackageService.frequencyNumber ?? 0) *
        (servicePackageService.noOfAsset ?? 0);
    });
    return _totalPrice;
  };
  return (
    <>
      <Collapse
        items={[
          {
            key: serviceIndex,
            label: (
              <Row gutter={16} align="middle">
                <Col span={7}>
                  <Text strong>
                    {t("servicePackage.common.labels.service_type")}:{" "}
                    {servicePackageService?.service?.serviceName}
                  </Text>
                </Col>
                <Col span={6}>
                  <span>
                    {t("servicePackage.common.labels.frequency")}:{" "}
                    {servicePackageService?.frequencyNumber}
                  </span>
                </Col>
                <Col span={6}>
                  <span>
                    {t("servicePackage.common.labels.asset_quantity")}:{" "}
                    {servicePackageService?.noOfAsset}
                  </span>
                </Col>
                <Col span={5}>
                  <span>
                    {t("servicePackage.common.labels.service_price")}:{" "}
                    {formatCurrency(calTotalPrice())}
                  </span>
                </Col>
              </Row>
            ),
            children: (
              <div>
                <Table
                  columns={columnServicePackageTask}
                  dataSource={
                    servicePackageService.servicePackageServiceTasks ?? []
                  }
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
    </>
  );
}
