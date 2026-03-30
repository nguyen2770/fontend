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
import { parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import { assetMaintenanceStatus, assetType, progressStatus, ticketStatuOptions } from "../../../utils/constant";
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
});

const checkData = (value) => {
    return value ? value : "--";
}


const PdfBreakdownExport = ({ data }) => {
    const { t } = useTranslation();
    const statusLabel = {
        raised: "Tạo yêu cầu",
        assigned: "Đã phân công",
        accepted: "Đã tiếp nhận",
        inProgress: "Đang xử lý",
        experimentalFix: "Đã sửa thử nghiệm",
        WCA: "Chờ xác nhận"
    };
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image src={logo} style={styles.logo} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t("breakdown.pdf.title")}</Text>
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
                                {checkData(data?.breakdown?.assetMaintenance?.customer?.customerName)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("preventive.pdf.contact_email")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.breakdown?.assetMaintenance?.customer?.contactEmail)}
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
                                {checkData(data?.breakdown?.assetMaintenance?.customer?.contactNumber)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("preventive.pdf.address")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.breakdown?.assetMaintenance?.customer?.addressTwo)}
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
                            <Text style={styles.bold}>{t("breakdown.pdf.code")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.breakdown?.code)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("breakdown.pdf.priority")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.breakdown?.priorityLevel)}</Text>
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
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.description")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.breakdown?.defectDescription)}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.service_category")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {checkData(data?.breakdown?.serviceCategory?.serviceCategoryName)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>
                                {t("breakdown.viewTabs.general.fields.service_sub_category")}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(data?.breakdown?.serviceSubCategory?.serviceSubCategoryName)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>{t("breakdown.viewTabs.general.fields.asset_status")}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>{checkData(t(parseToLabel(assetMaintenanceStatus.Options, data?.breakdown?.assetMaintenanceStatus)))}</Text>
                        </View>
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
                                {checkData(data?.breakdown?.assetMaintenance?.assetModel?.asset?.assetName)}
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

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            {t("breakdown.pdf.history")}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>Thời gian</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>Trạng thái</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.bold}>Thực hiện bởi</Text>
                        </View>
                    </View>
                    {data?.breakdownHistorys
                        ?.filter(h =>
                            [
                                "raised",
                                "assigned",
                                "accepted",
                                "inProgress",
                                "experimentalFix",
                                "WCA"
                            ].includes(h.status)
                        )
                        .map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text>
                                        {checkData(parseDateHH(item.workedDate || item.createdAt))}
                                    </Text>
                                </View>

                                <View style={styles.tableCol}>
                                    <Text>
                                        {statusLabel[item.status] || item.status}
                                    </Text>
                                </View>

                                <View style={styles.tableCol}>
                                    <Text>
                                        {checkData(item.workedBy?.fullName)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                </View>
            </Page>
        </Document>
    );
};

export default PdfBreakdownExport;
