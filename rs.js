script('playground').run(
  'parcel playground/index.html --port 3000 --hmr-port 4000'
)

script('test').run('jest')

script('build')
  .execute(() => {
    removeDir('out/')
  })
  .run('tsc -p lib/ --outDir out/es --module es6')
  .run('tsc -p lib/ --outDir out/cjs --module commonjs')
