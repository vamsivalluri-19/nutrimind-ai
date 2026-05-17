import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, PrimaryButton, SectionHeader, Tag } from './components';
import { api } from './services/api';
import { colors, spacing } from './theme';
import { useNavigation } from '@react-navigation/native';

export function ScannerScreen() {
  const navigation = useNavigation<any>();
  const [scanResult, setScanResult] = React.useState(null);
  const [status, setStatus] = React.useState('No photo uploaded yet. Upload a photo to analyze.');
  const [loading, setLoading] = React.useState(false);

  const analyzeDemoFrame = async () => {
    // For web we require an uploaded photo for real analysis.
    // Redirect to the upload flow instead of using a canned demo.
    handleUpload();
  };

  const handleUpload = async () => {
    if (loading) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      setLoading(true);
      setStatus('Uploading photo...');
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(',')[1];
          const result = await api.analyzeFood({ imageData: base64 });
          setScanResult(result);
          setStatus(`Analyzed ${result.food}`);
        } catch (e) {
          setScanResult(null);
          setStatus('Upload failed. Please try again with a clear photo.');
          try { (window as any).alert?.('Upload failed. Please try a different photo.'); } catch {}
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>NutriMind AI</Text>
        <Text style={styles.heroTitle}>AI camera scanner</Text>
        <Text style={styles.heroSubtitle}>Live camera capture runs on mobile. The web build shows a safe fallback analyzer.</Text>
      </View>

      <GlassCard style={styles.sectionCard}>
        <View style={styles.cameraMock}>
          <LinearGradient colors={['rgba(84,225,193,0.18)', 'rgba(6,17,31,0.88)']} style={styles.cameraGradient} />
          <View style={styles.cameraOverlayContent}>
            <Text style={styles.cameraLabel}>{status}</Text>
            <Text style={styles.cameraHint}>Use the mobile app for a real camera feed.</Text>
          </View>
        </View>
        <View style={styles.cameraActions}>
          <PrimaryButton label={loading ? 'Analyzing...' : 'Analyze photo'} onPress={analyzeDemoFrame} />
          <PrimaryButton label={loading ? 'Uploading...' : 'Upload photo'} onPress={handleUpload} />
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Food recognition output" subtitle="Upload a photo to analyze and get results based on your profile." />
        <View style={{ marginTop: 8 }}>
          {scanResult ? (
            <>
              <Text style={styles.codeBlock}>Food: {scanResult.food}</Text>
              <Text style={styles.codeBlock}>Calories: {scanResult.calories}</Text>
              <Text style={styles.codeBlock}>Portion: {scanResult.portionSize}</Text>
              <Text style={styles.codeBlock}>Health score: {scanResult.healthScore}</Text>
              <Text style={styles.codeBlock}>Nutrients: {scanResult.nutrients ? `P ${scanResult.nutrients.protein}g • C ${scanResult.nutrients.carbs}g • F ${scanResult.nutrients.fat}g` : '—'}</Text>
              <Text style={styles.codeBlock}>Dataset: {scanResult.dataset ?? 'unknown'}</Text>
              <Text style={styles.codeBlock}>Models: {(scanResult.models ?? []).join(', ')}</Text>
              <View style={styles.tagRow}>
                {(scanResult.warnings ?? []).map((w) => (
                  <Tag key={w} label={w} tone={w.toLowerCase().includes('high') || w.toLowerCase().includes('sugar') ? 'warning' : 'default'} />
                ))}
                {scanResult.healthScore >= 80 ? <Tag label="High score" tone="success" /> : <Tag label="Needs review" tone="warning" />}
              </View>
            </>
          ) : (
            <Text style={styles.bodyText}>{status}</Text>
          )}
        </View>
        <View style={styles.actionStack}>
          <PrimaryButton label="Use this scan in planner" onPress={() => navigation.navigate('Planner')} />
          <PrimaryButton label="Review results" onPress={() => navigation.navigate('Analytics')} />
        </View>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 40,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  hero: {
    gap: 8,
    marginBottom: 4,
  },
  kicker: {
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: colors.textSoft,
    lineHeight: 21,
  },
  sectionCard: {
    marginTop: 2,
  },
  cameraMock: {
    position: 'relative',
    height: 240,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(3, 12, 24, 0.9)',
    overflow: 'hidden',
  },
  cameraGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraOverlayContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  cameraActions: {
    marginTop: 12,
  },
  cameraLabel: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 20,
  },
  cameraHint: {
    color: colors.textSoft,
    marginTop: 8,
  },
  codeBlock: {
    color: colors.text,
    fontFamily: 'Courier',
    lineHeight: 21,
    marginTop: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  actionStack: {
    gap: 10,
    marginTop: 14,
  },
});