import React from 'react';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {StyleSheet} from 'react-native';

const AttendanceCalendar = ({records, selectedDate, onDateSelect}) => {
  const getMarkedDates = () => {
    return records.reduce((acc, record) => {
      const date = moment(record.date).format('YYYY-MM-DD');
      acc[date] = {
        marked: true,
        dotColor: record.type === 'in' ? '#2ecc71' : '#e67e22',
        selected: date === selectedDate,
      };
      return acc;
    }, {});
  };

  return (
    <Calendar
      current={selectedDate}
      markedDates={getMarkedDates()}
      onDayPress={onDateSelect}
      theme={{
        selectedDayBackgroundColor: '#3498db',
        todayTextColor: '#3498db',
        arrowColor: '#3498db',
      }}
      style={styles.calendar}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
});

export default AttendanceCalendar;
