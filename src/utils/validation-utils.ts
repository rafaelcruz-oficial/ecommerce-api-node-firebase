import { ValidationError } from "../errors/validation.error.js";

export const isStorageUrlValid = (urlStr: string): boolean => {
    try {
        const url = new URL(urlStr);
        if (url.host !== "firebasestorage.googleleapis.com") {
            throw new ValidationError("URL de origem inválida!");
        }
        return true;
    } catch (error){
        if (error instanceof ValidationError) {
            throw error
        }
        return false;
    }
}