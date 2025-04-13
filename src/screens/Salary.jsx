import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import SalaryService from '../services/salary.service';
import useAuthStore from '../store/auth.store';

const InfoRow = ({label, value, textColor = 'text-gray-700'}) => (
  <View className="flex-row justify-between mb-1">
    <Text className={`text-sm ${textColor}`}>{label}</Text>
    <Text className={`text-sm font-semibold ${textColor}`}>{value}</Text>
  </View>
);

const Salary = () => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useColorScheme(); // "light" or "dark"

  const {user} = useAuthStore();

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-gray-100';

  const fetchSalary = async () => {
    try {
      const response = await SalaryService.getSalary(user.id);
      setSalary(response?.data?.data?.[0] || null);
    } catch (error) {
      console.error('ERROR - ', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchSalary();
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSalary();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className={`${textSecondary} mt-2`}>Loading salary slip...</Text>
      </View>
    );
  }

  if (!salary) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500 text-lg">No salary slip found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 p-4 ${bgClass}`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Header */}
      <Text className={`text-xl font-bold mb-2 ${textPrimary}`}>
        Salary Slip - {salary?.employee_name}
      </Text>
      <Text className={`${textSecondary} mb-4`}>
        {salary?.designation} | {salary?.branch}
      </Text>

      {/* Period Info */}
      <View className="mb-4">
        <InfoRow
          label="Period"
          value={`${salary?.start_date} to ${salary?.end_date}`}
          textColor={textSecondary}
        />
        <InfoRow
          label="Posted on"
          value={salary?.posting_date}
          textColor={textSecondary}
        />
        <InfoRow
          label="Status"
          value={salary?.status}
          textColor={textSecondary}
        />
      </View>

      {/* Salary Summary */}
      <View className={`rounded-2xl p-4 mb-4 shadow-sm ${cardBg}`}>
        <InfoRow label="Gross Pay" value={`₹${salary?.gross_pay}`} />
        <InfoRow
          label="Deductions"
          value={`₹${salary?.total_deduction}`}
          textColor="text-red-500"
        />
        <InfoRow
          label="Net Pay"
          value={`₹${salary?.net_pay}`}
          textColor="text-green-500"
        />
        <Text className={`mt-2 text-xs italic ${textSecondary}`}>
          {salary?.total_in_words}
        </Text>
      </View>

      {/* Employee Details */}
      <View className="mb-4 space-y-1">
        <Text className={`text-base font-semibold mb-1 ${textPrimary}`}>
          Employee Info
        </Text>
        <InfoRow label="Employee ID" value={salary?.employee} />
        <InfoRow label="Department" value={salary?.department} />
        <InfoRow label="Company" value={salary?.company} />
        <InfoRow label="Salary Structure" value={salary?.salary_structure} />
      </View>

      {/* Working Summary */}
      <View className="mb-4 space-y-1">
        <Text className={`text-base font-semibold mb-1 ${textPrimary}`}>
          Working Summary
        </Text>
        <InfoRow
          label="Total Working Days"
          value={salary?.total_working_days}
        />
        <InfoRow label="Absent Days" value={salary?.absent_days} />
        <InfoRow label="Unmarked Days" value={salary?.unmarked_days} />
        <InfoRow label="Payment Days" value={salary?.payment_days} />
      </View>
    </ScrollView>
  );
};

export default Salary;
