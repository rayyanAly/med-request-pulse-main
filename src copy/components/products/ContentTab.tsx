import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "@/redux/types";

interface ContentTabProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export default function ContentTab({ formData, setFormData }: ContentTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          placeholder="Full product description..."
        />
      </div>

      <div>
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          rows={4}
          placeholder="Product details..."
        />
      </div>

      <div>
        <Label htmlFor="how_it_work">How It Works</Label>
        <Textarea
          id="how_it_work"
          value={formData.how_it_work}
          onChange={(e) => setFormData({ ...formData, how_it_work: e.target.value })}
          rows={3}
          placeholder="How it works..."
        />
      </div>

      <div>
        <Label htmlFor="ingredients">Ingredients</Label>
        <Textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          rows={3}
          placeholder="Ingredients list..."
        />
      </div>

      <div>
        <Label htmlFor="warnings">Warnings</Label>
        <Textarea
          id="warnings"
          value={formData.warnings}
          onChange={(e) => setFormData({ ...formData, warnings: e.target.value })}
          rows={3}
          placeholder="Warnings text..."
        />
      </div>
    </div>
  );
}