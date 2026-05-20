import { createServer, defineConfig, type Plugin } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'node:path'

const appDir = import.meta.dirname!

/**
 * mpegts.js ships as a UMD bundle (module.exports = ...).
 * Vite only converts CJS→ESM for node_modules, not for local vendor files.
 * This plugin intercepts the raw UMD source and wraps it so the browser
 * gets a real `export default` instead of a SyntaxError.
 */
function umdToEsm(): Plugin {
  return {
    name: 'umd-to-esm',
    transform(code, id) {
      if (!id.includes('vendor/mpegts.js/mpegts.js')) return
      // Inject a CJS shim so the UMD factory takes the CommonJS branch,
      // then re-export module.exports.default as the ESM default.
      return {
        code: [
          'var module = { exports: {} };',
          'var exports = module.exports;',
          code,
          'export default module.exports.default ?? module.exports;',
        ].join('\n'),
        map: null,
      }
    },
  }
}

const server = await createServer(defineConfig({
  root: appDir,
  plugins: [
    preact({ jsxImportSource: 'preact' }),
    umdToEsm(),
    // No Tailwind/DaisyUI — PoC uses vanilla CSS only
  ],
  resolve: {
    alias: {
      // Vite doesn't read deno.json import maps, so we bridge the gap here.
      // The actual file lives at app/vendor/mpegts.js/index.js
      'mpegts.js': resolve(appDir, 'vendor/mpegts.js/index.js'),
    },
  },
  server: {
    host: true,
    // mpegts.js vendor bundle references a .map file that isn't included.
    // Suppress the "failed to load source map" error for all vendor files.
    sourcemapIgnoreList: (sourcePath) => sourcePath.includes('/vendor/'),
  },
}))

await server.listen(5173)
server.printUrls()
