import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Header({ month = 'Січень', year = 2024, onPrev, onNext, onToday }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrev} style={styles.btn}>
        <Text style={styles.btnText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{month} {year}</Text>
      <TouchableOpacity onPress={onNext} style={styles.btn}>
        <Text style={styles.btnText}>{'>'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onToday} style={styles.todayBtn}>
        <Text style={styles.todayText}>Сьогодні</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btn: {
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  todayBtn: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#0077cc',
    borderRadius: 6,
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
