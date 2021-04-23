export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;

    // game info
    timesWon?: number;
    timesLost?: number;
    playersWon?: Array<string>;
    playersLost?: Array<string>;
}
