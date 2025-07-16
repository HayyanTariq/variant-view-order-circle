import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { ProductVariant } from "@/pages/ProductVariants";

interface VariantSummaryProps {
  variants: ProductVariant[];
}

export const VariantSummary = ({ variants }: VariantSummaryProps) => {
  const totalVariants = variants.length;
  const inStockCount = variants.filter(v => v.status === "in-stock").length;
  const lowStockCount = variants.filter(v => v.status === "low-stock").length;
  const outOfStockCount = variants.filter(v => v.status === "out-of-stock").length;
  
  const totalQuantity = variants.reduce((sum, v) => sum + v.totalQuantity, 0);
  const totalRequired = variants.reduce((sum, v) => sum + v.requiredQuantity, 0);
  const totalAvailable = variants.reduce((sum, v) => sum + v.availableToSell, 0);

  const summaryCards = [
    {
      title: "Total Variants",
      value: totalVariants.toLocaleString(),
      icon: Package,
      color: "text-foreground",
      bgColor: "bg-card"
    },
    {
      title: "In Stock",
      value: inStockCount.toLocaleString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success-light"
    },
    {
      title: "Low Stock",
      value: lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning-light"
    },
    {
      title: "Out of Stock",
      value: outOfStockCount.toLocaleString(),
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    }
  ];

  return (
    <div className="grid gap-4">
      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-lg font-semibold text-foreground">
                    {card.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quantity Summary */}
      <Card className="p-6">
        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Quantity Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {totalQuantity.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Quantity</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {totalRequired.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Required Quantity</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {totalAvailable.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Available to Sell</p>
          </div>
        </div>
        
        {/* Fulfillment Status */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Fulfillment Status:
            </span>
            {totalRequired <= totalAvailable ? (
              <Badge className="bg-success-light text-success border-success/20">
                Fully Fulfillable
              </Badge>
            ) : (
              <Badge className="bg-warning-light text-warning border-warning/20">
                Partial Fulfillment ({Math.round((totalAvailable / totalRequired) * 100)}%)
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};