import * as utils from "./utils";

const appendMenu = (menuEl: HTMLElement, text: string, onClick: () => void) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  menuEl.appendChild(button);
};

window.onload = async () => {
  const canvas = utils.getCanvas("app");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  utils.autoResizeCanvas(canvas);

  const gl = utils.getGLContext(canvas);
  if (!gl) return;

  let dispose: (() => void) | undefined;

  const menuEl = document.getElementById("menu")!;
  const menus: [
    string,
    () => Promise<{ init: (gl: WebGL2RenderingContext) => Promise<() => void> }>
  ][] = [
    ["2.6", () => import("./chapters/2.6")],
    ["2", () => import("./chapters/2")],
    ["3.goraud-lambert", () => import("./chapters/3-goraud-lambert")],
    ["3.goraud-phong", () => import("./chapters/3-goraud-phong")],
    ["3.phong-phong", () => import("./chapters/3-phong-phong")],
    ["3.12", () => import("./chapters/3.12")],
    ["3.13", () => import("./chapters/3.13")],
    ["4.8", () => import("./chapters/4.8")],
    ["4.10", () => import("./chapters/4.10")],
    ["5.7", () => import("./chapters/5.7")],
    ["5.9", () => import("./chapters/5.9")],
    ["5.12", () => import("./chapters/5.12")],
    ["6.3", () => import("./chapters/6.3")],
    ["6.6", () => import("./chapters/6.6")],
    ["6.8", () => import("./chapters/6.8")],
    ["6.12", () => import("./chapters/6.12")],
    ["6.14", () => import("./chapters/6.14")],
    ["7.4", () => import("./chapters/7.4")],
    ["7.5", () => import("./chapters/7.5")],
    ["7.7", () => import("./chapters/7.7")],
    ["7.9", () => import("./chapters/7.9")],
    ["7.11", () => import("./chapters/7.11")],
    ["10.3", () => import("./chapters/10.3")],
    ["10.5", () => import("./chapters/10.5")],
    ["10.7", () => import("./chapters/10.7")],
  ];
  menus.forEach(([name, data]) => {
    appendMenu(menuEl, name, async () => {
      dispose?.();
      dispose = await (await data()).init(gl);
    });
  });
  (menuEl.children[menuEl.children.length - 1] as HTMLElement).click();
};
