export type Status = "scheduled" | "active" | "expired" | "cancelled" | "soldout";

export type StatusMeta = {
  id: Status;
  label: string;
  glyph: string;
  description: string;
  dotClass: string;
  textClass: string;
  chipClass: string;
  barClass: string;
};

export const STATUS: Record<Status, StatusMeta> = {
  scheduled: {
    id: "scheduled",
    label: "Scheduled",
    glyph: "🟡",
    description: "Queued to launch at its start time",
    dotClass: "bg-status-scheduled",
    textClass: "text-status-scheduled",
    chipClass: "bg-status-scheduled/15 border-status-scheduled/30 text-status-scheduled",
    barClass: "bg-status-scheduled",
  },
  active: {
    id: "active",
    label: "Active",
    glyph: "🟢",
    description: "Live and selling right now",
    dotClass: "bg-status-active",
    textClass: "text-status-active",
    chipClass: "bg-status-active/12 border-status-active/25 text-status-active",
    barClass: "bg-status-active",
  },
  expired: {
    id: "expired",
    label: "Expired",
    glyph: "⚫",
    description: "Window has ended, campaign archived",
    dotClass: "bg-status-expired",
    textClass: "text-status-expired",
    chipClass: "bg-status-expired/12 border-status-expired/25 text-status-expired",
    barClass: "bg-status-expired",
  },
  cancelled: {
    id: "cancelled",
    label: "Cancelled",
    glyph: "🔴",
    description: "Stopped by an admin, can be reactivated",
    dotClass: "bg-status-cancelled",
    textClass: "text-status-cancelled",
    chipClass: "bg-status-cancelled/12 border-status-cancelled/25 text-status-cancelled",
    barClass: "bg-status-cancelled",
  },
  soldout: {
    id: "soldout",
    label: "Sold Out",
    glyph: "🔥",
    description: "Full flash sale allocation has been sold",
    dotClass: "bg-status-soldout",
    textClass: "text-status-soldout",
    chipClass: "bg-status-soldout/12 border-status-soldout/25 text-status-soldout",
    barClass: "bg-status-soldout",
  },
};

export const STATUS_ORDER: Status[] = ["scheduled", "active", "expired", "cancelled", "soldout"];

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  hasActiveFlashSale?: boolean;
  existingWindow?: { day: string; start: string; end: string };
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "iPhone 15",
    sku: "APL-IP15-128",
    price: 85000,
    stock: 25,
    category: "Phones",
    image: "📱",
    hasActiveFlashSale: true,
    existingWindow: { day: "10 Sep", start: "8:00 PM", end: "10:00 PM" },
  },
  {
    id: "p2",
    name: "Sony WH-1000XM5",
    sku: "SNY-XM5-BLK",
    price: 32000,
    stock: 48,
    category: "Audio",
    image: "🎧",
  },
  {
    id: "p3",
    name: "Nespresso Vertuo Pods (40)",
    sku: "NSP-VRT-40",
    price: 4500,
    stock: 250,
    category: "Grocery",
    image: "☕",
  },
  {
    id: "p4",
    name: "Dyson V12 Detect Slim",
    sku: "DYS-V12-SLM",
    price: 78000,
    stock: 12,
    category: "Home",
    image: "🧹",
  },
  {
    id: "p5",
    name: "Samsung 55\" QLED",
    sku: "SMS-Q55-24",
    price: 112000,
    stock: 9,
    category: "TV",
    image: "📺",
  },
  {
    id: "p6",
    name: "Logitech MX Master 3S",
    sku: "LOG-MX3S-GR",
    price: 12500,
    stock: 140,
    category: "Accessories",
    image: "🖱️",
  },
  {
    id: "p7",
    name: "Basmati Rice 5kg",
    sku: "GRC-BAS-5K",
    price: 1250,
    stock: 900,
    category: "Grocery",
    image: "🍚",
  },
  {
    id: "p8",
    name: "Apple Watch SE",
    sku: "APL-WSE-40",
    price: 27500,
    stock: 34,
    category: "Wearables",
    image: "⌚",
  },
];

