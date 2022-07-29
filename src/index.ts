window.onload = () => {
  const canvas = document.getElementById("app") as HTMLCanvasElement | null;
  if (!canvas) {
    console.error("Sorry! No HTML5 Canvas was found on this page");
    return;
  }

  const gl = canvas.getContext("webgl2");
  const message = gl ? "You got a WebGL2 context" : "WebGl is not available";

  alert(message);
};
