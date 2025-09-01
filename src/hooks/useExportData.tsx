"use client";

import { useCallback } from "react";
import * as XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

interface Column {
  header: string;
  accessor: string; // key in the data object
}

export const useExportData = (
  columns: Column[],
  data: any[],
  filename = "export"
) => {
  // 🔹 Export to Excel
  const exportToExcel = useCallback(() => {
    try {
      if (!data || data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const worksheetData = [
        columns.map((col) => col.header), // headers
        ...data.map((row) =>
          columns.map((col) => row[col.accessor] ?? "")
        ), // rows
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, `${filename}.xlsx`);
      toast.success("Excel file exported successfully 🎉");
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("Failed to export Excel file");
    }
  }, [columns, data, filename]);

  // 🔹 Export to PDF
  const exportToPDF = useCallback(() => {
    try {
      if (!data || data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const doc = new jsPDF();

      autoTable(doc, {
        head: [columns.map((col) => col.header)],
        body: data.map((row) => columns.map((col) => row[col.accessor] ?? "")),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }, // blue header
      });

      doc.save(`${filename}.pdf`);
      toast.success("PDF exported successfully 🎉");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF file");
    }
  }, [columns, data, filename]);

  return { exportToExcel, exportToPDF };
};
