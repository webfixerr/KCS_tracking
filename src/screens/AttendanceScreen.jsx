import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Button, Platform} from 'react-native';
import moment from 'moment';
import useAuthStore from '../store/auth.store';
import useAppStore from '../store/app.store';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import AttendanceCalendar from '../components/Attendance/AttendanceCalendar';
import AttendanceButton from '../components/Attendance/AttendanceButton';
import AttendCamera from '../components/Attendance/AttendCamera';

import {AttendanceService} from '../services/attendance.service';
import {LogOut} from 'lucide-react';

const AttendanceScreen = () => {
  const {user, logout} = useAuthStore();
  const {setError} = useAppStore();
  const [showCamera, setShowCamera] = useState(false);
  const [records, setRecords] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('IN');

  const requestPermissions = async () => {
    const cameraPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const result = await request(cameraPermission);

    return result === RESULTS.GRANTED;
  };

  const loadAttendanceData = async () => {
    try {
      const response = await AttendanceService.getAttendanceRecordsByEmployee(
        user?.id,
      );
      setRecords(response); // response is now an array of { attendance_date, status }
      updateCurrentStatus(response);
    } catch (error) {
      setError('Failed to load attendance records');
    }
  };

  const updateCurrentStatus = records => {
    const todayRecord = records.find(r =>
      moment(r.date).isSame(moment(), 'day'),
    );
    setCurrentStatus(todayRecord?.type === 'IN' ? 'OUT' : 'IN');
  };

  const handleAttendancePress = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Please enable camera and location permissions in app settings',
      );
      return;
    }

    if (currentStatus === 'OUT') {
      setShowCamera(false);
      await AttendanceService.markAttendance({
        employee: user.id,
        log_type: currentStatus,
      });
      setCurrentStatus('IN');
      //Mark out attenance
    } else {
      setShowCamera(true);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  return (
    <View style={styles.container}>
      {showCamera ? (
        <AttendCamera
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          setShowCamera={setShowCamera}
        />
      ) : (
        <>
          <Text style={styles.title}>{user?.username}Attendance</Text>

          <AttendanceCalendar
            records={records}
            selectedDate={moment().format('YYYY-MM-DD')}
          />

          <AttendanceButton
            status={currentStatus}
            onPress={handleAttendancePress}
          />

          <Button
            title="Logout"
            onPress={logout}
            color="#e74c3c"
            icon={<LogOut size={18} color="#e74c3c" />}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
  },
});

export default AttendanceScreen;
