import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  FileExcelFilled,
  MenuOutlined,
  QrcodeOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Row, message, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../../router/routerConfig";
import { PAGINATION } from "../../../../utils/constant";
import * as _unitOfWork from "../../../../api";
import CreateCustomer from "./CreateCustomer";
import UpdateCustomer from "./UpdateCustomer";
import Confirm from "../../../../components/modal/Confirm";
import CustomerListItem from "./CustomerListItem";
import CustomerGridItem from "./CustomerGridItem";
import BulkUploadModal from "../../../../components/modal/BulkUpload";
import { read, utils, write } from "xlsx";
import * as FileSaver from "file-saver";
import { useTranslation } from "react-i18next";

export default function Customer() {
  const navigate = useNavigate();
  const [view, setView] = useState("List");
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [Customers, setCustomers] = useState([]);
  const [CustomerId, setCustomerId] = useState([]);
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchGetListCustomer();
  }, [page]);

  useEffect(() => {
    const totalPages = Math.ceil(totalRecord / pagination.limit);
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalRecord]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetListCustomer = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
    };
    const res = await _unitOfWork.customer.getListCustomers(payload);

    if (res && res.results && res.results?.results) {
      const customersWithAvatar = await Promise.all(
        res.results.results.map(async (item) => {
          let avatarUrl = null;
          if (item.resourceId) {
            try {
              const response = await _unitOfWork.resource.getImage(
                item.resourceId
              );

              avatarUrl = response || null;
            } catch (error) {
              console.error("Lỗi khi lấy avatar", error);
            }
          }

          return { ...item, avatarUrl };
        })
      );

      setCustomers(customersWithAvatar);
      console.log("customers", customersWithAvatar);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onUpdateStatus = async (record, checked) => {
    const res = await _unitOfWork.customer.updateCustomerStatus({
      customer: { id: record, status: checked },
    });
    if (res && res.code === 1) {
      fetchGetListCustomer();
    }
  };

  const onClickUpdate = (values) => {
    setCustomerId(values);
    setIsOpenUpdate(true);
  };
  const onDeleteCustomer = async (values) => {
    try {
      const res = await _unitOfWork.customer.deleteCustomer({
        id: values,
      });
      if (res && res.code === 1) {
        fetchGetListCustomer();
        message.success(t("common.messages.success.successfully"));
      }
    } catch {
      message.error(t("common.messages.errors.failed"));
    }
  };

  const onLogMapping = () => {
    navigate(staticPath.viewBulkImportLogs);
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const handleUpload = async (file, note) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = utils.sheet_to_json(worksheet);

        for (const row of jsonData) {
          const firstName = row["firstName"];
          const lastName = row["lastName"];
          const contactEmail = row["email"];
          const contactNumber = row["phone"];
          const customerName = row["companyName"];
          const addressOne = row["addressOne"];

          if (
            firstName &&
            lastName &&
            contactEmail &&
            contactNumber &&
            customerName &&
            addressOne
          ) {
            await _unitOfWork.customer.createCustomer({
              firstName: firstName,
              lastName: lastName,
              contactEmail: contactEmail,
              contactNumber: contactNumber,
              customerName: customerName,
              addressOne: addressOne,
            });
          }
        }

        setOpenBulkUpload(false);
        fetchGetListCustomer();
      } catch (error) {
        message.error("Lỗi khi đọc file Excel.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const transformExportData = async (rawData, _unitOfWork) => {
    const transformedData = await Promise.all(
      rawData.map(async (item, index) => {
        const taxGroup = item.taxGroupId
          ? await _unitOfWork.taxGroup.getTaxGroupById({ id: item.taxGroupId })
          : null;

        const statusTextMap = {
          true: "Đang hoạt động",
          false: "Ngừng hoạt động",
        };
        const region = item.regionId
          ? await _unitOfWork.region.getRegionById({ id: item.regionId })
          : null;

        return {
          STT: index + 1,
          companyName: item.customerName,
          customerName: item.firstName + " " + item.lastName,
          contactEmail: item.contactEmail,
          contactNumber: item.contactNumber,
          status: statusTextMap[item.status] || "Không xác định",
          addressOne: item.addressOne,
          addressTwo: item.addressTwo,
          zipCode: item.zipCode,
          region: region?.name || "",
          taxGroup: taxGroup?.groupName || "",
          customerGSTNumber: item.customer_gst_number,
          createdAt: formatDate(item.createdAt),
          updatedAt: formatDate(item.updatedAt),
        };
      })
    );

    return transformedData;
  };

  const exportToCSV = async (csvData, fileName) => {
    const exportData = await transformExportData(csvData, _unitOfWork);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const ws = utils.json_to_sheet(exportData);

    const colWidths = Object.keys(exportData[0] || {}).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      return { wch: maxLength + 2 };
    });

    ws["!cols"] = colWidths;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <div className="content-manager">
      <div className="header-all justify-content-space-between">
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button className="button">
            <QrcodeOutlined />
            QR Code
          </Button>
          <Button className="button" onClick={() => setView("Grid")}>
            <AppstoreOutlined />
            Grid
          </Button>
          <Button className="button" onClick={() => setView("List")}>
            <UnorderedListOutlined />
            List
          </Button>
          <Button
            className="button"
            onClick={() => exportToCSV(Customers, "customers")}
          >
            <FileExcelFilled />
            Export as Excel
          </Button>
          <Button className="button" onClick={() => onLogMapping()}>
            <MenuOutlined />
            Import Logs
          </Button>
          <Button className="button" onClick={() => setOpenBulkUpload(true)}>
            <UploadOutlined />
            Bulk Upload
          </Button>
          <Button className="button" onClick={() => setIsOpenCreate(true)}>
            <UserAddOutlined />
            Add Customer
          </Button>
          <Tooltip title="Hỗ trợ" color="#616263">
            <QuestionCircleOutlined className="tooltip-help" />
          </Tooltip>
        </div>
      </div>

      {/* Chuyển chế độ */}
      <div className="table-container">
        {view === "List" ? (
          <div>
            {Customers.map((data) => (
              <CustomerListItem
                key={data._id}
                data={data}
                onClickUpdate={onClickUpdate}
                onDeleteCustomer={onDeleteCustomer}
                onUpdateStatus={onUpdateStatus}
                Confirm={Confirm}
                formatDate={formatDate}
              ></CustomerListItem>
            ))}
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {Customers.map((data) => (
              <CustomerGridItem
                key={data._id}
                data={data}
                onClickUpdate={onClickUpdate}
                onDeleteCustomer={onDeleteCustomer}
                onUpdateStatus={onUpdateStatus}
                Confirm={Confirm}
                formatDate={formatDate}
              ></CustomerGridItem>
            ))}
          </Row>
        )}
      </div>

      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={pagination.limit}
        total={totalRecord}
        current={page}
      />
      <CreateCustomer
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchGetListCustomer}
      />
      <UpdateCustomer
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        id={CustomerId}
        onRefresh={fetchGetListCustomer}
      />
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
        onUpload={handleUpload}
        templateUrl="/file/templateCustomer.xlsx"
      />
    </div>
  );
}
