require(["rxjs"],(function(e){return function(){"use strict";var t={493:function(e,t,n){var r,s=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.BrokerFactory=t.Broker=t.BroadcastChannelBrokerFactory=t.BroadcastChannelBroker=t.Message=t.JSONCrypto=t.NoCrypto=void 0;var i=n(435),o=function(){function e(){}return e.prototype.decode=function(e){return e},e.prototype.encode=function(e){return e},e}();t.NoCrypto=o;var a=function(){function e(){}return e.prototype.decode=function(e){return(null==e?void 0:e.encryptedData)?JSON.parse(e.encryptedData):e},e.prototype.encode=function(e){return{encryptedData:JSON.stringify(e)}},e}();t.JSONCrypto=a;var c=new o,u=function(e,t){void 0===e&&(e={}),void 0===t&&(t="*"),this.message=e,this.encoded=!1,this.targetOrigin=t,this.creationDate=(new Date).getMilliseconds(),this.identifier=(new Date).getMilliseconds()+"_"+Math.random()+"_"+Math.random()};t.Message=u;var d=function(e,t){this.detail=t,this.bubbles=!0,this.cancelable=!0,this.composed=!0,this.channel=e},l=function(){function e(){this.messageListeners={},this.subjects={},this.processedMessages={},this.cleanupCnt=0,this.TIMEOUT_IN_MS=1e3,this.MSG_EVENT="message",this.crypto=c}return e.prototype.registerListener=function(e,t){var n=this;this.reserveListenerNS(e),this.messageListeners[e].push((function(e){var r;e.identifier in n.processedMessages||(((null==e?void 0:e.encoded)||(null===(r=null==e?void 0:e.detail)||void 0===r?void 0:r.encoded))&&((null==e?void 0:e.detail)?(e.detail.message=n.crypto.decode(e.detail.message),e.detail.encoded=!1):(e.message=n.crypto.decode(e.message),e.encoded=!1)),t(e))}))},e.prototype.asSubject=function(e){var t=this;this.reserveSubjectNS(e);var n=this.subjects[e],r=n.next;return n.next=function(s){var i,o;(null===(i=s)||void 0===i?void 0:i.detail)?r.call(n,null===(o=s)||void 0===o?void 0:o.detail):t.broadcast(e,s)},n},e.prototype.asObservable=function(e){return this.asSubject(e).asObservable()},e.prototype.reserveListenerNS=function(e){this.messageListeners[e]||(this.messageListeners[e]=[]),this.messageListeners["*"]||(this.messageListeners["*"]=[])},e.prototype.reserveSubjectNS=function(e){this.subjects[e]||(this.subjects[e]=new i.Subject),this.subjects["*"]||(this.subjects["*"]=new i.Subject)},e.prototype.unregisterListener=function(e,t){this.messageListeners[e]=(this.messageListeners[e]||[]).filter((function(e){return e!==t}))},e.prototype.answer=function(t,n,r){"string"==typeof n&&(n=new u(n)),e.isAnswer(n)||(r.identifier=e.getAnswerId(n),this.broadcast(t,r))},e.getAnswerId=function(e){return"_r_"+e.identifier},e.isAnswer=function(e){return 0==e.identifier.indexOf("_r_")},e.prototype.request=function(e,t){var n=this;"string"==typeof t&&(t=new u(t));var r=t.identifier,s=new Promise((function(t,s){var i=null,o=function(s){s.identifier!=r&&s.identifier=="_r_"+r&&(clearTimeout(i),n.unregisterListener(e,o),t(s))};i=setTimeout((function(){n.unregisterListener(e,o),s("request message performed, timeout, no return value")}),3e3),n.registerListener(e,o)}));return this.broadcast(e,t),s},e.prototype.gcProcessedMessages=function(){var e=this;if(++this.cleanupCnt%10==0){var t={};Object.keys(this.processedMessages).forEach((function(n){e.messageStillActive(n)||(t[n]=e.processedMessages[n])})),this.processedMessages=t}},e.prototype.messageStillActive=function(e){return this.processedMessages[e]>(new Date).getMilliseconds()-this.TIMEOUT_IN_MS},e.prototype.markMessageAsProcessed=function(e){this.processedMessages[e.identifier]=e.creationDate},e.EVENT_TYPE="brokerEvent",e}(),h=function(e){if(null===window||void 0===window?void 0:window.BroadcastChannel)return new window.BroadcastChannel(e);throw Error("No Broadcast channel in the system, use a shim or provide a factory functionin the constructor")},p="brokr",f=function(e){function t(t,n,r){void 0===t&&(t=h),void 0===n&&(n=p),void 0===r&&(r=c);var s=e.call(this)||this;return s.brokerFactory=t,s.channelGroup=n,s.crypto=r,s.openChannels={},s.msgListener=function(e){var t,n;e.detail.encoded&&(e.detail.message=s.crypto.decode(e.detail.message),e.detail.encoded=!1);var r=e.detail,i=e.channel;return(null===(t=s.messageListeners)||void 0===t?void 0:t[i])&&(null===(n=s.messageListeners)||void 0===n||n[i].forEach((function(e){e(r)}))),s.markMessageAsProcessed(r),!0},s.crypto=r,s.register(),s}return s(t,e),t.prototype.broadcast=function(e,t,n){void 0===n&&(n=!0);try{"string"==typeof t&&(t=new u(t));var r=JSON.stringify(t);t=JSON.parse(r);var s=new d(e,t);s.detail.message=this.crypto.encode(s.detail.message),s.detail.encoded=!0,(null==this?void 0:this.subjects[e])&&this.subjects[e].next(s),this.openChannels[this.channelGroup].postMessage(s),n&&this.msgListener(s)}finally{this.gcProcessedMessages()}},t.prototype.registerListener=function(t,n){e.prototype.registerListener.call(this,t,n)},t.prototype.register=function(){this.openChannels[this.channelGroup]||(this.openChannels[this.channelGroup]=this.brokerFactory(this.channelGroup)),this.openChannels[this.channelGroup].addEventListener("message",this.msgListener)},t.prototype.unregister=function(){this.openChannels[this.channelGroup].close()},t}(l);t.BroadcastChannelBroker=f;var v=function(){function e(){this.broadCastChannelGenerator=h,this.channelGroup=p,this.crypto=c}return e.prototype.withGeneratorFunc=function(e){return this.broadCastChannelGenerator=e,this},e.prototype.withChannelGroup=function(e){return this.channelGroup=e,this},e.prototype.withCrypto=function(e){return this.crypto=e,this},e.prototype.build=function(){return new f(this.broadCastChannelGenerator,this.channelGroup,this.crypto)},e}();t.BroadcastChannelBrokerFactory=v;var g=function(e){function t(t,n,r){void 0===t&&(t=window),void 0===n&&(n="brokr"),void 0===r&&(r=c);var s=e.call(this)||this;s.name=n;return s.msgHandler=function(e){return function(e){var t,n,r,i,o,a,c,u,d,l=null!==(n=null===(t=e)||void 0===t?void 0:t.detail)&&void 0!==n?n:null===(i=null===(r=e)||void 0===r?void 0:r.data)||void 0===i?void 0:i.detail,h=null!==(c=null===(a=null===(o=e)||void 0===o?void 0:o.data)||void 0===a?void 0:a.channel)&&void 0!==c?c:null===(u=e)||void 0===u?void 0:u.channel;if((null==l?void 0:l.identifier)&&(null==l?void 0:l.message)){var p=l;if(p.identifier in s.processedMessages)return;null===(d=e)||void 0===d||d.detail,s.broadcast(h,p)}}(e)},s.crypto=r,s.register(t),s}return s(t,e),t.prototype.register=function(e){(this.rootElem=e.host?e.host:e,e.host)?e.host.setAttribute("data-broker","1"):(null==e?void 0:e.setAttribute)&&e.setAttribute("data-broker","1");this.rootElem.addEventListener(t.EVENT_TYPE,this.msgHandler,{capture:!0}),this.rootElem.addEventListener(this.MSG_EVENT,this.msgHandler,{capture:!0})},t.prototype.unregister=function(){this.rootElem.removeEventListener(t.EVENT_TYPE,this.msgHandler),this.rootElem.removeEventListener(this.MSG_EVENT,this.msgHandler)},t.prototype.broadcast=function(e,t){if("string"==typeof t&&(t=new u(t)),null==this?void 0:this.subjects[e]){var n=new d(e,t);n.detail.encoded||(n.detail.message=this.crypto.encode(n.detail.message),n.detail.encoded=!0),this.subjects[e].next(n)}try{this.dispatchUp(e,t,!1,!0),this.dispatchDown(e,t,!0,!1)}finally{this.gcProcessedMessages()}},t.prototype.dispatchUp=function(e,n,r,s){if(void 0===r&&(r=!0),void 0===s&&(s=!0),r||this.msgCallListeners(e,n),this.markMessageAsProcessed(n),null!=window.parent){var i=new d(e,n);window.parent.postMessage(JSON.parse(JSON.stringify(i)),n.targetOrigin)}s&&t.dispatchSameLevel(e,n)},t.dispatchSameLevel=function(e,n){var r=t.transformToEvent(e,n,!0);window.dispatchEvent(r)},t.prototype.dispatchDown=function(e,n,r,s){void 0===r&&(r=!0),void 0===s&&(s=!0),r||this.msgCallListeners(e,n),this.processedMessages[n.identifier]=n.creationDate;var i=t.transformToEvent(e,n);Array.prototype.slice.call(document.querySelectorAll("iframe")).forEach((function(t){var r=new d(e,n);t.contentWindow.postMessage(JSON.parse(JSON.stringify(r)),n.targetOrigin)})),Array.prototype.slice.call(document.querySelectorAll("[data-broker='1']")).forEach((function(e){return e.dispatchEvent(i)})),s&&t.dispatchSameLevel(e,n)},t.prototype.msgCallListeners=function(e,t){var n=this.messageListeners[e];if(null==n?void 0:n.length){n.forEach((function(e){e(t)}))}},t.transformToEvent=function(e,n,r){void 0===r&&(r=!1);var s=new d(e,n);return s.bubbles=r,t.createCustomEvent(t.EVENT_TYPE,s)},t.createCustomEvent=function(e,t){if("function"!=typeof window.CustomEvent){var n=document.createEvent("HTMLEvents");return n.detail=t.detail,n.channel=t.channel,n.initEvent(e,t.bubbles,t.cancelable),n}var r=new window.CustomEvent(e,t);return r.channel=t.channel,r},t}(l);t.Broker=g;var y=function(){function e(){this.scopeElement=window,this.channelGroup=p,this.crypto=c}return e.prototype.withScopeElement=function(e){return this.scopeElement=e,this},e.prototype.withChannelGroup=function(e){return this.channelGroup=e,this},e.prototype.withCrypto=function(e){return this.crypto=e,this},e.prototype.build=function(){return new g(this.scopeElement,this.channelGroup,this.crypto)},e}();t.BrokerFactory=y},435:function(t){t.exports=e}},n={};return function e(r){var s=n[r];if(void 0!==s)return s.exports;var i=n[r]={exports:{}};return t[r].call(i.exports,i,i.exports,e),i.exports}(493)}()}));
//# sourceMappingURL=Messaging.js.map