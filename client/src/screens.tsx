import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, MetricPill, PrimaryButton, ProgressBar, SectionHeader, Tag } from './components';
import {
  analyticsBars,
  chatbotPrompts,
  dashboardMetrics,
  groceryList,
  healthInsights,
  macroSplit,
  mealPlan,
  notifications,
} from './data';
import { colors, spacing } from './theme';
import { useNavigation } from '@react-navigation/native';
import { api } from './services/api';
import { useScanHistory } from './scanHistory';
import { useProfile } from './profile';
export { ScannerScreen } from './scanner-screen';

type DashboardSummary = Awaited<ReturnType<typeof api.getSummary>>;

function Page({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['rgba(84,225,193,0.20)', 'rgba(6,17,31,0)']} style={styles.heroGlow} />
      <View style={styles.hero}>
        <Text style={styles.kicker}>NutriMind AI</Text>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

function MealCard({ meal, title, calories, note }: { meal: string; title: string; calories: number; note: string }) {
  return (
    <GlassCard style={styles.mealCard}>
      <View style={styles.rowBetween}>
        <Tag label={meal} />
        <Text style={styles.calorieBadge}>{calories} kcal</Text>
      </View>
      <Text style={styles.mealTitle}>{title}</Text>
      <Text style={styles.bodyText}>{note}</Text>
    </GlassCard>
  );
}

export function AuthScreen({ onBegin }: { onBegin?: () => void }) {
  const navigation = useNavigation<any>();
  const beginAction = onBegin ?? (() => navigation.navigate('Setup'));

  return (
    <ScrollView contentContainerStyle={styles.authPage} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['rgba(84,225,193,0.18)', 'rgba(50,183,211,0.06)', 'rgba(6,17,31,0)']} style={styles.authGlow} />
      <Text style={styles.authBrand}>NutriMind AI</Text>
      <Text style={styles.authHeadline}>Your AI nutritionist, meal planner, and fitness coach in one app.</Text>
      <Text style={styles.authCopy}>
        Real-time food recognition, predictive health insights, smart meal planning, and conversational guidance.
      </Text>

      <GlassCard style={styles.authCard}>
        <SectionHeader title="Sign in" subtitle="Continue with your healthy-lifestyle profile." />
        <TextInput placeholder="Email" placeholderTextColor={colors.textSoft} style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor={colors.textSoft} secureTextEntry style={styles.input} />
        <PrimaryButton label="Continue" onPress={beginAction} />
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Create an account</Text>
        </Pressable>
      </GlassCard>

      <GlassCard style={styles.authCard}>
        <SectionHeader title="AI-ready features" subtitle="Designed as a production-grade nutrition ecosystem." />
        <View style={styles.featureRow}>
          <Tag label="Food Vision" />
          <Tag label="Predictive Analytics" />
          <Tag label="Chatbot" />
          <Tag label="Health Privacy" />
        </View>
      </GlassCard>
    </ScrollView>
  );
}

export function LoginScreen() {
  return <AuthScreen />;
}

export function RegisterScreen() {
  const navigation = useNavigation<any>();

  return (
    <Page title="Create your profile" subtitle="Tell NutriMind AI about your body metrics, goals, and food preferences.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Personal details" subtitle="The recommendation engine adapts from your profile." />
        <TextInput placeholder="Full name" placeholderTextColor={colors.textSoft} style={styles.input} />
        <TextInput placeholder="Age" placeholderTextColor={colors.textSoft} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Goal: weight loss, muscle gain, keto, vegan" placeholderTextColor={colors.textSoft} style={styles.input} />
        <PrimaryButton label="Send OTP" onPress={() => navigation.navigate('Otp')} />
      </GlassCard>
    </Page>
  );
}

export function OtpScreen() {
  const navigation = useNavigation<any>();

  return (
    <Page title="Verify OTP" subtitle="Secure access with OTP, biometric login, and encrypted health data.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Verification" subtitle="Use the demo code 123456 for the scaffold." />
        <View style={styles.otpRow}>
          {['1', '2', '3', '4', '5', '6'].map((digit) => (
            <View key={digit} style={styles.otpBox}>
              <Text style={styles.otpText}>{digit}</Text>
            </View>
          ))}
        </View>
        <PrimaryButton label="Continue to setup" onPress={() => navigation.navigate('Setup')} />
      </GlassCard>
    </Page>
  );
}

