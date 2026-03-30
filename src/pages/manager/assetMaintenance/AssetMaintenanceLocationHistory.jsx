import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card, Divider } from "antd";
import { CloseSquareOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import { parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";

export default function AssetMaintenanceLocationHistory({
  open,
  onCancel,
  assetMaintenance,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [locationHistorys, setLocationHistorys] = useState([]);

  useEffect(() => {
    if (open) {
      fetchAssetMaintenanceLocationHistoryByRes();
    }
  }, [open, assetMaintenance]);

  useEffect(() => {
    if (open && assetMaintenance) {
      form.setFieldsValue(assetMaintenance);
    }
  }, [assetMaintenance]);
  const onCancelEndReset = () => {
    form.resetFields();
    onCancel();
    setLocationHistorys([]);
  };
  const fetchAssetMaintenanceLocationHistoryByRes = async () => {
    let res =
      await _unitOfWork.assetMaintenance.getAssetMaintenanceLocationHistoryByRes(
        {
          assetMaintenance: assetMaintenance.id || assetMaintenance._id,
        },
      );
    if (res && res.code === 1) {
      setLocationHistorys(res.data);
    }
  };

  const renderLocation = (label, location) => (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <strong>
            {t("assetMaintenance.locationHistory.province", {
              defaultValue: "Tỉnh/TP:",
            })}
          </strong>{" "}
          {location?.province?.name ||
            t("assetMaintenance.locationHistory.no_data", {
              defaultValue: "Không có",
            })}
        </Col>
        <Col span={8}>
          <strong>
            {t("assetMaintenance.locationHistory.commune", {
              defaultValue: "Phường/Xã:",
            })}
          </strong>{" "}
          {location?.commune?.name ||
            t("assetMaintenance.locationHistory.no_data", {
              defaultValue: "Không có",
            })}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <strong>
            {t("assetMaintenance.locationHistory.branch", {
              defaultValue: "Chi nhánh:",
            })}
          </strong>{" "}
          {location?.branch?.name ||
            t("assetMaintenance.locationHistory.no_data", {
              defaultValue: "Không có",
            })}
        </Col>
        <Col span={8}>
          <strong>
            {t("assetMaintenance.locationHistory.building", {
              defaultValue: "Tòa nhà:",
            })}
          </strong>{" "}
          {location?.building?.buildingName ||
            t("assetMaintenance.locationHistory.no_data", {
              defaultValue: "Không có",
            })}
        </Col>
        <Col span={8}>
          <strong>
            {t("assetMaintenance.locationHistory.floor", {
              defaultValue: "Tầng:",
            })}
          </strong>{" "}
          {location?.floor?.floorName ||
            t("assetMaintenance.locationHistory.no_data", {
              defaultValue: "Không có",
            })}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <strong>
            {t("assetMaintenance.locationHistory.department", {
              defaultValue: "Phòng ban:",
            })}
          </strong>{" "}
          {location?.department?.departmentName ||
            t("assetMaintenance.locationHistory.no_data", {
              defaultValue: "Không có",
            })}
        </Col>
        <Col span={8}>
          <strong>
            {t("assetMaintenance.locationHistory.address", {
              defaultValue: "Địa chỉ:",
            })}
          </strong>{" "}
          {location?.addressNote ||
            t("assetMaintenance.locationHistory.no_data", {
              defaultValue: "Không có",
            })}
        </Col>
      </Row>
    </>
  );

  return (
    <Modal
      open={open}
      onCancel={onCancelEndReset}
      footer={null}
      closable={false}
      width="70%"
      className="custom-modal"
    >
      <Card
        title={t("assetMaintenance.locationHistory.title")}
        extra={
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={onCancelEndReset} icon={<CloseSquareOutlined />}>
                {t("assetMaintenance.locationHistory.cancel", {
                  defaultValue: "Hủy",
                })}
              </Button>
            </Col>
          </Row>
        }
      >
        <Form labelWrap form={form}>
          {locationHistorys && locationHistorys.length > 0 ? (
            locationHistorys.map((item, index) => {
              const files =
                item?.resources?.map((doc) => ({
                  id: doc.id,
                  name: doc.fileName + doc.extension,
                  src: _unitOfWork.resource.getImage(doc.id),
                  supportDocumentId: doc.id,
                })) || [];
              return (
                <Card
                  key={index}
                  type="inner"
                  title={t("assetMaintenance.locationHistory.move_number", {
                    number: index + 1,
                    defaultValue: `Lần di chuyển #${index + 1}`,
                  })}
                  className="mb-4"
                >
                  <Row className="mb-2">
                    <Col span={8}>
                      <strong>
                        {t("assetMaintenance.locationHistory.moved_by", {
                          defaultValue: "Người di chuyển : ",
                        })}
                      </strong>{" "}
                      {item.createdBy
                        ? item?.createdBy?.fullName
                        : t("assetMaintenance.locationHistory.no_info", {
                            defaultValue: "Không có thông tin",
                          })}
                    </Col>
                    <Col span={8}>
                      <strong>
                        {t("assetMaintenance.locationHistory.user", {
                          defaultValue: "Người dùng tài sản : ",
                        })}
                      </strong>{" "}
                      {item.customer
                        ? item?.customer?.customerName
                        : t("assetMaintenance.locationHistory.no_info", {
                            defaultValue: "Không có thông tin",
                          })}
                    </Col>

                    <Col span={8}>
                      <strong>
                        {t("assetMaintenance.locationHistory.time", {
                          defaultValue: "Thời gian : ",
                        })}
                      </strong>{" "}
                      {item.createdAt
                        ? parseDateHH(item.createdAt)
                        : t("assetMaintenance.locationHistory.no_info", {
                            defaultValue: "Không có thông tin",
                          })}
                    </Col>
                  </Row>

                  <Divider orientation="left">
                    {t("assetMaintenance.locationHistory.old_location", {
                      defaultValue: "Vị trí cũ",
                    })}
                  </Divider>
                  {renderLocation("old", {
                    customer: item.oldCustomer,
                    province: item.oldProvince,
                    commune: item.oldCommune,
                    branch: item.oldBranch,
                    building: item.oldBuilding,
                    floor: item.oldFloor,
                    department: item.oldDepartment,
                    addressNote: item.oldAddressNote,
                  })}

                  <Divider orientation="left">
                    {t("assetMaintenance.locationHistory.new_location", {
                      defaultValue: "Vị trí mới",
                    })}
                  </Divider>
                  {renderLocation("new", {
                    customer: item.customer,
                    commune: item.commune,
                    province: item.province,
                    branch: item.branch,
                    building: item.building,
                    floor: item.floor,
                    department: item.department,
                    addressNote: item.addressNote,
                  })}

                  {files && files.length > 0 && (
                    <AttachmentModel
                      notSize
                      notDelete
                      noCreate
                      value={files}
                    ></AttachmentModel>
                  )}
                </Card>
              );
            })
          ) : (
            <Row>
              <Col span={24}>
                <p>
                  {t("assetMaintenance.locationHistory.no_history", {
                    defaultValue: "Không có lịch sử di chuyển nào.",
                  })}
                </p>
              </Col>
            </Row>
          )}
        </Form>
      </Card>
    </Modal>
  );
}
