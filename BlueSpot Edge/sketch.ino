#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define DHTPIN 4  
#define DHTTYPE DHT22   
#define POTPIN 34       

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup_wifi() {
  delay(10);
  Serial.println("Conectando ao WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Lidar com mensagens recebidas, se necessário
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando se conectar ao MQTT Broker...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado ao broker MQTT");
    } else {
      Serial.print("Falha na conexão, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos");
      delay(1000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Ler dados do sensor DHT
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Ler velocidade do vento do potenciômetro
  int potValue = analogRead(POTPIN);
  float windSpeed = map(potValue, 0, 4095, 0, 100); // Mapear a leitura do potenciômetro para o intervalo de 0 a 100
  
  // Gerar valores aleatórios para latitude e longitude
  float latitude = random(0, 100);
  float longitude = random(0, 100);
  
  // Criar um objeto JSON com os dados
  StaticJsonDocument<200> doc;
  doc["latitude"] = latitude;
  doc["longitude"] = longitude;
  doc["umidade"] = humidity;
  doc["temperatura"] = temperature;
  doc["vento"] = windSpeed;
  
  // Serializar o objeto JSON em uma string
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  
  // Publicar os dados no tópico MQTT
  client.publish("topic/gsesp32", jsonBuffer);
  
  delay(1000); // Intervalo entre as leituras e envios
};