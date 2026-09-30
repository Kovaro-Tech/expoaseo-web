import test from 'node:test'
import assert from 'node:assert/strict'
import { AbuseGuard } from '../worker/abuse-guard.js'

test('shared guard retains quota across instances, expires the window and deletes temporary state', async () => {
  const originalNow = Date.now
  let now = 1790726400000
  Date.now = () => now
  const data = new Map()
  let alarm
  const ctx = {
    blockConcurrencyWhile: (callback) => callback(),
    storage: {
      get: async (key) => data.get(key), put: async (key, value) => data.set(key, value),
      setAlarm: async (time) => { alarm = time }, deleteAll: async () => data.clear(),
    },
  }
  const attempt = () => new AbuseGuard(ctx).fetch(new Request('https://guard/attempt'))
  const receipt = () => new AbuseGuard(ctx).fetch(new Request('https://guard/receipt')).then((r) => r.json())
  try {
    for (let i = 0; i < 3; i++) assert.equal((await attempt()).status, 200)
    assert.equal((await attempt()).status, 429)
    now += 899999
    assert.equal((await attempt()).status, 429)
    now++
    assert.equal((await attempt()).status, 200)
    assert.equal(alarm, now + 900000)
    await new AbuseGuard(ctx).alarm()
    assert.equal(data.size, 0)
    const first = await receipt()
    now += 86399999
    assert.deepEqual(await receipt(), first)
    now++
    assert.notDeepEqual(await receipt(), first)
    assert.equal(alarm, now + 86400000)
    await new AbuseGuard(ctx).alarm()
    assert.equal(data.size, 0)
  } finally { Date.now = originalNow }
})
