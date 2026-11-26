import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../common/Controls';
import type { ResearchOpportunity } from '../../api/opportunityApi';
import { formatDate } from '../../utils/formatDate';
import { colors } from '../../config/theme';

export function StatCard({
  title,
  value,
  caption,
  valueColor,
}: {
  title: string;
  value: string;
  caption: string;
  valueColor: string;
}) {
  return (
    <View style={[styles.card, styles.statCard]}>
      <Text style={styles.bodyStrong}>{title}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
      <Text style={styles.smallMuted}>{caption}</Text>
    </View>
  );
}

export function ScholarshipCard({
  title,
  subtitle,
  onPress,
  compact = false,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.mutedText}>{subtitle}</Text>
      <Button label="View Details" onPress={onPress} />
    </View>
  );
}

export function ResearchCard({
  project,
  onPress,
}: {
  project: ResearchOpportunity;
  onPress: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.mutedText}>
        {project.country ? `${project.institution} · ${project.country}` : project.institution}
      </Text>
      <Text style={styles.cardTitle}>{project.title}</Text>
      <Text style={styles.topicKind}>{project.kind}</Text>
      <Text style={styles.mutedText}>{project.funding}</Text>
      <Text style={styles.topicText}>{project.topics.join(' · ')}</Text>
      <Text style={styles.mutedText}>Deadline: {formatDate(project.deadline)}</Text>
      <Button label="View details" onPress={onPress} />
    </View>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function RequirementCard({ title }: { title: string }) {
  return (
    <View style={[styles.softCard, styles.requirementCard]}>
      <Text style={styles.detailValue}>{title}</Text>
    </View>
  );
}

export function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.smallMuted}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: 20, padding: 20, gap: 14 },
  softCard: { borderRadius: 20, backgroundColor: colors.soft, borderWidth: 1, borderColor: '#DFE6F0', padding: 20, gap: 14 },
  statCard: { flex: 1, minHeight: 148, padding: 15, gap: 8, backgroundColor: colors.soft },
  bodyStrong: { color: colors.ink, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  statValue: { fontSize: 36, lineHeight: 42, fontWeight: '700' },
  smallMuted: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  mutedText: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  compactCard: { backgroundColor: colors.soft, borderColor: '#E0E7F1' },
  cardTitle: { color: colors.ink, fontSize: 20, lineHeight: 27, fontWeight: '700' },
  topicKind: { color: colors.blueDark, fontSize: 14, fontWeight: '600' },
  topicText: { color: colors.blue, fontSize: 14, lineHeight: 20 },
  detailRow: { flexDirection: 'row', gap: 18 },
  detailLabel: { color: colors.muted, width: 74, fontSize: 14 },
  detailValue: { color: colors.ink, fontSize: 16, lineHeight: 23, fontWeight: '500', flexShrink: 1 },
  requirementCard: { padding: 16, marginTop: 4 },
  infoBlock: { gap: 3, marginTop: 4 },
});
