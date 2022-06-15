const RNG = new Random();

/**
 * Gets the random member of an array.
 * @param array A non-empty array to generate a random member
 * @throws It will throw an error if the array is empty.
 * @returns Random member of the array
 */
export function getRandomArrayMember<T>(array: T[]): T {
  const randomIndex = RNG.NextInteger(0, array.size() - 1);
  const value = array[randomIndex];
  if (value === undefined) {
    throw "expected array has members (size == 0)";
  } else {
    return value;
  }
}
