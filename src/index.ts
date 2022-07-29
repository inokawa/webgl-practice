import { init } from "./app";

window.onload = () => {
  const canvas = document.getElementById("app") as HTMLCanvasElement | null;
  if (!canvas) {
    console.error("Sorry! No HTML5 Canvas was found on this page");
    return;
  }

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGl is not available");
    return;
  }
  alert("You got a WebGL2 context");

  init(gl);
};
