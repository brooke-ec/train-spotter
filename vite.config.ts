import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import manifest from "./src/webmanifest.json";
import { defineConfig } from "vite";

export default defineConfig({
	define: { global: "window" },
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// @ts-ignore
			manifest: manifest,
			registerType: "prompt",
		}),
	],
	server: {
		allowedHosts: ["doc.nimahost.net"],
	},
});
