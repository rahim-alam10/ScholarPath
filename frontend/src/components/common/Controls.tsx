import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../config/theme';

const academicQualificationOptions = [
  'Class 10 / O Levels',
  'Class 11 / A Levels (First Year)',
  'Class 12 / A Levels (Second Year)',
  'Associate Degree',
  'Bachelor’s (BS/BA/BSc)',
  'Master’s (MS/MPhil/MA/MSc)',
  'Doctoral (PhD)',
  'Other',
];

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

export function AcademicQualificationField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>Current academic qualification</Text>
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.input, styles.selectInput]}
        accessibilityRole="button"
        accessibilityLabel={`Current academic qualification: ${value || 'Select an option'}`}
        accessibilityState={{ expanded: visible }}
      >
        <Text style={value ? styles.selectValue : styles.selectPlaceholder}>
          {value || 'Select your current level'}
        </Text>
        <Text style={styles.selectChevron}>⌄</Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.selectOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Close qualification options"
          />
          <View style={styles.selectModal}>
            <Text style={styles.selectTitle}>Select your current level</Text>
            <ScrollView>
              {academicQualificationOptions.map((option) => {
                const selected = value === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onChange(option);
                      setVisible(false);
                    }}
                    style={[styles.selectOption, selected && styles.selectOptionSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text style={[styles.selectOptionText, selected && styles.selectOptionTextSelected]}>
                      {option}
                    </Text>
                    {selected ? <Text style={styles.selectCheck}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectValue: { color: colors.ink, fontSize: 16 },
  selectPlaceholder: { color: colors.muted, fontSize: 16 },
  selectChevron: { color: colors.muted, fontSize: 20, marginLeft: 12 },
  selectOverlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(21, 29, 46, 0.45)' },
  selectModal: { maxHeight: '80%', borderRadius: 18, padding: 20, backgroundColor: colors.white },
  selectTitle: { color: colors.ink, fontSize: 18, lineHeight: 24, fontWeight: '700', marginBottom: 12 },
  selectOption: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderRadius: 10 },
  selectOptionSelected: { backgroundColor: colors.paleBlue },
  selectOptionText: { color: colors.ink, fontSize: 15, flexShrink: 1 },
  selectOptionTextSelected: { color: colors.blueDark, fontWeight: '600' },
  selectCheck: { color: colors.blue, fontSize: 18, fontWeight: '700', marginLeft: 12 },
});
