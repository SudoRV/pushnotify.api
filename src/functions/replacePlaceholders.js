import secret from "../files/default_secret_key.json";

const replacePlaceholders = (rawText) => {
  let updatedText = rawText;

  // Retrieve stored test token from local storage
  let t_data = localStorage.getItem("t_data");
  let testToken = JSON.parse(t_data || "{}")["test-token"];

  // Replace "access-token" if testToken is available
  if (testToken) {
    updatedText = updatedText.replace(/"access-token\s*"\s*:\s*"(.*?)"/, `"access-token": "${testToken}"`);
  }

  // Retrieve stored client email from local storage
  const userData = JSON.parse(localStorage.getItem("creds") || "{}");
  const clientEmail = userData.email || "your-email@gmail.com";

  // Replace "client-email"
  updatedText = updatedText.replace(/"client-email\s*"\s*:\s*"(.*?)"/, `"client-email": "${clientEmail}"`);

  // Replace "private-key" with secret key from JSON file
  updatedText = updatedText.replace(/"private-key\s*"\s*:\s*"(.*?)"/, `"private-key": "${secret["secret-key"].replaceAll("\n", "\\n")}"`);

  return updatedText.replaceAll("\n", " ");
};

export default replacePlaceholders;





