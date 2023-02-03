import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-funky.css'; //Example style, you can use another

const Edit = (props) => {
  const [code, setCode] = useState(props.code)
  const [edited, setEdited] = useState(false)

  useEffect(() => {
    if (props.code != code) {
      setCode(props.code);
    }
  }, [props.code]);

  const codeChange = (_code) => {
    setEdited(true)
    setCode(_code);
  }

  const codeFinish = () => {
    if (!edited) {
      return
    }
    setEdited(false)
    props.finishYaml(code)
  }


  return <Editor
    value={code}
    onValueChange={(code) => codeChange(code)}
    onBlur={() => codeFinish()}
    highlight={code => highlight(code, languages.yaml, "yaml")}
    padding={10}
    style={{
      fontFamily: '"consolas", "Fira Mono", monospace',
      fontSize: 14,
      minHeight: "100%",
      backgroundColor: '#001529',
      color: "white",
      borderRadius: '10px 10px',
    }}
  />
}

export default Edit;
