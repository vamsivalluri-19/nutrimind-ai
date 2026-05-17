// @ts-nocheck
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, PrimaryButton, SectionHeader, Tag } from './components';
import * as FileSystem from 'expo-file-system';
import { useScanHistory } from './scanHistory';
import { api } from './services/api';
import { colors, spacing } from './theme';

export function ScannerScreen() {
  const navigation = useNavigation<any>();
  const cameraRef = React.useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<any | null>(null);
  const [lastScanLabel, setLastScanLabel] = React.useState('Live camera feed ready');
  const { addScan } = useScanHistory();

  const handleScan = async () => {
    if (!cameraRef.current || capturing) {
      return;
    }

    setCapturing(true);
    setLastScanLabel('Scanning frame...');

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
      let payload: any = { imageUri: photo.uri };
      try {
        const b64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
        payload = { imageData: b64 };
      } catch (fsErr) {
        // fallback to sending uri only
      }
      const result = await api.analyzeFood(payload);
      setScanResult(result);
      setLastScanLabel(`Analyzed ${result.food}`);
    } catch (error) {
      setLastScanLabel('Scan failed — please try again or upload a clear photo');
      try {
        Alert.alert('Scan failed', 'Unable to analyze the photo. Please try again.');
      } catch (e) {
        // ignore
      }
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.page}>
        <GlassCard style={styles.sectionCard}>
          <SectionHeader title="AI camera scanner" subtitle="Loading camera permissions..." />
          <View style={styles.permissionCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.permissionText}>Preparing camera access.</Text>
          </View>
        </GlassCard>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.page}>
        <GlassCard style={styles.sectionCard}>
          <SectionHeader title="AI camera scanner" subtitle="Allow camera access to scan meals in real time." />
          <View style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Camera permission needed</Text>
            <Text style={styles.permissionText}>
              NutriMind AI needs camera access to detect food items, estimate calories, and update results from a live preview.
            </Text>
            <PrimaryButton label="Grant camera access" onPress={() => void requestPermission()} />
          </View>
        </GlassCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>NutriMind AI</Text>
        <Text style={styles.heroTitle}>AI camera scanner</Text>
        <Text style={styles.heroSubtitle}>Detect food items, estimate calories, and warn about unhealthy ingredients in real time.</Text>
      </View>

      <GlassCard style={styles.cameraFrame}>
        <View style={styles.cameraMock}>
          <CameraView ref={cameraRef} style={styles.cameraPreview} facing="back" mute={true} />
          <LinearGradient colors={['rgba(6,17,31,0.02)', 'rgba(6,17,31,0.72)']} style={styles.cameraOverlay} />
          <View style={styles.cameraOverlayContent}>
            <Text style={styles.cameraLabel}>{lastScanLabel}</Text>
            <Text style={styles.cameraHint}>YOLOv8 • TensorFlow Lite • MobileNet</Text>
          </View>
        </View>
        <View style={styles.cameraActions}>
          <PrimaryButton label={capturing ? 'Scanning...' : 'Capture and analyze'} onPress={handleScan} />
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Food recognition output" subtitle="Results update from the captured camera frame and backend analysis." />
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
            <Text style={styles.bodyText}>No scan available. Capture a photo to analyze.</Text>
          )}
        </View>
        <View style={styles.actionStack}>
          <PrimaryButton label="Use this scan in planner" onPress={() => navigation.navigate('Planner')} />
          <PrimaryButton label="Review results" onPress={() => navigation.navigate('Analytics')} />
          <PrimaryButton label="Save scan" onPress={() => scanResult && addScan(scanResult)} />
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
  cameraFrame: {
    padding: 8,
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
  cameraPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraOverlay: {
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
  permissionCard: {
    gap: 14,
  },
  permissionTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  permissionText: {
    color: colors.textSoft,
    lineHeight: 21,
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
