import { createServer } from "./server.ts";


const app = createServer()


await app.listen({
    port: 3005,
    host:'0.0.0.0'
})
