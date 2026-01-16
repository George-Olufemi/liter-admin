"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  getUserByEmail,
  viewaUserTrasactionAll,
  blockUser,
} from "@/services/users/userManagement";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreVertical,
  Eye,
  CreditCard,
  Shield,
  ShieldAlert,
  User,
  Wallet,
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  BadgeCheck,
  Ban,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

const UsersPage = () => {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockAction, setBlockAction] = useState<"block" | "unblock">("block");
  const [isBlocking, setIsBlocking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const users = usersData?.data || [];
  const totalUsers = usersData?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Filter users based on search term
  const filteredUsers = users.filter((user: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  // Paginated users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle view user details
  const handleViewDetails = async (email: string) => {
    try {
      const response = await getUserByEmail(email);
      setSelectedUser(response?.data || response);
      setViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to load user details");
    }
  };

  const handleViewTransactions = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  // Handle block/unblock user
  const handleBlockUser = (user: any, action: "block" | "unblock") => {
    setSelectedUser(user);
    setBlockAction(action);
    setBlockModalOpen(true);
  };

  const executeBlockUser = async () => {
    if (!selectedUser?.email) return;

    setIsBlocking(true);
    try {
      await blockUser(selectedUser.email);
      toast.success(
        `User ${blockAction === "block" ? "blocked" : "unblocked"} successfully`
      );
      refetch();
      // setBlockModalOpen(false);
    } catch (error) {
      toast.error(`Failed to ${blockAction} user`);
    } finally {
      setBlockModalOpen(false);
      setIsBlocking(false);
    }
  };

  // Status badge component
  const StatusBadge = ({
    isBlocked,
    isVerified,
  }: {
    isBlocked: boolean;
    isVerified: boolean;
  }) => {
    if (isBlocked) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Ban className="h-3 w-3" />
          Blocked
        </Badge>
      );
    }

    if (isVerified) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <BadgeCheck className="h-3 w-3" />
          Active
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  // Role badge component
  const RoleBadge = ({ role }: { role: string }) => {
    const roleConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      superadmin: {
        variant: "destructive",
        label: "Super Admin",
      },
      admin: {
        variant: "default",
        label: "Admin",
      },
      user: {
        variant: "secondary",
        label: "User",
      },
    };

    const config = roleConfig[role?.toLowerCase()] || {
      variant: "outline" as const,
      label: role?.charAt(0).toUpperCase() + role?.slice(1) || "Unknown",
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return "Today";
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      } else {
        return format(date, "MMM dd, yyyy");
      }
    } catch {
      return "Unknown";
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className=" text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Users
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading users. Please try again later.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="">
            <h2 className="text-[#333] text-[20px] font-medium capitalize">
              User Management
            </h2>
            <p className="text-sm text-[#333]/70">
              Manage and monitor all platform users
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-[#213B66] text-white">
              <Download className="h-4 w-4 text-white hover:text-[#213B66]" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Users
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {totalUsers}
                  </h3>
                )}
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Blocked Users
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {users.filter((u: any) => u.isBlocked).length}
                  </h3>
                )}
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Admins</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {
                      users.filter((u: any) =>
                        ["admin", "superadmin"].includes(u.role)
                      ).length
                    }
                  </h3>
                )}
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-5">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, phone, or role..."
                  className="pl-9 py-5"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Wallet Balance</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm
                          ? "No matching users found"
                          : "No users found"}
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm
                          ? "Try adjusting your search term"
                          : "Users will appear here once registered"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user: any) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                            {user.firstName?.charAt(0) || user.email}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="">
                        {user.phoneNumber || "N/A"}
                      </TableCell>
                      <TableCell className="">
                        {formatCurrency(user.wallet || 0)}
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          isBlocked={user.isBlocked}
                          isVerified={user.isVerified}
                        />
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.lastLogin
                          ? formatRelativeTime(user.lastLogin)
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(user.email)}
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewTransactions(user._id)}
                            >
                              <CreditCard className="h-4 w-4" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.isBlocked ? (
                              <DropdownMenuItem
                                onClick={() => handleBlockUser(user, "unblock")}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Unblock User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleBlockUser(user, "block")}
                                className="text-red-600"
                              >
                                <Ban className="h-4 w-4 text-red-600" />
                                Block User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Page {currentPage} of{" "}
                {Math.ceil(filteredUsers.length / itemsPerPage)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      Math.ceil(filteredUsers.length / itemsPerPage)
                    ),
                  },
                  (_, i) => {
                    let pageNum = i + 1;
                    if (Math.ceil(filteredUsers.length / itemsPerPage) > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 2 + i;
                      }
                      if (
                        pageNum > Math.ceil(filteredUsers.length / itemsPerPage)
                      )
                        return null;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredUsers.length / itemsPerPage)
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredUsers.length / itemsPerPage)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedUser?.fullName}'s Information
            </DialogTitle>
            <DialogDescription>
              Complete information about {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedUser.fullName?.charAt(0) ||
                        selectedUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">
                        {selectedUser.fullName || selectedUser.email}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge
                          isBlocked={
                            selectedUser.status === "Blocked" ||
                            selectedUser.isBlocked
                          }
                          isVerified={selectedUser.isVerified !== false}
                        />
                        <RoleBadge role={selectedUser.role} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(
                        selectedUser.balance || selectedUser.wallet || 0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Wallet Balance</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Email Address
                      </Label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Phone Number
                      </Label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {selectedUser.phone ||
                            selectedUser.phoneNumber ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Address</Label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {selectedUser.address || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Location</Label>
                      <p className="font-medium">
                        {selectedUser.city || "N/A"},{" "}
                        {selectedUser.state || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Account Name
                      </Label>
                      <p className="font-medium">
                        {selectedUser.accountName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Account Number
                      </Label>
                      <p className="font-medium">
                        {selectedUser.accountNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Bank Name</Label>
                      <p className="font-medium">
                        {selectedUser.bankName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Customer Code
                      </Label>
                      <p className="font-mono text-sm">
                        {selectedUser.customerCode || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Information */}
              <Card>
                <CardHeader className="">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Activity Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Joined Date
                      </Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">
                          {formatDate(
                            selectedUser.signUpOn || selectedUser.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Last Login
                      </Label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">
                          {selectedUser.lastLogin
                            ? formatRelativeTime(selectedUser.lastLogin)
                            : "Never"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Last Active
                      </Label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">
                          {selectedUser.lastActiveAt
                            ? formatRelativeTime(selectedUser.lastActiveAt)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={blockModalOpen} onOpenChange={setBlockModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {blockAction === "block" ? (
                <>
                  <Ban className="h-5 w-5 text-red-600" />
                  Block User
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Unblock User
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {blockAction === "block" ? (
                <>
                  Are you sure you want to block{" "}
                  <strong>{selectedUser?.email}</strong>? This will prevent them
                  from accessing the platform.
                </>
              ) : (
                <>
                  Are you sure you want to unblock{" "}
                  <strong>{selectedUser?.email}</strong>? This will restore
                  their access to the platform.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-gray-50/90 border border-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {selectedUser?.firstName?.charAt(0) ||
                  selectedUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold">
                  {selectedUser?.firstName && selectedUser?.lastName
                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                    : selectedUser?.email}
                </h4>
                <p className="text-sm text-gray-500">{selectedUser?.email}</p>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBlocking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBlockUser}
              disabled={isBlocking}
              className={
                blockAction === "block"
                  ? "bg-red-600 hover:bg-red-700 text-white hover:text-white"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {isBlocking ? (
                <>
                  <Spinner />
                </>
              ) : blockAction === "block" ? (
                <>
                  <Ban className="h-4 w-4" />
                  Block User
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Unblock User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
