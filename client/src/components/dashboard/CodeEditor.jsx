import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

export default function CodeEditor() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [codeOutput, setCodeOutput] = useState("");
  const [isRunningCode, setIsRunningCode] = useState(false);

  const runCode = async () => {
    setIsRunningCode(true);
    setCodeOutput("Running...");
    try {
      const languageMap = {
        javascript: { language: 'javascript', version: '18.15.0' },
        python: { language: 'python', version: '3.10.0' },
        java: { language: 'java', version: '15.0.2' },
        "c++": { language: 'c++', version: '10.2.0' }
      };

      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: languageMap[language].language,
        version: languageMap[language].version,
        files: [{ content: code }]
      });

      setCodeOutput(res.data.run.output || "No output");
    } catch (err) {
      console.log(err);
      setCodeOutput("Error executing code.");
    }
    setIsRunningCode(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-400">Code Editor</h2>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-xl outline-none focus:border-blue-500 font-bold"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
        </select>
      </div>
      
      <div className="h-96 rounded-xl overflow-hidden border border-gray-700 mb-4 shadow-inner">
        <Editor
          height="100%"
          language={language === 'c++' ? 'cpp' : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            padding: { top: 16 }
          }}
        />
      </div>

      <button
        onClick={runCode}
        disabled={isRunningCode}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 transition px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
      >
        {isRunningCode ? "Running..." : "▶ Run Code"}
      </button>

      {codeOutput && (
        <div className="mt-6 bg-black border border-gray-700 p-5 rounded-2xl text-green-400 font-mono text-sm whitespace-pre-wrap shadow-inner overflow-x-auto max-h-64 overflow-y-auto">
          <span className="text-gray-500 block mb-2 font-bold">// Output:</span>
          {codeOutput}
        </div>
      )}
    </div>
  );
}
