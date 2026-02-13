import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { Banner } from "@/redux/types";
import { useBannerForm } from "@/hooks/useBannerForm";
import BannerBasicInfo from "./BannerBasicInfo";
import BannerObjectSelection from "./BannerObjectSelection";
import BannerImages from "./BannerImages";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  banner?: Banner | null;
}

export default function BannerDialog({ open, onOpenChange, mode, banner }: BannerDialogProps) {
  const {
    manufacturers,
    categories,
    products,
    referenceDataLoading,
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
    loading,
    errors,
    searchQuery,
    setSearchQuery,
    commandOpen,
    setCommandOpen,
    handleBannerTypeChange,
    addImage,
    removeImage,
    updateImage,
    handleSubmit,
  } = useBannerForm({ mode, banner, onOpenChange });

  if (mode === 'edit' && !banner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {mode === 'create' ? <Plus className="w-5 h-5 text-primary" /> : <Edit className="w-5 h-5 text-primary" />}
            {mode === 'create' ? 'Create Banner' : 'Edit Banner'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Create a new banner for your website or mobile app' : 'Update banner information and images'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <BannerBasicInfo
            name={name}
            setName={setName}
            bannerType={bannerType}
            setBannerType={handleBannerTypeChange}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            status={status}
            setStatus={setStatus}
            description={description}
            setDescription={setDescription}
            descriptionImage={descriptionImage}
            setDescriptionImage={setDescriptionImage}
            errors={errors}
          />

          <BannerObjectSelection
            bannerType={bannerType}
            objectId={objectId}
            setObjectId={setObjectId}
            manufacturers={manufacturers}
            categories={categories}
            products={products}
            referenceDataLoading={referenceDataLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            commandOpen={commandOpen}
            setCommandOpen={setCommandOpen}
            errors={errors}
          />

          <BannerImages
            images={images}
            addImage={addImage}
            removeImage={removeImage}
            updateImage={updateImage}
            errors={errors}
          />

        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? (mode === 'create' ? "Creating..." : "Updating...") : (mode === 'create' ? "Create Banner" : "Update Banner")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}