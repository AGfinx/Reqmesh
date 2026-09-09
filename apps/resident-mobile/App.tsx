import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const HOLD_DURATION = 3000;

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [sosState, setSosState] = useState('Request emergency help');
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSos = () => {
    const startedAt = Date.now();
    setSosState('Keep holding...');
    holdTimer.current = setInterval(() => {
      const progress = Math.min((Date.now() - startedAt) / HOLD_DURATION, 1);
      setHoldProgress(progress);
      if (progress === 1) {
        finishSos();
      }
    }, 50);
  };

  const cancelSos = () => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    holdTimer.current = null;
    setHoldProgress(0);
    setSosState('Request emergency help');
  };

  const finishSos = () => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    holdTimer.current = null;
    setHoldProgress(1);
    setSosState('SOS saved on this device');
    Alert.alert('SOS saved on this device', 'Your request is ready to send when a connection or relay is available.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>RDMP RESIDENT</Text>
            <Text style={styles.title}>Good morning</Text>
          </View>
          <View style={styles.profileMark}>
            <Text style={styles.profileText}>A</Text>
          </View>
        </View>

        <View style={styles.statusCard} accessible accessibilityLabel="Offline. Essential tools still work.">
          <View style={styles.statusDot} />
          <View style={styles.statusCopy}>
            <Text style={styles.statusTitle}>Offline</Text>
            <Text style={styles.statusDescription}>Essential tools still work</Text>
          </View>
          <Text style={styles.statusMeta}>2 saved</Text>
        </View>

        <View style={styles.safetyPanel}>
          <Text style={styles.panelLabel}>CURRENT SAFETY STATUS</Text>
          <Text style={styles.safetyTitle}>No active emergency in your area</Text>
          <Text style={styles.bodyText}>Local information is available. Check your map pack before you travel.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Need help now?</Text>
          <Text style={styles.sectionHint}>Press and hold for 3 seconds</Text>
        </View>
        <Pressable
          accessibilityLabel={sosState}
          accessibilityHint="Press and hold to save an emergency request on this device"
          onPressIn={startSos}
          onPressOut={() => sosState === 'Keep holding...' && cancelSos()}
          style={({ pressed }) => [styles.sosButton, pressed && styles.sosButtonPressed]}
        >
          <View style={styles.sosRing}>
            <Text style={styles.sosLabel}>SOS</Text>
          </View>
          <View style={styles.sosCopy}>
            <Text style={styles.sosTitle}>{sosState}</Text>
            <Text style={styles.sosDescription}>{holdProgress > 0 ? `${Math.round(holdProgress * 100)}% confirmed` : 'Your request is saved before it is sent'}</Text>
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionGrid}>
          {['Open map', 'Report hazard', 'I am safe'].map((label) => (
            <Pressable key={label} style={styles.actionButton} accessibilityRole="button">
              <Text style={styles.actionMark}>{label === 'Open map' ? 'MAP' : label === 'Report hazard' ? 'REPORT' : 'SAFE'}</Text>
              <Text style={styles.actionLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.readinessCard}>
          <View style={styles.readinessHeader}>
            <View>
              <Text style={styles.panelLabel}>READINESS</Text>
              <Text style={styles.readinessTitle}>Your essentials are close</Text>
            </View>
            <Text style={styles.readinessScore}>3 / 4</Text>
          </View>
          <Text style={styles.bodyText}>Offline map pack is ready. Add an emergency contact to complete setup.</Text>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent alerts</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.alertRow}>
          <View style={styles.alertBadge}><Text style={styles.alertBadgeText}>INFO</Text></View>
          <View style={styles.alertCopy}>
            <Text style={styles.alertTitle}>Preparedness reminder</Text>
            <Text style={styles.alertMeta}>Saved on this device · Today</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.tabBar}>
        {['Home', 'Map', 'Report', 'Profile'].map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: activeTab === tab }}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7F8',
  },
  container: {
    padding: 20,
    paddingBottom: 110,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  eyebrow: { color: '#52616B', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  title: { color: '#0B2D4D', fontSize: 30, fontWeight: '800', marginTop: 4 },
  profileMark: { alignItems: 'center', backgroundColor: '#D8E8F5', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  profileText: { color: '#1455A0', fontSize: 18, fontWeight: '800' },
  statusCard: { alignItems: 'center', backgroundColor: '#E7F4EF', borderRadius: 14, flexDirection: 'row', marginBottom: 16, padding: 14 },
  statusDot: { backgroundColor: '#167A4A', borderRadius: 8, height: 12, width: 12 },
  statusCopy: { flex: 1, marginLeft: 10 },
  statusTitle: { color: '#145A3A', fontSize: 15, fontWeight: '800' },
  statusDescription: { color: '#32624B', fontSize: 13, marginTop: 2 },
  statusMeta: { color: '#32624B', fontSize: 12, fontWeight: '700' },
  safetyPanel: { backgroundColor: '#0B2D4D', borderRadius: 18, marginBottom: 24, padding: 20 },
  panelLabel: { color: '#7FB3D5', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  safetyTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', lineHeight: 28, marginTop: 10 },
  bodyText: { color: '#52616B', fontSize: 15, lineHeight: 22, marginTop: 8 },
  sectionHeader: { alignItems: 'baseline', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: '#14212B', fontSize: 19, fontWeight: '800', marginBottom: 12 },
  sectionHint: { color: '#52616B', fontSize: 12 },
  sosButton: { alignItems: 'center', backgroundColor: '#B42318', borderRadius: 18, flexDirection: 'row', marginBottom: 26, minHeight: 104, padding: 16 },
  sosButtonPressed: { backgroundColor: '#8F1D15' },
  sosRing: { alignItems: 'center', borderColor: '#F5B7B1', borderRadius: 38, borderWidth: 2, height: 76, justifyContent: 'center', width: 76 },
  sosLabel: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  sosCopy: { flex: 1, marginLeft: 16 },
  sosTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', lineHeight: 22 },
  sosDescription: { color: '#FDE8E6', fontSize: 13, lineHeight: 18, marginTop: 5 },
  actionGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionButton: { backgroundColor: '#FFFFFF', borderColor: '#DDE4E8', borderRadius: 14, borderWidth: 1, flex: 1, minHeight: 94, padding: 12 },
  actionMark: { color: '#006D77', fontSize: 11, fontWeight: '900', marginBottom: 12 },
  actionLabel: { color: '#14212B', fontSize: 14, fontWeight: '700', lineHeight: 18 },
  readinessCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 26, padding: 18 },
  readinessHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  readinessTitle: { color: '#14212B', fontSize: 17, fontWeight: '800', marginTop: 6 },
  readinessScore: { color: '#167A4A', fontSize: 18, fontWeight: '800' },
  progressTrack: { backgroundColor: '#E1E8EB', borderRadius: 5, height: 8, marginTop: 16, overflow: 'hidden' },
  progressFill: { backgroundColor: '#167A4A', borderRadius: 5, height: 8, width: '75%' },
  recentHeader: { alignItems: 'baseline', flexDirection: 'row', justifyContent: 'space-between' },
  viewAll: { color: '#1455A0', fontSize: 13, fontWeight: '700' },
  alertRow: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, flexDirection: 'row', padding: 14 },
  alertBadge: { alignItems: 'center', backgroundColor: '#D8EEF0', borderRadius: 8, height: 42, justifyContent: 'center', width: 52 },
  alertBadgeText: { color: '#006D77', fontSize: 10, fontWeight: '900' },
  alertCopy: { flex: 1, marginLeft: 12 },
  alertTitle: { color: '#14212B', fontSize: 15, fontWeight: '700' },
  alertMeta: { color: '#52616B', fontSize: 12, marginTop: 4 },
  tabBar: { backgroundColor: '#FFFFFF', borderTopColor: '#DDE4E8', borderTopWidth: 1, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', left: 0, paddingBottom: 12, paddingTop: 14, position: 'absolute', right: 0 },
  tab: { alignItems: 'center', minHeight: 44, justifyContent: 'center', minWidth: 64 },
  tabLabel: { color: '#52616B', fontSize: 12, fontWeight: '700' },
  tabLabelActive: { color: '#1455A0' },
});
