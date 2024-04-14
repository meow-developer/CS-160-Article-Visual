import 'dotenv/config'
import OpenAI from 'openai';
import { ChatCompletionRole } from 'openai/resources/index.mjs';
import { existsSync, readFileSync } from 'fs';

class ChatGptError extends Error{
    constructor(message: string){
        super(message);
    }
}

export class ChatGptService {
    private openAi: OpenAI;
    private isSystemMsgSet = false;
    private jsonPromptFilePath: string | null;

    constructor(
        jsonPromptFilePath?: string
    ){
        this.openAi = this.getOpenAiInstance();
        this.jsonPromptFilePath = jsonPromptFilePath || null;
    }

    private messageQueue = new Array<{
        role: ChatCompletionRole,
        content: string}>();

    private loadOpenAiEnv(): string{
        const OPEN_AI_ENV_KEY = "OPEN_AI_API_KEY";

        if(!process.env[OPEN_AI_ENV_KEY]){
            throw new ChatGptError(`Environment variable ${OPEN_AI_ENV_KEY} is not set.`);
        }

        return process.env[OPEN_AI_ENV_KEY];
    }

    private getOpenAiInstance(){
        const openAiApiKey = this.loadOpenAiEnv();

        return new OpenAI({"apiKey": openAiApiKey});
    }

    private setSystemMessage(message: string){
        if(this.isSystemMsgSet){
            throw new ChatGptError("System message is already set.");
        }

        this.messageQueue.push({
            role: "system",
            content: message
        });
    }
    
    private addUserMessageToQueue(message: string){
        this.messageQueue.push({
            role: "user",
            content: message
        });
    }

    private loadJsonFile(){
        if (existsSync(this.jsonPromptFilePath!)) {
            return JSON.parse(readFileSync(this.jsonPromptFilePath!, 'utf8'));
        }
    }

    private addJsonFilePromptToQueue(){
        const prompt = this.loadJsonFile();
        this.setSystemMessage(prompt["system_msg"]);
    }
}

