import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {  excluirContato, carregarContatos } from './addContato';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

export default function Mensagem() {
    const navigation = useNavigation();
    const [contatos, setContatos] = useState([]);

    useFocusEffect(
        
        React.useCallback(() => {
            const fetchContatos = async () => {
                const contatosCarregados = await carregarContatos();
                setContatos(contatosCarregados);
            };
            fetchContatos();
        }, [])
    );
    /*
    const iniciarLigacao = (numero) => {
        const tel = `tel:${numero}`;
        Linking.openURL(tel).catch(err => console.error('Erro ao tentar fazer a ligação', err));
    };
    const handleExcluirContato = async (id) => {
        const novosContatos = await excluirContato(id); // Atualiza os contatos no AsyncStorage
        setContatos(novosContatos); // Atualiza o estado local
    };
    */

    return (
        <View style={styles.view}>
            <View style={styles.textoBotaoContainer}>
                <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.goBack()}>
                        <AntDesign name="left" size={width * 0.07} color="black" />
                    </TouchableOpacity>
                <Text style={styles.texto}> Contatos </Text>
                <TouchableOpacity>
                    <Image source={require('../assets/Group_177.png')} style={styles.btnMensagem} resizeMode='contain' />
                </TouchableOpacity>
            </View>
            <View style={styles.botoes}> 
            <FlatList
                data={contatos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => navigation.navigate('EditarContato', { contato: item })}
                    >
                        <Text style={styles.contactText}>{item.nome}</Text>
                    </TouchableOpacity>
                )}
                style={styles.contatosList}
            />
                <TouchableOpacity 
                    style={styles.botao} 
                    onPress={() => navigation.navigate('addcontatos')} 
                >                    
                    <Text style={styles.textoBotao}> Adicionar contato </Text>
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                    <Image source={require('../assets/adicionar.png')} style={styles.imagem} />
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
        paddingTop:40
    },
    texto: {
        marginTop: 20,
        fontSize: 17,
        textAlign: "center",
    },
    botoes: {
        marginTop: 60, 
        width: '100%',  
    },
    botao: {
        backgroundColor: "#fff", 
        padding: 20,
        borderColor: "#A9A4A4",
        borderTopWidth: 0.5,
        width: "100%", 
    },
    setinha: {
        position: "absolute",
        right: 15,
        width: 10,
        height: 20,
        top: 20,
    },
    imagem: {
        position: "absolute",
        left: 20,
        width: 28,
        height: 28,
        top: 14,
    },  
    textoBotao: {
        textAlign: "justify",
        marginLeft: 50,
        color:"#4092FF"
    },
    sair: {
        position: "absolute",
        width: 30,
        height: 30,
        top: 25,
        left: 20,
    },
    setaesquerda:{
       width: 10,
       height: 15,
       top:40
    },btnMensagem:{
        width: 50,
        height: 30,
        position: 'absolute',
        top: -25,
        right: -170
     },
    contatosList: {
        marginTop: 30,
        width: '100%',
        
    },
    contactItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF99',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        alignItems: 'center',
    },
    contactText: {
        fontSize: 18,
        marginLeft: 10
    },textoBotaoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
});
