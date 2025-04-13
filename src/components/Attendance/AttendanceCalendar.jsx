import React from 'react';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {StyleSheet} from 'react-native';

const AttendanceCalendar = ({records, selectedDate, onDateSelect}) => {
  const getMarkedDates = () => {
    const grouped = {};

    // Step 1: Group by date
    records.forEach((record) => {
      const date = moment(record.attendance_date).format('YYYY-MM-DD');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(record.status); // e.g., Present, Absent
    });

    // Step 2: Analyze per-day attendance and assign color
    const marks = {};

    Object.entries(grouped).forEach(([date, statuses]) => {
      let color = '#95a5a6'; // default gray

      if (statuses.length === 2) {
        // Double shift (half green + half violet)
        marks[date] = {
          customStyles: {
            container: {
              backgroundColor: 'transparent',
              position: 'relative',
            },
            text: {
              color: 'black',
            },
          },
        };
        marks[date].customStyles.container = {
          backgroundColor: 'linear-gradient(90deg, #2ecc71 50%, #8e44ad 50%)',
        };
      } else {
        const status = statuses[0];

        color =
          status === 'Present'
            ? '#2ecc71'
            : status === 'Absent'
            ? '#e74c3c'
            : '#f1c40f';

        marks[date] = {
          customStyles: {
            container: {
              backgroundColor: color,
              borderRadius: 20,
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };
      }

      // Highlight selected
      if (date === selectedDate) {
        marks[date].selected = true;
        marks[date].selectedColor = '#3498db';
      }
    });

    return marks;
  };

  return (
    <Calendar
      current={selectedDate}
      markedDates={getMarkedDates()}
      onDayPress={onDateSelect}
      markingType={'custom'} // <- Required for custom styling
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
