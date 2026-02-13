import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PromotionSummaryProps {
  summary: any;
  loadingSummary: boolean;
  errorSummary: string | null;
}

export default function PromotionSummary({ summary, loadingSummary, errorSummary }: PromotionSummaryProps) {
  if (loadingSummary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (errorSummary) {
    return <div className="text-red-500">Error loading summary: {errorSummary}</div>;
  }

  if (!summary) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Promotion Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Active Promotions</p>
              <p className="text-2xl font-bold">{summary.active_promotions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Discount Rate</p>
              <p className="text-2xl font-bold">{summary.avg_discount_rate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products on Promotion</p>
              <p className="text-2xl font-bold">{summary.total_products_on_promotion}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(summary.promotions_by_type).map(([type, discounts]) =>
          Object.entries(discounts).map(([discount, detail]) => (
            <Card key={`${type}-${discount}`}>
              <CardHeader>
                <CardTitle>{discount}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Count: {detail.count}</p>
                <p>End Date: {new Date(detail.end_date).toLocaleDateString('en-GB')}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}