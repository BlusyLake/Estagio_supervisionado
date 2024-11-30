import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { 
    View, Text, StyleSheet, SafeAreaView, Dimensions, 
    TouchableOpacity, FlatList, Image, Modal, Alert 
} from "react-native";
import * as Sharing from 'expo-sharing'; 
import { AntDesign, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Video } from 'expo-av'; // Corrigido importação para vídeo

const { width, height } = Dimensions.get('window');

export default function Galeria() {
    const navigation = useNavigation(); 
    const [mediaCreationDate, setMediaCreationDate] = useState(null);
    const [media, setMedia] = useState([]);
    const [permissionGranted, setPermissionGranted] = useState(true);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isVideo, setIsVideo] = useState(false);

    useEffect(() => {
        loadMediaFromAppDirectory();
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            loadMediaFromAppDirectory(); // Carregar mídia ao voltar para a tela
        }, [])
    );
    const loadMediaFromAppDirectory = async () => {
        const appFolder = FileSystem.documentDirectory + 'fotos/';
        try {
            const folderInfo = await FileSystem.readDirectoryAsync(appFolder);
            const mediaFiles = folderInfo.filter(file => 
                file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.mp4') || file.endsWith('.jpeg')
            );

            const mediaUris = mediaFiles.map(file => appFolder + file);
            setMedia(mediaUris);
        } catch (error) {
            console.error('Erro ao carregar as mídias:', error);
        }
    };

    const handleLongPress = (item) => {
        setIsSelectionMode(true);
        toggleSelection(item);
    };
    const toggleSelectAll = () => {
        if (selectAll) {
            // Desmarca todos os itens
            setSelectedItems([]);
        } else {
            // Marca todos os itens
            setSelectedItems([...media]);
        }
        setSelectAll(!selectAll); // Alterna o estado de "Selecionar Todos"
        setIsSelectionMode(!selectAll); // Ativa ou desativa o modo de seleção
    };

    const toggleSelection = (item) => {
        setSelectedItems((prev) => {
            const isSelected = prev.includes(item);
            const updatedSelection = isSelected 
                ? prev.filter((selectedItem) => selectedItem !== item) 
                : [...prev, item];

            if (updatedSelection.length === 0) {
                setIsSelectionMode(false);
            }
            return updatedSelection;
        });
    };

    const handleDelete = async () => {
        Alert.alert(
            "Confirmar exclusão",
            "Deseja realmente excluir os itens selecionados?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            for (const item of selectedItems) {
                                await FileSystem.deleteAsync(item);
                            }
                            setMedia((prev) => prev.filter((item) => !selectedItems.includes(item)));
                            setSelectedItems([]);
                            setIsSelectionMode(false);
                        } catch (error) {
                            console.error("Erro ao excluir as mídias:", error);
                        }
                    },
                },
            ]
        );
    };

    const extractDateFromFileName = (fileName) => {
        // Expressão regular para capturar a data e hora no formato: 30-11-202410-03-13
        const regex = /(\d{2})-(\d{2})-(\d{4})(\d{2})-(\d{2})-(\d{2})/;
        const match = fileName.match(regex);
        
        if (match) {
            const day = match[1]; // Dia
            const month = match[2]; // Mês
            const year = match[3]; // Ano
            const hour = match[4]; // Hora
            const minute = match[5]; // Minuto
            const second = match[6]; // Segundo
    
            // Criar a data para obter o dia da semana
            const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    
            // Função para formatar o dia da semana
            const formatWeekday = (date) => {
                const weekdays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
                return weekdays[date.getDay()];
            };
    
            // Formatar a data para exibir
            const weekday = formatWeekday(date);
            const time = `${hour}:${minute}`;
    
            return { weekday, time };
        }
    
        return { weekday: 'Data inválida', time: 'Hora inválida' };
    };
    
    const handleMediaPress = async (item) => {
        setSelectedMedia(item);
        setIsVideo(item.endsWith('.mp4'));
        setIsModalVisible(true);
    
        // Extraímos a data e hora do nome do arquivo
        const { weekday, time } = extractDateFromFileName(item);
        setMediaCreationDate({ weekday, time });  // Atualiza o estado com o dia da semana e hora
    };
    
    const uploadMedia = async () => {

        const permissionResult = await MediaLibrary.requestPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permissão negada", "Você precisa conceder permissão para acessar a galeria.");
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
    
        console.log("Resultado do ImagePicker:", result);
    
        if (!result.canceled) {
            const { uri, type } = result.assets[0];
    
            console.log("URI:", uri);
            console.log("Tipo de mídia:", type);
    
            if (!uri || !type) {
                console.log("Erro: URI ou tipo de mídia não encontrados.");
                return;
            }
    
            try {
                // Pegar a data de criação ou modificação antes de mover
                const fileInfo = await FileSystem.getInfoAsync(uri);
                let creationDate = fileInfo.modificationTime
                    ? new Date(fileInfo.modificationTime)
                    : new Date();  // Caso não tenha, usa a data atual
    
                // Verificar se a data é inválida (1970, que é a data de epoch)
                if (creationDate.getFullYear() === 1970) {
                    console.log("Data inválida, utilizando data atual.");
                    creationDate = new Date();  // Fallback para data atual
                }
    
                console.log('Data de criação/modificação:', creationDate);
    
                // Formatar a data de criação para o nome do arquivo
                const formattedDate = creationDate.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).replace(/[^\w\s-]/g, '-').replace(/\s/g, ''); // Remover caracteres inválidos para o nome do arquivo
    
                // Gerar novo nome para o arquivo com a data
                const fileExtension = type === 'image' ? '.jpg' : type === 'video' ? '.mp4' : '';
                const newFileName = `${formattedDate}${fileExtension}`;
    
                console.log("Novo nome do arquivo:", newFileName);
    
                const appFolder = FileSystem.documentDirectory + 'fotos/';
                const newUri = appFolder + newFileName;
    
                // Verificar se a pasta 'fotos' existe, caso contrário, criar
                const folderInfo = await FileSystem.getInfoAsync(appFolder);
                if (!folderInfo.exists) {
                    await FileSystem.makeDirectoryAsync(appFolder, { intermediates: true });
                }
    
                // Mover o arquivo para a pasta interna
                await FileSystem.moveAsync({ from: uri, to: newUri });
    
                // Exibindo um alerta de sucesso
                if (type === 'video') {
                    Alert.alert("Vídeo salvo com sucesso!");
                } else if (type === 'image') {
                    Alert.alert("Imagem salva com sucesso!");
                }
    
                // Atualizar o estado para refletir o arquivo movido
                setMedia((prev) => [...prev, newUri]);
    
            } catch (error) {
                console.error("Erro ao processar o arquivo:", error);
            }
        } else {
            console.log("Seleção de mídia cancelada.");
        }
    }
    
    const handleUpload = async () => {
        Alert.alert(
            "Escolha uma opção",
            "",
            [
              {
                text: "Cancelar",
                onPress: () => console.log("Cancelado"),
                style: "cancel",
              },
              {
                text: "Importar mídias",
                onPress: () => uploadMedia(),
              },
              {
                text: "Tirar Foto",
                onPress: () => navigation.navigate('tirarFoto'), // Navega para a página 'tirarFoto'
              }
            ]
          );
    };    
    
    const handleShareSelected = async () => {
        try {
            if (selectedItems.length === 0) {
                Alert.alert("Erro", "Nenhum item selecionado para compartilhar.");
                return;
            }
    
            // Copiar todos os arquivos para o cache temporário
            const copiedFiles = [];
            for (const uri of selectedItems) {
                const cachedUri = await copyFileToCache(uri);
                copiedFiles.push(cachedUri);
            }
    
            // Compartilhar todos os arquivos
            for (const cachedUri of copiedFiles) {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(cachedUri);
                } else {
                    Alert.alert("Erro", "O compartilhamento não está disponível neste dispositivo.");
                    return;
                }
            }
    
            setSelectedItems([]);  // Limpar a seleção após o compartilhamento
            setIsSelectionMode(false);  // Desativar o modo de seleção
    
        } catch (error) {
            console.error("Erro ao compartilhar as mídias:", error);
        }
    };    
    
    const shareMedia = async (uri) => {
        try {
            // Copia o arquivo para o cache antes de compartilhar
            const newUri = await copyFileToCache(uri);
    
            // Verifica se é vídeo ou imagem e chama a função de compartilhamento correspondente
            if (newUri.endsWith('.mp4') || newUri.endsWith('.mov')) {
                await shareVideo(newUri); // Compartilhar vídeo
            } else if (newUri.endsWith('.jpg') || newUri.endsWith('.jpeg') || newUri.endsWith('.png')) {
                await shareImage(newUri); // Compartilhar imagem
            }
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        }
    };
    
    const shareImage = async (uri) => {
        try {
            // Usando o Sharing do Expo para compartilhar a imagem
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                alert('O compartilhamento não está disponível neste dispositivo');
            }
        } catch (error) {
            console.error('Erro ao compartilhar imagem:', error);
        }
    };
    
    const shareVideo = async (uri) => {
        try {
            // Usando o Sharing do Expo para compartilhar o vídeo
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                alert('O compartilhamento não está disponível neste dispositivo');
            }
        } catch (error) {
            console.error('Erro ao compartilhar vídeo:', error);
        }
    };
    const clearCache = async () => {
        const cacheFolder = FileSystem.cacheDirectory + 'shared_media/';
        try {
            const directoryExists = await FileSystem.getInfoAsync(cacheFolder);
            if (directoryExists.exists) {
                const files = await FileSystem.readDirectoryAsync(cacheFolder);
                for (let file of files) {
                    await FileSystem.deleteAsync(cacheFolder + file);
                }
                console.log('Cache limpo com sucesso');
            }
        } catch (error) {
            console.error('Erro ao limpar o cache:', error);
        }
    };

    const copyFileToCache = async (uri) => {
        try {
            const cacheFolder = FileSystem.cacheDirectory + 'shared_media/';
            const fileName = uri.split('/').pop();
            const newUri = cacheFolder + fileName;
    
            const directoryExists = await FileSystem.getInfoAsync(cacheFolder);
            if (!directoryExists.exists) {
                await FileSystem.makeDirectoryAsync(cacheFolder, { intermediates: true });
            }
    
            await FileSystem.copyAsync({
                from: uri,
                to: newUri,
            });
    
            return newUri;
        } catch (error) {
            console.error("Erro ao copiar arquivo para o cache:", error);
            throw error;
        }
    };
    
    
    const renderCard = ({ item }) => {
        const isSelected = selectedItems.includes(item);

        return (
            <TouchableOpacity 
            style={[styles.card, isSelected && styles.selectedCard]}
            onLongPress={() => handleLongPress(item)}
            onPress={() => {
                if (isSelectionMode) {
                    toggleSelection(item);
                } else {
                    // Aqui você chama handleMediaPress ao pressionar a mídia
                    handleMediaPress(item);
                }
            }}
        >
            {item.endsWith('.mp4') ? (
                <View style={styles.videoPreview}>
                    <AntDesign name="play" size={width * 0.1} color="black" />
                </View>
            ) : (
                <Image source={{ uri: item }} style={styles.cardImage} />
            )}
        </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
           {isSelectionMode ? (
                <View style={styles.selectionActionsHeader}>
                    <TouchableOpacity style={styles.actionButton} onPress={toggleSelectAll}>
                        <MaterialCommunityIcons
                            name={selectAll ? 'radiobox-marked': 'radiobox-blank'} // 'checkcircle' para marcado, 'checkcircleo' para desmarcado
                            size={20}
                            color={selectAll ? '#FFFFFF' : '#FFFFFF'} // Altera a cor do ícone
                        />
                    </TouchableOpacity>
                        <Text style={styles.actionText}>Selecionar todas as mídias</Text>
                </View>
            ) : (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="left" size={width * 0.08} color="black" />
                    </TouchableOpacity>
                    <Text style={[styles.title, { fontSize: width * 0.07 }]}>Cofre</Text>
                    {!isSelectionMode && (
                        <TouchableOpacity style={{ backgroundColor: '#F9497D', paddingLeft: 5, paddingRight: 5, width:width * 0.12, height:height * 0.035, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}} onPress={handleUpload}>
                            <AntDesign name='picture' size={width * 0.05} style={{ color: 'white' }}/>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {permissionGranted ? (
                <FlatList 
                    data={media}
                    renderItem={renderCard}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    numColumns={3}
                    contentContainerStyle={styles.cardsContainer}
                />
            ) : (
                <Text style={styles.permissionText}>Permissão não concedida para acessar a galeria.</Text>
            )}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => {setIsModalVisible(false); loadMediaFromAppDirectory();}}
                        >
                            <AntDesign name="arrowleft" size={width * 0.08} color="black" />
                        </TouchableOpacity>
                        {mediaCreationDate && (
                            <View style={styles.creationDateContainer}>
                                <Text style={[styles.creationDateText, { fontWeight: 'bold', fontSize: 18 }]}>
                                    {mediaCreationDate.weekday}
                                </Text>
                                <Text style={styles.creationDateText}>
                                    {mediaCreationDate.time}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => shareMedia(selectedMedia)}
                        >
                            <AntDesign name="sharealt" size={width * 0.08} color="black" />
                        </TouchableOpacity>
                        
                    </View>
                    
                    {selectedMedia && isVideo ? (
                        <Video
                            source={{ uri: selectedMedia }}
                            style={styles.modalMedia}
                            resizeMode="contain"
                            useNativeControls
                            shouldPlay
                        />
                    ) : (
                        <Image
                            source={{ uri: selectedMedia }}
                            style={styles.modalMedia}
                            resizeMode="cover"
                        />
                    )}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={async () => {
                            await FileSystem.deleteAsync(selectedMedia);
                            setMedia((prev) => prev.filter((item) => item !== selectedMedia));
                            setIsModalVisible(false);
                        }}
                    >
                        <Text style={styles.deleteButtonText}>Apagar Imagem</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {isSelectionMode && (
                <View style={styles.selectionActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShareSelected}>
                        <AntDesign name='upload' size={width * 0.08} style={styles.actionText}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                        <FontAwesome name='trash-o' size={width * 0.08} style={styles.actionText}/>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        backgroundColor: '#FFE9E9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        flex: 1,  // Faz o título ocupar o espaço restante, centralizando-o
        textAlign: 'center', // Garante que o texto fique centralizado
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
    },cardsContainer: {
        paddingHorizontal: 10,
    },
    selectedCard: {
        borderColor: '#FF0000',
        borderWidth: 2,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    videoPreview: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(169, 164, 164, 0.7)',
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 10, // Garante que os botões fiquem acima da mídia
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    iconButton: {
        padding: 15, // Aumenta a área clicável
        
        borderRadius: 10, // Deixa os botões arredondados
    },
    modalMedia: {
        width: '100%',
        height: '100%', // Ocupa toda a altura disponível
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingVertical: 15,
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center', // Alinha verticalmente
        alignItems: 'center', // Alinha horizontalmente
        flexDirection: 'row', // Necessário para que o alinhamento funcione
    },
    deleteButtonText: {
        color: '#FF0000',
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center', // Garante que o texto esteja centralizado no botão
    },
    actionText: {
        color: '#FF0000',
        fontWeight: '400',
        fontSize: 16,
        textAlign: 'center',
    },
    creationDateContainer: {
        flex: 3, // O texto ocupará mais espaço
        alignItems: 'center', // Centraliza o texto horizontalmente
        justifyContent: 'center', // Centraliza o texto verticalmente
    },
    creationDateText: {
        color: '#000', 
        zIndex: 10,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },selectionActionsHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9497D',
        padding: 10,
    }, selectionActions: {
        flexDirection: 'row',
        backgroundColor: '#F9497D',
        justifyContent: 'space-between',
        padding: 1,
    },actionButton: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 8,
    },
    actionText: {
        color: '#FFFFFF',
    },
});
