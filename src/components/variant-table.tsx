import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductVariant } from "@/pages/ProductVariants";

interface VariantTableProps {
  variants: ProductVariant[];
  loading: boolean;
}

const getStatusBadge = (status: ProductVariant["status"], availableToSell: number) => {
  switch (status) {
    case "in-stock":
      return (
        <Badge className="bg-success-light text-success border-success/20">
          In Stock
        </Badge>
      );
    case "low-stock":
      return (
        <Badge className="bg-warning-light text-warning border-warning/20">
          Low Stock
        </Badge>
      );
    case "out-of-stock":
      return (
        <Badge variant="destructive">
          Out of Stock
        </Badge>
      );
    default:
      return null;
  }
};

export const VariantTable = ({ variants, loading }: VariantTableProps) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No variants found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-medium text-muted-foreground">
              Product Name
            </th>
            <th className="text-left p-4 font-medium text-muted-foreground">
              SKU
            </th>
            <th className="text-right p-4 font-medium text-muted-foreground">
              Total Quantity
            </th>
            <th className="text-right p-4 font-medium text-muted-foreground">
              Required Quantity
            </th>
            <th className="text-right p-4 font-medium text-muted-foreground">
              Available to Sell
            </th>
            <th className="text-center p-4 font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr 
              key={variant.id}
              className="border-b hover:bg-muted/30 transition-colors"
            >
              <td className="p-4">
                <div className="font-medium text-foreground">
                  {variant.name}
                </div>
              </td>
              <td className="p-4">
                <code className="text-sm bg-muted px-2 py-1 rounded text-muted-foreground">
                  {variant.sku}
                </code>
              </td>
              <td className="p-4 text-right font-medium">
                {variant.totalQuantity.toLocaleString()}
              </td>
              <td className="p-4 text-right font-medium text-primary">
                {variant.requiredQuantity.toLocaleString()}
              </td>
              <td className="p-4 text-right font-medium">
                {variant.availableToSell.toLocaleString()}
              </td>
              <td className="p-4 text-center">
                {getStatusBadge(variant.status, variant.availableToSell)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};