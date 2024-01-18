---
title: Tree shaking 和 No side effects
pubDate: 2024-01-16
categories: ['Blog', '技术']
description: ''
---

## CJS 和 ESM

前端代码的模块化，是从无开始的，然后从 CJS 过渡到 ESM。

在 CommonJS 时代，模块之间通过 require 来建立联系，这种方式，使用非常的灵活，但是也带来一个问题，过于灵活导致，导致无法对引用的模块进行分析，假如引用的文件中有大量用不到的代码，我们也清除不掉，只能照单全收，造成打包之后的代码体积大，拖慢代码的执行速度。

随着 ES6（ES2015）的普及,这种情况得到了改变，ES6 语法的[静态结构](http://exploringjs.com/es6/ch_modules.html#static-module-structure) 特性，使得我们知道引用模块的代码，这样就可以提前删除无用的代码，这些无用的代码通常叫做死代码。因为它们对程序没有任何影响。

> 死代码（dead code）是指程序中一段已经不会被执行的代码，通常是因为重构、优化或者逻辑错误导致的。这些代码可能是之前版本的遗留物，或者某些条件下永远不会被执行的代码。

## 什么是 Tree Shaking

假如有 `src/math.js` 模块，它的内容如下：

```js
// src/math.js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}

export const twentyFive = square(5);
```

我们在模块 `src/main.js` 中使用：

```js
// main.js
import { cube } from './maths.js';

console.log(cube(5)); // 125
```

很明显函数 square 和变量 twentyFive 没有被使用，都是死代码，删除它们可以节省空间和代码执行速度。

[点击查看编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwY3ViZSUyMCU3RCUyMGZyb20lMjAnLiUyRm1hdGhzLmpzJyUzQiU1Q24lNUNuY29uc29sZS5sb2coY3ViZSg1KSklM0IlMjAlMkYlMkYlMjAxMjUlMjIlMkMlMjJpc0VudHJ5JTIyJTNBdHJ1ZSUyQyUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTdEJTJDJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMHNyYyUyRm1hdGguanMlNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBzcXVhcmUoeCklMjAlN0IlNUNuJTIwJTIwcmV0dXJuJTIweCUyMColMjB4JTNCJTVDbiU3RCU1Q24lNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBjdWJlKHgpJTIwJTdCJTVDbiUyMCUyMHJldHVybiUyMHglMjAqJTIweCUyMColMjB4JTNCJTVDbiU3RCU1Q24lNUNuZXhwb3J0JTIwY29uc3QlMjB0d2VudHlGaXZlJTIwJTNEJTIwc3F1YXJlKDUpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQWZhbHNlJTJDJTIybmFtZSUyMiUzQSUyMm1hdGhzLmpzJTIyJTdEJTVEJTJDJTIyb3B0aW9ucyUyMiUzQSU3QiUyMm91dHB1dCUyMiUzQSU3QiUyMmZvcm1hdCUyMiUzQSUyMmVzJTIyJTdEJTJDJTIydHJlZXNoYWtlJTIyJTNBdHJ1ZSU3RCU3RA==)

合理的删除没用的死代码，这就是 Tree Shaking 的作用。

## sideEffects

基于上面 `src/math.js` 的例子，我们在模块中新增一行代码 `window.effect1 = 10;`。

```js
// src/math.js

// 新增
window.effect1 = 10;

export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}

export const twentyFive = square(5);
```

同时在 `src/main` 中只引入模块，但不使用引入的内容：

```js
import { cube } from "./math.js";
console.log("main");
```

因为没有使用 twentyFive、 square 和 cube 都被 Tree Shaking 掉了，`window.effect1` 如何处理呢。

> 这种直接修改外部变量的行为我们称之为副作用。

最后代码会被编译为下面这种，副作用将会被保留：

```js
window.effect1 = 10;

console.log("main");
```

[查看副作用被保留的编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwY3ViZSUyMCU3RCUyMGZyb20lMjAnLiUyRm1hdGhzLmpzJyUzQiU1Q24lNUNuY29uc29sZS5sb2coJTVDJTIybWFpbiU1QyUyMiklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBdHJ1ZSUyQyUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTdEJTJDJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMHNyYyUyRm1hdGguanMlNUNuJTVDbiUyRiUyRiUyMCVFNiU5NiVCMCVFNSVBMiU5RSU1Q253aW5kb3cuZWZmZWN0MSUyMCUzRCUyMDEwJTNCJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMHNxdWFyZSh4KSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMGN1YmUoeCklMjAlN0IlNUNuJTIwJTIwcmV0dXJuJTIweCUyMColMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBjb25zdCUyMHR3ZW50eUZpdmUlMjAlM0QlMjBzcXVhcmUoNSklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlMkMlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyb3V0cHV0JTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlN0QlMkMlMjJ0cmVlc2hha2UlMjIlM0F0cnVlJTdEJTdE)

__引入此模块且模块中有副作用，但没有使用模块的任何导出__，关于副作用有两种处理方法：

1. 保留，虽然没有用到模块的导出，但是希望保留副作用。
2. 删除，没有用到模块的导出，里面的副作用也不需要保留。

第一种是打包工具的默认行为，第二种，可以在项目的 `package.json` 中添加 `"sideEffects": false` ，像 Webpack 和 Rollup 打包的时候，可以无脑让这些包含副作用，引用但未使用的模块安全删除：

[查看副作用被删除的编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwY3ViZSUyMCU3RCUyMGZyb20lMjAnLiUyRm1hdGhzLmpzJyUzQiU1Q24lNUNuY29uc29sZS5sb2coJTVDJTIybWFpbiU1QyUyMiklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBdHJ1ZSUyQyUyMm5hbWUlMjIlM0ElMjJtYWluLmpzJTIyJTdEJTJDJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMHNyYyUyRm1hdGguanMlNUNuJTVDbiUyRiUyRiUyMCVFNiU5NiVCMCVFNSVBMiU5RSU1Q253aW5kb3cuZWZmZWN0MSUyMCUzRCUyMDEwJTNCJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMHNxdWFyZSh4KSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMGN1YmUoeCklMjAlN0IlNUNuJTIwJTIwcmV0dXJuJTIweCUyMColMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBjb25zdCUyMHR3ZW50eUZpdmUlMjAlM0QlMjBzcXVhcmUoNSklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlMkMlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyb3V0cHV0JTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlN0QlMkMlMjJ0cmVlc2hha2UlMjIlM0ElN0IlMjJtb2R1bGVTaWRlRWZmZWN0cyUyMiUzQWZhbHNlJTdEJTdEJTdE)

而且针对第二种，除了正常的副作用，打包工具还存在误判副作用的情况，误判主要因为速度和打包颗粒度之间的权衡，假如 `math.js` 的代码如下。

```js
// src/math.js

export function square (x) {
  return x * x;
}

function getMessage (callback) {
  return callback();
}

export const hi = getMessage(() => "Hi");
export const hello = getMessage(() => "Hello");
```

打包之后输出：

```js
// src/math.js


function getMessage (callback) {
  return callback();
}

getMessage(() => "Hi");

// main.js

console.log("main");
```

getMessage 本来不是副作用，但是因为调用过于灵活，不知道暴露给用户的 callback 中会写什么，打包工具直接判断为副作用，代码保留。

[点击查看编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwc3F1YXJlJTIwJTdEJTIwZnJvbSUyMCcuJTJGbWF0aHMuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyglNUMlMjJtYWluJTVDJTIyKSUzQiUyMiUyQyUyMmlzRW50cnklMjIlM0F0cnVlJTJDJTIybmFtZSUyMiUzQSUyMm1haW4uanMlMjIlN0QlMkMlN0IlMjJjb2RlJTIyJTNBJTIyJTJGJTJGJTIwc3JjJTJGbWF0aC5qcyU1Q24lNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBzcXVhcmUlMjAoeCklMjAlN0IlNUNuJTIwJTIwcmV0dXJuJTIweCUyMColMjB4JTNCJTVDbiU3RCU1Q24lNUNuZnVuY3Rpb24lMjBnZXRNZXNzYWdlJTIwKGNhbGxiYWNrKSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjBjYWxsYmFjaygpJTNCJTVDbiU3RCU1Q24lNUNuZXhwb3J0JTIwY29uc3QlMjBoaSUyMCUzRCUyMGdldE1lc3NhZ2UoKCklMjAlM0QlM0UlMjAlNUMlMjJIaSU1QyUyMiklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlMkMlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyb3V0cHV0JTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlN0QlMkMlMjJ0cmVlc2hha2UlMjIlM0F0cnVlJTdEJTdE)

这种情况下 sideEffects 就很有用了，当你确定代码中没有副作用，无脑在项目的 `package.json` 中添加 `"sideEffects": false`。

```js
// main.js

console.log("main");
```

[误判副作用被删除的编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwc3F1YXJlJTIwJTdEJTIwZnJvbSUyMCcuJTJGbWF0aHMuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyglNUMlMjJtYWluJTVDJTIyKSUzQiUyMiUyQyUyMmlzRW50cnklMjIlM0F0cnVlJTJDJTIybmFtZSUyMiUzQSUyMm1haW4uanMlMjIlN0QlMkMlN0IlMjJjb2RlJTIyJTNBJTIyJTJGJTJGJTIwc3JjJTJGbWF0aC5qcyU1Q24lNUNuZXhwb3J0JTIwZnVuY3Rpb24lMjBzcXVhcmUlMjAoeCklMjAlN0IlNUNuJTIwJTIwcmV0dXJuJTIweCUyMColMjB4JTNCJTVDbiU3RCU1Q24lNUNuZnVuY3Rpb24lMjBnZXRNZXNzYWdlJTIwKGNhbGxiYWNrKSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjBjYWxsYmFjaygpJTNCJTVDbiU3RCU1Q24lNUNuZXhwb3J0JTIwY29uc3QlMjBoaSUyMCUzRCUyMGdldE1lc3NhZ2UoKCklMjAlM0QlM0UlMjAlNUMlMjJIaSU1QyUyMiklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlMkMlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyb3V0cHV0JTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlN0QlMkMlMjJ0cmVlc2hha2UlMjIlM0ElN0IlMjJtb2R1bGVTaWRlRWZmZWN0cyUyMiUzQWZhbHNlJTdEJTdEJTdE)

## `#__PURE__`

`src/math.js` 的代码保持不变：

```js
// src/math.js

export function square (x) {
  return x * x;
}

function getMessage (callback) {
  return callback();
}

export const hi = getMessage(() => "Hi");
```

修改 `src/main.js` 为：

```js
// main.js
import { square } from './maths.js';

console.log(square(5));
```

在开启 Tree Shaking 和 sideEffects 的情况下，代码被编译为：

```js
// src/math.js

function square (x) {
  return x * x;
}

function getMessage (callback) {
  return callback();
}

getMessage(() => "Hi");

// main.js

console.log(square(5));

```

[编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwc3F1YXJlJTIwJTdEJTIwZnJvbSUyMCcuJTJGbWF0aHMuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyhzcXVhcmUoNSkpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlMkMlMjJuYW1lJTIyJTNBJTIybWFpbi5qcyUyMiU3RCUyQyU3QiUyMmNvZGUlMjIlM0ElMjIlMkYlMkYlMjBzcmMlMkZtYXRoLmpzJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMHNxdWFyZSUyMCh4KSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q25mdW5jdGlvbiUyMGdldE1lc3NhZ2UlMjAoY2FsbGJhY2spJTIwJTdCJTVDbiUyMCUyMHJldHVybiUyMGNhbGxiYWNrKCklM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBjb25zdCUyMGhpJTIwJTNEJTIwZ2V0TWVzc2FnZSgoKSUyMCUzRCUzRSUyMCU1QyUyMkhpJTVDJTIyKSUzQiUyMiUyQyUyMmlzRW50cnklMjIlM0FmYWxzZSUyQyUyMm5hbWUlMjIlM0ElMjJtYXRocy5qcyUyMiU3RCU1RCUyQyUyMm9wdGlvbnMlMjIlM0ElN0IlMjJvdXRwdXQlMjIlM0ElN0IlMjJmb3JtYXQlMjIlM0ElMjJlcyUyMiU3RCUyQyUyMnRyZWVzaGFrZSUyMiUzQSU3QiUyMm1vZHVsZVNpZGVFZmZlY3RzJTIyJTNBZmFsc2UlN0QlN0QlN0Q=)

观察上面的代码我们发现 `getMessage(() => "Hi")` 被保留了下来。因为 getMessage 被直接调用，不符合 Tree Shaking 的规则，且 square 函数被外部引入调用不符合 sideEffects。

问题来了，Tree Shaking 和 sideEffects 的都失效的情况下，我们怎么清除这段无用的代码？

答案是注释的形式使用 `#__PURE__`（或者 `@__PURE__` 两个等效） 插入到 __函数调用时__ 的前面：

```js
export const hi = /* #__PURE__ */ getMessage(() => "Hi");
```

神奇的事情发生了，无用的代码被安全的删除了：

```js
// src/math.js

function square (x) {
  return x * x;
}

// main.js

console.log(square(5));
```

点击眼见为实 [无用的代码被删除](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwc3F1YXJlJTIwJTdEJTIwZnJvbSUyMCcuJTJGbWF0aHMuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyhzcXVhcmUoNSkpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlMkMlMjJuYW1lJTIyJTNBJTIybWFpbi5qcyUyMiU3RCUyQyU3QiUyMmNvZGUlMjIlM0ElMjIlMkYlMkYlMjBzcmMlMkZtYXRoLmpzJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMHNxdWFyZSUyMCh4KSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q25mdW5jdGlvbiUyMGdldE1lc3NhZ2UlMjAoY2FsbGJhY2spJTIwJTdCJTVDbiUyMCUyMHJldHVybiUyMGNhbGxiYWNrKCklM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBjb25zdCUyMGhpJTIwJTNEJTIwJTJGKiUyMCUyM19fUFVSRV9fJTIwKiUyRiUyMGdldE1lc3NhZ2UoKCklMjAlM0QlM0UlMjAlNUMlMjJIaSU1QyUyMiklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlMkMlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyb3V0cHV0JTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlN0QlMkMlMjJ0cmVlc2hha2UlMjIlM0ElN0IlMjJtb2R1bGVTaWRlRWZmZWN0cyUyMiUzQWZhbHNlJTdEJTdEJTdE)

这种方法好用，但是有一个缺点，大型项目中某个方法或者类可能高频使用，调用如果是多处，很容易就会忘记在调用的前面添加 `#__PURE__`，而且因为高频书写还可能出错，这些都导致 getMessage 不能正确被清除，比如 hi 有注释，hello 没有注释：

```js
export const hi = /* #__PURE__ */ getMessage(() => "Hi");
export const hello = getMessage(() => "Hello");
```

编译之后 getMessage 被保留了：

```js
// src/math.js

function square (x) {
  return x * x;
}

function getMessage (callback) {
  return callback();
}
getMessage(() => "Hello");

// main.js

console.log(square(5));

```

[编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwc3F1YXJlJTIwJTdEJTIwZnJvbSUyMCcuJTJGbWF0aHMuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyhzcXVhcmUoNSkpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlMkMlMjJuYW1lJTIyJTNBJTIybWFpbi5qcyUyMiU3RCUyQyU3QiUyMmNvZGUlMjIlM0ElMjIlMkYlMkYlMjBzcmMlMkZtYXRoLmpzJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMHNxdWFyZSUyMCh4KSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q25mdW5jdGlvbiUyMGdldE1lc3NhZ2UlMjAoY2FsbGJhY2spJTIwJTdCJTVDbiUyMCUyMHJldHVybiUyMGNhbGxiYWNrKCklM0IlNUNuJTdEJTVDbiU1Q25leHBvcnQlMjBjb25zdCUyMGhpJTIwJTNEJTIwJTJGKiUyMCUyM19fUFVSRV9fJTIwKiUyRiUyMGdldE1lc3NhZ2UoKCklMjAlM0QlM0UlMjAlNUMlMjJIaSU1QyUyMiklM0IlNUNuZXhwb3J0JTIwY29uc3QlMjBoZWxsbyUyMCUzRCUyMGdldE1lc3NhZ2UoKCklMjAlM0QlM0UlMjAlNUMlMjJIZWxsbyU1QyUyMiklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlMkMlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyb3V0cHV0JTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlN0QlMkMlMjJ0cmVlc2hha2UlMjIlM0ElN0IlMjJtb2R1bGVTaWRlRWZmZWN0cyUyMiUzQWZhbHNlJTdEJTdEJTdE)

现在急需一种类似 `#__PURE__` 的方式，但是不作用在调用的时候，而是作用在类和方法的声明的时候，只需要聚焦一次，便可永久使用，减少维护的成本。

## `#__NO_SIDE_EFFECTS__`

> `#__NO_SIDE_EFFECTS__` 和 `@__NO_SIDE_EFFECTS__` 都是有效的。

给 getMessage 方法添加 `#__NO_SIDE_EFFECTS__` 注释，getMessage 调用的时候都不使用 `#__PURE__`：

```js
// src/math.js

export function square (x) {
  return x * x;
}

/* #__NO_SIDE_EFFECTS__ */
function getMessage (callback) {
  return callback();
}

export const hi = getMessage(() => "Hi");
export const hello = getMessage(() => "Hello");
```

最完美的编译结果：

```js
// src/math.js

function square (x) {
  return x * x;
}

// main.js

console.log(square(5));
```

[编译结果](https://rollupjs.org/repl/?version=4.9.5&shareable=JTdCJTIyZXhhbXBsZSUyMiUzQW51bGwlMkMlMjJtb2R1bGVzJTIyJTNBJTVCJTdCJTIyY29kZSUyMiUzQSUyMiUyRiUyRiUyMG1haW4uanMlNUNuaW1wb3J0JTIwJTdCJTIwc3F1YXJlJTIwJTdEJTIwZnJvbSUyMCcuJTJGbWF0aHMuanMnJTNCJTVDbiU1Q25jb25zb2xlLmxvZyhzcXVhcmUoNSkpJTNCJTIyJTJDJTIyaXNFbnRyeSUyMiUzQXRydWUlMkMlMjJuYW1lJTIyJTNBJTIybWFpbi5qcyUyMiU3RCUyQyU3QiUyMmNvZGUlMjIlM0ElMjIlMkYlMkYlMjBzcmMlMkZtYXRoLmpzJTVDbiU1Q25leHBvcnQlMjBmdW5jdGlvbiUyMHNxdWFyZSUyMCh4KSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjB4JTIwKiUyMHglM0IlNUNuJTdEJTVDbiU1Q24lMkYqJTIwJTIzX19OT19TSURFX0VGRkVDVFNfXyUyMColMkYlNUNuZnVuY3Rpb24lMjBnZXRNZXNzYWdlJTIwKGNhbGxiYWNrKSUyMCU3QiU1Q24lMjAlMjByZXR1cm4lMjBjYWxsYmFjaygpJTNCJTVDbiU3RCU1Q24lNUNuZXhwb3J0JTIwY29uc3QlMjBoaSUyMCUzRCUyMGdldE1lc3NhZ2UoKCklMjAlM0QlM0UlMjAlNUMlMjJIaSU1QyUyMiklM0IlNUNuZXhwb3J0JTIwY29uc3QlMjBoZWxsbyUyMCUzRCUyMGdldE1lc3NhZ2UoKCklMjAlM0QlM0UlMjAlNUMlMjJIZWxsbyU1QyUyMiklM0IlMjIlMkMlMjJpc0VudHJ5JTIyJTNBZmFsc2UlMkMlMjJuYW1lJTIyJTNBJTIybWF0aHMuanMlMjIlN0QlNUQlMkMlMjJvcHRpb25zJTIyJTNBJTdCJTIyb3V0cHV0JTIyJTNBJTdCJTIyZm9ybWF0JTIyJTNBJTIyZXMlMjIlN0QlMkMlMjJ0cmVlc2hha2UlMjIlM0ElN0IlMjJtb2R1bGVTaWRlRWZmZWN0cyUyMiUzQWZhbHNlJTdEJTdEJTdE)

## 参考链接

- [javascript-compiler-hints compiler-notations-spec](https://github.com/javascript-compiler-hints/compiler-notations-spec)
- [Add options and hooks to control module side effects](https://github.com/rollup/rollup/pull/2844)
- [Rollup configuration options pure](https://rollupjs.org/configuration-options/#pure)
- [Support marking a call as pure](https://github.com/mishoo/UglifyJS/pull/1448)
- [Make `/*#__PURE__*/` not only for call, but also for callable value?](https://github.com/rollup/rollup/issues/2960)
- [`__PURE__`](https://laysent.com/til/2019-12-24___pure__)
- [Pure annotation for functions](https://github.com/evanw/esbuild/issues/1883)
- [Support `#__NO_SIDE_EFFECTS__` annotation for function declaration](https://github.com/rollup/rollup/pull/5024)
- [Support `#__NO_SIDE_EFFECTS__` comment from Rollup](https://github.com/evanw/esbuild/issues/3149)
- [Perf: mark defineComponent as side-effects-free](https://github.com/vuejs/core/pull/8512)
- [Webpack4+ Tree shaking](https://github.com/willson-wang/Blog/issues/108)

> 上海 2024 年 01 月 18 日 19:20:24
