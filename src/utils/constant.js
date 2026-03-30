export const PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: null,
  totalRecord: 0,
};
export const STORAGE_KEY = {
  USER: "USER",
  TOKEN: "TOKEN",
  PERMISSION: "PERMISSION",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  BRANCH_CHANGE: "BRANCH_CHANGE",
  BRANCHS: "BRANCHS",
  COMPANY_SETTING: "COMPANY_SETTING",
  LANGUAGE: "LANGUAGE",
};
export const FORMAT_DATE = "DD-MM-YYYY";
export const FORMAT_DATETIME = "DD-MM-YYYY HH:mm";
export const FORMAT_MINUTE = "HH:mm";
export const FORMAT_INPUT_DATE = "YYYY-MM-DD";
export const FILE_EXTENSION = {
  WORD: [".doc", ".docm", ".docx", ".dot", ".dotm", ".dotx"],
  EXCEL: [
    ".xlsx",
    ".xlsm",
    ".xlsb",
    ".xltx",
    ".xltm",
    ".xls",
    ".xlt",
    ".xls",
    ".xlam",
    ".xla",
    ".xlw",
    ".xlr",
  ],
  XML: [".xml"],
  TEXT: [".txt"],
  PDF: [".pdf"],
  IMAGE: [".jpg", ".jpeg", ".png", ".gif"],
  FOLDER: "FOLDER",
};
export const ServiceTaskType = {
  // chưa làm
  inspection: "inspection",
  monitoring: "monitoring",
  calibration: "calibration",
  Options: [
    { label: "constant.serviceTaskType.inspection", value: "inspection" },
    { label: "constant.serviceTaskType.monitoring", value: "monitoring" },
    { label: "constant.serviceTaskType.calibration", value: "calibration" },
  ],
  // review: 'review',
  // approval: 'approval',
  // spaceReplacement: 'spare-replacement'
};

export const measuringTypeOptions = {
  Incremental: "Incremental",
  Incidental: "Incidental",
  Option: [
    {
      label: "constant.measuringTypeOptions.incremental",
      value: "Incremental",
    },
    { label: "constant.measuringTypeOptions.incidental", value: "Incidental" },
  ],
};
export const frequencyOptions = {
  Days: "Days",
  Weeks: "Weeks",
  Months: "Months",
  Years: "Years",
  Option: [
    {
      label: "Days",
      value: 1,
    },
    {
      label: "Weeks",
      value: 2,
    },
    {
      label: "Months",
      value: 3,
    },
    {
      label: "Years",
      value: 4,
    },
  ],
};

export const additionalInfoType = {
  OneLine: "OneLine",
  Multiplelines: "Multiplelines",
  Option: [
    { label: "One Line", value: 1 },
    { label: "Multiple lines", value: 2 },
  ],
};

export const managedByType = {
  ServiceAgency: "ServiceAgency",
  Option: [{ label: "Service Agency", value: 1 }],
};
export const documentTypes = {
  UserGuide: "UserGuide",
  Troubleshooting: "Troubleshooting",
  Spec: "Spec",
  Drawing: "Drawing",
  Others: "Others",
  Option: [
    { label: "User Guide", value: 1 },
    { label: "Troubleshooting", value: 2 },
    { label: "Spec", value: 3 },
    { label: "Drawing", value: 4 },
    { label: "Others", value: 5 },
  ],
};

export const ScheduleBasedOnType = {
  // chưa làm
  Calendar: "Calendar",
  // Monitoring: "Monitoring",
  // CalendarOrMonitoring: "CalendarOrMonitoring",
  Adhoc: "Adhoc",
  ConditionBasedSchedule: "ConditionBasedSchedule",
  Option: [
    { value: "Calendar", label: "constant.scheduleBasedOnType.calendar" },
    // { value: "Monitoring", label: "constant.scheduleBasedOnType.monitoring" },
    // {
    //   value: "CalendarOrMonitoring",
    //   label: "constant.scheduleBasedOnType.calendarOrMonitoring",
    // },
    { value: "Adhoc", label: "constant.scheduleBasedOnType.adhoc" },
    {
      value: "ConditionBasedSchedule",
      label: "constant.scheduleBasedOnType.conditionBasedSchedule",
    },
  ],
};

export const frequencyAllOptions = {
  Hours: "Hours",
  RepeatHours: "RepeatHours",
  Date: "Date",
  RepeaetWeekDays: "RepeaetWeekDays",
  Days: "Days",
  Weeks: "Weeks",
  Months: "Months",
  Years: "Years",
  Option: [
    {
      label: "constant.frequencyAllOptions.Hours",
      value: "Hours",
    },
    {
      label: "constant.frequencyAllOptions.RepeatHours",
      value: "RepeatHours",
    },
    {
      label: "constant.frequencyAllOptions.Days",
      value: "Days",
    },
    {
      label: "constant.frequencyAllOptions.Date",
      value: "Date",
    },
    {
      label: "constant.frequencyAllOptions.RepeaetWeekDays",
      value: "RepeaetWeekDays",
    },
    {
      label: "constant.frequencyAllOptions.Weeks",
      value: "Weeks",
    },
    {
      label: "constant.frequencyAllOptions.Months",
      value: "Months",
    },
    {
      label: "constant.frequencyAllOptions.Years",
      value: "Years",
    },
  ],
};

