export enum Subject {
    Liked = "liked",
    Followed = "followed"
}

export class Notification {
    _key?: string;
    _id?: string;
    by_user: string;
    subject: Subject;
    message: string;
    createdAt: string;
    seen: boolean;
}
