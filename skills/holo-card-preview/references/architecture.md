# 实现原理与维护指南

## 目录与两端复用

`assets/web` 是唯一网页源码。`studio.html` 定义卡面和基本控制；`studio.js` 注入上传面板、文案字段、材质库并绑定交互。`mobile.html` 只定义外壳：414×868 外框内嵌 390×844 iframe，加载 `studio.html?phone=1`。

查询参数触发 `phone.js`，它将原有 `.settings` 控件移入原生 `<dialog>`，通过 `panelMap` 分为图片、文案、材质和调节。监听器随 DOM 节点移动保留，因此业务行为无需复制。`phone.css` 用 `body.phone` 限定覆盖，桌面页面保持原布局。这里的“同步”是功能代码同步，不是两个页面的数据同步。

## 逐层合成

前面由 `.front img`、`.foil`、`.foil-texture`、`.glare`、`.rim`、`.top` 和 `.caption` 组成。图片可以居中裁剪或 `contain` 留白完整显示。色谱层生成彩虹反射；纹理层生成局部重复图案；glare 模拟高光。caption 使用底部渐变衬底和较高层级，用户文案不被纹理覆盖。背面是独立 `.back`，旋转 180°，两面使用 `backface-visibility:hidden`。

这不是几何建模：人物和背景都位于同一张图上，旋转的是整个卡片平面。`perspective` 与 `rotateX/rotateY` 产生透视，但没有分层视差或自动景深。

## 光照与纹理

指针相对卡片矩形归一化为 `u,v∈[0,1]`，驱动 CSS 自定义属性 `--mx`、`--my` 和 `--angle`。渐变位置改变光带；径向 mask 限定纹理显现强度。主要使用 `color-dodge`、`screen` 和 `soft-light` 混合模式，它们是视觉近似，不是物理光谱衍射模型。

`--strength` 为 0–1，控制 foil、纹理和 glare 的透明度。0 会关闭反光叠层，但不隐藏图片、文案和装饰边框。`--grain` 控制重复单元大小，当前滑杆为 10–48 px。彩虹和贝母没有重复单元，因此禁用纹理大小控件。

早期五款由 CSS 渐变生成；后续大部分由 `tileUrl()` 将 48×48 SVG 单元编码为 data URL，再按 `--grain` 平铺。图案固定在卡面坐标上，移动的是光照包络；避免把纹理本身滑动得像水印。`extraFinishes` 元组为 `[id, 名称, 描述, 分组, SVG片段]`。空片段表示在 `foil-library.css` 中单独绘制（如放射、贝母）。`finishes`、`groupFor()` 共同生成分组选择器。

新增材质时：使用唯一 id，提供可区别的图案、介绍及分组；必要时补 CSS 特例和缩略图。确认桌面和手机选择器都出现、纹理尺寸变化正确、强度 0 不残留高光。不要只改名称复制同一种效果。

## 上传与文案

文件输入限制 JPEG、PNG、WebP、AVIF，文件最大 20 MB；实际显示前用 `Image.decode()` 校验。`URL.createObjectURL()` 提供内存资源地址，成功替换后释放旧 URL。递增的 `uploadVersion` 防止慢速解码覆盖后续选图或恢复操作。错误不会替换当前卡面。

没有图片上传请求。网页和默认素材通过 HTTP GET 获取；用户文件只在浏览器内读取。刷新、关闭页面后选图和编辑值消失，目前没有 localStorage、IndexedDB、后端、分析脚本或跨标签广播。

`copyFields` 定义顶部系列、右上角标、小字、主标题、副标题。使用 `textContent` 写入，输入不能作为 HTML 执行。`hide-copy` 只由明确的文案开关控制，选图不应改变该开关。导入图片与恢复示例均不重置用户文案。

## 指针、键盘与手机面板

Pointer Events 统一处理鼠标和触摸。拖动起点到当前位置超过 5 px 后认定为拖动；未超过阈值的释放触发翻面。pointer capture 保持跨边界拖动连续，cancel/lost capture 清理拖动状态。方向键调整角度，Enter/空格翻面。

目标角度由 requestAnimationFrame 插值：`current += (target-current)*0.12`，使释放和旋转柔和。减少动态效果偏好下直接到达目标。手机的文件选择仍由浏览器/系统接管，外壳不会模拟相册；没有传感器权限请求、原生触感或系统分享接口。

底部设置使用原生 dialog，包含焦点管理与 Escape 关闭。点完成、点遮罩或在拖动条向下移动超过 65 px 可收起；可滚动区独立滚动。弹层绘制在 iframe 内，所以不会溢出外壳。外框缩放只影响显示尺寸，不改变内部逻辑布局。图片、文案、材质和调节共用紧凑弹层高度，超出内容在弹层内滚动；导出因包含预览而保留较高弹层。背景遮罩不使用 backdrop-filter，打开设置时仍能观察卡片光效。导出成功后，重新生成与保存按钮位于同一工具栏左右两端。

## 验证与局限

至少检查：两种入口、上传成功/错误、文案保留和开关、长标题、材质切换、0/最大强度、细/粗纹理、正反面、拖动/点击区分、手机面板收起。若新增设置，必须安排手机 `panelMap` 的位置；不要只给桌面加控件。

当前属于浏览器 demo：未实现 AI 分层、自动背景补全、状态持久化、相机、设备姿态或原生 iOS App。CSS 混合结果可能随浏览器不同；WebKit 真机兼容性需单独测试。窗口过小时，外壳缩放会令按钮实际显示较小，可直接用 `studio.html?phone=1` 测试无外壳页面。

## 导出维护

`studio.js` 加载 `export.js` 后再加载 `phone.js`，确保手机 `panelMap.export` 指向同一个导出面板。`export.css` 提供五列手机导航覆盖。新增格式只改共享模块，不另写手机编码器。

导出复制当前卡片，图片转换为 data URL，保留原卡片选择器匹配及文案开关。捕获 `.front` 而非 3D 容器：3D/offscreen DOM 直接传给 SVG foreignObject 可能产生空白。`html-to-image` 展平卡面，Canvas 2D 再应用轻微仿射摆动与滑移；不要称作精确透视录屏。PNG 使用固定展示光位，GIF/视频使用正弦轨迹：光源 x=50+34sin(t)、y=50+28cos(t)，光带角=125+35sin(t)。60 帧覆盖一个 4 秒周期。

GIF Worker 逐帧量化为最多 256 色并编码，传输 RGBA buffer；帧时长以 10ms 为单位交错分配，总计 4000ms。视频先准备全部 PNG 帧并解码，再由 captureStream(30) 和 MediaRecorder 实时记录约 4 秒；源帧率为 15fps。用 isTypeSupported 探测 MP4/WebM，保存扩展名与 Blob 类型一致。所有依赖在 vendor 中，不需要外网 CDN。

保持页面前台，后台或取消时停止生成；finally 清理复制 DOM、Worker、录制轨道和 ImageBitmap。替换预览或离页时释放结果 URL。仅点击保存链接才下载，不上传卡面。导出固定深色背景，不包含背面、外壳或 UI。大尺寸会增加内存和耗时，低内存设备优先 480px。完整流程与接口说明见仓库 README“导出卡片”。
