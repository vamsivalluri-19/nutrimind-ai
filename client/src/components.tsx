import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from './theme';

const buttonShadow = Platform.select({
  web: {
    boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.24)',
  },
  default: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
}) as any;

export function GlassCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.cardShell, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.03)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function MetricPill({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <GlassCard style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDelta}>{delta}</Text>
    </GlassCard>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <LinearGradient colors={[colors.primaryStrong, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}>
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(8, Math.min(value, 100))}%`, backgroundColor: color }]} />
    </View>
  );
}

export function Tag({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const toneColor = {
    default: colors.border,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  }[tone];

  return (
    <View style={[styles.tag, { borderColor: toneColor }]}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShell: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.textSoft,
    marginTop: 4,
    lineHeight: 20,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    marginBottom: spacing.md,
  },
  metricLabel: {
    color: colors.textSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 10,
  },
  metricDelta: {
    color: colors.primary,
    marginTop: 6,
    fontSize: 12,
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    alignSelf: 'stretch',
    ...buttonShadow,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ translateY: 1 }],
  },
  buttonGradient: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#041019',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tagText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
