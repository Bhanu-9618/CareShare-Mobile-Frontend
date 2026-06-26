import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { COLORS } from '../constants/colors';

interface CustomInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
}

export default function CustomInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? 'red' : isFocused ? COLORS.primary : '#e0e0e0' }
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputContainer: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: '#333',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});