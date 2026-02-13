import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from "@/redux/types";

interface SeoTabProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export default function SeoTab({ formData, setFormData }: SeoTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="meta_title">Meta Title</Label>
        <Input
          id="meta_title"
          value={formData.meta_title}
          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
          placeholder="SEO title for search engines"
        />
      </div>

      <div>
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          value={formData.meta_description}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          rows={3}
          placeholder="SEO description for search results"
        />
      </div>

      <div>
        <Label htmlFor="meta_keyword">Meta Keywords</Label>
        <Input
          id="meta_keyword"
          value={formData.meta_keyword}
          onChange={(e) => setFormData({ ...formData, meta_keyword: e.target.value })}
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>
    </div>
  );
}