import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Image } from "react-native";
import { AntDesign, SimpleLineIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Cofre() {
    const navigation = useNavigation(); 
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={width * 0.08} color="black" />
                </TouchableOpacity>
                
                <Text style={[styles.title, { fontSize: width * 0.07 }]}>Cofre</Text>
                <TouchableOpacity onPress={() => navigation.navigate('tirarFoto')}>
                    <AntDesign name="camera" size={width * 0.08} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('galeria')}>
                    <SimpleLineIcons name="picture" size={width * 0.14} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name="ondemand-video" size={width * 0.14} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Feather name="trash-2" size={width * 0.14} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity  style={styles.footerIcon} >
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
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#FFFFFF99',
        margin: 10,
        borderRadius: 10,
        padding: 10,
        height: height * 0.18,
        width: width * 0.42,
        borderColor: '#A9A4A4',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center', 
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