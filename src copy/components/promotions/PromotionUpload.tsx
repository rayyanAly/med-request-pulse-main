import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { uploadPromotions } from "@/redux/actions/promotionActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromotionUploadProps {
  onSuccess?: () => void;
}

export default function PromotionUpload({ onSuccess }: PromotionUploadProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { uploading } = useSelector((state: any) => state.promotions);
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await dispatch(uploadPromotions(selectedFile) as any);

      toast({
        title: "Success",
        description: `Successfully uploaded ${result.data.processed} promotions. They will be applied automatically at midnight UAE time.`,
        className: "bg-blue-100 border-blue-400 text-blue-800 border-2",
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('excelFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      // Close modal on success
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload promotions",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800 border-2",
      });
    }
  };


  const validateFile = (file: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/)) {
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="excelFile">Select Excel File</Label>
        <Input
          id="excelFile"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading || (selectedFile && !validateFile(selectedFile))}
        className="w-full"
      >
        {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {uploading ? 'Uploading...' : 'Upload Promotions'}
      </Button>

      {selectedFile && !validateFile(selectedFile) && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <XCircle className="h-5 w-5 text-yellow-600" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Invalid File Type</p>
            <p className="text-yellow-700">Please select a valid Excel file (.xlsx or .xls)</p>
          </div>
        </div>
      )}
    </div>
  );
}