import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const CardComponent = ({
  images,
  titleStyle,
  borderStyle,
  cardWidth = width * 0.9, // Largura do card padrão (proporcional ao tamanho da tela)
  cardHeight = height * 0.25, // Altura do card padrão (proporcional ao tamanho da tela)
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
      {images.map((image) => (
        <View
          key={image.id}
          style={[
            styles.card,
            { width: cardWidth, height: cardHeight },
            borderStyle,
          ]}
        >
          <Image
            source={image.source}
            style={styles.image} // A imagem vai ocupar 100% do card
            resizeMode="cover"
          />
          <Text style={[styles.title, titleStyle]}>{image.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    margin: width * 0.02, // Margem adaptativa
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.03, // Bordas arredondadas proporcionais
    overflow: 'hidden', // Para garantir que a borda arredondada seja aplicada
    marginRight: width * 0.03, // Espaço entre os cards
    justifyContent: 'center', // Centralizar conteúdo
    alignItems: 'flex-start', // Alinhamento do título
  },
  title: {
    position: 'absolute',
    top: height * 0.01, // Posição adaptativa
    left: width * 0.03, // Posição adaptativa
    fontSize: width * 0.04, // Tamanho da fonte proporcional
    fontWeight: 'bold',
    color: '#fff', // Cor do título
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente para melhor legibilidade
    padding: width * 0.02, // Padding proporcional
    borderRadius: width * 0.02, // Bordas arredondadas para o fundo do título
  },
  image: {
    width: '100%', // A imagem ocupa 100% da largura do card
    height: '100%', // A imagem ocupa 100% da altura do card
  },
});

export default CardComponent;
