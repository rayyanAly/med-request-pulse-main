import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Plus, Pencil, Trash2, Loader2, User as UserIcon, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  PartnerUser,
  fetchPartnerUsers,
  createPartnerUser,
  updatePartnerUser,
  deletePartnerUser,
} from "@/api/partnerUsersApi";

export default function UsersPage() {
  const { user: loginUser } = useSelector((state: RootState) => state.login);
  
  // Check if current user is admin or Super Admin from login user data
  // Only admin can manage users
  const isAdmin = loginUser?.user_type === "admin" || loginUser?.user_type === "Super Admin";
  
  const [users, setUsers] = useState<PartnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<PartnerUser | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: PartnerUser | null }>({
    open: false,
    user: null,
  });

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    position: 3,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchPartnerUsers();
      if (result.success === 1 && result.data) {
        setUsers(result.data);
      } else {
        toast.error(result.error || "Failed to load users");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: PartnerUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name,
        email: user.email || "",
        phone: user.phone,
        username: user.user_name,
        password: "",
        position: user.user_type === "admin" ? 1 : user.user_type === "manager" ? 2 : 3,
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        position: 3,
      });
    }
    setShowDialog(true);
  };

  const handleSave = async () => {
    // Validation - full_name required for both create and edit
    if (!formData.full_name || formData.full_name.length < 3) {
      toast.error("Full name is required (min 3 characters)");
      return;
    }
    // Email required for both modes
    if (!formData.email || formData.email.length < 3) {
      toast.error("Email is required");
      return;
    }
    // Phone required for both modes
    if (!formData.phone || formData.phone.length < 8) {
      toast.error("Phone number is required (min 8 digits)");
      return;
    }

    if (!editingUser) {
      // Creating new user - use email as username (login works with both)
      if (!formData.password || formData.password.length < 3) {
        toast.error("Password is required (min 3 characters)");
        return;
      }
      // Check for duplicate email
      const existingUser = users.find(u => 
        u.email && u.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (existingUser) {
        toast.error("A user with this email already exists");
        return;
      }
    }

    setSaving(true);
    try {
      let result;
      if (editingUser) {
        // When editing, update full_name, email, phone, position, username
        result = await updatePartnerUser({
          id: editingUser.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          position: formData.position,
          password: formData.password || undefined,
        });
      } else {
        // Creating new user - use email as username
        result = await createPartnerUser({
          ...formData,
          username: formData.email, // Use email as username
        });
      }

      if (result.success === 1) {
        toast.success(editingUser ? "User updated successfully" : "User created successfully");
        setShowDialog(false);
        loadUsers();
      } else {
        toast.error(result.error || "Failed to save user");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.user) return;
    
    // Prevent deleting yourself
    if (loginUser?.user_name === deleteDialog.user.user_name) {
      toast.error("You cannot delete your own account");
      return;
    }

    setSaving(true);
    try {
      const result = await deletePartnerUser(deleteDialog.user.id);
      if (result.success === 1) {
        toast.success("User deleted successfully");
        setDeleteDialog({ open: false, user: null });
        loadUsers();
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setSaving(false);
    }
  };

  const getPositionLabel = (userType: string) => {
    switch (userType) {
      case "1":
      case "admin":
        return "Admin";
      case "2":
      case "manager":
        return "Manager";
      case "3":
      case "user":
        return "User";
      default:
        return "User";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage partner user accounts and permissions
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2" disabled={!isAdmin}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found. Add your first user to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.user_name}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getPositionLabel(String(user.user_type))}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeleteDialog({ open: true, user })}
                            disabled={loginUser?.user_name === user.user_name}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9]*"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="Enter phone number"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={String(formData.position)}
                onValueChange={(value) => setFormData({ ...formData, position: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Manager</SelectItem>
                  <SelectItem value="3">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!editingUser && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{deleteDialog.user?.full_name}</span>? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, user: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
