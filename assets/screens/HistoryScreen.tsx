import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SectionList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { commonStyles, colors, spacing } from '../styles/colors';
import { ScannedItem } from '../types';
import { getScannerHistory } from '../data/scannerDummyData';
import AppHeader from '../components/AppHeader';
import { formatDate, formatTime } from '../utils/helpers';

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen = ({ navigation }: HistoryScreenProps) => {
  const [history, setHistory] = useState<ScannedItem[]>(getScannerHistory());
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  useFocusEffect(
    useCallback(() => {
      // Refresh history when screen is focused
      setHistory(getScannerHistory());
    }, []),
  );

  const getFilteredHistory = () => {
    const now = Date.now();
    const oneDay = 86400000;
    const oneWeek = oneDay * 7;

    return history.filter(item => {
      const age = now - item.timestamp;

      if (filter === 'today') return age <= oneDay;
      if (filter === 'week') return age <= oneWeek;
      return true;
    });
  };

  const groupByDate = (items: ScannedItem[]) => {
    const grouped: Record<string, ScannedItem[]> = {};

    items.forEach(item => {
      const dateKey = formatDate(item.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });

    return Object.entries(grouped).map(([date, dateItems]) => ({
      title: date,
      data: dateItems,
    }));
  };

  const handleItemPress = (item: ScannedItem) => {
    navigation.navigate('ScanResult', { barcode: item.data });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistory([]);
          },
        },
      ],
    );
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert('Delete Item', 'Remove this scan from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setHistory(history.filter(item => item.id !== id));
        },
      },
    ]);
  };

  const filteredHistory = getFilteredHistory();
  const groupedHistory = groupByDate(filteredHistory);

  const renderItem = ({ item }: { item: ScannedItem }) => (
    <TouchableOpacity
      style={commonStyles.card}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.historyItem}>
        {item.details?.image ? (
          <Image source={item.details.image} style={styles.itemThumb} />
        ) : (
          <View style={styles.itemIcon}>
            <Icon
              name={item.type === 'QR' ? 'qrcode' : 'barcode'}
              size={24}
              color={colors.primary}
            />
          </View>
        )}

        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>
            {item.details?.productName || 'Unknown Product'}
          </Text>
          <Text style={styles.itemCategory}>
            {item.details?.category || 'No category'} •{' '}
            {item.details?.manufacturer || 'Unknown'}
          </Text>
          {item.details?.serialNumber && (
            <Text style={styles.itemSerial}>
              SN: {item.details.serialNumber}
            </Text>
          )}
          <View style={styles.itemFooter}>
            <Text style={styles.itemTime}>{formatTime(item.timestamp)}</Text>
            <View
              style={[
                styles.typeBadge,
                item.type === 'QR' ? styles.qrBadge : styles.barcodeBadge,
              ]}
            >
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemActions}>
          {item.details?.price && (
            <Text style={styles.itemPrice}>
              ${item.details.price.toFixed(2)}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => handleDeleteItem(item.id)}
            style={styles.deleteButton}
          >
            <Icon name="delete-outline" size={18} color={colors.error} />
          </TouchableOpacity>
          <Icon name="chevron-right" size={20} color={colors.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: any }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <AppHeader
        title="Scan History"
        subtitle="Review your verification trail"
      />
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'today', 'week'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === f && styles.filterButtonTextActive,
              ]}
            >
              {f === 'all' ? 'All' : f === 'today' ? 'Today' : 'This Week'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* History List or Empty State */}
      {filteredHistory.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          scrollEnabled={false}
        >
          <Icon name="history" size={80} color={colors.muted} />
          <Text style={styles.emptyText}>No scan history</Text>
          <Text style={styles.emptySubtext}>Your scans will appear here</Text>
        </ScrollView>
      ) : (
        <SectionList
          sections={groupedHistory}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}

      {/* Bottom Actions */}
      {history.length > 0 && (
        <View style={styles.bottomActionsContainer}>
          <TouchableOpacity
            style={[commonStyles.button, { backgroundColor: colors.error }]}
            onPress={handleClearHistory}
          >
            <Icon
              name="trash-can-outline"
              size={20}
              color={colors.surface}
              style={{ marginRight: spacing.sm }}
            />
            <Text style={commonStyles.buttonText}>Clear All History</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: colors.surface,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...commonStyles.subheading,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    ...commonStyles.label,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray50,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...commonStyles.subheading,
    marginBottom: spacing.xs,
  },
  itemCategory: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  itemSerial: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  itemTime: {
    color: colors.muted,
    fontSize: 11,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qrBadge: {
    backgroundColor: colors.secondary,
  },
  barcodeBadge: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  itemPrice: {
    fontWeight: '600',
    color: colors.success,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  bottomActionsContainer: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});

export default HistoryScreen;
