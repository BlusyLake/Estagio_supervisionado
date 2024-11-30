import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions, Modal, TextInput, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { excluirContato, carregarContatos } from './addContato';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

export default function Contatos() {
    const navigation = useNavigation();
    const [contatos, setContatos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);  // Controla a visibilidade do modal
    const [message, setMessage] = useState('');  // Armazena a mensagem

    // Função para carregar os contatos
    useFocusEffect(
        React.useCallback(() => {
            const fetchContatos = async () => {
                const contatosCarregados = await carregarContatos();
                setContatos(contatosCarregados);
            };
            fetchContatos();
        }, [])
    );

    // Função para carregar a mensagem salva no AsyncStorage quando o modal for aberto
    useEffect(() => {
        const loadMessage = async () => {
            const savedMessage = await AsyncStorage.getItem('userMessage');
            if (savedMessage) {
                setMessage(savedMessage);  // Carrega a mensagem salva no input
            }
        };

        if (modalVisible) {
            loadMessage();  // Carrega a mensagem quando o modal estiver visível
        }

        // Fechar o modal ao pressionar o botão de voltar no Android
        const backAction = () => {
            if (modalVisible) {
                setModalVisible(false);
                return true; // Impede o fechamento padrão do Android
            }
            return false; // Permite o comportamento padrão do botão de voltar
        };

        // Adiciona o evento do botão de voltar
        BackHandler.addEventListener('hardwareBackPress', backAction);

        // Limpeza do evento ao desmontar o componente
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
        };
    }, [modalVisible]);

    // Função para salvar a mensagem no AsyncStorage
    const saveMessage = async () => {
        try {
            await AsyncStorage.setItem('userMessage', message);
            setModalVisible(false);  // Fecha o modal após salvar
            alert('Mensagem salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar a mensagem', error);
        }
    };

    return (
        <View style={styles.view}>
            <View style={styles.textoBotaoContainer}>
                <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.navigate('configuracoes')}>
                    <AntDesign name="left" size={width * 0.07} color="black" />
                </TouchableOpacity>
                <Text style={styles.texto}>Contatos</Text>
                <TouchableOpacity style={{ backgroundColor: '#F9497D' ,width:width * 0.15, height: height * 0.045, alignItems: 'center', borderRadius: 10, marginTop: 5 }} onPress={() => setModalVisible(true)}>
                    <MaterialCommunityIcons name='email-edit-outline' style={{ color: 'white' }} size={width * 0.08}/>
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
                <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('addcontatos')}>
                    <Text style={styles.textoBotao}>Adicionar contato</Text>
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                    <Image source={require('../assets/adicionar.png')} style={styles.imagem} />
                </TouchableOpacity>
            </View>

            {/* Modal de Mensagem */}
            <Modal
                visible={modalVisible}
                animationType="slide"  // animação de slide
                transparent={true}
                onRequestClose={() => setModalVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Escreva uma mensagem</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua mensagem"
                                value={message}
                                multiline={true}
                                numberOfLines={6}
                                textAlignVertical="top"
                                onChangeText={setMessage}  // Atualiza o valor da mensagem
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={saveMessage}>
                                    <Text style={styles.saveButtonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
        color: "#4092FF",
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
        marginLeft: 10,
    },
    textoBotaoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#F9497D',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: 'white',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        minHeight: 120,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    saveButton: {
        backgroundColor: '#FFFFFF',
        padding: 5,
        borderRadius: 10,
        width: '25%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#F9497D',
        fontSize: 16,
    }, 
    buttonContainer: {
        width: '100%',
        alignItems: 'flex-end',
        marginTop: 10,  // Dá um pequeno espaçamento superior
    },
});
