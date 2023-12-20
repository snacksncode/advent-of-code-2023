import { resolve } from "path";

type Color = "red" | "green" | "blue";
type GameSet = {
  amount: number;
  color: Color;
};

type Result = {
  [key in Color]: number;
};

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const isPossible = ({ red, green, blue }: Result) => {
  return red <= MAX_RED && green <= MAX_GREEN && blue <= MAX_BLUE;
};

function parseGame(input: string) {
  // Game: "{id: int}: {set: Set}; {set: Set}; {set: Set}"
  // Set: n * "{number: int} green | blue | red,"
  // Example: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
  const [game, rawSets] = input.split(": ");
  const [, gameId] = game.match(/Game (\d+)/)!;

  const sets = rawSets
    .split("; ")
    .map((set) => {
      return set.split(", ");
    })
    .map((sets) => {
      return sets.map((set) => {
        const [amount, color] = set.split(" ");
        return { amount: Number(amount), color } as GameSet;
      });
    });

  const results = sets.map((set) => {
    return set.reduce(
      (prev, curr) => {
        prev[curr.color] += curr.amount;
        return prev;
      },
      { blue: 0, green: 0, red: 0 } as Result
    );
  });

  return { gameId, results };
}

function isGamePossible(results: Result[]) {
  return results.every(isPossible);
}

const file = await Bun.file(resolve(import.meta.dir, "input.txt")).text();
const games = file.split("\n");
const sumOfPossibleIds = games.reduce((acc, game) => {
  const { gameId, results } = parseGame(game);
  const areResultsPossible = isGamePossible(results);
  if (!areResultsPossible) return acc;
  return acc + Number(gameId);
}, 0);
console.log({ sumOfPossibleIds });
