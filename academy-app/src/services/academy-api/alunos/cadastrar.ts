import { academyApi } from "../http-config";

interface RespostaCadastro {
    sucesso: boolean;
    mensagem: string;
}

export async function cadastrarAluno(dados: {
    nome: string;
    email: string;
    senha: string;
}): Promise<RespostaCadastro> {
    try {
        const resultado = await academyApi.post<RespostaCadastro>("alunos", dados);

        return {
            sucesso: resultado.data.sucesso,
            mensagem: resultado.data.mensagem,
        };
    } catch (error) {
        const erro = error as {
            response?: {
                data?: {
                    sucesso?: boolean;
                    mensagem?: string;
                };
            };
        };

        return {
            sucesso: erro.response?.data?.sucesso ?? false,
            mensagem: erro.response?.data?.mensagem ?? "Erro no cadastro.",
        };
    }
}
