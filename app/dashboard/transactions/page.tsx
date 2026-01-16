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
  getUserTransactions,
  viewTransactionbyId,
  verifyTokenStatus,
} from "@/services/transactions/transaction";
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
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Download,
  Filter,
  Search,
  User,
  CreditCard,
  DollarSign,
  Calendar,
  Hash,
  Shield,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const TransactionsPage = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch transactions
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userTransactions"],
    queryFn: getUserTransactions,
  });

  const transactions = transactionsData?.data || [];
  const totalTransactions = transactionsData?.totalTransactions || 0;
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  // Handle view transaction details
  const handleViewDetails = async (transactionId: string) => {
    try {
      const response = await viewTransactionbyId(transactionId);
      setSelectedTransaction(response.data || response);
      setViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to load transaction details");
    }
  };

  // Handle verify token status
  const handleVerifyToken = async (transactionId: string) => {
    setSelectedTransaction({ _id: transactionId });
    setVerifyModalOpen(true);
  };

  const executeVerifyToken = async () => {
    if (!selectedTransaction?._id) return;

    setIsVerifying(true);
    try {
      const response = await verifyTokenStatus(selectedTransaction._id);
      toast.success("Token verified successfully");
      setSelectedTransaction(response.data || response);
      setVerifyModalOpen(false);
      setViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to verify token status");
    } finally {
      setIsVerifying(false);
    }
  };
  // Update both badge components to match your Badge component variant names

  // Status badge component - FIXED
  const StatusBadge = ({ status }: { status: string }) => {
    const statusString = status?.toString().toLowerCase() || "unknown";

    const statusConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
        label: string;
      }
    > = {
      completed: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        label: "Completed",
      },
      success: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        label: "Success",
      },
      pending: {
        variant: "secondary",
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: "Pending",
      },
      failed: {
        variant: "destructive",
        icon: <XCircle className="h-3 w-3 mr-1" />,
        label: "Failed",
      },
      processing: {
        variant: "outline",
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: "Processing",
      },
      unknown: {
        variant: "outline",
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
        label: "Unknown",
      },
    };

    const config = statusConfig[statusString] || {
      variant: "outline" as const,
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      label: statusString.charAt(0).toUpperCase() + statusString.slice(1),
    };

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Type badge component - FIXED
  const TypeBadge = ({ type }: { type: string }) => {
    const typeString = type?.toString().toLowerCase() || "unknown";

    const typeConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      debit: {
        variant: "destructive", // This should work with your component
        label: "Debit",
      },
      credit: {
        variant: "default", // This should work with your component
        label: "Credit",
      },
      transfer: {
        variant: "secondary", // This should work with your component
        label: "Transfer",
      },
      funding: {
        variant: "outline",
        label: "Funding",
      },
      unknown: {
        variant: "outline",
        label: "Unknown",
      },
    };

    const config = typeConfig[typeString] || {
      variant: "outline" as const,
      label: typeString.charAt(0).toUpperCase() + typeString.slice(1),
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

  // Pagination
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Transactions
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading transactions. Please try again later.
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
          <div>
            <h2 className="text-[#333] text-[20px] font-medium capitalize">
              View Transactions
            </h2>
            <p className="text-sm text-[#333]/70">
              View and manage all user transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Transactions
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {totalTransactions}
                  </h3>
                )}
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Amount
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      transactions.reduce(
                        (sum: number, t: any) => sum + t.amount,
                        0
                      )
                    )}
                  </h3>
                )}
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {
                      transactions.filter((t: any) => t.status === "completed")
                        .length
                    }
                  </h3>
                )}
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Unique Users
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {new Set(transactions.map((t: any) => t.userId?._id)).size}
                  </h3>
                )}
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Showing {paginatedTransactions.length} of {totalTransactions}{" "}
            transactions
          </CardDescription>
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions by reference, user email, or amount..."
                className="pl-9 py-5"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Status
              </Button>
              <Button variant="outline" size="sm">
                All Types
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <CreditCard className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Transactions Found
                      </h3>
                      <p className="text-gray-600">
                        Transactions will appear here once available
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction: any) => (
                    <TableRow
                      key={transaction._id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="font-mono text-sm">
                            {transaction.reference}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {transaction.userId?.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.userId?.phoneNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={transaction.type} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(transaction.createdAt)}
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
                              onClick={() => handleViewDetails(transaction._id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleVerifyToken(transaction._id)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Verify Token Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                    }
                    if (pageNum > totalPages) return null;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Transaction Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Header */}
              <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      Reference: {selectedTransaction.reference}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <TypeBadge type={selectedTransaction.type} />
                      <StatusBadge status={selectedTransaction.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(selectedTransaction.amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Transaction Amount
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="font-medium">
                        {selectedTransaction.userId?.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Phone Number
                      </Label>
                      <p className="font-medium">
                        {selectedTransaction.userId?.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Address</Label>
                      <p className="font-medium">
                        {selectedTransaction.userId?.address || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">User ID</Label>
                      <p className="font-mono text-sm">
                        {selectedTransaction.userId?._id}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Transaction Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Transaction ID
                      </Label>
                      <p className="font-mono text-sm">
                        {selectedTransaction._id}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Description
                      </Label>
                      <p className="font-medium">
                        {selectedTransaction.description}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Created Date
                      </Label>
                      <p className="font-medium">
                        {formatDate(selectedTransaction.createdAt)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Updated Date
                      </Label>
                      <p className="font-medium">
                        {formatDate(selectedTransaction.updatedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Token Information (if available) */}
              {selectedTransaction.tokenHex && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Token Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">
                          Token (Hex)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={selectedTransaction.tokenHex}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedTransaction.tokenHex
                              );
                              toast.success("Token copied to clipboard");
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">
                          Token (Decimal)
                        </Label>
                        <Input
                          value={selectedTransaction.tokenDec}
                          readOnly
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">
                          Meter PAN
                        </Label>
                        <p className="font-medium">
                          {selectedTransaction.meterPAN}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Units</Label>
                        <p className="font-medium">
                          {selectedTransaction.unitsActual}{" "}
                          {selectedTransaction.unitName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">
                          Vend Time
                        </Label>
                        <p className="font-medium">
                          {selectedTransaction.vendTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Token Status Modal */}
      <AlertDialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verify Token Status
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will verify the token status for the selected transaction.
              The transaction ID is:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-xs text-gray-500 mb-2 block">
                Transaction ID
              </Label>
              <Input
                value={selectedTransaction?._id || ""}
                readOnly
                className="font-mono bg-white"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              <span>
                Token verification may take a few seconds to complete.
              </span>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isVerifying}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeVerifyToken}
              disabled={isVerifying}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Token
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionsPage;
