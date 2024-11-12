import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, FlatList, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Dados para os cards
const data = Array.from({ length: 25 }, (_, index) => ({ id: index + 1 }));

export default function Galeria() {
    const navigation = useNavigation(); 
    
    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={require('../assets/gallery.png')}
                style={styles.cardImage} 
            />
   
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={width * 0.08} color="black" />
                </TouchableOpacity>
                
                <Text style={[styles.title, { fontSize: width * 0.07 }]}>Galeria</Text>
                <TouchableOpacity>
                    <AntDesign name="camera" size={width * 0.08} color="black" />
                </TouchableOpacity>
            </View>
            
            <FlatList 
                data={data}
                renderItem={renderCard}
                keyExtractor={item => item.id.toString()}
                numColumns={3} 
                contentContainerStyle={styles.cardsContainer}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerIcon}>
                    <Image source={require('../assets/adicionar1.png')} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE9E9',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.05,
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
    },
    cardsContainer: {
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: '#FFFFFF99',
        margin: 8,
        borderRadius: 10,
        height: height * 0.15,
        width: width * 0.27,
        borderColor: '#A9A4A4',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardText: {
        marginTop: 5,
        fontSize: width * 0.035,
        color: 'black',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: height * 0.1,
        backgroundColor: '#FFFFFF99',
        borderTopWidth: 1,
        borderColor: '#A9A4A4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerIcon: {
        position: 'absolute',
        top: -height * 0.024,
    },
});
