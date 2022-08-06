export abstract class ObjectBase {
  abstract vertices: number[];
  abstract indices: number[];
  abstract alias: string;
  abstract dimension: number;
  abstract wireframe: boolean;
}
