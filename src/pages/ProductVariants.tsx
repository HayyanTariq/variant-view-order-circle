import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Scan, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VariantTable } from "@/components/variant-table";
import { VariantSummary } from "@/components/variant-summary";

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  totalQuantity: number;
  requiredQuantity: number;
  availableToSell: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

// Mock data - replace with actual API call
const mockVariants: ProductVariant[] = [
  {
    id: "var-1",
    name: "Jeans 511 - Size: sm - Color: red (jeans-2)",
    sku: "jeans-2",
    totalQuantity: 150,
    requiredQuantity: 45,
    availableToSell: 105,
    status: "in-stock"
  },
  {
    id: "var-2", 
    name: "ABC Jacket - Size: large - Color: or (testsfd-2)",
    sku: "testsfd-2",
    totalQuantity: 75,
    requiredQuantity: 12,
    availableToSell: 63,
    status: "in-stock"
  },
  {
    id: "var-3",
    name: "ABC Jacket - Size: sm - Color: or (testsfd-4)",
    sku: "testsfd-4", 
    totalQuantity: 40,
    requiredQuantity: 38,
    availableToSell: 2,
    status: "low-stock"
  },
  {
    id: "var-4",
    name: "Premium Denim - Size: lg - Color: blue (denim-1)",
    sku: "denim-1",
    totalQuantity: 0,
    requiredQuantity: 25,
    availableToSell: 0,
    status: "out-of-stock"
  },
  {
    id: "var-5",
    name: "Classic Tee - Size: md - Color: white (tee-1)",
    sku: "tee-1",
    totalQuantity: 200,
    requiredQuantity: 8,
    availableToSell: 192,
    status: "in-stock"
  }
];

const ProductVariants = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchVariants = async () => {
      setLoading(true);
      // Replace with actual API call
      setTimeout(() => {
        setVariants(mockVariants);
        setLoading(false);
      }, 500);
    };

    fetchVariants();
  }, [productId]);

  const filteredVariants = variants.filter(variant =>
    variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variant.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mainProductName = "Main Product Collection"; // Replace with actual main product name

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
                  Product Variants
                </h1>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Scan className="h-4 w-4 mr-2" />
              Scan
            </Button>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Viewing variants for:
            </p>
            <h2 className="text-lg font-medium text-foreground">
              {mainProductName}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid gap-6">
          {/* Summary Cards */}
          <VariantSummary variants={variants} />

          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search variants by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                {filteredVariants.length} of {variants.length} variants
              </Badge>
            </div>
          </Card>

          {/* Variants Table */}
          <Card>
            <VariantTable 
              variants={filteredVariants} 
              loading={loading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;