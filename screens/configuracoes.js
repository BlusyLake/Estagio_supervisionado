import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

export default function Configuracoes() { 
    const navigation = useNavigation(); 

    return (
        <View style={styles.view}>
            <StatusBar translucent backgroundColor="#F9497D" barStyle="dark-content"/>
            <TouchableOpacity 
                style={styles.sair} 
                onPress={() => navigation.navigate('SOS')} 
            >
                <Image source={require('../assets/sair.png')} style={styles.imagemsair} />
            </TouchableOpacity>
            
            <Text style={styles.texto}> Configuração </Text>
            
            <View style={styles.botoes}> 
                <TouchableOpacity 
                    style={styles.botao} 
                    onPress={() => navigation.navigate('contatos')}
                >
                    <Text style={styles.textoBotao}> Contatos de emergência </Text>
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                    <Image source={require('../assets/contato.png')} style={styles.imagem} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.botao}
                onPress={() => navigation.navigate('cofre')}>
                     
                    <Text style={styles.textoBotao}> Cofre </Text> 
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                    <Image source={require('../assets/cadeado.png')} style={styles.imagem} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.botao}
                    onPress={() => navigation.navigate('perguntas')} 
                >
                    <Text style={styles.textoBotao}> Perguntas frequentes</Text> 
                    <Image source={require('../assets/setinha.png')} style={styles.setinha} />
                    <Image source={require('../assets/Ask.png')} style={styles.imagem} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: "#FFE9E9",
        height: "100%",
        width: "100%", 
        alignItems: "center",
        paddingTop:40,
    },
    texto: {
        marginTop: 20,
        fontSize: 17,
        textAlign: "center",
    },
    botoes: {
        marginTop: 60, 
        width: '100%',  
    },
    botao: {
        backgroundColor: "#fff", 
        padding: 20,
        borderColor: "#A9A4A4",
        borderTopWidth: 0.5,
        width: "100%", 
    },
    setinha: {
        position: "absolute",
        right: 15,
        width: 10,
        height: 20,
        top: 20,
    },
    imagem: {
        position: "absolute",
        left: 20,
        width: 30,
        height: 30,
        top: 14,
    },  
    textoBotao: {
        textAlign: "justify",
        marginLeft: 50,
    },
    sair: {
        position: "absolute",
        left: -10,
        width: 30,
        height: 30,
        top: -1,
    },
    imagemsair:{
        position: "absolute",
        left: 20,
        width: 30,
        height: 30,
        top: 54,
    }
});
