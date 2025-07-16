import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

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

const productNames = [
  "501 ORIGINAL",
  "501 ORIGINAL",
  "501 ORIGINAL",
  "501 ORIGINAL",
  "501 ORIGINAL",
  "501 ORIGINAL",
  "501 ORIGINAL",
  "505 REGULAR FIT",
  "505 REGULAR FIT",
  "505 REGULAR",
  "514 STRAIGHT",
  "514 STRAIGHT",
  "514 STRAIGHT",
  "514 STRAIGHT",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "511 SLIM",
  "510 SKINNY",
  "510 SKINNY",
  "510 SKINNY",
  "510 SKINNY",
  "510 SKINNY",
  "510 SKINNY",
  "527 STD BOOT CUT",
  "527 STD BOOT CUT",
  "541 ATH TAPER BT",
  "512 SLIM TAPER",
  "512 SLIM TAPER",
  "512 SLIM TAPER",
  "512 SLIM TAPER",
  "512 SLIM TAPER",
  "512 SLIM TAPER",
  "502 TAPER",
  "502 TAPER",
  "502 TAPER",
  "502 TAPER",
  "502 TAPER",
  "502 TAPER",
  "502 TAPER",
  "LO-BALL CARGO"
];

const colorList = [
  "MEDIUM INDIGO GRMT DYE",
  "MEX MID 82",
  "CHOLLA SUBTLE ADAPT TNL",
  "L4L",
  "ONEWASH",
  "STONEWASH",
  "BLACK STF",
  "FIRST CLASS",
  "WE'RE FINALLY LANDING",
  "RESTORE THE FEELING STR",
  "TIMBERWOLF",
  "OLIVE NIGHT CORD",
  "LAST FOREVER",
  "FLUORITA",
  "CLEANER ADV",
  "CLEAN RUN ADV",
  "CALM N COOL",
  "ON THE COOL",
  "DARK INDIGO WORN IN",
  "ALWAYS ADAPT",
  "CALM N COOL",
  "WANNA GO BACK",
  "JUST BE YOU"
];

const sizeHeaders = [
  "XSmall","Small","Medium","Large","XLarge","XXLarge","2XL","3XL",
  "L30-W28","L30-W29","L30-W30","L30-W31","L30-W32","L30-W33","L30-W34","L30-W36","L30-W38","L30-W40",
  "L32-W28","L32-W29","L32-W30","L32-W31","L32-W32","L32-W33","L32-W34","L32-W36","L32-W38","L32-W40",
  "L32-W42","L32-W44","L32-W46","L32-W48","L32-W50",
  "L34-W32","L34-W33","L34-W34","L34-W36","L34-W38","L34-W40","L34-W42",
  "W29","W30","W31"
];

const mockProducts: Product[] = productNames.map((name, idx) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
  colors: colorList.map(color => ({
    color,
    sizes: sizeHeaders.map(size => ({
      size,
      availableQuantity: Math.floor(Math.random() * 101),
      requiredQuantity: 0
    }))
  }))
}));

