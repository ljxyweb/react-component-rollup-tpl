import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import sass from "rollup-plugin-sass";
import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

const input = "src/index.js";
const globalName = "ReactLibrary";
const external = Object.keys(pkg.peerDependencies || {});

//cjs – CommonJS，适用于 Node 和 Browserify/Webpack
const cjs = [
  {
    input, //包入口
    output: {
      file: `lib/${pkg.name}.js`, //要写入的文件
      format: "cjs" //生成包的格式
    },
    external, // 指出应将哪些模块视为外部模块
    plugins: [
      sass({
        output: `lib/${pkg.name}.css`,
        processor: css =>
          postcss([autoprefixer])
            .process(css)
            .then(result => result.css)
      }),
      babel({ exclude: /node_modules/ }) // 只编译我们的源代码
    ]
  }
];

//esm – 将软件包保存为ES模块文件
const esm = [
  {
    input,
    output: { file: `esm/${pkg.name}.js`, format: "esm" },
    external,
    plugins: [
      sass({
        output: `esm/${pkg.name}.css`,
        processor: css =>
          postcss([autoprefixer])
            .process(css)
            .then(result => result.css)
      }),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      })
    ]
  }
];

const globals = { react: "React", "react-dom": "ReactDom" };

//iife – 一个自动执行的功能，适合作为<script>标签。
//umd – 通用模块定义，以amd，cjs 和 iife 为一体
const umd = [
  {
    input,
    output: {
      file: `umd/${pkg.name}.js`,
      format: "umd",
      name: globalName, //生成包名称
      globals
    },
    external,
    plugins: [
      sass({
        output: `umd/${pkg.name}.css`,
        processor: css =>
          postcss([autoprefixer])
            .process(css)
            .then(result => result.css)
      }),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      nodeResolve(), //告诉Rollup如何查找外部模块
      commonjs()
    ]
  },
  {
    input,
    output: {
      file: `umd/${pkg.name}.min.js`,
      format: "umd",
      name: globalName,
      globals
    },
    external,
    plugins: [
      sass({
        output: `umd/${pkg.name}.css`,
        processor: css =>
          postcss([autoprefixer])
            .process(css)
            .then(result => result.css)
      }),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs(),
      uglify()
    ]
  }
];

let config;
switch (process.env.BUILD_ENV) {
  case "cjs":
    config = cjs;
    break;
  case "esm":
    config = esm;
    break;
  case "umd":
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

export default config;
