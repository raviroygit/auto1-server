"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const hub_1 = require("@huggingface/hub"); // Import snapshotDownload function
const ollama_1 = __importDefault(require("ollama"));
// Define the local model directory
const MODEL_DIR = path_1.default.join(__dirname, "/models");
// Function to download the model from Hugging Face using snapshotDownload
async function downloadHuggingFaceModel(modelId) {
    const modelPath = path_1.default.join(MODEL_DIR, modelId);
    // Check if the model is already downloaded
    if (fs_1.default.existsSync(modelPath)) {
        console.log(`Model ${modelId} is already downloaded.`);
        return;
    }
    // Download the model using snapshotDownload from @huggingface/hub
    try {
        // Create the directory if it doesn't exist
        if (!fs_1.default.existsSync(MODEL_DIR)) {
            fs_1.default.mkdirSync(MODEL_DIR, { recursive: true });
        }
        // Download the model snapshot
        console.log(`Downloading model ${modelId}...`);
        await (0, hub_1.snapshotDownload)({
            repo: modelId, // Specify the Hugging Face model repository (e.g., 'gpt-2')
            cacheDir: modelPath, // Specify the directory to store the downloaded model
        });
        console.log(`Model ${modelId} downloaded successfully to ${modelPath}`);
    }
    catch (error) {
        console.error("Error downloading model:", error);
        throw error;
    }
}
// Function to chat with Ollama using the locally stored model
async function chatWithOllama(modelId, input) {
    const modelPath = path_1.default.join(MODEL_DIR, modelId);
    // Check if the model exists
    if (!fs_1.default.existsSync(modelPath)) {
        console.error(`Model ${modelId} not found. Please download it first.`);
        return;
    }
    try {
        const response = await ollama_1.default.chat({
            model: modelPath, // Use the local model path
            messages: [{ role: "user", content: input }], // Use 'messages' instead of 'message'
        });
        console.log("Ollama Response:", response);
    }
    catch (error) {
        console.error("Error chatting with Ollama:", error);
        throw error;
    }
}
// Main function to orchestrate the process
async function main() {
    const modelId = "gpt-2"; // Example model ID (replace with the model you want to use)
    const inputMessage = "Hello, how are you?";
    // Download the model once if it's not already downloaded
    await downloadHuggingFaceModel(modelId);
    // Chat with Ollama using the downloaded model
    await chatWithOllama(modelId, inputMessage);
}
// Run the main function
main().catch((error) => console.error("Error:", error));
