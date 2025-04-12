import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AttendanceButton = ({ status, onPress }) => {
  const buttonText = status === 'IN' 
    ? 'Mark In' 
    : 'Mark Out';

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default AttendanceButton;