import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { atualizarContato, excluirContato } from './addContato';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function EditarContato() {
    const route = useRoute();
    const navigation = useNavigation();
    const { contato } = route.params;

    const [celular, setCelular] = useState(contato.celular.replace(/\D/g, ''));
    const [nome, setNome] = useState(contato.nome);

    const formatarTelefone = (numero) => {
        const apenasNumeros = numero.replace(/\D/g, '');
        if (apenasNumeros.length <= 10) {
            return apenasNumeros.replace(
                /(\d{2})(\d{1})(\d{4})(\d{4})/,
                '($1) $2 $3-$4'
            );
        } else {
            return apenasNumeros.replace(
                /(\d{2})(\d{1})(\d{4})(\d{4})/,
                '($1) $2 $3-$4'
            );
        }
    };

    const handleCelularChange = (text) => {
        const apenasNumeros = text.replace(/\D/g, '');
        setCelular(apenasNumeros);
    };

    const handleSalvar = async () => {
        const id = contato.id;
        navigation.navigate('addcontatos', { id, nome, celular: celular.replace(/\D/g, '') });
    };

    const handleExcluir = async () => {
        Alert.alert(
            "Excluir Contato",
            "Tem certeza que deseja excluir este contato?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        await excluirContato(contato.id); 
                        Alert.alert("Sucesso", "Contato excluído com sucesso!");
                        navigation.goBack();
                    }
                }
            ]
        );
    };
    const buscarContatoPorId = async (id) => {
        const contatos = await AsyncStorage.getItem('contatos');
        const contatosParse = JSON.parse(contatos);
        return contatosParse.find(c => c.id === id);
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchContato = async () => {
                const contatoAtualizado = await buscarContatoPorId(contato.id);
                if (contatoAtualizado) {
                    setNome(contatoAtualizado.nome);
                    setCelular(contatoAtualizado.celular.replace(/\D/g, ''));
                }
            };
            fetchContato();
            
        }, [contato.id]) 
    );


    return (
        <View style={styles.view}>
            <View style={styles.textoBotaoContainer}>
                <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={width * 0.07} color="black" />
                </TouchableOpacity>
                <Text style={styles.texto}>Editar Contato</Text>
                <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
                    <Text style={styles.textoBotao}>Editar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Celular"
                        value={formatarTelefone(celular)} 
                        onChangeText={handleCelularChange} 
                        keyboardType="phone-pad"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
                <Text style={styles.textoBotaoExcluir}>Excluir contato</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: "#FFE9E9",
        height: "100%",
        marginTop: 30,
        width: "100%",
        alignItems: "center",
    },
    texto: {
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
        flex: 1,
    },
    sair: {
        position: "absolute",
        width: 30,
        height: 30,
        top: 20,
        left: 20,
    },
    setaesquerda: {
        marginTop: 5,
        width: 10,
        height: 15,
    },
    textoBotaoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    inputContainer: {
        marginTop: 30,
        width: '100%',
    },
    inputGroup: {
        backgroundColor: '#FFFFFF99',
        justifyContent: 'space-between',
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#A9A4A4',
        width: '100%',
    },
    input: {
        color: '#999597',
        padding: 2,
        marginLeft: 10,
    },
    label: {
        color: 'black',
        fontWeight: '700',
        marginLeft: 10
    },
    buttonsContainer: {
        marginTop: 30,
        width: "90%",
    },
    botaoSalvar: {
        backgroundColor: "#F9497D",
        paddingLeft: 10,
        paddingBottom: 2,
        paddingTop: 2,
        right: 10,
        top: 60,
        position: 'absolute',
        paddingRight: 10,
        alignItems: "center",
        borderRadius: 10,
    },
    textoBotao: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    botaoExcluir: {
        backgroundColor: "#fff", 
        padding: 15,
        borderColor: "#A9A4A4",
        borderWidth: 0.5,
        width: "100%", 
    },
    textoBotaoExcluir: {
        textAlign: "center",
        fontSize: 16,
        color:"#C31C1C"
    },
});
