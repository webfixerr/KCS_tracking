import React, {useRef, useState, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import moment from 'moment';
import useAuthStore from '../../store/auth.store';
import useSelectStore from '../../store/select.store';
import {Picker} from '@react-native-picker/picker';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  UIManager,
  LayoutAnimation,
  Platform,
  StyleSheet,
} from 'react-native';
import AttendanceService from '../../services/attendance.service';
import api from '../../services/api';
import {BRANCH, SHIFT_TYPE} from '../../constants/api';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AttendCamera = ({currentStatus, setShowCamera, setCurrentStatus}) => {
  const [activeTab, setActiveTab] = useState('camera');
  let cameraRef = useRef(null);
  const faceTimeout = useRef(null);
  const {user} = useAuthStore();
  const {
    branch,
    shift_type,
    setBranch,
    setShiftType,
    fetchBranchOptions,
    fetchShiftTypeOptions,
  } = useSelectStore();

  const [facesDetected, setFacesDetected] = useState([]);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const handleFacesDetected = ({faces}) => {
    try {
      if (faceTimeout.current) {
        clearTimeout(faceTimeout.current);
      }
      setFacesDetected(faces);
      faceTimeout.current = setTimeout(() => {
        setFacesDetected([]);
      }, 500);
    } catch (error) {
      console.error('Face detection error:', error);
    }
  };

  const takePicture = async () => {
    if (!capturedPhoto) return;

    const attendanceData = {
      employee: user.id,
      log_type: currentStatus,
      date: moment().toISOString(),
      base64_image: capturedPhoto.base64,
      filename: `${user.id}.jpg`,
      branch,
      // work_location,
      shift_type,
    };

    try {
      await AttendanceService.markAttendance(attendanceData);
      Alert.alert('Success', 'Your attendance has been marked!');
      setPhotoTaken(false);
      setCapturedPhoto(null);
      setShowCamera(false);
      setCurrentStatus('OUT');
    } catch (error) {
      console.error('Attendance error:', error);
      Alert.alert('Error', 'Failed to mark attendance. Try again.');
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    if (facesDetected.length === 0) {
      Alert.alert(
        'No Face Detected',
        'Please position your face in front of the camera.',
      );
      return;
    }

    if (facesDetected.length > 1) {
      Alert.alert(
        'Multiple Faces Detected',
        'Only one person is allowed in the frame.',
      );
      return;
    }

    try {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedPhoto(data); // Store photo for later use
      setPhotoTaken(true);
    } catch (error) {
      console.error('Capture error:', error);
    }
  };

  const isFormComplete =
    branch &&
    shift_type &&
    // work_location &&
    facesDetected.length === 1 &&
    photoTaken;

  useEffect(() => {
    return () => {
      if (faceTimeout.current) {
        clearTimeout(faceTimeout.current);
      }
    };
  }, []);

  // Simulate fetching data for later
  useEffect(() => {
    fetchBranchOptions();
    fetchShiftTypeOptions();
  }, []);

  // <Text style={styles.label}>Work Location</Text>
  // <Picker
  //   selectedValue={work_location}
  //   onValueChange={setWorkLocation}
  //   style={styles.picker}>
  //   <Picker.Item label="Select Location" value="" />
  //   <Picker.Item label="Lucknow" value="lucknow" />
  //   <Picker.Item label="Noida" value="noida" />
  //   <Picker.Item label="Bangalore" value="bangalore" />
  // </Picker>

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'camera' && styles.activeTab]}
          onPress={() => setActiveTab('camera')}>
          <Text
            style={
              activeTab === 'camera' ? styles.activeText : styles.inactiveText
            }>
            Camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'form' && styles.activeTab]}
          onPress={() => setActiveTab('form')}>
          <Text
            style={
              activeTab === 'form' ? styles.activeText : styles.inactiveText
            }>
            Form
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'camera' ? (
          <View style={styles.cameraContainer}>
            <RNCamera
              ref={cameraRef}
              style={styles.camera}
              type={RNCamera.Constants.Type.front}
              captureAudio={false}
              onFacesDetected={handleFacesDetected}
              faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
              faceDetectionClassifications={
                RNCamera.Constants.FaceDetection.Classifications.all
              }
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
            />

            <View style={styles.faceOverlay}>
              <View
                style={[
                  styles.faceBox,
                  {
                    borderColor:
                      facesDetected.length === 1
                        ? 'green'
                        : facesDetected.length > 1
                        ? 'red'
                        : 'gray',
                  },
                ]}
              />
              <Text style={styles.faceText}>
                {facesDetected.length === 1
                  ? 'Face detected'
                  : facesDetected.length > 1
                  ? 'Multiple faces detected'
                  : 'No face detected'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleCapture}
              style={[
                styles.captureButton,
                {
                  backgroundColor:
                    facesDetected.length === 1
                      ? 'green'
                      : facesDetected.length > 1
                      ? 'red'
                      : 'gray',
                },
              ]}>
              <Text style={styles.captureButtonText}>📷 Capture Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.formContainer}>
            <Text style={styles.label}>Branch</Text>
            <Picker
              selectedValue={branch}
              onValueChange={setBranch}
              style={styles.picker}>
              <Picker.Item label="Select Branch" value="" />
              {useSelectStore.getState().branchOptions.map((option, idx) => (
                <Picker.Item
                  key={idx}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>

            <Text style={styles.label}>Shift Type</Text>
            <Picker
              selectedValue={shift_type}
              onValueChange={setShiftType}
              style={styles.picker}>
              <Picker.Item label="Select Shift" value="" />
              {useSelectStore.getState().shiftTypeOptions.map((option, idx) => (
                <Picker.Item
                  key={idx}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </ScrollView>
        )}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={takePicture}
          disabled={!isFormComplete}
          style={[
            styles.actionButton,
            {backgroundColor: isFormComplete ? 'black' : '#808080'},
          ]}>
          <Text style={styles.actionButtonText}>✅ Mark</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowCamera(false)}
          style={[styles.actionButton, styles.closeButton]}>
          <Text style={[styles.actionButtonText, styles.closeButtonText]}>
            ❌ Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  activeTab: {
    borderColor: 'blue',
  },
  activeText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#666',
  },
  contentContainer: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  faceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  faceBox: {
    width: 275,
    height: 400,
    borderWidth: 4,
    borderRadius: 10,
  },
  faceText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  captureButton: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  captureButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: 'black', // Add this line
  },
  picker: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    color: 'black', // Add this line
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    color: 'red',
  },
});

export default AttendCamera;
