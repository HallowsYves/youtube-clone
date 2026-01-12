export interface QuizQuestion {
    questin: string;
    options: string[];
    answer: string;
    explanation: string;
}

export interface VideoQuiz {
    videoId: string;
    title: string;
    questions: QuizQuestion[];
}