export type CampaignLine = {
  productId: string;
  name: string;
  sku: string;
  image: string;
  originalPrice: number;
  flashPrice: number;
  productStock: number;
  quantity: number;
  perCustomerLimit: number;
  sold: number;
};

export type Campaign = {
  id: string;
  code: string;
  name: string;
  status: Status;
  startDay: string;
  startTime: string;
  endDay: string;
  endTime: string;
  countdown?: string;
  revenue: number;
  lines: CampaignLine[];
};

const byId = (id: string): Product => PRODUCTS.find((p) => p.id === id)!;

const line = (
  p: Product,
  flashPrice: number,
  quantity: number,
  sold: number,
  perCustomerLimit = 2,
): CampaignLine => ({
  productId: p.id,
  name: p.name,
  sku: p.sku,
  image: p.image,
  originalPrice: p.price,
  flashPrice,
  productStock: p.stock,
  quantity,
  perCustomerLimit,
  sold,
});

export const CAMPAIGNS: Campaign[] = [
  {
    id: "fs-2481",
    code: "FS-2481",
    name: "Mega Weekend Flash Sale",
    status: "active",
    startDay: "10 Sep 2026",
    startTime: "8:00 PM",
    endDay: "10 Sep 2026",
    endTime: "10:00 PM",
    revenue: 234433,
    lines: [
      line(byId("p1"), 79999, 10, 7),
      line(byId("p2"), 27999, 8, 8),
      line(byId("p3"), 3499, 40, 26),
      line(byId("p6"), 10999, 22, 14),
      line(byId("p8"), 24499, 20, 12),
    ],
  },
  {
    id: "fs-2490",
    code: "FS-2490",
    name: "Nights Before the Sale",
    status: "scheduled",
    startDay: "11 Sep 2026",
    startTime: "8:00 PM",
    endDay: "11 Sep 2026",
    endTime: "10:00 PM",
    countdown: "02h 18m",
    revenue: 0,
    lines: [line(byId("p4"), 69900, 20, 0), line(byId("p5"), 99500, 40, 0), line(byId("p7"), 999, 60, 0)],
  },
  {
    id: "fs-2477",
    code: "FS-2477",
    name: "Aurora Audio Blast",
    status: "soldout",
    startDay: "08 Sep 2026",
    startTime: "6:00 PM",
    endDay: "08 Sep 2026",
    endTime: "9:00 PM",
    revenue: 189500,
    lines: [line(byId("p2"), 26999, 40, 40), line(byId("p6"), 10499, 30, 30), line(byId("p8"), 23999, 30, 30)],
  },
  {
    id: "fs-2465",
    code: "FS-2465",
    name: "Weekend Flash Sale",
    status: "cancelled",
    startDay: "09 Sep 2026",
    startTime: "8:00 PM",
    endDay: "09 Sep 2026",
    endTime: "11:00 PM",
    revenue: 21400,
    lines: [line(byId("p3"), 3699, 50, 8), line(byId("p7"), 1050, 30, 4)],
  },
  {
    id: "fs-2452",
    code: "FS-2452",
    name: "Summer Mega Flash Sale",
    status: "expired",
    startDay: "02 Sep 2026",
    startTime: "8:00 PM",
    endDay: "02 Sep 2026",
    endTime: "10:00 PM",
    revenue: 156200,
    lines: [line(byId("p1"), 81500, 40, 24), line(byId("p5"), 104000, 30, 18), line(byId("p4"), 71000, 30, 16)],
  },
];

export const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;

export const totals = (c: Campaign) => {
  const quantity = c.lines.reduce((s, l) => s + l.quantity, 0);
  const sold = c.lines.reduce((s, l) => s + l.sold, 0);
  return { quantity, sold, remaining: quantity - sold, pct: quantity ? Math.round((sold / quantity) * 100) : 0 };
};
