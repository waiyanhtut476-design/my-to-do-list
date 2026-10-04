export type Language = 'th' | 'en' | 'my';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'my', name: 'Myanmar (Burma)', nativeName: 'မြန်မာ', flag: '🇲🇲' },
];

export const translations = {
  th: {
    // Navigation
    nav_tasks: 'งานที่ต้องทำ',
    nav_calendar: 'ปฏิทิน',
    nav_analytics: 'สถิติ',
    nav_settings: 'ตั้งค่า',
    
    // Header
    greeting: 'สวัสดี',
    today_badge: 'วันนี้',
    notifications: 'การแจ้งเตือน',
    unread_badge: 'ใหม่',
    settings_and_profile: 'ตั้งค่าและโปรไฟล์',
    user_default: 'คุณ',
    syncing_cloud_data: 'กำลังดึงข้อมูลเรียลไทม์จากคลาวด์...',
    back: 'ย้อนกลับ',

    // Tasks View
    progress_summary: 'สรุปความคืบหน้า',
    progress_done_100: 'เสร็จครบ 100% แล้ว! 🎉',
    progress_done_great: 'ยอดเยี่ยมมาก! ✨',
    progress_done_start: 'เคลียร์งานวันนี้กันเถอะ! 📝',
    progress_desc_done: 'คุณทำงานสำเร็จครบถ้วนทุกรายการสำหรับวันนี้!',
    progress_desc_ongoing: 'อีกนิดเดียวจะครบเป้าหมายของวันแล้ว!',
    tasks_unit: 'งาน',
    filter_all: 'ทั้งหมด',
    filter_urgent: 'งานด่วน ⚡',
    filter_project: 'โปรเจกต์ 💼',
    filter_personal: 'ส่วนตัว 🏡',
    filter_completed: 'เสร็จสิ้นแล้ว ✅',
    pending_tasks: 'งานที่ค้างอยู่',
    pending_badge: 'งานค้าง',
    no_pending: 'ไม่มีงานค้างอยู่ในขณะนี้',
    no_pending_sub: 'ยินดีด้วยกับการเคลียร์งานตามเป้าหมายครับ!',
    completed_tasks: 'เสร็จสิ้นแล้ว',
    completed_history_empty: 'ไม่มีประวัติงานเสร็จสิ้น',
    show: 'แสดง',
    hide: 'ซ่อน',
    priority_high: '🔴 ด่วนมาก',
    priority_medium: '🟡 ปานกลาง',
    priority_normal: '🟢 ปกติ',
    priority_high_label: 'ด่วนมาก',
    priority_medium_label: 'ปานกลาง',
    priority_normal_label: 'ปกติ',
    subtasks_title: 'รายการงานย่อย',
    subtasks_unit: 'ข้อย่อย',
    subtasks_done_suffix: 'เสร็จแล้ว',
    add_item: '+ เพิ่มรายการ',
    cat_work: 'งานบริษัท',
    cat_project: 'โปรเจกต์',
    cat_personal: 'ส่วนตัว',
    cat_learning: 'การเรียนรู้',
    delete_confirm_title: 'ยืนยันการลบงาน',
    delete_confirm_desc: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการงานนี้อย่างถาวร? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    cancel: 'ยกเลิก',
    delete: 'ลบข้อมูล',
    mark_completed: 'ทำเครื่องหมายเสร็จสิ้น',
    mark_uncompleted: 'ทำต่อ',

    // Task Modal
    modal_mode_task: 'งานที่ต้องทำ',
    modal_mode_meeting: 'นัดหมาย',
    save: 'บันทึก',
    title_label_task: 'ชื่องานที่ต้องทำ',
    title_label_meeting: 'ชื่อนัดหมาย / การประชุม',
    title_placeholder_task: 'พิมพ์ชื่องานที่ต้องทำ...',
    title_placeholder_meeting: 'พิมพ์ชื่อนัดหมาย / การประชุม...',
    voice_typing: 'พิมพ์ด้วยเสียง',
    voice_success: 'ตรวจจับเสียงเรียบร้อย',
    description_placeholder: 'รายละเอียดเพิ่มเติม...',
    category_title: 'หมวดหมู่โครงการ',
    quick_schedule: 'กำหนดด่วน:',
    today_chip: 'วันนี้',
    tomorrow_chip: 'พรุ่งนี้',
    plus3days_chip: 'อีก 3 วัน',
    nextweek_chip: 'สัปดาห์หน้า',
    select_date: 'เลือกวันที่',
    or_type_date: 'หรือพิมพ์วันที่:',
    time_unit: 'น.',
    all_day: 'ตลอดทั้งวัน (All day)',
    all_day_label: 'ตลอดวัน',
    priority_section: 'ระดับความสำคัญ',
    add_subtask_placeholder: 'เขียนหัวข้องานย่อยแล้วกดบวก...',
    shortcuts_title: 'ทางลัดด่วน',
    attach_file: 'แนบไฟล์',
    google_meet: 'Google Meet',
    location: 'สถานที่',
    create_task_button: 'สร้างงานใหม่',
    title_required_hint: '* กรุณาระบุชื่องานด้านบนก่อนบันทึก',
    demo_feature_attach: 'ฟีเจอร์นี้ได้รับการจำลองในเดโม: แนบไฟล์',

    // Calendar View
    calendar_today: 'วันนี้',
    view_month: 'เดือน',
    view_week: 'สัปดาห์',
    view_agenda: 'กำหนดการ',
    calendar_legend_urgent: 'ด่วนมาก',
    calendar_legend_normal: 'งานทั่วไป',
    calendar_legend_completed: 'เสร็จสิ้น',
    gcal_connected: 'เชื่อมต่อ Google Calendar เรียบร้อยแล้ว',
    gcal_updated: 'อัปเดตแล้ว',
    daily_tasks_count: 'งานที่ต้องจัดการวันนี้',
    no_schedule_today: '😴 ไม่มีนัดหมายหรือกำหนดส่งในวันนี้',
    no_schedule_sub: 'พักผ่อนให้เต็มที่ หรือกดจัดตารางเพื่อเริ่ม!',

    // Analytics View
    analytics_header_title: 'วิเคราะห์ความคืบหน้า',
    analytics_header_sub: 'ภาพรวมการทำงานรายสัปดาห์',
    analytics_great_banner: 'ยอดเยี่ยมมาก! คุณเคลียร์งานใกล้ทะลุเป้าหมายแล้ว ✨',
    analytics_keepgoing_banner: 'สู้ๆ นะ! อีกนิดเดียวจะเคลียร์งานสำเร็จตามเป้าหมายครับ 🚀',
    stat_completed: 'ทำเสร็จแล้ว',
    stat_pending: 'งานค้างอยู่',
    chart_weekly_title: 'กราฟสถิติการเคลียร์งานรายวัน',
    chart_this_week: 'สัปดาห์นี้',
    category_dist_title: 'สัดส่วนตามหมวดหมู่โครงการ',
    efficiency_title: 'ดัชนีประสิทธิภาพสัปดาห์นี้',
    efficiency_badge: 'ประสิทธิภาพสูงมาก',
    efficiency_desc: 'คุณจัดการงานสำคัญได้ตรงเวลาและบรรลุเป้าหมายอย่างต่อเนื่อง',
    today_chart_legend: 'วันนี้',
    past_chart_legend: 'วันที่ผ่านมา',
    recommendation_title: 'คำแนะนำเพื่อประสิทธิภาพที่ดียิ่งขึ้น',
    recommendation_desc: 'ในสัปดาห์นี้ คุณทำงานที่มีระดับความสำคัญสูง (งานด่วน) สำเร็จเสร็จสิ้นตรงตามเวลา 100% รักษามาตรฐานความสม่ำเสมอนี้ไว้นะครับ! สมองจะทำงานได้ดีที่สุดหากเริ่มจัดเรียงลำดับความสำคัญก่อนลงมือทำ',

    // Settings View
    settings_main_title: 'ตั้งค่าแอปพลิเคชัน',
    settings_main_desc: 'จัดการการซิงค์ ภาษา รูปลักษณ์ และการแจ้งเตือน',
    cloud_saved_badge: 'บันทึกแล้ว',
    reset_defaults: 'รีเซ็ต',
    lang_section_title: 'ภาษาของแอปพลิเคชัน (Language)',
    lang_section_desc: 'เลือกภาษาที่ต้องการใช้งาน: ไทย, English หรือ မြန်မာ',
    notify_master_title: 'อนุญาตการแจ้งเตือนทั้งหมด',
    notify_master_desc: 'รับการแจ้งเตือนสำคัญเกี่ยวกับงาน นัดหมาย และสรุปภารกิจประจำวัน',
    theme_section_title: 'โหมดการแสดงผล (Theme)',
    theme_section_desc: 'ปรับโทนสีหน้าจอให้เหมาะสมกับสภาพแวดล้อม เพื่อความสบายตาในการใช้งาน',
    theme_light: 'โหมดสว่าง (Light)',
    theme_dark: 'โหมดมืด (Dark)',
    theme_light_desc: 'สะอาดตา สดใสในที่แสงจ้า',
    theme_dark_desc: 'ถนอมสายตา ประหยัดพลังงาน',
    reminder_title: 'ตั้งเวลาเตือนล่วงหน้า (Early Reminders)',
    reminder_desc: 'เลือกเวลาที่ต้องการให้แจ้งเตือนก่อนถึงกำหนดส่งงานสำคัญ',
    urgent_tasks_heading: 'งานด่วนมาก (High Priority Tasks)',
    repeat_reminder: 'เตือนซ้ำก่อนครบกำหนด 10 นาที',
    general_tasks_heading: 'งานทั่วไป (General Tasks)',
    general_tasks_value: 'เตือนก่อน 30 นาที',
    account_section_title: 'บัญชีผู้ใช้และระบบคลาวด์ซิงค์',
    current_account_label: 'บัญชีปัจจุบัน:',
    account_sync_desc: 'ข้อมูลรายการงาน การตั้งค่า และตารางกิจกรรมของคุณจะถูกซิงค์ข้อมูลแยกเป็นส่วนตัวบนคลาวด์แบบเรียลไทม์ ปลอดภัยและเรียกดูได้จากทุกอุปกรณ์',
    logout_button: 'ออกจากระบบบัญชีส่วนตัว',

    // Toast Messages
    toast_saved: 'บันทึกการเปลี่ยนแปลงแล้ว',
    toast_dark_theme: 'สลับเป็นโหมดมืดเรียบร้อยแล้ว',
    toast_light_theme: 'สลับเป็นโหมดสว่างเรียบร้อยแล้ว',
    toast_lang_changed: 'เปลี่ยนภาษาเรียบร้อยแล้ว (Language updated)',
    toast_reset: 'รีเซ็ตเป็นค่าเริ่มต้นเรียบร้อย',

    // Notification Modal
    notif_modal_title: 'การแจ้งเตือน',
    notif_modal_desc: 'อัปเดตงาน นัดหมาย และความคืบหน้าทีม',
    mark_all_read: 'อ่านทั้งหมด',
    notif_filter_all: 'ทั้งหมด',
    notif_filter_urgent: 'งานใกล้ถึงกำหนด ⏰',
    notif_filter_meeting: 'นัดหมาย & ประชุม 📅',
    notif_filter_team: 'อัปเดตทีม 👥',
    no_notifications: 'ไม่มีการแจ้งเตือนใหม่',
    no_notifications_sub: 'เมื่อมีงานใกล้ถึงกำหนดหรือการอัปเดต ระบบจะแสดงที่นี่',
    snooze: 'เลื่อนเวลา',

    // Auth Screen
    auth_login_title: 'เข้าสู่ระบบบัญชีส่วนตัว',
    auth_register_title: 'สร้างบัญชีเข้าใช้งาน',
    auth_login_tab: 'เข้าสู่ระบบ',
    auth_register_tab: 'สมัครสมาชิก',
    auth_login_desc: 'ข้อมูลจะถูกบันทึกแยกและคุ้มครองอย่างปลอดภัยผ่านฐานข้อมูลคลาวด์ของคุณเอง',
    auth_email_placeholder: 'อีเมล (เช่น name@example.com)',
    auth_password_placeholder: 'รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)',
    auth_name_placeholder: 'ชื่อที่แสดงในระบบ',
    auth_login_btn: 'เข้าสู่ระบบทันที',
    auth_register_btn: 'สร้างบัญชีใหม่',
    auth_or: 'หรือเข้าสู่ระบบด้วย',
    auth_google_btn: 'เข้าสู่ระบบด้วย Google',
    auth_connecting_cloud: 'กำลังเชื่อมต่อฐานข้อมูลคลาวด์...',
    auth_secure_realtime: 'Clarity Flow - ปลอดภัยและเรียลไทม์',
  },

  en: {
    // Navigation
    nav_tasks: 'Tasks',
    nav_calendar: 'Calendar',
    nav_analytics: 'Analytics',
    nav_settings: 'Settings',

    // Header
    greeting: 'Hello',
    today_badge: 'Today',
    notifications: 'Notifications',
    unread_badge: 'New',
    settings_and_profile: 'Settings & Profile',
    user_default: 'User',
    syncing_cloud_data: 'Fetching real-time cloud data...',
    back: 'Back',

    // Tasks View
    progress_summary: 'Progress Summary',
    progress_done_100: '100% Completed! 🎉',
    progress_done_great: 'Great Job! ✨',
    progress_done_start: "Let's clear tasks today! 📝",
    progress_desc_done: 'You have completed all tasks for today!',
    progress_desc_ongoing: 'Almost reached your daily goal!',
    tasks_unit: 'tasks',
    filter_all: 'All',
    filter_urgent: 'Urgent ⚡',
    filter_project: 'Project 💼',
    filter_personal: 'Personal 🏡',
    filter_completed: 'Completed ✅',
    pending_tasks: 'Pending Tasks',
    pending_badge: 'pending',
    no_pending: 'No pending tasks at this moment',
    no_pending_sub: 'Congratulations on clearing your goals!',
    completed_tasks: 'Completed',
    completed_history_empty: 'No completed task history yet',
    show: 'Show',
    hide: 'Hide',
    priority_high: '🔴 High',
    priority_medium: '🟡 Medium',
    priority_normal: '🟢 Normal',
    priority_high_label: 'High',
    priority_medium_label: 'Medium',
    priority_normal_label: 'Normal',
    subtasks_title: 'Subtasks',
    subtasks_unit: 'items',
    subtasks_done_suffix: 'completed',
    add_item: '+ Add item',
    cat_work: 'Work',
    cat_project: 'Project',
    cat_personal: 'Personal',
    cat_learning: 'Learning',
    delete_confirm_title: 'Confirm Deletion',
    delete_confirm_desc: 'Are you sure you want to permanently delete this task? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    mark_completed: 'Mark as completed',
    mark_uncompleted: 'Resume task',

    // Task Modal
    modal_mode_task: 'Task',
    modal_mode_meeting: 'Meeting',
    save: 'Save',
    title_label_task: 'Task Name',
    title_label_meeting: 'Meeting Title',
    title_placeholder_task: 'Enter task name...',
    title_placeholder_meeting: 'Enter meeting title...',
    voice_typing: 'Voice dictation',
    voice_success: 'Voice detected successfully',
    description_placeholder: 'Additional details...',
    category_title: 'Category',
    quick_schedule: 'Quick set:',
    today_chip: 'Today',
    tomorrow_chip: 'Tomorrow',
    plus3days_chip: '+3 Days',
    nextweek_chip: 'Next Week',
    select_date: 'Select Date',
    or_type_date: 'Or enter date:',
    time_unit: '',
    all_day: 'All day',
    all_day_label: 'All Day',
    priority_section: 'Priority Level',
    add_subtask_placeholder: 'Add subtask and click plus...',
    shortcuts_title: 'Quick Shortcuts',
    attach_file: 'Attach file',
    google_meet: 'Google Meet',
    location: 'Location',
    create_task_button: 'Create Task',
    title_required_hint: '* Please provide a title above before saving',
    demo_feature_attach: 'Demo simulation: Attach file',

    // Calendar View
    calendar_today: 'Today',
    view_month: 'Month',
    view_week: 'Week',
    view_agenda: 'Agenda',
    calendar_legend_urgent: 'High Priority',
    calendar_legend_normal: 'Normal',
    calendar_legend_completed: 'Completed',
    gcal_connected: 'Google Calendar synchronized',
    gcal_updated: 'Updated',
    daily_tasks_count: 'tasks scheduled for today',
    no_schedule_today: '😴 No events or deadlines today',
    no_schedule_sub: 'Enjoy your rest, or schedule a new task!',

    // Analytics View
    analytics_header_title: 'Performance Analytics',
    analytics_header_sub: 'Weekly Productivity Overview',
    analytics_great_banner: 'Outstanding! You are crushing your goals ✨',
    analytics_keepgoing_banner: 'Keep going! Just a bit more to achieve your targets 🚀',
    stat_completed: 'Completed',
    stat_pending: 'Pending',
    chart_weekly_title: 'Daily Task Completion Chart',
    chart_this_week: 'This Week',
    category_dist_title: 'Tasks by Category',
    efficiency_title: 'Efficiency Score',
    efficiency_badge: 'High Efficiency',
    efficiency_desc: 'You consistently complete important priorities on schedule.',
    today_chart_legend: 'Today',
    past_chart_legend: 'Past days',
    recommendation_title: 'Productivity Recommendation',
    recommendation_desc: 'This week, you completed 100% of high-priority urgent tasks on schedule. Keep up the great consistency! Prioritizing early yields peak focus.',

    // Settings View
    settings_main_title: 'Application Settings',
    settings_main_desc: 'Manage language, sync, theme, and notifications',
    cloud_saved_badge: 'Synced',
    reset_defaults: 'Reset',
    lang_section_title: 'Language (ภาษา / ဘာသာစကား)',
    lang_section_desc: 'Select your preferred language: Thai, English, or Myanmar (Burmese)',
    notify_master_title: 'Allow All Notifications',
    notify_master_desc: 'Receive alerts for deadlines, scheduled meetings, and daily briefings',
    theme_section_title: 'Theme & Appearance',
    theme_section_desc: 'Choose light or dark mode for maximum comfort',
    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
    theme_light_desc: 'Clean & crisp in bright environments',
    theme_dark_desc: 'Easy on the eyes & saves battery',
    reminder_title: 'Early Reminders',
    reminder_desc: 'Set when to receive reminders before deadlines',
    urgent_tasks_heading: 'High Priority Tasks',
    repeat_reminder: 'Repeat reminder 10 mins before due',
    general_tasks_heading: 'General Tasks',
    general_tasks_value: 'Remind 30 mins before',
    account_section_title: 'User Account & Cloud Sync',
    current_account_label: 'Current Account:',
    account_sync_desc: 'Your tasks, settings, and schedules are synchronized securely to the cloud in real time across all devices.',
    logout_button: 'Sign out of personal account',

    // Toast Messages
    toast_saved: 'Changes saved',
    toast_dark_theme: 'Switched to Dark Mode',
    toast_light_theme: 'Switched to Light Mode',
    toast_lang_changed: 'Language updated successfully',
    toast_reset: 'Reset to default settings',

    // Notification Modal
    notif_modal_title: 'Notifications',
    notif_modal_desc: 'Task updates, meetings, and team briefings',
    mark_all_read: 'Mark all as read',
    notif_filter_all: 'All',
    notif_filter_urgent: 'Upcoming Due ⏰',
    notif_filter_meeting: 'Meetings & Events 📅',
    notif_filter_team: 'Team Updates 👥',
    no_notifications: 'No new notifications',
    no_notifications_sub: 'When tasks near deadlines or updates arrive, they will appear here.',
    snooze: 'Snooze',

    // Auth Screen
    auth_login_title: 'Sign in to Account',
    auth_register_title: 'Create an Account',
    auth_login_tab: 'Sign In',
    auth_register_tab: 'Register',
    auth_login_desc: 'Your tasks and schedules are stored and protected securely in your cloud database.',
    auth_email_placeholder: 'Email (e.g. name@example.com)',
    auth_password_placeholder: 'Password (min. 6 characters)',
    auth_name_placeholder: 'Your Display Name',
    auth_login_btn: 'Sign In',
    auth_register_btn: 'Create Account',
    auth_or: 'Or sign in with',
    auth_google_btn: 'Sign in with Google',
    auth_connecting_cloud: 'Connecting to Cloud Database...',
    auth_secure_realtime: 'Clarity Flow - Secure & Real-time',
  },

  my: {
    // Navigation
    nav_tasks: 'အလုပ်များ',
    nav_calendar: 'ပြက္ခဒိန်',
    nav_analytics: 'စာရင်းအင်း',
    nav_settings: 'ဆက်တင်များ',

    // Header
    greeting: 'မင်္ဂလာပါ',
    today_badge: 'ယနေ့',
    notifications: 'အသိပေးချက်များ',
    unread_badge: 'အသစ်',
    settings_and_profile: 'ဆက်တင်နှင့် ပရိုဖိုင်',
    user_default: 'မိတ်ဆွေ',
    syncing_cloud_data: 'Cloud မှ အချက်အလက်များကို ရယူနေပါသည်...',
    back: 'နောက်သို့',

    // Tasks View
    progress_summary: 'တိုးတက်မှု အကျဉ်းချုပ်',
    progress_done_100: '၁၀၀% အောင်မြင်စွာ ပြီးစီးပါပြီ! 🎉',
    progress_done_great: 'အရမ်းကောင်းပါတယ်! ✨',
    progress_done_start: 'ဒီနေ့ အလုပ်တွေကို စတင်လုပ်ဆောင်ကြစို့! 📝',
    progress_desc_done: 'ဒီနေ့အတွက် သတ်မှတ်ထားသော အလုပ်အားလုံး ပြီးစီးပါပြီ!',
    progress_desc_ongoing: 'ဒီနေ့ရည်မှန်းချက် ပြည့်မီရန် အနည်းငယ်သာ လိုပါတော့တယ်!',
    tasks_unit: 'ခု',
    filter_all: 'အားလုံး',
    filter_urgent: 'အရေးကြီး ⚡',
    filter_project: 'ပရောဂျက် 💼',
    filter_personal: 'ကိုယ်ပိုင် 🏡',
    filter_completed: 'ပြီးစီးပြီး ✅',
    pending_tasks: 'ကျန်ရှိနေသော အလုပ်များ',
    pending_badge: 'ကျန်ရှိ',
    no_pending: 'လက်ရှိတွင် ကျန်ရှိနေသော အလုပ်မရှိပါ',
    no_pending_sub: 'အလုပ်များအားလုံး ပြီးမြောက်သည့်အတွက် ဂုဏ်ယူပါသည်!',
    completed_tasks: 'ပြီးစီးပြီးသော အလုပ်များ',
    completed_history_empty: 'ပြီးစီးပြီးသော အလုပ်မှတ်တမ်း မရှိသေးပါ',
    show: 'ပြရန်',
    hide: 'ဝှက်ရန်',
    priority_high: '🔴 အလွန်အရေးကြီး',
    priority_medium: '🟡 အလယ်အလတ်',
    priority_normal: '🟢 သာမန်',
    priority_high_label: 'အလွန်အရေးကြီး',
    priority_medium_label: 'အလယ်အလတ်',
    priority_normal_label: 'သာမန်',
    subtasks_title: 'လုပ်ငန်းခွဲများ',
    subtasks_unit: 'ခု',
    subtasks_done_suffix: 'ပြီးစီးပြီး',
    add_item: '+ အချက်အလက်ထည့်ရန်',
    cat_work: 'ကုမ္ပဏီအလုပ်',
    cat_project: 'ပရောဂျက်',
    cat_personal: 'ကိုယ်ပိုင်',
    cat_learning: 'လေ့လာသင်ယူမှု',
    delete_confirm_title: 'အလုပ်ဖျက်ရန် အတည်ပြုပါ',
    delete_confirm_desc: 'ဤအလုပ်ကို အပြီးတိုင် ဖျက်ပစ်ရန် သေချာပါသလား? ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍မရပါ။',
    cancel: 'မလုပ်တော့ပါ',
    delete: 'ဖျက်မည်',
    mark_completed: 'ပြီးစီးကြောင်း မှတ်သားမည်',
    mark_uncompleted: 'ပြန်လည်လုပ်ဆောင်မည်',

    // Task Modal
    modal_mode_task: 'အလုပ်',
    modal_mode_meeting: 'အစည်းအဝေး',
    save: 'သိမ်းမည်',
    title_label_task: 'အလုပ်ခေါင်းစဉ်',
    title_label_meeting: 'အစည်းအဝေး ခေါင်းစဉ်',
    title_placeholder_task: 'အလုပ်အမည် ရေးပါ...',
    title_placeholder_meeting: 'အစည်းအဝေးအမည် ရေးပါ...',
    voice_typing: 'အသံဖြင့် စာရိုက်ရန်',
    voice_success: 'အသံကို အောင်မြင်စွာ ဖမ်းယူရရှိပါသည်',
    description_placeholder: 'အသေးစိတ် အချက်အလက်များ...',
    category_title: 'ပရောဂျက် အမျိုးအစား',
    quick_schedule: 'အမြန်သတ်မှတ်ရန်:',
    today_chip: 'ယနေ့',
    tomorrow_chip: 'မနက်ဖြန်',
    plus3days_chip: '၃ ရက်အကြာ',
    nextweek_chip: 'နောက်အပတ်',
    select_date: 'ရက်စွဲရွေးပါ',
    or_type_date: 'သို့မဟုတ် ရက်စွဲထည့်ပါ:',
    time_unit: 'နာရီ',
    all_day: 'တစ်နေကုန် (All day)',
    all_day_label: 'တစ်နေကုန်',
    priority_section: 'ဦးစားပေး အဆင့်',
    add_subtask_placeholder: 'လုပ်ငန်းခွဲရေးပြီး အပေါင်းကိုနှိပ်ပါ...',
    shortcuts_title: 'ဖြတ်လမ်းများ',
    attach_file: 'ဖိုင်တွဲရန်',
    google_meet: 'Google Meet',
    location: 'နေရာ',
    create_task_button: 'အလုပ်အသစ် ဖန်တီးမည်',
    title_required_hint: '* သိမ်းဆည်းရန်အတွက် အထက်တွင် အလုပ်အမည် ထည့်သွင်းပါ',
    demo_feature_attach: 'သရုပ်ပြအင်္ဂါရပ်: ဖိုင်တွဲရန်',

    // Calendar View
    calendar_today: 'ယနေ့',
    view_month: 'လ',
    view_week: 'အပတ်',
    view_agenda: 'အစီအစဉ်',
    calendar_legend_urgent: 'အရေးကြီး',
    calendar_legend_normal: 'သာမန်',
    calendar_legend_completed: 'ပြီးစီး',
    gcal_connected: 'Google Calendar ချိတ်ဆက်ပြီးပါပြီ',
    gcal_updated: 'အပ်ဒိတ်ပြီးပါပြီ',
    daily_tasks_count: 'ဒီနေ့အတွက် လုပ်ဆောင်ရန် အလုပ်များ',
    no_schedule_today: '😴 ဒီနေ့အတွက် အစီအစဉ် မရှိပါ',
    no_schedule_sub: 'အေးဆေးစွာ အနားယူပါ သို့မဟုတ် အလုပ်အသစ် ထည့်သွင်းပါ!',

    // Analytics View
    analytics_header_title: 'တိုးတက်မှု သုံးသပ်ချက်',
    analytics_header_sub: 'အပတ်စဉ် အလုပ်လုပ်ဆောင်မှု အကျဉ်းချုပ်',
    analytics_great_banner: 'အရမ်းကောင်းပါတယ်! ပန်းတိုင်ရောက်ရန် နီးကပ်နေပါပြီ ✨',
    analytics_keepgoing_banner: 'ကြိုးစားပါ! ပန်းတိုင်ပြည့်မီရန် အနည်းငယ်သာ လိုပါတော့တယ် 🚀',
    stat_completed: 'ပြီးစီးပြီး',
    stat_pending: 'ကျန်ရှိနေသော',
    chart_weekly_title: 'နေ့စဉ် အလုပ်ပြီးစီးမှု ဇယား',
    chart_this_week: 'ယခုအပတ်',
    category_dist_title: 'အမျိုးအစားအလိုက် အလုပ်များ',
    efficiency_title: 'စွမ်းဆောင်ရည် အဆင့်',
    efficiency_badge: 'အလွန်ကောင်းမွန်သော စွမ်းဆောင်ရည်',
    efficiency_desc: 'သင်သည် အရေးကြီးသော အလုပ်များကို အချိန်မီ တိကျစွာ လုပ်ဆောင်နိုင်ခဲ့ပါသည်။',
    today_chart_legend: 'ယနေ့',
    past_chart_legend: 'ပြီးခဲ့သောရက်များ',
    recommendation_title: 'စွမ်းဆောင်ရည်မြှင့်တင်ရန် အကြံပြုချက်',
    recommendation_desc: 'ယခုအပတ်တွင် သင်သည် အလွန်အရေးကြီးသော အလုပ်အားလုံးကို သတ်မှတ်ချိန်အတွင်း ၁၀၀% ပြီးစီးအောင် လုပ်ဆောင်နိုင်ခဲ့ပါသည်။ ဤစွမ်းဆောင်ရည်ကို ဆက်လက်ထိန်းသိမ်းပါ!',

    // Settings View
    settings_main_title: 'အက်ပ် ဆက်တင်များ',
    settings_main_desc: 'ဘာသာစကား၊ အကောင့်၊ အသွင်အပြင်နှင့် အသိပေးချက်များကို စီမံပါ',
    cloud_saved_badge: 'သိမ်းဆည်းပြီး',
    reset_defaults: 'မူလအတိုင်းထားမည်',
    lang_section_title: 'ဘာသာစကား (Language)',
    lang_section_desc: 'အသုံးပြုလိုသော ဘာသာစကားကို ရွေးချယ်ပါ: ไทย, English သို့မဟုတ် မြန်မာ',
    notify_master_title: 'အသိပေးချက်များ အားလုံးဖွင့်မည်',
    notify_master_desc: 'အလုပ်များ၊ အစည်းအဝေးများနှင့် နေ့စဉ် အကျဉ်းချုပ် အသိပေးချက်များကို ရယူပါ',
    theme_section_title: 'အသွင်အပြင် (Theme)',
    theme_section_desc: 'မျက်စိသက်သာစေရန်အတွက် အလင်း သို့မဟုတ် အမှောင် မုဒ်ကို ရွေးချယ်ပါ',
    theme_light: 'အလင်းမုဒ် (Light)',
    theme_dark: 'အမှောင်မုဒ် (Dark)',
    theme_light_desc: 'သန့်ရှင်းလင်းလက်ပြီး အလင်းရောင်များသောနေရာအတွက် သင့်တော်ပါသည်',
    theme_dark_desc: 'မျက်စိကို ကာကွယ်ပေးပြီး ဘက်ထရီသက်သာစေပါသည်',
    reminder_title: 'ကြိုတင် အသိပေးချက်များ',
    reminder_desc: 'အလုပ်မပြီးမီ မည်မျှအလိုတွင် သတိပေးရမည်ကို ရွေးပါ',
    urgent_tasks_heading: 'အရေးကြီးသော အလုပ်များ',
    repeat_reminder: '၁၀ မိနစ်အလိုတွင် ထပ်မံသတိပေးမည်',
    general_tasks_heading: 'သာမန် အလုပ်များ',
    general_tasks_value: '၃၀ မိနစ်အလိုတွင် သတိပေးမည်',
    account_section_title: 'အသုံးပြုသူ အကောင့်နှင့် Cloud စင့်ခ်',
    current_account_label: 'လက်ရှိ အကောင့်:',
    account_sync_desc: 'သင်၏ အလုပ်မှတ်တမ်းများနှင့် ဆက်တင်များကို Cloud ပေါ်တွင် လုံခြုံစွာ အချိန်နှင့်တပြေးညီ သိမ်းဆည်းပေးထားပါသည်။',
    logout_button: 'အကောင့်မှ ထွက်မည်',

    // Toast Messages
    toast_saved: 'အပြောင်းအလဲများကို သိမ်းဆည်းပြီးပါပြီ',
    toast_dark_theme: 'အမှောင်မုဒ်သို့ ပြောင်းလဲပြီးပါပြီ',
    toast_light_theme: 'အလင်းမုဒ်သို့ ပြောင်းလဲပြီးပါပြီ',
    toast_lang_changed: 'ဘာသာစကား ပြောင်းလဲပြီးပါပြီ (Language updated)',
    toast_reset: 'မူလဆက်တင်အတိုင်း ပြန်လည်သတ်မှတ်ပြီးပါပြီ',

    // Notification Modal
    notif_modal_title: 'အသိပေးချက်များ',
    notif_modal_desc: 'အလုပ်များ၊ အစည်းအဝေးများနှင့် အဖွဲ့ အပ်ဒိတ်များ',
    mark_all_read: 'အားလုံးဖတ်ပြီးကြောင်း မှတ်သားမည်',
    notif_filter_all: 'အားလုံး',
    notif_filter_urgent: 'ရက်စွဲနီးကပ်သော အလုပ်များ ⏰',
    notif_filter_meeting: 'အစည်းအဝေးများ 📅',
    notif_filter_team: 'အဖွဲ့ အပ်ဒိတ်များ 👥',
    no_notifications: 'အသိပေးချက်အသစ် မရှိပါ',
    no_notifications_sub: 'အလုပ်များ သတ်မှတ်ရက်နီးလာသောအခါ ဤနေရာတွင် ပေါ်လာပါမည်။',
    snooze: 'အချိန်ရွှေ့မည်',

    // Auth Screen
    auth_login_title: 'အကောင့်သို့ ဝင်ရောက်ပါ',
    auth_register_title: 'အကောင့်အသစ် ဖွင့်ပါ',
    auth_login_tab: 'ဝင်ရောက်ရန်',
    auth_register_tab: 'အကောင့်ဖွင့်ရန်',
    auth_login_desc: 'သင်၏ အလုပ်မှတ်တမ်းများကို သီးသန့် Cloud ပေါ်တွင် လုံခြုံစွာ သိမ်းဆည်းပေးပါသည်။',
    auth_email_placeholder: 'အီးမေးလ် (ဥပမာ name@example.com)',
    auth_password_placeholder: 'စကားဝှက် (အနည်းဆုံး ၆ လုံး)',
    auth_name_placeholder: 'အသုံးပြုသူ အမည်',
    auth_login_btn: 'အကောင့်ဝင်မည်',
    auth_register_btn: 'အကောင့်အသစ် ဖန်တီးမည်',
    auth_or: 'သို့မဟုတ် ဤနည်းဖြင့် ဝင်ပါ',
    auth_google_btn: 'Google ဖြင့် ဝင်ရောက်ပါ',
    auth_connecting_cloud: 'Cloud ဒေတာဘေ့စ်နှင့် ချိတ်ဆက်နေပါသည်...',
    auth_secure_realtime: 'Clarity Flow - လုံခြုံပြီး အချိန်နှင့်တပြေးညီ',
  }
};

