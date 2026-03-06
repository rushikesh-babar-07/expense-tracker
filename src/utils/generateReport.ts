import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Expense } from "@/hooks/useExpenseStore";

interface ReportData {
  expenses: Expense[];
  deposit: number;
  totalSpent: number;
  remaining: number;
  totalSavings: number;
}

export function generateExpenseReport(data: ReportData) {
  const doc = new jsPDF();
  const month = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Title
  doc.setFontSize(20);
  doc.text("Monthly Expense Report", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(month, 14, 28);

  // Table
  const sorted = [...data.expenses].sort((a, b) => a.date.localeCompare(b.date));
  const rows = sorted.map((e, i) => [
    i + 1,
    e.name,
    e.category,
    `Rs.${e.amount.toFixed(2)}`,
    e.date,
  ]);

  autoTable(doc, {
    startY: 35,
    head: [["#", "Expense Name", "Category", "Amount", "Date"]],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10 },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable?.finalY ?? 120;
  const summaryY = finalY + 15;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Summary", 14, summaryY);

  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(`Total Expenses:    Rs.${data.totalSpent.toFixed(2)}`, 14, summaryY + 8);
  doc.text(`Monthly Deposit:   Rs.${data.deposit.toFixed(2)}`, 14, summaryY + 15);
  doc.text(`Remaining Balance: Rs.${data.remaining.toFixed(2)}`, 14, summaryY + 22);
  doc.text(`Total Savings:     Rs.${data.totalSavings.toFixed(2)}`, 14, summaryY + 29);

  doc.save(`Expense_Report_${month.replace(" ", "_")}.pdf`);
}
