import type { Mission } from "../mission";

export const staleClosureMission: Mission = {
  id: "use-effect-stale-closure",
  title: "The One With the Stale Closure",
  topic: "useEffect e stale closure",
  description:
    "O placar agora se mexe, mas trava no 1 por mais trigo que se colha.",
  lessonLines: [
    "Agora o placar mexe, mas trava no 1! Antes de arrumar, deixa eu te explicar o useEffect e a tal da closure.",
    "O useEffect roda DEPOIS que a tela é desenhada. Ele serve para ligar o React a algo de fora, como o aviso de que um trigo foi colhido.",
    "Esse [] no final quer dizer: liga uma vez só, quando a horta aparecer na tela.",
    "O problema é que a função que fica lá dentro lembra dos valores do momento em que nasceu, como um bilhete com o recado velho. Isso é uma closure. Vê se descobre o que está errado!",
  ],
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
