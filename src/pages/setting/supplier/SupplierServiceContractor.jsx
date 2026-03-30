import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import Supplier from "../../manager/assetSetup/supplier";
import ServiceContractors from "../../manager/serviceContractors";
const Location = () => {
  const { t } = useTranslation();
  const items = [
    {
      key: "1",
      label: t("menu.settings.supplier"),
      children: <Supplier />,
    },
    {
      key: "2",
      label: t("menu.settings.service_contractor"),
      children: <ServiceContractors />,
    },
  ];
  return (
    <Tabs
      defaultActiveKey={"1"}
      items={items}
      className="tab-all tabs-chart-column wp-100"
    />
  );
};

export default Location;
