import * as esbuild from 'esbuild';

async function build() {
  await esbuild.build({
    entryPoints: ['src/main.tsx'],
    bundle: true,
    outdir: 'temp_dist',
    minify: true,
    format: 'esm',
    // externalize all dependencies to just see the local code
    external: ['react', 'react-dom', 'react-router-dom', '@react-three/fiber', '@react-three/drei', 'lucide-react', 'zustand', 'three', 'framer-motion', '*'],
  });
  console.log('build done');
}
build().catch(e => { console.error(e); process.exit(1); });
