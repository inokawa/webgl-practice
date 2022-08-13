import { init as init26 } from "./chapters/2.6";
import { init as init2 } from "./chapters/2";
import { init as init3goraudlambert } from "./chapters/3-goraud-lambert";
import { init as init3goraudPhong } from "./chapters/3-goraud-phong";
import { init as init3PhongPhong } from "./chapters/3-phong-phong";
import { init as init312 } from "./chapters/3.12";
import { init as init313 } from "./chapters/3.13";
import { init as init48 } from "./chapters/4.8";
import { init as init410 } from "./chapters/4.10";
import { init as init57 } from "./chapters/5.7";
import { init as init59 } from "./chapters/5.9";
import { init as init512 } from "./chapters/5.12";
import { init as init63 } from "./chapters/6.3";
import { init as init66 } from "./chapters/6.6";
import { init as init68 } from "./chapters/6.8";
import { init as init612 } from "./chapters/6.12";
import { init } from "./chapters/6.14";
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

  let dispose: () => void = await init(gl);

  const menuEl = document.getElementById("menu")!;
  appendMenu(menuEl, "2.6", async () => {
    dispose();
    dispose = await init26(gl);
  });
  appendMenu(menuEl, "2", async () => {
    dispose();
    dispose = await init2(gl);
  });
  appendMenu(menuEl, "3.goraud-lambert", async () => {
    dispose();
    dispose = await init3goraudlambert(gl);
  });
  appendMenu(menuEl, "3.goraud-phong", async () => {
    dispose();
    dispose = await init3goraudPhong(gl);
  });
  appendMenu(menuEl, "3.phong-phong", async () => {
    dispose();
    dispose = await init3PhongPhong(gl);
  });
  appendMenu(menuEl, "3.12", async () => {
    dispose();
    dispose = await init312(gl);
  });
  appendMenu(menuEl, "3.13", async () => {
    dispose();
    dispose = await init313(gl);
  });
  appendMenu(menuEl, "4.8", async () => {
    dispose();
    dispose = await init48(gl);
  });
  appendMenu(menuEl, "4.10", async () => {
    dispose();
    dispose = await init410(gl);
  });
  appendMenu(menuEl, "5.7", async () => {
    dispose();
    dispose = await init57(gl);
  });
  appendMenu(menuEl, "5.9", async () => {
    dispose();
    dispose = await init59(gl);
  });
  appendMenu(menuEl, "5.12", async () => {
    dispose();
    dispose = await init512(gl);
  });
  appendMenu(menuEl, "6.3", async () => {
    dispose();
    dispose = await init63(gl);
  });
  appendMenu(menuEl, "6.6", async () => {
    dispose();
    dispose = await init66(gl);
  });
  appendMenu(menuEl, "6.8", async () => {
    dispose();
    dispose = await init68(gl);
  });
  appendMenu(menuEl, "6.12", async () => {
    dispose();
    dispose = await init612(gl);
  });
  appendMenu(menuEl, "6.14", async () => {
    dispose();
    dispose = await init(gl);
  });
};
