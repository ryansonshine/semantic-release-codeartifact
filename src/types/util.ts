// https://github.com/Microsoft/TypeScript/issues/25987#issuecomment-408339599
export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : K]: never;
};
