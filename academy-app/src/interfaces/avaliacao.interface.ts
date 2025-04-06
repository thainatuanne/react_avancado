export interface Avaliacao {
    id: string;
    materia: string;
    nota: number;
    data: string;
}

export interface RespostaAvaliacoes {
    dados: Avaliacao[];
}
