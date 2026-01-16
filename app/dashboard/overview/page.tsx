"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  CreditCard,
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  UserPlus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getSystemHealthSummary,
  getUserStatistics,
} from "@/services/overview/overviewAnalytics";
import { viewProfile } from "@/services/auth/authentication";
import { Separator } from "@/components/ui/separator";

const DashboardPage = () => {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: isProfileError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: viewProfile,
  });

  const {
    data: systemData,
    isLoading: systemLoading,
    error: systemError,
  } = useQuery({
    queryKey: ["systemHealthSummary"],
    queryFn: getSystemHealthSummary,
  });

  const {
    data: userStatsData,
    isLoading: userStatsLoading,
    error: userStatsError,
  } = useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStatistics,
  });

  if (systemError || userStatsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
          <p className="text-[#333]/60">
            {systemError ? (systemError as Error).message : ""}
            {userStatsError ? (userStatsError as Error).message : ""}
          </p>
        </div>
      </div>
    );
  }

  const summaryData = systemData?.data;
  const userStats = userStatsData?.stats;

  const isLoading = systemLoading || userStatsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="mb-2">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </>
          ) : (
            <>
              <h2 className="text-[#333] text-[20px] font-medium capitalize">
                Welcome, {profileData?.user?.firstName}
              </h2>
              <p className="text-sm text-[#333]/70">
                Manage and monitor your system's performance and user activity
              </p>
            </>
          )}
        </div>
        <div className="text-sm text-[#333]/60">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">System</CardTitle>
            <Activity className="h-4 w-4 text-[#333]/60" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summaryData?.system?.totalUsers} Users
                </div>
                <p className="text-xs text-[#333]/60">
                  {summaryData?.system?.todaysNewUsers} new today
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#333]/60" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${summaryData?.revenue?.totalRevenue?.toLocaleString()}
                </div>
                <p className="text-xs text-[#333]/60">
                  {summaryData?.revenue?.totalUnits} units sold
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#333]/60" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summaryData?.performance?.successRate}%
                </div>
                <p className="text-xs text-[#333]/60">
                  Success rate
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <p className="text-sm text-[#333]/60">
            System overview for the current period
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Today's Revenue */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Today's Revenue</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  ${summaryData?.revenue?.todayRevenue?.toLocaleString()}
                </div>
              )}
            </div>

            {/* Weekly Revenue */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Weekly Revenue</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  ${summaryData?.revenue?.weeklyRevenue?.toLocaleString()}
                </div>
              )}
            </div>

            {/* Monthly Revenue */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Monthly Revenue</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  ${summaryData?.revenue?.monthlyRevenue?.toLocaleString()}
                </div>
              )}
            </div>

            {/* Yearly Revenue */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Yearly Revenue</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  ${summaryData?.revenue?.yearlyRevenue?.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Transactions
                </span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="font-semibold">
                    {summaryData?.system?.totalTransactions}
                  </span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Average Transaction Value
                </span>
                {isLoading ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <span className="font-semibold">
                    ${summaryData?.revenue?.avgTransactionValue}
                  </span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Units Sold</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="font-semibold">
                    {summaryData?.revenue?.totalUnits}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-10" />
                  ) : (
                    <span className="font-semibold">
                      {summaryData?.performance?.successRate}%
                    </span>
                  )}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  {!isLoading && (
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${summaryData?.performance?.successRate}%`,
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Failed Rate</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-10" />
                  ) : (
                    <span className="font-semibold">
                      {summaryData?.performance?.failedRate}%
                    </span>
                  )}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  {!isLoading && (
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${summaryData?.performance?.failedRate}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Statistics - Updated with new API */}
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Users */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gray-100 rounded">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium">Total Users</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {userStats?.totalUsers}
                </div>
              )}
            </div>

            {/* Active Users Last 24 Hours */}
            <div className="bg-green-50 p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium">Active Users</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {userStats?.activeUsersLast24Hours}
                </div>
              )}
            </div>

            <div className="bg-green-50 p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium">
                  Registered This Week
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {userStats?.registrations?.thisWeek}
                </div>
              )}
            </div>

            {/* Registrations This Month */}
            <div className="bg-blue-50 p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium">
                  Registered This Month
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {userStats?.registrations?.thisMonth}
                </div>
              )}
            </div>

            {/* Registrations This Year */}
            <div className="bg-purple-50 p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded">
                  <UserPlus className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium">
                  Registered This Year
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {userStats?.registrations?.thisYear}
                </div>
              )}
            </div>
          </div>

          {/*           
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">
              Registration Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 mx-auto" />
                  ) : (
                    userStats?.registrations?.today
                  )}
                </div>
                <div className="text-sm text-gray-600">Today</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 mx-auto" />
                  ) : (
                    userStats?.registrations?.thisWeek
                  )}
                </div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 mx-auto" />
                  ) : (
                    userStats?.registrations?.thisMonth
                  )}
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 mx-auto" />
                  ) : (
                    userStats?.registrations?.thisYear
                  )}
                </div>
                <div className="text-sm text-gray-600">This Year</div>
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
