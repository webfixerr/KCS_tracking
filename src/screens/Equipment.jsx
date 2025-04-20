import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
  Alert,
  TouchableOpacity,
} from 'react-native';
import EquipmentService from '../services/equipment.service';
import useAuthStore from '../store/auth.store';
// import EquipmentRequestModal from '../components/Equipment/EquipmentRequestModal';

const EquipmentCard = ({item, isDark, employeeId, onRefresh}) => {
  const cardBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';

  const handleRequest = async () => {
    try {
      await EquipmentService.requestEquipment({
        employee: employeeId,
        equipment: item.equipment,
      });
      Alert.alert('Request sent successfully');
      onRefresh?.();
    } catch (err) {
      Alert.alert('Failed to send request');
      console.error(err);
    }
  };

  const isAllocated = item?.is_allocated === true;
  const isUnallocated = item?.is_allocated === false;

  return (
    <View className={`rounded-2xl mb-4 p-4 shadow-sm ${cardBg}`}>
      <Text className={`text-lg font-bold mb-1 ${textPrimary}`}>
        {item.equipment}
      </Text>

      <View className="mt-2 space-y-1">
        {isAllocated ? (
          <>
            <Text className="text-green-500 text-sm">Status: Allocated</Text>
            <Text className={`text-sm ${textSecondary}`}>
              Allocation Date: {item.allocation_date || 'N/A'}
            </Text>
          </>
        ) : (
          <View className="flex flex-row items-center justify-between">
            <Text className="text-red-500 text-sm">Status: Not Allocated</Text>
            <TouchableOpacity
              onPress={handleRequest}
              className="mt-2 py-1 px-3 bg-blue-600 rounded-xl self-start">
              <Text className="text-white text-sm font-medium">Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const Equipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const theme = useColorScheme();
  const {user} = useAuthStore();

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';

  const fetchEquipment = async () => {
    try {
      const response = await EquipmentService.getEquipment(user.id);
      setEquipmentList(response?.data?.message || []);
    } catch (error) {
      console.error('ERROR - ', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchEquipment();
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEquipment();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className={`${textSecondary} mt-2`}>
          Loading equipment info...
        </Text>
      </View>
    );
  }

  if (!equipmentList.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500 text-lg">No equipment found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 p-4 ${bgClass}`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text className={`text-xl font-bold mb-4 ${textPrimary}`}>
        Assigned Equipment
      </Text>

      {equipmentList.map((item, index) => (
        <EquipmentCard
          key={index}
          item={item}
          isDark={isDark}
          employeeId={user.id}
          onRefresh={fetchEquipment}
        />
      ))}
    </ScrollView>
  );
};

export default Equipment;

{
  /* <EquipmentRequestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        equipmentList={equipmentList}
      />{' '}
      <View className="mt-6 items-center">
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-blue-600 underline font-semibold">Report</Text>
        </TouchableOpacity>
      </View>
    </> */
}
