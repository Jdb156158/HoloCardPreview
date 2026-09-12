const card=document.querySelector('#card'),slider=document.querySelector('#foil');
const foilStylesheet=document.createElement('link');foilStylesheet.rel='stylesheet';foilStylesheet.href='foil-styles.css';document.head.append(foilStylesheet);
const libraryStylesheet=document.createElement('link');libraryStylesheet.rel='stylesheet';libraryStylesheet.href='foil-library.css';document.head.append(libraryStylesheet);
const finishes=[['grid','方格镭射','交错方格随光线明暗变化，像压纹闪卡。'],['rainbow','彩虹流光','连续的彩虹光带，柔和流动。'],['diamond','菱钻折射','斜向菱形切面，呈现钻石纹理。'],['sparkle','星砂碎闪','细密闪点随光线亮起。'],['silk','极光拉丝','细条纹金属质感，带冷暖变色。']];
const extraFinishes=[
 ['dots','圆点泡泡','圆形亮斑组成的规则点阵。','几何压纹','<circle cx="24" cy="24" r="14" fill="url(#light)"/><circle cx="24" cy="24" r="16"/>'],
 ['honeycomb','蜂巢六角','连续六边形网格，类似蜂巢压纹。','几何压纹','<path d="M12 0H36L48 24 36 48H12L0 24Z"/><path d="M14 4H34L43 24 34 44H14L5 24Z" opacity=".3"/>'],
 ['scales','人鱼鳞片','层叠的扇形鳞片，带珍珠色边缘。','几何压纹','<path d="M-24 0A24 24 0 0 0 24 0A24 24 0 0 0 72 0M0 24A24 24 0 0 0 48 24M-24 48A24 24 0 0 0 24 48A24 24 0 0 0 72 48"/><path d="M0 0A24 24 0 0 1 24 24A24 24 0 0 1 48 0" opacity=".25"/>'],
 ['triangles','三角切面','不同亮度的三角平面交替反光。','几何压纹','<path d="M0 0H48L24 24Z" fill="url(#light)"/><path d="M0 48H48L24 24Z" fill="url(#light)" opacity=".45"/><path d="M0 0L48 48M48 0L0 48"/>'],
 ['cubes','立方浮雕','等轴立方体形成有起伏感的几何图案。','几何压纹','<path d="M24 0L46 12 24 24 2 12Z" fill="url(#light)"/><path d="M2 12L24 24V48L2 36Z" fill="url(#light)" opacity=".35"/><path d="M24 24L46 12V36L24 48Z" fill="url(#light)" opacity=".65"/>'],
 ['weave','编织闪纹','横纵交错的条块，模拟编织压纹。','几何压纹','<path d="M2 2H22V22H2ZM26 26H46V46H26Z" fill="url(#light)"/><path d="M26 4H46M26 10H46M26 16H46M4 26V46M10 26V46M16 26V46"/>'],
 ['rings','同心光环','成组的同心圆像细小唱片沟槽。','光学纹路','<circle cx="24" cy="24" r="5"/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="23"/>'],
 ['waves','水波镭射','平行的弧线组成柔和起伏的波纹。','光学纹路','<path d="M0 6Q12 -4 24 6T48 6M0 18Q12 8 24 18T48 18M0 30Q12 20 24 30T48 30M0 42Q12 32 24 42T48 42"/>'],
 ['chevron','人字折线','连续折线像折叠金属箔。','光学纹路','<path d="M0 0L24 12 48 0M0 12L24 24 48 12M0 24L24 36 48 24M0 36L24 48 48 36" stroke-width="3"/>'],
 ['prism','棱镜条带','宽窄交替的色带，模拟光谱分色。','光学纹路','<path d="M3 0V48M15 0V48M32 0V48" stroke-width="5"/><path d="M23 0V48M43 0V48"/>'],
 ['sunburst','放射光芒','从光源位置向外扩散的放射光束。','光学纹路',''],
 ['cross','十字星芒','四角星点亮，形成闪卡常见的星芒纹。','闪点图案','<path d="M24 4L28 20 44 24 28 28 24 44 20 28 4 24 20 20Z" fill="url(#light)"/>'],
 ['stars','满天星','大小错落的五角星，形成星空闪膜。','闪点图案','<path d="M17 4L21 14 32 14 24 21 27 32 17 26 7 32 10 21 2 14 13 14Z" fill="url(#light)"/><path d="M38 30L40 36 46 36 41 40 43 46 38 42 33 46 35 40 30 36 36 36Z"/>'],
 ['hearts','爱心闪膜','小爱心组成的细腻全息纹理。','闪点图案','<path d="M24 39C-8 19 10 1 24 16C38 1 56 19 24 39Z" fill="url(#light)"/>'],
 ['confetti','彩纸碎箔','不规则分布的小片彩箔。','闪点图案','<path d="M3 5L14 2 17 13 6 16ZM30 8L40 15 35 22 25 15ZM9 30L17 28 21 43 12 45ZM33 31L45 28 46 40 36 42Z" fill="url(#light)"/>'],
 ['shards','冰裂碎晶','不规则多边形像碎裂的冰晶切面。','闪点图案','<path d="M0 0H30L17 19ZM48 0V31L30 0ZM17 19L48 31 29 48ZM0 0L17 19 0 38ZM0 38L17 19 29 48H0Z" fill="url(#light)" fill-opacity=".45"/>'],
 ['gold','香槟金箔','暖金色细纹反光，弱化彩虹色。','金属珠光','<path d="M0 5L48 1M0 17L48 13M0 29L48 25M0 41L48 37" opacity=".6"/><circle cx="17" cy="10" r="1"/><circle cx="37" cy="35" r="1"/>'],
 ['silver','铂银镜面','冷银色细密横纹，接近镜面金属。','金属珠光','<path d="M0 4H48M0 10H48M0 16H48M0 22H48M0 28H48M0 34H48M0 40H48M0 46H48" opacity=".5"/>'],
 ['pearl','贝母珠光','大块柔和冷暖光晕，模拟贝母光泽。','金属珠光','']
];
for(const [id,name,description] of extraFinishes)finishes.push([id,name,description]);
function tileUrl(markup){return `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="light" x2="1" y2="1"><stop stop-color="#dcfff0" stop-opacity=".75"/><stop offset=".5" stop-color="#acb8ff" stop-opacity=".12"/><stop offset="1" stop-color="#ffe2c3" stop-opacity=".6"/></linearGradient></defs><g fill="none" stroke="#e1ecff" stroke-opacity=".6" stroke-width=".8">'+markup+'</g></svg>')}")`;}
const extraStyle=document.createElement('style');extraStyle.textContent=extraFinishes.filter(f=>f[4]).map(([id,,,,markup])=>`#card[data-finish="${id}"] .foil-texture,.chip-${id}{background-image:${tileUrl(markup)};background-size:var(--grain,24px) var(--grain,24px);}`).join('\n');document.head.append(extraStyle);
const finishGroups=['几何压纹','光学纹路','闪点图案','金属珠光'];
const groupFor=id=>extraFinishes.find(f=>f[0]===id)?.[3]??({grid:'几何压纹',diamond:'几何压纹',rainbow:'光学纹路',sparkle:'闪点图案',silk:'金属珠光'}[id]);
const finishPanel=document.createElement('fieldset');finishPanel.className='finish-panel';
finishPanel.innerHTML='<legend>镭射风格</legend><div class="finish-options">'+finishes.map(([id,name])=>`<label class="finish-choice"><input type="radio" name="finish" value="${id}" ${id==='grid'?'checked':''}><span class="finish-chip chip-${id}"></span><span>${name}</span></label>`).join('')+'</div><p id="finish-description" aria-live="polite"></p><label for="grain">纹理大小 <output id="grain-value">24 px</output></label><input id="grain" type="range" min="10" max="48" value="24" step="2">';
finishPanel.querySelector('legend').textContent=`镭射风格 · ${finishes.length} 款`;
const catalog=finishPanel.querySelector('.finish-options');catalog.classList.add('finish-catalog');
for(const group of finishGroups){const section=document.createElement('section'),heading=document.createElement('h3'),options=document.createElement('div');heading.textContent=group;options.className='finish-options';for(const choice of [...catalog.querySelectorAll('.finish-choice')])if(groupFor(choice.querySelector('input').value)===group)options.append(choice);section.append(heading,options);catalog.append(section);}
document.querySelector('.settings').insertBefore(finishPanel,document.querySelector('label[for="foil"]'));
const texture=document.createElement('div');texture.className='foil-texture';texture.setAttribute('aria-hidden','true');document.querySelector('.foil').after(texture);
function setFinish(id){card.dataset.finish=id;document.querySelector('#finish-description').textContent=finishes.find(f=>f[0]===id)[2];const simple=['rainbow','pearl'].includes(id);document.querySelector('#grain').disabled=simple;}
finishPanel.addEventListener('change',e=>{if(e.target.name==='finish')setFinish(e.target.value);});
document.querySelector('#grain').addEventListener('input',e=>{card.style.setProperty('--grain',e.target.value+'px');document.querySelector('#grain-value').value=e.target.value+' px';});
setFinish('grid');
const uploadPanel=document.createElement('div');
uploadPanel.className='upload-panel';
uploadPanel.innerHTML=`<label for="art-upload" class="upload-title">换一张你的图片</label><input id="art-upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif"><p class="upload-help">JPG / PNG / WebP / AVIF，最大 20 MB。仅在本机预览，不会上传到服务器；刷新后恢复示例。</p><div class="upload-options"><label for="art-fit">图片显示</label><select id="art-fit"><option value="cover">铺满卡面（居中裁剪）</option><option value="contain">完整显示（保留留白）</option></select><button id="restore-art" type="button">恢复示例</button></div><p id="upload-status" role="status" aria-live="polite"></p>`;
document.querySelector('.settings').prepend(uploadPanel);
const textPanel=document.createElement('fieldset');textPanel.className='text-panel';
textPanel.innerHTML='<legend>卡面文案</legend><label class="text-toggle"><input id="show-copy" type="checkbox" checked>显示顶层文案</label>';
const copyFields=[['copy-series','顶部系列','.top span:first-child',32],['copy-rarity','右上角标','.top span:last-child',12],['copy-number','标题上方小字','.caption small',40],['copy-title','主标题','.caption h2',48],['copy-subtitle','副标题','.caption > span',60]];
for(const [id,label,selector,maxLength] of copyFields){
  const target=document.querySelector(selector),row=document.createElement('label'),input=document.createElement('input');
  row.htmlFor=id;row.textContent=label;input.id=id;input.type='text';input.maxLength=maxLength;input.value=target.textContent;
  input.addEventListener('input',()=>{target.textContent=input.value;});textPanel.append(row,input);
}
uploadPanel.after(textPanel);
document.querySelector('#show-copy').addEventListener('change',e=>{card.classList.toggle('hide-copy',!e.target.checked);});
const art=document.querySelector('.front img'),fileInput=document.querySelector('#art-upload'),uploadStatus=document.querySelector('#upload-status');
const originalArt=art.getAttribute('src'),originalAlt=art.alt;
let activeArtUrl=null,uploadVersion=0;
fileInput.addEventListener('change',async()=>{
  const file=fileInput.files[0];if(!file)return;
  const version=++uploadVersion;
  if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type)){uploadStatus.textContent='请选择 JPG、PNG、WebP 或 AVIF 图片。';fileInput.value='';return;}
  if(file.size>20*1024*1024){uploadStatus.textContent='图片超过 20 MB，请压缩后再试。';fileInput.value='';return;}
  uploadStatus.textContent='正在读取图片…';
  const url=URL.createObjectURL(file),candidate=new Image();candidate.src=url;
  try{
    await candidate.decode();
    if(version!==uploadVersion){URL.revokeObjectURL(url);return;}
    if(activeArtUrl)URL.revokeObjectURL(activeArtUrl);
    activeArtUrl=url;art.src=url;art.alt=file.name;
    card.classList.add('custom-art');base=0;tx=ty=0;
    uploadStatus.textContent=`已载入 ${file.name} · ${candidate.naturalWidth} × ${candidate.naturalHeight}`;
  }catch{URL.revokeObjectURL(url);if(version===uploadVersion)uploadStatus.textContent='图片无法读取，请换一张有效图片。';}
  finally{if(version===uploadVersion)fileInput.value='';}
});
document.querySelector('#art-fit').addEventListener('change',e=>{art.style.objectFit=e.target.value;});
document.querySelector('#restore-art').addEventListener('click',()=>{
  ++uploadVersion;art.src=originalArt;art.alt=originalAlt;
  if(activeArtUrl)URL.revokeObjectURL(activeArtUrl);activeArtUrl=null;
  fileInput.value='';card.classList.remove('custom-art');art.style.objectFit='cover';document.querySelector('#art-fit').value='cover';
  base=0;tx=ty=0;uploadStatus.textContent='已恢复示例卡面。';
});
let x=-5,y=-9,tx=-5,ty=-9,base=0,drag=null,moved=false;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function flip(){base+=180;ty=base;tx=0;}
document.querySelector('#flip').addEventListener('click',flip);
document.querySelector('#reset').addEventListener('click',()=>{base=0;tx=ty=0;});
slider.addEventListener('input',()=>{card.style.setProperty('--strength',slider.value/100);document.querySelector('#amount').value=slider.value+'%';});
card.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,tx,ty};moved=false;card.setPointerCapture(e.pointerId);});
card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),u=clamp((e.clientX-r.left)/r.width,0,1),v=clamp((e.clientY-r.top)/r.height,0,1);card.style.setProperty('--mx',u*100+'%');card.style.setProperty('--my',v*100+'%');card.style.setProperty('--angle',100+u*70+'deg');if(drag&&drag.id===e.pointerId){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved ||= Math.hypot(dx,dy)>5;ty=drag.ty+dx*.5;tx=clamp(drag.tx-dy*.25,-35,35);}else if(e.pointerType==='mouse'){tx=(.5-v)*22;ty=base+(u-.5)*28;}});
card.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;drag=null;if(card.hasPointerCapture(e.pointerId))card.releasePointerCapture(e.pointerId);if(!moved)flip();else base=Math.round(ty/180)*180;});
function cancel(){drag=null;base=Math.round(ty/180)*180;}
card.addEventListener('pointercancel',cancel);card.addEventListener('lostpointercapture',()=>{if(drag)cancel();});card.addEventListener('pointerleave',()=>{if(!drag){tx=0;ty=base;}});
card.addEventListener('keydown',e=>{if(['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault();if(e.key==='Enter'||e.key===' ')flip();if(e.key==='ArrowLeft')ty-=8;if(e.key==='ArrowRight')ty+=8;if(e.key==='ArrowUp')tx=clamp(tx+8,-35,35);if(e.key==='ArrowDown')tx=clamp(tx-8,-35,35);});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let raf;
function animate(){const ease=reduced?1:.12;x+=(tx-x)*ease;y+=(ty-y)*ease;card.style.transform=`rotateX(${x}deg) rotateY(${y}deg)`;raf=requestAnimationFrame(animate);}animate();addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
if(new URLSearchParams(location.search).get('phone')==='1'){const mobileScript=document.createElement('script');mobileScript.src='phone.js';document.body.append(mobileScript);}
