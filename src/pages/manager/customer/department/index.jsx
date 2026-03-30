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
import CreateDepartment from "./CreateDepartment";
import UpdateDepartment from "./UpdateDepartment";
import { PAGINATION, STORAGE_KEY } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import Comfirm from "../../../../components/modal/Confirm";
import BulkUploadModal from "../../../../components/modal/BulkUpload";
import useHeader from "../../../../contexts/headerContext";
import useAuth from "../../../../contexts/authContext";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import ShowError from "../../../../components/modal/result/errorNotification";
import DialogModal from "../../../../components/modal/result/DialogNotification";

export default function Department() {
    const { t } = useTranslation();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(PAGINATION);
    const [totalRecord, setTotalRecord] = useState(0);
    const [Departments, setDepartments] = useState([]);
    const [DepartmentId, setDepartmentId] = useState([]);
    const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
    const { setHeaderTitle } = useHeader();
    const [searchForm] = Form.useForm();
    const { permissions } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [modalType, setModalType] = useState("error");
    const companySetting = JSON.parse(
        localStorage.getItem(STORAGE_KEY.COMPANY_SETTING),
    );

    useEffect(() => {
        fetchGetListDepartment();
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

    const fetchGetListDepartment = async () => {
        console.log(companySetting);
        let payload = {
            page: page,
            limit: PAGINATION.limit,
            ...searchForm.getFieldsValue(),
        };
        const res = await _unitOfWork.department.getListDepartments(payload);
        if (res && res.results && res.results?.results) {
            setDepartments(res.results?.results);
            setTotalRecord(res.results.totalResults);
        }
    };

    const onClickUpdate = (values) => {
        setDepartmentId(values.id);
        setIsOpenUpdate(true);
    };

    const onDeleteCategory = async (values) => {
        try {
            const res = await _unitOfWork.department.deleteDepartment({
                id: values.id,
            });
            if (res && res.code === 1) {
                fetchGetListDepartment();
                message.success(t("department.messages.delete_success"));
            }
        } catch {
            message.error(t("department.messages.delete_error"));
        }
    };

    const onSearch = () => {
        pagination.page = 1;
        fetchGetListDepartment();
    };

    const resetSearch = () => {
        pagination.page = 1;
        searchForm.resetFields();
        fetchGetListDepartment();
    };

    // const createDepartments = async (value) => {
    //     try {
    //         const res = await _unitOfWork.department.createDepartment(value);
    //         if (res && res.code === 1) {
    //             message.success(t("department.create.success_message"));
    //         } else {
    //             message.error(t("department.messages.create_error"));
    //         }
    //     } catch {
    //         message.error(t("department.messages.create_error"));
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
    //                     Object.keys(jsonData[0]).includes("Tên phòng ban") ||
    //                     Object.keys(jsonData[0]).includes("Department Name")
    //                 )
    //             ) {
    //                 message.error(t("department.messages.invalid_file"));
    //                 return;
    //             }

    //             let imported = 0;
    //             for (const row of jsonData) {
    //                 const name =
    //                     row["Tên phòng ban"] ||
    //                     row["Department Name"] ||
    //                     row[t("department.form.fields.department_name")];
    //                 if (name) {
    //                     await createDepartments({ departmentName: name });
    //                     imported += 1;
    //                 }
    //             }
    //             message.success(
    //                 t("department.messages.import_success", { count: imported })
    //             );
    //             setOpenBulkUpload(false);
    //             fetchGetListDepartment();
    //         } catch (error) {
    //             message.error(t("department.messages.import_error"));
    //         }
    //     };
    //     reader.readAsArrayBuffer(file);
    // };

    const handleUpload = async (file, note) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("note", note);
        // console.log("file, note", file, note);
        let res = await _unitOfWork.department.uploadDepartmentExcel(
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
        fetchGetListDepartment();
        setOpenBulkUpload(false);
    };

    const columns = [
        {
            title: t("department.export.index"),
            dataIndex: "id",
            key: "id",
            width: "5%",
            align: "center",
            render: (_text, _record, index) =>
                (page - 1) * PAGINATION.limit + index + 1,
        },
        {
            title: t("department.list.table.name"),
            dataIndex: "departmentName",
            key: "name",
            align: "center",
            className: "text-left-column",
        },
        companySetting?.filterByAccount && {
            title: t("department.list.table.permission_view_asset"),
            dataIndex: "allowViewAll",
            align: "center",
            render: (text) => <span>{text === true ? t("department.list.all_views_are_allowed") : t("department.list.departmental_views_only")}</span>
        },
        {
            title: t("department.table.action", { defaultValue: "Action" }),
            dataIndex: "action",
            width: "10%",
            align: "center",
            render: (_, record) => (
                <div>
                    {checkPermission(
                        permissions,
                        permissionCodeConstant.department_update
                    ) && (
                            <Tooltip title={t("department.actions.edit")}>
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
                        permissionCodeConstant.department_delete
                    ) && (
                            <Tooltip title={t("department.actions.delete")}>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    className="ml-2"
                                    onClick={() =>
                                        Comfirm(
                                            t("department.messages.confirm_delete"),
                                            () => onDeleteCategory(record)
                                        )
                                    }
                                />
                            </Tooltip>
                        )}
                </div>
            ),
        },
    ].filter(Boolean);

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
                            label={t("department.list.search.name_label")}
                            name="departmentName"
                        >
                            <Input
                                placeholder={t(
                                    "department.list.search.placeholder_name"
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
                            permissionCodeConstant.department_bulk_upload
                        ) && (
                                <Button
                                    onClick={() => setOpenBulkUpload(true)}
                                    className="ml-3"
                                >
                                    <UploadOutlined />
                                    {t("department.actions.bulk_upload")}
                                </Button>
                            )}
                        {checkPermission(
                            permissions,
                            permissionCodeConstant.department_create
                        ) && (
                                <Button
                                    type="primary"
                                    onClick={() => setIsOpenCreate(true)}
                                    className="ml-3"
                                >
                                    <PlusOutlined />
                                    {t("department.form.buttons.submit_create")}
                                </Button>
                            )}
                    </Col>
                    <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
                        <b>{t("department.list.total", { count: totalRecord })}</b>
                    </Col>
                </Row>

                <Table
                    rowKey="id"
                    columns={columns}
                    key={"id"}
                    dataSource={Departments}
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
            <CreateDepartment
                open={isOpenCreate}
                handleCancel={() => setIsOpenCreate(false)}
                handleOk={() => setIsOpenCreate(false)}
                onRefresh={fetchGetListDepartment}
            />
            <UpdateDepartment
                open={isOpenUpdate}
                handleCancel={() => setIsOpenUpdate(false)}
                handleOk={() => setIsOpenUpdate(false)}
                id={DepartmentId}
                onRefresh={fetchGetListDepartment}
            />
            <BulkUploadModal
                open={isOpenBulkUpload}
                onCancel={() => setOpenBulkUpload(false)}
                onUpload={handleUpload}
                templateUrl="/file/templateDepartment.xlsx"
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