# HoloCardPreview · 镭射卡片工作室

**在线演示：[桌面版](https://jdb156158.github.io/HoloCardPreview/studio.html) · [iPhone 外壳版](https://jdb156158.github.io/HoloCardPreview/mobile.html)**

> GitHub Pages 首次启用后以上地址生效。若出现 404，请查看仓库 Actions 的 Pages 部署状态及下方发布步骤。

将自己的图片变成可旋转、可翻面、可切换镭射纹理的卡片。提供桌面工作室和 iPhone 外壳内的 App 风格布局，两端共用代码。也可以作为 Codex skill 安装，让 AI 帮你生成和修改同款预览器。

![默认 AI 生成示例卡面](skills/holo-card-preview/assets/web/assets/explorer-v2.png)

## 功能

- 本地选图：JPG、PNG、WebP、AVIF，最大 20 MB，支持铺满裁剪或完整显示。
- 24 款镭射风格，调节纹理大小、反光强度；有些连续光泽不需要纹理大小。
- 点击/轻点翻面，拖动旋转，鼠标移动感光，方向键旋转，回车/空格翻面。
- 编辑顶部系列、角标、标题上方小字、主标题和副标题；明确控制文案显示。
- iPhone 外壳、灵动岛外观、底部工具栏和设置弹层；图片/文案/材质/调节均可在手机界面完成。
- 无 npm、无构建、无框架、无 API key、无后台生成服务。

- 导出 PNG 静态图、GIF 循环动图、MP4/WebM 视频，桌面和手机共用导出模块。

这是**单图 CSS/SVG 镭射模拟**，不是 AI 抠图或真实全息显示。当前没有人物/背景分层视差和自动轮廓提取。手机外壳是网页模拟，不是原生 iOS App。

## 马上使用

1. 打开顶部任一在线演示。
2. 桌面版点击“选择文件”；手机版点击底部“图片”，在系统文件选择器里选图。
3. 在“卡面文案”中修改标题等内容；上传图片会保留文案，取消“显示顶层文案”才会隐藏。
4. 在材质库中选风格，移动或拖动卡片看光泽变化。可调整纹理大小及镭射强度。
5. 点击卡片或翻面按钮看背面，点击“回正”返回正面。
6. 手机版点击“完成”、点面板外遮罩或向下拖动顶部短条收起面板。

文件在浏览器内存中读取，不传到服务器。**刷新会清除选图及文案编辑**，也不会在两个页面间实时同步。恢复示例仅恢复默认图片，不覆盖文案。

## 导出卡片

1. 先选好图片、文案、材质、强度及纹理大小。
2. 桌面版滚动至“导出卡片”；手机版点击底部“导出”。
3. 选择 PNG、GIF 或视频，以及 480 × 672 / 720 × 1008 尺寸。
4. 点击“生成文件”，保持页面在前台；可随时取消。完成后预览并点击“保存”。

PNG 输出正面静态展示姿态；GIF 和视频输出预设的 4 秒柔和循环：光源沿椭圆移动，卡片轻微摆动和滑移。导出保留当前图片、文案开关、材质和强度，不包含操作界面、手机外壳或背面。背景为深色，不透明。生成不会改变当前卡片的角度或内容。

GIF 采用 60 帧（约 15 fps）和每帧最多 256 色；渐变可能有色阶，尺寸越大生成越慢、文件越大。视频优先 MP4，浏览器不支持时输出 WebM，文件扩展名与实际编码一致。视频没有音轨。视频录制画布为 30 fps，源动画为 15 fps。iPhone 上保存位置和预览方式由 Safari/系统决定，未完成全部真机兼容测试。

处理完全在本地浏览器中完成，不上传图片，也不请求录屏、摄像头或麦克风权限。通过 HTTP/HTTPS 打开，不能直接双击 HTML 使用 Worker 导出。进入后台会停止生成，以免保存掉帧视频。

### 导出实现与接口

`export.js` 复制正面 DOM 和当前样式，用本地打包的 `html-to-image@1.11.13` 将图片、文字和 CSS/SVG 光效合成为 Canvas；用户图片的 object URL 会先转换为 data URL。逐帧改变 `--mx`、`--my`、`--angle`，再用 Canvas 2D 仿射变换模拟轻微倾斜和滑移。这是设计好的展示轨迹，不是实际录下用户鼠标操作，也不是完整 CSS 3D 透视的逐像素复刻。

- PNG：`HTMLCanvasElement.toBlob()`。
- GIF：模块 Worker 中的 `gifenc@1.0.3`，调用 `quantize()`、`applyPalette()`、`GIFEncoder.writeFrame()` / `finish()`，主线程传输 RGBA ArrayBuffer，60 帧时长合计 4 秒，无限循环。选择它是为了直接在网页生成，无需安装 gifski/Rust。
- 视频：预渲染 PNG 帧，`createImageBitmap()` 解码，`canvas.captureStream()` + `MediaRecorder` 录制；`MediaRecorder.isTypeSupported()` 探测格式，目标码率 6 Mbps。

没有外部生成 API、付费接口或密钥。浏览器对 SVG foreignObject、CSS 混合和视频编码的实现不同，导出与现场效果可能略有差别；失败时尝试较小尺寸或另一个浏览器。

## 本地运行

需要 Git 和 Python 3（用于静态服务，不安装额外 Python 包）：

```bash
git clone https://github.com/Jdb156158/HoloCardPreview.git
cd HoloCardPreview
python3 -m http.server 4173 --bind 127.0.0.1 --directory skills/holo-card-preview/assets/web
```

打开：

- 桌面：`http://127.0.0.1:4173/studio.html`
- 手机外壳：`http://127.0.0.1:4173/mobile.html`
- 无外壳手机版：`http://127.0.0.1:4173/studio.html?phone=1`

终端需保持运行，Ctrl+C 停止服务。出现“拒绝连接”通常是静态服务已停止；端口占用可以把 4173 换成其他空闲端口。`127.0.0.1` 仅指当前设备，手机不能用这个地址访问电脑上的服务；跨设备请使用部署后的 HTTPS 演示链接。

## 作为 skill 安装

### Codex 自动安装

向具备 skill-installer 的 Codex 发送：

```text
请安装 https://github.com/Jdb156158/HoloCardPreview/tree/main/skills/holo-card-preview 这个 skill。
```

### 手动安装

先克隆仓库，将整个 `skills/holo-card-preview` 文件夹复制到 Codex 的 skills 目录：默认 `~/.codex/skills/`；若设置了 `CODEX_HOME`，使用该目录下的 `skills/`。目标应包含 `holo-card-preview/SKILL.md`、`assets`、`scripts` 和 `references`，不能只复制 SKILL.md。已有同名技能时请先检查内容，不要直接覆盖。

启动新的对话，让技能被发现。示例：

```text
使用 $holo-card-preview，在一个新目录生成双布局镭射卡片 demo，启动本地预览并给我两个入口。
```

```text
使用 $holo-card-preview，给现有预览器新增一种纹理；桌面和 iPhone 布局都要能使用。
```

其他支持 SKILL.md 的工具可以按其技能目录规范安装整个文件夹；自动发现方式以对应工具为准，不保证所有 Agent 产品直接兼容。

### 不使用 AI，直接生成副本

```bash
python3 skills/holo-card-preview/scripts/create_preview.py --output ./preview-output
python3 -m http.server 4173 --bind 127.0.0.1 --directory ./preview-output
```

输出目录必须不存在，脚本会拒绝覆盖。副本不依赖 skill 的原始位置，可以自行修改或部署。

## 24 款风格

| 分类 | 款式 |
| --- | --- |
| 几何压纹 | 方格镭射、菱钻折射、圆点泡泡、蜂巢六角、人鱼鳞片、三角切面、立方浮雕、编织闪纹 |
| 光学纹路 | 彩虹流光、同心光环、水波镭射、人字折线、棱镜条带、放射光芒 |
| 闪点图案 | 星砂碎闪、十字星芒、满天星、爱心闪膜、彩纸碎箔、冰裂碎晶 |
| 金属珠光 | 极光拉丝、香槟金箔、铂银镜面、贝母珠光 |

这些名称描述模拟效果，不代表真实印刷工艺的精确复现，也不声称涵盖所有镭射风格。

## 实现原理

### 卡片与光照

卡片由一个图片平面叠加彩虹光带、重复纹理、径向高光、边框及文字。CSS `perspective` 和 `rotateX/rotateY` 负责平面透视；指针的归一化位置驱动 `--mx`、`--my`、`--angle`，改变渐变位置与方向。`--strength` 控制反光层透明度。

CSS 的 `color-dodge`、`screen`、`soft-light` 混合模式制造亮色反射；径向 mask 控制纹理在光源附近的显现程度。大部分新增纹理由内嵌 SVG 小块平铺，`--grain` 控制其重复大小。无需下载纹理包或调用图像 API。

正反面为两个独立元素，背面预旋转 180°，隐藏背向的面。JS 区分轻点和超过 5 px 的拖动；requestAnimationFrame 将当前角度逐帧逼近目标角度。手机沿用 Pointer Events，不另写一套旋转逻辑。

### 上传与文字

上传使用 File API、`URL.createObjectURL()` 和 `Image.decode()`，不执行网络上传。旧 object URL 在替换后释放，版本号防止异步解码的旧结果覆盖新选择。文字字段用 `textContent` 更新，不执行用户输入的 HTML。

### 双布局为什么能一起维护

`mobile.html` 的手机外壳内嵌 `studio.html?phone=1`。参数触发 `phone.js` 将原来的控件移动进底部 dialog，监听器随 DOM 保留。因此两端共用材质注册表、上传处理、文字编辑和交互逻辑。`phone.css` 只改变手机布局和控件外观。

更详细的公式、事件流程、扩展入口和测试边界见 [实现原理与维护指南](skills/holo-card-preview/references/architecture.md)。

## 文件结构

```text
skills/holo-card-preview/
  SKILL.md                       技能入口
  scripts/create_preview.py      生成独立预览副本
  references/architecture.md     详细实现与扩展说明
  assets/web/
    index.html                   默认跳转桌面版
    studio.html / studio.js      共享页面与业务逻辑
    studio.css                   基础布局与卡片样式
    dark-theme.css / dark-fix.css 暗黑主题覆盖层
    foil-styles.css              材质控件与基础纹理
    foil-library.css             扩展纹理与分组样式
    mobile.html                  iPhone 外壳
    phone.js / phone.css         手机布局适配
    phone-overrides.css          手机弹层高度及导出按钮布局
    export.js / export.css       共享导出面板和逐帧渲染
    gif-worker.js                GIF 量化与编码线程
    vendor/                      固定版本浏览器依赖与许可证
    assets/explorer-v2.png        AI 生成的默认插画
.github/workflows/pages.yml      Pages 自动发布
```

## GitHub Pages 发布

本仓库提供 GitHub Actions 工作流，将 `skills/holo-card-preview/assets/web` 直接发布为静态站点。

1. 在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。
2. 推送到 main 或在 Actions 手动运行 “Deploy demo to GitHub Pages”。
3. 等待部署成功，再访问顶部演示链接。

Fork 后 Pages 地址应替换为 `https://你的用户名.github.io/你的仓库名/`。需要仓库允许 Actions 和 Pages；部署不自动扩大私有仓库或私人图片的授权范围。

## 贡献与后续开发

请在共享实现里新增功能，不复制桌面/手机两套业务代码。新增设置要安排进 `phone.js` 的 `panelMap`，并验证两种入口。至少测试选图、文案保留、材质切换、0/最大强度、翻面和手机面板收起。

欢迎通过 Issue 报告浏览器型号、复现步骤和截图。当前验证主要来自桌面浏览器及固定尺寸 iframe，未宣称完成所有 iPhone 真机测试；手机文件选择器、键盘和触摸行为仍应在真实设备单独验证。

## 开源与致谢

代码以 [MIT](LICENSE) 发布，相关来源和素材边界见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。项目由 Jdb156158 借助 Codex 迭代完成，初始探索参考 [LerSent001/holo-card](https://github.com/LerSent001/holo-card)。默认示例插画为 AI 生成；上传自己的图片时请遵守其原有授权。
