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
            console.log(`Enviando mensagem para o número: ${contato.numeroComDdd}`);
            const response = await axios.post('https://2bf1-2804-7d74-82-f900-712e-41ac-220b-2285.ngrok-free.app/message/sendText/Alerta', {
                number: contato.numeroComDdd,
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
