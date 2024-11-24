import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {  excluirContato, carregarContatos } from './addContato';

export default function Contatos() {
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

    const iniciarLigacao = (numero) => {
        const tel = `tel:${numero}`;
        Linking.openURL(tel).catch(err => console.error('Erro ao tentar fazer a ligação', err));
    };
    const handleExcluirContato = async (id) => {
        const novosContatos = await excluirContato(id); // Atualiza os contatos no AsyncStorage
        setContatos(novosContatos); // Atualiza o estado local
    };

    return (
        <View style={styles.view}>
            <TouchableOpacity 
                style={styles.sair} 
                onPress={() => navigation.navigate('configuracoes')} 
            >
                <Image source={require('../assets/setaesquerda.png')} style={styles.setaesquerda} />
            </TouchableOpacity>
            
            <Text style={styles.texto}> Contatos </Text>
            <View style={styles.botoes}> 
                <TouchableOpacity 
                    style={styles.botao} 
                    onPress={() => navigation.navigate('addcontatos')} 
                >                    
                    <Text style={styles.textoBotao}> Adicionar contato </Text>
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                    <Image source={require('../assets/adicionar.png')} style={styles.imagem} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={contatos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.contactItem}
                        onPress={() => iniciarLigacao(item.celular)}
                    >
                        <Text style={styles.contactText}>{item.nome}</Text>
                        <Text style={styles.contactText}>{item.celular}</Text>
                        <TouchableOpacity onPress={() => handleExcluirContato(item.id)}>
                            <Text style={styles.excluir}>Excluir</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                style={styles.contatosList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: "#FFE9E9",
        height: "100%",
        width: "100%", 
        alignItems: "center",
        paddingTop:40,
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
        width: 30,
        height: 30,
        top: 14,
    },  
    textoBotao: {
        textAlign: "justify",
        marginLeft: 50,
        color:"#A8A3A3"
    },
    sair: {
        position: "absolute",
        width: 30,
        height: 30,
        top: 54,
        left: 20,
    },
    setaesquerda:{
       width: 10,
       height: 15,
    },
    contatosList: {
        marginTop: 30,
        width: '100%',
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        alignItems: 'center',
    },
    contactText: {
        fontSize: 18,
    },
});
