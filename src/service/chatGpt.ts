import 'dotenv/config'
import OpenAI from 'openai';
import { existsSync, readFileSync } from 'fs';
import { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';

export type JsonPromptFile = {
    "system_msg": string,
    "tasks": {
        [taskName: string]: {
            "prompt_msg": string,
            "few_shot": Array<{
                "prompt_msg": string,
                "response": string
            }>
        }
    }
}

class ChatGptError extends Error{
    constructor(message: string){
        super(message);
    }
}

export default class ChatGptService {
    private openAi: OpenAI;
    private chatGptModel: ChatCompletionCreateParamsBase["model"];

    private jsonPromptFilePath: string | null;
    protected jsonPrompt: JsonPromptFile | null = null;

    private isSystemMsgSet = false;
    private messageQueue = new Array<ChatCompletionMessageParam>();

    constructor(
        chatGptModel: ChatCompletionCreateParamsBase["model"],
        jsonPromptFilePath?: string
    ){
        this.chatGptModel = chatGptModel;
        this.openAi = this.getOpenAiInstance();

        this.jsonPromptFilePath = jsonPromptFilePath || null;

        if (this.jsonPromptFilePath){
            this.loadJsonFile();
            this.addJsonFileSystemMsgToQueue();
        }
    }

    private loadOpenAiEnv(): string{
        const OPEN_AI_ENV_KEY = "OPEN_AI_API_KEY";

        if(!process.env[OPEN_AI_ENV_KEY]){
            throw new ChatGptError(`Environment variable ${OPEN_AI_ENV_KEY} is not set.`);
        }

        return process.env[OPEN_AI_ENV_KEY];
    }

    private getOpenAiInstance(){
        const openAiApiKey = this.loadOpenAiEnv();

        return new OpenAI({
            "apiKey": openAiApiKey
        });
    }

    protected setSystemMessage(message: string){
        if(this.isSystemMsgSet){
            throw new ChatGptError("System message is already set.");
        }

        this.messageQueue.push({
            role: "system",
            content: message
        });
    }
    
    protected addUserMessageToQueue(message: string){
        this.messageQueue.push({
            role: "user",
            content: message
        });
    }

    private loadJsonFile(){
        if (existsSync(this.jsonPromptFilePath!)) {
            this.jsonPrompt = JSON.parse(readFileSync(this.jsonPromptFilePath!, 'utf8'));
        } else {
            throw new ChatGptError(`Prompt File ${this.jsonPromptFilePath} does not exist.`);
        }
    }

    private addJsonFileSystemMsgToQueue(){
        this.setSystemMessage(this.jsonPrompt!["system_msg"]);
    }

    protected addFewShotMsgToQueue(fewShotExample: Array<{
        "prompt_msg" : string,
        "response": string
    }>){
        fewShotExample.forEach((oneShotExample) => {
            this.messageQueue.push({
                "role": "user",
                "content": oneShotExample.prompt_msg
            })
            this.messageQueue.push({
                "role": "assistant",
                "content": oneShotExample.response
            })
        });
    }

    protected async send(){
        return await this.openAi.chat.completions.create({
            "model": this.chatGptModel,
            "messages" : this.messageQueue
        }) 
    }
}

