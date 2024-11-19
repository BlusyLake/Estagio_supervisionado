import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const FAQScreen = ({ navigation }) => { // Adicionado 'navigation' como prop
  // Dados simulados de FAQ
  const faqData = [
    { id: '1', question: 'Como adicionar contatos de emergência ?', answer: 'A Responder.' },
    { id: '2', question: 'O que acontece ao selecionar um contato?', answer: 'A Responder.' },
    { id: '3', question: 'Que tipos de dados posso salvar no cofre?', answer: 'A Responder.' },
    { id: '4', question: 'Como funciona o Botão de Emergência?', answer: 'A Responder.' },
    { id: '5', question: 'O que acontece quando pressiono o botão?', answer: 'A Responder.' },
    { id: '6', question: 'Posso personalizar as ações do Botão de Emergência?', answer: 'A Responder.' },
  ];

  // Estado para controlar o FAQ expandido
  const [expandedIndex, setExpandedIndex] = useState(null);
  // Estado para armazenar o texto da busca
  const [searchQuery, setSearchQuery] = useState('');

  // Função para alternar o estado do FAQ expandido
  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Função para filtrar as FAQs com base no texto da busca
  const filteredData = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para renderizar cada item da lista de FAQs
  const renderItem = ({ item, index }) => (
    <View style={styles.faqItem}>
      <View style={styles.faqHeader}>
        <TouchableOpacity onPress={() => toggleAnswer(index)} style={styles.questionContainer}>
          <Text style={styles.question}>{item.question}</Text>
        </TouchableOpacity>
        <Image source={require('../assets/adicionar1.png')} style={styles.faqImage} />
      </View>
      {expandedIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header com Gradiente e bordas arredondadas */}
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={['#F9497D', '#FFE9E9']}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          {/* Botão com imagem de seta à esquerda */}
          <TouchableOpacity style={styles.arrowButton}  onPress={() => navigation.navigate('configuracoes')}> 
            <Icon name="chevron-left" size={40} color="#000" />
          </TouchableOpacity>

          {/* Título "Perguntas Frequentes" centralizado */}
          <Text style={styles.header}>Perguntas Frequentes</Text>
        </View>
      </LinearGradient>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Lista de FAQs filtradas */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFE9E9",
    height: "100%",
    width: "100%",
  },
  headerContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 30,
    paddingVertical: 30,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  headerContent: {
    flexDirection: 'row',  
    alignItems: 'center',  
    width: '100%', 
    justifyContent: 'center', 
  },
  arrowButton: {
    position: 'absolute', 
    left: -20,  
    top: '50%', 
    transform: [{ translateY: -20 }], 
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#000",
    textAlign: 'center', 
    flex: 1,  
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  faqItem: {
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqImage: {
    width: 40,
    height: 40,
  },
  questionContainer: {
    flex: 1,
  },
  question: {
    fontSize: 20,
    color: "#F9497D",
    fontWeight: 'bold',
  },
  answer: {
    fontSize: 16,
    marginTop: 10,
    color: "#F9497D",
  },
});

export default FAQScreen;
