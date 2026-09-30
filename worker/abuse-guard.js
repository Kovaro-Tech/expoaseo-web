// Only timestamps/counters are stored. No IP, CV, email or application body.
export class AbuseGuard {
  constructor(ctx) { this.ctx = ctx }

  async fetch(request) {
    return this.ctx.blockConcurrencyWhile(async () => {
      const now = Date.now()
      if (new URL(request.url).pathname === '/attempt') {
        const times = ((await this.ctx.storage.get('times')) || []).filter((time) => now - time < 900000)
        if (times.length >= 3) return Response.json({ allowed: false }, { status: 429 })
        times.push(now)
        await this.ctx.storage.put('times', times)
        await this.ctx.storage.setAlarm(now + 900000)
        return Response.json({ allowed: true })
      }
      // Stable receipt time makes Resend retries byte-for-byte identical.
      let receivedAt = await this.ctx.storage.get('receivedAt')
      if (!receivedAt || now - receivedAt >= 86400000) {
        receivedAt = now
        await this.ctx.storage.put('receivedAt', receivedAt)
        await this.ctx.storage.setAlarm(now + 86400000)
      }
      return Response.json({ receivedAt })
    })
  }

  async alarm() { await this.ctx.storage.deleteAll() }
}
