import type { ObjectBase } from "./ObjectBase";

// Visualize the axis on the screen
export class Axis implements ObjectBase {
  vertices: number[];
  indices: number[];
  alias: string;
  dimension: number;
  wireframe: boolean;

  constructor(dimension = 10) {
    this.alias = "axis";

    this.wireframe = true;
    this.indices = [0, 1, 2, 3, 4, 5];
    this.dimension = dimension;
    this.vertices = build(dimension);
  }
}

const build = (dimension: number) => {
  if (dimension) {
    dimension = dimension;
  }

  return [
    -dimension,
    0.0,
    0.0,
    dimension,
    0.0,
    0.0,
    0.0,
    -dimension / 2,
    0.0,
    0.0,
    dimension / 2,
    0.0,
    0.0,
    0.0,
    -dimension,
    0.0,
    0.0,
    dimension,
  ];
};
