import {
    DeleteOutlined,
    LeftCircleFilled,
    UserAddOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Space, Table, Tooltip, Card, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as _unitOfWork from '../../../api'
import Confirm from "../../../components/modal/Confirm";
import useHeader from "../../../contexts/headerContext";
import UserMappingModal from "../../../components/modal/mappingUser/UserMappingModal";
import { useTranslation } from "react-i18next";

export default function ServiceContractorUserMapping() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const prams = useParams();
    const [serviceContractorUserMappings, setServiceContractorUserMappings] = useState([]);
    const [searchForm] = Form.useForm();
    const { setHeaderTitle } = useHeader();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setHeaderTitle(t("serviceContractor.userMapping.title"));
        fetchServiceserviceContractorUserMappingss();
    }, []) // eslint-disable-line

    const fetchServiceserviceContractorUserMappingss = async () => {
        let res = await _unitOfWork.serviceContractor.getServiceContractorUserMappingByRes({ serviceContractor: prams.id })
        if (res && res.code === 1) {
            setServiceContractorUserMappings(res.data)
        }
    }

    const onCreate = () => {
        setOpen(true);
    };

    const onClickDelete = async (_record) => {
        let res = await _unitOfWork.serviceContractor.deleteServiceContractorUserMappingById(_record.id);
        if (res && res.code === 1) {
            fetchServiceserviceContractorUserMappingss();
        }
    }
    const onReset = async () => {
        fetchServiceserviceContractorUserMappingss();
        setOpen(false);
    }
    const columns = [
        {
            title: t("serviceContractor.userMapping.columns.index"),
            dataIndex: "id",
            key: "id",
            width: '5%',
            align: 'center',
            render: (_, record, _idx) => {
                return <span>{_idx + 1}</span>
            }
        },
        {
            title: t("serviceContractor.userMapping.columns.user_name"),
            dataIndex: "user",
            render: (text) => (text?.fullName || '')
        },
        {
            title: t("serviceContractor.userMapping.columns.phone"),
            dataIndex: "user",
            render: (text) => (text?.contactNo || '')
        },
        {
            title: t("serviceContractor.userMapping.columns.email"),
            dataIndex: "user",
            render: (text) => (text?.email || '')
        },
        {
            title: t("serviceContractor.userMapping.columns.action"),
            dataIndex: "action",
            align: "center",
            width: "10%",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t("serviceContractor.userMapping.tooltips.delete")}>
                        <Button
                            type="primary"
                            onClick={() => Confirm(t("serviceContractor.userMapping.messages.confirm_delete"), () => onClickDelete(record))}
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="content-manager">
            <Card>
                <Form
labelWrap
                    className="search-form mb-12px"
                    form={searchForm}
                    layout="vertical"
                    onFinish={serviceContractorUserMappings}
                >
                    <Row gutter={8}>
                    </Row>
                    <Row>
                        <Col span={12}>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Button onClick={() => navigate(-1)} >
                                <LeftCircleFilled />
                                {t("serviceContractor.common.buttons.back")}
                            </Button>
                            <Button type="primary" onClick={onCreate} className="ml-2">
                                <UserAddOutlined />
                                {t("serviceContractor.common.buttons.link_user")}
                            </Button>

                        </Col>
                    </Row>
                </Form>
                <Table
                    columns={columns}
                    dataSource={serviceContractorUserMappings}
                    className="custom-table"
                    pagination={false}
                ></Table>
                <UserMappingModal
                    open={open}
                    onCancel={() => setOpen(false)}
                    onReset={onReset}
                    serviceContractor={prams?.id}
                />
            </Card>
        </div>
    );
}