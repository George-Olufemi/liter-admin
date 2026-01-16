"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getUserLeaderboard,
  getTopPerformingUsers,
  getTopMeters,
} from "@/services/leaderboard/leaderboardAnalysis";
import {
  Trophy,
  Award,
  TrendingUp,
  Users,
  Zap,
  Activity,
  BarChart3,
  DollarSign,
  Package,
  CreditCard,
  User,
  Battery,
  Medal,
  Crown,
  Star,
  Target,
  TrendingDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const LeaderboardPage = () => {
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery({
    queryKey: ["userLeaderboard"],
    queryFn: getUserLeaderboard,
  });

  const {
    data: topUsersData,
    isLoading: topUsersLoading,
    error: topUsersError,
  } = useQuery({
    queryKey: ["topPerformingUsers"],
    queryFn: getTopPerformingUsers,
  });

  const {
    data: topMetersData,
    isLoading: topMetersLoading,
    error: topMetersError,
  } = useQuery({
    queryKey: ["topMeters"],
    queryFn: getTopMeters,
  });

  const isLoading = leaderboardLoading || topUsersLoading || topMetersLoading;
  const error = leaderboardError || topUsersError || topMetersError;

  const leaderboards = leaderboardData?.leaderboards;
  const topUsers = topUsersData?.data;
  const topMeters = topMetersData?.data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Leaderboard
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading the leaderboard data. Please try again
              later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="">
          <>
            <h2 className="text-[#333] text-[20px] font-medium capitalize">
              Performance Leaderboard
            </h2>
            <p className="text-sm text-[#333]/70">
              Track top performers, users, and meters in your system
            </p>
          </>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-amber-50">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800 mb-3">
                  Top Spender
                </p>
                {isLoading ? (
                  <Skeleton className="h-7 w-40 mb-1" />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900">
                    {leaderboards?.topByAmount?.[0]?.fullName || "No data"}
                  </h3>
                )}
                {!isLoading && leaderboards?.topByAmount?.[0] && (
                  <p className="text-sm text-amber-700">
                    {formatCurrency(leaderboards.topByAmount[0].totalAmount)}
                  </p>
                )}
              </div>

              <Image src="/rank.svg" alt="Rank i CON" width={40} height={40} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 mb-3">
                  Most Transactions
                </p>
                {isLoading ? (
                  <Skeleton className="h-7 w-40 mb-1" />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900">
                    {leaderboards?.topByTransactions?.[0]?.fullName ||
                      "No data"}
                  </h3>
                )}
                {!isLoading && leaderboards?.topByTransactions?.[0] && (
                  <p className="text-sm text-blue-700">
                    {leaderboards.topByTransactions[0].transactionCount}{" "}
                    transactions
                  </p>
                )}
              </div>

              <Image src="/trabs.svg" alt="Rank i CON" width={40} height={40} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-800 mb-3">
                  Top Meter
                </p>
                {isLoading ? (
                  <Skeleton className="h-7 w-40 mb-1" />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900">
                    {topMeters?.[0]?._id || "No data"}
                  </h3>
                )}
                {!isLoading && topMeters?.[0] && (
                  <p className="text-sm text-emerald-700">
                    {formatCurrency(topMeters[0].totalAmount)} revenue
                  </p>
                )}
              </div>
              <Image src="/meter.svg" alt="Rank i CON" width={40} height={40} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-12">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Rankings
          </TabsTrigger>
          <TabsTrigger
            value="top-performers"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Top Performers
          </TabsTrigger>
          <TabsTrigger value="meters" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Meter Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Top by Amount Spent
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Revenue
                  </Badge>
                </div>
                <CardDescription>
                  Users ranked by total amount spent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-7 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboards?.topByAmount?.map(
                      (user: any, index: number) => (
                        <div
                          key={user.userId}
                          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                              {index === 0 ? (
                                <Crown className="h-5 w-5" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            {index === 0 && (
                              <Star
                                className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1"
                                fill="currentColor"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {user.fullName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {formatCurrency(user.totalAmount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.transactionCount} trans
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Top by Units Purchased
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Consumption
                  </Badge>
                </div>
                <CardDescription>
                  Users ranked by total units purchased
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-7 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboards?.topByUnits?.map(
                      (user: any, index: number) => (
                        <div
                          key={user.userId}
                          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                              {index === 0 ? (
                                <Medal className="h-5 w-5" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            {index === 0 && (
                              <Star
                                className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1"
                                fill="currentColor"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {user.fullName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {user.totalUnits.toLocaleString()} units
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(user.totalAmount)}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Top by Transactions
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                  >
                    Activity
                  </Badge>
                </div>
                <CardDescription>
                  Most active users by transaction count
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-7 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboards?.topByTransactions?.map(
                      (user: any, index: number) => (
                        <div
                          key={user.userId}
                          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                              {index === 0 ? (
                                <Award className="h-5 w-5" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            {index === 0 && (
                              <Star
                                className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1"
                                fill="currentColor"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {user.fullName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {user.transactionCount} transactions
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(user.totalAmount)}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top-performers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Overall Top Performers
              </CardTitle>
              <CardDescription>
                Comprehensive ranking of best-performing users across all
                metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <div className="space-y-2 text-right">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : topUsers && topUsers.length > 0 ? (
                <div className="space-y-3">
                  {topUsers.map((user: any, index: number) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-linear-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                          {index === 0 ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 truncate">
                            {user.fullName}
                          </h4>
                          {index === 0 && (
                            <Badge className="bg-linear-to-r from-yellow-500 to-orange-500 text-white">
                              Top Performer
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(user.totalAmount)}
                          </div>
                          <div className="text-xs text-gray-500">Spent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {user.totalUnits.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Units</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {user.transactionCount}
                          </div>
                          <div className="text-xs text-gray-500">
                            Transactions
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Performance Data
                  </h3>
                  <p className="text-gray-600">
                    User performance data will appear here once available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Top Performing Meters
              </CardTitle>
              <CardDescription>
                Meters ranked by revenue generation and transaction activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="space-y-2 text-right">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : topMeters && topMeters.length > 0 ? (
                <div className="space-y-4">
                  {topMeters.map((meter: any, index: number) => (
                    <div
                      key={meter._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-lg bg-linear-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          {index < 3 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {index + 1}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900">
                              Meter ID: {meter._id}
                            </h4>
                            {index === 0 && (
                              <Badge className="bg-linear-to-r from-emerald-500 to-green-600 text-white">
                                Top Meter
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {meter.transactionCount} transactions •{" "}
                            {meter.totalUnits.toLocaleString()} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(meter.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Revenue
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Battery className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Meter Data
                  </h3>
                  <p className="text-gray-600">
                    Meter performance data will appear here once available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {!isLoading && topMeters && topMeters.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Total Meters Tracked
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {topMeters.length}
                      </h3>
                    </div>
                    <Target className="h-10 w-10 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Total Revenue
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {formatCurrency(
                          topMeters.reduce(
                            (sum: number, meter: any) =>
                              sum + meter.totalAmount,
                            0
                          )
                        )}
                      </h3>
                    </div>
                    <BarChart3 className="h-10 w-10 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Average per Meter
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {formatCurrency(
                          topMeters.reduce(
                            (sum: number, meter: any) =>
                              sum + meter.totalAmount,
                            0
                          ) / topMeters.length
                        )}
                      </h3>
                    </div>
                    <Activity className="h-10 w-10 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default LeaderboardPage;
