import { View, Text, FlatList, StyleSheet } from 'react-native';

const BANDEIRAS = {
  BRL: '🇧🇷', USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', ARS: '🇦🇷',
  JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺', CHF: '🇨🇭', CNY: '🇨🇳', MXN: '🇲🇽',
};

export default function HistoricoScreen({ route }) {
  const { historico = [] } = route.params;

  function formatarValor(val, moeda) {
    return Number(val).toLocaleString('pt-BR', {
      style: 'currency', currency: moeda,
      minimumFractionDigits: 2, maximumFractionDigits: 4,
    });
  }

  if (historico.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioEmoji}>📭</Text>
        <Text style={styles.vazioTexto}>Nenhuma conversão realizada ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitulo}>{historico.length} conversões realizadas</Text>
      <FlatList
        data={historico}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopo}>
              <Text style={styles.data}>{item.data}</Text>
              <Text style={styles.taxa}>Taxa: {item.taxa.toFixed(4)}</Text>
            </View>
            <View style={styles.cardCorpo}>
              <View style={styles.moedaInfo}>
                <Text style={styles.bandeira}>{BANDEIRAS[item.moedaOrigem]}</Text>
                <Text style={styles.sigla}>{item.moedaOrigem}</Text>
                <Text style={styles.valorOrigem}>{formatarValor(item.valorOrigem, item.moedaOrigem)}</Text>
              </View>
              <Text style={styles.seta}>→</Text>
              <View style={styles.moedaInfo}>
                <Text style={styles.bandeira}>{BANDEIRAS[item.moedaDestino]}</Text>
                <Text style={styles.sigla}>{item.moedaDestino}</Text>
                <Text style={styles.valorDestino}>{formatarValor(item.valorDestino, item.moedaDestino)}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff', padding: 16 },
  subtitulo: { fontSize: 13, color: '#888', marginBottom: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  cardTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  data: { fontSize: 12, color: '#aaa' },
  taxa: { fontSize: 12, color: '#aaa' },
  cardCorpo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moedaInfo: { alignItems: 'center', flex: 1 },
  bandeira: { fontSize: 28, marginBottom: 2 },
  sigla: { fontSize: 12, color: '#888', fontWeight: '600', marginBottom: 4 },
  valorOrigem: { fontSize: 14, color: '#444', fontWeight: '600' },
  valorDestino: { fontSize: 16, color: '#1a73e8', fontWeight: 'bold' },
  seta: { fontSize: 22, color: '#ccc', paddingHorizontal: 8 },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4ff' },
  vazioEmoji: { fontSize: 48, marginBottom: 12 },
  vazioTexto: { fontSize: 16, color: '#aaa' },
});
