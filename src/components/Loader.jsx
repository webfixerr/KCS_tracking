import React from 'react';
import { Modal, ActivityIndicator, View, StyleSheet } from 'react-native';

const Loader = ({ visible }) => (
  <Modal transparent visible={visible}>
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Loader;