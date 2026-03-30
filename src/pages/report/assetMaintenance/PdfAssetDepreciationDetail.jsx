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
import { formatMillisToHHMM, formatMillisToHHMMSS, parseDate, parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { assetMaintenanceStatus, assetType, priorityLevelStatus, progressStatus, ticketStatuOptions } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";

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
    tableNum: {
        flex: 1,
        padding: 4,
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "#000",
        alignItems: "flex-end",
    }
});

const checkData = (value) => {
    return value ? value : "--";
}

const PdfAssetDepreciationDetail = ({ data }) => {
    const { t } = useTranslation();
    const formatNumber = (amount) => {
        if (typeof amount !== 'number' && typeof amount !== 'string') return null;
        const numberValue = parseFloat(amount);
        if (isNaN(numberValue)) return null;

        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2, // Không hiển thị số thập phân
            maximumFractionDigits: 2  // Không hiển thị số thập phân
        }).format(numberValue);
    };
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image src={logo} style={styles.logo} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t("Chi tiết khấu hao tài sản")}</Text>
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
                                {checkData(data?.assetName)}
                            </Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.serial")}
                            </Text>
                        </View>
                        <View style={styles.tableLabel}>
                            <Text>{checkData(data?.serial)}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns.origin_value")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.originValue))}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("report.assetDepreciation.columns_detail.monthly_depreciation_value")}
                        </Text>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_1")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_1 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_2")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_2 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_3")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_3 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_4")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_4 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_5")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_5 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_6")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_6 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_7")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_7 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_8")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_8 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_9")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_9 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_10")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_10 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_11")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_11 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.month_12")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.month_12 || 0))}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableLabel}>
                            <Text style={styles.bold}>
                                {t("report.assetDepreciation.columns_detail.total")}
                            </Text>
                        </View>
                        <View style={styles.tableNum}>
                            <Text>
                                {checkData(formatNumber(data?.depreciationMonths?.total || 0))}
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
export default PdfAssetDepreciationDetail;