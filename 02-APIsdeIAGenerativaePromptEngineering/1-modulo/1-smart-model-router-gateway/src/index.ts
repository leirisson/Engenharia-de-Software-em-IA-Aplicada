import { createServer } from "./server.ts";

const app = createServer()


await app.listen({
    port: 3008,
    host:'0.0.0.0'
})
