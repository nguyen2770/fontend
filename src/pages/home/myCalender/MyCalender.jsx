import "./index.scss";
import { Tabs } from "antd";
import MyCalenderTicket from "./MyCalenderTicket";
import MyCalenderTask from "./MyCalenderTask";
import MyCalenderCalibration from "./MyCalenderCalibration";
import { useTranslation } from "react-i18next";
const MyCalenderTicketTab = () => <MyCalenderTicket />;
const MyCalenderTaskTab = () => <MyCalenderTask />;
const MyCalenderCalibrationTab = () => <MyCalenderCalibration />;
export default function MyCalender() {
  const { t } = useTranslation();
  const items = [
    {
      key: "1",
      label: t("dashboard.calendar.tab_task"),
      children: <MyCalenderTaskTab />,
    },
    {
      key: "2",
      label: t("dashboard.calendar.tab_ticket"),
      children: <MyCalenderTicketTab />,
    },
    {
      key: "3",
      label: t("dashboard.calendar.tab_calibration_work"),
      children: <MyCalenderCalibrationTab />,
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