export const priorityType = {
  High: "High",
  Medium: "Medium",
  Low: "Low",
  Option: [
    {
      label: "constant.priorityType.high",
      value: "High",
      color: "#ff4d4f",
    },
    {
      label: "constant.priorityType.medium",
      value: "Medium",
      color: "#faad14",
    },
    {
      label: "constant.priorityType.low",
      value: "Low",
      color: "#52c41a",
    },
  ],
};
export const contractType = {
  ServiceTechnician: "constant.contractType.serviceTechnician",
  ServiceContractor: "constant.contractType.serviceContractor",
  Customer: "constant.contractType.customer",
  Option: [
    { label: "Kỹ thuật viên dịch vụ", value: 1 },
    { label: "Nhà thầu dịch vụ", value: 2 },
    { label: "Khách hàng", value: 3 },
  ],
};

export const assetType = {
  MachineEquipment: "MachineEquipment",
  MeasuringEquipment: "MeasuringEquipment",
  Facility: "Facility",
  Options: [
    {
      label: "Thiết bị máy móc",
      value: 1,
    },
    {
      label: "Thiết bị đo lường",
      value: 2,
    },
    {
      label: "Thiết bị phụ",
      value: 3,
    },
  ],
};

export const serviceTypeOptions = [
  {
    label: "Asset Based Ticket",
    value: "asset-based-ticket",
  },
];
export const preventiveTypeOtions = [
  // {
  //   label: "Cerate Ticket",
  //   value: "create-ticket",
  // },
  {
    label: "Condition based Schedule",
    value: "condition-based-schedule",
  },
];

export const frequencyTypeOptions = [
  {
    label: "constant.frequencyTypeOptions.daily",
    value: "daily",
  },
  {
    label: "constant.frequencyTypeOptions.weekly",
    value: "weekly",
  },
  {
    label: "constant.frequencyTypeOptions.monthly",
    value: "monthly",
  },
  {
    label: "constant.frequencyTypeOptions.yearly",
    value: "yearly",
  },
];
export const formatCurrency = (value) => {
  if (typeof value !== "number") {
    value = Number(value);
  }
  if (isNaN(value)) return "0 ₫";

  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};
export const servicePackageType = {
  amc: "amc",
  warranty: "warranty",
  short_term: "short_term",
};
export const optionServicePackageType = [
  {
    label: "constant.optionServicePackageType.amc",
    value: "amc",
  },
  {
    label: "constant.optionServicePackageType.warranty",
    value: "warranty",
  },
  {
    label: "constant.optionServicePackageType.short_term",
    value: "short_term",
  },
];

export const statusAssignUser = {
  cancel_confirm: "constant.statusAssignUser.cancel_confirm",
  confirm: "constant.statusAssignUser.confirm",
  await_confirm: "constant.statusAssignUser.await_confirm",
};

