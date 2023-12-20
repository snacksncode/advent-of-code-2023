import { resolve } from "path";

type Color = "red" | "green" | "blue";
type GameSet = {
  amount: number;
  color: Color;
};

type Result = {
  [key in Color]: number;
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

function getMinimumPossibleCase(results: Result[]) {
  return results.reduce(
    (prev, curr) => {
      if (curr.blue > prev.blue) {
        prev.blue = curr.blue;
      }
      if (curr.red > prev.red) {
        prev.red = curr.red;
      }
      if (curr.green > prev.green) {
        prev.green = curr.green;
      }
      return prev;
    },
    { blue: 0, green: 0, red: 0 } as Result
  );
}

const file = await Bun.file(resolve(import.meta.dir, "input.txt")).text();
const games = file.split("\n");
const sumOfPowerSets = games.reduce((acc, game) => {
  const { results } = parseGame(game);
  const { red, green, blue } = getMinimumPossibleCase(results);
  return acc + red * green * blue;
}, 0);
console.log({ sumOfPowerSets });
