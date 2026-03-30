import { HomeOutlined } from "@ant-design/icons";
import { Col, Row, Card, Avatar, Tabs, Spin } from "antd";
import { Column, Line } from '@ant-design/plots';
import * as _unitOfWork from "../../../api";
import { useEffect, useState } from "react";
import { parseDate, parseDateMonth, parseDateYear, parseWeekOfYear } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
export default function CalibrationWorkCompleteChart({ dateRangeType, tabKey }) {
    const [breakdownChartData, setSchedulePreventiveChartDate] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        if (tabKey) {
            fetchCalibrationWorkChartDate();
        }
    }, [dateRangeType, tabKey])
    const fetchCalibrationWorkChartDate = async () => {
        let res = await _unitOfWork.report.getCalibrationWorkChart({
            dateRangeType: dateRangeType
        })
        if (res && res.code === 1) {
            let data = [];
            res.data.forEach(element => {
                const date = generateColumnName(element.date)
                data.push({
                    date: date,
                    name: t("totalAndcomplete.total"),
                    value: element.totalCalibrationWork
                })
                data.push({
                    date: date,
                    name: t("totalAndcomplete.complete"),
                    value: element.totalCalibrationWorkDone
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
            inset: 2,
        },
        label: {
            text: (datum) => (datum.value === 0 ? '-' : datum.value),
            textBaseline: 'bottom',
            position: 'inside',
        },
    };
    return <div className="mt-3 preventive-schedule-complete-chart wp-100">
        <Column className="wp-100" {...config} />
    </div>
}