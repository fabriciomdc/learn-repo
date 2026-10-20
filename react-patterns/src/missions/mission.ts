export type MissionOption = {
  id: string;
  label: string;
};

export type Mission = {
  id: string;
  title: string;
  topic: string;
  description: string;
  lessonLines: string[];
  code: string;
  question: string;
  options: MissionOption[];
  correctOptionId: string;
  explanation: string;
};
