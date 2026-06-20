import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CounterButtons, DEFAULT_COUNT } from './custom-button';

// ─── Colour tokens ────────────────────────────────────────────────────────────

const C = {
  bg:       '#F5EFE6',
  card:     '#6B0F1A',
  cardText: '#F5EFE6',
  cardSub:  'rgba(245,239,230,0.55)',
  headline: '#2E0A10',
  body:     '#7A4A50',
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [count, setCount] = useState(DEFAULT_COUNT);

  const handleCountChange = useCallback((next: number) => {
    setCount(next);
  }, []);

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>COUNTER</Text>
        <Text style={styles.headline}>Component | State | Props</Text>
      </View>

      {/* Count card — display only */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current Count</Text>
        <Text style={styles.countNumber}>{count}</Text>
        <Text style={styles.cardHint}>hold buttons to change fast</Text>
      </View>

      {/* All button logic lives in CounterButtons */}
      <CounterButtons onCountChange={handleCountChange} />

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    marginBottom: 8,
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    color: C.body,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: C.headline,
    lineHeight: 38,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 4,
    shadowColor: C.card,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: C.cardSub,
    textTransform: 'uppercase',
  },
  countNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: C.cardText,
    lineHeight: 88,
  },
  cardHint: {
    fontSize: 11,
    color: C.cardSub,
    marginTop: 4,
    fontStyle: 'italic',
  },
});