import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
    const route = useRoute();
    const [id, setId] = useState(route.params?.id || null); // Recebe o ID do contato, caso exista
    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [contatos, setContatos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');

    useEffect(() => {
        const carregarDados = async () => {
            const contatosSalvos = await carregarContatos();
            setContatos(contatosSalvos); // Atualiza a lista de contatos no estado

            if (id) {
                const contatoParaEditar = contatosSalvos.find(contato => contato.id === id);
                if (contatoParaEditar) {
                    setNome(contatoParaEditar.nome);
                    setCelular(contatoParaEditar.celular);
                }
            }
        };
        carregarDados();
    }, [id]);

    useEffect(() => {
        const carregarDados = async () => {
            const contatosSalvos = await carregarContatos();
            setContatos(contatosSalvos); // Atualiza a lista de contatos no estado
        };
        carregarDados();
    }, []);

    const gerarId = () => {
        const timestamp = Date.now().toString();
        const numeroAleatorio = Math.floor(10000 + Math.random() * 90000);
        return `${timestamp}-${numeroAleatorio}`;
    };
    
    const salvarContato = async () => {
        const numeroValido = /^\d{10,11}$/.test(celular);

        if (!nome || !celular) {
            setMensagemModal('Preencha todos os campos.');
            setModalVisible(true);
            return;
        }

        if (!numeroValido) {
            setMensagemModal('Número de celular inválido. Use 10 ou 11 dígitos.');
            setModalVisible(true);
            return;
        }

        const novoContato = { id: id || gerarId(), nome, celular };

        let contatosAtualizados;
        if (id) {
            // Atualiza o contato existente
            contatosAtualizados = contatos.map((contato) =>
                contato.id === id ? novoContato : contato
            );
        } else {
            // Adiciona um novo contato
            const numeroExistente = contatos.find(contato => contato.celular === celular);
            if (numeroExistente) {
                setMensagemModal('Esse número já está cadastrado!');
                setModalVisible(true);
                return;
            }
            contatosAtualizados = [...contatos, novoContato];
        }

        setContatos(contatosAtualizados);
        await AsyncStorage.setItem('contatos', JSON.stringify(contatosAtualizados));

        setMensagemModal(id ? 'Contato atualizado com sucesso!' : 'Contato salvo com sucesso!');
        setModalVisible(true);

        setNome('');
        setCelular('');
        setId(null);
        navigation.reset({
            index: 0,
            routes: [{ name: 'contatos' }],
          });
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
            <View style={styles.textoBotaoContainer}>
                <TouchableOpacity 
                    style={styles.sair} 
                    onPress={() => navigation.navigate('contatos')} 
                >
                    <Image source={require('../assets/setaesquerda.png')} style={styles.setaesquerda} />
                </TouchableOpacity>
                
                <Text style={styles.texto}>Adicionar Contatos</Text>
                <TouchableOpacity style={styles.botaoSalvar} onPress={salvarContato}>
                    <Text style={styles.textoSalvar}>Salvar</Text>
                </TouchableOpacity>
            </View>
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
        paddingTop:40
      
    },
    texto: {
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
        flex: 1,
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
        top: 20,
        left: 20,
    },
    setaesquerda: {
        marginTop: 5,
        width: 10,
        height: 15,
    },
    textInput: {
        flex: 2,
        color: '#F9497D',
        padding: 5,
        marginLeft: 10,
    },
    botaoSalvar: {
        backgroundColor: "#F9497D",
        paddingLeft: 10,
        position:'absolute',
        paddingBottom: 2,
        paddingTop: 2,
        paddingRight: 10,
        alignItems: "center",
        borderRadius: 10,
        right: 10,
        top: 90
    },
    textoSalvar: {
        color: "#FFFFFF",
        fontSize: 14,
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
    },textoBotaoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
});
