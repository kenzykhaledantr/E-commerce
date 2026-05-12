// src/screens/main/SavedAddressesScreen.tsx

import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../../../api/useAddresses';
import AddressCard     from '../../../components/address/AddressCard';
import AddressFormModal from '../../../components/address/AddressFormModal';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import type { Address } from '../../../types';
import { useTheme } from '../../../hook/useTheme';
import CustomAlert      from '../../../components/common/CustomAlert';
import { useCustomAlert } from '../../../hook/useCustomAlert';


export default function SavedAddressesScreen() {
  const navigation = useNavigation<any>();

  const { data: addresses, isLoading } = useAddresses();
  const addAddress    = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault    = useSetDefaultAddress();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { colors: C } = useTheme();
  const { alertState, hideAlert, showError } = useCustomAlert();

  // ── Open modal for new address ─────────────────────────────
  const handleAddNew = () => {
    setEditingAddress(null);
    setModalVisible(true);
  };

  // ── Open modal for editing ─────────────────────────────────
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setModalVisible(true);
  };

  // ── Save (add or update) ───────────────────────────────────
  // src/screens/main/SavedAddressesScreen.tsx
// Update handleSave to show the actual error message

const handleSave = async (formData: Omit<Address, 'id'>) => {
  try {
    if (editingAddress) {
      await updateAddress.mutateAsync({
        id:      editingAddress.id,
        updates: formData,
      });
    } else {
      await addAddress.mutateAsync(formData);
    }
    setModalVisible(false);
    setEditingAddress(null);
  } catch (error: any) {
    showError('Could Not Save', error.message ?? 'Please try again.');
  }
};

  const isSaving =
    addAddress.isPending || updateAddress.isPending;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <CustomAlert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.surface }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>SAVED ADDRESSES</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: C.primary }]}
          onPress={handleAddNew}
        >
          <Text style={[styles.addBtnText, { color: C.background }]}>+ ADD</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      ) : (
        <FlatList
          data={addresses ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={56} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No saved addresses</Text>
              <Text style={styles.emptySubtitle}>
                Add an address for faster checkout
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={handleAddNew}
              >
                <Text style={styles.emptyBtnText}>+ ADD YOUR FIRST ADDRESS</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteAddress.mutate(item.id)}
              onSetDefault={() => setDefault.mutate(item.id)}
            />
          )}
          ListFooterComponent={
            addresses && addresses.length > 0 ? (
              <TouchableOpacity
                style={styles.addNewBtn}
                onPress={handleAddNew}
              >
                <Ionicons name="add-circle-outline" size={22} color={COLORS.textSecondary} />
                <Text style={styles.addNewText}>Add New Address</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      {/* Address Form Modal */}
      <AddressFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingAddress(null);
        }}
        onSave={handleSave}
        initialData={editingAddress}
        isSaving={isSaving}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:  SPACING.sm,
    backgroundColor:  COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 40 },
  backText: { fontSize: 24, color: COLORS.textPrimary },
  headerTitle: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 3,
    color:         COLORS.textPrimary,
  },
  addBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical:   6,
    backgroundColor:  COLORS.primary,
    borderRadius:     RADIUS.full,
  },
  addBtnText: {
    fontSize:      11,
    fontWeight:    '700',
    color:         COLORS.white,
    letterSpacing: 1,
  },
  listContent: {
    padding:       SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  separator: { height: SPACING.sm },
  loadingContainer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            SPACING.md,
  },
  loadingText: { color: COLORS.textSecondary, fontSize: 14 },
  emptyContainer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingTop:     80,
    gap:            SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon:     { fontSize: 56, marginBottom: SPACING.sm },
  emptyTitle: {
    fontSize:   20,
    fontWeight: '700',
    color:      COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize:   14,
    color:      COLORS.textSecondary,
    textAlign:  'center',
  },
  emptyBtn: {
    marginTop:       SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius:    RADIUS.md,
  },
  emptyBtnText: {
    color:         COLORS.white,
    fontWeight:    '700',
    fontSize:      12,
    letterSpacing: 2,
  },
  addNewBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            SPACING.sm,
    marginTop:      SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth:    1.5,
    borderColor:    COLORS.border,
    borderRadius:   RADIUS.md,
    borderStyle:    'dashed',
    backgroundColor: COLORS.white,
  },
  addNewIcon: { fontSize: 20, color: COLORS.textSecondary },
  addNewText: {
    fontSize:   15,
    fontWeight: '600',
    color:      COLORS.textSecondary,
  },
});