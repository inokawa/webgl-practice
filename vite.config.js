import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig(({ mode }) => ({
  base: `https://${pkg.author}.github.io/${pkg.name}/`,
  define: {
    "process.env.BASEPATH":
      mode === "production"
        ? JSON.stringify(`/${pkg.name}`)
        : JSON.stringify(""),
  },
}));
