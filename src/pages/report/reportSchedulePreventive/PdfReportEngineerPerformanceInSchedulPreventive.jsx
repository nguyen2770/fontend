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
import logo from "../../../assets/images/logo.png";
import robotoRegular from "../../../utils/font/Roboto-Regular.ttf";
import robotoBold from "../../../utils/font/Roboto-Bold.ttf";
import { formatMillisToHHMM, formatMillisToHHMMSS, parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { assetMaintenanceStatus, assetType, breakdownUserStatus, priorityLevelStatus, progressStatus, schedulePreventiveTaskAssignUserStatus, ticketStatuOptions } from "../../../utils/constant";
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
        width: 60,
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
});

const checkData = (value) => {
    return value ? value : "--";
}

const PdfReportEngineerPerformanceInSchedulePreventive = ({ data }) => {
    const { t } = useTranslation();
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image src={logo} style={styles.logo} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t("Công việc của kỹ sư")}</Text>
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
                            {t("Chi tiết người dùng")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("report.engineerBreakdown.columns.user")}
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

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("breakdown.pdf.request_info")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("report.engineerSchedulePreventive.columns.code")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.schedulePreventive?.code)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("report.processingBreakdown.detail_columns.status")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {t(parseToLabel(schedulePreventiveTaskAssignUserStatus.Options, data?.status))}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.opened_at")}
                            </Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>{checkData(parseDateHH(data?.createdAt))}</Text>
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
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>{t("report.engineerSchedulePreventive.columns.time_used")}</Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>{checkData(formatMillisToHHMMSS(data?.totalTimeCosumed))}</Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>{t("report.engineerSchedulePreventive.columns.planned_time")}</Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>{checkData(formatMillisToHHMM(data?.totalPlanningHours))}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
export default PdfReportEngineerPerformanceInSchedulePreventive;