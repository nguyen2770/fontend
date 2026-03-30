import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    RedoOutlined,
    SearchOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Form,
    Input,
    message,
    Pagination,
    Row,
    Table,
    Tooltip,
} from "antd";
import CreateFloor from "./CreateFloor";
import UpdateFloor from "./UpdateFloor";
import { PAGINATION } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import BulkUploadModal from "../../../../components/modal/BulkUpload";
import useHeader from "../../../../contexts/headerContext";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import DialogModal from "../../../../components/modal/result/DialogNotification";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import ShowError from "../../../../components/modal/result/errorNotification";

export default function Floor() {
    const { t } = useTranslation();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [Floors, setFloors] = useState([]);
    const [FloorId, setFloorId] = useState([]);
    const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
    const { setHeaderTitle } = useHeader();
    const [searchForm] = Form.useForm();
    const { permissions } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [modalType, setModalType] = useState("error");

    // useEffect(() => {
    //     setHeaderTitle(t("floor.list.title"));
    // }, [t, setHeaderTitle]);

    useEffect(() => {
        fetchGetListFloor();
    }, [page]);

    useEffect(() => {
        const totalPages = Math.ceil(totalRecord / pagination.limit);
        if (page > totalPages) {
            setPage(totalPages || 1);
        }
    }, [totalRecord, page, pagination.limit]);

    const onChangePagination = (value) => {
        setPage(value);
    };

    const fetchGetListFloor = async () => {
        let payload = {
            page: page,
            limit: PAGINATION.limit,
            ...searchForm.getFieldsValue(),
        };
        const res = await _unitOfWork.floor.getListFloors(payload);

        if (res && res.results && res.results?.results) {
            setFloors(res.results?.results);
            setTotalRecord(res.results.totalResults);
        }
    };

    const onClickUpdate = (values) => {
        setFloorId(values.id);
        setIsOpenUpdate(true);
    };

    const onDeleteCategory = async (values) => {
        try {
            const res = await _unitOfWork.floor.deleteFloor({
                id: values.id,
            });
            if (res && res.code === 1) {
                fetchGetListFloor();
                message.success(t("floor.messages.delete_success"));
            }
        } catch {
            message.error(t("floor.messages.delete_error"));
        }
    };

    const onSearch = () => {
        pagination.page = 1;
        fetchGetListFloor();
    };

    const resetSearch = () => {
        pagination.page = 1;
        searchForm.resetFields();
        fetchGetListFloor();
    };

    // const createFoors = async (value) => {
    //     try {
    //         const res = await _unitOfWork.floor.createFloor(value);
    //         if (res && res.code === 1) {
    //             message.success(t("floor.create.success_message"));
    //         } else {
    //             message.error(t("floor.messages.create_error"));
    //         }
    //     } catch {
    //         message.error(t("floor.messages.create_error"));
    //     }
    // };

    // const handleUpload = async (file, _note) => {
    //     const reader = new FileReader();

    //     reader.onload = async (e) => {
    //         try {
    //             const data = new Uint8Array(e.target.result);
    //             const workbook = read(data, { type: "array" });

    //             const firstSheetName = workbook.SheetNames[0];
    //             const worksheet = workbook.Sheets[firstSheetName];

    //             const jsonData = utils.sheet_to_json(worksheet);

    //             if (
    //                 !jsonData.length ||
    //                 !(
    //                     Object.keys(jsonData[0]).includes("Tên tầng") ||
    //                     Object.keys(jsonData[0]).includes("Floor Name")
    //                 )
    //             ) {
    //                 message.error(t("floor.messages.invalid_file"));
    //                 return;
    //             }

    //             let imported = 0;
    //             for (const row of jsonData) {
    //                 const name =
    //                     row["Tên tầng"] ||
    //                     row["Floor Name"] ||
    //                     row[t("floor.form.fields.floor_name")];
    //                 if (name) {
    //                     await createFoors({ floorName: name });
    //                     imported += 1;
    //                 }
    //             }

    //             message.success(
    //                 t("floor.messages.import_success", { count: imported })
    //             );
    //             setOpenBulkUpload(false);
    //             fetchGetListFloor();
    //         } catch (_error) {
    //             message.error(t("floor.messages.import_error"));
    //         }
    //     };

    //     reader.readAsArrayBuffer(file);
    // };

    const handleUpload = async (file, note) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("note", note);
        // console.log("file, note", file, note);
        let res = await _unitOfWork.floor.uploadFloorExcel(
            formData
        );
        if (res && res.code === 1 && res.result.success) {
            ShowSuccess(
                "topRight",
                t("common.notifications"),
                t("common.messages.success.upload_count", { count: res?.result?.insertCount || 0 })
            );
            if (res?.result?.warnings) {
                setMessages(res?.result?.warnings);
                setModalType("warning")
                setIsModalOpen(true);
            }
        } else {
            ShowError(
                "topRight",
                t("common.notifications"),
                res?.message || t("common.messages.errors.upload_failed")
            );
            setMessages(res?.result?.errors);
            setModalType("error");
            setIsModalOpen(true);
        }
        fetchGetListFloor();
        setOpenBulkUpload(false);
    };

    const columns = [
        {
            title: t("floor.export.index"),
            dataIndex: "id",
            key: "id",
            width: "5%",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("floor.list.table.name"),
            dataIndex: "floorName",
            key: "name",
            align: "center",
            className: "text-left-column",
        },
        {
            title: t("floor.table.action", { defaultValue: "Action" }),
            dataIndex: "action",
            align: "center",
            width: "10%",
            render: (_, record) => (
                <div>
                    {checkPermission(
                        permissions,
                        permissionCodeConstant.floor_update
                    ) && (
                            <Tooltip title={t("floor.actions.edit")}>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    size="small"
                                    onClick={() => onClickUpdate(record)}
                                />
                            </Tooltip>
                        )}
                    {checkPermission(
                        permissions,
                        permissionCodeConstant.floor_delete
                    ) && (
                            <Tooltip title={t("floor.actions.delete")}>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    className="ml-2"
                                    onClick={() =>
                                        Comfirm(
                                            t("floor.messages.confirm_delete"),
                                            () => onDeleteCategory(record)
                                        )
                                    }
                                />
                            </Tooltip>
                        )}
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
                        <Form.Item
                            label={t("floor.list.search.name_label")}
                            name="floorName"
                        >
                            <Input
                                placeholder={t(
                                    "floor.list.search.placeholder_name"
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="mb-1">
                    <Col span={12}>
                        <Button type="primary" className="mr-2" htmlType="submit">
                            <SearchOutlined />
                            {t("common.buttons.search")}
                        </Button>
                        <Button className="bt-green mr-2" onClick={resetSearch}>
                            <RedoOutlined />
                            {t("common.buttons.reset")}
                        </Button>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        {checkPermission(
                            permissions,
                            permissionCodeConstant.floor_bulk_upload
                        ) && (
                                <Button
                                    onClick={() => setOpenBulkUpload(true)}
                                    className="ml-3"
                                >
                                    <UploadOutlined />
                                    {t("floor.actions.bulk_upload")}
                                </Button>
                            )}
                        {checkPermission(
                            permissions,
                            permissionCodeConstant.floor_create
                        ) && (
                                <Button
                                    type="primary"
                                    onClick={() => setIsOpenCreate(true)}
                                    className="ml-3"
                                >
                                    <PlusOutlined />
                                    {t("floor.form.buttons.submit_create")}
                                </Button>
                            )}
                    </Col>
                    <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
                        <b>{t("floor.list.total", { count: totalRecord })}</b>
                    </Col>
                </Row>

                <Table
                    rowKey="id"
                    columns={columns}
                    key={"id"}
                    dataSource={Floors}
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
            <CreateFloor
                open={isOpenCreate}
                handleCancel={() => setIsOpenCreate(false)}
                handleOk={() => setIsOpenCreate(false)}
                onRefresh={fetchGetListFloor}
            />
            <UpdateFloor
                open={isOpenUpdate}
                handleCancel={() => setIsOpenUpdate(false)}
                handleOk={() => setIsOpenUpdate(false)}
                id={FloorId}
                onRefresh={fetchGetListFloor}
            />
            <BulkUploadModal
                open={isOpenBulkUpload}
                onCancel={() => setOpenBulkUpload(false)}
                onUpload={handleUpload}
                templateUrl="/file/TemplateFloor.xlsx"
            />
            <DialogModal
                open={isModalOpen}
                handleOk={() => setIsModalOpen(false)}
                type={modalType}
                message={messages}
            />
        </div>
    );
}