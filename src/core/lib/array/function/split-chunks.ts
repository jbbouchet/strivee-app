/**
 * Split an array into smaller arrays of a given size.
 * @param array - The array to split.
 * @param size - The maximum number of elements in the arrays.
 * @return An array containing the created sub-arrays.
 */
export function splitIntoChunks<E = any>(array: E[], size: number): Array<E[]> {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    chunks.push(chunk);
  }

  return chunks;
}
