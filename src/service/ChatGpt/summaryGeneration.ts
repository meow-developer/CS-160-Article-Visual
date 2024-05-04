import ChatGpt, { ChatGptService } from "./chatGpt.js";

import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default class SummaryGenerationService extends ChatGpt implements ChatGptService {
    private TASK_NAMES = ["summarize"];
    constructor() {
        const CHATGPT_MODEL = "gpt-3.5-turbo";
        const JSON_PROMPT_FILE_PATH = path.join(dirname(fileURLToPath(import.meta.url)),
                                                        '../../data/prompt/summary.json');
        super(CHATGPT_MODEL, JSON_PROMPT_FILE_PATH);
    }
    private async getSummaryFromPdf(pdfText: string){
        console.log(this.jsonPrompt!.tasks)
        const promptMsg = this.jsonPrompt!.tasks[this.TASK_NAMES[0]].prompt_msg;
        this.addUserMessageToQueue(promptMsg + pdfText);
        
        return (await this.send())!;
    }
    
    public async generate(pdfText: string): Promise<string> {
        const summary = await this.getSummaryFromPdf(pdfText);
        return summary;
    }
}