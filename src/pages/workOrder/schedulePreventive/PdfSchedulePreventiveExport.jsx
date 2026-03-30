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
import { parseDateDDMMYYYY } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";

Font.register({
  family: "Roboto",
  fonts: [{ src: robotoRegular }, { src: robotoBold, fontWeight: "bold" }],
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
    fontSize: 14,
    fontWeight: "bold",
  },
  companyInfo: {
    width: "30%",
    fontSize: 8,
  },
  bold: {
    fontWeight: "bold",
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


const PdfSchedulePreventiveExport = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image src={logo} style={styles.logo} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t("preventive.pdf.title")}</Text>
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
                {checkData(data?.assetMaintenance?.customer?.customerName)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.contact_email")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                {checkData(data?.assetMaintenance?.customer?.contactEmail)}
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
                {checkData(data?.assetMaintenance?.customer?.contactNumber)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>{t("preventive.pdf.address")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                {checkData(data?.assetMaintenance?.customer?.addressTwo)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableHeader]}>
              Request Info
            </Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>{t("preventive.pdf.schedule_id")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{checkData(data?.preventive?.code)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>{t("preventive.pdf.priority")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{data?.preventive?.importance}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.schedule_name")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{checkData(data?.preventive?.preventiveName)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.scheduled_based_on")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{checkData(data?.preventive?.scheduleType)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.scheduled_date")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                {checkData(parseDateDDMMYYYY(data?.preventive?.createdAt))}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.completed_date")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                {checkData(parseDateDDMMYYYY(data?.preventive?.calendarEndBy))}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.total_time_consumed")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{checkData("")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>{t("preventive.pdf.down_time")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{checkData("")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableHeader]}>
              {t("preventive.pdf.asset_detail")}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>{t("preventive.pdf.asset")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                {checkData(
                  data?.assetMaintenance?.assetModel?.asset?.assetName
                )}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>{t("preventive.pdf.model")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                {checkData(data?.assetMaintenance?.assetModel?.assetModelName)}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>{t("preventive.pdf.serial")}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{checkData(data?.assetMaintenance?.serial)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.asset_number")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{checkData(data?.assetMaintenance?.assetNumber)}</Text>
            </View>
          </View>
        </View>

        {data?.schedulePreventiveTasks?.length > 0 &&
          data?.schedulePreventiveTasks.map((item) => (
            <View style={styles.table} key={item._id}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableHeader]}>
                  {t("preventive.pdf.inspection_task_details")}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCol, flex: 4 }}>
                  <Text>
                    <Text style={styles.bold}>
                      {t("preventive.pdf.inspection_name")}:{" "}
                    </Text>
                    {item?.taskName}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, flex: 2 }}>
                  <Text>
                    <Text style={styles.bold}>SLA: </Text>
                    {item?.sla}
                  </Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.bold}>
                    {t("preventive.list.table.index")}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, flex: 2 }}>
                  <Text style={styles.bold}>
                    {t("preventive.pdf.description")}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.bold}>
                    {t("preventive.pdf.answer_type")}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.bold}>{t("preventive.pdf.action")}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.bold}>
                    {t("preventive.pdf.comments")}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.bold}>
                    {t("preventive.pdf.before_task")}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.bold}>
                    {t("preventive.pdf.after_task")}
                  </Text>
                </View>
              </View>
              {item.taskItems.map((task, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, flex: 2 }}>
                    <Text>{checkData(task.taskItemDescription)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{checkData(task.answerTypeInspection)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{checkData("")}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{checkData("")}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{checkData("")}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{checkData("")}</Text>
                  </View>
                </View>
              ))}

              <>
                <View style={styles.tableRow}>
                  <View
                    style={[styles.tableCol, { backgroundColor: "#1976d2" }]}
                  >
                    <Text style={{ color: "#fff" }}>
                      {t("preventive.pdf.attended_by")}:{" "}
                      {checkData(
                        item.schedulePreventiveTaskAssignUserIsActive?.user
                          ?.fullName
                      )}
                    </Text>
                  </View>
                  <View
                    style={[styles.tableCol, { backgroundColor: "#1976d2" }]}
                  >
                    <Text style={{ color: "#fff" }}>
                      {t("preventive.pdf.task_status")}:{" "}
                      {checkData(
                        item.schedulePreventiveTaskAssignUserIsActive?.status
                      )}
                    </Text>
                  </View>
                  <View
                    style={[styles.tableCol, { backgroundColor: "#1976d2" }]}
                  >
                    <Text style={{ color: "#fff" }}>
                      {t("preventive.pdf.contact_phone")}:{" "}
                      {checkData(
                        item.schedulePreventiveTaskAssignUserIsActive?.user
                          ?.contactNo
                      )}
                    </Text>
                  </View>
                  <View
                    style={[styles.tableCol, { backgroundColor: "#1976d2" }]}
                  >
                    <Text style={{ color: "#fff" }}>
                      {t("preventive.pdf.comments")}: {checkData("")}
                    </Text>
                  </View>
                </View>

                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.bold}>
                      {t("preventive.pdf.check_in_time")}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.bold}>
                      {t("preventive.pdf.check_out_time")}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.bold}>
                      {t("preventive.pdf.checkout_comments")}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.bold}>
                      {t("preventive.pdf.total_time_consumed")}
                    </Text>
                  </View>
                </View>

                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text>{checkData("")} </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text> {checkData("")}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text> {checkData("")}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text> {checkData("")}</Text>
                  </View>
                </View>
              </>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.bold}>
                    {t("preventive.pdf.total_time_consumed")}
                  </Text>
                </View>
              </View>
            </View>
          ))}

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.ack_user_name")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.ack_user_signature")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}>
                {t("preventive.pdf.ack_comments")}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bold}> {checkData("")} </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}> {checkData("")} </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bold}> {checkData("")} </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfSchedulePreventiveExport;
