import { Table } from "antd";
import './index.scss'
import { useTranslation } from "react-i18next";

const ExpandRowAsset = ({ assetModel }) => {
    const { t } = useTranslation();
    const columnExpands = [
        {
            title: t("modal.assetModelSelector.expand.index"),
            dataIndex: "id",
            key: "id",
            width: "50px",
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: t("modal.assetModelSelector.expand.parameter"),
            dataIndex: "name",
            key: "name",
            align: "center",
            width: "50%",
        },
        {
            title: t("modal.assetModelSelector.expand.value"),
            dataIndex: "value",
            key: "value",
            align: "center",
        }
    ];
    return (
        <Table
            rowKey="id"
            className="paramater-asset-expand pl-3 pr-3 mb-2"
            columns={columnExpands}
            key={"id"}
            dataSource={assetModel.assetModelParameters ?? []}
            bordered
            pagination={false}
        />
    );
};
export default ExpandRowAsset;