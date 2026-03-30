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
import dayjs from "dayjs";

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
        fontSize: 8,
        padding: 15,
    },
    headerContainer: {
        flexDirection: "row",
        border: "1px solid #000",
        padding: 8,
        alignItems: "center",
        marginBottom: "16px",
    },
    titleContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontFamily: "Roboto-Bold",
        fontSize: 14,
    },

    /* ===== HEADER ===== */
    companyName: {
        fontSize: 12,
        fontFamily: "Roboto-Bold",
        color: "#1a237e",
    },
    companyAddress: {
        fontSize: 8,
        marginBottom: 6,
    },
    titleBox: {
        backgroundColor: "#ffeb3b",
        border: "1px solid #000",
        textAlign: "center",
        padding: 6,
        marginVertical: 4,
    },
    title: {
        fontFamily: "Roboto-Bold",
        fontSize: 12,
    },
    yearBox: {
        backgroundColor: "#ffeb3b",
        border: "1px solid #000",
        width: 120,
        alignSelf: "center",
        textAlign: "center",
        padding: 4,
        marginBottom: 8,
    },

    /* ===== TABLE ===== */
    table: {
        border: "1px solid #000",
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        border: "0.5px solid #000",
        padding: 3,
        justifyContent: "center",
    },
    headerBlue: {
        backgroundColor: "#0d47a1",
        color: "#fff",
        fontFamily: "Roboto-Bold",
        textAlign: "center",
    },
    headerOrange: {
        backgroundColor: "#f57c00",
        color: "#fff",
        fontFamily: "Roboto-Bold",
        textAlign: "center",
    },
    headerYellow: {
        backgroundColor: "#fff176",
        fontFamily: "Roboto-Bold",
        textAlign: "center",
    },
    right: {
        textAlign: "right",
    },
    center: {
        textAlign: "center",
    },
});


const checkData = (value) => {
    return value ? value : "--";
}

