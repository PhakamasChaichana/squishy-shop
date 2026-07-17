import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, useColorScheme, Platform, Alert, useWindowDimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { Colors, Spacing } from '@/constants/theme';

export default function ProductsScreen() {
  const { products, updateStock, deleteProduct } = useCart();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const { width } = useWindowDimensions();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Animals', 'Fruits & Animals', 'Bakery'];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate columns based on width
  let numColumns = 1;
  if (width >= 900) {
    numColumns = 3;
  } else if (width >= 600) {
    numColumns = 2;
  }

  const cardWidth = `calc((100% - ${(numColumns - 1) * 16}px) / ${numColumns})`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <Header 
          showSearch={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <View style={styles.mainLayout}>
          <View style={styles.productsColumn}>
            {/* Category Selector */}
            <View style={styles.filterBar}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoriesContainer}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={[
                      styles.categoryBtn,
                      {
                        backgroundColor: selectedCategory === category ? '#FF69B4' : colors.backgroundElement,
                      },
                    ]}
                  >
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: selectedCategory === category ? '#FFFFFF' : colors.text,
                      }}
                    >
                      {category}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <ScrollView 
              contentContainerStyle={styles.productsScrollContent} 
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.catalogHeader}>
                <ThemedText type="smallBold" style={styles.resultsText}>
                  Inventory Listing ({filteredProducts.length} items found) 📦
                </ThemedText>
              </View>

              {filteredProducts.length === 0 ? (
                <View style={styles.noResults}>
                  <ThemedText style={styles.noResultsIcon}>😿</ThemedText>
                  <ThemedText type="smallBold">No products found in warehouse.</ThemedText>
                  <ThemedText type="small" style={{ color: colors.textSecondary }}>
                    Try searching for something else or changing categories.
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.productsGrid}>
                  {filteredProducts.map((product) => {
                    const isLowStock = (product.stock || 0) < 10;
                    return (
                      <ThemedView 
                        key={product.id} 
                        type="backgroundElement" 
                        style={[
                          styles.productCard, 
                          { 
                            width: (Platform.OS === 'web' ? cardWidth : '100%') as any,
                            borderColor: isLowStock ? '#FF4D4D' : colors.backgroundSelected,
                            borderWidth: 1
                          }
                        ]}
                      >
                        <View style={styles.imageWrapper}>
                          <Image
                            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                            style={styles.productImage}
                            resizeMode="cover"
                          />
                          <View style={[styles.stockBadge, { backgroundColor: isLowStock ? '#FF4D4D' : '#00C851' }]}>
                            <ThemedText type="smallBold" style={styles.stockBadgeText}>
                              {isLowStock ? `⚠️ Stock: ${product.stock}` : `Stock: ${product.stock}`}
                            </ThemedText>
                          </View>
                        </View>

                        <View style={styles.productInfo}>
                          <View style={styles.ratingRow}>
                            <ThemedText type="small" style={[styles.categoryBadge, { color: colors.textSecondary }]}>
                              {product.category}
                            </ThemedText>
                            <View style={styles.ratingStars}>
                              <ThemedText type="smallBold" style={{ color: '#FF69B4' }}>${product.price.toFixed(2)}</ThemedText>
                            </View>
                          </View>

                          <ThemedText type="smallBold" style={styles.productName}>
                            {product.name}
                          </ThemedText>

                          <ThemedText type="small" numberOfLines={2} style={[styles.productDesc, { color: colors.textSecondary }]}>
                            {product.description}
                          </ThemedText>

                          <View style={[styles.specsBox, { backgroundColor: colors.backgroundSelected }]}>
                            <ThemedText type="small" style={styles.specText}>
                              👃 Scent: <ThemedText type="smallBold">{product.scent}</ThemedText>
                            </ThemedText>
                            <ThemedText type="small" style={styles.specText}>
                              ⏱️ Rise Time: <ThemedText type="smallBold">{product.riseTime}</ThemedText>
                            </ThemedText>
                          </View>

                          {/* Stock Controls & Actions */}
                          <View style={styles.cardFooter}>
                            <View style={styles.stockAdjuster}>
                              <TouchableOpacity
                                onPress={() => updateStock(product.id, -1)}
                                style={[styles.qtyBtn, { backgroundColor: colors.backgroundSelected }]}
                              >
                                <ThemedText type="smallBold">-</ThemedText>
                              </TouchableOpacity>
                              <ThemedText type="smallBold" style={styles.qtyText}>
                                {product.stock}
                              </ThemedText>
                              <TouchableOpacity
                                onPress={() => updateStock(product.id, 1)}
                                style={[styles.qtyBtn, { backgroundColor: colors.backgroundSelected }]}
                              >
                                <ThemedText type="smallBold">+</ThemedText>
                              </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                              style={styles.deleteBtn}
                              onPress={() => {
                                const confirmDelete = () => {
                                  deleteProduct(product.id);
                                };
                                if (Platform.OS === 'web') {
                                  if (window.confirm(`Are you sure you want to remove ${product.name} from inventory?`)) {
                                    confirmDelete();
                                  }
                                } else {
                                  Alert.alert('Confirm Delete', `Are you sure you want to delete ${product.name}?`, [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Delete', style: 'destructive', onPress: confirmDelete },
                                  ]);
                                }
                              }}
                            >
                              <ThemedText style={styles.deleteBtnText}>🗑️</ThemedText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </ThemedView>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
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
  mainLayout: {
    flex: 1,
  },
  productsColumn: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  filterBar: {
    paddingVertical: Spacing.two,
  },
  categoriesContainer: {
    gap: Spacing.two,
    alignItems: 'center',
    height: 44,
  },
  categoryBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsScrollContent: {
    paddingBottom: 100,
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  resultsText: {
    fontSize: 14,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.one,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: Spacing.two,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  productCard: {
    minWidth: 260,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: Spacing.two,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  stockBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  productInfo: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: 11,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  specsBox: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.half,
  },
  specText: {
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F3',
    paddingTop: Spacing.two,
  },
  stockAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: Spacing.one,
  },
  deleteBtnText: {
    fontSize: 16,
  },
});
