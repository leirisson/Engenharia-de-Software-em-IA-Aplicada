import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { type TextSplitterConfig } from './config.ts'



export class DocumentProcessor {
    private pdfPath: string
    private textSplitterConfig: TextSplitterConfig

    constructor(pdfPath: string, textSplitterConfig: TextSplitterConfig) {
        // Caminho do PDF a ser processado (ex.: "./tensores.pdf").
        this.pdfPath = pdfPath
        // Configuração do splitter (chunkSize/chunkOverlap) vinda do CONFIG.
        this.textSplitterConfig = textSplitterConfig


    }


    /**
     * 
     * split dos chunks do pdf
     * corte do pdf em chunks
     */
    async loadAndSplit() {
        // PDFLoader carrega o PDF e devolve uma lista de Document(s) (LangChain),
        // geralmente com o texto extraído e metadata (ex.: source, pageNumber, etc.).
        const loader = new PDFLoader(this.pdfPath)
        const rawDocuments = await loader.load()


        // RecursiveCharacterTextSplitter tenta quebrar o texto em
        //  limites “melhores” (ex.: parágrafos),
        // mas garante o tamanho máximo aproximado do chunk.
        const splitter = new RecursiveCharacterTextSplitter(
            this.textSplitterConfig
        )
        const documents = await splitter.splitDocuments(rawDocuments)
        console.log(`✂️   -  cortado em ${documents.length} chunks`)


        // Aqui você está normalizando o metadata e mantendo apenas "source".
        // Isso simplifica o que vai para o banco, mas também remove outros campos úteis
        // (por exemplo, pageNumber/loc). Se você quiser exibir a página no resultado,
        // preserve esses campos no metadata.
        return documents.map(doc => ({
            ...doc,
            metadata: {
                source: doc.metadata.source,
            }
        }))
    }
}
