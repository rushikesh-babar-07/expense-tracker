import { useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { Expense } from "@/hooks/useExpenseStore";
import type { MonthRecord } from "@/hooks/useExpenseStore";

const COLORS = [
  "hsl(160, 60%, 45%)",  // primary/success green
  "hsl(210, 80%, 55%)",  // info blue
  "hsl(35, 90%, 55%)",   // warning orange
  "hsl(0, 65%, 55%)",    // destructive red
  "hsl(270, 50%, 55%)",  // purple
];

interface Props {
  expenses: Expense[];
  monthlyHistory: MonthRecord[];
}

const ExpenseAnalytics = ({ expenses, monthlyHistory }: Props) => {
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0);
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        percent: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const currentTotal = expenses.reduce((s, e) => s + e.amount, 0);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const historyItems = monthlyHistory.map((m) => ({
      month: m.month,
      total: m.expenses.reduce((s, e) => s + e.amount, 0),
    }));
    if (currentTotal > 0 || expenses.length > 0) {
      historyItems.push({ month: currentMonth, total: currentTotal });
    }
    return historyItems
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [expenses, monthlyHistory]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
        <p className="font-medium">{d.name}</p>
        <p>₹{d.value.toLocaleString()}</p>
      </div>
    );
  };

  if (expenses.length === 0 && monthlyData.length === 0) return null;

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-lg font-semibold text-card-foreground">Expense Analytics</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart */}
        {categoryData.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Category Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    stroke="hsl(220, 18%, 13%)"
                    strokeWidth={2}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {categoryData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {d.name} ({d.percent}%)
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {monthlyData.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Monthly Spending</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(220, 15%, 20%)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(220, 15%, 20%)" }}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Expenses" fill="hsl(160, 60%, 45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
