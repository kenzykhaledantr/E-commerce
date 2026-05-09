// src/screens/main/AccountSettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation }   from '@react-navigation/native';
import { useAuthStore }    from '../../../store/authStore';
import { useTheme }        from '../../../hook/useTheme';
import { updateDisplayName, changePassword } from '../../../services/authService';
import FormInput           from '../../../components/common/FormInput';
import { SPACING, RADIUS } from '../../../utils/constants';

type Section = 'name' | 'password' | null;

export default function AccountSettingsScreen() {
  const navigation   = useNavigation<any>();
  const { colors, isDark, toggleTheme } = useTheme();
  const user         = useAuthStore((s) => s.user);
  const setUser      = useAuthStore((s) => s.setUser);

  // ── Name section ──────────────────────────────────────────
  const [newName,      setNewName]      = useState(user?.displayName ?? '');
  const [nameLoading,  setNameLoading]  = useState(false);

  // ── Password section ──────────────────────────────────────
  const [currentPass,  setCurrentPass]  = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [passLoading,  setPassLoading]  = useState(false);

  // ── Which section is expanded ─────────────────────────────
  const [expanded, setExpanded]         = useState<Section>(null);

  const toggle = (section: Section) =>
    setExpanded((prev) => (prev === section ? null : section));

  const C = colors; // shorthand

  // ── Save name ──────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    if (newName.trim() === user?.displayName) {
      Alert.alert('No change', 'That is already your current name.');
      return;
    }
    setNameLoading(true);
    try {
      await updateDisplayName(newName.trim());
      // Update Zustand store so UI reflects immediately
      if (user) setUser({ ...user, displayName: newName.trim() });
      Alert.alert('✓ Updated', 'Your name has been updated.');
      setExpanded(null);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to update name.');
    } finally {
      setNameLoading(false);
    }
  };

  // ── Save password ──────────────────────────────────────────
  const handleSavePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert('Validation', 'Please fill in all password fields.');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Validation', 'New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Validation', 'New passwords do not match.');
      return;
    }
    setPassLoading(true);
    try {
      await changePassword(currentPass, newPass);
      Alert.alert('✓ Updated', 'Your password has been changed.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setExpanded(null);
    } catch (e: any) {
      const msg =
        e.code === 'auth/wrong-password' ||
        e.code === 'auth/invalid-credential'
          ? 'Current password is incorrect.'
          : e.message ?? 'Failed to change password.';
      Alert.alert('Error', msg);
    } finally {
      setPassLoading(false);
    }
  };

  // ── Section card style ─────────────────────────────────────
  const sectionCard = {
    backgroundColor: C.card,
    borderColor:     C.border,
  };

  const labelStyle  = { color: C.textSecondary };
  const titleStyle  = { color: C.text };
  const valueStyle  = { color: C.textLight };
  const dividerStyle = { backgroundColor: C.border };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: C.surface,
        borderBottomColor: C.border,
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: C.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>
          ACCOUNT SETTINGS
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Profile summary ─────────────────────────────── */}
        <View style={[styles.profileCard, sectionCard, { borderWidth: 0.5 }]}>
          <View style={[styles.avatar, { backgroundColor: C.primary }]}>
            <Text style={[styles.avatarText, { color: C.surface }]}>
              {(user?.displayName ?? 'U')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: C.text }]}>
              {user?.displayName}
            </Text>
            <Text style={[styles.profileEmail, { color: C.textSecondary }]}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* ── Appearance section ──────────────────────────── */}
        <View style={styles.group}>
          <Text style={[styles.groupLabel, labelStyle]}>APPEARANCE</Text>

          <View style={[styles.card, sectionCard]}>
            {/* Dark mode toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: isDark ? '#1a1a2e' : C.background }]}>
                  <Text style={styles.settingEmoji}>
                    {isDark ? '🌙' : '☀️'}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: C.text }]}>
                    Dark Mode
                  </Text>
                  <Text style={[styles.settingDesc, { color: C.textSecondary }]}>
                    {isDark ? 'Dark theme is on' : 'Light theme is on'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: C.border, true: C.accent }}
                thumbColor={C.surface}
              />
            </View>
          </View>
        </View>

        {/* ── Account section ──────────────────────────────── */}
        <View style={styles.group}>
          <Text style={[styles.groupLabel, labelStyle]}>ACCOUNT</Text>

          <View style={[styles.card, sectionCard]}>

            {/* ── Edit Name ── */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => toggle('name')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: C.background }]}>
                  <Text style={styles.settingEmoji}>✏️</Text>
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: C.text }]}>
                    Display Name
                  </Text>
                  <Text style={[styles.settingDesc, { color: C.textSecondary }]}>
                    {user?.displayName}
                  </Text>
                </View>
              </View>
              <Text style={[styles.chevron, {
                color: C.textLight,
                transform: [{ rotate: expanded === 'name' ? '90deg' : '0deg' }],
              }]}>›</Text>
            </TouchableOpacity>

            {/* Name form — expands inline */}
            {expanded === 'name' && (
              <View style={[styles.expandedForm, { borderTopColor: C.border }]}>
                <FormInput
                  label="NEW DISPLAY NAME"
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Julian Alexander"
                  autoCapitalize="words"
                />
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: C.primary }]}
                  onPress={handleSaveName}
                  disabled={nameLoading}
                >
                  {nameLoading ? (
                    <ActivityIndicator color={C.surface} size="small" />
                  ) : (
                    <Text style={[styles.saveBtnText, { color: C.surface }]}>
                      SAVE NAME
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Divider */}
            <View style={[styles.divider, dividerStyle]} />

            {/* ── Change Password ── */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => toggle('password')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: C.background }]}>
                  <Text style={styles.settingEmoji}>🔑</Text>
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: C.text }]}>
                    Password
                  </Text>
                  <Text style={[styles.settingDesc, { color: C.textSecondary }]}>
                    Change your password
                  </Text>
                </View>
              </View>
              <Text style={[styles.chevron, {
                color: C.textLight,
                transform: [{ rotate: expanded === 'password' ? '90deg' : '0deg' }],
              }]}>›</Text>
            </TouchableOpacity>

            {/* Password form — expands inline */}
            {expanded === 'password' && (
              <View style={[styles.expandedForm, { borderTopColor: C.border }]}>
                <FormInput
                  label="CURRENT PASSWORD"
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  placeholder="••••••••"
                  isPassword
                />
                <FormInput
                  label="NEW PASSWORD"
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholder="••••••••"
                  isPassword
                />
                <FormInput
                  label="CONFIRM NEW PASSWORD"
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  placeholder="••••••••"
                  isPassword
                />
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: C.primary }]}
                  onPress={handleSavePassword}
                  disabled={passLoading}
                >
                  {passLoading ? (
                    <ActivityIndicator color={C.surface} size="small" />
                  ) : (
                    <Text style={[styles.saveBtnText, { color: C.surface }]}>
                      CHANGE PASSWORD
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* ── Info section ─────────────────────────────────── */}
        <View style={styles.group}>
          <Text style={[styles.groupLabel, labelStyle]}>INFORMATION</Text>
          <View style={[styles.card, sectionCard]}>
            {[
              { label: 'Email',   value: user?.email ?? '—', emoji: '📧' },
              { label: 'Member Since', value: '2024', emoji: '🏆' },
              { label: 'App Version',  value: '1.0.0', emoji: 'ℹ️' },
            ].map((item, i, arr) => (
              <View key={item.label}>
                <View style={styles.infoRow}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: C.background }]}>
                      <Text style={styles.settingEmoji}>{item.emoji}</Text>
                    </View>
                    <Text style={[styles.settingTitle, { color: C.text }]}>
                      {item.label}
                    </Text>
                  </View>
                  <Text style={[styles.infoValue, { color: C.textSecondary }]}>
                    {item.value}
                  </Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={[styles.divider, dividerStyle]} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  header:  {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    borderBottomWidth: 0.5,
  },
  backText:    { fontSize: 24, width: 40 },
  headerTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 3 },
  content: {
    padding:       SPACING.md,
    gap:           SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // Profile summary
  profileCard: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING.md,
    padding:        SPACING.md,
    borderRadius:   RADIUS.md,
    borderWidth:    0.5,
  },
  avatar: {
    width:          60,
    height:         60,
    borderRadius:   30,
    alignItems:     'center',
    justifyContent: 'center',
  },
  avatarText:   { fontSize: 22, fontWeight: '700' },
  profileInfo:  { flex: 1 },
  profileName:  { fontSize: 17, fontWeight: '700' },
  profileEmail: { fontSize: 13, marginTop: 2 },

  // Groups
  group:      { gap: SPACING.xs },
  groupLabel: {
    fontSize:      10,
    letterSpacing: 2,
    fontWeight:    '700',
    marginLeft:    SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.md,
    borderWidth:  0.5,
    overflow:     'hidden',
  },

  // Setting rows
  settingRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingVertical:   SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
    flex:          1,
  },
  settingIcon: {
    width:          40,
    height:         40,
    borderRadius:   RADIUS.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  settingEmoji: { fontSize: 20 },
  settingTitle: { fontSize: 15, fontWeight: '600' },
  settingDesc:  { fontSize: 12, marginTop: 2 },
  chevron:      { fontSize: 22, fontWeight: '300' },
  divider:      { height: 0.5, marginLeft: SPACING.md + 40 + SPACING.sm },

  // Expanded form
  expandedForm: {
    padding:       SPACING.md,
    gap:           SPACING.md,
    borderTopWidth: 0.5,
  },
  saveBtn: {
    height:         50,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      SPACING.xs,
  },
  saveBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 2 },

  // Info rows
  infoRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingVertical:   SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  infoValue: { fontSize: 14 },
});