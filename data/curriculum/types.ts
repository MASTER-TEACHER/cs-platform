export interface Topic {
  id: string;
  title: string;
  description: string;
  simulator?: string;
  lessonIds: string[];
}

export interface Unit {
  id: string;
  title: string;
  topicIds: string[];
}

export interface Paper {
  id: string;
  title: string;
  units: Unit[];
}

export interface Course {
  id: string;
  title: string;
  qualification: string;
  examBoard: string;
  papers: Paper[];
}