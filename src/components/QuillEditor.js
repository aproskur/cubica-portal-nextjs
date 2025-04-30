"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const StyledEditor = styled.div`
  .ql-toolbar {
    background-color: #262626;
    border: none;
    padding: 8px;

    .ql-picker,
    .ql-stroke,
    .ql-fill,
    .ql-picker-label,
    .ql-picker-item {
      color: #fff;
      fill: #fff;
      stroke: #fff;
    }

    .ql-picker-options {
      background-color: #262626;
    }

    button {
      color: #fff;
    }
  }

  .ql-editor {
    min-height: 200px;
    color: #fff;
    background-color: #1c1c1c;
    padding: 16px;
  }

  .save-btn {
    margin-top: 16px;
    padding: 10px 20px;
    background-color: rgb(var(--theme-yellow, 255, 204, 0));
    color: #000;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }
`;

export default function QuillEditor({ initialValue = "", onSave }) {
    const [value, setValue] = useState(initialValue);

    const modules = useMemo(() => ({
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            ["clean"],
        ],
    }), []);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <StyledEditor>
            <ReactQuill
                value={value}
                onChange={setValue}
                theme="snow"
                modules={modules}
            />
            <button
                className="save-btn"
                onClick={() => {
                    console.log("Button clicked. Saving value:", value);
                    onSave(value);
                }}
            >
                Сохранить
            </button>

        </StyledEditor>
    );
}
