!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var l=e();for(var r in l)("object"==typeof exports?exports:t)[r]=l[r]}}(window,(function(){return function(t){var e={};function l(r){if(e[r])return e[r].exports;var s=e[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,l),s.l=!0,s.exports}return l.m=t,l.c=e,l.d=function(t,e,r){l.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},l.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},l.t=function(t,e){if(1&e&&(t=l(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(l.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)l.d(r,s,function(e){return t[e]}.bind(null,s));return r},l.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return l.d(e,"a",e),e},l.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},l.p="",l(l.s=3)}([function(t,e,l){"use strict";l.r(e),l.d(e,"Monad",(function(){return s})),l.d(e,"Optional",(function(){return n})),l.d(e,"ValueEmbedder",(function(){return a})),l.d(e,"Config",(function(){return u}));var r=l(1);class s{constructor(t){this._value=t}get value(){return this._value}map(t){t||(t=t=>t);let e=t(this.value);return new s(e)}flatMap(t){let e=this.map(t);for(;void 0!==e&&null!=e&&e.value instanceof s;)e=e.value;return e}}class n extends s{constructor(t){super(t)}get value(){return this._value instanceof s?this._value.flatMap().value:this._value}static fromNullable(t){return new n(t)}isAbsent(){return void 0===this.value||null==this.value}isPresent(t){let e=this.isAbsent();return!e&&t&&t.call(this,this),!e}ifPresentLazy(t=(()=>{})){return this.isPresent.call(this,t),this}orElse(t){return this.isPresent()?this:null==t?n.absent:this.flatMap(()=>t)}orElseLazy(t){return this.isPresent()?this:this.flatMap(t)}flatMap(t){let e=super.flatMap(t);return e instanceof n?e.flatMap():n.fromNullable(e.value)}getIf(...t){let e=this;for(let l=0;l<t.length;l++){let r=this.keyVal(t[l]),s=this.arrayIndex(t[l]);if(""===r&&s>=0){if((e=this.getClass().fromNullable(e.value instanceof Array?e.value.length<s?null:e.value[s]:null)).isAbsent())return e}else if(r&&s>=0){if(e.getIfPresent(r).isAbsent())return e;if((e=e.getIfPresent(r).value instanceof Array?this.getClass().fromNullable(e.getIfPresent(r).value[s]):this.getClass().absent).isAbsent())return e}else{if((e=e.getIfPresent(r)).isAbsent())return e;s>-1&&(e=this.getClass().fromNullable(e.value[s]))}}return e}match(t){return!this.isAbsent()&&t(this.value)}get(t=n.absent){return this.isAbsent()?this.getClass().fromNullable(t).flatMap():this.getClass().fromNullable(this.value).flatMap()}toJson(){return JSON.stringify(this.value)}getClass(){return n}arrayIndex(t){let e=t.indexOf("["),l=t.indexOf("]");return e>=0&&l>0&&e<l?parseInt(t.substring(e+1,l)):-1}keyVal(t){let e=t.indexOf("[");return e>=0?t.substring(0,e):t}getIfPresent(t){return this.isAbsent()?this.getClass().absent:this.getClass().fromNullable(this.value[t]).flatMap()}}n.absent=n.fromNullable(null);class a extends n{constructor(t,e="value"){super(t),this.key=e}get value(){return this._value?this._value[this.key]:null}set value(t){this._value&&(this._value[this.key]=t)}orElse(t){let e={};return e[this.key]=t,this.isPresent()?this:new a(e,this.key)}orElseLazy(t){if(this.isPresent())return this;{let e={};return e[this.key]=t(),new a(e,this.key)}}getClass(){return a}static fromNullable(t,e="value"){return new a(t,e)}}a.absent=a.fromNullable(null);class i extends a{constructor(t,e,l){super(t,e),this.arrPos=void 0!==l?l:-1}get value(){return""==this.key&&this.arrPos>=0?this._value[this.arrPos]:this.key&&this.arrPos>=0?this._value[this.key][this.arrPos]:this._value[this.key]}set value(t){""==this.key&&this.arrPos>=0?this._value[this.arrPos]=t:this.key&&this.arrPos>=0?this._value[this.key][this.arrPos]=t:this._value[this.key]=t}}i.absent=i.fromNullable(null);class u extends n{constructor(t){super(t)}get shallowCopy(){return new u(r.Lang.instance.mergeMaps([{},this.value||{}]))}static fromNullable(t){return new u(t)}shallowMerge(t,e=!0){for(let l in t.value)e&&l in this.value?this.apply(l).value=t.getIf(l).value:l in this.value||(this.apply(l).value=t.getIf(l).value)}apply(...t){if(t.length<1)return;this.buildPath(t);let e=this.keyVal(t[t.length-1]),l=this.arrayIndex(t[t.length-1]);return new i(1==t.length?this.value:this.getIf.apply(this,t.slice(0,t.length-1)).value,e,l)}applyIf(t,...e){return t?this.apply(...e):{value:null}}getIf(...t){return this.getClass().fromNullable(super.getIf.apply(this,t).value)}get(t){return this.getClass().fromNullable(super.get(t).value)}delete(t){return t in this.value&&delete this.value[t],this}toJson(){return JSON.stringify(this.value)}getClass(){return u}setVal(t){this._value=t}buildPath(t){let e=this,l=this.getClass().fromNullable(null),r=-1,s=function(t,e){if(t.length<e)for(let l=t.length;l<e;l++)t.push({})};for(let n=0;n<t.length;n++){let a=this.keyVal(t[n]),i=this.arrayIndex(t[n]);if(""===a&&i>=0){e.setVal(e.value instanceof Array?e.value:[]),s(e.value,i+1),r>=0&&(l.value[r]=e.value),l=e,r=i,e=this.getClass().fromNullable(e.value[i]);continue}let u=e.getIf(a);if(-1==i)u.isAbsent()?u=this.getClass().fromNullable(e.value[a]={}):e=u;else{let t=u.value instanceof Array?u.value:[];s(t,i+1),e.value[a]=t,u=this.getClass().fromNullable(t[i])}l=e,r=i,e=u}return this}}},function(t,e,l){"use strict";l.r(e),l.d(e,"Lang",(function(){return n}));var r=l(2),s=l(0);class n{static get instance(){return n._instance||(n._instance=new n),n._instance}static saveResolve(t,e=null){try{let l=t();return void 0===l||null==l?s.Optional.fromNullable(e):s.Optional.fromNullable(l)}catch(t){return s.Optional.absent}}static saveResolveLazy(t,e=null){try{let l=t();return void 0===l||null==l?s.Optional.fromNullable(e()):s.Optional.fromNullable(l)}catch(t){return s.Optional.absent}}strToArray(t,e=/\./gi){let l=t.split(e);for(let t=0;t<l.length;t++)l[t]=this.trim(l[t]);return l}arrToMap(t,e=0){var l=new Array(t.length),r=t.length;e=e||0;for(var s=0;s<r;s++)l[t[s]]=s+e;return l}trim(t){let e=/\s/,l=(t=t.replace(/^\s\s*/,"")).length;for(;e.test(t.charAt(--l)););return t.slice(0,l+1)}isString(t){return!!arguments.length&&null!=t&&("string"==typeof t||t instanceof String)}isFunc(t){return t instanceof Function||"function"==typeof t}hitch(t,e){return t?function(){return e.apply(t,arguments||[])}:e}mergeMaps(t,e=!0,l=(t=>!1),r=(t=>!0)){let s={};return this.arrForEach(t,t=>{this.mixMaps(s,t,e,l,r)}),s}mixMaps(t,e,l,r,s){for(let n in e)e.hasOwnProperty(n)&&(r&&r(n)||s&&!s(n)||(t[n]=l?void 0!==e[n]?e[n]:t[n]:void 0!==t[n]?t[n]:e[n]));return t}objToArray(t,e,l){if(!t)return l||null;if(t instanceof Array&&!e&&!l)return t;let r=void 0!==e||null!=e?e:0,s=l||[];try{return s.concat(Array.prototype.slice.call(t,r))}catch(e){for(let e=r;e<t.length;e++)s.push(t[e]);return s}}arrForEach(t,e,l,r){if(!t||!t.length)return;let s=l||0,n=r,a=this.objToArray(t);l?a.slice(s).forEach(e,n):a.forEach(e,n)}contains(t,e){if(!t||!e)throw Error("null value on arr or str not allowed");return-1!=this.arrIndexOf(t,e)}arrIndexOf(t,e,l){if(!t||!t.length)return-1;let r=l||0;return(t=this.objToArray(t)).indexOf(e,r)}arrFilter(t,e,l,r){if(!t||!t.length)return[];let s=this.objToArray(t);return l?s.slice(l).filter(e,r):s.filter(e,r)}applyArgs(t,e,l){let r="undefined";if(l)for(let s=0;s<e.length;s++)r!=typeof t["_"+l[s]]&&(t["_"+l[s]]=e[s]),r!=typeof t[l[s]]&&(t[l[s]]=e[s]);else for(let l in e)e.hasOwnProperty(l)&&(r!=typeof t["_"+l]&&(t["_"+l]=e[l]),r!=typeof t[l]&&(t[l]=e[l]));return t}equalsIgnoreCase(t,e){return!t&&!e||!(!t||!e)&&t.toLowerCase()===e.toLowerCase()}timeout(t){let e=null;return new r.CancellablePromise((l,r)=>{e=setTimeout(()=>{l()},t)},()=>{e&&(clearTimeout(e),e=null)})}interval(t){let e=null;return new r.CancellablePromise((l,r)=>{e=setInterval(()=>{l()},t)},()=>{e&&(clearInterval(e),e=null)})}assertType(t,e){return this.isString(e)?typeof t==e:t instanceof e}}},function(t,e,l){"use strict";l.r(e),l.d(e,"PromiseStatus",(function(){return r})),l.d(e,"Promise",(function(){return n})),l.d(e,"CancellablePromise",(function(){return a}));var r,s=l(0);!function(t){t[t.PENDING=0]="PENDING",t[t.FULLFILLED=1]="FULLFILLED",t[t.REJECTED=2]="REJECTED"}(r||(r={}));class n{constructor(t){this.status=r.PENDING,this.allFuncs=[],this.value=t,this.value(t=>this.resolve(t),t=>this.reject(t))}static all(...t){let e,l=0,r=new n((t,l)=>{e=t}),s=()=>{l++,t.length==l&&e()};s.__last__=!0;for(let e=0;e<t.length;e++)t[e].finally(s);return r}static race(...t){let e,l,r=new n((t,r)=>{e=t,l=r}),s=()=>(e&&e(),e=null,l=null,null);s.__last__=!0;let a=()=>(l&&l(),l=null,e=null,null);a.__last__=!0;for(let e=0;e<t.length;e++)t[e].then(s),t[e].catch(a);return r}static reject(t){return new n((e,l)=>{t instanceof n?t.then(t=>{l(t)}):setTimeout(()=>{l(t)},1)})}static resolve(t){return new n((e,l)=>{t instanceof n?t.then(t=>e(t)):setTimeout(()=>{e(t)},1)})}then(t,e){return this.allFuncs.push({then:t}),e&&this.allFuncs.push({catch:e}),this.spliceLastFuncs(),this}catch(t){return this.allFuncs.push({catch:t}),this.spliceLastFuncs(),this}finally(t){if(!this.__reason__)return this.allFuncs.push({finally:t}),this.spliceLastFuncs(),this;this.__reason__.finally(t)}resolve(t){for(;this.allFuncs.length&&this.allFuncs[0].then;){let e=this.allFuncs.shift(),l=s.Optional.fromNullable(e.then(t));if(!l.isPresent())break;if((t=(l=l.flatMap()).value)instanceof n)return void this.transferIntoNewPromise(t)}this.appyFinally(),this.status=r.FULLFILLED}reject(t){for(;this.allFuncs.length&&!this.allFuncs[0].finally;){var e=this.allFuncs.shift();if(e.catch){var l=s.Optional.fromNullable(e.catch(t));if(l.isPresent()){if((t=(l=l.flatMap()).value)instanceof n)return void this.transferIntoNewPromise(t);this.status=r.REJECTED;break}break}}this.status=r.REJECTED,this.appyFinally()}appyFinally(){for(;this.allFuncs.length;){var t=this.allFuncs.shift();t.finally&&t.finally()}}spliceLastFuncs(){let t=[],e=[];for(let l=0;l<this.allFuncs.length;l++)for(let r in this.allFuncs[l])this.allFuncs[l][r].__last__?t.push(this.allFuncs[l]):e.push(this.allFuncs[l]);this.allFuncs=e.concat(t)}transferIntoNewPromise(t){for(var e=0;e<this.allFuncs.length;e++)for(let l in this.allFuncs[e])t[l](this.allFuncs[e][l])}}class a extends n{constructor(t,e){super(t),this.cancellator=()=>{},this.cancellator=e}cancel(){this.status=r.REJECTED,this.appyFinally(),this.allFuncs=[]}then(t,e){return super.then(t,e)}catch(t){return super.catch(t)}finally(t){return super.finally(t)}}},function(t,e,l){"use strict";l.r(e),l.d(e,"Stream",(function(){return s})),l.d(e,"ArrayCollector",(function(){return n}));var r=l(0);class s{constructor(...t){this.value=t}static of(...t){return new s(...t)}onElem(t){for(let e=0;e<this.value.length&&!1!==t(this.value[e],e);e++);return this}each(t){this.onElem(t)}map(t){t||(t=t=>t);let e=[];return this.each((l,r)=>{e.push(t(l))}),new s(...e)}flatMap(t){let e=this.map(t),l=this.mapStreams(e);return new s(...l)}filter(t){let e=[];return this.each(l=>{t(l)&&e.push(l)}),new s(...e)}reduce(t,e=null){let l=null!=e?0:1,s=null!=e?e:this.value.length?this.value[0]:null;for(let e=l;e<this.value.length;e++)s=t(s,this.value[e]);return r.Optional.fromNullable(s)}first(){return this.value&&this.value.length?r.Optional.fromNullable(this.value[0]):r.Optional.absent}last(){return r.Optional.fromNullable(this.value.length?this.value[this.value.length-1]:null)}anyMatch(t){for(let e=0;e<this.value.length;e++)if(t(this.value[e]))return!0;return!1}allMatch(t){if(!this.value.length)return!1;let e=0;for(let l=0;l<this.value.length;l++)t(this.value[l])&&e++;return e==this.value.length}noneMatch(t){let e=0;for(let l=0;l<this.value.length;l++)t(this.value[l])&&e++;return e==this.value.length}collect(t){return this.each(e=>t.collect(e)),t.finalValue}mapStreams(t){let e=[];return t.each(t=>{t instanceof s?e=e.concat(this.mapStreams(t)):e.push(t)}),e}}class n{constructor(){this.data=[]}collect(t){this.data.push(t)}get finalValue(){return this.data}}}])}));
//# sourceMappingURL=Stream.js.map