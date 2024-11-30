import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, SafeAreaView, Dimensions, 
    TouchableOpacity, FlatList, Image, Modal, Alert 
} from "react-native";
import JSZip from 'jszip';
import * as Sharing from 'expo-sharing'; 
import { AntDesign, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av'; // Corrigido importação para vídeo

const { width, height } = Dimensions.get('window');

export default function Galeria() {
    const navigation = useNavigation(); 
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

    const loadMediaFromAppDirectory = async () => {
        const appFolder = FileSystem.documentDirectory + 'fotos/';
        try {
            const folderInfo = await FileSystem.readDirectoryAsync(appFolder);
            const mediaFiles = folderInfo.filter(file => 
                file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.mp4')
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

    const createZipFile = async (files) => {
        const zip = new JSZip();
        const cacheDirectory = FileSystem.cacheDirectory;
        const zipPath = cacheDirectory + 'shared_files.zip';
    
        try {
            // Adiciona os arquivos ao ZIP
            for (let fileUri of files) {
                const fileName = fileUri.split('/').pop(); // Obtém o nome do arquivo
                const fileData = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                zip.file(fileName, fileData, { base64: true });
            }
    
            // Gera o arquivo ZIP em base64
            const zipContent = await zip.generateAsync({ type: 'base64' });
    
            // Salva o arquivo ZIP no sistema de arquivos do Expo
            await FileSystem.writeAsStringAsync(zipPath, zipContent, {
                encoding: FileSystem.EncodingType.Base64,
            });
    
            return zipPath;
        } catch (error) {
            console.error('Erro ao criar o arquivo zip:', error);
            return null;
        }
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

    const handleUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permissão negada", "Você precisa conceder permissão para acessar a galeria.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            const appFolder = FileSystem.documentDirectory + 'fotos/';
            const fileName = uri.split('/').pop();

            try {
                await FileSystem.moveAsync({
                    from: uri,
                    to: appFolder + fileName,
                });
                setMedia((prev) => [...prev, appFolder + fileName]);
            } catch (error) {
                console.error("Erro ao fazer upload:", error);
            }
        }
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
                        setSelectedMedia(item);
                        setIsVideo(item.endsWith('.mp4'));
                        setIsModalVisible(true);
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
                    <TouchableOpacity onPress={() => navigation.navigate('tirarFoto')}>
                        <AntDesign name="left" size={width * 0.08} color="black" />
                    </TouchableOpacity>
                    <Text style={[styles.title, { fontSize: width * 0.07 }]}>Cofre</Text>
                    {!isSelectionMode && (
                        <TouchableOpacity style={{ backgroundColor: '#F9497D', paddingLeft: 5, paddingRight: 5, width:width * 0.12, height:height * 0.035, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}} onPress={handleUpload}>
                            <AntDesign name='picture' size={width * 0.05} style={styles.actionText}/>
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
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={() => setIsModalVisible(false)}
                    >
                        <AntDesign name="close" size={width * 0.08} color="white" />
                    </TouchableOpacity>
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
                            resizeMode="contain" 
                        />
                    )}
                    <View style={styles.modalActions}>
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={() => shareMedia(selectedMedia)}
                        >
                            <Text style={styles.actionText}>Compartilhar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={async () => {
                                await FileSystem.deleteAsync(selectedMedia);
                                setMedia((prev) => prev.filter((item) => item !== selectedMedia));
                                setIsModalVisible(false);
                            }}
                        >
                            <Text style={styles.actionText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
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
    modalMedia: {
        width: '95%',
        height: '95%',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    permissionText: {
        textAlign: 'center',
    },selectionActionsHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9497D',
        padding: 10,
    },
    selectionActions: {
        flexDirection: 'row',
        backgroundColor: '#F9497D',
        justifyContent: 'space-between',
        padding: 1,
    },
    actionButton: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 8,
    },
    actionText: {
        color: '#FFFFFF',
    },
});