export const formatFloat = (number, decimals = 2) => {
  if (typeof number !== "number") return "0.00";
  return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const answerTypeInspection = {
  value: "value",
  yesNoNa: "yes/no/na",
  numbericValue: "numberic-value",
  on: "on",
  range: "rang",
  lessThanOrEqual: "less-than-or-equal",
  greaterThanOrEqual: "greater-than-or-equal",
};

export const ticketStatuOptions = {
  New: "constant.ticketStatus.new",
  Assigned: "constant.ticketStatus.assigned",
  InProgress: "constant.ticketStatus.inProgress",
  Completed: "constant.ticketStatus.completed",
  Closed: "constant.ticketStatus.closed",
  Cloesed: "constant.ticketStatus.closed",
  Accepted: "constant.ticketStatus.accepted",
};

export const breakdownTicketStatus = {
  new: "new",
  inProgress: "inProgress",
  cloesed: "cloesed",
  overdue: "overdue",
  completed: "completed",
  Option: [
    { label: "constant.ticketStatus.new", value: "new" },
    { label: "constant.ticketStatus.inProgress", value: "inProgress" },
    { label: "constant.ticketStatus.cloesed", value: "cloesed" },
    { label: "constant.ticketStatus.overdue", value: "overdue" },
    { label: "constant.ticketStatus.completed", value: "completed" },
  ],
};

export const breakdownStatus = {
  new: "new",
  assigned: "assigned",
  accepted: "accepted",
  inProgress: "inProgress",
  cancelled: "cancelled",
  cloesed: "cloesed",
  rejected: "rejected",
  submitted: "submitted",
  WWA: "WWA",
  completed: "completed",
  replacement: "replacement",
  experimentalFix: "experimentalFix",
  reopen: "reopen",
  Option: [
    { label: "constant.breakdownStatus.new", value: "new", color: "#1890ff" },
    {
      label: "constant.breakdownStatus.assigned",
      value: "assigned",
      color: "#21d9a4",
    },
    { label: "constant.breakdownStatus.reopen", value: "reopen", color: "red" },
    {
      label: "constant.breakdownStatus.inProgress",
      value: "inProgress",
      color: "#5BBD2B",
    },
    {
      label: "constant.breakdownStatus.accepted",
      value: "accepted",
      color: "#13c2c2",
    },
    {
      label: "constant.breakdownStatus.completed",
      value: "completed",
      color: "#52c41a",
    },
    {
      label: "constant.breakdownStatus.rejected",
      value: "rejected",
      color: "#ff4d4f",
    },
    {
      label: "constant.breakdownStatus.cancelled",
      value: "cancelled",
      color: "#ff4d4f",
    },
    {
      label: "constant.breakdownStatus.replacement",
      value: "replacement",
      color: "#ff4d4f",
    },
    { label: "constant.breakdownStatus.WWA", value: "WWA", color: "#ff4d4f" },
    {
      label: "constant.breakdownStatus.experimentalFix",
      value: "experimentalFix",
      color: "#79378B",
    },
    {
      label: "constant.breakdownStatus.closed",
      value: "cloesed",
      color: "#ff0000ff",
    },
    {
      label: "constant.breakdownStatus.submitted",
      value: "submitted",
      color: "#5ae615ff",
    },
  ],
};

export const breakdownUserStatus = {
  assigned: "assigned",
  inProgress: "inProgress",
  awaiting: "awaiting",
  accepted: "accepted",
  rejected: "rejected",
  cancelled: "cancelled",
  completed: "completed",
  replacement: "replacement",
  experimentalFix: "experimentalFix",
  WCA: "WCA",
  WWA: "WWA",
  cloesed: "cloesed",
  reassignment: "reassignment",
  requestForSupport: "requestForSupport",
  reopen: "reopen",
  pending_approval: "pending_approval",
  approved: "approved",
  submitted: "submitted",
  spareReplace: "spareReplace",
  Option: [
    {
      label: "constant.breakdownUserStatus.assigned",
      value: "assigned",
      color: "#21d9a4",
    },
    {
      label: "constant.breakdownUserStatus.reassignment",
      value: "reassignment",
      color: "#1890ff",
    },
    {
      label: "constant.breakdownUserStatus.awaiting",
      value: "awaiting",
      color: "#3AA1FF",
    },
    {
      label: "constant.breakdownUserStatus.pending_approval",
      value: "pending_approval",
      color: "#3AA1FF",
    },
    {
      label: "constant.breakdownUserStatus.inProgress",
      value: "inProgress",
      color: "#5BBD2B",
    },
    {
      label: "constant.breakdownUserStatus.accepted",
      value: "accepted",
      color: "#13c2c2",
    },
    {
      label: "constant.breakdownUserStatus.approved",
      value: "approved",
      color: "#1890ff",
    },
    {
      label: "constant.breakdownUserStatus.submitted",
      value: "submitted",
      color: "#52c41a",
    },
    {
      label: "constant.breakdownUserStatus.spareReplace",
      value: "spareReplace",
      color: "#52c41a",
    },
    {
      label: "constant.breakdownUserStatus.requestForSupport",
      value: "requestForSupport",
      color: "#faad14",
    },
    {
      label: "constant.breakdownUserStatus.WCA",
      value: "WCA",
      color: "#faad14",
    },
    {
      label: "constant.breakdownUserStatus.WWA",
      value: "WWA",
      color: "#faad14",
    },
    {
      label: "constant.breakdownUserStatus.experimentalFix",
      value: "experimentalFix",
      color: "#79378B",
    },
    {
      label: "constant.breakdownUserStatus.completed",
      value: "completed",
      color: "#52c41a",
    },
    {
      label: "constant.breakdownUserStatus.cloesed",
      value: "cloesed",
      color: "#8c8c8c",
    },
    {
      label: "constant.breakdownUserStatus.reopen",
      value: "reopen",
      color: "#1890ff",
    },
    {
      label: "constant.breakdownUserStatus.rejected",
      value: "rejected",
      color: "#ff4d4f",
    },
    {
      label: "constant.breakdownUserStatus.cancelled",
      value: "cancelled",
      color: "#ff4d4f",
    },
    {
      label: "constant.breakdownUserStatus.replacement",
      value: "replacement",
      color: "#ff4d4f",
    },
  ],
};

export const answerTypeSeftDiagnosia = {
  option: "option",
  range: "range",
  options: [
    { label: "constant.answerTypeSeftDiagnosia.option", value: "option" },
    { label: "constant.answerTypeSeftDiagnosia.range", value: "range" },
  ],
};

export const assetModelDocumentCategory = {
  instruction: "constant.assetModelDocumentCategory.instruction",
  troubleshooting: "constant.assetModelDocumentCategory.troubleshooting",
  specification: "constant.assetModelDocumentCategory.specification",
  drawing: "constant.assetModelDocumentCategory.drawing",
  other: "constant.assetModelDocumentCategory.other",
  calibration: "constant.assetModelDocumentCategory.calibration",
  schedulePreventive: "constant.assetModelDocumentCategory.schedulePreventive",
};

export const depreciationTypes = {
  straightLine: "straightLine",
  doubleDecliningBalance: "doubleDecliningBalance",
  unitOfProductionDepreciationMethod: "unitOfProductionDepreciationMethod",
  sumOfTheYearsDigitsDepreciationMethod:
    "sumOfTheYearsDigitsDepreciationMethod",
  Options: [
    { label: "constant.depreciationTypes.straightLine", value: "straightLine" },
    {
      label: "constant.depreciationTypes.doubleDecliningBalance",
      value: "doubleDecliningBalance",
    },
    {
      label: "constant.depreciationTypes.unitOfProductionDepreciationMethod",
      value: "unitOfProductionDepreciationMethod",
    },
    {
      label: "constant.depreciationTypes.sumOfTheYearsDigitsDepreciationMethod",
      value: "sumOfTheYearsDigitsDepreciationMethod",
    },
  ],
};
export const depreciationBases = {
  lifespan: "lifespan",
  percentage: "percentage",
  Option: [
    { label: "constant.depreciationBases.lifespan", value: "lifespan" },
    { label: "constant.depreciationBases.percentage", value: "percentage" },
  ],
};
export const optionDurationType = [
  {
    label: "Ngày",
    value: "day",
  },
  {
    label: "Tháng",
    value: "month",
  },
  {
    label: "Năm",
    value: "year",
  },
];
export const progressStatus = {
  new: "new",
  raised: "raised",
  assigned: "assigned",
  inProgress: "inProgress",
  awaiting: "awaiting",
  accepted: "accepted",
  rejected: "rejected",
  cancelled: "cancelled",
  completed: "completed",
  replacement: "replacement",
  experimentalFix: "experimentalFix",
  WCA: "WCA",
  WWA: "WWA",
  cloesed: "cloesed",
  reassignment: "reassignment",
  requestForSupport: "requestForSupport",
  partiallyCompleted: "partiallyCompleted",
  completeRecalibrationIssue: "completeRecalibrationIssue",
  reopen: "reopen",
  Option: [
    { label: "Tạo mới", value: "new" },
    { label: "Đã được kích hoạt", value: "raised" },
    { label: "Được chỉ định", value: "assigned" },
    { label: "Đang tiến hành", value: "inProgress" },
    { label: "Chờ xử lý", value: "awaiting" },
    { label: "Đã được chấp nhận", value: "accepted" },
    { label: "Đã từ chối", value: "rejected" },
    { label: "Đã hủy", value: "cancelled" },
    { label: "Đã hoàn thành", value: "completed" },
    { label: "Đã thay thế", value: "replacement" },
    { label: "Đã sửa thử nghiệm", value: "experimentalFix" },
    { label: "WCA", value: "WCA" },
    { label: "WWA", value: "Chờ phê duyệt" },
    { label: "Đóng", value: "cloesed", color: "#dde01a" },
    { label: "Phân công lại", value: "reassignment", color: "red" },
    {
      label: "Request For Support",
      value: "requestForSupport",
      color: "#dde01a",
    },
    { label: "Mở lại", value: "reopen" },
    { label: "Hoàn thành một phần", value: "partiallyCompleted" },
    {
      label: "Hoàn thành sự cố, kiểm định / hiệu chuẩn lại",
      value: "completeRecalibrationIssue",
    },
  ],
};
export const breakdownSpareRequestStatus = {
  // pending_approval: "pending_approval",
  approved: "approved",
  rejected: "rejected",
  submitted: "submitted",
  spareReplace: "spareReplace",
  Option: [
    { label: "Đã gửi", value: "submitted" },
    { label: "Đã thay thế", value: "spareReplace" },
    // { label: "Chờ duyệt phụ tùng", value: "pending_approval" },
    { label: "Chờ gửi phụ tùng", value: "approved" },
    { label: "Đã từ chối", value: "rejected", color: "red" },
  ],
};
export const breakdownSpareRequestDetailStatus = {
  pending_approval: "pending_approval",
  approved: "approved",
  rejected: "rejected",
  submitted: "submitted",
  spareReplace: "spareReplace",
  Option: [
    { label: "Đã gửi", value: "submitted" },
    { label: "Đã thay thế", value: "spareReplace" },
    { label: "Chờ duyệt phụ tùng", value: "pending_approval" },
    { label: "Chờ gửi phụ tùng", value: "approved" },
    { label: "Đã từ chối", value: "rejected", color: "red" },
  ],
};

export const priorityLevelStatus = {
  immediate: "immediate",
  emergent: "emergent",
  urgent: "urgent",
  semiUrgent: "semiUrgent",
  nonUrgent: "nonUrgent",
  Options: [
    { label: "Khẩn cấp ngay lập tức", value: "immediate", color: "red" },
    { label: "Cấp cứu khẩn cấp", value: "emergent", color: "#7535e9" },
    { label: "Khẩn cấp", value: "urgent", color: "orange" },
    { label: "Khá khẩn cấp", value: "semiUrgent", color: "purple" },
    { label: "Không khẩn cấp", value: "nonUrgent", color: "green" },
  ],
};
export const ActionStatusMap = {
  pendingApproval: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Đã từ chối",
};

export const weekDaysOptions = [
  { label: "Thứ 2", value: "Monday" },
  { label: "Thứ 3", value: "Tuesday" },
  { label: "Thứ 4", value: "Wednesday" },
  { label: "Thứ 5", value: "Thursday" },
  { label: "Thứ 6", value: "Friday" },
  { label: "Thứ 7", value: "Saturday" },
  { label: "Chủ nhật", value: "Sunday" },
];

export const ticketPreventiveStatus = {
  new: "new",
  inProgress: "inProgress",
  overdue: "overdue",
  upcoming: "upcoming",
  closed: "closed",
  Options: [
    { label: "Thêm mới", value: "new" },
    { label: "Đang tiến hành", value: "inProgress" },
    { label: "Quá hạn", value: "overdue" },
    { label: "Sắp tới", value: "upcoming" },
    { label: "Đóng", value: "closed" },
  ],
};

export const ticketSchedulePreventiveStatus = {
  new: "new",
  inProgress: "inProgress",
  overdue: "overdue",
  upcoming: "upcoming",
  history: "history",
  Options: [
    { label: "constant.ticketSchedulePreventiveStatus.new", value: "new" },
    {
      label: "constant.ticketSchedulePreventiveStatus.inProgress",
      value: "inProgress",
    },
    {
      label: "constant.ticketSchedulePreventiveStatus.overdue",
      value: "overdue",
    },
    {
      label: "constant.ticketSchedulePreventiveStatus.upcoming",
      value: "upcoming",
    },
    {
      label: "constant.ticketSchedulePreventiveStatus.history",
      value: "history",
    },
  ],
};
export const assetMaintenanceStatus = {
  isActive: "isActive",
  isNotActive: "isNotActive",
  Options: [
    {
      label: "constant.assetMaintenanceStatus.isActive",
      value: "isActive",
      color: "#00FF00",
    },
    {
      label: "constant.assetMaintenanceStatus.isNotActive",
      value: "isNotActive",
      color: "red",
    },
  ],
};
export const preventiveStatus = {
  new: "new",
  started: "started",
  stoped: "stoped",
  Options: [
    { label: "constant.preventiveStatus.new", value: "new", color: "#1890ff" },
    {
      label: "constant.preventiveStatus.started",
      value: "started",
      color: "#21d9a4",
    },
    {
      label: "constant.preventiveStatus.stoped",
      value: "stoped",
      color: "#1890ff",
    },
  ],
};
export const calibrationStatus = {
  new: "new",
  started: "started",
  stoped: "stoped",
  Options: [
    { label: "Thêm mới", value: "new", color: "#1890ff" },
    {
      label: "constant.preventiveStatus.started",
      value: "started",
      color: "#21d9a4",
    },
    {
      label: "constant.preventiveStatus.stoped",
      value: "stoped",
      color: "red",
    },
  ],
};

export const schedulePreventiveStatus = {
  new: "new",
  inProgress: "inProgress",
  waitingForAdminApproval: "waitingForAdminApproval",
  skipped: "skipped",
  completed: "completed",
  cancelled: "cancelled",
  submitted: "submitted",
  Options: [
    {
      label: "constant.schedulePreventiveStatus.new",
      value: "new",
      color: "#1890ff",
    },
    {
      label: "constant.schedulePreventiveStatus.inProgress",
      value: "inProgress",
      color: "#5BBD2B",
    },
    {
      label: "constant.schedulePreventiveStatus.waitingForAdminApproval",
      value: "waitingForAdminApproval",
      color: "#faad14",
    },
    {
      label: "constant.schedulePreventiveStatus.completed",
      value: "completed",
      color: "#00FF00",
    },
    {
      label: "constant.schedulePreventiveStatus.cancelled",
      value: "cancelled",
      color: "#ff4d4f",
    },
    {
      label: "constant.schedulePreventiveStatus.skipped",
      value: "skipped",
      color: "#1890ff",
    },
    {
      label: "constant.schedulePreventiveStatus.submitted",
      value: "submitted",
      color: "#5BBD2B",
    },
  ],
};

export const schedulePreventiveTaskAssignUserStatus = {
  assigned: "assigned",
  accepted: "accepted",
  replacement: "replacement",
  inProgress: "inProgress",
  cancelled: "cancelled",
  completed: "completed",
  skipped: "skipped",
  reassignment: "reassignment",
  partiallyCompleted: "partiallyCompleted",
  reopen: "reopen",
  pendingApproval: "pending_approval",
  approved: "approved",
  submitted: "submitted",
  Options: [
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.assigned",
      value: "assigned",
      color: "#21d9a4",
    }, // xanh ngọc: giống breakdown
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.accepted",
      value: "accepted",
      color: "#13c2c2",
    }, // xanh teal
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.replacement",
      value: "replacement",
      color: "#ff4d4f",
    }, // đỏ
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.reassignment",
      value: "reassignment",
      color: "#1890ff",
    }, // xanh dương
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.inProgress",
      value: "inProgress",
      color: "#5BBD2B",
    }, // xanh lá
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.cancelled",
      value: "cancelled",
      color: "#ff4d4f",
    }, // đỏ
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.completed",
      value: "completed",
      color: "#52c41a",
    }, // xanh lá nhạt
    {
      label:
        "constant.schedulePreventiveTaskAssignUserStatus.partiallyCompleted",
      value: "partiallyCompleted",
      color: "#faad14",
    }, // cam: cảnh báo
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.skipped",
      value: "skipped",
      color: "#8c8c8c",
    }, // xám
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.reopen",
      value: "reopen",
      color: "#1890ff",
    }, // xanh dương
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.pendingApproval",
      value: "pending_approval",
      color: "#1890ff",
    },
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.approved",
      value: "approved",
      color: "#1890ff",
    },
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.submitted",
      value: "submitted",
      color: "#1890ff",
    },
  ],
};

