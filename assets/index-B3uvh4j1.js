(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
* @vue/shared v3.5.29
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Ul(n){const t=Object.create(null);for(const e of n.split(","))t[e]=1;return e=>e in t}const le={},hr=[],bn=()=>{},ph=()=>!1,yo=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&(n.charCodeAt(2)>122||n.charCodeAt(2)<97),Nl=n=>n.startsWith("onUpdate:"),Ee=Object.assign,Ol=(n,t)=>{const e=n.indexOf(t);e>-1&&n.splice(e,1)},dd=Object.prototype.hasOwnProperty,ee=(n,t)=>dd.call(n,t),Gt=Array.isArray,fr=n=>us(n)==="[object Map]",mh=n=>us(n)==="[object Set]",Ec=n=>us(n)==="[object Date]",jt=n=>typeof n=="function",ge=n=>typeof n=="string",En=n=>typeof n=="symbol",se=n=>n!==null&&typeof n=="object",gh=n=>(se(n)||jt(n))&&jt(n.then)&&jt(n.catch),_h=Object.prototype.toString,us=n=>_h.call(n),pd=n=>us(n).slice(8,-1),vh=n=>us(n)==="[object Object]",Fl=n=>ge(n)&&n!=="NaN"&&n[0]!=="-"&&""+parseInt(n,10)===n,jr=Ul(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),So=n=>{const t=Object.create(null);return(e=>t[e]||(t[e]=n(e)))},md=/-\w/g,di=So(n=>n.replace(md,t=>t.slice(1).toUpperCase())),gd=/\B([A-Z])/g,zi=So(n=>n.replace(gd,"-$1").toLowerCase()),xh=So(n=>n.charAt(0).toUpperCase()+n.slice(1)),Fo=So(n=>n?`on${xh(n)}`:""),ci=(n,t)=>!Object.is(n,t),ko=(n,...t)=>{for(let e=0;e<n.length;e++)n[e](...t)},yh=(n,t,e,i=!1)=>{Object.defineProperty(n,t,{configurable:!0,enumerable:!1,writable:i,value:e})},_d=n=>{const t=parseFloat(n);return isNaN(t)?n:t};let Tc;const bo=()=>Tc||(Tc=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Mo(n){if(Gt(n)){const t={};for(let e=0;e<n.length;e++){const i=n[e],r=ge(i)?Sd(i):Mo(i);if(r)for(const s in r)t[s]=r[s]}return t}else if(ge(n)||se(n))return n}const vd=/;(?![^(]*\))/g,xd=/:([^]+)/,yd=/\/\*[^]*?\*\//g;function Sd(n){const t={};return n.replace(yd,"").split(vd).forEach(e=>{if(e){const i=e.split(xd);i.length>1&&(t[i[0].trim()]=i[1].trim())}}),t}function Eo(n){let t="";if(ge(n))t=n;else if(Gt(n))for(let e=0;e<n.length;e++){const i=Eo(n[e]);i&&(t+=i+" ")}else if(se(n))for(const e in n)n[e]&&(t+=e+" ");return t.trim()}const bd="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Md=Ul(bd);function Sh(n){return!!n||n===""}function Ed(n,t){if(n.length!==t.length)return!1;let e=!0;for(let i=0;e&&i<n.length;i++)e=kl(n[i],t[i]);return e}function kl(n,t){if(n===t)return!0;let e=Ec(n),i=Ec(t);if(e||i)return e&&i?n.getTime()===t.getTime():!1;if(e=En(n),i=En(t),e||i)return n===t;if(e=Gt(n),i=Gt(t),e||i)return e&&i?Ed(n,t):!1;if(e=se(n),i=se(t),e||i){if(!e||!i)return!1;const r=Object.keys(n).length,s=Object.keys(t).length;if(r!==s)return!1;for(const o in n){const a=n.hasOwnProperty(o),l=t.hasOwnProperty(o);if(a&&!l||!a&&l||!kl(n[o],t[o]))return!1}}return String(n)===String(t)}const bh=n=>!!(n&&n.__v_isRef===!0),De=n=>ge(n)?n:n==null?"":Gt(n)||se(n)&&(n.toString===_h||!jt(n.toString))?bh(n)?De(n.value):JSON.stringify(n,Mh,2):String(n),Mh=(n,t)=>bh(t)?Mh(n,t.value):fr(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[i,r],s)=>(e[Bo(i,s)+" =>"]=r,e),{})}:mh(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>Bo(e))}:En(t)?Bo(t):se(t)&&!Gt(t)&&!vh(t)?String(t):t,Bo=(n,t="")=>{var e;return En(n)?`Symbol(${(e=n.description)!=null?e:t})`:n};/**
* @vue/reactivity v3.5.29
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let ze;class Td{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=ze,!t&&ze&&(this.index=(ze.scopes||(ze.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,e;if(this.scopes)for(t=0,e=this.scopes.length;t<e;t++)this.scopes[t].pause();for(t=0,e=this.effects.length;t<e;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,e;if(this.scopes)for(t=0,e=this.scopes.length;t<e;t++)this.scopes[t].resume();for(t=0,e=this.effects.length;t<e;t++)this.effects[t].resume()}}run(t){if(this._active){const e=ze;try{return ze=this,t()}finally{ze=e}}}on(){++this._on===1&&(this.prevScope=ze,ze=this)}off(){this._on>0&&--this._on===0&&(ze=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let e,i;for(e=0,i=this.effects.length;e<i;e++)this.effects[e].stop();for(this.effects.length=0,e=0,i=this.cleanups.length;e<i;e++)this.cleanups[e]();if(this.cleanups.length=0,this.scopes){for(e=0,i=this.scopes.length;e<i;e++)this.scopes[e].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function wd(){return ze}let ae;const zo=new WeakSet;class Eh{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,ze&&ze.active&&ze.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,zo.has(this)&&(zo.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||wh(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,wc(this),Ah(this);const t=ae,e=hn;ae=this,hn=!0;try{return this.fn()}finally{Ch(this),ae=t,hn=e,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)Hl(t);this.deps=this.depsTail=void 0,wc(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?zo.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Da(this)&&this.run()}get dirty(){return Da(this)}}let Th=0,qr,Yr;function wh(n,t=!1){if(n.flags|=8,t){n.next=Yr,Yr=n;return}n.next=qr,qr=n}function Bl(){Th++}function zl(){if(--Th>0)return;if(Yr){let t=Yr;for(Yr=void 0;t;){const e=t.next;t.next=void 0,t.flags&=-9,t=e}}let n;for(;qr;){let t=qr;for(qr=void 0;t;){const e=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(i){n||(n=i)}t=e}}if(n)throw n}function Ah(n){for(let t=n.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Ch(n){let t,e=n.depsTail,i=e;for(;i;){const r=i.prevDep;i.version===-1?(i===e&&(e=r),Hl(i),Ad(i)):t=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}n.deps=t,n.depsTail=e}function Da(n){for(let t=n.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Rh(t.dep.computed)||t.dep.version!==t.version))return!0;return!!n._dirty}function Rh(n){if(n.flags&4&&!(n.flags&16)||(n.flags&=-17,n.globalVersion===es)||(n.globalVersion=es,!n.isSSR&&n.flags&128&&(!n.deps&&!n._dirty||!Da(n))))return;n.flags|=2;const t=n.dep,e=ae,i=hn;ae=n,hn=!0;try{Ah(n);const r=n.fn(n._value);(t.version===0||ci(r,n._value))&&(n.flags|=128,n._value=r,t.version++)}catch(r){throw t.version++,r}finally{ae=e,hn=i,Ch(n),n.flags&=-3}}function Hl(n,t=!1){const{dep:e,prevSub:i,nextSub:r}=n;if(i&&(i.nextSub=r,n.prevSub=void 0),r&&(r.prevSub=i,n.nextSub=void 0),e.subs===n&&(e.subs=i,!i&&e.computed)){e.computed.flags&=-5;for(let s=e.computed.deps;s;s=s.nextDep)Hl(s,!0)}!t&&!--e.sc&&e.map&&e.map.delete(e.key)}function Ad(n){const{prevDep:t,nextDep:e}=n;t&&(t.nextDep=e,n.prevDep=void 0),e&&(e.prevDep=t,n.nextDep=void 0)}let hn=!0;const Ph=[];function Xn(){Ph.push(hn),hn=!1}function jn(){const n=Ph.pop();hn=n===void 0?!0:n}function wc(n){const{cleanup:t}=n;if(n.cleanup=void 0,t){const e=ae;ae=void 0;try{t()}finally{ae=e}}}let es=0;class Cd{constructor(t,e){this.sub=t,this.dep=e,this.version=e.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Vl{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!ae||!hn||ae===this.computed)return;let e=this.activeLink;if(e===void 0||e.sub!==ae)e=this.activeLink=new Cd(ae,this),ae.deps?(e.prevDep=ae.depsTail,ae.depsTail.nextDep=e,ae.depsTail=e):ae.deps=ae.depsTail=e,Lh(e);else if(e.version===-1&&(e.version=this.version,e.nextDep)){const i=e.nextDep;i.prevDep=e.prevDep,e.prevDep&&(e.prevDep.nextDep=i),e.prevDep=ae.depsTail,e.nextDep=void 0,ae.depsTail.nextDep=e,ae.depsTail=e,ae.deps===e&&(ae.deps=i)}return e}trigger(t){this.version++,es++,this.notify(t)}notify(t){Bl();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{zl()}}}function Lh(n){if(n.dep.sc++,n.sub.flags&4){const t=n.dep.computed;if(t&&!n.dep.subs){t.flags|=20;for(let i=t.deps;i;i=i.nextDep)Lh(i)}const e=n.dep.subs;e!==n&&(n.prevSub=e,e&&(e.nextSub=n)),n.dep.subs=n}}const Ia=new WeakMap,Ii=Symbol(""),Ua=Symbol(""),ns=Symbol("");function Ce(n,t,e){if(hn&&ae){let i=Ia.get(n);i||Ia.set(n,i=new Map);let r=i.get(e);r||(i.set(e,r=new Vl),r.map=i,r.key=e),r.track()}}function zn(n,t,e,i,r,s){const o=Ia.get(n);if(!o){es++;return}const a=l=>{l&&l.trigger()};if(Bl(),t==="clear")o.forEach(a);else{const l=Gt(n),c=l&&Fl(e);if(l&&e==="length"){const u=Number(i);o.forEach((h,m)=>{(m==="length"||m===ns||!En(m)&&m>=u)&&a(h)})}else switch((e!==void 0||o.has(void 0))&&a(o.get(e)),c&&a(o.get(ns)),t){case"add":l?c&&a(o.get("length")):(a(o.get(Ii)),fr(n)&&a(o.get(Ua)));break;case"delete":l||(a(o.get(Ii)),fr(n)&&a(o.get(Ua)));break;case"set":fr(n)&&a(o.get(Ii));break}}zl()}function Wi(n){const t=te(n);return t===n?t:(Ce(t,"iterate",ns),tn(n)?t:t.map(dn))}function To(n){return Ce(n=te(n),"iterate",ns),n}function ri(n,t){return qn(n)?Sr(Ui(n)?dn(t):t):dn(t)}const Rd={__proto__:null,[Symbol.iterator](){return Ho(this,Symbol.iterator,n=>ri(this,n))},concat(...n){return Wi(this).concat(...n.map(t=>Gt(t)?Wi(t):t))},entries(){return Ho(this,"entries",n=>(n[1]=ri(this,n[1]),n))},every(n,t){return Pn(this,"every",n,t,void 0,arguments)},filter(n,t){return Pn(this,"filter",n,t,e=>e.map(i=>ri(this,i)),arguments)},find(n,t){return Pn(this,"find",n,t,e=>ri(this,e),arguments)},findIndex(n,t){return Pn(this,"findIndex",n,t,void 0,arguments)},findLast(n,t){return Pn(this,"findLast",n,t,e=>ri(this,e),arguments)},findLastIndex(n,t){return Pn(this,"findLastIndex",n,t,void 0,arguments)},forEach(n,t){return Pn(this,"forEach",n,t,void 0,arguments)},includes(...n){return Vo(this,"includes",n)},indexOf(...n){return Vo(this,"indexOf",n)},join(n){return Wi(this).join(n)},lastIndexOf(...n){return Vo(this,"lastIndexOf",n)},map(n,t){return Pn(this,"map",n,t,void 0,arguments)},pop(){return Nr(this,"pop")},push(...n){return Nr(this,"push",n)},reduce(n,...t){return Ac(this,"reduce",n,t)},reduceRight(n,...t){return Ac(this,"reduceRight",n,t)},shift(){return Nr(this,"shift")},some(n,t){return Pn(this,"some",n,t,void 0,arguments)},splice(...n){return Nr(this,"splice",n)},toReversed(){return Wi(this).toReversed()},toSorted(n){return Wi(this).toSorted(n)},toSpliced(...n){return Wi(this).toSpliced(...n)},unshift(...n){return Nr(this,"unshift",n)},values(){return Ho(this,"values",n=>ri(this,n))}};function Ho(n,t,e){const i=To(n),r=i[t]();return i!==n&&!tn(n)&&(r._next=r.next,r.next=()=>{const s=r._next();return s.done||(s.value=e(s.value)),s}),r}const Pd=Array.prototype;function Pn(n,t,e,i,r,s){const o=To(n),a=o!==n&&!tn(n),l=o[t];if(l!==Pd[t]){const h=l.apply(n,s);return a?dn(h):h}let c=e;o!==n&&(a?c=function(h,m){return e.call(this,ri(n,h),m,n)}:e.length>2&&(c=function(h,m){return e.call(this,h,m,n)}));const u=l.call(o,c,i);return a&&r?r(u):u}function Ac(n,t,e,i){const r=To(n);let s=e;return r!==n&&(tn(n)?e.length>3&&(s=function(o,a,l){return e.call(this,o,a,l,n)}):s=function(o,a,l){return e.call(this,o,ri(n,a),l,n)}),r[t](s,...i)}function Vo(n,t,e){const i=te(n);Ce(i,"iterate",ns);const r=i[t](...e);return(r===-1||r===!1)&&jl(e[0])?(e[0]=te(e[0]),i[t](...e)):r}function Nr(n,t,e=[]){Xn(),Bl();const i=te(n)[t].apply(n,e);return zl(),jn(),i}const Ld=Ul("__proto__,__v_isRef,__isVue"),Dh=new Set(Object.getOwnPropertyNames(Symbol).filter(n=>n!=="arguments"&&n!=="caller").map(n=>Symbol[n]).filter(En));function Dd(n){En(n)||(n=String(n));const t=te(this);return Ce(t,"has",n),t.hasOwnProperty(n)}class Ih{constructor(t=!1,e=!1){this._isReadonly=t,this._isShallow=e}get(t,e,i){if(e==="__v_skip")return t.__v_skip;const r=this._isReadonly,s=this._isShallow;if(e==="__v_isReactive")return!r;if(e==="__v_isReadonly")return r;if(e==="__v_isShallow")return s;if(e==="__v_raw")return i===(r?s?Vd:Fh:s?Oh:Nh).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(i)?t:void 0;const o=Gt(t);if(!r){let l;if(o&&(l=Rd[e]))return l;if(e==="hasOwnProperty")return Dd}const a=Reflect.get(t,e,Re(t)?t:i);if((En(e)?Dh.has(e):Ld(e))||(r||Ce(t,"get",e),s))return a;if(Re(a)){const l=o&&Fl(e)?a:a.value;return r&&se(l)?Oa(l):l}return se(a)?r?Oa(a):Wl(a):a}}class Uh extends Ih{constructor(t=!1){super(!1,t)}set(t,e,i,r){let s=t[e];const o=Gt(t)&&Fl(e);if(!this._isShallow){const c=qn(s);if(!tn(i)&&!qn(i)&&(s=te(s),i=te(i)),!o&&Re(s)&&!Re(i))return c||(s.value=i),!0}const a=o?Number(e)<t.length:ee(t,e),l=Reflect.set(t,e,i,Re(t)?t:r);return t===te(r)&&(a?ci(i,s)&&zn(t,"set",e,i):zn(t,"add",e,i)),l}deleteProperty(t,e){const i=ee(t,e);t[e];const r=Reflect.deleteProperty(t,e);return r&&i&&zn(t,"delete",e,void 0),r}has(t,e){const i=Reflect.has(t,e);return(!En(e)||!Dh.has(e))&&Ce(t,"has",e),i}ownKeys(t){return Ce(t,"iterate",Gt(t)?"length":Ii),Reflect.ownKeys(t)}}class Id extends Ih{constructor(t=!1){super(!0,t)}set(t,e){return!0}deleteProperty(t,e){return!0}}const Ud=new Uh,Nd=new Id,Od=new Uh(!0);const Na=n=>n,xs=n=>Reflect.getPrototypeOf(n);function Fd(n,t,e){return function(...i){const r=this.__v_raw,s=te(r),o=fr(s),a=n==="entries"||n===Symbol.iterator&&o,l=n==="keys"&&o,c=r[n](...i),u=e?Na:t?Sr:dn;return!t&&Ce(s,"iterate",l?Ua:Ii),Ee(Object.create(c),{next(){const{value:h,done:m}=c.next();return m?{value:h,done:m}:{value:a?[u(h[0]),u(h[1])]:u(h),done:m}}})}}function ys(n){return function(...t){return n==="delete"?!1:n==="clear"?void 0:this}}function kd(n,t){const e={get(r){const s=this.__v_raw,o=te(s),a=te(r);n||(ci(r,a)&&Ce(o,"get",r),Ce(o,"get",a));const{has:l}=xs(o),c=t?Na:n?Sr:dn;if(l.call(o,r))return c(s.get(r));if(l.call(o,a))return c(s.get(a));s!==o&&s.get(r)},get size(){const r=this.__v_raw;return!n&&Ce(te(r),"iterate",Ii),r.size},has(r){const s=this.__v_raw,o=te(s),a=te(r);return n||(ci(r,a)&&Ce(o,"has",r),Ce(o,"has",a)),r===a?s.has(r):s.has(r)||s.has(a)},forEach(r,s){const o=this,a=o.__v_raw,l=te(a),c=t?Na:n?Sr:dn;return!n&&Ce(l,"iterate",Ii),a.forEach((u,h)=>r.call(s,c(u),c(h),o))}};return Ee(e,n?{add:ys("add"),set:ys("set"),delete:ys("delete"),clear:ys("clear")}:{add(r){!t&&!tn(r)&&!qn(r)&&(r=te(r));const s=te(this);return xs(s).has.call(s,r)||(s.add(r),zn(s,"add",r,r)),this},set(r,s){!t&&!tn(s)&&!qn(s)&&(s=te(s));const o=te(this),{has:a,get:l}=xs(o);let c=a.call(o,r);c||(r=te(r),c=a.call(o,r));const u=l.call(o,r);return o.set(r,s),c?ci(s,u)&&zn(o,"set",r,s):zn(o,"add",r,s),this},delete(r){const s=te(this),{has:o,get:a}=xs(s);let l=o.call(s,r);l||(r=te(r),l=o.call(s,r)),a&&a.call(s,r);const c=s.delete(r);return l&&zn(s,"delete",r,void 0),c},clear(){const r=te(this),s=r.size!==0,o=r.clear();return s&&zn(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{e[r]=Fd(r,n,t)}),e}function Gl(n,t){const e=kd(n,t);return(i,r,s)=>r==="__v_isReactive"?!n:r==="__v_isReadonly"?n:r==="__v_raw"?i:Reflect.get(ee(e,r)&&r in i?e:i,r,s)}const Bd={get:Gl(!1,!1)},zd={get:Gl(!1,!0)},Hd={get:Gl(!0,!1)};const Nh=new WeakMap,Oh=new WeakMap,Fh=new WeakMap,Vd=new WeakMap;function Gd(n){switch(n){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Wd(n){return n.__v_skip||!Object.isExtensible(n)?0:Gd(pd(n))}function Wl(n){return qn(n)?n:Xl(n,!1,Ud,Bd,Nh)}function Xd(n){return Xl(n,!1,Od,zd,Oh)}function Oa(n){return Xl(n,!0,Nd,Hd,Fh)}function Xl(n,t,e,i,r){if(!se(n)||n.__v_raw&&!(t&&n.__v_isReactive))return n;const s=Wd(n);if(s===0)return n;const o=r.get(n);if(o)return o;const a=new Proxy(n,s===2?i:e);return r.set(n,a),a}function Ui(n){return qn(n)?Ui(n.__v_raw):!!(n&&n.__v_isReactive)}function qn(n){return!!(n&&n.__v_isReadonly)}function tn(n){return!!(n&&n.__v_isShallow)}function jl(n){return n?!!n.__v_raw:!1}function te(n){const t=n&&n.__v_raw;return t?te(t):n}function jd(n){return!ee(n,"__v_skip")&&Object.isExtensible(n)&&yh(n,"__v_skip",!0),n}const dn=n=>se(n)?Wl(n):n,Sr=n=>se(n)?Oa(n):n;function Re(n){return n?n.__v_isRef===!0:!1}function Je(n){return qd(n,!1)}function qd(n,t){return Re(n)?n:new Yd(n,t)}class Yd{constructor(t,e){this.dep=new Vl,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=e?t:te(t),this._value=e?t:dn(t),this.__v_isShallow=e}get value(){return this.dep.track(),this._value}set value(t){const e=this._rawValue,i=this.__v_isShallow||tn(t)||qn(t);t=i?t:te(t),ci(t,e)&&(this._rawValue=t,this._value=i?t:dn(t),this.dep.trigger())}}function sr(n){return Re(n)?n.value:n}const $d={get:(n,t,e)=>t==="__v_raw"?n:sr(Reflect.get(n,t,e)),set:(n,t,e,i)=>{const r=n[t];return Re(r)&&!Re(e)?(r.value=e,!0):Reflect.set(n,t,e,i)}};function kh(n){return Ui(n)?n:new Proxy(n,$d)}class Zd{constructor(t,e,i){this.fn=t,this.setter=e,this._value=void 0,this.dep=new Vl(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=es-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!e,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&ae!==this)return wh(this,!0),!0}get value(){const t=this.dep.track();return Rh(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function Kd(n,t,e=!1){let i,r;return jt(n)?i=n:(i=n.get,r=n.set),new Zd(i,r,e)}const Ss={},ao=new WeakMap;let Ai;function Jd(n,t=!1,e=Ai){if(e){let i=ao.get(e);i||ao.set(e,i=[]),i.push(n)}}function Qd(n,t,e=le){const{immediate:i,deep:r,once:s,scheduler:o,augmentJob:a,call:l}=e,c=x=>r?x:tn(x)||r===!1||r===0?ai(x,1):ai(x);let u,h,m,p,v=!1,_=!1;if(Re(n)?(h=()=>n.value,v=tn(n)):Ui(n)?(h=()=>c(n),v=!0):Gt(n)?(_=!0,v=n.some(x=>Ui(x)||tn(x)),h=()=>n.map(x=>{if(Re(x))return x.value;if(Ui(x))return c(x);if(jt(x))return l?l(x,2):x()})):jt(n)?t?h=l?()=>l(n,2):n:h=()=>{if(m){Xn();try{m()}finally{jn()}}const x=Ai;Ai=u;try{return l?l(n,3,[p]):n(p)}finally{Ai=x}}:h=bn,t&&r){const x=h,D=r===!0?1/0:r;h=()=>ai(x(),D)}const g=wd(),d=()=>{u.stop(),g&&g.active&&Ol(g.effects,u)};if(s&&t){const x=t;t=(...D)=>{x(...D),d()}}let M=_?new Array(n.length).fill(Ss):Ss;const y=x=>{if(!(!(u.flags&1)||!u.dirty&&!x))if(t){const D=u.run();if(r||v||(_?D.some((N,L)=>ci(N,M[L])):ci(D,M))){m&&m();const N=Ai;Ai=u;try{const L=[D,M===Ss?void 0:_&&M[0]===Ss?[]:M,p];M=D,l?l(t,3,L):t(...L)}finally{Ai=N}}}else u.run()};return a&&a(y),u=new Eh(h),u.scheduler=o?()=>o(y,!1):y,p=x=>Jd(x,!1,u),m=u.onStop=()=>{const x=ao.get(u);if(x){if(l)l(x,4);else for(const D of x)D();ao.delete(u)}},t?i?y(!0):M=u.run():o?o(y.bind(null,!0),!0):u.run(),d.pause=u.pause.bind(u),d.resume=u.resume.bind(u),d.stop=d,d}function ai(n,t=1/0,e){if(t<=0||!se(n)||n.__v_skip||(e=e||new Map,(e.get(n)||0)>=t))return n;if(e.set(n,t),t--,Re(n))ai(n.value,t,e);else if(Gt(n))for(let i=0;i<n.length;i++)ai(n[i],t,e);else if(mh(n)||fr(n))n.forEach(i=>{ai(i,t,e)});else if(vh(n)){for(const i in n)ai(n[i],t,e);for(const i of Object.getOwnPropertySymbols(n))Object.prototype.propertyIsEnumerable.call(n,i)&&ai(n[i],t,e)}return n}/**
* @vue/runtime-core v3.5.29
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function hs(n,t,e,i){try{return i?n(...i):n()}catch(r){wo(r,t,e)}}function Tn(n,t,e,i){if(jt(n)){const r=hs(n,t,e,i);return r&&gh(r)&&r.catch(s=>{wo(s,t,e)}),r}if(Gt(n)){const r=[];for(let s=0;s<n.length;s++)r.push(Tn(n[s],t,e,i));return r}}function wo(n,t,e,i=!0){const r=t?t.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:o}=t&&t.appContext.config||le;if(t){let a=t.parent;const l=t.proxy,c=`https://vuejs.org/error-reference/#runtime-${e}`;for(;a;){const u=a.ec;if(u){for(let h=0;h<u.length;h++)if(u[h](n,l,c)===!1)return}a=a.parent}if(s){Xn(),hs(s,null,10,[n,l,c]),jn();return}}tp(n,e,r,i,o)}function tp(n,t,e,i=!0,r=!1){if(r)throw n;console.error(n)}const Ue=[];let gn=-1;const dr=[];let si=null,or=0;const Bh=Promise.resolve();let lo=null;function ep(n){const t=lo||Bh;return n?t.then(this?n.bind(this):n):t}function np(n){let t=gn+1,e=Ue.length;for(;t<e;){const i=t+e>>>1,r=Ue[i],s=is(r);s<n||s===n&&r.flags&2?t=i+1:e=i}return t}function ql(n){if(!(n.flags&1)){const t=is(n),e=Ue[Ue.length-1];!e||!(n.flags&2)&&t>=is(e)?Ue.push(n):Ue.splice(np(t),0,n),n.flags|=1,zh()}}function zh(){lo||(lo=Bh.then(Vh))}function ip(n){Gt(n)?dr.push(...n):si&&n.id===-1?si.splice(or+1,0,n):n.flags&1||(dr.push(n),n.flags|=1),zh()}function Cc(n,t,e=gn+1){for(;e<Ue.length;e++){const i=Ue[e];if(i&&i.flags&2){if(n&&i.id!==n.uid)continue;Ue.splice(e,1),e--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function Hh(n){if(dr.length){const t=[...new Set(dr)].sort((e,i)=>is(e)-is(i));if(dr.length=0,si){si.push(...t);return}for(si=t,or=0;or<si.length;or++){const e=si[or];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}si=null,or=0}}const is=n=>n.id==null?n.flags&2?-1:1/0:n.id;function Vh(n){try{for(gn=0;gn<Ue.length;gn++){const t=Ue[gn];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),hs(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;gn<Ue.length;gn++){const t=Ue[gn];t&&(t.flags&=-2)}gn=-1,Ue.length=0,Hh(),lo=null,(Ue.length||dr.length)&&Vh()}}let yn=null,Gh=null;function co(n){const t=yn;return yn=n,Gh=n&&n.type.__scopeId||null,t}function rp(n,t=yn,e){if(!t||n._n)return n;const i=(...r)=>{i._d&&Bc(-1);const s=co(t);let o;try{o=n(...r)}finally{co(s),i._d&&Bc(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function vi(n,t,e,i){const r=n.dirs,s=t&&t.dirs;for(let o=0;o<r.length;o++){const a=r[o];s&&(a.oldValue=s[o].value);let l=a.dir[i];l&&(Xn(),Tn(l,e,8,[n.el,a,n,t]),jn())}}function sp(n,t){if(Ne){let e=Ne.provides;const i=Ne.parent&&Ne.parent.provides;i===e&&(e=Ne.provides=Object.create(i)),e[n]=t}}function Ks(n,t,e=!1){const i=sm();if(i||mr){let r=mr?mr._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&n in r)return r[n];if(arguments.length>1)return e&&jt(t)?t.call(i&&i.proxy):t}}const op=Symbol.for("v-scx"),ap=()=>Ks(op);function pr(n,t,e){return Wh(n,t,e)}function Wh(n,t,e=le){const{immediate:i,deep:r,flush:s,once:o}=e,a=Ee({},e),l=t&&i||!t&&s!=="post";let c;if(ss){if(s==="sync"){const p=ap();c=p.__watcherHandles||(p.__watcherHandles=[])}else if(!l){const p=()=>{};return p.stop=bn,p.resume=bn,p.pause=bn,p}}const u=Ne;a.call=(p,v,_)=>Tn(p,u,v,_);let h=!1;s==="post"?a.scheduler=p=>{Be(p,u&&u.suspense)}:s!=="sync"&&(h=!0,a.scheduler=(p,v)=>{v?p():ql(p)}),a.augmentJob=p=>{t&&(p.flags|=4),h&&(p.flags|=2,u&&(p.id=u.uid,p.i=u))};const m=Qd(n,t,a);return ss&&(c?c.push(m):l&&m()),m}function lp(n,t,e){const i=this.proxy,r=ge(n)?n.includes(".")?Xh(i,n):()=>i[n]:n.bind(i,i);let s;jt(t)?s=t:(s=t.handler,e=t);const o=ds(this),a=Wh(r,s.bind(i),e);return o(),a}function Xh(n,t){const e=t.split(".");return()=>{let i=n;for(let r=0;r<e.length&&i;r++)i=i[e[r]];return i}}const cp=Symbol("_vte"),up=n=>n.__isTeleport,hp=Symbol("_leaveCb");function Yl(n,t){n.shapeFlag&6&&n.component?(n.transition=t,Yl(n.component.subTree,t)):n.shapeFlag&128?(n.ssContent.transition=t.clone(n.ssContent),n.ssFallback.transition=t.clone(n.ssFallback)):n.transition=t}function fs(n,t){return jt(n)?Ee({name:n.name},t,{setup:n}):n}function jh(n){n.ids=[n.ids[0]+n.ids[2]+++"-",0,0]}function Rc(n,t){let e;return!!((e=Object.getOwnPropertyDescriptor(n,t))&&!e.configurable)}const uo=new WeakMap;function $r(n,t,e,i,r=!1){if(Gt(n)){n.forEach((_,g)=>$r(_,t&&(Gt(t)?t[g]:t),e,i,r));return}if(Zr(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&$r(n,t,e,i.component.subTree);return}const s=i.shapeFlag&4?Ql(i.component):i.el,o=r?null:s,{i:a,r:l}=n,c=t&&t.r,u=a.refs===le?a.refs={}:a.refs,h=a.setupState,m=te(h),p=h===le?ph:_=>Rc(u,_)?!1:ee(m,_),v=(_,g)=>!(g&&Rc(u,g));if(c!=null&&c!==l){if(Pc(t),ge(c))u[c]=null,p(c)&&(h[c]=null);else if(Re(c)){const _=t;v(c,_.k)&&(c.value=null),_.k&&(u[_.k]=null)}}if(jt(l))hs(l,a,12,[o,u]);else{const _=ge(l),g=Re(l);if(_||g){const d=()=>{if(n.f){const M=_?p(l)?h[l]:u[l]:v()||!n.k?l.value:u[n.k];if(r)Gt(M)&&Ol(M,s);else if(Gt(M))M.includes(s)||M.push(s);else if(_)u[l]=[s],p(l)&&(h[l]=u[l]);else{const y=[s];v(l,n.k)&&(l.value=y),n.k&&(u[n.k]=y)}}else _?(u[l]=o,p(l)&&(h[l]=o)):g&&(v(l,n.k)&&(l.value=o),n.k&&(u[n.k]=o))};if(o){const M=()=>{d(),uo.delete(n)};M.id=-1,uo.set(n,M),Be(M,e)}else Pc(n),d()}}}function Pc(n){const t=uo.get(n);t&&(t.flags|=8,uo.delete(n))}bo().requestIdleCallback;bo().cancelIdleCallback;const Zr=n=>!!n.type.__asyncLoader,qh=n=>n.type.__isKeepAlive;function fp(n,t){Yh(n,"a",t)}function dp(n,t){Yh(n,"da",t)}function Yh(n,t,e=Ne){const i=n.__wdc||(n.__wdc=()=>{let r=e;for(;r;){if(r.isDeactivated)return;r=r.parent}return n()});if(Ao(t,i,e),e){let r=e.parent;for(;r&&r.parent;)qh(r.parent.vnode)&&pp(i,t,e,r),r=r.parent}}function pp(n,t,e,i){const r=Ao(t,n,i,!0);$l(()=>{Ol(i[t],r)},e)}function Ao(n,t,e=Ne,i=!1){if(e){const r=e[n]||(e[n]=[]),s=t.__weh||(t.__weh=(...o)=>{Xn();const a=ds(e),l=Tn(t,e,n,o);return a(),jn(),l});return i?r.unshift(s):r.push(s),s}}const $n=n=>(t,e=Ne)=>{(!ss||n==="sp")&&Ao(n,(...i)=>t(...i),e)},mp=$n("bm"),$h=$n("m"),gp=$n("bu"),_p=$n("u"),vp=$n("bum"),$l=$n("um"),xp=$n("sp"),yp=$n("rtg"),Sp=$n("rtc");function bp(n,t=Ne){Ao("ec",n,t)}const Mp=Symbol.for("v-ndc");function Ep(n,t,e,i){let r;const s=e,o=Gt(n);if(o||ge(n)){const a=o&&Ui(n);let l=!1,c=!1;a&&(l=!tn(n),c=qn(n),n=To(n)),r=new Array(n.length);for(let u=0,h=n.length;u<h;u++)r[u]=t(l?c?Sr(dn(n[u])):dn(n[u]):n[u],u,void 0,s)}else if(typeof n=="number"){r=new Array(n);for(let a=0;a<n;a++)r[a]=t(a+1,a,void 0,s)}else if(se(n))if(n[Symbol.iterator])r=Array.from(n,(a,l)=>t(a,l,void 0,s));else{const a=Object.keys(n);r=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];r[l]=t(n[u],u,l,s)}}else r=[];return r}const Fa=n=>n?_f(n)?Ql(n):Fa(n.parent):null,Kr=Ee(Object.create(null),{$:n=>n,$el:n=>n.vnode.el,$data:n=>n.data,$props:n=>n.props,$attrs:n=>n.attrs,$slots:n=>n.slots,$refs:n=>n.refs,$parent:n=>Fa(n.parent),$root:n=>Fa(n.root),$host:n=>n.ce,$emit:n=>n.emit,$options:n=>Kh(n),$forceUpdate:n=>n.f||(n.f=()=>{ql(n.update)}),$nextTick:n=>n.n||(n.n=ep.bind(n.proxy)),$watch:n=>lp.bind(n)}),Go=(n,t)=>n!==le&&!n.__isScriptSetup&&ee(n,t),Tp={get({_:n},t){if(t==="__v_skip")return!0;const{ctx:e,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=n;if(t[0]!=="$"){const m=o[t];if(m!==void 0)switch(m){case 1:return i[t];case 2:return r[t];case 4:return e[t];case 3:return s[t]}else{if(Go(i,t))return o[t]=1,i[t];if(r!==le&&ee(r,t))return o[t]=2,r[t];if(ee(s,t))return o[t]=3,s[t];if(e!==le&&ee(e,t))return o[t]=4,e[t];ka&&(o[t]=0)}}const c=Kr[t];let u,h;if(c)return t==="$attrs"&&Ce(n.attrs,"get",""),c(n);if((u=a.__cssModules)&&(u=u[t]))return u;if(e!==le&&ee(e,t))return o[t]=4,e[t];if(h=l.config.globalProperties,ee(h,t))return h[t]},set({_:n},t,e){const{data:i,setupState:r,ctx:s}=n;return Go(r,t)?(r[t]=e,!0):i!==le&&ee(i,t)?(i[t]=e,!0):ee(n.props,t)||t[0]==="$"&&t.slice(1)in n?!1:(s[t]=e,!0)},has({_:{data:n,setupState:t,accessCache:e,ctx:i,appContext:r,props:s,type:o}},a){let l;return!!(e[a]||n!==le&&a[0]!=="$"&&ee(n,a)||Go(t,a)||ee(s,a)||ee(i,a)||ee(Kr,a)||ee(r.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(n,t,e){return e.get!=null?n._.accessCache[t]=0:ee(e,"value")&&this.set(n,t,e.value,null),Reflect.defineProperty(n,t,e)}};function Lc(n){return Gt(n)?n.reduce((t,e)=>(t[e]=null,t),{}):n}let ka=!0;function wp(n){const t=Kh(n),e=n.proxy,i=n.ctx;ka=!1,t.beforeCreate&&Dc(t.beforeCreate,n,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:h,mounted:m,beforeUpdate:p,updated:v,activated:_,deactivated:g,beforeDestroy:d,beforeUnmount:M,destroyed:y,unmounted:x,render:D,renderTracked:N,renderTriggered:L,errorCaptured:z,serverPrefetch:C,expose:R,inheritAttrs:q,components:I,directives:j,filters:E}=t;if(c&&Ap(c,i,null),o)for(const $ in o){const Y=o[$];jt(Y)&&(i[$]=Y.bind(e))}if(r){const $=r.call(e,e);se($)&&(n.data=Wl($))}if(ka=!0,s)for(const $ in s){const Y=s[$],rt=jt(Y)?Y.bind(e,e):jt(Y.get)?Y.get.bind(e,e):bn,ft=!jt(Y)&&jt(Y.set)?Y.set.bind(e):bn,Q=xf({get:rt,set:ft});Object.defineProperty(i,$,{enumerable:!0,configurable:!0,get:()=>Q.value,set:nt=>Q.value=nt})}if(a)for(const $ in a)Zh(a[$],i,e,$);if(l){const $=jt(l)?l.call(e):l;Reflect.ownKeys($).forEach(Y=>{sp(Y,$[Y])})}u&&Dc(u,n,"c");function et($,Y){Gt(Y)?Y.forEach(rt=>$(rt.bind(e))):Y&&$(Y.bind(e))}if(et(mp,h),et($h,m),et(gp,p),et(_p,v),et(fp,_),et(dp,g),et(bp,z),et(Sp,N),et(yp,L),et(vp,M),et($l,x),et(xp,C),Gt(R))if(R.length){const $=n.exposed||(n.exposed={});R.forEach(Y=>{Object.defineProperty($,Y,{get:()=>e[Y],set:rt=>e[Y]=rt,enumerable:!0})})}else n.exposed||(n.exposed={});D&&n.render===bn&&(n.render=D),q!=null&&(n.inheritAttrs=q),I&&(n.components=I),j&&(n.directives=j),C&&jh(n)}function Ap(n,t,e=bn){Gt(n)&&(n=Ba(n));for(const i in n){const r=n[i];let s;se(r)?"default"in r?s=Ks(r.from||i,r.default,!0):s=Ks(r.from||i):s=Ks(r),Re(s)?Object.defineProperty(t,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):t[i]=s}}function Dc(n,t,e){Tn(Gt(n)?n.map(i=>i.bind(t.proxy)):n.bind(t.proxy),t,e)}function Zh(n,t,e,i){let r=i.includes(".")?Xh(e,i):()=>e[i];if(ge(n)){const s=t[n];jt(s)&&pr(r,s)}else if(jt(n))pr(r,n.bind(e));else if(se(n))if(Gt(n))n.forEach(s=>Zh(s,t,e,i));else{const s=jt(n.handler)?n.handler.bind(e):t[n.handler];jt(s)&&pr(r,s,n)}}function Kh(n){const t=n.type,{mixins:e,extends:i}=t,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=n.appContext,a=s.get(t);let l;return a?l=a:!r.length&&!e&&!i?l=t:(l={},r.length&&r.forEach(c=>ho(l,c,o,!0)),ho(l,t,o)),se(t)&&s.set(t,l),l}function ho(n,t,e,i=!1){const{mixins:r,extends:s}=t;s&&ho(n,s,e,!0),r&&r.forEach(o=>ho(n,o,e,!0));for(const o in t)if(!(i&&o==="expose")){const a=Cp[o]||e&&e[o];n[o]=a?a(n[o],t[o]):t[o]}return n}const Cp={data:Ic,props:Uc,emits:Uc,methods:Gr,computed:Gr,beforeCreate:Pe,created:Pe,beforeMount:Pe,mounted:Pe,beforeUpdate:Pe,updated:Pe,beforeDestroy:Pe,beforeUnmount:Pe,destroyed:Pe,unmounted:Pe,activated:Pe,deactivated:Pe,errorCaptured:Pe,serverPrefetch:Pe,components:Gr,directives:Gr,watch:Pp,provide:Ic,inject:Rp};function Ic(n,t){return t?n?function(){return Ee(jt(n)?n.call(this,this):n,jt(t)?t.call(this,this):t)}:t:n}function Rp(n,t){return Gr(Ba(n),Ba(t))}function Ba(n){if(Gt(n)){const t={};for(let e=0;e<n.length;e++)t[n[e]]=n[e];return t}return n}function Pe(n,t){return n?[...new Set([].concat(n,t))]:t}function Gr(n,t){return n?Ee(Object.create(null),n,t):t}function Uc(n,t){return n?Gt(n)&&Gt(t)?[...new Set([...n,...t])]:Ee(Object.create(null),Lc(n),Lc(t??{})):t}function Pp(n,t){if(!n)return t;if(!t)return n;const e=Ee(Object.create(null),n);for(const i in t)e[i]=Pe(n[i],t[i]);return e}function Jh(){return{app:null,config:{isNativeTag:ph,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Lp=0;function Dp(n,t){return function(i,r=null){jt(i)||(i=Ee({},i)),r!=null&&!se(r)&&(r=null);const s=Jh(),o=new WeakSet,a=[];let l=!1;const c=s.app={_uid:Lp++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:hm,get config(){return s.config},set config(u){},use(u,...h){return o.has(u)||(u&&jt(u.install)?(o.add(u),u.install(c,...h)):jt(u)&&(o.add(u),u(c,...h))),c},mixin(u){return s.mixins.includes(u)||s.mixins.push(u),c},component(u,h){return h?(s.components[u]=h,c):s.components[u]},directive(u,h){return h?(s.directives[u]=h,c):s.directives[u]},mount(u,h,m){if(!l){const p=c._ceVNode||$e(i,r);return p.appContext=s,m===!0?m="svg":m===!1&&(m=void 0),n(p,u,m),l=!0,c._container=u,u.__vue_app__=c,Ql(p.component)}},onUnmount(u){a.push(u)},unmount(){l&&(Tn(a,c._instance,16),n(null,c._container),delete c._container.__vue_app__)},provide(u,h){return s.provides[u]=h,c},runWithContext(u){const h=mr;mr=c;try{return u()}finally{mr=h}}};return c}}let mr=null;const Ip=(n,t)=>t==="modelValue"||t==="model-value"?n.modelModifiers:n[`${t}Modifiers`]||n[`${di(t)}Modifiers`]||n[`${zi(t)}Modifiers`];function Up(n,t,...e){if(n.isUnmounted)return;const i=n.vnode.props||le;let r=e;const s=t.startsWith("update:"),o=s&&Ip(i,t.slice(7));o&&(o.trim&&(r=e.map(u=>ge(u)?u.trim():u)),o.number&&(r=e.map(_d)));let a,l=i[a=Fo(t)]||i[a=Fo(di(t))];!l&&s&&(l=i[a=Fo(zi(t))]),l&&Tn(l,n,6,r);const c=i[a+"Once"];if(c){if(!n.emitted)n.emitted={};else if(n.emitted[a])return;n.emitted[a]=!0,Tn(c,n,6,r)}}const Np=new WeakMap;function Qh(n,t,e=!1){const i=e?Np:t.emitsCache,r=i.get(n);if(r!==void 0)return r;const s=n.emits;let o={},a=!1;if(!jt(n)){const l=c=>{const u=Qh(c,t,!0);u&&(a=!0,Ee(o,u))};!e&&t.mixins.length&&t.mixins.forEach(l),n.extends&&l(n.extends),n.mixins&&n.mixins.forEach(l)}return!s&&!a?(se(n)&&i.set(n,null),null):(Gt(s)?s.forEach(l=>o[l]=null):Ee(o,s),se(n)&&i.set(n,o),o)}function Co(n,t){return!n||!yo(t)?!1:(t=t.slice(2).replace(/Once$/,""),ee(n,t[0].toLowerCase()+t.slice(1))||ee(n,zi(t))||ee(n,t))}function Nc(n){const{type:t,vnode:e,proxy:i,withProxy:r,propsOptions:[s],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:h,data:m,setupState:p,ctx:v,inheritAttrs:_}=n,g=co(n);let d,M;try{if(e.shapeFlag&4){const x=r||i,D=x;d=vn(c.call(D,x,u,h,p,m,v)),M=a}else{const x=t;d=vn(x.length>1?x(h,{attrs:a,slots:o,emit:l}):x(h,null)),M=t.props?a:Op(a)}}catch(x){Jr.length=0,wo(x,n,1),d=$e(pi)}let y=d;if(M&&_!==!1){const x=Object.keys(M),{shapeFlag:D}=y;x.length&&D&7&&(s&&x.some(Nl)&&(M=Fp(M,s)),y=br(y,M,!1,!0))}return e.dirs&&(y=br(y,null,!1,!0),y.dirs=y.dirs?y.dirs.concat(e.dirs):e.dirs),e.transition&&Yl(y,e.transition),d=y,co(g),d}const Op=n=>{let t;for(const e in n)(e==="class"||e==="style"||yo(e))&&((t||(t={}))[e]=n[e]);return t},Fp=(n,t)=>{const e={};for(const i in n)(!Nl(i)||!(i.slice(9)in t))&&(e[i]=n[i]);return e};function kp(n,t,e){const{props:i,children:r,component:s}=n,{props:o,children:a,patchFlag:l}=t,c=s.emitsOptions;if(t.dirs||t.transition)return!0;if(e&&l>=0){if(l&1024)return!0;if(l&16)return i?Oc(i,o,c):!!o;if(l&8){const u=t.dynamicProps;for(let h=0;h<u.length;h++){const m=u[h];if(tf(o,i,m)&&!Co(c,m))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?Oc(i,o,c):!0:!!o;return!1}function Oc(n,t,e){const i=Object.keys(t);if(i.length!==Object.keys(n).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(tf(t,n,s)&&!Co(e,s))return!0}return!1}function tf(n,t,e){const i=n[e],r=t[e];return e==="style"&&se(i)&&se(r)?!kl(i,r):i!==r}function Bp({vnode:n,parent:t},e){for(;t;){const i=t.subTree;if(i.suspense&&i.suspense.activeBranch===n&&(i.el=n.el),i===n)(n=t.vnode).el=e,t=t.parent;else break}}const ef={},nf=()=>Object.create(ef),rf=n=>Object.getPrototypeOf(n)===ef;function zp(n,t,e,i=!1){const r={},s=nf();n.propsDefaults=Object.create(null),sf(n,t,r,s);for(const o in n.propsOptions[0])o in r||(r[o]=void 0);e?n.props=i?r:Xd(r):n.type.props?n.props=r:n.props=s,n.attrs=s}function Hp(n,t,e,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=n,a=te(r),[l]=n.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=n.vnode.dynamicProps;for(let h=0;h<u.length;h++){let m=u[h];if(Co(n.emitsOptions,m))continue;const p=t[m];if(l)if(ee(s,m))p!==s[m]&&(s[m]=p,c=!0);else{const v=di(m);r[v]=za(l,a,v,p,n,!1)}else p!==s[m]&&(s[m]=p,c=!0)}}}else{sf(n,t,r,s)&&(c=!0);let u;for(const h in a)(!t||!ee(t,h)&&((u=zi(h))===h||!ee(t,u)))&&(l?e&&(e[h]!==void 0||e[u]!==void 0)&&(r[h]=za(l,a,h,void 0,n,!0)):delete r[h]);if(s!==a)for(const h in s)(!t||!ee(t,h))&&(delete s[h],c=!0)}c&&zn(n.attrs,"set","")}function sf(n,t,e,i){const[r,s]=n.propsOptions;let o=!1,a;if(t)for(let l in t){if(jr(l))continue;const c=t[l];let u;r&&ee(r,u=di(l))?!s||!s.includes(u)?e[u]=c:(a||(a={}))[u]=c:Co(n.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=te(e),c=a||le;for(let u=0;u<s.length;u++){const h=s[u];e[h]=za(r,l,h,c[h],n,!ee(c,h))}}return o}function za(n,t,e,i,r,s){const o=n[e];if(o!=null){const a=ee(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&jt(l)){const{propsDefaults:c}=r;if(e in c)i=c[e];else{const u=ds(r);i=c[e]=l.call(null,t),u()}}else i=l;r.ce&&r.ce._setProp(e,i)}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===zi(e))&&(i=!0))}return i}const Vp=new WeakMap;function of(n,t,e=!1){const i=e?Vp:t.propsCache,r=i.get(n);if(r)return r;const s=n.props,o={},a=[];let l=!1;if(!jt(n)){const u=h=>{l=!0;const[m,p]=of(h,t,!0);Ee(o,m),p&&a.push(...p)};!e&&t.mixins.length&&t.mixins.forEach(u),n.extends&&u(n.extends),n.mixins&&n.mixins.forEach(u)}if(!s&&!l)return se(n)&&i.set(n,hr),hr;if(Gt(s))for(let u=0;u<s.length;u++){const h=di(s[u]);Fc(h)&&(o[h]=le)}else if(s)for(const u in s){const h=di(u);if(Fc(h)){const m=s[u],p=o[h]=Gt(m)||jt(m)?{type:m}:Ee({},m),v=p.type;let _=!1,g=!0;if(Gt(v))for(let d=0;d<v.length;++d){const M=v[d],y=jt(M)&&M.name;if(y==="Boolean"){_=!0;break}else y==="String"&&(g=!1)}else _=jt(v)&&v.name==="Boolean";p[0]=_,p[1]=g,(_||ee(p,"default"))&&a.push(h)}}const c=[o,a];return se(n)&&i.set(n,c),c}function Fc(n){return n[0]!=="$"&&!jr(n)}const Zl=n=>n==="_"||n==="_ctx"||n==="$stable",Kl=n=>Gt(n)?n.map(vn):[vn(n)],Gp=(n,t,e)=>{if(t._n)return t;const i=rp((...r)=>Kl(t(...r)),e);return i._c=!1,i},af=(n,t,e)=>{const i=n._ctx;for(const r in n){if(Zl(r))continue;const s=n[r];if(jt(s))t[r]=Gp(r,s,i);else if(s!=null){const o=Kl(s);t[r]=()=>o}}},lf=(n,t)=>{const e=Kl(t);n.slots.default=()=>e},cf=(n,t,e)=>{for(const i in t)(e||!Zl(i))&&(n[i]=t[i])},Wp=(n,t,e)=>{const i=n.slots=nf();if(n.vnode.shapeFlag&32){const r=t._;r?(cf(i,t,e),e&&yh(i,"_",r,!0)):af(t,i)}else t&&lf(n,t)},Xp=(n,t,e)=>{const{vnode:i,slots:r}=n;let s=!0,o=le;if(i.shapeFlag&32){const a=t._;a?e&&a===1?s=!1:cf(r,t,e):(s=!t.$stable,af(t,r)),o=t}else t&&(lf(n,t),o={default:1});if(s)for(const a in r)!Zl(a)&&o[a]==null&&delete r[a]},Be=Zp;function jp(n){return qp(n)}function qp(n,t){const e=bo();e.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:h,nextSibling:m,setScopeId:p=bn,insertStaticContent:v}=n,_=(P,k,f,F=null,U=null,A=null,S=void 0,T=null,X=!!k.dynamicChildren)=>{if(P===k)return;P&&!Or(P,k)&&(F=O(P),nt(P,U,A,!0),P=null),k.patchFlag===-2&&(X=!1,k.dynamicChildren=null);const{type:w,ref:b,shapeFlag:H}=k;switch(w){case Ro:g(P,k,f,F);break;case pi:d(P,k,f,F);break;case Xo:P==null&&M(k,f,F,S);break;case _n:I(P,k,f,F,U,A,S,T,X);break;default:H&1?D(P,k,f,F,U,A,S,T,X):H&6?j(P,k,f,F,U,A,S,T,X):(H&64||H&128)&&w.process(P,k,f,F,U,A,S,T,X,st)}b!=null&&U?$r(b,P&&P.ref,A,k||P,!k):b==null&&P&&P.ref!=null&&$r(P.ref,null,A,P,!0)},g=(P,k,f,F)=>{if(P==null)i(k.el=a(k.children),f,F);else{const U=k.el=P.el;k.children!==P.children&&c(U,k.children)}},d=(P,k,f,F)=>{P==null?i(k.el=l(k.children||""),f,F):k.el=P.el},M=(P,k,f,F)=>{[P.el,P.anchor]=v(P.children,k,f,F,P.el,P.anchor)},y=({el:P,anchor:k},f,F)=>{let U;for(;P&&P!==k;)U=m(P),i(P,f,F),P=U;i(k,f,F)},x=({el:P,anchor:k})=>{let f;for(;P&&P!==k;)f=m(P),r(P),P=f;r(k)},D=(P,k,f,F,U,A,S,T,X)=>{if(k.type==="svg"?S="svg":k.type==="math"&&(S="mathml"),P==null)N(k,f,F,U,A,S,T,X);else{const w=P.el&&P.el._isVueCE?P.el:null;try{w&&w._beginPatch(),C(P,k,U,A,S,T,X)}finally{w&&w._endPatch()}}},N=(P,k,f,F,U,A,S,T)=>{let X,w;const{props:b,shapeFlag:H,transition:Z,dirs:J}=P;if(X=P.el=o(P.type,A,b&&b.is,b),H&8?u(X,P.children):H&16&&z(P.children,X,null,F,U,Wo(P,A),S,T),J&&vi(P,null,F,"created"),L(X,P,P.scopeId,S,F),b){for(const _t in b)_t!=="value"&&!jr(_t)&&s(X,_t,null,b[_t],A,F);"value"in b&&s(X,"value",null,b.value,A),(w=b.onVnodeBeforeMount)&&mn(w,F,P)}J&&vi(P,null,F,"beforeMount");const tt=Yp(U,Z);tt&&Z.beforeEnter(X),i(X,k,f),((w=b&&b.onVnodeMounted)||tt||J)&&Be(()=>{w&&mn(w,F,P),tt&&Z.enter(X),J&&vi(P,null,F,"mounted")},U)},L=(P,k,f,F,U)=>{if(f&&p(P,f),F)for(let A=0;A<F.length;A++)p(P,F[A]);if(U){let A=U.subTree;if(k===A||df(A.type)&&(A.ssContent===k||A.ssFallback===k)){const S=U.vnode;L(P,S,S.scopeId,S.slotScopeIds,U.parent)}}},z=(P,k,f,F,U,A,S,T,X=0)=>{for(let w=X;w<P.length;w++){const b=P[w]=T?Bn(P[w]):vn(P[w]);_(null,b,k,f,F,U,A,S,T)}},C=(P,k,f,F,U,A,S)=>{const T=k.el=P.el;let{patchFlag:X,dynamicChildren:w,dirs:b}=k;X|=P.patchFlag&16;const H=P.props||le,Z=k.props||le;let J;if(f&&xi(f,!1),(J=Z.onVnodeBeforeUpdate)&&mn(J,f,k,P),b&&vi(k,P,f,"beforeUpdate"),f&&xi(f,!0),(H.innerHTML&&Z.innerHTML==null||H.textContent&&Z.textContent==null)&&u(T,""),w?R(P.dynamicChildren,w,T,f,F,Wo(k,U),A):S||Y(P,k,T,null,f,F,Wo(k,U),A,!1),X>0){if(X&16)q(T,H,Z,f,U);else if(X&2&&H.class!==Z.class&&s(T,"class",null,Z.class,U),X&4&&s(T,"style",H.style,Z.style,U),X&8){const tt=k.dynamicProps;for(let _t=0;_t<tt.length;_t++){const ht=tt[_t],St=H[ht],It=Z[ht];(It!==St||ht==="value")&&s(T,ht,St,It,U,f)}}X&1&&P.children!==k.children&&u(T,k.children)}else!S&&w==null&&q(T,H,Z,f,U);((J=Z.onVnodeUpdated)||b)&&Be(()=>{J&&mn(J,f,k,P),b&&vi(k,P,f,"updated")},F)},R=(P,k,f,F,U,A,S)=>{for(let T=0;T<k.length;T++){const X=P[T],w=k[T],b=X.el&&(X.type===_n||!Or(X,w)||X.shapeFlag&198)?h(X.el):f;_(X,w,b,null,F,U,A,S,!0)}},q=(P,k,f,F,U)=>{if(k!==f){if(k!==le)for(const A in k)!jr(A)&&!(A in f)&&s(P,A,k[A],null,U,F);for(const A in f){if(jr(A))continue;const S=f[A],T=k[A];S!==T&&A!=="value"&&s(P,A,T,S,U,F)}"value"in f&&s(P,"value",k.value,f.value,U)}},I=(P,k,f,F,U,A,S,T,X)=>{const w=k.el=P?P.el:a(""),b=k.anchor=P?P.anchor:a("");let{patchFlag:H,dynamicChildren:Z,slotScopeIds:J}=k;J&&(T=T?T.concat(J):J),P==null?(i(w,f,F),i(b,f,F),z(k.children||[],f,b,U,A,S,T,X)):H>0&&H&64&&Z&&P.dynamicChildren&&P.dynamicChildren.length===Z.length?(R(P.dynamicChildren,Z,f,U,A,S,T),(k.key!=null||U&&k===U.subTree)&&uf(P,k,!0)):Y(P,k,f,b,U,A,S,T,X)},j=(P,k,f,F,U,A,S,T,X)=>{k.slotScopeIds=T,P==null?k.shapeFlag&512?U.ctx.activate(k,f,F,S,X):E(k,f,F,U,A,S,X):K(P,k,X)},E=(P,k,f,F,U,A,S)=>{const T=P.component=rm(P,F,U);if(qh(P)&&(T.ctx.renderer=st),om(T,!1,S),T.asyncDep){if(U&&U.registerDep(T,et,S),!P.el){const X=T.subTree=$e(pi);d(null,X,k,f),P.placeholder=X.el}}else et(T,P,k,f,U,A,S)},K=(P,k,f)=>{const F=k.component=P.component;if(kp(P,k,f))if(F.asyncDep&&!F.asyncResolved){$(F,k,f);return}else F.next=k,F.update();else k.el=P.el,F.vnode=k},et=(P,k,f,F,U,A,S)=>{const T=()=>{if(P.isMounted){let{next:H,bu:Z,u:J,parent:tt,vnode:_t}=P;{const Et=hf(P);if(Et){H&&(H.el=_t.el,$(P,H,S)),Et.asyncDep.then(()=>{Be(()=>{P.isUnmounted||w()},U)});return}}let ht=H,St;xi(P,!1),H?(H.el=_t.el,$(P,H,S)):H=_t,Z&&ko(Z),(St=H.props&&H.props.onVnodeBeforeUpdate)&&mn(St,tt,H,_t),xi(P,!0);const It=Nc(P),vt=P.subTree;P.subTree=It,_(vt,It,h(vt.el),O(vt),P,U,A),H.el=It.el,ht===null&&Bp(P,It.el),J&&Be(J,U),(St=H.props&&H.props.onVnodeUpdated)&&Be(()=>mn(St,tt,H,_t),U)}else{let H;const{el:Z,props:J}=k,{bm:tt,m:_t,parent:ht,root:St,type:It}=P,vt=Zr(k);xi(P,!1),tt&&ko(tt),!vt&&(H=J&&J.onVnodeBeforeMount)&&mn(H,ht,k),xi(P,!0);{St.ce&&St.ce._hasShadowRoot()&&St.ce._injectChildStyle(It);const Et=P.subTree=Nc(P);_(null,Et,f,F,P,U,A),k.el=Et.el}if(_t&&Be(_t,U),!vt&&(H=J&&J.onVnodeMounted)){const Et=k;Be(()=>mn(H,ht,Et),U)}(k.shapeFlag&256||ht&&Zr(ht.vnode)&&ht.vnode.shapeFlag&256)&&P.a&&Be(P.a,U),P.isMounted=!0,k=f=F=null}};P.scope.on();const X=P.effect=new Eh(T);P.scope.off();const w=P.update=X.run.bind(X),b=P.job=X.runIfDirty.bind(X);b.i=P,b.id=P.uid,X.scheduler=()=>ql(b),xi(P,!0),w()},$=(P,k,f)=>{k.component=P;const F=P.vnode.props;P.vnode=k,P.next=null,Hp(P,k.props,F,f),Xp(P,k.children,f),Xn(),Cc(P),jn()},Y=(P,k,f,F,U,A,S,T,X=!1)=>{const w=P&&P.children,b=P?P.shapeFlag:0,H=k.children,{patchFlag:Z,shapeFlag:J}=k;if(Z>0){if(Z&128){ft(w,H,f,F,U,A,S,T,X);return}else if(Z&256){rt(w,H,f,F,U,A,S,T,X);return}}J&8?(b&16&&V(w,U,A),H!==w&&u(f,H)):b&16?J&16?ft(w,H,f,F,U,A,S,T,X):V(w,U,A,!0):(b&8&&u(f,""),J&16&&z(H,f,F,U,A,S,T,X))},rt=(P,k,f,F,U,A,S,T,X)=>{P=P||hr,k=k||hr;const w=P.length,b=k.length,H=Math.min(w,b);let Z;for(Z=0;Z<H;Z++){const J=k[Z]=X?Bn(k[Z]):vn(k[Z]);_(P[Z],J,f,null,U,A,S,T,X)}w>b?V(P,U,A,!0,!1,H):z(k,f,F,U,A,S,T,X,H)},ft=(P,k,f,F,U,A,S,T,X)=>{let w=0;const b=k.length;let H=P.length-1,Z=b-1;for(;w<=H&&w<=Z;){const J=P[w],tt=k[w]=X?Bn(k[w]):vn(k[w]);if(Or(J,tt))_(J,tt,f,null,U,A,S,T,X);else break;w++}for(;w<=H&&w<=Z;){const J=P[H],tt=k[Z]=X?Bn(k[Z]):vn(k[Z]);if(Or(J,tt))_(J,tt,f,null,U,A,S,T,X);else break;H--,Z--}if(w>H){if(w<=Z){const J=Z+1,tt=J<b?k[J].el:F;for(;w<=Z;)_(null,k[w]=X?Bn(k[w]):vn(k[w]),f,tt,U,A,S,T,X),w++}}else if(w>Z)for(;w<=H;)nt(P[w],U,A,!0),w++;else{const J=w,tt=w,_t=new Map;for(w=tt;w<=Z;w++){const Tt=k[w]=X?Bn(k[w]):vn(k[w]);Tt.key!=null&&_t.set(Tt.key,w)}let ht,St=0;const It=Z-tt+1;let vt=!1,Et=0;const wt=new Array(It);for(w=0;w<It;w++)wt[w]=0;for(w=J;w<=H;w++){const Tt=P[w];if(St>=It){nt(Tt,U,A,!0);continue}let Bt;if(Tt.key!=null)Bt=_t.get(Tt.key);else for(ht=tt;ht<=Z;ht++)if(wt[ht-tt]===0&&Or(Tt,k[ht])){Bt=ht;break}Bt===void 0?nt(Tt,U,A,!0):(wt[Bt-tt]=w+1,Bt>=Et?Et=Bt:vt=!0,_(Tt,k[Bt],f,null,U,A,S,T,X),St++)}const kt=vt?$p(wt):hr;for(ht=kt.length-1,w=It-1;w>=0;w--){const Tt=tt+w,Bt=k[Tt],Ht=k[Tt+1],Kt=Tt+1<b?Ht.el||ff(Ht):F;wt[w]===0?_(null,Bt,f,Kt,U,A,S,T,X):vt&&(ht<0||w!==kt[ht]?Q(Bt,f,Kt,2):ht--)}}},Q=(P,k,f,F,U=null)=>{const{el:A,type:S,transition:T,children:X,shapeFlag:w}=P;if(w&6){Q(P.component.subTree,k,f,F);return}if(w&128){P.suspense.move(k,f,F);return}if(w&64){S.move(P,k,f,st);return}if(S===_n){i(A,k,f);for(let H=0;H<X.length;H++)Q(X[H],k,f,F);i(P.anchor,k,f);return}if(S===Xo){y(P,k,f);return}if(F!==2&&w&1&&T)if(F===0)T.beforeEnter(A),i(A,k,f),Be(()=>T.enter(A),U);else{const{leave:H,delayLeave:Z,afterLeave:J}=T,tt=()=>{P.ctx.isUnmounted?r(A):i(A,k,f)},_t=()=>{A._isLeaving&&A[hp](!0),H(A,()=>{tt(),J&&J()})};Z?Z(A,tt,_t):_t()}else i(A,k,f)},nt=(P,k,f,F=!1,U=!1)=>{const{type:A,props:S,ref:T,children:X,dynamicChildren:w,shapeFlag:b,patchFlag:H,dirs:Z,cacheIndex:J}=P;if(H===-2&&(U=!1),T!=null&&(Xn(),$r(T,null,f,P,!0),jn()),J!=null&&(k.renderCache[J]=void 0),b&256){k.ctx.deactivate(P);return}const tt=b&1&&Z,_t=!Zr(P);let ht;if(_t&&(ht=S&&S.onVnodeBeforeUnmount)&&mn(ht,k,P),b&6)B(P.component,f,F);else{if(b&128){P.suspense.unmount(f,F);return}tt&&vi(P,null,k,"beforeUnmount"),b&64?P.type.remove(P,k,f,st,F):w&&!w.hasOnce&&(A!==_n||H>0&&H&64)?V(w,k,f,!1,!0):(A===_n&&H&384||!U&&b&16)&&V(X,k,f),F&&bt(P)}(_t&&(ht=S&&S.onVnodeUnmounted)||tt)&&Be(()=>{ht&&mn(ht,k,P),tt&&vi(P,null,k,"unmounted")},f)},bt=P=>{const{type:k,el:f,anchor:F,transition:U}=P;if(k===_n){W(f,F);return}if(k===Xo){x(P);return}const A=()=>{r(f),U&&!U.persisted&&U.afterLeave&&U.afterLeave()};if(P.shapeFlag&1&&U&&!U.persisted){const{leave:S,delayLeave:T}=U,X=()=>S(f,A);T?T(P.el,A,X):X()}else A()},W=(P,k)=>{let f;for(;P!==k;)f=m(P),r(P),P=f;r(k)},B=(P,k,f)=>{const{bum:F,scope:U,job:A,subTree:S,um:T,m:X,a:w}=P;kc(X),kc(w),F&&ko(F),U.stop(),A&&(A.flags|=8,nt(S,P,k,f)),T&&Be(T,k),Be(()=>{P.isUnmounted=!0},k)},V=(P,k,f,F=!1,U=!1,A=0)=>{for(let S=A;S<P.length;S++)nt(P[S],k,f,F,U)},O=P=>{if(P.shapeFlag&6)return O(P.component.subTree);if(P.shapeFlag&128)return P.suspense.next();const k=m(P.anchor||P.el),f=k&&k[cp];return f?m(f):k};let it=!1;const ut=(P,k,f)=>{let F;P==null?k._vnode&&(nt(k._vnode,null,null,!0),F=k._vnode.component):_(k._vnode||null,P,k,null,null,null,f),k._vnode=P,it||(it=!0,Cc(F),Hh(),it=!1)},st={p:_,um:nt,m:Q,r:bt,mt:E,mc:z,pc:Y,pbc:R,n:O,o:n};return{render:ut,hydrate:void 0,createApp:Dp(ut)}}function Wo({type:n,props:t},e){return e==="svg"&&n==="foreignObject"||e==="mathml"&&n==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:e}function xi({effect:n,job:t},e){e?(n.flags|=32,t.flags|=4):(n.flags&=-33,t.flags&=-5)}function Yp(n,t){return(!n||n&&!n.pendingBranch)&&t&&!t.persisted}function uf(n,t,e=!1){const i=n.children,r=t.children;if(Gt(i)&&Gt(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=Bn(r[s]),a.el=o.el),!e&&a.patchFlag!==-2&&uf(o,a)),a.type===Ro&&(a.patchFlag===-1&&(a=r[s]=Bn(a)),a.el=o.el),a.type===pi&&!a.el&&(a.el=o.el)}}function $p(n){const t=n.slice(),e=[0];let i,r,s,o,a;const l=n.length;for(i=0;i<l;i++){const c=n[i];if(c!==0){if(r=e[e.length-1],n[r]<c){t[i]=r,e.push(i);continue}for(s=0,o=e.length-1;s<o;)a=s+o>>1,n[e[a]]<c?s=a+1:o=a;c<n[e[s]]&&(s>0&&(t[i]=e[s-1]),e[s]=i)}}for(s=e.length,o=e[s-1];s-- >0;)e[s]=o,o=t[o];return e}function hf(n){const t=n.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:hf(t)}function kc(n){if(n)for(let t=0;t<n.length;t++)n[t].flags|=8}function ff(n){if(n.placeholder)return n.placeholder;const t=n.component;return t?ff(t.subTree):null}const df=n=>n.__isSuspense;function Zp(n,t){t&&t.pendingBranch?Gt(n)?t.effects.push(...n):t.effects.push(n):ip(n)}const _n=Symbol.for("v-fgt"),Ro=Symbol.for("v-txt"),pi=Symbol.for("v-cmt"),Xo=Symbol.for("v-stc"),Jr=[];let Ye=null;function Ie(n=!1){Jr.push(Ye=n?null:[])}function Kp(){Jr.pop(),Ye=Jr[Jr.length-1]||null}let rs=1;function Bc(n,t=!1){rs+=n,n<0&&Ye&&t&&(Ye.hasOnce=!0)}function pf(n){return n.dynamicChildren=rs>0?Ye||hr:null,Kp(),rs>0&&Ye&&Ye.push(n),n}function He(n,t,e,i,r,s){return pf(Dt(n,t,e,i,r,s,!0))}function Jp(n,t,e,i,r){return pf($e(n,t,e,i,r,!0))}function mf(n){return n?n.__v_isVNode===!0:!1}function Or(n,t){return n.type===t.type&&n.key===t.key}const gf=({key:n})=>n??null,Js=({ref:n,ref_key:t,ref_for:e})=>(typeof n=="number"&&(n=""+n),n!=null?ge(n)||Re(n)||jt(n)?{i:yn,r:n,k:t,f:!!e}:n:null);function Dt(n,t=null,e=null,i=0,r=null,s=n===_n?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:n,props:t,key:t&&gf(t),ref:t&&Js(t),scopeId:Gh,slotScopeIds:null,children:e,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:yn};return a?(Jl(l,e),s&128&&n.normalize(l)):e&&(l.shapeFlag|=ge(e)?8:16),rs>0&&!o&&Ye&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&Ye.push(l),l}const $e=Qp;function Qp(n,t=null,e=null,i=0,r=null,s=!1){if((!n||n===Mp)&&(n=pi),mf(n)){const a=br(n,t,!0);return e&&Jl(a,e),rs>0&&!s&&Ye&&(a.shapeFlag&6?Ye[Ye.indexOf(n)]=a:Ye.push(a)),a.patchFlag=-2,a}if(um(n)&&(n=n.__vccOpts),t){t=tm(t);let{class:a,style:l}=t;a&&!ge(a)&&(t.class=Eo(a)),se(l)&&(jl(l)&&!Gt(l)&&(l=Ee({},l)),t.style=Mo(l))}const o=ge(n)?1:df(n)?128:up(n)?64:se(n)?4:jt(n)?2:0;return Dt(n,t,e,i,r,o,s,!0)}function tm(n){return n?jl(n)||rf(n)?Ee({},n):n:null}function br(n,t,e=!1,i=!1){const{props:r,ref:s,patchFlag:o,children:a,transition:l}=n,c=t?em(r||{},t):r,u={__v_isVNode:!0,__v_skip:!0,type:n.type,props:c,key:c&&gf(c),ref:t&&t.ref?e&&s?Gt(s)?s.concat(Js(t)):[s,Js(t)]:Js(t):s,scopeId:n.scopeId,slotScopeIds:n.slotScopeIds,children:a,target:n.target,targetStart:n.targetStart,targetAnchor:n.targetAnchor,staticCount:n.staticCount,shapeFlag:n.shapeFlag,patchFlag:t&&n.type!==_n?o===-1?16:o|16:o,dynamicProps:n.dynamicProps,dynamicChildren:n.dynamicChildren,appContext:n.appContext,dirs:n.dirs,transition:l,component:n.component,suspense:n.suspense,ssContent:n.ssContent&&br(n.ssContent),ssFallback:n.ssFallback&&br(n.ssFallback),placeholder:n.placeholder,el:n.el,anchor:n.anchor,ctx:n.ctx,ce:n.ce};return l&&i&&Yl(u,l.clone(u)),u}function Ha(n=" ",t=0){return $e(Ro,null,n,t)}function fo(n="",t=!1){return t?(Ie(),Jp(pi,null,n)):$e(pi,null,n)}function vn(n){return n==null||typeof n=="boolean"?$e(pi):Gt(n)?$e(_n,null,n.slice()):mf(n)?Bn(n):$e(Ro,null,String(n))}function Bn(n){return n.el===null&&n.patchFlag!==-1||n.memo?n:br(n)}function Jl(n,t){let e=0;const{shapeFlag:i}=n;if(t==null)t=null;else if(Gt(t))e=16;else if(typeof t=="object")if(i&65){const r=t.default;r&&(r._c&&(r._d=!1),Jl(n,r()),r._c&&(r._d=!0));return}else{e=32;const r=t._;!r&&!rf(t)?t._ctx=yn:r===3&&yn&&(yn.slots._===1?t._=1:(t._=2,n.patchFlag|=1024))}else jt(t)?(t={default:t,_ctx:yn},e=32):(t=String(t),i&64?(e=16,t=[Ha(t)]):e=8);n.children=t,n.shapeFlag|=e}function em(...n){const t={};for(let e=0;e<n.length;e++){const i=n[e];for(const r in i)if(r==="class")t.class!==i.class&&(t.class=Eo([t.class,i.class]));else if(r==="style")t.style=Mo([t.style,i.style]);else if(yo(r)){const s=t[r],o=i[r];o&&s!==o&&!(Gt(s)&&s.includes(o))&&(t[r]=s?[].concat(s,o):o)}else r!==""&&(t[r]=i[r])}return t}function mn(n,t,e,i=null){Tn(n,t,7,[e,i])}const nm=Jh();let im=0;function rm(n,t,e){const i=n.type,r=(t?t.appContext:n.appContext)||nm,s={uid:im++,vnode:n,type:i,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Td(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:of(i,r),emitsOptions:Qh(i,r),emit:null,emitted:null,propsDefaults:le,inheritAttrs:i.inheritAttrs,ctx:le,data:le,props:le,attrs:le,slots:le,refs:le,setupState:le,setupContext:null,suspense:e,suspenseId:e?e.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=t?t.root:s,s.emit=Up.bind(null,s),n.ce&&n.ce(s),s}let Ne=null;const sm=()=>Ne||yn;let po,Va;{const n=bo(),t=(e,i)=>{let r;return(r=n[e])||(r=n[e]=[]),r.push(i),s=>{r.length>1?r.forEach(o=>o(s)):r[0](s)}};po=t("__VUE_INSTANCE_SETTERS__",e=>Ne=e),Va=t("__VUE_SSR_SETTERS__",e=>ss=e)}const ds=n=>{const t=Ne;return po(n),n.scope.on(),()=>{n.scope.off(),po(t)}},zc=()=>{Ne&&Ne.scope.off(),po(null)};function _f(n){return n.vnode.shapeFlag&4}let ss=!1;function om(n,t=!1,e=!1){t&&Va(t);const{props:i,children:r}=n.vnode,s=_f(n);zp(n,i,s,t),Wp(n,r,e||t);const o=s?am(n,t):void 0;return t&&Va(!1),o}function am(n,t){const e=n.type;n.accessCache=Object.create(null),n.proxy=new Proxy(n.ctx,Tp);const{setup:i}=e;if(i){Xn();const r=n.setupContext=i.length>1?cm(n):null,s=ds(n),o=hs(i,n,0,[n.props,r]),a=gh(o);if(jn(),s(),(a||n.sp)&&!Zr(n)&&jh(n),a){if(o.then(zc,zc),t)return o.then(l=>{Hc(n,l)}).catch(l=>{wo(l,n,0)});n.asyncDep=o}else Hc(n,o)}else vf(n)}function Hc(n,t,e){jt(t)?n.type.__ssrInlineRender?n.ssrRender=t:n.render=t:se(t)&&(n.setupState=kh(t)),vf(n)}function vf(n,t,e){const i=n.type;n.render||(n.render=i.render||bn);{const r=ds(n);Xn();try{wp(n)}finally{jn(),r()}}}const lm={get(n,t){return Ce(n,"get",""),n[t]}};function cm(n){const t=e=>{n.exposed=e||{}};return{attrs:new Proxy(n.attrs,lm),slots:n.slots,emit:n.emit,expose:t}}function Ql(n){return n.exposed?n.exposeProxy||(n.exposeProxy=new Proxy(kh(jd(n.exposed)),{get(t,e){if(e in t)return t[e];if(e in Kr)return Kr[e](n)},has(t,e){return e in t||e in Kr}})):n.proxy}function um(n){return jt(n)&&"__vccOpts"in n}const xf=(n,t)=>Kd(n,t,ss),hm="3.5.29";/**
* @vue/runtime-dom v3.5.29
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ga;const Vc=typeof window<"u"&&window.trustedTypes;if(Vc)try{Ga=Vc.createPolicy("vue",{createHTML:n=>n})}catch{}const yf=Ga?n=>Ga.createHTML(n):n=>n,fm="http://www.w3.org/2000/svg",dm="http://www.w3.org/1998/Math/MathML",kn=typeof document<"u"?document:null,Gc=kn&&kn.createElement("template"),pm={insert:(n,t,e)=>{t.insertBefore(n,e||null)},remove:n=>{const t=n.parentNode;t&&t.removeChild(n)},createElement:(n,t,e,i)=>{const r=t==="svg"?kn.createElementNS(fm,n):t==="mathml"?kn.createElementNS(dm,n):e?kn.createElement(n,{is:e}):kn.createElement(n);return n==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:n=>kn.createTextNode(n),createComment:n=>kn.createComment(n),setText:(n,t)=>{n.nodeValue=t},setElementText:(n,t)=>{n.textContent=t},parentNode:n=>n.parentNode,nextSibling:n=>n.nextSibling,querySelector:n=>kn.querySelector(n),setScopeId(n,t){n.setAttribute(t,"")},insertStaticContent(n,t,e,i,r,s){const o=e?e.previousSibling:t.lastChild;if(r&&(r===s||r.nextSibling))for(;t.insertBefore(r.cloneNode(!0),e),!(r===s||!(r=r.nextSibling)););else{Gc.innerHTML=yf(i==="svg"?`<svg>${n}</svg>`:i==="mathml"?`<math>${n}</math>`:n);const a=Gc.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}t.insertBefore(a,e)}return[o?o.nextSibling:t.firstChild,e?e.previousSibling:t.lastChild]}},mm=Symbol("_vtc");function gm(n,t,e){const i=n[mm];i&&(t=(t?[t,...i]:[...i]).join(" ")),t==null?n.removeAttribute("class"):e?n.setAttribute("class",t):n.className=t}const Wc=Symbol("_vod"),_m=Symbol("_vsh"),vm=Symbol(""),xm=/(?:^|;)\s*display\s*:/;function ym(n,t,e){const i=n.style,r=ge(e);let s=!1;if(e&&!r){if(t)if(ge(t))for(const o of t.split(";")){const a=o.slice(0,o.indexOf(":")).trim();e[a]==null&&Qs(i,a,"")}else for(const o in t)e[o]==null&&Qs(i,o,"");for(const o in e)o==="display"&&(s=!0),Qs(i,o,e[o])}else if(r){if(t!==e){const o=i[vm];o&&(e+=";"+o),i.cssText=e,s=xm.test(e)}}else t&&n.removeAttribute("style");Wc in n&&(n[Wc]=s?i.display:"",n[_m]&&(i.display="none"))}const Xc=/\s*!important$/;function Qs(n,t,e){if(Gt(e))e.forEach(i=>Qs(n,t,i));else if(e==null&&(e=""),t.startsWith("--"))n.setProperty(t,e);else{const i=Sm(n,t);Xc.test(e)?n.setProperty(zi(i),e.replace(Xc,""),"important"):n[i]=e}}const jc=["Webkit","Moz","ms"],jo={};function Sm(n,t){const e=jo[t];if(e)return e;let i=di(t);if(i!=="filter"&&i in n)return jo[t]=i;i=xh(i);for(let r=0;r<jc.length;r++){const s=jc[r]+i;if(s in n)return jo[t]=s}return t}const qc="http://www.w3.org/1999/xlink";function Yc(n,t,e,i,r,s=Md(t)){i&&t.startsWith("xlink:")?e==null?n.removeAttributeNS(qc,t.slice(6,t.length)):n.setAttributeNS(qc,t,e):e==null||s&&!Sh(e)?n.removeAttribute(t):n.setAttribute(t,s?"":En(e)?String(e):e)}function $c(n,t,e,i,r){if(t==="innerHTML"||t==="textContent"){e!=null&&(n[t]=t==="innerHTML"?yf(e):e);return}const s=n.tagName;if(t==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?n.getAttribute("value")||"":n.value,l=e==null?n.type==="checkbox"?"on":"":String(e);(a!==l||!("_value"in n))&&(n.value=l),e==null&&n.removeAttribute(t),n._value=e;return}let o=!1;if(e===""||e==null){const a=typeof n[t];a==="boolean"?e=Sh(e):e==null&&a==="string"?(e="",o=!0):a==="number"&&(e=0,o=!0)}try{n[t]=e}catch{}o&&n.removeAttribute(r||t)}function bm(n,t,e,i){n.addEventListener(t,e,i)}function Mm(n,t,e,i){n.removeEventListener(t,e,i)}const Zc=Symbol("_vei");function Em(n,t,e,i,r=null){const s=n[Zc]||(n[Zc]={}),o=s[t];if(i&&o)o.value=i;else{const[a,l]=Tm(t);if(i){const c=s[t]=Cm(i,r);bm(n,a,c,l)}else o&&(Mm(n,a,o,l),s[t]=void 0)}}const Kc=/(?:Once|Passive|Capture)$/;function Tm(n){let t;if(Kc.test(n)){t={};let i;for(;i=n.match(Kc);)n=n.slice(0,n.length-i[0].length),t[i[0].toLowerCase()]=!0}return[n[2]===":"?n.slice(3):zi(n.slice(2)),t]}let qo=0;const wm=Promise.resolve(),Am=()=>qo||(wm.then(()=>qo=0),qo=Date.now());function Cm(n,t){const e=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=e.attached)return;Tn(Rm(i,e.value),t,5,[i])};return e.value=n,e.attached=Am(),e}function Rm(n,t){if(Gt(t)){const e=n.stopImmediatePropagation;return n.stopImmediatePropagation=()=>{e.call(n),n._stopped=!0},t.map(i=>r=>!r._stopped&&i&&i(r))}else return t}const Jc=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&n.charCodeAt(2)>96&&n.charCodeAt(2)<123,Pm=(n,t,e,i,r,s)=>{const o=r==="svg";t==="class"?gm(n,i,o):t==="style"?ym(n,e,i):yo(t)?Nl(t)||Em(n,t,e,i,s):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):Lm(n,t,i,o))?($c(n,t,i),!n.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Yc(n,t,i,o,s,t!=="value")):n._isVueCE&&(/[A-Z]/.test(t)||!ge(i))?$c(n,di(t),i,s,t):(t==="true-value"?n._trueValue=i:t==="false-value"&&(n._falseValue=i),Yc(n,t,i,o))};function Lm(n,t,e,i){if(i)return!!(t==="innerHTML"||t==="textContent"||t in n&&Jc(t)&&jt(e));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&n.tagName==="IFRAME"||t==="form"||t==="list"&&n.tagName==="INPUT"||t==="type"&&n.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const r=n.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return Jc(t)&&ge(e)?!1:t in n}const Dm=["ctrl","shift","alt","meta"],Im={stop:n=>n.stopPropagation(),prevent:n=>n.preventDefault(),self:n=>n.target!==n.currentTarget,ctrl:n=>!n.ctrlKey,shift:n=>!n.shiftKey,alt:n=>!n.altKey,meta:n=>!n.metaKey,left:n=>"button"in n&&n.button!==0,middle:n=>"button"in n&&n.button!==1,right:n=>"button"in n&&n.button!==2,exact:(n,t)=>Dm.some(e=>n[`${e}Key`]&&!t.includes(e))},Yo=(n,t)=>{if(!n)return n;const e=n._withMods||(n._withMods={}),i=t.join(".");return e[i]||(e[i]=((r,...s)=>{for(let o=0;o<t.length;o++){const a=Im[t[o]];if(a&&a(r,t))return}return n(r,...s)}))},Um=Ee({patchProp:Pm},pm);let Qc;function Nm(){return Qc||(Qc=jp(Um))}const Om=((...n)=>{const t=Nm().createApp(...n),{mount:e}=t;return t.mount=i=>{const r=km(i);if(!r)return;const s=t._component;!jt(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=e(r,!1,Fm(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},t});function Fm(n){if(n instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&n instanceof MathMLElement)return"mathml"}function km(n){return ge(n)?document.querySelector(n):n}const Bm={class:"p-3 flex flex-col gap-3"},zm={class:"text-sm font-medium text-gray-600"},Hm={key:0,class:"border border-gray-200 rounded-lg overflow-hidden bg-white"},Vm=["src"],Gm=fs({__name:"SvgUploader",emits:["svgLoaded"],setup(n,{emit:t}){const e=t,i=Je(!1),r=Je(null),s=Je(null);function o(c){if(!c.name.toLowerCase().endsWith(".svg")&&c.type!=="image/svg+xml")return;const u=new FileReader;u.onload=h=>{var v;const m=(v=h.target)==null?void 0:v.result;r.value&&URL.revokeObjectURL(r.value);const p=new Blob([m],{type:"image/svg+xml"});r.value=URL.createObjectURL(p),e("svgLoaded",m)},u.readAsText(c)}function a(c){var h;i.value=!1;const u=(h=c.dataTransfer)==null?void 0:h.files[0];u&&o(u)}function l(c){var h;const u=(h=c.target.files)==null?void 0:h[0];u&&o(u)}return(c,u)=>(Ie(),He("div",Bm,[Dt("div",{class:Eo(["border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer select-none transition-colors",i.value?"border-blue-400 bg-blue-50":"border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50"]),onDragover:u[0]||(u[0]=Yo(h=>i.value=!0,["prevent"])),onDragleave:u[1]||(u[1]=Yo(h=>i.value=!1,["prevent"])),onDrop:Yo(a,["prevent"]),onClick:u[2]||(u[2]=h=>{var m;return(m=s.value)==null?void 0:m.click()})},[u[3]||(u[3]=Dt("svg",{class:"w-8 h-8 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[Dt("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.5",d:"M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"})],-1)),Dt("span",zm,De(i.value?"Drop SVG here":"Drag & drop SVG"),1),u[4]||(u[4]=Dt("span",{class:"text-xs text-gray-400"},"or click to browse",-1)),Dt("input",{ref_key:"fileInput",ref:s,type:"file",accept:".svg,image/svg+xml",class:"hidden",onChange:l},null,544)],34),r.value?(Ie(),He("div",Hm,[Dt("img",{src:r.value,alt:"SVG preview",class:"w-full max-h-40 object-contain p-2"},null,8,Vm)])):fo("",!0),u[5]||(u[5]=Dt("p",{class:"text-[11px] text-gray-400 leading-snug"}," For best results, use flat SVGs without gradients, filters, clip-paths, or text elements. ",-1))]))}}),Wm={class:"flex flex-col gap-4 p-4"},Xm={key:0,class:"text-xs text-red-500"},jm={key:1,class:"text-sm text-gray-400"},qm={key:2,class:"space-y-1.5"},Ym={class:"font-mono"},$m={class:"text-gray-400 ml-auto"},Zm={class:"flex-1"},Km={class:"space-y-3"},Jm={class:"flex items-center gap-2 text-sm text-gray-700 cursor-pointer"},Qm=["checked"],tg={class:"flex items-center gap-2 text-sm text-gray-700 cursor-pointer"},eg=["checked"],ng={class:"flex justify-between text-sm text-gray-700"},ig={class:"text-gray-400"},rg=["value"],sg={class:"flex justify-between text-sm text-gray-700"},og={class:"text-gray-400"},ag=["value"],lg={class:"flex justify-between text-sm text-gray-700"},cg={class:"text-gray-400"},ug=["value"],hg={class:"flex justify-between text-sm text-gray-700"},fg={class:"text-gray-400"},dg=["value"],pg={key:0},mg={class:"flex justify-between text-sm text-gray-700"},gg={class:"text-gray-400"},_g=["value"],vg={key:1},xg={class:"flex justify-between text-sm text-gray-700"},yg={class:"text-gray-400"},Sg=["value"],bg={class:"flex justify-between items-center text-sm text-gray-700"},Mg={class:"flex items-center gap-1.5"},Eg={class:"text-gray-400 font-mono text-xs"},Tg=["value"],wg=fs({__name:"ControlPanel",props:{colorGroups:{},error:{},showLogo:{type:Boolean},config:{}},emits:["svgLoaded","update:showLogo","update:config"],setup(n,{emit:t}){const e=n,i=t;function r(s,o){i("update:config",{...e.config,[s]:o})}return(s,o)=>(Ie(),He("div",Wm,[Dt("section",null,[o[10]||(o[10]=Dt("h2",{class:"text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"},"SVG File",-1)),$e(Gm,{onSvgLoaded:o[0]||(o[0]=a=>i("svgLoaded",a))})]),Dt("section",null,[o[11]||(o[11]=Dt("h2",{class:"text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"},"Colors",-1)),n.error?(Ie(),He("p",Xm,De(n.error),1)):n.colorGroups.length===0?(Ie(),He("p",jm,"—")):(Ie(),He("ul",qm,[(Ie(!0),He(_n,null,Ep(n.colorGroups,a=>(Ie(),He("li",{key:a.id,class:"flex items-center gap-2 text-xs text-gray-700"},[Dt("span",{class:"w-4 h-4 rounded-sm shrink-0 border border-gray-300",style:Mo({backgroundColor:a.color})},null,4),Dt("span",Ym,De(a.color),1),Dt("span",$m,De(a.pathCount)+" path"+De(a.pathCount!==1?"s":""),1)]))),128))]))]),Dt("section",Zm,[o[21]||(o[21]=Dt("h2",{class:"text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"},"Parameters",-1)),Dt("div",Km,[Dt("label",Jm,[Dt("input",{type:"checkbox",checked:n.showLogo,onChange:o[1]||(o[1]=a=>i("update:showLogo",a.target.checked)),class:"accent-gray-700"},null,40,Qm),o[12]||(o[12]=Ha(" Show logo ",-1))]),Dt("label",tg,[Dt("input",{type:"checkbox",checked:n.config.keyringEnabled,onChange:o[2]||(o[2]=a=>r("keyringEnabled",a.target.checked)),class:"accent-gray-700"},null,40,eg),o[13]||(o[13]=Ha(" Keyring hole ",-1))]),Dt("div",null,[Dt("div",ng,[o[14]||(o[14]=Dt("span",null,"Base thickness",-1)),Dt("span",ig,De(n.config.baseThickness.toFixed(1))+" mm",1)]),Dt("input",{type:"range",value:n.config.baseThickness,onInput:o[3]||(o[3]=a=>r("baseThickness",parseFloat(a.target.value))),min:"0.4",max:"10",step:"0.1",class:"w-full accent-gray-700"},null,40,rg)]),Dt("div",null,[Dt("div",sg,[o[15]||(o[15]=Dt("span",null,"Corner radius",-1)),Dt("span",og,De(n.config.cornerRadius.toFixed(1))+" mm",1)]),Dt("input",{type:"range",value:n.config.cornerRadius,onInput:o[4]||(o[4]=a=>r("cornerRadius",parseFloat(a.target.value))),min:"0",max:"20",step:"0.5",class:"w-full accent-gray-700"},null,40,ag)]),Dt("div",null,[Dt("div",lg,[o[16]||(o[16]=Dt("span",null,"Padding",-1)),Dt("span",cg,De(n.config.padding.toFixed(1))+" mm",1)]),Dt("input",{type:"range",value:n.config.padding,onInput:o[5]||(o[5]=a=>r("padding",parseFloat(a.target.value))),min:"0",max:"20",step:"0.5",class:"w-full accent-gray-700"},null,40,ug)]),Dt("div",null,[Dt("div",hg,[o[17]||(o[17]=Dt("span",null,"Target width",-1)),Dt("span",fg,De(n.config.targetWidth)+" mm",1)]),Dt("input",{type:"range",value:n.config.targetWidth,onInput:o[6]||(o[6]=a=>r("targetWidth",parseFloat(a.target.value))),min:"20",max:"150",step:"1",class:"w-full accent-gray-700"},null,40,dg)]),n.config.keyringEnabled?(Ie(),He("div",pg,[Dt("div",mg,[o[18]||(o[18]=Dt("span",null,"Hole diameter",-1)),Dt("span",gg,De(n.config.keyringHoleDiameter.toFixed(1))+" mm",1)]),Dt("input",{type:"range",value:n.config.keyringHoleDiameter,onInput:o[7]||(o[7]=a=>r("keyringHoleDiameter",parseFloat(a.target.value))),min:"2",max:"10",step:"0.5",class:"w-full accent-gray-700"},null,40,_g)])):fo("",!0),n.config.keyringEnabled?(Ie(),He("div",vg,[Dt("div",xg,[o[19]||(o[19]=Dt("span",null,"Ring diameter",-1)),Dt("span",yg,De(n.config.keyringRingDiameter.toFixed(1))+" mm",1)]),Dt("input",{type:"range",value:n.config.keyringRingDiameter,onInput:o[8]||(o[8]=a=>r("keyringRingDiameter",parseFloat(a.target.value))),min:"4",max:"15",step:"0.5",class:"w-full accent-gray-700"},null,40,Sg)])):fo("",!0),Dt("div",null,[Dt("div",bg,[o[20]||(o[20]=Dt("span",null,"Base color",-1)),Dt("div",Mg,[Dt("span",Eg,De(n.config.baseColor),1),Dt("input",{type:"color",value:n.config.baseColor,onInput:o[9]||(o[9]=a=>r("baseColor",a.target.value)),class:"w-6 h-6 rounded border border-gray-300 cursor-pointer p-0"},null,40,Tg)])])])])])]))}}),Ag=["disabled"],Cg=fs({__name:"ExportButton",props:{disabled:{type:Boolean},exporting:{type:Boolean},label:{default:"Download .3mf"}},emits:["export"],setup(n){return(t,e)=>(Ie(),He("button",{class:"w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",disabled:n.disabled||n.exporting,onClick:e[0]||(e[0]=i=>t.$emit("export"))},De(n.exporting?"Exporting...":n.label),9,Ag))}});/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const tc="170",gr={ROTATE:0,DOLLY:1,PAN:2},ar={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rg=0,tu=1,Pg=2,Sf=1,Lg=2,Fn=3,mi=0,Ve=1,Hn=2,ui=0,_r=1,eu=2,nu=3,iu=4,Dg=5,Ri=100,Ig=101,Ug=102,Ng=103,Og=104,Fg=200,kg=201,Bg=202,zg=203,Wa=204,Xa=205,Hg=206,Vg=207,Gg=208,Wg=209,Xg=210,jg=211,qg=212,Yg=213,$g=214,ja=0,qa=1,Ya=2,Mr=3,$a=4,Za=5,Ka=6,Ja=7,bf=0,Zg=1,Kg=2,hi=0,Jg=1,Qg=2,t_=3,e_=4,n_=5,i_=6,r_=7,Mf=300,Er=301,Tr=302,Qa=303,tl=304,Po=306,el=1e3,Li=1001,nl=1002,fn=1003,s_=1004,bs=1005,Sn=1006,$o=1007,Di=1008,Yn=1009,Ef=1010,Tf=1011,os=1012,ec=1013,Oi=1014,Vn=1015,ps=1016,nc=1017,ic=1018,wr=1020,wf=35902,Af=1021,Cf=1022,un=1023,Rf=1024,Pf=1025,vr=1026,Ar=1027,Lf=1028,rc=1029,Df=1030,sc=1031,oc=1033,to=33776,eo=33777,no=33778,io=33779,il=35840,rl=35841,sl=35842,ol=35843,al=36196,ll=37492,cl=37496,ul=37808,hl=37809,fl=37810,dl=37811,pl=37812,ml=37813,gl=37814,_l=37815,vl=37816,xl=37817,yl=37818,Sl=37819,bl=37820,Ml=37821,ro=36492,El=36494,Tl=36495,If=36283,wl=36284,Al=36285,Cl=36286,o_=3200,a_=3201,Uf=0,l_=1,li="",qe="srgb",Rr="srgb-linear",Lo="linear",ie="srgb",Xi=7680,ru=519,c_=512,u_=513,h_=514,Nf=515,f_=516,d_=517,p_=518,m_=519,su=35044,ou="300 es",Gn=2e3,mo=2001;class Hi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const we=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],so=Math.PI/180,Rl=180/Math.PI;function Pr(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(we[n&255]+we[n>>8&255]+we[n>>16&255]+we[n>>24&255]+"-"+we[t&255]+we[t>>8&255]+"-"+we[t>>16&15|64]+we[t>>24&255]+"-"+we[e&63|128]+we[e>>8&255]+"-"+we[e>>16&255]+we[e>>24&255]+we[i&255]+we[i>>8&255]+we[i>>16&255]+we[i>>24&255]).toLowerCase()}function be(n,t,e){return Math.max(t,Math.min(e,n))}function g_(n,t){return(n%t+t)%t}function Zo(n,t,e){return(1-e)*n+e*t}function Fr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Fe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const __={DEG2RAD:so};class xt{constructor(t=0,e=0){xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6],this.y=r[1]*e+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(be(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*r+t.x,this.y=s*r+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class zt{constructor(t,e,i,r,s,o,a,l,c){zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,l,c)}set(t,e,i,r,s,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=r,u[2]=a,u[3]=e,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],m=i[2],p=i[5],v=i[8],_=r[0],g=r[3],d=r[6],M=r[1],y=r[4],x=r[7],D=r[2],N=r[5],L=r[8];return s[0]=o*_+a*M+l*D,s[3]=o*g+a*y+l*N,s[6]=o*d+a*x+l*L,s[1]=c*_+u*M+h*D,s[4]=c*g+u*y+h*N,s[7]=c*d+u*x+h*L,s[2]=m*_+p*M+v*D,s[5]=m*g+p*y+v*N,s[8]=m*d+p*x+v*L,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,m=a*l-u*s,p=c*s-o*l,v=e*h+i*m+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/v;return t[0]=h*_,t[1]=(r*c-u*i)*_,t[2]=(a*i-r*o)*_,t[3]=m*_,t[4]=(u*e-r*l)*_,t[5]=(r*s-a*e)*_,t[6]=p*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-r*c,r*l,-r*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ko.makeScale(t,e)),this}rotate(t){return this.premultiply(Ko.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ko.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<9;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ko=new zt;function Of(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function go(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function v_(){const n=go("canvas");return n.style.display="block",n}const au={};function Wr(n){n in au||(au[n]=!0,console.warn(n))}function x_(n,t,e){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function y_(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function S_(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const $t={enabled:!0,workingColorSpace:Rr,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ie&&(n.r=Wn(n.r),n.g=Wn(n.g),n.b=Wn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ie&&(n.r=xr(n.r),n.g=xr(n.g),n.b=xr(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===li?Lo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Wn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function xr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const lu=[.64,.33,.3,.6,.15,.06],cu=[.2126,.7152,.0722],uu=[.3127,.329],hu=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fu=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);$t.define({[Rr]:{primaries:lu,whitePoint:uu,transfer:Lo,toXYZ:hu,fromXYZ:fu,luminanceCoefficients:cu,workingColorSpaceConfig:{unpackColorSpace:qe},outputColorSpaceConfig:{drawingBufferColorSpace:qe}},[qe]:{primaries:lu,whitePoint:uu,transfer:ie,toXYZ:hu,fromXYZ:fu,luminanceCoefficients:cu,outputColorSpaceConfig:{drawingBufferColorSpace:qe}}});let ji;class b_{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ji===void 0&&(ji=go("canvas")),ji.width=t.width,ji.height=t.height;const i=ji.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=ji}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=go("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const r=i.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Wn(s[o]/255)*255;return i.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Wn(e[i]/255)*255):e[i]=Wn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let M_=0;class Ff{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:M_++}),this.uuid=Pr(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Jo(r[o].image)):s.push(Jo(r[o]))}else s=Jo(r);i.url=s}return e||(t.images[this.uuid]=i),i}}function Jo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?b_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let E_=0;class Ge extends Hi{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,i=Li,r=Li,s=Sn,o=Di,a=un,l=Yn,c=Ge.DEFAULT_ANISOTROPY,u=li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:E_++}),this.uuid=Pr(),this.name="",this.source=new Ff(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Mf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case el:t.x=t.x-Math.floor(t.x);break;case Li:t.x=t.x<0?0:1;break;case nl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case el:t.y=t.y-Math.floor(t.y);break;case Li:t.y=t.y<0?0:1;break;case nl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Mf;Ge.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,i=0,r=1){pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,r){return this.x=t,this.y=e,this.z=i,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,r,s;const l=t.elements,c=l[0],u=l[4],h=l[8],m=l[1],p=l[5],v=l[9],_=l[2],g=l[6],d=l[10];if(Math.abs(u-m)<.01&&Math.abs(h-_)<.01&&Math.abs(v-g)<.01){if(Math.abs(u+m)<.1&&Math.abs(h+_)<.1&&Math.abs(v+g)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,x=(p+1)/2,D=(d+1)/2,N=(u+m)/4,L=(h+_)/4,z=(v+g)/4;return y>x&&y>D?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=N/i,s=L/i):x>D?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=N/r,s=z/r):D<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(D),i=L/s,r=z/s),this.set(i,r,s,e),this}let M=Math.sqrt((g-v)*(g-v)+(h-_)*(h-_)+(m-u)*(m-u));return Math.abs(M)<.001&&(M=1),this.x=(g-v)/M,this.y=(h-_)/M,this.z=(m-u)/M,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class T_ extends Hi{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);const r={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Ge(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,r=t.textures.length;i<r;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ff(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fi extends T_{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class kf extends Ge{constructor(t=null,e=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=Li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class w_ extends Ge{constructor(t=null,e=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=Li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ki{constructor(t=0,e=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=r}static slerpFlat(t,e,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const m=s[o+0],p=s[o+1],v=s[o+2],_=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=m,t[e+1]=p,t[e+2]=v,t[e+3]=_;return}if(h!==_||l!==m||c!==p||u!==v){let g=1-a;const d=l*m+c*p+u*v+h*_,M=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const D=Math.sqrt(y),N=Math.atan2(D,d*M);g=Math.sin(g*N)/D,a=Math.sin(a*N)/D}const x=a*M;if(l=l*g+m*x,c=c*g+p*x,u=u*g+v*x,h=h*g+_*x,g===1-a){const D=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=D,c*=D,u*=D,h*=D}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],m=s[o+1],p=s[o+2],v=s[o+3];return t[e]=a*v+u*h+l*p-c*m,t[e+1]=l*v+u*m+c*h-a*p,t[e+2]=c*v+u*p+a*m-l*h,t[e+3]=u*v-a*h-l*m-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,r){return this._x=t,this._y=e,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),m=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=m*u*h+c*p*v,this._y=c*p*h-m*u*v,this._z=c*u*v+m*p*h,this._w=c*u*h-m*p*v;break;case"YXZ":this._x=m*u*h+c*p*v,this._y=c*p*h-m*u*v,this._z=c*u*v-m*p*h,this._w=c*u*h+m*p*v;break;case"ZXY":this._x=m*u*h-c*p*v,this._y=c*p*h+m*u*v,this._z=c*u*v+m*p*h,this._w=c*u*h-m*p*v;break;case"ZYX":this._x=m*u*h-c*p*v,this._y=c*p*h+m*u*v,this._z=c*u*v-m*p*h,this._w=c*u*h+m*p*v;break;case"YZX":this._x=m*u*h+c*p*v,this._y=c*p*h+m*u*v,this._z=c*u*v-m*p*h,this._w=c*u*h-m*p*v;break;case"XZY":this._x=m*u*h-c*p*v,this._y=c*p*h-m*u*v,this._z=c*u*v+m*p*h,this._w=c*u*h+m*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],r=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],m=i+a+h;if(m>0){const p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(be(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const r=Math.min(1,e/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,r=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+i*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*i+e*this._x,this._y=p*r+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,m=Math.sin(e*u)/c;return this._w=o*h+this._w*m,this._x=i*h+this._x*m,this._y=r*h+this._y*m,this._z=s*h+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ot{constructor(t=0,e=0,i=0){ot.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(du.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(du.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*r,this.y=s[1]*e+s[4]*i+s[7]*r,this.z=s[2]*e+s[5]*i+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,r=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*r-a*i),u=2*(a*e-s*r),h=2*(s*i-o*e);return this.x=e+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*r,this.y=s[1]*e+s[5]*i+s[9]*r,this.z=s[2]*e+s[6]*i+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,r=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Qo.copy(this).projectOnVector(t),this.sub(Qo)}reflect(t){return this.sub(Qo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(be(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return e*e+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const r=Math.sin(e)*t;return this.x=r*Math.sin(i),this.y=Math.cos(e)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qo=new ot,du=new ki;class Vi{constructor(t=new ot(1/0,1/0,1/0),e=new ot(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,sn):sn.fromBufferAttribute(s,o),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ms.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ms.copy(i.boundingBox)),Ms.applyMatrix4(t.matrixWorld),this.union(Ms)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(kr),Es.subVectors(this.max,kr),qi.subVectors(t.a,kr),Yi.subVectors(t.b,kr),$i.subVectors(t.c,kr),Jn.subVectors(Yi,qi),Qn.subVectors($i,Yi),yi.subVectors(qi,$i);let e=[0,-Jn.z,Jn.y,0,-Qn.z,Qn.y,0,-yi.z,yi.y,Jn.z,0,-Jn.x,Qn.z,0,-Qn.x,yi.z,0,-yi.x,-Jn.y,Jn.x,0,-Qn.y,Qn.x,0,-yi.y,yi.x,0];return!ta(e,qi,Yi,$i,Es)||(e=[1,0,0,0,1,0,0,0,1],!ta(e,qi,Yi,$i,Es))?!1:(Ts.crossVectors(Jn,Qn),e=[Ts.x,Ts.y,Ts.z],ta(e,qi,Yi,$i,Es))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ln),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ln=[new ot,new ot,new ot,new ot,new ot,new ot,new ot,new ot],sn=new ot,Ms=new Vi,qi=new ot,Yi=new ot,$i=new ot,Jn=new ot,Qn=new ot,yi=new ot,kr=new ot,Es=new ot,Ts=new ot,Si=new ot;function ta(n,t,e,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Si.fromArray(n,s);const a=r.x*Math.abs(Si.x)+r.y*Math.abs(Si.y)+r.z*Math.abs(Si.z),l=t.dot(Si),c=e.dot(Si),u=i.dot(Si);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const A_=new Vi,Br=new ot,ea=new ot;class ms{constructor(t=new ot,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):A_.setFromPoints(t).getCenter(i);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Br.subVectors(t,this.center);const e=Br.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),r=(i-this.radius)*.5;this.center.addScaledVector(Br,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ea.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Br.copy(t.center).add(ea)),this.expandByPoint(Br.copy(t.center).sub(ea))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Dn=new ot,na=new ot,ws=new ot,ti=new ot,ia=new ot,As=new ot,ra=new ot;class ac{constructor(t=new ot,e=new ot(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,i,r){na.copy(t).add(e).multiplyScalar(.5),ws.copy(e).sub(t).normalize(),ti.copy(this.origin).sub(na);const s=t.distanceTo(e)*.5,o=-this.direction.dot(ws),a=ti.dot(this.direction),l=-ti.dot(ws),c=ti.lengthSq(),u=Math.abs(1-o*o);let h,m,p,v;if(u>0)if(h=o*l-a,m=o*a-l,v=s*u,h>=0)if(m>=-v)if(m<=v){const _=1/u;h*=_,m*=_,p=h*(h+o*m+2*a)+m*(o*h+m+2*l)+c}else m=s,h=Math.max(0,-(o*m+a)),p=-h*h+m*(m+2*l)+c;else m=-s,h=Math.max(0,-(o*m+a)),p=-h*h+m*(m+2*l)+c;else m<=-v?(h=Math.max(0,-(-o*s+a)),m=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+m*(m+2*l)+c):m<=v?(h=0,m=Math.min(Math.max(-s,-l),s),p=m*(m+2*l)+c):(h=Math.max(0,-(o*s+a)),m=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+m*(m+2*l)+c);else m=o>0?-s:s,h=Math.max(0,-(o*m+a)),p=-h*h+m*(m+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(na).addScaledVector(ws,m),p}intersectSphere(t,e){Dn.subVectors(t.center,this.origin);const i=Dn.dot(this.direction),r=Dn.dot(Dn)-i*i,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,m=this.origin;return c>=0?(i=(t.min.x-m.x)*c,r=(t.max.x-m.x)*c):(i=(t.max.x-m.x)*c,r=(t.min.x-m.x)*c),u>=0?(s=(t.min.y-m.y)*u,o=(t.max.y-m.y)*u):(s=(t.max.y-m.y)*u,o=(t.min.y-m.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(t.min.z-m.z)*h,l=(t.max.z-m.z)*h):(a=(t.max.z-m.z)*h,l=(t.min.z-m.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,i,r,s){ia.subVectors(e,t),As.subVectors(i,t),ra.crossVectors(ia,As);let o=this.direction.dot(ra),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ti.subVectors(this.origin,t);const l=a*this.direction.dot(As.crossVectors(ti,As));if(l<0)return null;const c=a*this.direction.dot(ia.cross(ti));if(c<0||l+c>o)return null;const u=-a*ti.dot(ra);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class he{constructor(t,e,i,r,s,o,a,l,c,u,h,m,p,v,_,g){he.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,l,c,u,h,m,p,v,_,g)}set(t,e,i,r,s,o,a,l,c,u,h,m,p,v,_,g){const d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=m,d[3]=p,d[7]=v,d[11]=_,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new he().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,r=1/Zi.setFromMatrixColumn(t,0).length(),s=1/Zi.setFromMatrixColumn(t,1).length(),o=1/Zi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*r,e[1]=i[1]*r,e[2]=i[2]*r,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,r=t.y,s=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const m=o*u,p=o*h,v=a*u,_=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=p+v*c,e[5]=m-_*c,e[9]=-a*l,e[2]=_-m*c,e[6]=v+p*c,e[10]=o*l}else if(t.order==="YXZ"){const m=l*u,p=l*h,v=c*u,_=c*h;e[0]=m+_*a,e[4]=v*a-p,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=p*a-v,e[6]=_+m*a,e[10]=o*l}else if(t.order==="ZXY"){const m=l*u,p=l*h,v=c*u,_=c*h;e[0]=m-_*a,e[4]=-o*h,e[8]=v+p*a,e[1]=p+v*a,e[5]=o*u,e[9]=_-m*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const m=o*u,p=o*h,v=a*u,_=a*h;e[0]=l*u,e[4]=v*c-p,e[8]=m*c+_,e[1]=l*h,e[5]=_*c+m,e[9]=p*c-v,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const m=o*l,p=o*c,v=a*l,_=a*c;e[0]=l*u,e[4]=_-m*h,e[8]=v*h+p,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=p*h+v,e[10]=m-_*h}else if(t.order==="XZY"){const m=o*l,p=o*c,v=a*l,_=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=m*h+_,e[5]=o*u,e[9]=p*h-v,e[2]=v*h-p,e[6]=a*u,e[10]=_*h+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(C_,t,R_)}lookAt(t,e,i){const r=this.elements;return Xe.subVectors(t,e),Xe.lengthSq()===0&&(Xe.z=1),Xe.normalize(),ei.crossVectors(i,Xe),ei.lengthSq()===0&&(Math.abs(i.z)===1?Xe.x+=1e-4:Xe.z+=1e-4,Xe.normalize(),ei.crossVectors(i,Xe)),ei.normalize(),Cs.crossVectors(Xe,ei),r[0]=ei.x,r[4]=Cs.x,r[8]=Xe.x,r[1]=ei.y,r[5]=Cs.y,r[9]=Xe.y,r[2]=ei.z,r[6]=Cs.z,r[10]=Xe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],m=i[9],p=i[13],v=i[2],_=i[6],g=i[10],d=i[14],M=i[3],y=i[7],x=i[11],D=i[15],N=r[0],L=r[4],z=r[8],C=r[12],R=r[1],q=r[5],I=r[9],j=r[13],E=r[2],K=r[6],et=r[10],$=r[14],Y=r[3],rt=r[7],ft=r[11],Q=r[15];return s[0]=o*N+a*R+l*E+c*Y,s[4]=o*L+a*q+l*K+c*rt,s[8]=o*z+a*I+l*et+c*ft,s[12]=o*C+a*j+l*$+c*Q,s[1]=u*N+h*R+m*E+p*Y,s[5]=u*L+h*q+m*K+p*rt,s[9]=u*z+h*I+m*et+p*ft,s[13]=u*C+h*j+m*$+p*Q,s[2]=v*N+_*R+g*E+d*Y,s[6]=v*L+_*q+g*K+d*rt,s[10]=v*z+_*I+g*et+d*ft,s[14]=v*C+_*j+g*$+d*Q,s[3]=M*N+y*R+x*E+D*Y,s[7]=M*L+y*q+x*K+D*rt,s[11]=M*z+y*I+x*et+D*ft,s[15]=M*C+y*j+x*$+D*Q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],r=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],m=t[10],p=t[14],v=t[3],_=t[7],g=t[11],d=t[15];return v*(+s*l*h-r*c*h-s*a*m+i*c*m+r*a*p-i*l*p)+_*(+e*l*p-e*c*m+s*o*m-r*o*p+r*c*u-s*l*u)+g*(+e*c*h-e*a*p-s*o*h+i*o*p+s*a*u-i*c*u)+d*(-r*a*u-e*l*h+e*a*m+r*o*h-i*o*m+i*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],m=t[10],p=t[11],v=t[12],_=t[13],g=t[14],d=t[15],M=h*g*c-_*m*c+_*l*p-a*g*p-h*l*d+a*m*d,y=v*m*c-u*g*c-v*l*p+o*g*p+u*l*d-o*m*d,x=u*_*c-v*h*c+v*a*p-o*_*p-u*a*d+o*h*d,D=v*h*l-u*_*l-v*a*m+o*_*m+u*a*g-o*h*g,N=e*M+i*y+r*x+s*D;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/N;return t[0]=M*L,t[1]=(_*m*s-h*g*s-_*r*p+i*g*p+h*r*d-i*m*d)*L,t[2]=(a*g*s-_*l*s+_*r*c-i*g*c-a*r*d+i*l*d)*L,t[3]=(h*l*s-a*m*s-h*r*c+i*m*c+a*r*p-i*l*p)*L,t[4]=y*L,t[5]=(u*g*s-v*m*s+v*r*p-e*g*p-u*r*d+e*m*d)*L,t[6]=(v*l*s-o*g*s-v*r*c+e*g*c+o*r*d-e*l*d)*L,t[7]=(o*m*s-u*l*s+u*r*c-e*m*c-o*r*p+e*l*p)*L,t[8]=x*L,t[9]=(v*h*s-u*_*s-v*i*p+e*_*p+u*i*d-e*h*d)*L,t[10]=(o*_*s-v*a*s+v*i*c-e*_*c-o*i*d+e*a*d)*L,t[11]=(u*a*s-o*h*s-u*i*c+e*h*c+o*i*p-e*a*p)*L,t[12]=D*L,t[13]=(u*_*r-v*h*r+v*i*m-e*_*m-u*i*g+e*h*g)*L,t[14]=(v*a*r-o*_*r-v*i*l+e*_*l+o*i*g-e*a*g)*L,t[15]=(o*h*r-u*a*r+u*i*l-e*h*l-o*i*m+e*a*m)*L,this}scale(t){const e=this.elements,i=t.x,r=t.y,s=t.z;return e[0]*=i,e[4]*=r,e[8]*=s,e[1]*=i,e[5]*=r,e[9]*=s,e[2]*=i,e[6]*=r,e[10]*=s,e[3]*=i,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,r))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),r=Math.sin(e),s=1-i,o=t.x,a=t.y,l=t.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,r,s,o){return this.set(1,i,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,i){const r=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,u=o+o,h=a+a,m=s*c,p=s*u,v=s*h,_=o*u,g=o*h,d=a*h,M=l*c,y=l*u,x=l*h,D=i.x,N=i.y,L=i.z;return r[0]=(1-(_+d))*D,r[1]=(p+x)*D,r[2]=(v-y)*D,r[3]=0,r[4]=(p-x)*N,r[5]=(1-(m+d))*N,r[6]=(g+M)*N,r[7]=0,r[8]=(v+y)*L,r[9]=(g-M)*L,r[10]=(1-(m+_))*L,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,i){const r=this.elements;let s=Zi.set(r[0],r[1],r[2]).length();const o=Zi.set(r[4],r[5],r[6]).length(),a=Zi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],on.copy(this);const c=1/s,u=1/o,h=1/a;return on.elements[0]*=c,on.elements[1]*=c,on.elements[2]*=c,on.elements[4]*=u,on.elements[5]*=u,on.elements[6]*=u,on.elements[8]*=h,on.elements[9]*=h,on.elements[10]*=h,e.setFromRotationMatrix(on),i.x=s,i.y=o,i.z=a,this}makePerspective(t,e,i,r,s,o,a=Gn){const l=this.elements,c=2*s/(e-t),u=2*s/(i-r),h=(e+t)/(e-t),m=(i+r)/(i-r);let p,v;if(a===Gn)p=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===mo)p=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,r,s,o,a=Gn){const l=this.elements,c=1/(e-t),u=1/(i-r),h=1/(o-s),m=(e+t)*c,p=(i+r)*u;let v,_;if(a===Gn)v=(o+s)*h,_=-2*h;else if(a===mo)v=s*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-m,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<16;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Zi=new ot,on=new he,C_=new ot(0,0,0),R_=new ot(1,1,1),ei=new ot,Cs=new ot,Xe=new ot,pu=new he,mu=new ki;class wn{constructor(t=0,e=0,i=0,r=wn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,r=this._order){return this._x=t,this._y=e,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],m=r[6],p=r[10];switch(e){case"XYZ":this._y=Math.asin(be(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-be(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(be(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-be(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(be(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-be(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return pu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(pu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return mu.setFromEuler(this),this.setFromQuaternion(mu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}wn.DEFAULT_ORDER="XYZ";class Bf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let P_=0;const gu=new ot,Ki=new ki,In=new he,Rs=new ot,zr=new ot,L_=new ot,D_=new ki,_u=new ot(1,0,0),vu=new ot(0,1,0),xu=new ot(0,0,1),yu={type:"added"},I_={type:"removed"},Ji={type:"childadded",child:null},sa={type:"childremoved",child:null};class Me extends Hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:P_++}),this.uuid=Pr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Me.DEFAULT_UP.clone();const t=new ot,e=new wn,i=new ki,r=new ot(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new he},normalMatrix:{value:new zt}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=Me.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.multiply(Ki),this}rotateOnWorldAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.premultiply(Ki),this}rotateX(t){return this.rotateOnAxis(_u,t)}rotateY(t){return this.rotateOnAxis(vu,t)}rotateZ(t){return this.rotateOnAxis(xu,t)}translateOnAxis(t,e){return gu.copy(t).applyQuaternion(this.quaternion),this.position.add(gu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(_u,t)}translateY(t){return this.translateOnAxis(vu,t)}translateZ(t){return this.translateOnAxis(xu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Rs.copy(t):Rs.set(t,e,i);const r=this.parent;this.updateWorldMatrix(!0,!1),zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(zr,Rs,this.up):In.lookAt(Rs,zr,this.up),this.quaternion.setFromRotationMatrix(In),r&&(In.extractRotation(r.matrixWorld),Ki.setFromRotationMatrix(In),this.quaternion.premultiply(Ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yu),Ji.child=t,this.dispatchEvent(Ji),Ji.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(I_),sa.child=t,this.dispatchEvent(sa),sa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),In.multiply(t.parent.matrixWorld)),t.applyMatrix4(In),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yu),Ji.child=t,this.dispatchEvent(Ji),Ji.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,t,L_),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,D_,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(t.shapes,h)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),m=o(t.skeletons),p=o(t.animations),v=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),m.length>0&&(i.skeletons=m),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const r=t.children[i];this.add(r.clone())}return this}}Me.DEFAULT_UP=new ot(0,1,0);Me.DEFAULT_MATRIX_AUTO_UPDATE=!0;Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const an=new ot,Un=new ot,oa=new ot,Nn=new ot,Qi=new ot,tr=new ot,Su=new ot,aa=new ot,la=new ot,ca=new ot,ua=new pe,ha=new pe,fa=new pe;class cn{constructor(t=new ot,e=new ot,i=new ot){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,r){r.subVectors(i,e),an.subVectors(t,e),r.cross(an);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,i,r,s){an.subVectors(r,e),Un.subVectors(i,e),oa.subVectors(t,e);const o=an.dot(an),a=an.dot(Un),l=an.dot(oa),c=Un.dot(Un),u=Un.dot(oa),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const m=1/h,p=(c*l-a*u)*m,v=(o*u-a*l)*m;return s.set(1-p-v,v,p)}static containsPoint(t,e,i,r){return this.getBarycoord(t,e,i,r,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(t,e,i,r,s,o,a,l){return this.getBarycoord(t,e,i,r,Nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Nn.x),l.addScaledVector(o,Nn.y),l.addScaledVector(a,Nn.z),l)}static getInterpolatedAttribute(t,e,i,r,s,o){return ua.setScalar(0),ha.setScalar(0),fa.setScalar(0),ua.fromBufferAttribute(t,e),ha.fromBufferAttribute(t,i),fa.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(ua,s.x),o.addScaledVector(ha,s.y),o.addScaledVector(fa,s.z),o}static isFrontFacing(t,e,i,r){return an.subVectors(i,e),Un.subVectors(t,e),an.cross(Un).dot(r)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,r){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,i,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return an.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),an.cross(Un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return cn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return cn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,r,s){return cn.getInterpolation(t,this.a,this.b,this.c,e,i,r,s)}containsPoint(t){return cn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return cn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,r=this.b,s=this.c;let o,a;Qi.subVectors(r,i),tr.subVectors(s,i),aa.subVectors(t,i);const l=Qi.dot(aa),c=tr.dot(aa);if(l<=0&&c<=0)return e.copy(i);la.subVectors(t,r);const u=Qi.dot(la),h=tr.dot(la);if(u>=0&&h<=u)return e.copy(r);const m=l*h-u*c;if(m<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(i).addScaledVector(Qi,o);ca.subVectors(t,s);const p=Qi.dot(ca),v=tr.dot(ca);if(v>=0&&p<=v)return e.copy(s);const _=p*c-l*v;if(_<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(i).addScaledVector(tr,a);const g=u*v-p*h;if(g<=0&&h-u>=0&&p-v>=0)return Su.subVectors(s,r),a=(h-u)/(h-u+(p-v)),e.copy(r).addScaledVector(Su,a);const d=1/(g+_+m);return o=_*d,a=m*d,e.copy(i).addScaledVector(Qi,o).addScaledVector(tr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const zf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},Ps={h:0,s:0,l:0};function da(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Yt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.toWorkingColorSpace(this,e),this}setRGB(t,e,i,r=$t.workingColorSpace){return this.r=t,this.g=e,this.b=i,$t.toWorkingColorSpace(this,r),this}setHSL(t,e,i,r=$t.workingColorSpace){if(t=g_(t,1),e=be(e,0,1),i=be(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=da(o,s,t+1/3),this.g=da(o,s,t),this.b=da(o,s,t-1/3)}return $t.toWorkingColorSpace(this,r),this}setStyle(t,e=qe){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qe){const i=zf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Wn(t.r),this.g=Wn(t.g),this.b=Wn(t.b),this}copyLinearToSRGB(t){return this.r=xr(t.r),this.g=xr(t.g),this.b=xr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qe){return $t.fromWorkingColorSpace(Ae.copy(this),t),Math.round(be(Ae.r*255,0,255))*65536+Math.round(be(Ae.g*255,0,255))*256+Math.round(be(Ae.b*255,0,255))}getHexString(t=qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.fromWorkingColorSpace(Ae.copy(this),e);const i=Ae.r,r=Ae.g,s=Ae.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=$t.workingColorSpace){return $t.fromWorkingColorSpace(Ae.copy(this),e),t.r=Ae.r,t.g=Ae.g,t.b=Ae.b,t}getStyle(t=qe){$t.fromWorkingColorSpace(Ae.copy(this),t);const e=Ae.r,i=Ae.g,r=Ae.b;return t!==qe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,e,i){return this.getHSL(ni),this.setHSL(ni.h+t,ni.s+e,ni.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ni),t.getHSL(Ps);const i=Zo(ni.h,Ps.h,e),r=Zo(ni.s,Ps.s,e),s=Zo(ni.l,Ps.l,e);return this.setHSL(i,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*r,this.g=s[1]*e+s[4]*i+s[7]*r,this.b=s[2]*e+s[5]*i+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ae=new Yt;Yt.NAMES=zf;let U_=0;class Lr extends Hi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:U_++}),this.uuid=Pr(),this.name="",this.blending=_r,this.side=mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wa,this.blendDst=Xa,this.blendEquation=Ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=Mr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ru,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==_r&&(i.blending=this.blending),this.side!==mi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Wa&&(i.blendSrc=this.blendSrc),this.blendDst!==Xa&&(i.blendDst=this.blendDst),this.blendEquation!==Ri&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Mr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ru&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const r=e.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Hf extends Lr{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=bf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new ot,Ls=new xt;class Mn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=su,this.updateRanges=[],this.gpuType=Vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Ls.fromBufferAttribute(this,e),Ls.applyMatrix3(t),this.setXY(e,Ls.x,Ls.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Fr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Fr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Fr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Fr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Fr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,r){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array),r=Fe(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,e,i,r,s){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array),r=Fe(r,this.array),s=Fe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==su&&(t.usage=this.usage),t}}class Vf extends Mn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Gf extends Mn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Se extends Mn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let N_=0;const Ke=new he,pa=new Me,er=new ot,je=new Vi,Hr=new Vi,ye=new ot;class en extends Hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:N_++}),this.uuid=Pr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Of(t)?Gf:Vf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new zt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,i){return Ke.makeTranslation(t,e,i),this.applyMatrix4(Ke),this}scale(t,e,i){return Ke.makeScale(t,e,i),this.applyMatrix4(Ke),this}lookAt(t){return pa.lookAt(t),pa.updateMatrix(),this.applyMatrix4(pa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(er).negate(),this.translate(er.x,er.y,er.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let r=0,s=t.length;r<s;r++){const o=t[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Se(i,3))}else{for(let i=0,r=e.count;i<r;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new ot(-1/0,-1/0,-1/0),new ot(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,r=e.length;i<r;i++){const s=e[i];je.setFromBufferAttribute(s),this.morphTargetsRelative?(ye.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(ye),ye.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(ye)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ms);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new ot,1/0);return}if(t){const i=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];Hr.setFromBufferAttribute(a),this.morphTargetsRelative?(ye.addVectors(je.min,Hr.min),je.expandByPoint(ye),ye.addVectors(je.max,Hr.max),je.expandByPoint(ye)):(je.expandByPoint(Hr.min),je.expandByPoint(Hr.max))}je.getCenter(i);let r=0;for(let s=0,o=t.count;s<o;s++)ye.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(ye));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)ye.fromBufferAttribute(a,c),l&&(er.fromBufferAttribute(t,c),ye.add(er)),r=Math.max(r,i.distanceToSquared(ye))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let z=0;z<i.count;z++)a[z]=new ot,l[z]=new ot;const c=new ot,u=new ot,h=new ot,m=new xt,p=new xt,v=new xt,_=new ot,g=new ot;function d(z,C,R){c.fromBufferAttribute(i,z),u.fromBufferAttribute(i,C),h.fromBufferAttribute(i,R),m.fromBufferAttribute(s,z),p.fromBufferAttribute(s,C),v.fromBufferAttribute(s,R),u.sub(c),h.sub(c),p.sub(m),v.sub(m);const q=1/(p.x*v.y-v.x*p.y);isFinite(q)&&(_.copy(u).multiplyScalar(v.y).addScaledVector(h,-p.y).multiplyScalar(q),g.copy(h).multiplyScalar(p.x).addScaledVector(u,-v.x).multiplyScalar(q),a[z].add(_),a[C].add(_),a[R].add(_),l[z].add(g),l[C].add(g),l[R].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let z=0,C=M.length;z<C;++z){const R=M[z],q=R.start,I=R.count;for(let j=q,E=q+I;j<E;j+=3)d(t.getX(j+0),t.getX(j+1),t.getX(j+2))}const y=new ot,x=new ot,D=new ot,N=new ot;function L(z){D.fromBufferAttribute(r,z),N.copy(D);const C=a[z];y.copy(C),y.sub(D.multiplyScalar(D.dot(C))).normalize(),x.crossVectors(N,C);const q=x.dot(l[z])<0?-1:1;o.setXYZW(z,y.x,y.y,y.z,q)}for(let z=0,C=M.length;z<C;++z){const R=M[z],q=R.start,I=R.count;for(let j=q,E=q+I;j<E;j+=3)L(t.getX(j+0)),L(t.getX(j+1)),L(t.getX(j+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Mn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let m=0,p=i.count;m<p;m++)i.setXYZ(m,0,0,0);const r=new ot,s=new ot,o=new ot,a=new ot,l=new ot,c=new ot,u=new ot,h=new ot;if(t)for(let m=0,p=t.count;m<p;m+=3){const v=t.getX(m+0),_=t.getX(m+1),g=t.getX(m+2);r.fromBufferAttribute(e,v),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),a.add(u),l.add(u),c.add(u),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let m=0,p=e.count;m<p;m+=3)r.fromBufferAttribute(e,m+0),s.fromBufferAttribute(e,m+1),o.fromBufferAttribute(e,m+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(m+0,u.x,u.y,u.z),i.setXYZ(m+1,u.x,u.y,u.z),i.setXYZ(m+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ye.fromBufferAttribute(t,e),ye.normalize(),t.setXYZ(e,ye.x,ye.y,ye.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,m=new c.constructor(l.length*u);let p=0,v=0;for(let _=0,g=l.length;_<g;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*u;for(let d=0;d<u;d++)m[v++]=c[p++]}return new Mn(m,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new en,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=t(l,i);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const m=c[u],p=t(m,i);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,m=c.length;h<m;h++){const p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(r[l]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const r=t.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],h=s[c];for(let m=0,p=h.length;m<p;m++)u.push(h[m].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bu=new he,bi=new ac,Ds=new ms,Mu=new ot,Is=new ot,Us=new ot,Ns=new ot,ma=new ot,Os=new ot,Eu=new ot,Fs=new ot;class Qe extends Me{constructor(t=new en,e=new Hf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){Os.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(ma.fromBufferAttribute(h,t),o?Os.addScaledVector(ma,u):Os.addScaledVector(ma.sub(e),u))}e.add(Os)}return e}raycast(t,e){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ds.copy(i.boundingSphere),Ds.applyMatrix4(s),bi.copy(t.ray).recast(t.near),!(Ds.containsPoint(bi.origin)===!1&&(bi.intersectSphere(Ds,Mu)===null||bi.origin.distanceToSquared(Mu)>(t.far-t.near)**2))&&(bu.copy(s).invert(),bi.copy(t.ray).applyMatrix4(bu),!(i.boundingBox!==null&&bi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,bi)))}_computeIntersections(t,e,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,m=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,_=m.length;v<_;v++){const g=m[v],d=o[g.materialIndex],M=Math.max(g.start,p.start),y=Math.min(a.count,Math.min(g.start+g.count,p.start+p.count));for(let x=M,D=y;x<D;x+=3){const N=a.getX(x),L=a.getX(x+1),z=a.getX(x+2);r=ks(this,d,t,i,c,u,h,N,L,z),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const v=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let g=v,d=_;g<d;g+=3){const M=a.getX(g),y=a.getX(g+1),x=a.getX(g+2);r=ks(this,o,t,i,c,u,h,M,y,x),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,_=m.length;v<_;v++){const g=m[v],d=o[g.materialIndex],M=Math.max(g.start,p.start),y=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let x=M,D=y;x<D;x+=3){const N=x,L=x+1,z=x+2;r=ks(this,d,t,i,c,u,h,N,L,z),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{const v=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let g=v,d=_;g<d;g+=3){const M=g,y=g+1,x=g+2;r=ks(this,o,t,i,c,u,h,M,y,x),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}}}function O_(n,t,e,i,r,s,o,a){let l;if(t.side===Ve?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,t.side===mi,a),l===null)return null;Fs.copy(a),Fs.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Fs);return c<e.near||c>e.far?null:{distance:c,point:Fs.clone(),object:n}}function ks(n,t,e,i,r,s,o,a,l,c){n.getVertexPosition(a,Is),n.getVertexPosition(l,Us),n.getVertexPosition(c,Ns);const u=O_(n,t,e,i,Is,Us,Ns,Eu);if(u){const h=new ot;cn.getBarycoord(Eu,Is,Us,Ns,h),r&&(u.uv=cn.getInterpolatedAttribute(r,a,l,c,h,new xt)),s&&(u.uv1=cn.getInterpolatedAttribute(s,a,l,c,h,new xt)),o&&(u.normal=cn.getInterpolatedAttribute(o,a,l,c,h,new ot),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const m={a,b:l,c,normal:new ot,materialIndex:0};cn.getNormal(Is,Us,Ns,m.normal),u.face=m,u.barycoord=h}return u}class gs extends en{constructor(t=1,e=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let m=0,p=0;v("z","y","x",-1,-1,i,e,t,o,s,0),v("z","y","x",1,-1,i,e,-t,o,s,1),v("x","z","y",1,1,t,i,e,r,o,2),v("x","z","y",1,-1,t,i,-e,r,o,3),v("x","y","z",1,-1,t,e,i,r,s,4),v("x","y","z",-1,-1,t,e,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(u,3)),this.setAttribute("uv",new Se(h,2));function v(_,g,d,M,y,x,D,N,L,z,C){const R=x/L,q=D/z,I=x/2,j=D/2,E=N/2,K=L+1,et=z+1;let $=0,Y=0;const rt=new ot;for(let ft=0;ft<et;ft++){const Q=ft*q-j;for(let nt=0;nt<K;nt++){const bt=nt*R-I;rt[_]=bt*M,rt[g]=Q*y,rt[d]=E,c.push(rt.x,rt.y,rt.z),rt[_]=0,rt[g]=0,rt[d]=N>0?1:-1,u.push(rt.x,rt.y,rt.z),h.push(nt/L),h.push(1-ft/z),$+=1}}for(let ft=0;ft<z;ft++)for(let Q=0;Q<L;Q++){const nt=m+Q+K*ft,bt=m+Q+K*(ft+1),W=m+(Q+1)+K*(ft+1),B=m+(Q+1)+K*ft;l.push(nt,bt,B),l.push(bt,W,B),Y+=6}a.addGroup(p,Y,C),p+=Y,m+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Cr(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const r=n[e][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=r.clone():Array.isArray(r)?t[e][i]=r.slice():t[e][i]=r}}return t}function Le(n){const t={};for(let e=0;e<n.length;e++){const i=Cr(n[e]);for(const r in i)t[r]=i[r]}return t}function F_(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Wf(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const k_={clone:Cr,merge:Le};var B_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,z_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gi extends Lr{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=B_,this.fragmentShader=z_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Cr(t.uniforms),this.uniformsGroups=F_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Xf extends Me{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he,this.coordinateSystem=Gn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ii=new ot,Tu=new xt,wu=new xt;class ln extends Xf{constructor(t=50,e=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Rl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(so*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Rl*2*Math.atan(Math.tan(so*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ii.x,ii.y).multiplyScalar(-t/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ii.x,ii.y).multiplyScalar(-t/ii.z)}getViewSize(t,e){return this.getViewBounds(t,Tu,wu),e.subVectors(wu,Tu)}setViewOffset(t,e,i,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(so*.5*this.fov)/this.zoom,i=2*e,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,e-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const nr=-90,ir=1;class H_ extends Me{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new ln(nr,ir,t,e);r.layers=this.layers,this.add(r);const s=new ln(nr,ir,t,e);s.layers=this.layers,this.add(s);const o=new ln(nr,ir,t,e);o.layers=this.layers,this.add(o);const a=new ln(nr,ir,t,e);a.layers=this.layers,this.add(a);const l=new ln(nr,ir,t,e);l.layers=this.layers,this.add(l);const c=new ln(nr,ir,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,r,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===Gn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===mo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=t.getRenderTarget(),m=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,r),t.render(e,s),t.setRenderTarget(i,1,r),t.render(e,o),t.setRenderTarget(i,2,r),t.render(e,a),t.setRenderTarget(i,3,r),t.render(e,l),t.setRenderTarget(i,4,r),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,r),t.render(e,u),t.setRenderTarget(h,m,p),t.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class jf extends Ge{constructor(t,e,i,r,s,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:Er,super(t,e,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class V_ extends Fi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new jf(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new gs(5,5,5),s=new gi({name:"CubemapFromEquirect",uniforms:Cr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ve,blending:ui});s.uniforms.tEquirect.value=e;const o=new Qe(r,s),a=e.minFilter;return e.minFilter===Di&&(e.minFilter=Sn),new H_(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,r){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,r);t.setRenderTarget(s)}}const ga=new ot,G_=new ot,W_=new zt;class oi{constructor(t=new ot(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,r){return this.normal.set(t,e,i),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const r=ga.subVectors(i,e).cross(G_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ga),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||W_.getNormalMatrix(t),r=this.coplanarPoint(ga).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Mi=new ms,Bs=new ot;class lc{constructor(t=new oi,e=new oi,i=new oi,r=new oi,s=new oi,o=new oi){this.planes=[t,e,i,r,s,o]}set(t,e,i,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Gn){const i=this.planes,r=t.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],h=r[6],m=r[7],p=r[8],v=r[9],_=r[10],g=r[11],d=r[12],M=r[13],y=r[14],x=r[15];if(i[0].setComponents(l-s,m-c,g-p,x-d).normalize(),i[1].setComponents(l+s,m+c,g+p,x+d).normalize(),i[2].setComponents(l+o,m+u,g+v,x+M).normalize(),i[3].setComponents(l-o,m-u,g-v,x-M).normalize(),i[4].setComponents(l-a,m-h,g-_,x-y).normalize(),e===Gn)i[5].setComponents(l+a,m+h,g+_,x+y).normalize();else if(e===mo)i[5].setComponents(a,h,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Mi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Mi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Mi)}intersectsSprite(t){return Mi.center.set(0,0,0),Mi.radius=.7071067811865476,Mi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Mi)}intersectsSphere(t){const e=this.planes,i=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const r=e[i];if(Bs.x=r.normal.x>0?t.max.x:t.min.x,Bs.y=r.normal.y>0?t.max.y:t.min.y,Bs.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Bs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function qf(){let n=null,t=!1,e=null,i=null;function r(s,o){e(s,o),i=n.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(r),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function X_(n){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,m=n.createBuffer();n.bindBuffer(l,m),n.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((p,v)=>p.start-v.start);let m=0;for(let p=1;p<h.length;p++){const v=h[m],_=h[p];_.start<=v.start+v.count+1?v.count=Math.max(v.count,_.start+_.count-v.start):(++m,h[m]=_)}h.length=m+1;for(let p=0,v=h.length;p<v;p++){const _=h[p];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class Do extends en{constructor(t=1,e=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=t/a,m=e/l,p=[],v=[],_=[],g=[];for(let d=0;d<u;d++){const M=d*m-o;for(let y=0;y<c;y++){const x=y*h-s;v.push(x,-M,0),_.push(0,0,1),g.push(y/a),g.push(1-d/l)}}for(let d=0;d<l;d++)for(let M=0;M<a;M++){const y=M+c*d,x=M+c*(d+1),D=M+1+c*(d+1),N=M+1+c*d;p.push(y,x,N),p.push(x,D,N)}this.setIndex(p),this.setAttribute("position",new Se(v,3)),this.setAttribute("normal",new Se(_,3)),this.setAttribute("uv",new Se(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Do(t.width,t.height,t.widthSegments,t.heightSegments)}}var j_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,q_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Y_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Z_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,K_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,J_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Q_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,t0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,e0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,n0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,i0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,r0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,s0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,o0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,a0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,l0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,c0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,u0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,h0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,f0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,d0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,p0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,m0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,g0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,v0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,x0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,y0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,S0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,b0="gl_FragColor = linearToOutputTexel( gl_FragColor );",M0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,E0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,T0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,w0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,A0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,C0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,R0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,P0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,L0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,D0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,I0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,U0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,N0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,O0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,F0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,k0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,B0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,z0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,H0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,V0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,G0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,W0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,X0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,j0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,q0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Y0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,K0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,J0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Q0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ev=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,iv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,sv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ov=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,av=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,uv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,hv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,pv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_v=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,yv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Sv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ev=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Av=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Cv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Pv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Lv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Iv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Uv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ov=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Fv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$v=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Jv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Qv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,tx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ex=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,nx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ix=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ox=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ax=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ux=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,dx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,px=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_x=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Mx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ex=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:j_,alphahash_pars_fragment:q_,alphamap_fragment:Y_,alphamap_pars_fragment:$_,alphatest_fragment:Z_,alphatest_pars_fragment:K_,aomap_fragment:J_,aomap_pars_fragment:Q_,batching_pars_vertex:t0,batching_vertex:e0,begin_vertex:n0,beginnormal_vertex:i0,bsdfs:r0,iridescence_fragment:s0,bumpmap_pars_fragment:o0,clipping_planes_fragment:a0,clipping_planes_pars_fragment:l0,clipping_planes_pars_vertex:c0,clipping_planes_vertex:u0,color_fragment:h0,color_pars_fragment:f0,color_pars_vertex:d0,color_vertex:p0,common:m0,cube_uv_reflection_fragment:g0,defaultnormal_vertex:_0,displacementmap_pars_vertex:v0,displacementmap_vertex:x0,emissivemap_fragment:y0,emissivemap_pars_fragment:S0,colorspace_fragment:b0,colorspace_pars_fragment:M0,envmap_fragment:E0,envmap_common_pars_fragment:T0,envmap_pars_fragment:w0,envmap_pars_vertex:A0,envmap_physical_pars_fragment:k0,envmap_vertex:C0,fog_vertex:R0,fog_pars_vertex:P0,fog_fragment:L0,fog_pars_fragment:D0,gradientmap_pars_fragment:I0,lightmap_pars_fragment:U0,lights_lambert_fragment:N0,lights_lambert_pars_fragment:O0,lights_pars_begin:F0,lights_toon_fragment:B0,lights_toon_pars_fragment:z0,lights_phong_fragment:H0,lights_phong_pars_fragment:V0,lights_physical_fragment:G0,lights_physical_pars_fragment:W0,lights_fragment_begin:X0,lights_fragment_maps:j0,lights_fragment_end:q0,logdepthbuf_fragment:Y0,logdepthbuf_pars_fragment:$0,logdepthbuf_pars_vertex:Z0,logdepthbuf_vertex:K0,map_fragment:J0,map_pars_fragment:Q0,map_particle_fragment:tv,map_particle_pars_fragment:ev,metalnessmap_fragment:nv,metalnessmap_pars_fragment:iv,morphinstance_vertex:rv,morphcolor_vertex:sv,morphnormal_vertex:ov,morphtarget_pars_vertex:av,morphtarget_vertex:lv,normal_fragment_begin:cv,normal_fragment_maps:uv,normal_pars_fragment:hv,normal_pars_vertex:fv,normal_vertex:dv,normalmap_pars_fragment:pv,clearcoat_normal_fragment_begin:mv,clearcoat_normal_fragment_maps:gv,clearcoat_pars_fragment:_v,iridescence_pars_fragment:vv,opaque_fragment:xv,packing:yv,premultiplied_alpha_fragment:Sv,project_vertex:bv,dithering_fragment:Mv,dithering_pars_fragment:Ev,roughnessmap_fragment:Tv,roughnessmap_pars_fragment:wv,shadowmap_pars_fragment:Av,shadowmap_pars_vertex:Cv,shadowmap_vertex:Rv,shadowmask_pars_fragment:Pv,skinbase_vertex:Lv,skinning_pars_vertex:Dv,skinning_vertex:Iv,skinnormal_vertex:Uv,specularmap_fragment:Nv,specularmap_pars_fragment:Ov,tonemapping_fragment:Fv,tonemapping_pars_fragment:kv,transmission_fragment:Bv,transmission_pars_fragment:zv,uv_pars_fragment:Hv,uv_pars_vertex:Vv,uv_vertex:Gv,worldpos_vertex:Wv,background_vert:Xv,background_frag:jv,backgroundCube_vert:qv,backgroundCube_frag:Yv,cube_vert:$v,cube_frag:Zv,depth_vert:Kv,depth_frag:Jv,distanceRGBA_vert:Qv,distanceRGBA_frag:tx,equirect_vert:ex,equirect_frag:nx,linedashed_vert:ix,linedashed_frag:rx,meshbasic_vert:sx,meshbasic_frag:ox,meshlambert_vert:ax,meshlambert_frag:lx,meshmatcap_vert:cx,meshmatcap_frag:ux,meshnormal_vert:hx,meshnormal_frag:fx,meshphong_vert:dx,meshphong_frag:px,meshphysical_vert:mx,meshphysical_frag:gx,meshtoon_vert:_x,meshtoon_frag:vx,points_vert:xx,points_frag:yx,shadow_vert:Sx,shadow_frag:bx,sprite_vert:Mx,sprite_frag:Ex},At={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},xn={basic:{uniforms:Le([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:Le([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Yt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:Le([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:Le([At.common,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.roughnessmap,At.metalnessmap,At.fog,At.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:Le([At.common,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.gradientmap,At.fog,At.lights,{emissive:{value:new Yt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:Le([At.common,At.bumpmap,At.normalmap,At.displacementmap,At.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:Le([At.points,At.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:Le([At.common,At.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:Le([At.common,At.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:Le([At.common,At.bumpmap,At.normalmap,At.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:Le([At.sprite,At.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:Le([At.common,At.displacementmap,{referencePosition:{value:new ot},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:Le([At.lights,At.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};xn.physical={uniforms:Le([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};const zs={r:0,b:0,g:0},Ei=new wn,Tx=new he;function wx(n,t,e,i,r,s,o){const a=new Yt(0);let l=s===!0?0:1,c,u,h=null,m=0,p=null;function v(M){let y=M.isScene===!0?M.background:null;return y&&y.isTexture&&(y=(M.backgroundBlurriness>0?e:t).get(y)),y}function _(M){let y=!1;const x=v(M);x===null?d(a,l):x&&x.isColor&&(d(x,1),y=!0);const D=n.xr.getEnvironmentBlendMode();D==="additive"?i.buffers.color.setClear(0,0,0,1,o):D==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(M,y){const x=v(y);x&&(x.isCubeTexture||x.mapping===Po)?(u===void 0&&(u=new Qe(new gs(1,1,1),new gi({name:"BackgroundCubeMaterial",uniforms:Cr(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Ve,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(D,N,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Ei.copy(y.backgroundRotation),Ei.x*=-1,Ei.y*=-1,Ei.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Ei.y*=-1,Ei.z*=-1),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Tx.makeRotationFromEuler(Ei)),u.material.toneMapped=$t.getTransfer(x.colorSpace)!==ie,(h!==x||m!==x.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,h=x,m=x.version,p=n.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Qe(new Do(2,2),new gi({name:"BackgroundMaterial",uniforms:Cr(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:mi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=$t.getTransfer(x.colorSpace)!==ie,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||m!==x.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=x,m=x.version,p=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function d(M,y){M.getRGB(zs,Wf(n)),i.buffers.color.setClear(zs.r,zs.g,zs.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(M,y=1){a.set(M),l=y,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,d(a,l)},render:_,addToRenderList:g}}function Ax(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=m(null);let s=r,o=!1;function a(R,q,I,j,E){let K=!1;const et=h(j,I,q);s!==et&&(s=et,c(s.object)),K=p(R,j,I,E),K&&v(R,j,I,E),E!==null&&t.update(E,n.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,x(R,q,I,j),E!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(E).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function u(R){return n.deleteVertexArray(R)}function h(R,q,I){const j=I.wireframe===!0;let E=i[R.id];E===void 0&&(E={},i[R.id]=E);let K=E[q.id];K===void 0&&(K={},E[q.id]=K);let et=K[j];return et===void 0&&(et=m(l()),K[j]=et),et}function m(R){const q=[],I=[],j=[];for(let E=0;E<e;E++)q[E]=0,I[E]=0,j[E]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:q,enabledAttributes:I,attributeDivisors:j,object:R,attributes:{},index:null}}function p(R,q,I,j){const E=s.attributes,K=q.attributes;let et=0;const $=I.getAttributes();for(const Y in $)if($[Y].location>=0){const ft=E[Y];let Q=K[Y];if(Q===void 0&&(Y==="instanceMatrix"&&R.instanceMatrix&&(Q=R.instanceMatrix),Y==="instanceColor"&&R.instanceColor&&(Q=R.instanceColor)),ft===void 0||ft.attribute!==Q||Q&&ft.data!==Q.data)return!0;et++}return s.attributesNum!==et||s.index!==j}function v(R,q,I,j){const E={},K=q.attributes;let et=0;const $=I.getAttributes();for(const Y in $)if($[Y].location>=0){let ft=K[Y];ft===void 0&&(Y==="instanceMatrix"&&R.instanceMatrix&&(ft=R.instanceMatrix),Y==="instanceColor"&&R.instanceColor&&(ft=R.instanceColor));const Q={};Q.attribute=ft,ft&&ft.data&&(Q.data=ft.data),E[Y]=Q,et++}s.attributes=E,s.attributesNum=et,s.index=j}function _(){const R=s.newAttributes;for(let q=0,I=R.length;q<I;q++)R[q]=0}function g(R){d(R,0)}function d(R,q){const I=s.newAttributes,j=s.enabledAttributes,E=s.attributeDivisors;I[R]=1,j[R]===0&&(n.enableVertexAttribArray(R),j[R]=1),E[R]!==q&&(n.vertexAttribDivisor(R,q),E[R]=q)}function M(){const R=s.newAttributes,q=s.enabledAttributes;for(let I=0,j=q.length;I<j;I++)q[I]!==R[I]&&(n.disableVertexAttribArray(I),q[I]=0)}function y(R,q,I,j,E,K,et){et===!0?n.vertexAttribIPointer(R,q,I,E,K):n.vertexAttribPointer(R,q,I,j,E,K)}function x(R,q,I,j){_();const E=j.attributes,K=I.getAttributes(),et=q.defaultAttributeValues;for(const $ in K){const Y=K[$];if(Y.location>=0){let rt=E[$];if(rt===void 0&&($==="instanceMatrix"&&R.instanceMatrix&&(rt=R.instanceMatrix),$==="instanceColor"&&R.instanceColor&&(rt=R.instanceColor)),rt!==void 0){const ft=rt.normalized,Q=rt.itemSize,nt=t.get(rt);if(nt===void 0)continue;const bt=nt.buffer,W=nt.type,B=nt.bytesPerElement,V=W===n.INT||W===n.UNSIGNED_INT||rt.gpuType===ec;if(rt.isInterleavedBufferAttribute){const O=rt.data,it=O.stride,ut=rt.offset;if(O.isInstancedInterleavedBuffer){for(let st=0;st<Y.locationSize;st++)d(Y.location+st,O.meshPerAttribute);R.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let st=0;st<Y.locationSize;st++)g(Y.location+st);n.bindBuffer(n.ARRAY_BUFFER,bt);for(let st=0;st<Y.locationSize;st++)y(Y.location+st,Q/Y.locationSize,W,ft,it*B,(ut+Q/Y.locationSize*st)*B,V)}else{if(rt.isInstancedBufferAttribute){for(let O=0;O<Y.locationSize;O++)d(Y.location+O,rt.meshPerAttribute);R.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let O=0;O<Y.locationSize;O++)g(Y.location+O);n.bindBuffer(n.ARRAY_BUFFER,bt);for(let O=0;O<Y.locationSize;O++)y(Y.location+O,Q/Y.locationSize,W,ft,Q*B,Q/Y.locationSize*O*B,V)}}else if(et!==void 0){const ft=et[$];if(ft!==void 0)switch(ft.length){case 2:n.vertexAttrib2fv(Y.location,ft);break;case 3:n.vertexAttrib3fv(Y.location,ft);break;case 4:n.vertexAttrib4fv(Y.location,ft);break;default:n.vertexAttrib1fv(Y.location,ft)}}}}M()}function D(){z();for(const R in i){const q=i[R];for(const I in q){const j=q[I];for(const E in j)u(j[E].object),delete j[E];delete q[I]}delete i[R]}}function N(R){if(i[R.id]===void 0)return;const q=i[R.id];for(const I in q){const j=q[I];for(const E in j)u(j[E].object),delete j[E];delete q[I]}delete i[R.id]}function L(R){for(const q in i){const I=i[q];if(I[R.id]===void 0)continue;const j=I[R.id];for(const E in j)u(j[E].object),delete j[E];delete I[R.id]}}function z(){C(),o=!0,s!==r&&(s=r,c(s.object))}function C(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:z,resetDefaultState:C,dispose:D,releaseStatesOfGeometry:N,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:g,disableUnusedAttributes:M}}function Cx(n,t,e){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),e.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),e.update(u,i,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let v=0;v<h;v++)p+=u[v];e.update(p,i,1)}function l(c,u,h,m){if(h===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)o(c[v],u[v],m[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,m,0,h);let v=0;for(let _=0;_<h;_++)v+=u[_]*m[_];e.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Rx(n,t,e,i){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const L=t.get("EXT_texture_filter_anisotropic");r=n.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(L){return!(L!==un&&i.convert(L)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(L){const z=L===ps&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(L!==Yn&&i.convert(L)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==Vn&&!z)}function l(L){if(L==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,m=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),D=v>0,N=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:m,maxTextures:p,maxVertexTextures:v,maxTextureSize:_,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:D,maxSamples:N}}function Px(n){const t=this;let e=null,i=0,r=!1,s=!1;const o=new oi,a=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,m){const p=h.length!==0||m||i!==0||r;return r=m,i=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,m){e=u(h,m,0)},this.setState=function(h,m,p){const v=h.clippingPlanes,_=h.clipIntersection,g=h.clipShadows,d=n.get(h);if(!r||v===null||v.length===0||s&&!g)s?u(null):c();else{const M=s?0:i,y=M*4;let x=d.clippingState||null;l.value=x,x=u(v,m,y,p);for(let D=0;D!==y;++D)x[D]=e[D];d.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,m,p,v){const _=h!==null?h.length:0;let g=null;if(_!==0){if(g=l.value,v!==!0||g===null){const d=p+_*4,M=m.matrixWorldInverse;a.getNormalMatrix(M),(g===null||g.length<d)&&(g=new Float32Array(d));for(let y=0,x=p;y!==_;++y,x+=4)o.copy(h[y]).applyMatrix4(M,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function Lx(n){let t=new WeakMap;function e(o,a){return a===Qa?o.mapping=Er:a===tl&&(o.mapping=Tr),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Qa||a===tl)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new V_(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",r),e(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class cc extends Xf{constructor(t=-1,e=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-t,o=i+t,a=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const lr=4,Au=[.125,.215,.35,.446,.526,.582],Pi=20,_a=new cc,Cu=new Yt;let va=null,xa=0,ya=0,Sa=!1;const Ci=(1+Math.sqrt(5))/2,rr=1/Ci,Ru=[new ot(-Ci,rr,0),new ot(Ci,rr,0),new ot(-rr,0,Ci),new ot(rr,0,Ci),new ot(0,Ci,-rr),new ot(0,Ci,rr),new ot(-1,1,-1),new ot(1,1,-1),new ot(-1,1,1),new ot(1,1,1)];class Pu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,r=100){va=this._renderer.getRenderTarget(),xa=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel(),Sa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Iu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Du(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(va,xa,ya),this._renderer.xr.enabled=Sa,t.scissorTest=!1,Hs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Er||t.mapping===Tr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),va=this._renderer.getRenderTarget(),xa=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel(),Sa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:ps,format:un,colorSpace:Rr,depthBuffer:!1},r=Lu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Lu(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Dx(s)),this._blurMaterial=Ix(s,t,e)}return r}_compileMaterial(t){const e=new Qe(this._lodPlanes[0],t);this._renderer.compile(e,_a)}_sceneToCubeUV(t,e,i,r){const a=new ln(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,m=u.toneMapping;u.getClearColor(Cu),u.toneMapping=hi,u.autoClear=!1;const p=new Hf({name:"PMREM.Background",side:Ve,depthWrite:!1,depthTest:!1}),v=new Qe(new gs,p);let _=!1;const g=t.background;g?g.isColor&&(p.color.copy(g),t.background=null,_=!0):(p.color.copy(Cu),_=!0);for(let d=0;d<6;d++){const M=d%3;M===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):M===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const y=this._cubeSize;Hs(r,M*y,d>2?y:0,y,y),u.setRenderTarget(r),_&&u.render(v,a),u.render(t,a)}v.geometry.dispose(),v.material.dispose(),u.toneMapping=m,u.autoClear=h,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,r=t.mapping===Er||t.mapping===Tr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Iu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Du());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Qe(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;Hs(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,_a)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ru[(r-s-1)%Ru.length];this._blur(t,s-1,s,o,a)}e.autoClear=i}_blur(t,e,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,r,"latitudinal",s),this._halfBlur(o,t,i,i,r,"longitudinal",s)}_halfBlur(t,e,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Qe(this._lodPlanes[r],c),m=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Pi-1),_=s/v,g=isFinite(s)?1+Math.floor(u*_):Pi;g>Pi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Pi}`);const d=[];let M=0;for(let L=0;L<Pi;++L){const z=L/_,C=Math.exp(-z*z/2);d.push(C),L===0?M+=C:L<g&&(M+=2*C)}for(let L=0;L<d.length;L++)d[L]=d[L]/M;m.envMap.value=t.texture,m.samples.value=g,m.weights.value=d,m.latitudinal.value=o==="latitudinal",a&&(m.poleAxis.value=a);const{_lodMax:y}=this;m.dTheta.value=v,m.mipInt.value=y-i;const x=this._sizeLods[r],D=3*x*(r>y-lr?r-y+lr:0),N=4*(this._cubeSize-x);Hs(e,D,N,3*x,2*x),l.setRenderTarget(e),l.render(h,_a)}}function Dx(n){const t=[],e=[],i=[];let r=n;const s=n-lr+1+Au.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>n-lr?l=Au[o-n+lr-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,m=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,v=6,_=3,g=2,d=1,M=new Float32Array(_*v*p),y=new Float32Array(g*v*p),x=new Float32Array(d*v*p);for(let N=0;N<p;N++){const L=N%3*2/3-1,z=N>2?0:-1,C=[L,z,0,L+2/3,z,0,L+2/3,z+1,0,L,z,0,L+2/3,z+1,0,L,z+1,0];M.set(C,_*v*N),y.set(m,g*v*N);const R=[N,N,N,N,N,N];x.set(R,d*v*N)}const D=new en;D.setAttribute("position",new Mn(M,_)),D.setAttribute("uv",new Mn(y,g)),D.setAttribute("faceIndex",new Mn(x,d)),t.push(D),r>lr&&r--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Lu(n,t,e){const i=new Fi(n,t,e);return i.texture.mapping=Po,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Hs(n,t,e,i,r){n.viewport.set(t,e,i,r),n.scissor.set(t,e,i,r)}function Ix(n,t,e){const i=new Float32Array(Pi),r=new ot(0,1,0);return new gi({name:"SphericalGaussianBlur",defines:{n:Pi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Du(){return new gi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Iu(){return new gi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function uc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ux(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Qa||l===tl,u=l===Er||l===Tr;if(c||u){let h=t.get(a);const m=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==m)return e===null&&(e=new Pu(n)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(e===null&&(e=new Pu(n)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function Nx(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return t[i]=r,r}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const r=e(i);return r===null&&Wr("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Ox(n,t,e,i){const r={},s=new WeakMap;function o(h){const m=h.target;m.index!==null&&t.remove(m.index);for(const v in m.attributes)t.remove(m.attributes[v]);for(const v in m.morphAttributes){const _=m.morphAttributes[v];for(let g=0,d=_.length;g<d;g++)t.remove(_[g])}m.removeEventListener("dispose",o),delete r[m.id];const p=s.get(m);p&&(t.remove(p),s.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function a(h,m){return r[m.id]===!0||(m.addEventListener("dispose",o),r[m.id]=!0,e.memory.geometries++),m}function l(h){const m=h.attributes;for(const v in m)t.update(m[v],n.ARRAY_BUFFER);const p=h.morphAttributes;for(const v in p){const _=p[v];for(let g=0,d=_.length;g<d;g++)t.update(_[g],n.ARRAY_BUFFER)}}function c(h){const m=[],p=h.index,v=h.attributes.position;let _=0;if(p!==null){const M=p.array;_=p.version;for(let y=0,x=M.length;y<x;y+=3){const D=M[y+0],N=M[y+1],L=M[y+2];m.push(D,N,N,L,L,D)}}else if(v!==void 0){const M=v.array;_=v.version;for(let y=0,x=M.length/3-1;y<x;y+=3){const D=y+0,N=y+1,L=y+2;m.push(D,N,N,L,L,D)}}else return;const g=new(Of(m)?Gf:Vf)(m,1);g.version=_;const d=s.get(h);d&&t.remove(d),s.set(h,g)}function u(h){const m=s.get(h);if(m){const p=h.index;p!==null&&m.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Fx(n,t,e){let i;function r(m){i=m}let s,o;function a(m){s=m.type,o=m.bytesPerElement}function l(m,p){n.drawElements(i,p,s,m*o),e.update(p,i,1)}function c(m,p,v){v!==0&&(n.drawElementsInstanced(i,p,s,m*o,v),e.update(p,i,v))}function u(m,p,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,m,0,v);let g=0;for(let d=0;d<v;d++)g+=p[d];e.update(g,i,1)}function h(m,p,v,_){if(v===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<m.length;d++)c(m[d]/o,p[d],_[d]);else{g.multiDrawElementsInstancedWEBGL(i,p,0,s,m,0,_,0,v);let d=0;for(let M=0;M<v;M++)d+=p[M]*_[M];e.update(d,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function kx(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(s/3);break;case n.LINES:e.lines+=a*(s/2);break;case n.LINE_STRIP:e.lines+=a*(s-1);break;case n.LINE_LOOP:e.lines+=a*s;break;case n.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:i}}function Bx(n,t,e){const i=new WeakMap,r=new pe;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let m=i.get(a);if(m===void 0||m.count!==h){let R=function(){z.dispose(),i.delete(a),a.removeEventListener("dispose",R)};var p=R;m!==void 0&&m.texture.dispose();const v=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let x=0;v===!0&&(x=1),_===!0&&(x=2),g===!0&&(x=3);let D=a.attributes.position.count*x,N=1;D>t.maxTextureSize&&(N=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const L=new Float32Array(D*N*4*h),z=new kf(L,D,N,h);z.type=Vn,z.needsUpdate=!0;const C=x*4;for(let q=0;q<h;q++){const I=d[q],j=M[q],E=y[q],K=D*N*4*q;for(let et=0;et<I.count;et++){const $=et*C;v===!0&&(r.fromBufferAttribute(I,et),L[K+$+0]=r.x,L[K+$+1]=r.y,L[K+$+2]=r.z,L[K+$+3]=0),_===!0&&(r.fromBufferAttribute(j,et),L[K+$+4]=r.x,L[K+$+5]=r.y,L[K+$+6]=r.z,L[K+$+7]=0),g===!0&&(r.fromBufferAttribute(E,et),L[K+$+8]=r.x,L[K+$+9]=r.y,L[K+$+10]=r.z,L[K+$+11]=E.itemSize===4?r.w:1)}}m={count:h,texture:z,size:new xt(D,N)},i.set(a,m),a.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let v=0;for(let g=0;g<c.length;g++)v+=c[g];const _=a.morphTargetsRelative?1:1-v;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",m.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:s}}function zx(n,t,e,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=t.get(l,u);if(r.get(h)!==c&&(t.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const m=l.skeleton;r.get(m)!==c&&(m.update(),r.set(m,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Yf extends Ge{constructor(t,e,i,r,s,o,a,l,c,u=vr){if(u!==vr&&u!==Ar)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===vr&&(i=Oi),i===void 0&&u===Ar&&(i=wr),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:fn,this.minFilter=l!==void 0?l:fn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const $f=new Ge,Uu=new Yf(1,1),Zf=new kf,Kf=new w_,Jf=new jf,Nu=[],Ou=[],Fu=new Float32Array(16),ku=new Float32Array(9),Bu=new Float32Array(4);function Dr(n,t,e){const i=n[0];if(i<=0||i>0)return n;const r=t*e;let s=Nu[r];if(s===void 0&&(s=new Float32Array(r),Nu[r]=s),t!==0){i.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(s,a)}return s}function ve(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function xe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Io(n,t){let e=Ou[t];e===void 0&&(e=new Int32Array(t),Ou[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Hx(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Vx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ve(e,t))return;n.uniform2fv(this.addr,t),xe(e,t)}}function Gx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ve(e,t))return;n.uniform3fv(this.addr,t),xe(e,t)}}function Wx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ve(e,t))return;n.uniform4fv(this.addr,t),xe(e,t)}}function Xx(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ve(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(ve(e,i))return;Bu.set(i),n.uniformMatrix2fv(this.addr,!1,Bu),xe(e,i)}}function jx(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ve(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(ve(e,i))return;ku.set(i),n.uniformMatrix3fv(this.addr,!1,ku),xe(e,i)}}function qx(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ve(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(ve(e,i))return;Fu.set(i),n.uniformMatrix4fv(this.addr,!1,Fu),xe(e,i)}}function Yx(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function $x(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ve(e,t))return;n.uniform2iv(this.addr,t),xe(e,t)}}function Zx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ve(e,t))return;n.uniform3iv(this.addr,t),xe(e,t)}}function Kx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ve(e,t))return;n.uniform4iv(this.addr,t),xe(e,t)}}function Jx(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Qx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ve(e,t))return;n.uniform2uiv(this.addr,t),xe(e,t)}}function ty(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ve(e,t))return;n.uniform3uiv(this.addr,t),xe(e,t)}}function ey(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ve(e,t))return;n.uniform4uiv(this.addr,t),xe(e,t)}}function ny(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Uu.compareFunction=Nf,s=Uu):s=$f,e.setTexture2D(t||s,r)}function iy(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture3D(t||Kf,r)}function ry(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTextureCube(t||Jf,r)}function sy(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture2DArray(t||Zf,r)}function oy(n){switch(n){case 5126:return Hx;case 35664:return Vx;case 35665:return Gx;case 35666:return Wx;case 35674:return Xx;case 35675:return jx;case 35676:return qx;case 5124:case 35670:return Yx;case 35667:case 35671:return $x;case 35668:case 35672:return Zx;case 35669:case 35673:return Kx;case 5125:return Jx;case 36294:return Qx;case 36295:return ty;case 36296:return ey;case 35678:case 36198:case 36298:case 36306:case 35682:return ny;case 35679:case 36299:case 36307:return iy;case 35680:case 36300:case 36308:case 36293:return ry;case 36289:case 36303:case 36311:case 36292:return sy}}function ay(n,t){n.uniform1fv(this.addr,t)}function ly(n,t){const e=Dr(t,this.size,2);n.uniform2fv(this.addr,e)}function cy(n,t){const e=Dr(t,this.size,3);n.uniform3fv(this.addr,e)}function uy(n,t){const e=Dr(t,this.size,4);n.uniform4fv(this.addr,e)}function hy(n,t){const e=Dr(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function fy(n,t){const e=Dr(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function dy(n,t){const e=Dr(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function py(n,t){n.uniform1iv(this.addr,t)}function my(n,t){n.uniform2iv(this.addr,t)}function gy(n,t){n.uniform3iv(this.addr,t)}function _y(n,t){n.uniform4iv(this.addr,t)}function vy(n,t){n.uniform1uiv(this.addr,t)}function xy(n,t){n.uniform2uiv(this.addr,t)}function yy(n,t){n.uniform3uiv(this.addr,t)}function Sy(n,t){n.uniform4uiv(this.addr,t)}function by(n,t,e){const i=this.cache,r=t.length,s=Io(e,r);ve(i,s)||(n.uniform1iv(this.addr,s),xe(i,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||$f,s[o])}function My(n,t,e){const i=this.cache,r=t.length,s=Io(e,r);ve(i,s)||(n.uniform1iv(this.addr,s),xe(i,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Kf,s[o])}function Ey(n,t,e){const i=this.cache,r=t.length,s=Io(e,r);ve(i,s)||(n.uniform1iv(this.addr,s),xe(i,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Jf,s[o])}function Ty(n,t,e){const i=this.cache,r=t.length,s=Io(e,r);ve(i,s)||(n.uniform1iv(this.addr,s),xe(i,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||Zf,s[o])}function wy(n){switch(n){case 5126:return ay;case 35664:return ly;case 35665:return cy;case 35666:return uy;case 35674:return hy;case 35675:return fy;case 35676:return dy;case 5124:case 35670:return py;case 35667:case 35671:return my;case 35668:case 35672:return gy;case 35669:case 35673:return _y;case 5125:return vy;case 36294:return xy;case 36295:return yy;case 36296:return Sy;case 35678:case 36198:case 36298:case 36306:case 35682:return by;case 35679:case 36299:case 36307:return My;case 35680:case 36300:case 36308:case 36293:return Ey;case 36289:case 36303:case 36311:case 36292:return Ty}}class Ay{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=oy(e.type)}}class Cy{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=wy(e.type)}}class Ry{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],i)}}}const ba=/(\w+)(\])?(\[|\.)?/g;function zu(n,t){n.seq.push(t),n.map[t.id]=t}function Py(n,t,e){const i=n.name,r=i.length;for(ba.lastIndex=0;;){const s=ba.exec(i),o=ba.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){zu(e,c===void 0?new Ay(a,n,t):new Cy(a,n,t));break}else{let h=e.map[a];h===void 0&&(h=new Ry(a),zu(e,h)),e=h}}}class oo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);Py(s,o,this)}}setValue(t,e,i,r){const s=this.map[e];s!==void 0&&s.setValue(t,i,r)}setOptional(t,e,i){const r=e[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,e,i,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,r)}}static seqWithValue(t,e){const i=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&i.push(o)}return i}}function Hu(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Ly=37297;let Dy=0;function Iy(n,t){const e=n.split(`
`),i=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}const Vu=new zt;function Uy(n){$t._getMatrix(Vu,$t.workingColorSpace,n);const t=`mat3( ${Vu.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(n)){case Lo:return[t,"LinearTransferOETF"];case ie:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Gu(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=n.getShaderInfoLog(t).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+Iy(n.getShaderSource(t),o)}else return r}function Ny(n,t){const e=Uy(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Oy(n,t){let e;switch(t){case Jg:e="Linear";break;case Qg:e="Reinhard";break;case t_:e="Cineon";break;case e_:e="ACESFilmic";break;case i_:e="AgX";break;case r_:e="Neutral";break;case n_:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Vs=new ot;function Fy(){$t.getLuminanceCoefficients(Vs);const n=Vs.x.toFixed(4),t=Vs.y.toFixed(4),e=Vs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ky(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xr).join(`
`)}function By(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function zy(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(t,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Xr(n){return n!==""}function Wu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Xu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Hy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pl(n){return n.replace(Hy,Gy)}const Vy=new Map;function Gy(n,t){let e=qt[t];if(e===void 0){const i=Vy.get(t);if(i!==void 0)e=qt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Pl(e)}const Wy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ju(n){return n.replace(Wy,Xy)}function Xy(n,t,e,i){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function qu(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function jy(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Sf?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Lg?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function qy(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Er:case Tr:t="ENVMAP_TYPE_CUBE";break;case Po:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Yy(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Tr:t="ENVMAP_MODE_REFRACTION";break}return t}function $y(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case bf:t="ENVMAP_BLENDING_MULTIPLY";break;case Zg:t="ENVMAP_BLENDING_MIX";break;case Kg:t="ENVMAP_BLENDING_ADD";break}return t}function Zy(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Ky(n,t,e,i){const r=n.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=jy(e),c=qy(e),u=Yy(e),h=$y(e),m=Zy(e),p=ky(e),v=By(s),_=r.createProgram();let g,d,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Xr).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Xr).join(`
`),d.length>0&&(d+=`
`)):(g=[qu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xr).join(`
`),d=[qu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hi?"#define TONE_MAPPING":"",e.toneMapping!==hi?qt.tonemapping_pars_fragment:"",e.toneMapping!==hi?Oy("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,Ny("linearToOutputTexel",e.outputColorSpace),Fy(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xr).join(`
`)),o=Pl(o),o=Wu(o,e),o=Xu(o,e),a=Pl(a),a=Wu(a,e),a=Xu(a,e),o=ju(o),a=ju(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",e.glslVersion===ou?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ou?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=M+g+o,x=M+d+a,D=Hu(r,r.VERTEX_SHADER,y),N=Hu(r,r.FRAGMENT_SHADER,x);r.attachShader(_,D),r.attachShader(_,N),e.index0AttributeName!==void 0?r.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function L(q){if(n.debug.checkShaderErrors){const I=r.getProgramInfoLog(_).trim(),j=r.getShaderInfoLog(D).trim(),E=r.getShaderInfoLog(N).trim();let K=!0,et=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,D,N);else{const $=Gu(r,D,"vertex"),Y=Gu(r,N,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+q.name+`
Material Type: `+q.type+`

Program Info Log: `+I+`
`+$+`
`+Y)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(j===""||E==="")&&(et=!1);et&&(q.diagnostics={runnable:K,programLog:I,vertexShader:{log:j,prefix:g},fragmentShader:{log:E,prefix:d}})}r.deleteShader(D),r.deleteShader(N),z=new oo(r,_),C=zy(r,_)}let z;this.getUniforms=function(){return z===void 0&&L(this),z};let C;this.getAttributes=function(){return C===void 0&&L(this),C};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(_,Ly)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Dy++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=N,this}let Jy=0;class Qy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new tS(t),e.set(t,i)),i}}class tS{constructor(t){this.id=Jy++,this.code=t,this.usedTimes=0}}function eS(n,t,e,i,r,s,o){const a=new Bf,l=new Qy,c=new Set,u=[],h=r.logarithmicDepthBuffer,m=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(C){return c.add(C),C===0?"uv":`uv${C}`}function g(C,R,q,I,j){const E=I.fog,K=j.geometry,et=C.isMeshStandardMaterial?I.environment:null,$=(C.isMeshStandardMaterial?e:t).get(C.envMap||et),Y=$&&$.mapping===Po?$.image.height:null,rt=v[C.type];C.precision!==null&&(p=r.getMaxPrecision(C.precision),p!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",p,"instead."));const ft=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Q=ft!==void 0?ft.length:0;let nt=0;K.morphAttributes.position!==void 0&&(nt=1),K.morphAttributes.normal!==void 0&&(nt=2),K.morphAttributes.color!==void 0&&(nt=3);let bt,W,B,V;if(rt){const ne=xn[rt];bt=ne.vertexShader,W=ne.fragmentShader}else bt=C.vertexShader,W=C.fragmentShader,l.update(C),B=l.getVertexShaderID(C),V=l.getFragmentShaderID(C);const O=n.getRenderTarget(),it=n.state.buffers.depth.getReversed(),ut=j.isInstancedMesh===!0,st=j.isBatchedMesh===!0,gt=!!C.map,P=!!C.matcap,k=!!$,f=!!C.aoMap,F=!!C.lightMap,U=!!C.bumpMap,A=!!C.normalMap,S=!!C.displacementMap,T=!!C.emissiveMap,X=!!C.metalnessMap,w=!!C.roughnessMap,b=C.anisotropy>0,H=C.clearcoat>0,Z=C.dispersion>0,J=C.iridescence>0,tt=C.sheen>0,_t=C.transmission>0,ht=b&&!!C.anisotropyMap,St=H&&!!C.clearcoatMap,It=H&&!!C.clearcoatNormalMap,vt=H&&!!C.clearcoatRoughnessMap,Et=J&&!!C.iridescenceMap,wt=J&&!!C.iridescenceThicknessMap,kt=tt&&!!C.sheenColorMap,Tt=tt&&!!C.sheenRoughnessMap,Bt=!!C.specularMap,Ht=!!C.specularColorMap,Kt=!!C.specularIntensityMap,at=_t&&!!C.transmissionMap,Ct=_t&&!!C.thicknessMap,mt=!!C.gradientMap,yt=!!C.alphaMap,Rt=C.alphaTest>0,Pt=!!C.alphaHash,Wt=!!C.extensions;let de=hi;C.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(de=n.toneMapping);const Te={shaderID:rt,shaderType:C.type,shaderName:C.name,vertexShader:bt,fragmentShader:W,defines:C.defines,customVertexShaderID:B,customFragmentShaderID:V,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:p,batching:st,batchingColor:st&&j._colorsTexture!==null,instancing:ut,instancingColor:ut&&j.instanceColor!==null,instancingMorph:ut&&j.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:O===null?n.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:Rr,alphaToCoverage:!!C.alphaToCoverage,map:gt,matcap:P,envMap:k,envMapMode:k&&$.mapping,envMapCubeUVHeight:Y,aoMap:f,lightMap:F,bumpMap:U,normalMap:A,displacementMap:m&&S,emissiveMap:T,normalMapObjectSpace:A&&C.normalMapType===l_,normalMapTangentSpace:A&&C.normalMapType===Uf,metalnessMap:X,roughnessMap:w,anisotropy:b,anisotropyMap:ht,clearcoat:H,clearcoatMap:St,clearcoatNormalMap:It,clearcoatRoughnessMap:vt,dispersion:Z,iridescence:J,iridescenceMap:Et,iridescenceThicknessMap:wt,sheen:tt,sheenColorMap:kt,sheenRoughnessMap:Tt,specularMap:Bt,specularColorMap:Ht,specularIntensityMap:Kt,transmission:_t,transmissionMap:at,thicknessMap:Ct,gradientMap:mt,opaque:C.transparent===!1&&C.blending===_r&&C.alphaToCoverage===!1,alphaMap:yt,alphaTest:Rt,alphaHash:Pt,combine:C.combine,mapUv:gt&&_(C.map.channel),aoMapUv:f&&_(C.aoMap.channel),lightMapUv:F&&_(C.lightMap.channel),bumpMapUv:U&&_(C.bumpMap.channel),normalMapUv:A&&_(C.normalMap.channel),displacementMapUv:S&&_(C.displacementMap.channel),emissiveMapUv:T&&_(C.emissiveMap.channel),metalnessMapUv:X&&_(C.metalnessMap.channel),roughnessMapUv:w&&_(C.roughnessMap.channel),anisotropyMapUv:ht&&_(C.anisotropyMap.channel),clearcoatMapUv:St&&_(C.clearcoatMap.channel),clearcoatNormalMapUv:It&&_(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&_(C.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&_(C.iridescenceMap.channel),iridescenceThicknessMapUv:wt&&_(C.iridescenceThicknessMap.channel),sheenColorMapUv:kt&&_(C.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&_(C.sheenRoughnessMap.channel),specularMapUv:Bt&&_(C.specularMap.channel),specularColorMapUv:Ht&&_(C.specularColorMap.channel),specularIntensityMapUv:Kt&&_(C.specularIntensityMap.channel),transmissionMapUv:at&&_(C.transmissionMap.channel),thicknessMapUv:Ct&&_(C.thicknessMap.channel),alphaMapUv:yt&&_(C.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(A||b),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:j.isPoints===!0&&!!K.attributes.uv&&(gt||yt),fog:!!E,useFog:C.fog===!0,fogExp2:!!E&&E.isFogExp2,flatShading:C.flatShading===!0,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:it,skinning:j.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:nt,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:C.dithering,shadowMapEnabled:n.shadowMap.enabled&&q.length>0,shadowMapType:n.shadowMap.type,toneMapping:de,decodeVideoTexture:gt&&C.map.isVideoTexture===!0&&$t.getTransfer(C.map.colorSpace)===ie,decodeVideoTextureEmissive:T&&C.emissiveMap.isVideoTexture===!0&&$t.getTransfer(C.emissiveMap.colorSpace)===ie,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===Hn,flipSided:C.side===Ve,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionClipCullDistance:Wt&&C.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Wt&&C.extensions.multiDraw===!0||st)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()};return Te.vertexUv1s=c.has(1),Te.vertexUv2s=c.has(2),Te.vertexUv3s=c.has(3),c.clear(),Te}function d(C){const R=[];if(C.shaderID?R.push(C.shaderID):(R.push(C.customVertexShaderID),R.push(C.customFragmentShaderID)),C.defines!==void 0)for(const q in C.defines)R.push(q),R.push(C.defines[q]);return C.isRawShaderMaterial===!1&&(M(R,C),y(R,C),R.push(n.outputColorSpace)),R.push(C.customProgramCacheKey),R.join()}function M(C,R){C.push(R.precision),C.push(R.outputColorSpace),C.push(R.envMapMode),C.push(R.envMapCubeUVHeight),C.push(R.mapUv),C.push(R.alphaMapUv),C.push(R.lightMapUv),C.push(R.aoMapUv),C.push(R.bumpMapUv),C.push(R.normalMapUv),C.push(R.displacementMapUv),C.push(R.emissiveMapUv),C.push(R.metalnessMapUv),C.push(R.roughnessMapUv),C.push(R.anisotropyMapUv),C.push(R.clearcoatMapUv),C.push(R.clearcoatNormalMapUv),C.push(R.clearcoatRoughnessMapUv),C.push(R.iridescenceMapUv),C.push(R.iridescenceThicknessMapUv),C.push(R.sheenColorMapUv),C.push(R.sheenRoughnessMapUv),C.push(R.specularMapUv),C.push(R.specularColorMapUv),C.push(R.specularIntensityMapUv),C.push(R.transmissionMapUv),C.push(R.thicknessMapUv),C.push(R.combine),C.push(R.fogExp2),C.push(R.sizeAttenuation),C.push(R.morphTargetsCount),C.push(R.morphAttributeCount),C.push(R.numDirLights),C.push(R.numPointLights),C.push(R.numSpotLights),C.push(R.numSpotLightMaps),C.push(R.numHemiLights),C.push(R.numRectAreaLights),C.push(R.numDirLightShadows),C.push(R.numPointLightShadows),C.push(R.numSpotLightShadows),C.push(R.numSpotLightShadowsWithMaps),C.push(R.numLightProbes),C.push(R.shadowMapType),C.push(R.toneMapping),C.push(R.numClippingPlanes),C.push(R.numClipIntersection),C.push(R.depthPacking)}function y(C,R){a.disableAll(),R.supportsVertexTextures&&a.enable(0),R.instancing&&a.enable(1),R.instancingColor&&a.enable(2),R.instancingMorph&&a.enable(3),R.matcap&&a.enable(4),R.envMap&&a.enable(5),R.normalMapObjectSpace&&a.enable(6),R.normalMapTangentSpace&&a.enable(7),R.clearcoat&&a.enable(8),R.iridescence&&a.enable(9),R.alphaTest&&a.enable(10),R.vertexColors&&a.enable(11),R.vertexAlphas&&a.enable(12),R.vertexUv1s&&a.enable(13),R.vertexUv2s&&a.enable(14),R.vertexUv3s&&a.enable(15),R.vertexTangents&&a.enable(16),R.anisotropy&&a.enable(17),R.alphaHash&&a.enable(18),R.batching&&a.enable(19),R.dispersion&&a.enable(20),R.batchingColor&&a.enable(21),C.push(a.mask),a.disableAll(),R.fog&&a.enable(0),R.useFog&&a.enable(1),R.flatShading&&a.enable(2),R.logarithmicDepthBuffer&&a.enable(3),R.reverseDepthBuffer&&a.enable(4),R.skinning&&a.enable(5),R.morphTargets&&a.enable(6),R.morphNormals&&a.enable(7),R.morphColors&&a.enable(8),R.premultipliedAlpha&&a.enable(9),R.shadowMapEnabled&&a.enable(10),R.doubleSided&&a.enable(11),R.flipSided&&a.enable(12),R.useDepthPacking&&a.enable(13),R.dithering&&a.enable(14),R.transmission&&a.enable(15),R.sheen&&a.enable(16),R.opaque&&a.enable(17),R.pointsUvs&&a.enable(18),R.decodeVideoTexture&&a.enable(19),R.decodeVideoTextureEmissive&&a.enable(20),R.alphaToCoverage&&a.enable(21),C.push(a.mask)}function x(C){const R=v[C.type];let q;if(R){const I=xn[R];q=k_.clone(I.uniforms)}else q=C.uniforms;return q}function D(C,R){let q;for(let I=0,j=u.length;I<j;I++){const E=u[I];if(E.cacheKey===R){q=E,++q.usedTimes;break}}return q===void 0&&(q=new Ky(n,R,C,s),u.push(q)),q}function N(C){if(--C.usedTimes===0){const R=u.indexOf(C);u[R]=u[u.length-1],u.pop(),C.destroy()}}function L(C){l.remove(C)}function z(){l.dispose()}return{getParameters:g,getProgramCacheKey:d,getUniforms:x,acquireProgram:D,releaseProgram:N,releaseShaderCache:L,programs:u,dispose:z}}function nS(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:r,dispose:s}}function iS(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Yu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function $u(){const n=[];let t=0;const e=[],i=[],r=[];function s(){t=0,e.length=0,i.length=0,r.length=0}function o(h,m,p,v,_,g){let d=n[t];return d===void 0?(d={id:h.id,object:h,geometry:m,material:p,groupOrder:v,renderOrder:h.renderOrder,z:_,group:g},n[t]=d):(d.id=h.id,d.object=h,d.geometry=m,d.material=p,d.groupOrder=v,d.renderOrder=h.renderOrder,d.z=_,d.group=g),t++,d}function a(h,m,p,v,_,g){const d=o(h,m,p,v,_,g);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):e.push(d)}function l(h,m,p,v,_,g){const d=o(h,m,p,v,_,g);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):e.unshift(d)}function c(h,m){e.length>1&&e.sort(h||iS),i.length>1&&i.sort(m||Yu),r.length>1&&r.sort(m||Yu)}function u(){for(let h=t,m=n.length;h<m;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function rS(){let n=new WeakMap;function t(i,r){const s=n.get(i);let o;return s===void 0?(o=new $u,n.set(i,[o])):r>=s.length?(o=new $u,s.push(o)):o=s[r],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function sS(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new ot,color:new Yt};break;case"SpotLight":e={position:new ot,direction:new ot,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new ot,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new ot,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new ot,halfWidth:new ot,halfHeight:new ot};break}return n[t.id]=e,e}}}function oS(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let aS=0;function lS(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function cS(n){const t=new sS,e=oS(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new ot);const r=new ot,s=new he,o=new he;function a(c){let u=0,h=0,m=0;for(let C=0;C<9;C++)i.probe[C].set(0,0,0);let p=0,v=0,_=0,g=0,d=0,M=0,y=0,x=0,D=0,N=0,L=0;c.sort(lS);for(let C=0,R=c.length;C<R;C++){const q=c[C],I=q.color,j=q.intensity,E=q.distance,K=q.shadow&&q.shadow.map?q.shadow.map.texture:null;if(q.isAmbientLight)u+=I.r*j,h+=I.g*j,m+=I.b*j;else if(q.isLightProbe){for(let et=0;et<9;et++)i.probe[et].addScaledVector(q.sh.coefficients[et],j);L++}else if(q.isDirectionalLight){const et=t.get(q);if(et.color.copy(q.color).multiplyScalar(q.intensity),q.castShadow){const $=q.shadow,Y=e.get(q);Y.shadowIntensity=$.intensity,Y.shadowBias=$.bias,Y.shadowNormalBias=$.normalBias,Y.shadowRadius=$.radius,Y.shadowMapSize=$.mapSize,i.directionalShadow[p]=Y,i.directionalShadowMap[p]=K,i.directionalShadowMatrix[p]=q.shadow.matrix,M++}i.directional[p]=et,p++}else if(q.isSpotLight){const et=t.get(q);et.position.setFromMatrixPosition(q.matrixWorld),et.color.copy(I).multiplyScalar(j),et.distance=E,et.coneCos=Math.cos(q.angle),et.penumbraCos=Math.cos(q.angle*(1-q.penumbra)),et.decay=q.decay,i.spot[_]=et;const $=q.shadow;if(q.map&&(i.spotLightMap[D]=q.map,D++,$.updateMatrices(q),q.castShadow&&N++),i.spotLightMatrix[_]=$.matrix,q.castShadow){const Y=e.get(q);Y.shadowIntensity=$.intensity,Y.shadowBias=$.bias,Y.shadowNormalBias=$.normalBias,Y.shadowRadius=$.radius,Y.shadowMapSize=$.mapSize,i.spotShadow[_]=Y,i.spotShadowMap[_]=K,x++}_++}else if(q.isRectAreaLight){const et=t.get(q);et.color.copy(I).multiplyScalar(j),et.halfWidth.set(q.width*.5,0,0),et.halfHeight.set(0,q.height*.5,0),i.rectArea[g]=et,g++}else if(q.isPointLight){const et=t.get(q);if(et.color.copy(q.color).multiplyScalar(q.intensity),et.distance=q.distance,et.decay=q.decay,q.castShadow){const $=q.shadow,Y=e.get(q);Y.shadowIntensity=$.intensity,Y.shadowBias=$.bias,Y.shadowNormalBias=$.normalBias,Y.shadowRadius=$.radius,Y.shadowMapSize=$.mapSize,Y.shadowCameraNear=$.camera.near,Y.shadowCameraFar=$.camera.far,i.pointShadow[v]=Y,i.pointShadowMap[v]=K,i.pointShadowMatrix[v]=q.shadow.matrix,y++}i.point[v]=et,v++}else if(q.isHemisphereLight){const et=t.get(q);et.skyColor.copy(q.color).multiplyScalar(j),et.groundColor.copy(q.groundColor).multiplyScalar(j),i.hemi[d]=et,d++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=At.LTC_FLOAT_1,i.rectAreaLTC2=At.LTC_FLOAT_2):(i.rectAreaLTC1=At.LTC_HALF_1,i.rectAreaLTC2=At.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=m;const z=i.hash;(z.directionalLength!==p||z.pointLength!==v||z.spotLength!==_||z.rectAreaLength!==g||z.hemiLength!==d||z.numDirectionalShadows!==M||z.numPointShadows!==y||z.numSpotShadows!==x||z.numSpotMaps!==D||z.numLightProbes!==L)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=g,i.point.length=v,i.hemi.length=d,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=x+D-N,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=N,i.numLightProbes=L,z.directionalLength=p,z.pointLength=v,z.spotLength=_,z.rectAreaLength=g,z.hemiLength=d,z.numDirectionalShadows=M,z.numPointShadows=y,z.numSpotShadows=x,z.numSpotMaps=D,z.numLightProbes=L,i.version=aS++)}function l(c,u){let h=0,m=0,p=0,v=0,_=0;const g=u.matrixWorldInverse;for(let d=0,M=c.length;d<M;d++){const y=c[d];if(y.isDirectionalLight){const x=i.directional[h];x.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(g),h++}else if(y.isSpotLight){const x=i.spot[p];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(g),p++}else if(y.isRectAreaLight){const x=i.rectArea[v];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),o.identity(),s.copy(y.matrixWorld),s.premultiply(g),o.extractRotation(s),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),v++}else if(y.isPointLight){const x=i.point[m];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),m++}else if(y.isHemisphereLight){const x=i.hemi[_];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(g),_++}}}return{setup:a,setupView:l,state:i}}function Zu(n){const t=new cS(n),e=[],i=[];function r(u){c.camera=u,e.length=0,i.length=0}function s(u){e.push(u)}function o(u){i.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function uS(n){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new Zu(n),t.set(r,[a])):s>=o.length?(a=new Zu(n),o.push(a)):a=o[s],a}function i(){t=new WeakMap}return{get:e,dispose:i}}class hS extends Lr{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=o_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class fS extends Lr{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const dS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function mS(n,t,e){let i=new lc;const r=new xt,s=new xt,o=new pe,a=new hS({depthPacking:a_}),l=new fS,c={},u=e.maxTextureSize,h={[mi]:Ve,[Ve]:mi,[Hn]:Hn},m=new gi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:dS,fragmentShader:pS}),p=m.clone();p.defines.HORIZONTAL_PASS=1;const v=new en;v.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Qe(v,m),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sf;let d=this.type;this.render=function(N,L,z){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||N.length===0)return;const C=n.getRenderTarget(),R=n.getActiveCubeFace(),q=n.getActiveMipmapLevel(),I=n.state;I.setBlending(ui),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const j=d!==Fn&&this.type===Fn,E=d===Fn&&this.type!==Fn;for(let K=0,et=N.length;K<et;K++){const $=N[K],Y=$.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;r.copy(Y.mapSize);const rt=Y.getFrameExtents();if(r.multiply(rt),s.copy(Y.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/rt.x),r.x=s.x*rt.x,Y.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/rt.y),r.y=s.y*rt.y,Y.mapSize.y=s.y)),Y.map===null||j===!0||E===!0){const Q=this.type!==Fn?{minFilter:fn,magFilter:fn}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Fi(r.x,r.y,Q),Y.map.texture.name=$.name+".shadowMap",Y.camera.updateProjectionMatrix()}n.setRenderTarget(Y.map),n.clear();const ft=Y.getViewportCount();for(let Q=0;Q<ft;Q++){const nt=Y.getViewport(Q);o.set(s.x*nt.x,s.y*nt.y,s.x*nt.z,s.y*nt.w),I.viewport(o),Y.updateMatrices($,Q),i=Y.getFrustum(),x(L,z,Y.camera,$,this.type)}Y.isPointLightShadow!==!0&&this.type===Fn&&M(Y,z),Y.needsUpdate=!1}d=this.type,g.needsUpdate=!1,n.setRenderTarget(C,R,q)};function M(N,L){const z=t.update(_);m.defines.VSM_SAMPLES!==N.blurSamples&&(m.defines.VSM_SAMPLES=N.blurSamples,p.defines.VSM_SAMPLES=N.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new Fi(r.x,r.y)),m.uniforms.shadow_pass.value=N.map.texture,m.uniforms.resolution.value=N.mapSize,m.uniforms.radius.value=N.radius,n.setRenderTarget(N.mapPass),n.clear(),n.renderBufferDirect(L,null,z,m,_,null),p.uniforms.shadow_pass.value=N.mapPass.texture,p.uniforms.resolution.value=N.mapSize,p.uniforms.radius.value=N.radius,n.setRenderTarget(N.map),n.clear(),n.renderBufferDirect(L,null,z,p,_,null)}function y(N,L,z,C){let R=null;const q=z.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(q!==void 0)R=q;else if(R=z.isPointLight===!0?l:a,n.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const I=R.uuid,j=L.uuid;let E=c[I];E===void 0&&(E={},c[I]=E);let K=E[j];K===void 0&&(K=R.clone(),E[j]=K,L.addEventListener("dispose",D)),R=K}if(R.visible=L.visible,R.wireframe=L.wireframe,C===Fn?R.side=L.shadowSide!==null?L.shadowSide:L.side:R.side=L.shadowSide!==null?L.shadowSide:h[L.side],R.alphaMap=L.alphaMap,R.alphaTest=L.alphaTest,R.map=L.map,R.clipShadows=L.clipShadows,R.clippingPlanes=L.clippingPlanes,R.clipIntersection=L.clipIntersection,R.displacementMap=L.displacementMap,R.displacementScale=L.displacementScale,R.displacementBias=L.displacementBias,R.wireframeLinewidth=L.wireframeLinewidth,R.linewidth=L.linewidth,z.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const I=n.properties.get(R);I.light=z}return R}function x(N,L,z,C,R){if(N.visible===!1)return;if(N.layers.test(L.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&R===Fn)&&(!N.frustumCulled||i.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,N.matrixWorld);const j=t.update(N),E=N.material;if(Array.isArray(E)){const K=j.groups;for(let et=0,$=K.length;et<$;et++){const Y=K[et],rt=E[Y.materialIndex];if(rt&&rt.visible){const ft=y(N,rt,C,R);N.onBeforeShadow(n,N,L,z,j,ft,Y),n.renderBufferDirect(z,null,j,ft,N,Y),N.onAfterShadow(n,N,L,z,j,ft,Y)}}}else if(E.visible){const K=y(N,E,C,R);N.onBeforeShadow(n,N,L,z,j,K,null),n.renderBufferDirect(z,null,j,K,N,null),N.onAfterShadow(n,N,L,z,j,K,null)}}const I=N.children;for(let j=0,E=I.length;j<E;j++)x(I[j],L,z,C,R)}function D(N){N.target.removeEventListener("dispose",D);for(const z in c){const C=c[z],R=N.target.uuid;R in C&&(C[R].dispose(),delete C[R])}}}const gS={[ja]:qa,[Ya]:Ka,[$a]:Ja,[Mr]:Za,[qa]:ja,[Ka]:Ya,[Ja]:$a,[Za]:Mr};function _S(n,t){function e(){let at=!1;const Ct=new pe;let mt=null;const yt=new pe(0,0,0,0);return{setMask:function(Rt){mt!==Rt&&!at&&(n.colorMask(Rt,Rt,Rt,Rt),mt=Rt)},setLocked:function(Rt){at=Rt},setClear:function(Rt,Pt,Wt,de,Te){Te===!0&&(Rt*=de,Pt*=de,Wt*=de),Ct.set(Rt,Pt,Wt,de),yt.equals(Ct)===!1&&(n.clearColor(Rt,Pt,Wt,de),yt.copy(Ct))},reset:function(){at=!1,mt=null,yt.set(-1,0,0,0)}}}function i(){let at=!1,Ct=!1,mt=null,yt=null,Rt=null;return{setReversed:function(Pt){if(Ct!==Pt){const Wt=t.get("EXT_clip_control");Ct?Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.ZERO_TO_ONE_EXT):Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.NEGATIVE_ONE_TO_ONE_EXT);const de=Rt;Rt=null,this.setClear(de)}Ct=Pt},getReversed:function(){return Ct},setTest:function(Pt){Pt?O(n.DEPTH_TEST):it(n.DEPTH_TEST)},setMask:function(Pt){mt!==Pt&&!at&&(n.depthMask(Pt),mt=Pt)},setFunc:function(Pt){if(Ct&&(Pt=gS[Pt]),yt!==Pt){switch(Pt){case ja:n.depthFunc(n.NEVER);break;case qa:n.depthFunc(n.ALWAYS);break;case Ya:n.depthFunc(n.LESS);break;case Mr:n.depthFunc(n.LEQUAL);break;case $a:n.depthFunc(n.EQUAL);break;case Za:n.depthFunc(n.GEQUAL);break;case Ka:n.depthFunc(n.GREATER);break;case Ja:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}yt=Pt}},setLocked:function(Pt){at=Pt},setClear:function(Pt){Rt!==Pt&&(Ct&&(Pt=1-Pt),n.clearDepth(Pt),Rt=Pt)},reset:function(){at=!1,mt=null,yt=null,Rt=null,Ct=!1}}}function r(){let at=!1,Ct=null,mt=null,yt=null,Rt=null,Pt=null,Wt=null,de=null,Te=null;return{setTest:function(ne){at||(ne?O(n.STENCIL_TEST):it(n.STENCIL_TEST))},setMask:function(ne){Ct!==ne&&!at&&(n.stencilMask(ne),Ct=ne)},setFunc:function(ne,nn,Cn){(mt!==ne||yt!==nn||Rt!==Cn)&&(n.stencilFunc(ne,nn,Cn),mt=ne,yt=nn,Rt=Cn)},setOp:function(ne,nn,Cn){(Pt!==ne||Wt!==nn||de!==Cn)&&(n.stencilOp(ne,nn,Cn),Pt=ne,Wt=nn,de=Cn)},setLocked:function(ne){at=ne},setClear:function(ne){Te!==ne&&(n.clearStencil(ne),Te=ne)},reset:function(){at=!1,Ct=null,mt=null,yt=null,Rt=null,Pt=null,Wt=null,de=null,Te=null}}}const s=new e,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},m=new WeakMap,p=[],v=null,_=!1,g=null,d=null,M=null,y=null,x=null,D=null,N=null,L=new Yt(0,0,0),z=0,C=!1,R=null,q=null,I=null,j=null,E=null;const K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let et=!1,$=0;const Y=n.getParameter(n.VERSION);Y.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(Y)[1]),et=$>=1):Y.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),et=$>=2);let rt=null,ft={};const Q=n.getParameter(n.SCISSOR_BOX),nt=n.getParameter(n.VIEWPORT),bt=new pe().fromArray(Q),W=new pe().fromArray(nt);function B(at,Ct,mt,yt){const Rt=new Uint8Array(4),Pt=n.createTexture();n.bindTexture(at,Pt),n.texParameteri(at,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(at,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Wt=0;Wt<mt;Wt++)at===n.TEXTURE_3D||at===n.TEXTURE_2D_ARRAY?n.texImage3D(Ct,0,n.RGBA,1,1,yt,0,n.RGBA,n.UNSIGNED_BYTE,Rt):n.texImage2D(Ct+Wt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Rt);return Pt}const V={};V[n.TEXTURE_2D]=B(n.TEXTURE_2D,n.TEXTURE_2D,1),V[n.TEXTURE_CUBE_MAP]=B(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[n.TEXTURE_2D_ARRAY]=B(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),V[n.TEXTURE_3D]=B(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),O(n.DEPTH_TEST),o.setFunc(Mr),U(!1),A(tu),O(n.CULL_FACE),f(ui);function O(at){u[at]!==!0&&(n.enable(at),u[at]=!0)}function it(at){u[at]!==!1&&(n.disable(at),u[at]=!1)}function ut(at,Ct){return h[at]!==Ct?(n.bindFramebuffer(at,Ct),h[at]=Ct,at===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Ct),at===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Ct),!0):!1}function st(at,Ct){let mt=p,yt=!1;if(at){mt=m.get(Ct),mt===void 0&&(mt=[],m.set(Ct,mt));const Rt=at.textures;if(mt.length!==Rt.length||mt[0]!==n.COLOR_ATTACHMENT0){for(let Pt=0,Wt=Rt.length;Pt<Wt;Pt++)mt[Pt]=n.COLOR_ATTACHMENT0+Pt;mt.length=Rt.length,yt=!0}}else mt[0]!==n.BACK&&(mt[0]=n.BACK,yt=!0);yt&&n.drawBuffers(mt)}function gt(at){return v!==at?(n.useProgram(at),v=at,!0):!1}const P={[Ri]:n.FUNC_ADD,[Ig]:n.FUNC_SUBTRACT,[Ug]:n.FUNC_REVERSE_SUBTRACT};P[Ng]=n.MIN,P[Og]=n.MAX;const k={[Fg]:n.ZERO,[kg]:n.ONE,[Bg]:n.SRC_COLOR,[Wa]:n.SRC_ALPHA,[Xg]:n.SRC_ALPHA_SATURATE,[Gg]:n.DST_COLOR,[Hg]:n.DST_ALPHA,[zg]:n.ONE_MINUS_SRC_COLOR,[Xa]:n.ONE_MINUS_SRC_ALPHA,[Wg]:n.ONE_MINUS_DST_COLOR,[Vg]:n.ONE_MINUS_DST_ALPHA,[jg]:n.CONSTANT_COLOR,[qg]:n.ONE_MINUS_CONSTANT_COLOR,[Yg]:n.CONSTANT_ALPHA,[$g]:n.ONE_MINUS_CONSTANT_ALPHA};function f(at,Ct,mt,yt,Rt,Pt,Wt,de,Te,ne){if(at===ui){_===!0&&(it(n.BLEND),_=!1);return}if(_===!1&&(O(n.BLEND),_=!0),at!==Dg){if(at!==g||ne!==C){if((d!==Ri||x!==Ri)&&(n.blendEquation(n.FUNC_ADD),d=Ri,x=Ri),ne)switch(at){case _r:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case eu:n.blendFunc(n.ONE,n.ONE);break;case nu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case iu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",at);break}else switch(at){case _r:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case eu:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case nu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case iu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",at);break}M=null,y=null,D=null,N=null,L.set(0,0,0),z=0,g=at,C=ne}return}Rt=Rt||Ct,Pt=Pt||mt,Wt=Wt||yt,(Ct!==d||Rt!==x)&&(n.blendEquationSeparate(P[Ct],P[Rt]),d=Ct,x=Rt),(mt!==M||yt!==y||Pt!==D||Wt!==N)&&(n.blendFuncSeparate(k[mt],k[yt],k[Pt],k[Wt]),M=mt,y=yt,D=Pt,N=Wt),(de.equals(L)===!1||Te!==z)&&(n.blendColor(de.r,de.g,de.b,Te),L.copy(de),z=Te),g=at,C=!1}function F(at,Ct){at.side===Hn?it(n.CULL_FACE):O(n.CULL_FACE);let mt=at.side===Ve;Ct&&(mt=!mt),U(mt),at.blending===_r&&at.transparent===!1?f(ui):f(at.blending,at.blendEquation,at.blendSrc,at.blendDst,at.blendEquationAlpha,at.blendSrcAlpha,at.blendDstAlpha,at.blendColor,at.blendAlpha,at.premultipliedAlpha),o.setFunc(at.depthFunc),o.setTest(at.depthTest),o.setMask(at.depthWrite),s.setMask(at.colorWrite);const yt=at.stencilWrite;a.setTest(yt),yt&&(a.setMask(at.stencilWriteMask),a.setFunc(at.stencilFunc,at.stencilRef,at.stencilFuncMask),a.setOp(at.stencilFail,at.stencilZFail,at.stencilZPass)),T(at.polygonOffset,at.polygonOffsetFactor,at.polygonOffsetUnits),at.alphaToCoverage===!0?O(n.SAMPLE_ALPHA_TO_COVERAGE):it(n.SAMPLE_ALPHA_TO_COVERAGE)}function U(at){R!==at&&(at?n.frontFace(n.CW):n.frontFace(n.CCW),R=at)}function A(at){at!==Rg?(O(n.CULL_FACE),at!==q&&(at===tu?n.cullFace(n.BACK):at===Pg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):it(n.CULL_FACE),q=at}function S(at){at!==I&&(et&&n.lineWidth(at),I=at)}function T(at,Ct,mt){at?(O(n.POLYGON_OFFSET_FILL),(j!==Ct||E!==mt)&&(n.polygonOffset(Ct,mt),j=Ct,E=mt)):it(n.POLYGON_OFFSET_FILL)}function X(at){at?O(n.SCISSOR_TEST):it(n.SCISSOR_TEST)}function w(at){at===void 0&&(at=n.TEXTURE0+K-1),rt!==at&&(n.activeTexture(at),rt=at)}function b(at,Ct,mt){mt===void 0&&(rt===null?mt=n.TEXTURE0+K-1:mt=rt);let yt=ft[mt];yt===void 0&&(yt={type:void 0,texture:void 0},ft[mt]=yt),(yt.type!==at||yt.texture!==Ct)&&(rt!==mt&&(n.activeTexture(mt),rt=mt),n.bindTexture(at,Ct||V[at]),yt.type=at,yt.texture=Ct)}function H(){const at=ft[rt];at!==void 0&&at.type!==void 0&&(n.bindTexture(at.type,null),at.type=void 0,at.texture=void 0)}function Z(){try{n.compressedTexImage2D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function J(){try{n.compressedTexImage3D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function tt(){try{n.texSubImage2D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function _t(){try{n.texSubImage3D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function ht(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function St(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function It(){try{n.texStorage2D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function vt(){try{n.texStorage3D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function Et(){try{n.texImage2D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function wt(){try{n.texImage3D.apply(n,arguments)}catch(at){console.error("THREE.WebGLState:",at)}}function kt(at){bt.equals(at)===!1&&(n.scissor(at.x,at.y,at.z,at.w),bt.copy(at))}function Tt(at){W.equals(at)===!1&&(n.viewport(at.x,at.y,at.z,at.w),W.copy(at))}function Bt(at,Ct){let mt=c.get(Ct);mt===void 0&&(mt=new WeakMap,c.set(Ct,mt));let yt=mt.get(at);yt===void 0&&(yt=n.getUniformBlockIndex(Ct,at.name),mt.set(at,yt))}function Ht(at,Ct){const yt=c.get(Ct).get(at);l.get(Ct)!==yt&&(n.uniformBlockBinding(Ct,yt,at.__bindingPointIndex),l.set(Ct,yt))}function Kt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},rt=null,ft={},h={},m=new WeakMap,p=[],v=null,_=!1,g=null,d=null,M=null,y=null,x=null,D=null,N=null,L=new Yt(0,0,0),z=0,C=!1,R=null,q=null,I=null,j=null,E=null,bt.set(0,0,n.canvas.width,n.canvas.height),W.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:O,disable:it,bindFramebuffer:ut,drawBuffers:st,useProgram:gt,setBlending:f,setMaterial:F,setFlipSided:U,setCullFace:A,setLineWidth:S,setPolygonOffset:T,setScissorTest:X,activeTexture:w,bindTexture:b,unbindTexture:H,compressedTexImage2D:Z,compressedTexImage3D:J,texImage2D:Et,texImage3D:wt,updateUBOMapping:Bt,uniformBlockBinding:Ht,texStorage2D:It,texStorage3D:vt,texSubImage2D:tt,texSubImage3D:_t,compressedTexSubImage2D:ht,compressedTexSubImage3D:St,scissor:kt,viewport:Tt,reset:Kt}}function Ku(n,t,e,i){const r=vS(i);switch(e){case Af:return n*t;case Rf:return n*t;case Pf:return n*t*2;case Lf:return n*t/r.components*r.byteLength;case rc:return n*t/r.components*r.byteLength;case Df:return n*t*2/r.components*r.byteLength;case sc:return n*t*2/r.components*r.byteLength;case Cf:return n*t*3/r.components*r.byteLength;case un:return n*t*4/r.components*r.byteLength;case oc:return n*t*4/r.components*r.byteLength;case to:case eo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case no:case io:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case rl:case ol:return Math.max(n,16)*Math.max(t,8)/4;case il:case sl:return Math.max(n,8)*Math.max(t,8)/2;case al:case ll:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case cl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ul:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case fl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case dl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case pl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case ml:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case gl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case _l:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case vl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case xl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case yl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Sl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case bl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ml:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case ro:case El:case Tl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case If:case wl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Al:case Cl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function vS(n){switch(n){case Yn:case Ef:return{byteLength:1,components:1};case os:case Tf:case ps:return{byteLength:2,components:1};case nc:case ic:return{byteLength:2,components:4};case Oi:case ec:case Vn:return{byteLength:4,components:1};case wf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function xS(n,t,e,i,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xt,u=new WeakMap;let h;const m=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,b){return p?new OffscreenCanvas(w,b):go("canvas")}function _(w,b,H){let Z=1;const J=X(w);if((J.width>H||J.height>H)&&(Z=H/Math.max(J.width,J.height)),Z<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const tt=Math.floor(Z*J.width),_t=Math.floor(Z*J.height);h===void 0&&(h=v(tt,_t));const ht=b?v(tt,_t):h;return ht.width=tt,ht.height=_t,ht.getContext("2d").drawImage(w,0,0,tt,_t),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+tt+"x"+_t+")."),ht}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),w;return w}function g(w){return w.generateMipmaps}function d(w){n.generateMipmap(w)}function M(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(w,b,H,Z,J=!1){if(w!==null){if(n[w]!==void 0)return n[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let tt=b;if(b===n.RED&&(H===n.FLOAT&&(tt=n.R32F),H===n.HALF_FLOAT&&(tt=n.R16F),H===n.UNSIGNED_BYTE&&(tt=n.R8)),b===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(tt=n.R8UI),H===n.UNSIGNED_SHORT&&(tt=n.R16UI),H===n.UNSIGNED_INT&&(tt=n.R32UI),H===n.BYTE&&(tt=n.R8I),H===n.SHORT&&(tt=n.R16I),H===n.INT&&(tt=n.R32I)),b===n.RG&&(H===n.FLOAT&&(tt=n.RG32F),H===n.HALF_FLOAT&&(tt=n.RG16F),H===n.UNSIGNED_BYTE&&(tt=n.RG8)),b===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(tt=n.RG8UI),H===n.UNSIGNED_SHORT&&(tt=n.RG16UI),H===n.UNSIGNED_INT&&(tt=n.RG32UI),H===n.BYTE&&(tt=n.RG8I),H===n.SHORT&&(tt=n.RG16I),H===n.INT&&(tt=n.RG32I)),b===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(tt=n.RGB8UI),H===n.UNSIGNED_SHORT&&(tt=n.RGB16UI),H===n.UNSIGNED_INT&&(tt=n.RGB32UI),H===n.BYTE&&(tt=n.RGB8I),H===n.SHORT&&(tt=n.RGB16I),H===n.INT&&(tt=n.RGB32I)),b===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(tt=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(tt=n.RGBA16UI),H===n.UNSIGNED_INT&&(tt=n.RGBA32UI),H===n.BYTE&&(tt=n.RGBA8I),H===n.SHORT&&(tt=n.RGBA16I),H===n.INT&&(tt=n.RGBA32I)),b===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(tt=n.RGB9_E5),b===n.RGBA){const _t=J?Lo:$t.getTransfer(Z);H===n.FLOAT&&(tt=n.RGBA32F),H===n.HALF_FLOAT&&(tt=n.RGBA16F),H===n.UNSIGNED_BYTE&&(tt=_t===ie?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(tt=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(tt=n.RGB5_A1)}return(tt===n.R16F||tt===n.R32F||tt===n.RG16F||tt===n.RG32F||tt===n.RGBA16F||tt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function x(w,b){let H;return w?b===null||b===Oi||b===wr?H=n.DEPTH24_STENCIL8:b===Vn?H=n.DEPTH32F_STENCIL8:b===os&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Oi||b===wr?H=n.DEPTH_COMPONENT24:b===Vn?H=n.DEPTH_COMPONENT32F:b===os&&(H=n.DEPTH_COMPONENT16),H}function D(w,b){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==fn&&w.minFilter!==Sn?Math.log2(Math.max(b.width,b.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?b.mipmaps.length:1}function N(w){const b=w.target;b.removeEventListener("dispose",N),z(b),b.isVideoTexture&&u.delete(b)}function L(w){const b=w.target;b.removeEventListener("dispose",L),R(b)}function z(w){const b=i.get(w);if(b.__webglInit===void 0)return;const H=w.source,Z=m.get(H);if(Z){const J=Z[b.__cacheKey];J.usedTimes--,J.usedTimes===0&&C(w),Object.keys(Z).length===0&&m.delete(H)}i.remove(w)}function C(w){const b=i.get(w);n.deleteTexture(b.__webglTexture);const H=w.source,Z=m.get(H);delete Z[b.__cacheKey],o.memory.textures--}function R(w){const b=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(b.__webglFramebuffer[Z]))for(let J=0;J<b.__webglFramebuffer[Z].length;J++)n.deleteFramebuffer(b.__webglFramebuffer[Z][J]);else n.deleteFramebuffer(b.__webglFramebuffer[Z]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[Z])}else{if(Array.isArray(b.__webglFramebuffer))for(let Z=0;Z<b.__webglFramebuffer.length;Z++)n.deleteFramebuffer(b.__webglFramebuffer[Z]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Z=0;Z<b.__webglColorRenderbuffer.length;Z++)b.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[Z]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const H=w.textures;for(let Z=0,J=H.length;Z<J;Z++){const tt=i.get(H[Z]);tt.__webglTexture&&(n.deleteTexture(tt.__webglTexture),o.memory.textures--),i.remove(H[Z])}i.remove(w)}let q=0;function I(){q=0}function j(){const w=q;return w>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),q+=1,w}function E(w){const b=[];return b.push(w.wrapS),b.push(w.wrapT),b.push(w.wrapR||0),b.push(w.magFilter),b.push(w.minFilter),b.push(w.anisotropy),b.push(w.internalFormat),b.push(w.format),b.push(w.type),b.push(w.generateMipmaps),b.push(w.premultiplyAlpha),b.push(w.flipY),b.push(w.unpackAlignment),b.push(w.colorSpace),b.join()}function K(w,b){const H=i.get(w);if(w.isVideoTexture&&S(w),w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){const Z=w.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(H,w,b);return}}e.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+b)}function et(w,b){const H=i.get(w);if(w.version>0&&H.__version!==w.version){W(H,w,b);return}e.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+b)}function $(w,b){const H=i.get(w);if(w.version>0&&H.__version!==w.version){W(H,w,b);return}e.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+b)}function Y(w,b){const H=i.get(w);if(w.version>0&&H.__version!==w.version){B(H,w,b);return}e.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+b)}const rt={[el]:n.REPEAT,[Li]:n.CLAMP_TO_EDGE,[nl]:n.MIRRORED_REPEAT},ft={[fn]:n.NEAREST,[s_]:n.NEAREST_MIPMAP_NEAREST,[bs]:n.NEAREST_MIPMAP_LINEAR,[Sn]:n.LINEAR,[$o]:n.LINEAR_MIPMAP_NEAREST,[Di]:n.LINEAR_MIPMAP_LINEAR},Q={[c_]:n.NEVER,[m_]:n.ALWAYS,[u_]:n.LESS,[Nf]:n.LEQUAL,[h_]:n.EQUAL,[p_]:n.GEQUAL,[f_]:n.GREATER,[d_]:n.NOTEQUAL};function nt(w,b){if(b.type===Vn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Sn||b.magFilter===$o||b.magFilter===bs||b.magFilter===Di||b.minFilter===Sn||b.minFilter===$o||b.minFilter===bs||b.minFilter===Di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,rt[b.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,rt[b.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,rt[b.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,ft[b.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,ft[b.minFilter]),b.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,Q[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===fn||b.minFilter!==bs&&b.minFilter!==Di||b.type===Vn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");n.texParameterf(w,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function bt(w,b){let H=!1;w.__webglInit===void 0&&(w.__webglInit=!0,b.addEventListener("dispose",N));const Z=b.source;let J=m.get(Z);J===void 0&&(J={},m.set(Z,J));const tt=E(b);if(tt!==w.__cacheKey){J[tt]===void 0&&(J[tt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),J[tt].usedTimes++;const _t=J[w.__cacheKey];_t!==void 0&&(J[w.__cacheKey].usedTimes--,_t.usedTimes===0&&C(b)),w.__cacheKey=tt,w.__webglTexture=J[tt].texture}return H}function W(w,b,H){let Z=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Z=n.TEXTURE_3D);const J=bt(w,b),tt=b.source;e.bindTexture(Z,w.__webglTexture,n.TEXTURE0+H);const _t=i.get(tt);if(tt.version!==_t.__version||J===!0){e.activeTexture(n.TEXTURE0+H);const ht=$t.getPrimaries($t.workingColorSpace),St=b.colorSpace===li?null:$t.getPrimaries(b.colorSpace),It=b.colorSpace===li||ht===St?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let vt=_(b.image,!1,r.maxTextureSize);vt=T(b,vt);const Et=s.convert(b.format,b.colorSpace),wt=s.convert(b.type);let kt=y(b.internalFormat,Et,wt,b.colorSpace,b.isVideoTexture);nt(Z,b);let Tt;const Bt=b.mipmaps,Ht=b.isVideoTexture!==!0,Kt=_t.__version===void 0||J===!0,at=tt.dataReady,Ct=D(b,vt);if(b.isDepthTexture)kt=x(b.format===Ar,b.type),Kt&&(Ht?e.texStorage2D(n.TEXTURE_2D,1,kt,vt.width,vt.height):e.texImage2D(n.TEXTURE_2D,0,kt,vt.width,vt.height,0,Et,wt,null));else if(b.isDataTexture)if(Bt.length>0){Ht&&Kt&&e.texStorage2D(n.TEXTURE_2D,Ct,kt,Bt[0].width,Bt[0].height);for(let mt=0,yt=Bt.length;mt<yt;mt++)Tt=Bt[mt],Ht?at&&e.texSubImage2D(n.TEXTURE_2D,mt,0,0,Tt.width,Tt.height,Et,wt,Tt.data):e.texImage2D(n.TEXTURE_2D,mt,kt,Tt.width,Tt.height,0,Et,wt,Tt.data);b.generateMipmaps=!1}else Ht?(Kt&&e.texStorage2D(n.TEXTURE_2D,Ct,kt,vt.width,vt.height),at&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,vt.width,vt.height,Et,wt,vt.data)):e.texImage2D(n.TEXTURE_2D,0,kt,vt.width,vt.height,0,Et,wt,vt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Ht&&Kt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ct,kt,Bt[0].width,Bt[0].height,vt.depth);for(let mt=0,yt=Bt.length;mt<yt;mt++)if(Tt=Bt[mt],b.format!==un)if(Et!==null)if(Ht){if(at)if(b.layerUpdates.size>0){const Rt=Ku(Tt.width,Tt.height,b.format,b.type);for(const Pt of b.layerUpdates){const Wt=Tt.data.subarray(Pt*Rt/Tt.data.BYTES_PER_ELEMENT,(Pt+1)*Rt/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,mt,0,0,Pt,Tt.width,Tt.height,1,Et,Wt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,mt,0,0,0,Tt.width,Tt.height,vt.depth,Et,Tt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,mt,kt,Tt.width,Tt.height,vt.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?at&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,mt,0,0,0,Tt.width,Tt.height,vt.depth,Et,wt,Tt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,mt,kt,Tt.width,Tt.height,vt.depth,0,Et,wt,Tt.data)}else{Ht&&Kt&&e.texStorage2D(n.TEXTURE_2D,Ct,kt,Bt[0].width,Bt[0].height);for(let mt=0,yt=Bt.length;mt<yt;mt++)Tt=Bt[mt],b.format!==un?Et!==null?Ht?at&&e.compressedTexSubImage2D(n.TEXTURE_2D,mt,0,0,Tt.width,Tt.height,Et,Tt.data):e.compressedTexImage2D(n.TEXTURE_2D,mt,kt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?at&&e.texSubImage2D(n.TEXTURE_2D,mt,0,0,Tt.width,Tt.height,Et,wt,Tt.data):e.texImage2D(n.TEXTURE_2D,mt,kt,Tt.width,Tt.height,0,Et,wt,Tt.data)}else if(b.isDataArrayTexture)if(Ht){if(Kt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ct,kt,vt.width,vt.height,vt.depth),at)if(b.layerUpdates.size>0){const mt=Ku(vt.width,vt.height,b.format,b.type);for(const yt of b.layerUpdates){const Rt=vt.data.subarray(yt*mt/vt.data.BYTES_PER_ELEMENT,(yt+1)*mt/vt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,yt,vt.width,vt.height,1,Et,wt,Rt)}b.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,vt.width,vt.height,vt.depth,Et,wt,vt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,kt,vt.width,vt.height,vt.depth,0,Et,wt,vt.data);else if(b.isData3DTexture)Ht?(Kt&&e.texStorage3D(n.TEXTURE_3D,Ct,kt,vt.width,vt.height,vt.depth),at&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,vt.width,vt.height,vt.depth,Et,wt,vt.data)):e.texImage3D(n.TEXTURE_3D,0,kt,vt.width,vt.height,vt.depth,0,Et,wt,vt.data);else if(b.isFramebufferTexture){if(Kt)if(Ht)e.texStorage2D(n.TEXTURE_2D,Ct,kt,vt.width,vt.height);else{let mt=vt.width,yt=vt.height;for(let Rt=0;Rt<Ct;Rt++)e.texImage2D(n.TEXTURE_2D,Rt,kt,mt,yt,0,Et,wt,null),mt>>=1,yt>>=1}}else if(Bt.length>0){if(Ht&&Kt){const mt=X(Bt[0]);e.texStorage2D(n.TEXTURE_2D,Ct,kt,mt.width,mt.height)}for(let mt=0,yt=Bt.length;mt<yt;mt++)Tt=Bt[mt],Ht?at&&e.texSubImage2D(n.TEXTURE_2D,mt,0,0,Et,wt,Tt):e.texImage2D(n.TEXTURE_2D,mt,kt,Et,wt,Tt);b.generateMipmaps=!1}else if(Ht){if(Kt){const mt=X(vt);e.texStorage2D(n.TEXTURE_2D,Ct,kt,mt.width,mt.height)}at&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Et,wt,vt)}else e.texImage2D(n.TEXTURE_2D,0,kt,Et,wt,vt);g(b)&&d(Z),_t.__version=tt.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function B(w,b,H){if(b.image.length!==6)return;const Z=bt(w,b),J=b.source;e.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+H);const tt=i.get(J);if(J.version!==tt.__version||Z===!0){e.activeTexture(n.TEXTURE0+H);const _t=$t.getPrimaries($t.workingColorSpace),ht=b.colorSpace===li?null:$t.getPrimaries(b.colorSpace),St=b.colorSpace===li||_t===ht?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);const It=b.isCompressedTexture||b.image[0].isCompressedTexture,vt=b.image[0]&&b.image[0].isDataTexture,Et=[];for(let yt=0;yt<6;yt++)!It&&!vt?Et[yt]=_(b.image[yt],!0,r.maxCubemapSize):Et[yt]=vt?b.image[yt].image:b.image[yt],Et[yt]=T(b,Et[yt]);const wt=Et[0],kt=s.convert(b.format,b.colorSpace),Tt=s.convert(b.type),Bt=y(b.internalFormat,kt,Tt,b.colorSpace),Ht=b.isVideoTexture!==!0,Kt=tt.__version===void 0||Z===!0,at=J.dataReady;let Ct=D(b,wt);nt(n.TEXTURE_CUBE_MAP,b);let mt;if(It){Ht&&Kt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Ct,Bt,wt.width,wt.height);for(let yt=0;yt<6;yt++){mt=Et[yt].mipmaps;for(let Rt=0;Rt<mt.length;Rt++){const Pt=mt[Rt];b.format!==un?kt!==null?Ht?at&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt,0,0,Pt.width,Pt.height,kt,Pt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt,Bt,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?at&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt,0,0,Pt.width,Pt.height,kt,Tt,Pt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt,Bt,Pt.width,Pt.height,0,kt,Tt,Pt.data)}}}else{if(mt=b.mipmaps,Ht&&Kt){mt.length>0&&Ct++;const yt=X(Et[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Ct,Bt,yt.width,yt.height)}for(let yt=0;yt<6;yt++)if(vt){Ht?at&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,Et[yt].width,Et[yt].height,kt,Tt,Et[yt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,Bt,Et[yt].width,Et[yt].height,0,kt,Tt,Et[yt].data);for(let Rt=0;Rt<mt.length;Rt++){const Wt=mt[Rt].image[yt].image;Ht?at&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt+1,0,0,Wt.width,Wt.height,kt,Tt,Wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt+1,Bt,Wt.width,Wt.height,0,kt,Tt,Wt.data)}}else{Ht?at&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,kt,Tt,Et[yt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,Bt,kt,Tt,Et[yt]);for(let Rt=0;Rt<mt.length;Rt++){const Pt=mt[Rt];Ht?at&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt+1,0,0,kt,Tt,Pt.image[yt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Rt+1,Bt,kt,Tt,Pt.image[yt])}}}g(b)&&d(n.TEXTURE_CUBE_MAP),tt.__version=J.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function V(w,b,H,Z,J,tt){const _t=s.convert(H.format,H.colorSpace),ht=s.convert(H.type),St=y(H.internalFormat,_t,ht,H.colorSpace),It=i.get(b),vt=i.get(H);if(vt.__renderTarget=b,!It.__hasExternalTextures){const Et=Math.max(1,b.width>>tt),wt=Math.max(1,b.height>>tt);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?e.texImage3D(J,tt,St,Et,wt,b.depth,0,_t,ht,null):e.texImage2D(J,tt,St,Et,wt,0,_t,ht,null)}e.bindFramebuffer(n.FRAMEBUFFER,w),A(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,J,vt.__webglTexture,0,U(b)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,J,vt.__webglTexture,tt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function O(w,b,H){if(n.bindRenderbuffer(n.RENDERBUFFER,w),b.depthBuffer){const Z=b.depthTexture,J=Z&&Z.isDepthTexture?Z.type:null,tt=x(b.stencilBuffer,J),_t=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ht=U(b);A(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ht,tt,b.width,b.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,ht,tt,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,tt,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,_t,n.RENDERBUFFER,w)}else{const Z=b.textures;for(let J=0;J<Z.length;J++){const tt=Z[J],_t=s.convert(tt.format,tt.colorSpace),ht=s.convert(tt.type),St=y(tt.internalFormat,_t,ht,tt.colorSpace),It=U(b);H&&A(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,It,St,b.width,b.height):A(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,It,St,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,St,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function it(w,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,w),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=i.get(b.depthTexture);Z.__renderTarget=b,(!Z.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),K(b.depthTexture,0);const J=Z.__webglTexture,tt=U(b);if(b.depthTexture.format===vr)A(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,tt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(b.depthTexture.format===Ar)A(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,tt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function ut(w){const b=i.get(w),H=w.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==w.depthTexture){const Z=w.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Z){const J=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Z.removeEventListener("dispose",J)};Z.addEventListener("dispose",J),b.__depthDisposeCallback=J}b.__boundDepthTexture=Z}if(w.depthTexture&&!b.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");it(b.__webglFramebuffer,w)}else if(H){b.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[Z]),b.__webglDepthbuffer[Z]===void 0)b.__webglDepthbuffer[Z]=n.createRenderbuffer(),O(b.__webglDepthbuffer[Z],w,!1);else{const J=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=b.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,tt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),O(b.__webglDepthbuffer,w,!1);else{const Z=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,J),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,J)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function st(w,b,H){const Z=i.get(w);b!==void 0&&V(Z.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&ut(w)}function gt(w){const b=w.texture,H=i.get(w),Z=i.get(b);w.addEventListener("dispose",L);const J=w.textures,tt=w.isWebGLCubeRenderTarget===!0,_t=J.length>1;if(_t||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=b.version,o.memory.textures++),tt){H.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer[ht]=[];for(let St=0;St<b.mipmaps.length;St++)H.__webglFramebuffer[ht][St]=n.createFramebuffer()}else H.__webglFramebuffer[ht]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer=[];for(let ht=0;ht<b.mipmaps.length;ht++)H.__webglFramebuffer[ht]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(_t)for(let ht=0,St=J.length;ht<St;ht++){const It=i.get(J[ht]);It.__webglTexture===void 0&&(It.__webglTexture=n.createTexture(),o.memory.textures++)}if(w.samples>0&&A(w)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ht=0;ht<J.length;ht++){const St=J[ht];H.__webglColorRenderbuffer[ht]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[ht]);const It=s.convert(St.format,St.colorSpace),vt=s.convert(St.type),Et=y(St.internalFormat,It,vt,St.colorSpace,w.isXRRenderTarget===!0),wt=U(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,wt,Et,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ht,n.RENDERBUFFER,H.__webglColorRenderbuffer[ht])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),O(H.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(tt){e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),nt(n.TEXTURE_CUBE_MAP,b);for(let ht=0;ht<6;ht++)if(b.mipmaps&&b.mipmaps.length>0)for(let St=0;St<b.mipmaps.length;St++)V(H.__webglFramebuffer[ht][St],w,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,St);else V(H.__webglFramebuffer[ht],w,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);g(b)&&d(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(_t){for(let ht=0,St=J.length;ht<St;ht++){const It=J[ht],vt=i.get(It);e.bindTexture(n.TEXTURE_2D,vt.__webglTexture),nt(n.TEXTURE_2D,It),V(H.__webglFramebuffer,w,It,n.COLOR_ATTACHMENT0+ht,n.TEXTURE_2D,0),g(It)&&d(n.TEXTURE_2D)}e.unbindTexture()}else{let ht=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ht=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ht,Z.__webglTexture),nt(ht,b),b.mipmaps&&b.mipmaps.length>0)for(let St=0;St<b.mipmaps.length;St++)V(H.__webglFramebuffer[St],w,b,n.COLOR_ATTACHMENT0,ht,St);else V(H.__webglFramebuffer,w,b,n.COLOR_ATTACHMENT0,ht,0);g(b)&&d(ht),e.unbindTexture()}w.depthBuffer&&ut(w)}function P(w){const b=w.textures;for(let H=0,Z=b.length;H<Z;H++){const J=b[H];if(g(J)){const tt=M(w),_t=i.get(J).__webglTexture;e.bindTexture(tt,_t),d(tt),e.unbindTexture()}}}const k=[],f=[];function F(w){if(w.samples>0){if(A(w)===!1){const b=w.textures,H=w.width,Z=w.height;let J=n.COLOR_BUFFER_BIT;const tt=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_t=i.get(w),ht=b.length>1;if(ht)for(let St=0;St<b.length;St++)e.bindFramebuffer(n.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,_t.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let St=0;St<b.length;St++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),ht){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,_t.__webglColorRenderbuffer[St]);const It=i.get(b[St]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,It,0)}n.blitFramebuffer(0,0,H,Z,0,0,H,Z,J,n.NEAREST),l===!0&&(k.length=0,f.length=0,k.push(n.COLOR_ATTACHMENT0+St),w.depthBuffer&&w.resolveDepthBuffer===!1&&(k.push(tt),f.push(tt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,f)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,k))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ht)for(let St=0;St<b.length;St++){e.bindFramebuffer(n.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,_t.__webglColorRenderbuffer[St]);const It=i.get(b[St]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,_t.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,It,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const b=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function U(w){return Math.min(r.maxSamples,w.samples)}function A(w){const b=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function S(w){const b=o.render.frame;u.get(w)!==b&&(u.set(w,b),w.update())}function T(w,b){const H=w.colorSpace,Z=w.format,J=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||H!==Rr&&H!==li&&($t.getTransfer(H)===ie?(Z!==un||J!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),b}function X(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=j,this.resetTextureUnits=I,this.setTexture2D=K,this.setTexture2DArray=et,this.setTexture3D=$,this.setTextureCube=Y,this.rebindTextures=st,this.setupRenderTarget=gt,this.updateRenderTargetMipmap=P,this.updateMultisampleRenderTarget=F,this.setupDepthRenderbuffer=ut,this.setupFrameBufferTexture=V,this.useMultisampledRTT=A}function yS(n,t){function e(i,r=li){let s;const o=$t.getTransfer(r);if(i===Yn)return n.UNSIGNED_BYTE;if(i===nc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ic)return n.UNSIGNED_SHORT_5_5_5_1;if(i===wf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ef)return n.BYTE;if(i===Tf)return n.SHORT;if(i===os)return n.UNSIGNED_SHORT;if(i===ec)return n.INT;if(i===Oi)return n.UNSIGNED_INT;if(i===Vn)return n.FLOAT;if(i===ps)return n.HALF_FLOAT;if(i===Af)return n.ALPHA;if(i===Cf)return n.RGB;if(i===un)return n.RGBA;if(i===Rf)return n.LUMINANCE;if(i===Pf)return n.LUMINANCE_ALPHA;if(i===vr)return n.DEPTH_COMPONENT;if(i===Ar)return n.DEPTH_STENCIL;if(i===Lf)return n.RED;if(i===rc)return n.RED_INTEGER;if(i===Df)return n.RG;if(i===sc)return n.RG_INTEGER;if(i===oc)return n.RGBA_INTEGER;if(i===to||i===eo||i===no||i===io)if(o===ie)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===to)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===eo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===no)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===io)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===to)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===eo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===no)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===io)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===il||i===rl||i===sl||i===ol)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===il)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===sl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ol)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===al||i===ll||i===cl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===al||i===ll)return o===ie?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===cl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ul||i===hl||i===fl||i===dl||i===pl||i===ml||i===gl||i===_l||i===vl||i===xl||i===yl||i===Sl||i===bl||i===Ml)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===ul)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===hl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===fl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===dl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===pl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ml)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===gl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===_l)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===vl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===xl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===bl)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ml)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ro||i===El||i===Tl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===ro)return o===ie?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===El)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Tl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===If||i===wl||i===Al||i===Cl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===ro)return s.COMPRESSED_RED_RGTC1_EXT;if(i===wl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Al)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Cl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===wr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class SS extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class cr extends Me{constructor(){super(),this.isGroup=!0,this.type="Group"}}const bS={type:"move"};class Ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new cr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new cr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new ot,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new ot),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new cr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new ot,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new ot),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),d=this._getHandJoint(c,_);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],m=u.position.distanceTo(h.position),p=.02,v=.005;c.inputState.pinching&&m>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&m<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(bS)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new cr;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const MS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ES=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class TS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const r=new Ge,s=t.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new gi({vertexShader:MS,fragmentShader:ES,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Qe(new Do(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wS extends Hi{constructor(t,e){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,m=null,p=null,v=null;const _=new TS,g=e.getContextAttributes();let d=null,M=null;const y=[],x=[],D=new xt;let N=null;const L=new ln;L.viewport=new pe;const z=new ln;z.viewport=new pe;const C=[L,z],R=new SS;let q=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let B=y[W];return B===void 0&&(B=new Ma,y[W]=B),B.getTargetRaySpace()},this.getControllerGrip=function(W){let B=y[W];return B===void 0&&(B=new Ma,y[W]=B),B.getGripSpace()},this.getHand=function(W){let B=y[W];return B===void 0&&(B=new Ma,y[W]=B),B.getHandSpace()};function j(W){const B=x.indexOf(W.inputSource);if(B===-1)return;const V=y[B];V!==void 0&&(V.update(W.inputSource,W.frame,c||o),V.dispatchEvent({type:W.type,data:W.inputSource}))}function E(){r.removeEventListener("select",j),r.removeEventListener("selectstart",j),r.removeEventListener("selectend",j),r.removeEventListener("squeeze",j),r.removeEventListener("squeezestart",j),r.removeEventListener("squeezeend",j),r.removeEventListener("end",E),r.removeEventListener("inputsourceschange",K);for(let W=0;W<y.length;W++){const B=x[W];B!==null&&(x[W]=null,y[W].disconnect(B))}q=null,I=null,_.reset(),t.setRenderTarget(d),p=null,m=null,h=null,r=null,M=null,bt.stop(),i.isPresenting=!1,t.setPixelRatio(N),t.setSize(D.width,D.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(d=t.getRenderTarget(),r.addEventListener("select",j),r.addEventListener("selectstart",j),r.addEventListener("selectend",j),r.addEventListener("squeeze",j),r.addEventListener("squeezestart",j),r.addEventListener("squeezeend",j),r.addEventListener("end",E),r.addEventListener("inputsourceschange",K),g.xrCompatible!==!0&&await e.makeXRCompatible(),N=t.getPixelRatio(),t.getSize(D),r.renderState.layers===void 0){const B={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,e,B),r.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new Fi(p.framebufferWidth,p.framebufferHeight,{format:un,type:Yn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let B=null,V=null,O=null;g.depth&&(O=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,B=g.stencil?Ar:vr,V=g.stencil?wr:Oi);const it={colorFormat:e.RGBA8,depthFormat:O,scaleFactor:s};h=new XRWebGLBinding(r,e),m=h.createProjectionLayer(it),r.updateRenderState({layers:[m]}),t.setPixelRatio(1),t.setSize(m.textureWidth,m.textureHeight,!1),M=new Fi(m.textureWidth,m.textureHeight,{format:un,type:Yn,depthTexture:new Yf(m.textureWidth,m.textureHeight,V,void 0,void 0,void 0,void 0,void 0,void 0,B),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),bt.setContext(r),bt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(W){for(let B=0;B<W.removed.length;B++){const V=W.removed[B],O=x.indexOf(V);O>=0&&(x[O]=null,y[O].disconnect(V))}for(let B=0;B<W.added.length;B++){const V=W.added[B];let O=x.indexOf(V);if(O===-1){for(let ut=0;ut<y.length;ut++)if(ut>=x.length){x.push(V),O=ut;break}else if(x[ut]===null){x[ut]=V,O=ut;break}if(O===-1)break}const it=y[O];it&&it.connect(V)}}const et=new ot,$=new ot;function Y(W,B,V){et.setFromMatrixPosition(B.matrixWorld),$.setFromMatrixPosition(V.matrixWorld);const O=et.distanceTo($),it=B.projectionMatrix.elements,ut=V.projectionMatrix.elements,st=it[14]/(it[10]-1),gt=it[14]/(it[10]+1),P=(it[9]+1)/it[5],k=(it[9]-1)/it[5],f=(it[8]-1)/it[0],F=(ut[8]+1)/ut[0],U=st*f,A=st*F,S=O/(-f+F),T=S*-f;if(B.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(T),W.translateZ(S),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),it[10]===-1)W.projectionMatrix.copy(B.projectionMatrix),W.projectionMatrixInverse.copy(B.projectionMatrixInverse);else{const X=st+S,w=gt+S,b=U-T,H=A+(O-T),Z=P*gt/w*X,J=k*gt/w*X;W.projectionMatrix.makePerspective(b,H,Z,J,X,w),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function rt(W,B){B===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(B.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let B=W.near,V=W.far;_.texture!==null&&(_.depthNear>0&&(B=_.depthNear),_.depthFar>0&&(V=_.depthFar)),R.near=z.near=L.near=B,R.far=z.far=L.far=V,(q!==R.near||I!==R.far)&&(r.updateRenderState({depthNear:R.near,depthFar:R.far}),q=R.near,I=R.far),L.layers.mask=W.layers.mask|2,z.layers.mask=W.layers.mask|4,R.layers.mask=L.layers.mask|z.layers.mask;const O=W.parent,it=R.cameras;rt(R,O);for(let ut=0;ut<it.length;ut++)rt(it[ut],O);it.length===2?Y(R,L,z):R.projectionMatrix.copy(L.projectionMatrix),ft(W,R,O)};function ft(W,B,V){V===null?W.matrix.copy(B.matrixWorld):(W.matrix.copy(V.matrixWorld),W.matrix.invert(),W.matrix.multiply(B.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(B.projectionMatrix),W.projectionMatrixInverse.copy(B.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Rl*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(m===null&&p===null))return l},this.setFoveation=function(W){l=W,m!==null&&(m.fixedFoveation=W),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=W)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(R)};let Q=null;function nt(W,B){if(u=B.getViewerPose(c||o),v=B,u!==null){const V=u.views;p!==null&&(t.setRenderTargetFramebuffer(M,p.framebuffer),t.setRenderTarget(M));let O=!1;V.length!==R.cameras.length&&(R.cameras.length=0,O=!0);for(let ut=0;ut<V.length;ut++){const st=V[ut];let gt=null;if(p!==null)gt=p.getViewport(st);else{const k=h.getViewSubImage(m,st);gt=k.viewport,ut===0&&(t.setRenderTargetTextures(M,k.colorTexture,m.ignoreDepthValues?void 0:k.depthStencilTexture),t.setRenderTarget(M))}let P=C[ut];P===void 0&&(P=new ln,P.layers.enable(ut),P.viewport=new pe,C[ut]=P),P.matrix.fromArray(st.transform.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale),P.projectionMatrix.fromArray(st.projectionMatrix),P.projectionMatrixInverse.copy(P.projectionMatrix).invert(),P.viewport.set(gt.x,gt.y,gt.width,gt.height),ut===0&&(R.matrix.copy(P.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),O===!0&&R.cameras.push(P)}const it=r.enabledFeatures;if(it&&it.includes("depth-sensing")){const ut=h.getDepthInformation(V[0]);ut&&ut.isValid&&ut.texture&&_.init(t,ut,r.renderState)}}for(let V=0;V<y.length;V++){const O=x[V],it=y[V];O!==null&&it!==void 0&&it.update(O,B,c||o)}Q&&Q(W,B),B.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:B}),v=null}const bt=new qf;bt.setAnimationLoop(nt),this.setAnimationLoop=function(W){Q=W},this.dispose=function(){}}}const Ti=new wn,AS=new he;function CS(n,t){function e(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function i(g,d){d.color.getRGB(g.fogColor.value,Wf(n)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function r(g,d,M,y,x){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(g,d):d.isMeshToonMaterial?(s(g,d),h(g,d)):d.isMeshPhongMaterial?(s(g,d),u(g,d)):d.isMeshStandardMaterial?(s(g,d),m(g,d),d.isMeshPhysicalMaterial&&p(g,d,x)):d.isMeshMatcapMaterial?(s(g,d),v(g,d)):d.isMeshDepthMaterial?s(g,d):d.isMeshDistanceMaterial?(s(g,d),_(g,d)):d.isMeshNormalMaterial?s(g,d):d.isLineBasicMaterial?(o(g,d),d.isLineDashedMaterial&&a(g,d)):d.isPointsMaterial?l(g,d,M,y):d.isSpriteMaterial?c(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,e(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,e(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===Ve&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,e(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===Ve&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,e(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,e(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const M=t.get(d),y=M.envMap,x=M.envMapRotation;y&&(g.envMap.value=y,Ti.copy(x),Ti.x*=-1,Ti.y*=-1,Ti.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ti.y*=-1,Ti.z*=-1),g.envMapRotation.value.setFromMatrix4(AS.makeRotationFromEuler(Ti)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,g.aoMapTransform))}function o(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,e(d.map,g.mapTransform))}function a(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function l(g,d,M,y){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*M,g.scale.value=y*.5,d.map&&(g.map.value=d.map,e(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function c(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,e(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function u(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function h(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function m(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function p(g,d,M){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ve&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,g.specularIntensityMapTransform))}function v(g,d){d.matcap&&(g.matcap.value=d.matcap)}function _(g,d){const M=t.get(d).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function RS(n,t,e,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){const x=y.program;i.uniformBlockBinding(M,x)}function c(M,y){let x=r[M.id];x===void 0&&(v(M),x=u(M),r[M.id]=x,M.addEventListener("dispose",g));const D=y.program;i.updateUBOMapping(M,D);const N=t.render.frame;s[M.id]!==N&&(m(M),s[M.id]=N)}function u(M){const y=h();M.__bindingPointIndex=y;const x=n.createBuffer(),D=M.__size,N=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,D,N),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,x),x}function h(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(M){const y=r[M.id],x=M.uniforms,D=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let N=0,L=x.length;N<L;N++){const z=Array.isArray(x[N])?x[N]:[x[N]];for(let C=0,R=z.length;C<R;C++){const q=z[C];if(p(q,N,C,D)===!0){const I=q.__offset,j=Array.isArray(q.value)?q.value:[q.value];let E=0;for(let K=0;K<j.length;K++){const et=j[K],$=_(et);typeof et=="number"||typeof et=="boolean"?(q.__data[0]=et,n.bufferSubData(n.UNIFORM_BUFFER,I+E,q.__data)):et.isMatrix3?(q.__data[0]=et.elements[0],q.__data[1]=et.elements[1],q.__data[2]=et.elements[2],q.__data[3]=0,q.__data[4]=et.elements[3],q.__data[5]=et.elements[4],q.__data[6]=et.elements[5],q.__data[7]=0,q.__data[8]=et.elements[6],q.__data[9]=et.elements[7],q.__data[10]=et.elements[8],q.__data[11]=0):(et.toArray(q.__data,E),E+=$.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,q.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(M,y,x,D){const N=M.value,L=y+"_"+x;if(D[L]===void 0)return typeof N=="number"||typeof N=="boolean"?D[L]=N:D[L]=N.clone(),!0;{const z=D[L];if(typeof N=="number"||typeof N=="boolean"){if(z!==N)return D[L]=N,!0}else if(z.equals(N)===!1)return z.copy(N),!0}return!1}function v(M){const y=M.uniforms;let x=0;const D=16;for(let L=0,z=y.length;L<z;L++){const C=Array.isArray(y[L])?y[L]:[y[L]];for(let R=0,q=C.length;R<q;R++){const I=C[R],j=Array.isArray(I.value)?I.value:[I.value];for(let E=0,K=j.length;E<K;E++){const et=j[E],$=_(et),Y=x%D,rt=Y%$.boundary,ft=Y+rt;x+=rt,ft!==0&&D-ft<$.storage&&(x+=D-ft),I.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=x,x+=$.storage}}}const N=x%D;return N>0&&(x+=D-N),M.__size=x,M.__cache={},this}function _(M){const y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),y}function g(M){const y=M.target;y.removeEventListener("dispose",g);const x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function d(){for(const M in r)n.deleteBuffer(r[M]);o=[],r={},s={}}return{bind:l,update:c,dispose:d}}class PS{constructor(t={}){const{canvas:e=v_(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:m=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const v=new Uint32Array(4),_=new Int32Array(4);let g=null,d=null;const M=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=qe,this.toneMapping=hi,this.toneMappingExposure=1;const x=this;let D=!1,N=0,L=0,z=null,C=-1,R=null;const q=new pe,I=new pe;let j=null;const E=new Yt(0);let K=0,et=e.width,$=e.height,Y=1,rt=null,ft=null;const Q=new pe(0,0,et,$),nt=new pe(0,0,et,$);let bt=!1;const W=new lc;let B=!1,V=!1;const O=new he,it=new he,ut=new ot,st=new pe,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let P=!1;function k(){return z===null?Y:1}let f=i;function F(G,lt){return e.getContext(G,lt)}try{const G={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${tc}`),e.addEventListener("webglcontextlost",yt,!1),e.addEventListener("webglcontextrestored",Rt,!1),e.addEventListener("webglcontextcreationerror",Pt,!1),f===null){const lt="webgl2";if(f=F(lt,G),f===null)throw F(lt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(G){throw console.error("THREE.WebGLRenderer: "+G.message),G}let U,A,S,T,X,w,b,H,Z,J,tt,_t,ht,St,It,vt,Et,wt,kt,Tt,Bt,Ht,Kt,at;function Ct(){U=new Nx(f),U.init(),Ht=new yS(f,U),A=new Rx(f,U,t,Ht),S=new _S(f,U),A.reverseDepthBuffer&&m&&S.buffers.depth.setReversed(!0),T=new kx(f),X=new nS,w=new xS(f,U,S,X,A,Ht,T),b=new Lx(x),H=new Ux(x),Z=new X_(f),Kt=new Ax(f,Z),J=new Ox(f,Z,T,Kt),tt=new zx(f,J,Z,T),kt=new Bx(f,A,w),vt=new Px(X),_t=new eS(x,b,H,U,A,Kt,vt),ht=new CS(x,X),St=new rS,It=new uS(U),wt=new wx(x,b,H,S,tt,p,l),Et=new mS(x,tt,A),at=new RS(f,T,A,S),Tt=new Cx(f,U,T),Bt=new Fx(f,U,T),T.programs=_t.programs,x.capabilities=A,x.extensions=U,x.properties=X,x.renderLists=St,x.shadowMap=Et,x.state=S,x.info=T}Ct();const mt=new wS(x,f);this.xr=mt,this.getContext=function(){return f},this.getContextAttributes=function(){return f.getContextAttributes()},this.forceContextLoss=function(){const G=U.get("WEBGL_lose_context");G&&G.loseContext()},this.forceContextRestore=function(){const G=U.get("WEBGL_lose_context");G&&G.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(G){G!==void 0&&(Y=G,this.setSize(et,$,!1))},this.getSize=function(G){return G.set(et,$)},this.setSize=function(G,lt,dt=!0){if(mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}et=G,$=lt,e.width=Math.floor(G*Y),e.height=Math.floor(lt*Y),dt===!0&&(e.style.width=G+"px",e.style.height=lt+"px"),this.setViewport(0,0,G,lt)},this.getDrawingBufferSize=function(G){return G.set(et*Y,$*Y).floor()},this.setDrawingBufferSize=function(G,lt,dt){et=G,$=lt,Y=dt,e.width=Math.floor(G*dt),e.height=Math.floor(lt*dt),this.setViewport(0,0,G,lt)},this.getCurrentViewport=function(G){return G.copy(q)},this.getViewport=function(G){return G.copy(Q)},this.setViewport=function(G,lt,dt,pt){G.isVector4?Q.set(G.x,G.y,G.z,G.w):Q.set(G,lt,dt,pt),S.viewport(q.copy(Q).multiplyScalar(Y).round())},this.getScissor=function(G){return G.copy(nt)},this.setScissor=function(G,lt,dt,pt){G.isVector4?nt.set(G.x,G.y,G.z,G.w):nt.set(G,lt,dt,pt),S.scissor(I.copy(nt).multiplyScalar(Y).round())},this.getScissorTest=function(){return bt},this.setScissorTest=function(G){S.setScissorTest(bt=G)},this.setOpaqueSort=function(G){rt=G},this.setTransparentSort=function(G){ft=G},this.getClearColor=function(G){return G.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor.apply(wt,arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha.apply(wt,arguments)},this.clear=function(G=!0,lt=!0,dt=!0){let pt=0;if(G){let ct=!1;if(z!==null){const Mt=z.texture.format;ct=Mt===oc||Mt===sc||Mt===rc}if(ct){const Mt=z.texture.type,Lt=Mt===Yn||Mt===Oi||Mt===os||Mt===wr||Mt===nc||Mt===ic,Ut=wt.getClearColor(),Nt=wt.getClearAlpha(),Vt=Ut.r,Xt=Ut.g,Ot=Ut.b;Lt?(v[0]=Vt,v[1]=Xt,v[2]=Ot,v[3]=Nt,f.clearBufferuiv(f.COLOR,0,v)):(_[0]=Vt,_[1]=Xt,_[2]=Ot,_[3]=Nt,f.clearBufferiv(f.COLOR,0,_))}else pt|=f.COLOR_BUFFER_BIT}lt&&(pt|=f.DEPTH_BUFFER_BIT),dt&&(pt|=f.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),f.clear(pt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",yt,!1),e.removeEventListener("webglcontextrestored",Rt,!1),e.removeEventListener("webglcontextcreationerror",Pt,!1),St.dispose(),It.dispose(),X.dispose(),b.dispose(),H.dispose(),tt.dispose(),Kt.dispose(),at.dispose(),_t.dispose(),mt.dispose(),mt.removeEventListener("sessionstart",gc),mt.removeEventListener("sessionend",_c),_i.stop()};function yt(G){G.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function Rt(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const G=T.autoReset,lt=Et.enabled,dt=Et.autoUpdate,pt=Et.needsUpdate,ct=Et.type;Ct(),T.autoReset=G,Et.enabled=lt,Et.autoUpdate=dt,Et.needsUpdate=pt,Et.type=ct}function Pt(G){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",G.statusMessage)}function Wt(G){const lt=G.target;lt.removeEventListener("dispose",Wt),de(lt)}function de(G){Te(G),X.remove(G)}function Te(G){const lt=X.get(G).programs;lt!==void 0&&(lt.forEach(function(dt){_t.releaseProgram(dt)}),G.isShaderMaterial&&_t.releaseShaderCache(G))}this.renderBufferDirect=function(G,lt,dt,pt,ct,Mt){lt===null&&(lt=gt);const Lt=ct.isMesh&&ct.matrixWorld.determinant()<0,Ut=ud(G,lt,dt,pt,ct);S.setMaterial(pt,Lt);let Nt=dt.index,Vt=1;if(pt.wireframe===!0){if(Nt=J.getWireframeAttribute(dt),Nt===void 0)return;Vt=2}const Xt=dt.drawRange,Ot=dt.attributes.position;let Zt=Xt.start*Vt,oe=(Xt.start+Xt.count)*Vt;Mt!==null&&(Zt=Math.max(Zt,Mt.start*Vt),oe=Math.min(oe,(Mt.start+Mt.count)*Vt)),Nt!==null?(Zt=Math.max(Zt,0),oe=Math.min(oe,Nt.count)):Ot!=null&&(Zt=Math.max(Zt,0),oe=Math.min(oe,Ot.count));const ce=oe-Zt;if(ce<0||ce===1/0)return;Kt.setup(ct,pt,Ut,dt,Nt);let Oe,Jt=Tt;if(Nt!==null&&(Oe=Z.get(Nt),Jt=Bt,Jt.setIndex(Oe)),ct.isMesh)pt.wireframe===!0?(S.setLineWidth(pt.wireframeLinewidth*k()),Jt.setMode(f.LINES)):Jt.setMode(f.TRIANGLES);else if(ct.isLine){let Ft=pt.linewidth;Ft===void 0&&(Ft=1),S.setLineWidth(Ft*k()),ct.isLineSegments?Jt.setMode(f.LINES):ct.isLineLoop?Jt.setMode(f.LINE_LOOP):Jt.setMode(f.LINE_STRIP)}else ct.isPoints?Jt.setMode(f.POINTS):ct.isSprite&&Jt.setMode(f.TRIANGLES);if(ct.isBatchedMesh)if(ct._multiDrawInstances!==null)Jt.renderMultiDrawInstances(ct._multiDrawStarts,ct._multiDrawCounts,ct._multiDrawCount,ct._multiDrawInstances);else if(U.get("WEBGL_multi_draw"))Jt.renderMultiDraw(ct._multiDrawStarts,ct._multiDrawCounts,ct._multiDrawCount);else{const Ft=ct._multiDrawStarts,Rn=ct._multiDrawCounts,Qt=ct._multiDrawCount,rn=Nt?Z.get(Nt).bytesPerElement:1,Gi=X.get(pt).currentProgram.getUniforms();for(let We=0;We<Qt;We++)Gi.setValue(f,"_gl_DrawID",We),Jt.render(Ft[We]/rn,Rn[We])}else if(ct.isInstancedMesh)Jt.renderInstances(Zt,ce,ct.count);else if(dt.isInstancedBufferGeometry){const Ft=dt._maxInstanceCount!==void 0?dt._maxInstanceCount:1/0,Rn=Math.min(dt.instanceCount,Ft);Jt.renderInstances(Zt,ce,Rn)}else Jt.render(Zt,ce)};function ne(G,lt,dt){G.transparent===!0&&G.side===Hn&&G.forceSinglePass===!1?(G.side=Ve,G.needsUpdate=!0,vs(G,lt,dt),G.side=mi,G.needsUpdate=!0,vs(G,lt,dt),G.side=Hn):vs(G,lt,dt)}this.compile=function(G,lt,dt=null){dt===null&&(dt=G),d=It.get(dt),d.init(lt),y.push(d),dt.traverseVisible(function(ct){ct.isLight&&ct.layers.test(lt.layers)&&(d.pushLight(ct),ct.castShadow&&d.pushShadow(ct))}),G!==dt&&G.traverseVisible(function(ct){ct.isLight&&ct.layers.test(lt.layers)&&(d.pushLight(ct),ct.castShadow&&d.pushShadow(ct))}),d.setupLights();const pt=new Set;return G.traverse(function(ct){if(!(ct.isMesh||ct.isPoints||ct.isLine||ct.isSprite))return;const Mt=ct.material;if(Mt)if(Array.isArray(Mt))for(let Lt=0;Lt<Mt.length;Lt++){const Ut=Mt[Lt];ne(Ut,dt,ct),pt.add(Ut)}else ne(Mt,dt,ct),pt.add(Mt)}),y.pop(),d=null,pt},this.compileAsync=function(G,lt,dt=null){const pt=this.compile(G,lt,dt);return new Promise(ct=>{function Mt(){if(pt.forEach(function(Lt){X.get(Lt).currentProgram.isReady()&&pt.delete(Lt)}),pt.size===0){ct(G);return}setTimeout(Mt,10)}U.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let nn=null;function Cn(G){nn&&nn(G)}function gc(){_i.stop()}function _c(){_i.start()}const _i=new qf;_i.setAnimationLoop(Cn),typeof self<"u"&&_i.setContext(self),this.setAnimationLoop=function(G){nn=G,mt.setAnimationLoop(G),G===null?_i.stop():_i.start()},mt.addEventListener("sessionstart",gc),mt.addEventListener("sessionend",_c),this.render=function(G,lt){if(lt!==void 0&&lt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),lt.parent===null&&lt.matrixWorldAutoUpdate===!0&&lt.updateMatrixWorld(),mt.enabled===!0&&mt.isPresenting===!0&&(mt.cameraAutoUpdate===!0&&mt.updateCamera(lt),lt=mt.getCamera()),G.isScene===!0&&G.onBeforeRender(x,G,lt,z),d=It.get(G,y.length),d.init(lt),y.push(d),it.multiplyMatrices(lt.projectionMatrix,lt.matrixWorldInverse),W.setFromProjectionMatrix(it),V=this.localClippingEnabled,B=vt.init(this.clippingPlanes,V),g=St.get(G,M.length),g.init(),M.push(g),mt.enabled===!0&&mt.isPresenting===!0){const Mt=x.xr.getDepthSensingMesh();Mt!==null&&Oo(Mt,lt,-1/0,x.sortObjects)}Oo(G,lt,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(rt,ft),P=mt.enabled===!1||mt.isPresenting===!1||mt.hasDepthSensing()===!1,P&&wt.addToRenderList(g,G),this.info.render.frame++,B===!0&&vt.beginShadows();const dt=d.state.shadowsArray;Et.render(dt,G,lt),B===!0&&vt.endShadows(),this.info.autoReset===!0&&this.info.reset();const pt=g.opaque,ct=g.transmissive;if(d.setupLights(),lt.isArrayCamera){const Mt=lt.cameras;if(ct.length>0)for(let Lt=0,Ut=Mt.length;Lt<Ut;Lt++){const Nt=Mt[Lt];xc(pt,ct,G,Nt)}P&&wt.render(G);for(let Lt=0,Ut=Mt.length;Lt<Ut;Lt++){const Nt=Mt[Lt];vc(g,G,Nt,Nt.viewport)}}else ct.length>0&&xc(pt,ct,G,lt),P&&wt.render(G),vc(g,G,lt);z!==null&&(w.updateMultisampleRenderTarget(z),w.updateRenderTargetMipmap(z)),G.isScene===!0&&G.onAfterRender(x,G,lt),Kt.resetDefaultState(),C=-1,R=null,y.pop(),y.length>0?(d=y[y.length-1],B===!0&&vt.setGlobalState(x.clippingPlanes,d.state.camera)):d=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function Oo(G,lt,dt,pt){if(G.visible===!1)return;if(G.layers.test(lt.layers)){if(G.isGroup)dt=G.renderOrder;else if(G.isLOD)G.autoUpdate===!0&&G.update(lt);else if(G.isLight)d.pushLight(G),G.castShadow&&d.pushShadow(G);else if(G.isSprite){if(!G.frustumCulled||W.intersectsSprite(G)){pt&&st.setFromMatrixPosition(G.matrixWorld).applyMatrix4(it);const Lt=tt.update(G),Ut=G.material;Ut.visible&&g.push(G,Lt,Ut,dt,st.z,null)}}else if((G.isMesh||G.isLine||G.isPoints)&&(!G.frustumCulled||W.intersectsObject(G))){const Lt=tt.update(G),Ut=G.material;if(pt&&(G.boundingSphere!==void 0?(G.boundingSphere===null&&G.computeBoundingSphere(),st.copy(G.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),st.copy(Lt.boundingSphere.center)),st.applyMatrix4(G.matrixWorld).applyMatrix4(it)),Array.isArray(Ut)){const Nt=Lt.groups;for(let Vt=0,Xt=Nt.length;Vt<Xt;Vt++){const Ot=Nt[Vt],Zt=Ut[Ot.materialIndex];Zt&&Zt.visible&&g.push(G,Lt,Zt,dt,st.z,Ot)}}else Ut.visible&&g.push(G,Lt,Ut,dt,st.z,null)}}const Mt=G.children;for(let Lt=0,Ut=Mt.length;Lt<Ut;Lt++)Oo(Mt[Lt],lt,dt,pt)}function vc(G,lt,dt,pt){const ct=G.opaque,Mt=G.transmissive,Lt=G.transparent;d.setupLightsView(dt),B===!0&&vt.setGlobalState(x.clippingPlanes,dt),pt&&S.viewport(q.copy(pt)),ct.length>0&&_s(ct,lt,dt),Mt.length>0&&_s(Mt,lt,dt),Lt.length>0&&_s(Lt,lt,dt),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function xc(G,lt,dt,pt){if((dt.isScene===!0?dt.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[pt.id]===void 0&&(d.state.transmissionRenderTarget[pt.id]=new Fi(1,1,{generateMipmaps:!0,type:U.has("EXT_color_buffer_half_float")||U.has("EXT_color_buffer_float")?ps:Yn,minFilter:Di,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const Mt=d.state.transmissionRenderTarget[pt.id],Lt=pt.viewport||q;Mt.setSize(Lt.z,Lt.w);const Ut=x.getRenderTarget();x.setRenderTarget(Mt),x.getClearColor(E),K=x.getClearAlpha(),K<1&&x.setClearColor(16777215,.5),x.clear(),P&&wt.render(dt);const Nt=x.toneMapping;x.toneMapping=hi;const Vt=pt.viewport;if(pt.viewport!==void 0&&(pt.viewport=void 0),d.setupLightsView(pt),B===!0&&vt.setGlobalState(x.clippingPlanes,pt),_s(G,dt,pt),w.updateMultisampleRenderTarget(Mt),w.updateRenderTargetMipmap(Mt),U.has("WEBGL_multisampled_render_to_texture")===!1){let Xt=!1;for(let Ot=0,Zt=lt.length;Ot<Zt;Ot++){const oe=lt[Ot],ce=oe.object,Oe=oe.geometry,Jt=oe.material,Ft=oe.group;if(Jt.side===Hn&&ce.layers.test(pt.layers)){const Rn=Jt.side;Jt.side=Ve,Jt.needsUpdate=!0,yc(ce,dt,pt,Oe,Jt,Ft),Jt.side=Rn,Jt.needsUpdate=!0,Xt=!0}}Xt===!0&&(w.updateMultisampleRenderTarget(Mt),w.updateRenderTargetMipmap(Mt))}x.setRenderTarget(Ut),x.setClearColor(E,K),Vt!==void 0&&(pt.viewport=Vt),x.toneMapping=Nt}function _s(G,lt,dt){const pt=lt.isScene===!0?lt.overrideMaterial:null;for(let ct=0,Mt=G.length;ct<Mt;ct++){const Lt=G[ct],Ut=Lt.object,Nt=Lt.geometry,Vt=pt===null?Lt.material:pt,Xt=Lt.group;Ut.layers.test(dt.layers)&&yc(Ut,lt,dt,Nt,Vt,Xt)}}function yc(G,lt,dt,pt,ct,Mt){G.onBeforeRender(x,lt,dt,pt,ct,Mt),G.modelViewMatrix.multiplyMatrices(dt.matrixWorldInverse,G.matrixWorld),G.normalMatrix.getNormalMatrix(G.modelViewMatrix),ct.onBeforeRender(x,lt,dt,pt,G,Mt),ct.transparent===!0&&ct.side===Hn&&ct.forceSinglePass===!1?(ct.side=Ve,ct.needsUpdate=!0,x.renderBufferDirect(dt,lt,pt,ct,G,Mt),ct.side=mi,ct.needsUpdate=!0,x.renderBufferDirect(dt,lt,pt,ct,G,Mt),ct.side=Hn):x.renderBufferDirect(dt,lt,pt,ct,G,Mt),G.onAfterRender(x,lt,dt,pt,ct,Mt)}function vs(G,lt,dt){lt.isScene!==!0&&(lt=gt);const pt=X.get(G),ct=d.state.lights,Mt=d.state.shadowsArray,Lt=ct.state.version,Ut=_t.getParameters(G,ct.state,Mt,lt,dt),Nt=_t.getProgramCacheKey(Ut);let Vt=pt.programs;pt.environment=G.isMeshStandardMaterial?lt.environment:null,pt.fog=lt.fog,pt.envMap=(G.isMeshStandardMaterial?H:b).get(G.envMap||pt.environment),pt.envMapRotation=pt.environment!==null&&G.envMap===null?lt.environmentRotation:G.envMapRotation,Vt===void 0&&(G.addEventListener("dispose",Wt),Vt=new Map,pt.programs=Vt);let Xt=Vt.get(Nt);if(Xt!==void 0){if(pt.currentProgram===Xt&&pt.lightsStateVersion===Lt)return bc(G,Ut),Xt}else Ut.uniforms=_t.getUniforms(G),G.onBeforeCompile(Ut,x),Xt=_t.acquireProgram(Ut,Nt),Vt.set(Nt,Xt),pt.uniforms=Ut.uniforms;const Ot=pt.uniforms;return(!G.isShaderMaterial&&!G.isRawShaderMaterial||G.clipping===!0)&&(Ot.clippingPlanes=vt.uniform),bc(G,Ut),pt.needsLights=fd(G),pt.lightsStateVersion=Lt,pt.needsLights&&(Ot.ambientLightColor.value=ct.state.ambient,Ot.lightProbe.value=ct.state.probe,Ot.directionalLights.value=ct.state.directional,Ot.directionalLightShadows.value=ct.state.directionalShadow,Ot.spotLights.value=ct.state.spot,Ot.spotLightShadows.value=ct.state.spotShadow,Ot.rectAreaLights.value=ct.state.rectArea,Ot.ltc_1.value=ct.state.rectAreaLTC1,Ot.ltc_2.value=ct.state.rectAreaLTC2,Ot.pointLights.value=ct.state.point,Ot.pointLightShadows.value=ct.state.pointShadow,Ot.hemisphereLights.value=ct.state.hemi,Ot.directionalShadowMap.value=ct.state.directionalShadowMap,Ot.directionalShadowMatrix.value=ct.state.directionalShadowMatrix,Ot.spotShadowMap.value=ct.state.spotShadowMap,Ot.spotLightMatrix.value=ct.state.spotLightMatrix,Ot.spotLightMap.value=ct.state.spotLightMap,Ot.pointShadowMap.value=ct.state.pointShadowMap,Ot.pointShadowMatrix.value=ct.state.pointShadowMatrix),pt.currentProgram=Xt,pt.uniformsList=null,Xt}function Sc(G){if(G.uniformsList===null){const lt=G.currentProgram.getUniforms();G.uniformsList=oo.seqWithValue(lt.seq,G.uniforms)}return G.uniformsList}function bc(G,lt){const dt=X.get(G);dt.outputColorSpace=lt.outputColorSpace,dt.batching=lt.batching,dt.batchingColor=lt.batchingColor,dt.instancing=lt.instancing,dt.instancingColor=lt.instancingColor,dt.instancingMorph=lt.instancingMorph,dt.skinning=lt.skinning,dt.morphTargets=lt.morphTargets,dt.morphNormals=lt.morphNormals,dt.morphColors=lt.morphColors,dt.morphTargetsCount=lt.morphTargetsCount,dt.numClippingPlanes=lt.numClippingPlanes,dt.numIntersection=lt.numClipIntersection,dt.vertexAlphas=lt.vertexAlphas,dt.vertexTangents=lt.vertexTangents,dt.toneMapping=lt.toneMapping}function ud(G,lt,dt,pt,ct){lt.isScene!==!0&&(lt=gt),w.resetTextureUnits();const Mt=lt.fog,Lt=pt.isMeshStandardMaterial?lt.environment:null,Ut=z===null?x.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:Rr,Nt=(pt.isMeshStandardMaterial?H:b).get(pt.envMap||Lt),Vt=pt.vertexColors===!0&&!!dt.attributes.color&&dt.attributes.color.itemSize===4,Xt=!!dt.attributes.tangent&&(!!pt.normalMap||pt.anisotropy>0),Ot=!!dt.morphAttributes.position,Zt=!!dt.morphAttributes.normal,oe=!!dt.morphAttributes.color;let ce=hi;pt.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(ce=x.toneMapping);const Oe=dt.morphAttributes.position||dt.morphAttributes.normal||dt.morphAttributes.color,Jt=Oe!==void 0?Oe.length:0,Ft=X.get(pt),Rn=d.state.lights;if(B===!0&&(V===!0||G!==R)){const Ze=G===R&&pt.id===C;vt.setState(pt,G,Ze)}let Qt=!1;pt.version===Ft.__version?(Ft.needsLights&&Ft.lightsStateVersion!==Rn.state.version||Ft.outputColorSpace!==Ut||ct.isBatchedMesh&&Ft.batching===!1||!ct.isBatchedMesh&&Ft.batching===!0||ct.isBatchedMesh&&Ft.batchingColor===!0&&ct.colorTexture===null||ct.isBatchedMesh&&Ft.batchingColor===!1&&ct.colorTexture!==null||ct.isInstancedMesh&&Ft.instancing===!1||!ct.isInstancedMesh&&Ft.instancing===!0||ct.isSkinnedMesh&&Ft.skinning===!1||!ct.isSkinnedMesh&&Ft.skinning===!0||ct.isInstancedMesh&&Ft.instancingColor===!0&&ct.instanceColor===null||ct.isInstancedMesh&&Ft.instancingColor===!1&&ct.instanceColor!==null||ct.isInstancedMesh&&Ft.instancingMorph===!0&&ct.morphTexture===null||ct.isInstancedMesh&&Ft.instancingMorph===!1&&ct.morphTexture!==null||Ft.envMap!==Nt||pt.fog===!0&&Ft.fog!==Mt||Ft.numClippingPlanes!==void 0&&(Ft.numClippingPlanes!==vt.numPlanes||Ft.numIntersection!==vt.numIntersection)||Ft.vertexAlphas!==Vt||Ft.vertexTangents!==Xt||Ft.morphTargets!==Ot||Ft.morphNormals!==Zt||Ft.morphColors!==oe||Ft.toneMapping!==ce||Ft.morphTargetsCount!==Jt)&&(Qt=!0):(Qt=!0,Ft.__version=pt.version);let rn=Ft.currentProgram;Qt===!0&&(rn=vs(pt,lt,ct));let Gi=!1,We=!1,Ir=!1;const ue=rn.getUniforms(),pn=Ft.uniforms;if(S.useProgram(rn.program)&&(Gi=!0,We=!0,Ir=!0),pt.id!==C&&(C=pt.id,We=!0),Gi||R!==G){S.buffers.depth.getReversed()?(O.copy(G.projectionMatrix),y_(O),S_(O),ue.setValue(f,"projectionMatrix",O)):ue.setValue(f,"projectionMatrix",G.projectionMatrix),ue.setValue(f,"viewMatrix",G.matrixWorldInverse);const Zn=ue.map.cameraPosition;Zn!==void 0&&Zn.setValue(f,ut.setFromMatrixPosition(G.matrixWorld)),A.logarithmicDepthBuffer&&ue.setValue(f,"logDepthBufFC",2/(Math.log(G.far+1)/Math.LN2)),(pt.isMeshPhongMaterial||pt.isMeshToonMaterial||pt.isMeshLambertMaterial||pt.isMeshBasicMaterial||pt.isMeshStandardMaterial||pt.isShaderMaterial)&&ue.setValue(f,"isOrthographic",G.isOrthographicCamera===!0),R!==G&&(R=G,We=!0,Ir=!0)}if(ct.isSkinnedMesh){ue.setOptional(f,ct,"bindMatrix"),ue.setOptional(f,ct,"bindMatrixInverse");const Ze=ct.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),ue.setValue(f,"boneTexture",Ze.boneTexture,w))}ct.isBatchedMesh&&(ue.setOptional(f,ct,"batchingTexture"),ue.setValue(f,"batchingTexture",ct._matricesTexture,w),ue.setOptional(f,ct,"batchingIdTexture"),ue.setValue(f,"batchingIdTexture",ct._indirectTexture,w),ue.setOptional(f,ct,"batchingColorTexture"),ct._colorsTexture!==null&&ue.setValue(f,"batchingColorTexture",ct._colorsTexture,w));const Ur=dt.morphAttributes;if((Ur.position!==void 0||Ur.normal!==void 0||Ur.color!==void 0)&&kt.update(ct,dt,rn),(We||Ft.receiveShadow!==ct.receiveShadow)&&(Ft.receiveShadow=ct.receiveShadow,ue.setValue(f,"receiveShadow",ct.receiveShadow)),pt.isMeshGouraudMaterial&&pt.envMap!==null&&(pn.envMap.value=Nt,pn.flipEnvMap.value=Nt.isCubeTexture&&Nt.isRenderTargetTexture===!1?-1:1),pt.isMeshStandardMaterial&&pt.envMap===null&&lt.environment!==null&&(pn.envMapIntensity.value=lt.environmentIntensity),We&&(ue.setValue(f,"toneMappingExposure",x.toneMappingExposure),Ft.needsLights&&hd(pn,Ir),Mt&&pt.fog===!0&&ht.refreshFogUniforms(pn,Mt),ht.refreshMaterialUniforms(pn,pt,Y,$,d.state.transmissionRenderTarget[G.id]),oo.upload(f,Sc(Ft),pn,w)),pt.isShaderMaterial&&pt.uniformsNeedUpdate===!0&&(oo.upload(f,Sc(Ft),pn,w),pt.uniformsNeedUpdate=!1),pt.isSpriteMaterial&&ue.setValue(f,"center",ct.center),ue.setValue(f,"modelViewMatrix",ct.modelViewMatrix),ue.setValue(f,"normalMatrix",ct.normalMatrix),ue.setValue(f,"modelMatrix",ct.matrixWorld),pt.isShaderMaterial||pt.isRawShaderMaterial){const Ze=pt.uniformsGroups;for(let Zn=0,Kn=Ze.length;Zn<Kn;Zn++){const Mc=Ze[Zn];at.update(Mc,rn),at.bind(Mc,rn)}}return rn}function hd(G,lt){G.ambientLightColor.needsUpdate=lt,G.lightProbe.needsUpdate=lt,G.directionalLights.needsUpdate=lt,G.directionalLightShadows.needsUpdate=lt,G.pointLights.needsUpdate=lt,G.pointLightShadows.needsUpdate=lt,G.spotLights.needsUpdate=lt,G.spotLightShadows.needsUpdate=lt,G.rectAreaLights.needsUpdate=lt,G.hemisphereLights.needsUpdate=lt}function fd(G){return G.isMeshLambertMaterial||G.isMeshToonMaterial||G.isMeshPhongMaterial||G.isMeshStandardMaterial||G.isShadowMaterial||G.isShaderMaterial&&G.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(G,lt,dt){X.get(G.texture).__webglTexture=lt,X.get(G.depthTexture).__webglTexture=dt;const pt=X.get(G);pt.__hasExternalTextures=!0,pt.__autoAllocateDepthBuffer=dt===void 0,pt.__autoAllocateDepthBuffer||U.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),pt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(G,lt){const dt=X.get(G);dt.__webglFramebuffer=lt,dt.__useDefaultFramebuffer=lt===void 0},this.setRenderTarget=function(G,lt=0,dt=0){z=G,N=lt,L=dt;let pt=!0,ct=null,Mt=!1,Lt=!1;if(G){const Nt=X.get(G);if(Nt.__useDefaultFramebuffer!==void 0)S.bindFramebuffer(f.FRAMEBUFFER,null),pt=!1;else if(Nt.__webglFramebuffer===void 0)w.setupRenderTarget(G);else if(Nt.__hasExternalTextures)w.rebindTextures(G,X.get(G.texture).__webglTexture,X.get(G.depthTexture).__webglTexture);else if(G.depthBuffer){const Ot=G.depthTexture;if(Nt.__boundDepthTexture!==Ot){if(Ot!==null&&X.has(Ot)&&(G.width!==Ot.image.width||G.height!==Ot.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(G)}}const Vt=G.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(Lt=!0);const Xt=X.get(G).__webglFramebuffer;G.isWebGLCubeRenderTarget?(Array.isArray(Xt[lt])?ct=Xt[lt][dt]:ct=Xt[lt],Mt=!0):G.samples>0&&w.useMultisampledRTT(G)===!1?ct=X.get(G).__webglMultisampledFramebuffer:Array.isArray(Xt)?ct=Xt[dt]:ct=Xt,q.copy(G.viewport),I.copy(G.scissor),j=G.scissorTest}else q.copy(Q).multiplyScalar(Y).floor(),I.copy(nt).multiplyScalar(Y).floor(),j=bt;if(S.bindFramebuffer(f.FRAMEBUFFER,ct)&&pt&&S.drawBuffers(G,ct),S.viewport(q),S.scissor(I),S.setScissorTest(j),Mt){const Nt=X.get(G.texture);f.framebufferTexture2D(f.FRAMEBUFFER,f.COLOR_ATTACHMENT0,f.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Nt.__webglTexture,dt)}else if(Lt){const Nt=X.get(G.texture),Vt=lt||0;f.framebufferTextureLayer(f.FRAMEBUFFER,f.COLOR_ATTACHMENT0,Nt.__webglTexture,dt||0,Vt)}C=-1},this.readRenderTargetPixels=function(G,lt,dt,pt,ct,Mt,Lt){if(!(G&&G.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=X.get(G).__webglFramebuffer;if(G.isWebGLCubeRenderTarget&&Lt!==void 0&&(Ut=Ut[Lt]),Ut){S.bindFramebuffer(f.FRAMEBUFFER,Ut);try{const Nt=G.texture,Vt=Nt.format,Xt=Nt.type;if(!A.textureFormatReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}lt>=0&&lt<=G.width-pt&&dt>=0&&dt<=G.height-ct&&f.readPixels(lt,dt,pt,ct,Ht.convert(Vt),Ht.convert(Xt),Mt)}finally{const Nt=z!==null?X.get(z).__webglFramebuffer:null;S.bindFramebuffer(f.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(G,lt,dt,pt,ct,Mt,Lt){if(!(G&&G.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ut=X.get(G).__webglFramebuffer;if(G.isWebGLCubeRenderTarget&&Lt!==void 0&&(Ut=Ut[Lt]),Ut){const Nt=G.texture,Vt=Nt.format,Xt=Nt.type;if(!A.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(lt>=0&&lt<=G.width-pt&&dt>=0&&dt<=G.height-ct){S.bindFramebuffer(f.FRAMEBUFFER,Ut);const Ot=f.createBuffer();f.bindBuffer(f.PIXEL_PACK_BUFFER,Ot),f.bufferData(f.PIXEL_PACK_BUFFER,Mt.byteLength,f.STREAM_READ),f.readPixels(lt,dt,pt,ct,Ht.convert(Vt),Ht.convert(Xt),0);const Zt=z!==null?X.get(z).__webglFramebuffer:null;S.bindFramebuffer(f.FRAMEBUFFER,Zt);const oe=f.fenceSync(f.SYNC_GPU_COMMANDS_COMPLETE,0);return f.flush(),await x_(f,oe,4),f.bindBuffer(f.PIXEL_PACK_BUFFER,Ot),f.getBufferSubData(f.PIXEL_PACK_BUFFER,0,Mt),f.deleteBuffer(Ot),f.deleteSync(oe),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(G,lt=null,dt=0){G.isTexture!==!0&&(Wr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),lt=arguments[0]||null,G=arguments[1]);const pt=Math.pow(2,-dt),ct=Math.floor(G.image.width*pt),Mt=Math.floor(G.image.height*pt),Lt=lt!==null?lt.x:0,Ut=lt!==null?lt.y:0;w.setTexture2D(G,0),f.copyTexSubImage2D(f.TEXTURE_2D,dt,0,0,Lt,Ut,ct,Mt),S.unbindTexture()},this.copyTextureToTexture=function(G,lt,dt=null,pt=null,ct=0){G.isTexture!==!0&&(Wr("WebGLRenderer: copyTextureToTexture function signature has changed."),pt=arguments[0]||null,G=arguments[1],lt=arguments[2],ct=arguments[3]||0,dt=null);let Mt,Lt,Ut,Nt,Vt,Xt,Ot,Zt,oe;const ce=G.isCompressedTexture?G.mipmaps[ct]:G.image;dt!==null?(Mt=dt.max.x-dt.min.x,Lt=dt.max.y-dt.min.y,Ut=dt.isBox3?dt.max.z-dt.min.z:1,Nt=dt.min.x,Vt=dt.min.y,Xt=dt.isBox3?dt.min.z:0):(Mt=ce.width,Lt=ce.height,Ut=ce.depth||1,Nt=0,Vt=0,Xt=0),pt!==null?(Ot=pt.x,Zt=pt.y,oe=pt.z):(Ot=0,Zt=0,oe=0);const Oe=Ht.convert(lt.format),Jt=Ht.convert(lt.type);let Ft;lt.isData3DTexture?(w.setTexture3D(lt,0),Ft=f.TEXTURE_3D):lt.isDataArrayTexture||lt.isCompressedArrayTexture?(w.setTexture2DArray(lt,0),Ft=f.TEXTURE_2D_ARRAY):(w.setTexture2D(lt,0),Ft=f.TEXTURE_2D),f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL,lt.flipY),f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL,lt.premultiplyAlpha),f.pixelStorei(f.UNPACK_ALIGNMENT,lt.unpackAlignment);const Rn=f.getParameter(f.UNPACK_ROW_LENGTH),Qt=f.getParameter(f.UNPACK_IMAGE_HEIGHT),rn=f.getParameter(f.UNPACK_SKIP_PIXELS),Gi=f.getParameter(f.UNPACK_SKIP_ROWS),We=f.getParameter(f.UNPACK_SKIP_IMAGES);f.pixelStorei(f.UNPACK_ROW_LENGTH,ce.width),f.pixelStorei(f.UNPACK_IMAGE_HEIGHT,ce.height),f.pixelStorei(f.UNPACK_SKIP_PIXELS,Nt),f.pixelStorei(f.UNPACK_SKIP_ROWS,Vt),f.pixelStorei(f.UNPACK_SKIP_IMAGES,Xt);const Ir=G.isDataArrayTexture||G.isData3DTexture,ue=lt.isDataArrayTexture||lt.isData3DTexture;if(G.isRenderTargetTexture||G.isDepthTexture){const pn=X.get(G),Ur=X.get(lt),Ze=X.get(pn.__renderTarget),Zn=X.get(Ur.__renderTarget);S.bindFramebuffer(f.READ_FRAMEBUFFER,Ze.__webglFramebuffer),S.bindFramebuffer(f.DRAW_FRAMEBUFFER,Zn.__webglFramebuffer);for(let Kn=0;Kn<Ut;Kn++)Ir&&f.framebufferTextureLayer(f.READ_FRAMEBUFFER,f.COLOR_ATTACHMENT0,X.get(G).__webglTexture,ct,Xt+Kn),G.isDepthTexture?(ue&&f.framebufferTextureLayer(f.DRAW_FRAMEBUFFER,f.COLOR_ATTACHMENT0,X.get(lt).__webglTexture,ct,oe+Kn),f.blitFramebuffer(Nt,Vt,Mt,Lt,Ot,Zt,Mt,Lt,f.DEPTH_BUFFER_BIT,f.NEAREST)):ue?f.copyTexSubImage3D(Ft,ct,Ot,Zt,oe+Kn,Nt,Vt,Mt,Lt):f.copyTexSubImage2D(Ft,ct,Ot,Zt,oe+Kn,Nt,Vt,Mt,Lt);S.bindFramebuffer(f.READ_FRAMEBUFFER,null),S.bindFramebuffer(f.DRAW_FRAMEBUFFER,null)}else ue?G.isDataTexture||G.isData3DTexture?f.texSubImage3D(Ft,ct,Ot,Zt,oe,Mt,Lt,Ut,Oe,Jt,ce.data):lt.isCompressedArrayTexture?f.compressedTexSubImage3D(Ft,ct,Ot,Zt,oe,Mt,Lt,Ut,Oe,ce.data):f.texSubImage3D(Ft,ct,Ot,Zt,oe,Mt,Lt,Ut,Oe,Jt,ce):G.isDataTexture?f.texSubImage2D(f.TEXTURE_2D,ct,Ot,Zt,Mt,Lt,Oe,Jt,ce.data):G.isCompressedTexture?f.compressedTexSubImage2D(f.TEXTURE_2D,ct,Ot,Zt,ce.width,ce.height,Oe,ce.data):f.texSubImage2D(f.TEXTURE_2D,ct,Ot,Zt,Mt,Lt,Oe,Jt,ce);f.pixelStorei(f.UNPACK_ROW_LENGTH,Rn),f.pixelStorei(f.UNPACK_IMAGE_HEIGHT,Qt),f.pixelStorei(f.UNPACK_SKIP_PIXELS,rn),f.pixelStorei(f.UNPACK_SKIP_ROWS,Gi),f.pixelStorei(f.UNPACK_SKIP_IMAGES,We),ct===0&&lt.generateMipmaps&&f.generateMipmap(Ft),S.unbindTexture()},this.copyTextureToTexture3D=function(G,lt,dt=null,pt=null,ct=0){return G.isTexture!==!0&&(Wr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),dt=arguments[0]||null,pt=arguments[1]||null,G=arguments[2],lt=arguments[3],ct=arguments[4]||0),Wr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(G,lt,dt,pt,ct)},this.initRenderTarget=function(G){X.get(G).__webglFramebuffer===void 0&&w.setupRenderTarget(G)},this.initTexture=function(G){G.isCubeTexture?w.setTextureCube(G,0):G.isData3DTexture?w.setTexture3D(G,0):G.isDataArrayTexture||G.isCompressedArrayTexture?w.setTexture2DArray(G,0):w.setTexture2D(G,0),S.unbindTexture()},this.resetState=function(){N=0,L=0,z=null,S.reset(),Kt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}}class LS extends Me{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wn,this.environmentIntensity=1,this.environmentRotation=new wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class hc extends Lr{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const _o=new ot,vo=new ot,Ju=new he,Vr=new ac,Gs=new ms,Ea=new ot,Qu=new ot;class DS extends Me{constructor(t=new en,e=new hc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let r=1,s=e.count;r<s;r++)_o.fromBufferAttribute(e,r-1),vo.fromBufferAttribute(e,r),i[r]=i[r-1],i[r]+=_o.distanceTo(vo);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Gs.copy(i.boundingSphere),Gs.applyMatrix4(r),Gs.radius+=s,t.ray.intersectsSphere(Gs)===!1)return;Ju.copy(r).invert(),Vr.copy(t.ray).applyMatrix4(Ju);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,m=i.attributes.position;if(u!==null){const p=Math.max(0,o.start),v=Math.min(u.count,o.start+o.count);for(let _=p,g=v-1;_<g;_+=c){const d=u.getX(_),M=u.getX(_+1),y=Ws(this,t,Vr,l,d,M);y&&e.push(y)}if(this.isLineLoop){const _=u.getX(v-1),g=u.getX(p),d=Ws(this,t,Vr,l,_,g);d&&e.push(d)}}else{const p=Math.max(0,o.start),v=Math.min(m.count,o.start+o.count);for(let _=p,g=v-1;_<g;_+=c){const d=Ws(this,t,Vr,l,_,_+1);d&&e.push(d)}if(this.isLineLoop){const _=Ws(this,t,Vr,l,v-1,p);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ws(n,t,e,i,r,s){const o=n.geometry.attributes.position;if(_o.fromBufferAttribute(o,r),vo.fromBufferAttribute(o,s),e.distanceSqToSegment(_o,vo,Ea,Qu)>i)return;Ea.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Ea);if(!(l<t.near||l>t.far))return{distance:l,point:Qu.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const th=new ot,eh=new ot;class Qf extends DS{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let r=0,s=e.count;r<s;r+=2)th.fromBufferAttribute(e,r),eh.fromBufferAttribute(e,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+th.distanceTo(eh);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class An{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(r),e.push(s),r=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let r=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const u=i[r],m=i[r+1]-u,p=(o-u)/m;return(r+p)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=e||(o.isVector2?new xt:new ot);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new ot,r=[],s=[],o=[],a=new ot,l=new he;for(let p=0;p<=t;p++){const v=p/t;r[p]=this.getTangentAt(v,new ot)}s[0]=new ot,o[0]=new ot;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),m=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),m<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let p=1;p<=t;p++){if(s[p]=s[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(r[p-1],r[p]),a.length()>Number.EPSILON){a.normalize();const v=Math.acos(be(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(a,v))}o[p].crossVectors(r[p],s[p])}if(e===!0){let p=Math.acos(be(s[0].dot(s[t]),-1,1));p/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(p=-p);for(let v=1;v<=t;v++)s[v].applyMatrix4(l.makeRotationAxis(r[v],p*v)),o[v].crossVectors(r[v],s[v])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class fc extends An{constructor(t=0,e=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new xt){const i=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),m=l-this.aX,p=c-this.aY;l=m*u-p*h+this.aX,c=m*h+p*u+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class IS extends fc{constructor(t,e,i,r,s,o){super(t,e,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function dc(){let n=0,t=0,e=0,i=0;function r(s,o,a,l){n=s,t=a,e=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let m=(o-s)/c-(a-s)/(c+u)+(a-o)/u,p=(a-o)/u-(l-o)/(u+h)+(l-a)/h;m*=u,p*=u,r(o,a,m,p)},calc:function(s){const o=s*s,a=o*s;return n+t*s+e*o+i*a}}}const Xs=new ot,Ta=new dc,wa=new dc,Aa=new dc;class US extends An{constructor(t=[],e=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=r}getPoint(t,e=new ot){const i=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(Xs.subVectors(r[0],r[1]).add(r[0]),c=Xs);const h=r[a%s],m=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Xs.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Xs),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let v=Math.pow(c.distanceToSquared(h),p),_=Math.pow(h.distanceToSquared(m),p),g=Math.pow(m.distanceToSquared(u),p);_<1e-4&&(_=1),v<1e-4&&(v=_),g<1e-4&&(g=_),Ta.initNonuniformCatmullRom(c.x,h.x,m.x,u.x,v,_,g),wa.initNonuniformCatmullRom(c.y,h.y,m.y,u.y,v,_,g),Aa.initNonuniformCatmullRom(c.z,h.z,m.z,u.z,v,_,g)}else this.curveType==="catmullrom"&&(Ta.initCatmullRom(c.x,h.x,m.x,u.x,this.tension),wa.initCatmullRom(c.y,h.y,m.y,u.y,this.tension),Aa.initCatmullRom(c.z,h.z,m.z,u.z,this.tension));return i.set(Ta.calc(l),wa.calc(l),Aa.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(new ot().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function nh(n,t,e,i,r){const s=(i-t)*.5,o=(r-e)*.5,a=n*n,l=n*a;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*a+s*n+e}function NS(n,t){const e=1-n;return e*e*t}function OS(n,t){return 2*(1-n)*n*t}function FS(n,t){return n*n*t}function Qr(n,t,e,i){return NS(n,t)+OS(n,e)+FS(n,i)}function kS(n,t){const e=1-n;return e*e*e*t}function BS(n,t){const e=1-n;return 3*e*e*n*t}function zS(n,t){return 3*(1-n)*n*n*t}function HS(n,t){return n*n*n*t}function ts(n,t,e,i,r){return kS(n,t)+BS(n,e)+zS(n,i)+HS(n,r)}class td extends An{constructor(t=new xt,e=new xt,i=new xt,r=new xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=r}getPoint(t,e=new xt){const i=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(ts(t,r.x,s.x,o.x,a.x),ts(t,r.y,s.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class VS extends An{constructor(t=new ot,e=new ot,i=new ot,r=new ot){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=r}getPoint(t,e=new ot){const i=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(ts(t,r.x,s.x,o.x,a.x),ts(t,r.y,s.y,o.y,a.y),ts(t,r.z,s.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ed extends An{constructor(t=new xt,e=new xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new xt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class GS extends An{constructor(t=new ot,e=new ot){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new ot){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nd extends An{constructor(t=new xt,e=new xt,i=new xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new xt){const i=e,r=this.v0,s=this.v1,o=this.v2;return i.set(Qr(t,r.x,s.x,o.x),Qr(t,r.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class WS extends An{constructor(t=new ot,e=new ot,i=new ot){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ot){const i=e,r=this.v0,s=this.v1,o=this.v2;return i.set(Qr(t,r.x,s.x,o.x),Qr(t,r.y,s.y,o.y),Qr(t,r.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class id extends An{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new xt){const i=e,r=this.points,s=(r.length-1)*t,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(nh(a,l.x,c.x,u.x,h.x),nh(a,l.y,c.y,u.y,h.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(new xt().fromArray(r))}return this}}var Ll=Object.freeze({__proto__:null,ArcCurve:IS,CatmullRomCurve3:US,CubicBezierCurve:td,CubicBezierCurve3:VS,EllipseCurve:fc,LineCurve:ed,LineCurve3:GS,QuadraticBezierCurve:nd,QuadraticBezierCurve3:WS,SplineCurve:id});class XS extends An{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ll[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,r=this.curves.length;i<r;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(e.push(u),i=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const r=t.curves[e];this.curves.push(new Ll[r.type]().fromJSON(r))}return this}}class fi extends XS{constructor(t){super(),this.type="Path",this.currentPoint=new xt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new ed(this.currentPoint.clone(),new xt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,r){const s=new nd(this.currentPoint.clone(),new xt(t,e),new xt(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(t,e,i,r,s,o){const a=new td(this.currentPoint.clone(),new xt(t,e),new xt(i,r),new xt(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new id(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,i,r,s,o),this}absarc(t,e,i,r,s,o){return this.absellipse(t,e,i,i,r,s,o),this}ellipse(t,e,i,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,i,r,s,o,a,l),this}absellipse(t,e,i,r,s,o,a,l){const c=new fc(t,e,i,r,s,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class yr extends fi{constructor(t){super(t),this.uuid=Pr(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,r=this.holes.length;i<r;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const r=t.holes[e];this.holes.push(new fi().fromJSON(r))}return this}}const jS={triangulate:function(n,t,e=2){const i=t&&t.length,r=i?t[0]*e:n.length;let s=rd(n,0,r,e,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c,u,h,m,p;if(i&&(s=KS(n,t,s,e)),n.length>80*e){a=c=n[0],l=u=n[1];for(let v=e;v<r;v+=e)h=n[v],m=n[v+1],h<a&&(a=h),m<l&&(l=m),h>c&&(c=h),m>u&&(u=m);p=Math.max(c-a,u-l),p=p!==0?32767/p:0}return as(s,o,e,a,l,p,0),o}};function rd(n,t,e,i,r){let s,o;if(r===lb(n,t,e,i)>0)for(s=t;s<e;s+=i)o=ih(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=ih(s,n[s],n[s+1],o);return o&&Uo(o,o.next)&&(cs(o),o=o.next),o}function Bi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Uo(e,e.next)||fe(e.prev,e,e.next)===0)){if(cs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function as(n,t,e,i,r,s,o){if(!n)return;!o&&s&&nb(n,i,r,s);let a=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?YS(n,i,r,s):qS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),cs(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=$S(Bi(n),t,e),as(n,t,e,i,r,s,2)):o===2&&ZS(n,t,e,i,r,s):as(Bi(n),t,e,i,r,s,1);break}}}function qS(n){const t=n.prev,e=n,i=n.next;if(fe(t,e,i)>=0)return!1;const r=t.x,s=e.x,o=i.x,a=t.y,l=e.y,c=i.y,u=r<s?r<o?r:o:s<o?s:o,h=a<l?a<c?a:c:l<c?l:c,m=r>s?r>o?r:o:s>o?s:o,p=a>l?a>c?a:c:l>c?l:c;let v=i.next;for(;v!==t;){if(v.x>=u&&v.x<=m&&v.y>=h&&v.y<=p&&ur(r,a,s,l,o,c,v.x,v.y)&&fe(v.prev,v,v.next)>=0)return!1;v=v.next}return!0}function YS(n,t,e,i){const r=n.prev,s=n,o=n.next;if(fe(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,h=s.y,m=o.y,p=a<l?a<c?a:c:l<c?l:c,v=u<h?u<m?u:m:h<m?h:m,_=a>l?a>c?a:c:l>c?l:c,g=u>h?u>m?u:m:h>m?h:m,d=Dl(p,v,t,e,i),M=Dl(_,g,t,e,i);let y=n.prevZ,x=n.nextZ;for(;y&&y.z>=d&&x&&x.z<=M;){if(y.x>=p&&y.x<=_&&y.y>=v&&y.y<=g&&y!==r&&y!==o&&ur(a,u,l,h,c,m,y.x,y.y)&&fe(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=p&&x.x<=_&&x.y>=v&&x.y<=g&&x!==r&&x!==o&&ur(a,u,l,h,c,m,x.x,x.y)&&fe(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=d;){if(y.x>=p&&y.x<=_&&y.y>=v&&y.y<=g&&y!==r&&y!==o&&ur(a,u,l,h,c,m,y.x,y.y)&&fe(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=M;){if(x.x>=p&&x.x<=_&&x.y>=v&&x.y<=g&&x!==r&&x!==o&&ur(a,u,l,h,c,m,x.x,x.y)&&fe(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function $S(n,t,e){let i=n;do{const r=i.prev,s=i.next.next;!Uo(r,s)&&sd(r,i,i.next,s)&&ls(r,s)&&ls(s,r)&&(t.push(r.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),cs(i),cs(i.next),i=n=s),i=i.next}while(i!==n);return Bi(i)}function ZS(n,t,e,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&sb(o,a)){let l=od(o,a);o=Bi(o,o.next),l=Bi(l,l.next),as(o,t,e,i,r,s,0),as(l,t,e,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function KS(n,t,e,i){const r=[];let s,o,a,l,c;for(s=0,o=t.length;s<o;s++)a=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=rd(n,a,l,i,!1),c===c.next&&(c.steiner=!0),r.push(rb(c));for(r.sort(JS),s=0;s<r.length;s++)e=QS(r[s],e);return e}function JS(n,t){return n.x-t.x}function QS(n,t){const e=tb(n,t);if(!e)return t;const i=od(e,n);return Bi(i,i.next),Bi(e,e.next)}function tb(n,t){let e=t,i=-1/0,r;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const m=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(m<=s&&m>i&&(i=m,r=e.x<e.next.x?e:e.next,m===s))return r}e=e.next}while(e!==t);if(!r)return null;const a=r,l=r.x,c=r.y;let u=1/0,h;e=r;do s>=e.x&&e.x>=l&&s!==e.x&&ur(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(h=Math.abs(o-e.y)/(s-e.x),ls(e,n)&&(h<u||h===u&&(e.x>r.x||e.x===r.x&&eb(r,e)))&&(r=e,u=h)),e=e.next;while(e!==a);return r}function eb(n,t){return fe(n.prev,n,t.prev)<0&&fe(t.next,n,n.next)<0}function nb(n,t,e,i){let r=n;do r.z===0&&(r.z=Dl(r.x,r.y,t,e,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,ib(r)}function ib(n){let t,e,i,r,s,o,a,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,a=0,t=0;t<c&&(a++,i=i.nextZ,!!i);t++);for(l=c;a>0||l>0&&i;)a!==0&&(l===0||!i||e.z<=i.z)?(r=e,e=e.nextZ,a--):(r=i,i=i.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;e=i}s.nextZ=null,c*=2}while(o>1);return n}function Dl(n,t,e,i,r){return n=(n-e)*r|0,t=(t-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function rb(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ur(n,t,e,i,r,s,o,a){return(r-o)*(t-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(i-a)}function sb(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!ob(n,t)&&(ls(n,t)&&ls(t,n)&&ab(n,t)&&(fe(n.prev,n,t.prev)||fe(n,t.prev,t))||Uo(n,t)&&fe(n.prev,n,n.next)>0&&fe(t.prev,t,t.next)>0)}function fe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Uo(n,t){return n.x===t.x&&n.y===t.y}function sd(n,t,e,i){const r=qs(fe(n,t,e)),s=qs(fe(n,t,i)),o=qs(fe(e,i,n)),a=qs(fe(e,i,t));return!!(r!==s&&o!==a||r===0&&js(n,e,t)||s===0&&js(n,i,t)||o===0&&js(e,n,i)||a===0&&js(e,t,i))}function js(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function qs(n){return n>0?1:n<0?-1:0}function ob(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&sd(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function ls(n,t){return fe(n.prev,n,n.next)<0?fe(n,t,n.next)>=0&&fe(n,n.prev,t)>=0:fe(n,t,n.prev)<0||fe(n,n.next,t)<0}function ab(n,t){let e=n,i=!1;const r=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function od(n,t){const e=new Il(n.i,n.x,n.y),i=new Il(t.i,t.x,t.y),r=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=r,r.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function ih(n,t,e,i){const r=new Il(n,t,e);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function cs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Il(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function lb(n,t,e,i){let r=0;for(let s=t,o=e-i;s<e;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class Ni{static area(t){const e=t.length;let i=0;for(let r=e-1,s=0;s<e;r=s++)i+=t[r].x*t[s].y-t[s].x*t[r].y;return i*.5}static isClockWise(t){return Ni.area(t)<0}static triangulateShape(t,e){const i=[],r=[],s=[];rh(t),sh(i,t);let o=t.length;e.forEach(rh);for(let l=0;l<e.length;l++)r.push(o),o+=e[l].length,sh(i,e[l]);const a=jS.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function rh(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function sh(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class No extends en{constructor(t=new yr([new xt(.5,.5),new xt(-.5,.5),new xt(-.5,-.5),new xt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,r=[],s=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new Se(r,3)),this.setAttribute("uv",new Se(s,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1;let m=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,v=e.bevelSize!==void 0?e.bevelSize:p-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const d=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:cb;let y,x=!1,D,N,L,z;d&&(y=d.getSpacedPoints(u),x=!0,m=!1,D=d.computeFrenetFrames(u,!1),N=new ot,L=new ot,z=new ot),m||(g=0,p=0,v=0,_=0);const C=a.extractPoints(c);let R=C.shape;const q=C.holes;if(!Ni.isClockWise(R)){R=R.reverse();for(let P=0,k=q.length;P<k;P++){const f=q[P];Ni.isClockWise(f)&&(q[P]=f.reverse())}}const j=Ni.triangulateShape(R,q),E=R;for(let P=0,k=q.length;P<k;P++){const f=q[P];R=R.concat(f)}function K(P,k,f){return k||console.error("THREE.ExtrudeGeometry: vec does not exist"),P.clone().addScaledVector(k,f)}const et=R.length,$=j.length;function Y(P,k,f){let F,U,A;const S=P.x-k.x,T=P.y-k.y,X=f.x-P.x,w=f.y-P.y,b=S*S+T*T,H=S*w-T*X;if(Math.abs(H)>Number.EPSILON){const Z=Math.sqrt(b),J=Math.sqrt(X*X+w*w),tt=k.x-T/Z,_t=k.y+S/Z,ht=f.x-w/J,St=f.y+X/J,It=((ht-tt)*w-(St-_t)*X)/(S*w-T*X);F=tt+S*It-P.x,U=_t+T*It-P.y;const vt=F*F+U*U;if(vt<=2)return new xt(F,U);A=Math.sqrt(vt/2)}else{let Z=!1;S>Number.EPSILON?X>Number.EPSILON&&(Z=!0):S<-Number.EPSILON?X<-Number.EPSILON&&(Z=!0):Math.sign(T)===Math.sign(w)&&(Z=!0),Z?(F=-T,U=S,A=Math.sqrt(b)):(F=S,U=T,A=Math.sqrt(b/2))}return new xt(F/A,U/A)}const rt=[];for(let P=0,k=E.length,f=k-1,F=P+1;P<k;P++,f++,F++)f===k&&(f=0),F===k&&(F=0),rt[P]=Y(E[P],E[f],E[F]);const ft=[];let Q,nt=rt.concat();for(let P=0,k=q.length;P<k;P++){const f=q[P];Q=[];for(let F=0,U=f.length,A=U-1,S=F+1;F<U;F++,A++,S++)A===U&&(A=0),S===U&&(S=0),Q[F]=Y(f[F],f[A],f[S]);ft.push(Q),nt=nt.concat(Q)}for(let P=0;P<g;P++){const k=P/g,f=p*Math.cos(k*Math.PI/2),F=v*Math.sin(k*Math.PI/2)+_;for(let U=0,A=E.length;U<A;U++){const S=K(E[U],rt[U],F);O(S.x,S.y,-f)}for(let U=0,A=q.length;U<A;U++){const S=q[U];Q=ft[U];for(let T=0,X=S.length;T<X;T++){const w=K(S[T],Q[T],F);O(w.x,w.y,-f)}}}const bt=v+_;for(let P=0;P<et;P++){const k=m?K(R[P],nt[P],bt):R[P];x?(L.copy(D.normals[0]).multiplyScalar(k.x),N.copy(D.binormals[0]).multiplyScalar(k.y),z.copy(y[0]).add(L).add(N),O(z.x,z.y,z.z)):O(k.x,k.y,0)}for(let P=1;P<=u;P++)for(let k=0;k<et;k++){const f=m?K(R[k],nt[k],bt):R[k];x?(L.copy(D.normals[P]).multiplyScalar(f.x),N.copy(D.binormals[P]).multiplyScalar(f.y),z.copy(y[P]).add(L).add(N),O(z.x,z.y,z.z)):O(f.x,f.y,h/u*P)}for(let P=g-1;P>=0;P--){const k=P/g,f=p*Math.cos(k*Math.PI/2),F=v*Math.sin(k*Math.PI/2)+_;for(let U=0,A=E.length;U<A;U++){const S=K(E[U],rt[U],F);O(S.x,S.y,h+f)}for(let U=0,A=q.length;U<A;U++){const S=q[U];Q=ft[U];for(let T=0,X=S.length;T<X;T++){const w=K(S[T],Q[T],F);x?O(w.x,w.y+y[u-1].y,y[u-1].x+f):O(w.x,w.y,h+f)}}}W(),B();function W(){const P=r.length/3;if(m){let k=0,f=et*k;for(let F=0;F<$;F++){const U=j[F];it(U[2]+f,U[1]+f,U[0]+f)}k=u+g*2,f=et*k;for(let F=0;F<$;F++){const U=j[F];it(U[0]+f,U[1]+f,U[2]+f)}}else{for(let k=0;k<$;k++){const f=j[k];it(f[2],f[1],f[0])}for(let k=0;k<$;k++){const f=j[k];it(f[0]+et*u,f[1]+et*u,f[2]+et*u)}}i.addGroup(P,r.length/3-P,0)}function B(){const P=r.length/3;let k=0;V(E,k),k+=E.length;for(let f=0,F=q.length;f<F;f++){const U=q[f];V(U,k),k+=U.length}i.addGroup(P,r.length/3-P,1)}function V(P,k){let f=P.length;for(;--f>=0;){const F=f;let U=f-1;U<0&&(U=P.length-1);for(let A=0,S=u+g*2;A<S;A++){const T=et*A,X=et*(A+1),w=k+F+T,b=k+U+T,H=k+U+X,Z=k+F+X;ut(w,b,H,Z)}}}function O(P,k,f){l.push(P),l.push(k),l.push(f)}function it(P,k,f){st(P),st(k),st(f);const F=r.length/3,U=M.generateTopUV(i,r,F-3,F-2,F-1);gt(U[0]),gt(U[1]),gt(U[2])}function ut(P,k,f,F){st(P),st(k),st(F),st(k),st(f),st(F);const U=r.length/3,A=M.generateSideWallUV(i,r,U-6,U-3,U-2,U-1);gt(A[0]),gt(A[1]),gt(A[3]),gt(A[1]),gt(A[2]),gt(A[3])}function st(P){r.push(l[P*3+0]),r.push(l[P*3+1]),r.push(l[P*3+2])}function gt(P){s.push(P.x),s.push(P.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return ub(e,i,t)}static fromJSON(t,e){const i=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];i.push(a)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new Ll[r.type]().fromJSON(r)),new No(i,t.options)}}const cb={generateTopUV:function(n,t,e,i,r){const s=t[e*3],o=t[e*3+1],a=t[i*3],l=t[i*3+1],c=t[r*3],u=t[r*3+1];return[new xt(s,o),new xt(a,l),new xt(c,u)]},generateSideWallUV:function(n,t,e,i,r,s){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[i*3],u=t[i*3+1],h=t[i*3+2],m=t[r*3],p=t[r*3+1],v=t[r*3+2],_=t[s*3],g=t[s*3+1],d=t[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new xt(o,1-l),new xt(c,1-h),new xt(m,1-v),new xt(_,1-d)]:[new xt(a,1-l),new xt(u,1-h),new xt(p,1-v),new xt(g,1-d)]}};function ub(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ad extends Lr{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uf,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}const oh={enabled:!1,files:{},add:function(n,t){this.enabled!==!1&&(this.files[n]=t)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class hb{constructor(t,e,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,m=c.length;h<m;h+=2){const p=c[h],v=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return v}return null}}}const fb=new hb;class pc{constructor(t){this.manager=t!==void 0?t:fb,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const i=this;return new Promise(function(r,s){i.load(t,r,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}pc.DEFAULT_MATERIAL_NAME="__DEFAULT";const On={};class db extends Error{constructor(t,e){super(t),this.response=e}}class pb extends pc{constructor(t){super(t)}load(t,e,i,r){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=oh.get(t);if(s!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(s),this.manager.itemEnd(t)},0),s;if(On[t]!==void 0){On[t].push({onLoad:e,onProgress:i,onError:r});return}On[t]=[],On[t].push({onLoad:e,onProgress:i,onError:r});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=On[t],h=c.body.getReader(),m=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=m?parseInt(m):0,v=p!==0;let _=0;const g=new ReadableStream({start(d){M();function M(){h.read().then(({done:y,value:x})=>{if(y)d.close();else{_+=x.byteLength;const D=new ProgressEvent("progress",{lengthComputable:v,loaded:_,total:p});for(let N=0,L=u.length;N<L;N++){const z=u[N];z.onProgress&&z.onProgress(D)}d.enqueue(x),M()}},y=>{d.error(y)})}}});return new Response(g)}else throw new db(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a===void 0)return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(a),m=h&&h[1]?h[1].toLowerCase():void 0,p=new TextDecoder(m);return c.arrayBuffer().then(v=>p.decode(v))}}}).then(c=>{oh.add(t,c);const u=On[t];delete On[t];for(let h=0,m=u.length;h<m;h++){const p=u[h];p.onLoad&&p.onLoad(c)}}).catch(c=>{const u=On[t];if(u===void 0)throw this.manager.itemError(t),c;delete On[t];for(let h=0,m=u.length;h<m;h++){const p=u[h];p.onError&&p.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}}class ld extends Me{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const Ca=new he,ah=new ot,lh=new ot;class mb{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lc,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;ah.setFromMatrixPosition(t.matrixWorld),e.position.copy(ah),lh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lh),e.updateMatrixWorld(),Ca.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ca),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ca)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class gb extends mb{constructor(){super(new cc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _b extends ld{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Me.DEFAULT_UP),this.updateMatrix(),this.target=new Me,this.shadow=new gb}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class vb extends ld{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class ch{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(be(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const uh=new xt;class xb{constructor(t=new xt(1/0,1/0),e=new xt(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=uh.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,uh).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}class yb extends Qf{constructor(t=10,e=10,i=4473924,r=8947848){i=new Yt(i),r=new Yt(r);const s=e/2,o=t/e,a=t/2,l=[],c=[];for(let m=0,p=0,v=-a;m<=e;m++,v+=o){l.push(-a,0,v,a,0,v),l.push(v,0,-a,v,0,a);const _=m===s?i:r;_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3}const u=new en;u.setAttribute("position",new Se(l,3)),u.setAttribute("color",new Se(c,3));const h=new hc({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Sb extends Qf{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new en;r.setAttribute("position",new Se(e,3)),r.setAttribute("color",new Se(i,3));const s=new hc({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(t,e,i){const r=new Yt,s=this.geometry.attributes.color.array;return r.set(t),r.toArray(s,0),r.toArray(s,3),r.set(e),r.toArray(s,6),r.toArray(s,9),r.set(i),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class wi{constructor(){this.type="ShapePath",this.color=new Yt,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new fi,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,i,r){return this.currentPath.quadraticCurveTo(t,e,i,r),this}bezierCurveTo(t,e,i,r,s,o){return this.currentPath.bezierCurveTo(t,e,i,r,s,o),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(d){const M=[];for(let y=0,x=d.length;y<x;y++){const D=d[y],N=new yr;N.curves=D.curves,M.push(N)}return M}function i(d,M){const y=M.length;let x=!1;for(let D=y-1,N=0;N<y;D=N++){let L=M[D],z=M[N],C=z.x-L.x,R=z.y-L.y;if(Math.abs(R)>Number.EPSILON){if(R<0&&(L=M[N],C=-C,z=M[D],R=-R),d.y<L.y||d.y>z.y)continue;if(d.y===L.y){if(d.x===L.x)return!0}else{const q=R*(d.x-L.x)-C*(d.y-L.y);if(q===0)return!0;if(q<0)continue;x=!x}}else{if(d.y!==L.y)continue;if(z.x<=d.x&&d.x<=L.x||L.x<=d.x&&d.x<=z.x)return!0}}return x}const r=Ni.isClockWise,s=this.subPaths;if(s.length===0)return[];let o,a,l;const c=[];if(s.length===1)return a=s[0],l=new yr,l.curves=a.curves,c.push(l),c;let u=!r(s[0].getPoints());u=t?!u:u;const h=[],m=[];let p=[],v=0,_;m[v]=void 0,p[v]=[];for(let d=0,M=s.length;d<M;d++)a=s[d],_=a.getPoints(),o=r(_),o=t?!o:o,o?(!u&&m[v]&&v++,m[v]={s:new yr,p:_},m[v].s.curves=a.curves,u&&v++,p[v]=[]):p[v].push({h:a,p:_[0]});if(!m[0])return e(s);if(m.length>1){let d=!1,M=0;for(let y=0,x=m.length;y<x;y++)h[y]=[];for(let y=0,x=m.length;y<x;y++){const D=p[y];for(let N=0;N<D.length;N++){const L=D[N];let z=!0;for(let C=0;C<m.length;C++)i(L.p,m[C].p)&&(y!==C&&M++,z?(z=!1,h[C].push(L)):d=!0);z&&h[y].push(L)}}M>0&&d===!1&&(p=h)}let g;for(let d=0,M=m.length;d<M;d++){l=m[d].s,c.push(l),g=p[d];for(let y=0,x=g.length;y<x;y++)l.holes.push(g[y].h)}return c}}class bb extends Hi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:tc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=tc);const hh={type:"change"},mc={type:"start"},cd={type:"end"},Ys=new ac,fh=new oi,Mb=Math.cos(70*__.DEG2RAD),_e=new ot,ke=2*Math.PI,re={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ra=1e-6;class Eb extends bb{constructor(t,e=null){super(t,e),this.state=re.NONE,this.enabled=!0,this.target=new ot,this.cursor=new ot,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:gr.ROTATE,MIDDLE:gr.DOLLY,RIGHT:gr.PAN},this.touches={ONE:ar.ROTATE,TWO:ar.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new ot,this._lastQuaternion=new ki,this._lastTargetPosition=new ot,this._quat=new ki().setFromUnitVectors(t.up,new ot(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ch,this._sphericalDelta=new ch,this._scale=1,this._panOffset=new ot,this._rotateStart=new xt,this._rotateEnd=new xt,this._rotateDelta=new xt,this._panStart=new xt,this._panEnd=new xt,this._panDelta=new xt,this._dollyStart=new xt,this._dollyEnd=new xt,this._dollyDelta=new xt,this._dollyDirection=new ot,this._mouse=new xt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=wb.bind(this),this._onPointerDown=Tb.bind(this),this._onPointerUp=Ab.bind(this),this._onContextMenu=Ub.bind(this),this._onMouseWheel=Pb.bind(this),this._onKeyDown=Lb.bind(this),this._onTouchStart=Db.bind(this),this._onTouchMove=Ib.bind(this),this._onMouseDown=Cb.bind(this),this._onMouseMove=Rb.bind(this),this._interceptControlDown=Nb.bind(this),this._interceptControlUp=Ob.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(hh),this.update(),this.state=re.NONE}update(t=null){const e=this.object.position;_e.copy(e).sub(this.target),_e.applyQuaternion(this._quat),this._spherical.setFromVector3(_e),this.autoRotate&&this.state===re.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=ke:i>Math.PI&&(i-=ke),r<-Math.PI?r+=ke:r>Math.PI&&(r-=ke),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(_e.setFromSpherical(this._spherical),_e.applyQuaternion(this._quatInverse),e.copy(this.target).add(_e),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=_e.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new ot(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new ot(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=_e.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ys.origin.copy(this.object.position),Ys.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ys.direction))<Mb?this.object.lookAt(this.target):(fh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ys.intersectPlane(fh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Ra||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ra||this._lastTargetPosition.distanceToSquared(this.target)>Ra?(this.dispatchEvent(hh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?ke/60*this.autoRotateSpeed*t:ke/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){_e.setFromMatrixColumn(e,0),_e.multiplyScalar(-t),this._panOffset.add(_e)}_panUp(t,e){this.screenSpacePanning===!0?_e.setFromMatrixColumn(e,1):(_e.setFromMatrixColumn(e,0),_e.crossVectors(this.object.up,_e)),_e.multiplyScalar(t),this._panOffset.add(_e)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;_e.copy(r).sub(this.target);let s=_e.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*s/i.clientHeight,this.object.matrix),this._panUp(2*e*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=t-i.left,s=e-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ke*this._rotateDelta.x/e.clientHeight),this._rotateUp(ke*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(ke*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-ke*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(ke*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-ke*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._panStart.set(i,r)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,r=t.pageY-e.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),r=.5*(t.pageX+i.x),s=.5*(t.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ke*this._rotateDelta.x/e.clientHeight),this._rotateUp(ke*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,r=t.pageY-e.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new xt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Tb(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function wb(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Ab(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(cd),this.state=re.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Cb(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case gr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=re.DOLLY;break;case gr.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=re.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=re.ROTATE}break;case gr.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=re.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=re.PAN}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(mc)}function Rb(n){switch(this.state){case re.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case re.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case re.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Pb(n){this.enabled===!1||this.enableZoom===!1||this.state!==re.NONE||(n.preventDefault(),this.dispatchEvent(mc),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(cd))}function Lb(n){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(n)}function Db(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ar.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=re.TOUCH_ROTATE;break;case ar.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=re.TOUCH_PAN;break;default:this.state=re.NONE}break;case 2:switch(this.touches.TWO){case ar.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=re.TOUCH_DOLLY_PAN;break;case ar.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=re.TOUCH_DOLLY_ROTATE;break;default:this.state=re.NONE}break;default:this.state=re.NONE}this.state!==re.NONE&&this.dispatchEvent(mc)}function Ib(n){switch(this._trackPointer(n),this.state){case re.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case re.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case re.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case re.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=re.NONE}}function Ub(n){this.enabled!==!1&&n.preventDefault()}function Nb(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ob(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Fb(){let n=null,t=null,e=null,i=null,r=null,s=null,o=null;function a(p){if(!kb())return{webglUnavailable:!0};t=new LS,t.background=new Yt(15790320);const{clientWidth:v,clientHeight:_}=p,g=80,d=v/_;e=new cc(-g*d/2,g*d/2,g/2,-g/2,.1,1e3),e.position.set(60,60,60),e.lookAt(0,0,0),n=new PS({antialias:!0}),n.setPixelRatio(window.devicePixelRatio),n.setSize(v,_),p.appendChild(n.domElement);const M=new vb(16777215,.6);t.add(M);const y=new _b(16777215,1);y.position.set(5,10,7.5),t.add(y),i=new Eb(e,n.domElement),i.target.set(0,0,0),i.enableDamping=!0,i.dampingFactor=.05,t.add(new yb(50,50,13421772,14737632)),t.add(new Sb(10));function x(){if(o=null,!n||!e)return;const N=p.clientWidth,L=p.clientHeight,z=80,C=N/L;e.left=-z*C/2,e.right=z*C/2,e.top=z/2,e.bottom=-z/2,e.updateProjectionMatrix(),n.setSize(N,L)}s=new ResizeObserver(()=>{o===null&&(o=requestAnimationFrame(x))}),s.observe(p);function D(){!n||!t||!e||!i||(r=requestAnimationFrame(D),i.update(),n.render(t,e))}return D(),{webglUnavailable:!1}}function l(){r!==null&&cancelAnimationFrame(r),o!==null&&cancelAnimationFrame(o),s==null||s.disconnect(),i==null||i.dispose(),n==null||n.dispose(),n==null||n.domElement.remove(),r=null,n=null,t=null,e=null,i=null,s=null,o=null}function c(p){if(!e||!i)return;const v=new Vi().setFromObject(p),_=new ms;v.getBoundingSphere(_);const g=_.radius*1.3;(e.right-e.left)/(e.top-e.bottom),e.zoom=Math.min((e.right-e.left)/(2*g),(e.top-e.bottom)/(2*g)),e.updateProjectionMatrix();const d=new ot(1,1,1).normalize().multiplyScalar(g*2);e.position.copy(_.center).add(d),i.target.copy(_.center),i.update()}function u(){return t}function h(){return e}function m(){return n}return{init:a,dispose:l,getScene:u,getCamera:h,getRenderer:m,fitCamera:c}}function kb(){var n;try{const t=document.createElement("canvas"),e=t.getContext("webgl")||t.getContext("experimental-webgl"),i=!!(window.WebGLRenderingContext&&e);return(n=e==null?void 0:e.getExtension("WEBGL_lose_context"))==null||n.loseContext(),i}catch{return!1}}function Bb(n,t,e,i,r){const s=t.keyringRingDiameter/2,o=((e-r)*(e-r)-s*s)/(2*s),a=Math.min(s*.75,Math.max(0,o));if(a<=.01)n.lineTo(s,i),n.absarc(0,i,s,0,Math.PI,!1),n.lineTo(-e+r,i);else{const l=Math.sqrt(s*s+2*s*a),c=Math.atan2(a,l),u=Math.PI-c;n.lineTo(l,i),n.absarc(l,i+a,a,-Math.PI/2,Math.atan2(-a,-l),!0),n.absarc(0,i,s,c,u,!1),n.absarc(-l,i+a,a,Math.atan2(-a,l),-Math.PI/2,!0),n.lineTo(-e+r,i);const h=new fi;h.absarc(0,i,t.keyringHoleDiameter/2,0,Math.PI*2,!1),n.holes.push(h)}}function zb(n,t,e,i=[]){const r=Math.min(n.cornerRadius,t/2,e/2),s=t/2,o=e/2,a=new yr;a.moveTo(-s+r,-o),a.lineTo(s-r,-o),a.quadraticCurveTo(s,-o,s,-o+r),a.lineTo(s,o-r),a.quadraticCurveTo(s,o,s-r,o),n.keyringEnabled?Bb(a,n,s,o,r):a.lineTo(-s+r,o),a.quadraticCurveTo(-s,o,-s,o-r),a.lineTo(-s,-o+r),a.quadraticCurveTo(-s,-o,-s+r,-o);for(const u of i)a.holes.push(u);const l=new No(a,{depth:n.baseThickness,bevelEnabled:!1}),c=new ad({color:n.baseColor});return new Qe(l,c)}function Hb(n,t){const e=[];for(const i of n){if(i.shapes.length===0)continue;const r=new No(i.shapes,{depth:t.baseThickness,bevelEnabled:!1}),s=new ad({color:i.color});e.push(new Qe(r,s))}return e}function Vb(n){let t=null,e=null;const i=Je({width:0,height:0,depth:0});function r(){if(!t)return;const l=n();l&&l.remove(t),t.traverse(c=>{c instanceof Qe&&(c.geometry.dispose(),c.material.dispose())}),t=null,e=null}function s(l,c){r();const u=n();if(!u)return null;const h=new Vi;let m=!1;for(const D of l)for(const N of D.shapes){const L=N.getPoints(64);for(const z of L)h.expandByPoint(new ot(z.x,z.y,0));m=!0}let p=c.targetWidth,v=c.targetWidth*(2/3),_=1;const g=new xt(0,0);if(m){const D=new ot;h.getSize(D),_=(c.targetWidth-c.padding*2)/D.x,p=c.targetWidth,v=D.y*_+c.padding*2;const N=new ot;h.getCenter(N),g.set(N.x,N.y)}const d=new cr;d.rotation.x=-Math.PI/2;const M=[];if(m)for(const D of l)for(const N of D.shapes){const L=N.getPoints(64),z=new fi;for(let C=0;C<L.length;C++){const R=(L[C].x-g.x)*_,q=-(L[C].y-g.y)*_;C===0?z.moveTo(R,q):z.lineTo(R,q)}M.push(z)}const y=zb(c,p,v,M);if(d.add(y),m){const D=Hb(l,c),N=new cr;N.scale.set(_,-_,1),N.position.set(-g.x*_,g.y*_,0);for(const L of D)N.add(L);d.add(N),e=N}u.add(d),t=d;const x=c.keyringEnabled?v+c.keyringRingDiameter/2:v;return i.value={width:p,height:x,depth:c.baseThickness},d}function o(){r()}function a(l){e&&(e.visible=l)}return{build:s,dispose:o,dimensions:i,setLogoVisible:a}}const Gb={key:0,class:"absolute inset-0 flex items-center justify-center text-gray-500 text-sm"},Wb=fs({__name:"ThreeViewer",props:{colorGroups:{},showLogo:{type:Boolean},config:{}},setup(n,{expose:t}){const e=n,i=Je(null),r=Je(!1),{init:s,dispose:o,getScene:a,fitCamera:l}=Fb(),{build:c,dispose:u,dimensions:h,setLogoVisible:m}=Vb(a);let p=null,v=null;function _(){p=c(e.colorGroups,e.config),p&&l(p)}function g(){p=c(e.colorGroups,e.config)}function d(){p&&l(p)}return t({dimensions:h,resetView:d,getCurrentGroup:()=>p}),$h(()=>{if(!i.value)return;const M=s(i.value);r.value=M.webglUnavailable,!M.webglUnavailable&&_()}),pr(()=>e.colorGroups,()=>{v&&clearTimeout(v),v=setTimeout(_,150)},{deep:!0}),pr(()=>e.config,()=>{v&&clearTimeout(v),v=setTimeout(g,150)},{deep:!0}),pr(()=>e.showLogo,M=>{m(M)}),$l(()=>{v&&clearTimeout(v),u(),o()}),(M,y)=>(Ie(),He("div",{ref_key:"containerRef",ref:i,class:"w-full h-full relative"},[r.value?(Ie(),He("div",Gb," WebGL is not available in your browser. ")):fo("",!0)],512))}}),Xb=qe;class xo extends pc{constructor(t){super(t),this.defaultDPI=90,this.defaultUnit="px"}load(t,e,i,r){const s=this,o=new pb(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(t,function(a){try{e(s.parse(a))}catch(l){r?r(l):console.error(l),s.manager.itemError(t)}},i,r)}parse(t){const e=this;function i(W,B){if(W.nodeType!==1)return;const V=x(W);let O=!1,it=null;switch(W.nodeName){case"svg":B=v(W,B);break;case"style":s(W);break;case"g":B=v(W,B);break;case"path":B=v(W,B),W.hasAttribute("d")&&(it=r(W));break;case"rect":B=v(W,B),it=l(W);break;case"polygon":B=v(W,B),it=c(W);break;case"polyline":B=v(W,B),it=u(W);break;case"circle":B=v(W,B),it=h(W);break;case"ellipse":B=v(W,B),it=m(W);break;case"line":B=v(W,B),it=p(W);break;case"defs":O=!0;break;case"use":B=v(W,B);const gt=(W.getAttributeNS("http://www.w3.org/1999/xlink","href")||"").substring(1),P=W.viewportElement.getElementById(gt);P?i(P,B):console.warn("SVGLoader: 'use node' references non-existent node id: "+gt);break}it&&(B.fill!==void 0&&B.fill!=="none"&&it.color.setStyle(B.fill,Xb),N(it,Q),I.push(it),it.userData={node:W,style:B});const ut=W.childNodes;for(let st=0;st<ut.length;st++){const gt=ut[st];O&&gt.nodeName!=="style"&&gt.nodeName!=="defs"||i(gt,B)}V&&(E.pop(),E.length>0?Q.copy(E[E.length-1]):Q.identity())}function r(W){const B=new wi,V=new xt,O=new xt,it=new xt;let ut=!0,st=!1;const gt=W.getAttribute("d");if(gt===""||gt==="none")return null;const P=gt.match(/[a-df-z][^a-df-z]*/ig);for(let k=0,f=P.length;k<f;k++){const F=P[k],U=F.charAt(0),A=F.slice(1).trim();ut===!0&&(st=!0,ut=!1);let S;switch(U){case"M":S=g(A);for(let T=0,X=S.length;T<X;T+=2)V.x=S[T+0],V.y=S[T+1],O.x=V.x,O.y=V.y,T===0?B.moveTo(V.x,V.y):B.lineTo(V.x,V.y),T===0&&it.copy(V);break;case"H":S=g(A);for(let T=0,X=S.length;T<X;T++)V.x=S[T],O.x=V.x,O.y=V.y,B.lineTo(V.x,V.y),T===0&&st===!0&&it.copy(V);break;case"V":S=g(A);for(let T=0,X=S.length;T<X;T++)V.y=S[T],O.x=V.x,O.y=V.y,B.lineTo(V.x,V.y),T===0&&st===!0&&it.copy(V);break;case"L":S=g(A);for(let T=0,X=S.length;T<X;T+=2)V.x=S[T+0],V.y=S[T+1],O.x=V.x,O.y=V.y,B.lineTo(V.x,V.y),T===0&&st===!0&&it.copy(V);break;case"C":S=g(A);for(let T=0,X=S.length;T<X;T+=6)B.bezierCurveTo(S[T+0],S[T+1],S[T+2],S[T+3],S[T+4],S[T+5]),O.x=S[T+2],O.y=S[T+3],V.x=S[T+4],V.y=S[T+5],T===0&&st===!0&&it.copy(V);break;case"S":S=g(A);for(let T=0,X=S.length;T<X;T+=4)B.bezierCurveTo(_(V.x,O.x),_(V.y,O.y),S[T+0],S[T+1],S[T+2],S[T+3]),O.x=S[T+0],O.y=S[T+1],V.x=S[T+2],V.y=S[T+3],T===0&&st===!0&&it.copy(V);break;case"Q":S=g(A);for(let T=0,X=S.length;T<X;T+=4)B.quadraticCurveTo(S[T+0],S[T+1],S[T+2],S[T+3]),O.x=S[T+0],O.y=S[T+1],V.x=S[T+2],V.y=S[T+3],T===0&&st===!0&&it.copy(V);break;case"T":S=g(A);for(let T=0,X=S.length;T<X;T+=2){const w=_(V.x,O.x),b=_(V.y,O.y);B.quadraticCurveTo(w,b,S[T+0],S[T+1]),O.x=w,O.y=b,V.x=S[T+0],V.y=S[T+1],T===0&&st===!0&&it.copy(V)}break;case"A":S=g(A,[3,4],7);for(let T=0,X=S.length;T<X;T+=7){if(S[T+5]==V.x&&S[T+6]==V.y)continue;const w=V.clone();V.x=S[T+5],V.y=S[T+6],O.x=V.x,O.y=V.y,o(B,S[T],S[T+1],S[T+2],S[T+3],S[T+4],w,V),T===0&&st===!0&&it.copy(V)}break;case"m":S=g(A);for(let T=0,X=S.length;T<X;T+=2)V.x+=S[T+0],V.y+=S[T+1],O.x=V.x,O.y=V.y,T===0?B.moveTo(V.x,V.y):B.lineTo(V.x,V.y),T===0&&it.copy(V);break;case"h":S=g(A);for(let T=0,X=S.length;T<X;T++)V.x+=S[T],O.x=V.x,O.y=V.y,B.lineTo(V.x,V.y),T===0&&st===!0&&it.copy(V);break;case"v":S=g(A);for(let T=0,X=S.length;T<X;T++)V.y+=S[T],O.x=V.x,O.y=V.y,B.lineTo(V.x,V.y),T===0&&st===!0&&it.copy(V);break;case"l":S=g(A);for(let T=0,X=S.length;T<X;T+=2)V.x+=S[T+0],V.y+=S[T+1],O.x=V.x,O.y=V.y,B.lineTo(V.x,V.y),T===0&&st===!0&&it.copy(V);break;case"c":S=g(A);for(let T=0,X=S.length;T<X;T+=6)B.bezierCurveTo(V.x+S[T+0],V.y+S[T+1],V.x+S[T+2],V.y+S[T+3],V.x+S[T+4],V.y+S[T+5]),O.x=V.x+S[T+2],O.y=V.y+S[T+3],V.x+=S[T+4],V.y+=S[T+5],T===0&&st===!0&&it.copy(V);break;case"s":S=g(A);for(let T=0,X=S.length;T<X;T+=4)B.bezierCurveTo(_(V.x,O.x),_(V.y,O.y),V.x+S[T+0],V.y+S[T+1],V.x+S[T+2],V.y+S[T+3]),O.x=V.x+S[T+0],O.y=V.y+S[T+1],V.x+=S[T+2],V.y+=S[T+3],T===0&&st===!0&&it.copy(V);break;case"q":S=g(A);for(let T=0,X=S.length;T<X;T+=4)B.quadraticCurveTo(V.x+S[T+0],V.y+S[T+1],V.x+S[T+2],V.y+S[T+3]),O.x=V.x+S[T+0],O.y=V.y+S[T+1],V.x+=S[T+2],V.y+=S[T+3],T===0&&st===!0&&it.copy(V);break;case"t":S=g(A);for(let T=0,X=S.length;T<X;T+=2){const w=_(V.x,O.x),b=_(V.y,O.y);B.quadraticCurveTo(w,b,V.x+S[T+0],V.y+S[T+1]),O.x=w,O.y=b,V.x=V.x+S[T+0],V.y=V.y+S[T+1],T===0&&st===!0&&it.copy(V)}break;case"a":S=g(A,[3,4],7);for(let T=0,X=S.length;T<X;T+=7){if(S[T+5]==0&&S[T+6]==0)continue;const w=V.clone();V.x+=S[T+5],V.y+=S[T+6],O.x=V.x,O.y=V.y,o(B,S[T],S[T+1],S[T+2],S[T+3],S[T+4],w,V),T===0&&st===!0&&it.copy(V)}break;case"Z":case"z":B.currentPath.autoClose=!0,B.currentPath.curves.length>0&&(V.copy(it),B.currentPath.currentPoint.copy(V),ut=!0);break;default:console.warn(F)}st=!1}return B}function s(W){if(!(!W.sheet||!W.sheet.cssRules||!W.sheet.cssRules.length))for(let B=0;B<W.sheet.cssRules.length;B++){const V=W.sheet.cssRules[B];if(V.type!==1)continue;const O=V.selectorText.split(/,/gm).filter(Boolean).map(it=>it.trim());for(let it=0;it<O.length;it++){const ut=Object.fromEntries(Object.entries(V.style).filter(([,st])=>st!==""));j[O[it]]=Object.assign(j[O[it]]||{},ut)}}}function o(W,B,V,O,it,ut,st,gt){if(B==0||V==0){W.lineTo(gt.x,gt.y);return}O=O*Math.PI/180,B=Math.abs(B),V=Math.abs(V);const P=(st.x-gt.x)/2,k=(st.y-gt.y)/2,f=Math.cos(O)*P+Math.sin(O)*k,F=-Math.sin(O)*P+Math.cos(O)*k;let U=B*B,A=V*V;const S=f*f,T=F*F,X=S/U+T/A;if(X>1){const It=Math.sqrt(X);B=It*B,V=It*V,U=B*B,A=V*V}const w=U*T+A*S,b=(U*A-w)/w;let H=Math.sqrt(Math.max(0,b));it===ut&&(H=-H);const Z=H*B*F/V,J=-H*V*f/B,tt=Math.cos(O)*Z-Math.sin(O)*J+(st.x+gt.x)/2,_t=Math.sin(O)*Z+Math.cos(O)*J+(st.y+gt.y)/2,ht=a(1,0,(f-Z)/B,(F-J)/V),St=a((f-Z)/B,(F-J)/V,(-f-Z)/B,(-F-J)/V)%(Math.PI*2);W.currentPath.absellipse(tt,_t,B,V,ht,ht+St,ut===0,O)}function a(W,B,V,O){const it=W*V+B*O,ut=Math.sqrt(W*W+B*B)*Math.sqrt(V*V+O*O);let st=Math.acos(Math.max(-1,Math.min(1,it/ut)));return W*O-B*V<0&&(st=-st),st}function l(W){const B=y(W.getAttribute("x")||0),V=y(W.getAttribute("y")||0),O=y(W.getAttribute("rx")||W.getAttribute("ry")||0),it=y(W.getAttribute("ry")||W.getAttribute("rx")||0),ut=y(W.getAttribute("width")),st=y(W.getAttribute("height")),gt=1-.551915024494,P=new wi;return P.moveTo(B+O,V),P.lineTo(B+ut-O,V),(O!==0||it!==0)&&P.bezierCurveTo(B+ut-O*gt,V,B+ut,V+it*gt,B+ut,V+it),P.lineTo(B+ut,V+st-it),(O!==0||it!==0)&&P.bezierCurveTo(B+ut,V+st-it*gt,B+ut-O*gt,V+st,B+ut-O,V+st),P.lineTo(B+O,V+st),(O!==0||it!==0)&&P.bezierCurveTo(B+O*gt,V+st,B,V+st-it*gt,B,V+st-it),P.lineTo(B,V+it),(O!==0||it!==0)&&P.bezierCurveTo(B,V+it*gt,B+O*gt,V,B+O,V),P}function c(W){function B(ut,st,gt){const P=y(st),k=y(gt);it===0?O.moveTo(P,k):O.lineTo(P,k),it++}const V=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,O=new wi;let it=0;return W.getAttribute("points").replace(V,B),O.currentPath.autoClose=!0,O}function u(W){function B(ut,st,gt){const P=y(st),k=y(gt);it===0?O.moveTo(P,k):O.lineTo(P,k),it++}const V=/([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g,O=new wi;let it=0;return W.getAttribute("points").replace(V,B),O.currentPath.autoClose=!1,O}function h(W){const B=y(W.getAttribute("cx")||0),V=y(W.getAttribute("cy")||0),O=y(W.getAttribute("r")||0),it=new fi;it.absarc(B,V,O,0,Math.PI*2);const ut=new wi;return ut.subPaths.push(it),ut}function m(W){const B=y(W.getAttribute("cx")||0),V=y(W.getAttribute("cy")||0),O=y(W.getAttribute("rx")||0),it=y(W.getAttribute("ry")||0),ut=new fi;ut.absellipse(B,V,O,it,0,Math.PI*2);const st=new wi;return st.subPaths.push(ut),st}function p(W){const B=y(W.getAttribute("x1")||0),V=y(W.getAttribute("y1")||0),O=y(W.getAttribute("x2")||0),it=y(W.getAttribute("y2")||0),ut=new wi;return ut.moveTo(B,V),ut.lineTo(O,it),ut.currentPath.autoClose=!1,ut}function v(W,B){B=Object.assign({},B);let V={};if(W.hasAttribute("class")){const st=W.getAttribute("class").split(/\s/).filter(Boolean).map(gt=>gt.trim());for(let gt=0;gt<st.length;gt++)V=Object.assign(V,j["."+st[gt]])}W.hasAttribute("id")&&(V=Object.assign(V,j["#"+W.getAttribute("id")]));function O(st,gt,P){P===void 0&&(P=function(f){return f.startsWith("url")&&console.warn("SVGLoader: url access in attributes is not implemented."),f}),W.hasAttribute(st)&&(B[gt]=P(W.getAttribute(st))),V[st]&&(B[gt]=P(V[st])),W.style&&W.style[st]!==""&&(B[gt]=P(W.style[st]))}function it(st){return Math.max(0,Math.min(1,y(st)))}function ut(st){return Math.max(0,y(st))}return O("fill","fill"),O("fill-opacity","fillOpacity",it),O("fill-rule","fillRule"),O("opacity","opacity",it),O("stroke","stroke"),O("stroke-opacity","strokeOpacity",it),O("stroke-width","strokeWidth",ut),O("stroke-linejoin","strokeLineJoin"),O("stroke-linecap","strokeLineCap"),O("stroke-miterlimit","strokeMiterLimit",ut),O("visibility","visibility"),B}function _(W,B){return W-(B-W)}function g(W,B,V){if(typeof W!="string")throw new TypeError("Invalid input: "+typeof W);const O={WHITESPACE:/[ \t\r\n]/,DIGIT:/[\d]/,SIGN:/[-+]/,POINT:/\./,COMMA:/,/,EXP:/e/i,FLAGS:/[01]/},it=0,ut=1,st=2,gt=3;let P=it,k=!0,f="",F="";const U=[];function A(w,b,H){const Z=new SyntaxError('Unexpected character "'+w+'" at index '+b+".");throw Z.partial=H,Z}function S(){f!==""&&(F===""?U.push(Number(f)):U.push(Number(f)*Math.pow(10,Number(F)))),f="",F=""}let T;const X=W.length;for(let w=0;w<X;w++){if(T=W[w],Array.isArray(B)&&B.includes(U.length%V)&&O.FLAGS.test(T)){P=ut,f=T,S();continue}if(P===it){if(O.WHITESPACE.test(T))continue;if(O.DIGIT.test(T)||O.SIGN.test(T)){P=ut,f=T;continue}if(O.POINT.test(T)){P=st,f=T;continue}O.COMMA.test(T)&&(k&&A(T,w,U),k=!0)}if(P===ut){if(O.DIGIT.test(T)){f+=T;continue}if(O.POINT.test(T)){f+=T,P=st;continue}if(O.EXP.test(T)){P=gt;continue}O.SIGN.test(T)&&f.length===1&&O.SIGN.test(f[0])&&A(T,w,U)}if(P===st){if(O.DIGIT.test(T)){f+=T;continue}if(O.EXP.test(T)){P=gt;continue}O.POINT.test(T)&&f[f.length-1]==="."&&A(T,w,U)}if(P===gt){if(O.DIGIT.test(T)){F+=T;continue}if(O.SIGN.test(T)){if(F===""){F+=T;continue}F.length===1&&O.SIGN.test(F)&&A(T,w,U)}}O.WHITESPACE.test(T)?(S(),P=it,k=!1):O.COMMA.test(T)?(S(),P=it,k=!0):O.SIGN.test(T)?(S(),P=ut,f=T):O.POINT.test(T)?(S(),P=st,f=T):A(T,w,U)}return S(),U}const d=["mm","cm","in","pt","pc","px"],M={mm:{mm:1,cm:.1,in:1/25.4,pt:72/25.4,pc:6/25.4,px:-1},cm:{mm:10,cm:1,in:1/2.54,pt:72/2.54,pc:6/2.54,px:-1},in:{mm:25.4,cm:2.54,in:1,pt:72,pc:6,px:-1},pt:{mm:25.4/72,cm:2.54/72,in:1/72,pt:1,pc:6/72,px:-1},pc:{mm:25.4/6,cm:2.54/6,in:1/6,pt:72/6,pc:1,px:-1},px:{px:1}};function y(W){let B="px";if(typeof W=="string"||W instanceof String)for(let O=0,it=d.length;O<it;O++){const ut=d[O];if(W.endsWith(ut)){B=ut,W=W.substring(0,W.length-ut.length);break}}let V;return B==="px"&&e.defaultUnit!=="px"?V=M.in[e.defaultUnit]/e.defaultDPI:(V=M[B][e.defaultUnit],V<0&&(V=M[B].in*e.defaultDPI)),V*parseFloat(W)}function x(W){if(!(W.hasAttribute("transform")||W.nodeName==="use"&&(W.hasAttribute("x")||W.hasAttribute("y"))))return null;const B=D(W);return E.length>0&&B.premultiply(E[E.length-1]),Q.copy(B),E.push(B),B}function D(W){const B=new zt,V=K;if(W.nodeName==="use"&&(W.hasAttribute("x")||W.hasAttribute("y"))){const O=y(W.getAttribute("x")),it=y(W.getAttribute("y"));B.translate(O,it)}if(W.hasAttribute("transform")){const O=W.getAttribute("transform").split(")");for(let it=O.length-1;it>=0;it--){const ut=O[it].trim();if(ut==="")continue;const st=ut.indexOf("("),gt=ut.length;if(st>0&&st<gt){const P=ut.slice(0,st),k=g(ut.slice(st+1));switch(V.identity(),P){case"translate":if(k.length>=1){const f=k[0];let F=0;k.length>=2&&(F=k[1]),V.translate(f,F)}break;case"rotate":if(k.length>=1){let f=0,F=0,U=0;f=k[0]*Math.PI/180,k.length>=3&&(F=k[1],U=k[2]),et.makeTranslation(-F,-U),$.makeRotation(f),Y.multiplyMatrices($,et),et.makeTranslation(F,U),V.multiplyMatrices(et,Y)}break;case"scale":if(k.length>=1){const f=k[0];let F=f;k.length>=2&&(F=k[1]),V.scale(f,F)}break;case"skewX":k.length===1&&V.set(1,Math.tan(k[0]*Math.PI/180),0,0,1,0,0,0,1);break;case"skewY":k.length===1&&V.set(1,0,0,Math.tan(k[0]*Math.PI/180),1,0,0,0,1);break;case"matrix":k.length===6&&V.set(k[0],k[2],k[4],k[1],k[3],k[5],0,0,1);break}}B.premultiply(V)}}return B}function N(W,B){function V(st){ft.set(st.x,st.y,1).applyMatrix3(B),st.set(ft.x,ft.y)}function O(st){const gt=st.xRadius,P=st.yRadius,k=Math.cos(st.aRotation),f=Math.sin(st.aRotation),F=new ot(gt*k,gt*f,0),U=new ot(-P*f,P*k,0),A=F.applyMatrix3(B),S=U.applyMatrix3(B),T=K.set(A.x,S.x,0,A.y,S.y,0,0,0,1),X=et.copy(T).invert(),H=$.copy(X).transpose().multiply(X).elements,Z=q(H[0],H[1],H[4]),J=Math.sqrt(Z.rt1),tt=Math.sqrt(Z.rt2);if(st.xRadius=1/J,st.yRadius=1/tt,st.aRotation=Math.atan2(Z.sn,Z.cs),!((st.aEndAngle-st.aStartAngle)%(2*Math.PI)<Number.EPSILON)){const ht=et.set(J,0,0,0,tt,0,0,0,1),St=$.set(Z.cs,Z.sn,0,-Z.sn,Z.cs,0,0,0,1),It=ht.multiply(St).multiply(T),vt=Et=>{const{x:wt,y:kt}=new ot(Math.cos(Et),Math.sin(Et),0).applyMatrix3(It);return Math.atan2(kt,wt)};st.aStartAngle=vt(st.aStartAngle),st.aEndAngle=vt(st.aEndAngle),L(B)&&(st.aClockwise=!st.aClockwise)}}function it(st){const gt=C(B),P=R(B);st.xRadius*=gt,st.yRadius*=P;const k=gt>Number.EPSILON?Math.atan2(B.elements[1],B.elements[0]):Math.atan2(-B.elements[3],B.elements[4]);st.aRotation+=k,L(B)&&(st.aStartAngle*=-1,st.aEndAngle*=-1,st.aClockwise=!st.aClockwise)}const ut=W.subPaths;for(let st=0,gt=ut.length;st<gt;st++){const k=ut[st].curves;for(let f=0;f<k.length;f++){const F=k[f];F.isLineCurve?(V(F.v1),V(F.v2)):F.isCubicBezierCurve?(V(F.v0),V(F.v1),V(F.v2),V(F.v3)):F.isQuadraticBezierCurve?(V(F.v0),V(F.v1),V(F.v2)):F.isEllipseCurve&&(rt.set(F.aX,F.aY),V(rt),F.aX=rt.x,F.aY=rt.y,z(B)?O(F):it(F))}}}function L(W){const B=W.elements;return B[0]*B[4]-B[1]*B[3]<0}function z(W){const B=W.elements,V=B[0]*B[3]+B[1]*B[4];if(V===0)return!1;const O=C(W),it=R(W);return Math.abs(V/(O*it))>Number.EPSILON}function C(W){const B=W.elements;return Math.sqrt(B[0]*B[0]+B[1]*B[1])}function R(W){const B=W.elements;return Math.sqrt(B[3]*B[3]+B[4]*B[4])}function q(W,B,V){let O,it,ut,st,gt;const P=W+V,k=W-V,f=Math.sqrt(k*k+4*B*B);return P>0?(O=.5*(P+f),gt=1/O,it=W*gt*V-B*gt*B):P<0?it=.5*(P-f):(O=.5*f,it=-.5*f),k>0?ut=k+f:ut=k-f,Math.abs(ut)>2*Math.abs(B)?(gt=-2*B/ut,st=1/Math.sqrt(1+gt*gt),ut=gt*st):Math.abs(B)===0?(ut=1,st=0):(gt=-.5*ut/B,ut=1/Math.sqrt(1+gt*gt),st=gt*ut),k>0&&(gt=ut,ut=-st,st=gt),{rt1:O,rt2:it,cs:ut,sn:st}}const I=[],j={},E=[],K=new zt,et=new zt,$=new zt,Y=new zt,rt=new xt,ft=new ot,Q=new zt,nt=new DOMParser().parseFromString(t,"image/svg+xml");return i(nt.documentElement,{fill:"#000",fillOpacity:1,strokeOpacity:1,strokeWidth:1,strokeLineJoin:"miter",strokeLineCap:"butt",strokeMiterLimit:4}),{paths:I,xml:nt.documentElement}}static createShapes(t){const i={ORIGIN:0,DESTINATION:1,BETWEEN:2,LEFT:3,RIGHT:4,BEHIND:5,BEYOND:6},r={loc:i.ORIGIN,t:0};function s(_,g,d,M){const y=_.x,x=g.x,D=d.x,N=M.x,L=_.y,z=g.y,C=d.y,R=M.y,q=(N-D)*(L-C)-(R-C)*(y-D),I=(x-y)*(L-C)-(z-L)*(y-D),j=(R-C)*(x-y)-(N-D)*(z-L),E=q/j,K=I/j;if(j===0&&q!==0||E<=0||E>=1||K<0||K>1)return null;if(q===0&&j===0){for(let et=0;et<2;et++)if(o(et===0?d:M,_,g),r.loc==i.ORIGIN){const $=et===0?d:M;return{x:$.x,y:$.y,t:r.t}}else if(r.loc==i.BETWEEN){const $=+(y+r.t*(x-y)).toPrecision(10),Y=+(L+r.t*(z-L)).toPrecision(10);return{x:$,y:Y,t:r.t}}return null}else{for(let Y=0;Y<2;Y++)if(o(Y===0?d:M,_,g),r.loc==i.ORIGIN){const rt=Y===0?d:M;return{x:rt.x,y:rt.y,t:r.t}}const et=+(y+E*(x-y)).toPrecision(10),$=+(L+E*(z-L)).toPrecision(10);return{x:et,y:$,t:E}}}function o(_,g,d){const M=d.x-g.x,y=d.y-g.y,x=_.x-g.x,D=_.y-g.y,N=M*D-x*y;if(_.x===g.x&&_.y===g.y){r.loc=i.ORIGIN,r.t=0;return}if(_.x===d.x&&_.y===d.y){r.loc=i.DESTINATION,r.t=1;return}if(N<-Number.EPSILON){r.loc=i.LEFT;return}if(N>Number.EPSILON){r.loc=i.RIGHT;return}if(M*x<0||y*D<0){r.loc=i.BEHIND;return}if(Math.sqrt(M*M+y*y)<Math.sqrt(x*x+D*D)){r.loc=i.BEYOND;return}let L;M!==0?L=x/M:L=D/y,r.loc=i.BETWEEN,r.t=L}function a(_,g){const d=[],M=[];for(let y=1;y<_.length;y++){const x=_[y-1],D=_[y];for(let N=1;N<g.length;N++){const L=g[N-1],z=g[N],C=s(x,D,L,z);C!==null&&d.find(R=>R.t<=C.t+Number.EPSILON&&R.t>=C.t-Number.EPSILON)===void 0&&(d.push(C),M.push(new xt(C.x,C.y)))}}return M}function l(_,g,d){const M=new xt;g.getCenter(M);const y=[];return d.forEach(x=>{x.boundingBox.containsPoint(M)&&a(_,x.points).forEach(N=>{y.push({identifier:x.identifier,isCW:x.isCW,point:N})})}),y.sort((x,D)=>x.point.x-D.point.x),y}function c(_,g,d,M,y){(y==null||y==="")&&(y="nonzero");const x=new xt;_.boundingBox.getCenter(x);const D=[new xt(d,x.y),new xt(M,x.y)],N=l(D,_.boundingBox,g);N.sort((I,j)=>I.point.x-j.point.x);const L=[],z=[];N.forEach(I=>{I.identifier===_.identifier?L.push(I):z.push(I)});const C=L[0].point.x,R=[];let q=0;for(;q<z.length&&z[q].point.x<C;)R.length>0&&R[R.length-1]===z[q].identifier?R.pop():R.push(z[q].identifier),q++;if(R.push(_.identifier),y==="evenodd"){const I=R.length%2===0,j=R[R.length-2];return{identifier:_.identifier,isHole:I,for:j}}else if(y==="nonzero"){let I=!0,j=null,E=null;for(let K=0;K<R.length;K++){const et=R[K];I?(E=g[et].isCW,I=!1,j=et):E!==g[et].isCW&&(E=g[et].isCW,I=!0)}return{identifier:_.identifier,isHole:I,for:j}}else console.warn('fill-rule: "'+y+'" is currently not implemented.')}let u=999999999,h=-999999999,m=t.subPaths.map(_=>{const g=_.getPoints();let d=-999999999,M=999999999,y=-999999999,x=999999999;for(let D=0;D<g.length;D++){const N=g[D];N.y>d&&(d=N.y),N.y<M&&(M=N.y),N.x>y&&(y=N.x),N.x<x&&(x=N.x)}return h<=y&&(h=y+1),u>=x&&(u=x-1),{curves:_.curves,points:g,isCW:Ni.isClockWise(g),identifier:-1,boundingBox:new xb(new xt(x,M),new xt(y,d))}});m=m.filter(_=>_.points.length>1);for(let _=0;_<m.length;_++)m[_].identifier=_;const p=m.map(_=>c(_,m,u,h,t.userData?t.userData.style.fillRule:void 0)),v=[];return m.forEach(_=>{if(!p[_.identifier].isHole){const d=new yr;d.curves=_.curves,p.filter(y=>y.isHole&&y.for===_.identifier).forEach(y=>{const x=m[y.identifier],D=new fi;D.curves=x.curves,d.holes.push(D)}),v.push(d)}}),v}static getStrokeStyle(t,e,i,r,s){return t=t!==void 0?t:1,e=e!==void 0?e:"#000",i=i!==void 0?i:"miter",r=r!==void 0?r:"butt",s=s!==void 0?s:4,{strokeColor:e,strokeWidth:t,strokeLineJoin:i,strokeLineCap:r,strokeMiterLimit:s}}static pointsToStroke(t,e,i,r){const s=[],o=[],a=[];if(xo.pointsToStrokeWithBuffers(t,e,i,r,s,o,a)===0)return null;const l=new en;return l.setAttribute("position",new Se(s,3)),l.setAttribute("normal",new Se(o,3)),l.setAttribute("uv",new Se(a,2)),l}static pointsToStrokeWithBuffers(t,e,i,r,s,o,a,l){const c=new xt,u=new xt,h=new xt,m=new xt,p=new xt,v=new xt,_=new xt,g=new xt,d=new xt,M=new xt,y=new xt,x=new xt,D=new xt,N=new xt,L=new xt,z=new xt,C=new xt;i=i!==void 0?i:12,r=r!==void 0?r:.001,l=l!==void 0?l:0,t=k(t);const R=t.length;if(R<2)return 0;const q=t[0].equals(t[R-1]);let I,j=t[0],E;const K=e.strokeWidth/2,et=1/(R-1);let $=0,Y,rt,ft,Q,nt=!1,bt=0,W=l*3,B=l*2;V(t[0],t[1],c).multiplyScalar(K),g.copy(t[0]).sub(c),d.copy(t[0]).add(c),M.copy(g),y.copy(d);for(let f=1;f<R;f++){I=t[f],f===R-1?q?E=t[1]:E=void 0:E=t[f+1];const F=c;if(V(j,I,F),h.copy(F).multiplyScalar(K),x.copy(I).sub(h),D.copy(I).add(h),Y=$+et,rt=!1,E!==void 0){V(I,E,u),h.copy(u).multiplyScalar(K),N.copy(I).sub(h),L.copy(I).add(h),ft=!0,h.subVectors(E,j),F.dot(h)<0&&(ft=!1),f===1&&(nt=ft),h.subVectors(E,I),h.normalize();const U=Math.abs(F.dot(h));if(U>Number.EPSILON){const A=K/U;h.multiplyScalar(-A),m.subVectors(I,j),p.copy(m).setLength(A).add(h),z.copy(p).negate();const S=p.length(),T=m.length();m.divideScalar(T),v.subVectors(E,I);const X=v.length();switch(v.divideScalar(X),m.dot(z)<T&&v.dot(z)<X&&(rt=!0),C.copy(p).add(I),z.add(I),Q=!1,rt?ft?(L.copy(z),D.copy(z)):(N.copy(z),x.copy(z)):ut(),e.strokeLineJoin){case"bevel":st(ft,rt,Y);break;case"round":gt(ft,rt),ft?it(I,x,N,Y,0):it(I,L,D,Y,1);break;case"miter":case"miter-clip":default:const w=K*e.strokeMiterLimit/S;if(w<1)if(e.strokeLineJoin!=="miter-clip"){st(ft,rt,Y);break}else gt(ft,rt),ft?(v.subVectors(C,x).multiplyScalar(w).add(x),_.subVectors(C,N).multiplyScalar(w).add(N),O(x,Y,0),O(v,Y,0),O(I,Y,.5),O(I,Y,.5),O(v,Y,0),O(_,Y,0),O(I,Y,.5),O(_,Y,0),O(N,Y,0)):(v.subVectors(C,D).multiplyScalar(w).add(D),_.subVectors(C,L).multiplyScalar(w).add(L),O(D,Y,1),O(v,Y,1),O(I,Y,.5),O(I,Y,.5),O(v,Y,1),O(_,Y,1),O(I,Y,.5),O(_,Y,1),O(L,Y,1));else rt?(ft?(O(d,$,1),O(g,$,0),O(C,Y,0),O(d,$,1),O(C,Y,0),O(z,Y,1)):(O(d,$,1),O(g,$,0),O(C,Y,1),O(g,$,0),O(z,Y,0),O(C,Y,1)),ft?N.copy(C):L.copy(C)):ft?(O(x,Y,0),O(C,Y,0),O(I,Y,.5),O(I,Y,.5),O(C,Y,0),O(N,Y,0)):(O(D,Y,1),O(C,Y,1),O(I,Y,.5),O(I,Y,.5),O(C,Y,1),O(L,Y,1)),Q=!0;break}}else ut()}else ut();!q&&f===R-1&&P(t[0],M,y,ft,!0,$),$=Y,j=I,g.copy(N),d.copy(L)}if(!q)P(I,x,D,ft,!1,Y);else if(rt&&s){let f=C,F=z;nt!==ft&&(f=z,F=C),ft?(Q||nt)&&(F.toArray(s,0),F.toArray(s,9),Q&&f.toArray(s,3)):(Q||!nt)&&(F.toArray(s,3),F.toArray(s,9),Q&&f.toArray(s,0))}return bt;function V(f,F,U){return U.subVectors(F,f),U.set(-U.y,U.x).normalize()}function O(f,F,U){s&&(s[W]=f.x,s[W+1]=f.y,s[W+2]=0,o&&(o[W]=0,o[W+1]=0,o[W+2]=1),W+=3,a&&(a[B]=F,a[B+1]=U,B+=2)),bt+=3}function it(f,F,U,A,S){c.copy(F).sub(f).normalize(),u.copy(U).sub(f).normalize();let T=Math.PI;const X=c.dot(u);Math.abs(X)<1&&(T=Math.abs(Math.acos(X))),T/=i,h.copy(F);for(let w=0,b=i-1;w<b;w++)m.copy(h).rotateAround(f,T),O(h,A,S),O(m,A,S),O(f,A,.5),h.copy(m);O(m,A,S),O(U,A,S),O(f,A,.5)}function ut(){O(d,$,1),O(g,$,0),O(x,Y,0),O(d,$,1),O(x,Y,0),O(D,Y,1)}function st(f,F,U){F?f?(O(d,$,1),O(g,$,0),O(x,Y,0),O(d,$,1),O(x,Y,0),O(z,Y,1),O(x,U,0),O(N,U,0),O(z,U,.5)):(O(d,$,1),O(g,$,0),O(D,Y,1),O(g,$,0),O(z,Y,0),O(D,Y,1),O(D,U,1),O(z,U,0),O(L,U,1)):f?(O(x,U,0),O(N,U,0),O(I,U,.5)):(O(D,U,1),O(L,U,0),O(I,U,.5))}function gt(f,F){F&&(f?(O(d,$,1),O(g,$,0),O(x,Y,0),O(d,$,1),O(x,Y,0),O(z,Y,1),O(x,$,0),O(I,Y,.5),O(z,Y,1),O(I,Y,.5),O(N,$,0),O(z,Y,1)):(O(d,$,1),O(g,$,0),O(D,Y,1),O(g,$,0),O(z,Y,0),O(D,Y,1),O(D,$,1),O(z,Y,0),O(I,Y,.5),O(I,Y,.5),O(z,Y,0),O(L,$,1)))}function P(f,F,U,A,S,T){switch(e.strokeLineCap){case"round":S?it(f,U,F,T,.5):it(f,F,U,T,.5);break;case"square":if(S)c.subVectors(F,f),u.set(c.y,-c.x),h.addVectors(c,u).add(f),m.subVectors(u,c).add(f),A?(h.toArray(s,3),m.toArray(s,0),m.toArray(s,9)):(h.toArray(s,3),a[7]===1?m.toArray(s,9):h.toArray(s,9),m.toArray(s,0));else{c.subVectors(U,f),u.set(c.y,-c.x),h.addVectors(c,u).add(f),m.subVectors(u,c).add(f);const X=s.length;A?(h.toArray(s,X-3),m.toArray(s,X-6),m.toArray(s,X-12)):(m.toArray(s,X-6),h.toArray(s,X-3),m.toArray(s,X-12))}break}}function k(f){let F=!1;for(let A=1,S=f.length-1;A<S;A++)if(f[A].distanceTo(f[A+1])<r){F=!0;break}if(!F)return f;const U=[];U.push(f[0]);for(let A=1,S=f.length-1;A<S;A++)f[A].distanceTo(f[A+1])>=r&&U.push(f[A]);return U.push(f[f.length-1]),U}}}function jb(n){var r,s;const e=new xo().parse(n),i=new Map;for(const o of e.paths){if(((s=(r=o.userData)==null?void 0:r.style)==null?void 0:s.fill)==="none")continue;const l=xo.createShapes(o);if(l.length===0)continue;const c="#"+o.color.getHexString(),u=i.get(c);u?(u.shapes.push(...l),u.pathCount+=1):i.set(c,{id:c,color:c,shapes:l,pathCount:1})}return Array.from(i.values())}function qb(){const n=Je([]),t=Je(null);function e(i){t.value=null;try{const r=jb(i);r.length===0?(t.value="No filled paths found",n.value=[]):n.value=r}catch{t.value="Failed to parse SVG",n.value=[]}}return{colorGroups:n,error:t,parse:e}}var $s=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Yb(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function Zs(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Pa={exports:{}};/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/var dh;function $b(){return dh||(dh=1,(function(n,t){(function(e){n.exports=e()})(function(){return(function e(i,r,s){function o(c,u){if(!r[c]){if(!i[c]){var h=typeof Zs=="function"&&Zs;if(!u&&h)return h(c,!0);if(a)return a(c,!0);var m=new Error("Cannot find module '"+c+"'");throw m.code="MODULE_NOT_FOUND",m}var p=r[c]={exports:{}};i[c][0].call(p.exports,function(v){var _=i[c][1][v];return o(_||v)},p,p.exports,e,i,r,s)}return r[c].exports}for(var a=typeof Zs=="function"&&Zs,l=0;l<s.length;l++)o(s[l]);return o})({1:[function(e,i,r){var s=e("./utils"),o=e("./support"),a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(l){for(var c,u,h,m,p,v,_,g=[],d=0,M=l.length,y=M,x=s.getTypeOf(l)!=="string";d<l.length;)y=M-d,h=x?(c=l[d++],u=d<M?l[d++]:0,d<M?l[d++]:0):(c=l.charCodeAt(d++),u=d<M?l.charCodeAt(d++):0,d<M?l.charCodeAt(d++):0),m=c>>2,p=(3&c)<<4|u>>4,v=1<y?(15&u)<<2|h>>6:64,_=2<y?63&h:64,g.push(a.charAt(m)+a.charAt(p)+a.charAt(v)+a.charAt(_));return g.join("")},r.decode=function(l){var c,u,h,m,p,v,_=0,g=0,d="data:";if(l.substr(0,d.length)===d)throw new Error("Invalid base64 input, it looks like a data url.");var M,y=3*(l=l.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(l.charAt(l.length-1)===a.charAt(64)&&y--,l.charAt(l.length-2)===a.charAt(64)&&y--,y%1!=0)throw new Error("Invalid base64 input, bad content length.");for(M=o.uint8array?new Uint8Array(0|y):new Array(0|y);_<l.length;)c=a.indexOf(l.charAt(_++))<<2|(m=a.indexOf(l.charAt(_++)))>>4,u=(15&m)<<4|(p=a.indexOf(l.charAt(_++)))>>2,h=(3&p)<<6|(v=a.indexOf(l.charAt(_++))),M[g++]=c,p!==64&&(M[g++]=u),v!==64&&(M[g++]=h);return M}},{"./support":30,"./utils":32}],2:[function(e,i,r){var s=e("./external"),o=e("./stream/DataWorker"),a=e("./stream/Crc32Probe"),l=e("./stream/DataLengthProbe");function c(u,h,m,p,v){this.compressedSize=u,this.uncompressedSize=h,this.crc32=m,this.compression=p,this.compressedContent=v}c.prototype={getContentWorker:function(){var u=new o(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")),h=this;return u.on("end",function(){if(this.streamInfo.data_length!==h.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),u},getCompressedWorker:function(){return new o(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},c.createWorkerFrom=function(u,h,m){return u.pipe(new a).pipe(new l("uncompressedSize")).pipe(h.compressWorker(m)).pipe(new l("compressedSize")).withStreamInfo("compression",h)},i.exports=c},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,i,r){var s=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new s("STORE compression")},uncompressWorker:function(){return new s("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,i,r){var s=e("./utils"),o=(function(){for(var a,l=[],c=0;c<256;c++){a=c;for(var u=0;u<8;u++)a=1&a?3988292384^a>>>1:a>>>1;l[c]=a}return l})();i.exports=function(a,l){return a!==void 0&&a.length?s.getTypeOf(a)!=="string"?(function(c,u,h,m){var p=o,v=m+h;c^=-1;for(var _=m;_<v;_++)c=c>>>8^p[255&(c^u[_])];return-1^c})(0|l,a,a.length,0):(function(c,u,h,m){var p=o,v=m+h;c^=-1;for(var _=m;_<v;_++)c=c>>>8^p[255&(c^u.charCodeAt(_))];return-1^c})(0|l,a,a.length,0):0}},{"./utils":32}],5:[function(e,i,r){r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,i,r){var s=null;s=typeof Promise<"u"?Promise:e("lie"),i.exports={Promise:s}},{lie:37}],7:[function(e,i,r){var s=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",o=e("pako"),a=e("./utils"),l=e("./stream/GenericWorker"),c=s?"uint8array":"array";function u(h,m){l.call(this,"FlateWorker/"+h),this._pako=null,this._pakoAction=h,this._pakoOptions=m,this.meta={}}r.magic="\b\0",a.inherits(u,l),u.prototype.processChunk=function(h){this.meta=h.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(c,h.data),!1)},u.prototype.flush=function(){l.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},u.prototype.cleanUp=function(){l.prototype.cleanUp.call(this),this._pako=null},u.prototype._createPako=function(){this._pako=new o[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var h=this;this._pako.onData=function(m){h.push({data:m,meta:h.meta})}},r.compressWorker=function(h){return new u("Deflate",h)},r.uncompressWorker=function(){return new u("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,i,r){function s(p,v){var _,g="";for(_=0;_<v;_++)g+=String.fromCharCode(255&p),p>>>=8;return g}function o(p,v,_,g,d,M){var y,x,D=p.file,N=p.compression,L=M!==c.utf8encode,z=a.transformTo("string",M(D.name)),C=a.transformTo("string",c.utf8encode(D.name)),R=D.comment,q=a.transformTo("string",M(R)),I=a.transformTo("string",c.utf8encode(R)),j=C.length!==D.name.length,E=I.length!==R.length,K="",et="",$="",Y=D.dir,rt=D.date,ft={crc32:0,compressedSize:0,uncompressedSize:0};v&&!_||(ft.crc32=p.crc32,ft.compressedSize=p.compressedSize,ft.uncompressedSize=p.uncompressedSize);var Q=0;v&&(Q|=8),L||!j&&!E||(Q|=2048);var nt=0,bt=0;Y&&(nt|=16),d==="UNIX"?(bt=798,nt|=(function(B,V){var O=B;return B||(O=V?16893:33204),(65535&O)<<16})(D.unixPermissions,Y)):(bt=20,nt|=(function(B){return 63&(B||0)})(D.dosPermissions)),y=rt.getUTCHours(),y<<=6,y|=rt.getUTCMinutes(),y<<=5,y|=rt.getUTCSeconds()/2,x=rt.getUTCFullYear()-1980,x<<=4,x|=rt.getUTCMonth()+1,x<<=5,x|=rt.getUTCDate(),j&&(et=s(1,1)+s(u(z),4)+C,K+="up"+s(et.length,2)+et),E&&($=s(1,1)+s(u(q),4)+I,K+="uc"+s($.length,2)+$);var W="";return W+=`
\0`,W+=s(Q,2),W+=N.magic,W+=s(y,2),W+=s(x,2),W+=s(ft.crc32,4),W+=s(ft.compressedSize,4),W+=s(ft.uncompressedSize,4),W+=s(z.length,2),W+=s(K.length,2),{fileRecord:h.LOCAL_FILE_HEADER+W+z+K,dirRecord:h.CENTRAL_FILE_HEADER+s(bt,2)+W+s(q.length,2)+"\0\0\0\0"+s(nt,4)+s(g,4)+z+K+q}}var a=e("../utils"),l=e("../stream/GenericWorker"),c=e("../utf8"),u=e("../crc32"),h=e("../signature");function m(p,v,_,g){l.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=v,this.zipPlatform=_,this.encodeFileName=g,this.streamFiles=p,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(m,l),m.prototype.push=function(p){var v=p.meta.percent||0,_=this.entriesCount,g=this._sources.length;this.accumulate?this.contentBuffer.push(p):(this.bytesWritten+=p.data.length,l.prototype.push.call(this,{data:p.data,meta:{currentFile:this.currentFile,percent:_?(v+100*(_-g-1))/_:100}}))},m.prototype.openedSource=function(p){this.currentSourceOffset=this.bytesWritten,this.currentFile=p.file.name;var v=this.streamFiles&&!p.file.dir;if(v){var _=o(p,v,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:_.fileRecord,meta:{percent:0}})}else this.accumulate=!0},m.prototype.closedSource=function(p){this.accumulate=!1;var v=this.streamFiles&&!p.file.dir,_=o(p,v,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(_.dirRecord),v)this.push({data:(function(g){return h.DATA_DESCRIPTOR+s(g.crc32,4)+s(g.compressedSize,4)+s(g.uncompressedSize,4)})(p),meta:{percent:100}});else for(this.push({data:_.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},m.prototype.flush=function(){for(var p=this.bytesWritten,v=0;v<this.dirRecords.length;v++)this.push({data:this.dirRecords[v],meta:{percent:100}});var _=this.bytesWritten-p,g=(function(d,M,y,x,D){var N=a.transformTo("string",D(x));return h.CENTRAL_DIRECTORY_END+"\0\0\0\0"+s(d,2)+s(d,2)+s(M,4)+s(y,4)+s(N.length,2)+N})(this.dirRecords.length,_,p,this.zipComment,this.encodeFileName);this.push({data:g,meta:{percent:100}})},m.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},m.prototype.registerPrevious=function(p){this._sources.push(p);var v=this;return p.on("data",function(_){v.processChunk(_)}),p.on("end",function(){v.closedSource(v.previous.streamInfo),v._sources.length?v.prepareNextSource():v.end()}),p.on("error",function(_){v.error(_)}),this},m.prototype.resume=function(){return!!l.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},m.prototype.error=function(p){var v=this._sources;if(!l.prototype.error.call(this,p))return!1;for(var _=0;_<v.length;_++)try{v[_].error(p)}catch{}return!0},m.prototype.lock=function(){l.prototype.lock.call(this);for(var p=this._sources,v=0;v<p.length;v++)p[v].lock()},i.exports=m},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,i,r){var s=e("../compressions"),o=e("./ZipFileWorker");r.generateWorker=function(a,l,c){var u=new o(l.streamFiles,c,l.platform,l.encodeFileName),h=0;try{a.forEach(function(m,p){h++;var v=(function(M,y){var x=M||y,D=s[x];if(!D)throw new Error(x+" is not a valid compression method !");return D})(p.options.compression,l.compression),_=p.options.compressionOptions||l.compressionOptions||{},g=p.dir,d=p.date;p._compressWorker(v,_).withStreamInfo("file",{name:m,dir:g,date:d,comment:p.comment||"",unixPermissions:p.unixPermissions,dosPermissions:p.dosPermissions}).pipe(u)}),u.entriesCount=h}catch(m){u.error(m)}return u}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,i,r){function s(){if(!(this instanceof s))return new s;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var o=new s;for(var a in this)typeof this[a]!="function"&&(o[a]=this[a]);return o}}(s.prototype=e("./object")).loadAsync=e("./load"),s.support=e("./support"),s.defaults=e("./defaults"),s.version="3.10.1",s.loadAsync=function(o,a){return new s().loadAsync(o,a)},s.external=e("./external"),i.exports=s},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,i,r){var s=e("./utils"),o=e("./external"),a=e("./utf8"),l=e("./zipEntries"),c=e("./stream/Crc32Probe"),u=e("./nodejsUtils");function h(m){return new o.Promise(function(p,v){var _=m.decompressed.getContentWorker().pipe(new c);_.on("error",function(g){v(g)}).on("end",function(){_.streamInfo.crc32!==m.decompressed.crc32?v(new Error("Corrupted zip : CRC32 mismatch")):p()}).resume()})}i.exports=function(m,p){var v=this;return p=s.extend(p||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),u.isNode&&u.isStream(m)?o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):s.prepareContent("the loaded zip file",m,!0,p.optimizedBinaryString,p.base64).then(function(_){var g=new l(p);return g.load(_),g}).then(function(_){var g=[o.Promise.resolve(_)],d=_.files;if(p.checkCRC32)for(var M=0;M<d.length;M++)g.push(h(d[M]));return o.Promise.all(g)}).then(function(_){for(var g=_.shift(),d=g.files,M=0;M<d.length;M++){var y=d[M],x=y.fileNameStr,D=s.resolve(y.fileNameStr);v.file(D,y.decompressed,{binary:!0,optimizedBinaryString:!0,date:y.date,dir:y.dir,comment:y.fileCommentStr.length?y.fileCommentStr:null,unixPermissions:y.unixPermissions,dosPermissions:y.dosPermissions,createFolders:p.createFolders}),y.dir||(v.file(D).unsafeOriginalName=x)}return g.zipComment.length&&(v.comment=g.zipComment),v})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,i,r){var s=e("../utils"),o=e("../stream/GenericWorker");function a(l,c){o.call(this,"Nodejs stream input adapter for "+l),this._upstreamEnded=!1,this._bindStream(c)}s.inherits(a,o),a.prototype._bindStream=function(l){var c=this;(this._stream=l).pause(),l.on("data",function(u){c.push({data:u,meta:{percent:0}})}).on("error",function(u){c.isPaused?this.generatedError=u:c.error(u)}).on("end",function(){c.isPaused?c._upstreamEnded=!0:c.end()})},a.prototype.pause=function(){return!!o.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},i.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,i,r){var s=e("readable-stream").Readable;function o(a,l,c){s.call(this,l),this._helper=a;var u=this;a.on("data",function(h,m){u.push(h)||u._helper.pause(),c&&c(m)}).on("error",function(h){u.emit("error",h)}).on("end",function(){u.push(null)})}e("../utils").inherits(o,s),o.prototype._read=function(){this._helper.resume()},i.exports=o},{"../utils":32,"readable-stream":16}],14:[function(e,i,r){i.exports={isNode:typeof Buffer<"u",newBufferFrom:function(s,o){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(s,o);if(typeof s=="number")throw new Error('The "data" argument must not be a number');return new Buffer(s,o)},allocBuffer:function(s){if(Buffer.alloc)return Buffer.alloc(s);var o=new Buffer(s);return o.fill(0),o},isBuffer:function(s){return Buffer.isBuffer(s)},isStream:function(s){return s&&typeof s.on=="function"&&typeof s.pause=="function"&&typeof s.resume=="function"}}},{}],15:[function(e,i,r){function s(D,N,L){var z,C=a.getTypeOf(N),R=a.extend(L||{},u);R.date=R.date||new Date,R.compression!==null&&(R.compression=R.compression.toUpperCase()),typeof R.unixPermissions=="string"&&(R.unixPermissions=parseInt(R.unixPermissions,8)),R.unixPermissions&&16384&R.unixPermissions&&(R.dir=!0),R.dosPermissions&&16&R.dosPermissions&&(R.dir=!0),R.dir&&(D=d(D)),R.createFolders&&(z=g(D))&&M.call(this,z,!0);var q=C==="string"&&R.binary===!1&&R.base64===!1;L&&L.binary!==void 0||(R.binary=!q),(N instanceof h&&N.uncompressedSize===0||R.dir||!N||N.length===0)&&(R.base64=!1,R.binary=!0,N="",R.compression="STORE",C="string");var I=null;I=N instanceof h||N instanceof l?N:v.isNode&&v.isStream(N)?new _(D,N):a.prepareContent(D,N,R.binary,R.optimizedBinaryString,R.base64);var j=new m(D,I,R);this.files[D]=j}var o=e("./utf8"),a=e("./utils"),l=e("./stream/GenericWorker"),c=e("./stream/StreamHelper"),u=e("./defaults"),h=e("./compressedObject"),m=e("./zipObject"),p=e("./generate"),v=e("./nodejsUtils"),_=e("./nodejs/NodejsStreamInputAdapter"),g=function(D){D.slice(-1)==="/"&&(D=D.substring(0,D.length-1));var N=D.lastIndexOf("/");return 0<N?D.substring(0,N):""},d=function(D){return D.slice(-1)!=="/"&&(D+="/"),D},M=function(D,N){return N=N!==void 0?N:u.createFolders,D=d(D),this.files[D]||s.call(this,D,null,{dir:!0,createFolders:N}),this.files[D]};function y(D){return Object.prototype.toString.call(D)==="[object RegExp]"}var x={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(D){var N,L,z;for(N in this.files)z=this.files[N],(L=N.slice(this.root.length,N.length))&&N.slice(0,this.root.length)===this.root&&D(L,z)},filter:function(D){var N=[];return this.forEach(function(L,z){D(L,z)&&N.push(z)}),N},file:function(D,N,L){if(arguments.length!==1)return D=this.root+D,s.call(this,D,N,L),this;if(y(D)){var z=D;return this.filter(function(R,q){return!q.dir&&z.test(R)})}var C=this.files[this.root+D];return C&&!C.dir?C:null},folder:function(D){if(!D)return this;if(y(D))return this.filter(function(C,R){return R.dir&&D.test(C)});var N=this.root+D,L=M.call(this,N),z=this.clone();return z.root=L.name,z},remove:function(D){D=this.root+D;var N=this.files[D];if(N||(D.slice(-1)!=="/"&&(D+="/"),N=this.files[D]),N&&!N.dir)delete this.files[D];else for(var L=this.filter(function(C,R){return R.name.slice(0,D.length)===D}),z=0;z<L.length;z++)delete this.files[L[z].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(D){var N,L={};try{if((L=a.extend(D||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:o.utf8encode})).type=L.type.toLowerCase(),L.compression=L.compression.toUpperCase(),L.type==="binarystring"&&(L.type="string"),!L.type)throw new Error("No output type specified.");a.checkSupport(L.type),L.platform!=="darwin"&&L.platform!=="freebsd"&&L.platform!=="linux"&&L.platform!=="sunos"||(L.platform="UNIX"),L.platform==="win32"&&(L.platform="DOS");var z=L.comment||this.comment||"";N=p.generateWorker(this,L,z)}catch(C){(N=new l("error")).error(C)}return new c(N,L.type||"string",L.mimeType)},generateAsync:function(D,N){return this.generateInternalStream(D).accumulate(N)},generateNodeStream:function(D,N){return(D=D||{}).type||(D.type="nodebuffer"),this.generateInternalStream(D).toNodejsStream(N)}};i.exports=x},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,i,r){i.exports=e("stream")},{stream:void 0}],17:[function(e,i,r){var s=e("./DataReader");function o(a){s.call(this,a);for(var l=0;l<this.data.length;l++)a[l]=255&a[l]}e("../utils").inherits(o,s),o.prototype.byteAt=function(a){return this.data[this.zero+a]},o.prototype.lastIndexOfSignature=function(a){for(var l=a.charCodeAt(0),c=a.charCodeAt(1),u=a.charCodeAt(2),h=a.charCodeAt(3),m=this.length-4;0<=m;--m)if(this.data[m]===l&&this.data[m+1]===c&&this.data[m+2]===u&&this.data[m+3]===h)return m-this.zero;return-1},o.prototype.readAndCheckSignature=function(a){var l=a.charCodeAt(0),c=a.charCodeAt(1),u=a.charCodeAt(2),h=a.charCodeAt(3),m=this.readData(4);return l===m[0]&&c===m[1]&&u===m[2]&&h===m[3]},o.prototype.readData=function(a){if(this.checkOffset(a),a===0)return[];var l=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},i.exports=o},{"../utils":32,"./DataReader":18}],18:[function(e,i,r){var s=e("../utils");function o(a){this.data=a,this.length=a.length,this.index=0,this.zero=0}o.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<this.zero+a||a<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var l,c=0;for(this.checkOffset(a),l=this.index+a-1;l>=this.index;l--)c=(c<<8)+this.byteAt(l);return this.index+=a,c},readString:function(a){return s.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date(Date.UTC(1980+(a>>25&127),(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1))}},i.exports=o},{"../utils":32}],19:[function(e,i,r){var s=e("./Uint8ArrayReader");function o(a){s.call(this,a)}e("../utils").inherits(o,s),o.prototype.readData=function(a){this.checkOffset(a);var l=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},i.exports=o},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,i,r){var s=e("./DataReader");function o(a){s.call(this,a)}e("../utils").inherits(o,s),o.prototype.byteAt=function(a){return this.data.charCodeAt(this.zero+a)},o.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)-this.zero},o.prototype.readAndCheckSignature=function(a){return a===this.readData(4)},o.prototype.readData=function(a){this.checkOffset(a);var l=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},i.exports=o},{"../utils":32,"./DataReader":18}],21:[function(e,i,r){var s=e("./ArrayReader");function o(a){s.call(this,a)}e("../utils").inherits(o,s),o.prototype.readData=function(a){if(this.checkOffset(a),a===0)return new Uint8Array(0);var l=this.data.subarray(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},i.exports=o},{"../utils":32,"./ArrayReader":17}],22:[function(e,i,r){var s=e("../utils"),o=e("../support"),a=e("./ArrayReader"),l=e("./StringReader"),c=e("./NodeBufferReader"),u=e("./Uint8ArrayReader");i.exports=function(h){var m=s.getTypeOf(h);return s.checkSupport(m),m!=="string"||o.uint8array?m==="nodebuffer"?new c(h):o.uint8array?new u(s.transformTo("uint8array",h)):new a(s.transformTo("array",h)):new l(h)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,i,r){r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(e,i,r){var s=e("./GenericWorker"),o=e("../utils");function a(l){s.call(this,"ConvertWorker to "+l),this.destType=l}o.inherits(a,s),a.prototype.processChunk=function(l){this.push({data:o.transformTo(this.destType,l.data),meta:l.meta})},i.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(e,i,r){var s=e("./GenericWorker"),o=e("../crc32");function a(){s.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(a,s),a.prototype.processChunk=function(l){this.streamInfo.crc32=o(l.data,this.streamInfo.crc32||0),this.push(l)},i.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,i,r){var s=e("../utils"),o=e("./GenericWorker");function a(l){o.call(this,"DataLengthProbe for "+l),this.propName=l,this.withStreamInfo(l,0)}s.inherits(a,o),a.prototype.processChunk=function(l){if(l){var c=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=c+l.data.length}o.prototype.processChunk.call(this,l)},i.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(e,i,r){var s=e("../utils"),o=e("./GenericWorker");function a(l){o.call(this,"DataWorker");var c=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,l.then(function(u){c.dataIsReady=!0,c.data=u,c.max=u&&u.length||0,c.type=s.getTypeOf(u),c.isPaused||c._tickAndRepeat()},function(u){c.error(u)})}s.inherits(a,o),a.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,s.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(s.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var l=null,c=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":l=this.data.substring(this.index,c);break;case"uint8array":l=this.data.subarray(this.index,c);break;case"array":case"nodebuffer":l=this.data.slice(this.index,c)}return this.index=c,this.push({data:l,meta:{percent:this.max?this.index/this.max*100:0}})},i.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(e,i,r){function s(o){this.name=o||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}s.prototype={push:function(o){this.emit("data",o)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(o){this.emit("error",o)}return!0},error:function(o){return!this.isFinished&&(this.isPaused?this.generatedError=o:(this.isFinished=!0,this.emit("error",o),this.previous&&this.previous.error(o),this.cleanUp()),!0)},on:function(o,a){return this._listeners[o].push(a),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(o,a){if(this._listeners[o])for(var l=0;l<this._listeners[o].length;l++)this._listeners[o][l].call(this,a)},pipe:function(o){return o.registerPrevious(this)},registerPrevious:function(o){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=o.streamInfo,this.mergeStreamInfo(),this.previous=o;var a=this;return o.on("data",function(l){a.processChunk(l)}),o.on("end",function(){a.end()}),o.on("error",function(l){a.error(l)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var o=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),o=!0),this.previous&&this.previous.resume(),!o},flush:function(){},processChunk:function(o){this.push(o)},withStreamInfo:function(o,a){return this.extraStreamInfo[o]=a,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var o in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,o)&&(this.streamInfo[o]=this.extraStreamInfo[o])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var o="Worker "+this.name;return this.previous?this.previous+" -> "+o:o}},i.exports=s},{}],29:[function(e,i,r){var s=e("../utils"),o=e("./ConvertWorker"),a=e("./GenericWorker"),l=e("../base64"),c=e("../support"),u=e("../external"),h=null;if(c.nodestream)try{h=e("../nodejs/NodejsStreamOutputAdapter")}catch{}function m(v,_){return new u.Promise(function(g,d){var M=[],y=v._internalType,x=v._outputType,D=v._mimeType;v.on("data",function(N,L){M.push(N),_&&_(L)}).on("error",function(N){M=[],d(N)}).on("end",function(){try{var N=(function(L,z,C){switch(L){case"blob":return s.newBlob(s.transformTo("arraybuffer",z),C);case"base64":return l.encode(z);default:return s.transformTo(L,z)}})(x,(function(L,z){var C,R=0,q=null,I=0;for(C=0;C<z.length;C++)I+=z[C].length;switch(L){case"string":return z.join("");case"array":return Array.prototype.concat.apply([],z);case"uint8array":for(q=new Uint8Array(I),C=0;C<z.length;C++)q.set(z[C],R),R+=z[C].length;return q;case"nodebuffer":return Buffer.concat(z);default:throw new Error("concat : unsupported type '"+L+"'")}})(y,M),D);g(N)}catch(L){d(L)}M=[]}).resume()})}function p(v,_,g){var d=_;switch(_){case"blob":case"arraybuffer":d="uint8array";break;case"base64":d="string"}try{this._internalType=d,this._outputType=_,this._mimeType=g,s.checkSupport(d),this._worker=v.pipe(new o(d)),v.lock()}catch(M){this._worker=new a("error"),this._worker.error(M)}}p.prototype={accumulate:function(v){return m(this,v)},on:function(v,_){var g=this;return v==="data"?this._worker.on(v,function(d){_.call(g,d.data,d.meta)}):this._worker.on(v,function(){s.delay(_,arguments,g)}),this},resume:function(){return s.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(v){if(s.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new h(this,{objectMode:this._outputType!=="nodebuffer"},v)}},i.exports=p},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,i,r){if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",r.nodebuffer=typeof Buffer<"u",r.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")r.blob=!1;else{var s=new ArrayBuffer(0);try{r.blob=new Blob([s],{type:"application/zip"}).size===0}catch{try{var o=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);o.append(s),r.blob=o.getBlob("application/zip").size===0}catch{r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch{r.nodestream=!1}},{"readable-stream":16}],31:[function(e,i,r){for(var s=e("./utils"),o=e("./support"),a=e("./nodejsUtils"),l=e("./stream/GenericWorker"),c=new Array(256),u=0;u<256;u++)c[u]=252<=u?6:248<=u?5:240<=u?4:224<=u?3:192<=u?2:1;c[254]=c[254]=1;function h(){l.call(this,"utf-8 decode"),this.leftOver=null}function m(){l.call(this,"utf-8 encode")}r.utf8encode=function(p){return o.nodebuffer?a.newBufferFrom(p,"utf-8"):(function(v){var _,g,d,M,y,x=v.length,D=0;for(M=0;M<x;M++)(64512&(g=v.charCodeAt(M)))==55296&&M+1<x&&(64512&(d=v.charCodeAt(M+1)))==56320&&(g=65536+(g-55296<<10)+(d-56320),M++),D+=g<128?1:g<2048?2:g<65536?3:4;for(_=o.uint8array?new Uint8Array(D):new Array(D),M=y=0;y<D;M++)(64512&(g=v.charCodeAt(M)))==55296&&M+1<x&&(64512&(d=v.charCodeAt(M+1)))==56320&&(g=65536+(g-55296<<10)+(d-56320),M++),g<128?_[y++]=g:(g<2048?_[y++]=192|g>>>6:(g<65536?_[y++]=224|g>>>12:(_[y++]=240|g>>>18,_[y++]=128|g>>>12&63),_[y++]=128|g>>>6&63),_[y++]=128|63&g);return _})(p)},r.utf8decode=function(p){return o.nodebuffer?s.transformTo("nodebuffer",p).toString("utf-8"):(function(v){var _,g,d,M,y=v.length,x=new Array(2*y);for(_=g=0;_<y;)if((d=v[_++])<128)x[g++]=d;else if(4<(M=c[d]))x[g++]=65533,_+=M-1;else{for(d&=M===2?31:M===3?15:7;1<M&&_<y;)d=d<<6|63&v[_++],M--;1<M?x[g++]=65533:d<65536?x[g++]=d:(d-=65536,x[g++]=55296|d>>10&1023,x[g++]=56320|1023&d)}return x.length!==g&&(x.subarray?x=x.subarray(0,g):x.length=g),s.applyFromCharCode(x)})(p=s.transformTo(o.uint8array?"uint8array":"array",p))},s.inherits(h,l),h.prototype.processChunk=function(p){var v=s.transformTo(o.uint8array?"uint8array":"array",p.data);if(this.leftOver&&this.leftOver.length){if(o.uint8array){var _=v;(v=new Uint8Array(_.length+this.leftOver.length)).set(this.leftOver,0),v.set(_,this.leftOver.length)}else v=this.leftOver.concat(v);this.leftOver=null}var g=(function(M,y){var x;for((y=y||M.length)>M.length&&(y=M.length),x=y-1;0<=x&&(192&M[x])==128;)x--;return x<0||x===0?y:x+c[M[x]]>y?x:y})(v),d=v;g!==v.length&&(o.uint8array?(d=v.subarray(0,g),this.leftOver=v.subarray(g,v.length)):(d=v.slice(0,g),this.leftOver=v.slice(g,v.length))),this.push({data:r.utf8decode(d),meta:p.meta})},h.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:r.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},r.Utf8DecodeWorker=h,s.inherits(m,l),m.prototype.processChunk=function(p){this.push({data:r.utf8encode(p.data),meta:p.meta})},r.Utf8EncodeWorker=m},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,i,r){var s=e("./support"),o=e("./base64"),a=e("./nodejsUtils"),l=e("./external");function c(_){return _}function u(_,g){for(var d=0;d<_.length;++d)g[d]=255&_.charCodeAt(d);return g}e("setimmediate"),r.newBlob=function(_,g){r.checkSupport("blob");try{return new Blob([_],{type:g})}catch{try{var d=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return d.append(_),d.getBlob(g)}catch{throw new Error("Bug : can't construct the Blob.")}}};var h={stringifyByChunk:function(_,g,d){var M=[],y=0,x=_.length;if(x<=d)return String.fromCharCode.apply(null,_);for(;y<x;)g==="array"||g==="nodebuffer"?M.push(String.fromCharCode.apply(null,_.slice(y,Math.min(y+d,x)))):M.push(String.fromCharCode.apply(null,_.subarray(y,Math.min(y+d,x)))),y+=d;return M.join("")},stringifyByChar:function(_){for(var g="",d=0;d<_.length;d++)g+=String.fromCharCode(_[d]);return g},applyCanBeUsed:{uint8array:(function(){try{return s.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}})(),nodebuffer:(function(){try{return s.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}})()}};function m(_){var g=65536,d=r.getTypeOf(_),M=!0;if(d==="uint8array"?M=h.applyCanBeUsed.uint8array:d==="nodebuffer"&&(M=h.applyCanBeUsed.nodebuffer),M)for(;1<g;)try{return h.stringifyByChunk(_,d,g)}catch{g=Math.floor(g/2)}return h.stringifyByChar(_)}function p(_,g){for(var d=0;d<_.length;d++)g[d]=_[d];return g}r.applyFromCharCode=m;var v={};v.string={string:c,array:function(_){return u(_,new Array(_.length))},arraybuffer:function(_){return v.string.uint8array(_).buffer},uint8array:function(_){return u(_,new Uint8Array(_.length))},nodebuffer:function(_){return u(_,a.allocBuffer(_.length))}},v.array={string:m,array:c,arraybuffer:function(_){return new Uint8Array(_).buffer},uint8array:function(_){return new Uint8Array(_)},nodebuffer:function(_){return a.newBufferFrom(_)}},v.arraybuffer={string:function(_){return m(new Uint8Array(_))},array:function(_){return p(new Uint8Array(_),new Array(_.byteLength))},arraybuffer:c,uint8array:function(_){return new Uint8Array(_)},nodebuffer:function(_){return a.newBufferFrom(new Uint8Array(_))}},v.uint8array={string:m,array:function(_){return p(_,new Array(_.length))},arraybuffer:function(_){return _.buffer},uint8array:c,nodebuffer:function(_){return a.newBufferFrom(_)}},v.nodebuffer={string:m,array:function(_){return p(_,new Array(_.length))},arraybuffer:function(_){return v.nodebuffer.uint8array(_).buffer},uint8array:function(_){return p(_,new Uint8Array(_.length))},nodebuffer:c},r.transformTo=function(_,g){if(g=g||"",!_)return g;r.checkSupport(_);var d=r.getTypeOf(g);return v[d][_](g)},r.resolve=function(_){for(var g=_.split("/"),d=[],M=0;M<g.length;M++){var y=g[M];y==="."||y===""&&M!==0&&M!==g.length-1||(y===".."?d.pop():d.push(y))}return d.join("/")},r.getTypeOf=function(_){return typeof _=="string"?"string":Object.prototype.toString.call(_)==="[object Array]"?"array":s.nodebuffer&&a.isBuffer(_)?"nodebuffer":s.uint8array&&_ instanceof Uint8Array?"uint8array":s.arraybuffer&&_ instanceof ArrayBuffer?"arraybuffer":void 0},r.checkSupport=function(_){if(!s[_.toLowerCase()])throw new Error(_+" is not supported by this platform")},r.MAX_VALUE_16BITS=65535,r.MAX_VALUE_32BITS=-1,r.pretty=function(_){var g,d,M="";for(d=0;d<(_||"").length;d++)M+="\\x"+((g=_.charCodeAt(d))<16?"0":"")+g.toString(16).toUpperCase();return M},r.delay=function(_,g,d){setImmediate(function(){_.apply(d||null,g||[])})},r.inherits=function(_,g){function d(){}d.prototype=g.prototype,_.prototype=new d},r.extend=function(){var _,g,d={};for(_=0;_<arguments.length;_++)for(g in arguments[_])Object.prototype.hasOwnProperty.call(arguments[_],g)&&d[g]===void 0&&(d[g]=arguments[_][g]);return d},r.prepareContent=function(_,g,d,M,y){return l.Promise.resolve(g).then(function(x){return s.blob&&(x instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(x))!==-1)&&typeof FileReader<"u"?new l.Promise(function(D,N){var L=new FileReader;L.onload=function(z){D(z.target.result)},L.onerror=function(z){N(z.target.error)},L.readAsArrayBuffer(x)}):x}).then(function(x){var D=r.getTypeOf(x);return D?(D==="arraybuffer"?x=r.transformTo("uint8array",x):D==="string"&&(y?x=o.decode(x):d&&M!==!0&&(x=(function(N){return u(N,s.uint8array?new Uint8Array(N.length):new Array(N.length))})(x))),x):l.Promise.reject(new Error("Can't read the data of '"+_+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,i,r){var s=e("./reader/readerFor"),o=e("./utils"),a=e("./signature"),l=e("./zipEntry"),c=e("./support");function u(h){this.files=[],this.loadOptions=h}u.prototype={checkSignature:function(h){if(!this.reader.readAndCheckSignature(h)){this.reader.index-=4;var m=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+o.pretty(m)+", expected "+o.pretty(h)+")")}},isSignature:function(h,m){var p=this.reader.index;this.reader.setIndex(h);var v=this.reader.readString(4)===m;return this.reader.setIndex(p),v},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var h=this.reader.readData(this.zipCommentLength),m=c.uint8array?"uint8array":"array",p=o.transformTo(m,h);this.zipComment=this.loadOptions.decodeFileName(p)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var h,m,p,v=this.zip64EndOfCentralSize-44;0<v;)h=this.reader.readInt(2),m=this.reader.readInt(4),p=this.reader.readData(m),this.zip64ExtensibleData[h]={id:h,length:m,value:p}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var h,m;for(h=0;h<this.files.length;h++)m=this.files[h],this.reader.setIndex(m.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),m.readLocalPart(this.reader),m.handleUTF8(),m.processAttributes()},readCentralDir:function(){var h;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(h=new l({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(h);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var h=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(h<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(h);var m=h;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===o.MAX_VALUE_16BITS||this.diskWithCentralDirStart===o.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===o.MAX_VALUE_16BITS||this.centralDirRecords===o.MAX_VALUE_16BITS||this.centralDirSize===o.MAX_VALUE_32BITS||this.centralDirOffset===o.MAX_VALUE_32BITS){if(this.zip64=!0,(h=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(h),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var p=this.centralDirOffset+this.centralDirSize;this.zip64&&(p+=20,p+=12+this.zip64EndOfCentralSize);var v=m-p;if(0<v)this.isSignature(m,a.CENTRAL_FILE_HEADER)||(this.reader.zero=v);else if(v<0)throw new Error("Corrupted zip: missing "+Math.abs(v)+" bytes.")},prepareReader:function(h){this.reader=s(h)},load:function(h){this.prepareReader(h),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},i.exports=u},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,i,r){var s=e("./reader/readerFor"),o=e("./utils"),a=e("./compressedObject"),l=e("./crc32"),c=e("./utf8"),u=e("./compressions"),h=e("./support");function m(p,v){this.options=p,this.loadOptions=v}m.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(p){var v,_;if(p.skip(22),this.fileNameLength=p.readInt(2),_=p.readInt(2),this.fileName=p.readData(this.fileNameLength),p.skip(_),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((v=(function(g){for(var d in u)if(Object.prototype.hasOwnProperty.call(u,d)&&u[d].magic===g)return u[d];return null})(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+o.pretty(this.compressionMethod)+" unknown (inner file : "+o.transformTo("string",this.fileName)+")");this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,v,p.readData(this.compressedSize))},readCentralPart:function(p){this.versionMadeBy=p.readInt(2),p.skip(2),this.bitFlag=p.readInt(2),this.compressionMethod=p.readString(2),this.date=p.readDate(),this.crc32=p.readInt(4),this.compressedSize=p.readInt(4),this.uncompressedSize=p.readInt(4);var v=p.readInt(2);if(this.extraFieldsLength=p.readInt(2),this.fileCommentLength=p.readInt(2),this.diskNumberStart=p.readInt(2),this.internalFileAttributes=p.readInt(2),this.externalFileAttributes=p.readInt(4),this.localHeaderOffset=p.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");p.skip(v),this.readExtraFields(p),this.parseZIP64ExtraField(p),this.fileComment=p.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var p=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),p==0&&(this.dosPermissions=63&this.externalFileAttributes),p==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var p=s(this.extraFields[1].value);this.uncompressedSize===o.MAX_VALUE_32BITS&&(this.uncompressedSize=p.readInt(8)),this.compressedSize===o.MAX_VALUE_32BITS&&(this.compressedSize=p.readInt(8)),this.localHeaderOffset===o.MAX_VALUE_32BITS&&(this.localHeaderOffset=p.readInt(8)),this.diskNumberStart===o.MAX_VALUE_32BITS&&(this.diskNumberStart=p.readInt(4))}},readExtraFields:function(p){var v,_,g,d=p.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});p.index+4<d;)v=p.readInt(2),_=p.readInt(2),g=p.readData(_),this.extraFields[v]={id:v,length:_,value:g};p.setIndex(d)},handleUTF8:function(){var p=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=c.utf8decode(this.fileName),this.fileCommentStr=c.utf8decode(this.fileComment);else{var v=this.findExtraFieldUnicodePath();if(v!==null)this.fileNameStr=v;else{var _=o.transformTo(p,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(_)}var g=this.findExtraFieldUnicodeComment();if(g!==null)this.fileCommentStr=g;else{var d=o.transformTo(p,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(d)}}},findExtraFieldUnicodePath:function(){var p=this.extraFields[28789];if(p){var v=s(p.value);return v.readInt(1)!==1||l(this.fileName)!==v.readInt(4)?null:c.utf8decode(v.readData(p.length-5))}return null},findExtraFieldUnicodeComment:function(){var p=this.extraFields[25461];if(p){var v=s(p.value);return v.readInt(1)!==1||l(this.fileComment)!==v.readInt(4)?null:c.utf8decode(v.readData(p.length-5))}return null}},i.exports=m},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,i,r){function s(v,_,g){this.name=v,this.dir=g.dir,this.date=g.date,this.comment=g.comment,this.unixPermissions=g.unixPermissions,this.dosPermissions=g.dosPermissions,this._data=_,this._dataBinary=g.binary,this.options={compression:g.compression,compressionOptions:g.compressionOptions}}var o=e("./stream/StreamHelper"),a=e("./stream/DataWorker"),l=e("./utf8"),c=e("./compressedObject"),u=e("./stream/GenericWorker");s.prototype={internalStream:function(v){var _=null,g="string";try{if(!v)throw new Error("No output type specified.");var d=(g=v.toLowerCase())==="string"||g==="text";g!=="binarystring"&&g!=="text"||(g="string"),_=this._decompressWorker();var M=!this._dataBinary;M&&!d&&(_=_.pipe(new l.Utf8EncodeWorker)),!M&&d&&(_=_.pipe(new l.Utf8DecodeWorker))}catch(y){(_=new u("error")).error(y)}return new o(_,g,"")},async:function(v,_){return this.internalStream(v).accumulate(_)},nodeStream:function(v,_){return this.internalStream(v||"nodebuffer").toNodejsStream(_)},_compressWorker:function(v,_){if(this._data instanceof c&&this._data.compression.magic===v.magic)return this._data.getCompressedWorker();var g=this._decompressWorker();return this._dataBinary||(g=g.pipe(new l.Utf8EncodeWorker)),c.createWorkerFrom(g,v,_)},_decompressWorker:function(){return this._data instanceof c?this._data.getContentWorker():this._data instanceof u?this._data:new a(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],m=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},p=0;p<h.length;p++)s.prototype[h[p]]=m;i.exports=s},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,i,r){(function(s){var o,a,l=s.MutationObserver||s.WebKitMutationObserver;if(l){var c=0,u=new l(v),h=s.document.createTextNode("");u.observe(h,{characterData:!0}),o=function(){h.data=c=++c%2}}else if(s.setImmediate||s.MessageChannel===void 0)o="document"in s&&"onreadystatechange"in s.document.createElement("script")?function(){var _=s.document.createElement("script");_.onreadystatechange=function(){v(),_.onreadystatechange=null,_.parentNode.removeChild(_),_=null},s.document.documentElement.appendChild(_)}:function(){setTimeout(v,0)};else{var m=new s.MessageChannel;m.port1.onmessage=v,o=function(){m.port2.postMessage(0)}}var p=[];function v(){var _,g;a=!0;for(var d=p.length;d;){for(g=p,p=[],_=-1;++_<d;)g[_]();d=p.length}a=!1}i.exports=function(_){p.push(_)!==1||a||o()}}).call(this,typeof $s<"u"?$s:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(e,i,r){var s=e("immediate");function o(){}var a={},l=["REJECTED"],c=["FULFILLED"],u=["PENDING"];function h(d){if(typeof d!="function")throw new TypeError("resolver must be a function");this.state=u,this.queue=[],this.outcome=void 0,d!==o&&_(this,d)}function m(d,M,y){this.promise=d,typeof M=="function"&&(this.onFulfilled=M,this.callFulfilled=this.otherCallFulfilled),typeof y=="function"&&(this.onRejected=y,this.callRejected=this.otherCallRejected)}function p(d,M,y){s(function(){var x;try{x=M(y)}catch(D){return a.reject(d,D)}x===d?a.reject(d,new TypeError("Cannot resolve promise with itself")):a.resolve(d,x)})}function v(d){var M=d&&d.then;if(d&&(typeof d=="object"||typeof d=="function")&&typeof M=="function")return function(){M.apply(d,arguments)}}function _(d,M){var y=!1;function x(L){y||(y=!0,a.reject(d,L))}function D(L){y||(y=!0,a.resolve(d,L))}var N=g(function(){M(D,x)});N.status==="error"&&x(N.value)}function g(d,M){var y={};try{y.value=d(M),y.status="success"}catch(x){y.status="error",y.value=x}return y}(i.exports=h).prototype.finally=function(d){if(typeof d!="function")return this;var M=this.constructor;return this.then(function(y){return M.resolve(d()).then(function(){return y})},function(y){return M.resolve(d()).then(function(){throw y})})},h.prototype.catch=function(d){return this.then(null,d)},h.prototype.then=function(d,M){if(typeof d!="function"&&this.state===c||typeof M!="function"&&this.state===l)return this;var y=new this.constructor(o);return this.state!==u?p(y,this.state===c?d:M,this.outcome):this.queue.push(new m(y,d,M)),y},m.prototype.callFulfilled=function(d){a.resolve(this.promise,d)},m.prototype.otherCallFulfilled=function(d){p(this.promise,this.onFulfilled,d)},m.prototype.callRejected=function(d){a.reject(this.promise,d)},m.prototype.otherCallRejected=function(d){p(this.promise,this.onRejected,d)},a.resolve=function(d,M){var y=g(v,M);if(y.status==="error")return a.reject(d,y.value);var x=y.value;if(x)_(d,x);else{d.state=c,d.outcome=M;for(var D=-1,N=d.queue.length;++D<N;)d.queue[D].callFulfilled(M)}return d},a.reject=function(d,M){d.state=l,d.outcome=M;for(var y=-1,x=d.queue.length;++y<x;)d.queue[y].callRejected(M);return d},h.resolve=function(d){return d instanceof this?d:a.resolve(new this(o),d)},h.reject=function(d){var M=new this(o);return a.reject(M,d)},h.all=function(d){var M=this;if(Object.prototype.toString.call(d)!=="[object Array]")return this.reject(new TypeError("must be an array"));var y=d.length,x=!1;if(!y)return this.resolve([]);for(var D=new Array(y),N=0,L=-1,z=new this(o);++L<y;)C(d[L],L);return z;function C(R,q){M.resolve(R).then(function(I){D[q]=I,++N!==y||x||(x=!0,a.resolve(z,D))},function(I){x||(x=!0,a.reject(z,I))})}},h.race=function(d){var M=this;if(Object.prototype.toString.call(d)!=="[object Array]")return this.reject(new TypeError("must be an array"));var y=d.length,x=!1;if(!y)return this.resolve([]);for(var D=-1,N=new this(o);++D<y;)L=d[D],M.resolve(L).then(function(z){x||(x=!0,a.resolve(N,z))},function(z){x||(x=!0,a.reject(N,z))});var L;return N}},{immediate:36}],38:[function(e,i,r){var s={};(0,e("./lib/utils/common").assign)(s,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),i.exports=s},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,i,r){var s=e("./zlib/deflate"),o=e("./utils/common"),a=e("./utils/strings"),l=e("./zlib/messages"),c=e("./zlib/zstream"),u=Object.prototype.toString,h=0,m=-1,p=0,v=8;function _(d){if(!(this instanceof _))return new _(d);this.options=o.assign({level:m,method:v,chunkSize:16384,windowBits:15,memLevel:8,strategy:p,to:""},d||{});var M=this.options;M.raw&&0<M.windowBits?M.windowBits=-M.windowBits:M.gzip&&0<M.windowBits&&M.windowBits<16&&(M.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var y=s.deflateInit2(this.strm,M.level,M.method,M.windowBits,M.memLevel,M.strategy);if(y!==h)throw new Error(l[y]);if(M.header&&s.deflateSetHeader(this.strm,M.header),M.dictionary){var x;if(x=typeof M.dictionary=="string"?a.string2buf(M.dictionary):u.call(M.dictionary)==="[object ArrayBuffer]"?new Uint8Array(M.dictionary):M.dictionary,(y=s.deflateSetDictionary(this.strm,x))!==h)throw new Error(l[y]);this._dict_set=!0}}function g(d,M){var y=new _(M);if(y.push(d,!0),y.err)throw y.msg||l[y.err];return y.result}_.prototype.push=function(d,M){var y,x,D=this.strm,N=this.options.chunkSize;if(this.ended)return!1;x=M===~~M?M:M===!0?4:0,typeof d=="string"?D.input=a.string2buf(d):u.call(d)==="[object ArrayBuffer]"?D.input=new Uint8Array(d):D.input=d,D.next_in=0,D.avail_in=D.input.length;do{if(D.avail_out===0&&(D.output=new o.Buf8(N),D.next_out=0,D.avail_out=N),(y=s.deflate(D,x))!==1&&y!==h)return this.onEnd(y),!(this.ended=!0);D.avail_out!==0&&(D.avail_in!==0||x!==4&&x!==2)||(this.options.to==="string"?this.onData(a.buf2binstring(o.shrinkBuf(D.output,D.next_out))):this.onData(o.shrinkBuf(D.output,D.next_out)))}while((0<D.avail_in||D.avail_out===0)&&y!==1);return x===4?(y=s.deflateEnd(this.strm),this.onEnd(y),this.ended=!0,y===h):x!==2||(this.onEnd(h),!(D.avail_out=0))},_.prototype.onData=function(d){this.chunks.push(d)},_.prototype.onEnd=function(d){d===h&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=d,this.msg=this.strm.msg},r.Deflate=_,r.deflate=g,r.deflateRaw=function(d,M){return(M=M||{}).raw=!0,g(d,M)},r.gzip=function(d,M){return(M=M||{}).gzip=!0,g(d,M)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,i,r){var s=e("./zlib/inflate"),o=e("./utils/common"),a=e("./utils/strings"),l=e("./zlib/constants"),c=e("./zlib/messages"),u=e("./zlib/zstream"),h=e("./zlib/gzheader"),m=Object.prototype.toString;function p(_){if(!(this instanceof p))return new p(_);this.options=o.assign({chunkSize:16384,windowBits:0,to:""},_||{});var g=this.options;g.raw&&0<=g.windowBits&&g.windowBits<16&&(g.windowBits=-g.windowBits,g.windowBits===0&&(g.windowBits=-15)),!(0<=g.windowBits&&g.windowBits<16)||_&&_.windowBits||(g.windowBits+=32),15<g.windowBits&&g.windowBits<48&&(15&g.windowBits)==0&&(g.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u,this.strm.avail_out=0;var d=s.inflateInit2(this.strm,g.windowBits);if(d!==l.Z_OK)throw new Error(c[d]);this.header=new h,s.inflateGetHeader(this.strm,this.header)}function v(_,g){var d=new p(g);if(d.push(_,!0),d.err)throw d.msg||c[d.err];return d.result}p.prototype.push=function(_,g){var d,M,y,x,D,N,L=this.strm,z=this.options.chunkSize,C=this.options.dictionary,R=!1;if(this.ended)return!1;M=g===~~g?g:g===!0?l.Z_FINISH:l.Z_NO_FLUSH,typeof _=="string"?L.input=a.binstring2buf(_):m.call(_)==="[object ArrayBuffer]"?L.input=new Uint8Array(_):L.input=_,L.next_in=0,L.avail_in=L.input.length;do{if(L.avail_out===0&&(L.output=new o.Buf8(z),L.next_out=0,L.avail_out=z),(d=s.inflate(L,l.Z_NO_FLUSH))===l.Z_NEED_DICT&&C&&(N=typeof C=="string"?a.string2buf(C):m.call(C)==="[object ArrayBuffer]"?new Uint8Array(C):C,d=s.inflateSetDictionary(this.strm,N)),d===l.Z_BUF_ERROR&&R===!0&&(d=l.Z_OK,R=!1),d!==l.Z_STREAM_END&&d!==l.Z_OK)return this.onEnd(d),!(this.ended=!0);L.next_out&&(L.avail_out!==0&&d!==l.Z_STREAM_END&&(L.avail_in!==0||M!==l.Z_FINISH&&M!==l.Z_SYNC_FLUSH)||(this.options.to==="string"?(y=a.utf8border(L.output,L.next_out),x=L.next_out-y,D=a.buf2string(L.output,y),L.next_out=x,L.avail_out=z-x,x&&o.arraySet(L.output,L.output,y,x,0),this.onData(D)):this.onData(o.shrinkBuf(L.output,L.next_out)))),L.avail_in===0&&L.avail_out===0&&(R=!0)}while((0<L.avail_in||L.avail_out===0)&&d!==l.Z_STREAM_END);return d===l.Z_STREAM_END&&(M=l.Z_FINISH),M===l.Z_FINISH?(d=s.inflateEnd(this.strm),this.onEnd(d),this.ended=!0,d===l.Z_OK):M!==l.Z_SYNC_FLUSH||(this.onEnd(l.Z_OK),!(L.avail_out=0))},p.prototype.onData=function(_){this.chunks.push(_)},p.prototype.onEnd=function(_){_===l.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=_,this.msg=this.strm.msg},r.Inflate=p,r.inflate=v,r.inflateRaw=function(_,g){return(g=g||{}).raw=!0,v(_,g)},r.ungzip=v},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,i,r){var s=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";r.assign=function(l){for(var c=Array.prototype.slice.call(arguments,1);c.length;){var u=c.shift();if(u){if(typeof u!="object")throw new TypeError(u+"must be non-object");for(var h in u)u.hasOwnProperty(h)&&(l[h]=u[h])}}return l},r.shrinkBuf=function(l,c){return l.length===c?l:l.subarray?l.subarray(0,c):(l.length=c,l)};var o={arraySet:function(l,c,u,h,m){if(c.subarray&&l.subarray)l.set(c.subarray(u,u+h),m);else for(var p=0;p<h;p++)l[m+p]=c[u+p]},flattenChunks:function(l){var c,u,h,m,p,v;for(c=h=0,u=l.length;c<u;c++)h+=l[c].length;for(v=new Uint8Array(h),c=m=0,u=l.length;c<u;c++)p=l[c],v.set(p,m),m+=p.length;return v}},a={arraySet:function(l,c,u,h,m){for(var p=0;p<h;p++)l[m+p]=c[u+p]},flattenChunks:function(l){return[].concat.apply([],l)}};r.setTyped=function(l){l?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,o)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,a))},r.setTyped(s)},{}],42:[function(e,i,r){var s=e("./common"),o=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{o=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var l=new s.Buf8(256),c=0;c<256;c++)l[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;function u(h,m){if(m<65537&&(h.subarray&&a||!h.subarray&&o))return String.fromCharCode.apply(null,s.shrinkBuf(h,m));for(var p="",v=0;v<m;v++)p+=String.fromCharCode(h[v]);return p}l[254]=l[254]=1,r.string2buf=function(h){var m,p,v,_,g,d=h.length,M=0;for(_=0;_<d;_++)(64512&(p=h.charCodeAt(_)))==55296&&_+1<d&&(64512&(v=h.charCodeAt(_+1)))==56320&&(p=65536+(p-55296<<10)+(v-56320),_++),M+=p<128?1:p<2048?2:p<65536?3:4;for(m=new s.Buf8(M),_=g=0;g<M;_++)(64512&(p=h.charCodeAt(_)))==55296&&_+1<d&&(64512&(v=h.charCodeAt(_+1)))==56320&&(p=65536+(p-55296<<10)+(v-56320),_++),p<128?m[g++]=p:(p<2048?m[g++]=192|p>>>6:(p<65536?m[g++]=224|p>>>12:(m[g++]=240|p>>>18,m[g++]=128|p>>>12&63),m[g++]=128|p>>>6&63),m[g++]=128|63&p);return m},r.buf2binstring=function(h){return u(h,h.length)},r.binstring2buf=function(h){for(var m=new s.Buf8(h.length),p=0,v=m.length;p<v;p++)m[p]=h.charCodeAt(p);return m},r.buf2string=function(h,m){var p,v,_,g,d=m||h.length,M=new Array(2*d);for(p=v=0;p<d;)if((_=h[p++])<128)M[v++]=_;else if(4<(g=l[_]))M[v++]=65533,p+=g-1;else{for(_&=g===2?31:g===3?15:7;1<g&&p<d;)_=_<<6|63&h[p++],g--;1<g?M[v++]=65533:_<65536?M[v++]=_:(_-=65536,M[v++]=55296|_>>10&1023,M[v++]=56320|1023&_)}return u(M,v)},r.utf8border=function(h,m){var p;for((m=m||h.length)>h.length&&(m=h.length),p=m-1;0<=p&&(192&h[p])==128;)p--;return p<0||p===0?m:p+l[h[p]]>m?p:m}},{"./common":41}],43:[function(e,i,r){i.exports=function(s,o,a,l){for(var c=65535&s|0,u=s>>>16&65535|0,h=0;a!==0;){for(a-=h=2e3<a?2e3:a;u=u+(c=c+o[l++]|0)|0,--h;);c%=65521,u%=65521}return c|u<<16|0}},{}],44:[function(e,i,r){i.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,i,r){var s=(function(){for(var o,a=[],l=0;l<256;l++){o=l;for(var c=0;c<8;c++)o=1&o?3988292384^o>>>1:o>>>1;a[l]=o}return a})();i.exports=function(o,a,l,c){var u=s,h=c+l;o^=-1;for(var m=c;m<h;m++)o=o>>>8^u[255&(o^a[m])];return-1^o}},{}],46:[function(e,i,r){var s,o=e("../utils/common"),a=e("./trees"),l=e("./adler32"),c=e("./crc32"),u=e("./messages"),h=0,m=4,p=0,v=-2,_=-1,g=4,d=2,M=8,y=9,x=286,D=30,N=19,L=2*x+1,z=15,C=3,R=258,q=R+C+1,I=42,j=113,E=1,K=2,et=3,$=4;function Y(f,F){return f.msg=u[F],F}function rt(f){return(f<<1)-(4<f?9:0)}function ft(f){for(var F=f.length;0<=--F;)f[F]=0}function Q(f){var F=f.state,U=F.pending;U>f.avail_out&&(U=f.avail_out),U!==0&&(o.arraySet(f.output,F.pending_buf,F.pending_out,U,f.next_out),f.next_out+=U,F.pending_out+=U,f.total_out+=U,f.avail_out-=U,F.pending-=U,F.pending===0&&(F.pending_out=0))}function nt(f,F){a._tr_flush_block(f,0<=f.block_start?f.block_start:-1,f.strstart-f.block_start,F),f.block_start=f.strstart,Q(f.strm)}function bt(f,F){f.pending_buf[f.pending++]=F}function W(f,F){f.pending_buf[f.pending++]=F>>>8&255,f.pending_buf[f.pending++]=255&F}function B(f,F){var U,A,S=f.max_chain_length,T=f.strstart,X=f.prev_length,w=f.nice_match,b=f.strstart>f.w_size-q?f.strstart-(f.w_size-q):0,H=f.window,Z=f.w_mask,J=f.prev,tt=f.strstart+R,_t=H[T+X-1],ht=H[T+X];f.prev_length>=f.good_match&&(S>>=2),w>f.lookahead&&(w=f.lookahead);do if(H[(U=F)+X]===ht&&H[U+X-1]===_t&&H[U]===H[T]&&H[++U]===H[T+1]){T+=2,U++;do;while(H[++T]===H[++U]&&H[++T]===H[++U]&&H[++T]===H[++U]&&H[++T]===H[++U]&&H[++T]===H[++U]&&H[++T]===H[++U]&&H[++T]===H[++U]&&H[++T]===H[++U]&&T<tt);if(A=R-(tt-T),T=tt-R,X<A){if(f.match_start=F,w<=(X=A))break;_t=H[T+X-1],ht=H[T+X]}}while((F=J[F&Z])>b&&--S!=0);return X<=f.lookahead?X:f.lookahead}function V(f){var F,U,A,S,T,X,w,b,H,Z,J=f.w_size;do{if(S=f.window_size-f.lookahead-f.strstart,f.strstart>=J+(J-q)){for(o.arraySet(f.window,f.window,J,J,0),f.match_start-=J,f.strstart-=J,f.block_start-=J,F=U=f.hash_size;A=f.head[--F],f.head[F]=J<=A?A-J:0,--U;);for(F=U=J;A=f.prev[--F],f.prev[F]=J<=A?A-J:0,--U;);S+=J}if(f.strm.avail_in===0)break;if(X=f.strm,w=f.window,b=f.strstart+f.lookahead,H=S,Z=void 0,Z=X.avail_in,H<Z&&(Z=H),U=Z===0?0:(X.avail_in-=Z,o.arraySet(w,X.input,X.next_in,Z,b),X.state.wrap===1?X.adler=l(X.adler,w,Z,b):X.state.wrap===2&&(X.adler=c(X.adler,w,Z,b)),X.next_in+=Z,X.total_in+=Z,Z),f.lookahead+=U,f.lookahead+f.insert>=C)for(T=f.strstart-f.insert,f.ins_h=f.window[T],f.ins_h=(f.ins_h<<f.hash_shift^f.window[T+1])&f.hash_mask;f.insert&&(f.ins_h=(f.ins_h<<f.hash_shift^f.window[T+C-1])&f.hash_mask,f.prev[T&f.w_mask]=f.head[f.ins_h],f.head[f.ins_h]=T,T++,f.insert--,!(f.lookahead+f.insert<C)););}while(f.lookahead<q&&f.strm.avail_in!==0)}function O(f,F){for(var U,A;;){if(f.lookahead<q){if(V(f),f.lookahead<q&&F===h)return E;if(f.lookahead===0)break}if(U=0,f.lookahead>=C&&(f.ins_h=(f.ins_h<<f.hash_shift^f.window[f.strstart+C-1])&f.hash_mask,U=f.prev[f.strstart&f.w_mask]=f.head[f.ins_h],f.head[f.ins_h]=f.strstart),U!==0&&f.strstart-U<=f.w_size-q&&(f.match_length=B(f,U)),f.match_length>=C)if(A=a._tr_tally(f,f.strstart-f.match_start,f.match_length-C),f.lookahead-=f.match_length,f.match_length<=f.max_lazy_match&&f.lookahead>=C){for(f.match_length--;f.strstart++,f.ins_h=(f.ins_h<<f.hash_shift^f.window[f.strstart+C-1])&f.hash_mask,U=f.prev[f.strstart&f.w_mask]=f.head[f.ins_h],f.head[f.ins_h]=f.strstart,--f.match_length!=0;);f.strstart++}else f.strstart+=f.match_length,f.match_length=0,f.ins_h=f.window[f.strstart],f.ins_h=(f.ins_h<<f.hash_shift^f.window[f.strstart+1])&f.hash_mask;else A=a._tr_tally(f,0,f.window[f.strstart]),f.lookahead--,f.strstart++;if(A&&(nt(f,!1),f.strm.avail_out===0))return E}return f.insert=f.strstart<C-1?f.strstart:C-1,F===m?(nt(f,!0),f.strm.avail_out===0?et:$):f.last_lit&&(nt(f,!1),f.strm.avail_out===0)?E:K}function it(f,F){for(var U,A,S;;){if(f.lookahead<q){if(V(f),f.lookahead<q&&F===h)return E;if(f.lookahead===0)break}if(U=0,f.lookahead>=C&&(f.ins_h=(f.ins_h<<f.hash_shift^f.window[f.strstart+C-1])&f.hash_mask,U=f.prev[f.strstart&f.w_mask]=f.head[f.ins_h],f.head[f.ins_h]=f.strstart),f.prev_length=f.match_length,f.prev_match=f.match_start,f.match_length=C-1,U!==0&&f.prev_length<f.max_lazy_match&&f.strstart-U<=f.w_size-q&&(f.match_length=B(f,U),f.match_length<=5&&(f.strategy===1||f.match_length===C&&4096<f.strstart-f.match_start)&&(f.match_length=C-1)),f.prev_length>=C&&f.match_length<=f.prev_length){for(S=f.strstart+f.lookahead-C,A=a._tr_tally(f,f.strstart-1-f.prev_match,f.prev_length-C),f.lookahead-=f.prev_length-1,f.prev_length-=2;++f.strstart<=S&&(f.ins_h=(f.ins_h<<f.hash_shift^f.window[f.strstart+C-1])&f.hash_mask,U=f.prev[f.strstart&f.w_mask]=f.head[f.ins_h],f.head[f.ins_h]=f.strstart),--f.prev_length!=0;);if(f.match_available=0,f.match_length=C-1,f.strstart++,A&&(nt(f,!1),f.strm.avail_out===0))return E}else if(f.match_available){if((A=a._tr_tally(f,0,f.window[f.strstart-1]))&&nt(f,!1),f.strstart++,f.lookahead--,f.strm.avail_out===0)return E}else f.match_available=1,f.strstart++,f.lookahead--}return f.match_available&&(A=a._tr_tally(f,0,f.window[f.strstart-1]),f.match_available=0),f.insert=f.strstart<C-1?f.strstart:C-1,F===m?(nt(f,!0),f.strm.avail_out===0?et:$):f.last_lit&&(nt(f,!1),f.strm.avail_out===0)?E:K}function ut(f,F,U,A,S){this.good_length=f,this.max_lazy=F,this.nice_length=U,this.max_chain=A,this.func=S}function st(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=M,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new o.Buf16(2*L),this.dyn_dtree=new o.Buf16(2*(2*D+1)),this.bl_tree=new o.Buf16(2*(2*N+1)),ft(this.dyn_ltree),ft(this.dyn_dtree),ft(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new o.Buf16(z+1),this.heap=new o.Buf16(2*x+1),ft(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new o.Buf16(2*x+1),ft(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function gt(f){var F;return f&&f.state?(f.total_in=f.total_out=0,f.data_type=d,(F=f.state).pending=0,F.pending_out=0,F.wrap<0&&(F.wrap=-F.wrap),F.status=F.wrap?I:j,f.adler=F.wrap===2?0:1,F.last_flush=h,a._tr_init(F),p):Y(f,v)}function P(f){var F=gt(f);return F===p&&(function(U){U.window_size=2*U.w_size,ft(U.head),U.max_lazy_match=s[U.level].max_lazy,U.good_match=s[U.level].good_length,U.nice_match=s[U.level].nice_length,U.max_chain_length=s[U.level].max_chain,U.strstart=0,U.block_start=0,U.lookahead=0,U.insert=0,U.match_length=U.prev_length=C-1,U.match_available=0,U.ins_h=0})(f.state),F}function k(f,F,U,A,S,T){if(!f)return v;var X=1;if(F===_&&(F=6),A<0?(X=0,A=-A):15<A&&(X=2,A-=16),S<1||y<S||U!==M||A<8||15<A||F<0||9<F||T<0||g<T)return Y(f,v);A===8&&(A=9);var w=new st;return(f.state=w).strm=f,w.wrap=X,w.gzhead=null,w.w_bits=A,w.w_size=1<<w.w_bits,w.w_mask=w.w_size-1,w.hash_bits=S+7,w.hash_size=1<<w.hash_bits,w.hash_mask=w.hash_size-1,w.hash_shift=~~((w.hash_bits+C-1)/C),w.window=new o.Buf8(2*w.w_size),w.head=new o.Buf16(w.hash_size),w.prev=new o.Buf16(w.w_size),w.lit_bufsize=1<<S+6,w.pending_buf_size=4*w.lit_bufsize,w.pending_buf=new o.Buf8(w.pending_buf_size),w.d_buf=1*w.lit_bufsize,w.l_buf=3*w.lit_bufsize,w.level=F,w.strategy=T,w.method=U,P(f)}s=[new ut(0,0,0,0,function(f,F){var U=65535;for(U>f.pending_buf_size-5&&(U=f.pending_buf_size-5);;){if(f.lookahead<=1){if(V(f),f.lookahead===0&&F===h)return E;if(f.lookahead===0)break}f.strstart+=f.lookahead,f.lookahead=0;var A=f.block_start+U;if((f.strstart===0||f.strstart>=A)&&(f.lookahead=f.strstart-A,f.strstart=A,nt(f,!1),f.strm.avail_out===0)||f.strstart-f.block_start>=f.w_size-q&&(nt(f,!1),f.strm.avail_out===0))return E}return f.insert=0,F===m?(nt(f,!0),f.strm.avail_out===0?et:$):(f.strstart>f.block_start&&(nt(f,!1),f.strm.avail_out),E)}),new ut(4,4,8,4,O),new ut(4,5,16,8,O),new ut(4,6,32,32,O),new ut(4,4,16,16,it),new ut(8,16,32,32,it),new ut(8,16,128,128,it),new ut(8,32,128,256,it),new ut(32,128,258,1024,it),new ut(32,258,258,4096,it)],r.deflateInit=function(f,F){return k(f,F,M,15,8,0)},r.deflateInit2=k,r.deflateReset=P,r.deflateResetKeep=gt,r.deflateSetHeader=function(f,F){return f&&f.state?f.state.wrap!==2?v:(f.state.gzhead=F,p):v},r.deflate=function(f,F){var U,A,S,T;if(!f||!f.state||5<F||F<0)return f?Y(f,v):v;if(A=f.state,!f.output||!f.input&&f.avail_in!==0||A.status===666&&F!==m)return Y(f,f.avail_out===0?-5:v);if(A.strm=f,U=A.last_flush,A.last_flush=F,A.status===I)if(A.wrap===2)f.adler=0,bt(A,31),bt(A,139),bt(A,8),A.gzhead?(bt(A,(A.gzhead.text?1:0)+(A.gzhead.hcrc?2:0)+(A.gzhead.extra?4:0)+(A.gzhead.name?8:0)+(A.gzhead.comment?16:0)),bt(A,255&A.gzhead.time),bt(A,A.gzhead.time>>8&255),bt(A,A.gzhead.time>>16&255),bt(A,A.gzhead.time>>24&255),bt(A,A.level===9?2:2<=A.strategy||A.level<2?4:0),bt(A,255&A.gzhead.os),A.gzhead.extra&&A.gzhead.extra.length&&(bt(A,255&A.gzhead.extra.length),bt(A,A.gzhead.extra.length>>8&255)),A.gzhead.hcrc&&(f.adler=c(f.adler,A.pending_buf,A.pending,0)),A.gzindex=0,A.status=69):(bt(A,0),bt(A,0),bt(A,0),bt(A,0),bt(A,0),bt(A,A.level===9?2:2<=A.strategy||A.level<2?4:0),bt(A,3),A.status=j);else{var X=M+(A.w_bits-8<<4)<<8;X|=(2<=A.strategy||A.level<2?0:A.level<6?1:A.level===6?2:3)<<6,A.strstart!==0&&(X|=32),X+=31-X%31,A.status=j,W(A,X),A.strstart!==0&&(W(A,f.adler>>>16),W(A,65535&f.adler)),f.adler=1}if(A.status===69)if(A.gzhead.extra){for(S=A.pending;A.gzindex<(65535&A.gzhead.extra.length)&&(A.pending!==A.pending_buf_size||(A.gzhead.hcrc&&A.pending>S&&(f.adler=c(f.adler,A.pending_buf,A.pending-S,S)),Q(f),S=A.pending,A.pending!==A.pending_buf_size));)bt(A,255&A.gzhead.extra[A.gzindex]),A.gzindex++;A.gzhead.hcrc&&A.pending>S&&(f.adler=c(f.adler,A.pending_buf,A.pending-S,S)),A.gzindex===A.gzhead.extra.length&&(A.gzindex=0,A.status=73)}else A.status=73;if(A.status===73)if(A.gzhead.name){S=A.pending;do{if(A.pending===A.pending_buf_size&&(A.gzhead.hcrc&&A.pending>S&&(f.adler=c(f.adler,A.pending_buf,A.pending-S,S)),Q(f),S=A.pending,A.pending===A.pending_buf_size)){T=1;break}T=A.gzindex<A.gzhead.name.length?255&A.gzhead.name.charCodeAt(A.gzindex++):0,bt(A,T)}while(T!==0);A.gzhead.hcrc&&A.pending>S&&(f.adler=c(f.adler,A.pending_buf,A.pending-S,S)),T===0&&(A.gzindex=0,A.status=91)}else A.status=91;if(A.status===91)if(A.gzhead.comment){S=A.pending;do{if(A.pending===A.pending_buf_size&&(A.gzhead.hcrc&&A.pending>S&&(f.adler=c(f.adler,A.pending_buf,A.pending-S,S)),Q(f),S=A.pending,A.pending===A.pending_buf_size)){T=1;break}T=A.gzindex<A.gzhead.comment.length?255&A.gzhead.comment.charCodeAt(A.gzindex++):0,bt(A,T)}while(T!==0);A.gzhead.hcrc&&A.pending>S&&(f.adler=c(f.adler,A.pending_buf,A.pending-S,S)),T===0&&(A.status=103)}else A.status=103;if(A.status===103&&(A.gzhead.hcrc?(A.pending+2>A.pending_buf_size&&Q(f),A.pending+2<=A.pending_buf_size&&(bt(A,255&f.adler),bt(A,f.adler>>8&255),f.adler=0,A.status=j)):A.status=j),A.pending!==0){if(Q(f),f.avail_out===0)return A.last_flush=-1,p}else if(f.avail_in===0&&rt(F)<=rt(U)&&F!==m)return Y(f,-5);if(A.status===666&&f.avail_in!==0)return Y(f,-5);if(f.avail_in!==0||A.lookahead!==0||F!==h&&A.status!==666){var w=A.strategy===2?(function(b,H){for(var Z;;){if(b.lookahead===0&&(V(b),b.lookahead===0)){if(H===h)return E;break}if(b.match_length=0,Z=a._tr_tally(b,0,b.window[b.strstart]),b.lookahead--,b.strstart++,Z&&(nt(b,!1),b.strm.avail_out===0))return E}return b.insert=0,H===m?(nt(b,!0),b.strm.avail_out===0?et:$):b.last_lit&&(nt(b,!1),b.strm.avail_out===0)?E:K})(A,F):A.strategy===3?(function(b,H){for(var Z,J,tt,_t,ht=b.window;;){if(b.lookahead<=R){if(V(b),b.lookahead<=R&&H===h)return E;if(b.lookahead===0)break}if(b.match_length=0,b.lookahead>=C&&0<b.strstart&&(J=ht[tt=b.strstart-1])===ht[++tt]&&J===ht[++tt]&&J===ht[++tt]){_t=b.strstart+R;do;while(J===ht[++tt]&&J===ht[++tt]&&J===ht[++tt]&&J===ht[++tt]&&J===ht[++tt]&&J===ht[++tt]&&J===ht[++tt]&&J===ht[++tt]&&tt<_t);b.match_length=R-(_t-tt),b.match_length>b.lookahead&&(b.match_length=b.lookahead)}if(b.match_length>=C?(Z=a._tr_tally(b,1,b.match_length-C),b.lookahead-=b.match_length,b.strstart+=b.match_length,b.match_length=0):(Z=a._tr_tally(b,0,b.window[b.strstart]),b.lookahead--,b.strstart++),Z&&(nt(b,!1),b.strm.avail_out===0))return E}return b.insert=0,H===m?(nt(b,!0),b.strm.avail_out===0?et:$):b.last_lit&&(nt(b,!1),b.strm.avail_out===0)?E:K})(A,F):s[A.level].func(A,F);if(w!==et&&w!==$||(A.status=666),w===E||w===et)return f.avail_out===0&&(A.last_flush=-1),p;if(w===K&&(F===1?a._tr_align(A):F!==5&&(a._tr_stored_block(A,0,0,!1),F===3&&(ft(A.head),A.lookahead===0&&(A.strstart=0,A.block_start=0,A.insert=0))),Q(f),f.avail_out===0))return A.last_flush=-1,p}return F!==m?p:A.wrap<=0?1:(A.wrap===2?(bt(A,255&f.adler),bt(A,f.adler>>8&255),bt(A,f.adler>>16&255),bt(A,f.adler>>24&255),bt(A,255&f.total_in),bt(A,f.total_in>>8&255),bt(A,f.total_in>>16&255),bt(A,f.total_in>>24&255)):(W(A,f.adler>>>16),W(A,65535&f.adler)),Q(f),0<A.wrap&&(A.wrap=-A.wrap),A.pending!==0?p:1)},r.deflateEnd=function(f){var F;return f&&f.state?(F=f.state.status)!==I&&F!==69&&F!==73&&F!==91&&F!==103&&F!==j&&F!==666?Y(f,v):(f.state=null,F===j?Y(f,-3):p):v},r.deflateSetDictionary=function(f,F){var U,A,S,T,X,w,b,H,Z=F.length;if(!f||!f.state||(T=(U=f.state).wrap)===2||T===1&&U.status!==I||U.lookahead)return v;for(T===1&&(f.adler=l(f.adler,F,Z,0)),U.wrap=0,Z>=U.w_size&&(T===0&&(ft(U.head),U.strstart=0,U.block_start=0,U.insert=0),H=new o.Buf8(U.w_size),o.arraySet(H,F,Z-U.w_size,U.w_size,0),F=H,Z=U.w_size),X=f.avail_in,w=f.next_in,b=f.input,f.avail_in=Z,f.next_in=0,f.input=F,V(U);U.lookahead>=C;){for(A=U.strstart,S=U.lookahead-(C-1);U.ins_h=(U.ins_h<<U.hash_shift^U.window[A+C-1])&U.hash_mask,U.prev[A&U.w_mask]=U.head[U.ins_h],U.head[U.ins_h]=A,A++,--S;);U.strstart=A,U.lookahead=C-1,V(U)}return U.strstart+=U.lookahead,U.block_start=U.strstart,U.insert=U.lookahead,U.lookahead=0,U.match_length=U.prev_length=C-1,U.match_available=0,f.next_in=w,f.input=b,f.avail_in=X,U.wrap=T,p},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,i,r){i.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,i,r){i.exports=function(s,o){var a,l,c,u,h,m,p,v,_,g,d,M,y,x,D,N,L,z,C,R,q,I,j,E,K;a=s.state,l=s.next_in,E=s.input,c=l+(s.avail_in-5),u=s.next_out,K=s.output,h=u-(o-s.avail_out),m=u+(s.avail_out-257),p=a.dmax,v=a.wsize,_=a.whave,g=a.wnext,d=a.window,M=a.hold,y=a.bits,x=a.lencode,D=a.distcode,N=(1<<a.lenbits)-1,L=(1<<a.distbits)-1;t:do{y<15&&(M+=E[l++]<<y,y+=8,M+=E[l++]<<y,y+=8),z=x[M&N];e:for(;;){if(M>>>=C=z>>>24,y-=C,(C=z>>>16&255)===0)K[u++]=65535&z;else{if(!(16&C)){if((64&C)==0){z=x[(65535&z)+(M&(1<<C)-1)];continue e}if(32&C){a.mode=12;break t}s.msg="invalid literal/length code",a.mode=30;break t}R=65535&z,(C&=15)&&(y<C&&(M+=E[l++]<<y,y+=8),R+=M&(1<<C)-1,M>>>=C,y-=C),y<15&&(M+=E[l++]<<y,y+=8,M+=E[l++]<<y,y+=8),z=D[M&L];n:for(;;){if(M>>>=C=z>>>24,y-=C,!(16&(C=z>>>16&255))){if((64&C)==0){z=D[(65535&z)+(M&(1<<C)-1)];continue n}s.msg="invalid distance code",a.mode=30;break t}if(q=65535&z,y<(C&=15)&&(M+=E[l++]<<y,(y+=8)<C&&(M+=E[l++]<<y,y+=8)),p<(q+=M&(1<<C)-1)){s.msg="invalid distance too far back",a.mode=30;break t}if(M>>>=C,y-=C,(C=u-h)<q){if(_<(C=q-C)&&a.sane){s.msg="invalid distance too far back",a.mode=30;break t}if(j=d,(I=0)===g){if(I+=v-C,C<R){for(R-=C;K[u++]=d[I++],--C;);I=u-q,j=K}}else if(g<C){if(I+=v+g-C,(C-=g)<R){for(R-=C;K[u++]=d[I++],--C;);if(I=0,g<R){for(R-=C=g;K[u++]=d[I++],--C;);I=u-q,j=K}}}else if(I+=g-C,C<R){for(R-=C;K[u++]=d[I++],--C;);I=u-q,j=K}for(;2<R;)K[u++]=j[I++],K[u++]=j[I++],K[u++]=j[I++],R-=3;R&&(K[u++]=j[I++],1<R&&(K[u++]=j[I++]))}else{for(I=u-q;K[u++]=K[I++],K[u++]=K[I++],K[u++]=K[I++],2<(R-=3););R&&(K[u++]=K[I++],1<R&&(K[u++]=K[I++]))}break}}break}}while(l<c&&u<m);l-=R=y>>3,M&=(1<<(y-=R<<3))-1,s.next_in=l,s.next_out=u,s.avail_in=l<c?c-l+5:5-(l-c),s.avail_out=u<m?m-u+257:257-(u-m),a.hold=M,a.bits=y}},{}],49:[function(e,i,r){var s=e("../utils/common"),o=e("./adler32"),a=e("./crc32"),l=e("./inffast"),c=e("./inftrees"),u=1,h=2,m=0,p=-2,v=1,_=852,g=592;function d(I){return(I>>>24&255)+(I>>>8&65280)+((65280&I)<<8)+((255&I)<<24)}function M(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new s.Buf16(320),this.work=new s.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function y(I){var j;return I&&I.state?(j=I.state,I.total_in=I.total_out=j.total=0,I.msg="",j.wrap&&(I.adler=1&j.wrap),j.mode=v,j.last=0,j.havedict=0,j.dmax=32768,j.head=null,j.hold=0,j.bits=0,j.lencode=j.lendyn=new s.Buf32(_),j.distcode=j.distdyn=new s.Buf32(g),j.sane=1,j.back=-1,m):p}function x(I){var j;return I&&I.state?((j=I.state).wsize=0,j.whave=0,j.wnext=0,y(I)):p}function D(I,j){var E,K;return I&&I.state?(K=I.state,j<0?(E=0,j=-j):(E=1+(j>>4),j<48&&(j&=15)),j&&(j<8||15<j)?p:(K.window!==null&&K.wbits!==j&&(K.window=null),K.wrap=E,K.wbits=j,x(I))):p}function N(I,j){var E,K;return I?(K=new M,(I.state=K).window=null,(E=D(I,j))!==m&&(I.state=null),E):p}var L,z,C=!0;function R(I){if(C){var j;for(L=new s.Buf32(512),z=new s.Buf32(32),j=0;j<144;)I.lens[j++]=8;for(;j<256;)I.lens[j++]=9;for(;j<280;)I.lens[j++]=7;for(;j<288;)I.lens[j++]=8;for(c(u,I.lens,0,288,L,0,I.work,{bits:9}),j=0;j<32;)I.lens[j++]=5;c(h,I.lens,0,32,z,0,I.work,{bits:5}),C=!1}I.lencode=L,I.lenbits=9,I.distcode=z,I.distbits=5}function q(I,j,E,K){var et,$=I.state;return $.window===null&&($.wsize=1<<$.wbits,$.wnext=0,$.whave=0,$.window=new s.Buf8($.wsize)),K>=$.wsize?(s.arraySet($.window,j,E-$.wsize,$.wsize,0),$.wnext=0,$.whave=$.wsize):(K<(et=$.wsize-$.wnext)&&(et=K),s.arraySet($.window,j,E-K,et,$.wnext),(K-=et)?(s.arraySet($.window,j,E-K,K,0),$.wnext=K,$.whave=$.wsize):($.wnext+=et,$.wnext===$.wsize&&($.wnext=0),$.whave<$.wsize&&($.whave+=et))),0}r.inflateReset=x,r.inflateReset2=D,r.inflateResetKeep=y,r.inflateInit=function(I){return N(I,15)},r.inflateInit2=N,r.inflate=function(I,j){var E,K,et,$,Y,rt,ft,Q,nt,bt,W,B,V,O,it,ut,st,gt,P,k,f,F,U,A,S=0,T=new s.Buf8(4),X=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!I||!I.state||!I.output||!I.input&&I.avail_in!==0)return p;(E=I.state).mode===12&&(E.mode=13),Y=I.next_out,et=I.output,ft=I.avail_out,$=I.next_in,K=I.input,rt=I.avail_in,Q=E.hold,nt=E.bits,bt=rt,W=ft,F=m;t:for(;;)switch(E.mode){case v:if(E.wrap===0){E.mode=13;break}for(;nt<16;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(2&E.wrap&&Q===35615){T[E.check=0]=255&Q,T[1]=Q>>>8&255,E.check=a(E.check,T,2,0),nt=Q=0,E.mode=2;break}if(E.flags=0,E.head&&(E.head.done=!1),!(1&E.wrap)||(((255&Q)<<8)+(Q>>8))%31){I.msg="incorrect header check",E.mode=30;break}if((15&Q)!=8){I.msg="unknown compression method",E.mode=30;break}if(nt-=4,f=8+(15&(Q>>>=4)),E.wbits===0)E.wbits=f;else if(f>E.wbits){I.msg="invalid window size",E.mode=30;break}E.dmax=1<<f,I.adler=E.check=1,E.mode=512&Q?10:12,nt=Q=0;break;case 2:for(;nt<16;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(E.flags=Q,(255&E.flags)!=8){I.msg="unknown compression method",E.mode=30;break}if(57344&E.flags){I.msg="unknown header flags set",E.mode=30;break}E.head&&(E.head.text=Q>>8&1),512&E.flags&&(T[0]=255&Q,T[1]=Q>>>8&255,E.check=a(E.check,T,2,0)),nt=Q=0,E.mode=3;case 3:for(;nt<32;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}E.head&&(E.head.time=Q),512&E.flags&&(T[0]=255&Q,T[1]=Q>>>8&255,T[2]=Q>>>16&255,T[3]=Q>>>24&255,E.check=a(E.check,T,4,0)),nt=Q=0,E.mode=4;case 4:for(;nt<16;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}E.head&&(E.head.xflags=255&Q,E.head.os=Q>>8),512&E.flags&&(T[0]=255&Q,T[1]=Q>>>8&255,E.check=a(E.check,T,2,0)),nt=Q=0,E.mode=5;case 5:if(1024&E.flags){for(;nt<16;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}E.length=Q,E.head&&(E.head.extra_len=Q),512&E.flags&&(T[0]=255&Q,T[1]=Q>>>8&255,E.check=a(E.check,T,2,0)),nt=Q=0}else E.head&&(E.head.extra=null);E.mode=6;case 6:if(1024&E.flags&&(rt<(B=E.length)&&(B=rt),B&&(E.head&&(f=E.head.extra_len-E.length,E.head.extra||(E.head.extra=new Array(E.head.extra_len)),s.arraySet(E.head.extra,K,$,B,f)),512&E.flags&&(E.check=a(E.check,K,B,$)),rt-=B,$+=B,E.length-=B),E.length))break t;E.length=0,E.mode=7;case 7:if(2048&E.flags){if(rt===0)break t;for(B=0;f=K[$+B++],E.head&&f&&E.length<65536&&(E.head.name+=String.fromCharCode(f)),f&&B<rt;);if(512&E.flags&&(E.check=a(E.check,K,B,$)),rt-=B,$+=B,f)break t}else E.head&&(E.head.name=null);E.length=0,E.mode=8;case 8:if(4096&E.flags){if(rt===0)break t;for(B=0;f=K[$+B++],E.head&&f&&E.length<65536&&(E.head.comment+=String.fromCharCode(f)),f&&B<rt;);if(512&E.flags&&(E.check=a(E.check,K,B,$)),rt-=B,$+=B,f)break t}else E.head&&(E.head.comment=null);E.mode=9;case 9:if(512&E.flags){for(;nt<16;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(Q!==(65535&E.check)){I.msg="header crc mismatch",E.mode=30;break}nt=Q=0}E.head&&(E.head.hcrc=E.flags>>9&1,E.head.done=!0),I.adler=E.check=0,E.mode=12;break;case 10:for(;nt<32;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}I.adler=E.check=d(Q),nt=Q=0,E.mode=11;case 11:if(E.havedict===0)return I.next_out=Y,I.avail_out=ft,I.next_in=$,I.avail_in=rt,E.hold=Q,E.bits=nt,2;I.adler=E.check=1,E.mode=12;case 12:if(j===5||j===6)break t;case 13:if(E.last){Q>>>=7&nt,nt-=7&nt,E.mode=27;break}for(;nt<3;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}switch(E.last=1&Q,nt-=1,3&(Q>>>=1)){case 0:E.mode=14;break;case 1:if(R(E),E.mode=20,j!==6)break;Q>>>=2,nt-=2;break t;case 2:E.mode=17;break;case 3:I.msg="invalid block type",E.mode=30}Q>>>=2,nt-=2;break;case 14:for(Q>>>=7&nt,nt-=7&nt;nt<32;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if((65535&Q)!=(Q>>>16^65535)){I.msg="invalid stored block lengths",E.mode=30;break}if(E.length=65535&Q,nt=Q=0,E.mode=15,j===6)break t;case 15:E.mode=16;case 16:if(B=E.length){if(rt<B&&(B=rt),ft<B&&(B=ft),B===0)break t;s.arraySet(et,K,$,B,Y),rt-=B,$+=B,ft-=B,Y+=B,E.length-=B;break}E.mode=12;break;case 17:for(;nt<14;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(E.nlen=257+(31&Q),Q>>>=5,nt-=5,E.ndist=1+(31&Q),Q>>>=5,nt-=5,E.ncode=4+(15&Q),Q>>>=4,nt-=4,286<E.nlen||30<E.ndist){I.msg="too many length or distance symbols",E.mode=30;break}E.have=0,E.mode=18;case 18:for(;E.have<E.ncode;){for(;nt<3;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}E.lens[X[E.have++]]=7&Q,Q>>>=3,nt-=3}for(;E.have<19;)E.lens[X[E.have++]]=0;if(E.lencode=E.lendyn,E.lenbits=7,U={bits:E.lenbits},F=c(0,E.lens,0,19,E.lencode,0,E.work,U),E.lenbits=U.bits,F){I.msg="invalid code lengths set",E.mode=30;break}E.have=0,E.mode=19;case 19:for(;E.have<E.nlen+E.ndist;){for(;ut=(S=E.lencode[Q&(1<<E.lenbits)-1])>>>16&255,st=65535&S,!((it=S>>>24)<=nt);){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(st<16)Q>>>=it,nt-=it,E.lens[E.have++]=st;else{if(st===16){for(A=it+2;nt<A;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(Q>>>=it,nt-=it,E.have===0){I.msg="invalid bit length repeat",E.mode=30;break}f=E.lens[E.have-1],B=3+(3&Q),Q>>>=2,nt-=2}else if(st===17){for(A=it+3;nt<A;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}nt-=it,f=0,B=3+(7&(Q>>>=it)),Q>>>=3,nt-=3}else{for(A=it+7;nt<A;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}nt-=it,f=0,B=11+(127&(Q>>>=it)),Q>>>=7,nt-=7}if(E.have+B>E.nlen+E.ndist){I.msg="invalid bit length repeat",E.mode=30;break}for(;B--;)E.lens[E.have++]=f}}if(E.mode===30)break;if(E.lens[256]===0){I.msg="invalid code -- missing end-of-block",E.mode=30;break}if(E.lenbits=9,U={bits:E.lenbits},F=c(u,E.lens,0,E.nlen,E.lencode,0,E.work,U),E.lenbits=U.bits,F){I.msg="invalid literal/lengths set",E.mode=30;break}if(E.distbits=6,E.distcode=E.distdyn,U={bits:E.distbits},F=c(h,E.lens,E.nlen,E.ndist,E.distcode,0,E.work,U),E.distbits=U.bits,F){I.msg="invalid distances set",E.mode=30;break}if(E.mode=20,j===6)break t;case 20:E.mode=21;case 21:if(6<=rt&&258<=ft){I.next_out=Y,I.avail_out=ft,I.next_in=$,I.avail_in=rt,E.hold=Q,E.bits=nt,l(I,W),Y=I.next_out,et=I.output,ft=I.avail_out,$=I.next_in,K=I.input,rt=I.avail_in,Q=E.hold,nt=E.bits,E.mode===12&&(E.back=-1);break}for(E.back=0;ut=(S=E.lencode[Q&(1<<E.lenbits)-1])>>>16&255,st=65535&S,!((it=S>>>24)<=nt);){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(ut&&(240&ut)==0){for(gt=it,P=ut,k=st;ut=(S=E.lencode[k+((Q&(1<<gt+P)-1)>>gt)])>>>16&255,st=65535&S,!(gt+(it=S>>>24)<=nt);){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}Q>>>=gt,nt-=gt,E.back+=gt}if(Q>>>=it,nt-=it,E.back+=it,E.length=st,ut===0){E.mode=26;break}if(32&ut){E.back=-1,E.mode=12;break}if(64&ut){I.msg="invalid literal/length code",E.mode=30;break}E.extra=15&ut,E.mode=22;case 22:if(E.extra){for(A=E.extra;nt<A;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}E.length+=Q&(1<<E.extra)-1,Q>>>=E.extra,nt-=E.extra,E.back+=E.extra}E.was=E.length,E.mode=23;case 23:for(;ut=(S=E.distcode[Q&(1<<E.distbits)-1])>>>16&255,st=65535&S,!((it=S>>>24)<=nt);){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if((240&ut)==0){for(gt=it,P=ut,k=st;ut=(S=E.distcode[k+((Q&(1<<gt+P)-1)>>gt)])>>>16&255,st=65535&S,!(gt+(it=S>>>24)<=nt);){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}Q>>>=gt,nt-=gt,E.back+=gt}if(Q>>>=it,nt-=it,E.back+=it,64&ut){I.msg="invalid distance code",E.mode=30;break}E.offset=st,E.extra=15&ut,E.mode=24;case 24:if(E.extra){for(A=E.extra;nt<A;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}E.offset+=Q&(1<<E.extra)-1,Q>>>=E.extra,nt-=E.extra,E.back+=E.extra}if(E.offset>E.dmax){I.msg="invalid distance too far back",E.mode=30;break}E.mode=25;case 25:if(ft===0)break t;if(B=W-ft,E.offset>B){if((B=E.offset-B)>E.whave&&E.sane){I.msg="invalid distance too far back",E.mode=30;break}V=B>E.wnext?(B-=E.wnext,E.wsize-B):E.wnext-B,B>E.length&&(B=E.length),O=E.window}else O=et,V=Y-E.offset,B=E.length;for(ft<B&&(B=ft),ft-=B,E.length-=B;et[Y++]=O[V++],--B;);E.length===0&&(E.mode=21);break;case 26:if(ft===0)break t;et[Y++]=E.length,ft--,E.mode=21;break;case 27:if(E.wrap){for(;nt<32;){if(rt===0)break t;rt--,Q|=K[$++]<<nt,nt+=8}if(W-=ft,I.total_out+=W,E.total+=W,W&&(I.adler=E.check=E.flags?a(E.check,et,W,Y-W):o(E.check,et,W,Y-W)),W=ft,(E.flags?Q:d(Q))!==E.check){I.msg="incorrect data check",E.mode=30;break}nt=Q=0}E.mode=28;case 28:if(E.wrap&&E.flags){for(;nt<32;){if(rt===0)break t;rt--,Q+=K[$++]<<nt,nt+=8}if(Q!==(4294967295&E.total)){I.msg="incorrect length check",E.mode=30;break}nt=Q=0}E.mode=29;case 29:F=1;break t;case 30:F=-3;break t;case 31:return-4;case 32:default:return p}return I.next_out=Y,I.avail_out=ft,I.next_in=$,I.avail_in=rt,E.hold=Q,E.bits=nt,(E.wsize||W!==I.avail_out&&E.mode<30&&(E.mode<27||j!==4))&&q(I,I.output,I.next_out,W-I.avail_out)?(E.mode=31,-4):(bt-=I.avail_in,W-=I.avail_out,I.total_in+=bt,I.total_out+=W,E.total+=W,E.wrap&&W&&(I.adler=E.check=E.flags?a(E.check,et,W,I.next_out-W):o(E.check,et,W,I.next_out-W)),I.data_type=E.bits+(E.last?64:0)+(E.mode===12?128:0)+(E.mode===20||E.mode===15?256:0),(bt==0&&W===0||j===4)&&F===m&&(F=-5),F)},r.inflateEnd=function(I){if(!I||!I.state)return p;var j=I.state;return j.window&&(j.window=null),I.state=null,m},r.inflateGetHeader=function(I,j){var E;return I&&I.state?(2&(E=I.state).wrap)==0?p:((E.head=j).done=!1,m):p},r.inflateSetDictionary=function(I,j){var E,K=j.length;return I&&I.state?(E=I.state).wrap!==0&&E.mode!==11?p:E.mode===11&&o(1,j,K,0)!==E.check?-3:q(I,j,K,K)?(E.mode=31,-4):(E.havedict=1,m):p},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,i,r){var s=e("../utils/common"),o=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],c=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];i.exports=function(u,h,m,p,v,_,g,d){var M,y,x,D,N,L,z,C,R,q=d.bits,I=0,j=0,E=0,K=0,et=0,$=0,Y=0,rt=0,ft=0,Q=0,nt=null,bt=0,W=new s.Buf16(16),B=new s.Buf16(16),V=null,O=0;for(I=0;I<=15;I++)W[I]=0;for(j=0;j<p;j++)W[h[m+j]]++;for(et=q,K=15;1<=K&&W[K]===0;K--);if(K<et&&(et=K),K===0)return v[_++]=20971520,v[_++]=20971520,d.bits=1,0;for(E=1;E<K&&W[E]===0;E++);for(et<E&&(et=E),I=rt=1;I<=15;I++)if(rt<<=1,(rt-=W[I])<0)return-1;if(0<rt&&(u===0||K!==1))return-1;for(B[1]=0,I=1;I<15;I++)B[I+1]=B[I]+W[I];for(j=0;j<p;j++)h[m+j]!==0&&(g[B[h[m+j]]++]=j);if(L=u===0?(nt=V=g,19):u===1?(nt=o,bt-=257,V=a,O-=257,256):(nt=l,V=c,-1),I=E,N=_,Y=j=Q=0,x=-1,D=(ft=1<<($=et))-1,u===1&&852<ft||u===2&&592<ft)return 1;for(;;){for(z=I-Y,R=g[j]<L?(C=0,g[j]):g[j]>L?(C=V[O+g[j]],nt[bt+g[j]]):(C=96,0),M=1<<I-Y,E=y=1<<$;v[N+(Q>>Y)+(y-=M)]=z<<24|C<<16|R|0,y!==0;);for(M=1<<I-1;Q&M;)M>>=1;if(M!==0?(Q&=M-1,Q+=M):Q=0,j++,--W[I]==0){if(I===K)break;I=h[m+g[j]]}if(et<I&&(Q&D)!==x){for(Y===0&&(Y=et),N+=E,rt=1<<($=I-Y);$+Y<K&&!((rt-=W[$+Y])<=0);)$++,rt<<=1;if(ft+=1<<$,u===1&&852<ft||u===2&&592<ft)return 1;v[x=Q&D]=et<<24|$<<16|N-_|0}}return Q!==0&&(v[N+Q]=I-Y<<24|64<<16|0),d.bits=et,0}},{"../utils/common":41}],51:[function(e,i,r){i.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,i,r){var s=e("../utils/common"),o=0,a=1;function l(S){for(var T=S.length;0<=--T;)S[T]=0}var c=0,u=29,h=256,m=h+1+u,p=30,v=19,_=2*m+1,g=15,d=16,M=7,y=256,x=16,D=17,N=18,L=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],z=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],R=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],q=new Array(2*(m+2));l(q);var I=new Array(2*p);l(I);var j=new Array(512);l(j);var E=new Array(256);l(E);var K=new Array(u);l(K);var et,$,Y,rt=new Array(p);function ft(S,T,X,w,b){this.static_tree=S,this.extra_bits=T,this.extra_base=X,this.elems=w,this.max_length=b,this.has_stree=S&&S.length}function Q(S,T){this.dyn_tree=S,this.max_code=0,this.stat_desc=T}function nt(S){return S<256?j[S]:j[256+(S>>>7)]}function bt(S,T){S.pending_buf[S.pending++]=255&T,S.pending_buf[S.pending++]=T>>>8&255}function W(S,T,X){S.bi_valid>d-X?(S.bi_buf|=T<<S.bi_valid&65535,bt(S,S.bi_buf),S.bi_buf=T>>d-S.bi_valid,S.bi_valid+=X-d):(S.bi_buf|=T<<S.bi_valid&65535,S.bi_valid+=X)}function B(S,T,X){W(S,X[2*T],X[2*T+1])}function V(S,T){for(var X=0;X|=1&S,S>>>=1,X<<=1,0<--T;);return X>>>1}function O(S,T,X){var w,b,H=new Array(g+1),Z=0;for(w=1;w<=g;w++)H[w]=Z=Z+X[w-1]<<1;for(b=0;b<=T;b++){var J=S[2*b+1];J!==0&&(S[2*b]=V(H[J]++,J))}}function it(S){var T;for(T=0;T<m;T++)S.dyn_ltree[2*T]=0;for(T=0;T<p;T++)S.dyn_dtree[2*T]=0;for(T=0;T<v;T++)S.bl_tree[2*T]=0;S.dyn_ltree[2*y]=1,S.opt_len=S.static_len=0,S.last_lit=S.matches=0}function ut(S){8<S.bi_valid?bt(S,S.bi_buf):0<S.bi_valid&&(S.pending_buf[S.pending++]=S.bi_buf),S.bi_buf=0,S.bi_valid=0}function st(S,T,X,w){var b=2*T,H=2*X;return S[b]<S[H]||S[b]===S[H]&&w[T]<=w[X]}function gt(S,T,X){for(var w=S.heap[X],b=X<<1;b<=S.heap_len&&(b<S.heap_len&&st(T,S.heap[b+1],S.heap[b],S.depth)&&b++,!st(T,w,S.heap[b],S.depth));)S.heap[X]=S.heap[b],X=b,b<<=1;S.heap[X]=w}function P(S,T,X){var w,b,H,Z,J=0;if(S.last_lit!==0)for(;w=S.pending_buf[S.d_buf+2*J]<<8|S.pending_buf[S.d_buf+2*J+1],b=S.pending_buf[S.l_buf+J],J++,w===0?B(S,b,T):(B(S,(H=E[b])+h+1,T),(Z=L[H])!==0&&W(S,b-=K[H],Z),B(S,H=nt(--w),X),(Z=z[H])!==0&&W(S,w-=rt[H],Z)),J<S.last_lit;);B(S,y,T)}function k(S,T){var X,w,b,H=T.dyn_tree,Z=T.stat_desc.static_tree,J=T.stat_desc.has_stree,tt=T.stat_desc.elems,_t=-1;for(S.heap_len=0,S.heap_max=_,X=0;X<tt;X++)H[2*X]!==0?(S.heap[++S.heap_len]=_t=X,S.depth[X]=0):H[2*X+1]=0;for(;S.heap_len<2;)H[2*(b=S.heap[++S.heap_len]=_t<2?++_t:0)]=1,S.depth[b]=0,S.opt_len--,J&&(S.static_len-=Z[2*b+1]);for(T.max_code=_t,X=S.heap_len>>1;1<=X;X--)gt(S,H,X);for(b=tt;X=S.heap[1],S.heap[1]=S.heap[S.heap_len--],gt(S,H,1),w=S.heap[1],S.heap[--S.heap_max]=X,S.heap[--S.heap_max]=w,H[2*b]=H[2*X]+H[2*w],S.depth[b]=(S.depth[X]>=S.depth[w]?S.depth[X]:S.depth[w])+1,H[2*X+1]=H[2*w+1]=b,S.heap[1]=b++,gt(S,H,1),2<=S.heap_len;);S.heap[--S.heap_max]=S.heap[1],(function(ht,St){var It,vt,Et,wt,kt,Tt,Bt=St.dyn_tree,Ht=St.max_code,Kt=St.stat_desc.static_tree,at=St.stat_desc.has_stree,Ct=St.stat_desc.extra_bits,mt=St.stat_desc.extra_base,yt=St.stat_desc.max_length,Rt=0;for(wt=0;wt<=g;wt++)ht.bl_count[wt]=0;for(Bt[2*ht.heap[ht.heap_max]+1]=0,It=ht.heap_max+1;It<_;It++)yt<(wt=Bt[2*Bt[2*(vt=ht.heap[It])+1]+1]+1)&&(wt=yt,Rt++),Bt[2*vt+1]=wt,Ht<vt||(ht.bl_count[wt]++,kt=0,mt<=vt&&(kt=Ct[vt-mt]),Tt=Bt[2*vt],ht.opt_len+=Tt*(wt+kt),at&&(ht.static_len+=Tt*(Kt[2*vt+1]+kt)));if(Rt!==0){do{for(wt=yt-1;ht.bl_count[wt]===0;)wt--;ht.bl_count[wt]--,ht.bl_count[wt+1]+=2,ht.bl_count[yt]--,Rt-=2}while(0<Rt);for(wt=yt;wt!==0;wt--)for(vt=ht.bl_count[wt];vt!==0;)Ht<(Et=ht.heap[--It])||(Bt[2*Et+1]!==wt&&(ht.opt_len+=(wt-Bt[2*Et+1])*Bt[2*Et],Bt[2*Et+1]=wt),vt--)}})(S,T),O(H,_t,S.bl_count)}function f(S,T,X){var w,b,H=-1,Z=T[1],J=0,tt=7,_t=4;for(Z===0&&(tt=138,_t=3),T[2*(X+1)+1]=65535,w=0;w<=X;w++)b=Z,Z=T[2*(w+1)+1],++J<tt&&b===Z||(J<_t?S.bl_tree[2*b]+=J:b!==0?(b!==H&&S.bl_tree[2*b]++,S.bl_tree[2*x]++):J<=10?S.bl_tree[2*D]++:S.bl_tree[2*N]++,H=b,_t=(J=0)===Z?(tt=138,3):b===Z?(tt=6,3):(tt=7,4))}function F(S,T,X){var w,b,H=-1,Z=T[1],J=0,tt=7,_t=4;for(Z===0&&(tt=138,_t=3),w=0;w<=X;w++)if(b=Z,Z=T[2*(w+1)+1],!(++J<tt&&b===Z)){if(J<_t)for(;B(S,b,S.bl_tree),--J!=0;);else b!==0?(b!==H&&(B(S,b,S.bl_tree),J--),B(S,x,S.bl_tree),W(S,J-3,2)):J<=10?(B(S,D,S.bl_tree),W(S,J-3,3)):(B(S,N,S.bl_tree),W(S,J-11,7));H=b,_t=(J=0)===Z?(tt=138,3):b===Z?(tt=6,3):(tt=7,4)}}l(rt);var U=!1;function A(S,T,X,w){W(S,(c<<1)+(w?1:0),3),(function(b,H,Z,J){ut(b),bt(b,Z),bt(b,~Z),s.arraySet(b.pending_buf,b.window,H,Z,b.pending),b.pending+=Z})(S,T,X)}r._tr_init=function(S){U||((function(){var T,X,w,b,H,Z=new Array(g+1);for(b=w=0;b<u-1;b++)for(K[b]=w,T=0;T<1<<L[b];T++)E[w++]=b;for(E[w-1]=b,b=H=0;b<16;b++)for(rt[b]=H,T=0;T<1<<z[b];T++)j[H++]=b;for(H>>=7;b<p;b++)for(rt[b]=H<<7,T=0;T<1<<z[b]-7;T++)j[256+H++]=b;for(X=0;X<=g;X++)Z[X]=0;for(T=0;T<=143;)q[2*T+1]=8,T++,Z[8]++;for(;T<=255;)q[2*T+1]=9,T++,Z[9]++;for(;T<=279;)q[2*T+1]=7,T++,Z[7]++;for(;T<=287;)q[2*T+1]=8,T++,Z[8]++;for(O(q,m+1,Z),T=0;T<p;T++)I[2*T+1]=5,I[2*T]=V(T,5);et=new ft(q,L,h+1,m,g),$=new ft(I,z,0,p,g),Y=new ft(new Array(0),C,0,v,M)})(),U=!0),S.l_desc=new Q(S.dyn_ltree,et),S.d_desc=new Q(S.dyn_dtree,$),S.bl_desc=new Q(S.bl_tree,Y),S.bi_buf=0,S.bi_valid=0,it(S)},r._tr_stored_block=A,r._tr_flush_block=function(S,T,X,w){var b,H,Z=0;0<S.level?(S.strm.data_type===2&&(S.strm.data_type=(function(J){var tt,_t=4093624447;for(tt=0;tt<=31;tt++,_t>>>=1)if(1&_t&&J.dyn_ltree[2*tt]!==0)return o;if(J.dyn_ltree[18]!==0||J.dyn_ltree[20]!==0||J.dyn_ltree[26]!==0)return a;for(tt=32;tt<h;tt++)if(J.dyn_ltree[2*tt]!==0)return a;return o})(S)),k(S,S.l_desc),k(S,S.d_desc),Z=(function(J){var tt;for(f(J,J.dyn_ltree,J.l_desc.max_code),f(J,J.dyn_dtree,J.d_desc.max_code),k(J,J.bl_desc),tt=v-1;3<=tt&&J.bl_tree[2*R[tt]+1]===0;tt--);return J.opt_len+=3*(tt+1)+5+5+4,tt})(S),b=S.opt_len+3+7>>>3,(H=S.static_len+3+7>>>3)<=b&&(b=H)):b=H=X+5,X+4<=b&&T!==-1?A(S,T,X,w):S.strategy===4||H===b?(W(S,2+(w?1:0),3),P(S,q,I)):(W(S,4+(w?1:0),3),(function(J,tt,_t,ht){var St;for(W(J,tt-257,5),W(J,_t-1,5),W(J,ht-4,4),St=0;St<ht;St++)W(J,J.bl_tree[2*R[St]+1],3);F(J,J.dyn_ltree,tt-1),F(J,J.dyn_dtree,_t-1)})(S,S.l_desc.max_code+1,S.d_desc.max_code+1,Z+1),P(S,S.dyn_ltree,S.dyn_dtree)),it(S),w&&ut(S)},r._tr_tally=function(S,T,X){return S.pending_buf[S.d_buf+2*S.last_lit]=T>>>8&255,S.pending_buf[S.d_buf+2*S.last_lit+1]=255&T,S.pending_buf[S.l_buf+S.last_lit]=255&X,S.last_lit++,T===0?S.dyn_ltree[2*X]++:(S.matches++,T--,S.dyn_ltree[2*(E[X]+h+1)]++,S.dyn_dtree[2*nt(T)]++),S.last_lit===S.lit_bufsize-1},r._tr_align=function(S){W(S,2,3),B(S,y,q),(function(T){T.bi_valid===16?(bt(T,T.bi_buf),T.bi_buf=0,T.bi_valid=0):8<=T.bi_valid&&(T.pending_buf[T.pending++]=255&T.bi_buf,T.bi_buf>>=8,T.bi_valid-=8)})(S)}},{"../utils/common":41}],53:[function(e,i,r){i.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,i,r){(function(s){(function(o,a){if(!o.setImmediate){var l,c,u,h,m=1,p={},v=!1,_=o.document,g=Object.getPrototypeOf&&Object.getPrototypeOf(o);g=g&&g.setTimeout?g:o,l={}.toString.call(o.process)==="[object process]"?function(x){process.nextTick(function(){M(x)})}:(function(){if(o.postMessage&&!o.importScripts){var x=!0,D=o.onmessage;return o.onmessage=function(){x=!1},o.postMessage("","*"),o.onmessage=D,x}})()?(h="setImmediate$"+Math.random()+"$",o.addEventListener?o.addEventListener("message",y,!1):o.attachEvent("onmessage",y),function(x){o.postMessage(h+x,"*")}):o.MessageChannel?((u=new MessageChannel).port1.onmessage=function(x){M(x.data)},function(x){u.port2.postMessage(x)}):_&&"onreadystatechange"in _.createElement("script")?(c=_.documentElement,function(x){var D=_.createElement("script");D.onreadystatechange=function(){M(x),D.onreadystatechange=null,c.removeChild(D),D=null},c.appendChild(D)}):function(x){setTimeout(M,0,x)},g.setImmediate=function(x){typeof x!="function"&&(x=new Function(""+x));for(var D=new Array(arguments.length-1),N=0;N<D.length;N++)D[N]=arguments[N+1];var L={callback:x,args:D};return p[m]=L,l(m),m++},g.clearImmediate=d}function d(x){delete p[x]}function M(x){if(v)setTimeout(M,0,x);else{var D=p[x];if(D){v=!0;try{(function(N){var L=N.callback,z=N.args;switch(z.length){case 0:L();break;case 1:L(z[0]);break;case 2:L(z[0],z[1]);break;case 3:L(z[0],z[1],z[2]);break;default:L.apply(a,z)}})(D)}finally{d(x),v=!1}}}}function y(x){x.source===o&&typeof x.data=="string"&&x.data.indexOf(h)===0&&M(+x.data.slice(h.length))}})(typeof self>"u"?s===void 0?this:s:self)}).call(this,typeof $s<"u"?$s:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})})(Pa)),Pa.exports}var Zb=$b();const Kb=Yb(Zb),Jb={printer_name:"Bambu Lab A1",filament:"Bambu PLA Basic @BBL A1",printableWidth:256,printableDepth:256,printableHeight:256,printableArea:["0x0","256x0","256x256","0x256"],printerSettingsId:"Bambu Lab A1 0.4 nozzle",printSettingsId:"0.20mm Standard @BBL A1",compression:"standard",metadata:{Application:"BambuStudio-02.04.00.70",ApplicationTitle:"Exported 3D Model"}},Qb={standard:"DEFLATE",none:"STORE"};async function tM(n,t){const e=new Kb,i=Object.assign({},Jb,t),r=Qb[i.compression],s=[],o=[],a=[],l=x=>{x.updateMatrixWorld(!0);const D=x.geometry,N=D.attributes.position,L=D.index;let z=null;if(x.material){const j=new Yt,E=Array.isArray(x.material)?x.material[0]:x.material;E&&"color"in E&&E.color?j.copy(E.color):j.set(8421504);const K=o.find(et=>et.color.r===j.r&&et.color.g===j.g&&et.color.b===j.b);if(K)z=K;else{const et=o.length+1;z={id:o.length+1,color:j,name:x.name?`${x.name}_material`:`material_${o.length}`,extruder:et},o.push(z)}}const C=s.length+1,R={id:C,type:"mesh",vertices:[],triangles:[],material:z,name:x.name||`Mesh-${C}`,subComponents:[],uuid:La()},q=new Map,I=j=>{const E=new ot;E.fromBufferAttribute(N,j);const K=`${E.x},${E.y},${E.z}`;return q.has(K)||(q.set(K,R.vertices.length),R.vertices.push({x:E.x,y:E.y,z:E.z})),q.get(K)};if(L)for(let j=0;j<L.count;j+=3)R.triangles.push({v1:I(L.getX(j)),v2:I(L.getX(j+1)),v3:I(L.getX(j+2))});else for(let j=0;j<N.count;j+=3)R.triangles.push({v1:I(j),v2:I(j+1),v3:I(j+2)});return s.push(R),C},c=x=>{if(x.type==="Mesh")return l(x);if(x.type==="Group"||x.type==="Object3D"||x.type==="Scene"){const D=[];if(x.updateMatrixWorld(!0),x.children.forEach(N=>{const L=c(N);if(L!==-1){const z=N.matrixWorld.clone().premultiply(x.matrixWorld.clone().invert());D.push({objectId:L,transform:z})}}),D.length>0){const N=s.length+1;return s.push({id:N,type:"assembly",subComponents:D,name:x.name||`Group-${N}`,vertices:[],triangles:[],material:null,uuid:La()}),N}}return-1},u=n.type==="Scene"?n.children:[n],h=[];u.forEach(x=>{const D=c(x);if(D!==-1){x.updateMatrix();const N=x.matrix.clone(),L=s.find(C=>C.id===D),z=C=>C.type==="assembly"?C.subComponents.flatMap(R=>{const q=s.find(I=>I.id===R.objectId);return z(q).map(I=>I.clone().applyMatrix4(R.transform))}):C.vertices.map(R=>new ot(R.x,R.y,R.z));z(L).forEach(C=>{C.applyMatrix4(N),h.push(C)}),a.push({objectId:D,transformMatrix:N,uuid:La()})}});let m={x:1/0,y:1/0,z:1/0},p={x:-1/0,y:-1/0,z:-1/0};h.length>0?h.forEach(x=>{m.x=Math.min(m.x,x.x),m.y=Math.min(m.y,x.y),m.z=Math.min(m.z,x.z),p.x=Math.max(p.x,x.x),p.y=Math.max(p.y,x.y),p.z=Math.max(p.z,x.z)}):(m={x:0,y:0,z:0},p={x:0,y:0,z:0});const v={x:(m.x+p.x)/2,y:(m.y+p.y)/2,z:(m.z+p.z)/2},_={x:i.printableWidth/2,y:i.printableDepth/2,z:0},g={x:_.x-v.x,y:_.y-v.y,z:_.z-m.z},d=eM(s,a,g,i),M=nM(s,a),y=iM(o,i);return e.file("_rels/.rels",rM()),e.file("3D/3dmodel.model",d),e.file("Metadata/model_settings.config",M),e.file("Metadata/project_settings.config",y),e.file("[Content_Types].xml",sM()),await e.generateAsync({type:"blob",mimeType:"application/vnd.ms-package.3dmanufacturing-3dmodel+xml",compression:r})}function eM(n,t,e,i){const r=[],s=i.metadata;r.push(`<metadata name="CreationDate">${new Date().toISOString()}</metadata>`);for(const l in s)r.push(`<metadata name="${l}">${s[l]}</metadata>`);const o=n.map(l=>{if(l.type==="assembly"){const c=l.subComponents.map(u=>{const h=u.transform.elements,m=`${h[0].toFixed(5)} ${h[1].toFixed(5)} ${h[2].toFixed(5)} ${h[4].toFixed(5)} ${h[5].toFixed(5)} ${h[6].toFixed(5)} ${h[8].toFixed(5)} ${h[9].toFixed(5)} ${h[10].toFixed(5)} ${h[12].toFixed(5)} ${h[13].toFixed(5)} ${h[14].toFixed(5)}`;return`<component objectid="${u.objectId}" transform="${m}" />`}).join("");return`<object id="${l.id}" type="model" name="${l.name}"><components>${c}</components></object>`}else{const c=l.vertices.map(h=>`<vertex x="${h.x.toFixed(5)}" y="${h.y.toFixed(5)}" z="${h.z.toFixed(5)}" />`).join(" "),u=l.triangles.map(h=>`<triangle v1="${h.v1}" v2="${h.v2}" v3="${h.v3}" />`).join(" ");return`<object id="${l.id}" type="model" name="${l.name}"><mesh><vertices>${c}</vertices><triangles>${u}</triangles></mesh></object>`}}).join(`
`),a=t.map(l=>{const c=l.transformMatrix.elements,u=c[12]+e.x,h=c[13]+e.y,m=c[14]+e.z,p=`${c[0].toFixed(5)} ${c[1].toFixed(5)} ${c[2].toFixed(5)} ${c[4].toFixed(5)} ${c[5].toFixed(5)} ${c[6].toFixed(5)} ${c[8].toFixed(5)} ${c[9].toFixed(5)} ${c[10].toFixed(5)} ${u.toFixed(5)} ${h.toFixed(5)} ${m.toFixed(5)}`;return`<item objectid="${l.objectId}" transform="${p}" printable="1" />`}).join(`
`);return`<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:slic3rpe="http://schemas.slic3r.org/3mf/2017/06" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">
    ${r.join(`
    `)}
    <resources>
${o}
    </resources>
    <build>
${a}
    </build>
</model>`}function nM(n,t){let e="",i="",r="";return t.forEach((s,o)=>{const a=s.objectId,l=n.find(m=>m.id===a),c=[],u=m=>{m.type==="mesh"?c.push(m):m.subComponents.forEach(p=>u(n.find(v=>v.id===p.objectId)))};u(l);const h=c.map(m=>{const p=m.material?m.material.extruder:1;return`    <part id="${m.id}" subtype="normal_part">
      <metadata key="name" value="${m.name}"/>
      <metadata key="extruder" value="${p}"/>
      <mesh_stat edges_fixed="0" degenerate_facets="0" facets_removed="0" facets_reversed="0" backwards_edges="0"/>
    </part>`}).join(`
`);e+=`  <object id="${a}">
    <metadata key="name" value="${l.name}"/>
    <metadata key="extruder" value="1"/>
    <metadata key="thumbnail_file" value=""/>
${h}
  </object>
`,i+=`    <model_instance>
      <metadata key="object_id" value="${a}"/>
      <metadata key="instance_id" value="0"/>
      <metadata key="identify_id" value="${o+1}"/>
    </model_instance>
`,r+=`    <assemble_item object_id="${a}" instance_id="0" offset="0 0 0"/>
`}),`<?xml version="1.0" encoding="UTF-8"?>
<config>
${e}
  <plate>
    <metadata key="plater_id" value="1"/>
    <metadata key="plater_name" value="plate-1"/>
${i}
  </plate>
  <assemble>
${r}
  </assemble>
</config>`}function iM(n,t){const e=n.map(r=>`#${r.color.getHexString()}`);for(;e.length<2;)e.push("#FFFFFF");const i={printable_area:t.printableArea,printable_height:t.printableHeight.toString(),bed_exclude_area:[],filament_colour:e,filament_settings_id:Array.from({length:e.length}).fill(t.filament),filament_diameter:Array.from({length:e.length}).fill("1.75"),filament_is_support:Array.from({length:e.length}).fill("0"),printer_model:t.printer_name,layer_height:"0.2",wall_loops:"2",sparse_infill_density:"15%",printer_settings_id:t.printerSettingsId,printer_variant:"0.4",nozzle_diameter:["0.4"],enable_support:"0",support_type:"normal(auto)",print_settings_id:t.printSettingsId};return JSON.stringify(i)}function rM(){return`<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rel-1" Target="/3D/3dmodel.model" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
  <Relationship Id="rel-2" Target="/Metadata/model_settings.config" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
  <Relationship Id="rel-3" Target="/Metadata/project_settings.config" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`}function sM(){return`<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" />
  <Default Extension="config" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" />
  <Default Extension="png" ContentType="image/png" />
  <Default Extension="gcode" ContentType="text/x.gcode"/>
</Types>`}function La(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,n=>{const t=Math.random()*16|0;return(n==="x"?t:t&3|8).toString(16)})}const oM={baseThickness:5,cornerRadius:5,padding:5,targetWidth:50,keyringEnabled:!0,keyringHoleDiameter:5,keyringRingDiameter:10,baseColor:"#FFFFFF"},aM={class:"flex flex-col h-screen bg-white text-gray-900 overflow-hidden"},lM={class:"flex flex-1 overflow-hidden"},cM={class:"w-[300px] shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden"},uM={class:"p-4 border-t border-gray-200 shrink-0"},hM={class:"flex-1 relative bg-gray-100"},fM={class:"absolute top-2 right-2"},dM={class:"px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500 shrink-0"},pM=fs({__name:"App",setup(n){const t=Je(null),e=Je(!0),i=Je({...oM}),r=Je(!1),{colorGroups:s,error:o,parse:a}=qb();async function l(){var h;const u=(h=t.value)==null?void 0:h.getCurrentGroup();if(u){r.value=!0;try{const m=u.clone();m.rotation.set(0,0,0);const p=await tM(m),v=URL.createObjectURL(p),_=document.createElement("a");_.href=v,_.download="keychain.3mf",_.click(),URL.revokeObjectURL(v)}catch(m){console.error("Export failed:",m)}finally{r.value=!1}}}const c=xf(()=>{var h;const u=(h=t.value)==null?void 0:h.dimensions;return!u||u.width===0&&u.height===0?"— × — × — mm":`${u.width.toFixed(1)} × ${u.height.toFixed(1)} × ${u.depth.toFixed(1)} mm`});return(u,h)=>(Ie(),He("div",aM,[h[3]||(h[3]=Dt("header",{class:"flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0"},[Dt("h1",{class:"text-lg font-semibold tracking-tight"},"Keychain Maker")],-1)),Dt("div",lM,[Dt("aside",cM,[$e(wg,{class:"flex-1 min-h-0 overflow-y-auto",colorGroups:sr(s),error:sr(o),showLogo:e.value,"onUpdate:showLogo":h[0]||(h[0]=m=>e.value=m),config:i.value,"onUpdate:config":h[1]||(h[1]=m=>i.value=m),onSvgLoaded:sr(a)},null,8,["colorGroups","error","showLogo","config","onSvgLoaded"]),Dt("div",uM,[$e(Cg,{disabled:sr(s).length===0,exporting:r.value,onExport:l},null,8,["disabled","exporting"])])]),Dt("main",hM,[$e(Wb,{ref_key:"viewerRef",ref:t,colorGroups:sr(s),showLogo:e.value,config:i.value},null,8,["colorGroups","showLogo","config"]),Dt("div",fM,[Dt("button",{class:"px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 active:bg-gray-100",onClick:h[2]||(h[2]=m=>{var p;return(p=t.value)==null?void 0:p.resetView()})}," Reset View ")])])]),Dt("footer",dM," Dimensions: "+De(c.value),1)]))}});Om(pM).mount("#app");