const VariantConfiguration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [sizeDetails, setSizeDetails] = useState<SizeDetail[]>([]);
  const [loading, setLoading] = useState(false);
  // Add state for showing review view
  const [showReview, setShowReview] = useState(false);
  // Add global inventory state
  const [allInventory, setAllInventory] = useState<{
    productId: string;
    productName: string;
    color: string;
    size: string;
    requiredQuantity: number;
  }[]>([]);

  // Helper to sync sizeDetails with allInventory
  const syncSizeDetailsWithInventory = (productId: string, productName: string, color: string) => {
    const inventoryForSelection = allInventory.filter(
      inv => inv.productId === productId && inv.color === color
    );
    return (selectedProduct?.colors.find(c => c.color === color)?.sizes || []).map(sizeDetail => {
      const found = inventoryForSelection.find(inv => inv.size === sizeDetail.size);
      return {
        ...sizeDetail,
        requiredQuantity: found ? found.requiredQuantity : 0
      };
    });
  };

  // When product or color changes, load from allInventory
  useEffect(() => {
    if (selectedProduct && selectedColor) {
      setSizeDetails(syncSizeDetailsWithInventory(selectedProduct.id, selectedProduct.name, selectedColor));
    }
  }, [selectedProduct, selectedColor, allInventory]);

  // Update allInventory when a required quantity is changed
  const handleQuantityChange = (size: string, quantity: number) => {
    setSizeDetails(prev =>
      prev.map(detail =>
        detail.size === size
          ? { ...detail, requiredQuantity: Math.max(0, quantity) }
          : detail
      )
    );
    if (selectedProduct && selectedColor) {
      setAllInventory(prev => {
        const idx = prev.findIndex(
          inv =>
            inv.productId === selectedProduct.id &&
            inv.color === selectedColor &&
            inv.size === size
        );
        if (idx !== -1) {
          // Update existing
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            requiredQuantity: Math.max(0, quantity)
          };
          return updated.filter(inv => inv.requiredQuantity > 0); // Remove if 0
        } else if (quantity > 0) {
          // Add new
          return [
            ...prev,
            {
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              color: selectedColor,
              size,
              requiredQuantity: Math.max(0, quantity)
            }
          ];
        } else {
          return prev;
        }
      });
    }
  };

  // In the review modal, show allInventory with requiredQuantity > 0
  // Editing in the review modal should update allInventory and, if the row matches the current selection, also update sizeDetails
  const handleReviewQuantityChange = (productId: string, color: string, size: string, quantity: number) => {
    setAllInventory(prev => {
      const idx = prev.findIndex(
        inv => inv.productId === productId && inv.color === color && inv.size === size
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          requiredQuantity: Math.max(0, quantity)
        };
        return updated.filter(inv => inv.requiredQuantity > 0);
      } else if (quantity > 0) {
        // Should not happen, but for completeness
        return [
          ...prev,
          {
            productId,
            productName: selectedProduct?.name || "",
            color,
            size,
            requiredQuantity: Math.max(0, quantity)
          }
        ];
      } else {
        return prev;
      }
    });
    // If this is the current selection, update sizeDetails too
    if (
      selectedProduct &&
      selectedColor &&
      productId === selectedProduct.id &&
      color === selectedColor
    ) {
      setSizeDetails(prev =>
        prev.map(detail =>
          detail.size === size
            ? { ...detail, requiredQuantity: Math.max(0, quantity) }
            : detail
        )
      );
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    setSelectedProduct(product || null);
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
  const sizesPerColumn = 12;
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

  // For the main product dropdown, use unique product names only
  const uniqueProductNames = Array.from(new Set(productNames));
  const uniqueMockProducts = uniqueProductNames.map(name => mockProducts.find(p => p.name === name)).filter(Boolean);

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
                  Add New Order
                </h1>
              </div>
            </div>
            {hasRequiredQuantities && (
              <Button onClick={() => {/* TODO: navigate to review page */}} disabled={!hasRequiredQuantities}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-3">
        <div className="p-2 bg-muted rounded">
          <p>
            <strong></strong> All variant options (color/style and size) are shown on a single page for easy bulk ordering.
          </p>
        </div>
        <div className="grid gap-1">
          {/* Selection Controls */}
          <Card className="p-5">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Main Product Autocomplete */}
              <div className="space-y-1">
                <Label htmlFor="main-product-autocomplete" className="text-sm font-medium">
                  Select Main Product
                </Label>
                <div className="relative">
                  <Autocomplete
                    id="main-product-autocomplete"
                    options={uniqueMockProducts.map(p => ({ label: p.name, value: p.id }))}
                    value={selectedProduct?.id || ""}
                    onChange={handleProductSelect}
                    placeholder="Type to search main product..."
                  />
                  {selectedProduct && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleProductSelect("")}
                      aria-label="Clear"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Color/Style Autocomplete */}
              <div className="space-y-2">
                <Label htmlFor="color-style-autocomplete" className="text-sm font-medium">
                  Select Color/Style
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Autocomplete
                        id="color-style-autocomplete"
                        options={selectedProduct?.colors.map(c => ({ label: c.color, value: c.color })) || []}
                        value={selectedColor}
                        onChange={setSelectedColor}
                        placeholder={selectedProduct ? "Type to search color/style..." : "Select main product first"}
                        disabled={!selectedProduct}
                      />
                      {selectedColor && (
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setSelectedColor("")}
                          aria-label="Clear"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowReview(true)} disabled={!selectedProduct || !selectedColor}>
                    Review Order
                  </Button>
                </div>
              </div>
            </div>

            {selectedProduct && selectedColor && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Ordering: <span className="font-medium text-foreground">{selectedProduct.name}</span> in{" "}
                  <span className="font-medium text-foreground capitalize">{selectedColor}</span>
                </p>
              </div>
            )}
          </Card>

          {/* Size Configuration Grid */}
          {sizeDetails.length > 0 && (
            <Card className="p-3">
              <div className="mb-3">
                <p className="text-xs text-muted-foreground">
                  Order required quantities for each available size
                </p>
              </div>

              {/* Multi-column layout for sizes */}
              <div className="grid gap-2 mb-4 w-full grid-cols-4">
                {sizeColumns.map((columnSizes, columnIndex) => (
                  <div key={columnIndex} className={`space-y-2 ${columnIndex !== 0 ? 'border-l border-border pl-6 pr-3' : ''}`}>
                    <div className="grid grid-cols-3 gap-2 pb-1 border-b border-border">
                      <div className="text-xs font-medium text-muted-foreground">Size</div>
                      <div className="text-xs font-medium text-muted-foreground">Available</div>
                      <div className="text-xs font-medium text-muted-foreground">Required</div>
                    </div>
                    {columnSizes.map((sizeDetail) => {
                      const stockStatus = getStockStatus(sizeDetail.availableQuantity);
                      return (
                        <div key={sizeDetail.size} className="grid grid-cols-3 gap-2 items-center">
                          <div className="font-medium text-foreground uppercase text-xs">{sizeDetail.size}</div>
                          <div className="flex items-center gap-1">
                            <span className="text-foreground text-xs">{sizeDetail.availableQuantity}</span>
                          </div>
                          <div className="flex justify-center">
                            <Input
                              type="number"
                              min="0"
                              max={sizeDetail.availableQuantity}
                              value={sizeDetail.requiredQuantity}
                              onChange={(e) => handleQuantityChange(sizeDetail.size, parseInt(e.target.value) || 0)}
                              className="w-full max-w-[60px] h-7 px-1 py-0 text-xs text-center"
                              disabled={sizeDetail.availableQuantity === 0}
                            />
                          </div>
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

      {/* Below the selection controls Card, show the review view if showReview is true */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="max-w-3xl w-full p-8">
          <DialogHeader>
            <DialogTitle>Review & Edit Inventory</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-1 text-left">Product/Variant</th>
                  <th className="px-2 py-1 text-left">Available Quantity</th>
                  <th className="px-2 py-1 text-left">Ordered Quantity</th>
                  <th className="px-2 py-1 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                {allInventory.filter(inv => inv.requiredQuantity > 0).map(inv => {
                  // Find available quantity from mock data
                  const product = mockProducts.find(p => p.id === inv.productId);
                  const colorObj = product?.colors.find(c => c.color === inv.color);
                  const sizeObj = colorObj?.sizes.find(s => s.size === inv.size);
                  const available = sizeObj?.availableQuantity ?? 0;
                  const cost = 4.99; // mock cost per item
                  return (
                    <tr key={`${inv.productId}-${inv.color}-${inv.size}`} className="border-b">
                      <td className="px-2 py-1 font-medium">
                        {inv.productName} - {inv.size} - {inv.color}
                      </td>
                      <td className="px-2 py-1">{available}</td>
                      <td className="px-2 py-1">
                        <Input
                          type="number"
                          min="0"
                          max={available}
                          value={inv.requiredQuantity}
                          onChange={e => handleReviewQuantityChange(inv.productId, inv.color, inv.size, parseInt(e.target.value) || 0)}
                          className="w-16 h-7 px-1 py-0 text-xs text-center"
                        />
                      </td>
                      <td className="px-2 py-1">${(cost * inv.requiredQuantity).toFixed(2)}</td>
                    </tr>
                  );
                })}
                {allInventory.filter(inv => inv.requiredQuantity > 0).length === 0 && (
                  <tr><td colSpan={4} className="text-center text-muted-foreground py-2">No inventory entered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {allInventory.filter(inv => inv.requiredQuantity > 0).length > 0 && (
            <div className="bg-[#eaf6f6] rounded p-4 mt-4 max-w-md ml-auto">
              {(() => {
                const costPerItem = 4.99;
                const totalQty = allInventory.reduce((sum, inv) => sum + inv.requiredQuantity, 0);
                const subtotal = allInventory.reduce((sum, inv) => sum + inv.requiredQuantity * costPerItem, 0);
                return (
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="text-xs text-muted-foreground">Total Quantity</td>
                        <td className="text-right font-medium">{totalQty}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-1">Subtotal</td>
                        <td className="text-right">${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-1">Additional Discount</td>
                        <td className="text-right">$0</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-1">Shipping</td>
                        <td className="text-right">TBD</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-1">Tax (0%)</td>
                        <td className="text-right">$0</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-1 font-bold">Total</td>
                        <td className="text-right font-bold text-lg">${subtotal.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                );
              })()}
            </div>
          )}
          <DialogClose asChild>
            <Button type="button" size="sm" variant="ghost" className="mt-4 w-full">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VariantConfiguration;