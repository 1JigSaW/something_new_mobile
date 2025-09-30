import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles';

type PageHeaderProps = {
  title: string,
  subtitle?: string,
  right?: React.ReactNode,
  left?: React.ReactNode,
  style?: ViewStyle,
};

export default function PageHeader({ title, subtitle, right, left, style }: PageHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.row}>
        <View style={styles.left}>{left}</View>
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    width: 64,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  right: {
    width: 64,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});


