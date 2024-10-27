interface Game {
    roomName: string;
    isGameActive: boolean;
    roomId: string;
    round: number;
    currentQuestion: {
        questionText: string;
        choices: string[];
        correctAnswer: string;
    };
    players: {
        player1: {
            id: string;
            name: string;
            score: number;
            isReady: boolean;
        };
        player2: {
            id: string;
            name: string;
            score: number;
            isReady: boolean;
        };
    };
}

export default Game;
