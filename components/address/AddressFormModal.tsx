// src/components/address/AddressFormModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../common/FormInput';
import { SPACING, RADIUS } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';
import type { Address } from '../../types';

const LABEL_OPTIONS = ['Home', 'Office', 'Other'];

interface AddressFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, 'id'>) => void;
  initialData?: Address | null;
  isSaving?: boolean;
}

const EMPTY_FORM = {
  label:      'Home',
  fullName:   '',
  street:     '',
  city:       '',
  postalCode: '',
  phone:      '',
  isDefault:  false,
};

export default function AddressFormModal({
  visible,
  onClose,
  onSave,
  initialData,
  isSaving = false,
}: AddressFormModalProps) {
  const { colors: C } = useTheme();
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing an existing address
  useEffect(() => {
    if (initialData) {
      setForm({
        label:      initialData.label,
        fullName:   initialData.fullName,
        street:     initialData.street,
        city:       initialData.city,
        postalCode: initialData.postalCode,
        phone:      initialData.phone,
        isDefault:  initialData.isDefault,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData, visible]);

  const setField = (key: keyof typeof EMPTY_FORM, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error when user types
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim())   newErrors.fullName   = 'Full name is required';
    if (!form.street.trim())     newErrors.street     = 'Street address is required';
    if (!form.city.trim())       newErrors.city       = 'City is required';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!form.phone.trim())      newErrors.phone      = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
            <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
              <Text style={[styles.cancelText, { color: C.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: C.text }]}>
              {initialData ? 'EDIT ADDRESS' : 'NEW ADDRESS'}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.headerBtn}
              disabled={isSaving}
            >
              <Text style={[styles.saveText, { color: C.accent, opacity: isSaving ? 0.5 : 1 }]}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Label picker */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>ADDRESS LABEL</Text>
              <View style={styles.labelRow}>
                {LABEL_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.labelChip,
                      { backgroundColor: C.inputBg, borderColor: C.border },
                      form.label === opt && { backgroundColor: C.primary, borderColor: C.primary },
                    ]}
                    onPress={() => setField('label', opt)}
                  >
                    <Text
                      style={[
                        styles.labelChipText,
                        { color: C.textSecondary },
                        form.label === opt && { color: C.textInverse },
                      ]}
                    >
                      {opt === 'Home'   ? '🏠 Home'   :
                       opt === 'Office' ? '🏢 Office' : '📍 Other'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Form fields */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CONTACT DETAILS</Text>
              <View style={styles.fields}>
                <FormInput
                  label="FULL NAME"
                  value={form.fullName}
                  onChangeText={(t) => setField('fullName', t)}
                  placeholder="Julian Alexander"
                  autoCapitalize="words"
                  error={errors.fullName}
                />
                <FormInput
                  label="PHONE NUMBER"
                  value={form.phone}
                  onChangeText={(t) => setField('phone', t)}
                  placeholder="+1 234 567 8900"
                  keyboardType="phone-pad"
                  error={errors.phone}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ADDRESS DETAILS</Text>
              <View style={styles.fields}>
                <FormInput
                  label="STREET ADDRESS"
                  value={form.street}
                  onChangeText={(t) => setField('street', t)}
                  placeholder="42 Palatine Hill Rd, Suite 100"
                  autoCapitalize="words"
                  error={errors.street}
                />
                <View style={styles.row}>
                  <View style={styles.rowFlex}>
                    <FormInput
                      label="CITY"
                      value={form.city}
                      onChangeText={(t) => setField('city', t)}
                      placeholder="Rome"
                      autoCapitalize="words"
                      error={errors.city}
                    />
                  </View>
                  <View style={styles.rowSmall}>
                    <FormInput
                      label="POSTAL CODE"
                      value={form.postalCode}
                      onChangeText={(t) => setField('postalCode', t)}
                      placeholder="00186"
                      keyboardType="number-pad"
                      error={errors.postalCode}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Set as default toggle */}
            <View style={[styles.defaultRow, { backgroundColor: C.inputBg, borderColor: C.border }]}>
              <View style={styles.defaultInfo}>
                <Text style={[styles.defaultLabel, { color: C.text }]}>Set as default address</Text>
                <Text style={[styles.defaultSub, { color: C.textSecondary }]}>
                  Used automatically at checkout
                </Text>
              </View>
              <Switch
                value={form.isDefault}
                onValueChange={(v) => setField('isDefault', v)}
                trackColor={{
                  false: C.border,
                  true:  C.accent,
                }}
                thumbColor={C.textInverse}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1 },
  flex:  { flex: 1 },
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    borderBottomWidth: 0.5,
  },
  headerBtn:   { minWidth: 60 },
  headerTitle: {
    fontSize:   12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  cancelText: {
    fontSize: 15,
  },
  saveText: {
    fontSize:   15,
    fontWeight: '700',
    textAlign: 'right',
  },
  savingText: { opacity: 0.5 },
  content: {
    padding:    SPACING.md,
    gap:        SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: { gap: SPACING.sm },
  sectionLabel: {
    fontSize:      11,
    letterSpacing: 2,
    fontWeight:    '700',
  },
  labelRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
  },
  labelChip: {
    flex:             1,
    paddingVertical: SPACING.sm,
    borderRadius:     RADIUS.md,
    borderWidth:      1.5,
    alignItems:       'center',
  },
  labelChipText: {
    fontSize:   13,
    fontWeight: '600',
  },
  fields: { gap: SPACING.md },
  row: {
    flexDirection: 'row',
    gap:           SPACING.sm,
  },
  rowFlex:  { flex: 2 },
  rowSmall: { flex: 1 },
  defaultRow: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    padding:          SPACING.md,
    borderRadius:     RADIUS.md,
    borderWidth:      0.5,
    marginTop:        SPACING.sm,
  },
  defaultInfo: { flex: 1, marginRight: SPACING.md },
  defaultLabel: {
    fontSize:   15,
    fontWeight: '600',
  },
  defaultSub: {
    fontSize: 12,
    marginTop: 2,
  },
});