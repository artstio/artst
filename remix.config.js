/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  tailwind: true,
  postcss: true,
  watchPaths: ["./tailwind.config.ts"],
  serverModuleFormat: "esm",
  serverDependenciesToBundle: [
    /^remix-utils.*/,
    /^dayjs.*/,
    "posthog-js/react",
    "remix-i18next",
  ],
  cacheDirectory: "./node_modules/.cache/remix",
};
