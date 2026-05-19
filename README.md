# 💱 Conversor de Moedas

Aplicativo mobile desenvolvido com **React Native + Expo** que consome dados em tempo real da API pública [Frankfurter](https://www.frankfurter.dev) para realizar conversões entre as principais moedas do mundo.

---

## 📱 Funcionalidades

- Conversão em tempo real entre 11 moedas internacionais
- Exibição da cotação atual antes mesmo de converter
- Botão para inverter as moedas rapidamente
- Histórico das últimas 20 conversões realizadas
- Tratamento de erros com mensagens na tela
- Interface responsiva para Android, iOS e Web

---

## 🌍 Moedas Suportadas

| Bandeira | Sigla | Nome |
|----------|-------|------|
| 🇧🇷 | BRL | Real Brasileiro |
| 🇺🇸 | USD | Dólar Americano |
| 🇪🇺 | EUR | Euro |
| 🇬🇧 | GBP | Libra Esterlina |
| 🇦🇷 | ARS | Peso Argentino |
| 🇯🇵 | JPY | Iene Japonês |
| 🇨🇦 | CAD | Dólar Canadense |
| 🇦🇺 | AUD | Dólar Australiano |
| 🇨🇭 | CHF | Franco Suíço |
| 🇨🇳 | CNY | Yuan Chinês |
| 🇲🇽 | MXN | Peso Mexicano |

---

## 🔌 API Utilizada

**Frankfurter API** — [`https://api.frankfurter.dev/v1`](https://api.frankfurter.dev)

- Gratuita e sem necessidade de chave de autenticação
- Dados atualizados diariamente pelo Banco Central Europeu (BCE)
- Suporte a CORS para uso em aplicações web

Endpoints utilizados:
```
GET /v1/latest?from=USD&to=BRL
GET /v1/latest?amount=100&from=USD&to=BRL
```

---

## 🗂️ Estrutura do Projeto

```
conversor-moedas/
├── App.js                        # Navegação entre telas
├── app.json                      # Configuração do Expo
├── babel.config.js               # Configuração do Babel
├── package.json                  # Dependências do projeto
└── src/
    └── screens/
        ├── HomeScreen.js         # Tela principal (conversor)
        └── HistoricoScreen.js    # Tela de histórico
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) instalado
- [Expo Go](https://expo.dev/client) no celular (opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/conversor-moedas.git

# Entre na pasta
cd conversor-moedas

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

### Visualização

| Plataforma | Como abrir |
|------------|-----------|
| 📱 Celular | Escaneie o QR code com o app Expo Go |
| 🌐 Navegador | Aperte **W** no terminal após iniciar |
| 🤖 Android | Aperte **A** no terminal |
| 🍎 iOS | Aperte **I** no terminal |

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev)
- [Expo](https://expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Frankfurter API](https://www.frankfurter.dev)

---

## 👨‍💻 Autor

Projeto criado e desenvolvido por Ygor Sampaio Esteves como atividade prática da disciplina de Desenvolvimento Mobile.

O aplicativo foi desenvolvido com foco em consumo de APIs, navegação mobile, responsividade e experiência do usuário utilizando tecnologias modernas do ecossistema React Native.
