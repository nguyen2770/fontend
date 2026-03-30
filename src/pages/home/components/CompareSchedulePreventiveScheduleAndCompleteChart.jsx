import { HomeOutlined } from "@ant-design/icons";
import { Col, Row, Card, Avatar, Tabs } from "antd";
import { Column, Line } from '@ant-design/plots';
import * as _unitOfWork from "../../../api";
import { useEffect, useState } from "react";
import { parseDate, parseDateMonth, parseDateYear, parseWeekOfYear } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
export default function CompareSchedulePreventiveScheduleAndCompleteChart({ dateRangeType, tabKey }) {
    const [breakdownChartData, setSchedulePreventiveChartDate] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        if (tabKey && tabKey == "1") {
            fetchSchedulePreventiveChartDate();
        }
    }, [dateRangeType, tabKey])
    const fetchSchedulePreventiveChartDate = async () => {
        let res = await _unitOfWork.report.getSchedulePreventiveChart({
            dateRangeType: dateRangeType
        })
        if (res && res.code === 1) {
            let data = [];
            res.data.forEach(element => {
                const date = generateColumnName(element.date)
                data.push({
                    date: date,
                   name: t("totalAndcomplete.total"),
                    value: element.totalSchedulePreventive
                })
                data.push({
                    date: date,
                   name: t("totalAndcomplete.complete"),
                    value: element.totalSchedulePreventiveDone
                })
            });
            setSchedulePreventiveChartDate(data);
        }
    }
    const generateColumnName = (_date) => {
        if (dateRangeType == 'day') {
            return parseDate(_date)
        }
        if (dateRangeType == 'week') {
            return parseWeekOfYear(_date)
        }
        if (dateRangeType == 'month') {
            return parseDateMonth(_date)
        }
        if (dateRangeType == 'year') {
            return parseDateYear(_date)
        }
    }
    const config = {
        data: breakdownChartData,
        xField: 'date',
        yField: 'value',
        colorField: 'name',
        group: true,
        style: {
            inset: 5,
        },
    };
    return <div className="mt-3 preventive-schedule-complete-chart wp-100">
        <Row>
            <Col span={12}>
                <Column className="wp-100" {...config} />
            </Col>
            <Col span={12}>
                <Column className="wp-100" {...config} />
            </Col>
        </Row>
    </div>
}