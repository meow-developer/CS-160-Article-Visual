"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGptService = void 0;
require("dotenv/config");
var openai_1 = require("openai");
var fs_1 = require("fs");
var ChatGptError = /** @class */ (function (_super) {
    __extends(ChatGptError, _super);
    function ChatGptError(message) {
        return _super.call(this, message) || this;
    }
    return ChatGptError;
}(Error));
var ChatGptService = /** @class */ (function () {
    function ChatGptService() {
    }
    return ChatGptService;
}());
exports.ChatGptService = ChatGptService;
var ChatGpt = /** @class */ (function () {
    function ChatGpt(chatGptModel, jsonPromptFilePath) {
        this.jsonPrompt = null;
        this.isSystemMsgSet = false;
        this.messageQueue = new Array();
        this.chatGptModel = chatGptModel;
        this.openAi = this.getOpenAiInstance();
        this.jsonPromptFilePath = jsonPromptFilePath || null;
        if (this.jsonPromptFilePath) {
            this.loadJsonFile();
            this.addJsonFileSystemMsgToQueue();
        }
    }
    ChatGpt.prototype.loadOpenAiEnv = function () {
        var OPEN_AI_ENV_KEY = "OPEN_AI_API_KEY";
        if (!process.env[OPEN_AI_ENV_KEY]) {
            throw new ChatGptError("Environment variable ".concat(OPEN_AI_ENV_KEY, " is not set."));
        }
        return process.env[OPEN_AI_ENV_KEY];
    };
    ChatGpt.prototype.getOpenAiInstance = function () {
        var openAiApiKey = this.loadOpenAiEnv();
        return new openai_1.default({
            "apiKey": openAiApiKey
        });
    };
    ChatGpt.prototype.setSystemMessage = function (message) {
        if (this.isSystemMsgSet) {
            throw new ChatGptError("System message is already set.");
        }
        this.messageQueue.push({
            role: "system",
            content: message
        });
        this.isSystemMsgSet = true;
    };
    ChatGpt.prototype.addUserMessageToQueue = function (message) {
        this.messageQueue.push({
            role: "user",
            content: message
        });
    };
    ChatGpt.prototype.loadJsonFile = function () {
        if ((0, fs_1.existsSync)(this.jsonPromptFilePath)) {
            this.jsonPrompt = JSON.parse((0, fs_1.readFileSync)(this.jsonPromptFilePath, 'utf8'));
        }
        else {
            throw new ChatGptError("Prompt File ".concat(this.jsonPromptFilePath, " does not exist."));
        }
    };
    ChatGpt.prototype.addJsonFileSystemMsgToQueue = function () {
        this.setSystemMessage(this.jsonPrompt["system_msg"]);
    };
    ChatGpt.prototype.addFewShotMsgToQueue = function (fewShotExample) {
        var _this = this;
        fewShotExample.forEach(function (oneShotExample) {
            _this.messageQueue.push({
                "role": "user",
                "content": oneShotExample.prompt_msg
            });
            _this.messageQueue.push({
                "role": "assistant",
                "content": oneShotExample.response
            });
        });
    };
    ChatGpt.prototype.addAssistantResponseToQueue = function (response) {
        this.messageQueue.push({
            "role": "assistant",
            "content": response
        });
    };
    ChatGpt.prototype.send = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openAi.chat.completions.create({
                            "model": this.chatGptModel,
                            "messages": this.messageQueue
                        })];
                    case 1:
                        response = (_a.sent()).choices[0].message.content;
                        this.addAssistantResponseToQueue(response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return ChatGpt;
}());
exports.default = ChatGpt;
