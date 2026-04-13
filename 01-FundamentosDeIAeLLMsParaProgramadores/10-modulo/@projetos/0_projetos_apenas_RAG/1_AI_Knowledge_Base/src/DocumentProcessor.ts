import { type TextSplitterConfig } from './config.ts'
import fs from 'node:fs/promises';
import path from 'node:path';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { Document } from '@langchain/core/documents';
import { createHash } from 'node:crypto'



export class DocumentProcessor {
    private csvPath: string
    private textSplitterConfig: TextSplitterConfig

    constructor(
        csvPath: string,
        textSplitterConfig: TextSplitterConfig
    ) {
        this.csvPath = csvPath
        this.textSplitterConfig = textSplitterConfig
    }

    /**
       * 
       * split dos chunks do csv
       * corte do csv em chunks
    */

    async loadAndSplit(): Promise<Array<Document<Record<string, any>>>> {
        // Listar todos os arquivos .csv na pasta (this.csvPath)
        const files = await fs.readdir(this.csvPath)
        // Configuração do splitter (chunkSize/chunkOverlap) vinda do CONFIG.
        const splitter = new RecursiveCharacterTextSplitter(this.textSplitterConfig)
        // Acumula todos os chunks de todos os arquivos
        const result: Array<Document<Record<string, any>>> = []

        /**
         * Fluxo de ingestão simples para CSVs:
         * - lista todos os arquivos .csv na pasta (this.csvPath)
         * - para cada arquivo: lê o conteúdo como texto e separa por linhas
         * - cada linha vira um Document com metadados (arquivo, rowIndex)
         * - aplica o splitter configurado para gerar os chunks
         * - acumula os chunks de todos os arquivos e retorna um único array
         *
         * Observação:
         * Este loader é linha-a-linha para evitar dependências extras.
         * Caso precise ler colunas de CSV, instale `d3-dsv@2` e use `CSVLoader`.
         */
        for (const file of files.filter(f => f.toLowerCase().endsWith('.csv'))) {
            const fullPath = path.join(this.csvPath, file)
            const content = await fs.readFile(fullPath, "utf8")
            // Separa por linhas e filtra linhas vazias
            const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0)

            // Cria Documents para cada linha
            const rawDocs: Array<Document<Record<string, any>>> = 
            lines.map((line, idx) => ({
                pageContent: line,
                metadata: { sourceType: "csv", file, rowIndex: idx + 1 }
            }))

            const docs = await splitter.splitDocuments(rawDocs)
            const docsWithIds = docs.map((doc, chunkIndex) => {
                const rowIndex = doc.metadata?.rowIndex ?? 0
                const chunkId = createHash('sha256')
                    .update(`${file}:${rowIndex}:${chunkIndex}`)
                    .digest('hex')
                const contentHash = createHash('sha256').update(doc.pageContent).digest('hex')
                return {
                    ...doc,
                    metadata: {
                        ...doc.metadata,
                        chunkIndex,
                        chunkId,
                        contentHash,
                    }
                }
            })
            result.push(...docsWithIds)
        }

        return result
    }



}


