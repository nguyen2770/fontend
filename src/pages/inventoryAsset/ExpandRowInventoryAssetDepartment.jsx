import { Button, Table, Tooltip } from "antd";
import "./index.scss";
import { EyeOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";
import { inventoryAssetAssetMaintenanceStatus } from "../../utils/inventoryAssetConstant";

const ExpandRowInventoryAssetDepartment = ({
    inventoryAssetDepartment,
}) => {
    const { t } = useTranslation();
    const [inventoryAssetDepartmentAssetMaintenances, setInventoryAssetDepartmentAssetMaintenances] = useState([]);
    useEffect(() => {
        if (inventoryAssetDepartment) {
            fetchInventoryAssetDepartment();
        }

    }, [inventoryAssetDepartment]);


    const fetchInventoryAssetDepartment = async () => {
        const res = await _unitOfWork.inventoryAsset.getInventoryAssetDepartmentById({
            id: inventoryAssetDepartment._id,
        });
        if (res && res.data) {
            setInventoryAssetDepartmentAssetMaintenances(res.data.inventoryAssetDepartmentAssetMaintenances);
        }
    };
    const groupAssetMaintenance = () => {
        let groups = [];
        inventoryAssetDepartmentAssetMaintenances.forEach(item => {
            var _idx = groups.findIndex(g => g?.asset?.id === item?.asset?.id && g?.assetModel?.id === item?.assetModel?.id);
            if (_idx > -1) {

                if (item.status === inventoryAssetAssetMaintenanceStatus.exist) {
                    groups[_idx].existQuantity += 1;
                    groups[_idx].inventoryAssetQuantity += 1;
                    groups[_idx].totalQuantity += 1;
                }
                if (item.status === inventoryAssetAssetMaintenanceStatus.does_not_exist) {
                    groups[_idx].doesNotExistQuantity += 1;
                    groups[_idx].inventoryAssetQuantity += 1;
                }
                if (item.status === inventoryAssetAssetMaintenanceStatus.not_yet_inventoried) {
                    groups[_idx].notYetInventoriedQuantity += 1;
                    groups[_idx].totalQuantity += 1;
                }
            } else {
                let itemGroup = {
                    totalQuantity: 0,
                    inventoryAssetQuantity: 0,
                    existQuantity: 0,
                    doesNotExistQuantity: 0,
                    notYetInventoriedQuantity: 0,
                    asset: item.asset,
                    assetModel: item.assetModel
                }
                if (item.status === inventoryAssetAssetMaintenanceStatus.exist) {
                    itemGroup.existQuantity = 1;
                    itemGroup.inventoryAssetQuantity = 1;
                    itemGroup.totalQuantity = 1;
                }
                if (item.status === inventoryAssetAssetMaintenanceStatus.does_not_exist) {
                    itemGroup.doesNotExistQuantity = 1;
                    itemGroup.inventoryAssetQuantity = 1;
                }
                if (item.status === inventoryAssetAssetMaintenanceStatus.not_yet_inventoried) {
                    itemGroup.notYetInventoriedQuantity = 1;
                    itemGroup.totalQuantity = 1;
                }
                groups.push(itemGroup)
            }
        });
        return groups;
    }


    const columnExpands = [
        {
            title: "",
            dataIndex: "id",
            key: "id",
            width: "50px",
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: "Tên thiết bị",
            dataIndex: "asset",
            render: (_text, _record, index) => _record?.asset?.assetName,
        },
        {
            title: "Model",
            dataIndex: "model",
            render: (_text, _record, index) => _record?.assetModel?.assetModelName,
        },
        {
            title: "SL hệ thống",
            dataIndex: "totalQuantity",
            align: 'center',
            width: '120px'
        },
        {
            title: "SL đã kiểm kê",
            dataIndex: "inventoryAssetQuantity",
            align: 'center',
            width: '120px'
        },
        {
            title: "SL đúng",
            dataIndex: "existQuantity",
            align: 'center',
            width: '120px'
        },
        {
            title: "SL thừa",
            dataIndex: "doesNotExistQuantity",
            align: 'center',
            width: '120px'
        },
        {
            title: "SL chưa kiểm kê",
            dataIndex: "notYetInventoriedQuantity",
            align: 'center',
            width: '120px'
        },
        // {
        //     title: "Thao tác",
        //     dataIndex: "action",
        //     width: "10%",
        //     align: "center",
        //     render: (_, record) => (
        //         <div
        //             style={{
        //                 display: "flex",
        //                 gap: "4px",
        //                 justifyContent: "center",
        //                 alignItems: "center",
        //             }}
        //         >
        //             <Tooltip title="Chi tiết">
        //                 <Button
        //                     type="primary"
        //                     icon={<EyeOutlined />}
        //                     size="small"
        //                 />
        //             </Tooltip>
        //         </div>
        //     ),
        // },
    ].filter(Boolean);

    return (
        <>
            <Table
                rowKey="id"
                className="paramater-asset-expand pl-3 pr-3 mb-2"
                columns={columnExpands}
                key={"id"}
                dataSource={groupAssetMaintenance()}
                bordered
                pagination={false}
            />
        </>
    );
};
export default ExpandRowInventoryAssetDepartment;
