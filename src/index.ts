import testData from "./data/testData.json";
export const parseBoard = (board: string) =>
  board.split("\n").map((row) =>
    row
      .trim()
      .replace(/ +(?= )/g, "")
      .trim()
      .split(" ")
      .map((cell) => parseInt(cell))
  );

interface Draw {
  next: number;
  drawn: number[];
  remaining: number[];
}

const drawNumber = function* (available: number[]) {
  const numbers = [...available];
  const drawn = [];

  while (numbers.length > 0) {
    const next = numbers.shift();
    drawn.push(next);

    yield {
      next,
      drawn,
      remaining: [...numbers],
    };
  }
  return "done";
};

const validateRow = (row: number[], drawn: number[]) => {
  return row.every((cell) => drawn.includes(cell));
};

const checkBoards = (
  boards: number[][][],
  drawn: number[],
  current: number,
  winningBoards: Winner[]
) => {
  return boards.map((board, i) => {
    const valid = board.some((row) => {
      if (validateRow(row, drawn)) console.log(row);

      return validateRow(row, drawn);
    });

    const contains = winningBoards.some((board) => board.index === i);
    if (valid && !contains)
      winningBoards.push({ index: i, board, drawn: current });
  });
};

interface Winner {
  index: number;
  board: number[][];
  drawn: number;
}
const start = () => {
  const numbers = drawNumber(testData.drawNumbers);
  const boards = testData.boards.map(parseBoard);

  let score = 0;
  const winningBoards: Winner[] = [];
  let curr = numbers.next();

  while (!curr.done) {
    let draw = curr.value as Draw;
    const winner = checkBoards(boards, draw.drawn, draw.next, winningBoards);
    if (winningBoards.length === testData.boards.length) {
      score = calculateScore(
        draw.drawn,
        winningBoards[winningBoards.length - 1]
      );
      break;
    }

    curr = numbers.next();
  }

  if (numbers.next().done) console.log("All numbers drawn or all boards won");
};

const calculateScore = (drawn: number[], winner: Winner) => {
  const final = winner.board.flat().reduce((acc, curr) => {
    if (!drawn.includes(curr)) acc += curr;
    return acc;
  });

  return final * winner.drawn;
};

start();