export const historySchedulePreventiveStatus = {
  assigned: "assigned",
  accepted: "accepted",
  replacement: "replacement",
  inProgress: "inProgress",
  completed: "completed",
  partiallyCompleted: "partiallyCompleted",
  skipped: "skipped",
  cancelled: "cancelled",
  reassignment: "reassignment",
  reopen: "reopen",
  new: "new",
  closed: "closed",
  waitingForAdminApproval: "waitingForAdminApproval",
  Options: [
    {
      label: "constant.historySchedulePreventiveStatus.assigned",
      value: "assigned",
    },
    {
      label: "constant.historySchedulePreventiveStatus.accepted",
      value: "accepted",
    },
    {
      label: "constant.historySchedulePreventiveStatus.replacement",
      value: "replacement",
    },
    {
      label: "constant.historySchedulePreventiveStatus.reassignment",
      value: "reassignment",
    },
    {
      label: "constant.historySchedulePreventiveStatus.inProgress",
      value: "inProgress",
    },
    {
      label: "constant.historySchedulePreventiveStatus.cancelled",
      value: "cancelled",
    },
    {
      label: "constant.historySchedulePreventiveStatus.completed",
      value: "completed",
    },
    {
      label: "constant.historySchedulePreventiveStatus.partiallyCompleted",
      value: "partiallyCompleted",
    },
    {
      label: "constant.historySchedulePreventiveStatus.skipped",
      value: "skipped",
    },
    {
      label: "constant.historySchedulePreventiveStatus.reopen",
      value: "reopen",
    },
    { label: "constant.historySchedulePreventiveStatus.new", value: "new" },
    {
      label: "constant.historySchedulePreventiveStatus.closed",
      value: "closed",
    },
    {
      label: "constant.historySchedulePreventiveStatus.waitingForAdminApproval",
      value: "waitingForAdminApproval",
    },
  ],
};
export const reportView = {
  summary: "summary",
  details: "details",
  Options: [
    { label: "constant.reportView.summary", value: "summary" },
    { label: "constant.reportView.details", value: "details" },
  ],
};
export const typeReportAssetMaintenanceResquest = {
  breakdown: "breakdown",
  schedulePreventive: "schedulePreventive",
  Options: [
    {
      label: "constant.typeReportAssetMaintenanceResquest.breakdown",
      value: "breakdown",
    },
    {
      label: "constant.typeReportAssetMaintenanceResquest.schedulePreventive",
      value: "schedulePreventive",
    },
  ],
};
export const spareRequestType = {
  spareReplace: "spareReplace",
  spareRequest: "spareRequest",
  Options: [
    {
      label: "constant.assetModelSpareRequestCategory.spareReplace",
      value: "spareReplace",
    },
    {
      label: "constant.assetModelSpareRequestCategory.spareRequest",
      value: "spareRequest",
    },
  ],
};
export const schedulePreventiveTaskRequestSparePartStatus = {
  pendingApproval: "pending_approval",
  approved: "approved",
  rejected: "rejected",
  submitted: "submitted",
  spareReplace: "spareReplace",
  Options: [
    {
      value: "pending_approval",
      label: "constant.assetModelSpareRequestCategory.pending_approval",
    },
    // {  không dùng đến trạng thái này
    //   value: "approved",
    //   label: "constant.assetModelSpareRequestCategory.approved",
    // },
    {
      value: "rejected",
      label: "constant.assetModelSpareRequestCategory.rejected",
    },
    {
      value: "submitted",
      label: "constant.assetModelSpareRequestCategory.submitted",
    },
    {
      value: "spareReplace",
      label: "constant.assetModelSpareRequestCategory.spareReplace",
    },
  ],
};
export const schedulePreventiveTaskRequestSparePartDetailStatus = {
  pendingApproval: "pending_approval",
  approved: "approved",
  rejected: "rejected",
  submitted: "submitted",
  spareReplace: "spareReplace",
  Options: [
    {
      value: "pending_approval",
      label: "constant.assetModelSpareRequestCategory.pending_approval",
    },
    {
      value: "approved",
      label: "constant.assetModelSpareRequestCategory.approved",
    },
    {
      value: "rejected",
      label: "constant.assetModelSpareRequestCategory.rejected",
    },
    {
      value: "submitted",
      label: "constant.assetModelSpareRequestCategory.submitted",
    },
    {
      value: "spareReplace",
      label: "constant.assetModelSpareRequestCategory.spareReplace",
    },
  ],
};
export const dateType = {
  days: "days",
  weeks: "weeks",
  months: "months",
  years: "years",
  Options: [
    {
      label: "Days",
      value: "days",
    },
    {
      label: "Weeks",
      value: "weeks",
    },
    {
      label: "Months",
      value: "months",
    },
    {
      label: "Years",
      value: "years",
    },
  ],
};

