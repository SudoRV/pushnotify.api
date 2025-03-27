import React, { useState, useEffect, useRef } from "react";
import replacePlaceholders from "../functions/replacePlaceholders";
import "../styles/CodeBlock.scss";

const highlightCode = (code) => {
  return code
    .replace(/</g, "&lt;") 
    .replace(/>/g, "&gt;") 
    .replace(/("[^"]*")(?=\s*:)/g, '<span style="color: #df3079">$1</span>') 
    .replace(/:\s*("[^"]*"|\d+)/g, ': <span style="color: #00a57d">$1</span>'); 
};

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
  const fileExtension = languageExtensions[language?.toLowerCase()] || language;
  const fileName = `${step?.replaceAll(" ", "_")}.${fileExtension}`;
  const storageKey = React.useMemo(() => `codeblock_${step}_${language}`, [step, language]);

  const [isEditable, setIsEditable] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const preRef = useRef(null);
  const fileMenuRef = useRef(null);

  useEffect(() => {
    const savedCode = localStorage.getItem(storageKey);
    setEditableCode(mode === "minimal" ? code : savedCode || code);
  }, [code, storageKey]);

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
      localStorage.setItem(storageKey, updatedText);
    }
    setIsEditable((prev) => !prev);
  };

  const resetToDefault = () => {
    localStorage.removeItem(storageKey);
    setEditableCode(code);
    setShowMenu(false);
  };

  return code === "no response" ? null : (
    <div className={`code-container ${className}`}>
      <div className="flex jcfe aife">
        {mode !== "minimal" && (
          <div
            className="file-name"
            style={{ marginRight: "auto", color: "grey", fontSize: "12px", cursor: "pointer" }}
            onClick={() => setShowMenu(!showMenu)}
          >
            {fileName}
          </div>
        )}

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

      {/* File Menu Popup */}
      {showMenu && (
        <div ref={fileMenuRef} className="file-menu">
          <button className="menu-btn" onClick={resetToDefault}>Reset to Default</button>
          <button className="menu-btn" onClick={() => setShowMenu(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;