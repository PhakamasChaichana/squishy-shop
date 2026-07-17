import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, useColorScheme, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { Colors, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { products, updateStock } = useCart();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  // Inventory calculations
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);
  const lowStockItems = products.filter((p) => (p.stock || 0) < 10);

  // Category counts based on stock
  const categories = ['Bakery', 'Animals', 'Fruits & Animals'];
  const categoryStock = categories.reduce((acc, cat) => {
    acc[cat] = products
      .filter((p) => p.category === cat)
      .reduce((sum, p) => sum + (p.stock || 0), 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <Header />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Welcome Banner */}
          <View style={[styles.welcomeBanner, { backgroundColor: scheme === 'dark' ? '#2c1e27' : '#FFF0F5' }]}>
            <View style={styles.bannerTextContainer}>
              <ThemedText style={styles.bannerBadge}>📊 System Active</ThemedText>
              <ThemedText style={styles.bannerTitle}>Squishy Central Office</ThemedText>
              <ThemedText style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
                Real-time stock analytics, catalog valuations, and distribution control console.
              </ThemedText>
            </View>
            {!isMobile && (
              <View style={styles.bannerImageContainer}>
                <Image 
                  source={require('@/assets/images/favicon.png')} 
                  style={styles.bannerImage} 
                  resizeMode="contain" 
                />
              </View>
            )}
          </View>

          {/* Key Metrics Grid */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>Warehouse Metrics 📈</ThemedText>
            <View style={[styles.metricsGrid, { flexDirection: isMobile ? 'column' : 'row' }]}>
              {/* Metric 1: Total Value */}
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <ThemedText style={styles.metricIcon}>💰</ThemedText>
                <ThemedText type="small" style={{ color: colors.textSecondary }}>Inventory Valuation</ThemedText>
                <ThemedText type="title" style={[styles.metricValue, { color: '#FF69B4' }]}>
                  ${totalValue.toFixed(2)}
                </ThemedText>
              </ThemedView>

              {/* Metric 2: Total Stock */}
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <ThemedText style={styles.metricIcon}>🧸</ThemedText>
                <ThemedText type="small" style={{ color: colors.textSecondary }}>Total Stock</ThemedText>
                <ThemedText type="title" style={styles.metricValue}>
                  {totalStock} <ThemedText type="small">units</ThemedText>
                </ThemedText>
              </ThemedView>

              {/* Metric 3: Total Types */}
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <ThemedText style={styles.metricIcon}>🗂️</ThemedText>
                <ThemedText type="small" style={{ color: colors.textSecondary }}>Product Skus</ThemedText>
                <ThemedText type="title" style={styles.metricValue}>
                  {totalProducts} <ThemedText type="small">types</ThemedText>
                </ThemedText>
              </ThemedView>
            </View>
          </View>

          {/* Quick Action Navigation */}
          <View style={styles.sectionContainer}>
            <View style={[styles.quickActionsContainer, { flexDirection: isMobile ? 'column' : 'row', gap: Spacing.two }]}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#FF69B4' }]}
                onPress={() => router.push('/explore')}
              >
                <ThemedText style={styles.actionBtnText}>View Catalog & Edit Stock 📦</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: colors.backgroundSelected }]}
                onPress={() => router.push('/inventory')}
              >
                <ThemedText style={[styles.actionBtnText, { color: colors.text }]}>Add New Product ➕</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Low Stock Alerts */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Low Stock Warnings {lowStockItems.length > 0 ? `⚠️ (${lowStockItems.length})` : '✅'}
              </ThemedText>
            </View>

            {lowStockItems.length === 0 ? (
              <ThemedView type="backgroundElement" style={styles.emptyAlertBox}>
                <ThemedText style={{ fontSize: 24 }}>🎉</ThemedText>
                <ThemedText type="smallBold" style={{ color: colors.textSecondary }}>
                  All items are well stocked! No low-stock alerts.
                </ThemedText>
              </ThemedView>
            ) : (
              <View style={styles.alertsList}>
                {lowStockItems.map((item) => (
                  <ThemedView key={item.id} type="backgroundElement" style={[styles.alertRow, { borderColor: '#FF4D4D' }]}>
                    <View style={styles.alertItemLeft}>
                      <Image source={item.image} style={styles.alertThumbnail} />

                      <Image
                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                        style={styles.alertThumbnail}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1, marginLeft: Spacing.two }}>
                        <ThemedText type="smallBold" numberOfLines={1}>{item.name}</ThemedText>
                        <ThemedText type="small" style={{ color: '#FF4D4D', fontWeight: 'bold' }}>
                          Only {item.stock} left in warehouse
                        </ThemedText>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.restockBtn}
                      onPress={() => updateStock(item.id, 10)}
                    >
                      <ThemedText style={styles.restockBtnText}>+10 Restock 📥</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                ))}
              </View>
            )}
          </View>

          {/* Category Distribution */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>Stock Distribution by Category 📊</ThemedText>
            <ThemedView type="backgroundElement" style={styles.distributionBox}>
              {categories.map((cat) => {
                const count = categoryStock[cat] || 0;
                const percentage = totalStock > 0 ? (count / totalStock) * 100 : 0;
                return (
                  <View key={cat} style={styles.distRow}>
                    <View style={styles.distInfoRow}>
                      <ThemedText type="smallBold">{cat}</ThemedText>
                      <ThemedText type="smallBold" style={{ color: colors.textSecondary }}>
                        {count} units ({percentage.toFixed(0)}%)
                      </ThemedText>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.backgroundSelected }]}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${percentage}%`, 
                            backgroundColor: cat === 'Bakery' ? '#FFD700' : cat === 'Animals' ? '#ADD8E6' : '#FF69B4'
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </ThemedView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeBanner: {
    margin: Spacing.three,
    borderRadius: Spacing.four,
    padding: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerTextContainer: {
    flex: 1.2,
    alignItems: 'flex-start',
    gap: Spacing.one,
  },
  bannerBadge: {
    backgroundColor: '#FF69B4',
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF1493',
  },
  bannerSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  bannerImageContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: 100,
    height: 100,
  },
  sectionContainer: {
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.two,
  },
  metricsGrid: {
    gap: Spacing.three,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.one,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: Spacing.half,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    marginTop: Spacing.one,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyAlertBox: {
    padding: Spacing.five,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  alertsList: {
    gap: Spacing.two,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  alertItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  restockBtn: {
    backgroundColor: '#FF69B4',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 15,
  },
  restockBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  distributionBox: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  distRow: {
    gap: Spacing.one,
  },
  distInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