export const calibrationGroupStatus = {
  new: "new",
  inProgress: "inProgress",
  overdue: "overdue",
  upcoming: "upcoming",
  history: "history",
  Options: [
    { label: "constant.ticketSchedulePreventiveStatus.new", value: "new" },
    {
      label: "constant.ticketSchedulePreventiveStatus.inProgress",
      value: "inProgress",
    },
    {
      label: "constant.ticketSchedulePreventiveStatus.overdue",
      value: "overdue",
    },
    {
      label: "constant.ticketSchedulePreventiveStatus.upcoming",
      value: "upcoming",
    },
    {
      label: "constant.ticketSchedulePreventiveStatus.history",
      value: "history",
    },
  ],
};
export const calibrationWorkStatus = {
  new: "new",
  inProgress: "inProgress",
  waitingForAdminApproval: "waitingForAdminApproval",
  completed: "completed",
  cancelled: "cancelled",
  reOpen: "reOpen",
  Options: [
    {
      label: "constant.schedulePreventiveStatus.new",
      value: "new",
      color: "#1890ff",
    },
    {
      label: "constant.schedulePreventiveStatus.inProgress",
      value: "inProgress",
      color: "#5BBD2B",
    },
    {
      label: "constant.schedulePreventiveStatus.waitingForAdminApproval",
      value: "waitingForAdminApproval",
      color: "#faad14",
    },
    {
      label: "constant.schedulePreventiveStatus.completed",
      value: "completed",
      color: "#00FF00",
    },
    {
      label: "constant.schedulePreventiveStatus.cancelled",
      value: "cancelled",
      color: "#ff4d4f",
    },
    {
      label: "constant.schedulePreventiveStatus.reOpen",
      value: "reOpen",
      color: "#ff4d4f",
    },
  ],
};
export const calibrationWorkAssignUserStatus = {
  assigned: "assigned",
  accepted: "accepted",
  replacement: "replacement",
  inProgress: "inProgress",
  cancelled: "cancelled",
  completed: "completed",
  reassignment: "reassignment",
  partiallyCompleted: "partiallyCompleted",
  completeRecalibrationIssue: "completeRecalibrationIssue",
  Options: [
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.assigned",
      value: "assigned",
      color: "#21d9a4",
    }, // xanh ngọc: giống breakdown
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.accepted",
      value: "accepted",
      color: "#13c2c2",
    }, // xanh teal
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.replacement",
      value: "replacement",
      color: "#ff4d4f",
    }, // đỏ
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.reassignment",
      value: "reassignment",
      color: "#1890ff",
    }, // xanh dương
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.inProgress",
      value: "inProgress",
      color: "#5BBD2B",
    }, // xanh lá
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.cancelled",
      value: "cancelled",
      color: "#ff4d4f",
    }, // đỏ
    {
      label: "constant.schedulePreventiveTaskAssignUserStatus.completed",
      value: "completed",
      color: "#52c41a",
    }, // xanh lá nhạt
    {
      label:
        "constant.schedulePreventiveTaskAssignUserStatus.partiallyCompleted",
      value: "partiallyCompleted",
      color: "#faad14",
    },
    {
      label:
        "constant.schedulePreventiveTaskAssignUserStatus.completeRecalibrationIssue",
      value: "completeRecalibrationIssue",
      color: "#faad14",
    },
  ],
};
export const monitoringType = {
  every: "every",
  on: "on",
  Options: [
    {
      value: "every",
      label: "Every",
    },
    {
      value: "on",
      label: "On",
    },
  ],
};

