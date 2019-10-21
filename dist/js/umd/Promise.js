!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),i=this&&this.__read||function(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var r,o,i=n.call(t),l=[];try{for(;(void 0===e||e-- >0)&&!(r=i.next()).done;)l.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return l},l=this&&this.__spread||function(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(i(arguments[e]));return t};Object.defineProperty(e,"__esModule",{value:!0});var a=n(1),u=function(){function t(t){this._value=t}return Object.defineProperty(t.prototype,"value",{get:function(){return this._value},enumerable:!0,configurable:!0}),t.prototype.map=function(e){return e||(e=function(t){return t}),new t(e(this.value))},t.prototype.flatMap=function(e){for(var n=this.map(e);void 0!==n&&null!=n&&n.value instanceof t;)n=n.value;return n},t}();e.Monad=u;var s=function(t){function e(e){return t.call(this,e)||this}return o(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return this._value instanceof u?this._value.flatMap().value:this._value},enumerable:!0,configurable:!0}),e.fromNullable=function(t){return new e(t)},e.prototype.isAbsent=function(){return void 0===this.value||null==this.value},e.prototype.isPresent=function(t){var e=this.isAbsent();return!e&&t&&t.call(this,this),!e},e.prototype.ifPresentLazy=function(t){return void 0===t&&(t=function(){}),this.isPresent.call(this,t),this},e.prototype.orElse=function(t){return this.isPresent()?this:null==t?e.absent:this.flatMap((function(){return t}))},e.prototype.orElseLazy=function(t){return this.isPresent()?this:this.flatMap(t)},e.prototype.flatMap=function(n){var r=t.prototype.flatMap.call(this,n);return r instanceof e?r.flatMap():e.fromNullable(r.value)},e.prototype.getIf=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=this,r=0;r<t.length;r++){var o=this.keyVal(t[r]),i=this.arrayIndex(t[r]);if(""===o&&i>=0){if((n=this.getClass().fromNullable(n.value instanceof Array?n.value.length<i?null:n.value[i]:null)).isAbsent())return n}else if(o&&i>=0){if(n.getIfPresent(o).isAbsent())return n;if((n=n.getIfPresent(o).value instanceof Array?this.getClass().fromNullable(n.getIfPresent(o).value[i]):this.getClass().absent).isAbsent())return n}else{if((n=n.getIfPresent(o)).isAbsent())return n;i>-1&&(n=this.getClass().fromNullable(n.value[i]))}}return n},e.prototype.match=function(t){return!this.isAbsent()&&t(this.value)},e.prototype.get=function(t){return void 0===t&&(t=e.absent),this.isAbsent()?this.getClass().fromNullable(t).flatMap():this.getClass().fromNullable(this.value).flatMap()},e.prototype.toJson=function(){return JSON.stringify(this.value)},e.prototype.getClass=function(){return e},e.prototype.arrayIndex=function(t){var e=t.indexOf("["),n=t.indexOf("]");return e>=0&&n>0&&e<n?parseInt(t.substring(e+1,n)):-1},e.prototype.keyVal=function(t){var e=t.indexOf("[");return e>=0?t.substring(0,e):t},e.prototype.getIfPresent=function(t){return this.isAbsent()?this.getClass().absent:this.getClass().fromNullable(this.value[t]).flatMap()},e.prototype.resolve=function(t){if(this.isAbsent())return e.absent;try{return e.fromNullable(t(this.value))}catch(t){return e.absent}},e.absent=e.fromNullable(null),e}(u);e.Optional=s;var f=function(t){function e(e,n){void 0===n&&(n="value");var r=t.call(this,e)||this;return r.key=n,r}return o(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return this._value?this._value[this.key]:null},set:function(t){this._value&&(this._value[this.key]=t)},enumerable:!0,configurable:!0}),e.prototype.orElse=function(t){var n={};return n[this.key]=t,this.isPresent()?this:new e(n,this.key)},e.prototype.orElseLazy=function(t){if(this.isPresent())return this;var n={};return n[this.key]=t(),new e(n,this.key)},e.prototype.getClass=function(){return e},e.fromNullable=function(t,n){return void 0===n&&(n="value"),new e(t,n)},e.absent=e.fromNullable(null),e}(s);e.ValueEmbedder=f;var c=function(t){function e(e,n,r){var o=t.call(this,e,n)||this;return o.arrPos=void 0!==r?r:-1,o}return o(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return""==this.key&&this.arrPos>=0?this._value[this.arrPos]:this.key&&this.arrPos>=0?this._value[this.key][this.arrPos]:this._value[this.key]},set:function(t){""==this.key&&this.arrPos>=0?this._value[this.arrPos]=t:this.key&&this.arrPos>=0?this._value[this.key][this.arrPos]=t:this._value[this.key]=t},enumerable:!0,configurable:!0}),e.absent=e.fromNullable(null),e}(f),p=function(t){function e(e){return t.call(this,e)||this}return o(e,t),Object.defineProperty(e.prototype,"shallowCopy",{get:function(){return new e(a.Lang.instance.mergeMaps([{},this.value||{}]))},enumerable:!0,configurable:!0}),e.fromNullable=function(t){return new e(t)},e.prototype.shallowMerge=function(t,e){for(var n in void 0===e&&(e=!0),t.value)e&&n in this.value?this.apply(n).value=t.getIf(n).value:n in this.value||(this.apply(n).value=t.getIf(n).value)},e.prototype.apply=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];if(!(t.length<1)){this.buildPath(t);var n=this.keyVal(t[t.length-1]),r=this.arrayIndex(t[t.length-1]),o=new c(1==t.length?this.value:this.getIf.apply(this,t.slice(0,t.length-1)).value,n,r);return o}},e.prototype.applyIf=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return t?this.apply.apply(this,l(e)):{value:null}},e.prototype.getIf=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];return this.getClass().fromNullable(t.prototype.getIf.apply(this,e).value)},e.prototype.get=function(e){return this.getClass().fromNullable(t.prototype.get.call(this,e).value)},e.prototype.delete=function(t){return t in this.value&&delete this.value[t],this},e.prototype.toJson=function(){return JSON.stringify(this.value)},e.prototype.getClass=function(){return e},e.prototype.setVal=function(t){this._value=t},e.prototype.buildPath=function(t){for(var e=this,n=this.getClass().fromNullable(null),r=-1,o=function(t,e){if(t.length<e)for(var n=t.length;n<e;n++)t.push({})},i=0;i<t.length;i++){var l=this.keyVal(t[i]),a=this.arrayIndex(t[i]);if(""===l&&a>=0)e.setVal(e.value instanceof Array?e.value:[]),o(e.value,a+1),r>=0&&(n.value[r]=e.value),n=e,r=a,e=this.getClass().fromNullable(e.value[a]);else{var u=e.getIf(l);if(-1==a)u.isAbsent()?u=this.getClass().fromNullable(e.value[l]={}):e=u;else{var s=u.value instanceof Array?u.value:[];o(s,a+1),e.value[l]=s,u=this.getClass().fromNullable(s[a])}n=e,r=a,e=u}}return this},e}(s);e.Config=p},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(2),o=n(0),i=function(){function t(){}return Object.defineProperty(t,"instance",{get:function(){return t._instance||(t._instance=new t),t._instance},enumerable:!0,configurable:!0}),t.saveResolve=function(t,e){void 0===e&&(e=null);try{var n=t();return void 0===n||null==n?o.Optional.fromNullable(e):o.Optional.fromNullable(n)}catch(t){return o.Optional.absent}},t.saveResolveLazy=function(t,e){void 0===e&&(e=null);try{var n=t();return void 0===n||null==n?o.Optional.fromNullable(e()):o.Optional.fromNullable(n)}catch(t){return o.Optional.absent}},t.prototype.strToArray=function(t,e){void 0===e&&(e=/\./gi);for(var n=t.split(e),r=0;r<n.length;r++)n[r]=this.trim(n[r]);return n},t.prototype.arrToMap=function(t,e){void 0===e&&(e=0);var n=new Array(t.length),r=t.length;e=e||0;for(var o=0;o<r;o++)n[t[o]]=o+e;return n},t.prototype.trim=function(t){for(var e=/\s/,n=(t=t.replace(/^\s\s*/,"")).length;e.test(t.charAt(--n)););return t.slice(0,n+1)},t.prototype.isString=function(t){return!!arguments.length&&null!=t&&("string"==typeof t||t instanceof String)},t.prototype.isFunc=function(t){return t instanceof Function||"function"==typeof t},t.prototype.hitch=function(t,e){return t?function(){return e.apply(t,arguments||[])}:e},t.prototype.mergeMaps=function(t,e,n,r){var o=this;void 0===e&&(e=!0),void 0===n&&(n=function(t){return!1}),void 0===r&&(r=function(t){return!0});var i={};return this.arrForEach(t,(function(t){o.mixMaps(i,t,e,n,r)})),i},t.prototype.mixMaps=function(t,e,n,r,o){for(var i in e)e.hasOwnProperty(i)&&(r&&r(i)||o&&!o(i)||(t[i]=n?void 0!==e[i]?e[i]:t[i]:void 0!==t[i]?t[i]:e[i]));return t},t.prototype.objToArray=function(t,e,n){if(!t)return n||null;if(t instanceof Array&&!e&&!n)return t;var r=void 0!==e||null!=e?e:0,o=n||[];try{return o.concat(Array.prototype.slice.call(t,r))}catch(e){for(var i=r;i<t.length;i++)o.push(t[i]);return o}},t.prototype.arrForEach=function(t,e,n,r){if(t&&t.length){var o=n||0,i=r,l=this.objToArray(t);n?l.slice(o).forEach(e,i):l.forEach(e,i)}},t.prototype.contains=function(t,e){if(!t||!e)throw Error("null value on arr or str not allowed");return-1!=this.arrIndexOf(t,e)},t.prototype.arrIndexOf=function(t,e,n){if(!t||!t.length)return-1;var r=n||0;return(t=this.objToArray(t)).indexOf(e,r)},t.prototype.arrFilter=function(t,e,n,r){if(!t||!t.length)return[];var o=this.objToArray(t);return n?o.slice(n).filter(e,r):o.filter(e,r)},t.prototype.applyArgs=function(t,e,n){var r="undefined";if(n)for(var o=0;o<e.length;o++)r!=typeof t["_"+n[o]]&&(t["_"+n[o]]=e[o]),r!=typeof t[n[o]]&&(t[n[o]]=e[o]);else for(var i in e)e.hasOwnProperty(i)&&(r!=typeof t["_"+i]&&(t["_"+i]=e[i]),r!=typeof t[i]&&(t[i]=e[i]));return t},t.prototype.equalsIgnoreCase=function(t,e){return!t&&!e||!(!t||!e)&&t.toLowerCase()===e.toLowerCase()},t.prototype.timeout=function(t){var e=null;return new r.CancellablePromise((function(n,r){e=setTimeout((function(){n()}),t)}),(function(){e&&(clearTimeout(e),e=null)}))},t.prototype.interval=function(t){var e=null;return new r.CancellablePromise((function(n,r){e=setInterval((function(){n()}),t)}),(function(){e&&(clearInterval(e),e=null)}))},t.prototype.assertType=function(t,e){return this.isString(e)?typeof t==e:t instanceof e},t}();e.Lang=i},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i,l=n(0);!function(t){t[t.PENDING=0]="PENDING",t[t.FULLFILLED=1]="FULLFILLED",t[t.REJECTED=2]="REJECTED"}(i=e.PromiseStatus||(e.PromiseStatus={}));var a=function(){function t(t){var e=this;this.status=i.PENDING,this.allFuncs=[],this.value=t,this.value((function(t){return e.resolve(t)}),(function(t){return e.reject(t)}))}return t.all=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var r,o=0,i=new t((function(t,e){r=t})),l=function(){o++,e.length==o&&r()};l.__last__=!0;for(var a=0;a<e.length;a++)e[a].finally(l);return i},t.race=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var r,o,i=new t((function(t,e){r=t,o=e})),l=function(){return r&&r(),r=null,o=null,null};l.__last__=!0;var a=function(){return o&&o(),o=null,r=null,null};a.__last__=!0;for(var u=0;u<e.length;u++)e[u].then(l),e[u].catch(a);return i},t.reject=function(e){return new t((function(n,r){e instanceof t?e.then((function(t){r(t)})):setTimeout((function(){r(e)}),1)}))},t.resolve=function(e){return new t((function(n,r){e instanceof t?e.then((function(t){return n(t)})):setTimeout((function(){n(e)}),1)}))},t.prototype.then=function(t,e){return this.allFuncs.push({then:t}),e&&this.allFuncs.push({catch:e}),this.spliceLastFuncs(),this},t.prototype.catch=function(t){return this.allFuncs.push({catch:t}),this.spliceLastFuncs(),this},t.prototype.finally=function(t){if(!this.__reason__)return this.allFuncs.push({finally:t}),this.spliceLastFuncs(),this;this.__reason__.finally(t)},t.prototype.resolve=function(e){for(;this.allFuncs.length&&this.allFuncs[0].then;){var n=this.allFuncs.shift(),r=l.Optional.fromNullable(n.then(e));if(!r.isPresent())break;if((e=(r=r.flatMap()).value)instanceof t)return void this.transferIntoNewPromise(e)}this.appyFinally(),this.status=i.FULLFILLED},t.prototype.reject=function(e){for(;this.allFuncs.length&&!this.allFuncs[0].finally;){var n=this.allFuncs.shift();if(n.catch){var r=l.Optional.fromNullable(n.catch(e));if(r.isPresent()){if((e=(r=r.flatMap()).value)instanceof t)return void this.transferIntoNewPromise(e);this.status=i.REJECTED;break}break}}this.status=i.REJECTED,this.appyFinally()},t.prototype.appyFinally=function(){for(;this.allFuncs.length;){var t=this.allFuncs.shift();t.finally&&t.finally()}},t.prototype.spliceLastFuncs=function(){for(var t=[],e=[],n=0;n<this.allFuncs.length;n++)for(var r in this.allFuncs[n])this.allFuncs[n][r].__last__?t.push(this.allFuncs[n]):e.push(this.allFuncs[n]);this.allFuncs=e.concat(t)},t.prototype.transferIntoNewPromise=function(t){for(var e=0;e<this.allFuncs.length;e++)for(var n in this.allFuncs[e])t[n](this.allFuncs[e][n])},t}();e.Promise=a;var u=function(t){function e(e,n){var r=t.call(this,e)||this;return r.cancellator=function(){},r.cancellator=n,r}return o(e,t),e.prototype.cancel=function(){this.status=i.REJECTED,this.appyFinally(),this.allFuncs=[]},e.prototype.then=function(e,n){return t.prototype.then.call(this,e,n)},e.prototype.catch=function(e){return t.prototype.catch.call(this,e)},e.prototype.finally=function(e){return t.prototype.finally.call(this,e)},e}(a);e.CancellablePromise=u}])}));
//# sourceMappingURL=Promise.js.map