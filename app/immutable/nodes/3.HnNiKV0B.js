import{s as J,n as q,d as A,o as ne,l as K,b as X,h as oe,u as re,i as le,j as ce,e as he,f as de}from"../chunks/scheduler.7ddvVGuS.js";import{S as Y,i as Z,g as R,s as F,h as D,j as W,f as y,c as V,k as T,a as O,x as H,z as ee,r as te,e as N,u as ie,v as ae,d as j,t as L,b as me,w as se,C as ue,B as fe,p as ge}from"../chunks/index.XmLGRVaW.js";import{p as B}from"../chunks/stores.JUjwe3W8.js";import{O as pe}from"../chunks/ObjektGrid.uHaM_oUk.js";import{C as M,S as P}from"../chunks/apis.W9dsQ1rZ.js";import{p as _e}from"../chunks/navigation.XrT3bt0L.js";import{_ as ve}from"../chunks/preload-helper.0HuHagjb.js";import{l as z}from"../chunks/likes.EmucdeCy.js";import{c as ye}from"../chunks/copy.G6k4c7hE.js";class d{constructor(e,t,i,a,n){this._legacyCanvasSize=d.DEFAULT_CANVAS_SIZE,this._preferredCamera="environment",this._maxScansPerSecond=25,this._lastScanTimestamp=-1,this._destroyed=this._flashOn=this._paused=this._active=!1,this.$video=e,this.$canvas=document.createElement("canvas"),i&&typeof i=="object"?this._onDecode=t:(console.warn(i||a||n?"You're using a deprecated version of the QrScanner constructor which will be removed in the future":"Note that the type of the scan result passed to onDecode will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true."),this._legacyOnDecode=t),t=typeof i=="object"?i:{},this._onDecodeError=t.onDecodeError||(typeof i=="function"?i:this._onDecodeError),this._calculateScanRegion=t.calculateScanRegion||(typeof a=="function"?a:this._calculateScanRegion),this._preferredCamera=t.preferredCamera||n||this._preferredCamera,this._legacyCanvasSize=typeof i=="number"?i:typeof a=="number"?a:this._legacyCanvasSize,this._maxScansPerSecond=t.maxScansPerSecond||this._maxScansPerSecond,this._onPlay=this._onPlay.bind(this),this._onLoadedMetaData=this._onLoadedMetaData.bind(this),this._onVisibilityChange=this._onVisibilityChange.bind(this),this._updateOverlay=this._updateOverlay.bind(this),e.disablePictureInPicture=!0,e.playsInline=!0,e.muted=!0;let o=!1;if(e.hidden&&(e.hidden=!1,o=!0),document.body.contains(e)||(document.body.appendChild(e),o=!0),i=e.parentElement,t.highlightScanRegion||t.highlightCodeOutline){if(a=!!t.overlay,this.$overlay=t.overlay||document.createElement("div"),n=this.$overlay.style,n.position="absolute",n.display="none",n.pointerEvents="none",this.$overlay.classList.add("scan-region-highlight"),!a&&t.highlightScanRegion){this.$overlay.innerHTML='<svg class="scan-region-highlight-svg" viewBox="0 0 238 238" preserveAspectRatio="none" style="position:absolute;width:100%;height:100%;left:0;top:0;fill:none;stroke:#e9b213;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"><path d="M31 2H10a8 8 0 0 0-8 8v21M207 2h21a8 8 0 0 1 8 8v21m0 176v21a8 8 0 0 1-8 8h-21m-176 0H10a8 8 0 0 1-8-8v-21"/></svg>';try{this.$overlay.firstElementChild.animate({transform:["scale(.98)","scale(1.01)"]},{duration:400,iterations:1/0,direction:"alternate",easing:"ease-in-out"})}catch{}i.insertBefore(this.$overlay,this.$video.nextSibling)}t.highlightCodeOutline&&(this.$overlay.insertAdjacentHTML("beforeend",'<svg class="code-outline-highlight" preserveAspectRatio="none" style="display:none;width:100%;height:100%;fill:none;stroke:#e9b213;stroke-width:5;stroke-dasharray:25;stroke-linecap:round;stroke-linejoin:round"><polygon/></svg>'),this.$codeOutlineHighlight=this.$overlay.lastElementChild)}this._scanRegion=this._calculateScanRegion(e),requestAnimationFrame(()=>{let c=window.getComputedStyle(e);c.display==="none"&&(e.style.setProperty("display","block","important"),o=!0),c.visibility!=="visible"&&(e.style.setProperty("visibility","visible","important"),o=!0),o&&(console.warn("QrScanner has overwritten the video hiding style to avoid Safari stopping the playback."),e.style.opacity="0",e.style.width="0",e.style.height="0",this.$overlay&&this.$overlay.parentElement&&this.$overlay.parentElement.removeChild(this.$overlay),delete this.$overlay,delete this.$codeOutlineHighlight),this.$overlay&&this._updateOverlay()}),e.addEventListener("play",this._onPlay),e.addEventListener("loadedmetadata",this._onLoadedMetaData),document.addEventListener("visibilitychange",this._onVisibilityChange),window.addEventListener("resize",this._updateOverlay),this._qrEnginePromise=d.createQrEngine()}static set WORKER_PATH(e){console.warn("Setting QrScanner.WORKER_PATH is not required and not supported anymore. Have a look at the README for new setup instructions.")}static async hasCamera(){try{return!!(await d.listCameras(!1)).length}catch{return!1}}static async listCameras(e=!1){if(!navigator.mediaDevices)return[];let t=async()=>(await navigator.mediaDevices.enumerateDevices()).filter(a=>a.kind==="videoinput"),i;try{e&&(await t()).every(a=>!a.label)&&(i=await navigator.mediaDevices.getUserMedia({audio:!1,video:!0}))}catch{}try{return(await t()).map((a,n)=>({id:a.deviceId,label:a.label||(n===0?"Default Camera":`Camera ${n+1}`)}))}finally{i&&(console.warn("Call listCameras after successfully starting a QR scanner to avoid creating a temporary video stream"),d._stopVideoStream(i))}}async hasFlash(){let e;try{if(this.$video.srcObject){if(!(this.$video.srcObject instanceof MediaStream))return!1;e=this.$video.srcObject}else e=(await this._getCameraStream()).stream;return"torch"in e.getVideoTracks()[0].getSettings()}catch{return!1}finally{e&&e!==this.$video.srcObject&&(console.warn("Call hasFlash after successfully starting the scanner to avoid creating a temporary video stream"),d._stopVideoStream(e))}}isFlashOn(){return this._flashOn}async toggleFlash(){this._flashOn?await this.turnFlashOff():await this.turnFlashOn()}async turnFlashOn(){if(!this._flashOn&&!this._destroyed&&(this._flashOn=!0,this._active&&!this._paused))try{if(!await this.hasFlash())throw"No flash available";await this.$video.srcObject.getVideoTracks()[0].applyConstraints({advanced:[{torch:!0}]})}catch(e){throw this._flashOn=!1,e}}async turnFlashOff(){this._flashOn&&(this._flashOn=!1,await this._restartVideoStream())}destroy(){this.$video.removeEventListener("loadedmetadata",this._onLoadedMetaData),this.$video.removeEventListener("play",this._onPlay),document.removeEventListener("visibilitychange",this._onVisibilityChange),window.removeEventListener("resize",this._updateOverlay),this._destroyed=!0,this._flashOn=!1,this.stop(),d._postWorkerMessage(this._qrEnginePromise,"close")}async start(){if(this._destroyed)throw Error("The QR scanner can not be started as it had been destroyed.");if((!this._active||this._paused)&&(window.location.protocol!=="https:"&&console.warn("The camera stream is only accessible if the page is transferred via https."),this._active=!0,!document.hidden))if(this._paused=!1,this.$video.srcObject)await this.$video.play();else try{let{stream:e,facingMode:t}=await this._getCameraStream();!this._active||this._paused?d._stopVideoStream(e):(this._setVideoMirror(t),this.$video.srcObject=e,await this.$video.play(),this._flashOn&&(this._flashOn=!1,this.turnFlashOn().catch(()=>{})))}catch(e){if(!this._paused)throw this._active=!1,e}}stop(){this.pause(),this._active=!1}async pause(e=!1){if(this._paused=!0,!this._active)return!0;this.$video.pause(),this.$overlay&&(this.$overlay.style.display="none");let t=()=>{this.$video.srcObject instanceof MediaStream&&(d._stopVideoStream(this.$video.srcObject),this.$video.srcObject=null)};return e?(t(),!0):(await new Promise(i=>setTimeout(i,300)),this._paused?(t(),!0):!1)}async setCamera(e){e!==this._preferredCamera&&(this._preferredCamera=e,await this._restartVideoStream())}static async scanImage(e,t,i,a,n=!1,o=!1){let c,l=!1;t&&("scanRegion"in t||"qrEngine"in t||"canvas"in t||"disallowCanvasResizing"in t||"alsoTryWithoutScanRegion"in t||"returnDetailedScanResult"in t)?(c=t.scanRegion,i=t.qrEngine,a=t.canvas,n=t.disallowCanvasResizing||!1,o=t.alsoTryWithoutScanRegion||!1,l=!0):console.warn(t||i||a||n||o?"You're using a deprecated api for scanImage which will be removed in the future.":"Note that the return type of scanImage will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true."),t=!!i;try{let f,r;[i,f]=await Promise.all([i||d.createQrEngine(),d._loadImage(e)]),[a,r]=d._drawToCanvas(f,c,a,n);let m;if(i instanceof Worker){let s=i;t||d._postWorkerMessageSync(s,"inversionMode","both"),m=await new Promise((h,w)=>{let g,v,p,S=-1;v=b=>{b.data.id===S&&(s.removeEventListener("message",v),s.removeEventListener("error",p),clearTimeout(g),b.data.data!==null?h({data:b.data.data,cornerPoints:d._convertPoints(b.data.cornerPoints,c)}):w(d.NO_QR_CODE_FOUND))},p=b=>{s.removeEventListener("message",v),s.removeEventListener("error",p),clearTimeout(g),w("Scanner error: "+(b?b.message||b:"Unknown Error"))},s.addEventListener("message",v),s.addEventListener("error",p),g=setTimeout(()=>p("timeout"),1e4);let $=r.getImageData(0,0,a.width,a.height);S=d._postWorkerMessageSync(s,"decode",$,[$.data.buffer])})}else m=await Promise.race([new Promise((s,h)=>window.setTimeout(()=>h("Scanner error: timeout"),1e4)),(async()=>{try{var[s]=await i.detect(a);if(!s)throw d.NO_QR_CODE_FOUND;return{data:s.rawValue,cornerPoints:d._convertPoints(s.cornerPoints,c)}}catch(h){if(s=h.message||h,/not implemented|service unavailable/.test(s))return d._disableBarcodeDetector=!0,d.scanImage(e,{scanRegion:c,canvas:a,disallowCanvasResizing:n,alsoTryWithoutScanRegion:o});throw`Scanner error: ${s}`}})()]);return l?m:m.data}catch(f){if(!c||!o)throw f;let r=await d.scanImage(e,{qrEngine:i,canvas:a,disallowCanvasResizing:n});return l?r:r.data}finally{t||d._postWorkerMessage(i,"close")}}setGrayscaleWeights(e,t,i,a=!0){d._postWorkerMessage(this._qrEnginePromise,"grayscaleWeights",{red:e,green:t,blue:i,useIntegerApproximation:a})}setInversionMode(e){d._postWorkerMessage(this._qrEnginePromise,"inversionMode",e)}static async createQrEngine(e){if(e&&console.warn("Specifying a worker path is not required and not supported anymore."),e=()=>ve(()=>import("../chunks/qr-scanner-worker.min.Xq4UWGb2.js"),__vite__mapDeps([]),import.meta.url).then(i=>i.createWorker()),!(!d._disableBarcodeDetector&&"BarcodeDetector"in window&&BarcodeDetector.getSupportedFormats&&(await BarcodeDetector.getSupportedFormats()).includes("qr_code")))return e();let t=navigator.userAgentData;return t&&t.brands.some(({brand:i})=>/Chromium/i.test(i))&&/mac ?OS/i.test(t.platform)&&await t.getHighEntropyValues(["architecture","platformVersion"]).then(({architecture:i,platformVersion:a})=>/arm/i.test(i||"arm")&&13<=parseInt(a||"13")).catch(()=>!0)?e():new BarcodeDetector({formats:["qr_code"]})}_onPlay(){this._scanRegion=this._calculateScanRegion(this.$video),this._updateOverlay(),this.$overlay&&(this.$overlay.style.display=""),this._scanFrame()}_onLoadedMetaData(){this._scanRegion=this._calculateScanRegion(this.$video),this._updateOverlay()}_onVisibilityChange(){document.hidden?this.pause():this._active&&this.start()}_calculateScanRegion(e){let t=Math.round(.6666666666666666*Math.min(e.videoWidth,e.videoHeight));return{x:Math.round((e.videoWidth-t)/2),y:Math.round((e.videoHeight-t)/2),width:t,height:t,downScaledWidth:this._legacyCanvasSize,downScaledHeight:this._legacyCanvasSize}}_updateOverlay(){requestAnimationFrame(()=>{if(this.$overlay){var e=this.$video,t=e.videoWidth,i=e.videoHeight,a=e.offsetWidth,n=e.offsetHeight,o=e.offsetLeft,c=e.offsetTop,l=window.getComputedStyle(e),f=l.objectFit,r=t/i,m=a/n;switch(f){case"none":var s=t,h=i;break;case"fill":s=a,h=n;break;default:(f==="cover"?r>m:r<m)?(h=n,s=h*r):(s=a,h=s/r),f==="scale-down"&&(s=Math.min(s,t),h=Math.min(h,i))}var[w,g]=l.objectPosition.split(" ").map((p,S)=>{const $=parseFloat(p);return p.endsWith("%")?(S?n-h:a-s)*$/100:$});l=this._scanRegion.width||t,m=this._scanRegion.height||i,f=this._scanRegion.x||0;var v=this._scanRegion.y||0;r=this.$overlay.style,r.width=`${l/t*s}px`,r.height=`${m/i*h}px`,r.top=`${c+g+v/i*h}px`,i=/scaleX\(-1\)/.test(e.style.transform),r.left=`${o+(i?a-w-s:w)+(i?t-f-l:f)/t*s}px`,r.transform=e.style.transform}})}static _convertPoints(e,t){if(!t)return e;let i=t.x||0,a=t.y||0,n=t.width&&t.downScaledWidth?t.width/t.downScaledWidth:1;t=t.height&&t.downScaledHeight?t.height/t.downScaledHeight:1;for(let o of e)o.x=o.x*n+i,o.y=o.y*t+a;return e}_scanFrame(){!this._active||this.$video.paused||this.$video.ended||("requestVideoFrameCallback"in this.$video?this.$video.requestVideoFrameCallback.bind(this.$video):requestAnimationFrame)(async()=>{if(!(1>=this.$video.readyState)){var e=Date.now()-this._lastScanTimestamp,t=1e3/this._maxScansPerSecond;e<t&&await new Promise(a=>setTimeout(a,t-e)),this._lastScanTimestamp=Date.now();try{var i=await d.scanImage(this.$video,{scanRegion:this._scanRegion,qrEngine:this._qrEnginePromise,canvas:this.$canvas})}catch(a){if(!this._active)return;this._onDecodeError(a)}!d._disableBarcodeDetector||await this._qrEnginePromise instanceof Worker||(this._qrEnginePromise=d.createQrEngine()),i?(this._onDecode?this._onDecode(i):this._legacyOnDecode&&this._legacyOnDecode(i.data),this.$codeOutlineHighlight&&(clearTimeout(this._codeOutlineHighlightRemovalTimeout),this._codeOutlineHighlightRemovalTimeout=void 0,this.$codeOutlineHighlight.setAttribute("viewBox",`${this._scanRegion.x||0} ${this._scanRegion.y||0} ${this._scanRegion.width||this.$video.videoWidth} ${this._scanRegion.height||this.$video.videoHeight}`),this.$codeOutlineHighlight.firstElementChild.setAttribute("points",i.cornerPoints.map(({x:a,y:n})=>`${a},${n}`).join(" ")),this.$codeOutlineHighlight.style.display="")):this.$codeOutlineHighlight&&!this._codeOutlineHighlightRemovalTimeout&&(this._codeOutlineHighlightRemovalTimeout=setTimeout(()=>this.$codeOutlineHighlight.style.display="none",100))}this._scanFrame()})}_onDecodeError(e){e!==d.NO_QR_CODE_FOUND&&console.log(e)}async _getCameraStream(){if(!navigator.mediaDevices)throw"Camera not found.";let e=/^(environment|user)$/.test(this._preferredCamera)?"facingMode":"deviceId",t=[{width:{min:1024}},{width:{min:768}},{}],i=t.map(a=>Object.assign({},a,{[e]:{exact:this._preferredCamera}}));for(let a of[...i,...t])try{let n=await navigator.mediaDevices.getUserMedia({video:a,audio:!1}),o=this._getFacingMode(n)||(a.facingMode?this._preferredCamera:this._preferredCamera==="environment"?"user":"environment");return{stream:n,facingMode:o}}catch{}throw"Camera not found."}async _restartVideoStream(){let e=this._paused;await this.pause(!0)&&!e&&this._active&&await this.start()}static _stopVideoStream(e){for(let t of e.getTracks())t.stop(),e.removeTrack(t)}_setVideoMirror(e){this.$video.style.transform="scaleX("+(e==="user"?-1:1)+")"}_getFacingMode(e){return(e=e.getVideoTracks()[0])?/rear|back|environment/i.test(e.label)?"environment":/front|user|face/i.test(e.label)?"user":null:null}static _drawToCanvas(e,t,i,a=!1){i=i||document.createElement("canvas");let n=t&&t.x?t.x:0,o=t&&t.y?t.y:0,c=t&&t.width?t.width:e.videoWidth||e.width,l=t&&t.height?t.height:e.videoHeight||e.height;return a||(a=t&&t.downScaledWidth?t.downScaledWidth:c,t=t&&t.downScaledHeight?t.downScaledHeight:l,i.width!==a&&(i.width=a),i.height!==t&&(i.height=t)),t=i.getContext("2d",{alpha:!1}),t.imageSmoothingEnabled=!1,t.drawImage(e,n,o,c,l,0,0,i.width,i.height),[i,t]}static async _loadImage(e){if(e instanceof Image)return await d._awaitImageLoad(e),e;if(e instanceof HTMLVideoElement||e instanceof HTMLCanvasElement||e instanceof SVGImageElement||"OffscreenCanvas"in window&&e instanceof OffscreenCanvas||"ImageBitmap"in window&&e instanceof ImageBitmap)return e;if(e instanceof File||e instanceof Blob||e instanceof URL||typeof e=="string"){let t=new Image;t.src=e instanceof File||e instanceof Blob?URL.createObjectURL(e):e.toString();try{return await d._awaitImageLoad(t),t}finally{(e instanceof File||e instanceof Blob)&&URL.revokeObjectURL(t.src)}}else throw"Unsupported image type."}static async _awaitImageLoad(e){e.complete&&e.naturalWidth!==0||await new Promise((t,i)=>{let a=n=>{e.removeEventListener("load",a),e.removeEventListener("error",a),n instanceof ErrorEvent?i("Image load error"):t()};e.addEventListener("load",a),e.addEventListener("error",a)})}static async _postWorkerMessage(e,t,i,a){return d._postWorkerMessageSync(await e,t,i,a)}static _postWorkerMessageSync(e,t,i,a){if(!(e instanceof Worker))return-1;let n=d._workerMessageId++;return e.postMessage({id:n,type:t,data:i},a),n}}d.DEFAULT_CANVAS_SIZE=400;d.NO_QR_CODE_FOUND="No QR code found";d._disableBarcodeDetector=!1;d._workerMessageId=0;function we(u){let e,t,i,a,n,o,c;return{c(){e=R("div"),t=R("button"),i=F(),a=R("div"),n=R("video"),this.h()},l(l){e=D(l,"DIV",{class:!0});var f=W(e);t=D(f,"BUTTON",{class:!0}),W(t).forEach(y),i=V(f),a=D(f,"DIV",{class:!0});var r=W(a);n=D(r,"VIDEO",{class:!0}),W(n).forEach(y),r.forEach(y),f.forEach(y),this.h()},h(){T(t,"class","svelte-3dvv3k"),T(n,"class","svelte-3dvv3k"),T(a,"class","popup svelte-3dvv3k"),T(e,"class","blur svelte-3dvv3k")},m(l,f){O(l,e,f),H(e,t),H(e,i),H(e,a),H(a,n),u[3](n),o||(c=ee(t,"click",u[2]),o=!0)},p:q,i:q,o:q,d(l){l&&y(e),u[3](null),o=!1,c()}}}function be(u,e,t){let i;A(u,B,r=>t(6,i=r));let{scanning:a=!0}=e,n,o,c=!1;ne(()=>{o=new d(n,async r=>{if(r.data.startsWith("https://link.cosmo.fans/mint")&&!c){c=!0;const s=await(await fetch(`${M.URL}/objekt/v1/by-serial/${r.data.slice(-11)}`)).json();if(s&&s.objekt){const h=s.objekt.collectionId.toLowerCase().replaceAll(" ","-");_e(`/objekt/${h}/${s.objekt.objektNo}`,{collection:{id:h,artists:s.objekt.artists,member:s.objekt.member,number:s.objekt.collectionNo,front:s.objekt.frontImage,back:s.objekt.backImage,thumbnail:s.objekt.thumbnailImage,season:s.objekt.season,class:s.objekt.class,textColor:s.objekt.textColor,backgroundColor:s.objekt.backgroundColor,timestamp:1},objekt:{...P.Objekt,serial:s.objekt.objektNo},previous:i.url.href}),t(0,a=!1)}}},{highlightScanRegion:!0,highlightCodeOutline:!0}),o.start()}),K(()=>{o.stop()});const l=()=>t(0,a=!1);function f(r){X[r?"unshift":"push"](()=>{n=r,t(1,n)})}return u.$$set=r=>{"scanning"in r&&t(0,a=r.scanning)},[a,n,l,f]}class ke extends Y{constructor(e){super(),Z(this,e,be,we,J,{scanning:0})}}function Q(u){let e,t=u[1]&&x(u);return{c(){t&&t.c(),e=N()},l(i){t&&t.l(i),e=N()},m(i,a){t&&t.m(i,a),O(i,e,a)},p(i,a){i[1]?t?t.p(i,a):(t=x(i),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null)},d(i){i&&y(e),t&&t.d(i)}}}function x(u){let e,t=`<img src="${ye}" alt="Copy" class="copy svelte-zjlx4q"/>`,i,a;return{c(){e=R("button"),e.innerHTML=t,this.h()},l(n){e=D(n,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(e)!=="svelte-1lkwvm6"&&(e.innerHTML=t),this.h()},h(){T(e,"class","svelte-zjlx4q")},m(n,o){O(n,e,o),i||(a=ee(e,"click",u[9]),i=!0)},p:q,d(n){n&&y(e),i=!1,a()}}}function G(u){let e,t,i;function a(o){u[10](o)}let n={};return u[2]!==void 0&&(n.scanning=u[2]),e=new ke({props:n}),X.push(()=>fe(e,"scanning",a)),{c(){te(e.$$.fragment)},l(o){ie(e.$$.fragment,o)},m(o,c){ae(e,o,c),i=!0},p(o,c){const l={};!t&&c&4&&(t=!0,l.scanning=o[2],he(()=>t=!1)),e.$set(l)},i(o){i||(j(e.$$.fragment,o),i=!0)},o(o){L(e.$$.fragment,o),i=!1},d(o){se(e,o)}}}function Se(u){let e,t,i=u[0].has("liked"),a,n,o,c;e=new pe({props:{load:u[3],total:u[1]}});let l=i&&Q(u);const f=u[8].default,r=oe(f,u,u[7],null);let m=u[2]&&G(u);return{c(){te(e.$$.fragment),t=F(),l&&l.c(),a=F(),r&&r.c(),n=F(),m&&m.c(),o=N()},l(s){ie(e.$$.fragment,s),t=V(s),l&&l.l(s),a=V(s),r&&r.l(s),n=V(s),m&&m.l(s),o=N()},m(s,h){ae(e,s,h),O(s,t,h),l&&l.m(s,h),O(s,a,h),r&&r.m(s,h),O(s,n,h),m&&m.m(s,h),O(s,o,h),c=!0},p(s,[h]){const w={};h&2&&(w.total=s[1]),e.$set(w),h&1&&(i=s[0].has("liked")),i?l?l.p(s,h):(l=Q(s),l.c(),l.m(a.parentNode,a)):l&&(l.d(1),l=null),r&&r.p&&(!c||h&128)&&re(r,f,s,s[7],c?ce(f,s[7],h,null):le(s[7]),null),s[2]?m?(m.p(s,h),h&4&&j(m,1)):(m=G(s),m.c(),j(m,1),m.m(o.parentNode,o)):m&&(ge(),L(m,1,1,()=>{m=null}),me())},i(s){c||(j(e.$$.fragment,s),j(r,s),j(m),c=!0)},o(s){L(e.$$.fragment,s),L(r,s),L(m),c=!1},d(s){s&&(y(t),y(a),y(n),y(o)),se(e,s),l&&l.d(s),r&&r.d(s),m&&m.d(s)}}}function $e(u,e,t){let i,a;A(u,z,g=>t(6,i=g)),A(u,B,g=>t(11,a=g));let{$$slots:n={},$$scope:o}=e,c=null,l=a.url.searchParams;async function f(g,v){if(l.has("liked")){if(!i.length)return t(1,c=0),[];if(!i[0].backgroundColor){const k=await(await fetch(P.URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:`
                            query {
                                ${i.map((C,E)=>`
                                    bookmarks${E}: collectionsConnection(orderBy: id_ASC, where: {id_eq: "${C.id}"}) {
                                        edges {
                                            node {
                                                backgroundColor
                                            }
                                        }
                                    }
                                `).join(`
`)}
                            }
                        `})})).json();de(z,i=i.map((C,E)=>({...C,backgroundColor:k.data[Object.keys(k.data)[E]].edges[0].node.backgroundColor})),i)}const _=P.filterCollections(i,l);return t(1,c=_.length),_.map(I=>({collection:I}))}let p=[],S="timestamp_DESC";const $=await M.artists();l.forEach((_,I)=>{switch(I){case"artist":$.find(k=>k.name===_)?p.push(`artists_containsAll: "${_}"`):$.find(k=>k.members.find(C=>C.name===_))?p.push(`member_eq: "${_}"`):M.unit(_)&&p.push(`AND: {member_eq: "${M.unit(_)[0]}"`+M.unit(_)?.slice(1).reduce((k,C,E)=>k.slice(0,k.length-E)+`, OR: {member_eq: "${C}"`+"}".repeat(E+1),"")+"}");break;case"season":p.push(`season_eq: "${_}"`);break;case"class":p.push(`class_eq: "${_}"`);break;case"number":p.push(`number_startsWith: "${_}"`);break;case"minNumber":p.push(`number_gte: "${_}"`);break;case"maxNumber":p.push(`number_lte: "${_}"`);break;case"type":p.push(`number_endsWith: "${_}"`);break;case"sort":switch(_){case"number":S="number_ASC";break;case"oldest":S="timestamp_ASC";break}break}});const U=await(await fetch(P.URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:`
                    query {
                        collectionsConnection(orderBy: ${S}, first: ${v}, ${g?`after: "${g}", `:""} where: {${p.join(", ")}}) {
                            ${c===null?`
                                totalCount
                            `:""}
                            edges {
                                node {
                                    ${Object.keys(P.Collection).join(`
`)}
                                }
                            }
                        }
                    }

                `})})).json();return c===null&&t(1,c=U.data.collectionsConnection.totalCount),U.data.collectionsConnection.edges.map(_=>({collection:_.node}))}K(B.subscribe(()=>{l!==a.url.searchParams&&(t(1,c=null),t(0,l=a.url.searchParams))}));let r=i;function m(){navigator.clipboard.writeText(Object.values(i.reduce((g,v)=>(g[v.member]=[v,...g[v.member]||[]],g),{})).map(g=>`${g[0].member}: `+g.map(v=>`${v.season.slice(0,1)}${v.number.slice(0,3)}`).join(", ")).join(`
`))}let s=!1;const h=()=>m();function w(g){s=g,t(2,s)}return u.$$set=g=>{"$$scope"in g&&t(7,o=g.$$scope)},u.$$.update=()=>{u.$$.dirty&97&&r!==i&&(l.has("liked")&&r[0]&&r[0].backgroundColor&&t(1,c=null),t(5,r=i))},[l,c,s,f,m,r,i,o,n,h,w]}class Pe extends Y{constructor(e){super(),Z(this,e,$e,Se,J,{})}}export{Pe as component};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}