import { Card, Modal, Pagination, Table } from "antd";
import { useTranslation } from "react-i18next";
import { PAGINATION, stockLocationCode } from "../../utils/constant";
import { render } from "@testing-library/react";
import { parseDateDDMMYYYY } from "../../helper/date-helper";
import { parsePriceVnd } from "../../helper/price-helper";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";

function ModelDetailStock({ open, handleCancel, data }) {
    const { t } = useTranslation();
    const [headerTitle, setHeaderTitle] = useState();
    const [dataDetail, setDataDetail] = useState([]);
    const [pagination, setPagination] = useState(PAGINATION);
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);


    useEffect(() => {
        if (open) {

            const header = data?.sparePartInfo?.sparePartsName ??
                data?.asset?.assetName + data?.assetModelInfo?.assetModelName ??
                "";
            setHeaderTitle(header)
            fetchDataDetail();
        }
    }, [open, page])

    useEffect(() => {
        const totalPages = Math.ceil(totalRecord / pagination.limit);
        if (page > totalPages) {
            setPage(totalPages || 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalRecord])

    const onChangePagination = (value) => {
        setPage(value);
    };

    const fetchDataDetail = async () => {
        const payload = {
            itemId: data.sparePartId || data?.assetModelId,
            itemType: data.sparePartId ? "SpareParts" : "AssetModel",
            page: page,
            limit: PAGINATION.limit,
            locationId: data.locationId,
        }
        const res = await _unitOfWork.inventory.getInventoryDetail(
            payload
        )
        if (res?.results) {
            setDataDetail(res?.results);
            setTotalRecord(res?.totalResults);

        }
    }

    const columns = [
        {
            title: "Hành động",
            dataIndex: "key",
            render: (_, record) => {
                if (!!record.stockReceipt) {
                    return <span>{t("Nhập kho")}</span>
                }
                if (!!record.stockIssue && record.locationDest?.code === stockLocationCode.VIRTUAL_MAIN) {
                    return <span>{t("Xuất kho thanh lý")}</span>
                }
                if (!!record.stockIssue && record.locationDest?.code === stockLocationCode.VIRTUAL_USE) {
                    return <span>{t("Xuất kho sử dụng")}</span>
                }
                if (record.locationDest?.usage === "INTERNAL" && record.location === "INTERNAL") {
                    return <span>{t("Điều chuyển kho")}</span>
                }
            }
        },
        {
            title: "Người thao tác",
            dataIndex: ["createdBy", "fullName"],
        },
        {
            title: "Ngày",
            dataIndex: "createdAt",
            align: "center",
            render: (text) => (
                <span>{parseDateDDMMYYYY(text)}</span>
            )

        },
        {
            title: "Nhập",
            dataIndex: "productDoneQty",
            align: "right",

            render: (text, record) =>
                record.locationDest?.usage === 'INTERNAL'
                    ? <span>{text}</span>
                    : 0



        },
        {
            title: "Xuất",
            dataIndex: "productDoneQty",
            align: "right",

            render: (text, record) =>
                record.locationDest?.usage === 'INTERNAL'
                    ? <span>0</span>
                    : <span>{text}</span>

        },
        {
            title: "Đơn giá",
            dataIndex: "unitPrice",
            align: "right",
            render: (text) => (
                <span>{parsePriceVnd(text)}</span>
            )
        },
        {
            title: "Thành tiền",
            dataIndex: "total",
            align: "right",
            render: (_, record) => (
                <span>
                    {parsePriceVnd(
                        Number(record.unitPrice || 0) * Number(record.productDoneQty || 0)
                    )}
                </span>
            )

        },

    ]
    return (
        <>
            <Modal
                open={open}
                onCancel={handleCancel}
                className="custom-modal"
                closable={true}
                footer={null}
                width={800}
            >

                <Card title={"Chi tiết tồn kho: " + headerTitle}>
                    <Table
                        rowKey="_id"
                        columns={columns}
                        key={"id"}
                        dataSource={dataDetail}
                        bordered
                        // pagination={{
                        //     pageSize: 10,
                        //     showSizeChanger: true,
                        //     pageSizeOptions: [10, 20, 50, 100],
                        //     // showTotal: (total) => `Tổng ${total} dòng`,
                        // }}
                        pagination={false}
                    />
                    <Pagination
                        className="pagination-table mt-2"
                        onChange={onChangePagination}
                        pageSize={pagination.limit}
                        total={totalRecord}
                    />
                </Card>

            </Modal>
        </>
    );
}

export default ModelDetailStock;