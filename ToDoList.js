import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ToDoList = ({ tasks, setTasks, selectedDate }) => {
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => ({
      ...prev,
      [selectedDate]: [
        ...(prev[selectedDate] || []),
        { id: Date.now().toString(), text: input, done: false }
      ]
    }));
    setInput('');
  };

  const deleteTask = (id) => {
    setTasks(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter(task => task.id !== id)
    }));
  };

  const toggleTask = (id) => {
    setTasks(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    }));
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    setTasks(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(task =>
        task.id === editId ? { ...task, text: editText } : task
      )
    }));
    setEditId(null);
    setEditText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Задачі на {selectedDate}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Нова задача"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks[selectedDate] || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Text style={[styles.taskText, item.done && styles.done]}>{item.text}</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => startEdit(item.id, item.text)}>
                <Text style={styles.edit}>Ред.</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.delete}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {editId && (
        <View style={styles.editRow}>
          <TextInput
            style={styles.input}
            value={editText}
            onChangeText={setEditText}
            placeholder="Редагувати задачу"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
            <Text style={styles.saveBtnText}>Зберегти</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  inputRow: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8 },
  addBtn: { backgroundColor: '#007AFF', borderRadius: 5, marginLeft: 5, padding: 10 },
  addBtnText: { color: '#fff', fontSize: 18 },
  taskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  taskText: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', color: 'gray' },
  actions: { flexDirection: 'row', marginLeft: 'auto' },
  edit: { color: '#007AFF', marginRight: 10 },
  delete: { color: 'red' },
  editRow: { flexDirection: 'row', marginTop: 10 },
  saveBtn: { backgroundColor: '#34C759', borderRadius: 5, marginLeft: 5, padding: 10 },
  saveBtnText: { color: '#fff', fontSize: 16 },
});

export default ToDoList;
