import type { Mission } from "../mission";

export const useStateScoreboardMission: Mission = {
  id: "use-state-scoreboard",
  title: "The One With the Frozen Scoreboard",
  topic: "useState",
  description: "O placar da horta nunca sai do zero, mesmo colhendo trigo.",
  lessonLines: [
    "Esse placar é o meu orgulho, mas não sai do zero! Vem cá que eu te explico o que está acontecendo.",
    "No React, uma variável comum é como uma anotação na minha cabeça: eu sei o valor, mas ninguém mais enxerga. E o React só redesenha a tela quando o ESTADO muda.",
    "O estado é o placar de madeira da horta: mudou o número, o React atualiza o placar para todo mundo ver. Quem cuida disso é o useState.",
    "const [count, setCount] = useState(0): o count é o valor de agora, e o setCount é o jeito de avisar o React que o valor mudou. Descobre o que está faltando no meu código!",
  ],
  code: `function WheatCounter() {
  let count = 0

  useEffect(() => {
    return harvestEvents.subscribe(() => {
      count = count + 1
    })
  }, [])

  return <p>🌾 {count} / 5</p>
}`,
  question: "Por que o placar não atualiza na tela?",
  options: [
    { id: "a", label: "O count não é um número de verdade" },
    {
      id: "b",
      label:
        "O React só redesenha quando o estado muda, e uma variável comum não avisa o React",
    },
    { id: "c", label: "Falta um return dentro do subscribe" },
    { id: "d", label: "O useEffect roda tarde demais" },
  ],
  correctOptionId: "b",
  explanation:
    "A variável count até aumenta, mas o React não fica sabendo e não redesenha o placar. Troque por const [count, setCount] = useState(0) e use setCount(count + 1): assim o React é avisado e atualiza a tela.",
};
