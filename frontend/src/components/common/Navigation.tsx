import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import type { Href } from 'expo-router';
import { colors } from '../../config/theme';
import { routes } from '../../navigation/routes';
import { useAppState } from '../../hooks/useAppState';

const tabs = [
  { label: 'Home', glyph: '⌂', path: routes.home },
  { label: 'Scholarships', glyph: '◇', path: routes.scholarships },
  { label: 'Research', glyph: '⚗', path: routes.research },
  { label: 'Tracker', glyph: '☷', path: routes.tracker },
] as const;

export function MainLayout({
  title,
  onBack,
  children,
  footer,
}: {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  const showTabs = pathname !== '/' && pathname !== '/account' && pathname !== '/academic-profile';
  const { profile } = useAppState();
  const initials = profile.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View style={styles.fill}>
      <View style={styles.mainHeader}>
        <View style={styles.headerLeft}>
          {onBack ? (
            <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button">
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
          ) : null}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <Pressable
          onPress={() => router.push(routes.profile as Href)}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <Text style={styles.avatarText}>{initials || '?'}</Text>
        </Pressable>
      </View>
      <ScrollView
        style={styles.fill}
        contentContainerStyle={styles.mainContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer ? <View style={styles.detailFooter}>{footer}</View> : null}
      {showTabs ? <BottomNavigation pathname={pathname} /> : null}
    </View>
  );
}

export function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.pageHeader}>
      <Pressable onPress={onBack} accessibilityRole="button">
        <Text style={styles.backGlyph}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

function BottomNavigation({ pathname }: { pathname: string }) {
  const tabPath = pathname.startsWith('/scholarship')
    ? routes.scholarships
    : pathname.startsWith('/research') || pathname === '/saved-research'
      ? routes.research
      : pathname;
  const activeTab = tabs.find(({ path }) => path === tabPath);
  return (
    <View style={styles.tabBar}>
      {tabs.map(({ label, glyph, path }) => {
        const selected = activeTab?.label === label;
        return (
          <Pressable
            key={label}
            onPress={() => router.navigate(path as Href)}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <View style={[styles.tabIconWrap, selected && styles.tabIconWrapActive]}>
              <Text style={[styles.tabIcon, selected && styles.tabIconActive]}>{glyph}</Text>
            </View>
            <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  mainHeader: { minHeight: 60, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerTitle: { color: colors.ink, fontSize: 22, lineHeight: 28, fontWeight: '700' },
  backButton: { width: 30, alignItems: 'flex-start' },
  backGlyph: { color: colors.blue, fontSize: 36, lineHeight: 38, fontWeight: '300' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F0FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.blueDark, fontSize: 14, fontWeight: '600' },
  pageHeader: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 32 },
  mainContent: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 24, gap: 20 },
  detailFooter: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 12, backgroundColor: colors.white },
  tabBar: { minHeight: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderColor: '#E1E7F0', backgroundColor: '#F3F6FC', paddingHorizontal: 4, paddingTop: 6, paddingBottom: 4 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabIconWrap: { minWidth: 54, height: 32, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tabIconWrapActive: { backgroundColor: '#DCEAFF' },
  tabIcon: { color: '#536680', fontSize: 24, lineHeight: 28 },
  tabIconActive: { color: colors.blueDark },
  tabLabel: { color: '#536680', fontSize: 12, fontWeight: '500' },
  tabLabelActive: { color: colors.blueDark, fontWeight: '600' },
});
