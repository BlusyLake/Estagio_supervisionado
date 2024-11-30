import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; // Importando ícones
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native'; // Importando useNavigation

export default function TirarFoto() {
  const [flashMode, setFlashMode] = useState('false');
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);  
  const [videoUri, setVideoUri] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);  // Estado de câmera pronta
  const cameraRef = useRef(null);
  const [mediaUri, setMediaUri] = useState(null);
  const [cameraMode, setCameraMode] = useState('picture'); // Estado para armazenar o modo da câmera
  const navigation = useNavigation(); // Acessando a navegação

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
  const toggleFlash = () => {
    setFlashMode(prevFlashMode => !prevFlashMode);  // Inverte o valor do flashMode
    console.log(flashMode);  // Verifique no console se está funcionando
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    setMediaUri(null); // Limpar a mídia anterior antes de capturar
    setCameraMode('picture');  // Garantir que o modo seja 'picture' antes de tirar a foto
    setTimeout(async () => {
      if (cameraRef.current) {
        await muteCamera();
        
        const photoData = await cameraRef.current.takePictureAsync();
        const photoUri = photoData.uri;
        
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Meses começam de 0
        const year = currentDate.getFullYear();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
        const fileName = `${day}-${month}-${year}${hours}-${minutes}-${seconds}.jpg`;
        const appFolder = FileSystem.documentDirectory + 'fotos/';
        const savedUri = appFolder + fileName;
    
        try {
          await FileSystem.makeDirectoryAsync(appFolder, { intermediates: true });
          await FileSystem.moveAsync({ from: photoUri, to: savedUri });
    
          setMediaUri(savedUri);  // Atualiza o estado da mídia (foto)
    
          console.log('Foto salva em:', savedUri);
        } catch (error) {
          console.error('Erro ao salvar a foto:', error);
        }
      }
    }, 100); // Delay de 100ms para garantir que o estado de foto seja atualizado
  };
    
  const startRecording = async () => {
    setMediaUri(null); // Limpar a mídia anterior antes de gravar
    setCameraMode('video');  // Garantir que o modo seja 'video' antes de começar a gravar
    setTimeout(async () => {
      if (cameraRef.current && !isRecording && isCameraReady) {
        try {
          setIsRecording(true);
  
          const videoData = await cameraRef.current.recordAsync({
            onRecordingStatusUpdate: (status) => {
              if (status.isRecording) {
                console.log('Gravando...', status);
              }
              if (!status.isRecording && status.uri) {
                setMediaUri(status.uri);  // Atualiza o estado com o URI do vídeo
              }
            },
          });
  
          if (videoData && videoData.uri) {
            // Formatar a data para o nome do arquivo
            const currentDate = new Date();
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Meses começam de 0
            const year = currentDate.getFullYear();
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
            // Gerar o nome do arquivo no formato dd-MM-YYYYHH-mm-ss.mp4
            const fileName = `${day}-${month}-${year}${hours}-${minutes}-${seconds}.mp4`;
  
            const appFolder = FileSystem.documentDirectory + 'fotos/'; // Pasta para vídeos
            const savedUri = appFolder + fileName; // Caminho completo do arquivo salvo
  
            // Criando o diretório se não existir
            await FileSystem.makeDirectoryAsync(appFolder, { intermediates: true });
  
            // Movendo o vídeo para o diretório privado do app
            await FileSystem.moveAsync({
              from: videoData.uri,
              to: savedUri,
            });
  
            setMediaUri(savedUri);  // Atualiza o estado com o URI do vídeo
  
            // Captura da data e hora atual no momento da gravação
            const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            console.log('Data do vídeo:', formattedDate); // Aqui você pode armazenar ou exibir a data
  
          } else {
            console.error('Erro: dados de vídeo inválidos');
          }
        } catch (error) {
          console.error('Erro ao iniciar a gravação do vídeo:', error);
        }
      }
    }, 100); // Delay de 100ms
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
        enableTorch={flashMode}
        onCameraReady={onCameraReady}
      >
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <MaterialCommunityIcons name={flashMode ? 'flash' : 'flash-off'} size={32} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.overlay}>
        <View style={styles.thumbnailContainer}>
  {mediaUri && (  // Exibe a miniatura quando há uma foto ou vídeo
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={{ uri: mediaUri }} style={styles.thumbnail} />
    </TouchableOpacity>
  )}
</View>
          {isRecording ? (
            <TouchableOpacity style={[styles.button, { backgroundColor: '#FFFFFF' }]} onPress={stopRecording}>
              <Ionicons name="stop" size={32} color="#F9497D" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={startRecording}>
              <View style={styles.buttonEllipseRecord}></View>
            </TouchableOpacity>
          )}
          
          <View style={styles.buttonEllipse}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Ionicons name="camera" size={32} color="#F9497D" />
            </TouchableOpacity>
          </View>          
          <TouchableOpacity style={styles.switchCameraButton} onPress={toggleCameraFacing}>
            <MaterialIcons name="screen-rotation-alt" size={32} color="#FFFF" />
          </TouchableOpacity>
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
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonEllipseRecord: {
    width: 20,
    height: 20,
    borderRadius: 35,
    backgroundColor: '#F9497D',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonEllipse: {
    width: 60,
    height: 60,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  thumbnailContainer: {
    flexDirection: 'row', // Alinha a miniatura e os outros itens à esquerda
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  thumbnail: {
    width: 50,
    height: 50,
    
    borderRadius: 10,
    marginRight: 8,
  },
  switchCameraButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },flashButton: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 1,
  }
});
