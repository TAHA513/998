import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  UserCog,
  TrendingUp,
  Package2,
  DollarSign,
  AlertTriangle,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { ar } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { MarketingCampaign } from "@shared/schema";

// Sample data - replace with actual API data
const salesData = [
  { name: "يناير", المبيعات: 4000, الأرباح: 2400 },
  { name: "فبراير", المبيعات: 3000, الأرباح: 1398 },
  { name: "مارس", المبيعات: 2000, الأرباح: 9800 },
  { name: "أبريل", المبيعات: 2780, الأرباح: 3908 },
  { name: "مايو", المبيعات: 1890, الأرباح: 4800 },
  { name: "يونيو", المبيعات: 2390, الأرباح: 3800 },
];

const categoryData = [
  { name: "إلكترونيات", value: 400 },
  { name: "ملابس", value: 300 },
  { name: "أغذية", value: 300 },
  { name: "أدوات منزلية", value: 200 },
];

const topProductsData = [
  { name: "منتج 1", قيمة_المبيعات: 4000 },
  { name: "منتج 2", قيمة_المبيعات: 3000 },
  { name: "منتج 3", قيمة_المبيعات: 2000 },
  { name: "منتج 4", قيمة_المبيعات: 2780 },
  { name: "منتج 5", قيمة_المبيعات: 1890 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage: React.FC = () => {
  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: appointments } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: staff } = useQuery({
    queryKey: ["/api/staff"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  // Add campaign data query
  const { data: campaigns } = useQuery<MarketingCampaign[]>({
    queryKey: ["/api/marketing-campaigns"],
  });

  // Get active campaigns
  const activeCampaigns = campaigns?.filter(c => 
    new Date(c.endDate) > new Date() && c.status === 'active'
  ) || [];

  // Get campaigns ending soon (within 7 days)
  const campaignsEndingSoon = campaigns?.filter(c => {
    const endDate = new Date(c.endDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return endDate <= sevenDaysFromNow && endDate > new Date();
  }) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Sample KPI calculations
  const salesGrowth = 15.2;
  const targetProgress = 78;
  const stockStatus = 85;
  const dailySalesTarget = 92;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground">مؤشرات الأداء الرئيسية والتحليلات</p>
          </div>
          <Badge variant="outline" className="text-lg">
            {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
        </div>

        {/* Campaign Alerts */}
        {campaignsEndingSoon.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>تنبيه الحملات</AlertTitle>
            <AlertDescription>
              لديك {campaignsEndingSoon.length} حملات تنتهي خلال 7 أيام
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* نمو المبيعات */}
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">نمو المبيعات</CardTitle>
              <TrendingUp className={`h-4 w-4 ${salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <div className="text-2xl font-bold">{Math.abs(salesGrowth)}%</div>
                {salesGrowth >= 0 ? (
                  <ArrowUpRight className="text-green-500" />
                ) : (
                  <ArrowDownRight className="text-red-500" />
                )}
              </div>
              <Progress value={Math.abs(salesGrowth)} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                مقارنة بالشهر السابق
              </p>
            </CardContent>
          </Card>

          {/* تحقيق الأهداف */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">تحقيق الأهداف</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{targetProgress}%</div>
              <Progress value={targetProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                من الهدف السنوي
              </p>
            </CardContent>
          </Card>

          {/* حالة المخزون */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">حالة المخزون</CardTitle>
              <Package2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStatus}%</div>
              <Progress value={stockStatus} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                نسبة اكتمال المخزون
              </p>
            </CardContent>
          </Card>

          {/* المبيعات اليومية */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المبيعات اليومية</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailySalesTarget}%</div>
              <Progress value={dailySalesTarget} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                من هدف اليوم
              </p>
            </CardContent>
          </Card>

          {/* Add Campaign Performance Card */}
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">أداء الحملات</CardTitle>
              <Megaphone className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                حملات نشطة حالياً
              </p>
              {activeCampaigns.length > 0 && (
                <div className="mt-4 space-y-2">
                  {activeCampaigns.slice(0, 2).map(campaign => (
                    <div key={campaign.id} className="flex justify-between items-center">
                      <span className="text-sm truncate">{campaign.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {new Date(campaign.endDate).toLocaleDateString('ar-IQ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* معلومات إضافية */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">العملاء</CardTitle>
              <Users className="h-4 w-4 text-foreground opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">إجمالي عدد العملاء المسجلين</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المواعيد</CardTitle>
              <Calendar className="h-4 w-4 text-foreground opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">مواعيد اليوم</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
              <Package2 className="h-4 w-4 text-foreground opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">إجمالي المنتجات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الموظفين</CardTitle>
              <UserCog className="h-4 w-4 text-foreground opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">إجمالي عدد الموظفين</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Sales and Profit Trends */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>تحليل المبيعات والأرباح</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `${value.toLocaleString('ar-IQ')} د.ع`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString('ar-IQ')} د.ع`, '']}
                    labelStyle={{ fontFamily: 'inherit', textAlign: 'right' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="المبيعات"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="الأرباح"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع المنتجات حسب الفئات</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `${value.toLocaleString('ar-IQ')} د.ع`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString('ar-IQ')} د.ع`, 'قيمة المبيعات']}
                    labelStyle={{ fontFamily: 'inherit', textAlign: 'right' }}
                  />
                  <Bar
                    dataKey="قيمة_المبيعات"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Add Campaign Performance Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>أداء الحملات التسويقية</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaigns?.map(c => ({
                name: c.name,
                مشاهدات: c.campaignMetrics?.impressions || 0,
                تفاعلات: c.campaignMetrics?.engagement || 0,
                نقرات: c.campaignMetrics?.clicks || 0
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="مشاهدات" stroke="#8884d8" />
                <Line type="monotone" dataKey="تفاعلات" stroke="#82ca9d" />
                <Line type="monotone" dataKey="نقرات" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;