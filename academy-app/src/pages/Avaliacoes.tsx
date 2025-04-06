import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container } from "../components/Container/styled";
import { listarAvaliacoes } from "../services/academy-api/avaliacoes/listar";
import { Lista, Item } from "../components/AvaliacaoList/styled";

interface Avaliacao {
    id: string;
    materia: string;
    nota: number;
    data: string;
}

export function Avaliacoes() {
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("auth_user_token");

        if (!token) {
            alert("Você precisa estar logado para acessar as avaliações.");
            navigate("/");
            return;
        }

        listarAvaliacoes(token).then((dados) => {
            setAvaliacoes(dados);
            setLoading(false);
        });
    }, [navigate]);

    return (
        <Container>
            <h1>Avaliações</h1>

            {loading ? (
                <p>Carregando...</p>
            ) : avaliacoes.length === 0 ? (
                <p>Sem avaliações registradas.</p>
            ) : (
                <Lista>
                    {avaliacoes.map((avaliacao) => (
                        <Item key={avaliacao.id}>
                            <strong>{avaliacao.materia}</strong><br />
                            Nota: {avaliacao.nota}<br />
                            Data: {avaliacao.data}
                        </Item>
                    ))}
                </Lista>
            )}
        </Container>
    );
}
