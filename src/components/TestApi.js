import React, { useState, useRef } from "react";
import CodeBlock from "../components/CodeBlock";
import RegisterDevice from "../components/RegisterDevice";
import extractBody from "../functions/ExtractBody";
import generateTestToken from "../functions/generateTestToken";
import "../styles/TestApi.scss";
import secret from "../files/default_secret_key.json";
import codeExamples from "../files/code_examples";

const languages = ["Python", "JavaScript", "Node.js", "C++", "Java"];

const TestAPI = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [updatedCode, setUpdatedCode] = useState({});
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [deviceToken, setDeviceToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [runBtnText, setRunBtnText] = useState("Save Token");
        
  const copyToken = (token) => {
    setDeviceToken(token);
    setRunBtnText("Paste Device Token");
  };

  const codeRefs = useRef({});    

  const run = async (event, step) => {
    let latestCode =
      updatedCode[step]?.[selectedLanguage] || 
      codeRefs.current[step]?.innerText || 
      codeExamples[step][selectedLanguage];

    const btnText = event.target.innerText;

    if (btnText === "Paste Device Token") {
      latestCode = latestCode.replace(/"device-token\s*"\s*:\s*"(.*?)"/, `"device-token": "${deviceToken}"`);
      setUpdatedCode((prev) => ({ ...prev, [step]: { [selectedLanguage]: latestCode } }));
      setRunBtnText("Save Token");
      return;
    }

    if (btnText === "Copy Device Id") {
      const extractedDeviceId = responses[step]?.[selectedLanguage]?.match(/"device_id\s*"\s*:\s*"(.*?)"/)?.[1];
      if (extractedDeviceId) {
        await navigator.clipboard.writeText(extractedDeviceId);
        setDeviceId(extractedDeviceId);
      }
      return;
    }

    if (btnText === "Paste Device Id") {
      const clipboardText = await navigator.clipboard.readText();
      latestCode = latestCode.replace(/"device-id\s*"\s*:\s*"(.*?)"/, `"device-id": "${clipboardText}"`);
      setUpdatedCode((prev) => ({ ...prev, [step]: { [selectedLanguage]: latestCode } }));
      event.target.innerText = "Send Notification";
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [step]: true }));
      setResponses((prev) => ({
        ...prev,
        [step]: { [selectedLanguage]: `${btnText.split(" ")[0].replace(/e$/, "")}ing...` },
      }));

      let t_data = localStorage.getItem("t_data");
      let testToken = JSON.parse(t_data || "{}")["test-token"];

      if (!testToken) {
        const res = await generateTestToken(testToken);
        testToken = res.token;
        if (!testToken) return;
      }

      if (!latestCode.includes(testToken)) {
        latestCode = latestCode.replace(/"access-token\s*"\s*:\s*"(.*?)"/, `"access-token": "${testToken}"`);
        setUpdatedCode((prev) => ({ ...prev, [step]: { [selectedLanguage]: latestCode } }));
      }

      const body = extractBody(latestCode);
      body["access-token"] = testToken;

      if (body["client-email"] === "your-service-account-client-email") {
        const userData = JSON.parse(localStorage.getItem("creds") || "{}");
        const clientEmail = userData.email || "your-email@gmail.com";
        body["client-email"] = clientEmail;

        latestCode = latestCode.replace(/"client-email\s*"\s*:\s*"(.*?)"/, `"client-email": "${clientEmail}"`);
        setUpdatedCode((prev) => ({ ...prev, [step]: { [selectedLanguage]: latestCode } }));
      }

      if (body["private-key"] === "your-service-account-private-key") {
        body["private-key"] = secret["secret-key"];
      }

      const response = await fetch(
        "https://bsuf2bagnak4a7bcn2244z2ymi0ikygr.lambda-url.eu-north-1.on.aws/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      setResponses((prev) => ({ ...prev, [step]: { [selectedLanguage]: JSON.stringify(data, null, 2) } }));
      setRunBtnText("Copy Device Id");
    } catch (error) {
      console.error("Error calling API:", error);
      setResponses((prev) => ({ ...prev, [step]: { [selectedLanguage]: "Error fetching response" } }));
    } finally {
      setLoading((prev) => ({ ...prev, [step]: false }));
    }
  };

  return (
    <section className="test-api">
      <h2>🛠️ Test PushNotify API</h2>

      <div className="language-tabs">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`lang-tab ${selectedLanguage === lang ? "active" : ""}`}
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      {["Generate JWT", "Save Token", "Send Push Notification"].map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex fdc api-step">
            <h3>{index + 1}️⃣ {step}</h3>

            <CodeBlock
              className="code-editor"
              step={step}
              language={selectedLanguage}
              code={updatedCode[step]?.[selectedLanguage] || codeExamples[step][selectedLanguage]}
              onCodeChange={(newCode) =>
                setUpdatedCode((prev) => ({ ...prev, [step]: { [selectedLanguage]: newCode } }))
              }
            />

            {responses[step]?.[selectedLanguage] && (
              <CodeBlock
                mode="minimal"
                className="minimal"
                step={step}
                language={selectedLanguage}                
                code={responses[step][selectedLanguage] || "no response"}
              />
            )}

            <button onClick={(event) => run(event, step)} className="api-btn" disabled={loading[step]}>
              {loading[step] ? (
                <>
                  <span className="spinner"></span> {step.split(" ")[0].replace(/e$/, "") + "ing..."}
                </>
              ) : step === "Save Token" ? runBtnText : 
                step === "Send Push Notification" ? (deviceId ? "Paste Device Id" : "Send Push Notification") 
                : step}
            </button>
          </div>

          {step === "Generate JWT" && <RegisterDevice onToken={copyToken} />}
        </React.Fragment>
      ))}
    </section>
  );
};

export default TestAPI;
