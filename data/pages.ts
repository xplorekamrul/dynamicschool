// content_type : {single , dynamic,}
// title: 

export type NavContentType = "single" | "dynamic";

export type NavItem = {
  name: string;
  href: string;
  ContentType: NavContentType;
  target?: "_blank";
  submenu?: NavItem[];
};

export const navItems: NavItem[] = [
  { name: " হোম ", href: "home", ContentType: "single" },
  {
    name: "প্রতিষ্ঠান সম্পর্কে",
    href: "organizational-history",
    ContentType: "single",
    submenu: [
      { name: "প্রতিষ্ঠানের ইতিহাস", href: "org-history", ContentType: "single" },
      { name: "প্রতিষ্ঠাতা", href: "founder", ContentType: "single" },
      { name: "লক্ষ্য ও উদ্দেশ্য", href: "goals-and-objectives", ContentType: "single" },
      { name: "প্রতিষ্ঠানের অবকাঠামো", href: "organization-infrastructure", ContentType: "single" },
      { name: "আমাদের অর্জন", href: "our-achievements", ContentType: "single" },
    ],
  },
  {
    name: "এডমিনিস্ট্রেশন",
    href: "administration",
    ContentType: "dynamic",
    submenu: [
      { name: "অধ্যক্ষের বানী", href: "principals-message", ContentType: "single" },
      { name: "সভাপতির বাণী", href: "presidents-message", ContentType: "single" },
      { name: "পরিচালনা কমিটি", href: "managementCommittee", ContentType: "dynamic" },
      { name: "শিক্ষকমন্ডলী", href: "teachers", ContentType: "dynamic" },
      { name: "অবসরপ্রাপ্ত শিক্ষকমন্ডলী", href: "retired-teachers", ContentType: "dynamic" },
      { name: "আমাদের কর্মীরা", href: "our-staffs", ContentType: "dynamic" },
      { name: "শূণ্যপদের তালিকা", href: "vacancy-list", ContentType: "dynamic" },
      { name: "নিয়ম নির্দেশনা", href: "rules-and-instructions", ContentType: "single" },
    ],
  },
  {
    name: "ভর্তি সম্পর্কিত",
    href: "regarding-admission",
    ContentType: "dynamic",
    submenu: [
      { name: "ভর্তির আবেদন", href: "admission-application", ContentType: "single" },
      { name: "ছাত্রছাত্রীর আসন সংখ্যা", href: "student-seat-plan", ContentType: "single" },
      { name: "শিক্ষার্থীর ড্রেস", href: "student-uniform", ContentType: "single" },
      { name: "কৃতি শিক্ষার্থী", href: "brilliant-students", ContentType: "single" },
    ],
  },
  {
    name: "কোর্সসমূহ",
    href: "courses",
    ContentType: "dynamic",
    submenu: [{ name: "মাধ্যমিক", href: "courses/secondary", ContentType: "single" }],
  },
  { name: "নোটিশ", href: "notice", ContentType: "dynamic" },
  {
    name: "একাডেমিক পেপার",
    href: "academic-paper",
    ContentType: "dynamic",
    submenu: [
      { name: "সিলেবাস", href: "syllabus", ContentType: "dynamic" },
      { name: "ক্লাশ রুটিন", href: "class-routine", ContentType: "dynamic" },
      { name: "পরীক্ষার সময়সূচি", href: "exam-routine", ContentType: "dynamic" },
      { name: "পাঠ পরিকল্পনা", href: "lesson-plan", ContentType: "dynamic" },
      { name: "একাডেমিক ক্যালেন্ডার", href: "academic-calendar", ContentType: "dynamic" },
      { name: "লাইব্রেরি", href: "library", ContentType: "dynamic" },
    ],
  },
  {
    name: "কো-কারিকুলাম",
    href: "co-curriculum",
    ContentType: "dynamic",
    submenu: [
      { name: "রোভার স্কাউটস", href: "rover-scouts", ContentType: "single" },
      { name: "রেড ক্রিসেন্ট", href: "red-crescent", ContentType: "single" },
      { name: "ক্লাব", href: "clubs", ContentType: "single" },
      { name: "বিএনসিসি", href: "bncc", ContentType: "single" },
    ],
  },
  {
    name: "রেজাল্ট",
    href: "result",
    ContentType: "dynamic",
    submenu: [
      { name: "মাধ্যমিক ও উচ্চ মাধ্যমিক রেজাল্ট", href: "http://www.educationboardresults.gov.bd", target: "_blank", ContentType: "single" },
      { name: "জাতীয় বিশ্ববিদ্যালয় রেজাল্ট", href: "http://results.nu.ac.bd", target: "_blank", ContentType: "single" },
      { name: "অভ্যন্তরীণ পরীক্ষার রেজাল্ট", href: "result/internal-exam", ContentType: "single" },
    ],
  },
  { name: "ব্লগ", href: "blog", ContentType: "dynamic" },
  {
    name: "গ্যালারী",
    href: "gallery",
    ContentType: "dynamic",
    submenu: [
      { name: "ফটো গ্যালারী", href: "gallery/photo-gallery", ContentType: "dynamic" },
      { name: "ভিডিও গ্যালারী", href: "gallery/video-gallery", ContentType: "dynamic" },
    ],
  },
  { name: "যোগাযোগ", href: "contact", ContentType: "dynamic" },
];
