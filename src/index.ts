let gl: WebGL2RenderingContext;

const updateClearColor = (...color: [number, number, number, number]) => {
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, 0, 0);
};

const checkKey = (e: KeyboardEvent) => {
  switch (e.key) {
    case "1":
      updateClearColor(0.2, 0.8, 0.2, 1.0);
      break;
    case "2":
      updateClearColor(0.2, 0.2, 0.8, 1.0);
      break;
    case "3":
      updateClearColor(Math.random(), Math.random(), Math.random(), 1.0);
      break;
    case "4": {
      const color = gl.getParameter(gl.COLOR_CLEAR_VALUE);
      alert(
        `clearColor = (${color[0].toFixed(1)}, ${color[1].toFixed(
          1
        )}, ${color[2].toFixed(1)})`
      );
      window.focus();
      break;
    }
  }
};

const init = () => {
  const canvas = document.getElementById("app") as HTMLCanvasElement | null;
  if (!canvas) {
    console.error("Sorry! No HTML5 Canvas was found on this page");
    return;
  }

  const glTemp = canvas.getContext("webgl2");
  if (!glTemp) {
    alert("WebGl is not available");
    return;
  }
  gl = glTemp;
  alert("You got a WebGL2 context");

  window.onkeydown = checkKey;
};

window.onload = init;
