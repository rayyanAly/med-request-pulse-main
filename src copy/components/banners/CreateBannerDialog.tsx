import BannerDialog from "./BannerDialog";

interface CreateBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateBannerDialog({ open, onOpenChange }: CreateBannerDialogProps) {
  return (
    <BannerDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      banner={null}
    />
  );
}