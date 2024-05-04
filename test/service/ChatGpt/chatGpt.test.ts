//@ts-nocheck
import ChatGptService from '../../../src/service/ChatGpt/chatGpt.js';

describe('ChatGptService', () => {
    let chatGptService: ChatGptService;

    beforeEach(() => {
        chatGptService = new ChatGptService('gpt-3.5-turbo');
    });

    describe('setSystemMessage', () => {
        it('should set the system message', () => {
            const systemMessage = 'Welcome to the chat!';
            chatGptService.setSystemMessage(systemMessage);
            expect(chatGptService['isSystemMsgSet']).toBe(true);
            expect(chatGptService['messageQueue'][0].role).toBe('system');
            expect(chatGptService['messageQueue'][0].content).toBe(systemMessage);
        });
    });

    describe('addUserMessageToQueue', () => {
        it('should add user message to the message queue', () => {
            const userMessage = 'Hello, how can I help you?';
            chatGptService.addUserMessageToQueue(userMessage);
            expect(chatGptService['messageQueue'][0].role).toBe('user');
            expect(chatGptService['messageQueue'][0].content).toBe(userMessage);
        });
    });

    describe('addFewShotMsgToQueue', () => {
        it('should add few-shot messages to the message queue', () => {
            const fewShotExamples = [
                {
                    prompt_msg: 'What is the capital of France?',
                    response: 'The capital of France is Paris.',
                },
                {
                    prompt_msg: 'Who is the president of the United States?',
                    response: 'The president of the United States is Joe Biden.',
                },
            ];
            chatGptService.addFewShotMsgToQueue(fewShotExamples);
            expect(chatGptService['messageQueue'][0].role).toBe('user');
            expect(chatGptService['messageQueue'][0].content).toBe(fewShotExamples[0].prompt_msg);
            expect(chatGptService['messageQueue'][1].role).toBe('assistant');
            expect(chatGptService['messageQueue'][1].content).toBe(fewShotExamples[0].response);
            expect(chatGptService['messageQueue'][2].role).toBe('user');
            expect(chatGptService['messageQueue'][2].content).toBe(fewShotExamples[1].prompt_msg);
            expect(chatGptService['messageQueue'][3].role).toBe('assistant');
            expect(chatGptService['messageQueue'][3].content).toBe(fewShotExamples[1].response);
        });
    });
    // Add more test cases for other methods...
    describe('send', ()=>{

        it('should return true if the message is sent', async () => {
            chatGptService.setSystemMessage("You are being unit tested");
            chatGptService.addUserMessageToQueue("Return only 'true' in string in the response.");    

            // Act
            const response = await chatGptService.send();
            // Assert
            expect(response).toBe("true");
        });
    })
});
