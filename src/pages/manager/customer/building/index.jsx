import { useEffect, useState } from "react";
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
import Createbuilding from "./CreateBuilding";
import Updatebuilding from "./UpdateBuilding";
import { PAGINATION } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import BulkUploadModal from "../../../../components/modal/BulkUpload";
import useHeader from "../../../../contexts/headerContext";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import { read, utils } from "xlsx";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import ShowError from "../../../../components/modal/result/errorNotification";
import DialogModal from "../../../../components/modal/result/DialogNotification";

export default function Building() {
    const { t } = useTranslation();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [buildings, setBuildings] = useState([]);
    const [buildingId, setBuildingId] = useState([]);
    const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
    const { setHeaderTitle } = useHeader();
    const [searchForm] = Form.useForm();
    const { permissions } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [modalType, setModalType] = useState("error");

    // useEffect(() => {
    //     setHeaderTitle(t("building.list.title"));
    // }, [t, setHeaderTitle]);

    useEffect(() => {
        fetchGetListBuilding();
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

    const fetchGetListBuilding = async () => {
        let payload = {
            page: page,
            limit: PAGINATION.limit,
            ...searchForm.getFieldsValue(),
        };
        const res = await _unitOfWork.building.getListBuildings(payload);

        if (res && res.results && res.results?.results) {
            setBuildings(res.results?.results);
            setTotalRecord(res.results.totalResults);
        }
    };

    const onClickUpdate = (values) => {
        setBuildingId(values.id);
        setIsOpenUpdate(true);
    };

    const onDeleteCategory = async (values) => {
        try {
            const res = await _unitOfWork.building.deleteBuilding({
                id: values.id,
            });
            if (res && res.code === 1) {
                message.success(t("building.messages.delete_success"));
                fetchGetListBuilding();
            }
        } catch {
            message.error(t("building.messages.delete_error"));
        }
    };

    const onSearch = () => {
        setPage(1);
        fetchGetListBuilding();
    };

    const resetSearch = () => {
        setPage(1);
        searchForm.resetFields();
        fetchGetListBuilding();
    };

    // const createBuildings = async (value) => {
    //     try {
    //         const res = await _unitOfWork.building.createBuilding(value);
    //         if (res) {
    //             message.success(t("building.create.success_message"));
    //         } else {
    //             message.error(t("building.messages.create_error"));
    //         }
    //     } catch {
    //         message.error(t("building.messages.create_error"));
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
    //                 !Object.keys(jsonData[0]).includes(t("building.form.fields.building_name", { lng: "vi" }) /* fallback check */) &&
    //                 !Object.keys(jsonData[0]).includes("Tên toà nhà")
    //             ) {
    //                 message.error("File dữ liệu không hợp lệ.");
    //                 return;
    //             }

    //             for (const row of jsonData) {
    //                 const name =
    //                     row["Tên toà nhà"] ||
    //                     row[t("building.form.fields.building_name")] ||
    //                     row["Building Name"];
    //                 if (name) {
    //                     await createBuildings({ buildingName: name });
    //                 }
    //             }

    //             setOpenBulkUpload(false);
    //             fetchGetListBuilding();
    //         } catch (error) {
    //             message.error("Lỗi khi đọc file Excel.");
    //         }
    //     };

    //     reader.readAsArrayBuffer(file);
    // };

    const handleUpload = async (file, note) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("note", note);
        // console.log("file, note", file, note);
        let res = await _unitOfWork.building.uploadBuildingExcel(
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
        fetchGetListBuilding();
        setOpenBulkUpload(false);
    };

    const columns = [
        {
            title: t("building.export.index"),
            dataIndex: "id",
            key: "id",
            width: "5%",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("building.list.table.name"),
            dataIndex: "buildingName",
            key: "name",
            align: "center",
            className: "text-left-column",
        },
        {
            title: t("building.table.action", { defaultValue: "Action" }),
            dataIndex: "action",
            width: "10%",
            align: "center",
            render: (_, record) => (
                <div>
                    {checkPermission(
                        permissions,
                        permissionCodeConstant.building_update
                    ) && (
                            <Tooltip title={t("building.actions.edit")}>
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
                        permissionCodeConstant.building_delete
                    ) && (
                            <Tooltip title={t("building.actions.delete")}>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    className="ml-2"
                                    onClick={() =>
                                        Comfirm(
                                            t("building.messages.confirm_delete"),
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
                            label={t("building.list.search.name_label")}
                            name="buildingName"
                        >
                            <Input
                                placeholder={t(
                                    "building.list.search.placeholder_name"
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
                            permissionCodeConstant.building_bulk_upload
                        ) && (
                                <Button
                                    onClick={() => setOpenBulkUpload(true)}
                                    className="mr-2"
                                >
                                    <UploadOutlined />
                                    {t("building.actions.bulk_upload")}
                                </Button>
                            )}
                        {checkPermission(
                            permissions,
                            permissionCodeConstant.building_create
                        ) && (
                                <Button
                                    type="primary"
                                    onClick={() => setIsOpenCreate(true)}
                                >
                                    <PlusOutlined />
                                    {t("building.form.buttons.submit_create")}
                                </Button>
                            )}
                    </Col>

                    <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
                        <b>{t("building.list.total", { count: totalRecord })}</b>
                    </Col>
                </Row>

                <Table
                    rowKey="id"
                    columns={columns}
                    key={"id"}
                    dataSource={buildings}
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
            <Createbuilding
                open={isOpenCreate}
                handleCancel={() => setIsOpenCreate(false)}
                handleOk={() => setIsOpenCreate(false)}
                onRefresh={fetchGetListBuilding}
            />
            <Updatebuilding
                open={isOpenUpdate}
                handleCancel={() => setIsOpenUpdate(false)}
                handleOk={() => setIsOpenUpdate(false)}
                id={buildingId}
                onRefresh={fetchGetListBuilding}
            />
            <BulkUploadModal
                open={isOpenBulkUpload}
                onCancel={() => setOpenBulkUpload(false)}
                onUpload={handleUpload}
                templateUrl="/file/templateBuilding.xlsx"
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