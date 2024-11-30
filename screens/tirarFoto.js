import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons'; // Importando ícones
import { Audio } from 'expo-av';

export default function TirarFoto() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);  
  const [videoUri, setVideoUri] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);  // Estado de câmera pronta
  const cameraRef = useRef(null);
  const [cameraMode, setCameraMode] = useState('picture'); // Estado para armazenar o modo da câmera

  const muteCamera = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    } catch (error) {
      console.error('Erro ao silenciar o som:', error);
    }
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.view}>
        <Text style={styles.message}>Você precisa habilitar a permissão da câmera</Text>
        <Button onPress={requestPermission} title="Permissão" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    // Colocando um delay para alternar o modo da câmera
    setCameraMode('picture');  // Garantir que o modo seja 'picture' antes de tirar a foto
    setTimeout(async () => {
      if (cameraRef.current) {
        await muteCamera();
        const photoData = await cameraRef.current.takePictureAsync();
        const photoUri = photoData.uri;

        const appFolder = FileSystem.documentDirectory + 'fotos/';
        const fileName = photoUri.split('/').pop();
        const savedUri = appFolder + fileName;

        try {
          await FileSystem.makeDirectoryAsync(appFolder, { intermediates: true });
          await FileSystem.moveAsync({
            from: photoUri,
            to: savedUri,
          });

          setPhoto(savedUri);
        } catch (error) {
          console.error('Erro ao salvar a foto:', error);
        }
      }
    }, 300); // Delay de 300ms
  };

  const startRecording = async () => {
    // Colocando um delay para alternar o modo da câmera
    setCameraMode('video');  // Garantir que o modo seja 'video' antes de começar a gravar
    setTimeout(async () => {
      if (cameraRef.current && !isRecording && isCameraReady) {
        try {
          setIsRecording(true);
  
          // Inicia a gravação com a verificação de erros
          const videoData = await cameraRef.current.recordAsync({
            onRecordingStatusUpdate: (status) => {
              if (status.isRecording) {
                console.log('Gravando...', status);
              }
              if (!status.isRecording && status.uri) {
                setVideoUri(status.uri);  // Gravação concluída
              }
            },
          });
  
          // Verifica se a gravação gerou dados válidos
          if (videoData && videoData.uri) {
            const appFolder = FileSystem.documentDirectory + 'fotos/'; // Pasta para vídeos
            const fileName = videoData.uri.split('/').pop(); // Obtendo o nome do arquivo
            const savedUri = appFolder + fileName; // Caminho completo do arquivo salvo
  
            // Criando o diretório se não existir
            await FileSystem.makeDirectoryAsync(appFolder, { intermediates: true });
  
            // Movendo o vídeo para o diretório privado do app
            await FileSystem.moveAsync({
              from: videoData.uri,
              to: savedUri,
            });
  
            setVideoUri(savedUri); // Atualiza o URI com o caminho onde o vídeo foi salvo
          } else {
            console.error('Erro: dados de vídeo inválidos');
          }
        } catch (error) {
          console.error('Erro ao iniciar a gravação do vídeo:', error);
        }
      }
    }, 300); // Delay de 300ms
  };
  

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        // Um pequeno atraso para garantir que a gravação seja concluída
        await new Promise(resolve => setTimeout(resolve, 500));  // 500ms de atraso

        setIsRecording(false);
        await cameraRef.current.stopRecording();
        console.log('Gravação de vídeo parada com sucesso.');
      } catch (error) {
        console.error('Erro ao parar a gravação do vídeo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView mode={cameraMode}
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        onCameraReady={onCameraReady}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Ionicons name="camera" size={32} color="white" />
          </TouchableOpacity>
          {isRecording ? (
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={stopRecording}>
              <Ionicons name="stop" size={32} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={startRecording}>
              <Ionicons name="videocam" size={32} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#FFE9E9",
    height: "100%",
    width: "100%", 
    alignContent: 'center',
    alignItems: "center",
    paddingTop: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  preview: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
