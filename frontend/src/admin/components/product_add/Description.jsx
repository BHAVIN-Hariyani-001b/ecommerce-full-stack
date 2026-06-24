import React from "react";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Description = ({ handleOnchange, values }) => {
  const onEditorChange = (e) => {
    handleOnchange({
      target: {
        name: "description",
        value: e.htmlValue,
      },
    });
  };
  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <select className="ql-header" defaultValue="0">
          <option value="1">Heading</option>
          <option value="2">Subheading</option>
          <option value="0">Normal</option>
        </select>
        <select className="ql-font" defaultValue="">
          <option value="">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button
          className="ql-list"
          value="ordered"
          aria-label="Ordered List"
        ></button>
        <button
          className="ql-list"
          value="bullet"
          aria-label="Bullet List"
        ></button>
        <select className="ql-align">
          <option defaultValue=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <button className="ql-link" aria-label="Link"></button>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <div className="w-full min-w-0 bg-white">
      <div>
        <Editor
          value={values}
          onTextChange={onEditorChange}
          headerTemplate={header}
          style={{ height: "320px" }}
        />
      </div>
    </div>
  );
};

export default Description;