export type TranslationKey = keyof typeof translations['en'];

// Month names localized
export const MONTH_NAMES: Record<Language, string[]> = {
  th: [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  my: [
    'ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်',
    'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'
  ]
};

// Short Month names
export const SHORT_MONTH_NAMES: Record<Language, string[]> = {
  th: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  my: ['ဇန်', 'ဖေ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူ', 'ဩ', 'စက်', 'အောက်', 'နို', 'ဒီ']
};

// Weekday headers (Sun -> Sat)
export const WEEKDAY_HEADERS: Record<Language, string[]> = {
  th: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  my: ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ']
};

// Short Weekdays for Calendar Pickers (1-2 chars)
export const SHORT_PICKER_WEEKDAYS: Record<Language, string[]> = {
  th: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  my: ['နွေ', 'လာ', 'ဂါ', 'ဟူး', 'တေး', 'ကြာ', 'နေ']
};

// Short Weekdays for Analytics Bar Chart (Mon -> Sun)
export const ANALYTICS_WEEKDAYS: Record<Language, string[]> = {
  th: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  my: ['လာ', 'ဂါ', 'ဟူး', 'တေး', 'ကြာ', 'နေ', 'နွေ']
};

// Days of week long
export const DAY_NAMES_LONG: Record<Language, string[]> = {
  th: ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  my: ['တနင်္ဂနွေနေ့', 'တနင်္လာနေ့', 'အင်္ဂါနေ့', 'ဗုဒ္ဓဟူးနေ့', 'ကြာသပတေးနေ့', 'သောကြာနေ့', 'စနေနေ့']
};

// Format date helper for Thai, English, Myanmar
export function formatLocalizedDate(dateStr: string, lang: Language): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m, d);
      const dayOfWeek = DAY_NAMES_LONG[lang][dateObj.getDay()];
      const monthName = MONTH_NAMES[lang][m];

      if (lang === 'th') {
        return `${dayOfWeek}ที่ ${d} ${monthName} ${y + 543}`;
      } else if (lang === 'my') {
        return `${dayOfWeek}၊ ${y} ${monthName} ${d} ရက်`;
      } else {
        return `${dayOfWeek}, ${monthName} ${d}, ${y}`;
      }
    }
  } catch {}
  return dateStr;
}

