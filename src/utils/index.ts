export * from "./http";
export * from "./math";
export * from "./random";
export * from "./color";

export const isType = <T extends object>(
  key: string,
  obj: object,
): obj is T => {
  return key in obj;
};
