import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Text } from 'react-native';
import Header from './Header';
import Day from './Day';

const monthNames = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

function getDaysArray(year, month) {
  const days = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0);
  let startDay = firstDayOfMonth.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay.getDate() - i,
      isOtherMonth: true,
      date: new Date(year, month - 1, prevMonthLastDay.getDate() - i)
    });
  }
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push({
      day: i,
      isOtherMonth: false,
      date: new Date(year, month, i)
    });
  }
  while (days.length % 7 !== 0) {
    const nextDay = days.length - (startDay + lastDayOfMonth.getDate()) + 1;
    days.push({
      day: nextDay,
      isOtherMonth: true,
      date: new Date(year, month + 1, nextDay)
    });
  }
  while (days.length < 42) {
    const nextDay = days.length - (startDay + lastDayOfMonth.getDate()) + 1;
    days.push({
      day: nextDay,
      isOtherMonth: true,
      date: new Date(year, month + 1, nextDay)
    });
  }
  return days;
}

function getPrevMonth(year, month) {
  let m = month - 1;
  let y = year;
  if (m < 0) {
    m = 11;
    y--;
  }
  return { year: y, month: m };
}
function getNextMonth(year, month) {
  let m = month + 1;
  let y = year;
  if (m > 11) {
    m = 0;
    y++;
  }
  return { year: y, month: m };
}

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [calWidth, setCalWidth] = useState(350);

  useEffect(() => {
    const onChange = () => {
      const { width } = Dimensions.get('window');
      setCalWidth(width > 400 ? 350 : width - 20);
    };
    Dimensions.addEventListener('change', onChange);
    onChange();
    return () => Dimensions.removeEventListener && Dimensions.removeEventListener('change', onChange);
  }, []);

  const calendarMaxWidth = 350;
  const daySize = (calWidth - 12) / 7;
  const gridHeight = daySize * 7;

  const days = getDaysArray(current.year, current.month);

  const handlePrev = () => {
    setCurrent(prev => getPrevMonth(prev.year, prev.month));
  };
  const handleNext = () => {
    setCurrent(prev => getNextMonth(prev.year, prev.month));
  };
  const handleToday = () => {
    setCurrent({ year: today.getFullYear(), month: today.getMonth() });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40) {
          handleNext();
        } else if (gestureState.dx > 40) {
          handlePrev();
        }
      },
    })
  ).current;

  return (
    <View
      style={[styles.calendar]}
      {...panResponder.panHandlers}
    >
      <Header
        month={monthNames[current.month]}
        year={current.year}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <View style={{ overflow: 'hidden', height: gridHeight }}>
        <MonthGrid days={days} daySize={daySize} />
      </View>
    </View>
  );
}

function MonthGrid({ days, daySize }) {
  const today = new Date();
  return (
    <View style={styles.grid}>
      {weekDays.map((d, idx) => (
        <View key={d} style={styles.cell}>
          <Text style={styles.weekDayText}>{d}</Text>
        </View>
      ))}
      {days.map((item, idx) => {
        const isToday =
          item.date.getDate() === today.getDate() &&
          item.date.getMonth() === today.getMonth() &&
          item.date.getFullYear() === today.getFullYear();
        return (
          <View key={idx} style={styles.cell}>
            <Day
              day={item.day}
              isCurrent={!item.isOtherMonth}
              isOtherMonth={item.isOtherMonth}
              isToday={isToday}
              daySize={daySize}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 6,
    elevation: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  cell: {
    flexBasis: '14.285%', 
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
}); 