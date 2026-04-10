import { CONFIG } from "./config.ts";
import { OpenRouterService } from "./openRouterServices.ts";
import { createServer } from "./server.ts";

const openRouterService = new OpenRouterService(CONFIG)


const app = createServer(openRouterService)


await app.listen({
    port: 3008,
    host:'0.0.0.0'
})
