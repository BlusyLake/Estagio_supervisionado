import React, { useRef } from 'react';
import { Button, Text, View, StyleSheet, Image, TouchableOpacity, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';

export default function SOS() {
  const navigation = useNavigation();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 30;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 30) {
          navigation.navigate('HomePage');
        }
      },
    })
  ).current;

  return (
    <View style={styles.view} {...panResponder.panHandlers}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient
        colors={['#E13E6E', '#F7CED4A6']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}>

        
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={() => navigation.navigate('configuracoes')}
        >
          <Image source={require('../assets/engrenagem.png')} style={styles.imageMenu} />
        </TouchableOpacity>

        
        <TouchableOpacity
          style={styles.rightButton}  
          onPress={() => navigation.navigate('informacoes')}  
        >
          <Image source={require('../assets/lampada.png')} style={styles.imageRightButton} />
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '100%', alignItems: 'center', position: 'absolute' }}>
          <Image source={require('../assets/setaBaixo.png')} style={styles.imageSetaBaixo} />
        </TouchableOpacity>

        <Image source={require('../assets/viva.png')} style={styles.image} />
        <View style={styles.esfera}></View>

        <TouchableOpacity style={{ position: 'relative', justifyContent: 'center', marginTop: '25%', height: '50%', width: '30%' }}>
          <Image source={require('../assets/circulo.png')} style={{ position: 'absolute', alignSelf: 'center', zIndex: 1, borderRadius: 1000, width: '110%', height: '105%' }} />
          <Image source={require('../assets/circulo2.png')} style={{ position: 'absolute', alignSelf: 'center', borderRadius: 1000, width: '160%', height: "150%" }} />
          <Image source={require('../assets/emergencia.png')} style={{ position: 'absolute', alignSelf: 'center', zIndex: 1, width: '80%', height: '65%' }} />
        </TouchableOpacity>
        <Text style={{ color: 'white', marginTop: '6%', fontSize: 18 }}>Emergência</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9497D',
  },
  image: {
    marginTop: '15%',
    zIndex: 1,
    width: '50%',
    height: 100,
    resizeMode: 'cover',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    height: '30%',
  },
  esfera: {
    marginTop: '50%',
    backgroundColor: '#fff',
    zIndex: 0,
    position: 'absolute',
    width: '190%',
    borderRadius: 2000,
    height: '300%',
    backgroundColor: '#F9497D',
  },
  imageMenu: {
    alignSelf: 'flex-start',
    marginLeft: '4%',
    marginTop: '15%',
    width: '5%',
    height: 20,
  },
  imageSetaBaixo: {
    position: 'absolute',
    marginTop: '13.8%',
    width: '5%',
    height: 12,
  },
  rightButton: {
    position: 'absolute',
    top: '24%', 
    right: '4%', 
  },
  imageRightButton: {
    width: 28, 
    height: 28, 
  },
});
