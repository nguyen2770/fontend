import { Tabs } from "antd";
import React, { useEffect } from "react";
import "./index.scss";
import Asset from "./asset";
import Category from "./category";
import Manufacturer from "./manufacturer";
import ServiceSubCategory from "./serviceSubCategory";
import ServiceCategory from "./seviceCategory";
import SpareCategory from "../../sparePartManager/spareCategory";
import SpareSubCategory from "../../sparePartManager/spareSubCategory";
import SubCategory from "./subCategory";
import AssetType from "./assetType";
import { useLocation } from "react-router-dom";
import useHeader from "../../../contexts/headerContext";
const Assets = () => <Asset />;
const Manufacturers = () => <Manufacturer />;
const Categorys = () => <Category />;
const ServiceSubCategorys = () => <ServiceSubCategory />;
const ServiceCategorys = () => <ServiceCategory />;
const SpareCategorys = () => <SpareCategory />;
const SpareSubCategorys = () => <SpareSubCategory />;
const SubCategorys = () => <SubCategory />;

export default function AssetSetup() {
  const { setHeaderTitle } = useHeader();
  useEffect(() => {
    setHeaderTitle("Asset setup");
  }, []);
  const onChange = (key) => {
    console.log(key);
  };
  const location = useLocation();
  const tabFromState = location.state?.tab || "1";
  const items = [
    {
      key: "1",
      label: "Nhà cung cấp",
      children: <Manufacturers />,
    },
    {
      key: "2",
      label: "Danh mục chính",
      children: <Categorys />,
    },
    {
      key: "3",
      label: "Danh mục con",
      children: <SubCategorys />,
    },
    {
      key: "4",
      label: "Loại thiết bị",
      children: <AssetType />,
    },
    {
      key: "5",
      label: "Thiết bị",
      children: <Assets />,
    },
    {
      key: "6",
      label: "Danh mục dự phòng",
      children: <SpareCategorys />,
    },
    {
      key: "7",
      label: "Danh mục dự phòng phụ",
      children: <SpareSubCategorys />,
    },
    {
      key: "8",
      label: "Danh mục dịch vụ",
      children: <ServiceCategorys />,
    },
    {
      key: "9",
      label: "Danh mục dịch vụ phụ",
      children: <ServiceSubCategorys />,
    },
  ];
  return (
    <Tabs
      defaultActiveKey={tabFromState}
      items={items}
      onChange={onChange}
      className=" tabs-asset"
      style={{ padding: "15px" }}
    />
  );
}
