import dns from 'dns'
import net from 'node:net'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Using require() here avoids TS export-resolution issues with Prisma under some
// bundler moduleResolution setups, while keeping runtime behavior unchanged.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient: PrismaClientCtor } = require('@prisma/client') as any

type PrismaClient = InstanceType<typeof PrismaClientCtor>

let _client: PrismaClient | null = null
let _initPromise: Promise<PrismaClient> | null = null

function resolveIPv4(hostname: string): Promise<string> {
  return new Promise((resolve, reject) =>
    dns.resolve4(hostname, (err, addrs) => {
      if (err || !addrs?.length) reject(err ?? new Error('No IPv4 address'))
      else resolve(addrs[0])
    })
  )
}

function isLocalHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

async function init(): Promise<PrismaClient> {
  const rawUrl = process.env.DATABASE_URL!
  const url = new URL(rawUrl)
  const hostname = url.hostname

  const local = isLocalHostname(hostname)
  const isIp = net.isIP(hostname) !== 0
  const sslmode = url.searchParams.get('sslmode')

  if (!local && !isIp) {
    const ipv4 = await resolveIPv4(hostname)
    url.hostname = ipv4
  }
  url.searchParams.delete('sslmode')
  url.searchParams.delete('channel_binding')

  const useSsl = !local && sslmode !== 'disable'

  const pool = new Pool(
    useSsl
      ? {
          connectionString: url.toString(),
          ssl: { rejectUnauthorized: false, servername: hostname },
        }
      : {
          connectionString: url.toString(),
        }
  )
  const adapter = new PrismaPg(pool)
  const client = new PrismaClientCtor({ adapter } as any) as PrismaClient
  _client = client
  return client
}

export async function getPrisma(): Promise<PrismaClient> {
  if (_client) return _client
  if (!_initPromise) _initPromise = init()
  return _initPromise
}

// Convenience re-export for server components that can await at the top
export { type PrismaClient }
