import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  Row,
  Table,
  Tooltip,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  assetType,
  FORMAT_DATE,
  frequencyOptions,
  PAGINATION,
} from "../../utils/constant";
import * as _unitOfWork from "../../api";
import { parseDate } from "../../helper/date-helper";
import { parseToLabel } from "../../helper/parse-helper";
import { staticPath } from "../../router/routerConfig";
export default function Calibration() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  return (
    <div className="p-3">
      <Form
labelWrap
        form={form}
        layout="vertical"
        className="mb-2"
        // onFinish={onSearch}
      ></Form>
    </div>
  );
}
