import axios from "axios";
import { carregarContatos } from "./screens/addContato";

export const handlePanic = async () => {
    const contatos = await carregarContatos();

    if (contatos.length === 0) {
        console.log("Nenhum contato salvo");
        return;
    }

    const irlLocation = async () => {
        const location = await fetch('https://realtime-location-api.onrender.com/localizacao/current');
        const data = await location.json();
        return data.message;
    };

    const message = await irlLocation();

    contatos.forEach(async (contato) => {
        try {
            console.log(`Enviando mensagem para o número: ${contato.celular}`);
            const response = await axios.post('https://5ab3-2804-7d74-8c-bc00-cbb7-7856-5c02-c6de.ngrok-free.app/message/sendText/Alerta', {
                number: contato.celular,
                textMessage: {
                    text: `Mensagem de teste, Localização: ${message}`
                },
                options: {
                    delay: 0,
                    presence: "composing",
                    linkPreview: true
                }
            }, {
                headers: {
                    'apikey': 'B6D711FCDE4D4FD5936544120E713976'
                }
            });
            console.log(`Mensagem enviada para ${contato.celular}:`, response.data);
        } catch (error) {
            if (error.response) {
                console.error(`Erro ao enviar para ${contato.celular}:`, error.response.data);
            } else {
                console.error(`Erro ao enviar para ${contato.celular}:`, error.message);
            }
        }
    });
};
