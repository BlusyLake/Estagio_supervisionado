import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Image, Dimensions, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

export default function Informacoes() {
    const navigation = useNavigation();
    const flatListRef = useRef(null);

    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'poppins-regular': require('../assets/fonts/Poppins-Regular.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    const images = [
        require('../assets/NaoSeCale.png'),
        require('../assets/TenhaProva.png'),
        require('../assets/TenhaUmaRede.png'),
        require('../assets/TenhaMalaEmergencia.png'),
        require('../assets/MantenhaSeguraRua.png'),
    ];

    const renderItem = ({ item }) => (
        <View style={styles.carouselItem}>
            <Image source={item} style={styles.image} />
        </View>
    );

    const scrollToNext = () => {
        const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
    };

    const scrollToPrev = () => {
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
        setCurrentIndex(prevIndex);
    };

    return (
        <View style={styles.view}>
            <StatusBar translucent backgroundColor="#F9497D" barStyle="dark-content" />

            <View style={styles.titulo}>
                <Text style={styles.texto}>Sua voz contra a violência</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                contentContainerStyle={styles.flatListContent}
                snapToAlignment="center"
                decelerationRate="fast"
                bounces={false}
            />

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={scrollToPrev}>
                    <Image source={require('../assets/SetaEsquerda1.png')} style={styles.buttonImage} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={scrollToNext}>
                    <Image source={require('../assets/SetaDireita.png')} style={styles.buttonImage} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: "#FFE9E9",
        height: "100%",
        width: "100%",
        alignItems: "center",
        paddingTop: 40,
    },
    flatListContent: {
        alignItems: 'center',
    },
    carouselItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height, 
        borderRadius: 10,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    image: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain', 
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '102%',
        marginTop: 40,
        position: 'absolute',
        bottom: -23,
    },
    button: {
        backgroundColor: 'transparent',
        padding: 10,
    },
    buttonImage: {
        width: 50,
        height: 70,
        resizeMode: 'contain',
    },
    titulo: {
        backgroundColor: "FFE9E9",
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    texto: {
        color: "#FF5E8E",
        textAlign: 'justify',
        fontSize: 40,
        fontFamily: 'poppins-regular',
        fontWeight: 'bold',
    },
});
