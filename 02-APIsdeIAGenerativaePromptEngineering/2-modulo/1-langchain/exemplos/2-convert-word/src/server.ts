import { app } from "./index.ts";
import { env } from "./env";



function buildServer(){
    try {
        app.listen({
            port: env.PORT,
            host: '0.0.0.0'
        })
    } catch (error) {
        console.error("Erro ao tentar iniciar o servidor")
    }
}


buildServer()