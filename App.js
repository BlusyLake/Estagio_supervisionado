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
    <View style={{ alignItems: 'center', backgroundColor: '#fff', paddingTop:60 }}>

      

      <Image source={require('./viva.jpeg')} style={{ width: '56%', height: 90 }} />
      <Image source={require('./logo.jpeg')} style={{ width: '100%', height: 250 }} />

     
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

      <TouchableOpacity
        style={{ position: 'absolute', right: 20, top: 20 }}
        onPress={() => navigation.navigate('HomePage')}
      >
        <Text style={{ color: '#808080', fontSize: 12 }}>Pular</Text>
      </TouchableOpacity>

      <Text
        style={{
          marginLeft: '2%',
          marginRight: '2%',
          marginTop: '10%',
          fontSize: 8,
          fontWeight: '400',
          lineHeight: 20,
          letterSpacing: -0.408,
          textAlign: 'center',
          color: '#000000',
        }}
      >
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
        screenOptions={{
          headerShown: false, // Remove o cabeçalho em todas as telas
        }}
      >
        <HomeStack.Screen name="Home" component={HomeScreen} />
        <HomeStack.Screen name="HomePage" component={HomePage} />
        <HomeStack.Screen name="SOS" component={SosScreen} />
        <HomeStack.Screen name="calendario" component={Calendario} />
        <HomeStack.Screen name="configuracoes" component={Configuracoes} />
        <HomeStack.Screen name="contatos" component={Contatos} />
        <HomeStack.Screen name="configBotao" component={ConfigBotao} />
        <HomeStack.Screen name="addcontatos" component={Addcontatos} />
        <HomeStack.Screen name="informacoes" component={Informacoes} />
        <HomeStack.Screen name="perguntas" component={FAQScreen} />
        <HomeStack.Screen name="cofre" component={Cofre} />
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
