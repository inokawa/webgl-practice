// Encapsulates common light functionality
export class Light {
  id: string;
  position: [number, number, number];
  ambient: number[];
  diffuse: number[];
  specular: number[];

  constructor(id: string) {
    this.id = id;
    this.position = [0, 0, 0];

    // We could use the OBJ convention here (e.g. Ka, Kd, Ks, etc.),
    // but decided to use more prescriptive terms here to showcase
    // both versions
    this.ambient = [0, 0, 0, 0];
    this.diffuse = [0, 0, 0, 0];
    this.specular = [0, 0, 0, 0];
  }

  setPosition(position: number[]) {
    this.position = position.slice(0) as [number, number, number];
  }

  setDiffuse(diffuse: number[]) {
    this.diffuse = diffuse.slice(0);
  }

  setAmbient(ambient: number[]) {
    this.ambient = ambient.slice(0);
  }

  setSpecular(specular: number[]) {
    this.specular = specular.slice(0);
  }

  setProperty(property: string, value: any) {
    (this as any)[property] = value;
  }
}

// Helper class to maintain a collection of lights
export class LightsManager {
  private list: Light[];

  constructor() {
    this.list = [];
  }

  add(light: Light) {
    this.list.push(light);
  }

  getArray(type: "position" | "ambient" | "diffuse" | "specular") {
    return this.list.reduce((result, light) => {
      result = result.concat(light[type]);
      return result;
    }, [] as number[]);
  }

  get(index: string | number) {
    if (typeof index === "string") {
      return this.list.find((light) => light.id === index);
    } else {
      return this.list[index];
    }
  }
}
