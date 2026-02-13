import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createBanner, updateBanner } from "@/redux/actions/bannerActions";
import { Banner } from "@/redux/types";
import { useToast } from "@/hooks/use-toast";

interface BannerImage {
  title: string;
  link: string;
  image: File | null;
  mobile_image: File | null;
  sort_order: number;
  meta: string;
  existingImage?: string;
  existingMobileImage?: string;
}

interface UseBannerFormProps {
  mode: 'create' | 'edit';
  banner?: Banner | null;
  onOpenChange: (open: boolean) => void;
}

export function useBannerForm({ mode, banner, onOpenChange }: UseBannerFormProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { manufacturers: reduxManufacturers, categories: reduxCategories, products: reduxProducts, loading: referenceDataLoading } = useSelector((state: RootState) => state.referenceData);

  // Cache data in component state for instant access
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Cache data locally when Redux data loads - only active items
  useEffect(() => {
    if (reduxManufacturers && reduxManufacturers.length > 0) setManufacturers(reduxManufacturers.filter((m: any) => m.status === 1));
    if (reduxCategories && reduxCategories.length > 0) setCategories(reduxCategories.filter((c: any) => c.status === 1));
    if (reduxProducts && reduxProducts.length > 0) setProducts(reduxProducts);
  }, [reduxManufacturers, reduxCategories, reduxProducts]);

  // Form state
  const [name, setName] = useState("");
  const [bannerType, setBannerType] = useState("");
  const [objectId, setObjectId] = useState<number | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [status, setStatus] = useState(1);
  const [description, setDescription] = useState("");
  const [descriptionImage, setDescriptionImage] = useState("");
  const [images, setImages] = useState<BannerImage[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

  // Populate form when banner changes (for edit mode) or reset for create mode
  useEffect(() => {
    if (mode === 'edit' && banner) {
      setName(banner.name);
      setBannerType(banner.banner_type);
      setObjectId(banner.object_id || null);
      setExpiryDate(new Date(banner.expiry_date));
      setStatus(banner.status);
      setDescription(banner.description || "");
      setDescriptionImage(banner.description_image || "");
      setImages(banner.images.map(img => ({
        title: img.title,
        link: img.link || "",
        image: null,
        mobile_image: null,
        sort_order: img.sort_order,
        meta: img.meta || "",
        existingImage: img.image,
        existingMobileImage: img.mobile_image || undefined,
      })));
    } else {
      // Reset for create mode
      setName("");
      setBannerType("");
      setObjectId(null);
      setExpiryDate(undefined);
      setStatus(1);
      setDescription("");
      setDescriptionImage("");
      setImages([
        {
          title: "",
          link: "",
          image: null,
          mobile_image: null,
          sort_order: 0,
          meta: "",
        }
      ]);
    }
    setSearchQuery("");
    setErrors({});
  }, [mode, banner]);

  // Handle banner type change
  const handleBannerTypeChange = (value: string) => {
    setBannerType(value);
    setSearchQuery("");
    setCommandOpen(false);
    if (value === 'page' || value === 'others') {
      setObjectId(0);
    } else {
      setObjectId(null);
    }
  };

  // Add new image
  const addImage = () => {
    setImages(prev => [...prev, {
      title: "",
      link: "",
      image: null,
      mobile_image: null,
      sort_order: prev.length,
      meta: "",
    }]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Update image
  const updateImage = (index: number, field: keyof BannerImage, value: string | number | File | null) => {
    setImages(prev => prev.map((img, i) =>
      i === index ? { ...img, [field]: value } : img
    ));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Banner name is required";
    }

    if (!bannerType) {
      newErrors.bannerType = "Banner type is required";
    }

    if ((bannerType === 'brands' || bannerType === 'categories' || bannerType === 'products') && !objectId) {
      newErrors.objectId = `${bannerType === 'brands' ? 'Manufacturer' : bannerType === 'categories' ? 'Category' : 'Product'} is required`;
    }

    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    }

    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    images.forEach((img, index) => {
      if (!img.title.trim()) {
        newErrors[`image_${index}_title`] = "Image title is required";
      }
      if (!img.image && !img.existingImage) {
        newErrors[`image_${index}_image`] = "Image file is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const imageFiles: File[] = [];
      const mobileImageFiles: File[] = [];

      images.forEach(img => {
        if (img.image) imageFiles.push(img.image);
        if (img.mobile_image) mobileImageFiles.push(img.mobile_image);
      });

      const bannerData = {
        name: name.trim(),
        banner_type: bannerType,
        object_id: objectId || 0,
        expiry_date: expiryDate!.toISOString(),
        status,
        description: description.trim() || "",
        description_image: descriptionImage.trim() || "",
        images: images.map(img => ({
          title: img.title.trim(),
          link: img.link.trim(),
          sort_order: img.sort_order,
          meta: img.meta.trim() || "",
          image: img.existingImage || undefined, // Include existing image path
          mobile_image: img.existingMobileImage || undefined, // Include existing mobile image path
        })),
      };

      if (mode === 'create') {
        await dispatch(createBanner(bannerData, imageFiles, mobileImageFiles) as any);
        toast({
          title: "Success",
          description: "Banner created successfully",
          className: "bg-green-100 border-green-400 text-green-800 border-2",
        });
      } else if (mode === 'edit' && banner) {
        await dispatch(updateBanner(banner.banner_id, bannerData, imageFiles, mobileImageFiles) as any);
        toast({
          title: "Success",
          description: "Banner updated successfully",
          className: "bg-blue-100 border-blue-400 text-blue-800 border-2",
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error(`Failed to ${mode} banner:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode} banner`,
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
      setErrors({}); // Clear any previous errors
    } finally {
      setLoading(false);
    }
  };

  return {
    // Data
    manufacturers,
    categories,
    products,
    referenceDataLoading,
    // State
    name,
    setName,
    bannerType,
    setBannerType,
    objectId,
    setObjectId,
    expiryDate,
    setExpiryDate,
    status,
    setStatus,
    description,
    setDescription,
    descriptionImage,
    setDescriptionImage,
    images,
    setImages,
    loading,
    errors,
    searchQuery,
    setSearchQuery,
    commandOpen,
    setCommandOpen,
    // Functions
    handleBannerTypeChange,
    addImage,
    removeImage,
    updateImage,
    validateForm,
    handleSubmit,
  };
}