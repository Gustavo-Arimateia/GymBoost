/**
 * TinyMCE version 6.6.0 (2023-07-12)
 */

(function () {
    'use strict';

    const getPrototypeOf$2 = Object.getPrototypeOf;
    const hasProto = (v, constructor, predicate) => {
      var _a;
      if (predicate(v, constructor.prototype)) {
        return true;
      } else {
        return ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) === constructor.name;
      }
    };
    const typeOf = x => {
      const t = typeof x;
      if (x === null) {
        return 'null';
      } else if (t === 'object' && Array.isArray(x)) {
        return 'array';
      } else if (t === 'object' && hasProto(x, String, (o, proto) => proto.isPrototypeOf(o))) {
        return 'string';
      } else {
        return t;
      }
    };
    const isType$1 = type => value => typeOf(value) === type;
    const isSimpleType = type => value => typeof value === type;
    const eq$1 = t => a => t === a;
    const is$2 = (value, constructor) => isObject(value) && hasProto(value, constructor, (o, proto) => getPrototypeOf$2(o) === proto);
    const isString = isType$1('string');
    const isObject = isType$1('object');
    const isPlainObject = value => is$2(value, Object);
    const isArray = isType$1('array');
    const isNull = eq$1(null);
    const isBoolean = isSimpleType('boolean');
    const isUndefined = eq$1(undefined);
    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);
    const isFunction = isSimpleType('function');
    const isNumber = isSimpleType('number');
    const isArrayOf = (value, pred) => {
      if (isArray(value)) {
        for (let i = 0, len = value.length; i < len; ++i) {
          if (!pred(value[i])) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    const noop = () => {
    };
    const noarg = f => () => f();
    const compose = (fa, fb) => {
      return (...args) => {
        return fa(fb.apply(null, args));
      };
    };
    const compose1 = (fbc, fab) => a => fbc(fab(a));
    const constant$1 = value => {
      return () => {
        return value;
      };
    };
    const identity = x => {
      return x;
    };
    const tripleEquals = (a, b) => {
      return a === b;
    };
    function curry(fn, ...initialArgs) {
      return (...restArgs) => {
        const all = initialArgs.concat(restArgs);
        return fn.apply(null, all);
      };
    }
    const not = f => t => !f(t);
    const die = msg => {
      return () => {
        throw new Error(msg);
      };
    };
    const apply$1 = f => {
      return f();
    };
    const never = constant$1(false);
    const always = constant$1(true);

    class Optional {
      constructor(tag, value) {
        this.tag = tag;
        this.value = value;
      }
      static some(value) {
        return new Optional(true, value);
      }
      static none() {
        return Optional.singletonNone;
      }
      fold(onNone, onSome) {
        if (this.tag) {
          return onSome(this.value);
        } else {
          return onNone();
        }
      }
      isSome() {
        return this.tag;
      }
      isNone() {
        return !this.tag;
      }
      map(mapper) {
        if (this.tag) {
          return Optional.some(mapper(this.value));
        } else {
          return Optional.none();
        }
      }
      bind(binder) {
        if (this.tag) {
          return binder(this.value);
        } else {
          return Optional.none();
        }
      }
      exists(predicate) {
        return this.tag && predicate(this.value);
      }
      forall(predicate) {
        return !this.tag || predicate(this.value);
      }
      filter(predicate) {
        if (!this.tag || predicate(this.value)) {
          return this;
        } else {
          return Optional.none();
        }
      }
      getOr(replacement) {
        return this.tag ? this.value : replacement;
      }
      or(replacement) {
        return this.tag ? this : replacement;
      }
      getOrThunk(thunk) {
        return this.tag ? this.value : thunk();
      }
      orThunk(thunk) {
        return this.tag ? this : thunk();
      }
      getOrDie(message) {
        if (!this.tag) {
          throw new Error(message !== null && message !== void 0 ? message : 'Called getOrDie on None');
        } else {
          return this.value;
        }
      }
      static from(value) {
        return isNonNullable(value) ? Optional.some(value) : Optional.none();
      }
      getOrNull() {
        return this.tag ? this.value : null;
      }
      getOrUndefined() {
        return this.value;
      }
      each(worker) {
        if (this.tag) {
          worker(this.value);
        }
      }
      toArray() {
        return this.tag ? [this.value] : [];
      }
      toString() {
        return this.tag ? `some(${ this.value })` : 'none()';
      }
    }
    Optional.singletonNone = new Optional(false);

    const nativeSlice = Array.prototype.slice;
    const nativeIndexOf = Array.prototype.indexOf;
    const nativePush = Array.prototype.push;
    const rawIndexOf = (ts, t) => nativeIndexOf.call(ts, t);
    const indexOf = (xs, x) => {
      const r = rawIndexOf(xs, x);
      return r === -1 ? Optional.none() : Optional.some(r);
    };
    const contains$2 = (xs, x) => rawIndexOf(xs, x) > -1;
    const exists = (xs, pred) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return true;
        }
      }
      return false;
    };
    const range$2 = (num, f) => {
      const r = [];
      for (let i = 0; i < num; i++) {
        r.push(f(i));
      }
      return r;
    };
    const chunk$1 = (array, size) => {
      const r = [];
      for (let i = 0; i < array.length; i += size) {
        const s = nativeSlice.call(array, i, i + size);
        r.push(s);
      }
      return r;
    };
    const map$2 = (xs, f) => {
      const len = xs.length;
      const r = new Array(len);
      for (let i = 0; i < len; i++) {
        const x = xs[i];
        r[i] = f(x, i);
      }
      return r;
    };
    const each$1 = (xs, f) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        f(x, i);
      }
    };
    const eachr = (xs, f) => {
      for (let i = xs.length - 1; i >= 0; i--) {
        const x = xs[i];
        f(x, i);
      }
    };
    const partition$3 = (xs, pred) => {
      const pass = [];
      const fail = [];
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        const arr = pred(x, i) ? pass : fail;
        arr.push(x);
      }
      return {
        pass,
        fail
      };
    };
    const filter$2 = (xs, pred) => {
      const r = [];
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          r.push(x);
        }
      }
      return r;
    };
    const foldr = (xs, f, acc) => {
      eachr(xs, (x, i) => {
        acc = f(acc, x, i);
      });
      return acc;
    };
    const foldl = (xs, f, acc) => {
      each$1(xs, (x, i) => {
        acc = f(acc, x, i);
      });
      return acc;
    };
    const findUntil = (xs, pred, until) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return Optional.some(x);
        } else if (until(x, i)) {
          break;
        }
      }
      return Optional.none();
    };
    const find$5 = (xs, pred) => {
      return findUntil(xs, pred, never);
    };
    const findIndex$1 = (xs, pred) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return Optional.some(i);
        }
      }
      return Optional.none();
    };
    const flatten = xs => {
      const r = [];
      for (let i = 0, len = xs.length; i < len; ++i) {
        if (!isArray(xs[i])) {
          throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
        }
        nativePush.apply(r, xs[i]);
      }
      return r;
    };
    const bind$3 = (xs, f) => flatten(map$2(xs, f));
    const forall = (xs, pred) => {
      for (let i = 0, len = xs.length; i < len; ++i) {
        const x = xs[i];
        if (pred(x, i) !== true) {
          return false;
        }
      }
      return true;
    };
    const reverse = xs => {
      const r = nativeSlice.call(xs, 0);
      r.reverse();
      return r;
    };
    const difference = (a1, a2) => filter$2(a1, x => !contains$2(a2, x));
    const mapToObject = (xs, f) => {
      const r = {};
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        r[String(x)] = f(x, i);
      }
      return r;
    };
    const pure$2 = x => [x];
    const sort = (xs, comparator) => {
      const copy = nativeSlice.call(xs, 0);
      copy.sort(comparator);
      return copy;
    };
    const get$h = (xs, i) => i >= 0 && i < xs.length ? Optional.some(xs[i]) : Optional.none();
    const head = xs => get$h(xs, 0);
    const last$1 = xs => get$h(xs, xs.length - 1);
    const from = isFunction(Array.from) ? Array.from : x => nativeSlice.call(x);
    const findMap = (arr, f) => {
      for (let i = 0; i < arr.length; i++) {
        const r = f(arr[i], i);
        if (r.isSome()) {
          return r;
        }
      }
      return Optional.none();
    };

    const keys = Object.keys;
    const hasOwnProperty$1 = Object.hasOwnProperty;
    const each = (obj, f) => {
      const props = keys(obj);
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k];
        const x = obj[i];
        f(x, i);
      }
    };
    const map$1 = (obj, f) => {
      return tupleMap(obj, (x, i) => ({
        k: i,
        v: f(x, i)
      }));
    };
    const tupleMap = (obj, f) => {
      const r = {};
      each(obj, (x, i) => {
        const tuple = f(x, i);
        r[tuple.k] = tuple.v;
      });
      return r;
    };
    const objAcc = r => (x, i) => {
      r[i] = x;
    };
    const internalFilter = (obj, pred, onTrue, onFalse) => {
      each(obj, (x, i) => {
        (pred(x, i) ? onTrue : onFalse)(x, i);
      });
    };
    const bifilter = (obj, pred) => {
      const t = {};
      const f = {};
      internalFilter(obj, pred, objAcc(t), objAcc(f));
      return {
        t,
        f
      };
    };
    const filter$1 = (obj, pred) => {
      const t = {};
      internalFilter(obj, pred, objAcc(t), noop);
      return t;
    };
    const mapToArray = (obj, f) => {
      const r = [];
      each(obj, (value, name) => {
        r.push(f(value, name));
      });
      return r;
    };
    const find$4 = (obj, pred) => {
      const props = keys(obj);
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k];
        const x = obj[i];
        if (pred(x, i, obj)) {
          return Optional.some(x);
        }
      }
      return Optional.none();
    };
    const values = obj => {
      return mapToArray(obj, identity);
    };
    const get$g = (obj, key) => {
      return has$2(obj, key) ? Optional.from(obj[key]) : Optional.none();
    };
    const has$2 = (obj, key) => hasOwnProperty$1.call(obj, key);
    const hasNonNullableKey = (obj, key) => has$2(obj, key) && obj[key] !== undefined && obj[key] !== null;

    const is$1 = (lhs, rhs, comparator = tripleEquals) => lhs.exists(left => comparator(left, rhs));
    const equals = (lhs, rhs, comparator = tripleEquals) => lift2(lhs, rhs, comparator).getOr(lhs.isNone() && rhs.isNone());
    const cat = arr => {
      const r = [];
      const push = x => {
        r.push(x);
      };
      for (let i = 0; i < arr.length; i++) {
        arr[i].each(push);
      }
      return r;
    };
    const sequence = arr => {
      const r = [];
      for (let i = 0; i < arr.length; i++) {
        const x = arr[i];
        if (x.isSome()) {
          r.push(x.getOrDie());
        } else {
          return Optional.none();
        }
      }
      return Optional.some(r);
    };
    const lift2 = (oa, ob, f) => oa.isSome() && ob.isSome() ? Optional.some(f(oa.getOrDie(), ob.getOrDie())) : Optional.none();
    const lift3 = (oa, ob, oc, f) => oa.isSome() && ob.isSome() && oc.isSome() ? Optional.some(f(oa.getOrDie(), ob.getOrDie(), oc.getOrDie())) : Optional.none();
    const mapFrom = (a, f) => a !== undefined && a !== null ? Optional.some(f(a)) : Optional.none();
    const someIf = (b, a) => b ? Optional.some(a) : Optional.none();

    const addToEnd = (str, suffix) => {
      return str + suffix;
    };
    const removeFromStart = (str, numChars) => {
      return str.substring(numChars);
    };

    const checkRange = (str, substr, start) => substr === '' || str.length >= substr.length && str.substr(start, start + substr.length) === substr;
    const removeLeading = (str, prefix) => {
      return startsWith(str, prefix) ? removeFromStart(str, prefix.length) : str;
    };
    const ensureTrailing = (str, suffix) => {
      return endsWith(str, suffix) ? str : addToEnd(str, suffix);
    };
    const contains$1 = (str, substr, start = 0, end) => {
      const idx = str.indexOf(substr, start);
      if (idx !== -1) {
        return isUndefined(end) ? true : idx + substr.length <= end;
      } else {
        return false;
      }
    };
    const startsWith = (str, prefix) => {
      return checkRange(str, prefix, 0);
    };
    const endsWith = (str, suffix) => {
      return checkRange(str, suffix, str.length - suffix.length);
    };
    const blank = r => s => s.replace(r, '');
    const trim$1 = blank(/^\s+|\s+$/g);
    const isNotEmpty = s => s.length > 0;
    const isEmpty = s => !isNotEmpty(s);

    const isSupported$1 = dom => dom.style !== undefined && isFunction(dom.style.getPropertyValue);

    const fromHtml$2 = (html, scope) => {
      const doc = scope || document;
      const div = doc.createElement('div');
      div.innerHTML = html;
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        const message = 'HTML does not have a single root node';
        console.error(message, html);
        throw new Error(message);
      }
      return fromDom(div.childNodes[0]);
    };
    const fromTag = (tag, scope) => {
      const doc = scope || document;
      const node = doc.createElement(tag);
      return fromDom(node);
    };
    const fromText = (text, scope) => {
      const doc = scope || document;
      const node = doc.createTextNode(text);
      return fromDom(node);
    };
    const fromDom = node => {
      if (node === null || node === undefined) {
        throw new Error('Node cannot be null or undefined');
      }
      return { dom: node };
    };
    const fromPoint = (docElm, x, y) => Optional.from(docElm.dom.elementFromPoint(x, y)).map(fromDom);
    const SugarElement = {
      fromHtml: fromHtml$2,
      fromTag,
      fromText,
      fromDom,
      fromPoint
    };

    const Global = typeof window !== 'undefined' ? window : Function('return this;')();

    const path$1 = (parts, scope) => {
      let o = scope !== undefined && scope !== null ? scope : Global;
      for (let i = 0; i < parts.length && o !== undefined && o !== null; ++i) {
        o = o[parts[i]];
      }
      return o;
    };
    const resolve = (p, scope) => {
      const parts = p.split('.');
      return path$1(parts, scope);
    };

    const unsafe = (name, scope) => {
      return resolve(name, scope);
    };
    const getOrDie$1 = (name, scope) => {
      const actual = unsafe(name, scope);
      if (actual === undefined || actual === null) {
        throw new Error(name + ' not available on this browser');
      }
      return actual;
    };

    const getPrototypeOf$1 = Object.getPrototypeOf;
    const sandHTMLElement = scope => {
      return getOrDie$1('HTMLElement', scope);
    };
    const isPrototypeOf = x => {
      const scope = resolve('ownerDocument.defaultView', x);
      return isObject(x) && (sandHTMLElement(scope).prototype.isPrototypeOf(x) || /^HTML\w*Element$/.test(getPrototypeOf$1(x).constructor.name));
    };

    const DOCUMENT = 9;
    const DOCUMENT_FRAGMENT = 11;
    const ELEMENT = 1;
    const TEXT = 3;

    const name$3 = element => {
      const r = element.dom.nodeName;
      return r.toLowerCase();
    };
    const type$1 = element => element.dom.nodeType;
    const isType = t => element => type$1(element) === t;
    const isHTMLElement = element => isElement$1(element) && isPrototypeOf(element.dom);
    const isElement$1 = isType(ELEMENT);
    const isText = isType(TEXT);
    const isDocument = isType(DOCUMENT);
    const isDocumentFragment = isType(DOCUMENT_FRAGMENT);
    const isTag = tag => e => isElement$1(e) && name$3(e) === tag;

    const is = (element, selector) => {
      const dom = element.dom;
      if (dom.nodeType !== ELEMENT) {
        return false;
      } else {
        const elem = dom;
        if (elem.matches !== undefined) {
          return elem.matches(selector);
        } else if (elem.msMatchesSelector !== undefined) {
          return elem.msMatchesSelector(selector);
        } else if (elem.webkitMatchesSelector !== undefined) {
          return elem.webkitMatchesSelector(selector);
        } else if (elem.mozMatchesSelector !== undefined) {
          return elem.mozMatchesSelector(selector);
        } else {
          throw new Error('Browser lacks native selectors');
        }
      }
    };
    const bypassSelector = dom => dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT && dom.nodeType !== DOCUMENT_FRAGMENT || dom.childElementCount === 0;
    const all$3 = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? [] : map$2(base.querySelectorAll(selector), SugarElement.fromDom);
    };
    const one = (selector, scope) => {
      const base = scope === undefined ? document : scope.dom;
      return bypassSelector(base) ? Optional.none() : Optional.from(base.querySelector(selector)).map(SugarElement.fromDom);
    };

    const eq = (e1, e2) => e1.dom === e2.dom;
    const contains = (e1, e2) => {
      const d1 = e1.dom;
      const d2 = e2.dom;
      return d1 === d2 ? false : d1.contains(d2);
    };

    const owner$4 = element => SugarElement.fromDom(element.dom.ownerDocument);
    const documentOrOwner = dos => isDocument(dos) ? dos : owner$4(dos);
    const documentElement = element => SugarElement.fromDom(documentOrOwner(element).dom.documentElement);
    const defaultView = element => SugarElement.fromDom(documentOrOwner(element).dom.defaultView);
    const parent = element => Optional.from(element.dom.parentNode).map(SugarElement.fromDom);
    const parentElement = element => Optional.from(element.dom.parentElement).map(SugarElement.fromDom);
    const parents = (element, isRoot) => {
      const stop = isFunction(isRoot) ? isRoot : never;
      let dom = element.dom;
      const ret = [];
      while (dom.parentNode !== null && dom.parentNode !== undefined) {
        const rawParent = dom.parentNode;
        const p = SugarElement.fromDom(rawParent);
        ret.push(p);
        if (stop(p) === true) {
          break;
        } else {
          dom = rawParent;
        }
      }
      return ret;
    };
    const offsetParent = element => Optional.from(element.dom.offsetParent).map(SugarElement.fromDom);
    const nextSibling = element => Optional.from(element.dom.nextSibling).map(SugarElement.fromDom);
    const children = element => map$2(element.dom.childNodes, SugarElement.fromDom);
    const child$2 = (element, index) => {
      const cs = element.dom.childNodes;
      return Optional.from(cs[index]).map(SugarElement.fromDom);
    };
    const firstChild = element => child$2(element, 0);
    const spot = (element, offset) => ({
      element,
      offset
    });
    const leaf = (element, offset) => {
      const cs = children(element);
      return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
    };

    const isShadowRoot = dos => isDocumentFragment(dos) && isNonNullable(dos.dom.host);
    const supported = isFunction(Element.prototype.attachShadow) && isFunction(Node.prototype.getRootNode);
    const isSupported = constant$1(supported);
    const getRootNode = supported ? e => SugarElement.fromDom(e.dom.getRootNode()) : documentOrOwner;
    const getContentContainer = dos => isShadowRoot(dos) ? dos : SugarElement.fromDom(documentOrOwner(dos).dom.body);
    const isInShadowRoot = e => getShadowRoot(e).isSome();
    const getShadowRoot = e => {
      const r = getRootNode(e);
      return isShadowRoot(r) ? Optional.some(r) : Optional.none();
    };
    const getShadowHost = e => SugarElement.fromDom(e.dom.host);
    const getOriginalEventTarget = event => {
      if (isSupported() && isNonNullable(event.target)) {
        const el = SugarElement.fromDom(event.target);
        if (isElement$1(el) && isOpenShadowHost(el)) {
          if (event.composed && event.composedPath) {
            const composedPath = event.composedPath();
            if (composedPath) {
              return head(composedPath);
            }
          }
        }
      }
      return Optional.from(event.target);
    };
    const isOpenShadowHost = element => isNonNullable(element.dom.shadowRoot);

    const inBody = element => {
      const dom = isText(element) ? element.dom.parentNode : element.dom;
      if (dom === undefined || dom === null || dom.ownerDocument === null) {
        return false;
      }
      const doc = dom.ownerDocument;
      return getShadowRoot(SugarElement.fromDom(dom)).fold(() => doc.body.contains(dom), compose1(inBody, getShadowHost));
    };
    const body = () => getBody(SugarElement.fromDom(document));
    const getBody = doc => {
      const b = doc.dom.body;
      if (b === null || b === undefined) {
        throw new Error('Body is not available yet');
      }
      return SugarElement.fromDom(b);
    };

    const rawSet = (dom, key, value) => {
      if (isString(value) || isBoolean(value) || isNumber(value)) {
        dom.setAttribute(key, value + '');
      } else {
        console.error('Invalid call to Attribute.set. Key ', key, ':: Value ', value, ':: Element ', dom);
        throw new Error('Attribute value was not simple');
      }
    };
    const set$9 = (element, key, value) => {
      rawSet(element.dom, key, value);
    };
    const setAll$1 = (element, attrs) => {
      const dom = element.dom;
      each(attrs, (v, k) => {
        rawSet(dom, k, v);
      });
    };
    const get$f = (element, key) => {
      const v = element.dom.getAttribute(key);
      return v === null ? undefined : v;
    };
    const getOpt = (element, key) => Optional.from(get$f(element, key));
    const has$1 = (element, key) => {
      const dom = element.dom;
      return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
    };
    const remove$7 = (element, key) => {
      element.dom.removeAttribute(key);
    };
    const clone$2 = element => foldl(element.dom.attributes, (acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});

    const internalSet = (dom, property, value) => {
      if (!isString(value)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
        throw new Error('CSS value must be a string: ' + value);
      }
      if (isSupported$1(dom)) {
        dom.style.setProperty(property, value);
      }
    };
    const internalRemove = (dom, property) => {
      if (isSupported$1(dom)) {
        dom.style.removeProperty(property);
      }
    };
    const set$8 = (element, property, value) => {
      const dom = element.dom;
      internalSet(dom, property, value);
    };
    const setAll = (element, css) => {
      const dom = element.dom;
      each(css, (v, k) => {
        internalSet(dom, k, v);
      });
    };
    const setOptions = (element, css) => {
      const dom = element.dom;
      each(css, (v, k) => {
        v.fold(() => {
          internalRemove(dom, k);
        }, value => {
          internalSet(dom, k, value);
        });
      });
    };
    const get$e = (element, property) => {
      const dom = element.dom;
      const styles = window.getComputedStyle(dom);
      const r = styles.getPropertyValue(property);
      return r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
    };
    const getUnsafeProperty = (dom, property) => isSupported$1(dom) ? dom.style.getPropertyValue(property) : '';
    const getRaw = (element, property) => {
      const dom = element.dom;
      const raw = getUnsafeProperty(dom, property);
      return Optional.from(raw).filter(r => r.length > 0);
    };
    const getAllRaw = element => {
      const css = {};
      const dom = element.dom;
      if (isSupported$1(dom)) {
        for (let i = 0; i < dom.style.length; i++) {
          const ruleName = dom.style.item(i);
          css[ruleName] = dom.style[ruleName];
        }
      }
      return css;
    };
    const isValidValue$1 = (tag, property, value) => {
      const element = SugarElement.fromTag(tag);
      set$8(element, property, value);
      const style = getRaw(element, property);
      return style.isSome();
    };
    const remove$6 = (element, property) => {
      const dom = element.dom;
      internalRemove(dom, property);
      if (is$1(getOpt(element, 'style').map(trim$1), '')) {
        remove$7(element, 'style');
      }
    };
    const reflow = e => e.dom.offsetWidth;

    const Dimension = (name, getOffset) => {
      const set = (element, h) => {
        if (!isNumber(h) && !h.match(/^[0-9]+$/)) {
          throw new Error(name + '.set accepts only positive integer values. Value was ' + h);
        }
        const dom = element.dom;
        if (isSupported$1(dom)) {
          dom.style[name] = h + 'px';
        }
      };
      const get = element => {
        const r = getOffset(element);
        if (r <= 0 || r === null) {
          const css = get$e(element, name);
          return parseFloat(css) || 0;
        }
        return r;
      };
      const getOuter = get;
      const aggregate = (element, properties) => foldl(properties, (acc, property) => {
        const val = get$e(element, property);
        const value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
      const max = (element, value, properties) => {
        const cumulativeInclusions = aggregate(element, properties);
        const absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
        return absoluteMax;
      };
      return {
        set,
        get,
        getOuter,
        aggregate,
        max
      };
    };

    const api$2 = Dimension('height', element => {
      const dom = element.dom;
      return inBody(element) ? dom.getBoundingClientRect().height : dom.offsetHeight;
    });
    const get$d = element => api$2.get(element);
    const getOuter$2 = element => api$2.getOuter(element);
    const setMax$1 = (element, value) => {
      const inclusions = [
        'margin-top',
        'border-top-width',
        'padding-top',
        'padding-bottom',
        'border-bottom-width',
        'margin-bottom'
      ];
      const absMax = api$2.max(element, value, inclusions);
      set$8(element, 'max-height', absMax + 'px');
    };

    const r$1 = (left, top) => {
      const translate = (x, y) => r$1(left + x, top + y);
      return {
        left,
        top,
        translate
      };
    };
    const SugarPosition = r$1;

    const boxPosition = dom => {
      const box = dom.getBoundingClientRect();
      return SugarPosition(box.left, box.top);
    };
    const firstDefinedOrZero = (a, b) => {
      if (a !== undefined) {
        return a;
      } else {
        return b !== undefined ? b : 0;
      }
    };
    const absolute$3 = element => {
      const doc = element.dom.ownerDocument;
      const body = doc.body;
      const win = doc.defaultView;
      const html = doc.documentElement;
      if (body === element.dom) {
        return SugarPosition(body.offsetLeft, body.offsetTop);
      }
      const scrollTop = firstDefinedOrZero(win === null || win === void 0 ? void 0 : win.pageYOffset, html.scrollTop);
      const scrollLeft = firstDefinedOrZero(win === null || win === void 0 ? void 0 : win.pageXOffset, html.scrollLeft);
      const clientTop = firstDefinedOrZero(html.clientTop, body.clientTop);
      const clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft);
      return viewport$1(element).translate(scrollLeft - clientLeft, scrollTop - clientTop);
    };
    const viewport$1 = element => {
      const dom = element.dom;
      const doc = dom.ownerDocument;
      const body = doc.body;
      if (body === dom) {
        return SugarPosition(body.offsetLeft, body.offsetTop);
      }
      if (!inBody(element)) {
        return SugarPosition(0, 0);
      }
      return boxPosition(dom);
    };

    const api$1 = Dimension('width', element => element.dom.offsetWidth);
    const set$7 = (element, h) => api$1.set(element, h);
    const get$c = element => api$1.get(element);
    const getOuter$1 = element => api$1.getOuter(element);
    const setMax = (element, value) => {
      const inclusions = [
        'margin-left',
        'border-left-width',
        'padding-left',
        'padding-right',
        'border-right-width',
        'margin-right'
      ];
      const absMax = api$1.max(element, value, inclusions);
      set$8(element, 'max-width', absMax + 'px');
    };

    const cached = f => {
      let called = false;
      let r;
      return (...args) => {
        if (!called) {
          called = true;
          r = f.apply(null, args);
        }
        return r;
      };
    };

    const DeviceType = (os, browser, userAgent, mediaMatch) => {
      const isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
      const isiPhone = os.isiOS() && !isiPad;
      const isMobile = os.isiOS() || os.isAndroid();
      const isTouch = isMobile || mediaMatch('(pointer:coarse)');
      const isTablet = isiPad || !isiPhone && isMobile && mediaMatch('(min-device-width:768px)');
      const isPhone = isiPhone || isMobile && !isTablet;
      const iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
      const isDesktop = !isPhone && !isTablet && !iOSwebview;
      return {
        isiPad: constant$1(isiPad),
        isiPhone: constant$1(isiPhone),
        isTablet: constant$1(isTablet),
        isPhone: constant$1(isPhone),
        isTouch: constant$1(isTouch),
        isAndroid: os.isAndroid,
        isiOS: os.isiOS,
        isWebView: constant$1(iOSwebview),
        isDesktop: constant$1(isDesktop)
      };
    };

    const firstMatch = (regexes, s) => {
      for (let i = 0; i < regexes.length; i++) {
        const x = regexes[i];
        if (x.test(s)) {
          return x;
        }
      }
      return undefined;
    };
    const find$3 = (regexes, agent) => {
      const r = firstMatch(regexes, agent);
      if (!r) {
        return {
          major: 0,
          minor: 0
        };
      }
      const group = i => {
        return Number(agent.replace(r, '$' + i));
      };
      return nu$d(group(1), group(2));
    };
    const detect$5 = (versionRegexes, agent) => {
      const cleanedAgent = String(agent).toLowerCase();
      if (versionRegexes.length === 0) {
        return unknown$3();
      }
      return find$3(versionRegexes, cleanedAgent);
    };
    const unknown$3 = () => {
      return nu$d(0, 0);
    };
    const nu$d = (major, minor) => {
      return {
        major,
        minor
      };
    };
    const Version = {
      nu: nu$d,
      detect: detect$5,
      unknown: unknown$3
    };

    const detectBrowser$1 = (browsers, userAgentData) => {
      return findMap(userAgentData.brands, uaBrand => {
        const lcBrand = uaBrand.brand.toLowerCase();
        return find$5(browsers, browser => {
          var _a;
          return lcBrand === ((_a = browser.brand) === null || _a === void 0 ? void 0 : _a.toLowerCase());
        }).map(info => ({
          current: info.name,
          version: Version.nu(parseInt(uaBrand.version, 10), 0)
        }));
      });
    };

    const detect$4 = (candidates, userAgent) => {
      const agent = String(userAgent).toLowerCase();
      return find$5(candidates, candidate => {
        return candidate.search(agent);
      });
    };
    const detectBrowser = (browsers, userAgent) => {
      return detect$4(browsers, userAgent).map(browser => {
        const version = Version.detect(browser.versionRegexes, userAgent);
        return {
          current: browser.name,
          version
        };
      });
    };
    const detectOs = (oses, userAgent) => {
      return detect$4(oses, userAgent).map(os => {
        const version = Version.detect(os.versionRegexes, userAgent);
        return {
          current: os.name,
          version
        };
      });
    };

    const normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    const checkContains = target => {
      return uastring => {
        return contains$1(uastring, target);
      };
    };
    const browsers = [
      {
        name: 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: uastring => {
          return contains$1(uastring, 'edge/') && contains$1(uastring, 'chrome') && contains$1(uastring, 'safari') && contains$1(uastring, 'applewebkit');
        }
      },
      {
        name: 'Chromium',
        brand: 'Chromium',
        versionRegexes: [
          /.*?chrome\/([0-9]+)\.([0-9]+).*/,
          normalVersionRegex
        ],
        search: uastring => {
          return contains$1(uastring, 'chrome') && !contains$1(uastring, 'chromeframe');
        }
      },
      {
        name: 'IE',
        versionRegexes: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/
        ],
        search: uastring => {
          return contains$1(uastring, 'msie') || contains$1(uastring, 'trident');
        }
      },
      {
        name: 'Opera',
        versionRegexes: [
          normalVersionRegex,
          /.*?opera\/([0-9]+)\.([0-9]+).*/
        ],
        search: checkContains('opera')
      },
      {
        name: 'Firefox',
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: checkContains('firefox')
      },
      {
        name: 'Safari',
        versionRegexes: [
          normalVersionRegex,
          /.*?cpu os ([0-9]+)_([0-9]+).*/
        ],
        search: uastring => {
          return (contains$1(uastring, 'safari') || contains$1(uastring, 'mobile/')) && contains$1(uastring, 'applewebkit');
        }
      }
    ];
    const oses = [
      {
        name: 'Windows',
        search: checkContains('win'),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'iOS',
        search: uastring => {
          return contains$1(uastring, 'iphone') || contains$1(uastring, 'ipad');
        },
        versionRegexes: [
          /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
          /.*cpu os ([0-9]+)_([0-9]+).*/,
          /.*cpu iphone os ([0-9]+)_([0-9]+).*/
        ]
      },
      {
        name: 'Android',
        search: checkContains('android'),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'macOS',
        search: checkContains('mac os x'),
        versionRegexes: [/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/]
      },
      {
        name: 'Linux',
        search: checkContains('linux'),
        versionRegexes: []
      },
      {
        name: 'Solaris',
        search: checkContains('sunos'),
        versionRegexes: []
      },
      {
        name: 'FreeBSD',
        search: checkContains('freebsd'),
        versionRegexes: []
      },
      {
        name: 'ChromeOS',
        search: checkContains('cros'),
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/]
      }
    ];
    const PlatformInfo = {
      browsers: constant$1(browsers),
      oses: constant$1(oses)
    };

    const edge = 'Edge';
    const chromium = 'Chromium';
    const ie = 'IE';
    const opera = 'Opera';
    const firefox = 'Firefox';
    const safari = 'Safari';
    const unknown$2 = () => {
      return nu$c({
        current: undefined,
        version: Version.unknown()
      });
    };
    const nu$c = info => {
      const current = info.current;
      const version = info.version;
      const isBrowser = name => () => current === name;
      return {
        current,
        version,
        isEdge: isBrowser(edge),
        isChromium: isBrowser(chromium),
        isIE: isBrowser(ie),
        isOpera: isBrowser(opera),
        isFirefox: isBrowser(firefox),
        isSafari: isBrowser(safari)
      };
    };
    const Browser = {
      unknown: unknown$2,
      nu: nu$c,
      edge: constant$1(edge),
      chromium: constant$1(chromium),
      ie: constant$1(ie),
      opera: constant$1(opera),
      firefox: constant$1(firefox),
      safari: constant$1(safari)
    };

    const windows = 'Windows';
    const ios = 'iOS';
    const android = 'Android';
    const linux = 'Linux';
    const macos = 'macOS';
    const solaris = 'Solaris';
    const freebsd = 'FreeBSD';
    const chromeos = 'ChromeOS';
    const unknown$1 = () => {
      return nu$b({
        current: undefined,
        version: Version.unknown()
      });
    };
    const nu$b = info => {
      const current = info.current;
      const version = info.version;
      const isOS = name => () => current === name;
      return {
        current,
        version,
        isWindows: isOS(windows),
        isiOS: isOS(ios),
        isAndroid: isOS(android),
        isMacOS: isOS(macos),
        isLinux: isOS(linux),
        isSolaris: isOS(solaris),
        isFreeBSD: isOS(freebsd),
        isChromeOS: isOS(chromeos)
      };
    };
    const OperatingSystem = {
      unknown: unknown$1,
      nu: nu$b,
      windows: constant$1(windows),
      ios: constant$1(ios),
      android: constant$1(android),
      linux: constant$1(linux),
      macos: constant$1(macos),
      solaris: constant$1(solaris),
      freebsd: constant$1(freebsd),
      chromeos: constant$1(chromeos)
    };

    const detect$3 = (userAgent, userAgentDataOpt, mediaMatch) => {
      const browsers = PlatformInfo.browsers();
      const oses = PlatformInfo.oses();
      const browser = userAgentDataOpt.bind(userAgentData => detectBrowser$1(browsers, userAgentData)).orThunk(() => detectBrowser(browsers, userAgent)).fold(Browser.unknown, Browser.nu);
      const os = detectOs(oses, userAgent).fold(OperatingSystem.unknown, OperatingSystem.nu);
      const deviceType = DeviceType(os, browser, userAgent, mediaMatch);
      return {
        browser,
        os,
        deviceType
      };
    };
    const PlatformDetection = { detect: detect$3 };

    const mediaMatch = query => window.matchMedia(query).matches;
    let platform = cached(() => PlatformDetection.detect(navigator.userAgent, Optional.from(navigator.userAgentData), mediaMatch));
    const detect$2 = () => platform();

    const mkEvent = (target, x, y, stop, prevent, kill, raw) => ({
      target,
      x,
      y,
      stop,
      prevent,
      kill,
      raw
    });
    const fromRawEvent$1 = rawEvent => {
      const target = SugarElement.fromDom(getOriginalEventTarget(rawEvent).getOr(rawEvent.target));
      const stop = () => rawEvent.stopPropagation();
      const prevent = () => rawEvent.preventDefault();
      const kill = compose(prevent, stop);
      return mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
    };
    const handle = (filter, handler) => rawEvent => {
      if (filter(rawEvent)) {
        handler(fromRawEvent$1(rawEvent));
      }
    };
    const binder = (element, event, filter, handler, useCapture) => {
      const wrapped = handle(filter, handler);
      element.dom.addEventListener(event, wrapped, useCapture);
      return { unbind: curry(unbind, element, event, wrapped, useCapture) };
    };
    const bind$2 = (element, event, filter, handler) => binder(element, event, filter, handler, false);
    const capture$1 = (element, event, filter, handler) => binder(element, event, filter, handler, true);
    const unbind = (element, event, handler, useCapture) => {
      element.dom.removeEventListener(event, handler, useCapture);
    };

    const before$1 = (marker, element) => {
      const parent$1 = parent(marker);
      parent$1.each(v => {
        v.dom.insertBefore(element.dom, marker.dom);
      });
    };
    const after$2 = (marker, element) => {
      const sibling = nextSibling(marker);
      sibling.fold(() => {
        const parent$1 = parent(marker);
        parent$1.each(v => {
          append$2(v, element);
        });
      }, v => {
        before$1(v, element);
      });
    };
    const prepend$1 = (parent, element) => {
      const firstChild$1 = firstChild(parent);
      firstChild$1.fold(() => {
        append$2(parent, element);
      }, v => {
        parent.dom.insertBefore(element.dom, v.dom);
      });
    };
    const append$2 = (parent, element) => {
      parent.dom.appendChild(element.dom);
    };
    const appendAt = (parent, element, index) => {
      child$2(parent, index).fold(() => {
        append$2(parent, element);
      }, v => {
        before$1(v, element);
      });
    };

    const append$1 = (parent, elements) => {
      each$1(elements, x => {
        append$2(parent, x);
      });
    };

    const empty = element => {
      element.dom.textContent = '';
      each$1(children(element), rogue => {
        remove$5(rogue);
      });
    };
    const remove$5 = element => {
      const dom = element.dom;
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom);
      }
    };

    const get$b = _DOC => {
      const doc = _DOC !== undefined ? _DOC.dom : document;
      const x = doc.body.scrollLeft || doc.documentElement.scrollLeft;
      const y = doc.body.scrollTop || doc.documentElement.scrollTop;
      return SugarPosition(x, y);
    };
    const to = (x, y, _DOC) => {
      const doc = _DOC !== undefined ? _DOC.dom : document;
      const win = doc.defaultView;
      if (win) {
        win.scrollTo(x, y);
      }
    };

    const get$a = _win => {
      const win = _win === undefined ? window : _win;
      if (detect$2().browser.isFirefox()) {
        return Optional.none();
      } else {
        return Optional.from(win.visualViewport);
      }
    };
    const bounds$1 = (x, y, width, height) => ({
      x,
      y,
      width,
      height,
      right: x + width,
      bottom: y + height
    });
    const getBounds$3 = _win => {
      const win = _win === undefined ? window : _win;
      const doc = win.document;
      const scroll = get$b(SugarElement.fromDom(doc));
      return get$a(win).fold(() => {
        const html = win.document.documentElement;
        const width = html.clientWidth;
        const height = html.clientHeight;
        return bounds$1(scroll.left, scroll.top, width, height);
      }, visualViewport => bounds$1(Math.max(visualViewport.pageLeft, scroll.left), Math.max(visualViewport.pageTop, scroll.top), visualViewport.width, visualViewport.height));
    };

    const getDocument = () => SugarElement.fromDom(document);

    const walkUp = (navigation, doc) => {
      const frame = navigation.view(doc);
      return frame.fold(constant$1([]), f => {
        const parent = navigation.owner(f);
        const rest = walkUp(navigation, parent);
        return [f].concat(rest);
      });
    };
    const pathTo = (element, navigation) => {
      const d = navigation.owner(element);
      const paths = walkUp(navigation, d);
      return Optional.some(paths);
    };

    const view = doc => {
      var _a;
      const element = doc.dom === document ? Optional.none() : Optional.from((_a = doc.dom.defaultView) === null || _a === void 0 ? void 0 : _a.frameElement);
      return element.map(SugarElement.fromDom);
    };
    const owner$3 = element => owner$4(element);

    var Navigation = /*#__PURE__*/Object.freeze({
        __proto__: null,
        view: view,
        owner: owner$3
    });

    const find$2 = element => {
      const doc = getDocument();
      const scroll = get$b(doc);
      const path = pathTo(element, Navigation);
      return path.fold(curry(absolute$3, element), frames => {
        const offset = viewport$1(element);
        const r = foldr(frames, (b, a) => {
          const loc = viewport$1(a);
          return {
            left: b.left + loc.left,
            top: b.top + loc.top
          };
        }, {
          left: 0,
          top: 0
        });
        return SugarPosition(r.left + offset.left + scroll.left, r.top + offset.top + scroll.top);
      });
    };

    const pointed = (point, width, height) => ({
      point,
      width,
      height
    });
    const rect = (x, y, width, height) => ({
      x,
      y,
      width,
      height
    });
    const bounds = (x, y, width, height) => ({
      x,
      y,
      width,
      height,
      right: x + width,
      bottom: y + height
    });
    const box$1 = element => {
      const xy = absolute$3(element);
      const w = getOuter$1(element);
      const h = getOuter$2(element);
      return bounds(xy.left, xy.top, w, h);
    };
    const absolute$2 = element => {
      const position = find$2(element);
      const width = getOuter$1(element);
      const height = getOuter$2(element);
      return bounds(position.left, position.top, width, height);
    };
    const constrain = (original, constraint) => {
      const left = Math.max(original.x, constraint.x);
      const top = Math.max(original.y, constraint.y);
      const right = Math.min(original.right, constraint.right);
      const bottom = Math.min(original.bottom, constraint.bottom);
      const width = right - left;
      const height = bottom - top;
      return bounds(left, top, width, height);
    };
    const constrainByMany = (original, constraints) => {
      return foldl(constraints, (acc, c) => constrain(acc, c), original);
    };
    const win = () => getBounds$3(window);

    var global$a = tinymce.util.Tools.resolve('tinymce.ThemeManager');

    const value$4 = value => {
      const applyHelper = fn => fn(value);
      const constHelper = constant$1(value);
      const outputHelper = () => output;
      const output = {
        tag: true,
        inner: value,
        fold: (_onError, onValue) => onValue(value),
        isValue: always,
        isError: never,
        map: mapper => Result.value(mapper(value)),
        mapError: outputHelper,
        bind: applyHelper,
        exists: applyHelper,
        forall: applyHelper,
        getOr: constHelper,
        or: outputHelper,
        getOrThunk: constHelper,
        orThunk: outputHelper,
        getOrDie: constHelper,
        each: fn => {
          fn(value);
        },
        toOptional: () => Optional.some(value)
      };
      return output;
    };
    const error$1 = error => {
      const outputHelper = () => output;
      const output = {
        tag: false,
        inner: error,
        fold: (onError, _onValue) => onError(error),
        isValue: never,
        isError: always,
        map: outputHelper,
        mapError: mapper => Result.error(mapper(error)),
        bind: outputHelper,
        exists: never,
        forall: always,
        getOr: identity,
        or: identity,
        getOrThunk: apply$1,
        orThunk: apply$1,
        getOrDie: die(String(error)),
        each: noop,
        toOptional: Optional.none
      };
      return output;
    };
    const fromOption = (optional, err) => optional.fold(() => error$1(err), value$4);
    const Result = {
      value: value$4,
      error: error$1,
      fromOption
    };

    var SimpleResultType;
    (function (SimpleResultType) {
      SimpleResultType[SimpleResultType['Error'] = 0] = 'Error';
      SimpleResultType[SimpleResultType['Value'] = 1] = 'Value';
    }(SimpleResultType || (SimpleResultType = {})));
    const fold$1 = (res, onError, onValue) => res.stype === SimpleResultType.Error ? onError(res.serror) : onValue(res.svalue);
    const partition$2 = results => {
      const values = [];
      const errors = [];
      each$1(results, obj => {
        fold$1(obj, err => errors.push(err), val => values.push(val));
      });
      return {
        values,
        errors
      };
    };
    const mapError = (res, f) => {
      if (res.stype === SimpleResultType.Error) {
        return {
          stype: SimpleResultType.Error,
          serror: f(res.serror)
        };
      } else {
        return res;
      }
    };
    const map = (res, f) => {
      if (res.stype === SimpleResultType.Value) {
        return {
          stype: SimpleResultType.Value,
          svalue: f(res.svalue)
        };
      } else {
        return res;
      }
    };
    const bind$1 = (res, f) => {
      if (res.stype === SimpleResultType.Value) {
        return f(res.svalue);
      } else {
        return res;
      }
    };
    const bindError = (res, f) => {
      if (res.stype === SimpleResultType.Error) {
        return f(res.serror);
      } else {
        return res;
      }
    };
    const svalue = v => ({
      stype: SimpleResultType.Value,
      svalue: v
    });
    const serror = e => ({
      stype: SimpleResultType.Error,
      serror: e
    });
    const toResult$1 = res => fold$1(res, Result.error, Result.value);
    const fromResult$1 = res => res.fold(serror, svalue);
    const SimpleResult = {
      fromResult: fromResult$1,
      toResult: toResult$1,
      svalue,
      partition: partition$2,
      serror,
      bind: bind$1,
      bindError,
      map,
      mapError,
      fold: fold$1
    };

    const field$2 = (key, newKey, presence, prop) => ({
      tag: 'field',
      key,
      newKey,
      presence,
      prop
    });
    const customField$1 = (newKey, instantiator) => ({
      tag: 'custom',
      newKey,
      instantiator
    });
    const fold = (value, ifField, ifCustom) => {
      switch (value.tag) {
      case 'field':
        return ifField(value.key, value.newKey, value.presence, value.prop);
      case 'custom':
        return ifCustom(value.newKey, value.instantiator);
      }
    };

    const shallow$1 = (old, nu) => {
      return nu;
    };
    const deep = (old, nu) => {
      const bothObjects = isPlainObject(old) && isPlainObject(nu);
      return bothObjects ? deepMerge(old, nu) : nu;
    };
    const baseMerge = merger => {
      return (...objects) => {
        if (objects.length === 0) {
          throw new Error(`Can't merge zero objects`);
        }
        const ret = {};
        for (let j = 0; j < objects.length; j++) {
          const curObject = objects[j];
          for (const key in curObject) {
            if (has$2(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key]);
            }
          }
        }
        return ret;
      };
    };
    const deepMerge = baseMerge(deep);
    const merge$1 = baseMerge(shallow$1);

    const required$2 = () => ({
      tag: 'required',
      process: {}
    });
    const defaultedThunk = fallbackThunk => ({
      tag: 'defaultedThunk',
      process: fallbackThunk
    });
    const defaulted$1 = fallback => defaultedThunk(constant$1(fallback));
    const asOption = () => ({
      tag: 'option',
      process: {}
    });
    const mergeWithThunk = baseThunk => ({
      tag: 'mergeWithThunk',
      process: baseThunk
    });
    const mergeWith = base => mergeWithThunk(constant$1(base));

    const mergeValues$1 = (values, base) => values.length > 0 ? SimpleResult.svalue(deepMerge(base, merge$1.apply(undefined, values))) : SimpleResult.svalue(base);
    const mergeErrors$1 = errors => compose(SimpleResult.serror, flatten)(errors);
    const consolidateObj = (objects, base) => {
      const partition = SimpleResult.partition(objects);
      return partition.errors.length > 0 ? mergeErrors$1(partition.errors) : mergeValues$1(partition.values, base);
    };
    const consolidateArr = objects => {
      const partitions = SimpleResult.partition(objects);
      return partitions.errors.length > 0 ? mergeErrors$1(partitions.errors) : SimpleResult.svalue(partitions.values);
    };
    const ResultCombine = {
      consolidateObj,
      consolidateArr
    };

    const formatObj = input => {
      return isObject(input) && keys(input).length > 100 ? ' removed due to size' : JSON.stringify(input, null, 2);
    };
    const formatErrors = errors => {
      const es = errors.length > 10 ? errors.slice(0, 10).concat([{
          path: [],
          getErrorInfo: constant$1('... (only showing first ten failures)')
        }]) : errors;
      return map$2(es, e => {
        return 'Failed path: (' + e.path.join(' > ') + ')\n' + e.getErrorInfo();
      });
    };

    const nu$a = (path, getErrorInfo) => {
      return SimpleResult.serror([{
          path,
          getErrorInfo
        }]);
    };
    const missingRequired = (path, key, obj) => nu$a(path, () => 'Could not find valid *required* value for "' + key + '" in ' + formatObj(obj));
    const missingKey = (path, key) => nu$a(path, () => 'Choice schema did not contain choice key: "' + key + '"');
    const missingBranch = (path, branches, branch) => nu$a(path, () => 'The chosen schema: "' + branch + '" did not exist in branches: ' + formatObj(branches));
    const unsupportedFields = (path, unsupported) => nu$a(path, () => 'There are unsupported fields: [' + unsupported.join(', ') + '] specified');
    const custom = (path, err) => nu$a(path, constant$1(err));

    const value$3 = validator => {
      const extract = (path, val) => {
        return SimpleResult.bindError(validator(val), err => custom(path, err));
      };
      const toString = constant$1('val');
      return {
        extract,
        toString
      };
    };
    const anyValue$1 = value$3(SimpleResult.svalue);

    const requiredAccess = (path, obj, key, bundle) => get$g(obj, key).fold(() => missingRequired(path, key, obj), bundle);
    const fallbackAccess = (obj, key, fallback, bundle) => {
      const v = get$g(obj, key).getOrThunk(() => fallback(obj));
      return bundle(v);
    };
    const optionAccess = (obj, key, bundle) => bundle(get$g(obj, key));
    const optionDefaultedAccess = (obj, key, fallback, bundle) => {
      const opt = get$g(obj, key).map(val => val === true ? fallback(obj) : val);
      return bundle(opt);
    };
    const extractField = (field, path, obj, key, prop) => {
      const bundle = av => prop.extract(path.concat([key]), av);
      const bundleAsOption = optValue => optValue.fold(() => SimpleResult.svalue(Optional.none()), ov => {
        const result = prop.extract(path.concat([key]), ov);
        return SimpleResult.map(result, Optional.some);
      });
      switch (field.tag) {
      case 'required':
        return requiredAccess(path, obj, key, bundle);
      case 'defaultedThunk':
        return fallbackAccess(obj, key, field.process, bundle);
      case 'option':
        return optionAccess(obj, key, bundleAsOption);
      case 'defaultedOptionThunk':
        return optionDefaultedAccess(obj, key, field.process, bundleAsOption);
      case 'mergeWithThunk': {
          return fallbackAccess(obj, key, constant$1({}), v => {
            const result = deepMerge(field.process(obj), v);
            return bundle(result);
          });
        }
      }
    };
    const extractFields = (path, obj, fields) => {
      const success = {};
      const errors = [];
      for (const field of fields) {
        fold(field, (key, newKey, presence, prop) => {
          const result = extractField(presence, path, obj, key, prop);
          SimpleResult.fold(result, err => {
            errors.push(...err);
          }, res => {
            success[newKey] = res;
          });
        }, (newKey, instantiator) => {
          success[newKey] = instantiator(obj);
        });
      }
      return errors.length > 0 ? SimpleResult.serror(errors) : SimpleResult.svalue(success);
    };
    const valueThunk = getDelegate => {
      const extract = (path, val) => getDelegate().extract(path, val);
      const toString = () => getDelegate().toString();
      return {
        extract,
        toString
      };
    };
    const getSetKeys = obj => keys(filter$1(obj, isNonNullable));
    const objOfOnly = fields => {
      const delegate = objOf(fields);
      const fieldNames = foldr(fields, (acc, value) => {
        return fold(value, key => deepMerge(acc, { [key]: true }), constant$1(acc));
      }, {});
      const extract = (path, o) => {
        const keys = isBoolean(o) ? [] : getSetKeys(o);
        const extra = filter$2(keys, k => !hasNonNullableKey(fieldNames, k));
        return extra.length === 0 ? delegate.extract(path, o) : unsupportedFields(path, extra);
      };
      return {
        extract,
        toString: delegate.toString
      };
    };
    const objOf = values => {
      const extract = (path, o) => extractFields(path, o, values);
      const toString = () => {
        const fieldStrings = map$2(values, value => fold(value, (key, _okey, _presence, prop) => key + ' -> ' + prop.toString(), (newKey, _instantiator) => 'state(' + newKey + ')'));
        return 'obj{\n' + fieldStrings.join('\n') + '}';
      };
      return {
        extract,
        toString
      };
    };
    const arrOf = prop => {
      const extract = (path, array) => {
        const results = map$2(array, (a, i) => prop.extract(path.concat(['[' + i + ']']), a));
        return ResultCombine.consolidateArr(results);
      };
      const toString = () => 'array(' + prop.toString() + ')';
      return {
        extract,
        toString
      };
    };
    const oneOf = (props, rawF) => {
      const f = rawF !== undefined ? rawF : identity;
      const extract = (path, val) => {
        const errors = [];
        for (const prop of props) {
          const res = prop.extract(path, val);
          if (res.stype === SimpleResultType.Value) {
            return {
              stype: SimpleResultType.Value,
              svalue: f(res.svalue)
            };
          }
          errors.push(res);
        }
        return ResultCombine.consolidateArr(errors);
      };
      const toString = () => 'oneOf(' + map$2(props, prop => prop.toString()).join(', ') + ')';
      return {
        extract,
        toString
      };
    };
    const setOf$1 = (validator, prop) => {
      const validateKeys = (path, keys) => arrOf(value$3(validator)).extract(path, keys);
      const extract = (path, o) => {
        const keys$1 = keys(o);
        const validatedKeys = validateKeys(path, keys$1);
        return SimpleResult.bind(validatedKeys, validKeys => {
          const schema = map$2(validKeys, vk => {
            return field$2(vk, vk, required$2(), prop);
          });
          return objOf(schema).extract(path, o);
        });
      };
      const toString = () => 'setOf(' + prop.toString() + ')';
      return {
        extract,
        toString
      };
    };
    const thunk = (_desc, processor) => {
      const getP = cached(processor);
      const extract = (path, val) => getP().extract(path, val);
      const toString = () => getP().toString();
      return {
        extract,
        toString
      };
    };
    const arrOfObj = compose(arrOf, objOf);

    const anyValue = constant$1(anyValue$1);
    const typedValue = (validator, expectedType) => value$3(a => {
      const actualType = typeof a;
      return validator(a) ? SimpleResult.svalue(a) : SimpleResult.serror(`Expected type: ${ expectedType } but got: ${ actualType }`);
    });
    const number = typedValue(isNumber, 'number');
    const string = typedValue(isString, 'string');
    const boolean = typedValue(isBoolean, 'boolean');
    const functionProcessor = typedValue(isFunction, 'function');
    const isPostMessageable = val => {
      if (Object(val) !== val) {
        return true;
      }
      switch ({}.toString.call(val).slice(8, -1)) {
      case 'Boolean':
      case 'Number':
      case 'String':
      case 'Date':
      case 'RegExp':
      case 'Blob':
      case 'FileList':
      case 'ImageData':
      case 'ImageBitmap':
      case 'ArrayBuffer':
        return true;
      case 'Array':
      case 'Object':
        return Object.keys(val).every(prop => isPostMessageable(val[prop]));
      default:
        return false;
      }
    };
    const postMessageable = value$3(a => {
      if (isPostMessageable(a)) {
        return SimpleResult.svalue(a);
      } else {
        return SimpleResult.serror('Expected value to be acceptable for sending via postMessage');
      }
    });

    const chooseFrom = (path, input, branches, ch) => {
      const fields = get$g(branches, ch);
      return fields.fold(() => missingBranch(path, branches, ch), vp => vp.extract(path.concat(['branch: ' + ch]), input));
    };
    const choose$2 = (key, branches) => {
      const extract = (path, input) => {
        const choice = get$g(input, key);
        return choice.fold(() => missingKey(path, key), chosen => chooseFrom(path, input, branches, chosen));
      };
      const toString = () => 'chooseOn(' + key + '). Possible values: ' + keys(branches);
      return {
        extract,
        toString
      };
    };

    const arrOfVal = () => arrOf(anyValue$1);
    const valueOf = validator => value$3(v => validator(v).fold(SimpleResult.serror, SimpleResult.svalue));
    const setOf = (validator, prop) => setOf$1(v => SimpleResult.fromResult(validator(v)), prop);
    const extractValue = (label, prop, obj) => {
      const res = prop.extract([label], obj);
      return SimpleResult.mapError(res, errs => ({
        input: obj,
        errors: errs
      }));
    };
    const asRaw = (label, prop, obj) => SimpleResult.toResult(extractValue(label, prop, obj));
    const getOrDie = extraction => {
      return extraction.fold(errInfo => {
        throw new Error(formatError(errInfo));
      }, identity);
    };
    const asRawOrDie$1 = (label, prop, obj) => getOrDie(asRaw(label, prop, obj));
    const formatError = errInfo => {
      return 'Errors: \n' + formatErrors(errInfo.errors).join('\n') + '\n\nInput object: ' + formatObj(errInfo.input);
    };
    const choose$1 = (key, branches) => choose$2(key, map$1(branches, objOf));
    const thunkOf = (desc, schema) => thunk(desc, schema);

    const field$1 = field$2;
    const customField = customField$1;
    const validateEnum = values => valueOf(value => contains$2(values, value) ? Result.value(value) : Result.error(`Unsupported value: "${ value }", choose one of "${ values.join(', ') }".`));
    const required$1 = key => field$1(key, key, required$2(), anyValue());
    const requiredOf = (key, schema) => field$1(key, key, required$2(), schema);
    const requiredNumber = key => requiredOf(key, number);
    const requiredString = key => requiredOf(key, string);
    const requiredStringEnum = (key, values) => field$1(key, key, required$2(), validateEnum(values));
    const requiredBoolean = key => requiredOf(key, boolean);
    const requiredFunction = key => requiredOf(key, functionProcessor);
    const forbid = (key, message) => field$1(key, key, asOption(), value$3(_v => SimpleResult.serror('The field: ' + key + ' is forbidden. ' + message)));
    const requiredObjOf = (key, objSchema) => field$1(key, key, required$2(), objOf(objSchema));
    const requiredArrayOfObj = (key, objFields) => field$1(key, key, required$2(), arrOfObj(objFields));
    const requiredArrayOf = (key, schema) => field$1(key, key, required$2(), arrOf(schema));
    const option$3 = key => field$1(key, key, asOption(), anyValue());
    const optionOf = (key, schema) => field$1(key, key, asOption(), schema);
    const optionNumber = key => optionOf(key, number);
    const optionString = key => optionOf(key, string);
    const optionStringEnum = (key, values) => optionOf(key, validateEnum(values));
    const optionFunction = key => optionOf(key, functionProcessor);
    const optionArrayOf = (key, schema) => optionOf(key, arrOf(schema));
    const optionObjOf = (key, objSchema) => optionOf(key, objOf(objSchema));
    const optionObjOfOnly = (key, objSchema) => optionOf(key, objOfOnly(objSchema));
    const defaulted = (key, fallback) => field$1(key, key, defaulted$1(fallback), anyValue());
    const defaultedOf = (key, fallback, schema) => field$1(key, key, defaulted$1(fallback), schema);
    const defaultedNumber = (key, fallback) => defaultedOf(key, fallback, number);
    const defaultedString = (key, fallback) => defaultedOf(key, fallback, string);
    const defaultedStringEnum = (key, fallback, values) => defaultedOf(key, fallback, validateEnum(values));
    const defaultedBoolean = (key, fallback) => defaultedOf(key, fallback, boolean);
    const defaultedFunction = (key, fallback) => defaultedOf(key, fallback, functionProcessor);
    const defaultedPostMsg = (key, fallback) => defaultedOf(key, fallback, postMessageable);
    const defaultedArrayOf = (key, fallback, schema) => defaultedOf(key, fallback, arrOf(schema));
    const defaultedObjOf = (key, fallback, objSchema) => defaultedOf(key, fallback, objOf(objSchema));

    const Cell = initial => {
      let value = initial;
      const get = () => {
        return value;
      };
      const set = v => {
        value = v;
      };
      return {
        get,
        set
      };
    };

    const generate$7 = cases => {
      if (!isArray(cases)) {
        throw new Error('cases must be an array');
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case');
      }
      const constructors = [];
      const adt = {};
      each$1(cases, (acase, count) => {
        const keys$1 = keys(acase);
        if (keys$1.length !== 1) {
          throw new Error('one and only one name per case');
        }
        const key = keys$1[0];
        const value = acase[key];
        if (adt[key] !== undefined) {
          throw new Error('duplicate key detected:' + key);
        } else if (key === 'cata') {
          throw new Error('cannot have a case named cata (sorry)');
        } else if (!isArray(value)) {
          throw new Error('case arguments must be an array');
        }
        constructors.push(key);
        adt[key] = (...args) => {
          const argLength = args.length;
          if (argLength !== value.length) {
            throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
          }
          const match = branches => {
            const branchKeys = keys(branches);
            if (constructors.length !== branchKeys.length) {
              throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
            }
            const allReqd = forall(constructors, reqKey => {
              return contains$2(branchKeys, reqKey);
            });
            if (!allReqd) {
              throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
            }
            return branches[key].apply(null, args);
          };
          return {
            fold: (...foldArgs) => {
              if (foldArgs.length !== cases.length) {
                throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + foldArgs.length);
              }
              const target = foldArgs[count];
              return target.apply(null, args);
            },
            match,
            log: label => {
              console.log(label, {
                constructors,
                constructor: key,
                params: args
              });
            }
          };
        };
      });
      return adt;
    };
    const Adt = { generate: generate$7 };

    Adt.generate([
      {
        bothErrors: [
          'error1',
          'error2'
        ]
      },
      {
        firstError: [
          'error1',
          'value2'
        ]
      },
      {
        secondError: [
          'value1',
          'error2'
        ]
      },
      {
        bothValues: [
          'value1',
          'value2'
        ]
      }
    ]);
    const partition$1 = results => {
      const errors = [];
      const values = [];
      each$1(results, result => {
        result.fold(err => {
          errors.push(err);
        }, value => {
          values.push(value);
        });
      });
      return {
        errors,
        values
      };
    };

    const exclude$1 = (obj, fields) => {
      const r = {};
      each(obj, (v, k) => {
        if (!contains$2(fields, k)) {
          r[k] = v;
        }
      });
      return r;
    };

    const wrap$2 = (key, value) => ({ [key]: value });
    const wrapAll$1 = keyvalues => {
      const r = {};
      each$1(keyvalues, kv => {
        r[kv.key] = kv.value;
      });
      return r;
    };

    const exclude = (obj, fields) => exclude$1(obj, fields);
    const wrap$1 = (key, value) => wrap$2(key, value);
    const wrapAll = keyvalues => wrapAll$1(keyvalues);
    const mergeValues = (values, base) => {
      return values.length === 0 ? Result.value(base) : Result.value(deepMerge(base, merge$1.apply(undefined, values)));
    };
    const mergeErrors = errors => Result.error(flatten(errors));
    const consolidate = (objs, base) => {
      const partitions = partition$1(objs);
      return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base);
    };

    const ensureIsRoot = isRoot => isFunction(isRoot) ? isRoot : never;
    const ancestor$2 = (scope, transform, isRoot) => {
      let element = scope.dom;
      const stop = ensureIsRoot(isRoot);
      while (element.parentNode) {
        element = element.parentNode;
        const el = SugarElement.fromDom(element);
        const transformed = transform(el);
        if (transformed.isSome()) {
          return transformed;
        } else if (stop(el)) {
          break;
        }
      }
      return Optional.none();
    };
    const closest$4 = (scope, transform, isRoot) => {
      const current = transform(scope);
      const stop = ensureIsRoot(isRoot);
      return current.orThunk(() => stop(scope) ? Optional.none() : ancestor$2(scope, transform, stop));
    };

    const isSource = (component, simulatedEvent) => eq(component.element, simulatedEvent.event.target);

    const defaultEventHandler = {
      can: always,
      abort: never,
      run: noop
    };
    const nu$9 = parts => {
      if (!hasNonNullableKey(parts, 'can') && !hasNonNullableKey(parts, 'abort') && !hasNonNullableKey(parts, 'run')) {
        throw new Error('EventHandler defined by: ' + JSON.stringify(parts, null, 2) + ' does not have can, abort, or run!');
      }
      return {
        ...defaultEventHandler,
        ...parts
      };
    };
    const all$2 = (handlers, f) => (...args) => foldl(handlers, (acc, handler) => acc && f(handler).apply(undefined, args), true);
    const any = (handlers, f) => (...args) => foldl(handlers, (acc, handler) => acc || f(handler).apply(undefined, args), false);
    const read$2 = handler => isFunction(handler) ? {
      can: always,
      abort: never,
      run: handler
    } : handler;
    const fuse$1 = handlers => {
      const can = all$2(handlers, handler => handler.can);
      const abort = any(handlers, handler => handler.abort);
      const run = (...args) => {
        each$1(handlers, handler => {
          handler.run.apply(undefined, args);
        });
      };
      return {
        can,
        abort,
        run
      };
    };

    const constant = constant$1;
    const touchstart = constant('touchstart');
    const touchmove = constant('touchmove');
    const touchend = constant('touchend');
    const touchcancel = constant('touchcancel');
    const mousedown = constant('mousedown');
    const mousemove = constant('mousemove');
    const mouseout = constant('mouseout');
    const mouseup = constant('mouseup');
    const mouseover = constant('mouseover');
    const focusin = constant('focusin');
    const focusout = constant('focusout');
    const keydown = constant('keydown');
    const keyup = constant('keyup');
    const input = constant('input');
    const change = constant('change');
    const click = constant('click');
    const transitioncancel = constant('transitioncancel');
    const transitionend = constant('transitionend');
    const transitionstart = constant('transitionstart');
    const selectstart = constant('selectstart');

    const prefixName = name => constant$1('alloy.' + name);
    const alloy = { tap: prefixName('tap') };
    const focus$4 = prefixName('focus');
    const postBlur = prefixName('blur.post');
    const postPaste = prefixName('paste.post');
    const receive = prefixName('receive');
    const execute$5 = prefixName('execute');
    const focusItem = prefixName('focus.item');
    const tap = alloy.tap;
    const longpress = prefixName('longpress');
    const sandboxClose = prefixName('sandbox.close');
    const typeaheadCancel = prefixName('typeahead.cancel');
    const systemInit = prefixName('system.init');
    const documentTouchmove = prefixName('system.touchmove');
    const documentTouchend = prefixName('system.touchend');
    const windowScroll = prefixName('system.scroll');
    const windowResize = prefixName('system.resize');
    const attachedToDom = prefixName('system.attached');
    const detachedFromDom = prefixName('system.detached');
    const dismissRequested = prefixName('system.dismissRequested');
    const repositionRequested = prefixName('system.repositionRequested');
    const focusShifted = prefixName('focusmanager.shifted');
    const slotVisibility = prefixName('slotcontainer.visibility');
    const externalElementScroll = prefixName('system.external.element.scroll');
    const changeTab = prefixName('change.tab');
    const dismissTab = prefixName('dismiss.tab');
    const highlight$1 = prefixName('highlight');
    const dehighlight$1 = prefixName('dehighlight');

    const emit = (component, event) => {
      dispatchWith(component, component.element, event, {});
    };
    const emitWith = (component, event, properties) => {
      dispatchWith(component, component.element, event, properties);
    };
    const emitExecute = component => {
      emit(component, execute$5());
    };
    const dispatch = (component, target, event) => {
      dispatchWith(component, target, event, {});
    };
    const dispatchWith = (component, target, event, properties) => {
      const data = {
        target,
        ...properties
      };
      component.getSystem().triggerEvent(event, target, data);
    };
    const retargetAndDispatchWith = (component, target, eventName, properties) => {
      const data = {
        ...properties,
        target
      };
      component.getSystem().triggerEvent(eventName, target, data);
    };
    const dispatchEvent = (component, target, event, simulatedEvent) => {
      component.getSystem().triggerEvent(event, target, simulatedEvent.event);
    };

    const derive$2 = configs => wrapAll(configs);
    const abort = (name, predicate) => {
      return {
        key: name,
        value: nu$9({ abort: predicate })
      };
    };
    const can = (name, predicate) => {
      return {
        key: name,
        value: nu$9({ can: predicate })
      };
    };
    const preventDefault = name => {
      return {
        key: name,
        value: nu$9({
          run: (component, simulatedEvent) => {
            simulatedEvent.event.prevent();
          }
        })
      };
    };
    const run$1 = (name, handler) => {
      return {
        key: name,
        value: nu$9({ run: handler })
      };
    };
    const runActionExtra = (name, action, extra) => {
      return {
        key: name,
        value: nu$9({
          run: (component, simulatedEvent) => {
            action.apply(undefined, [
              component,
              simulatedEvent
            ].concat(extra));
          }
        })
      };
    };
    const runOnName = name => {
      return handler => run$1(name, handler);
    };
    const runOnSourceName = name => {
      return handler => ({
        key: name,
        value: nu$9({
          run: (component, simulatedEvent) => {
            if (isSource(component, simulatedEvent)) {
              handler(component, simulatedEvent);
            }
          }
        })
      });
    };
    const redirectToUid = (name, uid) => {
      return run$1(name, (component, simulatedEvent) => {
        component.getSystem().getByUid(uid).each(redirectee => {
          dispatchEvent(redirectee, redirectee.element, name, simulatedEvent);
        });
      });
    };
    const redirectToPart = (name, detail, partName) => {
      const uid = detail.partUids[partName];
      return redirectToUid(name, uid);
    };
    const runWithTarget = (name, f) => {
      return run$1(name, (component, simulatedEvent) => {
        const ev = simulatedEvent.event;
        const target = component.getSystem().getByDom(ev.target).getOrThunk(() => {
          const closest = closest$4(ev.target, el => component.getSystem().getByDom(el).toOptional(), never);
          return closest.getOr(component);
        });
        f(component, target, simulatedEvent);
      });
    };
    const cutter = name => {
      return run$1(name, (component, simulatedEvent) => {
        simulatedEvent.cut();
      });
    };
    const stopper = name => {
      return run$1(name, (component, simulatedEvent) => {
        simulatedEvent.stop();
      });
    };
    const runOnSource = (name, f) => {
      return runOnSourceName(name)(f);
    };
    const runOnAttached = runOnSourceName(attachedToDom());
    const runOnDetached = runOnSourceName(detachedFromDom());
    const runOnInit = runOnSourceName(systemInit());
    const runOnExecute$1 = runOnName(execute$5());

    const fromHtml$1 = (html, scope) => {
      const doc = scope || document;
      const div = doc.createElement('div');
      div.innerHTML = html;
      return children(SugarElement.fromDom(div));
    };

    const get$9 = element => element.dom.innerHTML;
    const set$6 = (element, content) => {
      const owner = owner$4(element);
      const docDom = owner.dom;
      const fragment = SugarElement.fromDom(docDom.createDocumentFragment());
      const contentElements = fromHtml$1(content, docDom);
      append$1(fragment, contentElements);
      empty(element);
      append$2(element, fragment);
    };
    const getOuter = element => {
      const container = SugarElement.fromTag('div');
      const clone = SugarElement.fromDom(element.dom.cloneNode(true));
      append$2(container, clone);
      return get$9(container);
    };

    const clone$1 = (original, isDeep) => SugarElement.fromDom(original.dom.cloneNode(isDeep));
    const shallow = original => clone$1(original, false);

    const getHtml = element => {
      if (isShadowRoot(element)) {
        return '#shadow-root';
      } else {
        const clone = shallow(element);
        return getOuter(clone);
      }
    };

    const element = elem => getHtml(elem);

    const isRecursive = (component, originator, target) => eq(originator, component.element) && !eq(originator, target);
    const events$i = derive$2([can(focus$4(), (component, simulatedEvent) => {
        const event = simulatedEvent.event;
        const originator = event.originator;
        const target = event.target;
        if (isRecursive(component, originator, target)) {
          console.warn(focus$4() + ' did not get interpreted by the desired target. ' + '\nOriginator: ' + element(originator) + '\nTarget: ' + element(target) + '\nCheck the ' + focus$4() + ' event handlers');
          return false;
        } else {
          return true;
        }
      })]);

    var DefaultEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$i
    });

    let unique = 0;
    const generate$6 = prefix => {
      const date = new Date();
      const time = date.getTime();
      const random = Math.floor(Math.random() * 1000000000);
      unique++;
      return prefix + '_' + random + unique + String(time);
    };

    const prefix$1 = constant$1('alloy-id-');
    const idAttr$1 = constant$1('data-alloy-id');

    const prefix = prefix$1();
    const idAttr = idAttr$1();
    const write = (label, elem) => {
      const id = generate$6(prefix + label);
      writeOnly(elem, id);
      return id;
    };
    const writeOnly = (elem, uid) => {
      Object.defineProperty(elem.dom, idAttr, {
        value: uid,
        writable: true
      });
    };
    const read$1 = elem => {
      const id = isElement$1(elem) ? elem.dom[idAttr] : null;
      return Optional.from(id);
    };
    const generate$5 = prefix => generate$6(prefix);

    const make$8 = identity;

    const NoContextApi = getComp => {
      const getMessage = event => `The component must be in a context to execute: ${ event }` + (getComp ? '\n' + element(getComp().element) + ' is not in context.' : '');
      const fail = event => () => {
        throw new Error(getMessage(event));
      };
      const warn = event => () => {
        console.warn(getMessage(event));
      };
      return {
        debugInfo: constant$1('fake'),
        triggerEvent: warn('triggerEvent'),
        triggerFocus: warn('triggerFocus'),
        triggerEscape: warn('triggerEscape'),
        broadcast: warn('broadcast'),
        broadcastOn: warn('broadcastOn'),
        broadcastEvent: warn('broadcastEvent'),
        build: fail('build'),
        buildOrPatch: fail('buildOrPatch'),
        addToWorld: fail('addToWorld'),
        removeFromWorld: fail('removeFromWorld'),
        addToGui: fail('addToGui'),
        removeFromGui: fail('removeFromGui'),
        getByUid: fail('getByUid'),
        getByDom: fail('getByDom'),
        isConnected: never
      };
    };
    const singleton$1 = NoContextApi();

    const markAsBehaviourApi = (f, apiName, apiFunction) => {
      const delegate = apiFunction.toString();
      const endIndex = delegate.indexOf(')') + 1;
      const openBracketIndex = delegate.indexOf('(');
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
      f.toFunctionAnnotation = () => ({
        name: apiName,
        parameters: cleanParameters(parameters.slice(0, 1).concat(parameters.slice(3)))
      });
      return f;
    };
    const cleanParameters = parameters => map$2(parameters, p => endsWith(p, '/*') ? p.substring(0, p.length - '/*'.length) : p);
    const markAsExtraApi = (f, extraName) => {
      const delegate = f.toString();
      const endIndex = delegate.indexOf(')') + 1;
      const openBracketIndex = delegate.indexOf('(');
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
      f.toFunctionAnnotation = () => ({
        name: extraName,
        parameters: cleanParameters(parameters)
      });
      return f;
    };
    const markAsSketchApi = (f, apiFunction) => {
      const delegate = apiFunction.toString();
      const endIndex = delegate.indexOf(')') + 1;
      const openBracketIndex = delegate.indexOf('(');
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
      f.toFunctionAnnotation = () => ({
        name: 'OVERRIDE',
        parameters: cleanParameters(parameters.slice(1))
      });
      return f;
    };

    const premadeTag = generate$6('alloy-premade');
    const premade$1 = comp => {
      Object.defineProperty(comp.element.dom, premadeTag, {
        value: comp.uid,
        writable: true
      });
      return wrap$1(premadeTag, comp);
    };
    const isPremade = element => has$2(element.dom, premadeTag);
    const getPremade = spec => get$g(spec, premadeTag);
    const makeApi = f => markAsSketchApi((component, ...rest) => f(component.getApis(), component, ...rest), f);

    const NoState = { init: () => nu$8({ readState: constant$1('No State required') }) };
    const nu$8 = spec => spec;

    const generateFrom$1 = (spec, all) => {
      const schema = map$2(all, a => optionObjOf(a.name(), [
        required$1('config'),
        defaulted('state', NoState)
      ]));
      const validated = asRaw('component.behaviours', objOf(schema), spec.behaviours).fold(errInfo => {
        throw new Error(formatError(errInfo) + '\nComplete spec:\n' + JSON.stringify(spec, null, 2));
      }, identity);
      return {
        list: all,
        data: map$1(validated, optBlobThunk => {
          const output = optBlobThunk.map(blob => ({
            config: blob.config,
            state: blob.state.init(blob.config)
          }));
          return constant$1(output);
        })
      };
    };
    const getBehaviours$3 = bData => bData.list;
    const getData$2 = bData => bData.data;

    const byInnerKey = (data, tuple) => {
      const r = {};
      each(data, (detail, key) => {
        each(detail, (value, indexKey) => {
          const chain = get$g(r, indexKey).getOr([]);
          r[indexKey] = chain.concat([tuple(key, value)]);
        });
      });
      return r;
    };

    const nu$7 = s => ({
      classes: isUndefined(s.classes) ? [] : s.classes,
      attributes: isUndefined(s.attributes) ? {} : s.attributes,
      styles: isUndefined(s.styles) ? {} : s.styles
    });
    const merge = (defnA, mod) => ({
      ...defnA,
      attributes: {
        ...defnA.attributes,
        ...mod.attributes
      },
      styles: {
        ...defnA.styles,
        ...mod.styles
      },
      classes: defnA.classes.concat(mod.classes)
    });

    const combine$2 = (info, baseMod, behaviours, base) => {
      const modsByBehaviour = { ...baseMod };
      each$1(behaviours, behaviour => {
        modsByBehaviour[behaviour.name()] = behaviour.exhibit(info, base);
      });
      const byAspect = byInnerKey(modsByBehaviour, (name, modification) => ({
        name,
        modification
      }));
      const combineObjects = objects => foldr(objects, (b, a) => ({
        ...a.modification,
        ...b
      }), {});
      const combinedClasses = foldr(byAspect.classes, (b, a) => a.modification.concat(b), []);
      const combinedAttributes = combineObjects(byAspect.attributes);
      const combinedStyles = combineObjects(byAspect.styles);
      return nu$7({
        classes: combinedClasses,
        attributes: combinedAttributes,
        styles: combinedStyles
      });
    };

    const sortKeys = (label, keyName, array, order) => {
      try {
        const sorted = sort(array, (a, b) => {
          const aKey = a[keyName];
          const bKey = b[keyName];
          const aIndex = order.indexOf(aKey);
          const bIndex = order.indexOf(bKey);
          if (aIndex === -1) {
            throw new Error('The ordering for ' + label + ' does not have an entry for ' + aKey + '.\nOrder specified: ' + JSON.stringify(order, null, 2));
          }
          if (bIndex === -1) {
            throw new Error('The ordering for ' + label + ' does not have an entry for ' + bKey + '.\nOrder specified: ' + JSON.stringify(order, null, 2));
          }
          if (aIndex < bIndex) {
            return -1;
          } else if (bIndex < aIndex) {
            return 1;
          } else {
            return 0;
          }
        });
        return Result.value(sorted);
      } catch (err) {
        return Result.error([err]);
      }
    };

    const uncurried = (handler, purpose) => ({
      handler,
      purpose
    });
    const curried = (handler, purpose) => ({
      cHandler: handler,
      purpose
    });
    const curryArgs = (descHandler, extraArgs) => curried(curry.apply(undefined, [descHandler.handler].concat(extraArgs)), descHandler.purpose);
    const getCurried = descHandler => descHandler.cHandler;

    const behaviourTuple = (name, handler) => ({
      name,
      handler
    });
    const nameToHandlers = (behaviours, info) => {
      const r = {};
      each$1(behaviours, behaviour => {
        r[behaviour.name()] = behaviour.handlers(info);
      });
      return r;
    };
    const groupByEvents = (info, behaviours, base) => {
      const behaviourEvents = {
        ...base,
        ...nameToHandlers(behaviours, info)
      };
      return byInnerKey(behaviourEvents, behaviourTuple);
    };
    const combine$1 = (info, eventOrder, behaviours, base) => {
      const byEventName = groupByEvents(info, behaviours, base);
      return combineGroups(byEventName, eventOrder);
    };
    const assemble = rawHandler => {
      const handler = read$2(rawHandler);
      return (component, simulatedEvent, ...rest) => {
        const args = [
          component,
          simulatedEvent
        ].concat(rest);
        if (handler.abort.apply(undefined, args)) {
          simulatedEvent.stop();
        } else if (handler.can.apply(undefined, args)) {
          handler.run.apply(undefined, args);
        }
      };
    };
    const missingOrderError = (eventName, tuples) => Result.error(['The event (' + eventName + ') has more than one behaviour that listens to it.\nWhen this occurs, you must ' + 'specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ' + 'can trigger it are: ' + JSON.stringify(map$2(tuples, c => c.name), null, 2)]);
    const fuse = (tuples, eventOrder, eventName) => {
      const order = eventOrder[eventName];
      if (!order) {
        return missingOrderError(eventName, tuples);
      } else {
        return sortKeys('Event: ' + eventName, 'name', tuples, order).map(sortedTuples => {
          const handlers = map$2(sortedTuples, tuple => tuple.handler);
          return fuse$1(handlers);
        });
      }
    };
    const combineGroups = (byEventName, eventOrder) => {
      const r = mapToArray(byEventName, (tuples, eventName) => {
        const combined = tuples.length === 1 ? Result.value(tuples[0].handler) : fuse(tuples, eventOrder, eventName);
        return combined.map(handler => {
          const assembled = assemble(handler);
          const purpose = tuples.length > 1 ? filter$2(eventOrder[eventName], o => exists(tuples, t => t.name === o)).join(' > ') : tuples[0].name;
          return wrap$1(eventName, uncurried(assembled, purpose));
        });
      });
      return consolidate(r, {});
    };

    const baseBehaviour = 'alloy.base.behaviour';
    const schema$z = objOf([
      field$1('dom', 'dom', required$2(), objOf([
        required$1('tag'),
        defaulted('styles', {}),
        defaulted('classes', []),
        defaulted('attributes', {}),
        option$3('value'),
        option$3('innerHtml')
      ])),
      required$1('components'),
      required$1('uid'),
      defaulted('events', {}),
      defaulted('apis', {}),
      field$1('eventOrder', 'eventOrder', mergeWith({
        [execute$5()]: [
          'disabling',
          baseBehaviour,
          'toggling',
          'typeaheadevents'
        ],
        [focus$4()]: [
          baseBehaviour,
          'focusing',
          'keying'
        ],
        [systemInit()]: [
          baseBehaviour,
          'disabling',
          'toggling',
          'representing'
        ],
        [input()]: [
          baseBehaviour,
          'representing',
          'streaming',
          'invalidating'
        ],
        [detachedFromDom()]: [
          baseBehaviour,
          'representing',
          'item-events',
          'tooltipping'
        ],
        [mousedown()]: [
          'focusing',
          baseBehaviour,
          'item-type-events'
        ],
        [touchstart()]: [
          'focusing',
          baseBehaviour,
          'item-type-events'
        ],
        [mouseover()]: [
          'item-type-events',
          'tooltipping'
        ],
        [receive()]: [
          'receiving',
          'reflecting',
          'tooltipping'
        ]
      }), anyValue()),
      option$3('domModification')
    ]);
    const toInfo = spec => asRaw('custom.definition', schema$z, spec);
    const toDefinition = detail => ({
      ...detail.dom,
      uid: detail.uid,
      domChildren: map$2(detail.components, comp => comp.element)
    });
    const toModification = detail => detail.domModification.fold(() => nu$7({}), nu$7);
    const toEvents = info => info.events;

    const read = (element, attr) => {
      const value = get$f(element, attr);
      return value === undefined || value === '' ? [] : value.split(' ');
    };
    const add$4 = (element, attr, id) => {
      const old = read(element, attr);
      const nu = old.concat([id]);
      set$9(element, attr, nu.join(' '));
      return true;
    };
    const remove$4 = (element, attr, id) => {
      const nu = filter$2(read(element, attr), v => v !== id);
      if (nu.length > 0) {
        set$9(element, attr, nu.join(' '));
      } else {
        remove$7(element, attr);
      }
      return false;
    };

    const supports = element => element.dom.classList !== undefined;
    const get$8 = element => read(element, 'class');
    const add$3 = (element, clazz) => add$4(element, 'class', clazz);
    const remove$3 = (element, clazz) => remove$4(element, 'class', clazz);

    const add$2 = (element, clazz) => {
      if (supports(element)) {
        element.dom.classList.add(clazz);
      } else {
        add$3(element, clazz);
      }
    };
    const cleanClass = element => {
      const classList = supports(element) ? element.dom.classList : get$8(element);
      if (classList.length === 0) {
        remove$7(element, 'class');
      }
    };
    const remove$2 = (element, clazz) => {
      if (supports(element)) {
        const classList = element.dom.classList;
        classList.remove(clazz);
      } else {
        remove$3(element, clazz);
      }
      cleanClass(element);
    };
    const has = (element, clazz) => supports(element) && element.dom.classList.contains(clazz);

    const add$1 = (element, classes) => {
      each$1(classes, x => {
        add$2(element, x);
      });
    };
    const remove$1 = (element, classes) => {
      each$1(classes, x => {
        remove$2(element, x);
      });
    };
    const hasAll = (element, classes) => forall(classes, clazz => has(element, clazz));
    const getNative = element => {
      const classList = element.dom.classList;
      const r = new Array(classList.length);
      for (let i = 0; i < classList.length; i++) {
        const item = classList.item(i);
        if (item !== null) {
          r[i] = item;
        }
      }
      return r;
    };
    const get$7 = element => supports(element) ? getNative(element) : get$8(element);

    const get$6 = element => element.dom.value;
    const set$5 = (element, value) => {
      if (value === undefined) {
        throw new Error('Value.set was undefined');
      }
      element.dom.value = value;
    };

    const determineObsoleted = (parent, index, oldObsoleted) => {
      const newObsoleted = child$2(parent, index);
      return newObsoleted.map(newObs => {
        const elemChanged = oldObsoleted.exists(o => !eq(o, newObs));
        if (elemChanged) {
          const oldTag = oldObsoleted.map(name$3).getOr('span');
          const marker = SugarElement.fromTag(oldTag);
          before$1(newObs, marker);
          return marker;
        } else {
          return newObs;
        }
      });
    };
    const ensureInDom = (parent, child, obsoleted) => {
      obsoleted.fold(() => append$2(parent, child), obs => {
        if (!eq(obs, child)) {
          before$1(obs, child);
          remove$5(obs);
        }
      });
    };
    const patchChildrenWith = (parent, nu, f) => {
      const builtChildren = map$2(nu, f);
      const currentChildren = children(parent);
      each$1(currentChildren.slice(builtChildren.length), remove$5);
      return builtChildren;
    };
    const patchSpecChild = (parent, index, spec, build) => {
      const oldObsoleted = child$2(parent, index);
      const childComp = build(spec, oldObsoleted);
      const obsoleted = determineObsoleted(parent, index, oldObsoleted);
      ensureInDom(parent, childComp.element, obsoleted);
      return childComp;
    };
    const patchSpecChildren = (parent, specs, build) => patchChildrenWith(parent, specs, (spec, index) => patchSpecChild(parent, index, spec, build));
    const patchDomChildren = (parent, nodes) => patchChildrenWith(parent, nodes, (node, index) => {
      const optObsoleted = child$2(parent, index);
      ensureInDom(parent, node, optObsoleted);
      return node;
    });

    const diffKeyValueSet = (newObj, oldObj) => {
      const newKeys = keys(newObj);
      const oldKeys = keys(oldObj);
      const toRemove = difference(oldKeys, newKeys);
      const toSet = bifilter(newObj, (v, k) => {
        return !has$2(oldObj, k) || v !== oldObj[k];
      }).t;
      return {
        toRemove,
        toSet
      };
    };
    const reconcileToDom = (definition, obsoleted) => {
      const {
        class: clazz,
        style,
        ...existingAttributes
      } = clone$2(obsoleted);
      const {
        toSet: attrsToSet,
        toRemove: attrsToRemove
      } = diffKeyValueSet(definition.attributes, existingAttributes);
      const updateAttrs = () => {
        each$1(attrsToRemove, a => remove$7(obsoleted, a));
        setAll$1(obsoleted, attrsToSet);
      };
      const existingStyles = getAllRaw(obsoleted);
      const {
        toSet: stylesToSet,
        toRemove: stylesToRemove
      } = diffKeyValueSet(definition.styles, existingStyles);
      const updateStyles = () => {
        each$1(stylesToRemove, s => remove$6(obsoleted, s));
        setAll(obsoleted, stylesToSet);
      };
      const existingClasses = get$7(obsoleted);
      const classesToRemove = difference(existingClasses, definition.classes);
      const classesToAdd = difference(definition.classes, existingClasses);
      const updateClasses = () => {
        add$1(obsoleted, classesToAdd);
        remove$1(obsoleted, classesToRemove);
      };
      const updateHtml = html => {
        set$6(obsoleted, html);
      };
      const updateChildren = () => {
        const children = definition.domChildren;
        patchDomChildren(obsoleted, children);
      };
      const updateValue = () => {
        const valueElement = obsoleted;
        const value = definition.value.getOrUndefined();
        if (value !== get$6(valueElement)) {
          set$5(valueElement, value !== null && value !== void 0 ? value : '');
        }
      };
      updateAttrs();
      updateClasses();
      updateStyles();
      definition.innerHtml.fold(updateChildren, updateHtml);
      updateValue();
      return obsoleted;
    };

    const introduceToDom = definition => {
      const subject = SugarElement.fromTag(definition.tag);
      setAll$1(subject, definition.attributes);
      add$1(subject, definition.classes);
      setAll(subject, definition.styles);
      definition.innerHtml.each(html => set$6(subject, html));
      const children = definition.domChildren;
      append$1(subject, children);
      definition.value.each(value => {
        set$5(subject, value);
      });
      return subject;
    };
    const attemptPatch = (definition, obsoleted) => {
      try {
        const e = reconcileToDom(definition, obsoleted);
        return Optional.some(e);
      } catch (err) {
        return Optional.none();
      }
    };
    const hasMixedChildren = definition => definition.innerHtml.isSome() && definition.domChildren.length > 0;
    const renderToDom = (definition, optObsoleted) => {
      const canBePatched = candidate => name$3(candidate) === definition.tag && !hasMixedChildren(definition) && !isPremade(candidate);
      const elem = optObsoleted.filter(canBePatched).bind(obsoleted => attemptPatch(definition, obsoleted)).getOrThunk(() => introduceToDom(definition));
      writeOnly(elem, definition.uid);
      return elem;
    };

    const getBehaviours$2 = spec => {
      const behaviours = get$g(spec, 'behaviours').getOr({});
      return bind$3(keys(behaviours), name => {
        const behaviour = behaviours[name];
        return isNonNullable(behaviour) ? [behaviour.me] : [];
      });
    };
    const generateFrom = (spec, all) => generateFrom$1(spec, all);
    const generate$4 = spec => {
      const all = getBehaviours$2(spec);
      return generateFrom(spec, all);
    };

    const getDomDefinition = (info, bList, bData) => {
      const definition = toDefinition(info);
      const infoModification = toModification(info);
      const baseModification = { 'alloy.base.modification': infoModification };
      const modification = bList.length > 0 ? combine$2(bData, baseModification, bList, definition) : infoModification;
      return merge(definition, modification);
    };
    const getEvents = (info, bList, bData) => {
      const baseEvents = { 'alloy.base.behaviour': toEvents(info) };
      return combine$1(bData, info.eventOrder, bList, baseEvents).getOrDie();
    };
    const build$2 = (spec, obsoleted) => {
      const getMe = () => me;
      const systemApi = Cell(singleton$1);
      const info = getOrDie(toInfo(spec));
      const bBlob = generate$4(spec);
      const bList = getBehaviours$3(bBlob);
      const bData = getData$2(bBlob);
      const modDefinition = getDomDefinition(info, bList, bData);
      const item = renderToDom(modDefinition, obsoleted);
      const events = getEvents(info, bList, bData);
      const subcomponents = Cell(info.components);
      const connect = newApi => {
        systemApi.set(newApi);
      };
      const disconnect = () => {
        systemApi.set(NoContextApi(getMe));
      };
      const syncComponents = () => {
        const children$1 = children(item);
        const subs = bind$3(children$1, child => systemApi.get().getByDom(child).fold(() => [], pure$2));
        subcomponents.set(subs);
      };
      const config = behaviour => {
        const b = bData;
        const f = isFunction(b[behaviour.name()]) ? b[behaviour.name()] : () => {
          throw new Error('Could not find ' + behaviour.name() + ' in ' + JSON.stringify(spec, null, 2));
        };
        return f();
      };
      const hasConfigured = behaviour => isFunction(bData[behaviour.name()]);
      const getApis = () => info.apis;
      const readState = behaviourName => bData[behaviourName]().map(b => b.state.readState()).getOr('not enabled');
      const me = {
        uid: spec.uid,
        getSystem: systemApi.get,
        config,
        hasConfigured,
        spec,
        readState,
        getApis,
        connect,
        disconnect,
        element: item,
        syncComponents,
        components: subcomponents.get,
        events
      };
      return me;
    };

    const buildSubcomponents = (spec, obsoleted) => {
      const components = get$g(spec, 'components').getOr([]);
      return obsoleted.fold(() => map$2(components, build$1), obs => map$2(components, (c, i) => {
        return buildOrPatch(c, child$2(obs, i));
      }));
    };
    const buildFromSpec = (userSpec, obsoleted) => {
      const {
        events: specEvents,
        ...spec
      } = make$8(userSpec);
      const components = buildSubcomponents(spec, obsoleted);
      const completeSpec = {
        ...spec,
        events: {
          ...DefaultEvents,
          ...specEvents
        },
        components
      };
      return Result.value(build$2(completeSpec, obsoleted));
    };
    const text$2 = textContent => {
      const element = SugarElement.fromText(textContent);
      return external$1({ element });
    };
    const external$1 = spec => {
      const extSpec = asRawOrDie$1('external.component', objOfOnly([
        required$1('element'),
        option$3('uid')
      ]), spec);
      const systemApi = Cell(NoContextApi());
      const connect = newApi => {
        systemApi.set(newApi);
      };
      const disconnect = () => {
        systemApi.set(NoContextApi(() => me));
      };
      const uid = extSpec.uid.getOrThunk(() => generate$5('external'));
      writeOnly(extSpec.element, uid);
      const me = {
        uid,
        getSystem: systemApi.get,
        config: Optional.none,
        hasConfigured: never,
        connect,
        disconnect,
        getApis: () => ({}),
        element: extSpec.element,
        spec,
        readState: constant$1('No state'),
        syncComponents: noop,
        components: constant$1([]),
        events: {}
      };
      return premade$1(me);
    };
    const uids = generate$5;
    const isSketchSpec$1 = spec => has$2(spec, 'uid');
    const buildOrPatch = (spec, obsoleted) => getPremade(spec).getOrThunk(() => {
      const userSpecWithUid = isSketchSpec$1(spec) ? spec : {
        uid: uids(''),
        ...spec
      };
      return buildFromSpec(userSpecWithUid, obsoleted).getOrDie();
    });
    const build$1 = spec => buildOrPatch(spec, Optional.none());
    const premade = premade$1;

    var ClosestOrAncestor = (is, ancestor, scope, a, isRoot) => {
      if (is(scope, a)) {
        return Optional.some(scope);
      } else if (isFunction(isRoot) && isRoot(scope)) {
        return Optional.none();
      } else {
        return ancestor(scope, a, isRoot);
      }
    };

    const ancestor$1 = (scope, predicate, isRoot) => {
      let element = scope.dom;
      const stop = isFunction(isRoot) ? isRoot : never;
      while (element.parentNode) {
        element = element.parentNode;
        const el = SugarElement.fromDom(element);
        if (predicate(el)) {
          return Optional.some(el);
        } else if (stop(el)) {
          break;
        }
      }
      return Optional.none();
    };
    const closest$3 = (scope, predicate, isRoot) => {
      const is = (s, test) => test(s);
      return ClosestOrAncestor(is, ancestor$1, scope, predicate, isRoot);
    };
    const child$1 = (scope, predicate) => {
      const pred = node => predicate(SugarElement.fromDom(node));
      const result = find$5(scope.dom.childNodes, pred);
      return result.map(SugarElement.fromDom);
    };
    const descendant$1 = (scope, predicate) => {
      const descend = node => {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = SugarElement.fromDom(node.childNodes[i]);
          if (predicate(child)) {
            return Optional.some(child);
          }
          const res = descend(node.childNodes[i]);
          if (res.isSome()) {
            return res;
          }
        }
        return Optional.none();
      };
      return descend(scope.dom);
    };

    const closest$2 = (scope, predicate, isRoot) => closest$3(scope, predicate, isRoot).isSome();

    const ancestor = (scope, selector, isRoot) => ancestor$1(scope, e => is(e, selector), isRoot);
    const child = (scope, selector) => child$1(scope, e => is(e, selector));
    const descendant = (scope, selector) => one(selector, scope);
    const closest$1 = (scope, selector, isRoot) => {
      const is$1 = (element, selector) => is(element, selector);
      return ClosestOrAncestor(is$1, ancestor, scope, selector, isRoot);
    };

    const attribute = 'aria-controls';
    const find$1 = queryElem => {
      const dependent = closest$3(queryElem, elem => {
        if (!isElement$1(elem)) {
          return false;
        }
        const id = get$f(elem, 'id');
        return id !== undefined && id.indexOf(attribute) > -1;
      });
      return dependent.bind(dep => {
        const id = get$f(dep, 'id');
        const dos = getRootNode(dep);
        return descendant(dos, `[${ attribute }="${ id }"]`);
      });
    };
    const manager = () => {
      const ariaId = generate$6(attribute);
      const link = elem => {
        set$9(elem, attribute, ariaId);
      };
      const unlink = elem => {
        remove$7(elem, attribute);
      };
      return {
        id: ariaId,
        link,
        unlink
      };
    };

    const isAriaPartOf = (component, queryElem) => find$1(queryElem).exists(owner => isPartOf$1(component, owner));
    const isPartOf$1 = (component, queryElem) => closest$2(queryElem, el => eq(el, component.element), never) || isAriaPartOf(component, queryElem);

    const unknown = 'unknown';
    var EventConfiguration;
    (function (EventConfiguration) {
      EventConfiguration[EventConfiguration['STOP'] = 0] = 'STOP';
      EventConfiguration[EventConfiguration['NORMAL'] = 1] = 'NORMAL';
      EventConfiguration[EventConfiguration['LOGGING'] = 2] = 'LOGGING';
    }(EventConfiguration || (EventConfiguration = {})));
    const eventConfig = Cell({});
    const makeEventLogger = (eventName, initialTarget) => {
      const sequence = [];
      const startTime = new Date().getTime();
      return {
        logEventCut: (_name, target, purpose) => {
          sequence.push({
            outcome: 'cut',
            target,
            purpose
          });
        },
        logEventStopped: (_name, target, purpose) => {
          sequence.push({
            outcome: 'stopped',
            target,
            purpose
          });
        },
        logNoParent: (_name, target, purpose) => {
          sequence.push({
            outcome: 'no-parent',
            target,
            purpose
          });
        },
        logEventNoHandlers: (_name, target) => {
          sequence.push({
            outcome: 'no-handlers-left',
            target
          });
        },
        logEventResponse: (_name, target, purpose) => {
          sequence.push({
            outcome: 'response',
            purpose,
            target
          });
        },
        write: () => {
          const finishTime = new Date().getTime();
          if (contains$2([
              'mousemove',
              'mouseover',
              'mouseout',
              systemInit()
            ], eventName)) {
            return;
          }
          console.log(eventName, {
            event: eventName,
            time: finishTime - startTime,
            target: initialTarget.dom,
            sequence: map$2(sequence, s => {
              if (!contains$2([
                  'cut',
                  'stopped',
                  'response'
                ], s.outcome)) {
                return s.outcome;
              } else {
                return '{' + s.purpose + '} ' + s.outcome + ' at (' + element(s.target) + ')';
              }
            })
          });
        }
      };
    };
    const processEvent = (eventName, initialTarget, f) => {
      const status = get$g(eventConfig.get(), eventName).orThunk(() => {
        const patterns = keys(eventConfig.get());
        return findMap(patterns, p => eventName.indexOf(p) > -1 ? Optional.some(eventConfig.get()[p]) : Optional.none());
      }).getOr(EventConfiguration.NORMAL);
      switch (status) {
      case EventConfiguration.NORMAL:
        return f(noLogger());
      case EventConfiguration.LOGGING: {
          const logger = makeEventLogger(eventName, initialTarget);
          const output = f(logger);
          logger.write();
          return output;
        }
      case EventConfiguration.STOP:
        return true;
      }
    };
    const path = [
      'alloy/data/Fields',
      'alloy/debugging/Debugging'
    ];
    const getTrace = () => {
      const err = new Error();
      if (err.stack !== undefined) {
        const lines = err.stack.split('\n');
        return find$5(lines, line => line.indexOf('alloy') > 0 && !exists(path, p => line.indexOf(p) > -1)).getOr(unknown);
      } else {
        return unknown;
      }
    };
    const ignoreEvent = {
      logEventCut: noop,
      logEventStopped: noop,
      logNoParent: noop,
      logEventNoHandlers: noop,
      logEventResponse: noop,
      write: noop
    };
    const monitorEvent = (eventName, initialTarget, f) => processEvent(eventName, initialTarget, f);
    const noLogger = constant$1(ignoreEvent);

    const menuFields = constant$1([
      required$1('menu'),
      required$1('selectedMenu')
    ]);
    const itemFields = constant$1([
      required$1('item'),
      required$1('selectedItem')
    ]);
    constant$1(objOf(itemFields().concat(menuFields())));
    const itemSchema$3 = constant$1(objOf(itemFields()));

    const _initSize = requiredObjOf('initSize', [
      required$1('numColumns'),
      required$1('numRows')
    ]);
    const itemMarkers = () => requiredOf('markers', itemSchema$3());
    const tieredMenuMarkers = () => requiredObjOf('markers', [required$1('backgroundMenu')].concat(menuFields()).concat(itemFields()));
    const markers$1 = required => requiredObjOf('markers', map$2(required, required$1));
    const onPresenceHandler = (label, fieldName, presence) => {
      getTrace();
      return field$1(fieldName, fieldName, presence, valueOf(f => Result.value((...args) => {
        return f.apply(undefined, args);
      })));
    };
    const onHandler = fieldName => onPresenceHandler('onHandler', fieldName, defaulted$1(noop));
    const onKeyboardHandler = fieldName => onPresenceHandler('onKeyboardHandler', fieldName, defaulted$1(Optional.none));
    const onStrictHandler = fieldName => onPresenceHandler('onHandler', fieldName, required$2());
    const onStrictKeyboardHandler = fieldName => onPresenceHandler('onKeyboardHandler', fieldName, required$2());
    const output$1 = (name, value) => customField(name, constant$1(value));
    const snapshot = name => customField(name, identity);
    const initSize = constant$1(_initSize);

    const nu$6 = (x, y, bubble, direction, placement, boundsRestriction, labelPrefix, alwaysFit = false) => ({
      x,
      y,
      bubble,
      direction,
      placement,
      restriction: boundsRestriction,
      label: `${ labelPrefix }-${ placement }`,
      alwaysFit
    });

    const adt$a = Adt.generate([
      { southeast: [] },
      { southwest: [] },
      { northeast: [] },
      { northwest: [] },
      { south: [] },
      { north: [] },
      { east: [] },
      { west: [] }
    ]);
    const cata$2 = (subject, southeast, southwest, northeast, northwest, south, north, east, west) => subject.fold(southeast, southwest, northeast, northwest, south, north, east, west);
    const cataVertical = (subject, south, middle, north) => subject.fold(south, south, north, north, south, north, middle, middle);
    const cataHorizontal = (subject, east, middle, west) => subject.fold(east, west, east, west, middle, middle, east, west);
    const southeast$3 = adt$a.southeast;
    const southwest$3 = adt$a.southwest;
    const northeast$3 = adt$a.northeast;
    const northwest$3 = adt$a.northwest;
    const south$3 = adt$a.south;
    const north$3 = adt$a.north;
    const east$3 = adt$a.east;
    const west$3 = adt$a.west;

    const cycleBy = (value, delta, min, max) => {
      const r = value + delta;
      if (r > max) {
        return min;
      } else if (r < min) {
        return max;
      } else {
        return r;
      }
    };
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const getRestriction = (anchor, restriction) => {
      switch (restriction) {
      case 1:
        return anchor.x;
      case 0:
        return anchor.x + anchor.width;
      case 2:
        return anchor.y;
      case 3:
        return anchor.y + anchor.height;
      }
    };
    const boundsRestriction = (anchor, restrictions) => mapToObject([
      'left',
      'right',
      'top',
      'bottom'
    ], dir => get$g(restrictions, dir).map(restriction => getRestriction(anchor, restriction)));
    const adjustBounds = (bounds$1, restriction, bubbleOffset) => {
      const applyRestriction = (dir, current) => restriction[dir].map(pos => {
        const isVerticalAxis = dir === 'top' || dir === 'bottom';
        const offset = isVerticalAxis ? bubbleOffset.top : bubbleOffset.left;
        const comparator = dir === 'left' || dir === 'top' ? Math.max : Math.min;
        const newPos = comparator(pos, current) + offset;
        return isVerticalAxis ? clamp(newPos, bounds$1.y, bounds$1.bottom) : clamp(newPos, bounds$1.x, bounds$1.right);
      }).getOr(current);
      const adjustedLeft = applyRestriction('left', bounds$1.x);
      const adjustedTop = applyRestriction('top', bounds$1.y);
      const adjustedRight = applyRestriction('right', bounds$1.right);
      const adjustedBottom = applyRestriction('bottom', bounds$1.bottom);
      return bounds(adjustedLeft, adjustedTop, adjustedRight - adjustedLeft, adjustedBottom - adjustedTop);
    };

    const labelPrefix$2 = 'layout';
    const eastX$1 = anchor => anchor.x;
    const middleX$1 = (anchor, element) => anchor.x + anchor.width / 2 - element.width / 2;
    const westX$1 = (anchor, element) => anchor.x + anchor.width - element.width;
    const northY$2 = (anchor, element) => anchor.y - element.height;
    const southY$2 = anchor => anchor.y + anchor.height;
    const centreY$1 = (anchor, element) => anchor.y + anchor.height / 2 - element.height / 2;
    const eastEdgeX$1 = anchor => anchor.x + anchor.width;
    const westEdgeX$1 = (anchor, element) => anchor.x - element.width;
    const southeast$2 = (anchor, element, bubbles) => nu$6(eastX$1(anchor), southY$2(anchor), bubbles.southeast(), southeast$3(), 'southeast', boundsRestriction(anchor, {
      left: 1,
      top: 3
    }), labelPrefix$2);
    const southwest$2 = (anchor, element, bubbles) => nu$6(westX$1(anchor, element), southY$2(anchor), bubbles.southwest(), southwest$3(), 'southwest', boundsRestriction(anchor, {
      right: 0,
      top: 3
    }), labelPrefix$2);
    const northeast$2 = (anchor, element, bubbles) => nu$6(eastX$1(anchor), northY$2(anchor, element), bubbles.northeast(), northeast$3(), 'northeast', boundsRestriction(anchor, {
      left: 1,
      bottom: 2
    }), labelPrefix$2);
    const northwest$2 = (anchor, element, bubbles) => nu$6(westX$1(anchor, element), northY$2(anchor, element), bubbles.northwest(), northwest$3(), 'northwest', boundsRestriction(anchor, {
      right: 0,
      bottom: 2
    }), labelPrefix$2);
    const north$2 = (anchor, element, bubbles) => nu$6(middleX$1(anchor, element), northY$2(anchor, element), bubbles.north(), north$3(), 'north', boundsRestriction(anchor, { bottom: 2 }), labelPrefix$2);
    const south$2 = (anchor, element, bubbles) => nu$6(middleX$1(anchor, element), southY$2(anchor), bubbles.south(), south$3(), 'south', boundsRestriction(anchor, { top: 3 }), labelPrefix$2);
    const east$2 = (anchor, element, bubbles) => nu$6(eastEdgeX$1(anchor), centreY$1(anchor, element), bubbles.east(), east$3(), 'east', boundsRestriction(anchor, { left: 0 }), labelPrefix$2);
    const west$2 = (anchor, element, bubbles) => nu$6(westEdgeX$1(anchor, element), centreY$1(anchor, element), bubbles.west(), west$3(), 'west', boundsRestriction(anchor, { right: 1 }), labelPrefix$2);
    const all$1 = () => [
      southeast$2,
      southwest$2,
      northeast$2,
      northwest$2,
      south$2,
      north$2,
      east$2,
      west$2
    ];
    const allRtl$1 = () => [
      southwest$2,
      southeast$2,
      northwest$2,
      northeast$2,
      south$2,
      north$2,
      east$2,
      west$2
    ];
    const aboveOrBelow = () => [
      northeast$2,
      northwest$2,
      southeast$2,
      southwest$2,
      north$2,
      south$2
    ];
    const aboveOrBelowRtl = () => [
      northwest$2,
      northeast$2,
      southwest$2,
      southeast$2,
      north$2,
      south$2
    ];
    const belowOrAbove = () => [
      southeast$2,
      southwest$2,
      northeast$2,
      northwest$2,
      south$2,
      north$2
    ];
    const belowOrAboveRtl = () => [
      southwest$2,
      southeast$2,
      northwest$2,
      northeast$2,
      south$2,
      north$2
    ];

    const chooseChannels = (channels, message) => message.universal ? channels : filter$2(channels, ch => contains$2(message.channels, ch));
    const events$h = receiveConfig => derive$2([run$1(receive(), (component, message) => {
        const channelMap = receiveConfig.channels;
        const channels = keys(channelMap);
        const receivingData = message;
        const targetChannels = chooseChannels(channels, receivingData);
        each$1(targetChannels, ch => {
          const channelInfo = channelMap[ch];
          const channelSchema = channelInfo.schema;
          const data = asRawOrDie$1('channel[' + ch + '] data\nReceiver: ' + element(component.element), channelSchema, receivingData.data);
          channelInfo.onReceive(component, data);
        });
      })]);

    var ActiveReceiving = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$h
    });

    var ReceivingSchema = [requiredOf('channels', setOf(Result.value, objOfOnly([
        onStrictHandler('onReceive'),
        defaulted('schema', anyValue())
      ])))];

    const executeEvent = (bConfig, bState, executor) => runOnExecute$1(component => {
      executor(component, bConfig, bState);
    });
    const loadEvent = (bConfig, bState, f) => runOnInit((component, _simulatedEvent) => {
      f(component, bConfig, bState);
    });
    const create$5 = (schema, name, active, apis, extra, state) => {
      const configSchema = objOfOnly(schema);
      const schemaSchema = optionObjOf(name, [optionObjOfOnly('config', schema)]);
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
    };
    const createModes$1 = (modes, name, active, apis, extra, state) => {
      const configSchema = modes;
      const schemaSchema = optionObjOf(name, [optionOf('config', modes)]);
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
    };
    const wrapApi = (bName, apiFunction, apiName) => {
      const f = (component, ...rest) => {
        const args = [component].concat(rest);
        return component.config({ name: constant$1(bName) }).fold(() => {
          throw new Error('We could not find any behaviour configuration for: ' + bName + '. Using API: ' + apiName);
        }, info => {
          const rest = Array.prototype.slice.call(args, 1);
          return apiFunction.apply(undefined, [
            component,
            info.config,
            info.state
          ].concat(rest));
        });
      };
      return markAsBehaviourApi(f, apiName, apiFunction);
    };
    const revokeBehaviour = name => ({
      key: name,
      value: undefined
    });
    const doCreate = (configSchema, schemaSchema, name, active, apis, extra, state) => {
      const getConfig = info => hasNonNullableKey(info, name) ? info[name]() : Optional.none();
      const wrappedApis = map$1(apis, (apiF, apiName) => wrapApi(name, apiF, apiName));
      const wrappedExtra = map$1(extra, (extraF, extraName) => markAsExtraApi(extraF, extraName));
      const me = {
        ...wrappedExtra,
        ...wrappedApis,
        revoke: curry(revokeBehaviour, name),
        config: spec => {
          const prepared = asRawOrDie$1(name + '-config', configSchema, spec);
          return {
            key: name,
            value: {
              config: prepared,
              me,
              configAsRaw: cached(() => asRawOrDie$1(name + '-config', configSchema, spec)),
              initialConfig: spec,
              state
            }
          };
        },
        schema: constant$1(schemaSchema),
        exhibit: (info, base) => {
          return lift2(getConfig(info), get$g(active, 'exhibit'), (behaviourInfo, exhibitor) => {
            return exhibitor(base, behaviourInfo.config, behaviourInfo.state);
          }).getOrThunk(() => nu$7({}));
        },
        name: constant$1(name),
        handlers: info => {
          return getConfig(info).map(behaviourInfo => {
            const getEvents = get$g(active, 'events').getOr(() => ({}));
            return getEvents(behaviourInfo.config, behaviourInfo.state);
          }).getOr({});
        }
      };
      return me;
    };

    const derive$1 = capabilities => wrapAll(capabilities);
    const simpleSchema = objOfOnly([
      required$1('fields'),
      required$1('name'),
      defaulted('active', {}),
      defaulted('apis', {}),
      defaulted('state', NoState),
      defaulted('extra', {})
    ]);
    const create$4 = data => {
      const value = asRawOrDie$1('Creating behaviour: ' + data.name, simpleSchema, data);
      return create$5(value.fields, value.name, value.active, value.apis, value.extra, value.state);
    };
    const modeSchema = objOfOnly([
      required$1('branchKey'),
      required$1('branches'),
      required$1('name'),
      defaulted('active', {}),
      defaulted('apis', {}),
      defaulted('state', NoState),
      defaulted('extra', {})
    ]);
    const createModes = data => {
      const value = asRawOrDie$1('Creating behaviour: ' + data.name, modeSchema, data);
      return createModes$1(choose$1(value.branchKey, value.branches), value.name, value.active, value.apis, value.extra, value.state);
    };
    const revoke = constant$1(undefined);

    const Receiving = create$4({
      fields: ReceivingSchema,
      name: 'receiving',
      active: ActiveReceiving
    });

    const exhibit$6 = (base, posConfig) => nu$7({
      classes: [],
      styles: posConfig.useFixed() ? {} : { position: 'relative' }
    });

    var ActivePosition = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$6
    });

    const focus$3 = element => element.dom.focus();
    const blur$1 = element => element.dom.blur();
    const hasFocus = element => {
      const root = getRootNode(element).dom;
      return element.dom === root.activeElement;
    };
    const active$1 = (root = getDocument()) => Optional.from(root.dom.activeElement).map(SugarElement.fromDom);
    const search = element => active$1(getRootNode(element)).filter(e => element.dom.contains(e.dom));

    const preserve$1 = (f, container) => {
      const dos = getRootNode(container);
      const refocus = active$1(dos).bind(focused => {
        const hasFocus = elem => eq(focused, elem);
        return hasFocus(container) ? Optional.some(container) : descendant$1(container, hasFocus);
      });
      const result = f(container);
      refocus.each(oldFocus => {
        active$1(dos).filter(newFocus => eq(newFocus, oldFocus)).fold(() => {
          focus$3(oldFocus);
        }, noop);
      });
      return result;
    };

    const NuPositionCss = (position, left, top, right, bottom) => {
      const toPx = num => num + 'px';
      return {
        position,
        left: left.map(toPx),
        top: top.map(toPx),
        right: right.map(toPx),
        bottom: bottom.map(toPx)
      };
    };
    const toOptions = position => ({
      ...position,
      position: Optional.some(position.position)
    });
    const applyPositionCss = (element, position) => {
      setOptions(element, toOptions(position));
    };

    const adt$9 = Adt.generate([
      { none: [] },
      {
        relative: [
          'x',
          'y',
          'width',
          'height'
        ]
      },
      {
        fixed: [
          'x',
          'y',
          'width',
          'height'
        ]
      }
    ]);
    const positionWithDirection = (posName, decision, x, y, width, height) => {
      const decisionRect = decision.rect;
      const decisionX = decisionRect.x - x;
      const decisionY = decisionRect.y - y;
      const decisionWidth = decisionRect.width;
      const decisionHeight = decisionRect.height;
      const decisionRight = width - (decisionX + decisionWidth);
      const decisionBottom = height - (decisionY + decisionHeight);
      const left = Optional.some(decisionX);
      const top = Optional.some(decisionY);
      const right = Optional.some(decisionRight);
      const bottom = Optional.some(decisionBottom);
      const none = Optional.none();
      return cata$2(decision.direction, () => NuPositionCss(posName, left, top, none, none), () => NuPositionCss(posName, none, top, right, none), () => NuPositionCss(posName, left, none, none, bottom), () => NuPositionCss(posName, none, none, right, bottom), () => NuPositionCss(posName, left, top, none, none), () => NuPositionCss(posName, left, none, none, bottom), () => NuPositionCss(posName, left, top, none, none), () => NuPositionCss(posName, none, top, right, none));
    };
    const reposition = (origin, decision) => origin.fold(() => {
      const decisionRect = decision.rect;
      return NuPositionCss('absolute', Optional.some(decisionRect.x), Optional.some(decisionRect.y), Optional.none(), Optional.none());
    }, (x, y, width, height) => {
      return positionWithDirection('absolute', decision, x, y, width, height);
    }, (x, y, width, height) => {
      return positionWithDirection('fixed', decision, x, y, width, height);
    });
    const toBox = (origin, element) => {
      const rel = curry(find$2, element);
      const position = origin.fold(rel, rel, () => {
        const scroll = get$b();
        return find$2(element).translate(-scroll.left, -scroll.top);
      });
      const width = getOuter$1(element);
      const height = getOuter$2(element);
      return bounds(position.left, position.top, width, height);
    };
    const viewport = (origin, optBounds) => optBounds.fold(() => origin.fold(win, win, bounds), bounds$1 => origin.fold(constant$1(bounds$1), constant$1(bounds$1), () => {
      const pos = translate$2(origin, bounds$1.x, bounds$1.y);
      return bounds(pos.left, pos.top, bounds$1.width, bounds$1.height);
    }));
    const translate$2 = (origin, x, y) => {
      const pos = SugarPosition(x, y);
      const removeScroll = () => {
        const outerScroll = get$b();
        return pos.translate(-outerScroll.left, -outerScroll.top);
      };
      return origin.fold(constant$1(pos), constant$1(pos), removeScroll);
    };
    const cata$1 = (subject, onNone, onRelative, onFixed) => subject.fold(onNone, onRelative, onFixed);
    adt$9.none;
    const relative$1 = adt$9.relative;
    const fixed$1 = adt$9.fixed;

    const anchor = (anchorBox, origin) => ({
      anchorBox,
      origin
    });
    const box = (anchorBox, origin) => anchor(anchorBox, origin);

    const placementAttribute = 'data-alloy-placement';
    const setPlacement$1 = (element, placement) => {
      set$9(element, placementAttribute, placement);
    };
    const getPlacement = element => getOpt(element, placementAttribute);
    const reset$2 = element => remove$7(element, placementAttribute);

    const adt$8 = Adt.generate([
      { fit: ['reposition'] },
      {
        nofit: [
          'reposition',
          'visibleW',
          'visibleH',
          'isVisible'
        ]
      }
    ]);
    const determinePosition = (box, bounds) => {
      const {
        x: boundsX,
        y: boundsY,
        right: boundsRight,
        bottom: boundsBottom
      } = bounds;
      const {x, y, right, bottom, width, height} = box;
      const xInBounds = x >= boundsX && x <= boundsRight;
      const yInBounds = y >= boundsY && y <= boundsBottom;
      const originInBounds = xInBounds && yInBounds;
      const rightInBounds = right <= boundsRight && right >= boundsX;
      const bottomInBounds = bottom <= boundsBottom && bottom >= boundsY;
      const sizeInBounds = rightInBounds && bottomInBounds;
      const visibleW = Math.min(width, x >= boundsX ? boundsRight - x : right - boundsX);
      const visibleH = Math.min(height, y >= boundsY ? boundsBottom - y : bottom - boundsY);
      return {
        originInBounds,
        sizeInBounds,
        visibleW,
        visibleH
      };
    };
    const calcReposition = (box, bounds$1) => {
      const {
        x: boundsX,
        y: boundsY,
        right: boundsRight,
        bottom: boundsBottom
      } = bounds$1;
      const {x, y, width, height} = box;
      const maxX = Math.max(boundsX, boundsRight - width);
      const maxY = Math.max(boundsY, boundsBottom - height);
      const restrictedX = clamp(x, boundsX, maxX);
      const restrictedY = clamp(y, boundsY, maxY);
      const restrictedWidth = Math.min(restrictedX + width, boundsRight) - restrictedX;
      const restrictedHeight = Math.min(restrictedY + height, boundsBottom) - restrictedY;
      return bounds(restrictedX, restrictedY, restrictedWidth, restrictedHeight);
    };
    const calcMaxSizes = (direction, box, bounds) => {
      const upAvailable = constant$1(box.bottom - bounds.y);
      const downAvailable = constant$1(bounds.bottom - box.y);
      const maxHeight = cataVertical(direction, downAvailable, downAvailable, upAvailable);
      const westAvailable = constant$1(box.right - bounds.x);
      const eastAvailable = constant$1(bounds.right - box.x);
      const maxWidth = cataHorizontal(direction, eastAvailable, eastAvailable, westAvailable);
      return {
        maxWidth,
        maxHeight
      };
    };
    const attempt = (candidate, width, height, bounds$1) => {
      const bubble = candidate.bubble;
      const bubbleOffset = bubble.offset;
      const adjustedBounds = adjustBounds(bounds$1, candidate.restriction, bubbleOffset);
      const newX = candidate.x + bubbleOffset.left;
      const newY = candidate.y + bubbleOffset.top;
      const box = bounds(newX, newY, width, height);
      const {originInBounds, sizeInBounds, visibleW, visibleH} = determinePosition(box, adjustedBounds);
      const fits = originInBounds && sizeInBounds;
      const fittedBox = fits ? box : calcReposition(box, adjustedBounds);
      const isPartlyVisible = fittedBox.width > 0 && fittedBox.height > 0;
      const {maxWidth, maxHeight} = calcMaxSizes(candidate.direction, fittedBox, bounds$1);
      const reposition = {
        rect: fittedBox,
        maxHeight,
        maxWidth,
        direction: candidate.direction,
        placement: candidate.placement,
        classes: {
          on: bubble.classesOn,
          off: bubble.classesOff
        },
        layout: candidate.label,
        testY: newY
      };
      return fits || candidate.alwaysFit ? adt$8.fit(reposition) : adt$8.nofit(reposition, visibleW, visibleH, isPartlyVisible);
    };
    const attempts = (element, candidates, anchorBox, elementBox, bubbles, bounds) => {
      const panelWidth = elementBox.width;
      const panelHeight = elementBox.height;
      const attemptBestFit = (layout, reposition, visibleW, visibleH, isVisible) => {
        const next = layout(anchorBox, elementBox, bubbles, element, bounds);
        const attemptLayout = attempt(next, panelWidth, panelHeight, bounds);
        return attemptLayout.fold(constant$1(attemptLayout), (newReposition, newVisibleW, newVisibleH, newIsVisible) => {
          const improved = isVisible === newIsVisible ? newVisibleH > visibleH || newVisibleW > visibleW : !isVisible && newIsVisible;
          return improved ? attemptLayout : adt$8.nofit(reposition, visibleW, visibleH, isVisible);
        });
      };
      const abc = foldl(candidates, (b, a) => {
        const bestNext = curry(attemptBestFit, a);
        return b.fold(constant$1(b), bestNext);
      }, adt$8.nofit({
        rect: anchorBox,
        maxHeight: elementBox.height,
        maxWidth: elementBox.width,
        direction: southeast$3(),
        placement: 'southeast',
        classes: {
          on: [],
          off: []
        },
        layout: 'none',
        testY: anchorBox.y
      }, -1, -1, false));
      return abc.fold(identity, identity);
    };

    const singleton = doRevoke => {
      const subject = Cell(Optional.none());
      const revoke = () => subject.get().each(doRevoke);
      const clear = () => {
        revoke();
        subject.set(Optional.none());
      };
      const isSet = () => subject.get().isSome();
      const get = () => subject.get();
      const set = s => {
        revoke();
        subject.set(Optional.some(s));
      };
      return {
        clear,
        isSet,
        get,
        set
      };
    };
    const destroyable = () => singleton(s => s.destroy());
    const unbindable = () => singleton(s => s.unbind());
    const value$2 = () => {
      const subject = singleton(noop);
      const on = f => subject.get().each(f);
      return {
        ...subject,
        on
      };
    };

    const filter = always;
    const bind = (element, event, handler) => bind$2(element, event, filter, handler);
    const capture = (element, event, handler) => capture$1(element, event, filter, handler);
    const fromRawEvent = fromRawEvent$1;

    const properties = [
      'top',
      'bottom',
      'right',
      'left'
    ];
    const timerAttr = 'data-alloy-transition-timer';
    const isTransitioning$1 = (element, transition) => hasAll(element, transition.classes);
    const shouldApplyTransitionCss = (transition, decision, lastPlacement) => {
      return lastPlacement.exists(placer => {
        const mode = transition.mode;
        return mode === 'all' ? true : placer[mode] !== decision[mode];
      });
    };
    const hasChanges = (position, intermediate) => {
      const round = value => parseFloat(value).toFixed(3);
      return find$4(intermediate, (value, key) => {
        const newValue = position[key].map(round);
        const val = value.map(round);
        return !equals(newValue, val);
      }).isSome();
    };
    const getTransitionDuration = element => {
      const get = name => {
        const style = get$e(element, name);
        const times = style.split(/\s*,\s*/);
        return filter$2(times, isNotEmpty);
      };
      const parse = value => {
        if (isString(value) && /^[\d.]+/.test(value)) {
          const num = parseFloat(value);
          return endsWith(value, 'ms') ? num : num * 1000;
        } else {
          return 0;
        }
      };
      const delay = get('transition-delay');
      const duration = get('transition-duration');
      return foldl(duration, (acc, dur, i) => {
        const time = parse(delay[i]) + parse(dur);
        return Math.max(acc, time);
      }, 0);
    };
    const setupTransitionListeners = (element, transition) => {
      const transitionEnd = unbindable();
      const transitionCancel = unbindable();
      let timer;
      const isSourceTransition = e => {
        var _a;
        const pseudoElement = (_a = e.raw.pseudoElement) !== null && _a !== void 0 ? _a : '';
        return eq(e.target, element) && isEmpty(pseudoElement) && contains$2(properties, e.raw.propertyName);
      };
      const transitionDone = e => {
        if (isNullable(e) || isSourceTransition(e)) {
          transitionEnd.clear();
          transitionCancel.clear();
          const type = e === null || e === void 0 ? void 0 : e.raw.type;
          if (isNullable(type) || type === transitionend()) {
            clearTimeout(timer);
            remove$7(element, timerAttr);
            remove$1(element, transition.classes);
          }
        }
      };
      const transitionStart = bind(element, transitionstart(), e => {
        if (isSourceTransition(e)) {
          transitionStart.unbind();
          transitionEnd.set(bind(element, transitionend(), transitionDone));
          transitionCancel.set(bind(element, transitioncancel(), transitionDone));
        }
      });
      const duration = getTransitionDuration(element);
      requestAnimationFrame(() => {
        timer = setTimeout(transitionDone, duration + 17);
        set$9(element, timerAttr, timer);
      });
    };
    const startTransitioning = (element, transition) => {
      add$1(element, transition.classes);
      getOpt(element, timerAttr).each(timerId => {
        clearTimeout(parseInt(timerId, 10));
        remove$7(element, timerAttr);
      });
      setupTransitionListeners(element, transition);
    };
    const applyTransitionCss = (element, origin, position, transition, decision, lastPlacement) => {
      const shouldTransition = shouldApplyTransitionCss(transition, decision, lastPlacement);
      if (shouldTransition || isTransitioning$1(element, transition)) {
        set$8(element, 'position', position.position);
        const rect = toBox(origin, element);
        const intermediatePosition = reposition(origin, {
          ...decision,
          rect
        });
        const intermediateCssOptions = mapToObject(properties, prop => intermediatePosition[prop]);
        if (hasChanges(position, intermediateCssOptions)) {
          setOptions(element, intermediateCssOptions);
          if (shouldTransition) {
            startTransitioning(element, transition);
          }
          reflow(element);
        }
      } else {
        remove$1(element, transition.classes);
      }
    };

    const elementSize = p => ({
      width: getOuter$1(p),
      height: getOuter$2(p)
    });
    const layout = (anchorBox, element, bubbles, options) => {
      remove$6(element, 'max-height');
      remove$6(element, 'max-width');
      const elementBox = elementSize(element);
      return attempts(element, options.preference, anchorBox, elementBox, bubbles, options.bounds);
    };
    const setClasses = (element, decision) => {
      const classInfo = decision.classes;
      remove$1(element, classInfo.off);
      add$1(element, classInfo.on);
    };
    const setHeight = (element, decision, options) => {
      const maxHeightFunction = options.maxHeightFunction;
      maxHeightFunction(element, decision.maxHeight);
    };
    const setWidth = (element, decision, options) => {
      const maxWidthFunction = options.maxWidthFunction;
      maxWidthFunction(element, decision.maxWidth);
    };
    const position$2 = (element, decision, options) => {
      const positionCss = reposition(options.origin, decision);
      options.transition.each(transition => {
        applyTransitionCss(element, options.origin, positionCss, transition, decision, options.lastPlacement);
      });
      applyPositionCss(element, positionCss);
    };
    const setPlacement = (element, decision) => {
      setPlacement$1(element, decision.placement);
    };

    const setMaxHeight = (element, maxHeight) => {
      setMax$1(element, Math.floor(maxHeight));
    };
    const anchored = constant$1((element, available) => {
      setMaxHeight(element, available);
      setAll(element, {
        'overflow-x': 'hidden',
        'overflow-y': 'auto'
      });
    });
    const expandable$1 = constant$1((element, available) => {
      setMaxHeight(element, available);
    });

    const defaultOr = (options, key, dephault) => options[key] === undefined ? dephault : options[key];
    const simple = (anchor, element, bubble, layouts, lastPlacement, optBounds, overrideOptions, transition) => {
      const maxHeightFunction = defaultOr(overrideOptions, 'maxHeightFunction', anchored());
      const maxWidthFunction = defaultOr(overrideOptions, 'maxWidthFunction', noop);
      const anchorBox = anchor.anchorBox;
      const origin = anchor.origin;
      const options = {
        bounds: viewport(origin, optBounds),
        origin,
        preference: layouts,
        maxHeightFunction,
        maxWidthFunction,
        lastPlacement,
        transition
      };
      return go(anchorBox, element, bubble, options);
    };
    const go = (anchorBox, element, bubble, options) => {
      const decision = layout(anchorBox, element, bubble, options);
      position$2(element, decision, options);
      setPlacement(element, decision);
      setClasses(element, decision);
      setHeight(element, decision, options);
      setWidth(element, decision, options);
      return {
        layout: decision.layout,
        placement: decision.placement
      };
    };

    const allAlignments = [
      'valignCentre',
      'alignLeft',
      'alignRight',
      'alignCentre',
      'top',
      'bottom',
      'left',
      'right',
      'inset'
    ];
    const nu$5 = (xOffset, yOffset, classes, insetModifier = 1) => {
      const insetXOffset = xOffset * insetModifier;
      const insetYOffset = yOffset * insetModifier;
      const getClasses = prop => get$g(classes, prop).getOr([]);
      const make = (xDelta, yDelta, alignmentsOn) => {
        const alignmentsOff = difference(allAlignments, alignmentsOn);
        return {
          offset: SugarPosition(xDelta, yDelta),
          classesOn: bind$3(alignmentsOn, getClasses),
          classesOff: bind$3(alignmentsOff, getClasses)
        };
      };
      return {
        southeast: () => make(-xOffset, yOffset, [
          'top',
          'alignLeft'
        ]),
        southwest: () => make(xOffset, yOffset, [
          'top',
          'alignRight'
        ]),
        south: () => make(-xOffset / 2, yOffset, [
          'top',
          'alignCentre'
        ]),
        northeast: () => make(-xOffset, -yOffset, [
          'bottom',
          'alignLeft'
        ]),
        northwest: () => make(xOffset, -yOffset, [
          'bottom',
          'alignRight'
        ]),
        north: () => make(-xOffset / 2, -yOffset, [
          'bottom',
          'alignCentre'
        ]),
        east: () => make(xOffset, -yOffset / 2, [
          'valignCentre',
          'left'
        ]),
        west: () => make(-xOffset, -yOffset / 2, [
          'valignCentre',
          'right'
        ]),
        insetNortheast: () => make(insetXOffset, insetYOffset, [
          'top',
          'alignLeft',
          'inset'
        ]),
        insetNorthwest: () => make(-insetXOffset, insetYOffset, [
          'top',
          'alignRight',
          'inset'
        ]),
        insetNorth: () => make(-insetXOffset / 2, insetYOffset, [
          'top',
          'alignCentre',
          'inset'
        ]),
        insetSoutheast: () => make(insetXOffset, -insetYOffset, [
          'bottom',
          'alignLeft',
          'inset'
        ]),
        insetSouthwest: () => make(-insetXOffset, -insetYOffset, [
          'bottom',
          'alignRight',
          'inset'
        ]),
        insetSouth: () => make(-insetXOffset / 2, -insetYOffset, [
          'bottom',
          'alignCentre',
          'inset'
        ]),
        insetEast: () => make(-insetXOffset, -insetYOffset / 2, [
          'valignCentre',
          'right',
          'inset'
        ]),
        insetWest: () => make(insetXOffset, -insetYOffset / 2, [
          'valignCentre',
          'left',
          'inset'
        ])
      };
    };
    const fallback = () => nu$5(0, 0, {});

    const nu$4 = identity;

    const onDirection = (isLtr, isRtl) => element => getDirection(element) === 'rtl' ? isRtl : isLtr;
    const getDirection = element => get$e(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';

    var AttributeValue;
    (function (AttributeValue) {
      AttributeValue['TopToBottom'] = 'toptobottom';
      AttributeValue['BottomToTop'] = 'bottomtotop';
    }(AttributeValue || (AttributeValue = {})));
    const Attribute = 'data-alloy-vertical-dir';
    const isBottomToTopDir = el => closest$2(el, current => isElement$1(current) && get$f(current, 'data-alloy-vertical-dir') === AttributeValue.BottomToTop);

    const schema$y = () => optionObjOf('layouts', [
      required$1('onLtr'),
      required$1('onRtl'),
      option$3('onBottomLtr'),
      option$3('onBottomRtl')
    ]);
    const get$5 = (elem, info, defaultLtr, defaultRtl, defaultBottomLtr, defaultBottomRtl, dirElement) => {
      const isBottomToTop = dirElement.map(isBottomToTopDir).getOr(false);
      const customLtr = info.layouts.map(ls => ls.onLtr(elem));
      const customRtl = info.layouts.map(ls => ls.onRtl(elem));
      const ltr = isBottomToTop ? info.layouts.bind(ls => ls.onBottomLtr.map(f => f(elem))).or(customLtr).getOr(defaultBottomLtr) : customLtr.getOr(defaultLtr);
      const rtl = isBottomToTop ? info.layouts.bind(ls => ls.onBottomRtl.map(f => f(elem))).or(customRtl).getOr(defaultBottomRtl) : customRtl.getOr(defaultRtl);
      const f = onDirection(ltr, rtl);
      return f(elem);
    };

    const placement$4 = (component, anchorInfo, origin) => {
      const hotspot = anchorInfo.hotspot;
      const anchorBox = toBox(origin, hotspot.element);
      const layouts = get$5(component.element, anchorInfo, belowOrAbove(), belowOrAboveRtl(), aboveOrBelow(), aboveOrBelowRtl(), Optional.some(anchorInfo.hotspot.element));
      return Optional.some(nu$4({
        anchorBox,
        bubble: anchorInfo.bubble.getOr(fallback()),
        overrides: anchorInfo.overrides,
        layouts
      }));
    };
    var HotspotAnchor = [
      required$1('hotspot'),
      option$3('bubble'),
      defaulted('overrides', {}),
      schema$y(),
      output$1('placement', placement$4)
    ];

    const placement$3 = (component, anchorInfo, origin) => {
      const pos = translate$2(origin, anchorInfo.x, anchorInfo.y);
      const anchorBox = bounds(pos.left, pos.top, anchorInfo.width, anchorInfo.height);
      const layouts = get$5(component.element, anchorInfo, all$1(), allRtl$1(), all$1(), allRtl$1(), Optional.none());
      return Optional.some(nu$4({
        anchorBox,
        bubble: anchorInfo.bubble,
        overrides: anchorInfo.overrides,
        layouts
      }));
    };
    var MakeshiftAnchor = [
      required$1('x'),
      required$1('y'),
      defaulted('height', 0),
      defaulted('width', 0),
      defaulted('bubble', fallback()),
      defaulted('overrides', {}),
      schema$y(),
      output$1('placement', placement$3)
    ];

    const adt$7 = Adt.generate([
      { screen: ['point'] },
      {
        absolute: [
          'point',
          'scrollLeft',
          'scrollTop'
        ]
      }
    ]);
    const toFixed = pos => pos.fold(identity, (point, scrollLeft, scrollTop) => point.translate(-scrollLeft, -scrollTop));
    const toAbsolute = pos => pos.fold(identity, identity);
    const sum = points => foldl(points, (b, a) => b.translate(a.left, a.top), SugarPosition(0, 0));
    const sumAsFixed = positions => {
      const points = map$2(positions, toFixed);
      return sum(points);
    };
    const sumAsAbsolute = positions => {
      const points = map$2(positions, toAbsolute);
      return sum(points);
    };
    const screen = adt$7.screen;
    const absolute$1 = adt$7.absolute;

    const getOffset = (component, origin, anchorInfo) => {
      const win = defaultView(anchorInfo.root).dom;
      const hasSameOwner = frame => {
        const frameOwner = owner$4(frame);
        const compOwner = owner$4(component.element);
        return eq(frameOwner, compOwner);
      };
      return Optional.from(win.frameElement).map(SugarElement.fromDom).filter(hasSameOwner).map(absolute$3);
    };
    const getRootPoint = (component, origin, anchorInfo) => {
      const doc = owner$4(component.element);
      const outerScroll = get$b(doc);
      const offset = getOffset(component, origin, anchorInfo).getOr(outerScroll);
      return absolute$1(offset, outerScroll.left, outerScroll.top);
    };

    const getBox = (left, top, width, height) => {
      const point = screen(SugarPosition(left, top));
      return Optional.some(pointed(point, width, height));
    };
    const calcNewAnchor = (optBox, rootPoint, anchorInfo, origin, elem) => optBox.map(box => {
      const points = [
        rootPoint,
        box.point
      ];
      const topLeft = cata$1(origin, () => sumAsAbsolute(points), () => sumAsAbsolute(points), () => sumAsFixed(points));
      const anchorBox = rect(topLeft.left, topLeft.top, box.width, box.height);
      const layoutsLtr = anchorInfo.showAbove ? aboveOrBelow() : belowOrAbove();
      const layoutsRtl = anchorInfo.showAbove ? aboveOrBelowRtl() : belowOrAboveRtl();
      const layouts = get$5(elem, anchorInfo, layoutsLtr, layoutsRtl, layoutsLtr, layoutsRtl, Optional.none());
      return nu$4({
        anchorBox,
        bubble: anchorInfo.bubble.getOr(fallback()),
        overrides: anchorInfo.overrides,
        layouts
      });
    });

    const placement$2 = (component, anchorInfo, origin) => {
      const rootPoint = getRootPoint(component, origin, anchorInfo);
      return anchorInfo.node.filter(inBody).bind(target => {
        const rect = target.dom.getBoundingClientRect();
        const nodeBox = getBox(rect.left, rect.top, rect.width, rect.height);
        const elem = anchorInfo.node.getOr(component.element);
        return calcNewAnchor(nodeBox, rootPoint, anchorInfo, origin, elem);
      });
    };
    var NodeAnchor = [
      required$1('node'),
      required$1('root'),
      option$3('bubble'),
      schema$y(),
      defaulted('overrides', {}),
      defaulted('showAbove', false),
      output$1('placement', placement$2)
    ];

    const zeroWidth = '\uFEFF';
    const nbsp = '\xA0';

    const create$3 = (start, soffset, finish, foffset) => ({
      start,
      soffset,
      finish,
      foffset
    });
    const SimRange = { create: create$3 };

    const adt$6 = Adt.generate([
      { before: ['element'] },
      {
        on: [
          'element',
          'offset'
        ]
      },
      { after: ['element'] }
    ]);
    const cata = (subject, onBefore, onOn, onAfter) => subject.fold(onBefore, onOn, onAfter);
    const getStart$1 = situ => situ.fold(identity, identity, identity);
    const before = adt$6.before;
    const on$1 = adt$6.on;
    const after$1 = adt$6.after;
    const Situ = {
      before,
      on: on$1,
      after: after$1,
      cata,
      getStart: getStart$1
    };

    const adt$5 = Adt.generate([
      { domRange: ['rng'] },
      {
        relative: [
          'startSitu',
          'finishSitu'
        ]
      },
      {
        exact: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      }
    ]);
    const exactFromRange = simRange => adt$5.exact(simRange.start, simRange.soffset, simRange.finish, simRange.foffset);
    const getStart = selection => selection.match({
      domRange: rng => SugarElement.fromDom(rng.startContainer),
      relative: (startSitu, _finishSitu) => Situ.getStart(startSitu),
      exact: (start, _soffset, _finish, _foffset) => start
    });
    const domRange = adt$5.domRange;
    const relative = adt$5.relative;
    const exact = adt$5.exact;
    const getWin = selection => {
      const start = getStart(selection);
      return defaultView(start);
    };
    const range$1 = SimRange.create;
    const SimSelection = {
      domRange,
      relative,
      exact,
      exactFromRange,
      getWin,
      range: range$1
    };

    const setStart = (rng, situ) => {
      situ.fold(e => {
        rng.setStartBefore(e.dom);
      }, (e, o) => {
        rng.setStart(e.dom, o);
      }, e => {
        rng.setStartAfter(e.dom);
      });
    };
    const setFinish = (rng, situ) => {
      situ.fold(e => {
        rng.setEndBefore(e.dom);
      }, (e, o) => {
        rng.setEnd(e.dom, o);
      }, e => {
        rng.setEndAfter(e.dom);
      });
    };
    const relativeToNative = (win, startSitu, finishSitu) => {
      const range = win.document.createRange();
      setStart(range, startSitu);
      setFinish(range, finishSitu);
      return range;
    };
    const exactToNative = (win, start, soffset, finish, foffset) => {
      const rng = win.document.createRange();
      rng.setStart(start.dom, soffset);
      rng.setEnd(finish.dom, foffset);
      return rng;
    };
    const toRect = rect => ({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    });
    const getFirstRect$1 = rng => {
      const rects = rng.getClientRects();
      const rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0 ? Optional.some(rect).map(toRect) : Optional.none();
    };
    const getBounds$2 = rng => {
      const rect = rng.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0 ? Optional.some(rect).map(toRect) : Optional.none();
    };

    const adt$4 = Adt.generate([
      {
        ltr: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      },
      {
        rtl: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      }
    ]);
    const fromRange = (win, type, range) => type(SugarElement.fromDom(range.startContainer), range.startOffset, SugarElement.fromDom(range.endContainer), range.endOffset);
    const getRanges = (win, selection) => selection.match({
      domRange: rng => {
        return {
          ltr: constant$1(rng),
          rtl: Optional.none
        };
      },
      relative: (startSitu, finishSitu) => {
        return {
          ltr: cached(() => relativeToNative(win, startSitu, finishSitu)),
          rtl: cached(() => Optional.some(relativeToNative(win, finishSitu, startSitu)))
        };
      },
      exact: (start, soffset, finish, foffset) => {
        return {
          ltr: cached(() => exactToNative(win, start, soffset, finish, foffset)),
          rtl: cached(() => Optional.some(exactToNative(win, finish, foffset, start, soffset)))
        };
      }
    });
    const doDiagnose = (win, ranges) => {
      const rng = ranges.ltr();
      if (rng.collapsed) {
        const reversed = ranges.rtl().filter(rev => rev.collapsed === false);
        return reversed.map(rev => adt$4.rtl(SugarElement.fromDom(rev.endContainer), rev.endOffset, SugarElement.fromDom(rev.startContainer), rev.startOffset)).getOrThunk(() => fromRange(win, adt$4.ltr, rng));
      } else {
        return fromRange(win, adt$4.ltr, rng);
      }
    };
    const diagnose = (win, selection) => {
      const ranges = getRanges(win, selection);
      return doDiagnose(win, ranges);
    };
    const asLtrRange = (win, selection) => {
      const diagnosis = diagnose(win, selection);
      return diagnosis.match({
        ltr: (start, soffset, finish, foffset) => {
          const rng = win.document.createRange();
          rng.setStart(start.dom, soffset);
          rng.setEnd(finish.dom, foffset);
          return rng;
        },
        rtl: (start, soffset, finish, foffset) => {
          const rng = win.document.createRange();
          rng.setStart(finish.dom, foffset);
          rng.setEnd(start.dom, soffset);
          return rng;
        }
      });
    };
    adt$4.ltr;
    adt$4.rtl;

    const ancestors = (scope, predicate, isRoot) => filter$2(parents(scope, isRoot), predicate);

    const descendants = (scope, selector) => all$3(selector, scope);

    const makeRange = (start, soffset, finish, foffset) => {
      const doc = owner$4(start);
      const rng = doc.dom.createRange();
      rng.setStart(start.dom, soffset);
      rng.setEnd(finish.dom, foffset);
      return rng;
    };
    const after = (start, soffset, finish, foffset) => {
      const r = makeRange(start, soffset, finish, foffset);
      const same = eq(start, finish) && soffset === foffset;
      return r.collapsed && !same;
    };

    const getNativeSelection = win => Optional.from(win.getSelection());
    const readRange = selection => {
      if (selection.rangeCount > 0) {
        const firstRng = selection.getRangeAt(0);
        const lastRng = selection.getRangeAt(selection.rangeCount - 1);
        return Optional.some(SimRange.create(SugarElement.fromDom(firstRng.startContainer), firstRng.startOffset, SugarElement.fromDom(lastRng.endContainer), lastRng.endOffset));
      } else {
        return Optional.none();
      }
    };
    const doGetExact = selection => {
      if (selection.anchorNode === null || selection.focusNode === null) {
        return readRange(selection);
      } else {
        const anchor = SugarElement.fromDom(selection.anchorNode);
        const focus = SugarElement.fromDom(selection.focusNode);
        return after(anchor, selection.anchorOffset, focus, selection.focusOffset) ? Optional.some(SimRange.create(anchor, selection.anchorOffset, focus, selection.focusOffset)) : readRange(selection);
      }
    };
    const getExact = win => getNativeSelection(win).filter(sel => sel.rangeCount > 0).bind(doGetExact);
    const getFirstRect = (win, selection) => {
      const rng = asLtrRange(win, selection);
      return getFirstRect$1(rng);
    };
    const getBounds$1 = (win, selection) => {
      const rng = asLtrRange(win, selection);
      return getBounds$2(rng);
    };

    const NodeValue = (is, name) => {
      const get = element => {
        if (!is(element)) {
          throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
        }
        return getOption(element).getOr('');
      };
      const getOption = element => is(element) ? Optional.from(element.dom.nodeValue) : Optional.none();
      const set = (element, value) => {
        if (!is(element)) {
          throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
        }
        element.dom.nodeValue = value;
      };
      return {
        get,
        getOption,
        set
      };
    };

    const api = NodeValue(isText, 'text');
    const get$4 = element => api.get(element);

    const point = (element, offset) => ({
      element,
      offset
    });
    const descendOnce$1 = (element, offset) => {
      const children$1 = children(element);
      if (children$1.length === 0) {
        return point(element, offset);
      } else if (offset < children$1.length) {
        return point(children$1[offset], 0);
      } else {
        const last = children$1[children$1.length - 1];
        const len = isText(last) ? get$4(last).length : children(last).length;
        return point(last, len);
      }
    };

    const descendOnce = (element, offset) => isText(element) ? point(element, offset) : descendOnce$1(element, offset);
    const isSimRange = detail => detail.foffset !== undefined;
    const getAnchorSelection = (win, anchorInfo) => {
      const getSelection = anchorInfo.getSelection.getOrThunk(() => () => getExact(win));
      return getSelection().map(sel => {
        if (isSimRange(sel)) {
          const modStart = descendOnce(sel.start, sel.soffset);
          const modFinish = descendOnce(sel.finish, sel.foffset);
          return SimSelection.range(modStart.element, modStart.offset, modFinish.element, modFinish.offset);
        } else {
          return sel;
        }
      });
    };
    const placement$1 = (component, anchorInfo, origin) => {
      const win = defaultView(anchorInfo.root).dom;
      const rootPoint = getRootPoint(component, origin, anchorInfo);
      const selectionBox = getAnchorSelection(win, anchorInfo).bind(sel => {
        if (isSimRange(sel)) {
          const optRect = getBounds$1(win, SimSelection.exactFromRange(sel)).orThunk(() => {
            const zeroWidth$1 = SugarElement.fromText(zeroWidth);
            before$1(sel.start, zeroWidth$1);
            const rect = getFirstRect(win, SimSelection.exact(zeroWidth$1, 0, zeroWidth$1, 1));
            remove$5(zeroWidth$1);
            return rect;
          });
          return optRect.bind(rawRect => {
            return getBox(rawRect.left, rawRect.top, rawRect.width, rawRect.height);
          });
        } else {
          const selectionRect = map$1(sel, cell => cell.dom.getBoundingClientRect());
          const bounds = {
            left: Math.min(selectionRect.firstCell.left, selectionRect.lastCell.left),
            right: Math.max(selectionRect.firstCell.right, selectionRect.lastCell.right),
            top: Math.min(selectionRect.firstCell.top, selectionRect.lastCell.top),
            bottom: Math.max(selectionRect.firstCell.bottom, selectionRect.lastCell.bottom)
          };
          return getBox(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        }
      });
      const targetElement = getAnchorSelection(win, anchorInfo).bind(sel => {
        if (isSimRange(sel)) {
          return isElement$1(sel.start) ? Optional.some(sel.start) : parentElement(sel.start);
        } else {
          return Optional.some(sel.firstCell);
        }
      });
      const elem = targetElement.getOr(component.element);
      return calcNewAnchor(selectionBox, rootPoint, anchorInfo, origin, elem);
    };
    var SelectionAnchor = [
      option$3('getSelection'),
      required$1('root'),
      option$3('bubble'),
      schema$y(),
      defaulted('overrides', {}),
      defaulted('showAbove', false),
      output$1('placement', placement$1)
    ];

    const labelPrefix$1 = 'link-layout';
    const eastX = anchor => anchor.x + anchor.width;
    const westX = (anchor, element) => anchor.x - element.width;
    const northY$1 = (anchor, element) => anchor.y - element.height + anchor.height;
    const southY$1 = anchor => anchor.y;
    const southeast$1 = (anchor, element, bubbles) => nu$6(eastX(anchor), southY$1(anchor), bubbles.southeast(), southeast$3(), 'southeast', boundsRestriction(anchor, {
      left: 0,
      top: 2
    }), labelPrefix$1);
    const southwest$1 = (anchor, element, bubbles) => nu$6(westX(anchor, element), southY$1(anchor), bubbles.southwest(), southwest$3(), 'southwest', boundsRestriction(anchor, {
      right: 1,
      top: 2
    }), labelPrefix$1);
    const northeast$1 = (anchor, element, bubbles) => nu$6(eastX(anchor), northY$1(anchor, element), bubbles.northeast(), northeast$3(), 'northeast', boundsRestriction(anchor, {
      left: 0,
      bottom: 3
    }), labelPrefix$1);
    const northwest$1 = (anchor, element, bubbles) => nu$6(westX(anchor, element), northY$1(anchor, element), bubbles.northwest(), northwest$3(), 'northwest', boundsRestriction(anchor, {
      right: 1,
      bottom: 3
    }), labelPrefix$1);
    const all = () => [
      southeast$1,
      southwest$1,
      northeast$1,
      northwest$1
    ];
    const allRtl = () => [
      southwest$1,
      southeast$1,
      northwest$1,
      northeast$1
    ];

    const placement = (component, submenuInfo, origin) => {
      const anchorBox = toBox(origin, submenuInfo.item.element);
      const layouts = get$5(component.element, submenuInfo, all(), allRtl(), all(), allRtl(), Optional.none());
      return Optional.some(nu$4({
        anchorBox,
        bubble: fallback(),
        overrides: submenuInfo.overrides,
        layouts
      }));
    };
    var SubmenuAnchor = [
      required$1('item'),
      schema$y(),
      defaulted('overrides', {}),
      output$1('placement', placement)
    ];

    var AnchorSchema = choose$1('type', {
      selection: SelectionAnchor,
      node: NodeAnchor,
      hotspot: HotspotAnchor,
      submenu: SubmenuAnchor,
      makeshift: MakeshiftAnchor
    });

    const TransitionSchema = [
      requiredArrayOf('classes', string),
      defaultedStringEnum('mode', 'all', [
        'all',
        'layout',
        'placement'
      ])
    ];
    const PositionSchema = [
      defaulted('useFixed', never),
      option$3('getBounds')
    ];
    const PlacementSchema = [
      requiredOf('anchor', AnchorSchema),
      optionObjOf('transition', TransitionSchema)
    ];

    const getFixedOrigin = () => {
      const html = document.documentElement;
      return fixed$1(0, 0, html.clientWidth, html.clientHeight);
    };
    const getRelativeOrigin = component => {
      const position = absolute$3(component.element);
      const bounds = component.element.dom.getBoundingClientRect();
      return relative$1(position.left, position.top, bounds.width, bounds.height);
    };
    const place = (origin, anchoring, optBounds, placee, lastPlace, transition) => {
      const anchor = box(anchoring.anchorBox, origin);
      return simple(anchor, placee.element, anchoring.bubble, anchoring.layouts, lastPlace, optBounds, anchoring.overrides, transition);
    };
    const position$1 = (component, posConfig, posState, placee, placementSpec) => {
      const optWithinBounds = Optional.none();
      positionWithinBounds(component, posConfig, posState, placee, placementSpec, optWithinBounds);
    };
    const positionWithinBounds = (component, posConfig, posState, placee, placementSpec, optWithinBounds) => {
      const placeeDetail = asRawOrDie$1('placement.info', objOf(PlacementSchema), placementSpec);
      const anchorage = placeeDetail.anchor;
      const element = placee.element;
      const placeeState = posState.get(placee.uid);
      preserve$1(() => {
        set$8(element, 'position', 'fixed');
        const oldVisibility = getRaw(element, 'visibility');
        set$8(element, 'visibility', 'hidden');
        const origin = posConfig.useFixed() ? getFixedOrigin() : getRelativeOrigin(component);
        anchorage.placement(component, anchorage, origin).each(anchoring => {
          const optBounds = optWithinBounds.orThunk(() => posConfig.getBounds.map(apply$1));
          const newState = place(origin, anchoring, optBounds, placee, placeeState, placeeDetail.transition);
          posState.set(placee.uid, newState);
        });
        oldVisibility.fold(() => {
          remove$6(element, 'visibility');
        }, vis => {
          set$8(element, 'visibility', vis);
        });
        if (getRaw(element, 'left').isNone() && getRaw(element, 'top').isNone() && getRaw(element, 'right').isNone() && getRaw(element, 'bottom').isNone() && is$1(getRaw(element, 'position'), 'fixed')) {
          remove$6(element, 'position');
        }
      }, element);
    };
    const getMode = (component, pConfig, _pState) => pConfig.useFixed() ? 'fixed' : 'absolute';
    const reset$1 = (component, pConfig, posState, placee) => {
      const element = placee.element;
      each$1([
        'position',
        'left',
        'right',
        'top',
        'bottom'
      ], prop => remove$6(element, prop));
      reset$2(element);
      posState.clear(placee.uid);
    };

    var PositionApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        position: position$1,
        positionWithinBounds: positionWithinBounds,
        getMode: getMode,
        reset: reset$1
    });

    const init$g = () => {
      let state = {};
      const set = (id, data) => {
        state[id] = data;
      };
      const get = id => get$g(state, id);
      const clear = id => {
        if (isNonNullable(id)) {
          delete state[id];
        } else {
          state = {};
        }
      };
      return nu$8({
        readState: () => state,
        clear,
        set,
        get
      });
    };

    var PositioningState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$g
    });

    const Positioning = create$4({
      fields: PositionSchema,
      name: 'positioning',
      active: ActivePosition,
      apis: PositionApis,
      state: PositioningState
    });

    const isConnected = comp => comp.getSystem().isConnected();
    const fireDetaching = component => {
      emit(component, detachedFromDom());
      const children = component.components();
      each$1(children, fireDetaching);
    };
    const fireAttaching = component => {
      const children = component.components();
      each$1(children, fireAttaching);
      emit(component, attachedToDom());
    };
    const virtualAttach = (parent, child) => {
      parent.getSystem().addToWorld(child);
      if (inBody(parent.element)) {
        fireAttaching(child);
      }
    };
    const virtualDetach = comp => {
      fireDetaching(comp);
      comp.getSystem().removeFromWorld(comp);
    };
    const attach$1 = (parent, child) => {
      append$2(parent.element, child.element);
    };
    const detachChildren$1 = component => {
      each$1(component.components(), childComp => remove$5(childComp.element));
      empty(component.element);
      component.syncComponents();
    };
    const replaceChildren = (component, newSpecs, buildNewChildren) => {
      const subs = component.components();
      detachChildren$1(component);
      const newChildren = buildNewChildren(newSpecs);
      const deleted = difference(subs, newChildren);
      each$1(deleted, comp => {
        fireDetaching(comp);
        component.getSystem().removeFromWorld(comp);
      });
      each$1(newChildren, childComp => {
        if (!isConnected(childComp)) {
          component.getSystem().addToWorld(childComp);
          attach$1(component, childComp);
          if (inBody(component.element)) {
            fireAttaching(childComp);
          }
        } else {
          attach$1(component, childComp);
        }
      });
      component.syncComponents();
    };
    const virtualReplaceChildren = (component, newSpecs, buildNewChildren) => {
      const subs = component.components();
      const existingComps = bind$3(newSpecs, spec => getPremade(spec).toArray());
      each$1(subs, childComp => {
        if (!contains$2(existingComps, childComp)) {
          virtualDetach(childComp);
        }
      });
      const newChildren = buildNewChildren(newSpecs);
      const deleted = difference(subs, newChildren);
      each$1(deleted, deletedComp => {
        if (isConnected(deletedComp)) {
          virtualDetach(deletedComp);
        }
      });
      each$1(newChildren, childComp => {
        if (!isConnected(childComp)) {
          virtualAttach(component, childComp);
        }
      });
      component.syncComponents();
    };

    const attach = (parent, child) => {
      attachWith(parent, child, append$2);
    };
    const attachWith = (parent, child, insertion) => {
      parent.getSystem().addToWorld(child);
      insertion(parent.element, child.element);
      if (inBody(parent.element)) {
        fireAttaching(child);
      }
      parent.syncComponents();
    };
    const doDetach = component => {
      fireDetaching(component);
      remove$5(component.element);
      component.getSystem().removeFromWorld(component);
    };
    const detach = component => {
      const parent$1 = parent(component.element).bind(p => component.getSystem().getByDom(p).toOptional());
      doDetach(component);
      parent$1.each(p => {
        p.syncComponents();
      });
    };
    const detachChildren = component => {
      const subs = component.components();
      each$1(subs, doDetach);
      empty(component.element);
      component.syncComponents();
    };
    const attachSystem = (element, guiSystem) => {
      attachSystemWith(element, guiSystem, append$2);
    };
    const attachSystemAfter = (element, guiSystem) => {
      attachSystemWith(element, guiSystem, after$2);
    };
    const attachSystemWith = (element, guiSystem, inserter) => {
      inserter(element, guiSystem.element);
      const children$1 = children(guiSystem.element);
      each$1(children$1, child => {
        guiSystem.getByDom(child).each(fireAttaching);
      });
    };
    const detachSystem = guiSystem => {
      const children$1 = children(guiSystem.element);
      each$1(children$1, child => {
        guiSystem.getByDom(child).each(fireDetaching);
      });
      remove$5(guiSystem.element);
    };

    const rebuild = (sandbox, sConfig, sState, data) => {
      sState.get().each(_data => {
        detachChildren(sandbox);
      });
      const point = sConfig.getAttachPoint(sandbox);
      attach(point, sandbox);
      const built = sandbox.getSystem().build(data);
      attach(sandbox, built);
      sState.set(built);
      return built;
    };
    const open$1 = (sandbox, sConfig, sState, data) => {
      const newState = rebuild(sandbox, sConfig, sState, data);
      sConfig.onOpen(sandbox, newState);
      return newState;
    };
    const setContent = (sandbox, sConfig, sState, data) => sState.get().map(() => rebuild(sandbox, sConfig, sState, data));
    const openWhileCloaked = (sandbox, sConfig, sState, data, transaction) => {
      cloak(sandbox, sConfig);
      open$1(sandbox, sConfig, sState, data);
      transaction();
      decloak(sandbox, sConfig);
    };
    const close$1 = (sandbox, sConfig, sState) => {
      sState.get().each(data => {
        detachChildren(sandbox);
        detach(sandbox);
        sConfig.onClose(sandbox, data);
        sState.clear();
      });
    };
    const isOpen$1 = (_sandbox, _sConfig, sState) => sState.isOpen();
    const isPartOf = (sandbox, sConfig, sState, queryElem) => isOpen$1(sandbox, sConfig, sState) && sState.get().exists(data => sConfig.isPartOf(sandbox, data, queryElem));
    const getState$2 = (_sandbox, _sConfig, sState) => sState.get();
    const store = (sandbox, cssKey, attr, newValue) => {
      getRaw(sandbox.element, cssKey).fold(() => {
        remove$7(sandbox.element, attr);
      }, v => {
        set$9(sandbox.element, attr, v);
      });
      set$8(sandbox.element, cssKey, newValue);
    };
    const restore = (sandbox, cssKey, attr) => {
      getOpt(sandbox.element, attr).fold(() => remove$6(sandbox.element, cssKey), oldValue => set$8(sandbox.element, cssKey, oldValue));
    };
    const cloak = (sandbox, sConfig, _sState) => {
      const sink = sConfig.getAttachPoint(sandbox);
      set$8(sandbox.element, 'position', Positioning.getMode(sink));
      store(sandbox, 'visibility', sConfig.cloakVisibilityAttr, 'hidden');
    };
    const hasPosition = element => exists([
      'top',
      'left',
      'right',
      'bottom'
    ], pos => getRaw(element, pos).isSome());
    const decloak = (sandbox, sConfig, _sState) => {
      if (!hasPosition(sandbox.element)) {
        remove$6(sandbox.element, 'position');
      }
      restore(sandbox, 'visibility', sConfig.cloakVisibilityAttr);
    };

    var SandboxApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cloak: cloak,
        decloak: decloak,
        open: open$1,
        openWhileCloaked: openWhileCloaked,
        close: close$1,
        isOpen: isOpen$1,
        isPartOf: isPartOf,
        getState: getState$2,
        setContent: setContent
    });

    const events$g = (sandboxConfig, sandboxState) => derive$2([run$1(sandboxClose(), (sandbox, _simulatedEvent) => {
        close$1(sandbox, sandboxConfig, sandboxState);
      })]);

    var ActiveSandbox = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$g
    });

    var SandboxSchema = [
      onHandler('onOpen'),
      onHandler('onClose'),
      required$1('isPartOf'),
      required$1('getAttachPoint'),
      defaulted('cloakVisibilityAttr', 'data-precloak-visibility')
    ];

    const init$f = () => {
      const contents = value$2();
      const readState = constant$1('not-implemented');
      return nu$8({
        readState,
        isOpen: contents.isSet,
        clear: contents.clear,
        set: contents.set,
        get: contents.get
      });
    };

    var SandboxState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$f
    });

    const Sandboxing = create$4({
      fields: SandboxSchema,
      name: 'sandboxing',
      active: ActiveSandbox,
      apis: SandboxApis,
      state: SandboxState
    });

    const dismissPopups = constant$1('dismiss.popups');
    const repositionPopups = constant$1('reposition.popups');
    const mouseReleased = constant$1('mouse.released');

    const schema$x = objOfOnly([
      defaulted('isExtraPart', never),
      optionObjOf('fireEventInstead', [defaulted('event', dismissRequested())])
    ]);
    const receivingChannel$1 = rawSpec => {
      const detail = asRawOrDie$1('Dismissal', schema$x, rawSpec);
      return {
        [dismissPopups()]: {
          schema: objOfOnly([required$1('target')]),
          onReceive: (sandbox, data) => {
            if (Sandboxing.isOpen(sandbox)) {
              const isPart = Sandboxing.isPartOf(sandbox, data.target) || detail.isExtraPart(sandbox, data.target);
              if (!isPart) {
                detail.fireEventInstead.fold(() => Sandboxing.close(sandbox), fe => emit(sandbox, fe.event));
              }
            }
          }
        }
      };
    };

    const schema$w = objOfOnly([
      optionObjOf('fireEventInstead', [defaulted('event', repositionRequested())]),
      requiredFunction('doReposition')
    ]);
    const receivingChannel = rawSpec => {
      const detail = asRawOrDie$1('Reposition', schema$w, rawSpec);
      return {
        [repositionPopups()]: {
          onReceive: sandbox => {
            if (Sandboxing.isOpen(sandbox)) {
              detail.fireEventInstead.fold(() => detail.doReposition(sandbox), fe => emit(sandbox, fe.event));
            }
          }
        }
      };
    };

    const onLoad$5 = (component, repConfig, repState) => {
      repConfig.store.manager.onLoad(component, repConfig, repState);
    };
    const onUnload$2 = (component, repConfig, repState) => {
      repConfig.store.manager.onUnload(component, repConfig, repState);
    };
    const setValue$3 = (component, repConfig, repState, data) => {
      repConfig.store.manager.setValue(component, repConfig, repState, data);
    };
    const getValue$3 = (component, repConfig, repState) => repConfig.store.manager.getValue(component, repConfig, repState);
    const getState$1 = (component, repConfig, repState) => repState;

    var RepresentApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        onLoad: onLoad$5,
        onUnload: onUnload$2,
        setValue: setValue$3,
        getValue: getValue$3,
        getState: getState$1
    });

    const events$f = (repConfig, repState) => {
      const es = repConfig.resetOnDom ? [
        runOnAttached((comp, _se) => {
          onLoad$5(comp, repConfig, repState);
        }),
        runOnDetached((comp, _se) => {
          onUnload$2(comp, repConfig, repState);
        })
      ] : [loadEvent(repConfig, repState, onLoad$5)];
      return derive$2(es);
    };

    var ActiveRepresenting = /*#__PURE__*/Object.freeze({
        __proto__: null,
        events: events$f
    });

    const memory$1 = () => {
      const data = Cell(null);
      const readState = () => ({
        mode: 'memory',
        value: data.get()
      });
      const isNotSet = () => data.get() === null;
      const clear = () => {
        data.set(null);
      };
      return nu$8({
        set: data.set,
        get: data.get,
        isNotSet,
        clear,
        readState
      });
    };
    const manual = () => {
      const readState = noop;
      return nu$8({ readState });
    };
    const dataset = () => {
      const dataByValue = Cell({});
      const dataByText = Cell({});
      const readState = () => ({
        mode: 'dataset',
        dataByValue: dataByValue.get(),
        dataByText: dataByText.get()
      });
      const clear = () => {
        dataByValue.set({});
        dataByText.set({});
      };
      const lookup = itemString => get$g(dataByValue.get(), itemString).orThunk(() => get$g(dataByText.get(), itemString));
      const update = items => {
        const currentDataByValue = dataByValue.get();
        const currentDataByText = dataByText.get();
        const newDataByValue = {};
        const newDataByText = {};
        each$1(items, item => {
          newDataByValue[item.value] = item;
          get$g(item, 'meta').each(meta => {
            get$g(meta, 'text').each(text => {
              newDataByText[text] = item;
            });
          });
        });
        dataByValue.set({
          ...currentDataByValue,
          ...newDataByValue
        });
        dataByText.set({
          ...currentDataByText,
          ...newDataByText
        });
      };
      return nu$8({
        readState,
        lookup,
        update,
        clear
      });
    };
    const init$e = spec => spec.store.manager.state(spec);

    var RepresentState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        memory: memory$1,
        dataset: dataset,
        manual: manual,
        init: init$e
    });

    const setValue$2 = (component, repConfig, repState, data) => {
      const store = repConfig.store;
      repState.update([data]);
      store.setValue(component, data);
      repConfig.onSetValue(component, data);
    };
    const getValue$2 = (component, repConfig, repState) => {
      const store = repConfig.store;
      const key = store.getDataKey(component);
      return repState.lookup(key).getOrThunk(() => store.getFallbackEntry(key));
    };
    const onLoad$4 = (component, repConfig, repState) => {
      const store = repConfig.store;
      store.initialValue.each(data => {
        setValue$2(component, repConfig, repState, data);
      });
    };
    const onUnload$1 = (component, repConfig, repState) => {
      repState.clear();
    };
    var DatasetStore = [
      option$3('initialValue'),
      required$1('getFallbackEntry'),
      required$1('getDataKey'),
      required$1('setValue'),
      output$1('manager', {
        setValue: setValue$2,
        getValue: getValue$2,
        onLoad: onLoad$4,
        onUnload: onUnload$1,
        state: dataset
      })
    ];

    const getValue$1 = (component, repConfig, _repState) => repConfig.store.getValue(component);
    const setValue$1 = (component, repConfig, _repState, data) => {
      repConfig.store.setValue(component, data);
      repConfig.onSetValue(component, data);
    };
    const onLoad$3 = (component, repConfig, _repState) => {
      repConfig.store.initialValue.each(data => {
        repConfig.store.setValue(component, data);
      });
    };
    var ManualStore = [
      required$1('getValue'),
      defaulted('setValue', noop),
      option$3('initialValue'),
      output$1('manager', {
        setValue: setValue$1,
        getValue: getValue$1,
        onLoad: onLoad$3,
        onUnload: noop,
        state: NoState.init
      })
    ];

    const setValue = (component, repConfig, repState, data) => {
      repState.set(data);
      repConfig.onSetValue(component, data);
    };
    const getValue = (component, repConfig, repState) => repState.get();
    const onLoad$2 = (component, repConfig, repState) => {
      repConfig.store.initialValue.each(initVal => {
        if (repState.isNotSet()) {
          repState.set(initVal);
        }
      });
    };
    const onUnload = (component, repConfig, repState) => {
      repState.clear();
    };
    var MemoryStore = [
      option$3('initialValue'),
      output$1('manager', {
        setValue,
        getValue,
        onLoad: onLoad$2,
        onUnload,
        state: memory$1
      })
    ];

    var RepresentSchema = [
      defaultedOf('store', { mode: 'memory' }, choose$1('mode', {
        memory: MemoryStore,
        manual: ManualStore,
        dataset: DatasetStore
      })),
      onHandler('onSetValue'),
      defaulted('resetOnDom', false)
    ];

    const Representing = create$4({
      fields: RepresentSchema,
      name: 'representing',
      active: ActiveRepresenting,
      apis: RepresentApis,
      extra: {
        setValueFrom: (component, source) => {
          const value = Representing.getValue(source);
          Representing.setValue(component, value);
        }
      },
      state: RepresentState
    });

    const field = (name, forbidden) => defaultedObjOf(name, {}, map$2(forbidden, f => forbid(f.name(), 'Cannot configure ' + f.name() + ' for ' + name)).concat([customField('dump', identity)]));
    const get$3 = data => data.dump;
    const augment = (data, original) => ({
      ...derive$1(original),
      ...data.dump
    });
    const SketchBehaviours = {
      field,
      augment,
      get: get$3
    };

    const _placeholder = 'placeholder';
    const adt$3 = Adt.generate([
      {
        single: [
          'required',
          'valueThunk'
        ]
      },
      {
        multiple: [
          'required',
          'valueThunks'
        ]
      }
    ]);
    const isSubstituted = spec => has$2(spec, 'uiType');
    const subPlaceholder = (owner, detail, compSpec, placeholders) => {
      if (owner.exists(o => o !== compSpec.owner)) {
        return adt$3.single(true, constant$1(compSpec));
      }
      return get$g(placeholders, compSpec.name).fold(() => {
        throw new Error('Unknown placeholder component: ' + compSpec.name + '\nKnown: [' + keys(placeholders) + ']\nNamespace: ' + owner.getOr('none') + '\nSpec: ' + JSON.stringify(compSpec, null, 2));
      }, newSpec => newSpec.replace());
    };
    const scan = (owner, detail, compSpec, placeholders) => {
      if (isSubstituted(compSpec) && compSpec.uiType === _placeholder) {
        return subPlaceholder(owner, detail, compSpec, placeholders);
      } else {
        return adt$3.single(false, constant$1(compSpec));
      }
    };
    const substitute = (owner, detail, compSpec, placeholders) => {
      const base = scan(owner, detail, compSpec, placeholders);
      return base.fold((req, valueThunk) => {
        const value = isSubstituted(compSpec) ? valueThunk(detail, compSpec.config, compSpec.validated) : valueThunk(detail);
        const childSpecs = get$g(value, 'components').getOr([]);
        const substituted = bind$3(childSpecs, c => substitute(owner, detail, c, placeholders));
        return [{
            ...value,
            components: substituted
          }];
      }, (req, valuesThunk) => {
        if (isSubstituted(compSpec)) {
          const values = valuesThunk(detail, compSpec.config, compSpec.validated);
          const preprocessor = compSpec.validated.preprocess.getOr(identity);
          return preprocessor(values);
        } else {
          return valuesThunk(detail);
        }
      });
    };
    const substituteAll = (owner, detail, components, placeholders) => bind$3(components, c => substitute(owner, detail, c, placeholders));
    const oneReplace = (label, replacements) => {
      let called = false;
      const used = () => called;
      const replace = () => {
        if (called) {
          throw new Error('Trying to use the same placeholder more than once: ' + label);
        }
        called = true;
        return replacements;
      };
      const required = () => replacements.fold((req, _) => req, (req, _) => req);
      return {
        name: constant$1(label),
        required,
        used,
        replace
      };
    };
    const substitutePlaces = (owner, detail, components, placeholders) => {
      const ps = map$1(placeholders, (ph, name) => oneReplace(name, ph));
      const outcome = substituteAll(owner, detail, components, ps);
      each(ps, p => {
        if (p.used() === false && p.required()) {
          throw new Error('Placeholder: ' + p.name() + ' was not found in components list\nNamespace: ' + owner.getOr('none') + '\nComponents: ' + JSON.stringify(detail.components, null, 2));
        }
      });
      return outcome;
    };
    const single$2 = adt$3.single;
    const multiple = adt$3.multiple;
    const placeholder = constant$1(_placeholder);

    const adt$2 = Adt.generate([
      { required: ['data'] },
      { external: ['data'] },
      { optional: ['data'] },
      { group: ['data'] }
    ]);
    const fFactory = defaulted('factory', { sketch: identity });
    const fSchema = defaulted('schema', []);
    const fName = required$1('name');
    const fPname = field$1('pname', 'pname', defaultedThunk(typeSpec => '<alloy.' + generate$6(typeSpec.name) + '>'), anyValue());
    const fGroupSchema = customField('schema', () => [option$3('preprocess')]);
    const fDefaults = defaulted('defaults', constant$1({}));
    const fOverrides = defaulted('overrides', constant$1({}));
    const requiredSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fPname,
      fDefaults,
      fOverrides
    ]);
    const externalSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fDefaults,
      fOverrides
    ]);
    const optionalSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fPname,
      fDefaults,
      fOverrides
    ]);
    const groupSpec = objOf([
      fFactory,
      fGroupSchema,
      fName,
      required$1('unit'),
      fPname,
      fDefaults,
      fOverrides
    ]);
    const asNamedPart = part => {
      return part.fold(Optional.some, Optional.none, Optional.some, Optional.some);
    };
    const name$2 = part => {
      const get = data => data.name;
      return part.fold(get, get, get, get);
    };
    const asCommon = part => {
      return part.fold(identity, identity, identity, identity);
    };
    const convert = (adtConstructor, partSchema) => spec => {
      const data = asRawOrDie$1('Converting part type', partSchema, spec);
      return adtConstructor(data);
    };
    const required = convert(adt$2.required, requiredSpec);
    const external = convert(adt$2.external, externalSpec);
    const optional = convert(adt$2.optional, optionalSpec);
    const group = convert(adt$2.group, groupSpec);
    const original = constant$1('entirety');

    var PartType = /*#__PURE__*/Object.freeze({
        __proto__: null,
        required: required,
        external: external,
        optional: optional,
        group: group,
        asNamedPart: asNamedPart,
        name: name$2,
        asCommon: asCommon,
        original: original
    });

    const combine = (detail, data, partSpec, partValidated) => deepMerge(data.defaults(detail, partSpec, partValidated), partSpec, { uid: detail.partUids[data.name] }, data.overrides(detail, partSpec, partValidated));
    const subs = (owner, detail, parts) => {
      const internals = {};
      const externals = {};
      each$1(parts, part => {
        part.fold(data => {
          internals[data.pname] = single$2(true, (detail, partSpec, partValidated) => data.factory.sketch(combine(detail, data, partSpec, partValidated)));
        }, data => {
          const partSpec = detail.parts[data.name];
          externals[data.name] = constant$1(data.factory.sketch(combine(detail, data, partSpec[original()]), partSpec));
        }, data => {
          internals[data.pname] = single$2(false, (detail, partSpec, partValidated) => data.factory.sketch(combine(detail, data, partSpec, partValidated)));
        }, data => {
          internals[data.pname] = multiple(true, (detail, _partSpec, _partValidated) => {
            const units = detail[data.name];
            return map$2(units, u => data.factory.sketch(deepMerge(data.defaults(detail, u, _partValidated), u, data.overrides(detail, u))));
          });
        });
      });
      return {
        internals: constant$1(internals),
        externals: constant$1(externals)
      };
    };

    const generate$3 = (owner, parts) => {
      const r = {};
      each$1(parts, part => {
        asNamedPart(part).each(np => {
          const g = doGenerateOne(owner, np.pname);
          r[np.name] = config => {
            const validated = asRawOrDie$1('Part: ' + np.name + ' in ' + owner, objOf(np.schema), config);
            return {
              ...g,
              config,
              validated
            };
          };
        });
      });
      return r;
    };
    const doGenerateOne = (owner, pname) => ({
      uiType: placeholder(),
      owner,
      name: pname
    });
    const generateOne$1 = (owner, pname, config) => ({
      uiType: placeholder(),
      owner,
      name: pname,
      config,
      validated: {}
    });
    const schemas = parts => bind$3(parts, part => part.fold(Optional.none, Optional.some, Optional.none, Optional.none).map(data => requiredObjOf(data.name, data.schema.concat([snapshot(original())]))).toArray());
    const names = parts => map$2(parts, name$2);
    const substitutes = (owner, detail, parts) => subs(owner, detail, parts);
    const components$1 = (owner, detail, internals) => substitutePlaces(Optional.some(owner), detail, detail.components, internals);
    const getPart = (component, detail, partKey) => {
      const uid = detail.partUids[partKey];
      return component.getSystem().getByUid(uid).toOptional();
    };
    const getPartOrDie = (component, detail, partKey) => getPart(component, detail, partKey).getOrDie('Could not find part: ' + partKey);
    const getParts = (component, detail, partKeys) => {
      const r = {};
      const uids = detail.partUids;
      const system = component.getSystem();
      each$1(partKeys, pk => {
        r[pk] = constant$1(system.getByUid(uids[pk]));
      });
      return r;
    };
    const getAllParts = (component, detail) => {
      const system = component.getSystem();
      return map$1(detail.partUids, (pUid, _k) => constant$1(system.getByUid(pUid)));
    };
    const getAllPartNames = detail => keys(detail.partUids);
    const getPartsOrDie = (component, detail, partKeys) => {
      const r = {};
      const uids = detail.partUids;
      const system = component.getSystem();
      each$1(partKeys, pk => {
        r[pk] = constant$1(system.getByUid(uids[pk]).getOrDie());
      });
      return r;
    };
    const defaultUids = (baseUid, partTypes) => {
      const partNames = names(partTypes);
      return wrapAll(map$2(partNames, pn => ({
        key: pn,
        value: baseUid + '-' + pn
      })));
    };
    const defaultUidsSchema = partTypes => field$1('partUids', 'partUids', mergeWithThunk(spec => defaultUids(spec.uid, partTypes)), anyValue());

    var AlloyParts = /*#__PURE__*/Object.freeze({
        __proto__: null,
        generate: generate$3,
        generateOne: generateOne$1,
        schemas: schemas,
        names: names,
        substitutes: substitutes,
        components: components$1,
        defaultUids: defaultUids,
        defaultUidsSchema: defaultUidsSchema,
        getAllParts: getAllParts,
        getAllPartNames: getAllPartNames,
        getPart: getPart,
        getPartOrDie: getPartOrDie,
        getParts: getParts,
        getPartsOrDie: getPartsOrDie
    });

    const base = (partSchemas, partUidsSchemas) => {
      const ps = partSchemas.length > 0 ? [requiredObjOf('parts', partSchemas)] : [];
      return ps.concat([
        required$1('uid'),
        defaulted('dom', {}),
        defaulted('components', []),
        snapshot('originalSpec'),
        defaulted('debug.sketcher', {})
      ]).concat(partUidsSchemas);
    };
    const asRawOrDie = (label, schema, spec, partSchemas, partUidsSchemas) => {
      const baseS = base(partSchemas, partUidsSchemas);
      return asRawOrDie$1(label + ' [SpecSchema]', objOfOnly(baseS.concat(schema)), spec);
    };

    const single$1 = (owner, schema, factory, spec) => {
      const specWithUid = supplyUid(spec);
      const detail = asRawOrDie(owner, schema, specWithUid, [], []);
      return factory(detail, specWithUid);
    };
    const composite$1 = (owner, schema, partTypes, factory, spec) => {
      const specWithUid = supplyUid(spec);
      const partSchemas = schemas(partTypes);
      const partUidsSchema = defaultUidsSchema(partTypes);
      const detail = asRawOrDie(owner, schema, specWithUid, partSchemas, [partUidsSchema]);
      const subs = substitutes(owner, detail, partTypes);
      const components = components$1(owner, detail, subs.internals());
      return factory(detail, components, specWithUid, subs.externals());
    };
    const hasUid = spec => has$2(spec, 'uid');
    const supplyUid = spec => {
      return hasUid(spec) ? spec : {
        ...spec,
        uid: generate$5('uid')
      };
    };

    const isSketchSpec = spec => {
      return spec.uid !== undefined;
    };
    const singleSchema = objOfOnly([
      required$1('name'),
      required$1('factory'),
      required$1('configFields'),
      defaulted('apis', {}),
      defaulted('extraApis', {})
    ]);
    const compositeSchema = objOfOnly([
      required$1('name'),
      required$1('factory'),
      required$1('configFields'),
      required$1('partFields'),
      defaulted('apis', {}),
      defaulted('extraApis', {})
    ]);
    const single = rawConfig => {
      const config = asRawOrDie$1('Sketcher for ' + rawConfig.name, singleSchema, rawConfig);
      const sketch = spec => single$1(config.name, config.configFields, config.factory, spec);
      const apis = map$1(config.apis, makeApi);
      const extraApis = map$1(config.extraApis, (f, k) => markAsExtraApi(f, k));
      return {
        name: config.name,
        configFields: config.configFields,
        sketch,
        ...apis,
        ...extraApis
      };
    };
    const composite = rawConfig => {
      const config = asRawOrDie$1('Sketcher for ' + rawConfig.name, compositeSchema, rawConfig);
      const sketch = spec => composite$1(config.name, config.configFields, config.partFields, config.factory, spec);
      const parts = generate$3(config.name, config.partFields);
      const apis = map$1(config.apis, makeApi);
      const extraApis = map$1(config.extraApis, (f, k) => markAsExtraApi(f, k));
      return {
        name: config.name,
        partFields: config.partFields,
        configFields: config.configFields,
        sketch,
        parts,
        ...apis,
        ...extraApis
      };
    };

    const inside = target => isTag('input')(target) && get$f(target, 'type') !== 'radio' || isTag('textarea')(target);

    const getCurrent = (component, composeConfig, _composeState) => composeConfig.find(component);

    var ComposeApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getCurrent: getCurrent
    });

    const ComposeSchema = [required$1('find')];

    const Composing = create$4({
      fields: ComposeSchema,
      name: 'composing',
      apis: ComposeApis
    });

    const nativeDisabled = [
      'input',
      'button',
      'textarea',
      'select'
    ];
    const onLoad$1 = (component, disableConfig, disableState) => {
      const f = disableConfig.disabled() ? disable : enable;
      f(component, disableConfig);
    };
    const hasNative = (component, config) => config.useNative === true && contains$2(nativeDisabled, name$3(component.element));
    const nativeIsDisabled = component => has$1(component.element, 'disabled');
    const nativeDisable = component => {
      set$9(component.element, 'disabled', 'disabled');
    };
    const nativeEnable = component => {
      remove$7(component.element, 'disabled');
    };
    const ariaIsDisabled = component => get$f(component.element, 'aria-disabled') === 'true';
    const ariaDisable = component => {
      set$9(component.element, 'aria-disabled', 'true');
    };
    const ariaEnable = component => {
      set$9(component.element, 'aria-disabled', 'false');
    };
    const disable = (component, disableConfig, _disableState) => {
      disableConfig.disableClass.each(disableClass => {
        add$2(component.element, disableClass);
      });
      const f = hasNative(component, disableConfig) ? nativeDisable : ariaDisable;
      f(component);
      disableConfig.onDisabled(component);
    };
    const enable = (component, disableConfig, _disableState) => {
      disableConfig.disableClass.each(disableClass => {
        remove$2(component.element, disableClass);
      });
      const f = hasNative(component, disableConfig) ? nativeEnable : ariaEnable;
      f(component);
      disableConfig.onEnabled(component);
    };
    const isDisabled = (component, disableConfig) => hasNative(component, disableConfig) ? nativeIsDisabled(component) : ariaIsDisabled(component);
    const set$4 = (component, disableConfig, disableState, disabled) => {
      const f = disabled ? disable : enable;
      f(component, disableConfig);
    };

    var DisableApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        enable: enable,
        disable: disable,
        isDisabled: isDisabled,
        onLoad: onLoad$1,
        set: set$4
    });

    const exhibit$5 = (base, disableConfig) => nu$7({ classes: disableConfig.disabled() ? disableConfig.disableClass.toArray() : [] });
    const events$e = (disableConfig, disableState) => derive$2([
      abort(execute$5(), (component, _simulatedEvent) => isDisabled(component, disableConfig)),
      loadEvent(disableConfig, disableState, onLoad$1)
    ]);

    var ActiveDisable = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$5,
        events: events$e
    });

    var DisableSchema = [
      defaultedFunction('disabled', never),
      defaulted('useNative', true),
      option$3('disableClass'),
      onHandler('onDisabled'),
      onHandler('onEnabled')
    ];

    const Disabling = create$4({
      fields: DisableSchema,
      name: 'disabling',
      active: ActiveDisable,
      apis: DisableApis
    });

    const dehighlightAllExcept = (component, hConfig, hState, skip) => {
      const highlighted = descendants(component.element, '.' + hConfig.highlightClass);
      each$1(highlighted, h => {
        const shouldSkip = exists(skip, skipComp => eq(skipComp.element, h));
        if (!shouldSkip) {
          remove$2(h, hConfig.highlightClass);
          component.getSystem().getByDom(h).each(target => {
            hConfig.onDehighlight(component, target);
            emit(target, dehighlight$1());
          });
        }
      });
    };
    const dehighlightAll = (component, hConfig, hState) => dehighlightAllExcept(component, hConfig, hState, []);
    const dehighlight = (component, hConfig, hState, target) => {
      if (isHighlighted(component, hConfig, hState, target)) {
        remove$2(target.element, hConfig.highlightClass);
        hConfig.onDehighlight(component, target);
        emit(target, dehighlight$1());
      }
    };
    const highlight = (component, hConfig, hState, target) => {
      dehighlightAllExcept(component, hConfig, hState, [target]);
      if (!isHighlighted(component, hConfig, hState, target)) {
        add$2(target.element, hConfig.highlightClass);
        hConfig.onHighlight(component, target);
        emit(target, highlight$1());
      }
    };
    const highlightFirst = (component, hConfig, hState) => {
      getFirst(component, hConfig).each(firstComp => {
        highlight(component, hConfig, hState, firstComp);
      });
    };
    const highlightLast = (component, hConfig, hState) => {
      getLast(component, hConfig).each(lastComp => {
        highlight(component, hConfig, hState, lastComp);
      });
    };
    const highlightAt = (component, hConfig, hState, index) => {
      getByIndex(component, hConfig, hState, index).fold(err => {
        throw err;
      }, firstComp => {
        highlight(component, hConfig, hState, firstComp);
      });
    };
    const highlightBy = (component, hConfig, hState, predicate) => {
      const candidates = getCandidates(component, hConfig);
      const targetComp = find$5(candidates, predicate);
      targetComp.each(c => {
        highlight(component, hConfig, hState, c);
      });
    };
    const isHighlighted = (component, hConfig, hState, queryTarget) => has(queryTarget.element, hConfig.highlightClass);
    const getHighlighted = (component, hConfig, _hState) => descendant(component.element, '.' + hConfig.highlightClass).bind(e => component.getSystem().getByDom(e).toOptional());
    const getByIndex = (component, hConfig, hState, index) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      return Optional.from(items[index]).fold(() => Result.error(new Error('No element found with index ' + index)), component.getSystem().getByDom);
    };
    const getFirst = (component, hConfig, _hState) => descendant(component.element, '.' + hConfig.itemClass).bind(e => component.getSystem().getByDom(e).toOptional());
    const getLast = (component, hConfig, _hState) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      const last = items.length > 0 ? Optional.some(items[items.length - 1]) : Optional.none();
      return last.bind(c => component.getSystem().getByDom(c).toOptional());
    };
    const getDelta$2 = (component, hConfig, hState, delta) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      const current = findIndex$1(items, item => has(item, hConfig.highlightClass));
      return current.bind(selected => {
        const dest = cycleBy(selected, delta, 0, items.length - 1);
        return component.getSystem().getByDom(items[dest]).toOptional();
      });
    };
    const getPrevious = (component, hConfig, hState) => getDelta$2(component, hConfig, hState, -1);
    const getNext = (component, hConfig, hState) => getDelta$2(component, hConfig, hState, +1);
    const getCandidates = (component, hConfig, _hState) => {
      const items = descendants(component.element, '.' + hConfig.itemClass);
      return cat(map$2(items, i => component.getSystem().getByDom(i).toOptional()));
    };

    var HighlightApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dehighlightAll: dehighlightAll,
        dehighlight: dehighlight,
        highlight: highlight,
        highlightFirst: highlightFirst,
        highlightLast: highlightLast,
        highlightAt: highlightAt,
        highlightBy: highlightBy,
        isHighlighted: isHighlighted,
        getHighlighted: getHighlighted,
        getFirst: getFirst,
        getLast: getLast,
        getPrevious: getPrevious,
        getNext: getNext,
        getCandidates: getCandidates
    });

    var HighlightSchema = [
      required$1('highlightClass'),
      required$1('itemClass'),
      onHandler('onHighlight'),
      onHandler('onDehighlight')
    ];

    const Highlighting = create$4({
      fields: HighlightSchema,
      name: 'highlighting',
      apis: HighlightApis
    });

    const BACKSPACE = [8];
    const TAB = [9];
    const ENTER = [13];
    const ESCAPE = [27];
    const SPACE = [32];
    const LEFT = [37];
    const UP = [38];
    const RIGHT = [39];
    const DOWN = [40];

    const cyclePrev = (values, index, predicate) => {
      const before = reverse(values.slice(0, index));
      const after = reverse(values.slice(index + 1));
      return find$5(before.concat(after), predicate);
    };
    const tryPrev = (values, index, predicate) => {
      const before = reverse(values.slice(0, index));
      return find$5(before, predicate);
    };
    const cycleNext = (values, index, predicate) => {
      const before = values.slice(0, index);
      const after = values.slice(index + 1);
      return find$5(after.concat(before), predicate);
    };
    const tryNext = (values, index, predicate) => {
      const after = values.slice(index + 1);
      return find$5(after, predicate);
    };

    const inSet = keys => event => {
      const raw = event.raw;
      return contains$2(keys, raw.which);
    };
    const and = preds => event => forall(preds, pred => pred(event));
    const isShift = event => {
      const raw = event.raw;
      return raw.shiftKey === true;
    };
    const isControl = event => {
      const raw = event.raw;
      return raw.ctrlKey === true;
    };
    const isNotShift = not(isShift);

    const rule = (matches, action) => ({
      matches,
      classification: action
    });
    const choose = (transitions, event) => {
      const transition = find$5(transitions, t => t.matches(event));
      return transition.map(t => t.classification);
    };

    const reportFocusShifting = (component, prevFocus, newFocus) => {
      const noChange = prevFocus.exists(p => newFocus.exists(n => eq(n, p)));
      if (!noChange) {
        emitWith(component, focusShifted(), {
          prevFocus,
          newFocus
        });
      }
    };
    const dom$2 = () => {
      const get = component => search(component.element);
      const set = (component, focusee) => {
        const prevFocus = get(component);
        component.getSystem().triggerFocus(focusee, component.element);
        const newFocus = get(component);
        reportFocusShifting(component, prevFocus, newFocus);
      };
      return {
        get,
        set
      };
    };
    const highlights = () => {
      const get = component => Highlighting.getHighlighted(component).map(item => item.element);
      const set = (component, element) => {
        const prevFocus = get(component);
        component.getSystem().getByDom(element).fold(noop, item => {
          Highlighting.highlight(component, item);
        });
        const newFocus = get(component);
        reportFocusShifting(component, prevFocus, newFocus);
      };
      return {
        get,
        set
      };
    };

    var FocusInsideModes;
    (function (FocusInsideModes) {
      FocusInsideModes['OnFocusMode'] = 'onFocus';
      FocusInsideModes['OnEnterOrSpaceMode'] = 'onEnterOrSpace';
      FocusInsideModes['OnApiMode'] = 'onApi';
    }(FocusInsideModes || (FocusInsideModes = {})));

    const typical = (infoSchema, stateInit, getKeydownRules, getKeyupRules, optFocusIn) => {
      const schema = () => infoSchema.concat([
        defaulted('focusManager', dom$2()),
        defaultedOf('focusInside', 'onFocus', valueOf(val => contains$2([
          'onFocus',
          'onEnterOrSpace',
          'onApi'
        ], val) ? Result.value(val) : Result.error('Invalid value for focusInside'))),
        output$1('handler', me),
        output$1('state', stateInit),
        output$1('sendFocusIn', optFocusIn)
      ]);
      const processKey = (component, simulatedEvent, getRules, keyingConfig, keyingState) => {
        const rules = getRules(component, simulatedEvent, keyingConfig, keyingState);
        return choose(rules, simulatedEvent.event).bind(rule => rule(component, simulatedEvent, keyingConfig, keyingState));
      };
      const toEvents = (keyingConfig, keyingState) => {
        const onFocusHandler = keyingConfig.focusInside !== FocusInsideModes.OnFocusMode ? Optional.none() : optFocusIn(keyingConfig).map(focusIn => run$1(focus$4(), (component, simulatedEvent) => {
          focusIn(component, keyingConfig, keyingState);
          simulatedEvent.stop();
        }));
        const tryGoInsideComponent = (component, simulatedEvent) => {
          const isEnterOrSpace = inSet(SPACE.concat(ENTER))(simulatedEvent.event);
          if (keyingConfig.focusInside === FocusInsideModes.OnEnterOrSpaceMode && isEnterOrSpace && isSource(component, simulatedEvent)) {
            optFocusIn(keyingConfig).each(focusIn => {
              focusIn(component, keyingConfig, keyingState);
              simulatedEvent.stop();
            });
          }
        };
        const keyboardEvents = [
          run$1(keydown(), (component, simulatedEvent) => {
            processKey(component, simulatedEvent, getKeydownRules, keyingConfig, keyingState).fold(() => {
              tryGoInsideComponent(component, simulatedEvent);
            }, _ => {
              simulatedEvent.stop();
            });
          }),
          run$1(keyup(), (component, simulatedEvent) => {
            processKey(component, simulatedEvent, getKeyupRules, keyingConfig, keyingState).each(_ => {
              simulatedEvent.stop();
            });
          })
        ];
        return derive$2(onFocusHandler.toArray().concat(keyboardEvents));
      };
      const me = {
        schema,
        processKey,
        toEvents
      };
      return me;
    };

    const create$2 = cyclicField => {
      const schema = [
        option$3('onEscape'),
        option$3('onEnter'),
        defaulted('selector', '[data-alloy-tabstop="true"]:not(:disabled)'),
        defaulted('firstTabstop', 0),
        defaulted('useTabstopAt', always),
        option$3('visibilitySelector')
      ].concat([cyclicField]);
      const isVisible = (tabbingConfig, element) => {
        const target = tabbingConfig.visibilitySelector.bind(sel => closest$1(element, sel)).getOr(element);
        return get$d(target) > 0;
      };
      const findInitial = (component, tabbingConfig) => {
        const tabstops = descendants(component.element, tabbingConfig.selector);
        const visibles = filter$2(tabstops, elem => isVisible(tabbingConfig, elem));
        return Optional.from(visibles[tabbingConfig.firstTabstop]);
      };
      const findCurrent = (component, tabbingConfig) => tabbingConfig.focusManager.get(component).bind(elem => closest$1(elem, tabbingConfig.selector));
      const isTabstop = (tabbingConfig, element) => isVisible(tabbingConfig, element) && tabbingConfig.useTabstopAt(element);
      const focusIn = (component, tabbingConfig, _tabbingState) => {
        findInitial(component, tabbingConfig).each(target => {
          tabbingConfig.focusManager.set(component, target);
        });
      };
      const goFromTabstop = (component, tabstops, stopIndex, tabbingConfig, cycle) => cycle(tabstops, stopIndex, elem => isTabstop(tabbingConfig, elem)).fold(() => tabbingConfig.cyclic ? Optional.some(true) : Optional.none(), target => {
        tabbingConfig.focusManager.set(component, target);
        return Optional.some(true);
      });
      const go = (component, _simulatedEvent, tabbingConfig, cycle) => {
        const tabstops = descendants(component.element, tabbingConfig.selector);
        return findCurrent(component, tabbingConfig).bind(tabstop => {
          const optStopIndex = findIndex$1(tabstops, curry(eq, tabstop));
          return optStopIndex.bind(stopIndex => goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle));
        });
      };
      const goBackwards = (component, simulatedEvent, tabbingConfig) => {
        const navigate = tabbingConfig.cyclic ? cyclePrev : tryPrev;
        return go(component, simulatedEvent, tabbingConfig, navigate);
      };
      const goForwards = (component, simulatedEvent, tabbingConfig) => {
        const navigate = tabbingConfig.cyclic ? cycleNext : tryNext;
        return go(component, simulatedEvent, tabbingConfig, navigate);
      };
      const execute = (component, simulatedEvent, tabbingConfig) => tabbingConfig.onEnter.bind(f => f(component, simulatedEvent));
      const exit = (component, simulatedEvent, tabbingConfig) => tabbingConfig.onEscape.bind(f => f(component, simulatedEvent));
      const getKeydownRules = constant$1([
        rule(and([
          isShift,
          inSet(TAB)
        ]), goBackwards),
        rule(inSet(TAB), goForwards),
        rule(and([
          isNotShift,
          inSet(ENTER)
        ]), execute)
      ]);
      const getKeyupRules = constant$1([rule(inSet(ESCAPE), exit)]);
      return typical(schema, NoState.init, getKeydownRules, getKeyupRules, () => Optional.some(focusIn));
    };

    var AcyclicType = create$2(customField('cyclic', never));

    var CyclicType = create$2(customField('cyclic', always));

    const doDefaultExecute = (component, _simulatedEvent, focused) => {
      dispatch(component, focused, execute$5());
      return Optional.some(true);
    };
    const defaultExecute = (component, simulatedEvent, focused) => {
      const isComplex = inside(focused) && inSet(SPACE)(simulatedEvent.event);
      return isComplex ? Optional.none() : doDefaultExecute(component, simulatedEvent, focused);
    };
    const stopEventForFirefox = (_component, _simulatedEvent) => Optional.some(true);

    const schema$v = [
      defaulted('execute', defaultExecute),
      defaulted('useSpace', false),
      defaulted('useEnter', true),
      defaulted('useControlEnter', false),
      defaulted('useDown', false)
    ];
    const execute$4 = (component, simulatedEvent, executeConfig) => executeConfig.execute(component, simulatedEvent, component.element);
    const getKeydownRules$5 = (component, _simulatedEvent, executeConfig, _executeState) => {
      const spaceExec = executeConfig.useSpace && !inside(component.element) ? SPACE : [];
      const enterExec = executeConfig.useEnter ? ENTER : [];
      const downExec = executeConfig.useDown ? DOWN : [];
      const execKeys = spaceExec.concat(enterExec).concat(downExec);
      return [rule(inSet(execKeys), execute$4)].concat(executeConfig.useControlEnter ? [rule(and([
          isControl,
          inSet(ENTER)
        ]), execute$4)] : []);
    };
    const getKeyupRules$5 = (component, _simulatedEvent, executeConfig, _executeState) => executeConfig.useSpace && !inside(component.element) ? [rule(inSet(SPACE), stopEventForFirefox)] : [];
    var ExecutionType = typical(schema$v, NoState.init, getKeydownRules$5, getKeyupRules$5, () => Optional.none());

    const flatgrid$1 = () => {
      const dimensions = value$2();
      const setGridSize = (numRows, numColumns) => {
        dimensions.set({
          numRows,
          numColumns
        });
      };
      const getNumRows = () => dimensions.get().map(d => d.numRows);
      const getNumColumns = () => dimensions.get().map(d => d.numColumns);
      return nu$8({
        readState: () => dimensions.get().map(d => ({
          numRows: String(d.numRows),
          numColumns: String(d.numColumns)
        })).getOr({
          numRows: '?',
          numColumns: '?'
        }),
        setGridSize,
        getNumRows,
        getNumColumns
      });
    };
    const init$d = spec => spec.state(spec);

    var KeyingState = /*#__PURE__*/Object.freeze({
        __proto__: null,
        flatgrid: flatgrid$1,
        init: init$d
    });

    const useH = movement => (component, simulatedEvent, config, state) => {
      const move = movement(component.element);
      return use(move, component, simulatedEvent, config, state);
    };
    const west$1 = (moveLeft, moveRight) => {
      const movement = onDirection(moveLeft, moveRight);
      return useH(movement);
    };
    const east$1 = (moveLeft, moveRight) => {
      const movement = onDirection(moveRight, moveLeft);
      return useH(movement);
    };
    const useV = move => (component, simulatedEvent, config, state) => use(move, component, simulatedEvent, config, state);
    const use = (move, component, simulatedEvent, config, state) => {
      const outcome = config.focusManager.get(component).bind(focused => move(component.element, focused, config, state));
      return outcome.map(newFocus => {
        config.focusManager.set(component, newFocus);
        return true;
      });
    };
    const north$1 = useV;
    const south$1 = useV;
    const move$1 = useV;

    const isHidden$1 = dom => dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
    const isVisible = element => !isHidden$1(element.dom);

    const locate = (candidates, predicate) => findIndex$1(candidates, predicate).map(index => ({
      index,
      candidates
    }));

    const locateVisible = (container, current, selector) => {
      const predicate = x => eq(x, current);
      const candidates = descendants(container, selector);
      const visible = filter$2(candidates, isVisible);
      return locate(visible, predicate);
    };
    const findIndex = (elements, target) => findIndex$1(elements, elem => eq(target, elem));

    const withGrid = (values, index, numCols, f) => {
      const oldRow = Math.floor(index / numCols);
      const oldColumn = index % numCols;
      return f(oldRow, oldColumn).bind(address => {
        const newIndex = address.row * numCols + address.column;
        return newIndex >= 0 && newIndex < values.length ? Optional.some(values[newIndex]) : Optional.none();
      });
    };
    const cycleHorizontal$1 = (values, index, numRows, numCols, delta) => withGrid(values, index, numCols, (oldRow, oldColumn) => {
      const onLastRow = oldRow === numRows - 1;
      const colsInRow = onLastRow ? values.length - oldRow * numCols : numCols;
      const newColumn = cycleBy(oldColumn, delta, 0, colsInRow - 1);
      return Optional.some({
        row: oldRow,
        column: newColumn
      });
    });
    const cycleVertical$1 = (values, index, numRows, numCols, delta) => withGrid(values, index, numCols, (oldRow, oldColumn) => {
      const newRow = cycleBy(oldRow, delta, 0, numRows - 1);
      const onLastRow = newRow === numRows - 1;
      const colsInRow = onLastRow ? values.length - newRow * numCols : numCols;
      const newCol = clamp(oldColumn, 0, colsInRow - 1);
      return Optional.some({
        row: newRow,
        column: newCol
      });
    });
    const cycleRight$1 = (values, index, numRows, numCols) => cycleHorizontal$1(values, index, numRows, numCols, +1);
    const cycleLeft$1 = (values, index, numRows, numCols) => cycleHorizontal$1(values, index, numRows, numCols, -1);
    const cycleUp$1 = (values, index, numRows, numCols) => cycleVertical$1(values, index, numRows, numCols, -1);
    const cycleDown$1 = (values, index, numRows, numCols) => cycleVertical$1(values, index, numRows, numCols, +1);

    const schema$u = [
      required$1('selector'),
      defaulted('execute', defaultExecute),
      onKeyboardHandler('onEscape'),
      defaulted('captureTab', false),
      initSize()
    ];
    const focusIn$3 = (component, gridConfig, _gridState) => {
      descendant(component.element, gridConfig.selector).each(first => {
        gridConfig.focusManager.set(component, first);
      });
    };
    const findCurrent$1 = (component, gridConfig) => gridConfig.focusManager.get(component).bind(elem => closest$1(elem, gridConfig.selector));
    const execute$3 = (component, simulatedEvent, gridConfig, _gridState) => findCurrent$1(component, gridConfig).bind(focused => gridConfig.execute(component, simulatedEvent, focused));
    const doMove$2 = cycle => (element, focused, gridConfig, gridState) => locateVisible(element, focused, gridConfig.selector).bind(identified => cycle(identified.candidates, identified.index, gridState.getNumRows().getOr(gridConfig.initSize.numRows), gridState.getNumColumns().getOr(gridConfig.initSize.numColumns)));
    const handleTab = (_component, _simulatedEvent, gridConfig) => gridConfig.captureTab ? Optional.some(true) : Optional.none();
    const doEscape$1 = (component, simulatedEvent, gridConfig) => gridConfig.onEscape(component, simulatedEvent);
    const moveLeft$3 = doMove$2(cycleLeft$1);
    const moveRight$3 = doMove$2(cycleRight$1);
    const moveNorth$1 = doMove$2(cycleUp$1);
    const moveSouth$1 = doMove$2(cycleDown$1);
    const getKeydownRules$4 = constant$1([
      rule(inSet(LEFT), west$1(moveLeft$3, moveRight$3)),
      rule(inSet(RIGHT), east$1(moveLeft$3, moveRight$3)),
      rule(inSet(UP), north$1(moveNorth$1)),
      rule(inSet(DOWN), south$1(moveSouth$1)),
      rule(and([
        isShift,
        inSet(TAB)
      ]), handleTab),
      rule(and([
        isNotShift,
        inSet(TAB)
      ]), handleTab),
      rule(inSet(SPACE.concat(ENTER)), execute$3)
    ]);
    const getKeyupRules$4 = constant$1([
      rule(inSet(ESCAPE), doEscape$1),
      rule(inSet(SPACE), stopEventForFirefox)
    ]);
    var FlatgridType = typical(schema$u, flatgrid$1, getKeydownRules$4, getKeyupRules$4, () => Optional.some(focusIn$3));

    const f = (container, selector, current, delta, getNewIndex) => {
      const isDisabledButton = candidate => name$3(candidate) === 'button' && get$f(candidate, 'disabled') === 'disabled';
      const tryNewIndex = (initial, index, candidates) => getNewIndex(initial, index, delta, 0, candidates.length - 1, candidates[index], newIndex => isDisabledButton(candidates[newIndex]) ? tryNewIndex(initial, newIndex, candidates) : Optional.from(candidates[newIndex]));
      return locateVisible(container, current, selector).bind(identified => {
        const index = identified.index;
        const candidates = identified.candidates;
        return tryNewIndex(index, index, candidates);
      });
    };
    const horizontalWithoutCycles = (container, selector, current, delta) => f(container, selector, current, delta, (prevIndex, v, d, min, max, oldCandidate, onNewIndex) => {
      const newIndex = clamp(v + d, min, max);
      return newIndex === prevIndex ? Optional.from(oldCandidate) : onNewIndex(newIndex);
    });
    const horizontal = (container, selector, current, delta) => f(container, selector, current, delta, (prevIndex, v, d, min, max, _oldCandidate, onNewIndex) => {
      const newIndex = cycleBy(v, d, min, max);
      return newIndex === prevIndex ? Optional.none() : onNewIndex(newIndex);
    });

    const schema$t = [
      required$1('selector'),
      defaulted('getInitial', Optional.none),
      defaulted('execute', defaultExecute),
      onKeyboardHandler('onEscape'),
      defaulted('executeOnMove', false),
      defaulted('allowVertical', true),
      defaulted('allowHorizontal', true),
      defaulted('cycles', true)
    ];
    const findCurrent = (component, flowConfig) => flowConfig.focusManager.get(component).bind(elem => closest$1(elem, flowConfig.selector));
    const execute$2 = (component, simulatedEvent, flowConfig) => findCurrent(component, flowConfig).bind(focused => flowConfig.execute(component, simulatedEvent, focused));
    const focusIn$2 = (component, flowConfig, _state) => {
      flowConfig.getInitial(component).orThunk(() => descendant(component.element, flowConfig.selector)).each(first => {
        flowConfig.focusManager.set(component, first);
      });
    };
    const moveLeft$2 = (element, focused, info) => (info.cycles ? horizontal : horizontalWithoutCycles)(element, info.selector, focused, -1);
    const moveRight$2 = (element, focused, info) => (info.cycles ? horizontal : horizontalWithoutCycles)(element, info.selector, focused, +1);
    const doMove$1 = movement => (component, simulatedEvent, flowConfig, flowState) => movement(component, simulatedEvent, flowConfig, flowState).bind(() => flowConfig.executeOnMove ? execute$2(component, simulatedEvent, flowConfig) : Optional.some(true));
    const doEscape = (component, simulatedEvent, flowConfig) => flowConfig.onEscape(component, simulatedEvent);
    const getKeydownRules$3 = (_component, _se, flowConfig, _flowState) => {
      const westMovers = [...flowConfig.allowHorizontal ? LEFT : []].concat(flowConfig.allowVertical ? UP : []);
      const eastMovers = [...flowConfig.allowHorizontal ? RIGHT : []].concat(flowConfig.allowVertical ? DOWN : []);
      return [
        rule(inSet(westMovers), doMove$1(west$1(moveLeft$2, moveRight$2))),
        rule(inSet(eastMovers), doMove$1(east$1(moveLeft$2, moveRight$2))),
        rule(inSet(ENTER), execute$2),
        rule(inSet(SPACE), execute$2)
      ];
    };
    const getKeyupRules$3 = constant$1([
      rule(inSet(SPACE), stopEventForFirefox),
      rule(inSet(ESCAPE), doEscape)
    ]);
    var FlowType = typical(schema$t, NoState.init, getKeydownRules$3, getKeyupRules$3, () => Optional.some(focusIn$2));

    const toCell = (matrix, rowIndex, columnIndex) => Optional.from(matrix[rowIndex]).bind(row => Optional.from(row[columnIndex]).map(cell => ({
      rowIndex,
      columnIndex,
      cell
    })));
    const cycleHorizontal = (matrix, rowIndex, startCol, deltaCol) => {
      const row = matrix[rowIndex];
      const colsInRow = row.length;
      const newColIndex = cycleBy(startCol, deltaCol, 0, colsInRow - 1);
      return toCell(matrix, rowIndex, newColIndex);
    };
    const cycleVertical = (matrix, colIndex, startRow, deltaRow) => {
      const nextRowIndex = cycleBy(startRow, deltaRow, 0, matrix.length - 1);
      const colsInNextRow = matrix[nextRowIndex].length;
      const nextColIndex = clamp(colIndex, 0, colsInNextRow - 1);
      return toCell(matrix, nextRowIndex, nextColIndex);
    };
    const moveHorizontal = (matrix, rowIndex, startCol, deltaCol) => {
      const row = matrix[rowIndex];
      const colsInRow = row.length;
      const newColIndex = clamp(startCol + deltaCol, 0, colsInRow - 1);
      return toCell(matrix, rowIndex, newColIndex);
    };
    const moveVertical = (matrix, colIndex, startRow, deltaRow) => {
      const nextRowIndex = clamp(startRow + deltaRow, 0, matrix.length - 1);
      const colsInNextRow = matrix[nextRowIndex].length;
      const nextColIndex = clamp(colIndex, 0, colsInNextRow - 1);
      return toCell(matrix, nextRowIndex, nextColIndex);
    };
    const cycleRight = (matrix, startRow, startCol) => cycleHorizontal(matrix, startRow, startCol, +1);
    const cycleLeft = (matrix, startRow, startCol) => cycleHorizontal(matrix, startRow, startCol, -1);
    const cycleUp = (matrix, startRow, startCol) => cycleVertical(matrix, startCol, startRow, -1);
    const cycleDown = (matrix, startRow, startCol) => cycleVertical(matrix, startCol, startRow, +1);
    const moveLeft$1 = (matrix, startRow, startCol) => moveHorizontal(matrix, startRow, startCol, -1);
    const moveRight$1 = (matrix, startRow, startCol) => moveHorizontal(matrix, startRow, startCol, +1);
    const moveUp$1 = (matrix, startRow, startCol) => moveVertical(matrix, startCol, startRow, -1);
    const moveDown$1 = (matrix, startRow, startCol) => moveVertical(matrix, startCol, startRow, +1);

    const schema$s = [
      requiredObjOf('selectors', [
        required$1('row'),
        required$1('cell')
      ]),
      defaulted('cycles', true),
      defaulted('previousSelector', Optional.none),
      defaulted('execute', defaultExecute)
    ];
    const focusIn$1 = (component, matrixConfig, _state) => {
      const focused = matrixConfig.previousSelector(component).orThunk(() => {
        const selectors = matrixConfig.selectors;
        return descendant(component.element, selectors.cell);
      });
      focused.each(cell => {
        matrixConfig.focusManager.set(component, cell);
      });
    };
    const execute$1 = (component, simulatedEvent, matrixConfig) => search(component.element).bind(focused => matrixConfig.execute(component, simulatedEvent, focused));
    const toMatrix = (rows, matrixConfig) => map$2(rows, row => descendants(row, matrixConfig.selectors.cell));
    const doMove = (ifCycle, ifMove) => (element, focused, matrixConfig) => {
      const move = matrixConfig.cycles ? ifCycle : ifMove;
      return closest$1(focused, matrixConfig.selectors.row).bind(inRow => {
        const cellsInRow = descendants(inRow, matrixConfig.selectors.cell);
        return findIndex(cellsInRow, focused).bind(colIndex => {
          const allRows = descendants(element, matrixConfig.selectors.row);
          return findIndex(allRows, inRow).bind(rowIndex => {
            const matrix = toMatrix(allRows, matrixConfig);
            return move(matrix, rowIndex, colIndex).map(next => next.cell);
          });
        });
      });
    };
    const moveLeft = doMove(cycleLeft, moveLeft$1);
    const moveRight = doMove(cycleRight, moveRight$1);
    const moveNorth = doMove(cycleUp, moveUp$1);
    const moveSouth = doMove(cycleDown, moveDown$1);
    const getKeydownRules$2 = constant$1([
      rule(inSet(LEFT), west$1(moveLeft, moveRight)),
      rule(inSet(RIGHT), east$1(moveLeft, moveRight)),
      rule(inSet(UP), north$1(moveNorth)),
      rule(inSet(DOWN), south$1(moveSouth)),
      rule(inSet(SPACE.concat(ENTER)), execute$1)
    ]);
    const getKeyupRules$2 = constant$1([rule(inSet(SPACE), stopEventForFirefox)]);
    var MatrixType = typical(schema$s, NoState.init, getKeydownRules$2, getKeyupRules$2, () => Optional.some(focusIn$1));

    const schema$r = [
      required$1('selector'),
      defaulted('execute', defaultExecute),
      defaulted('moveOnTab', false)
    ];
    const execute = (component, simulatedEvent, menuConfig) => menuConfig.focusManager.get(component).bind(focused => menuConfig.execute(component, simulatedEvent, focused));
    const focusIn = (component, menuConfig, _state) => {
      descendant(component.element, menuConfig.selector).each(first => {
        menuConfig.focusManager.set(component, first);
      });
    };
    const moveUp = (element, focused, info) => horizontal(element, info.selector, focused, -1);
    const moveDown = (element, focused, info) => horizontal(element, info.selector, focused, +1);
    const fireShiftTab = (component, simulatedEvent, menuConfig, menuState) => menuConfig.moveOnTab ? move$1(moveUp)(component, simulatedEvent, menuConfig, menuState) : Optional.none();
    const fireTab = (component, simulatedEvent, menuConfig, menuState) => menuConfig.moveOnTab ? move$1(moveDown)(component, simulatedEvent, menuConfig, menuState) : Optional.none();
    const getKeydownRules$1 = constant$1([
      rule(inSet(UP), move$1(moveUp)),
      rule(inSet(DOWN), move$1(moveDown)),
      rule(and([
        isShift,
        inSet(TAB)
      ]), fireShiftTab),
      rule(and([
        isNotShift,
        inSet(TAB)
      ]), fireTab),
      rule(inSet(ENTER), execute),
      rule(inSet(SPACE), execute)
    ]);
    const getKeyupRules$1 = constant$1([rule(inSet(SPACE), stopEventForFirefox)]);
    var MenuType = typical(schema$r, NoState.init, getKeydownRules$1, getKeyupRules$1, () => Optional.some(focusIn));

    const schema$q = [
      onKeyboardHandler('onSpace'),
      onKeyboardHandler('onEnter'),
      onKeyboardHandler('onShiftEnter'),
      onKeyboardHandler('onLeft'),
      onKeyboardHandler('onRight'),
      onKeyboardHandler('onTab'),
      onKeyboardHandler('onShiftTab'),
      onKeyboardHandler('onUp'),
      onKeyboardHandler('onDown'),
      onKeyboardHandler('onEscape'),
      defaulted('stopSpaceKeyup', false),
      option$3('focusIn')
    ];
    const getKeydownRules = (component, simulatedEvent, specialInfo) => [
      rule(inSet(SPACE), specialInfo.onSpace),
      rule(and([
        isNotShift,
        inSet(ENTER)
      ]), specialInfo.onEnter),
      rule(and([
        isShift,
        inSet(ENTER)
      ]), specialInfo.onShiftEnter),
      rule(and([
        isShift,
        inSet(TAB)
      ]), specialInfo.onShiftTab),
      rule(and([
        isNotShift,
        inSet(TAB)
      ]), specialInfo.onTab),
      rule(inSet(UP), specialInfo.onUp),
      rule(inSet(DOWN), specialInfo.onDown),
      rule(inSet(LEFT), specialInfo.onLeft),
      rule(inSet(RIGHT), specialInfo.onRight),
      rule(inSet(SPACE), specialInfo.onSpace)
    ];
    const getKeyupRules = (component, simulatedEvent, specialInfo) => [
      ...specialInfo.stopSpaceKeyup ? [rule(inSet(SPACE), stopEventForFirefox)] : [],
      rule(inSet(ESCAPE), specialInfo.onEscape)
    ];
    var SpecialType = typical(schema$q, NoState.init, getKeydownRules, getKeyupRules, specialInfo => specialInfo.focusIn);

    const acyclic = AcyclicType.schema();
    const cyclic = CyclicType.schema();
    const flow = FlowType.schema();
    const flatgrid = FlatgridType.schema();
    const matrix = MatrixType.schema();
    const execution = ExecutionType.schema();
    const menu = MenuType.schema();
    const special = SpecialType.schema();

    var KeyboardBranches = /*#__PURE__*/Object.freeze({
        __proto__: null,
        acyclic: acyclic,
        cyclic: cyclic,
        flow: flow,
        flatgrid: flatgrid,
        matrix: matrix,
        execution: execution,
        menu: menu,
        special: special
    });

    const isFlatgridState = keyState => hasNonNullableKey(keyState, 'setGridSize');
    const Keying = createModes({
      branchKey: 'mode',
      branches: KeyboardBranches,
      name: 'keying',
      active: {
        events: (keyingConfig, keyingState) => {
          const handler = keyingConfig.handler;
          return handler.toEvents(keyingConfig, keyingState);
        }
      },
      apis: {
        focusIn: (component, keyConfig, keyState) => {
          keyConfig.sendFocusIn(keyConfig).fold(() => {
            component.getSystem().triggerFocus(component.element, component.element);
          }, sendFocusIn => {
            sendFocusIn(component, keyConfig, keyState);
          });
        },
        setGridSize: (component, keyConfig, keyState, numRows, numColumns) => {
          if (!isFlatgridState(keyState)) {
            console.error('Layout does not support setGridSize');
          } else {
            keyState.setGridSize(numRows, numColumns);
          }
        }
      },
      state: KeyingState
    });

    const withoutReuse = (parent, data) => {
      preserve$1(() => {
        replaceChildren(parent, data, () => map$2(data, parent.getSystem().build));
      }, parent.element);
    };
    const withReuse = (parent, data) => {
      preserve$1(() => {
        virtualReplaceChildren(parent, data, () => {
          return patchSpecChildren(parent.element, data, parent.getSystem().buildOrPatch);
        });
      }, parent.element);
    };

    const virtualReplace = (component, replacee, replaceeIndex, childSpec) => {
      virtualDetach(replacee);
      const child = patchSpecChild(component.element, replaceeIndex, childSpec, component.getSystem().buildOrPatch);
      virtualAttach(component, child);
      component.syncComponents();
    };
    const insert = (component, insertion, childSpec) => {
      const child = component.getSystem().build(childSpec);
      attachWith(component, child, insertion);
    };
    const replace = (component, replacee, replaceeIndex, childSpec) => {
      detach(replacee);
      insert(component, (p, c) => appendAt(p, c, replaceeIndex), childSpec);
    };
    const set$3 = (component, replaceConfig, replaceState, data) => {
      const replacer = replaceConfig.reuseDom ? withReuse : withoutReuse;
      return replacer(component, data);
    };
    const append = (component, replaceConfig, replaceState, appendee) => {
      insert(component, append$2, appendee);
    };
    const prepend = (component, replaceConfig, replaceState, prependee) => {
      insert(component, prepend$1, prependee);
    };
    const remove = (component, replaceConfig, replaceState, removee) => {
      const children = contents(component);
      const foundChild = find$5(children, child => eq(removee.element, child.element));
      foundChild.each(detach);
    };
    const contents = (component, _replaceConfig) => component.components();
    const replaceAt = (component, replaceConfig, replaceState, replaceeIndex, replacer) => {
      const children = contents(component);
      return Optional.from(children[replaceeIndex]).map(replacee => {
        replacer.fold(() => detach(replacee), r => {
          const replacer = replaceConfig.reuseDom ? virtualReplace : replace;
          replacer(component, replacee, replaceeIndex, r);
        });
        return replacee;
      });
    };
    const replaceBy = (component, replaceConfig, replaceState, replaceePred, replacer) => {
      const children = contents(component);
      return findIndex$1(children, replaceePred).bind(replaceeIndex => replaceAt(component, replaceConfig, replaceState, replaceeIndex, replacer));
    };

    var ReplaceApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        append: append,
        prepend: prepend,
        remove: remove,
        replaceAt: replaceAt,
        replaceBy: replaceBy,
        set: set$3,
        contents: contents
    });

    const Replacing = create$4({
      fields: [defaultedBoolean('reuseDom', true)],
      name: 'replacing',
      apis: ReplaceApis
    });

    const events$d = (name, eventHandlers) => {
      const events = derive$2(eventHandlers);
      return create$4({
        fields: [required$1('enabled')],
        name,
        active: { events: constant$1(events) }
      });
    };
    const config = (name, eventHandlers) => {
      const me = events$d(name, eventHandlers);
      return {
        key: name,
        value: {
          config: {},
          me,
          configAsRaw: constant$1({}),
          initialConfig: {},
          state: NoState
        }
      };
    };

    const focus$2 = (component, focusConfig) => {
      if (!focusConfig.ignore) {
        focus$3(component.element);
        focusConfig.onFocus(component);
      }
    };
    const blur = (component, focusConfig) => {
      if (!focusConfig.ignore) {
        blur$1(component.element);
      }
    };
    const isFocused = component => hasFocus(component.element);

    var FocusApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        focus: focus$2,
        blur: blur,
        isFocused: isFocused
    });

    const exhibit$4 = (base, focusConfig) => {
      const mod = focusConfig.ignore ? {} : { attributes: { tabindex: '-1' } };
      return nu$7(mod);
    };
    const events$c = focusConfig => derive$2([run$1(focus$4(), (component, simulatedEvent) => {
        focus$2(component, focusConfig);
        simulatedEvent.stop();
      })].concat(focusConfig.stopMousedown ? [run$1(mousedown(), (_, simulatedEvent) => {
        simulatedEvent.event.prevent();
      })] : []));

    var ActiveFocus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$4,
        events: events$c
    });

    var FocusSchema = [
      onHandler('onFocus'),
      defaulted('stopMousedown', false),
      defaulted('ignore', false)
    ];

    const Focusing = create$4({
      fields: FocusSchema,
      name: 'focusing',
      active: ActiveFocus,
      apis: FocusApis
    });

    const SetupBehaviourCellState = initialState => {
      const init = () => {
        const cell = Cell(initialState);
        const get = () => cell.get();
        const set = newState => cell.set(newState);
        const clear = () => cell.set(initialState);
        const readState = () => cell.get();
        return {
          get,
          set,
          clear,
          readState
        };
      };
      return { init };
    };

    const updateAriaState = (component, toggleConfig, toggleState) => {
      const ariaInfo = toggleConfig.aria;
      ariaInfo.update(component, ariaInfo, toggleState.get());
    };
    const updateClass = (component, toggleConfig, toggleState) => {
      toggleConfig.toggleClass.each(toggleClass => {
        if (toggleState.get()) {
          add$2(component.element, toggleClass);
        } else {
          remove$2(component.element, toggleClass);
        }
      });
    };
    const set$2 = (component, toggleConfig, toggleState, state) => {
      const initialState = toggleState.get();
      toggleState.set(state);
      updateClass(component, toggleConfig, toggleState);
      updateAriaState(component, toggleConfig, toggleState);
      if (initialState !== state) {
        toggleConfig.onToggled(component, state);
      }
    };
    const toggle$2 = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, !toggleState.get());
    };
    const on = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, true);
    };
    const off = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, false);
    };
    const isOn = (component, toggleConfig, toggleState) => toggleState.get();
    const onLoad = (component, toggleConfig, toggleState) => {
      set$2(component, toggleConfig, toggleState, toggleConfig.selected);
    };

    var ToggleApis = /*#__PURE__*/Object.freeze({
        __proto__: null,
        onLoad: onLoad,
        toggle: toggle$2,
        isOn: isOn,
        on: on,
        off: off,
        set: set$2
    });

    const exhibit$3 = () => nu$7({});
    const events$b = (toggleConfig, toggleState) => {
      const execute = executeEvent(toggleConfig, toggleState, toggle$2);
      const load = loadEvent(toggleConfig, toggleState, onLoad);
      return derive$2(flatten([
        toggleConfig.toggleOnExecute ? [execute] : [],
        [load]
      ]));
    };

    var ActiveToggle = /*#__PURE__*/Object.freeze({
        __proto__: null,
        exhibit: exhibit$3,
        events: events$b
    });

    const updatePressed = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-pressed', status);
      if (ariaInfo.syncWithExpanded) {
        updateExpanded(component, ariaInfo, status);
      }
    };
    const updateSelected = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-selected', status);
    };
    const updateChecked = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-checked', status);
    };
    const updateExpanded = (component, ariaInfo, status) => {
      set$9(component.element, 'aria-expanded', status);
    };

    var ToggleSchema = [
      defaulted('selected', false),
      option$3('toggleClass'),
      defaulted('toggleOnExecute', true),
      onHandler('onToggled'),
      defaultedOf('aria', { mode: 'none' }, choose$1('mode', {
        pressed: [
          defaulted('syncWithExpanded', false),
          output$1('update', updatePressed)
        ],
        checked: [output$1('update', updateChecked)],
        expanded: [output$1('update', updateExpanded)],
        selected: [output$1('update', updateSelected)],
        none: [output$1('update', noop)]
      }))
    ];

    const Toggling = create$4({
      fields: ToggleSchema,
      name: 'toggling',
      active: ActiveToggle,
      apis: ToggleApis,
      state: SetupBehaviourCellState(false)
    });

    const pointerEvents = () => {
      const onClick = (component, simulatedEvent) => {
        simulatedEvent.stop();
        emitExecute(component);
      };
      return [
        run$1(click(), onClick),
        run$1(tap(), onClick),
        cutter(touchstart()),
        cutter(mousedown())
      ];
    };
    const events$a = optAction => {
      const executeHandler = action => runOnExecute$1((component, simulatedEvent) => {
        action(component);
        simulatedEvent.stop();
      });
      return derive$2(flatten([
        optAction.map(executeHandler).toArray(),
        pointerEvents()
      ]));
    };

    const hoverEvent = 'alloy.item-hover';
    const focusEvent = 'alloy.item-focus';
    const toggledEvent = 'alloy.item-toggled';
    const onHover = item => {
      if (search(item.element).isNone() || Focusing.isFocused(item)) {
        if (!Focusing.isFocused(item)) {
          Focusing.focus(item);
        }
        emitWith(item, hoverEvent, { item });
      }
    };
    const onFocus$1 = item => {
      emitWith(item, focusEvent, { item });
    };
    const onToggled = (item, state) => {
      emitWith(item, toggledEvent, {
        item,
        state
      });
    };
    const hover = constant$1(hoverEvent);
    const focus$1 = constant$1(focusEvent);
    const toggled = constant$1(toggledEvent);

    const getItemRole = detail => detail.toggling.map(toggling => toggling.exclusive ? 'menuitemradio' : 'menuitemcheckbox').getOr('menuitem');
    const getTogglingSpec = tConfig => ({
      aria: { mode: 'checked' },
      ...filter$1(tConfig, (_value, name) => name !== 'exclusive'),
      onToggled: (component, state) => {
        if (isFunction(tConfig.onToggled)) {
          tConfig.onToggled(component, state);
        }
        onToggled(component, state);
      }
    });
    const builder$2 = detail => ({
      dom: detail.dom,
      domModification: {
        ...detail.domModification,
        attributes: {
          'role': getItemRole(detail),
          ...detail.domModification.attributes,
          'aria-haspopup': detail.hasSubmenu,
          ...detail.hasSubmenu ? { 'aria-expanded': false } : {}
        }
      },
      behaviours: SketchBehaviours.augment(detail.itemBehaviours, [
        detail.toggling.fold(Toggling.revoke, tConfig => Toggling.config(getTogglingSpec(tConfig))),
        Focusing.config({
          ignore: detail.ignoreFocus,
          stopMousedown: detail.ignoreFocus,
          onFocus: component => {
            onFocus$1(component);
          }
        }),
        Keying.config({ mode: 'execution' }),
        Representing.config({
          store: {
            mode: 'memory',
            initialValue: detail.data
          }
        }),
        config('item-type-events', [
          ...pointerEvents(),
          run$1(mouseover(), onHover),
          run$1(focusItem(), Focusing.focus)
        ])
      ]),
      components: detail.components,
      eventOrder: detail.eventOrder
    });
    const schema$p = [
      required$1('data'),
      required$1('components'),
      required$1('dom'),
      defaulted('hasSubmenu', false),
      option$3('toggling'),
      SketchBehaviours.field('itemBehaviours', [
        Toggling,
        Focusing,
        Keying,
        Representing
      ]),
      defaulted('ignoreFocus', false),
      defaulted('domModification', {}),
      output$1('builder', builder$2),
      defaulted('eventOrder', {})
    ];

    const builder$1 = detail => ({
      dom: detail.dom,
      components: detail.components,
      events: derive$2([stopper(focusItem())])
    });
    const schema$o = [
      required$1('dom'),
      required$1('components'),
      output$1('builder', builder$1)
    ];

    const owner$2 = constant$1('item-widget');
    const parts$h = constant$1([required({
        name: 'widget',
        overrides: detail => {
          return {
            behaviours: derive$1([Representing.config({
                store: {
                  mode: 'manual',
                  getValue: _component => {
                    return detail.data;
                  },
                  setValue: noop
                }
              })])
          };
        }
      })]);

    const builder = detail => {
      const subs = substitutes(owner$2(), detail, parts$h());
      const components = components$1(owner$2(), detail, subs.internals());
      const focusWidget = component => getPart(component, detail, 'widget').map(widget => {
        Keying.focusIn(widget);
        return widget;
      });
      const onHorizontalArrow = (component, simulatedEvent) => inside(simulatedEvent.event.target) ? Optional.none() : (() => {
        if (detail.autofocus) {
          simulatedEvent.setSource(component.element);
          return Optional.none();
        } else {
          return Optional.none();
        }
      })();
      return {
        dom: detail.dom,
        components,
        domModification: detail.domModification,
        events: derive$2([
          runOnExecute$1((component, simulatedEvent) => {
            focusWidget(component).each(_widget => {
              simulatedEvent.stop();
            });
          }),
          run$1(mouseover(), onHover),
          run$1(focusItem(), (component, _simulatedEvent) => {
            if (detail.autofocus) {
              focusWidget(component);
            } else {
              Focusing.focus(component);
            }
          })
        ]),
        behaviours: SketchBehaviours.augment(detail.widgetBehaviours, [
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.data
            }
          }),
          Focusing.config({
            ignore: detail.ignoreFocus,
            onFocus: component => {
              onFocus$1(component);
            }
          }),
          Keying.config({
            mode: 'special',
            focusIn: detail.autofocus ? component => {
              focusWidget(component);
            } : revoke(),
            onLeft: onHorizontalArrow,
            onRight: onHorizontalArrow,
            onEscape: (component, simulatedEvent) => {
              if (!Focusing.isFocused(component) && !detail.autofocus) {
                Focusing.focus(component);
                return Optional.some(true);
              } else if (detail.autofocus) {
                simulatedEvent.setSource(component.element);
                return Optional.none();
              } else {
                return Optional.none();
              }
            }
          })
        ])
      };
    };
    const schema$n = [
      required$1('uid'),
      required$1('data'),
      required$1('components'),
      required$1('dom'),
      defaulted('autofocus', false),
      defaulted('ignoreFocus', false),
      SketchBehaviours.field('widgetBehaviours', [
        Representing,
        Focusing,
        Keying
      ]),
      defaulted('domModification', {}),
      defaultUidsSchema(parts$h()),
      output$1('builder', builder)
    ];

    const itemSchema$2 = choose$1('type', {
      widget: schema$n,
      item: schema$p,
      separator: schema$o
    });
    const configureGrid = (detail, movementInfo) => ({
      mode: 'flatgrid',
      selector: '.' + detail.markers.item,
      initSize: {
        numColumns: movementInfo.initSize.numColumns,
        numRows: movementInfo.initSize.numRows
      },
      focusManager: detail.focusManager
    });
    const configureMatrix = (detail, movementInfo) => ({
      mode: 'matrix',
      selectors: {
        row: movementInfo.rowSelector,
        cell: '.' + detail.markers.item
      },
      previousSelector: movementInfo.previousSelector,
      focusManager: detail.focusManager
    });
    const configureMenu = (detail, movementInfo) => ({
      mode: 'menu',
      selector: '.' + detail.markers.item,
      moveOnTab: movementInfo.moveOnTab,
      focusManager: detail.focusManager
    });
    const parts$g = constant$1([group({
        factory: {
          sketch: spec => {
            const itemInfo = asRawOrDie$1('menu.spec item', itemSchema$2, spec);
            return itemInfo.builder(itemInfo);
          }
        },
        name: 'items',
        unit: 'item',
        defaults: (detail, u) => {
          return has$2(u, 'uid') ? u : {
            ...u,
            uid: generate$5('item')
          };
        },
        overrides: (detail, u) => {
          return {
            type: u.type,
            ignoreFocus: detail.fakeFocus,
            domModification: { classes: [detail.markers.item] }
          };
        }
      })]);
    const schema$m = constant$1([
      required$1('value'),
      required$1('items'),
      required$1('dom'),
      required$1('components'),
      defaulted('eventOrder', {}),
      field('menuBehaviours', [
        Highlighting,
        Representing,
        Composing,
        Keying
      ]),
      defaultedOf('movement', {
        mode: 'menu',
        moveOnTab: true
      }, choose$1('mode', {
        grid: [
          initSize(),
          output$1('config', configureGrid)
        ],
        matrix: [
          output$1('config', configureMatrix),
          required$1('rowSelector'),
          defaulted('previousSelector', Optional.none)
        ],
        menu: [
          defaulted('moveOnTab', true),
          output$1('config', configureMenu)
        ]
      })),
      itemMarkers(),
      defaulted('fakeFocus', false),
      defaulted('focusManager', dom$2()),
      onHandler('onHighlight'),
      onHandler('onDehighlight')
    ]);

    const focus = constant$1('alloy.menu-focus');

    const deselectOtherRadioItems = (menu, item) => {
      const checkedRadioItems = descendants(menu.element, '[role="menuitemradio"][aria-checked="true"]');
      each$1(checkedRadioItems, ele => {
        if (!eq(ele, item.element)) {
          menu.getSystem().getByDom(ele).each(c => {
            Toggling.off(c);
          });
        }
      });
    };
    const make$7 = (detail, components, _spec, _externals) => ({
      uid: detail.uid,
      dom: detail.dom,
      markers: detail.markers,
      behaviours: augment(detail.menuBehaviours, [
        Highlighting.config({
          highlightClass: detail.markers.selectedItem,
          itemClass: detail.markers.item,
          onHighlight: detail.onHighlight,
          onDehighlight: detail.onDehighlight
        }),
        Representing.config({
          store: {
            mode: 'memory',
            initialValue: detail.value
          }
        }),
        Composing.config({ find: Optional.some }),
        Keying.config(detail.movement.config(detail, detail.movement))
      ]),
      events: derive$2([
        run$1(focus$1(), (menu, simulatedEvent) => {
          const event = simulatedEvent.event;
          menu.getSystem().getByDom(event.target).each(item => {
            Highlighting.highlight(menu, item);
            simulatedEvent.stop();
            emitWith(menu, focus(), {
              menu,
              item
            });
          });
        }),
        run$1(hover(), (menu, simulatedEvent) => {
          const item = simulatedEvent.event.item;
          Highlighting.highlight(menu, item);
        }),
        run$1(toggled(), (menu, simulatedEvent) => {
          const {item, state} = simulatedEvent.event;
          if (state && get$f(item.element, 'role') === 'menuitemradio') {
            deselectOtherRadioItems(menu, item);
          }
        })
      ]),
      components,
      eventOrder: detail.eventOrder,
      domModification: { attributes: { role: 'menu' } }
    });

    const Menu = composite({
      name: 'Menu',
      configFields: schema$m(),
      partFields: parts$g(),
      factory: make$7
    });

    const transpose$1 = obj => tupleMap(obj, (v, k) => ({
      k: v,
      v: k
    }));
    const trace = (items, byItem, byMenu, finish) => get$g(byMenu, finish).bind(triggerItem => get$g(items, triggerItem).bind(triggerMenu => {
      const rest = trace(items, byItem, byMenu, triggerMenu);
      return Optional.some([triggerMenu].concat(rest));
    })).getOr([]);
    const generate$2 = (menus, expansions) => {
      const items = {};
      each(menus, (menuItems, menu) => {
        each$1(menuItems, item => {
          items[item] = menu;
        });
      });
      const byItem = expansions;
      const byMenu = transpose$1(expansions);
      const menuPaths = map$1(byMenu, (_triggerItem, submenu) => [submenu].concat(trace(items, byItem, byMenu, submenu)));
      return map$1(items, menu => get$g(menuPaths, menu).getOr([menu]));
    };

    const init$c = () => {
      const expansions = Cell({});
      const menus = Cell({});
      const paths = Cell({});
      const primary = value$2();
      const directory = Cell({});
      const clear = () => {
        expansions.set({});
        menus.set({});
        paths.set({});
        primary.clear();
      };
      const isClear = () => primary.get().isNone();
      const setMenuBuilt = (menuName, built) => {
        menus.set({
          ...menus.get(),
          [menuName]: {
            type: 'prepared',
            menu: built
          }
        });
      };
      const setContents = (sPrimary, sMenus, sExpansions, dir) => {
        primary.set(sPrimary);
        expansion