const hasOwn = Object.prototype.hasOwnProperty;
const getProto = Object.getPrototypeOf;
const toString = Object.prototype.toString;
const nativeIsArray = Array.isArray;
const fnToString = hasOwn.toString;
const ObjectFunctionString = fnToString.call(Object);


const isPlainObject = (obj) => {
	var proto, Ctor;
	if (!obj || toString.call(obj) !== "[object Object]") {
		return false;
	}
	proto = getProto(obj);
	if (!proto) {
		return true;
	}
	Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
	return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}

const isArray = nativeIsArray || function(obj) {
	return toString.call(obj) === '[object Array]'
}

const isObject = function(obj) {
	var type = typeof obj
	return type === 'function' || type === 'object' && !!obj;
}

const isBoolean = function(obj) {
	return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

const isEmptyObject = function(obj) {
	for (const name in obj) {
		return false;
	}
	return true;
}

const isEmptyValue = function(obj) {
	if (isEmpty(obj)) return true;
	for (const name in obj) {
		if (obj[name] !== undefined) return false;
	}
	return true;
}

const isEmpty = function(obj) {
	if (isObject(obj)) return isEmptyObject(obj);
	return obj === undefined || obj === null || obj === '';
}

const apply = (o, c) => {
	if (o && c && typeof c == 'object') {
		for (var p in c) {
			var v = c[p];
			if (hasOwn.call(o, p) || v !== undefined) {
				o[p] = v;
			}
		}
	}
	return o;
}



const applyVal = (o, c) => {
	if (o && c && typeof c == 'object') {
		for (var p in o) {
			var v = o[p];
			if (!v) {
				o[p] = c[p];
			}
		}
	}
	return o;
}

const applyAll = (o, c) => {
	if (o && c && typeof c == 'object') {
		for (var p in c) {
			var v = c[p];
			if (isObject(v)) {
				if (isObject(o[p])) {
					applyAll(o[p], v);
				} else {
					o[p] = v;
				}
			} else if (o.hasOwnProperty(p) || v !== undefined) {
				o[p] = v;
			}
		}
	}
	return o;
}

const applyIf = function(o, c) {
	if (o && c) {
		for (var p in c) {
			if (o[p] === undefined && c[p] !== undefined) {
				o[p] = c[p];
			}
		}
	}
	return o;
}

const copy = function() {
	let args = Array.prototype.slice.call(arguments)
	let obj = {};
	args.forEach(v => {
		obj = apply(obj, v || {})
	})
	return obj
}

const copyValid = function() {
	let args = Array.prototype.slice.call(arguments)
	let obj = {};
	args.forEach(v => {
		obj = _copySingleValid(obj, v || {})
	})
	return obj
}

const _copySingleValid = (t, s) => {
	if (isObject(s)) {
		for (var f in s) {
			let firstChar = f.charAt(0);
			if (/^[a-zA-Z]+$/.test(firstChar)) {
				t[f] = s[f]
			}
		}
	}
	return t;
}

const _is = {};
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(v => {
	_is['is' + v] = function(obj) {
		let s = toString.call(obj);
		let t = '[object ' + v + ']'
		if (v === 'Function') {
			return s === t || s === '[object AsyncFunction]'
		}
		return s === t;
	}
})

const pathJoin = function() {
	let args = Array.prototype.slice.call(arguments);
	let path = '';
	if (args.length) {
		path = args[0];

		function hasChar(str, index) {
			var indexChar = str.charAt(index);
			return indexChar == "/";
		}
		for (var i = 1; i < args.length; i++) {
			let v = args[i];
			if (v && typeof v === 'string') {
				let lastIndex = v.length - 1;
				v = hasChar(v, lastIndex) ? v.substring(0, lastIndex - 1) : v;
				path += hasChar(v, 0) ? v : '/' + v;
			}
		}
	}
	return path
}


const toParams = (params) => {
	let param = ""
	for (const name in params) {
		if (typeof params[name] != 'function') {
			param += "&" + name + "=" + encodeURI(params[name])
		}
	}
	return param.substring(1)
}

/**
 *
 * 转成Array
 *
 * @param str
 * @param split
 * @returns {Array}
 */
const toArray = (str, split) => {
	return _is.isString(str) ?
		isJson(str) ? JSON.parse(str) : str.split(split || /,|\\*|;|#/) :
		isArray(str) ? str : [];
}

const toField = (str, data, thiv) => {
	return str.replace(/(?:\$\{([^{}]+)\})/gi,
		function(f) {
			f = f.replace(/\$|\{|\}/gi, '');
			return toValue(data, f, thiv);
		});
}

const toValue = (d, f, thiv) => {

	d = d || {};
	var sf = f.split(":");
	var s = sf[0].split(".");
	var p = s[0];
	var v = d[p];
	if (v && isObject(v)) {
		for (var j = 1; j < s.length; ++j) {
			v = v[s[j]];
		}
	}
	return v != undefined ? v : "";
}

const result = function(e, t) {
	if (null == e) return null;
	var r = _is.isFunction(t) ? t.call(e, e) : e[t];
	return _is.isFunction(r) ? r.call(e) : r;
}

const isJson = function(str) {
	return typeof str === 'string' && /(?:^\{|^\[)/gi.test(str);
}

const getClassName = function(o) {
	if (o && o.constructor) {
		let s = o.toString();
		let arrs = s.match(/class\s*(\w+)/);
		if (arrs && arrs.length == 2) {
			return arrs[1];
		}
	}
	return undefined;
}

const isEqual = function(t, s) {
	return t == s || isObject(t) && isObject(s) ? JSON.stringify(t) === JSON.stringify(s) : t === s;
}

function assignKey(to, from, key) {
	const val = from[key];

	const hasKey = hasOwn.call(to, key);
	if (hasKey) {
		return;
	}
	if (!hasKey || !isObject(val)) {
		to[key] = val;
	} else {

		to[key] = assign(Object(to[key]), from[key]);
	}
}

function assign(to, from) {
	for (const key in from) {
		if (hasOwn.call(from, key)) {
			assignKey(to, from, key);
		}
	}
	return to;
}


function copyKey(to, from, key) {
	const val = from[key];
	if (isObject(val) || isArray(val)) {
		to[key] = deepCloneAll(val)
	} else {
		to[key] = val;
	}
}

function deepCloneAll(obj) {
	let to = {};
	if (isArray(obj)) {
		return obj.map(item => deepCloneAll(item));
	} else if (isObject(obj)) {
		for (const key in obj) {
			copyKey(to, obj, key);
		}
	}
	return to;
}

function deepClone(obj) {
	if (Array.isArray(obj)) {
		return obj.map(item => deepClone(item));
	} else if (typeof obj === 'object') {
		return assign({}, obj);
	}
	return obj;
}


function formatterValue(option, fn, field, joinChar) {

	if (isArray(option)) {
		return option.map(v => formatterValue(v, fn, field));
	}

	if (_is.isFunction(fn)) {
		return fn(option)
	}
	return isObject(option) && field in option ? option[field] : option
}


function applyPromise(fn, target, agrs, defaultValues) {
	let _defaultRes;
	if (_is.isFunction(fn)) {
		_defaultRes = fn.apply(target, agrs)
		if (_defaultRes && _defaultRes instanceof Promise) {
			return _defaultRes.then(res => {
				return res;
			})
		}
	}
	return Promise.resolve(_defaultRes || defaultValues);
}


module.exports = apply({
	hasOwn: hasOwn,
	applyPromise: applyPromise,
	getClassName: getClassName,
	result: result,
	isPlainObject: isPlainObject,
	toValue: toValue,
	toField: toField,
	toArray: toArray,
	toParams: toParams,
	formatterValue: formatterValue,
	isJson: isJson,
	isEqual: isEqual,
	isArray: isArray,
	isObject: isObject,
	isBoolean: isBoolean,
	isEmptyObject: isEmptyObject,
	isEmptyValue: isEmptyValue,
	isEmpty: isEmpty,
	apply: apply,
	copy: copy,
	deepClone: deepClone,
	deepCloneAll: deepCloneAll,
	pathJoin: pathJoin,
	copyValid: copyValid,
	applyVal: applyVal,
	applyIf: applyIf,
	applyAll: applyAll
}, _is);