const PdfAssetDepreciationDetail2 = ({ data }) => {
    const { t } = useTranslation();
    const formatNumber = (amount) => {
        if (typeof amount !== 'number' && typeof amount !== 'string') return null;
        const numberValue = parseFloat(amount);
        if (isNaN(numberValue)) return null;
        const isLargeNumber = numberValue >= 1000000;

        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: isLargeNumber ? 0 : 2, // Không hiển thị số thập phân
            maximumFractionDigits: isLargeNumber ? 0 : 2  // Không hiển thị số thập phân
        }).format(numberValue);
    };
    const calculateTotals = (data, fields) => {
        if (!Array.isArray(data)) {
            return {};
        }
        const grandTotals = data.reduce((acc, record) => {
            fields.forEach(field => {
                const value = Number(record[field]) || 0;
                acc[field] = (acc[field] || 0) + value;
            });
            return acc;
        }, {});
        return grandTotals;
    }
    const fieldsToSum = [
        'originValue',
        'usageTime',
        'accumulatedValue'
    ];
    const filedsMonth = [
        'month_1',
        'month_2',
        'month_3',
        'month_4',
        'month_5',
        'month_6',
        'month_7',
        'month_8',
        'month_9',
        'month_10',
        'month_11',
        'month_12',
        'total',
    ];
    const monthsData = data?.data.map(record => record.depreciationMonths)
        .filter(monthData => monthData !== null && monthData !== undefined);
    const total = {
        ...calculateTotals(data?.data, fieldsToSum),
        ...calculateTotals(monthsData, filedsMonth),
    }
    return (
        <Document>
            <Page size="A3" orientation="landscape" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t("Bảng tính khấu hao tài sản")}</Text>
                        <Text style={styles.title}>{t(`Năm ${data.year ? data.year : dayjs().year()}`)}</Text>
                    </View>
                </View>

                <View style={[styles.row]}>
                    <Text style={[styles.cell, styles.headerBlue, { width: 25 }]}>STT</Text>
                    <Text style={[styles.cell, styles.headerBlue, { width: 80 }]}>Tên TS</Text>
                    <Text style={[styles.cell, styles.headerBlue, { width: 50 }]}>Số seri</Text>
                    <Text style={[styles.cell, styles.headerBlue, { width: 50 }]}>Ngày KH</Text>
                    <Text style={[styles.cell, styles.headerBlue, { width: 70 }]}>Nguyên giá</Text>
                    <Text style={[styles.cell, styles.headerBlue, { width: 30 }]}>Số năm</Text>

                    <div style={[
                        styles.headerBlue,
                        { width: 720 },
                    ]}>
                        <Text
                            style={[
                                styles.cell,
                                styles.headerBlue,
                                { width: 720, height: 20 },
                            ]}
                        >
                            SỐ KHẤU HAO TỪNG THÁNG
                        </Text>
                        <View style={[styles.row]}>
                            {[...Array(12)].map((_, i) => (
                                <Text
                                    key={i}
                                    style={[
                                        styles.cell,
                                        styles.headerBlue,
                                        { width: 55, textAlign: "center" },
                                    ]}
                                >
                                    Tháng {i + 1}
                                </Text>
                            ))}
                            <Text
                                key={13}
                                style={[
                                    styles.cell,
                                    styles.headerBlue,
                                    { width: 60, textAlign: "center" },
                                ]}
                            >
                                Tổng
                            </Text>
                        </View>
                    </div>
                    <Text style={[styles.cell, styles.headerOrange, { width: 60 }]}>
                        KH LŨY KẾ
                    </Text>
                    <Text style={[styles.cell, styles.headerOrange, { flex: 1 }]}>
                        GIÁ TRỊ CÒN LẠI
                    </Text>
                </View>

                {data.data.map((item, index) => (
                    <View style={[styles.row]}>
                        <Text style={[styles.cell, { width: 25 }]}>{index + 1}</Text>
                        <Text style={[styles.cell, { width: 80 }]}>{item?.assetName}</Text>
                        <Text style={[styles.cell, styles.right, { width: 50 }]}>
                            {item?.serial}
                        </Text>
                        <Text style={[styles.cell, styles.center, { width: 50 }]}>
                            {dayjs(item?.depreciationStartDate).format("DD/MM/YYYY")}
                        </Text>
                        <Text style={[styles.cell, styles.right, { width: 70 }]}>
                            {formatNumber(item?.originValue)}
                        </Text>
                        <Text style={[styles.cell, styles.center, { width: 30 }]}>
                            {formatNumber(item?.usageTime / 12)}
                        </Text>

                        {[...Array(12)].map((_, i) => (
                            <Text
                                key={i}
                                style={[styles.cell, styles.right, { width: 55 }]}
                            >
                                {formatNumber(item.depreciationMonths?.[`month_${i + 1}`] || 0)}
                            </Text>
                        ))}
                        <Text
                            key={13}
                            style={[styles.cell, styles.right, { width: 60 }]}
                        >
                            {formatNumber(item?.depreciationMonths?.[`total`] || 0)}
                        </Text>

                        <Text style={[styles.cell, styles.right, { width: 60 }]}>
                            {formatNumber(item?.accumulatedValue)}
                        </Text>
                        <Text style={[styles.cell, styles.right, { flex: 1 }]}>
                            {formatNumber(item?.originValue - item?.accumulatedValue)}
                        </Text>
                    </View>
                ))}

                <View style={[styles.row]}>
                    <Text style={[styles.cell, { width: 205, textAlign: "center", fontFamily: "Roboto-Bold" }]}>{"Tổng cộng"}</Text>
                    <Text style={[styles.cell, styles.right, { width: 70, fontFamily: "Roboto-Bold" }]}>
                        {formatNumber(total?.originValue)}
                    </Text>
                    <Text style={[styles.cell, styles.center, { width: 30, fontFamily: "Roboto-Bold" }]}>
                        {formatNumber(total?.usageTime / 12)}
                    </Text>

                    {[...Array(12)].map((_, i) => (
                        <Text
                            key={i}
                            style={[styles.cell, styles.right, { width: 55, fontFamily: "Roboto-Bold" }]}
                        >
                            {formatNumber(total?.[`month_${i + 1}`] || 0)}
                        </Text>
                    ))}
                    <Text
                        key={13}
                        style={[styles.cell, styles.right, { width: 60, fontFamily: "Roboto-Bold" }]}
                    >
                        {formatNumber(total?.[`total`] || 0)}
                    </Text>

                    <Text style={[styles.cell, styles.right, { width: 60, fontFamily: "Roboto-Bold" }]}>
                        {formatNumber(total?.accumulatedValue)}
                    </Text>
                    <Text style={[styles.cell, styles.right, { flex: 1, fontFamily: "Roboto-Bold" }]}>
                        {formatNumber(total?.originValue - total?.accumulatedValue)}
                    </Text>
                </View>


            </Page>
        </Document>
    );
}
export default PdfAssetDepreciationDetail2;