import React from 'react';
import {Alert} from 'react-native';

const ErrorAlert = ({_server_messages}) => {
  if (_server_messages !== undefined) {
    let cleanedString = _server_messages.replace(/^\[\"|\"\]$/g, '');
    cleanedString = cleanedString.replace(/\\{2}/g, '\\');
    cleanedString = cleanedString.replace(/\\"/g, '"');
    const {title, message} = JSON.parse(cleanedString);
    Alert.alert(`${title}`, `${message}`);
  }
};

export default ErrorAlert;
