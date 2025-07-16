import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, ShoppingCart, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const sampleProducts = [
    {
      id: "main-1",
      name: "Denim Collection",
      variantCount: 5,
      totalStock: 465,
      status: "Active"
    },
    {
      id: "main-2", 
      name: "Outerwear Line",
      variantCount: 8,
      totalStock: 320,
      status: "Active"
    },
    {
      id: "main-3",
      name: "Essential Basics",
      variantCount: 12,
      totalStock: 890,
      status: "Active"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Circle
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive Order Management System
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <Card className="p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-light rounded-lg">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Product Management Dashboard
            </h2>
            <p className="text-muted-foreground mb-6">
              Manage your product catalog, track inventory, and view detailed variant information.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Product Variants</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Inventory Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Real-time Analytics</span>
              </div>
            </div>
          </Card>

          {/* Sample Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Sample Product Collections
            </h3>
            
            {sampleProducts.map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {product.variantCount} variants • {product.totalStock.toLocaleString()} total units
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-success-light text-success border-success/20">
                      {product.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/products/${product.id}/variants`)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Variants
                      </Button>
                      <Button 
                        onClick={() => navigate("/configure-variants")}
                        size="sm"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Features Overview */}
          <Card className="p-6 mt-8">
            <h3 className="font-semibold text-foreground mb-4">
              Product Variants Page Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-foreground">✓ Three-Column Layout</p>
                <p className="text-muted-foreground ml-4">Product Name, Total Quantity, Required Quantity</p>
                
                <p className="font-medium text-foreground">✓ Real-time Search</p>
                <p className="text-muted-foreground ml-4">Filter variants by name or SKU</p>
                
                <p className="font-medium text-foreground">✓ Status Indicators</p>
                <p className="text-muted-foreground ml-4">Visual badges for stock levels</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">✓ Summary Analytics</p>
                <p className="text-muted-foreground ml-4">Overview cards with key metrics</p>
                
                <p className="font-medium text-foreground">✓ Responsive Design</p>
                <p className="text-muted-foreground ml-4">Works on all screen sizes</p>
                
                <p className="font-medium text-foreground">✓ Fulfillment Status</p>
                <p className="text-muted-foreground ml-4">Track order fulfillment capacity</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
