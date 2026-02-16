import { useState, useEffect } from "react";
import { Upload, Plus, X, Eye, FileText, ShoppingCart, Minus, Plus as PlusIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/redux/actions/productActions";
import { createNewOrder, createOrderReset } from "@/redux/actions/orderActions";
import { Product, CartItem, PaymentMethod, OrderProductApi, OrderFiles } from "@/api/types";
import { RootState } from "@/redux/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { uploadTempPrescription, deleteTempFile, generateSessionId } from "@/api/orderApi";

// Base URL for product images
const IMAGE_BASE_URL = "https://dashboard.800pharmacy.ae/";

// Helper to get full image URL
const getProductImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "/placeholder.svg";
  // If already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Prepend the base URL
  return `${IMAGE_BASE_URL}${imagePath}`;
};

export default function CreateOrder() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  
  const { createOrderLoading, createOrderSuccess, createOrderError } = useSelector((state: RootState) => state.orders);
  const { products: reduxProducts, loading: productsLoading } = useSelector((state: RootState) => state.products);

  // Customer Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [eidNo, setEidNo] = useState("");
  const [notes, setNotes] = useState("");
  
  // Order Options
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [withInsurance, setWithInsurance] = useState(false);
  const [withPrescription, setWithPrescription] = useState(false);
  const [erxNo, setErxNo] = useState("");
  
  // Files and Products
  const [prescriptionFiles, setPrescriptionFiles] = useState<File[]>([]); // Up to 3 prescription images
  const [prescriptionIds, setPrescriptionIds] = useState<string[]>([]); // inserted_id for each file
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [emiratesIdFile, setEmiratesIdFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [sessionId] = useState(() => generateSessionId()); // Session ID for temp uploads

  const countryCodes = [
    { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
    { code: "+1", country: "US", flag: "🇺🇸", name: "USA" },
    { code: "+44", country: "GB", flag: "🇬🇧", name: "UK" },
    { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
    { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "+974", country: "QA", flag: "🇶🇦", name: "Qatar" },
    { code: "+965", country: "KW", flag: "🇰🇼", name: "Kuwait" },
    { code: "+968", country: "OM", flag: "🇴🇲", name: "Oman" },
    { code: "+973", country: "BH", flag: "🇧🇭", name: "Bahrain" },
  ];

  // Load products on mount
  useEffect(() => {
    if (reduxProducts.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, reduxProducts.length]);

  // Handle successful order creation
  useEffect(() => {
    if (createOrderSuccess) {
      toast.success("Order created successfully!");
      dispatch(createOrderReset());
      navigate("/orders");
    }
    if (createOrderError) {
      toast.error(createOrderError);
    }
  }, [createOrderSuccess, createOrderError, dispatch, navigate]);

  // Filter products - exclude out of stock
  const availableProducts = reduxProducts.filter((product: Product) => 
    (product.available_stock || 0) > 0
  );

  const filteredProducts = availableProducts.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toString().includes(searchTerm.toLowerCase()) ||
    (product.plus_symptoms && product.plus_symptoms.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = () => {
    if (!selectedProduct) return;
    
    // Check stock
    const stock = selectedProduct.available_stock || 0;
    if (quantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    // Auto-enable prescription if product requires it
    if (selectedProduct.prescription_required === 1 && !withPrescription) {
      setWithPrescription(true);
      toast.info("Prescription required for this product - enabled automatically");
    }

    const existing = cart.find(item => item.product_id === selectedProduct.product_id);
    if (existing) {
      const newQty = existing.qty + quantity;
      const stock = selectedProduct.available_stock || 0;
      if (newQty > stock) {
        toast.error(`Only ${stock} items available in stock`);
        return;
      }
      setCart(cart.map(item =>
        item.product_id === selectedProduct.product_id
          ? { ...item, qty: newQty }
          : item
      ));
    } else {
      setCart([...cart, { 
        product_id: selectedProduct.product_id, 
        sku: selectedProduct.sku, 
        qty: quantity 
      }]);
    }
    setShowProductDialog(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm("");
    toast.success("Product added to cart");
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: number, newQty: number) => {
    const cartItem = cart.find(item => item.product_id === productId);
    if (!cartItem) return;
    
    const product = reduxProducts.find((p: Product) => p.product_id === productId);
    const stock = product?.available_stock || 0;
    
    if (newQty > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }
    
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.product_id === productId ? { ...item, qty: newQty } : item
    ));
  };

  const handlePrescriptionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = prescriptionFiles.length + newFiles.length;
      
      if (totalFiles > 3) {
        toast.error("Maximum 3 prescription images allowed");
        return;
      }
      
      // Upload each file immediately via upload_temp
      setUploadingFiles(true);
      const newIds: string[] = [];
      try {
        for (const file of newFiles) {
          const result = await uploadTempPrescription(file, sessionId);
          if (!result.success) {
            toast.error(`Failed to upload ${file.name}: ${result.error}`);
            setUploadingFiles(false);
            return;
          }
          // Store the inserted_id for later deletion if needed
          if (result.data?.inserted_id) {
            newIds.push(result.data.inserted_id);
          }
          toast.success(`${file.name} uploaded successfully`);
        }
        // Add files and IDs to state after successful upload
        setPrescriptionFiles([...prescriptionFiles, ...newFiles]);
        setPrescriptionIds([...prescriptionIds, ...newIds]);
      } catch (error: any) {
        toast.error(`Failed to upload prescription: ${error.message}`);
      }
      setUploadingFiles(false);
    }
    // Reset input
    e.target.value = '';
  };

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInsuranceFile(e.target.files[0]);
    }
  };

  const handleEmiratesIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEmiratesIdFile(e.target.files[0]);
    }
  };

  const removePrescription = async (index: number) => {
    const insertedId = prescriptionIds[index];
    
    // Delete from server if we have an inserted_id
    if (insertedId) {
      try {
        await deleteTempFile(insertedId, sessionId);
        toast.success("File removed successfully");
      } catch (error: any) {
        toast.error(`Failed to delete file: ${error.message}`);
        // Still remove from local state even if server delete fails
      }
    }
    
    // Remove from local state
    setPrescriptionFiles(prescriptionFiles.filter((_, i) => i !== index));
    setPrescriptionIds(prescriptionIds.filter((_, i) => i !== index));
  };
  const removeInsurance = () => setInsuranceFile(null);
  const removeEmiratesId = () => setEmiratesIdFile(null);

  const handlePreviewFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewFile({ name: file.name, url });
  };

  const closePreview = () => {
    if (previewFile?.url) {
      URL.revokeObjectURL(previewFile.url);
    }
    setPreviewFile(null);
  };

  // Check if cart contains Rx products
  const cartHasRxProducts = cart.some(item => {
    const product = reduxProducts.find((p: Product) => p.product_id === item.product_id);
    return product?.prescription_required === 1;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (cart.length === 0) {
      toast.error("Please add at least one product to the cart");
      return;
    }
    if (!firstName.trim()) {
      toast.error("Please enter first name");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter last name");
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Please enter contact number");
      return;
    }
    // Check if prescription is required for cart
    if (cartHasRxProducts && !withPrescription) {
      toast.error("Prescription is required for products in cart");
      return;
    }
    if (withPrescription && prescriptionFiles.length === 0 && !erxNo.trim()) {
      toast.error("Please upload at least one prescription image or enter eRX number");
      return;
    }

    // Files are already uploaded via upload_temp when selected
    // Just create the order with the session ID

    const orderData = {
      first_name: firstName,
      last_name: lastName,
      contact_number: `${countryCode}${phoneNumber}`,
      payment_method: paymentMethod,
      with_insurance: withInsurance,
      with_prescription: withPrescription,
      products: cart.map(item => ({
        sku: String(item.sku),
        qty: Number(item.qty)
      })),
      eid_no: eidNo || undefined,
      erx: withPrescription ? erxNo : undefined,
      notes: notes || undefined,
      session: prescriptionFiles.length > 0 ? sessionId : undefined, // Reference to pre-uploaded files
    };
    
    // Collect files for upload with proper field names
    const filesToUpload: OrderFiles = {
      insurance: insuranceFile || undefined,
      emirates_id: emiratesIdFile || undefined,
    };
    
    dispatch(createNewOrder(orderData, filesToUpload));
  };

  const handleCancel = () => {
    dispatch(createOrderReset());
    navigate("/orders");
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => {
    const product = reduxProducts.find((p: Product) => p.product_id === item.product_id);
    return sum + (product?.price || 0) * item.qty;
  }, 0);

  const deliveryCharges = 5.75;
  const orderTotal = cartTotal + deliveryCharges;

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Create New Order</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details to create a new prescription delivery order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      required
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Mobile Number *</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-32 h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="50 123 4567"
                      required
                      className="h-9 text-sm flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="eid" className="text-xs">EID No</Label>
                  <Input
                    id="eid"
                    value={eidNo}
                    onChange={(e) => setEidNo(e.target.value)}
                    placeholder="Enter Emirates ID number"
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="notes" className="text-xs">Comments</Label>
                    <span className="text-xs text-amber-600 font-medium">(Visible to customer)</span>
                  </div>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional comments..."
                    rows={2}
                    className="text-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Options */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-base">Order Options</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-5 space-y-4">
                {/* Payment Method */}
                <div className="space-y-1.5">
                  <Label htmlFor="payment" className="text-xs">Payment Method *</Label>
                  <Select 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  >
                    <SelectTrigger className="h-9 text-sm w-full max-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[150px]">
                       <SelectItem value="cash">Cash on Delivery</SelectItem>
                       <SelectItem value="card">Card on Delivery</SelectItem>
                       <SelectItem value="online">Online Payment</SelectItem>
                       <SelectItem value="paid_already">Paid Already</SelectItem>
                      </SelectContent>
                  </Select>
                </div>

                {/* Insurance Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="insurance" className="text-xs">Insurance</Label>
                    <p className="text-xs text-muted-foreground">Order has insurance coverage</p>
                  </div>
                  <Switch
                    id="insurance"
                    checked={withInsurance}
                    onCheckedChange={setWithInsurance}
                  />
                </div>

                {/* Prescription Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="prescription" className="text-xs">Prescription Required</Label>
                    <p className="text-xs text-muted-foreground">
                      {cartHasRxProducts ? (
                        <span className="text-amber-600 font-medium">Required for cart items</span>
                      ) : (
                        "Order needs prescription upload"
                      )}
                    </p>
                  </div>
                  <Switch
                    id="prescription"
                    checked={withPrescription}
                    onCheckedChange={setWithPrescription}
                    disabled={cartHasRxProducts}
                  />
                </div>

                {/* eRX Number (conditional) */}
                {withPrescription && (
                  <div className="space-y-1.5">
                    <Label htmlFor="erx" className="text-xs">eRX Number</Label>
                    <Input
                      id="erx"
                      value={erxNo}
                      onChange={(e) => setErxNo(e.target.value)}
                      placeholder="Enter eRX number (or upload prescription below)"
                      className="h-9 text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Prescription Upload */}
            {withPrescription && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Upload Prescription</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {prescriptionFiles.length}/3 images
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-5 space-y-3">
                  {/* Upload area - show if less than 3 files */}
                  {prescriptionFiles.length < 3 && (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <div className="space-y-1">
                        <Label htmlFor="prescription-upload" className="cursor-pointer">
                          <span className="text-sm text-primary font-medium hover:underline">
                            Choose file{prescriptionFiles.length === 0 ? '' : ' (add more)'}
                          </span>
                          {" "}
                          <span className="text-xs">or drag and drop</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, PDF up to 10MB (max 3 images)
                        </p>
                      </div>
                      <Input
                        id="prescription-upload"
                        type="file"
                        onChange={handlePrescriptionChange}
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.pdf"
                        multiple
                      />
                    </div>
                  )}
                  
                  {/* Uploaded files list */}
                  {prescriptionFiles.length > 0 && (
                    <div className="space-y-2">
                      {prescriptionFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:bg-muted transition-colors group">
                          <div 
                            className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer overflow-hidden"
                            onClick={() => handlePreviewFile(file)}
                          >
                            {file.type.startsWith('image/') ? (
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePrescription(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload progress indicator */}
                  {uploadingFiles && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading prescription images...</span>
                    </div>
                  )}
                </CardContent>
            </Card>
            )}

            {/* Insurance Upload */}
            {withInsurance && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-base">Upload Insurance Card</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-5 space-y-3">
                  {!insuranceFile ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <div className="space-y-1">
                        <Label htmlFor="insurance-upload" className="cursor-pointer">
                          <span className="text-sm text-primary font-medium hover:underline">
                            Choose file
                          </span>
                          {" "}
                          <span className="text-xs">or drag and drop</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </div>
                      <Input
                        id="insurance-upload"
                        type="file"
                        onChange={handleInsuranceChange}
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.pdf"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:bg-muted transition-colors group">
                      <div 
                        className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer overflow-hidden"
                        onClick={() => handlePreviewFile(insuranceFile)}
                      >
                        {insuranceFile.type.startsWith('image/') ? (
                          <img 
                            src={URL.createObjectURL(insuranceFile)} 
                            alt={insuranceFile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{insuranceFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(insuranceFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={removeInsurance}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Emirates ID Upload */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-base">Emirates ID (New Customers)</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-5 space-y-3">
                {!emiratesIdFile ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <div className="space-y-1">
                      <Label htmlFor="emirates-id-upload" className="cursor-pointer">
                        <span className="text-sm text-primary font-medium hover:underline">
                          Choose file
                        </span>
                        {" "}
                        <span className="text-xs">or drag and drop</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                    <Input
                      id="emirates-id-upload"
                      type="file"
                      onChange={handleEmiratesIdChange}
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:bg-muted transition-colors group">
                    <div 
                      className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer overflow-hidden"
                      onClick={() => handlePreviewFile(emiratesIdFile)}
                    >
                      {emiratesIdFile.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(emiratesIdFile)} 
                          alt={emiratesIdFile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{emiratesIdFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(emiratesIdFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeEmiratesId}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
 
            {/* Cart */}
            <Card className="flex-1">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart ({cart.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8 text-xs mb-3"
                  onClick={() => setShowProductDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Product
                </Button>
                {cart.length === 0 ? (
                  <div className="text-center text-xs text-muted-foreground py-4">
                    No products in cart
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item) => {
                      const product = reduxProducts.find((p: Product) => p.product_id === item.product_id);
                      return (
                        <div key={item.product_id} className="flex items-center gap-3 p-2 border border-border rounded-lg">
                           <img
                             src={getProductImageUrl(product?.image)}
                             alt={product?.name}
                            className="w-10 h-10 object-contain rounded bg-muted shrink-0"
                             onError={(e) => {
                               e.currentTarget.src = '/placeholder.svg';
                             }}
                           />
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="font-medium text-sm truncate" title={product?.name}>{product?.name}</p>
                             <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                             <p className="text-xs text-muted-foreground">AED {product?.price}</p>
                           </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product_id, item.qty - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.qty}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                            >
                              <PlusIcon className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                    
                    {/* Cart Summary */}
                    <div className="border-t border-border pt-2 mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>AED {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>AED {deliveryCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-1">
                        <span>Total</span>
                        <span>AED {orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel} className="h-9" disabled={createOrderLoading}>
            Cancel
          </Button>
          <Button type="submit" className="h-9" disabled={createOrderLoading}>
            {createOrderLoading ? "Creating..." : "Submit Order"}
          </Button>
        </div>
      </form>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-muted rounded-lg">
            {previewFile && (
              previewFile.name.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full min-h-[600px]"
                  title={previewFile.name}
                />
              ) : (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="w-full h-full object-contain"
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Selection Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <DialogTitle className="text-lg font-semibold">Select Product</DialogTitle>
          </div>
          
          {/* Search */}
          <div className="px-6 py-3 border-b">
            <div className="relative">
              <Input
                placeholder="Search by name, SKU, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pr-10"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Product List */}
          <div className="max-h-[400px] overflow-y-auto">
            {productsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <Skeleton className="h-14 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchTerm ? "No products found matching your search" : "No products available"}
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredProducts.map((product) => {
                  const inStock = (product.available_stock || 0) > 0;
                  const isSelected = selectedProduct?.product_id === product.product_id;
                  return (
                    <div
                      key={product.product_id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                          : inStock 
                            ? 'hover:bg-muted/50 border-border' 
                            : 'opacity-50 cursor-not-allowed border-border'
                      }`}
                      onClick={() => inStock && setSelectedProduct(product)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          className="w-14 h-14 object-contain rounded bg-muted shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm truncate">{product.name}</h4>
                              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-primary">AED {product.price.toFixed(2)}</p>
                              <p className={`text-xs ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                                {inStock ? `Stock: ${product.available_stock}` : 'Out of Stock'}
                              </p>
                            </div>
                          </div>
                          {product.prescription_required === 1 && (
                            <Badge variant="secondary" className="text-xs mt-1">Rx Required</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer - Quantity and Actions */}
          <div className="px-6 py-4 border-t bg-muted/30">
            {selectedProduct ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center font-medium">{quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Max: {selectedProduct.available_stock || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedProduct(null);
                        setQuantity(1);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addToCart}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

