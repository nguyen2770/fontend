import { AlipaySquareFilled, DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Pagination, Row, Space, Table, Tooltip } from "antd";
import { checkPermission } from "../../../helper/permission-helper";
import useAuth from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useEffect, useState } from "react";
import { PAGINATION } from "../../../utils/constant";
import CreateStockLocationModal from "./CreateStockLocation";
import * as _unitWork from "../../../api"
import { render } from "@testing-library/react";
import UpdateStockLocation from "./UpdateStockLocation";

function StockLocation() {
    const { permissions } = useAuth();
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [totalRecord, setTotalRecord] = useState(0)
    const [pagination, setPagination] = useState(PAGINATION);
    const [page, setPage] = useState(1);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [stockLocations, setStockLocations] = useState([]);
    const [stockLocation, setStockLocation] = useState();



    useEffect(() => {
        fetchStockLocations();
    }, [page])

    const fetchStockLocations = async () => {
        const payload = {
            page: page,
            limit: pagination.limit,
        }
        const res = await _unitWork.stockLocation.getListStockLocation(payload);
        if (res?.code === 1 && res?.results) {
            setStockLocations(res?.results.results)
        }
    }

    const handleReset = () => {
        form.resetFields();
    }

    const onClickGoToCreate = () => {
        setIsOpenCreate(true)
    }

    const onChangePagination = (value) => {
        setPage(value);
    };

    const handleUpdate = (value) => {
        setIsOpenUpdate(true);
        setStockLocation(value)
    }

    const columns = [
        {
            title: t("receiptPurchase.table.stt"),
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) => (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: "Tên kho",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            render: (text, record) => {
                return (
                    <span>
                        {[
                            text,
                            record.commune?.nameWithType,
                            record.province?.nameWithType,
                        ]
                            .filter(Boolean)
                            .join(", ")
                        }
                    </span>
                )
            }
        },
        {
            title: "Action",
            dataIndex: "address",
            key: "address",
            align: "center",
            width: "100px",
            render: (_, record) => (
                <Space size={8} >

                    <Tooltip title={t("receiptPurchase.actions.edit")}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleUpdate(record)}
                        />
                    </Tooltip>
                    {/* <Tooltip title={t("receiptPurchase.actions.delete")}>
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        // onClick={() => Comfirm(t("receiptPurchase.confirm.delete"), () => handleDelete(record.id))}
                        />
                    </Tooltip> */}
                </Space>

            )
        }
    ]
    return (
        <div className="p-3">

            <Form

            >
                <Row gutter={24}>
                    <Col
                        span={8}
                    >
                        <Form.Item
                            name="Tên kho"
                            label={<span style={{ color: '#fff' }}>Tên kho</span>}
                        >

                            <Input placeholder="Tên kho"></Input>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ textAlign: "left" }}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            {t("receiptPurchase.actions.search")}
                        </Button>
                        <Button onClick={handleReset} className="bt-green mr-2">
                            <RedoOutlined />
                            {t("receiptPurchase.actions.reset")}
                        </Button>
                        {/* <Button
                            icon={<FilterOutlined style={{ fontSize: 20, position: "relative", top: 1 }} />}
                            title={t("preventive.buttons.advanced_search")}
                            onClick={() => setIsOpenSearchAdvanced(true)}

                        /> */}
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                        <Tooltip title={t("receiptPurchase.actions.help")} color="#616263">
                            <QuestionCircleOutlined
                                style={{ fontSize: 20, cursor: "pointer", marginLeft: 10 }}
                            />
                        </Tooltip>
                        {/* {checkPermission(
                            permissions,
                            permissionCodeConstant.stock_receipt_create
                        ) && ( */}
                        <Button
                            key="1"
                            type="primary"
                            onClick={onClickGoToCreate}
                            className="ml-3"
                        >
                            <PlusOutlined /> {t("receiptPurchase.actions.addNew")}
                        </Button>
                        {/* )} */}
                    </Col>
                    <Col
                        span={24}
                        style={{ fontSize: 16, color: "#fff", textAlign: "right" }}
                    >
                        <b>
                            {t("purchaseQuotation.list.total", {
                                count: totalRecord || 0
                            })}
                        </b>
                    </Col>

                </Row>
                <Table
                    rowKey="id"
                    columns={columns}
                    key="id"
                    dataSource={stockLocations}
                    bordered
                    pagination={false}
                >

                </Table>

                <Pagination
                    className="pagination-table mt-2"
                    onChange={onChangePagination}
                    pageSize={pagination.limit}
                    total={totalRecord}
                />
                <CreateStockLocationModal
                    open={isOpenCreate}
                    onCancel={() => setIsOpenCreate(false)}
                    onSuccess={() => { fetchStockLocations() }}
                />

                <UpdateStockLocation
                    open={isOpenUpdate}
                    onCancel={() => setIsOpenUpdate(false)}
                    onSuccess={() => { fetchStockLocations() }}
                    data={stockLocation}
                />



            </Form>
        </div>
    );
}

export default StockLocation;