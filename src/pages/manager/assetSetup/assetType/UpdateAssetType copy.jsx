import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, PlayCircleFilled } from "@ant-design/icons";
import ShowSuccess from "../../../../components/modal/result/successNotification";
import { formatCurrency } from "../../../../utils/constant";
import { parseCurrency } from "../../../../helper/price-helper";
import { filterOption } from "../../../../helper/search-select-helper";
export default function UpdateAsset() {
  const [form] = Form.useForm();
  const [assetTypeCategorys, setAssetTypeCategorys] = useState([]);
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchGetAssetById();
    fetchGetAllAssetTypeCategory();
    fetchGetAllAsset();
  }, []);

  const fetchGetAssetById = async () => {
    const res = await _unitOfWork.assetType.getAssetTypeById({
      id: params.id,
    });
    if (res) {
      form.setFieldsValue({
        ...res,
        asset: res?.asset?.id || res?.asset?._id,
        assetTypeCategory:
          res?.assetTypeCategory?.id || res?.assetTypeCategory?._id,
      });
    }
  };
  const fetchGetAllAsset = async () => {
    const res = await _unitOfWork.asset.getAllAsset();
    if (res && res.code === 1) {
      setAssets(res.data);
    }
  };
  const fetchGetAllAssetTypeCategory = async () => {
    const res = await _unitOfWork.assetTypeCategory.getAllAssetTypeCategory();
    if (res && res.code === 1) {
      setAssetTypeCategorys(res.data);
    }
  };

  const onFinish = async () => {
    const values = form.getFieldsValue();
    let res = await _unitOfWork.assetType.updateAssetType({
      data: {
        id: params.id,
        ...values,
      },
    });
    if (res && res.code === 1) {
      navigate(-1);
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.update_success")
      );
    }
  };

  return (
    <div className="content-manager">
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card
          title={"Thêm mới loại thiết bị"}
          extra={
            <>
              <Button
                style={{ marginRight: "10px" }}
                onClick={() => navigate(-1)}
              >
                <ArrowLeftOutlined />
                Quay lại
              </Button>
              <Button
                style={{ marginRight: "10px" }}
                type="primary"
                htmlType="submit"
              >
                <PlayCircleFilled />
                Lưu lại
              </Button>
            </>
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Danh mục loại thiết bị"
                name="assetTypeCategory"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn danh mục loại thiết bị!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Chọn danh mục loại thiết bị"
                  options={(assetTypeCategorys || []).map((item, key) => ({
                    key: key,
                    value: item.id,
                    label: item.name,
                  }))}
                  filterOption={filterOption}
                  showSearch={true}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thiết bị"
                name="asset"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thiết bị!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Chọn thiết bị"
                  options={(assets || []).map((item, key) => ({
                    key: key,
                    value: item.id,
                    label: item.assetName,
                  }))}
                  filterOption={filterOption}
                  showSearch={true}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá dự kiến"
                name="expectedPrice"
                labelAlign="left"
              >
                <InputNumber
                  placeholder="Giá dự kiến"
                  style={{ width: "100%" }}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ghi chú" name="note" labelAlign="left">
                <Input.TextArea
                  placeholder="Nhập ghi chú"
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}
