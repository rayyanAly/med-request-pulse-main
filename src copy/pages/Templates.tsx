import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MessageCircle,
  Mail,
  Eye,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchTemplates, fetchTemplateUsage } from "@/redux/actions/templateActions";
import { fetchCustomers } from "@/redux/actions/whatsappActions";
import { Template, TemplateUsage } from "@/redux/types";
import TemplateViewDialog from "@/components/TemplateViewDialog";
import SendTemplateDialog from "@/components/SendTemplateDialog";
import TemplatesTableSkeleton from "@/components/skeleton/TemplatesTableSkeleton";

export default function Templates() {
  const dispatch = useDispatch<AppDispatch>();
  const { templates, templateUsage, loading, error } = useSelector((state: RootState) => state.template);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [sendDialogOpen, setSendDialogOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateUsage());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const getUsageForTemplate = (templateId: number): TemplateUsage | undefined => {
    return templateUsage.find(usage => parseInt(usage.template_id) === templateId);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.template.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || (typeFilter === "whatsapp");
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "usage":
          const aUsage = getUsageForTemplate(a.id)?.usage_count || 0;
          const bUsage = getUsageForTemplate(b.id)?.usage_count || 0;
          aValue = aUsage;
          bValue = bUsage;
          break;
        case "lastUsed":
          const aLastUsed = getUsageForTemplate(a.id)?.latest_sent_at || "";
          const bLastUsed = getUsageForTemplate(b.id)?.latest_sent_at || "";
          aValue = new Date(aLastUsed).getTime();
          bValue = new Date(bLastUsed).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-normal text-foreground">Templates</h1>
        <p className="text-muted-foreground text-lg font-light">
          Manage message templates for campaigns
        </p>
      </div>

      {error && (
        <div className="text-center py-4 text-destructive">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Templates</p>
            <p className="mt-1 text-2xl font-bold">{templates.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Active Templates</p>
            <p className="mt-1 text-2xl font-bold text-success">
              {templates.length}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Uses</p>
            <p className="mt-1 text-2xl font-bold">
              {templateUsage.reduce((acc, u) => acc + u.usage_count, 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && (
        <div className="glass-card rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="input-search pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <TemplatesTableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Template
                    {sortBy === "name" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("usage")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Used
                    {sortBy === "usage" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("lastUsed")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Last Used
                    {sortBy === "lastUsed" && (
                      sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => {
                const usage = getUsageForTemplate(template.id);
                return (
                  <TableRow key={template.id} className="table-row-hover border-border">
                    <TableCell>
                      <p className="font-medium text-foreground">{template.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {template.id}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-success" />
                        <span>WhatsApp</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase">
                        {template.language}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {usage ? usage.usage_count.toLocaleString() : 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {usage ? new Date(usage.latest_sent_at).toLocaleString('en-GB').replace(/\//g, '-') : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setSendDialogOpen(true);
                          }}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <TemplateViewDialog
        template={selectedTemplate}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <SendTemplateDialog
        templates={templates}
        initialTemplate={selectedTemplate}
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
      />
    </div>
  );
}
