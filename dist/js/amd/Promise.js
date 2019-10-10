define((function(){return function(t){var e={};function l(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,l),n.l=!0,n.exports}return l.m=t,l.c=e,l.d=function(t,e,s){l.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},l.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},l.t=function(t,e){if(1&e&&(t=l(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(l.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)l.d(s,n,function(e){return t[e]}.bind(null,n));return s},l.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return l.d(e,"a",e),e},l.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},l.p="",l(l.s=2)}([function(t,e,l){"use strict";l.r(e),l.d(e,"Monad",(function(){return s})),l.d(e,"Stream",(function(){return n})),l.d(e,"Optional",(function(){return r})),l.d(e,"Config",(function(){return i}));class s{constructor(t){this._value=t}map(t){t||(t=t=>t);let e=t(this.value);return new s(e)}flatMap(t){let e=this.map(t);for(;void 0!==e&&null!=e&&e.value instanceof s;)e=e.value;return e}get value(){return this._value}}class n{constructor(...t){this.value=t}static of(...t){return new n(...t)}each(t){for(let e=0;e<this.value.length&&!1!==t(this.value[e],e);e++);return this}map(t){t||(t=t=>t);let e=[];return this.each((l,s)=>{e.push(t(l))}),new n(...e)}flatMap(t){let e=this.map(t),l=this.mapStreams(e);return new n(...l)}filter(t){let e=[];return this.each(l=>{t(l)&&e.push(l)}),new n(...e)}reduce(t,e=null){let l=null!=e?0:1,s=null!=e?e:this.value.length?this.value[0]:null;for(let e=l;e<this.value.length;e++)s=t(s,this.value[e]);return r.fromNullable(s)}first(){return this.value&&this.value.length?r.fromNullable(this.value[0]):r.absent}last(){return r.fromNullable(this.value.length?this.value[this.value.length-1]:null)}anyMatch(t){for(let e=0;e<this.value.length;e++)if(t(this.value[e]))return!0;return!1}allMatch(t){if(!this.value.length)return!1;let e=0;for(let l=0;l<this.value.length;l++)t(this.value[l])&&e++;return e==this.value.length}noneMatch(t){let e=0;for(let l=0;l<this.value.length;l++)t(this.value[l])&&e++;return e==this.value.length}mapStreams(t){let e=[];return t.each(t=>{t instanceof n?e=e.concat(this.mapStreams(t)):e.push(t)}),e}}class r extends s{constructor(t){super(t)}static fromNullable(t){return new r(t)}isAbsent(){return void 0===this.value||null==this.value}isPresent(){return!this.isAbsent()}orElse(t){return this.isPresent()?this:null==t?r.absent:this.flatMap(()=>t)}orElseLazy(t){return this.isPresent()?this:this.flatMap(t)}flatMap(t){let e=super.flatMap(t);return e instanceof r?e.flatMap():r.fromNullable(e.value)}getIfPresent(t){return this.isAbsent()?this.getClass().absent:this.getClass().fromNullable(this.value[t]).flatMap()}getIf(...t){let e=this;for(let l=0;l<t.length;l++){let s=this.keyVal(t[l]),n=this.arrayIndex(t[l]);if(""===s&&n>=0){if((e=this.getClass().fromNullable(e.value instanceof Array?e.value.length<n?null:e.value[n]:null)).isAbsent())return e}else if(s&&n>=0){if(e.getIfPresent(s).isAbsent())return e;if((e=e.getIfPresent(s).value instanceof Array?this.getClass().fromNullable(e.getIfPresent(s).value[n]):this.getClass().absent).isAbsent())return e}else{if((e=e.getIfPresent(s)).isAbsent())return e;n>-1&&(e=this.getClass().fromNullable(e.value[n]))}}return e}get value(){return this._value instanceof s?this._value.flatMap().value:this._value}match(t){return!this.isAbsent()&&t(this.value)}get(t=r.absent){return this.isAbsent()?this.getClass().fromNullable(t).flatMap():this.getClass().fromNullable(this.value).flatMap()}getClass(){return r}toJson(){return JSON.stringify(this.value)}arrayIndex(t){let e=t.indexOf("["),l=t.indexOf("]");return e>=0&&l>0&&e<l?parseInt(t.substring(e+1,l)):-1}keyVal(t){let e=t.indexOf("[");return e>=0?t.substring(0,e):t}}r.absent=r.fromNullable(null);class a{constructor(t,e,l){this.rootElem=t,this.key=e,this.arrPos=void 0!==l?l:-1}get value(){return""==this.key&&this.arrPos>=0?this.rootElem[this.arrPos]:this.key&&this.arrPos>=0?this.rootElem[this.key][this.arrPos]:this.rootElem[this.key]}set value(t){""==this.key&&this.arrPos>=0?this.rootElem[this.arrPos]=t:this.key&&this.arrPos>=0?this.rootElem[this.key][this.arrPos]=t:this.rootElem[this.key]=t}}class i extends r{constructor(t){super(t)}static fromNullable(t){return new i(t)}apply(...t){if(t.length<1)return;this.buildPath(t);let e=this.keyVal(t[t.length-1]),l=this.arrayIndex(t[t.length-1]);return new a(1==t.length?this.value:this.getIf.apply(this,t.slice(0,t.length-1)).value,e,l)}applyIf(t,...e){return t?this.apply(e):{value:null}}getIf(...t){return this.getClass().fromNullable(super.getIf.apply(this,t).value)}get(t){return this.getClass().fromNullable(super.get(t).value)}delete(t){return t in this.value&&delete this.value[t],this}toJson(){return JSON.stringify(this.value)}get shallowCopy(){return new i(function(t,e=!0){let l={};return this.arrForEach(t,t=>{this.mixMaps(l,t,e)}),l}([{},this.value||{}]))}getClass(){return i}setVal(t){this._value=t}buildPath(t){let e=this,l=this.getClass().fromNullable(null),s=-1,n=function(t,e){if(t.length<e)for(let l=t.length;l<e;l++)t.push({})};for(let r=0;r<t.length;r++){let a=this.keyVal(t[r]),i=this.arrayIndex(t[r]);if(""===a&&i>=0){e.setVal(e.value instanceof Array?e.value:[]),n(e.value,i+1),s>=0&&(l.value[s]=e.value),l=e,s=i,e=this.getClass().fromNullable(e.value[i]);continue}let u=e.getIf(a);if(-1==i)u.isAbsent()?u=this.getClass().fromNullable(e.value[a]={}):e=u;else{let t=u.value instanceof Array?u.value:[];n(t,i+1),e.value[a]=t,u=this.getClass().fromNullable(t[i])}l=e,s=i,e=u}return this}}},,function(t,e,l){"use strict";l.r(e),l.d(e,"PromiseStatus",(function(){return s})),l.d(e,"Promise",(function(){return r})),l.d(e,"CancellablePromise",(function(){return a}));var s,n=l(0);!function(t){t[t.PENDING=0]="PENDING",t[t.FULLFILLED=1]="FULLFILLED",t[t.REJECTED=2]="REJECTED"}(s||(s={}));class r{constructor(t){this.status=s.PENDING,this.allFuncs=[],this.value=t,this.value(t=>this.resolve(t),t=>this.reject(t))}static all(...t){let e,l=0,s=new r((t,l)=>{e=t}),n=()=>{l++,t.length==l&&e()};n.__last__=!0;for(let e=0;e<t.length;e++)t[e].finally(n);return s}static race(...t){let e,l,s=new r((t,s)=>{e=t,l=s}),n=()=>(e&&e(),e=null,l=null,null);n.__last__=!0;let a=()=>(l&&l(),l=null,e=null,null);a.__last__=!0;for(let e=0;e<t.length;e++)t[e].then(n),t[e].catch(a);return s}static reject(t){return new r((e,l)=>{t instanceof r?t.then(t=>{l(t)}):setTimeout(()=>{l(t)},1)})}static resolve(t){return new r((e,l)=>{t instanceof r?t.then(t=>e(t)):setTimeout(()=>{e(t)},1)})}then(t,e){return this.allFuncs.push({then:t}),e&&this.allFuncs.push({catch:e}),this.spliceLastFuncs(),this}catch(t){return this.allFuncs.push({catch:t}),this.spliceLastFuncs(),this}finally(t){if(!this.__reason__)return this.allFuncs.push({finally:t}),this.spliceLastFuncs(),this;this.__reason__.finally(t)}spliceLastFuncs(){let t=[],e=[];for(let l=0;l<this.allFuncs.length;l++)for(let s in this.allFuncs[l])this.allFuncs[l][s].__last__?t.push(this.allFuncs[l]):e.push(this.allFuncs[l]);this.allFuncs=e.concat(t)}resolve(t){for(;this.allFuncs.length&&this.allFuncs[0].then;){let e=this.allFuncs.shift(),l=n.Optional.fromNullable(e.then(t));if(!l.isPresent())break;if((t=(l=l.flatMap()).value)instanceof r)return void this.transferIntoNewPromise(t)}this.appyFinally(),this.status=s.FULLFILLED}reject(t){for(;this.allFuncs.length&&!this.allFuncs[0].finally;){var e=this.allFuncs.shift();if(e.catch){var l=n.Optional.fromNullable(e.catch(t));if(l.isPresent()){if((t=(l=l.flatMap()).value)instanceof r)return void this.transferIntoNewPromise(t);this.status=s.REJECTED;break}break}}this.status=s.REJECTED,this.appyFinally()}transferIntoNewPromise(t){for(var e=0;e<this.allFuncs.length;e++)for(let l in this.allFuncs[e])t[l](this.allFuncs[e][l])}appyFinally(){for(;this.allFuncs.length;){var t=this.allFuncs.shift();t.finally&&t.finally()}}}class a extends r{constructor(t,e){super(t),this.cancellator=()=>{},this.cancellator=e}cancel(){this.status=s.REJECTED,this.appyFinally(),this.allFuncs=[]}then(t,e){return super.then(t,e)}catch(t){return super.catch(t)}finally(t){return super.finally(t)}}}])}));
//# sourceMappingURL=Promise.js.map