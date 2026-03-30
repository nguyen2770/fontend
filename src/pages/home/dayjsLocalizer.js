import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { dayjsLocalizer } from "react-big-calendar";

dayjs.extend(localizedFormat);

const localizer = dayjsLocalizer(dayjs);

export default localizer;
