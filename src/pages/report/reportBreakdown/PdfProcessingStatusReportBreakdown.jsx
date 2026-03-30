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
import logo from "../../../assets/images/logo_cmms.png";
import robotoRegular from "../../../utils/font/Roboto-Regular.ttf";
import robotoBold from "../../../utils/font/Roboto-Bold.ttf";
import { formatMillisToHHMMSS, parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { assetMaintenanceStatus, assetType, priorityLevelStatus, progressStatus, ticketStatuOptions } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";

// Font.register({
//     family: "Roboto",
//     fonts: [{ src: robotoRegular, fontWeight: "normal" }, { src: robotoBold, fontWeight: "bold" }],
// });
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
    },
    headerContainer: {
        flexDirection: "row",
        border: "1px solid #000",
        padding: 8,
        alignItems: "center",
    },
    logoContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 120,
        marginLeft: 20,
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
});

const checkData = (value) => {
    return value ? value : "--";
}

const PdfProcessingStatusReportBreakdown = ({ data }) => {
    const { t } = useTranslation();
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image src={logo} style={styles.logo} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t("Tình hình xử lý sự cố")}</Text>
                    </View>
                    <View style={styles.companyInfo}>
                        <Text>
                            {t("preventive.pdf.company_name_label")} :{" "}
                            <Text style={styles.bold}>
                                {data.company.name}
                            </Text>
                        </Text>
                        <Text>
                            {t("preventive.pdf.company_address")}
                            <Text>
                                {data.company.address}
                            </Text>
                        </Text>
                        <Text>
                            {t("preventive.pdf.company_phone")}
                            <Text>
                                {data.company.phoneNumber}
                            </Text>
                        </Text>
                        <Text>
                            {t("preventive.pdf.company_email")}
                            <Text style={styles.bold}>
                                {data.company.email}
                            </Text>
                        </Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("assetMaintenance.list.title_info")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.list.table.asset_name")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.assetMaintenance?.assetName)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.list.table.model")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.assetMaintenance?.assetModelName)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.list.table.serial")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.assetMaintenance?.serial)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("assetMaintenance.list.table.asset_number")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.assetMaintenance?.asset_number)}
                            </Text>
                        </View>

                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("preventive.pdf.customer_detail")}
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
                                {checkData(data?.customer?.customerName)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.pdf.contact_email")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.customer?.contactEmail)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.pdf.contact_phone")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.customer?.contactNumber)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("preventive.pdf.address")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.customer?.addressTwo)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("breakdown.pdf.request_info")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("report.processingBreakdown.detail_columns.code")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.code)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("breakdown.pdf.priority")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {t(parseToLabel(priorityLevelStatus.Options, data?.priorityLevel))}
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
                            <Text>{checkData(parseDateHH(data?.createdAt))}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.status")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {t(ticketStatuOptions[
                                    data?.ticketStatus
                                        ? data?.ticketStatus.charAt(0).toUpperCase() +
                                        data?.ticketStatus.slice(1)
                                        : ""
                                ] || data?.ticketStatus)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("Chi tiết nội dung sự cố")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("report.processingBreakdown.detail_columns.opened_by")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.createdBy?.fullName)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("Email")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.createdBy?.email)}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableLabel]}>
                            <Text style={styles.bold}>
                                {t("report.processingBreakdown.detail_columns.description")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.defectDescription)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("Chỉ số thời gian")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("Thời gian bắt đầu")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(parseDateHH(data?.downtime?.startDate))}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("Thời gian kết thúc")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(parseDateHH(data?.downtime?.endDate))}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>{t("Downtime")}</Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>{checkData(formatMillisToHHMMSS(data?.downtime?.time))}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
export default PdfProcessingStatusReportBreakdown;