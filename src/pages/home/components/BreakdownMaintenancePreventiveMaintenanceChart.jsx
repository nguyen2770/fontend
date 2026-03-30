import { HomeOutlined } from "@ant-design/icons";
import { Col, Row, Card, Avatar, Tabs } from "antd";
import { Column, Line } from '@ant-design/plots';
import * as _unitOfWork from "../../../api";
import { useEffect, useState } from "react";
import { parseDate, parseDateMonth, parseDateYear, parseWeekOfYear } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
export default function BreakdownCompleteChart({ dateRangeType, tabKey }) {
    const { t } = useTranslation();
    const [breakdownChartData, setBreakdownChartDate] = useState([]);
    useEffect(() => {
        if (tabKey && tabKey == "2") {
            fetchBreakdownChartDate();
        }
    }, [dateRangeType, tabKey])
    const fetchBreakdownChartDate = async () => {
        let res = await _unitOfWork.report.getBreakdownChart({
            dateRangeType: dateRangeType
        })
        if (res && res.code === 1) {
            let data = [];
            res.data.forEach(element => {
                const date = generateColumnName(element.date)
                data.push({
                    date: date,
                    name: t("totalAndcomplete.total"),
                    value: element.totalBreakdown
                })
                data.push({
                    date: date,
                     name: t("totalAndcomplete.complete"),
                    value: element.totalBreakdownDone
                })
            });
            setBreakdownChartDate(data);
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
        }
    };
    return <div className="mt-3 preventive-schedule-complete-chart wp-100">
        <Column className="wp-100" {...config} />
    </div>
}