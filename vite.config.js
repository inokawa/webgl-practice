import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  base: `https://${pkg.author}.github.io/${pkg.name}/`,
});
