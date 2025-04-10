export type EnumValues<T> = T[keyof T];

export const KeysOf = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
