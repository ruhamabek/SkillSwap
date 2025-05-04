import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  html: html(),
  cpp: cpp(),
  java: java(),
};

export default function CodeEditor({ code, language, onChange, readOnly = false }) {
  return (
    <CodeMirror
      value={code}
      height="200px"
      extensions={[languageExtensions[language]]}
      onChange={onChange}
      readOnly={readOnly}
      theme="light"
      basicSetup={{
        lineNumbers: !readOnly,
        highlightActiveLine: !readOnly,
        foldGutter: !readOnly
      }}
    />
  );
}