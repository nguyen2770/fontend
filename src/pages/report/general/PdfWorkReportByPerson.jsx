import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import logo from "../../../assets/images/logo2.png";
import robotoRegular from "../../../utils/font/Roboto-Regular.ttf";
import robotoBold from "../../../utils/font/Roboto-Bold.ttf";
import { parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { assetMaintenanceStatus, assetType, calibrationWorkStatus, jobSummaryType, priorityLevelStatus, priorityType, progressStatus, schedulePreventiveStatus, ticketStatuOptions } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import { rootURL } from "../../../api/config";

Font.register({
    family: "Roboto-Regular",
    src: robotoRegular,
});

Font.register({
    family: "Roboto-Bold",
    src: robotoBold,
});

const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto-Regular",
        fontSize: 10,
        padding: 20,
        lineHeight: 1.4,
        backgroundColor: '#f7f7f7',
    },
    headerContainer: {
        flexDirection: "row",
        border: "1px solid #000",
        padding: 8,
        alignItems: "center",
    },
    logoContainer: {
        width: "30%",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        height: 40,
    },
    titleContainer: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontFamily: "Roboto-Bold",
        fontSize: 14,
    },
    companyInfo: {
        width: "30%",
        fontSize: 8,
    },
    bold: {
        fontFamily: "Roboto-Bold",
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        marginTop: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        flex: 1,
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "#000",
        padding: 4,
    },
    tableHeader: {
        fontFamily: "Roboto-Bold",
        backgroundColor: "#1976d2",
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        padding: 4,
    },
    tableLabel: {
        width: '25%',
        padding: 4,
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "#000",
    },
    sectionTitle: {
        marginTop: 20
    },
    textCenter: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    }
});

const checkData = (value) => {
    return value ? value : "--";
}


