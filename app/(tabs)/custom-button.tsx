import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_COUNT = 100;   // exported so index.tsx can read it if needed
const HOLD_INTERVAL_MS = 120;       // ms between increments while button is held

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'ghost' | 'muted';

export interface CustomButtonProps {
  label: string;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

// ─── Colour tokens (maroon & off-white palette) ───────────────────────────────

const COLORS = {
  maroon:     '#6B0F1A',
  maroonDark: '#4A0A12',
  rose:       '#C9A0A6',
  roseDark:   '#A8787F',
  offWhite:   '#F5EFE6',
  border:     '#6B0F1A',
};

// ─── Base button (unchanged visual) ──────────────────────────────────────────

export function CustomButton({
  label,
  variant = 'primary',
  onPress,
  onLongPress,
  onPressOut,
  disabled = false,
  style,
}: CustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      disabled={disabled}
      delayLongPress={300}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && {
          backgroundColor: pressed ? COLORS.maroonDark : COLORS.maroon,
        },
        variant === 'ghost' && {
          backgroundColor: pressed ? 'rgba(107,15,26,0.08)' : 'transparent',
          borderWidth: 1.5,
          borderColor: COLORS.border,
        },
        variant === 'muted' && {
          backgroundColor: pressed ? COLORS.roseDark : COLORS.rose,
        },
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text
        style={[
          styles.label,
          variant === 'ghost' && styles.labelGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── CounterButtons — all logic lives here ───────────────────────────────────

interface CounterButtonsProps {
  /** Callback so the parent display can receive the current count */
  onCountChange: (count: number) => void;
}

export function CounterButtons({ onCountChange }: CounterButtonsProps) {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Notify parent whenever count changes
  useEffect(() => {
    onCountChange(count);
  }, [count, onCountChange]);

  // ── Hold-to-repeat helpers ────────────────────────────────────────────────

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const changeCount = useCallback((delta: number) => {
    setCount((c) => c + delta);
  }, []);

  const startHold = useCallback(
    (delta: number) => {
      clearTimer();
      changeCount(delta);
      intervalRef.current = setInterval(() => changeCount(delta), HOLD_INTERVAL_MS);
    },
    [changeCount, clearTimer]
  );

  const stopHold = useCallback(() => clearTimer(), [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={btnStyles.container}>
      {/* Add + Subtract row */}
      <View style={btnStyles.row}>
        <View style={btnStyles.rowItem}>
          <CustomButton
            label="+ Add Count"
            variant="primary"
            onPress={() => changeCount(1)}
            onLongPress={() => startHold(1)}
            onPressOut={stopHold}
          />
        </View>
        <View style={btnStyles.rowItem}>
          <CustomButton
            label="− Minus Count"
            variant="primary"
            onPress={() => changeCount(-1)}
            onLongPress={() => startHold(-1)}
            onPressOut={stopHold}
          />
        </View>
      </View>

      {/* Reset */}
      <CustomButton
        label={`Reset to ${DEFAULT_COUNT}`}
        variant="muted"
        onPress={() => setCount(DEFAULT_COUNT)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#F5EFE6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  labelGhost: {
    color: '#6B0F1A',
  },
  disabled: {
    opacity: 0.35,
  },
});

const btnStyles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
});