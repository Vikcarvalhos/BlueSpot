# BlueSpot

## Descrição

BlueSpot é uma aplicação web projetada para facilitar a organização de mutirões de coleta e reciclagem de lixo. 

Nossa plataforma permite que os usuários se conectem e sinalizem locais que possuem acúmulo de lixo. 
Esses pontos sinalizados podem ser utilizados para organizar mutirões de coleta, ajudando aqueles que desejam se engajar em projetos sociais a encontrar locais próximos ou a sinalizar novos pontos de coleta.

Além disso, utilizamos os dados coletados para prever locais que podem ter acúmulo de lixo devido a eventos naturais (como vento ou chuva) ou não naturais (como descarte por conveniência). Nosso objetivo é criar uma rede colaborativa para combater a poluição e promover a reciclagem de maneira eficiente.

## Funcionalidades

- **Sinalização de Locais**: Usuários podem sinalizar locais com acúmulo de lixo no mapa interativo.
- **Organização de Mutirões**: Ferramentas que permitem aos usuários organizar e participar de mutirões de coleta de lixo.
- **Previsão de Acúmulo de Lixo**: Análise de dados coletados para prever áreas propensas ao acúmulo de lixo, ajudando na prevenção e na organização de futuras coletas.
- **Incentivos e Recompensas**: Parcerias com empresas que oferecem recompensas e descontos aos participantes dos mutirões, incentivando a participação ativa e constante.
- **Engajamento Social**: Criação de um ambiente colaborativo onde indivíduos e empresas podem se unir em prol de um objetivo comum: a limpeza e preservação do meio ambiente.
- **Relatórios e Análises**: Geração de relatórios detalhados sobre os locais de acúmulo de lixo e a eficácia dos mutirões, fornecendo insights para melhorias contínuas.

## Instalação

### Pré-requisitos

- Node.js
- npm (Node Package Manager)
- Python 3.12
- pip (Python Package Installer)
- Mosquitto MQTT
- Node-RED
- Wokwi (para simulação do ESP32)

### Passos para Instalação

#### 1. Aplicação ESP32

A aplicação ESP32 é responsável por coletar dados de sensores.

1. **Configuração do Wokwi:**
    - Navegue até a pasta ./BlueSpot/BlueSpot Edge/
    - Abra o link do arquivo wokwi-project.txt
    - Utilize o código fornecido para configurar o ESP32 e coletar dados dos sensores.

2. **Configuração do Node-RED:**
    - Instale o Node-RED seguindo as instruções em: https://nodered.org/docs/getting-started/local
    - Importe o fluxo no NODE-RED para receber os dados do ESP32 via MQTT e enviá-los para um arquivo `data.json`.

3. **Configuração do Mosquitto MQTT:**
    - Instale o Mosquitto MQTT seguindo as instruções em: https://mosquitto.org/download/

#### 2. Aplicação Python

A aplicação Python trata os dados recebidos do ESP32 e os armazena.

1. **Configuração do Ambiente Python:**
    - Instale a ultima versão do Python (v3.12)

2. **Instalação das Dependências:**
    - Navegue até o diretório do projeto:
      ```bash
      cd BlueSpot
      ```
    - Inicie um terminal e execute o comando:
      ```bash
      pip install -r requirements.txt
      ```
    - Certifique-se de que o arquivo `requirements.txt` inclua `Flask`, `Flask-CORS` e outras bibliotecas necessárias.

3. **Iniciando a Aplicação:**
    - Execute o script principal:
      ```bash
      python server.py
      ```
    - A aplicação irá tratar os dados recebidos e armazená-los em `db.json`.

#### 3. Aplicação Web em React

A aplicação web exibe informações e permite a interação do usuário.

1. **Configuração do Ambiente Node:**
    - Navegue até o diretório do projeto React:
      ```bash
      cd BlueSpot
      ```
    - Instale as dependências:
      ```bash
      npm install
      ```

2. **Iniciando a Aplicação:**
    - Inicie a aplicação React:
      ```bash
      npm run dev
      ```
    - Inicie o servidor Node:
      ```bash
      node server.js
      ```

A aplicação estará disponível em `http://localhost:3000`.
