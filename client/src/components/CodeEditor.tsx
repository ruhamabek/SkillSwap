import { FC } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { cn } from "@/lib/utils";
import type { BasicSetupOptions } from "@uiw/react-codemirror";

// Map of language extensions
const languageExtensions = {
  javascript: javascript(),
  python: python(),
  html: html(),
  cpp: cpp(),
  java: java(),
} as const;

interface CodeEditorProps {
  code: string;
  language: keyof typeof languageExtensions;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  basicSetup?: BasicSetupOptions;
}

const CodeEditor: FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
  readOnly = false,
  className = "",
  basicSetup,
}) => {
  const mergedSetup = {
    lineNumbers: !readOnly,
    highlightActiveLine: !readOnly,
    foldGutter: !readOnly,
    syntaxHighlighting: true,
    ...basicSetup,
  };

  return (
    <div className={cn("relative w-full rounded-md overflow-hidden border", className)}>
      {/* Language label */}
      <div className="absolute top-0 left-0 right-0 bg-background text-muted-foreground text-xs px-2 py-1 border-b border-border z-10">
        {language.toUpperCase()}
      </div>
      {/* Editor container with padding for label */}
      <div className="pt-6 w-full">
        <CodeMirror
          value={code}
          width="100%"
          height="auto"
          extensions={[languageExtensions[language]]}
          onChange={onChange}
          readOnly={readOnly}
          theme="light"
          basicSetup={mergedSetup}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
