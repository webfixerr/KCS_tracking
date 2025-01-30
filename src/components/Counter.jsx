import React from 'react';
import {Text} from 'react-native';

const Counter = ({resolution_by, setTimeLeft}) => {
  const now = new Date(resolution_by); // Use the provided date
  const updatedDate = new Date(now);

  const countdown = () => {
    const targetDate = new Date(updatedDate); // Use the updated date
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const diff = targetDate - currentDate;

    if (diff <= 0) {
      console.log("count complete")
      setTimeLeft('Overdue');
      clearInterval(timer); // Stop the timer when the countdown reaches zero
      return;
    }

    // Convert time difference to days, hours, minutes, and seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  // Call the countdown function every second
  const timer = setInterval(countdown, 1000);
};

export default Counter;
