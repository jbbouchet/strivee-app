import { splitIntoChunks } from './split-chunks';

describe('splitIntoChunks() function', () => {
  test('should split an array into chunks of a specified size', () => {
    const array = Array.from({ length: 1200 }, (_, index) => index);
    const chunkSize = 1000;
    const chunks = splitIntoChunks(array, chunkSize);

    expect(chunks.length).toBe(2);
    expect(chunks[0].length).toBe(1000);
    expect(chunks[1].length).toBe(200);
  });

  test('should handle empty arrays correctly', () => {
    const chunks = splitIntoChunks([], 1000);
    expect(chunks.length).toBe(0);
  });

  test('should create a single chunk if the array is smaller than the chunk size', () => {
    const array = [1, 2, 3];
    const chunks = splitIntoChunks(array, 5);
    expect(chunks.length).toBe(1);
    expect(chunks[0]).toEqual([1, 2, 3]);
  });

  test('should handle chunk size of 1 correctly', () => {
    const array = [1, 2, 3];
    const chunks = splitIntoChunks(array, 1);
    expect(chunks.length).toBe(3);
    expect(chunks.every((chunk) => chunk.length === 1)).toBe(true);
  });
});
