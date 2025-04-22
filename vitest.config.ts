import path from "path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.spec.ts"],
    disableConsoleIntercept: true,
    alias: {
      "@truststack/prisma": path.resolve(
        __dirname,
        "../../packages/prisma/src",
      ),
      "truststack-link-resolver": path.resolve(
        __dirname,
        "../link-resolver/src/extension",
      ),
    },

    reporters: [
      "default",
      [
        "junit",
        {
          outputFile: "./reports/junit/unit-results.xml",
          suiteName: "Unit Tests",
        },
      ],
    ],
  },
  plugins: [swc.vite() as any],
});
