import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'; 
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

// Configuração de idioma para português com apenas a inicial dos dias da semana
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], // Apenas a inicial dos dias da semana
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function Calendario() {
  const navigation = useNavigation();

  // Define as datas para o mês atual e o mês seguinte
  const currentMonth = moment().format('YYYY-MM-DD');
  const nextMonth = moment().add(1, 'month').format('YYYY-MM-DD');

  return (
    <View style={styles.view}>
      <TouchableOpacity 
        style={styles.sair} 
        onPress={() => navigation.navigate('HomePage')} 
      >
        <Image source={require('../assets/setarosa.png')} style={styles.imagem} />
      </TouchableOpacity>

      <View style={styles.calendarContainer}>
        {/* Calendário para o mês atual */}
        <Calendar 
          style={styles.calendar} 
          current={currentMonth}
        />

        {/* Calendário para o mês seguinte, sem os dias da semana */}
        <Calendar 
          style={[styles.calendar, styles.hideWeekdays]} 
          current={nextMonth}
          theme={{
            textSectionTitleColor: 'transparent', // Oculta o texto dos dias da semana
            dayTextColor: '#000', // Cor do texto dos dias
            todayTextColor: '#F9497D', // Cor do texto para o "hoje"
            selectedDayTextColor: '#fff', // Cor do texto do dia selecionado
            arrowColor: 'transparent', // Oculta as setas de navegação
            monthTextColor: '#000', // Cor do mês
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomePage')}
      >
        <Text style={styles.buttonText}>Editar menstruação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#FFE9E9',
    height: '100%',
    width: '100%',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 80,
  },
  calendar: {
    backgroundColor: 'transparent',
    marginTop: -10, // Reduz o espaço entre os dois calendários
  },
  hideWeekdays: {
    // Oculta os dias da semana no segundo calendário
    height: 'auto',
  },
  button: {
    backgroundColor: '#F9497D',
    padding: 10,
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  sair: {
    position: 'absolute',
    top: 40, 
    padding: 10,
    backgroundColor: 'transparent',
    left: 15,
  },
  imagem: {
    width: 10,  
    height: 15, 
  },
});
