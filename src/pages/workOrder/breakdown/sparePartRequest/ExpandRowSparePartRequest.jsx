import { Table } from "antd";
import { breakdownSpareRequestDetailStatus } from "../../../../utils/constant";
import { useTranslation } from "react-i18next";
import { parseCurrency, priceFormatter } from "../../../../helper/price-helper";

const ExpandRowSparePartRequest = ({ dataSource }) => {
  const { t } = useTranslation();
  const columnExpands = [
    {
      title: t("breakdown.spareRequest.expand.table.index"),
      dataIndex: "id",
      key: "id",
      width: "50px",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: t("breakdown.spareRequest.expand.table.spare_part_name"),
      dataIndex: "assetModelSparePart",
      key: "sparePartsName",
      render: (text, _record) =>
        text?.sparePart?.sparePartsName || _record?.sparePart?.sparePartsName,
    },
    {
      title: t("breakdown.spareRequest.expand.table.qty"),
      dataIndex: "qty",
      key: "qty",
      align: "end",
      render: (_text, record) => priceFormatter(_text),
    },
    {
      title: t("breakdown.spareRequest.expand.table.unit_cost"),
      dataIndex: "unitCost",
      key: "unitCost",
      align: "end",
      render: (_text, record) => priceFormatter(_text),
    },
    {
      title: t("breakdown.spareRequest.expand.table.total_cost"),
      dataIndex: "totalCost",
      key: "totalCost",
      align: "end",
      render: (_text, record) => priceFormatter(record.qty * record.unitCost),
    },
    {
      title: t("breakdown.spareRequest.expand.table.status"),
      dataIndex: "requestStatus",
      key: "requestStatus",
      render: (text) => {
        const statusLabel =
          t(
            breakdownSpareRequestDetailStatus.Option.find(
              (opt) => opt.value === text
            )?.label
          ) || text;
        return <span>{statusLabel}</span>;
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      className="paramater-asset-expand pl-3 pr-3 mb-2"
      columns={columnExpands}
      key={"id"}
      dataSource={dataSource}
      bordered
      pagination={false}
    />
  );
};

export default ExpandRowSparePartRequest;
