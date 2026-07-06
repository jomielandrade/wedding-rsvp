"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminExportButtons() {
  const download = (format: "xlsx" | "csv") => {
    window.location.href = `/api/admin/export?format=${format}`;
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="outline" size="sm" onClick={() => download("xlsx")}>
        <FileSpreadsheet />
        Export Excel
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => download("csv")}>
        <Download />
        Export CSV
      </Button>
    </div>
  );
}
