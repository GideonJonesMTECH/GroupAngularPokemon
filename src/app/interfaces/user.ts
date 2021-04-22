export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;

    // game info
    playersWon?: Array<string>;
    playersLost?: Array<string>;
}