export function SetupScreen({ onFinish }: { onFinish: () => void }) {
  const { updateProfile } = useProfile();
  const [activeField, setActiveField] = React.useState<string | null>(null);
  const [profileFields, setProfileFields] = React.useState<Record<string, string>>({
    Height: '',
    Weight: '',
    BMI: '',
    Activity: '',
    Budget: '',
    Goal: '',
    'Medical notes': '',
  });
  const [draftValue, setDraftValue] = React.useState('');

  const fields = ['Height', 'Weight', 'BMI', 'Activity', 'Budget', 'Goal', 'Medical notes'];


  const openField = (field: string) => {
    setActiveField(field);
    setDraftValue(profileFields[field]);
  };

  const saveField = () => {
    if (!activeField) {
      return;
    }

    const trimmed = draftValue.trim();
    setProfileFields((current) => ({
      ...current,
      [activeField]: trimmed,
    }));

    // Update profile context for known fields
    if (activeField === 'Weight') {
      const w = Number(trimmed) || undefined;
      updateProfile({ weight: w });
    }
    if (activeField === 'Height') {
      const h = Number(trimmed) || undefined;
      updateProfile({ height: h });
    }
    if (activeField === 'Goal') {
      updateProfile({ goal: trimmed });
    }
    if (activeField === 'BMI') {
      // ignore for now; BMI is derived
    }
    setActiveField(null);
    setDraftValue('');
  };

  return (
    <Page title="User setup" subtitle="Complete the nutrition baseline so AI can personalize your plan.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Profile baseline" subtitle="Height, weight, activity, budget, and medical notes." />
        <View style={styles.setupGrid}>
          {fields.map((field) => (
            <Pressable key={field} onPress={() => openField(field)} style={({ pressed }) => [styles.setupTile, pressed && styles.setupTilePressed]}>
              <Text style={styles.tileLabel}>{field}</Text>
              <Text style={styles.tileValue}>{profileFields[field] || 'Add'}</Text>
            </Pressable>
          ))}
        </View>

        {activeField ? (
          <View style={styles.editorCard}>
            <Text style={styles.editorTitle}>Add {activeField.toLowerCase()}</Text>
            <TextInput
              autoFocus
              placeholder={`Enter ${activeField.toLowerCase()}`}
              placeholderTextColor={colors.textSoft}
              style={styles.input}
              value={draftValue}
              onChangeText={setDraftValue}
            />
            <View style={styles.editorActions}>
              <PrimaryButton label="Save" onPress={saveField} />
              <Pressable onPress={() => { setActiveField(null); setDraftValue(''); }}>
                <Text style={styles.linkText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <PrimaryButton label="Enter NutriMind AI" onPress={onFinish} />
      </GlassCard>
    </Page>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);

  React.useEffect(() => {
    let active = true;

    api.getSummary()
      .then((result) => {
        if (active) {
          setSummary(result);
        }
      })
      .catch(() => {
        if (active) {
          setSummary(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const caloriesToday = summary?.caloriesToday ?? 1840;
  const caloriesGoal = summary?.caloriesGoal ?? 2200;
  const calorieDelta = caloriesToday - caloriesGoal;
  const macroBalance = summary?.macroBalance ?? { protein: 42, carbs: 34, fat: 24 };
  const weeklyTrend = summary?.weeklyTrend ?? [-120, -80, -60, -90, -40, -130, -70];
  const insights = summary?.insights ?? healthInsights;

  const dashboardMetricsLive = [
    { label: 'Calories', value: caloriesToday.toLocaleString(), delta: `${calorieDelta > 0 ? '+' : ''}${calorieDelta} vs goal` },
    { label: 'Protein', value: `${macroBalance.protein}g`, delta: `${Math.max(macroBalance.protein - 28, 0)}g today` },
    { label: 'Water', value: `${summary?.hydrationScore ?? 79}%`, delta: `${summary?.hydrationScore && summary.hydrationScore >= 80 ? 'On track' : 'Keep sipping'} ` },
    { label: 'Sleep', value: `${summary?.habitScore ?? 84}%`, delta: summary ? `Updated ${new Date(summary.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'AI score 86' },
  ];

  return (
    <Page title="Today’s intelligent nutrition dashboard" subtitle="Hyper-personalized calorie guidance powered by AI health analytics.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Quick actions" subtitle="Jump straight to the parts of the app you use most." />
        <View style={styles.actionStack}>
          <PrimaryButton label="Scan a meal" onPress={() => navigation.navigate('Scanner')} />
          <PrimaryButton label="Build a plan" onPress={() => navigation.navigate('Planner')} />
          <PrimaryButton label="Open analytics" onPress={() => navigation.navigate('Analytics')} />
        </View>
      </GlassCard>

      <View style={styles.metricGrid}>
        {dashboardMetricsLive.map((metric) => (
          <MetricPill key={metric.label} {...metric} />
        ))}
      </View>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="AI nutrition score" subtitle="A composite view of calories, macro balance, hydration, and habit consistency." />
        <View style={styles.scoreRow}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>86</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
          <View style={styles.scoreDetails}>
            {insights.slice(0, 3).map((insight) => (
              <Text key={insight} style={styles.bulletText}>• {insight}</Text>
            ))}
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Macros today" subtitle="Animated charts can be wired to live data and wearable integrations." />
        {macroSplit.map((macro) => (
          <View key={macro.label} style={styles.macroRow}>
            <Text style={styles.macroLabel}>{macro.label}</Text>
            <ProgressBar value={macro.label === 'Protein' ? macroBalance.protein : macro.label === 'Carbs' ? macroBalance.carbs : macroBalance.fat} color={macro.color} />
            <Text style={styles.macroValue}>{macro.label === 'Protein' ? macroBalance.protein : macro.label === 'Carbs' ? macroBalance.carbs : macroBalance.fat}%</Text>
          </View>
        ))}
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Notifications" subtitle="Smart reminders for meals, hydration, sleep, and recovery." />
        {(summary
          ? [
              summary.caloriesToday <= summary.caloriesGoal ? 'You are under your calorie goal for the day' : 'You are close to or above your calorie goal',
              summary.hydrationScore >= 80 ? 'Hydration is on target' : 'Hydration needs a top-up',
              summary.habitScore >= 80 ? 'Your habit score is strong today' : 'Consistency is slipping a bit today',
            ]
          : notifications
        ).map((item) => (
          <Text key={item} style={styles.bulletText}>• {item}</Text>
        ))}
      </GlassCard>
    </Page>
  );
}

export function PlannerScreen() {
  const { profile } = useProfile();
  const [plan, setPlan] = React.useState<any | null>(null);
  const [loadingPlan, setLoadingPlan] = React.useState(false);

  const generatePlan = async () => {
    setLoadingPlan(true);
    try {
      const result = await api.getMealPlan({ goal: profile.goal, weight: profile.weight, height: profile.height });
      setPlan(result);
    } catch (e) {
      setPlan(null);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <Page title="Smart meal planner" subtitle="Weekly meal scheduling, calorie adjustment, grocery generation, and AI alternatives.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Generate plan" subtitle="Create a meal plan tailored to your profile." />
        <Text style={styles.bodyText}>Profile: {profile.goal} • {profile.weight}kg • {profile.height}cm</Text>
        <View style={styles.actionStack}>
          <PrimaryButton label={loadingPlan ? 'Generating...' : 'Generate plan from profile'} onPress={generatePlan} />
        </View>
      </GlassCard>

      {plan ? (
        <GlassCard style={styles.sectionCard}>
          <SectionHeader title="Generated weekly plan" subtitle="Preview of AI-generated meals." />
          {Object.keys(plan).filter(k => typeof plan[k] === 'object').map((k) => (
            <View key={k} style={{ marginBottom: 12 }}>
              <Text style={styles.mealTitle}>{k}</Text>
              <Text style={styles.bodyText}>{(plan as any)[k].title} — {(plan as any)[k].calories} kcal</Text>
            </View>
          ))}
          <SectionHeader title="Grocery list" />
          <View style={styles.tagRow}>
            {(plan.groceryList ?? []).map((item: string) => (
              <Tag key={item} label={item} />
            ))}
          </View>
        </GlassCard>
      ) : null}
    </Page>
  );
}

export function TrackerScreen() {
  const trackerItems = [
    { label: 'Steps', value: '8,924', target: '10,000', progress: 89 },
    { label: 'Calories burned', value: '612', target: '780', progress: 78 },
    { label: 'Water intake', value: '2.4L', target: '3.0L', progress: 80 },
    { label: 'Workout sessions', value: '4', target: '5', progress: 80 },
  ];

  return (
    <Page title="Fitness tracker" subtitle="Track steps, calories burned, water intake, sleep, and workout consistency.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Daily tracking" subtitle="Made for Google Fit, Apple HealthKit, and wearable ingestion later." />
        {trackerItems.map((item) => (
          <View key={item.label} style={styles.trackRow}>
            <View>
              <Text style={styles.trackLabel}>{item.label}</Text>
              <Text style={styles.trackValue}>{item.value} / {item.target}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <ProgressBar value={item.progress} color={colors.primary} />
            </View>
          </View>
        ))}
      </GlassCard>
    </Page>
  );
}

export function ChatbotScreen() {
  const navigation = useNavigation<any>();
  const [draft, setDraft] = React.useState('');
  const [answer, setAnswer] = React.useState('Pick a prompt or ask your own question to get a tailored response.');
  const [followUps, setFollowUps] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { profile } = useProfile();

  const submitPrompt = async () => {
    const message = draft.trim();

    if (!message || loading) {
      return;
    }

    setLoading(true);

    try {
      const result = await api.chatNutritionist({ message, weight: profile.weight, height: profile.height, goal: profile.goal });
      setAnswer(result.response);
      setFollowUps(result.followUps ?? []);
    } catch (error) {
      setAnswer('Unable to reach the nutrition engine right now. Please try again.');
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="AI nutrition chatbot" subtitle="Ask natural-language health questions and get contextual meal coaching.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Suggested prompts" subtitle="OpenAI, Gemini, LangChain, or RAG integrations can be connected here." />
        {chatbotPrompts.map((prompt) => (
          <Pressable key={prompt} onPress={() => setDraft(prompt)} style={({ pressed }) => [styles.promptChip, pressed && styles.promptChipPressed]}>
            <Text style={styles.promptText}>{prompt}</Text>
          </Pressable>
        ))}
        <TextInput
          placeholder="Ask NutriMind AI anything about diet or recovery"
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
        />
        <GlassCard style={styles.answerCard}>
          <Text style={styles.answerLabel}>Answer</Text>
          <Text style={styles.answerText}>{answer}</Text>
          {followUps.length ? (
            <View style={styles.followUpRow}>
              {followUps.map((item) => (
                <Tag key={item} label={item} tone="default" />
              ))}
            </View>
          ) : null}
        </GlassCard>
        <View style={styles.actionStack}>
          <PrimaryButton label={loading ? 'Generating...' : 'Generate answer'} onPress={submitPrompt} />
          <PrimaryButton label="Clear prompt" onPress={() => setDraft('')} />
          <PrimaryButton label="Open analytics" onPress={() => navigation.navigate('Analytics')} />
        </View>
      </GlassCard>
    </Page>
  );
}

export function AnalyticsScreen() {
  const { profile } = useProfile();
  const [prediction, setPrediction] = React.useState<any | null>(null);

  React.useEffect(() => {
    let active = true;
    api.predictHealth({ weight: profile.weight, height: profile.height, goal: profile.goal })
      .then((res) => { if (active) setPrediction(res); })
      .catch(() => { if (active) setPrediction(null); });
    return () => { active = false; };
  }, [profile]);

  return (
    <Page title="Analytics dashboard" subtitle="Daily calories, weekly progress, macro charts, weight graphs, and goal completion.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Weekly progress" subtitle="Visualized as bars now, ready for chart components later." />
        <View style={styles.analyticsBars}>
          {analyticsBars.map((value, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.bar, { height: value * 2 }]} />
              <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Predictive health" subtitle="Weight, BMI, calorie needs, and risk signals modeled from your profile." />
        {prediction ? (
          <>
            <Text style={styles.bodyText}>Projected weight in 30 days: {prediction.predictedWeight30Days} kg</Text>
            <Text style={styles.bodyText}>Projected BMI in 30 days: {prediction.predictedBMI30Days}</Text>
            <Text style={styles.bodyText}>Calories needed: {prediction.caloriesNeeded}</Text>
            <Text style={styles.bodyText}>Risk flags: {(prediction.riskFlags ?? []).join(', ')}</Text>
            <Text style={styles.bodyText}>Model stack: {(prediction.modelStack ?? []).join(', ')}</Text>
          </>
        ) : (
          <Text style={styles.bodyText}>Loading predictive health...</Text>
        )}
      </GlassCard>
    </Page>
  );
}

export function ProfileScreen() {
  const { profile } = useProfile();
  return (
    <Page title="Profile and privacy" subtitle="JWT auth, OAuth, biometrics, and encrypted health data are planned into the structure.">
      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Health profile" subtitle="Keep preferences and medical constraints aligned with your plan." />
        <Text style={styles.bodyText}>Goal: {profile.goal ?? 'Not set'}</Text>
        <Text style={styles.bodyText}>Weight: {profile.weight ? `${profile.weight} kg` : 'Not set'}</Text>
        <Text style={styles.bodyText}>Height: {profile.height ? `${profile.height} cm` : 'Not set'}</Text>
        <Text style={styles.bodyText}>Privacy mode: Encrypted local cache</Text>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Security" subtitle="Designed for biometric login and HIPAA-inspired privacy patterns." />
        <View style={styles.tagRow}>
          <Tag label="JWT" />
          <Tag label="OAuth" />
          <Tag label="Biometric" />
          <Tag label="Encrypted data" />
        </View>
      </GlassCard>
    </Page>
  );
}

export function ScanHistoryScreen() {
  const { scans, clearScans } = useScanHistory();

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['rgba(84,225,193,0.20)', 'rgba(6,17,31,0)']} style={styles.heroGlow} />
      <View style={styles.hero}>
        <Text style={styles.kicker}>NutriMind AI</Text>
        <Text style={styles.heroTitle}>Scan history</Text>
        <Text style={styles.heroSubtitle}>Saved scans from this session. Tap a scan to view details.</Text>
      </View>

      <GlassCard style={styles.sectionCard}>
        <SectionHeader title="Saved scans" subtitle="Recent captured and analyzed meals." />
        {scans.length === 0 ? (
          <Text style={styles.bodyText}>No scans saved yet. Use the scanner to capture a meal.</Text>
        ) : (
          scans.map((s: any) => (
            <View key={s.id} style={{ marginBottom: 12 }}>
              <Text style={styles.bodyText}>{new Date(s.timestamp).toLocaleString()}</Text>
              <Text style={styles.mealTitle}>{s.result.food}</Text>
              <Text style={styles.bodyText}>Calories: {s.result.calories}</Text>
            </View>
          ))
        )}
        <View style={styles.actionStack}>
          <PrimaryButton label="Clear history" onPress={() => clearScans()} />
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
  authPage: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 72,
    paddingBottom: 32,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  heroGlow: {
    position: 'absolute',
    top: 0,
    left: -40,
    right: -40,
    height: 260,
  },
  authGlow: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    height: 300,
  },
  authBrand: {
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  authHeadline: {
    color: colors.text,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    marginTop: 6,
  },
  authCopy: {
    color: colors.textSoft,
    lineHeight: 22,
  },
  authCard: {
    marginTop: spacing.sm,
  },
  sectionCard: {
    marginTop: 2,
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
  input: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  linkText: {
    color: colors.primary,
    marginTop: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 18,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.14)',
  },
  otpText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  setupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  setupTile: {
    width: '47%',
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  setupTilePressed: {
    backgroundColor: 'rgba(84,225,193,0.10)',
    borderColor: 'rgba(84,225,193,0.25)',
  },
  tileLabel: {
    color: colors.textSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tileValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  editorCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  editorTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  editorActions: {
    gap: 10,
    marginTop: 4,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: 'rgba(84,225,193,0.22)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  scoreValue: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  scoreLabel: {
    color: colors.textSoft,
    fontSize: 12,
  },
  scoreDetails: {
    flex: 1,
    gap: 10,
  },
  bulletText: {
    color: colors.textSoft,
    lineHeight: 20,
  },
  macroRow: {
    marginBottom: 14,
    gap: 8,
  },
  macroLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  macroValue: {
    color: colors.textSoft,
    fontSize: 12,
  },
  mealCard: {
    marginBottom: 12,
  },
  calorieBadge: {
    color: colors.primary,
    fontWeight: '700',
  },
  mealTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
  },
  bodyText: {
    color: colors.textSoft,
    lineHeight: 20,
    marginTop: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  trackValue: {
    color: colors.textSoft,
    marginTop: 4,
  },
  promptChip: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
    marginBottom: 10,
  },
  promptChipPressed: {
    backgroundColor: 'rgba(84,225,193,0.10)',
    borderColor: 'rgba(84,225,193,0.28)',
  },
  promptText: {
    color: colors.text,
    lineHeight: 20,
  },
  answerCard: {
    marginTop: 8,
    marginBottom: 10,
  },
  answerLabel: {
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  answerText: {
    color: colors.text,
    lineHeight: 22,
  },
  followUpRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  actionStack: {
    gap: 10,
    marginTop: 14,
  },
  analyticsBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 220,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  barLabel: {
    color: colors.textSoft,
    marginTop: 10,
    fontSize: 12,
  },
});
