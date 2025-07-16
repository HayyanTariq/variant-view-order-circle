import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export interface SizeDetail {
  size: string;
  availableQuantity: number;
  requiredQuantity: number;
}

export interface ColorVariant {
  color: string;
  sizes: SizeDetail[];
}

export interface Product {
  id: string;
  name: string;
  colors: ColorVariant[];
}

// Real data based on the spreadsheet images showing men's pants inventory
const mockProducts: Product[] = [
  {
    id: "pantalon-de-hombre-501-original",
    name: "Pantalon de Hombre 84501-33 501 ORIGINAL",
    colors: [
      {
        color: "medium indigo print",
        sizes: [
          { size: "28", availableQuantity: 10, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 105, requiredQuantity: 0 },
          { size: "31", availableQuantity: 246, requiredQuantity: 0 },
          { size: "32", availableQuantity: 95, requiredQuantity: 0 },
          { size: "33", availableQuantity: 174, requiredQuantity: 0 },
          { size: "34", availableQuantity: 184, requiredQuantity: 0 }
        ]
      }
    ]
  },
  {
    id: "pantalon-511-slim",
    name: "Pantalon de Hombre 84511-55 511 SLIM",
    colors: [
      {
        color: "dark indigo worn in",
        sizes: [
          { size: "28", availableQuantity: 7, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 7, requiredQuantity: 0 },
          { size: "32", availableQuantity: 0, requiredQuantity: 0 },
          { size: "33", availableQuantity: 52, requiredQuantity: 0 },
          { size: "34", availableQuantity: 21, requiredQuantity: 0 },
          { size: "36", availableQuantity: 4, requiredQuantity: 0 },
          { size: "38", availableQuantity: 3, requiredQuantity: 0 }
        ]
      },
      {
        color: "calm & cool",
        sizes: [
          { size: "28", availableQuantity: 0, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 57, requiredQuantity: 0 },
          { size: "32", availableQuantity: 0, requiredQuantity: 0 },
          { size: "33", availableQuantity: 24, requiredQuantity: 0 },
          { size: "34", availableQuantity: 11, requiredQuantity: 0 },
          { size: "36", availableQuantity: 4, requiredQuantity: 0 },
          { size: "38", availableQuantity: 7, requiredQuantity: 0 }
        ]
      },
      {
        color: "wanna go back",
        sizes: [
          { size: "28", availableQuantity: 45, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 42, requiredQuantity: 0 },
          { size: "32", availableQuantity: 0, requiredQuantity: 0 },
          { size: "33", availableQuantity: 24, requiredQuantity: 0 },
          { size: "34", availableQuantity: 11, requiredQuantity: 0 },
          { size: "36", availableQuantity: 4, requiredQuantity: 0 },
          { size: "38", availableQuantity: 1, requiredQuantity: 0 }
        ]
      },
      {
        color: "agata m",
        sizes: [
          { size: "28", availableQuantity: 194, requiredQuantity: 0 },
          { size: "29", availableQuantity: 41, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 435, requiredQuantity: 0 },
          { size: "32", availableQuantity: 74, requiredQuantity: 0 },
          { size: "33", availableQuantity: 170, requiredQuantity: 0 },
          { size: "34", availableQuantity: 216, requiredQuantity: 0 },
          { size: "36", availableQuantity: 110, requiredQuantity: 0 },
          { size: "38", availableQuantity: 45, requiredQuantity: 0 }
        ]
      },
      {
        color: "azulache m",
        sizes: [
          { size: "28", availableQuantity: 34, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 34, requiredQuantity: 0 },
          { size: "32", availableQuantity: 0, requiredQuantity: 0 },
          { size: "33", availableQuantity: 2, requiredQuantity: 0 },
          { size: "34", availableQuantity: 3, requiredQuantity: 0 },
          { size: "36", availableQuantity: 4, requiredQuantity: 0 },
          { size: "38", availableQuantity: 2, requiredQuantity: 0 }
        ]
      }
    ]
  },
  {
    id: "pantalon-510-skinny",
    name: "Pantalon de Hombre 84510-12 510 SKINNY",
    colors: [
      {
        color: "sunset down",
        sizes: [
          { size: "28", availableQuantity: 67, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 67, requiredQuantity: 0 },
          { size: "32", availableQuantity: 1, requiredQuantity: 0 },
          { size: "33", availableQuantity: 12, requiredQuantity: 0 },
          { size: "34", availableQuantity: 22, requiredQuantity: 0 },
          { size: "36", availableQuantity: 24, requiredQuantity: 0 }
        ]
      },
      {
        color: "just in time do adv",
        sizes: [
          { size: "28", availableQuantity: 24, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 24, requiredQuantity: 0 },
          { size: "32", availableQuantity: 3, requiredQuantity: 0 },
          { size: "33", availableQuantity: 4, requiredQuantity: 0 },
          { size: "34", availableQuantity: 4, requiredQuantity: 0 },
          { size: "36", availableQuantity: 6, requiredQuantity: 0 }
        ]
      }
    ]
  },
  {
    id: "pantalon-512-slim-taper",
    name: "Pantalon de Hombre 23233-11 512 SLIM TAPER",
    colors: [
      {
        color: "just kickin it adv",
        sizes: [
          { size: "28", availableQuantity: 31, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 31, requiredQuantity: 0 },
          { size: "32", availableQuantity: 4, requiredQuantity: 0 },
          { size: "33", availableQuantity: 6, requiredQuantity: 0 },
          { size: "34", availableQuantity: 12, requiredQuantity: 0 },
          { size: "36", availableQuantity: 0, requiredQuantity: 0 },
          { size: "38", availableQuantity: 14, requiredQuantity: 0 }
        ]
      },
      {
        color: "escape with me od ab",
        sizes: [
          { size: "28", availableQuantity: 14, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 14, requiredQuantity: 0 },
          { size: "32", availableQuantity: 1, requiredQuantity: 0 },
          { size: "33", availableQuantity: 4, requiredQuantity: 0 },
          { size: "34", availableQuantity: 2, requiredQuantity: 0 }
        ]
      }
    ]
  },
  {
    id: "pantalon-514-straight",
    name: "Pantalon de Hombre 84514-19 514 STRAIGHT",
    colors: [
      {
        color: "clear rum adv",
        sizes: [
          { size: "28", availableQuantity: 32, requiredQuantity: 0 },
          { size: "29", availableQuantity: 0, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 32, requiredQuantity: 0 },
          { size: "32", availableQuantity: 5, requiredQuantity: 0 },
          { size: "33", availableQuantity: 6, requiredQuantity: 0 },
          { size: "34", availableQuantity: 3, requiredQuantity: 0 }
        ]
      },
      {
        color: "calm & cool",
        sizes: [
          { size: "28", availableQuantity: 27, requiredQuantity: 0 },
          { size: "29", availableQuantity: 269, requiredQuantity: 0 },
          { size: "30", availableQuantity: 0, requiredQuantity: 0 },
          { size: "31", availableQuantity: 333, requiredQuantity: 0 },
          { size: "32", availableQuantity: 3, requiredQuantity: 0 },
          { size: "33", availableQuantity: 4, requiredQuantity: 0 },
          { size: "34", availableQuantity: 7, requiredQuantity: 0 }
        ]
      }
    ]
  }
];

