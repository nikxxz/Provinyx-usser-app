import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

/**
 * CustomTextInput Component
 * Makes the entire input wrapper touchable, not just the text area
 */
const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  maxLength,
  icon,
  onIconPress,
  error = false,
  ...props
}) => {
  const inputRef = useRef(null);

  const handleWrapperPress = () => {
    if (editable && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleWrapperPress}
      style={[styles.inputWrapper, error && styles.inputWrapperError]}
    >
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        maxLength={maxLength}
        {...props}
      />
      {icon && (
        <TouchableOpacity
          onPress={onIconPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {icon}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  inputWrapperError: {
    borderColor: '#dc2626',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
});

export default CustomTextInput;
