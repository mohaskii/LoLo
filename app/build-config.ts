import { createServer, defineConfig } from 'vite'
import preact from '@preact/preset-vite'

const server = await createServer(defineConfig({
  root: import.meta.dirname!,
  plugins: [
    preact({ jsxImportSource: 'preact' }),
    // No Tailwind/DaisyUI — PoC uses vanilla CSS only
  ],
  server: {
    host: true,
  },
}))

await server.listen(5173)
server.printUrls()
