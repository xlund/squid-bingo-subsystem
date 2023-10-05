import testData from "./data/realData.json";

interface Tombola {
  next: number;
  drawn: number[];
}

interface Board {
  rows: number[][];
  hasWon: boolean;
  winningSequence?: number[];
  score?: number;
}

export const parseBoard = (board: string): Board => {
  return {
    rows: board.split("\n").map(parseRow),
    hasWon: false,
  };
};

export const parseBoards = (boards: string): Board[] =>
  boards.toString().split("\n\n").map(parseBoard);

const parseRow = (row: string) => {
  return row
    .replace(/  +/g, " ")
    .trim()
    .split(" ")
    .map((v) => parseInt(v));
};

export const tombola = function* (available: number[]): Generator<Tombola> {
  const numbers = [...available];
  const drawn = [];

  while (numbers.length > 0) {
    const next = numbers.shift();
    drawn.push(next);

    yield {
      next,
      drawn,
    };
  }
  return "done";
};

export const validateRow = (row: number[], drawn: number[]) =>
  row.every((cell) => drawn.includes(cell));

export const validateColumn = (board: Board, drawn: number[]) => {
  const columns = board.rows.map((row, i) =>
    row.map((_, v) => board.rows[v][i])
  );

  return columns.some((row) => validateRow(row, drawn));
};

export const checkBoard = (board: Board, drawn: number[]) => {
  if (!board.hasWon) {
    if (
      board.rows.some((row) => validateRow(row, drawn)) ||
      validateColumn(board, drawn)
    ) {
      board.hasWon = true;
      board.winningSequence = drawn.slice(0, drawn.length);
    }
  }
  return board;
};

export const calculateScore = (board: Board, drawn: number[]) => {
  const sum = board.rows
    .flat()
    .filter((cell) => !drawn.includes(cell))
    .reduce((acc, curr) => acc + curr, 0);
  return multiply(sum, drawn[drawn.length - 1]);
};

export const multiply = (a: number, b: number) => a * b;

export const checkBoards = (boards: Board[], drawn: number[]) =>
  boards.map((board) => checkBoard(board, drawn));

export const play = (boards: Board[], numbers: number[]) => {
  const generator = tombola(numbers);
  let current = generator.next();

  while (!current.done) {
    checkBoards(boards, current.value.drawn);
    current = generator.next();
  }
  boards.map((board) => {
    board.score = calculateScore(board, board.winningSequence);
  });
  const lastWinner = getLastWinnerScore(boards);
  console.log(lastWinner);
};

const getLastWinnerScore = (boards: Board[]) => {
  let longest = 0;
  boards.forEach((board, i) => {
    if (board.winningSequence.length > longest) {
      longest = board.winningSequence.length;
    }
  });
  return boards.find((board) => board.winningSequence.length === longest).score;
};

play(parseBoards(testData.boards), testData.drawNumbers);
