import { useEffect, useState } from "react";
import { ListaProjetos } from "../components/ListaProjetos";
import { listarProjetos } from "../services/academy-api/projetos/listar";
import { Projeto } from "../interfaces/projeto.interface";
import { cadastrarProjeto } from "../services/academy-api/projetos/cadastrar";
import { atualizarProjeto } from "../services/academy-api/projetos/atualizar";
import { excluirProjeto } from "../services/academy-api/projetos/excluir";
import { useNavigate } from "react-router";
import { logout } from "../services/academy-api/auth/logout";

export function Projetos() {
    const [loading, setLoading] = useState(true);
    const [listaProjetos, setListaProjetos] = useState<Projeto[]>([]);
    const [formProjeto, setFormProjeto] = useState<Projeto>({
        id: "",
        titulo: "",
        descricao: "",
        ferramenta: "",
        status: "",
    });
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem("auth_user_token");

        if (!authToken) {
            alert("É preciso estar logado para acessar essa página");
            navigate("/");
            return;
        }

        setToken(authToken);
        setLoading(true);

        listarProjetos(authToken).then((projetos) => {
            setLoading(false);
            setListaProjetos(projetos);
        });
    }, [navigate]);

    async function handleSubmit(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        setLoading(true);

        let mensagem = "";

        if (!formProjeto.id) {
            mensagem = await cadastrarProjeto(formProjeto, token);
        } else {
            mensagem = await atualizarProjeto(formProjeto, token);
        }

        alert(mensagem);

        const projetos = await listarProjetos(token);
        setListaProjetos(projetos);
        setLoading(false);
        resetForm();
    }

    function handleInputChange(
        evento: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setFormProjeto((current) => ({
            ...current,
            [evento.target.name]: evento.target.value,
        }));
    }

    function resetForm() {
        setFormProjeto({
            id: "",
            titulo: "",
            descricao: "",
            ferramenta: "",
            status: "",
        });
    }

    function handleClickAtualizar(projeto: Projeto) {
        setFormProjeto(projeto);
    }

    async function handleClickExcluir(projeto: Projeto) {
        const confirma = confirm(
            "Tem certeza que deseja excluir o projeto? Essa ação não poderá ser desfeita."
        );

        if (confirma) {
            setLoading(true);
            const mensagem = await excluirProjeto(projeto.id, token);
            alert(mensagem);

            const projetos = await listarProjetos(token);
            setListaProjetos(projetos);
            setLoading(false);
        }
    }

    async function handleClickLogout() {
        const deuBom = await logout(token);

        if (!deuBom) {
            alert("Erro no logout, tente novamente!");
            return;
        }

        localStorage.removeItem("auth_user_token");
        navigate("/");
    }

    return (
        <>
            <p style={{ textAlign: "end" }}>
                <button type="button" onClick={handleClickLogout}>
                    Sair
                </button>
            </p>
            <h1>Projetos</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="titulo">Título: </label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formProjeto.titulo}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label htmlFor="descricao">Breve descrição: </label>
                    <input
                        type="text"
                        id="descricao"
                        name="descricao"
                        value={formProjeto.descricao}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label htmlFor="ferramenta">Ferramentas: </label>
                    <input
                        type="text"
                        id="ferramenta"
                        name="ferramenta"
                        value={formProjeto.ferramenta}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label htmlFor="status">Status: </label>
                    <select
                        name="status"
                        id="status"
                        required
                        value={formProjeto.status}
                        onChange={handleInputChange}
                    >
                        <option value="" selected disabled>
                            - Selecione -
                        </option>
                        <option value="finalizado">Finalizado</option>
                        <option value="em_andamento">Em andamento</option>
                    </select>
                </div>

                <div>
                    <button type="submit">Salvar</button>
                </div>
            </form>

            <hr />

            <div>
                {loading ? (
                    <p>Carregando projetos...</p>
                ) : (
                    <ListaProjetos
                        projetos={listaProjetos}
                        handleUpdateClick={handleClickAtualizar}
                        handleDeleteClick={handleClickExcluir}
                    />
                )}
            </div>
        </>
    );
}