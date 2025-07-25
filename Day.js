import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Day({ day = '', isCurrent, isOtherMonth, isToday, isSelected }) {
  return (
    <View style={[styles.day, isOtherMonth && styles.otherMonth, isToday && styles.today, isSelected && styles.selected]}>
      <Text style={[styles.text, isCurrent && styles.current]}>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  day: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  otherMonth: {
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  today: {
    borderWidth: 2,
    borderColor: '#0077cc',
  },
  text: {
    fontSize: 16,
    color: '#222',
  },
  current: {
    fontWeight: 'bold',
    color: '#0077cc',
  },
  selected: {
    borderWidth: 2,
    borderColor: 'orange',
    backgroundColor: '#fffbe6',
  },
});
