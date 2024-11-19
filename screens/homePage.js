import React, { useState, useRef } from "react";
import { SafeAreaView, Text, StyleSheet, View, Dimensions, TouchableOpacity, Image, PanResponder, StatusBar } from 'react-native';
import Gota4 from '../assets/svg/Ellipse4';
import Gota5 from '../assets/svg/Ellipse5';
import Gota6 from '../assets/svg/Ellipse6';
import CalendarSlider from "../components/CalendarSlider";
import CardComponent from "../components/CardComponent";
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import img1 from '../assets/Garota1.png';
import img2 from '../assets/Garota2.png';
import img3 from '../assets/Garota3.png';
import img4 from '../assets/image1.png';

const images = [
    { id: '1', source: img1, title: 'Título 1' },
    { id: '2', source: img2, title: 'Título 2' },
    { id: '3', source: img3, title: 'Título 3' },
];

const { width, height } = Dimensions.get('window');

export default function HomePage({ navigation }) {
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dy < -30;
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy < -30) {
                    navigation.navigate('SOS');
                }
            },
        })
    ).current;

    const handleDateChange = (newDate) => {
        console.log('Nova data selecionada:', newDate);
        setCurrentDate(newDate);
    };

    const formattedDate = moment(currentDate).format('MMMM DD');

    return (
        <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
             <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
            <TouchableOpacity 
                style={styles.navButton} 
                onPress={() => navigation.navigate('calendario')} 
            >
                <Image source={require('../assets/Calendar.png')} style={styles.navImage} />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.navButtonEsquerda} 
                onPress={() => navigation.navigate('')} 
            >
                <Image source={require('../assets/bonequinha.png')} style={styles.navboneca} />
            </TouchableOpacity>

            <View style={styles.svgContainer}>
                <Gota4 style={[styles.gota4, { left: width * -0.2, top: height * -0.3 }]} />
                <Gota6 style={[styles.gota6, { left: width * 0.5 - 155, top: height * -0.25 }]} />

                <CalendarSlider onDateChange={handleDateChange} />

                <Text style={styles.text}>Ciclo atual:</Text>
                <Text style={styles.periodo}>3° dia</Text>

                <View style={styles.editContainer}>
                    <TouchableOpacity style={styles.edit}>
                        <Text style={styles.editText}>
                            Editar menstruação
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View style={styles.conteudoContainer}>
                    <Text style={styles.conteudoDia}>Conteúdo do dia</Text>
                    <View style={styles.indicator}></View>
                    <Text style={styles.conteudoDia}>Hoje</Text>
                </View>

                <CardComponent
                    images={images}
                    titleStyle={{ color: 'white' }}
                    cardWidth={width * 0.4}
                    cardHeight={height * 0.3}
                />

                <View style={styles.conteudoCicloContainer}>
                    <Text style={styles.conteudoDia}>{formattedDate}</Text>
                    <View style={styles.indicator}></View>
                    <Text style={styles.conteudoDia}>Hoje</Text>
                </View>
                <View style={styles.containerBottom}>
                    <Image source={img4} style={styles.image} resizeMode="contain" />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.smallText}>65,0</Text>
                        <Text style={styles.smallText}> Kg</Text>
                    </View>
                </View>
                
            </View>
            <Gota5 style={{ position: 'absolute', bottom: -20, right: -20 }} />

           
            <TouchableOpacity 
                style={styles.bottomNavButton} 
                onPress={() => navigation.navigate('SOS')} 
            >
                <Image source={require('../assets/setacima.png')} style={styles.bottomNavImage} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE7E7',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    navButton: {
        position: 'absolute',
        top: height * 0.06, 
        right: width * 0.03, 
        width: 50,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, 
    },
    navImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    svgContainer: {
        position: 'relative',
        height: height * 0.35,
        width: '100%',
        marginBottom: height * 0.1,
    },
    gota4: {
        position: 'absolute',
        width: width * 0.5,
        height: height * 0.25,
    },
    gota6: {
        position: 'absolute',
        width: width * 0.4,
        height: height * 0.2,
    },
    text: {
        marginTop: height * 0.01,
        fontSize: width * 0.05,
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    periodo: {
        fontSize: width * 0.1,
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: height * 0.02,
    },
    editContainer: {
        alignItems: 'center',
    },
    edit: {
        backgroundColor: 'white',
        width: width * 0.41,
        borderRadius: 20,
        padding: height * 0.01,
        alignItems: 'center',
    },
    editText: {
        fontWeight: 'bold',
        fontSize: 10,
        color: '#F94E4E',
    },
    conteudoContainer: {
        flexDirection: 'row',
        marginLeft: width * 0.03,
        marginTop: -height * 0.03,
        alignItems: 'center',
    },
    conteudoDia: {
        fontSize: width * 0.045,
        color: '#000',
        fontWeight: 'bold',
        paddingRight: 2,
    },
    indicator: {
        height: 10,
        width: 10,
        borderRadius: 50,
        backgroundColor: 'gray',
        marginHorizontal: 5,
    },
    conteudoCicloContainer: {
        flexDirection: 'row',
        marginLeft: width * 0.03,
        alignItems: 'center',
    },
    containerBottom: {
        backgroundColor: '#BCBCBC4D',
        borderRadius: 10,
        padding: height * 0.01,
        margin: width * 0.04,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    smallText: {
        marginLeft: 15,
        color: '#666666',
        fontSize: width * 0.03,
    },
    image: {
        width: width * 0.14,
        height: height * 0.08,
    },
    navboneca: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    navButtonEsquerda: {
        position: 'absolute',
        top: height * 0.06, 
        left: width * 0.03, 
        width: 50,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, 
    },
    bottomNavButton: {
        position: 'absolute',
        bottom: height * 0.05, 
        alignSelf: 'center',   
        width: 30,            
        height: 15,
    },
    bottomNavImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});
