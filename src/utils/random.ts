export const getRandomIndex = <T>(arr: T[]): number =>
  Math.floor(Math.random() * arr.length);

export function randomChoice<T>(arr: T[]): T;
export function randomChoice<T, K extends keyof T>(
  arr: T[],
  property?: K,
): T[K];

export function randomChoice<T, K extends keyof T>(
  arr: T[],
  property?: K,
): T[K] | T {
  const randomIndex = getRandomIndex(arr);

  return property ? arr[randomIndex][property] : arr[randomIndex];
}

export const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
