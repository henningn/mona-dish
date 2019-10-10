System.register([],(function(e){return{execute:function(){e(function(e){var t={};function r(s){if(t[s])return t[s].exports;var l=t[s]={i:s,l:!1,exports:{}};return e[s].call(l.exports,l,l.exports,r),l.l=!0,l.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)r.d(s,l,function(t){return e[t]}.bind(null,l));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=5)}([function(e,t,r){"use strict";r.r(t),r.d(t,"Monad",(function(){return s})),r.d(t,"Stream",(function(){return l})),r.d(t,"Optional",(function(){return n})),r.d(t,"Config",(function(){return a}));class s{constructor(e){this._value=e}map(e){e||(e=e=>e);let t=e(this.value);return new s(t)}flatMap(e){let t=this.map(e);for(;void 0!==t&&null!=t&&t.value instanceof s;)t=t.value;return t}get value(){return this._value}}class l{constructor(...e){this.value=e}static of(...e){return new l(...e)}each(e){for(let t=0;t<this.value.length&&!1!==e(this.value[t],t);t++);return this}map(e){e||(e=e=>e);let t=[];return this.each((r,s)=>{t.push(e(r))}),new l(...t)}flatMap(e){let t=this.map(e),r=this.mapStreams(t);return new l(...r)}filter(e){let t=[];return this.each(r=>{e(r)&&t.push(r)}),new l(...t)}reduce(e,t=null){let r=null!=t?0:1,s=null!=t?t:this.value.length?this.value[0]:null;for(let t=r;t<this.value.length;t++)s=e(s,this.value[t]);return n.fromNullable(s)}first(){return this.value&&this.value.length?n.fromNullable(this.value[0]):n.absent}last(){return n.fromNullable(this.value.length?this.value[this.value.length-1]:null)}anyMatch(e){for(let t=0;t<this.value.length;t++)if(e(this.value[t]))return!0;return!1}allMatch(e){if(!this.value.length)return!1;let t=0;for(let r=0;r<this.value.length;r++)e(this.value[r])&&t++;return t==this.value.length}noneMatch(e){let t=0;for(let r=0;r<this.value.length;r++)e(this.value[r])&&t++;return t==this.value.length}mapStreams(e){let t=[];return e.each(e=>{e instanceof l?t=t.concat(this.mapStreams(e)):t.push(e)}),t}}class n extends s{constructor(e){super(e)}static fromNullable(e){return new n(e)}isAbsent(){return void 0===this.value||null==this.value}isPresent(){return!this.isAbsent()}orElse(e){return this.isPresent()?this:null==e?n.absent:this.flatMap(()=>e)}orElseLazy(e){return this.isPresent()?this:this.flatMap(e)}flatMap(e){let t=super.flatMap(e);return t instanceof n?t.flatMap():n.fromNullable(t.value)}getIfPresent(e){return this.isAbsent()?this.getClass().absent:this.getClass().fromNullable(this.value[e]).flatMap()}getIf(...e){let t=this;for(let r=0;r<e.length;r++){let s=this.keyVal(e[r]),l=this.arrayIndex(e[r]);if(""===s&&l>=0){if((t=this.getClass().fromNullable(t.value instanceof Array?t.value.length<l?null:t.value[l]:null)).isAbsent())return t}else if(s&&l>=0){if(t.getIfPresent(s).isAbsent())return t;if((t=t.getIfPresent(s).value instanceof Array?this.getClass().fromNullable(t.getIfPresent(s).value[l]):this.getClass().absent).isAbsent())return t}else{if((t=t.getIfPresent(s)).isAbsent())return t;l>-1&&(t=this.getClass().fromNullable(t.value[l]))}}return t}get value(){return this._value instanceof s?this._value.flatMap().value:this._value}match(e){return!this.isAbsent()&&e(this.value)}get(e=n.absent){return this.isAbsent()?this.getClass().fromNullable(e).flatMap():this.getClass().fromNullable(this.value).flatMap()}getClass(){return n}toJson(){return JSON.stringify(this.value)}arrayIndex(e){let t=e.indexOf("["),r=e.indexOf("]");return t>=0&&r>0&&t<r?parseInt(e.substring(t+1,r)):-1}keyVal(e){let t=e.indexOf("[");return t>=0?e.substring(0,t):e}}n.absent=n.fromNullable(null);class i{constructor(e,t,r){this.rootElem=e,this.key=t,this.arrPos=void 0!==r?r:-1}get value(){return""==this.key&&this.arrPos>=0?this.rootElem[this.arrPos]:this.key&&this.arrPos>=0?this.rootElem[this.key][this.arrPos]:this.rootElem[this.key]}set value(e){""==this.key&&this.arrPos>=0?this.rootElem[this.arrPos]=e:this.key&&this.arrPos>=0?this.rootElem[this.key][this.arrPos]=e:this.rootElem[this.key]=e}}class a extends n{constructor(e){super(e)}static fromNullable(e){return new a(e)}apply(...e){if(e.length<1)return;this.buildPath(e);let t=this.keyVal(e[e.length-1]),r=this.arrayIndex(e[e.length-1]);return new i(1==e.length?this.value:this.getIf.apply(this,e.slice(0,e.length-1)).value,t,r)}applyIf(e,...t){return e?this.apply(t):{value:null}}getIf(...e){return this.getClass().fromNullable(super.getIf.apply(this,e).value)}get(e){return this.getClass().fromNullable(super.get(e).value)}delete(e){return e in this.value&&delete this.value[e],this}toJson(){return JSON.stringify(this.value)}get shallowCopy(){return new a(function(e,t=!0){let r={};return this.arrForEach(e,e=>{this.mixMaps(r,e,t)}),r}([{},this.value||{}]))}getClass(){return a}setVal(e){this._value=e}buildPath(e){let t=this,r=this.getClass().fromNullable(null),s=-1,l=function(e,t){if(e.length<t)for(let r=e.length;r<t;r++)e.push({})};for(let n=0;n<e.length;n++){let i=this.keyVal(e[n]),a=this.arrayIndex(e[n]);if(""===i&&a>=0){t.setVal(t.value instanceof Array?t.value:[]),l(t.value,a+1),s>=0&&(r.value[s]=t.value),r=t,s=a,t=this.getClass().fromNullable(t.value[a]);continue}let o=t.getIf(i);if(-1==a)o.isAbsent()?o=this.getClass().fromNullable(t.value[i]={}):t=o;else{let e=o.value instanceof Array?o.value:[];l(e,a+1),t.value[i]=e,o=this.getClass().fromNullable(e[a])}r=t,s=a,t=o}return this}}},function(e,t,r){"use strict";r.r(t),r.d(t,"Lang",(function(){return n}));var s=r(2),l=r(0);class n{static get instance(){return n._instance||(n._instance=new n),n._instance}strToArray(e,t=/\./gi){let r=e.split(t);for(let e=0;e<r.length;e++)r[e]=this.trim(r[e]);return r}arrToMap(e,t=0){var r=new Array(e.length),s=e.length;t=t||0;for(var l=0;l<s;l++)r[e[l]]=l+t;return r}trim(e){let t=/\s/,r=(e=e.replace(/^\s\s*/,"")).length;for(;t.test(e.charAt(--r)););return e.slice(0,r+1)}isString(e){return!!arguments.length&&null!=e&&("string"==typeof e||e instanceof String)}isFunc(e){return e instanceof Function||"function"==typeof e}hitch(e,t){return e?function(){return t.apply(e,arguments||[])}:t}mergeMaps(e,t=!0,r,s){let l={};return this.arrForEach(e,e=>{this.mixMaps(l,e,t)}),l}mixMaps(e,t,r,s,l){for(let n in t)t.hasOwnProperty(n)&&(s&&s[n]||l&&!l[n]||(e[n]=r?void 0!==t[n]?t[n]:e[n]:void 0!==e[n]?e[n]:t[n]));return e}objToArray(e,t,r){if(!e)return r||null;if(e instanceof Array&&!t&&!r)return e;let s=void 0!==t||null!=t?t:0,l=r||[];try{return l.concat(Array.prototype.slice.call(e,s))}catch(t){for(let t=s;t<e.length;t++)l.push(e[t]);return l}}arrForEach(e,t,r,s){if(!e||!e.length)return;let l=r||0,n=s,i=this.objToArray(e);r?i.slice(l).forEach(t,n):i.forEach(t,n)}contains(e,t){if(!e||!t)throw Error("null value on arr or str not allowed");return-1!=this.arrIndexOf(e,t)}arrIndexOf(e,t,r){if(!e||!e.length)return-1;let s=r||0;return(e=this.objToArray(e)).indexOf(t,s)}arrFilter(e,t,r,s){if(!e||!e.length)return[];let l=this.objToArray(e);return r?l.slice(r).filter(t,s):l.filter(t,s)}applyArgs(e,t,r){let s="undefined";if(r)for(let l=0;l<t.length;l++)s!=typeof e["_"+r[l]]&&(e["_"+r[l]]=t[l]),s!=typeof e[r[l]]&&(e[r[l]]=t[l]);else for(let r in t)t.hasOwnProperty(r)&&(s!=typeof e["_"+r]&&(e["_"+r]=t[r]),s!=typeof e[r]&&(e[r]=t[r]));return e}equalsIgnoreCase(e,t){return!e&&!t||!(!e||!t)&&e.toLowerCase()===t.toLowerCase()}timeout(e){let t=null;return new s.CancellablePromise((r,s)=>{t=setTimeout(()=>{r()},e)},()=>{t&&(clearTimeout(t),t=null)})}interval(e){let t=null;return new s.CancellablePromise((r,s)=>{t=setInterval(()=>{r()},e)},()=>{t&&(clearInterval(t),t=null)})}assertType(e,t){return this.isString(t)?typeof e==t:e instanceof t}static saveResolve(e,t=null){try{let r=e();return void 0===r||null==r?l.Optional.fromNullable(t):l.Optional.fromNullable(r)}catch(e){return l.Optional.absent}}}},function(e,t,r){"use strict";r.r(t),r.d(t,"PromiseStatus",(function(){return s})),r.d(t,"Promise",(function(){return n})),r.d(t,"CancellablePromise",(function(){return i}));var s,l=r(0);!function(e){e[e.PENDING=0]="PENDING",e[e.FULLFILLED=1]="FULLFILLED",e[e.REJECTED=2]="REJECTED"}(s||(s={}));class n{constructor(e){this.status=s.PENDING,this.allFuncs=[],this.value=e,this.value(e=>this.resolve(e),e=>this.reject(e))}static all(...e){let t,r=0,s=new n((e,r)=>{t=e}),l=()=>{r++,e.length==r&&t()};l.__last__=!0;for(let t=0;t<e.length;t++)e[t].finally(l);return s}static race(...e){let t,r,s=new n((e,s)=>{t=e,r=s}),l=()=>(t&&t(),t=null,r=null,null);l.__last__=!0;let i=()=>(r&&r(),r=null,t=null,null);i.__last__=!0;for(let t=0;t<e.length;t++)e[t].then(l),e[t].catch(i);return s}static reject(e){return new n((t,r)=>{e instanceof n?e.then(e=>{r(e)}):setTimeout(()=>{r(e)},1)})}static resolve(e){return new n((t,r)=>{e instanceof n?e.then(e=>t(e)):setTimeout(()=>{t(e)},1)})}then(e,t){return this.allFuncs.push({then:e}),t&&this.allFuncs.push({catch:t}),this.spliceLastFuncs(),this}catch(e){return this.allFuncs.push({catch:e}),this.spliceLastFuncs(),this}finally(e){if(!this.__reason__)return this.allFuncs.push({finally:e}),this.spliceLastFuncs(),this;this.__reason__.finally(e)}spliceLastFuncs(){let e=[],t=[];for(let r=0;r<this.allFuncs.length;r++)for(let s in this.allFuncs[r])this.allFuncs[r][s].__last__?e.push(this.allFuncs[r]):t.push(this.allFuncs[r]);this.allFuncs=t.concat(e)}resolve(e){for(;this.allFuncs.length&&this.allFuncs[0].then;){let t=this.allFuncs.shift(),r=l.Optional.fromNullable(t.then(e));if(!r.isPresent())break;if((e=(r=r.flatMap()).value)instanceof n)return void this.transferIntoNewPromise(e)}this.appyFinally(),this.status=s.FULLFILLED}reject(e){for(;this.allFuncs.length&&!this.allFuncs[0].finally;){var t=this.allFuncs.shift();if(t.catch){var r=l.Optional.fromNullable(t.catch(e));if(r.isPresent()){if((e=(r=r.flatMap()).value)instanceof n)return void this.transferIntoNewPromise(e);this.status=s.REJECTED;break}break}}this.status=s.REJECTED,this.appyFinally()}transferIntoNewPromise(e){for(var t=0;t<this.allFuncs.length;t++)for(let r in this.allFuncs[t])e[r](this.allFuncs[t][r])}appyFinally(){for(;this.allFuncs.length;){var e=this.allFuncs.shift();e.finally&&e.finally()}}}class i extends n{constructor(e,t){super(e),this.cancellator=()=>{},this.cancellator=t}cancel(){this.status=s.REJECTED,this.appyFinally(),this.allFuncs=[]}then(e,t){return super.then(e,t)}catch(e){return super.catch(e)}finally(e){return super.finally(e)}}},function(e,t,r){"use strict";r.r(t),r.d(t,"ElementAttribute",(function(){return n})),r.d(t,"DomQuery",(function(){return i}));var s=r(1),l=r(0);class n{constructor(e,t,r=null){this.element=e,this.attributeName=t,this.defaultVal=r}set value(e){let t=this.element.get(0).orElse().values;for(let r=0;r<t.length;r++)t[r].setAttribute(this.attributeName,e);t[0].setAttribute(this.attributeName,e)}get value(){let e=this.element.get(0).orElse().values;return e.length?e[0].getAttribute(this.attributeName):this.defaultVal}}class i{constructor(...e){if(this.rootNode=[],!l.Optional.fromNullable(e).isAbsent()&&e.length)for(let t=0;t<e.length;t++)if(s.Lang.instance.isString(e[t])){let r=i.querySelectorAll(e[t]);r.isAbsent()||e.push(...r.values)}else if(e[t]instanceof i)this.rootNode.push(...e[t].values);else if(s.Lang.instance.isString(e[t])){let r=i.querySelectorAll(e[t]);this.rootNode.push(...r.values)}else this.rootNode.push(e[t])}get(e){return e<this.rootNode.length?new i(this.rootNode[e]):i.absent}getAsElem(e,t){return e<this.rootNode.length?l.Optional.fromNullable(this.rootNode[e]):t||l.Optional.absent}allElems(){return this.rootNode}isAbsent(){return 0==this.length}isPresent(){return!this.isAbsent()}delete(){this.eachElem(e=>{e.parentNode&&e.parentNode.removeChild(e)})}static querySelectorAll(e){return new i(document).querySelectorAll(e)}querySelectorAll(e){if(0==this.rootNode.length)return this;let t=[];for(let r=0;r<this.rootNode.length;r++){if(!this.rootNode[r].querySelectorAll)continue;let l=this.rootNode[r].querySelectorAll(e);t=t.concat(s.Lang.instance.objToArray(l))}return new i(...t)}static byId(e){return s.Lang.instance.isString(e)?new i(document).byId(e):new i(e)}static byTagName(e){return s.Lang.instance.isString(e)?new i(document).byTagName(e):new i(e)}byId(e,t){let r=[];for(let s=0;t&&s<this.rootNode.length;s++)this.rootNode[s].id==e&&r.push(new i(this.rootNode[s]));return r=r.concat(this.querySelectorAll("#"+e)),new i(...r)}byTagName(e,t){let r=[];for(let s=0;t&&s<this.rootNode.length;s++)this.rootNode[s].tagName==e&&r.push(new i(this.rootNode[s]));return r=r.concat(this.querySelectorAll(e)),new i(...r)}attr(e,t=null){return new n(this,e,t)}hasClass(e){let t=!1;return this.each(r=>{let s=r.attr("class").value||"";if(-1!=s.toLowerCase().indexOf(e.toLowerCase())){let r=s.split(/\s+/gi),l=!1;for(let t=0;t<r.length&&!l;t++)l=r[t].toLowerCase()==e.toLowerCase();if(t=t||l)return!1}}),t}addClass(e){return this.each(t=>{let r=t.attr("class").value||"";this.hasClass(e)||(t.attr("class").value=s.Lang.instance.trim(r+" "+e))}),this}removeClass(e){return this.each(t=>{if(this.hasClass(e)){let r=[],s=(t.attr("class").value||"").split(/\s+/gi);for(let t=0;t<s.length;t++)s[t].toLowerCase()!=e.toLowerCase()&&r.push(s[t]);t.attr("class").value=r.join(" ")}}),this}isMultipartCandidate(){return this.querySelectorAll("input[type='file']").firstElem().isPresent()}html(e){return l.Optional.fromNullable(e).isAbsent()?this.getAsElem(0).isPresent()?l.Optional.fromNullable(this.getAsElem(0).value.innerHTML):l.Optional.absent:(this.getAsElem(0).isPresent()&&(this.getAsElem(0).value.innerHTML=e),this)}getIf(...e){return this.querySelectorAll(" > "+e.join(">"))}get value(){return this.getAsElem(0)}get values(){return this.allElems()}get id(){return this.getAsElem(0).getIf("id")}get length(){return this.rootNode.length}get tagName(){return this.getAsElem(0).getIf("tagName")}get type(){return l.Optional.fromNullable(this.get(0).attr("type").value)}eachElem(e){for(let t=0,r=this.rootNode.length;t<r&&!1!==e(this.rootNode[t],t);t++);return this}firstElem(e=(e=>e)){return this.rootNode.length>1&&e(this.rootNode[0],0),this}each(e){for(let t=0,r=this.rootNode.length;t<r&&!1!==e(this.get(t),t);t++);return this}first(e=(e=>e)){return this.rootNode.length>1?(e(this.get(0),0),this.get(0)):this}filter(e){let t=[];return this.each(r=>{e(r)&&t.push(r)}),new i(...t)}globalEval(e,t){let r=document.getElementsByTagName("head")[0]||document.documentElement,s=document.createElement("script");return t&&s.setAttribute("nonce",t),s.type="text/javascript",s.text=e,r.insertBefore(s,r.firstChild),r.removeChild(s),this}static globalEval(e){return new i(document).globalEval(e)}detach(){return this.eachElem(e=>{e.parentNode.removeChild(e)}),this}appendTo(e){this.eachElem(t=>{e.getAsElem(0).get(l.Optional.fromNullable({appendChild:e=>{}})).value.appendChild(t)})}loadScriptEval(e,t,r,s,l){let n=new XMLHttpRequest;if(n.open("GET",e,!1),s&&n.setRequestHeader("Content-Type","application/x-javascript; charset:"+s),n.send(null),4!=n.readyState)throw Error("Loading of script "+e+" failed ");if(200!=n.status)throw Error(n.responseText);return(r?setTimeout((function(){this.globalEval(n.responseText+"\r\n//@ sourceURL="+e)}),1):this.globalEval(n.responseText.replace("\n","\r\n")+"\r\n//@ sourceURL="+e),this)}insertAfter(...e){let t=this.getAsElem(0).value;for(let r=0;r<e.length;r++)e[r].eachElem(e=>{t.parentNode.insertBefore(e,t.nextSibling),t=t.nextSibling,this.rootNode.push(e)});return this}insertBefore(...e){for(let t=0;t<e.length;t++)e[t].eachElem(e=>{this.getAsElem(0).value.parentNode.insertBefore(e,this.getAsElem(0).value),this.rootNode.push(e)});return this}orElse(...e){return this.isPresent()?this:new i(...e)}orElseLazy(e){return this.isPresent()?this:new i(e())}parents(e){let t=[];const r=e.toLowerCase();let s=e=>{e.tagName.toLowerCase()==r&&t.push(e)};return this.eachElem(r=>{for(;r.parentNode;)if(r=r.parentNode,s(r),"form"==e&&t.length)return!1}),new i(...t)}get childNodes(){let e=[];return this.eachElem(t=>{e=e.concat(s.Lang.instance.objToArray(t.childNodes))}),new i(...e)}copyAttrs(e){return e.eachElem(e=>{for(let t=0;t<e.attributes.length;t++){let r=e.attributes[t].value;r&&(this.attr(e.attributes[t].name).value=r)}}),this}subNodes(e,t){return l.Optional.fromNullable(t).isAbsent()&&(t=this.length),new i(...this.rootNode.slice(e,Math.min(t,this.length)))}outerHTML(e,t,r){let s=i.fromMarkup(e);this.getAsElem(0).value.parentNode.replaceChild(s.getAsElem(0).value,this.getAsElem(0).value),this.rootNode=[],this.rootNode=this.rootNode.concat(s.values);for(let e=1;e<s.length;e++)this.insertAfter(s.get(e));return t&&this.runScripts(),r&&this.runCss(),this}runScripts(e=(e=>-1==e.indexOf("ln=scripts")&&-1==e.indexOf("ln=javax.faces")||-1==e.indexOf("/jsf.js")&&-1==e.indexOf("/jsf-uncompressed.js"))){let t=s.Lang.instance,r=[],l=s=>{let l=s.tagName,n=s.type||"";if(l&&t.equalsIgnoreCase(l,"script")&&(""===n||t.equalsIgnoreCase(n,"text/javascript")||t.equalsIgnoreCase(n,"javascript")||t.equalsIgnoreCase(n,"text/ecmascript")||t.equalsIgnoreCase(n,"ecmascript"))){let t=s.getAttribute("src");if(void 0!==t&&null!=t&&t.length>0)e(t)&&(r.length&&(this.globalEval(r.join("\n")),r=[]),this.loadScriptEval(t,s.getAttribute("type"),!1,"UTF-8",!1));else{let e=s.text,t=!0;for(;t;)t=!1," "==e.substring(0,1)&&(e=e.substring(1),t=!0),"\x3c!--"==e.substring(0,4)&&(e=e.substring(4),t=!0),"//<![CDATA["==e.substring(0,11)&&(e=e.substring(11),t=!0);r.push(e)}}};try{let e=this.querySelectorAll("script");if(null==e)return;for(let t=0;t<e.length;t++)l(e.getAsElem(t).value);r.length&&this.globalEval(r.join("\n"))}catch(e){window.console&&window.console.error&&console.error(e.message||e.description)}finally{l=null}}runCss(){const e=s.Lang.instance,t=(e,t)=>{let r=document.createElement("style");document.getElementsByTagName("head")[0].appendChild(r);let s=r.sheet?r.sheet:r.styleSheet;r.setAttribute("rel",e.getAttribute("rel")||"stylesheet"),r.setAttribute("type",e.getAttribute("type")||"text/css"),void 0!==s.cssText?s.cssText=t:r.appendChild(document.createTextNode(t))},r=r=>{const s=e.equalsIgnoreCase,l=r.tagName;if(l&&s(l,"link")&&s(r.getAttribute("type"),"text/css"))t(r,"@import url('"+r.getAttribute("href")+"');");else if(l&&s(l,"style")&&s(r.getAttribute("type"),"text/css")){let e=[],s=r.childNodes;if(s){const t=s.length;for(let r=0;r<t;r++)e.push(s[r].innerHTML||s[r].data)}else r.innerHTML&&e.push(r.innerHTML);t(r,e.join(""))}},l=this.querySelectorAll("link, style");if(null!=l){for(let e=0;e<l.length;e++){r(l.getAsElem(e).value)}return this}}click(){return this.fireEvent("click"),this}addEventListener(e,t,r){return this.eachElem(s=>{s.addEventListener(e,t,r)}),this}removeEventListener(e,t,r){return this.eachElem(s=>{s.removeEventListener(e,t,r)}),this}fireEvent(e){this.eachElem(t=>{var r;if(t.ownerDocument)r=t.ownerDocument;else{if(9!=t.nodeType)throw new Error("Invalid node passed to fireEvent: "+t.id);r=t}if(t.dispatchEvent){var s="";switch(e){case"click":case"mousedown":case"mouseup":s="MouseEvents";break;case"focus":case"change":case"blur":case"select":s="HTMLEvents";break;default:throw"fireEvent: Couldn't find an event class for event '"+e+"'."}(l=r.createEvent(s)).initEvent(e,!0,!0),l.synthetic=!0,t.dispatchEvent(l)}else if(t.fireEvent){var l;(l=r.createEventObject()).synthetic=!0,t.fireEvent("on"+e,l)}})}static fromMarkup(e){let t=new i(document.createElement("div"));t.html("<table><tbody><tr><td>"+e+"</td></tr></tbody></table>");let r=t.querySelectorAll("td").get(0).childNodes;return r.detach(),t.html(""),r}encodeElement(e,t){if(!e.name)return;let r=e.name,s=e.tagName.toLowerCase(),l=e.type;if(null!=l&&(l=l.toLowerCase()),("input"==s||"textarea"==s||"select"==s)&&null!=r&&""!=r&&!e.disabled){if("select"==s&&e.selectedIndex>=0){let s=e.options.length;for(let l=0;l<s;l++)if(e.options[l].selected){let s=e.options[l];t[r]=null!=s.getAttribute("value")?s.getAttribute("value"):s.getAttribute("text")}}"select"!=s&&"button"!=l&&"reset"!=l&&"submit"!=l&&"image"!=l&&("checkbox"!=l&&"radio"!=l||e.checked)&&(void 0!==e.files&&null!=e.files&&e.files.length?t[r]=e.files[0]:t[r]=e.value)}}}i.absent=new i},function(e,t,r){"use strict";r.r(t),r.d(t,"XMLQuery",(function(){return i}));var s=r(0),l=r(1),n=r(3);class i{constructor(...e){if(this.rootNode=[],!s.Optional.fromNullable(e).isAbsent())if(e[0]instanceof Array&&1==e.length)if(e[0][0]instanceof n.DomQuery)for(let t=0;t<e[0].length;t++)e[0][t].each(e=>{this.rootNode.push(e)});else this.rootNode=this.rootNode.concat(e[0]);else if(e[0]instanceof n.DomQuery)for(let t=0;t<e.length;t++)e[t].each(e=>{this.rootNode.push(e)});else this.rootNode=this.rootNode.concat(e)}static fromString(e){return i.parseXML(e)}static parseXML(e){return i._parseXML(e)}static _parseXML(e){let t;try{t=(new DOMParser).parseFromString(e,"text/xml")}catch(e){t=void 0}return new i(l.Lang.instance.objToArray(t.childNodes))}isAbsent(){return!this.rootNode.length}isPresent(){return!this.isAbsent()}get length(){return this.rootNode.length}_getIf(e,t,r){let s={},n=t[0].split(",");for(let e=0;e<n.length;e++)s[l.Lang.instance.trim(n[e])]=!0;if(1!=t.length)for(let n=0;r&&n<r.length;n++)("*"==t[0]||s[r[n].nodeName])&&this._getIf(e,t.slice(1,t.length),l.Lang.instance.objToArray(r[n].childNodes));else for(let l=0;r&&l<r.length;l++)("*"==t[0]||s[r[l].nodeName])&&e.push(r[l])}getIf(...e){this.rootNode;let t=[];for(let r=0;r<this.rootNode.length;r++)this._getIf(t,e,l.Lang.instance.objToArray(this.rootNode[r].childNodes));return new i(t)}get(e){return e>this.rootNode.length-1?i.absent:new i(this.rootNode[e])}get value(){return this.rootNode}get childNodes(){let e=[];return this.eachElem(t=>{e=e.concat(l.Lang.instance.objToArray(t.childNodes))}),new i(...e)}eachElem(e){for(let t=0,r=this.rootNode.length;t<r&&!1!==e(this.get(t).value[0],t);t++);return this}each(e){for(let t=0,r=this.rootNode.length;t<r&&!1!==e(this.get(t),t);t++);return this}_byTagName(e,t,r){if(t&&t.nodeName==r&&e.push(t),t.childNodes){let s=l.Lang.instance.objToArray(t.childNodes);for(let t=0;t<s.length;t++)this._byTagName(e,s[t],r)}}byTagName(e){let t=[];for(let r=0;r<this.rootNode.length;r++)this._byTagName(t,this.rootNode[r],e);return new i(t)}isXMLParserError(){return this.byTagName("parsererror").isPresent()}textContent(e){let t=[];return this.eachElem(e=>{t.push(e.textContent)}),t.join(e||" ")}parserErrorText(e){return this.byTagName("parsererror").textContent(e)}getAttribute(e){return 0==this.rootNode.length?s.Optional.absent:s.Optional.fromNullable(this.rootNode[0].getAttribute(e))}toString(){let e=[];return this.eachElem(t=>{void 0!==window.XMLSerializer?e.push((new window.XMLSerializer).serializeToString(t)):void 0!==t.xml&&e.push(t.xml)}),e.join("")}get cDATAAsString(){let e=[];return this.each(t=>{t.childNodes.eachElem(t=>{e.push(t.data)})}),e.join("")}}i.absent=new i},function(e,t,r){"use strict";r.r(t);var s=r(3);r.d(t,"DomQuery",(function(){return s.DomQuery})),r.d(t,"ElementAttribute",(function(){return s.ElementAttribute}));var l=r(1);r.d(t,"Lang",(function(){return l.Lang}));var n=r(0);r.d(t,"Config",(function(){return n.Config})),r.d(t,"Monad",(function(){return n.Monad})),r.d(t,"Optional",(function(){return n.Optional}));var i=r(2);r.d(t,"CancellablePromise",(function(){return i.CancellablePromise})),r.d(t,"Promise",(function(){return i.Promise})),r.d(t,"PromiseStatus",(function(){return i.PromiseStatus}));var a=r(4);r.d(t,"XMLQuery",(function(){return a.XMLQuery}))}]))}}}));
//# sourceMappingURL=index.js.map