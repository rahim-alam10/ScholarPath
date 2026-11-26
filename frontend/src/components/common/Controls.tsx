import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../config/theme';

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  style?: object;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'outline' ? styles.outlineButton : styles.primaryButton,
        disabled && styles.buttonDisabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.buttonText, variant === 'outline' && styles.outlineButtonText]}>{label}</Text>
    </Pressable>
  );
}

export function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.textButton} accessibilityRole="button">
      <Text style={styles.textButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  onPress,
  filled = false,
  style,
}: {
  label: string;
  onPress?: () => void;
  filled?: boolean;
  style?: object;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, filled && styles.chipFilled, style]}
      accessibilityRole="button"
    >
      <Text style={[styles.chipLabel, filled && styles.chipLabelFilled]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'numeric';
}) {
  const [text, setText] = useState(value);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={onChangeText ? value : text}
        onChangeText={onChangeText ?? setText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' || secureTextEntry ? 'none' : 'sentences'}
        autoCorrect={!secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primaryButton: { backgroundColor: colors.blue },
  outlineButton: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  outlineButtonText: { color: colors.blue, fontWeight: '600' },
  buttonDisabled: { opacity: 0.55 },
  textButton: { minHeight: 42, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  textButtonLabel: { color: colors.blue, fontSize: 15, fontWeight: '600' },
  chip: { flex: 1, minHeight: 48, borderRadius: 25, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  chipFilled: { backgroundColor: colors.paleBlue, borderColor: colors.paleBlue },
  chipLabel: { color: colors.blue, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  chipLabelFilled: { color: colors.blueDark },
  field: { marginBottom: 18 },
  fieldLabel: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, minHeight: 55, paddingHorizontal: 15, paddingVertical: 12, color: colors.ink, fontSize: 16, backgroundColor: colors.white },
});
