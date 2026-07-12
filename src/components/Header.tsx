import React from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, Platform, TextInput } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  cartCount?: number;
  showSearch?: boolean;
  onSearchChange?: (text: string) => void;
  searchValue?: string;
}

export default function Header({
  showSearch = false,
  onSearchChange,
  searchValue = '',
}: HeaderProps) {
  const { products } = useCart();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => (p.stock || 0) < 10).length;

  return (
    <ThemedView type="background" style={[styles.headerContainer, { borderBottomColor: colors.backgroundElement }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
          <ThemedText style={styles.logoIcon}>🌸</ThemedText>
          <ThemedText type="smallBold" style={styles.logoText}>
            Squishy World
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/explore')} style={styles.cartButton}>
          <View style={styles.cartIconContainer}>
            <ThemedText style={styles.cartIcon}>📦</ThemedText>
            {lowStockCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: '#FF8C00' }]}>
                <ThemedText type="smallBold" style={styles.badgeText}>
                  ⚠️{lowStockCount}
                </ThemedText>
              </View>
            ) : (
              <View style={styles.badge}>
                <ThemedText type="smallBold" style={styles.badgeText}>
                  {totalStock}
                </ThemedText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search cute squishies... 🍓"
            placeholderTextColor={colors.textSecondary}
            value={searchValue}
            onChangeText={onSearchChange}
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.backgroundElement,
                color: colors.text,
                borderColor: colors.backgroundSelected,
              },
            ]}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Platform.OS === 'ios' ? 44 : Spacing.three,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
    width: '100%',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 20,
    color: '#FF69B4', // Sweet pink for squishy theme!
    fontFamily: Platform.OS === 'web' ? 'var(--font-rounded)' : 'normal',
  },
  desktopNav: {
    flexDirection: 'row',
    gap: Spacing.four,
    alignItems: 'center',
  },
  navLink: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  cartButton: {
    padding: Spacing.one,
  },
  cartIconContainer: {
    position: 'relative',
    padding: Spacing.one,
  },
  cartIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    paddingHorizontal: 4,
    height: 18,
    minWidth: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: 'bold',
  },
  searchRow: {
    marginTop: Spacing.two,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: Spacing.four,
    borderWidth: 1,
    fontSize: 14,
  },
});
