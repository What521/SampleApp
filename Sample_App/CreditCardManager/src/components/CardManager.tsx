import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';

type Card = { id: string; name: string; balance: number; limit: number; apr: number };

const COLORS = {
  background: '#000000',
  surface: '#1f0d07',  
  border: '#34170d',
  inputBg: '#120704',
  accent: '#ff6a3d',   
  button: '#c2410c',   
  track: '#3a1a10',    
  text: '#ffffff',
  textMuted: '#ffffff',
  placeholder: '#9a7466',
  danger: '#ff8a80',
};

const ACCENTS = ['#ff5722', '#ff7043', '#e53935', '#ffa000', '#d84315'];

const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const utilColor = (u: number) => (u <= 30 ? '#22c55e' : u <= 60 ? '#fbbf24' : '#ff4d4d');

export default function CardManager() {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [apr, setApr] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState('');

  const addCard = () => {
    const b = parseFloat(balance);
    const l = parseFloat(limit);
    const a = parseFloat(apr);

    if (!name.trim() || isNaN(b) || isNaN(l) || isNaN(a) || b < 0 || l <= 0 || a < 0) {
      setError('Enter a nickname and valid numbers (limit must be above 0).');
      return;
    }

    setCards([...cards, { id: Date.now().toString(), name: name.trim(), balance: b, limit: l, apr: a }]);
    setName('');
    setBalance('');
    setLimit('');
    setApr('');
    setError('');
  };

  const removeCard = (id: string) => setCards(cards.filter((c) => c.id !== id));

  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
  const totalLimit = cards.reduce((sum, c) => sum + c.limit, 0);
  const totalInterest = cards.reduce((sum, c) => sum + c.balance * (c.apr / 100 / 12), 0);
  const overallUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.inner}>
        <Text style={styles.pageTitle}><b>Card Manager</b></Text>
        <Text style={styles.pageSub}>Manage your credit cards and keep track of balances and interest.</Text>

        {/* Summary */}
        <View style={styles.panel}>
          <Text style={styles.label}><b>TOTAL BALANCE</b></Text>
          <Text style={styles.bigNumber}>{money(totalBalance)}</Text>
          <Text style={styles.muted}>
            {overallUtil.toFixed(0)}% of {money(totalLimit)} limit · ~{money(totalInterest)} interest / mo
          </Text>
        </View>

        {/* Form */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>ADD A CARD</Text>
          <TextInput
            style={styles.input}
            placeholder="Card Name"
            placeholderTextColor={COLORS.placeholder}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex]}
              placeholder="Balance"
              placeholderTextColor={COLORS.placeholder}
              value={balance}
              onChangeText={setBalance}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.flex]}
              placeholder="Limit"
              placeholderTextColor={COLORS.placeholder}
              value={limit}
              onChangeText={setLimit}
              keyboardType="decimal-pad"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="APR %"
            placeholderTextColor={COLORS.placeholder}
            value={apr}
            onChangeText={setApr}
            keyboardType="decimal-pad"
          />
          {error !== '' && <Text style={styles.error}>{error}</Text>}
        </View>

        <Pressable style={styles.bigButton} onPress={addCard}>
          <Text style={styles.bigButtonText}>Add card</Text>
        </Pressable>

        {/* Cards */}
        {cards.length === 0 && <Text style={styles.muted}>No cards added</Text>}

        {cards.map((card, index) => {
          const util = (card.balance / card.limit) * 100;
          const interest = card.balance * (card.apr / 100 / 12);
          return (
            <View key={card.id} style={[styles.panel, { borderLeftWidth: 6, borderLeftColor: ACCENTS[index % ACCENTS.length] }]}>
              <View style={styles.cardTop}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Pressable onPress={() => removeCard(card.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
              <Text style={styles.cardAmount}>
                {money(card.balance)} <Text style={styles.cardOf}>of {money(card.limit)}</Text>
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, { width: `${Math.min(util, 100)}%`, backgroundColor: utilColor(util) }]}
                />
              </View>
              <View style={styles.cardBottom}>
                <Text style={[styles.chip, { color: utilColor(util) }]}>{util.toFixed(1)}% used</Text>
                <Text style={styles.chip}>
                  ~{money(interest)} / mo at {card.apr}% APR
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  inner: { width: '100%', maxWidth: 640, alignSelf: 'center', gap: 12 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: 10 },

  pageTitle: { fontSize: 45, color: COLORS.text, marginTop: 8 },
  pageSub: { fontSize: 14, color: COLORS.textMuted },

  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    gap: 8,
  },
  panelTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, letterSpacing: 0.5 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  bigNumber: { fontSize: 34, fontWeight: '800', color: COLORS.accent },
  muted: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  error: { color: COLORS.danger, fontSize: 13 },

  bigButton: { backgroundColor: COLORS.button, borderRadius: 20, paddingVertical: 18, alignItems: 'center' },
  bigButtonText: { color: COLORS.text, fontSize: 17, fontWeight: '800' },

  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  remove: { color: COLORS.danger, fontSize: 13, fontWeight: '600' },
  cardAmount: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  cardOf: { fontSize: 14, fontWeight: '400', color: COLORS.textMuted },
  barTrack: { height: 8, backgroundColor: COLORS.track, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 },
  chip: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
});