const VariantConfiguration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [sizeDetails, setSizeDetails] = useState<SizeDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset color and size details when product changes
    setSelectedColor("");
    setSizeDetails([]);
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct && selectedColor) {
      const colorVariant = selectedProduct.colors.find(c => c.color === selectedColor);
      if (colorVariant) {
        setSizeDetails([...colorVariant.sizes]);
      }
    }
  }, [selectedProduct, selectedColor]);

  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  const handleQuantityChange = (size: string, quantity: number) => {
    setSizeDetails(prev => 
      prev.map(detail => 
        detail.size === size 
          ? { ...detail, requiredQuantity: Math.max(0, quantity) }
          : detail
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const totalRequired = sizeDetails.reduce((sum, detail) => sum + detail.requiredQuantity, 0);
      toast({
        title: "Configuration Saved",
        description: `Total quantity of ${totalRequired} units configured for ${selectedProduct?.name} - ${selectedColor}.`,
      });
      setLoading(false);
    }, 1000);
  };

  const hasRequiredQuantities = sizeDetails.some(detail => detail.requiredQuantity > 0);

  // Group sizes into columns for multi-column layout
  const sizesPerColumn = 6;
  const sizeColumns = [];
  for (let i = 0; i < sizeDetails.length; i += sizesPerColumn) {
    sizeColumns.push(sizeDetails.slice(i, i + sizesPerColumn));
  }

  const getStockStatus = (available: number) => {
    if (available === 0) return "out-of-stock";
    if (available <= 10) return "low-stock";
    return "in-stock";
  };

  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case "in-stock": return "default";
      case "low-stock": return "secondary";
      case "out-of-stock": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">
                  Configure Product Variants
                </h1>
              </div>
            </div>
            {hasRequiredQuantities && (
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Configuration"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid gap-6">
          {/* Selection Controls */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Selection */}
              <div className="space-y-2">
                <Label htmlFor="product-select" className="text-sm font-medium">
                  Select Main Product
                </Label>
                <Select onValueChange={handleProductSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label htmlFor="color-select" className="text-sm font-medium">
                  Select Color
                </Label>
                <Select 
                  value={selectedColor} 
                  onValueChange={setSelectedColor}
                  disabled={!selectedProduct}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedProduct ? "Choose a color..." : "Select product first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct?.colors.map(colorVariant => (
                      <SelectItem key={colorVariant.color} value={colorVariant.color}>
                        <div className="flex items-center gap-2 capitalize">
                          <div 
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: colorVariant.color === 'orange' ? '#f97316' : colorVariant.color }}
                          />
                          {colorVariant.color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedProduct && selectedColor && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Configuring: <span className="font-medium text-foreground">{selectedProduct.name}</span> in{" "}
                  <span className="font-medium text-foreground capitalize">{selectedColor}</span>
                </p>
              </div>
            )}
          </Card>

          {/* Size Configuration Grid */}
          {sizeDetails.length > 0 && (
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Size Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Configure required quantities for each available size
                </p>
              </div>

              {/* Multi-column layout for sizes */}
              <div className="grid gap-8" style={{ 
                gridTemplateColumns: `repeat(${Math.min(sizeColumns.length, 3)}, 1fr)` 
              }}>
                {sizeColumns.map((columnSizes, columnIndex) => (
                  <div key={columnIndex} className="space-y-4">
                    {/* Column header */}
                    <div className="grid grid-cols-3 gap-4 pb-2 border-b border-border">
                      <div className="text-sm font-medium text-muted-foreground">Size</div>
                      <div className="text-sm font-medium text-muted-foreground">Available</div>
                      <div className="text-sm font-medium text-muted-foreground">Required</div>
                    </div>

                    {/* Size rows */}
                    {columnSizes.map((sizeDetail) => {
                      const stockStatus = getStockStatus(sizeDetail.availableQuantity);
                      return (
                        <div key={sizeDetail.size} className="grid grid-cols-3 gap-4 items-center">
                          {/* Size */}
                          <div className="font-medium text-foreground uppercase">
                            {sizeDetail.size}
                          </div>

                          {/* Available Quantity */}
                          <div className="flex items-center gap-2">
                            <span className="text-foreground">{sizeDetail.availableQuantity}</span>
                            <Badge 
                              variant={getStockBadgeVariant(stockStatus)}
                              className="text-xs"
                            >
                              {stockStatus === "in-stock" && "In Stock"}
                              {stockStatus === "low-stock" && "Low"}
                              {stockStatus === "out-of-stock" && "Out"}
                            </Badge>
                          </div>

                          {/* Required Quantity Input */}
                          <Input
                            type="number"
                            min="0"
                            max={sizeDetail.availableQuantity}
                            value={sizeDetail.requiredQuantity}
                            onChange={(e) => handleQuantityChange(sizeDetail.size, parseInt(e.target.value) || 0)}
                            className="w-full"
                            disabled={sizeDetail.availableQuantity === 0}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Required: <span className="font-medium text-foreground">
                      {sizeDetails.reduce((sum, detail) => sum + detail.requiredQuantity, 0)}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Total Available: <span className="font-medium text-foreground">
                      {sizeDetails.reduce((sum, detail) => sum + detail.availableQuantity, 0)}
                    </span>
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!selectedProduct && (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Product Selected</h3>
              <p className="text-muted-foreground">
                Select a main product above to begin configuring variants
              </p>
            </Card>
          )}

          {selectedProduct && !selectedColor && (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Color Selected</h3>
              <p className="text-muted-foreground">
                Choose a color for {selectedProduct.name} to view available sizes
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantConfiguration;