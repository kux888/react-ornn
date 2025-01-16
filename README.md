# react-ornn

![react-ornn logo](./Ornn.png)

**react-ornn** 是一个轻量且灵活的 React 工具库，用于轻松管理动态 UI 组件，如模态框、对话框、通知和覆盖层。通过利用 React 的 Context API 和自定义钩子，react-ornn 提供了一种简化的方法来控制多个 UI 组件的可见性和状态，采用堆栈式管理，提升了 React 应用的可维护性和可扩展性。

## 目录

- [特点](#特点)
- [安装](#安装)
- [快速开始](#快速开始)
  - [设置 ORNNAdaptor](#设置-ornnadaptor)
  - [定义视图](#定义视图)
  - [使用 `useORNN` 钩子](#使用-useornn-钩子)
- [API 参考](#api-参考)
  - [ORNNAdaptor](#ornnadaptor)
  - [`useORNN` 钩子](#useornn-钩子)
- [示例](#示例)
- [贡献](#贡献)
- [许可证](#许可证)

## 特点

- **堆栈管理**：以受控堆栈方式管理多个 UI 组件。
- **易于使用**：简洁的 API，用于显示、隐藏和更新 UI 组件。
- **灵活性强**：支持动态属性更新和多种视图配置。
- **可定制性高**：易于扩展，以适应各种 UI 模式，如模态框、工具提示等。

## 安装

你可以使用 npm 或 yarn 安装 `react-ornn`：

```bash
# 使用 npm
npm install react-ornn

# 使用 yarn
yarn add react-ornn
```

## 快速开始

按照以下步骤将 `react-ornn` 集成到你的 React 应用中：

### 设置 ORNNAdaptor

使用 `ORNNAdaptor` 组件包裹你的应用（或应用的一部分）。该组件提供了管理 UI 组件所需的上下文。

```jsx
// App.js
import React from "react";
import ORNNAdaptor from "react-ornn";
import MyComponent from "./MyComponent";
import MyModal from "./MyModal";
import MyTooltip from "./MyTooltip";

const views = {
  modal: MyModal,
  tooltip: MyTooltip,
};

const App = () => {
  return (
    <ORNNAdaptor views={views}>
      <MyComponent />
    </ORNNAdaptor>
  );
};

export default App;
```

### 定义视图

定义你希望使用 `react-ornn` 管理的 UI 组件（视图）。每个视图应接受 `token` 属性以及你可能需要的任何额外属性。

```jsx
// MyModal.js
import React from "react";

const MyModal = ({ token, visible, promiseHandler, /* 其他属性 */ }) => {
  if (!visible) return null;

  const handleConfirm = () => {
    // 执行确认操作
    promiseHandler.resolve("已确认");
  };

  const handleCancel = () => {
    // 执行取消操作
    promiseHandler.reject("已取消");
  };

  return (
    <div className="modal">
      <h2>我的模态框</h2>
      {/* 模态框内容 */}
      <button onClick={handleConfirm}>确认</button>
      <button onClick={handleCancel}>取消</button>
    </div>
  );
};

export default MyModal;
```

### 使用 `useORNN` 钩子

在你的组件中使用 `useORNN` 钩子来控制定义的视图的可见性和状态。

```jsx
// MyComponent.js
import React from "react";
import useORNN from "react-ornn";

const MyComponent = () => {
  const showModal = useORNN("modal");

  const handleOpenModal = async () => {
    try {
      const result = await showModal({ /* 传递给 MyModal 的任何属性 */ });
      console.log("模态框确认，结果:", result);
    } catch (error) {
      console.error("模态框取消，错误:", error);
    }
  };

  return (
    <div>
      <h1>欢迎使用我的应用</h1>
      <button onClick={handleOpenModal}>打开模态框</button>
    </div>
  );
};

export default MyComponent;
```

## API 参考

### ORNNAdaptor

`ORNNAdaptor` 组件为管理 UI 组件提供上下文。

#### 属性

| 属性       | 类型                                                                                     | 描述                                             |
| ---------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `views`    | `Object`                                                                                 | 一个将视图标识符映射到 React 组件的对象。         |
| `children` | `React.Node`                                                                             | 可以使用上下文的子组件。                          |

#### 示例

```jsx
import React from "react";
import ORNNAdaptor from "react-ornn";
import MyComponent from "./MyComponent";
import MyModal from "./MyModal";

const views = {
  modal: MyModal,
};

const App = () => (
  <ORNNAdaptor views={views}>
    <MyComponent />
  </ORNNAdaptor>
);

export default App;
```

### `useORNN` 钩子

`useORNN` 钩子允许组件与 `ORNNAdaptor` 上下文交互，以显示 UI 组件。

#### 用法

```javascript
const show = useORNN(id, deps);
```

#### 参数

| 参数  | 类型               | 描述                                          |
| ----- | ------------------ | --------------------------------------------- |
| `id`  | `string`           | 要显示的视图的标识符。                        |
| `deps`| `Object` (可选)    | 要传递给视图的依赖项或属性。                  |

#### 返回值

- 一个函数，调用时返回一个 `Promise`。当视图调用 `resolve` 时，`Promise` 会被解决；调用 `reject` 时，`Promise` 会被拒绝。

#### 示例

```jsx
import React from "react";
import useORNN from "react-ornn";

const MyComponent = () => {
  const showModal = useORNN("modal");

  const handleOpenModal = async () => {
    try {
      const result = await showModal({ /* 传递给 MyModal 的属性 */ });
      // 处理确认结果
    } catch (error) {
      // 处理取消操作
    }
  };

  return (
    <button onClick={handleOpenModal}>打开模态框</button>
  );
};

export default MyComponent;
```

## 许可证

本项目基于 [MIT 许可证](LICENSE) 许可。


结合《英雄联盟》中英雄奥恩（Ornn）的被动技能“锻造大师”（Forger of Legends），该技能能够为队友提供无需返回基地的高级装备，从而提升团队整体作战能力。下面将分析 `react-ornn` 代码库的作用，并将其与奥恩的被动技能进行类比，以更好地理解其在开发过程中的价值。

## 奥恩的被动技能“锻造大师”简介

奥恩的被动技能允许他在战斗中为自己和附近的队友升级装备，这些升级后的装备拥有更强的属性，并且在一定时间内无需回到基地回复生命值和蓝量。这一技能极大地增强了团队在战斗中的持续作战能力和灵活性，使得团队在激烈的对抗中能够保持优势。

## `react-ornn` 代码库的作用

`react-ornn` 是一个用于管理动态 UI 组件（如模态框、对话框、通知等）的 React 工具库。通过提供简洁的 API 和灵活的上下文管理，`react-ornn` 使得开发者能够高效地控制多个 UI 组件的可见性和状态，从而提升应用的可维护性和用户体验。

### 主要功能包括：

1. **堆栈管理**：以受控堆栈方式管理多个 UI 组件，确保界面元素有序呈现。
2. **简洁的 API**：提供简单易用的接口，用于显示、隐藏和更新 UI 组件。
3. **灵活性强**：支持动态属性更新和多种视图配置，适应不同的 UI 需求。
4. **可定制性高**：易于扩展，能够适应各种 UI 模式，如模态框、工具提示等。

## 类比分析

将 `react-ornn` 与奥恩的被动技能“锻造大师”进行类比，可以更直观地理解 `react-ornn` 在开发过程中的作用和价值。

### 提升团队效率与装备升级

- **奥恩的被动技能**：通过为队友升级装备，提高团队的整体战斗力，使团队在战斗中更具优势，不需要频繁返回基地回复状态。
  
- **`react-ornn` 的作用**：通过提供高效的 UI 组件管理工具，提升开发团队的开发效率和应用的用户体验。开发者无需为每个 UI 组件单独管理状态和可见性，从而减少重复劳动，专注于核心功能的开发。

### 持续作战能力与代码可维护性

- **奥恩的被动技能**：允许团队在战斗中持续作战，减少中断，提高作战效率。
  
- **`react-ornn` 的优势**：通过集中管理 UI 组件的状态和行为，提升代码的可维护性和可扩展性。项目在长期发展中能够保持高效运转，减少因 UI 管理混乱导致的代码复杂度和潜在错误。

### 灵活应对多变的战局与多样化的 UI 需求

- **奥恩的被动技能**：能够根据战场情况灵活升级不同的装备，适应多变的战局需求。
  
- **`react-ornn` 的灵活性**：支持动态属性更新和多种视图配置，能够适应不同的 UI 需求和设计变化。开发者可以根据应用的实际需求，灵活调整和扩展 UI 组件的功能和表现。

## 具体代码功能类比

### ORNNAdaptor 组件

- **类比**：奥恩作为团队的核心，负责为队友升级装备。
- **作用**：`ORNNAdaptor` 组件作为整个 UI 管理的核心，提供上下文环境，使得子组件能够方便地调用和管理 UI 组件的显示与隐藏。

### useORNN 钩子

- **类比**：队友通过奥恩获得升级后的装备，提升个人能力。
- **作用**：`useORNN` 钩子为各个组件提供简便的方法来显示特定的 UI 组件（如模态框、通知等），类似于队友通过奥恩获得装备后，能够更高效地完成任务。

### 动态属性与堆栈管理

- **类比**：奥恩能够根据战局动态调整装备类型，适应不同的战斗需求。
- **作用**：`react-ornn` 支持动态属性更新和堆栈式管理，确保 UI 组件能够根据不同的场景和需求，灵活地显示和隐藏，保证应用界面的整洁和功能的一致性。

## 总结

通过类比奥恩的被动技能“锻造大师”，我们可以更清晰地理解 `react-ornn` 在开发过程中的作用。`react-ornn` 如同奥恩为团队提供的高级装备，不仅提升了开发团队的工作效率和代码质量，还增强了应用的用户体验和可维护性。正如奥恩的技能让团队在战斗中占据优势，`react-ornn` 也为开发者在构建复杂的 UI 界面时提供了强有力的支持，确保项目能够高效、稳定地发展。