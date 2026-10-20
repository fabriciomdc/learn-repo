export type MissionOption = {
  id: string;
  label: string;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  code: string;
  question: string;
  options: MissionOption[];
  correctOptionId: string;
  explanation: string;
};
