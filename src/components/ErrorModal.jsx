import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const ErrorModal = ({ visible, message, onDismiss }) => (
  <Modal transparent visible={visible}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.message}>{message}</Text>
        <Button title="OK" onPress={onDismiss} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  message: {
    fontSize: 16,
    marginBottom: 15
  }
});

export default ErrorModal;