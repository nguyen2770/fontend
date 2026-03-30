import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import logo from "../../../assets/images/logo.png";
import robotoRegular from "../../../utils/font/Roboto-Regular.ttf";
import robotoBold from "../../../utils/font/Roboto-Bold.ttf";
import { useTranslation } from "react-i18next";

Font.register({
    family: "Roboto",
    fonts: [
        { src: robotoRegular },
        { src: robotoBold, fontWeight: "bold" }
    ]
});

const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        fontSize: 10,
        padding: 20,
        lineHeight: 1.4,
    },
    headerContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        paddingBottom: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    logoContainer: { width: "30%", justifyContent: "center", alignItems: "flex-start" },
    logo: { width: 100, height: "auto" },
    titleContainer: { width: "50%", justifyContent: "center", alignItems: "center" },
    title: { fontSize: 14, fontWeight: "bold" },
    companyInfo: { width: "30%", fontSize: 8 },
    bold: { fontWeight: "bold" },
    table: { display: "table", width: "auto", marginTop: 10 },
    tableRow: { flexDirection: "row" },
    tableColHeader: {
        flex: 1,
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#003366",
        borderWidth: 1,
        borderColor: "#fff",
    },
    tableCol: { flex: 1, padding: 4, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#fff" },
    tableCell: { fontSize: 8, textAlign: "left" },
    tableCellHeader: { fontSize: 8, fontWeight: "bold", color: "#fff", textAlign: "center" },
    rowEven: { backgroundColor: "#fffacd" },
    rowOdd: { backgroundColor: "#fffde7" },
});

const checkData = (value) => value ?? "--";
const getCellStyle = (value) => (!value || isNaN(value) ? { textAlign: "left" } : { textAlign: "right" });

const ExportPdfAssetMaintenance = ({ data, columns, summary }) => {
    const { t } = useTranslation();
    const PAGE_SIZE = 25; // số dòng mỗi page
    const chunks = [];
    for (let i = 0; i < data.length; i += PAGE_SIZE) {
        chunks.push(data.slice(i, i + PAGE_SIZE));
    }

    return (
        <Document>
            {chunks.map((chunk, pageIndex) => (
                <Page size="A4" style={styles.page} key={pageIndex}>
                    {/* Header page */}
                    <View style={styles.headerContainer} fixed>
                        <View style={styles.logoContainer}>
                            <Image src={logo} style={styles.logo} />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{t("report.assetMaintenanceReport.title")}</Text>
                        </View>
                    </View>

                    {/* Bảng tóm tắt */}
                    <View style={styles.table}>
                        {/* Header */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>{t("report.assetMaintenanceReport.summary_headers.customer")}</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>{t("report.assetMaintenanceReport.summary_headers.building")}</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>{t("report.assetMaintenanceReport.summary_headers.floor")}</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>{t("report.assetMaintenanceReport.summary_headers.department")}</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>{t("report.assetMaintenanceReport.columns.configured_count")}</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>{t("report.assetMaintenanceReport.columns.created_count")}</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>{t("report.assetMaintenanceReport.columns.assigned_count")}</Text>
                            </View>
                        </View>

                        {/* Data 1 dòng */}
                        <View style={[styles.tableRow, styles.rowEven]}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{summary?.customerCount}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{summary?.buildingCount}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{summary?.floorCount}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{summary?.departmentCount}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{summary?.totalConfigured}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{summary?.totalCreated}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{summary?.totalAssigned}</Text></View>
                        </View>
                    </View>

                    {/* Table */}
                    <View style={styles.table}>
                        {/* Table header */}
                        <View style={styles.tableRow}>
                            {columns.map((col, i) => (
                                <View key={i} style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>{col.title}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Table data */}
                        {chunk.map((row, rowIndex) => (
                            <View
                                key={rowIndex}
                                style={[
                                    styles.tableRow,
                                    rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd,
                                ]}
                            >
                                {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={styles.tableCol}>
                                        <Text style={[styles.tableCell, getCellStyle(row[col.dataIndex])]}>
                                            {checkData(row[col.dataIndex])}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </Page>
            ))}
        </Document>
    );
};

export default ExportPdfAssetMaintenance;