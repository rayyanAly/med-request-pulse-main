import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Template } from "@/redux/types";

interface TemplateViewDialogProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TemplateViewDialog({ template, open, onOpenChange }: TemplateViewDialogProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-background to-muted/20 border-2 shadow-2xl">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-success to-success/80 rounded-full shadow-sm"></div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {template.name}
            </span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp Template • {template.language.toUpperCase()}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="bg-gradient-to-r from-card to-card/80 border-2 border-primary/10 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold mb-4 text-foreground flex items-center gap-3 text-lg">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm"></div>
              Message Content
            </h4>
            <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-5 rounded-lg whitespace-pre-wrap text-sm leading-relaxed text-foreground border-l-4 border-primary/30 shadow-inner">
              {template.template}
            </div>
          </div>

          {template.input_map && template.input_map.length > 0 && (
            <div className="bg-gradient-to-r from-card to-card/80 border-2 border-info/10 rounded-xl p-6 shadow-sm">
              <h4 className="font-bold mb-4 text-foreground flex items-center gap-3 text-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-info to-info/80 rounded-full shadow-sm"></div>
                Dynamic Variables
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {template.input_map.map((param, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/20 to-muted/5 rounded-lg border border-info/20 shadow-sm">
                    <code className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-bold border-2 border-primary/30 shadow-sm">
                      {'{{' + (index + 1) + '}}'}
                    </code>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Maps to</div>
                      <div className="font-bold text-foreground text-sm">{param.replace(/_/g, ' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {template.button_params !== 0 && (
            <div className="bg-gradient-to-r from-card to-card/80 border-2 border-warning/10 rounded-xl p-6 shadow-sm">
              <h4 className="font-bold mb-4 text-foreground flex items-center gap-3 text-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-warning to-warning/80 rounded-full shadow-sm"></div>
                Interactive Buttons
              </h4>
              <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-4 rounded-lg border border-warning/20 shadow-inner">
                <pre className="text-xs overflow-x-auto text-foreground font-mono leading-relaxed">
                  {JSON.stringify(template.button_params, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}