// Format short date helper (e.g. for input buttons)
export function formatShortDate(dateStr: string, lang: Language): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const shortM = SHORT_MONTH_NAMES[lang][m] || '';
      const todayStr = new Date().toISOString().split('T')[0];
      const isToday = dateStr === todayStr;

      const todayTag = isToday ? (lang === 'th' ? ' (วันนี้)' : lang === 'my' ? ' (ယနေ့)' : ' (Today)') : '';

      if (lang === 'th') {
        return `${d} ${shortM} ${y} ${todayTag}`;
      } else if (lang === 'my') {
        return `${d} ${shortM} ${y} ${todayTag}`;
      } else {
        return `${shortM} ${d}, ${y} ${todayTag}`;
      }
    }
  } catch {}
  return dateStr;
}

export interface DaysLeftResult {
  diffDays: number;
  status: 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'no_date';
  badgeText: string;
  dateLabel: string;
  badgeClass: string;
  iconColorClass: string;
}

export function getDaysLeftInfo(dateStr?: string, dueTime?: string, lang: Language = 'th'): DaysLeftResult | null {
  if (!dateStr) return null;

  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;

    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMidnight = new Date(y, m, d);

    const diffTime = targetMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const shortM = SHORT_MONTH_NAMES[lang][m] || '';
    const dateLabel = lang === 'en' ? `${shortM} ${d}` : `${d} ${shortM}`;

    let status: DaysLeftResult['status'] = 'upcoming';
    let badgeText = '';
    let badgeClass = '';
    let iconColorClass = 'text-indigo-500';

    if (diffDays < 0) {
      status = 'overdue';
      const daysCount = Math.abs(diffDays);
      badgeText = lang === 'my' 
        ? `${daysCount} ရက် ကျော်လွန်` 
        : lang === 'en' 
        ? `${daysCount}d overdue` 
        : `เลยกำหนด ${daysCount} วัน`;
      badgeClass = 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60';
      iconColorClass = 'text-red-500';
    } else if (diffDays === 0) {
      status = 'today';
      badgeText = lang === 'my' ? 'ယနေ့ (ဒီနေ့)' : lang === 'en' ? 'Due Today' : 'วันนี้';
      badgeClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40';
      iconColorClass = 'text-amber-500';
    } else if (diffDays === 1) {
      status = 'tomorrow';
      badgeText = lang === 'my' 
        ? 'မနက်ဖြန် (၁ ရက် လို)' 
        : lang === 'en' 
        ? 'Tomorrow (1d left)' 
        : 'พรุ่งนี้ (เหลือ 1 วัน)';
      badgeClass = 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40';
      iconColorClass = 'text-sky-500';
    } else {
      status = 'upcoming';
      badgeText = lang === 'my' 
        ? `${diffDays} ရက် လိုသေးသည်` 
        : lang === 'en' 
        ? `${diffDays} days left` 
        : `เหลืออีก ${diffDays} วัน`;
      badgeClass = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-900/40';
      iconColorClass = 'text-indigo-500';
    }

    return {
      diffDays,
      status,
      badgeText,
      dateLabel,
      badgeClass,
      iconColorClass
    };
  } catch {
    return null;
  }
}