export const exportTypeStockIssue = {
  USAGE: "USAGE",
  DISPOSAL: "DISPOSAL",
  Options: [
    {
      label: "constant.exportTypeStockIssue.usage",
      value: "USAGE",
      color: "#52c41a",
    },
    {
      label: "constant.exportTypeStockIssue.disposal",
      value: "DISPOSAL",
      color: "#1890ff",
    },
  ],
};

export const statusMyTaskMap = {
  new: ["assigned", "accepted"],
  inProgress: [
    "inProgress",
    "partiallyCompleted",
    "pending_approval",
    "approved",
    "submitted",
  ],
  overdue: [
    "inProgress",
    "assigned",
    "accepted",
    "partiallyCompleted",
    "pending_approval",
    "approved",
    "submitted",
  ],
  upcoming: ["assigned", "accepted"],
  history: [
    "skipped",
    "completed",
    "cancelled",
    "reassignment",
    "reopen",
    "replacement",
    "rejected",
  ],
};
export const typeOfMaintenance = {
  preventive: "preventive",
  monitoring: "monitoring",
  options: [
    {
      label: "menu.maintenance_request.preventive_condition_based_schedule",
      value: "preventive",
    },
    { label: "constant.scheduleBasedOnType.monitoring", value: "monitoring" },
  ],
};

