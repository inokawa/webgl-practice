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

  let dispose: () => void = await (await import("./chapters/7.4")).init(gl);

  const menuEl = document.getElementById("menu")!;
  appendMenu(menuEl, "2.6", async () => {
    dispose();
    dispose = await (await import("./chapters/2.6")).init(gl);
  });
  appendMenu(menuEl, "2", async () => {
    dispose();
    dispose = await (await import("./chapters/2")).init(gl);
  });
  appendMenu(menuEl, "3.goraud-lambert", async () => {
    dispose();
    dispose = await (await import("./chapters/3-goraud-lambert")).init(gl);
  });
  appendMenu(menuEl, "3.goraud-phong", async () => {
    dispose();
    dispose = await (await import("./chapters/3-goraud-phong")).init(gl);
  });
  appendMenu(menuEl, "3.phong-phong", async () => {
    dispose();
    dispose = await (await import("./chapters/3-phong-phong")).init(gl);
  });
  appendMenu(menuEl, "3.12", async () => {
    dispose();
    dispose = await (await import("./chapters/3.12")).init(gl);
  });
  appendMenu(menuEl, "3.13", async () => {
    dispose();
    dispose = await (await import("./chapters/3.13")).init(gl);
  });
  appendMenu(menuEl, "4.8", async () => {
    dispose();
    dispose = await (await import("./chapters/4.8")).init(gl);
  });
  appendMenu(menuEl, "4.10", async () => {
    dispose();
    dispose = await (await import("./chapters/4.10")).init(gl);
  });
  appendMenu(menuEl, "5.7", async () => {
    dispose();
    dispose = await (await import("./chapters/5.7")).init(gl);
  });
  appendMenu(menuEl, "5.9", async () => {
    dispose();
    dispose = await (await import("./chapters/5.9")).init(gl);
  });
  appendMenu(menuEl, "5.12", async () => {
    dispose();
    dispose = await (await import("./chapters/5.12")).init(gl);
  });
  appendMenu(menuEl, "6.3", async () => {
    dispose();
    dispose = await (await import("./chapters/6.3")).init(gl);
  });
  appendMenu(menuEl, "6.6", async () => {
    dispose();
    dispose = await (await import("./chapters/6.6")).init(gl);
  });
  appendMenu(menuEl, "6.8", async () => {
    dispose();
    dispose = await (await import("./chapters/6.8")).init(gl);
  });
  appendMenu(menuEl, "6.12", async () => {
    dispose();
    dispose = await (await import("./chapters/6.12")).init(gl);
  });
  appendMenu(menuEl, "6.14", async () => {
    dispose();
    dispose = await (await import("./chapters/6.14")).init(gl);
  });
  appendMenu(menuEl, "7.4", async () => {
    dispose();
    dispose = await (await import("./chapters/7.4")).init(gl);
  });
};
