import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { syncPromotions } from "@/redux/actions/promotionActions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PromotionUpload from "./PromotionUpload";

export default function PromotionHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const { syncing } = useSelector((state: any) => state.promotions);
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSync = async () => {
    try {
      const result = await dispatch(syncPromotions() as any);
      toast({
        title: "Sync Completed",
        description: `Applied: ${result.data.set}, Cleared: ${result.data.cleared}`,
        className: "bg-blue-100 border-blue-400 text-blue-800 border-2",
      });
    } catch (error: any) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync promotions",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-normal text-foreground">
          Promotions
        </h1>
        <p className="text-lg font-light text-muted-foreground">
          View and manage product promotions
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSync} disabled={syncing} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync'}
        </Button>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Promotion Excel</DialogTitle>
            </DialogHeader>
            <PromotionUpload onSuccess={() => setIsUploadModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}