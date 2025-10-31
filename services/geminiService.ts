
import { GoogleGenAI, Type } from "@google/genai";
import { FlashcardData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const flashcardSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING, description: 'The English word.' },
        ipa: { type: Type.STRING, description: 'International Phonetic Alphabet (IPA) transcription.' },
        englishDefinition: { type: Type.STRING, description: 'A concise definition in English.' },
        englishSynonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 English synonyms.' },
        englishAntonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 English antonyms.' },
        englishExamples: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Two example sentences in English.' },
        persianTranslation: { type: Type.STRING, description: 'The most accurate Persian translation.' },
        persianPhonetic: { type: Type.STRING, description: 'A simplified Persian phonetic spelling.' },
        persianSynonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 Persian synonyms.' },
        persianAntonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 Persian antonyms.' },
        persianExamples: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Two example sentences in Persian.' },
        extraNote: { type: Type.STRING, nullable: true, description: 'Optional grammar or usage note, in Persian.' },
    },
    required: [
        'word', 'ipa', 'englishDefinition', 'englishSynonyms', 'englishAntonyms',
        'englishExamples', 'persianTranslation', 'persianPhonetic', 'persianSynonyms',
        'persianAntonyms', 'persianExamples'
    ],
};

export const generateFlashcardContent = async (word: string): Promise<FlashcardData> => {
    const prompt = `Generate a detailed vocabulary flashcard for a native Persian speaker learning English. The word is "${word}". Provide natural, culturally relevant Persian translations and examples. Ensure all fields in the JSON schema are filled accurately.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flashcardSchema,
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        
        // Ensure arrays have content, even if empty
        data.englishSynonyms = data.englishSynonyms || [];
        data.englishAntonyms = data.englishAntonyms || [];
        data.englishExamples = data.englishExamples || [];
        data.persianSynonyms = data.persianSynonyms || [];
        data.persianAntonyms = data.persianAntonyms || [];
        data.persianExamples = data.persianExamples || [];

        return data as FlashcardData;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to generate flashcard content.");
    }
};
