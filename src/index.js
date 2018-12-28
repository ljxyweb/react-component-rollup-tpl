import React, { PureComponent } from "react";
import SubComp from "./SubComp";
import "./index.scss";

export default class Main extends PureComponent {
  render() {
    return (
      <div className="container">
        <p>Main主文件内容</p>
        <SubComp />
      </div>
    );
  }
}
