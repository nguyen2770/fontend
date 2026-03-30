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

const PdfAssetPerformanceDetail = ({ data }) => {
    const { t } = useTranslation();
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image src={logo} style={styles.logo} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t("Chi tiết hiệu suất tài sản")}</Text>
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

                {/* <View style={styles.table}>
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
                </View> */}

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("breakdown.viewTabs.general.sections.asset")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.asset_name")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.asset?.assetName)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.model")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.assetModel?.assetModelName)}
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
                            <Text>{checkData(data?.serial)}</Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetPerformance.columns_detail.asset_number")}
                            </Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>{checkData(data?.assetNumber)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("Chi tiết")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("report.assetPerformance.columns_detail.ref_date")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(parseDateHH(data?.installationDate ? data?.installationDate : data?.createdAt))}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("report.assetPerformance.columns_summary.hours_available")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(formatMillisToHHMMSS(data?.totalHoursAvailable))}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("report.assetPerformance.columns_summary.actual_project_hours")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(formatMillisToHHMM(data?.totalDowntimeCheckinCheckout))}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("report.assetPerformance.columns_summary.breakdowns")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.totalBreakdowns)}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("report.assetPerformance.columns_summary.downtime_card")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(formatMillisToHHMM(data?.totalDowntime))}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("report.assetPerformance.columns_summary.availability")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.totalAvailability ? data?.totalAvailability.toFixed(2) : "0.00")}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("report.assetPerformance.columns_summary.mttr")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(formatMillisToHHMM(data?.totalMTTR))}</Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetPerformance.columns_summary.mtbf")}
                            </Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>{checkData(formatMillisToHHMM(data?.totalMTBF))}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
export default PdfAssetPerformanceDetail;