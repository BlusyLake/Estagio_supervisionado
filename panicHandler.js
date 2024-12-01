import axios from "axios";
import { carregarContatos } from "./screens/addContato";

export const handlePanic = async () => {
    const contatos = await carregarContatos();

    if (contatos.length === 0) {
        console.log("Nenhum contato salvo");
        return;
    }

    const irlLocation = async () => {
        const location = await fetch('link');
        const data = await location.json();
        return data.message;
    };

    const message = await irlLocation();

    contatos.forEach(async (contato) => {
        try {
            console.log(`Enviando mensagem para o número: ${contato.numeroComDdd}`);
            const response = await axios.post('link', {
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
                    'apikey': 'key'
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
