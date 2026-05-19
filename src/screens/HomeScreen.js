import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';

const MOEDAS = ['BRL', 'USD', 'EUR', 'GBP', 'ARS', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN'];

const NOMES_MOEDAS = {
  BRL: 'Real Brasileiro', USD: 'Dólar Americano', EUR: 'Euro',
  GBP: 'Libra Esterlina', ARS: 'Peso Argentino', JPY: 'Iene Japonês',
  CAD: 'Dólar Canadense', AUD: 'Dólar Australiano', CHF: 'Franco Suíço',
  CNY: 'Yuan Chinês', MXN: 'Peso Mexicano',
};

const BANDEIRAS = {
  BRL: '🇧🇷', USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', ARS: '🇦🇷',
  JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺', CHF: '🇨🇭', CNY: '🇨🇳', MXN: '🇲🇽',
};

export default function HomeScreen({ navigation }) {
  const [valor, setValor] = useState('');
  const [moedaOrigem, setMoedaOrigem] = useState('USD');
  const [moedaDestino, setMoedaDestino] = useState('BRL');
  const [resultado, setResultado] = useState(null);
  const [taxa, setTaxa] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [dataAtualizacao, setDataAtualizacao] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (moedaOrigem !== moedaDestino) {
      buscarTaxa();
    }
  }, [moedaOrigem, moedaDestino]);

  async function buscarTaxa() {
    try {
      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?from=${moedaOrigem}&to=${moedaDestino}`
      );
      const dados = await response.json();
      setTaxa(dados.rates[moedaDestino]);
      setDataAtualizacao(dados.date);
    } catch (e) {
      console.log('Erro ao buscar taxa:', e);
    }
  }

  async function converter() {
    setErro('');

    if (!valor || isNaN(valor) || Number(valor) <= 0) {
      setErro('Insira um valor numérico válido.');
      return;
    }
    if (moedaOrigem === moedaDestino) {
      setErro('Escolha moedas diferentes.');
      return;
    }

    setCarregando(true);
    setResultado(null);

    try {
      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${valor}&from=${moedaOrigem}&to=${moedaDestino}`
      );
      if (!response.ok) throw new Error('Resposta inválida da API');
      const dados = await response.json();
      const valorConvertido = dados.rates[moedaDestino];
      const taxaUsada = valorConvertido / Number(valor);

      setResultado(valorConvertido);
      setTaxa(taxaUsada);
      setDataAtualizacao(dados.date);

      const novaConversao = {
        id: Date.now(),
        valorOrigem: Number(valor),
        moedaOrigem,
        valorDestino: valorConvertido,
        moedaDestino,
        taxa: taxaUsada,
        data: new Date().toLocaleString('pt-BR'),
      };
      setHistorico(prev => [novaConversao, ...prev.slice(0, 19)]);

    } catch (e) {
      setErro('Erro ao buscar cotação: ' + e.message);
    } finally {
      setCarregando(false);
    }
  }

  function trocarMoedas() {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
    setResultado(null);
    setErro('');
  }

  function formatarValor(val, moeda) {
    return Number(val).toLocaleString('pt-BR', {
      style: 'currency', currency: moeda,
      minimumFractionDigits: 2, maximumFractionDigits: 4,
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        <View style={styles.card}>
          <Text style={styles.label}>Valor a converter</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor="#aaa"
          />

          <View style={styles.moedaBox}>
            <Text style={styles.labelMoeda}>De</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moedasLista}>
                {MOEDAS.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.moedaBtn, moedaOrigem === m && styles.moedaBtnAtivo]}
                    onPress={() => setMoedaOrigem(m)}
                  >
                    <Text style={styles.moedaBandeira}>{BANDEIRAS[m]}</Text>
                    <Text style={[styles.moedaSigla, moedaOrigem === m && styles.moedaSiglaAtiva]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.trocarBtn} onPress={trocarMoedas}>
            <Text style={styles.trocarBtnTexto}>⇅ Inverter moedas</Text>
          </TouchableOpacity>

          <View style={styles.moedaBox}>
            <Text style={styles.labelMoeda}>Para</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moedasLista}>
                {MOEDAS.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.moedaBtn, moedaDestino === m && styles.moedaBtnAtivo]}
                    onPress={() => setMoedaDestino(m)}
                  >
                    <Text style={styles.moedaBandeira}>{BANDEIRAS[m]}</Text>
                    <Text style={[styles.moedaSigla, moedaDestino === m && styles.moedaSiglaAtiva]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {taxa && (
            <Text style={styles.taxaTexto}>
              Cotação: 1 {moedaOrigem} = {taxa.toFixed(4)} {moedaDestino}
              {dataAtualizacao ? `  •  ${dataAtualizacao}` : ''}
            </Text>
          )}

          {erro ? (
            <Text style={styles.erroTexto}>{erro}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.converterBtn, carregando && styles.converterBtnDesabilitado]}
            onPress={converter}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.converterBtnTexto}>Converter</Text>
            }
          </TouchableOpacity>
        </View>

        {resultado !== null && (
          <View style={styles.resultadoCard}>
            <Text style={styles.resultadoLabel}>RESULTADO</Text>
            <Text style={styles.resultadoValorOrigem}>{formatarValor(valor, moedaOrigem)}</Text>
            <Text style={styles.resultadoSeta}>↓</Text>
            <Text style={styles.resultadoValor}>{formatarValor(resultado, moedaDestino)}</Text>
            <Text style={styles.resultadoNome}>{BANDEIRAS[moedaDestino]} {NOMES_MOEDAS[moedaDestino]}</Text>
          </View>
        )}

        {historico.length > 0 && (
          <TouchableOpacity
            style={styles.historicoBtn}
            onPress={() => navigation.navigate('Historico', { historico })}
          >
            <Text style={styles.historicoBtnTexto}>
              📋 Ver histórico ({historico.length} conversões)
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff', padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  label: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '600' },
  input: {
    borderWidth: 1.5, borderColor: '#1a73e8', borderRadius: 10,
    padding: 14, fontSize: 22, color: '#222', marginBottom: 20, fontWeight: 'bold',
  },
  moedaBox: { marginBottom: 12 },
  labelMoeda: { fontSize: 13, color: '#888', marginBottom: 8, fontWeight: '600' },
  moedasLista: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  moedaBtn: {
    alignItems: 'center', padding: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#ddd', backgroundColor: '#fafafa', minWidth: 60,
  },
  moedaBtnAtivo: { borderColor: '#1a73e8', backgroundColor: '#e8f0fe' },
  moedaBandeira: { fontSize: 20, marginBottom: 2 },
  moedaSigla: { fontSize: 11, color: '#666', fontWeight: '600' },
  moedaSiglaAtiva: { color: '#1a73e8' },
  trocarBtn: { alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16, marginVertical: 4 },
  trocarBtnTexto: { color: '#1a73e8', fontSize: 14, fontWeight: '600' },
  taxaTexto: { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 8, marginTop: 4 },
  erroTexto: { color: 'red', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  converterBtn: { backgroundColor: '#1a73e8', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  converterBtnDesabilitado: { backgroundColor: '#93b8f5' },
  converterBtnTexto: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  resultadoCard: {
    backgroundColor: '#1a73e8', borderRadius: 16, padding: 24, marginTop: 16, alignItems: 'center',
    shadowColor: '#1a73e8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  resultadoLabel: { color: '#c2d9ff', fontSize: 13, marginBottom: 8, fontWeight: '600', letterSpacing: 1 },
  resultadoValorOrigem: { color: '#c2d9ff', fontSize: 16 },
  resultadoSeta: { color: '#fff', fontSize: 22, marginVertical: 4 },
  resultadoValor: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginBottom: 4 },
  resultadoNome: { color: '#c2d9ff', fontSize: 14 },
  historicoBtn: {
    marginTop: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#ddd',
  },
  historicoBtnTexto: { color: '#444', fontSize: 15, fontWeight: '600' },
});