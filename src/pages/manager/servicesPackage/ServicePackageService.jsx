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
    Typography
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { formatCurrency, parseCurrency } from "../../../helper/price-helper";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export default function ServicePackageService({ servicePackageService, serviceIndex, servicePackageServices, setServicePackageServices }) {
    const { t } = useTranslation();
    const handleValueChange = (field, value) => {
        let newServicePackageServices = [...servicePackageServices];
        newServicePackageServices[serviceIndex][field] = value;
        setServicePackageServices(newServicePackageServices);
    };

    const handleDeleteService = () => {
        let newServicePackageServices = [...servicePackageServices];
        newServicePackageServices.splice(serviceIndex, 1);
        setServicePackageServices(newServicePackageServices);
    };
    const addServiceTask = () => {
        let newServicePackageServices = [...servicePackageServices];
        if (!newServicePackageServices[serviceIndex].servicePackageServiceTasks) {
            newServicePackageServices[serviceIndex].servicePackageServiceTasks = [];
        }
        newServicePackageServices[serviceIndex].servicePackageServiceTasks.push({
            serviceTasks: newServicePackageServices[serviceIndex].service.serviceTasks
        })
        setServicePackageServices(newServicePackageServices);
    }
    const handleChangeServiceTask = (_idx, field, value) => {
        let newServicePackageServices = [...servicePackageServices];
        newServicePackageServices[serviceIndex].servicePackageServiceTasks[_idx][field] = value;
        setServicePackageServices(newServicePackageServices);
    };
    const handleDeleteServiceTask = (_idx) => {
        let newServicePackageServices = [...servicePackageServices];
        newServicePackageServices[serviceIndex].servicePackageServiceTasks.splice(_idx, 1);
        setServicePackageServices(newServicePackageServices);
    }
    const columnServicePackageTask = [
        {
            title: "#",
            dataIndex: "key",
            width: '60px',
            render: (_, __, index) => index + 1,
        },
        {
            title: t("servicePackage.common.labels.task_name"),
            width: '40%',
            dataIndex: "serviceTask",
            render: (_, record, _idx) => (
                <Select
                    value={record.serviceTask}
                    onChange={(value) => handleChangeServiceTask(_idx, "serviceTask", value)}
                    style={{ width: "100%" }}
                    options={(servicePackageService?.service?.serviceTasks || []).map((item, key) => ({
                        key: key,
                        value: item.id || item._id,
                        label: item.taskName,
                    }))}
                >
                </Select>
            ),
        },
        {
            title: t("servicePackage.common.labels.task_price_qty"),
            dataIndex: "totalPrice",
            render: (_, record, _idx) => (
                <InputNumber
                    value={record.totalPrice}
                    onChange={(e) => handleChangeServiceTask(_idx, "totalPrice", e)}
                    style={{ width: "100%" }}
                    formatter={formatCurrency}
                    parser={parseCurrency}
                >
                </InputNumber>
            ),
        },
        {
            title: t("servicePackage.common.labels.action"),
            width: 80,
            align: 'center',
            render: (_, record, _idx) => (
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
        if (!servicePackageService.servicePackageServiceTasks) return _totalPrice;
        servicePackageService.servicePackageServiceTasks.forEach(element => {
            _totalPrice += (element.totalPrice ?? 0) * (servicePackageService.frequencyNumber ?? 0) * (servicePackageService.noOfAsset ?? 0)
        });
        return _totalPrice;
    }
    return (
        <>
            <Collapse className="mb-2" items={[{
                key: serviceIndex,
                label: <Row gutter={16} align="middle">
                    <Col span={7}>
                        <Text strong>{t("servicePackage.common.labels.service_type")}: {servicePackageService?.service?.serviceName}</Text>
                    </Col>
                    <Col span={5}>
                        <span>
                            {t("servicePackage.common.labels.frequency")}:{" "}
                            <InputNumber
                                min={1}
                                value={servicePackageService.frequencyNumber}
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
                            {t("servicePackage.common.labels.asset_quantity")}:{" "}
                            <InputNumber
                                min={1}
                                value={servicePackageService.noOfAsset}
                                onChange={(val) =>
                                    handleValueChange("noOfAsset", val)
                                }
                                style={{ width: "100%" }}
                                formatter={formatCurrency}
                                parser={parseCurrency}
                            />
                        </span>
                    </Col>
                    <Col span={5}>
                        <span>
                            {t("servicePackage.common.labels.service_price")}:{" "}
                            {formatCurrency(calTotalPrice())}
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
                </Row>,
                children: <div>
                    <Row justify="end" className="mb-2">
                        <Col>
                            <Button type="primary" className="bt-green" onClick={() => addServiceTask()} >
                                {t("servicePackage.common.buttons.add_task")}
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        columns={columnServicePackageTask}
                        dataSource={servicePackageService.servicePackageServiceTasks ?? []}
                        pagination={false}
                        rowKey="key"
                        bordered
                    />
                </div>
            }]} defaultActiveKey={['0']} collapsible="icon" />
        </>
    );
}