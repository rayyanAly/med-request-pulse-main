import BannerDialog from "./BannerDialog";
import { Banner } from "@/redux/types";

interface EditBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
}

export default function EditBannerDialog({ open, onOpenChange, banner }: EditBannerDialogProps) {
  return (
    <BannerDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      banner={banner}
    />
  );
}