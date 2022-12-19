import {defineConfig} from 'vite';
import dts            from "vite-plugin-dts";

export default defineConfig({
	plugins : [
		dts({
			tsConfigFilePath : "./tsconfig.json",
			insertTypesEntry : true,
		}),
	],
	build   : {
		outDir        : 'dist',
		sourcemap     : true,
		lib           : {
			name     : 'SurrealSchema',
			entry    : './src/index.ts',
			fileName : 'index',
			formats : ['es', 'cjs', 'umd', 'iife'],
		},
		rollupOptions : {
			external : [],
			output   : {
				globals : {},
			},
		},
	},
});
