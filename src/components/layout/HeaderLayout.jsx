import { Avatar, Button, Dropdown, Badge, Menu, Select, Typography, Space, Segmented, Form, Tooltip, notification } from "antd";
import {
  UserOutlined,
  BellOutlined,
  MailOutlined,
  FolderOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileDoneOutlined,
  XOutlined,
  CheckOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
// import NotificationComponent from "../notification";
import "./HeaderLayout.scss";
import LogoPng from "../../assets/images/logo2.png";
import useHeader from "../../contexts/headerContext";
import * as _unitOfWork from "../../api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { niceBytes } from "../../helper/byte-helper";
import useAuth from "../../contexts/authContext";
import { notificationStatus, STORAGE_KEY } from "../../utils/constant";
import { redirect, useNavigate } from "react-router-dom";
import { staticPath } from "../../router/routerConfig";
import ChangePasswordModal from "../modal/changePassword/ChangePasswordModal";
import image_vi from "../../image/vi.png";
import image_en from "../../image/en.png";
import UpdateProfileModal from "../modal/updateProfileModal/UpdateProfileModal";

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { socket } from "../../socket";

dayjs.extend(relativeTime);
dayjs.locale('vi');

export default function HeaderLayout(props) {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const navigate = useNavigate();
  const { logout, user, branchs, branchChange } = useAuth();
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [valueBranch, setValueBranch] = useState("all");
  const { headerTitle } = useHeader();
  const [totalSizeUsed, setTotalSizeUsed] = useState(0);
  const [showUpdateUserInforModal, setShowUpdateUserInforModal] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const { Text } = Typography;
  const [page, setPage] = useState(1);
  const [totalUnRead, setTotalUnRead] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [form] = Form.useForm();
  const _status = Form.useWatch("status", form);

  useEffect(() => {
    getSizeUsed();
    const _curentLanguage = localStorage.getItem(STORAGE_KEY.LANGUAGE);
    if (_curentLanguage) {
      setCurrentLanguage(_curentLanguage);
    } else {
      setCurrentLanguage("vi");
    }
    fetchGetNotifications(1);
    const handleNewNotification = (newNotif) => {
      setTotalUnRead((prevCount) => prevCount + 1);
      setNotifications((prevList) => {
        const isExist = prevList.some(item => item.id === newNotif.id);
        if (isExist) return prevList;
        return [newNotif, ...prevList];
      });
      // if (document.visibilityState === 'visible') {
      notification.info({
        message: newNotif.Title || 'Có thông báo mới',
        description: newNotif.text || 'Bạn nhận được 1 thông báo mới.',
      });
      // }
    };

    const handleUpdateCount = (data) => {
      setTotalUnRead(data.count);
    }
    const handleStatusChanged = (data) => {
      setNotifications(prev =>
        prev.map(item => item.id === data.id ? { ...item, isOpen: data.isOpen } : item)
      );
    };
    const handleReadAll = () => {
      setNotifications(prev =>
        prev.map(item => !item.isOpen ? { ...item, isOpen: true } : item)
      );
    };
    const handleDeleted = (data) => {
      setNotifications(prev => prev.filter(item => item.id !== data.id));
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("update_unread_count", handleUpdateCount);
    socket.on("notification_status_changed", handleStatusChanged);
    socket.on("notification_read_all", handleReadAll);
    socket.on("notification_deleted", handleDeleted);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("update_unread_count", handleUpdateCount);
      socket.off("notification_status_changed", handleStatusChanged);
      socket.off("notification_read_all", handleReadAll);
      socket.off("notification_deleted", handleDeleted);
    };
  }, []);
  useEffect(() => {
    setValueBranch(branchChange);
  }, [branchChange]);
  useEffect(() => {
    fetchGetNotifications(1, false);
  }, [_status]);
  const getSizeUsed = async () => {
    let res = await _unitOfWork.resource.getSizeUsed();
    if (res && res.code === 1) {
      setTotalSizeUsed(res.size);
    }
  };
  const fetchGetNotifications = async (_page, isLoadMore = false) => {
    const payload = {
      limit: 10,
      page: _page || page,
    }
    if (_status === notificationStatus.unread) {
      payload.isOpen = false;
    } else if (_status === notificationStatus.read) {
      payload.isOpen = true;
    }
    const res = await _unitOfWork.notification.getNotificationUser(payload);
    if (res && res.code === 1) {
      const results = res?.data?.results || [];
      const totalPages = res?.data?.totalPages || 0;
      const currentPage = res?.data?.page || 1;
      setNotifications(prev => isLoadMore ? [...prev, ...results] : results)
      setTotalUnRead(res?.data?.countUnRead || 0);
      setHasMore(currentPage < totalPages);
    }
  };
  // huy khi cancel
  const onCancelChangePassModal = () => setShowChangePassModal(false);
  // tat model khi thao tac thanh cong
  const onCallbackChangePassModal = () => setShowChangePassModal(false);

  const onCancelUpdateUserInforModal = () => setShowUpdateUserInforModal(false);
  const onCallbackUpdateUserInforModal = () =>
    setShowUpdateUserInforModal(false);
  const onChangeBranch = (val) => {
    setValueBranch(val);
    localStorage.setItem(STORAGE_KEY.BRANCH_CHANGE, val);
    window.location.reload();
  };
  const goToHome = () => {
    navigate("main");
  };
  const handleChangeLanguage = (_val) => {
    setCurrentLanguage(_val);
    localStorage.setItem(STORAGE_KEY.LANGUAGE, _val);
    i18n.changeLanguage(_val);
    window.location.reload();
  };
  const handleClickNoti = async (noti) => {
    navigate(noti?.webSubUrl?.startsWith('/') ? noti?.webSubUrl : `/${noti?.webSubUrl}`);
    // window.open(noti.url, "_blank");
    if (!noti.isOpen) {
      setTotalUnRead((prev) => prev - 1);
    }
    try {
      await _unitOfWork.notification.readNotification({ id: noti.id });
      setNotifications(prev =>
        prev.map(item => item.id === noti.id ? { ...item, isOpen: true } : item)
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thông báo:", error);
    }
  }
  const handleDeleteNoti = async ({ domEvent }, notiId) => {
    domEvent.stopPropagation();
    try {
      await _unitOfWork.notification.deleteNotificationUser({ id: notiId });
      setNotifications(prev => prev.filter(item => item.id !== notiId));
      const deletedNoti = notifications.find(n => n.id === notiId);
      if (deletedNoti && !deletedNoti.isOpen) {
        setTotalUnRead(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thông báo:", error);
    }
  }
  const handleToggleReadStatus = async ({ domEvent }, notiId, isOpen) => {
    domEvent.stopPropagation();
    try {
      isOpen ? await _unitOfWork.notification.readNotification({ id: notiId })
        : await _unitOfWork.notification.unReadNotification({ id: notiId });
      setNotifications(prev =>
        prev.map(item => item.id === notiId ? { ...item, isOpen: isOpen } : item)
      );
      setTotalUnRead(prev => isOpen ? Math.max(0, prev - 1) : prev + 1);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };
  const handleReadAll = async (e) => {
    e.stopPropagation();
    try {
      await _unitOfWork.notification.readAllNotification();
      setNotifications(prev =>
        prev.map(item => !item.isOpen ? { ...item, isOpen: true } : item)
      );
      setTotalUnRead(0);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  }
  const formatNotiTime = (createdAt) => {
    const now = dayjs();
    const notiDate = dayjs(createdAt);
    const diffInHours = now.diff(notiDate, 'hour');
    if (diffInHours < 21) {
      return notiDate.fromNow();
    } else {
      return notiDate.format('HH:mm - DD/MM/YYYY');
    }
  };
  const actionNoti = (noti) => {
    return (
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu>
            {noti.isOpen === false ? (
              <Menu.Item
                key="1"
                onClick={(info) => handleToggleReadStatus(info, noti.id, true)}
              >
                <span>
                  <CheckOutlined className="mr-2" />
                  {t("notification.mark_as_read")}
                </span>
              </Menu.Item>
            ) : (
              <Menu.Item
                key="2"
                onClick={(info) => handleToggleReadStatus(info, noti.id, false)}
              >
                <span>
                  <EyeInvisibleOutlined className="mr-2" />
                  {t("notification.mark_as_unread")}
                </span>
              </Menu.Item>
            )}
            <Menu.Item
              key="3"
              onClick={(info) => handleDeleteNoti(info, noti.id)}
            >
              <span style={{ color: '#ff4d4f', }}>
                <DeleteOutlined className="mr-2" />
                {t("notification.delete_noti")}
              </span>
            </Menu.Item>
          </Menu>
        }
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ padding: '4px 8px', cursor: 'pointer' }}
        >
          <MoreOutlined
            style={{ fontSize: '16px' }}
          />
        </div>
      </Dropdown>
    );
  };
  const menuNotification = (
    <Menu style={{ width: 350, maxHeight: 450, overflowY: 'auto', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold', fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span>{t("notification.title")}</span>
        <Tooltip title={t("notification.mark_all_as_read")}>
          <CheckCircleOutlined
            style={{
              padding: '4px 0px 4px 8px',
              fontSize: 20
            }}
            onClick={(e) => handleReadAll(e)}
          />
        </Tooltip>
      </div>
      <Form.Item name="status" style={{ marginBottom: 12 }}>
        <Segmented
          block
          options={notificationStatus.Options.map((opt) => ({
            value: opt.value,
            label: (
              <div style={{ padding: '4px 0' }}>
                {t(opt.label)}
              </div>
            ),
          }))}
          style={{
            backgroundColor: '#ddddddff',
            borderRadius: '0',
            padding: '2px'
          }}
        />
      </Form.Item>
      {notifications && notifications.length > 0 ? (
        notifications.map((noti) => (
          <Menu.Item
            key={noti.id}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #b9aeaeff',
              borderLeft: '1px solid #b9aeaeff',
              cursor: 'pointer',
              backgroundColor: noti.isOpen ? '#ffffff' : '#cbdef5ff',
              marginBottom: '4px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              {actionNoti(noti)}
            </div>
            <a
              onClick={() => handleClickNoti(noti)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <Avatar
                src={noti.icon || "https://resource.medicmms.vn/logo-small.png"}
                size={40}
                style={{ marginRight: 12, flexShrink: 0 }}
              />

              <div style={{ whiteSpace: 'normal', lineHeight: '1.4' }}>
                <div style={{ fontWeight: 600, color: '#262626', marginBottom: 2 }}>
                  {noti.title || noti.tag || "Thông báo hệ thống"}
                </div>

                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                  {noti.text}
                </Text>

                <Space style={{ fontSize: 11, color: '#acaaaaff' }}>
                  <ClockCircleOutlined />
                  {formatNotiTime(noti.createdAt)}
                </Space>
              </div>
            </a>
          </Menu.Item>
        ))
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          {t("notification.no_noti")}
        </div>
      )}

      {hasMore && notifications.length > 0 && (
        <div
          style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid #f0f0f0', backgroundColor: '#ece6e6ff', borderRadius: '6px' }}
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchGetNotifications(nextPage, true);
          }}
        >
          <span
            style={{ fontSize: 13, color: '#1890ff', cursor: 'pointer' }}
          >
            {t("notification.more")}
          </span>
        </div>
      )}
    </Menu>
  );
  return (
    <Form labelWrap form={form}>
      <div className="header-container-main d-flex">
        <div className="d-flex">
          <img onClick={goToHome} src={LogoPng} className="logo-menu" />
          <div className="name-company-header">{headerTitle}</div>
        </div>
        <div className="float-right d-flex right-header-item">
          <div className="mr-3 d-flex">
            <Select
              value={currentLanguage}
              style={{ width: 160, alignSelf: "center" }}
              className="mr-2"
              onChange={handleChangeLanguage}
              options={[
                {
                  value: "vi",
                  label: (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <img
                        src={image_vi}
                        alt="Vietnamese"
                        style={{ width: 20, height: 18, borderRadius: 2 }}
                      />
                      <span>{t("layout.header.language.vi")}</span>
                    </div>
                  ),
                },
                {
                  value: "en",
                  label: (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <img
                        src={image_en}
                        alt="English"
                        style={{ width: 20, height: 18, borderRadius: 2 }}
                      />
                      <span>{t("layout.header.language.en")}</span>
                    </div>
                  ),
                },
              ]}
            />
            {/* <div className="title-branch">
              {t("layout.header.branch.label")}{" "}
            </div> */}
            {/* <Select
              onChange={onChangeBranch}
              value={valueBranch}
              style={{ width: "250px", alignSelf: "center" }}
            >
              {branchs &&
                branchs.map((_branch) => {
                  return (
                    <Select.Option value={_branch.id}>
                      {_branch.name}
                    </Select.Option>
                  );
                })}
              <Select.Option value="all">
                {t("layout.header.branch.all")}
              </Select.Option>
            </Select> */}
          </div>
          <Dropdown
            className="mr-3"
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <a onClick={() => setShowUpdateUserInforModal(true)}>
                    {t("layout.header.menu.update_info")}
                  </a>
                </Menu.Item>
                <Menu.Item key="2">
                  <a onClick={() => setShowChangePassModal(true)}>
                    {t("layout.header.menu.change_password")}
                  </a>
                </Menu.Item>
                <Menu.Item key="3">
                  <a onClick={logout}>{t("layout.header.menu.logout")}</a>
                </Menu.Item>
              </Menu>
            }
          >
            <span
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ verticalAlign: "middle", marginRight: "5px" }}
                src={
                  user?.avatar
                    ? _unitOfWork.resource.getImage(user?.avatar)
                    : null
                }
              ></Avatar>
              {user?.fullName}
            </span>
          </Dropdown>
          <Dropdown overlay={menuNotification} trigger={['click']} placement="bottomRight" className="mr-4">
            <Badge
              count={totalUnRead}
              overflowCount={99}
              offset={[-2, 2]}
              size="small"
            >
              <BellOutlined style={{ fontSize: "28px", cursor: 'pointer', padding: 4 }} />
            </Badge>
          </Dropdown>
          {/* <Button icon={<FolderOutlined />}>{niceBytes(totalSizeUsed)}</Button> */}
        </div>
      </div>
      <ChangePasswordModal
        isModalOpen={showChangePassModal}
        onCancel={onCancelChangePassModal}
        onCallback={onCallbackChangePassModal}
      ></ChangePasswordModal>
      <UpdateProfileModal
        open={showUpdateUserInforModal}
        onCancel={onCancelUpdateUserInforModal}
        onCallback={onCallbackUpdateUserInforModal}
        user={user}
      ></UpdateProfileModal>
    </Form>
  );
}
