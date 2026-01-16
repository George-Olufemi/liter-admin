"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { viewaUserTrasactionAll } from "@/services/users/userManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const UserTransactionsPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch user transactions
  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userTransactions", id],
    queryFn: () => viewaUserTrasactionAll(id),
    enabled: !!id,
  });

  const user = transactionsData?.user;
  const transactions = transactionsData?.data || [];
  const totalTransactions = transactionsData?.totalTransactions || 0;
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  // Paginated transactions
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
        label: string;
      }
    > = {
      successful: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        label: "Successful",
      },
      completed: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        label: "Completed",
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
    };

    const config = statusConfig[status?.toLowerCase()] || {
      variant: "outline" as const,
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      label: status || "Unknown",
    };

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className=" text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Transactions
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading user transactions.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              className="rounded-full h-10 w-10 bg-[#6AD754] shadow-none"
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-10 w-10 text-[#213B66]" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.fullName} Transactions
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
          </div>
        </div>
      </div>

      <Card className="">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                {isLoading ? (
                  <Skeleton className="h-12 w-12 rounded-full" />
                ) : (
                  user?.fullName?.charAt(0) ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {isLoading ? (
                    <Skeleton className="h-6 w-40" />
                  ) : (
                    user?.fullName || user?.email || "Unknown User"
                  )}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      user?.email || "No email available"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        (sum: number, t: any) => sum + (t.amount || 0),
                        0
                      )
                    )}
                  </h3>
                )}
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Transactions
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <div className="text-2xl font-bold">{totalTransactions}</div>
                )}
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Successful Transactions
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">
                    {
                      transactions.filter(
                        (t: any) =>
                          t.status?.toLowerCase() === "successful" ||
                          t.status?.toLowerCase() === "completed"
                      ).length
                    }
                  </h3>
                )}
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Last Transaction
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : transactions.length > 0 ? (
                  <h3 className="text-lg font-bold text-gray-900">
                    {formatDate(transactions[0].createdAt)}
                  </h3>
                ) : (
                  <h3 className="text-lg font-bold text-gray-900">
                    No transactions
                  </h3>
                )}
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Showing {paginatedTransactions.length} of {totalTransactions}{" "}
            transactions
          </CardDescription>

          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mt-2">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9 py-5"
                />
              </div>
            </div>
            {/* <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Token Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Unit(s) Bought</TableHead>
                  <TableHead>Meter Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
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
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 w-full">
                      <div className="flex items-center justify-center mb-4 w-full">
                        {/* <CreditCard className="h-8 w-8 text-gray-400" /> */}
                        <Image src="/emptystate.svg" width={150} height={150} alt="Empty state" />
                        
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Transactions Found
                      </h3>
                      <p className="text-gray-600">
                        This user hasn't made any transactions yet
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction: any) => (
                    <TableRow
                      key={transaction._id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium py-3.5">
                        {transaction._id}
                      </TableCell>
                      <TableCell className="">
                        {transaction.reference}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.type || "Not Applicable"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {transaction.unitsActual}{" "}
                        {transaction.unitName || "Not Applicable"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.meterNumber || "Not Applicable"}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(transaction.createdAt)}
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
    </div>
  );
};

export default UserTransactionsPage;
