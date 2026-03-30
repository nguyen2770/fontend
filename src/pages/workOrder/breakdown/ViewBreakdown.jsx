import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tabs, Timeline, Tag, Button } from "antd";
import {
    CheckCircleTwoTone,
    FilePdfOutlined,
    LeftCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import TabsAttachment from "./viewBreakdownTabs/TabsAttachment";
import TabsSparePart from "./viewBreakdownTabs/TabsSparePart";
import TabsSelfDiagnosis from "./viewBreakdownTabs/TabsSelfDiagnosis";
import TabsGeneralInformatio from "./viewBreakdownTabs/TabsGeneralInformatio";
import dayjs from "dayjs";
import { breakdownStatus, progressStatus } from "../../../utils/constant";
import PdfBreakdown from "./PdfBreakdown";
import { pdf } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
export default function ViewBreakdown() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();
    const [breakdown, setBreakdown] = useState([]);
    const [breakdownHistorys, setBreakdownHistorys] = useState([]);
    const [breakdownAssignUsers, setBreakdownAssignUsers] = useState([]);
    const [allValue, setAllValue] = useState({});
    const items = [
        {
            key: "general",
            label: t("breakdown.view.tabs.general"),
            children: <TabsGeneralInformatio breakdown={breakdown} />,
        },
        {
            key: "spareParts",
            label: t("breakdown.view.tabs.spare_parts"),
            children: <TabsSparePart breakdown={breakdown} />,
        },
        {
            key: "attachment",
            label: t("breakdown.view.tabs.attachment"),
            children: <TabsAttachment breakdown={breakdown} />,
        },
        {
            key: "selfDiagnosis",
            label: t("breakdown.view.tabs.self_diagnosis"),
            children: <TabsSelfDiagnosis breakdown={breakdown} />,
        },
    ];

    useEffect(() => {
        fetchGetBreakdownById();
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchGetBreakdownById = async () => {
        let res = await _unitOfWork.breakdown.getBreakdownById({ id: params.id });
        if (res) {
            setBreakdown(res?.breakdown);
            setBreakdownHistorys(res?.breakdownHistorys);
            setBreakdownAssignUsers(res?.breakdownAssignUsers);
            setAllValue(res);
        }
    };
    const onClickPDFExport = async (values) => {
        try {
            const blob = await pdf(<PdfBreakdown data={allValue} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = `Breakdown_${values.code}.pdf`;
            // document.body.appendChild(a);
            // a.click();
            // a.remove();
            // URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export PDF error:", err);
        }
    }
    const timelineLabelKey = (status) => {
        switch (status) {
            case progressStatus.raised: return t("breakdown.view.timeline.created");
            case progressStatus.cloesed: return t("breakdown.view.timeline.closed");
            case progressStatus.cancelled: return t("breakdown.view.timeline.cancelled");
            case progressStatus.experimentalFix: return t("breakdown.view.timeline.experimental_fix");
            case progressStatus.fixedOnTrial: return t("breakdown.view.timeline.fixed_on_trial");
            case progressStatus.assigned: return t("breakdown.view.timeline.assigned");
            case progressStatus.reopen: return t("breakdown.view.timeline.reopen");
            case progressStatus.requestForSupport: return t("breakdown.view.timeline.request_for_support");
            case progressStatus.replacement: return t("breakdown.view.timeline.replacement");
            case progressStatus.accepted: return t("breakdown.view.timeline.accepted");
            case progressStatus.WCA:
            case progressStatus.WWA: return t("breakdown.view.timeline.confirmed");
            default: return "";
        }
    };
    return (
        <div className="p-3" style={{ background: "#fff" }}>
            <Row gutter={32}>
                <Col span={24}>
                    <div>
                        {[breakdownStatus.new, breakdownStatus.assigned, breakdownStatus.accepted, breakdownStatus.cloesed].includes(breakdown.status) && (
                            <Button
                                style={{ float: "right", marginBottom: 16 }}
                                type="primary"
                                icon={<FilePdfOutlined />}
                                className="ml-2"
                                onClick={() => onClickPDFExport(breakdown)}
                            >{t("breakdown.view.buttons.export_pdf")}</Button>
                        )}
                        <Button
                            style={{ float: "right", marginBottom: 16 }}
                            onClick={() => navigate(-1)}
                        >
                            <LeftCircleOutlined />
                            {t("breakdown.view.buttons.back")}
                        </Button>
                    </div>
                </Col>
                <Col span={6}>
                    <Timeline className="mt-2">
                        {breakdownHistorys?.map((item, index) => {
                            const label = timelineLabelKey(item?.status);
                            return (
                                <Timeline.Item
                                    key={index}
                                    dot={
                                        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 24 }} />
                                    }
                                    style={{ marginBottom: 16 }}
                                >
                                    <div style={{ padding: "7px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                                        {label && (
                                            <div>
                                                <b>{label} :</b> {dayjs(item?.workedDate).format("DD/MM/YYYY HH:mm")}
                                            </div>
                                        )}
                                        {item?.estimatedCompletionDate && (<div><b>{t("breakdown.view.timeline.estimated_completion")} : </b> {dayjs(item?.estimatedCompletionDate).format("DD/MM/YYYY HH:mm")}</div>)}
                                        {item?.loginDate && (<div><b>{t("breakdown.view.timeline.login_time")} : </b> {dayjs(item?.loginDate).format("DD/MM/YYYY HH:mm")}</div>)}
                                        {item?.logoutDate && (<div><b>{t("breakdown.view.timeline.logout_time")} : </b> {dayjs(item?.logoutDate).format("DD/MM/YYYY HH:mm")}</div>)}
                                        {item.replacementUser && (<div><b>{t("breakdown.view.timeline.replacement_user")}:</b> {item?.replacementUser?.fullName || "--"}</div>)}
                                        {item.designatedUser && (<div><b>{t("breakdown.view.timeline.designated_user")}:</b> {item?.designatedUser?.fullName || "--"}</div>)}
                                        <div><b>{t("breakdown.view.timeline.comment")} : </b> {item?.comment || "null"}</div>
                                        <div><b>{t("breakdown.view.timeline.status")} : </b> {
                                            t(progressStatus.Option.find(p => p.value === item.status)?.label)
                                        }</div>
                                        {item?.status === progressStatus.assigned && (
                                            <>
                                                {item.workedBy && (
                                                    <div>
                                                        <b>{t("breakdown.view.timeline.assigned_user")} : </b> {item?.workedBy?.fullName || "--"}
                                                    </div>
                                                )}
                                                {item.indicaltedUserBy && (
                                                    <div>
                                                        <b>{t("breakdown.view.timeline.executed_by")} : </b> {item?.indicaltedUserBy?.fullName || "--"}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {item?.status !== progressStatus.assigned && (
                                            <>
                                                {item.workedBy && (
                                                    <div>
                                                        <b>{t("breakdown.view.timeline.executed_by")} : </b> {item?.workedBy?.fullName || "--"}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Timeline.Item>
                            );
                        })}
                    </Timeline>

                </Col>
                <Col span={13}>
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        className="tab-all"
                        style={{
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                            borderRadius: 8,
                            background: "#fff",
                        }}
                    />
                </Col>
                <Col span={5}>
                    {breakdownAssignUsers.map((u, idx) => (
                        <div key={idx}>
                            <Card style={{ marginBottom: 16, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }} >
                                <div
                                    style={{ color: "#1890ff", fontWeight: 500, marginBottom: 4, }}
                                >
                                    {
                                        t(progressStatus.Option.find(p => p.value === u.status)?.label)
                                    }
                                </div>
                                <UserOutlined style={{ marginRight: 8 }} />
                                {u.user.fullName}
                            </Card>
                        </div>
                    ))}
                </Col>
            </Row>
        </div>
    );
}