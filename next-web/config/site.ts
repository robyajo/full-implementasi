import { SiteConfig } from "@/types"
import {
  Banknote,
  CreditCard,
  Crown,
  FileText,
  Grid,
  History,
  Layers,
  Receipt,
  Shirt,
  SprayCan,
  Store,
  Tags,
  UserCog,
  Users,
} from "lucide-react"

// Environment Variables
const nameApp = process.env.NEXT_PUBLIC_APP_NAME
const urlApp = process.env.NEXT_PUBLIC_APP_URL
export const runtime = "edge"
export const siteConfig: SiteConfig = {
  name: `${nameApp}`,
  author: "Roby Ajo",
  description: `${nameApp} - Layanan Laundry Premium dengan Pickup & Delivery Gratis.`,
  keywords: [
    `${nameApp}`,
    "Laundry",
    "Laundry Online",
    "Laundry Jakarta",
    "Laundry Online Murah",
    "Pickup Delivery Laundry Gratis",
    "Dry Cleaning Jakarta",
    "Laundry Express 24 Jam",
    "Jasa Laundry Terpercaya",
    "Aplikasi Laundry Indonesia",
    "Cuci Baju Online",
    "Laundry Premium Jakarta",
    "Antar Jemput Laundry",
    "Laundry Jakarta",
    "Laundry Online Murah",
    "Pickup Delivery Laundry Gratis",
    "Dry Cleaning Jakarta",
    "Laundry Express 24 Jam",
    "Jasa Laundry Terpercaya",
    "Aplikasi Laundry Indonesia",
    "Cuci Baju Online",
    "Laundry Premium Jakarta",
    "Antar Jemput Laundry",
    "Laundry Jakarta",
    "Laundry Online Murah",
    "Pickup Delivery Laundry Gratis",
    "Dry Cleaning Jakarta",
    "Laundry Express 24 Jam",
    "Jasa Laundry Terpercaya",
    "Aplikasi Laundry Indonesia",
    "Cuci Baju Online",
    "Laundry Premium Jakarta",
    "Antar Jemput Laundry",
  ],
  url: {
    base: `${urlApp}`,
    author: "https://portfolio-roby.vercel.app",
  },
  links: {
    github: "https://github.com/robyajo",
  },
  ogImage: `${urlApp}/og.jpg`,
  locale: "id_ID",
  type: "website",
  publishedTime: new Date().toISOString(),
  twitterCard: "summary_large_image",
}

export const modulesConfig = {
  services: {
    label: "Layanan",
    path: "layanan",
    moduleDir: "master/services",
    icon: Layers,
  },
  servicesLaporan: {
    label: "Laporan",
    path: "laporan",
    moduleDir: "master/services",
    icon: FileText,
  },
  servicesCategories: {
    label: "Kategori Layanan",
    path: "layanan-categori",
    moduleDir: "master/services-categories",
    icon: Layers,
  },

  itemDry: {
    label: "Cucian",
    path: "item-dry",
    moduleDir: "master/item-dry",
    icon: Shirt,
  },
  perfume: {
    label: "Perfume",
    path: "perfume",
    moduleDir: "master/perfume",
    icon: SprayCan,
  },
  rack: {
    label: "Rack",
    path: "rack",
    moduleDir: "master/rack",
    icon: Grid,
  },
  customers: {
    label: "Pelanggan",
    path: "customers",
    moduleDir: "customers",
    icon: Users,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      edit: { path: "edit", label: "Edit", file: "edit" },
      show: { path: "show", label: "Detail", file: "show" },
    },
  },
  users: {
    label: "Pengguna",
    path: "users",
    moduleDir: "users",
    icon: UserCog,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      edit: { path: "edit", label: "Edit", file: "edit" },
      show: { path: "show", label: "Detail", file: "show" },
      changePassword: {
        path: "change-password",
        label: "Ganti Password",
        file: "change-password",
      },
    },
  },
  Statistics: {
    label: "Statistik",
    path: "statistics",
    icon: Grid,
  },

  Expense: {
    label: "Pengeluaran",
    path: "expense",
    moduleDir: "expense",
    icon: Banknote,
    subPaths: {
      show: { path: "show", label: "Detail", file: "show" },
      create: { path: "create", label: "Tambah", file: "create" },
      edit: { path: "edit", label: "Edit", file: "edit" },
    },
  },
  ExpenseCategory: {
    label: "Kategori Pengeluaran",
    path: "expense-category",
    moduleDir: "master/expense-category",
    icon: Tags,
    subPaths: {
      show: { path: "show", label: "Detail", file: "show" },
      create: {
        path: "create",
        label: "Tambah ",
        file: "create",
      },
    },
  },
  TransactionAdmin: {
    label: "Transaksi Saya",
    path: "transaction-history",
    moduleDir: "transaction/history",
    icon: History,
    subPaths: {
      show: { path: "show", label: "Detail", file: "show" },
    },
  },
  Branches: {
    label: "Cabang",
    path: "branches",
    moduleDir: "master/branches",
    icon: Store,
    subPaths: {
      show: { path: "show", label: "Detail", file: "show" },
      create: { path: "create", label: "Tambah", file: "create" },
      edit: { path: "edit", label: "Edit", file: "edit" },
    },
  },
  PaymentOrder: {
    label: "Metode Pembayaran",
    path: "payment-order",
    moduleDir: "master/payment-order",
    icon: CreditCard,
  },
  // Member
  MemberPlan: {
    label: "Plan Member",
    path: "plans",
    moduleDir: "membership/plans",
    icon: Crown,
  },
  SubscriptionsHistory: {
    label: "Riwayat Member",
    path: "subscriptions/history",
    moduleDir: "subscriptions",
    icon: History,
  },
  SubscriptionsHistoryPayment: {
    label: "Pembayaran",
    path: "subscriptions/payment-history",
    moduleDir: "subscriptions",
    icon: Receipt,
  },
} as const

export type ModuleKey = keyof typeof modulesConfig
