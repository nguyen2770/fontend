import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar as BigCalendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import localizer from "../dayjsLocalizer";
import * as _unitOfWork from "../../../api";
import dayjs from "dayjs";
import { staticPath } from "../../../router/routerConfig";
import { schedulePreventiveTaskAssignUserStatus } from "../../../utils/constant";
import { Col, Row, Tooltip } from "antd";
import { parseDate } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";

export default function MyCalenderTask() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const { defaultDate, formats } = useMemo(
    () => ({
      defaultDate: new Date(),
      formats: {
        eventTimeRangeEndFormat: (date, culture, localizer) =>
          " << " + localizer.format(date, "hh:mm A", culture),
      },
    }),
    []
  );
  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const { t } = useTranslation();

  useEffect(() => {
    const start = dayjs(date).startOf("month").startOf("week");
    const end = dayjs(date).endOf("month").endOf("week");
    fetchGetMyTaskCalender(start, end);
  }, [date]);

  const fetchGetMyTaskCalender = async (startDate, endDate) => {
    let res = await _unitOfWork.report.getMyTaskCalender({
      startDate,
      endDate,
    });
    if (res && res.code === 1) {
      setEvents(
        res?.data?.map((item) => ({
          id: item?.schedulePreventive?.id || item?.schedulePreventive?._id,
          title:
            item?.asset?.assetName + " - " + item?.schedulePreventive?.code,
          start: new Date(item?.schedulePreventive?.startDate),
          end: dayjs(item?.schedulePreventive?.startDate).endOf("day").toDate(),
          status: item?.status,
          assetName: item?.asset?.assetName,
          assetNumber: item?.assetMaintenance?.assetNumber,
          serial: item?.assetMaintenance?.serial,
          code: item?.schedulePreventive?.code,
          startDate: item?.schedulePreventive?.startDate,
          allDay: true,
        }))
      );
    }
  };

  const onRangeChange = useCallback((range) => {
    let start, end;
    if (Array.isArray(range)) {
      // Month hoặc Week
      start = range[0];
      end = range[range.length - 1];
    } else {
      // Day hoặc Agenda
      start = range.start;
      end = range.end;
    }

    fetchGetMyTaskCalender(dayjs(start), dayjs(end));
  }, []);
  const onSelectEvent = useCallback((calEvent) => {
    window.open(staticPath.viewSchedulePreventive + "/" + calEvent.id);
  }, []);
  const messages = {
    today: t("dashboard.calendar.messages.today"),
    previous: t("dashboard.calendar.messages.previous"),
    next: t("dashboard.calendar.messages.next"),
    month: t("dashboard.calendar.messages.month"),
    week: t("dashboard.calendar.messages.week"),
    day: t("dashboard.calendar.messages.day"),
    agenda: t("dashboard.calendar.messages.agenda"),
    date: t("dashboard.calendar.messages.date"),
    time: t("dashboard.calendar.messages.time"),
    event: t("dashboard.calendar.messages.event"),
    allDay: t("dashboard.calendar.messages.allDay"),
    noEventsInRange: t("dashboard.calendar.messages.noEventsInRange"),
  };
  function EventWrapper({ event }) {
    return (
      <Tooltip
        // style={{ background: "#1677FF" }}
        title={
          <div style={{ minWidth: 220 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>{t("preventive.common.code")}: </Col>
              <Col span={12}>{event.code}</Col>
              <Col span={12}>{t("preventive.common.asset")} : </Col>
              <Col span={12}> {event.assetName}</Col>
              <Col span={12}>{t("calibration.asset_number")} : </Col>
              <Col span={12}>{event.assetNumber}</Col>
              <Col span={12}>{t("preventive.common.serial")} </Col>
              <Col span={12}>{event.serial}</Col>
              {/* <Col span={12}>
                {" "}
                {t("schedulePreventiveTask.expected_time_title")} :{" "}
              </Col> */}
              <Col span={12}>{parseDate(event?.startDate)}</Col>
              <Col span={12}> </Col>
              <Col span={12}> </Col>
            </Row>
          </div>
        }
        placement="top"
      >
        <span>{event.title}</span>
      </Tooltip>
    );
  }
  return (
    <div className="bg-white shadow-md rounded-xl">
      <BigCalendar
        formats={formats}
        defaultDate={defaultDate}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        onRangeChange={onRangeChange}
        onNavigate={onNavigate}
        showMultiDayTimes
        className="rounded-lg"
        onSelectEvent={onSelectEvent}
        messages={messages}
        components={{
          event: EventWrapper,
        }}
        eventPropGetter={(event) => {
          const option = schedulePreventiveTaskAssignUserStatus.Options.find(
            (opt) => opt.value === event.status
          );
          const color = option?.color || "#d9d9d9"; // fallback màu xám
          return {
            style: {
              backgroundColor: color,
              color: "white",
              borderRadius: "6px",
              padding: "2px 6px",
              fontWeight: 500,
            },
          };
        }}
      />
    </div>
  );
}
