import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const deployment = JSON.parse(await readFile('dist/deployment.json', 'utf8'))
const result = spawnSync(process.execPath, [
  'node_modules/wrangler/bin/wrangler.js', 'deploy', '--dry-run',
  '--env', deployment.environment === 'production' ? 'production' : '',
  '--outdir', 'qa-artifacts/worker',
], { stdio: 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } })
if (result.error) throw result.error
process.exitCode = result.status ?? 1