export const advanceNoticeType = {
  options: [
    { label: "Phút", value: "minute" },
    { label: "Giờ", value: "hour" },
    { label: "Ngày", value: "day" },
  ],
};

export const approvedTaskType = {
  spare_request_breakdown: "spare_request_breakdown",
  spare_request_schedule_preventive: "spare_request_schedule_preventive",
  close_breakdown: "close_breakdown",
  preventive: "preventive",
  trial_repair_approval: "trial_repair_approval",
  close_calibration: "close_calibration",
  supplies_need: "supplies_need",
  purchase_request: "purchase_request",
};
export const notificationStatus = {
  all: "all",
  read: "read",
  unread: "unread",
  Options: [
    { label: "notification.all", value: "all" },
    { label: "notification.unread", value: "unread" },
    { label: "notification.read", value: "read" },
  ],
};
export const stockLocationCode = {
  INTERNAL_MAIN: "INTERNAL_MAIN",
  VIRTUAL_MAIN: "VIRTUAL_MAIN",
  VIRTUAL_USE: "VIRTUAL_USE",
};
export const jobSummaryType = {
  BREAKDOWN: "BREAKDOWN",
  CALIBRATION_WORK: "CALIBRATION_WORK",
  SCHEDULE_PREVENTIVE: "SCHEDULE_PREVENTIVE",
  ALL: "ALL",
  Options: [
    { label: "jobSummaty.breakdown", value: "BREAKDOWN" },
    { label: "jobSummaty.calibration_work", value: "CALIBRATION_WORK" },
    { label: "jobSummaty.schedule_preventive", value: "SCHEDULE_PREVENTIVE" },
    { label: "jobSummaty.all", value: "ALL" },
  ],
};
export const jobSummaryStatus = {
  new: "new",
  assigned: "assigned",
  accepted: "accepted",
  inProgress: "inProgress",
  cancelled: "cancelled",
  cloesed: "cloesed",
  rejected: "rejected",
  submitted: "submitted",
  WWA: "WWA",
  completed: "completed",
  replacement: "replacement",
  experimentalFix: "experimentalFix",
  reopen: "reopen",
  waitingForAdminApproval: "waitingForAdminApproval",
  skipped: "skipped",
  Options: [
    { label: "constant.breakdownStatus.new", value: "new", color: "#1890ff" },
    {
      label: "constant.breakdownStatus.assigned",
      value: "assigned",
      color: "#21d9a4",
    },
    { label: "constant.breakdownStatus.reopen", value: "reopen", color: "red" },
    {
      label: "constant.breakdownStatus.inProgress",
      value: "inProgress",
      color: "#5BBD2B",
    },
    {
      label: "constant.breakdownStatus.accepted",
      value: "accepted",
      color: "#13c2c2",
    },
    {
      label: "constant.breakdownStatus.completed",
      value: "completed",
      color: "#52c41a",
    },
    {
      label: "constant.breakdownStatus.rejected",
      value: "rejected",
      color: "#ff4d4f",
    },
    {
      label: "constant.breakdownStatus.cancelled",
      value: "cancelled",
      color: "#ff4d4f",
    },
    {
      label: "constant.breakdownStatus.replacement",
      value: "replacement",
      color: "#ff4d4f",
    },
    { label: "constant.breakdownStatus.WWA", value: "WWA", color: "#ff4d4f" },
    {
      label: "constant.breakdownStatus.experimentalFix",
      value: "experimentalFix",
      color: "#79378B",
    },
    {
      label: "constant.breakdownStatus.closed",
      value: "cloesed",
      color: "#ff0000ff",
    },
    {
      label: "constant.breakdownStatus.submitted",
      value: "submitted",
      color: "#5ae615ff",
    },
    {
      label: "constant.schedulePreventiveStatus.skipped",
      value: "skipped",
      color: "#1890ff",
    },
    {
      label: "constant.schedulePreventiveStatus.waitingForAdminApproval",
      value: "waitingForAdminApproval",
      color: "#faad14",
    },
    {
      label: "constant.assetModelSpareRequestCategory.pending_approval",
      value: "pending_approval",
      color: "#faad14",
    },
    {
      label: "constant.breakdownUserStatus.WCA",
      value: "WCA",
      color: "#faad14",
    },
    {
      label: "constant.historySchedulePreventiveStatus.partiallyCompleted",
      value: "partiallyCompleted",
      color: "#faad14",
    },
    {
      label: "constant.breakdownUserStatus.reassignment",
      value: "reassignment",
      color: "#1890ff",
    },
    {
      label: "constant.breakdownUserStatus.requestForSupport",
      value: "requestForSupport",
      color: "#dde01a",
    },
    {
      label: "constant.breakdownUserStatus.approved",
      value: "approved",
      color: "#1890ff",
    },
    {
      label:
        "constant.schedulePreventiveTaskAssignUserStatus.completeRecalibrationIssue",
      value: "completeRecalibrationIssue",
      color: "#faad14",
    },
    { label: "constant.breakdownStatus.reopen", value: "reopen", color: "red" },
  ],
};
export const FUNDING_SOFURCES = [
  { value: "stateBudget", label: "assetMaintenance.state_budget" },
  { value: "socialize", label: "assetMaintenance.socialization" },
  { value: "otherSources", label: "assetMaintenance.other_sources" },
];
export const evaluates = {
  done: "done",
  notDone: "not-done",
  Options: [
    { value: "done", label: "Hoàn thành" },
    { value: "not-done", label: "Chưa hoàn thành" },
  ],
};
export const answerTypes = [
  { label: "workTask.answerTypes.yes_no_na", value: "yes/no/na" },
  { label: "workTask.answerTypes.value", value: "value" },
  {
    label: "workTask.answerTypes.numberic_value",
    value: "numberic-value",
  },
];
export const filterByProcessingBreakdown = {
  customer: "customer",
  assetMaintenance: "assetMaintenance",
  Options: [
    { label: "filterByProcessingBreakdown.customer", value: "customer" },
    {
      label: "filterByProcessingBreakdown.assetMaintenance",
      value: "assetMaintenance",
    },
  ],
};
export const propertyInspectionStatus = {
  waitingForAdminApproval: "waitingForAdminApproval",
  partiallyCompleted: "partiallyCompleted",
  completed: "completed",
  cancelled: "cancelled",
  Options: [
    {
      label: "Chờ phê duyệt của quản trị viên",
      value: "waitingForAdminApproval",
      color: "#ceec22",
    },
    {
      label: "Một phần đã hoàn thành",
      value: "partiallyCompleted",
      color: "#1890ff",
    },
    {
      label: "Đã hoàn thành",
      value: "completed",
      color: "#5BBD2B",
    },
    {
      label: "Đã hủy",
      value: "cancelled",
      color: "#ff4d4f",
    },
  ],
};
export const attachmentBreakdownCategory = {
  REPAIR: "attachmentBreakdownCategory.repair",
  INCIDENT: "attachmentBreakdownCategory.incident",
  CLOSE: "attachmentBreakdownCategory.close",
};

