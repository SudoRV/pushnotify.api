import React, { useState, useEffect, useRef } from "react";
import replacePlaceholders from "../functions/replacePlaceholders";
import "../styles/CodeBlock.scss";

// Highlight code syntax
const highlightCode = (code) => {
  return code
    .replace(/</g, "&lt;") // Escape <
    .replace(/>/g, "&gt;") // Escape >
    .replace(/("[^"]*")(?=\s*:)/g, '<span style="color: #df3079">$1</span>') // Keys in red
    .replace(/:\s*("[^"]*"|\d+)/g, ': <span style="color: #00a57d">$1</span>'); // Values in green
};

// Language extension mapping
const languageExtensions = {
  python: "py",
  nodejs: "js",
  javascript: "js",
  java: "java",
  'c++': "cpp",
  c: "c",
  html: "html",
  css: "css",
  json: "json",
  xml: "xml",
};

const CodeBlock = ({ className, mode, step, language, code }) => {  

  // Get correct file extension
  const fileExtension = languageExtensions[language?.toLowerCase()] || language;
  const fileName = `${step?.replaceAll(" ", "_")}.${fileExtension}`; // Generate file name

  const storageKey = React.useMemo(() => `codeblock_${step}_${language}`, [step, language]); // Unique key
  const [isEditable, setIsEditable] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  
  const [highlightedCode, setHighlightedCode] = useState("");
  const preRef = useRef(null);

  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(storageKey);
    setEditableCode(savedCode || code);
  }, [code, storageKey]);

  // Update highlighted code when editableCode changes
  useEffect(() => {
    setHighlightedCode(highlightCode(editableCode));
  }, [editableCode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(replacePlaceholders(editableCode));
  };

  const toggleEdit = () => {
    if (isEditable) {
      const updatedText = preRef.current?.innerText || editableCode;
      setEditableCode(updatedText);
      localStorage.setItem(storageKey, updatedText); // Save changes
    }
    setIsEditable((prev) => !prev);
  };

  return code === "no response" ? null : (
    <div className={`code-container ${className}`}>
      {/* File Name at Top Left */}
      <div className="flex jcfe aife">
        {mode!=="minimal" ? <div style={{ marginRight: "auto", color: "grey", fontSize: "12px" }} className="file-name">
          {fileName}
        </div> : ""}

        <div className="flex jcfe btn-container">
          {mode !== "minimal" && (
            <button className="edit-btn copy-btn" onClick={toggleEdit}>
              {isEditable ? "Save" : "Edit"}
            </button>
          )}
          <button className="copy-btn" onClick={copyToClipboard}>Copy</button>
        </div>
      </div>

      <pre ref={preRef} contentEditable={isEditable} suppressContentEditableWarning={true}>
        <code className="language-json" dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
      </pre>
    </div>
  );
};

export default CodeBlock;


