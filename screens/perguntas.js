import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const FAQScreen = ({ navigation }) => { 
 
  const faqData = [
    { id: '1', question: 'Como adicionar contatos de emergência ?', answer: 'A Responder.' },
    { id: '2', question: 'O que acontece ao selecionar um contato?', answer: 'A Responder.' },
    { id: '3', question: 'Que tipos de dados posso salvar no cofre?', answer: 'A Responder.' },
    { id: '4', question: 'Como funciona o Botão de Emergência?', answer: 'A Responder.' },
    { id: '5', question: 'O que acontece quando pressiono o botão?', answer: 'A Responder.' },
    { id: '6', question: 'Posso personalizar as ações do Botão de Emergência?', answer: 'A Responder.' },
  ];

 
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  
  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredData = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
     
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.arrowButton}  onPress={() => navigation.navigate('configuracoes')}> 
            <Icon name="chevron-left" size={40} color="#000" />
          </TouchableOpacity>

          <Text style={styles.header}>Perguntas frequentes</Text>

          </View>
      
          <Text style= {styles.info}> Algumas perguntas que são feitas frequentimente!</Text>
     
      <View style={styles.searchContainer}>        
        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      
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
    backgroundColor: "#FFCCCC",
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
    backgroundColor: "#FFE9E9",
    top:10,
    height: 80
    
  },
  arrowButton: {
    position: 'absolute', 
    top: '70%', 
    transform: [{ translateY: -20 }], 
  },
  header: {
    fontSize: 23,
    fontWeight: 'bold',
    color: "#FF5E8E",
    textAlign: 'center', 
    flex: 1,  
    marginTop:30
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
    width:'85%',
    alignSelf:'center'
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
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    marginHorizontal:25
   
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

  info: {

    paddingTop:10,
    width: '90%',
    fontSize: 14,
    textAlign:'center',
    color:"#fff",
    backgroundColor:"#FF5E8E",
    borderRadius:5,
    height:40,
    alignContent:'center',
    marginTop:25,
    alignSelf:'center'

  },
});

export default FAQScreen;
