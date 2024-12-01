import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
        alert('Permissão para acessar a galeria é necessária!');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
    });

    if (!result.canceled) {
        const uri = result.assets[0].uri;
        await saveMediaToHiddenFolder(uri);
        return uri;
    }
    return null;
};

const saveMediaToHiddenFolder = async (uri) => {
    try {
      const folderPath = `${FileSystem.documentDirectory}hidden_media/`;
  
      const folderInfo = await FileSystem.getInfoAsync(folderPath);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      }
  
      const fileName = uri.split('/').pop();
      const filePath = `${folderPath}${fileName}`;
  
      await FileSystem.copyAsync({
        from: uri,
        to: filePath,
      });
  
      console.log(`Mídia salva com sucesso em: ${filePath}`);
      return filePath;
  
    } catch (error) {
      console.error("Erro ao salvar a mídia:", error);
      alert("Houve um erro ao salvar a mídia. Por favor, tente novamente.");
    }
  };
  

export const showSavedMedia = async () => {
    const folderPath = `${FileSystem.documentDirectory}hidden_media/`;
    const files = await FileSystem.readDirectoryAsync(folderPath);
    return files.map(file => `${folderPath}${file}`);
};

export const deleteMedia = async (mediaUri) => {
    try {
        await FileSystem.deleteAsync(mediaUri);
        console.log('Mídia excluída com sucesso!');
    } catch (error) {
        console.error("Erro ao excluir a mídia:", error);
    }
};

export const shareMedia = async (mediaUri) => {
    try {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(mediaUri);
        } else {
            alert('O compartilhamento não é suportado na plataforma.');
        }
    } catch (error) {
        console.error("Erro ao compartilhar a mídia:", error);
    }
};
