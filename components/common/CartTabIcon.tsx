import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';

interface Props {
  color: string;
  size: number;
}

export default function CartTabIcon({ color, size }: Props) {
  const count = useCartStore((state) => state.totalItems());

  return (
    <View style={styles.container}>
      <Ionicons name="cart-outline" size={size} color={color} />

      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.text}>
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
  },

  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },

  text: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
});