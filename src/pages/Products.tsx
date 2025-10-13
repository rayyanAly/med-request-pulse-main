import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Products() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-1">
          Manage your pharmacy product catalog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Product management features coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
