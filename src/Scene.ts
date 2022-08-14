import { calculateNormals } from "./utils";
import {
  createVertexArray,
  loadTexture,
  Program,
  Texture,
  Vao,
  Vertex,
} from "./webgl";

type GLObject = {
  alias?: string;
  vertices: number[];
  indices: number[];
  scalars: number[];
  textureCoords: number[];
  wireframe: boolean;
  diffuse: number[];
  Kd: number[];
  ambient: number[];
  Ka: number[];
  specular: number[];
  Ks: number[];
  specularExponent: number;
  Ns: number;
  d: number;
  transparency: number;
  illum: number;
  vao: Vao;
  texture?: Texture;
};

// Manages objects in a 3D scene
export class Scene<A extends string, U extends string> {
  private gl: WebGL2RenderingContext;
  private program: Program<A, U>;
  private objects: GLObject[];
  private stop?: () => void;

  constructor(gl: WebGL2RenderingContext, program: Program<A, U>) {
    this.gl = gl;
    this.program = program;
    this.objects = [];
  }

  start(onFrame: (objects: GLObject[], time: number) => void) {
    let isRunning: boolean = true;
    let timer: number | undefined;

    const schedule = () => {
      timer = requestAnimationFrame((time) => {
        if (!isRunning) return;
        onFrame(this.objects, time);
        schedule();
      });
    };
    const stop = () => {
      isRunning = false;
      if (timer != null) {
        cancelAnimationFrame(timer);
      }
    };

    schedule();

    const onFocus = () => {
      isRunning = true;
      schedule();
      console.info("Clock resumed");
    };
    const onBlur = () => {
      stop();
      console.info("Clock stopped");
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return (this.stop = () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      stop();
    });
  }

  // Find the item with given alias
  get(alias: string) {
    return this.objects.find((object) => object.alias === alias);
  }

  //   // Asynchronously load a file
  //   load(filename, alias, attributes) {
  //     return fetch(filename)
  //       .then((res) => res.json())
  //       .then((object) => {
  //         object.visible = true;
  //         object.alias = alias || object.alias;
  //         this.add(object, attributes);
  //       })
  //       .catch((err) => console.error(err, ...arguments));
  //   }

  //   // Helper function for returning as list of items for a given model
  //   loadByParts(path, count, alias) {
  //     for (let i = 1; i <= count; i++) {
  //       const part = `${path}${i}.json`;
  //       this.load(part, alias);
  //     }
  //   }

  // Add object to scene, by settings default and configuring all necessary
  // buffers and textures
  add(
    o: Partial<GLObject> & {
      image?: string;
    },
    alias?: string,
    options?: any
  ) {
    const { gl, program } = this;

    // Since we've used both the OBJ convention here (e.g. Ka, Kd, Ks, etc.)
    // and descriptive terms throughout the book for educational purposes, we will set defaults for
    // each that doesn't exist to ensure the entire series of demos work.
    // That being said, it's best to stick to one convention throughout your application.

    const vertices = o.vertices ?? [];
    const indices = o.indices ?? [];
    const scalars = o.scalars ?? [];
    const textureCoords = o.textureCoords ?? [];
    const diffuse = o.diffuse ?? [1, 1, 1, 1];
    const ambient = o.ambient ?? [0.2, 0.2, 0.2, 1];
    const specular = o.specular ?? [1, 1, 1, 1];
    const specularExponent = o.specularExponent ?? 0;
    const d = o.d ?? 1;

    // // Merge if any attributes are provided
    // Object.assign(object, attributes);

    const vertexObjects: Vertex<any>[] = [];

    if ("aVertexPosition" in program.attributes && vertices.length) {
      vertexObjects.push({
        name: "aVertexPosition",
        data: vertices,
        size: 3,
      });
    }
    if (
      "aVertexNormal" in program.attributes &&
      vertices.length &&
      indices.length
    ) {
      vertexObjects.push({
        name: "aVertexNormal",
        data: calculateNormals(vertices, indices),
        size: 3,
      });
    }
    if ("aVertexColor" in program.attributes && scalars.length) {
      vertexObjects.push({
        name: "aVertexColor",
        data: scalars,
        size: 4,
      });
    }
    if ("aVertexTextureCoords" in program.attributes && textureCoords.length) {
      vertexObjects.push({
        name: "aVertexTextureCoords",
        data: textureCoords,
        size: 2,
      });
      // if ("aVertexTangent" in program.attributes) {
      //   vertexObjects.push({
      //     name: "aVertexTangent",
      //     data: calculateTangents(vertices, textureCoords, indices),
      //     size: 3,
      //   });
      // }
    }

    const object: GLObject = {
      alias: o.alias ?? alias,
      vertices,
      indices,
      scalars,
      textureCoords,
      wireframe: o.wireframe ?? false,
      diffuse: diffuse,
      Kd: o.Kd ?? diffuse.slice(0, 3),
      ambient,
      Ka: o.Ka || ambient.slice(0, 3),
      specular,
      Ks: o.Ks || specular.slice(0, 3),
      specularExponent,
      Ns: o.Ns ?? specularExponent,
      d,
      transparency: o.transparency ?? d,
      illum: o.illum ?? 1,
      vao: createVertexArray(gl, program, vertexObjects, indices),
      ...options,
    };

    // // Image texture
    if (o.image) {
      object.texture = loadTexture(gl, o.image);
    }

    // Push to our objects list for later access
    this.objects.push(object);
  }

  // Traverses over every item in the scene
  traverse(cb: (o: GLObject, i: number) => void) {
    for (let i = 0; i < this.objects.length; i++) {
      // Break out of the loop as long as any value is returned
      if (cb(this.objects[i], i) !== undefined) break;
    }
  }

  //   // Removes an item from the scene with a given alias
  //   remove(alias) {
  //     const object = this.get(alias);
  //     const index = this.objects.indexOf(object);
  //     this.objects.splice(index, 1);
  //   }

  // Renders an item first
  renderFirst(alias: string) {
    const object = this.get(alias);
    const index = this.objects.indexOf(object!);
    if (index === 0) return;

    this.objects.splice(index, 1);
    this.objects.splice(0, 0, object!);
    this.printRenderOrder();
  }

  // Renders an item last
  renderLast(alias: string) {
    const object = this.get(alias);
    const index = this.objects.indexOf(object!);
    if (index === 0) return;

    this.objects.splice(index, 1);
    this.objects.push(object!);
    this.printRenderOrder();
  }

  // Pushes an item up the render priority
  renderSooner(alias: string) {
    const object = this.get(alias);
    const index = this.objects.indexOf(object!);
    if (index === 0) return;

    this.objects.splice(index, 1);
    this.objects.splice(index - 1, 0, object!);
    this.printRenderOrder();
  }

  //   // Pushes an item down the render priority
  //   renderLater(alias) {
  //     const object = this.get(alias);
  //     const index = this.objects.indexOf(object);
  //     if (index === this.objects.length - 1) return;

  //     this.objects.splice(index, 1);
  //     this.objects.splice(index + 1, 0, object);
  //     this.printRenderOrder();
  //   }

  // Construct and print a string representing the render order (useful for debugging)
  printRenderOrder() {
    const renderOrder = this.objects.map((object) => object.alias).join(" > ");
    console.info("Render Order:", renderOrder);
  }

  dispose() {
    this.stop?.();
    this.program.dispose();
    this.objects.forEach((o) => {
      o.vao.dispose();
      o.texture?.dispose();
    });
  }
}