const PdfWorkReportByPersonExport = ({ data }) => {
    const { t } = useTranslation();
    const imageDocs = data.listDocuments.filter(d => d.isImage && d.base64);
    const fileDocs = data.listDocuments.filter(d => !d.isImage);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image src={logo} style={styles.logo} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t("Báo cáo công việc kỹ sư")}</Text>
                    </View>
                    <View style={styles.companyInfo}>
                        <Text>
                            {t("preventive.pdf.company_name_label")} :{" "}
                            <Text style={styles.bold}>
                                {t("preventive.pdf.company_name")}
                            </Text>
                        </Text>
                        <Text>{t("preventive.pdf.company_address")}</Text>
                        <Text>{t("preventive.pdf.company_phone")}</Text>
                        <Text>{t("preventive.pdf.company_email")}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("Thông tin kỹ sư")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.pdf.customer_name")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.user?.fullName)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.pdf.contact_email")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.user?.email)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("preventive.pdf.contact_phone")}
                            </Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>
                                {checkData(data?.user?.contactNo)}
                            </Text>
                        </View>
                    </View>
                </View>

                {data.jobType === jobSummaryType.BREAKDOWN && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.tableHeader]}>
                                {t("breakdown.viewTabs.general.sections.asset")}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.manufacturer")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.breakdown?.assetMaintenance?.assetModel?.manufacturer?.manufacturerName)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.category")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.breakdown?.assetMaintenance?.assetModel?.category?.categoryName)}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.type")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.breakdown?.assetMaintenance?.assetModel?.assetTypeCategory?.name)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.asset_style")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(assetType.Options.find(
                                        (item) =>
                                            item.value === data?.breakdown?.assetMaintenance?.assetStyle
                                    )?.label || "")}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.asset_name")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(data?.breakdown?.assetMaintenance?.assetName)}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.model")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(data?.breakdown?.assetMaintenance?.assetModel?.assetModelName)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.serial")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.breakdown?.assetMaintenance?.serial)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.defect")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.breakdown?.breakdownDefect?.name)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {data.jobType === jobSummaryType.CALIBRATION_WORK && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.tableHeader]}>
                                {t("breakdown.viewTabs.general.sections.asset")}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.manufacturer")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.calibrationWork?.assetMaintenance?.assetModel?.manufacturer?.manufacturerName)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.category")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.calibrationWork?.assetMaintenance?.assetModel?.category?.categoryName)}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.type")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.calibrationWork?.assetMaintenance?.assetModel?.assetTypeCategory?.name)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.asset_style")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(assetType.Options.find(
                                        (item) =>
                                            item.value === data?.calibrationWork?.assetMaintenance?.assetStyle
                                    )?.label || "")}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.asset_name")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(data?.calibrationWork?.assetMaintenance?.assetName)}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.model")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(data?.calibrationWork?.assetMaintenance?.assetModel?.assetModelName)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.serial")}
                                </Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>{checkData(data?.calibrationWork?.assetMaintenance?.serial)}</Text>
                            </View>
                            {/* <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.defect")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.calibrationWork?.breakdownDefect?.name)}</Text>
                            </View> */}
                        </View>
                    </View>
                )}

                {data.jobType === jobSummaryType.SCHEDULE_PREVENTIVE && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.tableHeader]}>
                                {t("breakdown.viewTabs.general.sections.asset")}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.manufacturer")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetModel?.manufacturer?.manufacturerName)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.category")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetModel?.category?.categoryName)}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.type")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetModel?.assetTypeCategory?.name)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.asset_style")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(assetType.Options.find(
                                        (item) =>
                                            item.value === data?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetStyle
                                    )?.label || "")}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.asset_name")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(data?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetName)}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.model")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(data?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.assetModel?.assetModelName)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.serial")}
                                </Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>{checkData(data?.schedulePreventiveTask?.schedulePreventive?.assetMaintenance?.serial)}</Text>
                            </View>
                            {/* <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.defect")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.schedulePreventiveTask?.schedulePreventive?.breakdownDefect?.name)}</Text>
                            </View> */}
                        </View>
                    </View>
                )}

                {data.jobType === jobSummaryType.BREAKDOWN && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.tableHeader]}>
                                {t("breakdown.pdf.request_info")}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.pdf.code")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.breakdown?.code)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("preventiveSchedule.view.labels.task_type")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(parseToLabel(jobSummaryType.Options, jobSummaryType.BREAKDOWN))}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.opened_at")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(parseDateHH(data?.breakdown?.createdAt))}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.status")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(ticketStatuOptions[
                                        data?.breakdown?.ticketStatus
                                            ? data?.breakdown?.ticketStatus.charAt(0).toUpperCase() +
                                            data?.breakdown?.ticketStatus.slice(1)
                                            : ""
                                    ] || data?.breakdown?.ticketStatus)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.pdf.priority")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(t(parseToLabel(priorityLevelStatus.Options, data?.breakdown?.priorityLevel)))}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.asset_status")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(t(parseToLabel(assetMaintenanceStatus.Options, data?.breakdown?.assetMaintenanceStatus)))}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>
                                    {t("breakdown.list.columns.deadline")}
                                </Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>
                                    {checkData(parseDateHH(data?.breakdown?.incidentDeadline))}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.description")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(data?.breakdown?.defectDescription)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>
                                    {t("breakdown.create.fields.service_category")}
                                </Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>
                                    {checkData(data?.breakdown?.serviceCategory?.serviceCategoryName)}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.pdf.response_time")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(parseDateHH(data?.breakdown?.responseTime))}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>
                                    {t("breakdown.pdf.completed_time")}
                                </Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>
                                    {checkData(parseDateHH(data?.completedDate))}
                                </Text>
                            </View>
                            {/* <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("preventiveSchedule.list.tooltips.downtime")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(parseDateHH(data?.breakdown?.responseTime))}
                                </Text>
                            </View> */}
                        </View>
                    </View>
                )}

                {data.jobType === jobSummaryType.CALIBRATION_WORK && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.tableHeader]}>
                                {t("calibrationWork.detail.title_job_information")}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.pdf.code")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.calibrationWork?.code)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("calibrationWork.detail.fields.calibration_name")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.calibrationWork?.calibrationName)}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("preventiveSchedule.view.labels.task_type")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(parseToLabel(jobSummaryType.Options, jobSummaryType.CALIBRATION_WORK))}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.opened_at")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(parseDateHH(data?.calibrationWork?.createdAt))}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.status")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(parseToLabel(calibrationWorkStatus.Options, data?.calibrationWork?.status))}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("calibrationWork.detail.fields.calibration_date")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(parseDateHH(data?.calibrationWork?.startDate))}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>{t("breakdown.pdf.priority")}</Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>{checkData(t(parseToLabel(priorityType.Option, data?.calibrationWork?.importance)))}</Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>{t("calibrationWork.detail.fields.result")}</Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>{checkData(data?.calibrationWork?.isPassed === true ? t("calibrationWork.detail.fields.pass")
                                    : data?.calibrationWork?.isPassed === false ? t("calibrationWork.detail.fields.fail")
                                        : null)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {data.jobType === jobSummaryType.SCHEDULE_PREVENTIVE && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.tableHeader]}>
                                {t("calibrationWork.detail.title_job_information")}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("breakdown.pdf.code")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.schedulePreventiveTask?.schedulePreventive?.code)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>{t("preventiveSchedule.history.task_name")}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(data?.schedulePreventiveTask?.taskName)}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("preventiveSchedule.view.labels.task_type")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {t(parseToLabel(jobSummaryType.Options, jobSummaryType.SCHEDULE_PREVENTIVE))}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.opened_at")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{checkData(parseDateHH(data?.schedulePreventiveTask?.schedulePreventive?.createdAt))}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.bold}>
                                    {t("breakdown.viewTabs.general.fields.status")}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>
                                    {checkData(t(parseToLabel(schedulePreventiveStatus.Options, data?.schedulePreventiveTask?.schedulePreventive?.status)))}
                                </Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text style={styles.bold}>{t("breakdown.pdf.priority")}</Text>
                            </View>
                            <View style={styles.tableLabel}>
                                <Text>{checkData(t(parseToLabel(priorityType.Option, data?.schedulePreventiveTask?.schedulePreventive?.importance)))}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* <View style={styles.sectionTitle}>
                    <Text style={styles.bold}>PHỤ LỤC: DANH MỤC HÌNH ẢNH ĐÍNH KÈM</Text>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={{ width: '10%', borderRight: '1pt solid #ffffff' }}>STT</Text>
                        <Text style={{ width: '90%' }}>Tên hình ảnh</Text>
                    </View>

                    {imageDocs.map((doc, idx) => (
                        <View key={idx} style={[styles.tableRow, { borderBottom: '0.5pt solid #504f4f' }]}>
                            <Text style={[{ width: '10%', padding: 5, borderRight: '1pt solid #000' }, styles.textCenter]}>{idx + 1}</Text>
                            <Text style={{ width: '90%', padding: 5 }}>
                                {doc.resource?.fileName}{doc.resource?.extension}
                            </Text>
                        </View>
                    ))}
                </View>
                {imageDocs.map((doc, idx) => (
                    <View
                        key={idx}
                        wrap={false}
                        style={{ marginTop: 10 }}
                    >
                        <Text style={{ marginBottom: 4 }}>
                            Hình {idx + 1}: {doc.resource?.fileName}{doc.resource?.extension}
                        </Text>

                        <Image
                            src={doc.base64}
                            style={{
                                width: '100%',
                                maxHeight: 350,
                                objectFit: 'contain',
                                border: '1pt solid #ccc',
                            }}
                        />
                    </View>
                ))}

                <View style={styles.sectionTitle}>
                    <Text style={styles.bold}>PHỤ LỤC: DANH MỤC TÀI LIỆU ĐÍNH KÈM</Text>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={{ width: '10%', borderRight: '1pt solid #fff' }}>STT</Text>
                        <Text style={{ width: '50%', borderRight: '1pt solid #fff' }}>Tên file</Text>
                        <Text style={{ width: '40%' }}>Đường dẫn tải xuống</Text>
                    </View>

                    {fileDocs.map((doc, index) => (
                        <View key={index} style={[styles.tableRow, { borderBottom: '0.5pt solid #504f4f' }]}>
                            <Text style={[{ width: '10%', padding: 5, borderRight: '1pt solid #000' }, styles.textCenter]}>{index + 1}</Text>
                            <Text style={{ width: '50%', padding: 5, borderRight: '1pt solid #000' }}>{doc.resource?.fileName}{doc.resource?.extension}</Text>
                            <View style={{ width: '40%', padding: 5 }}>
                                <Text
                                    style={{ color: 'blue', textDecoration: 'underline' }}
                                    src={`${rootURL}/files/${doc.relativePath}`}
                                >
                                    Tải về file
                                </Text>
                            </View>
                        </View>
                    ))}
                </View> */}
            </Page>
        </Document>
    );
};

export default PdfWorkReportByPersonExport;
