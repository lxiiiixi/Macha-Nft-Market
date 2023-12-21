export const ALCHEMY_BASE_GOERLI_API_KEY = import.meta.env.VITE_ALCHEMY_BASE_GOERLI_API_KEY;
if (typeof ALCHEMY_BASE_GOERLI_API_KEY === "undefined") {
    throw new Error("Please provide ALCHEMY_BASE_GOERLI_API_KEY in .env");
}

export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
if (typeof PROJECT_ID === "undefined") {
    throw new Error("Please provide PROJECT_ID in .env");
}

export const INFURIA_PID = import.meta.env.VITE_INFURIA_PID;
if (typeof INFURIA_PID === "undefined") {
    throw new Error("Please provide INFURIA_PID in .env");
}

export const INFURIA_API = import.meta.env.VITE_INFURIA_API;
if (typeof INFURIA_API === "undefined") {
    throw new Error("Please provide INFURIA_API in .env");
}

export const IMGBB_API = import.meta.env.VITE_IMGBB_API;
if (typeof INFURIA_API === "undefined") {
    throw new Error("Please provide IMGBB_API in .env");
}