export const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".json",
  ".mp4",
];
export const createNewUsingAFormulaType = {
  healthInsurance: "healthInsurance",
  anotherFormula: "anotherFormula",
  healthInsuranceDecree3176: "healthInsuranceDecree3176",
  Options: [
    { value: "anotherFormula", label: "Một công thức khác" },
    {
      value: "healthInsurance",
      label: "Công thức bảo hiểm y tế - QĐ-4750-QD-BYT",
    },
    { value: "healthInsuranceDecree3176", label: "Công thức - QĐ-3176-QD-BYT" },
  ],
};
export const allowViewAllType = {
  yes: true,
  no: false,
  Options: [
    { value: true, label: "department.list.all_views_are_allowed" },
    { value: false, label: "department.list.departmental_views_only" },
  ],
};
export const assetStatusOptions = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  PENDING_CANCEL: "PENDING_CANCEL",
  PENDING_DISPOSAL: "PENDING_DISPOSAL",
  PENDING_RETURN: "PENDING_RETURN",
  RETURNED: "RETURNED",
  Options: [
    { value: "ACTIVE", label: "assetStatusOptions.active", color: "green" },
    { value: "PAUSED", label: "assetStatusOptions.paused", color: "orange" },
    {
      value: "PENDING_CANCEL",
      label: "assetStatusOptions.pendingCancel",
      color: "red",
    },
    {
      value: "PENDING_DISPOSAL",
      label: "assetStatusOptions.pendingDisposal",
      color: "purple",
    },
    {
      value: "RETURNED",
      label: "assetStatusOptions.returned",
      color: "purple",
    },
    {
      value: "PENDING_RETURN",
      label: "assetStatusOptions.pendingReturn",
      color: "gold"
    },
  ],
};

export const assetStyleMap = {
  machineryAndEquipment: 1,
  measuringEquipment: 2,
  accessories: 3,
};
