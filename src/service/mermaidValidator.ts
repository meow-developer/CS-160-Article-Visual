import "dotenv/config";
import axios from 'axios';

export class MermaidValidatorError extends Error{
    constructor(message: string){
        super(message);
    }
}

export default class MermaidValidator{
    private mermaidValidatorUrl: string;
    private mermaidCode: string;

    constructor(mermaidCode: string){
        this.mermaidCode = mermaidCode;
        this.mermaidValidatorUrl = this.getValidatorUrlFromEnv();
    }
    private getValidatorUrlFromEnv(){
        const MERMAID_VALIDATOR_URL_ENV_KEY = "MERMAID_VALIDATOR_URL";

        if(!process.env[MERMAID_VALIDATOR_URL_ENV_KEY]){
            throw new Error(`Environment variable ${MERMAID_VALIDATOR_URL_ENV_KEY} is not set.`);
        }

        return process.env[MERMAID_VALIDATOR_URL_ENV_KEY];
    }

    private async sendMermaidCodeToValidator(){
        try {
            const response = await axios.post(this.mermaidValidatorUrl, {
                "mermaidCode": this.mermaidCode
            }, {
                "headers": {
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (err) {
            throw new MermaidValidatorError(`Failed to send mermaid code to validator.\n ${err}`);
        }
    }

    public async validate(){
        const response = await this.sendMermaidCodeToValidator();
        return response["isValid"];
    }
}