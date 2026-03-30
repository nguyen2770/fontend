import React, { useEffect, useState } from "react";
import {
    CheckCircleTwoTone,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    RedoOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Pagination, Row, Switch, Table, Tooltip } from "antd";
import CreateAssetTypeCategory from "./CreateAssetTypeCategory";
import UpdateAssetTypeCategory from "./UpdateAssetTypeCategory";
import { PAGINATION } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
export default function AssetType() {
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [assetTypeCategorys, setAssetTypeCategorys] = useState([]);
    const [assetId, setAssetId] = useState([]);
    const [searchForm] = Form.useForm();

    useEffect(() => {
        fetchGetListAsset();
    }, [page]);

    const onChangePagination = (value) => {
        setPage(value);
    };

    const fetchGetListAsset = async () => {
        const values = searchForm.getFieldsValue();
        let payload = {
            page: page,
            limit: PAGINATION.limit,
            ...values,
        };
        const res = await _unitOfWork.assetTypeCategory.getListAssetTypeCategorys(payload);

        if (res && res.results && res.results?.results) {
            setAssetTypeCategorys(res.results?.results);
            setTotalRecord(res.results.totalResults);
        }
    };

    const onClickUpdate = (values) => {
        setAssetId(values.id);
        setIsOpenUpdate(true);
    };

    const onDeleteAssetType = async (values) => {
        const res = await _unitOfWork.assetType.deleteAssetType({
            id: values.id,
        });
        if (res && res.code === 1) {
            if (assetTypeCategorys.length === 1 && page > 1) {
                setPage(1);
            } else {
                fetchGetListAsset();
            }
        }
    };
    const onUpdateStatus = async (record, checked) => {
        const res = await _unitOfWork.assetTypeCategory.updateAssetTypeCategoryStatus({
            data: { id: record.id, status: checked },
        });
        if (res && res.code === 1) {
            fetchGetListAsset();
        }
    };

    const onSearch = () => {
        pagination.page = 1;
        fetchGetListAsset();
    };

    const resetSearch = () => {
        searchForm.resetFields();
        fetchGetListAsset();
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
            width: "60px",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: "Tên loại thiết bị",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                    unCheckedChildren="x"
                    onChange={(checked) =>
                        Comfirm("Xác nhận thay đổi trạng thái ?", () =>
                            onUpdateStatus(record, checked)
                        )
                    } // Call the function to update status
                />
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (_, record) => (
                <div>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onClickUpdate(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            className="ml-2"
                            onClick={() =>
                                Comfirm("Xác nhận xóa ?", () => onDeleteAssetType(record))
                            }
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="p-3">
            <Form
labelWrap
                className="search-form"
                form={searchForm}
                layout="vertical"
                onFinish={onSearch}
            >
                <Row gutter={32}>
                    <Col span={6}>
                        <Form.Item id="" label="Loại thiết bị" name="name">
                            <Input placeholder="Nhập loại thiết bị "></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="mb-1">
                    <Col span={12}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            Tìm kiếm
                        </Button>
                        <Button className="bt-green mr-2" onClick={resetSearch}>
                            <RedoOutlined />
                            Làm mới
                        </Button>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                            key="1"
                            type="primary"
                            onClick={() => setIsOpenCreate(true)}
                            className="ml-3"
                        >
                            <PlusOutlined />
                            Thêm mới
                        </Button>
                    </Col>
                </Row>
                <Table
                    rowKey="id"
                    columns={columns}
                    key={"id"}
                    dataSource={assetTypeCategorys}
                    bordered
                    pagination={false}
                ></Table>
                <Pagination
                    className="pagination-table mt-2"
                    onChange={onChangePagination}
                    pageSize={pagination.limit}
                    total={totalRecord}
                    current={page}
                />
            </Form>
            <CreateAssetTypeCategory
                open={isOpenCreate}
                handleCancel={() => setIsOpenCreate(false)}
                handleOk={() => setIsOpenCreate(false)}
                onRefresh={fetchGetListAsset}
            />
            <UpdateAssetTypeCategory
                open={isOpenUpdate}
                handleCancel={() => setIsOpenUpdate(false)}
                handleOk={() => setIsOpenUpdate(false)}
                id={assetId}
                onRefresh={fetchGetListAsset}
            />

        </div>
    );
}
