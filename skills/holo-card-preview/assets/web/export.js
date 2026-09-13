/* Shared desktop/mobile export. Original user state is never animated or replaced. */
(()=>{
const css=document.createElement('link');css.rel='stylesheet';css.href='export.css';document.head.append(css);
const panel=document.createElement('section');panel.className='export-panel';
panel.innerHTML=`<h3>导出卡片</h3><div class="export-options"><label>格式<select id="export-format"><option value="png">PNG · 静态卡面</option><option value="gif">GIF · 循环动图</option><option value="video">视频 · 自动感光</option></select></label><label>画面尺寸<select id="export-size"><option value="480">480 × 672</option><option value="720">720 × 1008</option></select></label></div><p id="export-description">导出当前材质与文案的正面静态效果，含深色背景。</p><p class="export-note">动图与视频：4 秒柔和摆动 + 滑动感光，不录制界面或手机外壳。生成期间请保持本页可见。</p><div class="export-actions"><button id="export-start" type="button">生成文件</button><button id="export-cancel" class="export-cancel" type="button" hidden>取消</button></div><progress id="export-progress" max="100" value="0" hidden></progress><p id="export-status" role="status" aria-live="polite"></p><div id="export-result" hidden></div>`;
document.querySelector('.settings').append(panel);
const $=s=>panel.querySelector(s),format=$('#export-format'),size=$('#export-size'),start=$('#export-start'),cancel=$('#export-cancel'),status=$('#export-status'),progress=$('#export-progress'),result=$('#export-result');
let busy=false,aborted=false,worker=null,resultURL=null,libPromise;
const videoMime=()=>typeof MediaRecorder==='undefined'?'':['video/mp4;codecs=avc1.42001E','video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
format.addEventListener('change',()=>{$('#export-description').textContent=format.value==='png'?'导出当前材质与文案的正面静态效果，含深色背景。':format.value==='gif'?'GIF：60 帧 / 4 秒，无限循环。256 色量化可能使渐变略有颗粒。':`视频：4 秒，优先 MP4，当前浏览器${videoMime()?.startsWith('video/mp4')?'支持 MP4':videoMime()?'使用 WebM':'不支持视频编码'}。`;});
function loadLibrary(){if(!libPromise)libPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='vendor/html-to-image.js';s.onload=resolve;s.onerror=()=>{libPromise=null;s.remove();reject(new Error('截图组件加载失败，请刷新重试。'));};document.head.append(s);});return libPromise;}
function check(){if(aborted)throw new DOMException('已取消','AbortError');if(document.hidden)throw new Error('页面进入后台，已停止生成。请保持页面可见后重试。');}
const tick=()=>new Promise(r=>setTimeout(r,0));
function report(text,value){status.textContent=text;progress.value=value;}
cancel.addEventListener('click',()=>{aborted=true;status.textContent='正在取消…';});
function toBlob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('图片编码失败')),'image/png'));}
function rpc(message,transfer=[]){return new Promise((resolve,reject)=>{const on=e=>{cleanup();e.data.type==='error'?reject(new Error(e.data.message)):resolve(e.data);};const fail=()=>{cleanup();reject(new Error('GIF 编码失败'));};const timeout=setTimeout(()=>{cleanup();reject(new Error('GIF 编码超时'));},30000);function cleanup(){clearTimeout(timeout);worker.removeEventListener('message',on);worker.removeEventListener('error',fail);}worker.addEventListener('message',on);worker.addEventListener('error',fail);worker.postMessage(message,transfer);});}
async function snapshotSource(width){
  await document.fonts.ready;
  const source=document.querySelector('#card'),clone=source.cloneNode(true),host=document.createElement('div');
  const height=Math.round(width*1.4),cardWidth=width*.80,cardHeight=cardWidth*1.4;
  // Capture in an offscreen subtree; same selectors preserve all 24 finishes and custom text.
  host.style.cssText=`position:fixed;left:0;top:0;z-index:-999;width:${cardWidth}px;height:${cardHeight}px;overflow:hidden;isolation:isolate;pointer-events:none;`;
  clone.style.setProperty('width',cardWidth+'px','important');clone.style.setProperty('height',cardHeight+'px','important');clone.style.setProperty('max-width','none','important');clone.style.setProperty('position','absolute','important');clone.style.setProperty('left',(width-cardWidth)/2+'px');clone.style.setProperty('top',(height-cardHeight)/2+'px');clone.style.setProperty('transition','none','important');clone.style.setProperty('transform','none');
  clone.querySelector('.back').remove();clone.querySelector('.front').style.visibility='visible';
  clone.style.setProperty('left','0');clone.style.setProperty('top','0');clone.style.setProperty('transform-style','flat');clone.querySelector('.front').style.backfaceVisibility='visible';clone.querySelector('.front').style.boxShadow='none';
  const picture=clone.querySelector('img'),response=await fetch(picture.src);if(!response.ok)throw new Error('卡面图片读取失败');const blob=await response.blob();picture.src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});
  host.setAttribute('aria-hidden','true');host.inert=true;
  await picture.decode();host.append(clone);document.body.append(host);
  return {host,clone,width,height,cardWidth,cardHeight};
}
async function capture(scene,phase,animated){
  check();const angle=phase*Math.PI*2;
  const rx=animated?Math.sin(angle)*7:-3,ry=animated?Math.sin(angle+Math.PI/4)*12:-7;
  scene.clone.style.transform='none';
  scene.clone.style.setProperty('--mx',(animated?50+34*Math.sin(angle):55)+'%');scene.clone.style.setProperty('--my',(animated?50+28*Math.cos(angle):40)+'%');scene.clone.style.setProperty('--angle',(animated?125+35*Math.sin(angle):135)+'deg');
  const flat=await htmlToImage.toCanvas(scene.clone.querySelector('.front'),{width:scene.cardWidth,height:scene.cardHeight,pixelRatio:1,skipFonts:true,style:{position:'relative',inset:'auto',left:'0',top:'0',transform:'none',backfaceVisibility:'visible',width:scene.cardWidth+'px',height:scene.cardHeight+'px'}});check();
  const canvas=document.createElement('canvas');canvas.width=scene.width;canvas.height=scene.height;const ctx=canvas.getContext('2d');ctx.fillStyle='#0c1511';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.translate(canvas.width/2+(animated?Math.sin(angle)*5:0),canvas.height/2+(animated?Math.cos(angle)*4:0));ctx.transform(Math.cos(ry*Math.PI/180),Math.sin(ry*Math.PI/180)*.10,Math.sin(rx*Math.PI/180)*.15,Math.cos(rx*Math.PI/180),0,0);ctx.shadowColor='#0008';ctx.shadowBlur=16;ctx.shadowOffsetY=10;ctx.drawImage(flat,-scene.cardWidth/2,-scene.cardHeight/2);return canvas;
}
async function record(frames,width,height,mime){
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
  // Decode all compressed frames before starting so recording does not stall on PNG decode.
  const images=[];let stream,recorder,timer;
  try{
    for(const blob of frames){check();images.push(await createImageBitmap(blob));}
    ctx.drawImage(images[0],0,0);stream=canvas.captureStream(30);const parts=[];
    recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:6000000});
    const finished=new Promise((resolve,reject)=>{recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};recorder.onerror=()=>reject(new Error('视频编码失败'));recorder.onstop=()=>resolve(new Blob(parts,{type:recorder.mimeType}));});
    // Attach a rejection handler immediately, including the cancellation path.
    finished.catch(()=>{});
    recorder.start();const started=performance.now();
    await new Promise((resolve,reject)=>{const draw=()=>{try{check();const elapsed=performance.now()-started;if(elapsed>=4000){resolve();return;}const index=Math.min(images.length-1,Math.floor(elapsed/4000*images.length));ctx.drawImage(images[index],0,0);report('正在录制视频…',75+elapsed/4000*23);timer=setTimeout(draw,1000/30);}catch(e){reject(e);}};draw();});
    recorder.stop();const blob=await finished;if(!blob.size)throw new Error('浏览器未生成有效视频');return blob;
  }finally{clearTimeout(timer);if(recorder?.state==='recording')recorder.stop();stream?.getTracks().forEach(t=>t.stop());images.forEach(i=>i.close());}
}
function showResult(blob,kind){
  if(resultURL)URL.revokeObjectURL(resultURL);resultURL=URL.createObjectURL(blob);result.replaceChildren();
  const preview=document.createElement(kind==='video'?'video':'img');preview.className='export-preview';preview.src=resultURL;
  if(kind==='video'){preview.controls=true;preview.loop=true;preview.muted=true;preview.playsInline=true;}else preview.alt='导出效果预览';
  const ext=kind==='video'?(blob.type.includes('mp4')?'mp4':'webm'):kind;
  const link=document.createElement('a');link.className='export-save';link.href=resultURL;link.download=`holo-card-${Date.now()}.${ext}`;link.textContent=`保存 ${ext.toUpperCase()} · ${(blob.size/1024/1024).toFixed(2)} MB`;
  result.append(preview,link);result.hidden=false;report('生成完成，预览后点击保存。',100);
}
start.addEventListener('click',async()=>{
  if(busy)return;busy=true;aborted=false;start.disabled=true;format.disabled=true;size.disabled=true;cancel.hidden=false;progress.hidden=false;status.classList.remove('export-error');result.hidden=true;
  let scene;const kind=format.value,width=Number(size.value);
  try{
    check();if(kind==='video'&&(!videoMime()||!HTMLCanvasElement.prototype.captureStream))throw new Error('当前浏览器不支持视频导出，请使用 Chrome / Safari 或选择 GIF。');
    report('准备卡面与素材…',1);await loadLibrary();check();scene=await snapshotSource(width);
    if(kind==='png'){const canvas=await capture(scene,0,false);showResult(await toBlob(canvas),kind);return;}
    const count=60,frames=[];
    if(kind==='gif'){worker=new Worker('gif-worker.js',{type:'module'});await rpc({type:'start'});}
    for(let i=0;i<count;i++){
      check();const canvas=await capture(scene,i/count,true);
      if(kind==='gif'){const buffer=canvas.getContext('2d').getImageData(0,0,scene.width,scene.height).data.buffer;await rpc({type:'frame',buffer,width:scene.width,height:scene.height,delay:(Math.round((i+1)*400/count)-Math.round(i*400/count))*10,index:i},[buffer]);}
      else frames.push(await toBlob(canvas));
      report(`正在生成感光帧 ${i+1} / ${count}…`,(i+1)/count*(kind==='video'?74:96));await tick();
    }
    check();let blob;if(kind==='gif'){const encoded=await rpc({type:'finish'});blob=new Blob([encoded.buffer],{type:'image/gif'});}else blob=await record(frames,scene.width,scene.height,videoMime());check();showResult(blob,kind);
  }catch(error){status.textContent=error.name==='AbortError'?'已取消，可重新生成。':`导出失败：${error.message||'浏览器无法绘制当前素材，请换图或使用 Chrome 重试。'}`;status.classList.toggle('export-error',error.name!=='AbortError');}
  finally{scene?.host.remove();worker?.terminate();worker=null;busy=false;start.disabled=false;format.disabled=false;size.disabled=false;cancel.hidden=true;}
});
addEventListener('pagehide',()=>{aborted=true;worker?.terminate();if(resultURL)URL.revokeObjectURL(resultURL);});
})();
