import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, SafeAreaView, Dimensions, 
    TouchableOpacity, FlatList, Image, Modal 
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Galeria() {
    const navigation = useNavigation(); 
    const [images, setImages] = useState([]);
    const [permissionGranted, setPermissionGranted] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        loadImagesFromAppDirectory();
    }, []);

    const loadImagesFromAppDirectory = async () => {
        const appFolder = FileSystem.documentDirectory + 'fotos/';
        try {
            // Verificar se o diretório existe
            const folderInfo = await FileSystem.readDirectoryAsync(appFolder);
            const imageFiles = folderInfo.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

            const imageUris = imageFiles.map(file => appFolder + file);
            setImages(imageUris);
        } catch (error) {
            console.error('Erro ao carregar as imagens:', error);
        }
    };

    const renderCard = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => {
                setSelectedImage(item);
                setIsModalVisible(true);
            }}
        >
            <Image 
                source={{ uri: item }}
                style={styles.cardImage} 
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={width * 0.08} color="black" />
                </TouchableOpacity>
                
                <Text style={[styles.title, { fontSize: width * 0.07 }]}>Galeria</Text>
                <TouchableOpacity onPress={() => navigation.navigate('tirarFoto')}>
                    <AntDesign name="camera" size={width * 0.08} color="black" />
                </TouchableOpacity>
            </View>

            {permissionGranted ? (
                <FlatList 
                    data={images}
                    renderItem={renderCard}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    numColumns={3}
                    contentContainerStyle={styles.cardsContainer}
                    ListFooterComponent={loading && <Text style={styles.loadingText}>Carregando...</Text>}
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
                    {selectedImage && (
                        <Image 
                            source={{ uri: selectedImage }} 
                            style={styles.modalImage} 
                            resizeMode="contain" 
                        />
                    )}
                </View>
            </Modal>
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
    permissionText: {
        marginTop: 20,
        fontSize: width * 0.05,
        color: 'black',
        textAlign: 'center',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: width * 0.04,
        color: 'gray',
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '95%',
        height: '95%',
    },
    closeButton: {
        position: 'absolute',
        top: height * 0.05,
        right: width * 0.05,
        zIndex: 1,
    },
});
