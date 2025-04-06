import { academyApi } from "../http-config";
import { Avaliacao, RespostaAvaliacoes } from "../../../interfaces/avaliacao.interface";

export async function listarAvaliacoes(token: string): Promise<Avaliacao[]> {
    try {
        const resposta = await academyApi.get<RespostaAvaliacoes>("/avaliacoes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return resposta.data.dados;
    } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        return [];
    }
}
