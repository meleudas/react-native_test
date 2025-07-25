import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Header from './Header';
import Day from './Day';
import ToDoList from './ToDoList';

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
  const [orientation, setOrientation] = useState('portrait');
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().slice(0, 10)
  );

  useEffect(() => {
    const onChange = () => {
      const { width, height } = Dimensions.get('window');
      setCalWidth(width > 400 ? 350 : width - 20);
      setOrientation(width > height ? 'landscape' : 'portrait');
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
    setSelectedDate(today.toISOString().slice(0, 10));
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

  // Відображення ToDoList справа у горизонтальному режимі, під календарем у вертикальному
  if (orientation === 'landscape') {
    return (
      <View
        style={[styles.calendar, { flexDirection: 'row' }]}
        {...panResponder.panHandlers}
      >
        <View style={{ flex: 1 }}>
          <Header
            month={monthNames[current.month]}
            year={current.year}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
          />
          <View style={{ overflow: 'hidden', height: gridHeight }}>
            <MonthGrid
              days={days}
              daySize={daySize}
              onSelect={date => setSelectedDate(date)}
              selectedDate={selectedDate}
              tasks={tasks}
            />
          </View>
        </View>
        <View style={{ width: 320, marginLeft: 10 }}>
          <ToDoList
            tasks={tasks}
            setTasks={setTasks}
            selectedDate={selectedDate}
          />
        </View>
      </View>
    );
  }
  // portrait: календар, потім ToDoList, поле вводу видно при відкритті клавіатури
  return (
    <>
      <View style={styles.calendar} {...panResponder.panHandlers}>
        <Header
          month={monthNames[current.month]}
          year={current.year}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        <View style={{ overflow: 'hidden', height: gridHeight }}>
          <MonthGrid
            days={days}
            daySize={daySize}
            onSelect={date => setSelectedDate(date)}
            selectedDate={selectedDate}
            tasks={tasks}
          />
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <ToDoList
            tasks={tasks}
            setTasks={setTasks}
            selectedDate={selectedDate}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

function MonthGrid({ days, daySize, onSelect, selectedDate, tasks }) {
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
        const dateStr = item.date.toISOString().slice(0, 10);
        const hasTasks = tasks[dateStr] && tasks[dateStr].length > 0;
        const isSelected = selectedDate === dateStr;
        return (
          <View key={idx} style={styles.cell}>
            <TouchableOpacity onPress={() => onSelect(dateStr)}>
              <Day
                day={item.day}
                isCurrent={!item.isOtherMonth}
                isOtherMonth={item.isOtherMonth}
                isToday={isToday}
                daySize={daySize}
                isSelected={isSelected}
              />
              {hasTasks && (
                <View style={styles.dot} />
              )}
            </TouchableOpacity>
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
    position: 'relative',
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#2196F3',
      position: 'absolute',
      bottom: 8,
      alignSelf: 'center',
    }
  });