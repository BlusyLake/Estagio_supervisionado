import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const carregarContatos = async () => {
    try {
        const contatosSalvos = await AsyncStorage.getItem('contatos');
        if (contatosSalvos) {
            return JSON.parse(contatosSalvos);
        }
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const excluirContato = async (id) => {
    try {
        const contatosSalvos = await carregarContatos();
        const novosContatos = contatosSalvos.filter(contato => contato.id !== id);
        await AsyncStorage.setItem('contatos', JSON.stringify(novosContatos));
        return novosContatos; // Retorna a lista atualizada
    } catch (error) {
        console.error('Erro ao excluir contato:', error);
        return [];
    }
};
export default function Contatos() {
    const navigation = useNavigation();
    
    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [contatos, setContatos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');

    useEffect(() => {
        carregarContatos();
    }, []);

    const salvarContato = async () => {
        // Regex para verificar se o número contém apenas dígitos e tem entre 10 e 11 caracteres.
        const numeroValido = /^\d{10,11}$/.test(celular);

        if (nome && celular) {
            if (!numeroValido) {
                setMensagemModal('Por favor, insira um número de celular válido com 10 ou 11 dígitos.');
                setModalVisible(true);
                return;
            }

            // Verifica se o número já existe na lista de contatos
            const numeroExistente = contatos.find(contato => contato.celular === celular);
            if (numeroExistente) {
                setMensagemModal('Esse número já está cadastrado!');
                setModalVisible(true);
                return;
            }

            // Verifica se já existem 4 contatos
            if (contatos.length >= 4) {
                setMensagemModal('Você pode salvar no máximo 4 contatos!');
                setModalVisible(true);
                return;
            }

            // Cria um novo contato
            const novoContato = { id: Date.now().toString(), nome, celular };

            const novosContatos = [...contatos, novoContato];
            setContatos(novosContatos);

            await AsyncStorage.setItem('contatos', JSON.stringify(novosContatos));

            setNome('');
            setCelular('');
        } else {
            setMensagemModal('Por favor, preencha todos os campos');
            setModalVisible(true);
        }
    };

    const handleCelularChange = (text) => {
        // Remove caracteres não numéricos
        const apenasNumeros = text.replace(/\D/g, '');

        // Limita a quantidade de caracteres a 11
        if (apenasNumeros.length <= 11) {
            setCelular(apenasNumeros);
        }
    };

  
  

    return (
    
        <View style={styles.view}>
            <TouchableOpacity 
                style={styles.sair} 
                onPress={() => navigation.navigate('contatos')} 
            >
                <Image source={require('../assets/setaesquerda.png')} style={styles.setaesquerda} />
            </TouchableOpacity>
            
            <Text style={styles.texto}>Adicionar Contatos</Text>
            
            <View style={styles.botoes}>
                <View style={styles.botao}>
                    <Text style={styles.textoBotao}>Nome</Text>
                    <TextInput
                        style={styles.textInput}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome"
                    />
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                </View>

                <View style={styles.botao}>
                    <Text style={styles.textoBotao}>Celular</Text>
                    <TextInput
                        style={styles.textInput}
                        value={celular}
                        onChangeText={handleCelularChange} // Chama a função para formatar o número
                        placeholder="Digite o celular"
                        keyboardType="numeric" // Apenas números no teclado
                        maxLength={11} // Garante um limite de 11 caracteres
                    />
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                </View>
            </View>
            
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarContato}>
                <Text style={styles.textoSalvar}>Salvar</Text>
            </TouchableOpacity>

          { /* <FlatList
                data={contatos}
                keyExtractor={(item) => item.id}
                style={styles.contatosList}
                renderItem={({ item }) => (
                    <View style={styles.contactItem}>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactText}>{item.nome}</Text>
                            <Text style={styles.contactText}>{item.celular}</Text>
                        </View>
                        <TouchableOpacity onPress={() => excluirContato(item.id)}>
                            <Text style={styles.excluir}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />/*}

            {/* Modal para alertas */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{mensagemModal}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    setinha: {
        position: "absolute",
        left: 90,
        width: 10,
        height: 20,
        top: 30,
    },
    textoBotao: {
        flex: 1,
        color: "#A8A3A3",
    },
    sair: {
        position: "absolute",
        width: 30,
        height: 30,
        top: 54,
        left: 20,
    },
    setaesquerda: {
       width: 10,
       height: 15,
    },
    textInput: {
        flex: 2,
        padding: 5,
        marginLeft: 10,
    },
    botaoSalvar: {
        height: 50,
        marginTop: 20,
    },
    textoSalvar: {
        height: 50,
        width: 200,
        backgroundColor: "#F9497D",
        marginTop: 30,
        fontSize: 20,
        paddingTop: 7,
        color: "#FFF",
        borderRadius: 10,
        textAlign: "center",
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
    contactInfo: {
        flex: 1,
    },
    contactText: {
        fontSize: 18,
    },
    excluir: {
        color: 'red',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    },
    modalView: {
        width: '80%',
        padding: 20,
        backgroundColor: '#F9497D', // Cor rosa para o modal
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        color: '#FFFFFF', // Texto branco
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#FF6F91', // Cor do botão de fechar
        borderRadius: 5,
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF', // Texto do botão de fechar
        fontSize: 16,
    },
});
