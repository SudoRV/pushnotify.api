import { jwtDecode } from "jwt-decode";
const BASE_URL = "https://inlmqkmxchdb5df6t3gjdqzpqi0jrfmc.lambda-url.eu-north-1.on.aws/";

async function generateTestToken(existingToken) {  
    // Check if the existing token is expired
    if (existingToken) {
        try {
            const decoded = jwtDecode(existingToken);
            const expiryTime = decoded.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();

            if (currentTime < expiryTime) {
                // Token is still valid, copy to clipboard
                await navigator.clipboard.writeText(existingToken);
                return { error: null, token: existingToken };
            } else {
                console.log("Test token expired, regenerating...");
            }
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    // Construct URL for generating a new test token
    const url = `${BASE_URL}?req=test-token`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        if (!data["test-token"]) throw new Error("Invalid response");

        // Save new test token in local storage
        localStorage.setItem("t_data", JSON.stringify({
            ...JSON.parse(localStorage.getItem("t_data") || "{}"),
            "test-token": data["test-token"]
        }));

        return { error: null, token: data["test-token"] };
    } catch (error) {
        console.error("Error fetching test token:", error);
        return { error: "Failed to fetch test token" };
    }
}

export default generateTestToken;
