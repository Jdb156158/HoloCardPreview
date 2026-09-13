import {GIFEncoder,quantize,applyPalette} from './vendor/gifenc.esm.js';
let gif;
self.onmessage=({data})=>{try{
  if(data.type==='start'){gif=GIFEncoder();self.postMessage({type:'ready'});}
  if(data.type==='frame'){
    const rgba=new Uint8Array(data.buffer),palette=quantize(rgba,256),indexed=applyPalette(rgba,palette);
    gif.writeFrame(indexed,data.width,data.height,{palette,delay:data.delay,repeat:0});
    self.postMessage({type:'frame',index:data.index});
  }
  if(data.type==='finish'){gif.finish();const bytes=gif.bytes();self.postMessage({type:'done',buffer:bytes.buffer},[bytes.buffer]);gif=null;}
}catch(error){self.postMessage({type:'error',message:error.message});}};
