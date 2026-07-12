import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, useColorScheme, Platform, Alert, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { Colors, Spacing } from '@/constants/theme';

export default function InventoryScreen() {
  const { products, addProduct, deleteProduct } = useCart();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const { width } = useWindowDimensions();
  
  const isWideScreen = width >= 768;
  const isMobileCatalog = width < 600;

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [scent, setScent] = useState('');
  const [riseTime, setRiseTime] = useState('');
  const [category, setCategory] = useState('Bakery'); // Default category
  const [stock, setStock] = useState('10'); // Default starting stock

  const handleAddProduct = () => {
    if (!name.trim() || !price.trim() || !description.trim() || !scent.trim() || !riseTime.trim() || !stock.trim()) {
      const errorMsg = 'Please fill out all fields! 🌸';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Incomplete Form', errorMsg);
      }
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      const errorMsg = 'Please enter a valid price greater than 0! 🌸';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Invalid Price', errorMsg);
      }
      return;
    }

    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      const errorMsg = 'Please enter a valid stock amount! 🌸';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Invalid Stock', errorMsg);
      }
      return;
    }

    // Call addProduct from context
    addProduct({
      name,
      price: priceNum,
      description,
      scent,
      riseTime,
      category,
      stock: stockNum,
    });

    const successMsg = `Successfully added "${name}" to the store inventory! 🥳🌸`;
    if (Platform.OS === 'web') {
      window.alert(successMsg);
    } else {
      Alert.alert('Success', successMsg);
    }

    // Reset form
    setName('');
    setPrice('');
    setDescription('');
    setScent('');
    setRiseTime('');
    setStock('10');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <Header />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.titleText}>
              Inventory Manager 📊
            </ThemedText>
            <ThemedText type="small" style={{ color: colors.textSecondary }}>
              Add new items and monitor your Squishy Store stock.
            </ThemedText>
          </View>

          <View style={[styles.layoutRow, { flexDirection: isWideScreen ? 'row' : 'column' }]}>
            {/* Form Column */}
            <ThemedView type="backgroundElement" style={[styles.formColumn, { flex: isWideScreen ? 1 : undefined }]}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Add New Squishy ➕
              </ThemedText>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold">Product Name</ThemedText>
                <TextInput
                  placeholder="e.g. Honey Bear Squishy"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                  style={[styles.input, { borderColor: colors.backgroundSelected, color: colors.text }]}
                />
              </View>

              <View style={[styles.formRow, { flexDirection: isMobileCatalog ? 'column' : 'row', gap: Spacing.two }]}>
                <View style={[styles.formGroup, { flex: isMobileCatalog ? undefined : 1 }]}>
                  <ThemedText type="smallBold">Price ($)</ThemedText>
                  <TextInput
                    placeholder="e.g. 10.99"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    style={[styles.input, { borderColor: colors.backgroundSelected, color: colors.text }]}
                  />
                </View>

                <View style={[styles.formGroup, { flex: isMobileCatalog ? undefined : 1 }]}>
                  <ThemedText type="smallBold">Starting Stock</ThemedText>
                  <TextInput
                    placeholder="e.g. 50"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                    style={[styles.input, { borderColor: colors.backgroundSelected, color: colors.text }]}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold">Category</ThemedText>
                <View style={styles.categoryRadioGroup}>
                  {['Bakery', 'Animals', 'Fruits & Animals'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.categoryRadioBtn,
                        {
                          backgroundColor: category === cat ? '#FF69B4' : colors.backgroundSelected,
                        },
                      ]}
                    >
                      <ThemedText
                        type="smallBold"
                        style={{ color: category === cat ? '#FFFFFF' : colors.text }}
                      >
                        {cat}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold">Scent Profile</ThemedText>
                <TextInput
                  placeholder="e.g. Honey / Sweet Peach 🍑"
                  placeholderTextColor={colors.textSecondary}
                  value={scent}
                  onChangeText={setScent}
                  style={[styles.input, { borderColor: colors.backgroundSelected, color: colors.text }]}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold">Rise Time (seconds)</ThemedText>
                <TextInput
                  placeholder="e.g. 8 - 10 seconds"
                  placeholderTextColor={colors.textSecondary}
                  value={riseTime}
                  onChangeText={setRiseTime}
                  style={[styles.input, { borderColor: colors.backgroundSelected, color: colors.text }]}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold">Description</ThemedText>
                <TextInput
                  placeholder="Provide a cute description..."
                  placeholderTextColor={colors.textSecondary}
                  multiline={true}
                  numberOfLines={3}
                  value={description}
                  onChangeText={setDescription}
                  style={[
                    styles.input,
                    styles.textArea,
                    { borderColor: colors.backgroundSelected, color: colors.text },
                  ]}
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddProduct}>
                <ThemedText style={styles.submitBtnText}>Add Product to Catalog 🚀</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* List Column */}
            <View style={[styles.listColumn, { flex: isWideScreen ? 1.5 : undefined }]}>
              <ThemedText type="smallBold" style={[styles.sectionTitle, { paddingLeft: Spacing.one }]}>
                Store Catalog ({products.length} Items) 🏷️
              </ThemedText>

              {products.length === 0 ? (
                <ThemedView type="backgroundElement" style={styles.emptyList}>
                  <ThemedText style={{ fontSize: 32 }}>📦</ThemedText>
                  <ThemedText type="smallBold" style={{ color: colors.textSecondary }}>
                    No products left in the store inventory.
                  </ThemedText>
                </ThemedView>
              ) : isMobileCatalog ? (
                /* Mobile Card List (Stops Text Overlap) */
                <View style={styles.mobileList}>
                  {products.map((p) => {
                    const isLowStock = (p.stock || 0) < 10;
                    return (
                      <ThemedView key={p.id} type="backgroundElement" style={styles.mobileRow}>
                        <Image source={p.image} style={styles.mobileThumbnail} />
                        <View style={styles.mobileRowContent}>
                          <ThemedText type="smallBold" numberOfLines={1}>
                            {p.name}
                          </ThemedText>
                          <ThemedText type="small" style={{ color: colors.textSecondary, fontSize: 11 }}>
                            Cat: {p.category} | Scent: {p.scent}
                          </ThemedText>
                          <View style={styles.mobileRowMeta}>
                            <ThemedText type="smallBold" style={{ color: '#FF69B4' }}>
                              ${p.price.toFixed(2)}
                            </ThemedText>
                            <ThemedView type="backgroundSelected" style={styles.mobileStockTag}>
                              <ThemedText type="smallBold" style={{ fontSize: 10, color: isLowStock ? '#FF4D4D' : colors.text }}>
                                {isLowStock ? `⚠️ Stock: ${p.stock}` : `Stock: ${p.stock}`}
                              </ThemedText>
                            </ThemedView>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.mobileDeleteBtn}
                          onPress={() => {
                            const confirmDelete = () => {
                              deleteProduct(p.id);
                            };
                            if (Platform.OS === 'web') {
                              if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                                confirmDelete();
                              }
                            } else {
                              Alert.alert('Confirm Delete', `Are you sure you want to delete ${p.name}?`, [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: confirmDelete },
                              ]);
                            }
                          }}
                        >
                          <ThemedText style={styles.deleteBtnText}>🗑️</ThemedText>
                        </TouchableOpacity>
                      </ThemedView>
                    );
                  })}
                </View>
              ) : (
                /* Table Layout for Desktop Web */
                <View style={styles.table}>
                  <ThemedView type="backgroundSelected" style={styles.tableHeaderRow}>
                    <ThemedText type="smallBold" style={[styles.tableHeaderCell, { flex: 1.2 }]}>
                      Product
                    </ThemedText>
                    <ThemedText type="smallBold" style={[styles.tableHeaderCell, { flex: 0.8 }]}>
                      Category
                    </ThemedText>
                    <ThemedText type="smallBold" style={[styles.tableHeaderCell, { flex: 0.5 }]}>
                      Price
                    </ThemedText>
                    <ThemedText type="smallBold" style={[styles.tableHeaderCell, { flex: 0.5, textAlign: 'center' }]}>
                      Stock
                    </ThemedText>
                    <ThemedText type="smallBold" style={[styles.tableHeaderCell, { flex: 0.4, textAlign: 'center' }]}>
                      Delete
                    </ThemedText>
                  </ThemedView>

                  {products.map((p) => (
                    <ThemedView key={p.id} type="backgroundElement" style={styles.tableRow}>
                      <View style={[styles.tableCell, { flex: 1.2, flexDirection: 'row', alignItems: 'center', gap: Spacing.two }]}>
                        <Image source={p.image} style={styles.thumbnail} />
                        <View style={{ flex: 1 }}>
                          <ThemedText type="smallBold" numberOfLines={1}>
                            {p.name}
                          </ThemedText>
                          <ThemedText type="small" numberOfLines={1} style={{ color: colors.textSecondary, fontSize: 10 }}>
                            Scent: {p.scent}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.8 }]}>
                        <ThemedText type="small">{p.category}</ThemedText>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.5 }]}>
                        <ThemedText type="smallBold" style={{ color: '#FF69B4' }}>
                          ${p.price.toFixed(2)}
                        </ThemedText>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.5, alignItems: 'center', justifyContent: 'center' }]}>
                        <ThemedText type="smallBold" style={{ color: (p.stock || 0) < 10 ? '#FF4D4D' : colors.text }}>
                          {p.stock}
                        </ThemedText>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.4, alignItems: 'center', justifyContent: 'center' }]}>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => {
                            const confirmDelete = () => {
                              deleteProduct(p.id);
                            };
                            if (Platform.OS === 'web') {
                              if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                                confirmDelete();
                              }
                            } else {
                              Alert.alert('Confirm Delete', `Are you sure you want to delete ${p.name}?`, [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: confirmDelete },
                              ]);
                            }
                          }}
                        >
                          <ThemedText style={styles.deleteBtnText}>🗑️</ThemedText>
                        </TouchableOpacity>
                      </View>
                    </ThemedView>
                  ))}
                </View>
              )}
            </View>
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
  titleContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  layoutRow: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  formColumn: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.two,
  },
  formRow: {
    width: '100%',
  },
  formGroup: {
    gap: Spacing.one,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  textArea: {
    height: 64,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  categoryRadioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  categoryRadioBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 15,
  },
  submitBtn: {
    backgroundColor: '#FF69B4',
    paddingVertical: Spacing.three,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: Spacing.two,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listColumn: {
    gap: Spacing.two,
  },
  emptyList: {
    padding: Spacing.six,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  table: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E1E6',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E1E6',
  },
  tableHeaderCell: {
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F3',
  },
  tableCell: {
    justifyContent: 'center',
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  deleteBtn: {
    padding: Spacing.one,
  },
  deleteBtnText: {
    fontSize: 14,
  },
  /* Mobile listing styles */
  mobileList: {
    gap: Spacing.two,
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
  },
  mobileThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  mobileRowContent: {
    flex: 1,
    marginLeft: Spacing.three,
    gap: Spacing.half,
  },
  mobileRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  mobileStockTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half / 2,
    borderRadius: 8,
  },
  mobileDeleteBtn: {
    padding: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
