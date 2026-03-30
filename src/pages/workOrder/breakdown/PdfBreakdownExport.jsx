import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font
} from "@react-pdf/renderer";
import { parseDateDDMMYYYY } from "../../../helper/date-helper";
import logo from "../../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
Font.register({
    family: "Roboto",
    src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxP.ttf",
});

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 10, fontFamily: "Roboto", },
    title: { textAlign: "center", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    sectionTitle: {
        backgroundColor: "#005b96",
        color: "white",
        padding: 4,
        fontWeight: "bold",
        fontSize: 13,
        marginTop: 10,
        textAlign: "center",
    },
    table: { display: "table", width: "100%", marginTop: 4 },
    tableRow: { flexDirection: "row" },
    tableCol: { border: "1 solid #ccc", padding: 4, flexGrow: 1 },
    bold: { fontWeight: "bold" },
    logo: { width: 80, height: 30, marginBottom: 10 },
});

const PdfBreakdownExport = ({ data }) => {
    const { t } = useTranslation();
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Image src={logo} style={styles.logo} />
                    <View>
                        <Text style={styles.title}>{t("breakdown.pdf.title")}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 10 }}>{t("breakdown.pdf.company_name_label")}: {data.assetMaintenance?.assetMaintenance?.customer?.customerName}</Text>
                        <Text>{t("breakdown.pdf.company_address")}: {data.assetMaintenance?.assetMaintenance?.customer?.addressOne}</Text>
                        <Text>{t("breakdown.pdf.company_phone")}: {data?.assetMaintenance?.customer?.contactNumber}</Text>
                        <Text>{t("breakdown.pdf.company_email")}: {data?.assetMaintenance?.customer?.contactEmail}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>{t("breakdown.pdf.customer_details")}</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.customer_name")}</Text>
                        <Text style={styles.tableCol}>{data.assetMaintenance?.assetMaintenance?.customer?.customerName}</Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.gst_number")}</Text>
                        <Text style={styles.tableCol}>{data.gstNumber}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.email")}</Text>
                        <Text style={styles.tableCol}> {data?.assetMaintenance?.customer?.contactEmail}</Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.phone")}</Text>
                        <Text style={styles.tableCol}>{data?.assetMaintenance?.customer?.contactNumber}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.address")}</Text>
                        <Text style={styles.tableCol}>{data.assetMaintenance?.assetMaintenance?.customer?.addressOne}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>{t("breakdown.pdf.request_info")}</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.code")}</Text>
                        <Text style={styles.tableCol}>{data?.code}</Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.severity")}</Text>
                        <Text style={styles.tableCol}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.open_date")}</Text>
                        <Text style={styles.tableCol}> {parseDateDDMMYYYY(data?.createdAt)}</Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.open_by")}</Text>
                        <Text style={styles.tableCol}>{data?.createdBy?.fullName}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.defect")}</Text>
                        <Text style={styles.tableCol}>{data?.breakdownDefect?.name}</Text>
                        <Text style={[styles.tableCol, styles.bold]}></Text>
                        <Text style={styles.tableCol}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.completion_date")}</Text>
                        <Text style={styles.tableCol}></Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.total_time_consumed")}</Text>
                        <Text style={styles.tableCol}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.response_time")}</Text>
                        <Text style={styles.tableCol}></Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.resolve_time")}</Text>
                        <Text style={styles.tableCol}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.assignee_comments")}</Text>
                        <Text style={styles.tableCol}></Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.down_time_resolve_time")}</Text>
                        <Text style={styles.tableCol}></Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>{t("breakdown.pdf.asset_details")}</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.asset")}</Text>
                        <Text style={styles.tableCol}>{data.assetMaintenance?.assetMaintenance?.assetModel?.asset?.assetName}</Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.model")}</Text>
                        <Text style={styles.tableCol}>{data.assetMaintenance?.assetMaintenance?.assetModel?.assetModelName}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.asset_number")}</Text>
                        <Text style={styles.tableCol}>{data.assetMaintenance?.assetMaintenance?.assetModel?.assetNumber}</Text>
                        <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.serial_number")}</Text>
                        <Text style={styles.tableCol}> {data.assetMaintenance?.assetMaintenance?.assetModel?.serial}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>{t("breakdown.pdf.service_details")}</Text>
                {data.breakdownAssignUsers.map((item, idx) => (
                    <View key={idx}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.engineer_name")}</Text>
                            <Text style={styles.tableCol}>{item?.user?.fullName}</Text>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.task_status")}</Text>
                            <Text style={styles.tableCol}>{item.status}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.problem_summary")}</Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.original_bank")}</Text>
                            <Text style={styles.tableCol}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.solution")}</Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.notes")}</Text>
                            <Text style={styles.tableCol}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.recognized_by")}</Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.time_logged_in")}</Text>
                            <Text style={styles.tableCol}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.login_time")}</Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.logout_time")}</Text>
                            <Text style={styles.tableCol}></Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.solution")}</Text>
                            <Text style={styles.tableCol}></Text>
                            <Text style={[styles.tableCol, styles.bold]}>{t("breakdown.pdf.checkout_comments")}</Text>
                            <Text style={styles.tableCol}></Text>
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default PdfBreakdownExport;