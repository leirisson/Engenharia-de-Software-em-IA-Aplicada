
import { createServer } from "./server.ts";
import net from "node:net";


const app = createServer()

const parsePort = (value: string | undefined) => {
    if (!value) return null
    const port = Number.parseInt(value, 10)
    if (!Number.isFinite(port)) return null
    if (port < 0 || port > 65535) return null
    return port
}

const isPortFree = (port: number, host: string) => {
    return new Promise<boolean>((resolve) => {
        const server = net.createServer()

        server.once('error', () => {
            resolve(false)
        })

        server.once('listening', () => {
            server.close(() => resolve(true))
        })

        server.listen(port, host)
    })
}

const findAvailablePort = async (preferredPort: number, host: string) => {
    if (preferredPort === 0) return 0

    for (let port = preferredPort; port <= preferredPort + 20; port++) {
        if (await isPortFree(port, host)) return port
    }

    throw new Error(`No available port found in range ${preferredPort}-${preferredPort + 20}`)
}

const host = process.env.HOST ?? '0.0.0.0'
const preferredPort = parsePort(process.env.PORT) ?? 3008
const port = await findAvailablePort(preferredPort, host)

const address = await app.listen({
    port,
    host
})

console.log(`Server listening at ${address}`)

// app.inject({
//     method: "POST",
//     url: "/chat",
//     body:{
//         question: "what is the capital of France?"
//     }
// }).then((res) => {
//     console.log("status response: ", res.statusCode)
//     console.log("body response: " + res.body)
// })
