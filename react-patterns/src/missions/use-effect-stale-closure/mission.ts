import type { Mission } from "../mission";

export const staleClosureMission: Mission = {
  id: "use-effect-stale-closure",
  title: "The One With the Stale Closure",
  description: "Este contador deveria somar a cada segundo, mas trava no 1.",
  code: `function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return <p>{count}</p>
}`,
  question: "Qual é a causa do bug?",
  options: [
    { id: "a", label: "O setInterval não funciona dentro do useEffect" },
    { id: "b", label: "O callback captura o valor antigo de count (closure)" },
    { id: "c", label: "O useState é assíncrono e precisa de await" },
    { id: "d", label: "Falta uma key no componente" },
  ],
  correctOptionId: "b",
  explanation:
    "O efeito roda uma vez, com count = 0. O callback do setInterval guarda esse valor e sempre calcula 0 + 1. Corrija com setCount(current => current + 1) ou declarando count nas dependências.",
};
