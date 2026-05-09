// src/components/payment/CardFormModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  detectCardType,
  getCardColor,
  formatCardNumber,
  formatExpiry,
} from '../../services/cardService';
import VisualCard from './VisualCard';
import { SPACING, RADIUS } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';
import type { PaymentCard } from '../../types';

interface CardFormModalProps {
  visible:   boolean;
  onClose:   () => void;
  onSave:    (card: Omit<PaymentCard, 'id'>) => void;
  isSaving?: boolean;
}

const EMPTY = {
  cardNumber: '',
  cardHolder: '',
  expiry:     '',
  cvv:        '',
  isDefault:  false,
};

export default function CardFormModal({
  visible,
  onClose,
  onSave,
  isSaving = false,
}: CardFormModalProps) {
  const { colors: C } = useTheme();
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Live preview card data
  const cardType    = detectCardType(form.cardNumber);
  const cardColor   = getCardColor(cardType);
  const previewCard: PaymentCard = {
    id:          'preview',
    cardHolder:  form.cardHolder || 'YOUR NAME',
    lastFour:    form.cardNumber.replace(/\s/g, '').slice(-4) || '0000',
    expiry:      form.expiry || 'MM/YY',
    cardType,
    isDefault:   form.isDefault,
    color:       cardColor,
  };

  // Card flip animation when user types CVV
  const flipAnim   = useRef(new Animated.Value(0)).current;
  const [showBack, setShowBack] = useState(false);

  const flipToBack = () => {
    if (showBack) return;
    setShowBack(true);
    Animated.spring(flipAnim, {
      toValue: 1, useNativeDriver: true,
      speed: 14, bounciness: 0,
    }).start();
  };

  const flipToFront = () => {
    if (!showBack) return;
    setShowBack(false);
    Animated.spring(flipAnim, {
      toValue: 0, useNativeDriver: true,
      speed: 14, bounciness: 0,
    }).start();
  };

  const frontRotate = flipAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  useEffect(() => {
    if (!visible) {
      setForm(EMPTY);
      setErrors({});
    }
  }, [visible]);

  const setField = (key: keyof typeof EMPTY, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const cleanNum = form.cardNumber.replace(/\s/g, '');
    if (cleanNum.length < 15)        e.cardNumber = 'Enter a valid card number';
    if (!form.cardHolder.trim())     e.cardHolder = 'Cardholder name is required';
    if (form.expiry.length < 5)      e.expiry     = 'Enter expiry as MM/YY';
    if (form.cvv.length < 3)         e.cvv        = 'Enter a valid CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const cleanNum = form.cardNumber.replace(/\s/g, '');
    onSave({
      cardHolder: form.cardHolder.trim(),
      lastFour:   cleanNum.slice(-4),
      expiry:     form.expiry,
      cardType,
      isDefault:  form.isDefault,
      color:      cardColor,
    });
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
          <View style={[styles.header, { borderBottomColor: C.border }]}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.cancelText, { color: C.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: C.text }]}>ADD NEW CARD</Text>
            <TouchableOpacity onPress={handleSave} disabled={isSaving}>
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
            {/* ── Animated card preview ── */}
            <View style={styles.cardPreviewArea}>
              {/* Front */}
              <Animated.View
                style={[
                  styles.cardFace,
                  { transform: [{ rotateY: frontRotate }] },
                  showBack && styles.hidden,
                ]}
              >
                <VisualCard card={previewCard} />
              </Animated.View>

              {/* Back */}
              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardBack,
                  { transform: [{ rotateY: backRotate }] },
                  !showBack && styles.hidden,
                ]}
              >
                <View style={[
                  styles.cardBackView,
                  { backgroundColor: cardColor },
                ]}>
                  {/* Magnetic strip */}
                  <View style={styles.magStrip} />
                  {/* CVV strip */}
                  <View style={styles.cvvStrip}>
                    <View style={styles.cvvBox}>
                      <Text style={styles.cvvValue}>
                        {form.cvv || '•••'}
                      </Text>
                    </View>
                    <Text style={styles.cvvLabel}>CVV</Text>
                  </View>
                  {/* Card type badge */}
                  <View style={styles.backBottom}>
                    <Text style={styles.backCardType}>
                      {detectCardType(form.cardNumber).toUpperCase()}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>

            {/* ── Form fields ── */}
            <View style={styles.formSection}>
              <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>CARD NUMBER</Text>
              <View style={[
                styles.inputBox,
                { backgroundColor: C.inputBg, borderColor: errors.cardNumber ? C.error : C.border },
              ]}>
                <TextInput
                  style={[styles.input, { color: C.text }]}
                  value={form.cardNumber}
                  onChangeText={(t) =>
                    setField('cardNumber', formatCardNumber(t))
                  }
                  onFocus={flipToFront}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor={C.textLight}
                  keyboardType="number-pad"
                  maxLength={19}
                />
                <Text style={styles.cardTypeIndicator}>
                  {cardType === 'visa'       ? '💙' :
                   cardType === 'mastercard' ? '🔴' :
                   cardType === 'amex'       ? '🟦' : '💳'}
                </Text>
              </View>
              {errors.cardNumber && (
                <Text style={[styles.error, { color: C.error }]}>{errors.cardNumber}</Text>
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>CARDHOLDER NAME</Text>
              <View style={[
                styles.inputBox,
                { backgroundColor: C.inputBg, borderColor: errors.cardHolder ? C.error : C.border },
              ]}>
                <TextInput
                  style={[styles.input, { color: C.text }]}
                  value={form.cardHolder}
                  onChangeText={(t) => setField('cardHolder', t)}
                  onFocus={flipToFront}
                  placeholder="Julian Alexander"
                  placeholderTextColor={C.textLight}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {errors.cardHolder && (
                <Text style={[styles.error, { color: C.error }]}>{errors.cardHolder}</Text>
              )}
            </View>

            <View style={styles.row}>
              {/* Expiry */}
              <View style={[styles.formSection, styles.flex]}>
                <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>EXPIRY DATE</Text>
                <View style={[
                  styles.inputBox,
                  { backgroundColor: C.inputBg, borderColor: errors.expiry ? C.error : C.border },
                ]}>
                  <TextInput
                    style={[styles.input, { color: C.text }]}
                    value={form.expiry}
                    onChangeText={(t) =>
                      setField('expiry', formatExpiry(t))
                    }
                    onFocus={flipToFront}
                    placeholder="MM/YY"
                    placeholderTextColor={C.textLight}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                {errors.expiry && (
                  <Text style={[styles.error, { color: C.error }]}>{errors.expiry}</Text>
                )}
              </View>

              {/* CVV */}
              <View style={[styles.formSection, styles.flex]}>
                <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>CVV</Text>
                <View style={[
                  styles.inputBox,
                  { backgroundColor: C.inputBg, borderColor: errors.cvv ? C.error : C.border },
                ]}>
                  <TextInput
                    style={[styles.input, { color: C.text }]}
                    value={form.cvv}
                    onChangeText={(t) =>
                      setField('cvv', t.replace(/\D/g, '').slice(0, 4))
                    }
                    onFocus={flipToBack}
                    onBlur={flipToFront}
                    placeholder="•••"
                    placeholderTextColor={C.textLight}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                  />
                </View>
                {errors.cvv && (
                  <Text style={[styles.error, { color: C.error }]}>{errors.cvv}</Text>
                )}
              </View>
            </View>

            {/* Security note */}
            <View style={[styles.securityNote, { backgroundColor: C.skeletonBase, borderColor: C.accent }]}>
              <Text style={[styles.securityIcon, { color: C.accent }]}>🔒</Text>
              <Text style={[styles.securityText, { color: C.accent }]}>
                Your card details are encrypted. CVV is never stored.
              </Text>
            </View>

            {/* Set as default */}
            <View style={[styles.defaultRow, { backgroundColor: C.inputBg, borderColor: C.border }]}>
              <View style={styles.defaultInfo}>
                <Text style={[styles.defaultLabel, { color: C.text }]}>Set as default card</Text>
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
  safe:   { flex: 1 },
  flex:   { flex: 1 },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    borderBottomWidth: 0.5,
  },
  cancelText:  { fontSize: 15 },
  headerTitle: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 2,
  },
  saveText: {
    fontSize:   15,
    fontWeight: '700',
  },
  content: {
    padding:       SPACING.md,
    gap:           SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  // Card preview
  cardPreviewArea: {
    alignItems: 'center',
    height:     200,
    marginBottom: SPACING.sm,
  },
  cardFace: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardBack: {},
  hidden:   { opacity: 0 },

  // Card back face
  cardBackView: {
    width:         340,
    height:        200,
    borderRadius:  RADIUS.xl,
    overflow:      'hidden',
    justifyContent: 'space-between',
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius:  16,
    elevation:     10,
  },
  magStrip: {
    width:           '100%',
    height:          44,
    backgroundColor: '#111',
    marginTop:       28,
  },
  cvvStrip: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: SPACING.lg,
    gap:               SPACING.md,
  },
  cvvBox: {
    flex:            1,
    borderRadius:    4,
    paddingVertical: 8,
    paddingHorizontal: SPACING.sm,
    alignItems:      'flex-end',
  },
  cvvValue: {
    fontSize:      16,
    fontWeight:    '700',
    letterSpacing: 4,
  },
  cvvLabel: {
    fontSize:   12,
    fontWeight: '600',
  },
  backBottom: {
    paddingHorizontal: SPACING.lg,
    paddingBottom:     SPACING.md,
    alignItems:        'flex-end',
  },
  backCardType: {
    fontSize:      14,
    fontWeight:    '700',
    letterSpacing: 2,
  },

  // Form
  row: {
    flexDirection: 'row',
    gap:           SPACING.md,
  },
  formSection: { gap: 6 },
  sectionLabel: {
    fontSize:      11,
    letterSpacing: 2,
    fontWeight:    '700',
  },
  inputBox: {
    flexDirection:   'row',
    alignItems:      'center',
    borderWidth:     1,
    borderRadius:    RADIUS.md,
    paddingHorizontal: SPACING.md,
    height:          52,
  },
  input: {
    flex:      1,
    fontSize:  16,
    height:    '100%',
  },
  cardTypeIndicator: { fontSize: 20 },
  error: { fontSize: 12 },

  // Security note
  securityNote: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             SPACING.sm,
    padding:         SPACING.sm,
    borderRadius:    RADIUS.md,
    borderWidth:     0.5,
  },
  securityIcon: { fontSize: 16 },
  securityText: {
    flex:      1,
    fontSize: 12,
    lineHeight: 18,
  },

  // Default toggle
  defaultRow: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    padding:         SPACING.md,
    borderRadius:    RADIUS.md,
    borderWidth:     0.5,
  },
  defaultInfo:  { flex: 1, marginRight: SPACING.md },
  defaultLabel: {
    fontSize:   15,
    fontWeight: '600',
  },
  defaultSub: {
    fontSize: 12,
    marginTop: 2,
  },
});