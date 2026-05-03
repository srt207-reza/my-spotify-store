export type PlanType = "individual" | "family";

export type Gender =
    | "man"
    | "woman"
    | "non-binary"
    | "something-else"
    | "prefer-not-to-say";

export type Plan = {
    id: string;
    durationMonths: number;
    title: string;
    price: number;
    desc: string;
};

export type TouchedState = {
    fullNameEn: boolean;
    spotifyEmail: boolean;
    dateOfBirth: boolean;
    password: boolean;
    gender: boolean;
};

export type FormData = {
    planType: PlanType;
    durationMonths: number;
    planId: string;
    planTitle: string;
    price: number;
    fullNameEn: string;
    spotifyEmail: string;
    dateOfBirth: string;
    password: string;
    gender: Gender | "";
};