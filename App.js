import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Text, View, StatusBar, TouchableOpacity, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';

import SosScreen from './screens/sos';
import Configuracoes from './screens/configuracoes';
import Contatos from './screens/contatos';
import Calendario from './screens/calendario';
import HomePage from './screens/homePage';
import Addcontatos from './screens/addContato';
import ConfigBotao from './screens/configBotao';
import Informacoes from './screens/informacoes';
import FAQScreen from './screens/perguntas';
import Cofre from './screens/cofre';

function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateLocation();
    }, 60000); // Atualiza a localização a cada 1 minuto

    return () => clearInterval(intervalId);
  }, []);

  const updateLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão para acessar a localização foi negada');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      sendLocationToBackend(loc); // Envia a localização para o backend
    } catch (error) {
      console.error('Erro ao obter a localização:', error);
    }
  };

  const sendLocationToBackend = async (loc) => {
    const locationData = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    try {
      const response = await fetch('https://realtime-location-api.onrender.com/localizacao/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data);
    } catch (error) {
      console.error('Erro ao enviar localização:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
      <Image source={require('./viva.jpeg')} style={{ width: '56%', height: 90 }} />
      <Image source={require('./logo.jpeg')} style={{ width: '100%', height: 250 }} />

      {location && (
        <Text style={{ color: '#000', marginTop: 10 }}>
          Localização Atual: {location.latitude}, {location.longitude}
        </Text>
      )}

      <Text style={{ textAlign: 'center', marginTop: '10%', color: '#000000B2', fontSize: 12 }}>
        Vamos nos conhecer!
      </Text>
      <Text style={{ color: '#F7054F', textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>
        Como devemos chamar você?
      </Text>

      <TextInput
        style={{
          backgroundColor: '#EDEFF1',
          height: 40,
          textAlign: 'center',
          borderRadius: 10,
          width: '80%',
          paddingHorizontal: 10,
          marginTop: 20,
        }}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        onPress={() => {
          console.log('Nome do usuário:', name);
          navigation.navigate('HomePage');
        }}
        style={{
          alignItems: 'center',
          width: '45%',
          marginTop: '20%',
          backgroundColor: '#F9497D',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 15,
        }}
      >
        <Text style={{ color: '#fff' }}>Vamos lá!</Text>
      </TouchableOpacity>

      <Text style={{
        marginLeft: '2%',
        marginRight: '2%',
        marginTop: '10%',
        fontSize: 8,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: -0.408,
        textAlign: 'center',
        color: '#000000',
      }}>
        Ao fazer login, você concorda com nossos Termos e Condições, saiba como usamos seus dados em nossa Política de Privacidade.
      </Text>
    </View>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <>
      <StatusBar backgroundColor="#F9497D" barStyle="light-content" />

      <HomeStack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 0,
          },
          headerTintColor: 'black',
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.navigate('HomePage')}
            >
              <Text style={{ color: '#808080', fontSize: 12 }}>Pular</Text>
            </TouchableOpacity>

            
          ),
        })}
      >
        <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
        <HomeStack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <HomeStack.Screen name="SOS" component={SosScreen} options={{ headerShown: false }} />
        <HomeStack.Screen name="calendario" component={Calendario} options={{ headerShown: false }} />
        <HomeStack.Screen name="configuracoes" component={Configuracoes} options={{ headerShown: false }} />
        <HomeStack.Screen name="contatos" component={Contatos} options={{ headerShown: false }} />
        <HomeStack.Screen name="configBotao" component={ConfigBotao} options={{ headerShown: false }} />
        <HomeStack.Screen name="addcontatos" component={Addcontatos} options={{ headerShown: false }} />
        <HomeStack.Screen name="informacoes" component={Informacoes} options={{ headerShown: false }} />
        <HomeStack.Screen name="perguntas" component={FAQScreen} options={{ headerShown: false }} />
        <HomeStack.Screen name="cofre" component={Cofre} options={{ headerShown: false }} />
      </HomeStack.Navigator>
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <HomeStackScreen />
    </NavigationContainer>
  );
}
