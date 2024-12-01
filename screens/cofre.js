import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, Image, Modal, Button, } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { pickMedia, showSavedMedia, deleteMedia, shareMedia } from '../cofreApi';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function Galeria() {
    const navigation = useNavigation();
    const [savedMedia, setSavedMedia] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);

    useEffect(() => {
        fetchSavedMedia();
    }, []);

    const fetchSavedMedia = async () => {
        const media = await showSavedMedia();
        setSavedMedia(media);
    };

    const handlePickMedia = async () => {
        const media = await pickMedia();
        if (media) fetchSavedMedia(); // Atualiza a galeria
    };

    const openMediaInFullScreen = (mediaUri) => {
        setCurrentMedia(mediaUri);
        setIsModalVisible(true);
    };

    const exMedia = async () =>{
        deleteMedia(currentMedia);
        setIsModalVisible(false);
        fetchSavedMedia();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign
                    name="left"
                    size={width * 0.08}
                    color="black"
                    />
                </TouchableOpacity>
                <Text style={[styles.title,{ fontSize: width * 0.07 }]}>Cofre</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handlePickMedia}
                >
                    <AntDesign name='plus' size={width * 0.05} style={styles.actionText} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.gallery}>
                {savedMedia.map((mediaUri, index) => (
                    <TouchableOpacity key={index} onPress={() => openMediaInFullScreen(mediaUri)}>
                        {mediaUri.endsWith('.mp4') ? (
                            <Video
                                source={{ uri: mediaUri }}
                                resizeMode="cover"
                                shouldPlay={false}
                                style={styles.media}
                            />
                        ) : (
                            <Image source={{ uri: mediaUri }} style={styles.media} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                        <AntDesign name='close' size={24} color="pink"/>
                    </TouchableOpacity>
                    {currentMedia && currentMedia.endsWith('.mp4') ? (
                        <Video
                            source={{ uri: currentMedia }}
                            resizeMode="contain"
                            shouldPlay
                            style={styles.fullscreenMedia}
                        />
                    ) : (
                        <Image source={{ uri: currentMedia }} style={styles.fullscreenMedia} />
                    )}
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => exMedia(currentMedia)}>
                            <Text style={styles.modalButtonText}>Excluir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => shareMedia(currentMedia)}>
                            <Text style={styles.modalButtonText}>compartilhar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#F9497D',
        padding: 5,
        width: width * 0.12,
        height: height * 0.045,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        color: 'white',
    },
    gallery: { 
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        
    },
    media: {
        width: width * 0.4,
        height: width * 0.4,
        marginBottom: 10,
        borderRadius: 7,
        overflow: 'hidden',
        
    },
    modal: { 
        flex: 1, 
        backgroundColor: 'black', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    fullscreenMedia: {
        width: '100%',
        height: '80%',
        marginTop: 10,
    },
    modalActions: {
        flexDirection: 'row', 
        marginTop: 20, 
    },
    closeButton:{
        position: 'absolute',
        top: 10,
        right: 330,
        zIndex: 1,
        backgroundColor: '#F9497D',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalActions: {
        widht: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 20,
    },
    modalButton: {
        backgroundColor: '#F9497D',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 30,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
