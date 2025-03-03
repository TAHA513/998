import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Package2,
  DollarSign,
  LineChart,
  TrendingUp,
  Wallet,
  BarChart,
} from "lucide-react";
import type { Product } from "@shared/schema";
import {
  PieChart,
  Pie,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function InventoryReportsPage() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // تصنيف المنتجات حسب نوعها
  const retailProducts = products.filter((p) => p.type === "piece");
  const wholesaleProducts = products.filter((p) => p.type === "weight");

  // حسابات المخزون
  const totalInventoryCost = products.reduce(
    (sum, product) => sum + Number(product.quantity) * Number(product.costPrice),
    0
  );
  const totalInventorySalePrice = products.reduce(
    (sum, product) => sum + Number(product.quantity) * Number(product.sellingPrice),
    0
  );
  const expectedProfit = totalInventorySalePrice - totalInventoryCost;
  const profitMargin = totalInventoryCost
    ? ((expectedProfit / totalInventoryCost) * 100).toFixed(2)
    : "0.00";

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
    }).format(amount);

  // بيانات الرسوم البيانية
  const pieData = [
    { name: "منتجات المفرد", value: retailProducts.length },
    { name: "منتجات الجملة", value: wholesaleProducts.length },
  ];

  const topProducts = products.slice(0, 5);
  const lineChartData = topProducts.map((product) => ({
    name: product.name,
    "الربح المتوقع": Number(product.sellingPrice) - Number(product.costPrice),
  }));
  const barChartData = topProducts.map((product) => ({
    name: product.name,
    "سعر التكلفة": Number(product.costPrice),
    "سعر البيع": Number(product.sellingPrice),
  }));

  // مكون الجدول لتفاصيل المنتجات (يستخدم لكل من المفرد والجملة)
  const ProductTable = ({
    data,
    isWholesale = false,
  }: {
    data: Product[];
    isWholesale?: boolean;
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>المنتج</TableHead>
          <TableHead>الباركود</TableHead>
          <TableHead>{isWholesale ? "الوزن المتوفر" : "الكمية المتوفرة"}</TableHead>
          <TableHead>
            {isWholesale ? "سعر التكلفة للكيلو" : "سعر التكلفة"}
          </TableHead>
          <TableHead>
            {isWholesale ? "سعر البيع للكيلو" : "سعر البيع"}
          </TableHead>
          <TableHead>القيمة الإجمالية</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? (
          data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.barcode || "-"}</TableCell>
              <TableCell>
                {product.quantity.toString()} {isWholesale && "كغم"}
              </TableCell>
              <TableCell>{formatCurrency(Number(product.costPrice))}</TableCell>
              <TableCell>{formatCurrency(Number(product.sellingPrice))}</TableCell>
              <TableCell>
                {formatCurrency(Number(product.quantity) * Number(product.costPrice))}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
              {isWholesale ? "لا توجد منتجات جملة" : "لا توجد منتجات مفردة"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* العنوان والوصف */}
        <div>
          <h1 className="text-3xl font-bold mb-2">تقارير المخزون والسيولة</h1>
          <p className="text-muted-foreground">
            عرض تفصيلي للسيولة المتوفرة وأرصدة المخزون
          </p>
        </div>

        {/* قسم السيولة */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">رأس المال المستثمر</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalInventoryCost)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                إجمالي تكلفة المخزون الحالي
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">القيمة السوقية</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalInventorySalePrice)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                إجمالي قيمة البيع للمخزون
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الربح المتوقع</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(expectedProfit)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                إجمالي الربح المتوقع
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">هامش الربح</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profitMargin}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                نسبة الربح المتوقعة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* احصائيات المخزون */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                عدد المنتجات الكلي في المخزون
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">منتجات المفرد</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{retailProducts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                عدد منتجات البيع بالمفرد
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">منتجات الجملة</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wholesaleProducts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                عدد منتجات البيع بالجملة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* الرسم البياني الدائري لتوزيع المنتجات */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع المنتجات</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#8884d8" : "#82ca9d"}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `عدد المنتجات: ${value}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* الرسم البياني الخطي للأرباح المتوقعة */}
          <Card>
            <CardHeader>
              <CardTitle>الأرباح المتوقعة (أعلى 5 منتجات)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickFormatter={(value) =>
                      `${value.toLocaleString("ar-IQ")} د.ع`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString("ar-IQ")} د.ع`,
                      "الربح المتوقع",
                    ]}
                    labelStyle={{ fontFamily: "inherit", textAlign: "right" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="الربح المتوقع"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ fill: "#82ca9d", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* الرسم البياني العمودي لمقارنة الأسعار */}
          <Card>
            <CardHeader>
              <CardTitle>مقارنة الأسعار (أعلى 5 منتجات)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickFormatter={(value) =>
                      `${value.toLocaleString("ar-IQ")} د.ع`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString("ar-IQ")} د.ع`, ""]}
                    labelStyle={{ fontFamily: "inherit", textAlign: "right" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="سعر التكلفة"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="سعر البيع"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* تبويبات تفاصيل المبيعات */}
        <Tabs defaultValue="retail" className="space-y-4">
          <TabsList>
            <TabsTrigger value="retail">المفرد</TabsTrigger>
            <TabsTrigger value="wholesale">الجملة</TabsTrigger>
          </TabsList>

          <TabsContent value="retail" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل مبيعات المفرد</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductTable data={retailProducts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wholesale" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل مبيعات الجملة</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductTable data={wholesaleProducts} isWholesale />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
