import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, StyleSheet } from 'react-native';

type Item = { id: string; text: string; done: boolean };

export default function BucketList() {
  const [text, setText] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  const addItem = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    setItems([...items, { id: Date.now().toString(), text: capitalized, done: false }]);
    setText('');
  };

  const toggleItem = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const doneCount = items.filter((i) => i.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bucket List</Text>
      <TextInput
        style={styles.input}
        placeholder="Something you want to do..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={addItem}
      />
      <Button title="Add" onPress={addItem} />
      <Text style={styles.count}>
        {doneCount} of {items.length} completed
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleItem(item.id)}>
            <Text style={[styles.item, item.done && styles.itemDone]}>
              {item.done ? '✅ ' : '⬜ '}
              {item.text}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10, alignSelf: 'stretch', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 6, padding: 10 },
  count: { fontSize: 14, color: '#666' },
  item: { fontSize: 18, paddingVertical: 6 },
  itemDone: { textDecorationLine: 'line-through', color: '#999' },
});