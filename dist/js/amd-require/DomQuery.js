require([],(function(){return function(e){var t={};function r(l){if(t[l])return t[l].exports;var s=t[l]={i:l,l:!1,exports:{}};return e[l].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=e,r.c=t,r.d=function(e,t,l){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:l})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var l=Object.create(null);if(r.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(l,s,function(t){return e[t]}.bind(null,s));return l},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t,r){"use strict";r.r(t),r.d(t,"Monad",(function(){return l})),r.d(t,"Stream",(function(){return s})),r.d(t,"Optional",(function(){return n})),r.d(t,"Config",(function(){return a}));class l{constructor(e){this._value=e}map(e){e||(e=e=>e);let t=e(this.value);return new l(t)}flatMap(e){let t=this.map(e);for(;void 0!==t&&null!=t&&t.value instanceof l;)t=t.value;return t}get value(){return this._value}}class s{constructor(...e){this.value=e}static of(...e){return new s(...e)}each(e){for(let t=0;t<this.value.length&&!1!==e(this.value[t],t);t++);return this}map(e){e||(e=e=>e);let t=[];return this.each((r,l)=>{t.push(e(r))}),new s(...t)}flatMap(e){let t=this.map(e),r=this.mapStreams(t);return new s(...r)}filter(e){let t=[];return this.each(r=>{e(r)&&t.push(r)}),new s(...t)}reduce(e,t=null){let r=null!=t?0:1,l=null!=t?t:this.value.length?this.value[0]:null;for(let t=r;t<this.value.length;t++)l=e(l,this.value[t]);return n.fromNullable(l)}first(){return this.value&&this.value.length?n.fromNullable(this.value[0]):n.absent}last(){return n.fromNullable(this.value.length?this.value[this.value.length-1]:null)}anyMatch(e){for(let t=0;t<this.value.length;t++)if(e(this.value[t]))return!0;return!1}allMatch(e){if(!this.value.length)return!1;let t=0;for(let r=0;r<this.value.length;r++)e(this.value[r])&&t++;return t==this.value.length}noneMatch(e){let t=0;for(let r=0;r<this.value.length;r++)e(this.value[r])&&t++;return t==this.value.length}mapStreams(e){let t=[];return e.each(e=>{e instanceof s?t=t.concat(this.mapStreams(e)):t.push(e)}),t}}class n extends l{constructor(e){super(e)}static fromNullable(e){return new n(e)}isAbsent(){return void 0===this.value||null==this.value}isPresent(){return!this.isAbsent()}orElse(e){return this.isPresent()?this:null==e?n.absent:this.flatMap(()=>e)}orElseLazy(e){return this.isPresent()?this:this.flatMap(e)}flatMap(e){let t=super.flatMap(e);return t instanceof n?t.flatMap():n.fromNullable(t.value)}getIfPresent(e){return this.isAbsent()?this.getClass().absent:this.getClass().fromNullable(this.value[e]).flatMap()}getIf(...e){let t=this;for(let r=0;r<e.length;r++){let l=this.keyVal(e[r]),s=this.arrayIndex(e[r]);if(""===l&&s>=0){if((t=this.getClass().fromNullable(t.value instanceof Array?t.value.length<s?null:t.value[s]:null)).isAbsent())return t}else if(l&&s>=0){if(t.getIfPresent(l).isAbsent())return t;if((t=t.getIfPresent(l).value instanceof Array?this.getClass().fromNullable(t.getIfPresent(l).value[s]):this.getClass().absent).isAbsent())return t}else{if((t=t.getIfPresent(l)).isAbsent())return t;s>-1&&(t=this.getClass().fromNullable(t.value[s]))}}return t}get value(){return this._value instanceof l?this._value.flatMap().value:this._value}match(e){return!this.isAbsent()&&e(this.value)}get(e=n.absent){return this.isAbsent()?this.getClass().fromNullable(e).flatMap():this.getClass().fromNullable(this.value).flatMap()}getClass(){return n}toJson(){return JSON.stringify(this.value)}arrayIndex(e){let t=e.indexOf("["),r=e.indexOf("]");return t>=0&&r>0&&t<r?parseInt(e.substring(t+1,r)):-1}keyVal(e){let t=e.indexOf("[");return t>=0?e.substring(0,t):e}}n.absent=n.fromNullable(null);class i{constructor(e,t,r){this.rootElem=e,this.key=t,this.arrPos=void 0!==r?r:-1}get value(){return""==this.key&&this.arrPos>=0?this.rootElem[this.arrPos]:this.key&&this.arrPos>=0?this.rootElem[this.key][this.arrPos]:this.rootElem[this.key]}set value(e){""==this.key&&this.arrPos>=0?this.rootElem[this.arrPos]=e:this.key&&this.arrPos>=0?this.rootElem[this.key][this.arrPos]=e:this.rootElem[this.key]=e}}class a extends n{constructor(e){super(e)}static fromNullable(e){return new a(e)}apply(...e){if(e.length<1)return;this.buildPath(e);let t=this.keyVal(e[e.length-1]),r=this.arrayIndex(e[e.length-1]);return new i(1==e.length?this.value:this.getIf.apply(this,e.slice(0,e.length-1)).value,t,r)}applyIf(e,...t){return e?this.apply(t):{value:null}}getIf(...e){return this.getClass().fromNullable(super.getIf.apply(this,e).value)}get(e){return this.getClass().fromNullable(super.get(e).value)}delete(e){return e in this.value&&delete this.value[e],this}toJson(){return JSON.stringify(this.value)}get shallowCopy(){return new a(function(e,t=!0){let r={};return this.arrForEach(e,e=>{this.mixMaps(r,e,t)}),r}([{},this.value||{}]))}getClass(){return a}setVal(e){this._value=e}buildPath(e){let t=this,r=this.getClass().fromNullable(null),l=-1,s=function(e,t){if(e.length<t)for(let r=e.length;r<t;r++)e.push({})};for(let n=0;n<e.length;n++){let i=this.keyVal(e[n]),a=this.arrayIndex(e[n]);if(""===i&&a>=0){t.setVal(t.value instanceof Array?t.value:[]),s(t.value,a+1),l>=0&&(r.value[l]=t.value),r=t,l=a,t=this.getClass().fromNullable(t.value[a]);continue}let u=t.getIf(i);if(-1==a)u.isAbsent()?u=this.getClass().fromNullable(t.value[i]={}):t=u;else{let e=u.value instanceof Array?u.value:[];s(e,a+1),t.value[i]=e,u=this.getClass().fromNullable(e[a])}r=t,l=a,t=u}return this}}},function(e,t,r){"use strict";r.r(t),r.d(t,"Lang",(function(){return n}));var l=r(2),s=r(0);class n{static get instance(){return n._instance||(n._instance=new n),n._instance}strToArray(e,t=/\./gi){let r=e.split(t);for(let e=0;e<r.length;e++)r[e]=this.trim(r[e]);return r}arrToMap(e,t=0){var r=new Array(e.length),l=e.length;t=t||0;for(var s=0;s<l;s++)r[e[s]]=s+t;return r}trim(e){let t=/\s/,r=(e=e.replace(/^\s\s*/,"")).length;for(;t.test(e.charAt(--r)););return e.slice(0,r+1)}isString(e){return!!arguments.length&&null!=e&&("string"==typeof e||e instanceof String)}isFunc(e){return e instanceof Function||"function"==typeof e}hitch(e,t){return e?function(){return t.apply(e,arguments||[])}:t}mergeMaps(e,t=!0,r,l){let s={};return this.arrForEach(e,e=>{this.mixMaps(s,e,t)}),s}mixMaps(e,t,r,l,s){for(let n in t)t.hasOwnProperty(n)&&(l&&l[n]||s&&!s[n]||(e[n]=r?void 0!==t[n]?t[n]:e[n]:void 0!==e[n]?e[n]:t[n]));return e}objToArray(e,t,r){if(!e)return r||null;if(e instanceof Array&&!t&&!r)return e;let l=void 0!==t||null!=t?t:0,s=r||[];try{return s.concat(Array.prototype.slice.call(e,l))}catch(t){for(let t=l;t<e.length;t++)s.push(e[t]);return s}}arrForEach(e,t,r,l){if(!e||!e.length)return;let s=r||0,n=l,i=this.objToArray(e);r?i.slice(s).forEach(t,n):i.forEach(t,n)}contains(e,t){if(!e||!t)throw Error("null value on arr or str not allowed");return-1!=this.arrIndexOf(e,t)}arrIndexOf(e,t,r){if(!e||!e.length)return-1;let l=r||0;return(e=this.objToArray(e)).indexOf(t,l)}arrFilter(e,t,r,l){if(!e||!e.length)return[];let s=this.objToArray(e);return r?s.slice(r).filter(t,l):s.filter(t,l)}applyArgs(e,t,r){let l="undefined";if(r)for(let s=0;s<t.length;s++)l!=typeof e["_"+r[s]]&&(e["_"+r[s]]=t[s]),l!=typeof e[r[s]]&&(e[r[s]]=t[s]);else for(let r in t)t.hasOwnProperty(r)&&(l!=typeof e["_"+r]&&(e["_"+r]=t[r]),l!=typeof e[r]&&(e[r]=t[r]));return e}equalsIgnoreCase(e,t){return!e&&!t||!(!e||!t)&&e.toLowerCase()===t.toLowerCase()}timeout(e){let t=null;return new l.CancellablePromise((r,l)=>{t=setTimeout(()=>{r()},e)},()=>{t&&(clearTimeout(t),t=null)})}interval(e){let t=null;return new l.CancellablePromise((r,l)=>{t=setInterval(()=>{r()},e)},()=>{t&&(clearInterval(t),t=null)})}assertType(e,t){return this.isString(t)?typeof e==t:e instanceof t}static saveResolve(e,t=null){try{let r=e();return void 0===r||null==r?s.Optional.fromNullable(t):s.Optional.fromNullable(r)}catch(e){return s.Optional.absent}}}},function(e,t,r){"use strict";r.r(t),r.d(t,"PromiseStatus",(function(){return l})),r.d(t,"Promise",(function(){return n})),r.d(t,"CancellablePromise",(function(){return i}));var l,s=r(0);!function(e){e[e.PENDING=0]="PENDING",e[e.FULLFILLED=1]="FULLFILLED",e[e.REJECTED=2]="REJECTED"}(l||(l={}));class n{constructor(e){this.status=l.PENDING,this.allFuncs=[],this.value=e,this.value(e=>this.resolve(e),e=>this.reject(e))}static all(...e){let t,r=0,l=new n((e,r)=>{t=e}),s=()=>{r++,e.length==r&&t()};s.__last__=!0;for(let t=0;t<e.length;t++)e[t].finally(s);return l}static race(...e){let t,r,l=new n((e,l)=>{t=e,r=l}),s=()=>(t&&t(),t=null,r=null,null);s.__last__=!0;let i=()=>(r&&r(),r=null,t=null,null);i.__last__=!0;for(let t=0;t<e.length;t++)e[t].then(s),e[t].catch(i);return l}static reject(e){return new n((t,r)=>{e instanceof n?e.then(e=>{r(e)}):setTimeout(()=>{r(e)},1)})}static resolve(e){return new n((t,r)=>{e instanceof n?e.then(e=>t(e)):setTimeout(()=>{t(e)},1)})}then(e,t){return this.allFuncs.push({then:e}),t&&this.allFuncs.push({catch:t}),this.spliceLastFuncs(),this}catch(e){return this.allFuncs.push({catch:e}),this.spliceLastFuncs(),this}finally(e){if(!this.__reason__)return this.allFuncs.push({finally:e}),this.spliceLastFuncs(),this;this.__reason__.finally(e)}spliceLastFuncs(){let e=[],t=[];for(let r=0;r<this.allFuncs.length;r++)for(let l in this.allFuncs[r])this.allFuncs[r][l].__last__?e.push(this.allFuncs[r]):t.push(this.allFuncs[r]);this.allFuncs=t.concat(e)}resolve(e){for(;this.allFuncs.length&&this.allFuncs[0].then;){let t=this.allFuncs.shift(),r=s.Optional.fromNullable(t.then(e));if(!r.isPresent())break;if((e=(r=r.flatMap()).value)instanceof n)return void this.transferIntoNewPromise(e)}this.appyFinally(),this.status=l.FULLFILLED}reject(e){for(;this.allFuncs.length&&!this.allFuncs[0].finally;){var t=this.allFuncs.shift();if(t.catch){var r=s.Optional.fromNullable(t.catch(e));if(r.isPresent()){if((e=(r=r.flatMap()).value)instanceof n)return void this.transferIntoNewPromise(e);this.status=l.REJECTED;break}break}}this.status=l.REJECTED,this.appyFinally()}transferIntoNewPromise(e){for(var t=0;t<this.allFuncs.length;t++)for(let r in this.allFuncs[t])e[r](this.allFuncs[t][r])}appyFinally(){for(;this.allFuncs.length;){var e=this.allFuncs.shift();e.finally&&e.finally()}}}class i extends n{constructor(e,t){super(e),this.cancellator=()=>{},this.cancellator=t}cancel(){this.status=l.REJECTED,this.appyFinally(),this.allFuncs=[]}then(e,t){return super.then(e,t)}catch(e){return super.catch(e)}finally(e){return super.finally(e)}}},function(e,t,r){"use strict";r.r(t),r.d(t,"ElementAttribute",(function(){return n})),r.d(t,"DomQuery",(function(){return i}));var l=r(1),s=r(0);class n{constructor(e,t,r=null){this.element=e,this.attributeName=t,this.defaultVal=r}set value(e){let t=this.element.get(0).orElse().values;for(let r=0;r<t.length;r++)t[r].setAttribute(this.attributeName,e);t[0].setAttribute(this.attributeName,e)}get value(){let e=this.element.get(0).orElse().values;return e.length?e[0].getAttribute(this.attributeName):this.defaultVal}}class i{constructor(...e){if(this.rootNode=[],!s.Optional.fromNullable(e).isAbsent()&&e.length)for(let t=0;t<e.length;t++)if(l.Lang.instance.isString(e[t])){let r=i.querySelectorAll(e[t]);r.isAbsent()||e.push(...r.values)}else if(e[t]instanceof i)this.rootNode.push(...e[t].values);else if(l.Lang.instance.isString(e[t])){let r=i.querySelectorAll(e[t]);this.rootNode.push(...r.values)}else this.rootNode.push(e[t])}get(e){return e<this.rootNode.length?new i(this.rootNode[e]):i.absent}getAsElem(e,t){return e<this.rootNode.length?s.Optional.fromNullable(this.rootNode[e]):t||s.Optional.absent}allElems(){return this.rootNode}isAbsent(){return 0==this.length}isPresent(){return!this.isAbsent()}delete(){this.eachElem(e=>{e.parentNode&&e.parentNode.removeChild(e)})}static querySelectorAll(e){return new i(document).querySelectorAll(e)}querySelectorAll(e){if(0==this.rootNode.length)return this;let t=[];for(let r=0;r<this.rootNode.length;r++){if(!this.rootNode[r].querySelectorAll)continue;let s=this.rootNode[r].querySelectorAll(e);t=t.concat(l.Lang.instance.objToArray(s))}return new i(...t)}static byId(e){return l.Lang.instance.isString(e)?new i(document).byId(e):new i(e)}static byTagName(e){return l.Lang.instance.isString(e)?new i(document).byTagName(e):new i(e)}byId(e,t){let r=[];for(let l=0;t&&l<this.rootNode.length;l++)this.rootNode[l].id==e&&r.push(new i(this.rootNode[l]));return r=r.concat(this.querySelectorAll("#"+e)),new i(...r)}byTagName(e,t){let r=[];for(let l=0;t&&l<this.rootNode.length;l++)this.rootNode[l].tagName==e&&r.push(new i(this.rootNode[l]));return r=r.concat(this.querySelectorAll(e)),new i(...r)}attr(e,t=null){return new n(this,e,t)}hasClass(e){let t=!1;return this.each(r=>{let l=r.attr("class").value||"";if(-1!=l.toLowerCase().indexOf(e.toLowerCase())){let r=l.split(/\s+/gi),s=!1;for(let t=0;t<r.length&&!s;t++)s=r[t].toLowerCase()==e.toLowerCase();if(t=t||s)return!1}}),t}addClass(e){return this.each(t=>{let r=t.attr("class").value||"";this.hasClass(e)||(t.attr("class").value=l.Lang.instance.trim(r+" "+e))}),this}removeClass(e){return this.each(t=>{if(this.hasClass(e)){let r=[],l=(t.attr("class").value||"").split(/\s+/gi);for(let t=0;t<l.length;t++)l[t].toLowerCase()!=e.toLowerCase()&&r.push(l[t]);t.attr("class").value=r.join(" ")}}),this}isMultipartCandidate(){return this.querySelectorAll("input[type='file']").firstElem().isPresent()}html(e){return s.Optional.fromNullable(e).isAbsent()?this.getAsElem(0).isPresent()?s.Optional.fromNullable(this.getAsElem(0).value.innerHTML):s.Optional.absent:(this.getAsElem(0).isPresent()&&(this.getAsElem(0).value.innerHTML=e),this)}getIf(...e){return this.querySelectorAll(" > "+e.join(">"))}get value(){return this.getAsElem(0)}get values(){return this.allElems()}get id(){return this.getAsElem(0).getIf("id")}get length(){return this.rootNode.length}get tagName(){return this.getAsElem(0).getIf("tagName")}get type(){return s.Optional.fromNullable(this.get(0).attr("type").value)}eachElem(e){for(let t=0,r=this.rootNode.length;t<r&&!1!==e(this.rootNode[t],t);t++);return this}firstElem(e=(e=>e)){return this.rootNode.length>1&&e(this.rootNode[0],0),this}each(e){for(let t=0,r=this.rootNode.length;t<r&&!1!==e(this.get(t),t);t++);return this}first(e=(e=>e)){return this.rootNode.length>1?(e(this.get(0),0),this.get(0)):this}filter(e){let t=[];return this.each(r=>{e(r)&&t.push(r)}),new i(...t)}globalEval(e,t){let r=document.getElementsByTagName("head")[0]||document.documentElement,l=document.createElement("script");return t&&l.setAttribute("nonce",t),l.type="text/javascript",l.text=e,r.insertBefore(l,r.firstChild),r.removeChild(l),this}static globalEval(e){return new i(document).globalEval(e)}detach(){return this.eachElem(e=>{e.parentNode.removeChild(e)}),this}appendTo(e){this.eachElem(t=>{e.getAsElem(0).get(s.Optional.fromNullable({appendChild:e=>{}})).value.appendChild(t)})}loadScriptEval(e,t,r,l,s){let n=new XMLHttpRequest;if(n.open("GET",e,!1),l&&n.setRequestHeader("Content-Type","application/x-javascript; charset:"+l),n.send(null),4!=n.readyState)throw Error("Loading of script "+e+" failed ");if(200!=n.status)throw Error(n.responseText);return(r?setTimeout((function(){this.globalEval(n.responseText+"\r\n//@ sourceURL="+e)}),1):this.globalEval(n.responseText.replace("\n","\r\n")+"\r\n//@ sourceURL="+e),this)}insertAfter(...e){let t=this.getAsElem(0).value;for(let r=0;r<e.length;r++)e[r].eachElem(e=>{t.parentNode.insertBefore(e,t.nextSibling),t=t.nextSibling,this.rootNode.push(e)});return this}insertBefore(...e){for(let t=0;t<e.length;t++)e[t].eachElem(e=>{this.getAsElem(0).value.parentNode.insertBefore(e,this.getAsElem(0).value),this.rootNode.push(e)});return this}orElse(...e){return this.isPresent()?this:new i(...e)}orElseLazy(e){return this.isPresent()?this:new i(e())}parents(e){let t=[];const r=e.toLowerCase();let l=e=>{e.tagName.toLowerCase()==r&&t.push(e)};return this.eachElem(r=>{for(;r.parentNode;)if(r=r.parentNode,l(r),"form"==e&&t.length)return!1}),new i(...t)}get childNodes(){let e=[];return this.eachElem(t=>{e=e.concat(l.Lang.instance.objToArray(t.childNodes))}),new i(...e)}copyAttrs(e){return e.eachElem(e=>{for(let t=0;t<e.attributes.length;t++){let r=e.attributes[t].value;r&&(this.attr(e.attributes[t].name).value=r)}}),this}subNodes(e,t){return s.Optional.fromNullable(t).isAbsent()&&(t=this.length),new i(...this.rootNode.slice(e,Math.min(t,this.length)))}outerHTML(e,t,r){let l=i.fromMarkup(e);this.getAsElem(0).value.parentNode.replaceChild(l.getAsElem(0).value,this.getAsElem(0).value),this.rootNode=[],this.rootNode=this.rootNode.concat(l.values);for(let e=1;e<l.length;e++)this.insertAfter(l.get(e));return t&&this.runScripts(),r&&this.runCss(),this}runScripts(e=(e=>-1==e.indexOf("ln=scripts")&&-1==e.indexOf("ln=javax.faces")||-1==e.indexOf("/jsf.js")&&-1==e.indexOf("/jsf-uncompressed.js"))){let t=l.Lang.instance,r=[],s=l=>{let s=l.tagName,n=l.type||"";if(s&&t.equalsIgnoreCase(s,"script")&&(""===n||t.equalsIgnoreCase(n,"text/javascript")||t.equalsIgnoreCase(n,"javascript")||t.equalsIgnoreCase(n,"text/ecmascript")||t.equalsIgnoreCase(n,"ecmascript"))){let t=l.getAttribute("src");if(void 0!==t&&null!=t&&t.length>0)e(t)&&(r.length&&(this.globalEval(r.join("\n")),r=[]),this.loadScriptEval(t,l.getAttribute("type"),!1,"UTF-8",!1));else{let e=l.text,t=!0;for(;t;)t=!1," "==e.substring(0,1)&&(e=e.substring(1),t=!0),"\x3c!--"==e.substring(0,4)&&(e=e.substring(4),t=!0),"//<![CDATA["==e.substring(0,11)&&(e=e.substring(11),t=!0);r.push(e)}}};try{let e=this.querySelectorAll("script");if(null==e)return;for(let t=0;t<e.length;t++)s(e.getAsElem(t).value);r.length&&this.globalEval(r.join("\n"))}catch(e){window.console&&window.console.error&&console.error(e.message||e.description)}finally{s=null}}runCss(){const e=l.Lang.instance,t=(e,t)=>{let r=document.createElement("style");document.getElementsByTagName("head")[0].appendChild(r);let l=r.sheet?r.sheet:r.styleSheet;r.setAttribute("rel",e.getAttribute("rel")||"stylesheet"),r.setAttribute("type",e.getAttribute("type")||"text/css"),void 0!==l.cssText?l.cssText=t:r.appendChild(document.createTextNode(t))},r=r=>{const l=e.equalsIgnoreCase,s=r.tagName;if(s&&l(s,"link")&&l(r.getAttribute("type"),"text/css"))t(r,"@import url('"+r.getAttribute("href")+"');");else if(s&&l(s,"style")&&l(r.getAttribute("type"),"text/css")){let e=[],l=r.childNodes;if(l){const t=l.length;for(let r=0;r<t;r++)e.push(l[r].innerHTML||l[r].data)}else r.innerHTML&&e.push(r.innerHTML);t(r,e.join(""))}},s=this.querySelectorAll("link, style");if(null!=s){for(let e=0;e<s.length;e++){r(s.getAsElem(e).value)}return this}}click(){return this.fireEvent("click"),this}addEventListener(e,t,r){return this.eachElem(l=>{l.addEventListener(e,t,r)}),this}removeEventListener(e,t,r){return this.eachElem(l=>{l.removeEventListener(e,t,r)}),this}fireEvent(e){this.eachElem(t=>{var r;if(t.ownerDocument)r=t.ownerDocument;else{if(9!=t.nodeType)throw new Error("Invalid node passed to fireEvent: "+t.id);r=t}if(t.dispatchEvent){var l="";switch(e){case"click":case"mousedown":case"mouseup":l="MouseEvents";break;case"focus":case"change":case"blur":case"select":l="HTMLEvents";break;default:throw"fireEvent: Couldn't find an event class for event '"+e+"'."}(s=r.createEvent(l)).initEvent(e,!0,!0),s.synthetic=!0,t.dispatchEvent(s)}else if(t.fireEvent){var s;(s=r.createEventObject()).synthetic=!0,t.fireEvent("on"+e,s)}})}static fromMarkup(e){let t=new i(document.createElement("div"));t.html("<table><tbody><tr><td>"+e+"</td></tr></tbody></table>");let r=t.querySelectorAll("td").get(0).childNodes;return r.detach(),t.html(""),r}encodeElement(e,t){if(!e.name)return;let r=e.name,l=e.tagName.toLowerCase(),s=e.type;if(null!=s&&(s=s.toLowerCase()),("input"==l||"textarea"==l||"select"==l)&&null!=r&&""!=r&&!e.disabled){if("select"==l&&e.selectedIndex>=0){let l=e.options.length;for(let s=0;s<l;s++)if(e.options[s].selected){let l=e.options[s];t[r]=null!=l.getAttribute("value")?l.getAttribute("value"):l.getAttribute("text")}}"select"!=l&&"button"!=s&&"reset"!=s&&"submit"!=s&&"image"!=s&&("checkbox"!=s&&"radio"!=s||e.checked)&&(void 0!==e.files&&null!=e.files&&e.files.length?t[r]=e.files[0]:t[r]=e.value)}}}i.absent=new i}])}));
//# sourceMappingURL=DomQuery.js.map