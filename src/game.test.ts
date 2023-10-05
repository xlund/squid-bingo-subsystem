import { describe, test, expect } from "vitest";
import {
  calculateScore,
  checkBoard,
  checkBoards,
  parseBoard,
  tombola,
  validateRow,
} from "./game";

const board = {
  rows: [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
  ],
  hasWon: false,
};

describe("Parse board", () => {
  test("should convert a string of numbers to an nested array of numbers", () => {
    const boardString = "1  2  3 4 5\n6  7 8    9  10";
    const expected = board;
    const actual = parseBoard(boardString);

    expect(actual).toEqual(expected);
  });
});

describe("Tombola", () => {
  test("should return a generator", () => {
    const expected = typeof Object();
    const actual = typeof tombola([1, 2, 3, 4, 5]).next();
    expect(actual).toEqual(expected);
  });

  test("should return the next number in the sequence", () => {
    const expected = 1;
    const actual = tombola([1, 2, 3, 4, 5]).next().value.next;
    expect(actual).toEqual(expected);
  });
  test("should return the drawn numbers", () => {
    const expected = [1];
    const actual = tombola([1, 2, 3, 4, 5]).next().value.drawn;
    expect(actual).toEqual(expected);
  });
});

describe("Validate row", () => {
  test("should return true if all numbers in the row are in the drawn numbers", () => {
    const expected = true;
    const actual = validateRow([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
    expect(actual).toEqual(expected);
  });
  test("should return false if all numbers in the row are not in the drawn numbers", () => {
    const expected = false;
    const actual = validateRow([1, 2, 3, 4, 5], [1, 2, 3, 4]);
    expect(actual).toEqual(expected);
  });
});

describe("Check board", () => {
  test("should return a winning board if any row in the board is valid", () => {
    const expected = {
      ...board,
      hasWon: true,
      winningSequence: [1, 2, 3, 4, 5],
    };
    const actual = checkBoard(board, [1, 2, 3, 4, 5]);
    expect(actual).toEqual(expected);
  });

  test("should return an array of winning", () => {
    const expected = {
      ...board,
      hasWon: true,
    };
    const actual = checkBoards([board], [1, 2, 3, 4, 5])[0];
    expect(actual).toEqual(expected);
  });
  test("should return a winning board if any column in the board is valid", () => {
    const expected = {
      ...board,
      hasWon: true,
    };
    const actual = checkBoard(board, [1, 6]);
    expect(actual).toEqual(expected);
  });
});

describe("Calculate score", () => {
  test("should return the score for the board", () => {
    const expected = 150;
    const actual = calculateScore(board, [6, 7, 8, 9, 10]);
    expect(actual).toEqual(expected);
  });
});
