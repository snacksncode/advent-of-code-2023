import { resolve } from "path";

type RangeMap = {
  fromStart: number;
  toStart: number;
  length: number;
};

function inRange(x: number, range: RangeMap) {
  return x >= range.fromStart && x <= range.fromStart + range.length - 1;
}

function applyMaps(x: number, ranges: RangeMap[]) {
  const range = ranges.find((range) => inRange(x, range));
  if (!range) {
    return x;
  }
  const rangeIndex = x - range.fromStart;
  return range.toStart + rangeIndex;
}

function parseMaps(maps: string[]): RangeMap[] {
  return maps.map((map) => {
    const [destinationStart, sourceStart, length] = map.split(" ").map(Number);
    return {
      fromStart: sourceStart,
      toStart: destinationStart,
      length: length,
    };
  });
}

const file = await Bun.file(resolve(import.meta.dir, "input-2.txt")).text();
const [seeds, ...listOfMaps] = file.split("\n\n").map((range) => range.split("\n"));
const seedNumbers = seeds[0].split(": ")[1].split(" ").map(Number);
const parsedMaps = listOfMaps.map((maps) => parseMaps(maps.slice(1)));
const locations = seedNumbers.map((seedNumber) => {
  return parsedMaps.reduce((acc, maps) => {
    return applyMaps(acc, maps);
  }, seedNumber);
});
const minLocation = locations.reduce((acc, location) => (location < acc ? location : acc));
console.log("min location", minLocation);
