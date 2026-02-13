import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tag, Percent, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { startTransition } from "react";

interface PromotionTableProps {
  filteredPromotions: any[];
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalFiltered: number;
  start: number;
  end: number;
}

export default function PromotionTable({
  filteredPromotions,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  totalFiltered,
  start,
  end,
}: PromotionTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="status-badge status-success">Active</Badge>;
      case "expired":
        return <Badge className="status-badge status-error">Expired</Badge>;
      case "paused":
        return <Badge className="status-badge status-warning">Paused</Badge>;
      default:
        return <Badge className="status-badge status-neutral">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Percentage')) return <Percent className="h-4 w-4" />;
    if (type.includes('Buy')) return <Users className="h-4 w-4" />;
    return <Tag className="h-4 w-4" />;
  };

  const formatValue = (type: string, value: number) => {
    if (type.includes('Percentage')) return `${value}%`;
    if (type.includes('Buy')) return 'N/A';
    return value;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          All Coupons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Item Code</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromotions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No promotions found matching the current filters.
                </TableCell>
              </TableRow>
            )}
            {filteredPromotions.map((promo) => (
              <TableRow key={promo.id} className="table-row-hover">
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-semibold text-foreground">
                    {promo.code}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="text-sm text-muted-foreground">{promo.itemCode}</code>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground">{promo.productName}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getTypeIcon(promo.type)}
                    <span className="capitalize">{promo.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-foreground">
                    {formatValue(promo.type, promo.value)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">{promo.stock}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{promo.manufacturer}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(promo.startDate).toLocaleDateString('en-GB')} - {new Date(promo.endDate).toLocaleDateString('en-GB')}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(promo.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredPromotions.length > 0 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startTransition(() => setCurrentPage(currentPage - 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`w-8 h-8 p-0 ${
                        currentPage === pageNum
                          ? "gradient-primary text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => startTransition(() => setCurrentPage(pageNum))}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startTransition(() => setCurrentPage(currentPage + 1))}
                disabled={currentPage === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-sm text-muted-foreground text-right">
              Page {currentPage} of {totalPages} - Showing {start + 1} to {Math.min(end, totalFiltered)} of {totalFiltered} items
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
