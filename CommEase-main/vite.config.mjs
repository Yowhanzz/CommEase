import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	plugins: [vue()],
	optimizeDeps: {
		include: ["@stackblitz/sdk"],
	},
	base: "/",
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	build: {
		rollupOptions: {
			input: {
				app: fileURLToPath(new URL("./index.html", import.meta.url)),
			},
		},
		outDir: "dist",
		assetsDir: "assets",
		sourcemap: true,
	},
	// server: {
	// 	port: 3000,
	// 	host: true,
	// 	strictPort: true,
	// },
	define: {
		_VUE_PROD_HYDRATION_MISMATCH_DETAILS_: "false",
		_VUE_PROD_DEVTOOLS_: "false",
		"process.env": {},
		global: {},
	},
});