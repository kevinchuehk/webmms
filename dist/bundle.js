(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.webmms = factory());
}(this, function () { 'use strict';

  var bind = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */

  var isBuffer = function isBuffer (obj) {
    return obj != null && obj.constructor != null &&
      typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  };

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = merge(result[key], val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Function equal to merge with the difference being that no reference
   * to original objects is kept.
   *
   * @see merge
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function deepMerge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === 'object') {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    deepMerge: deepMerge,
    extend: extend,
    trim: trim
  };

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var isURLSameOrigin = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var cookies = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password || '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils.isStandardBrowserEnv()) {
        var cookies$1 = cookies;

        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies$1.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (config.withCredentials) {
        request.withCredentials = true;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (requestData === undefined) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    // Only Node.JS has a process variable that is of [[Class]] process
    if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    } else if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    }
    return adapter;
  }

  var defaults = {
    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults;

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Support baseURL config
    if (config.baseURL && !isAbsoluteURL(config.url)) {
      config.url = combineURLs(config.baseURL, config.url);
    }

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers || {}
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      }
    });

    utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
      if (utils.isObject(config2[prop])) {
        config[prop] = utils.deepMerge(config1[prop], config2[prop]);
      } else if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (utils.isObject(config1[prop])) {
        config[prop] = utils.deepMerge(config1[prop]);
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    utils.forEach([
      'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
      'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
      'socketPath'
    ], function defaultToConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    return config;
  };

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);
    config.method = config.method ? config.method.toLowerCase() : 'get';

    // Hook up interceptors middleware
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind(Axios_1.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios_1.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios = createInstance(defaults_1);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios_1;

  // Factory for creating new instances
  axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios.Cancel = Cancel_1;
  axios.CancelToken = CancelToken_1;
  axios.isCancel = isCancel;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;

  var axios_1 = axios;

  // Allow use of default import syntax in TypeScript
  var default_1 = axios;
  axios_1.default = default_1;

  var axios$1 = axios_1;

  function symbolObservablePonyfill(root) {
  	var result;
  	var Symbol = root.Symbol;

  	if (typeof Symbol === 'function') {
  		if (Symbol.observable) {
  			result = Symbol.observable;
  		} else {
  			result = Symbol('observable');
  			Symbol.observable = result;
  		}
  	} else {
  		result = '@@observable';
  	}

  	return result;
  }

  /* global window */

  var root;

  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof global !== 'undefined') {
    root = global;
  } else if (typeof module !== 'undefined') {
    root = module;
  } else {
    root = Function('return this')();
  }

  var result = symbolObservablePonyfill(root);

  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */
  var randomString = function randomString() {
    return Math.random().toString(36).substring(7).split('').join('.');
  };

  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };

  /**
   * @param {any} obj The object to inspect.
   * @returns {boolean} True if the argument appears to be a plain object.
   */
  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = obj;

    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  }

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */

  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;

    if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
      throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
    }

    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.');
      }

      return enhancer(createStore)(reducer, preloadedState);
    }

    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }

    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */


    function getState() {
      if (isDispatching) {
        throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
      }

      return currentState;
    }
    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked, this
     * will not have any effect on the `dispatch()` that is currently in progress.
     * However, the next `dispatch()` call, whether nested or not, will use a more
     * recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all state changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */


    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
      }

      if (isDispatching) {
        throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        if (isDispatching) {
          throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
        }

        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    }
    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing “what changed”. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */


    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      var listeners = currentListeners = nextListeners;

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }

      return action;
    }
    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */


    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.');
      }

      currentReducer = nextReducer;
      dispatch({
        type: ActionTypes.REPLACE
      });
    }
    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/tc39/proposal-observable
     */


    function observable() {
      var _ref;

      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function subscribe(observer) {
          if (typeof observer !== 'object' || observer === null) {
            throw new TypeError('Expected the observer to be an object.');
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _ref[result] = function () {
        return this;
      }, _ref;
    } // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.


    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[result] = observable, _ref2;
  }

  function getUndefinedStateErrorMessage(key, action) {
    var actionType = action && action.type;
    var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
    return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
  }

  function assertReducerShape(reducers) {
    Object.keys(reducers).forEach(function (key) {
      var reducer = reducers[key];
      var initialState = reducer(undefined, {
        type: ActionTypes.INIT
      });

      if (typeof initialState === 'undefined') {
        throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
      }

      if (typeof reducer(undefined, {
        type: ActionTypes.PROBE_UNKNOWN_ACTION()
      }) === 'undefined') {
        throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
      }
    });
  }
  /**
   * Turns an object whose values are different reducer functions, into a single
   * reducer function. It will call every child reducer, and gather their results
   * into a single state object, whose keys correspond to the keys of the passed
   * reducer functions.
   *
   * @param {Object} reducers An object whose values correspond to different
   * reducer functions that need to be combined into one. One handy way to obtain
   * it is to use ES6 `import * as reducers` syntax. The reducers may never return
   * undefined for any action. Instead, they should return their initial state
   * if the state passed to them was undefined, and the current state for any
   * unrecognized action.
   *
   * @returns {Function} A reducer function that invokes every reducer inside the
   * passed object, and builds a state object with the same shape.
   */


  function combineReducers(reducers) {
    var reducerKeys = Object.keys(reducers);
    var finalReducers = {};

    for (var i = 0; i < reducerKeys.length; i++) {
      var key = reducerKeys[i];

      if (typeof reducers[key] === 'function') {
        finalReducers[key] = reducers[key];
      }
    }

    var finalReducerKeys = Object.keys(finalReducers);

    var shapeAssertionError;

    try {
      assertReducerShape(finalReducers);
    } catch (e) {
      shapeAssertionError = e;
    }

    return function combination(state, action) {
      if (state === void 0) {
        state = {};
      }

      if (shapeAssertionError) {
        throw shapeAssertionError;
      }

      var hasChanged = false;
      var nextState = {};

      for (var _i = 0; _i < finalReducerKeys.length; _i++) {
        var _key = finalReducerKeys[_i];
        var reducer = finalReducers[_key];
        var previousStateForKey = state[_key];
        var nextStateForKey = reducer(previousStateForKey, action);

        if (typeof nextStateForKey === 'undefined') {
          var errorMessage = getUndefinedStateErrorMessage(_key, action);
          throw new Error(errorMessage);
        }

        nextState[_key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }

      return hasChanged ? nextState : state;
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /**
   * Parses an URI
   *
   * @author Steven Levithan <stevenlevithan.com> (MIT license)
   * @api private
   */

  var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

  var parts = [
      'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
  ];

  var parseuri = function parseuri(str) {
      var src = str,
          b = str.indexOf('['),
          e = str.indexOf(']');

      if (b != -1 && e != -1) {
          str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
      }

      var m = re.exec(str || ''),
          uri = {},
          i = 14;

      while (i--) {
          uri[parts[i]] = m[i] || '';
      }

      if (b != -1 && e != -1) {
          uri.source = src;
          uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
          uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
          uri.ipv6uri = true;
      }

      return uri;
  };

  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  var ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(val)
    );
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
      default:
        return undefined;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    if (ms >= d) {
      return Math.round(ms / d) + 'd';
    }
    if (ms >= h) {
      return Math.round(ms / h) + 'h';
    }
    if (ms >= m) {
      return Math.round(ms / m) + 'm';
    }
    if (ms >= s) {
      return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    return plural(ms, d, 'day') ||
      plural(ms, h, 'hour') ||
      plural(ms, m, 'minute') ||
      plural(ms, s, 'second') ||
      ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, n, name) {
    if (ms < n) {
      return;
    }
    if (ms < n * 1.5) {
      return Math.floor(ms / n) + ' ' + name;
    }
    return Math.ceil(ms / n) + ' ' + name + 's';
  }

  var debug = createCommonjsModule(function (module, exports) {
  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
  exports.coerce = coerce;
  exports.disable = disable;
  exports.enable = enable;
  exports.enabled = enabled;
  exports.humanize = ms;

  /**
   * Active `debug` instances.
   */
  exports.instances = [];

  /**
   * The currently active debug mode names, and names to skip.
   */

  exports.names = [];
  exports.skips = [];

  /**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */

  exports.formatters = {};

  /**
   * Select a color.
   * @param {String} namespace
   * @return {Number}
   * @api private
   */

  function selectColor(namespace) {
    var hash = 0, i;

    for (i in namespace) {
      hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return exports.colors[Math.abs(hash) % exports.colors.length];
  }

  /**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */

  function createDebug(namespace) {

    var prevTime;

    function debug() {
      // disabled?
      if (!debug.enabled) return;

      var self = debug;

      // set `diff` timestamp
      var curr = +new Date();
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;

      // turn the `arguments` into a proper Array
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }

      args[0] = exports.coerce(args[0]);

      if ('string' !== typeof args[0]) {
        // anything else let's inspect with %O
        args.unshift('%O');
      }

      // apply any `formatters` transformations
      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
        // if we encounter an escaped % then don't increase the array index
        if (match === '%%') return match;
        index++;
        var formatter = exports.formatters[format];
        if ('function' === typeof formatter) {
          var val = args[index];
          match = formatter.call(self, val);

          // now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });

      // apply env-specific formatting (colors, etc.)
      exports.formatArgs.call(self, args);

      var logFn = debug.log || exports.log || console.log.bind(console);
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = exports.enabled(namespace);
    debug.useColors = exports.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;

    // env-specific initialization logic for debug instances
    if ('function' === typeof exports.init) {
      exports.init(debug);
    }

    exports.instances.push(debug);

    return debug;
  }

  function destroy () {
    var index = exports.instances.indexOf(this);
    if (index !== -1) {
      exports.instances.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */

  function enable(namespaces) {
    exports.save(namespaces);

    exports.names = [];
    exports.skips = [];

    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) continue; // ignore empty strings
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        exports.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < exports.instances.length; i++) {
      var instance = exports.instances[i];
      instance.enabled = exports.enabled(instance.namespace);
    }
  }

  /**
   * Disable debug output.
   *
   * @api public
   */

  function disable() {
    exports.enable('');
  }

  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */

  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) {
      if (exports.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports.names.length; i < len; i++) {
      if (exports.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */

  function coerce(val) {
    if (val instanceof Error) return val.stack || val.message;
    return val;
  }
  });
  var debug_1 = debug.coerce;
  var debug_2 = debug.disable;
  var debug_3 = debug.enable;
  var debug_4 = debug.enabled;
  var debug_5 = debug.humanize;
  var debug_6 = debug.instances;
  var debug_7 = debug.names;
  var debug_8 = debug.skips;
  var debug_9 = debug.formatters;

  var browser = createCommonjsModule(function (module, exports) {
  /**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = debug;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = 'undefined' != typeof chrome
                 && 'undefined' != typeof chrome.storage
                    ? chrome.storage.local
                    : localstorage();

  /**
   * Colors.
   */

  exports.colors = [
    '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
    '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
    '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
    '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
    '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
    '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
    '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
    '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
    '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
    '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
    '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
  ];

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */

  function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
      return true;
    }

    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }

    // is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
      // is firebug? http://stackoverflow.com/a/398120/376773
      (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
      // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
      // double check webkit in userAgent just in case we are in a worker
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }

  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  exports.formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (err) {
      return '[UnexpectedJSONParseError]: ' + err.message;
    }
  };


  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */

  function formatArgs(args) {
    var useColors = this.useColors;

    args[0] = (useColors ? '%c' : '')
      + this.namespace
      + (useColors ? ' %c' : ' ')
      + args[0]
      + (useColors ? '%c ' : ' ')
      + '+' + exports.humanize(this.diff);

    if (!useColors) return;

    var c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');

    // the final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function(match) {
      if ('%%' === match) return;
      index++;
      if ('%c' === match) {
        // we only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });

    args.splice(lastC, 0, c);
  }

  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */

  function log() {
    // this hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return 'object' === typeof console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */

  function save(namespaces) {
    try {
      if (null == namespaces) {
        exports.storage.removeItem('debug');
      } else {
        exports.storage.debug = namespaces;
      }
    } catch(e) {}
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */

  function load() {
    var r;
    try {
      r = exports.storage.debug;
    } catch(e) {}

    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
      r = process.env.DEBUG;
    }

    return r;
  }

  /**
   * Enable namespaces listed in `localStorage.debug` initially.
   */

  exports.enable(load());

  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */

  function localstorage() {
    try {
      return window.localStorage;
    } catch (e) {}
  }
  });
  var browser_1 = browser.log;
  var browser_2 = browser.formatArgs;
  var browser_3 = browser.save;
  var browser_4 = browser.load;
  var browser_5 = browser.useColors;
  var browser_6 = browser.storage;
  var browser_7 = browser.colors;

  /**
   * Module dependencies.
   */


  var debug$1 = browser('socket.io-client:url');

  /**
   * Module exports.
   */

  var url_1 = url;

  /**
   * URL parser.
   *
   * @param {String} url
   * @param {Object} An object meant to mimic window.location.
   *                 Defaults to window.location.
   * @api public
   */

  function url (uri, loc) {
    var obj = uri;

    // default to window.location
    loc = loc || (typeof location !== 'undefined' && location);
    if (null == uri) uri = loc.protocol + '//' + loc.host;

    // relative path support
    if ('string' === typeof uri) {
      if ('/' === uri.charAt(0)) {
        if ('/' === uri.charAt(1)) {
          uri = loc.protocol + uri;
        } else {
          uri = loc.host + uri;
        }
      }

      if (!/^(https?|wss?):\/\//.test(uri)) {
        debug$1('protocol-less url %s', uri);
        if ('undefined' !== typeof loc) {
          uri = loc.protocol + '//' + uri;
        } else {
          uri = 'https://' + uri;
        }
      }

      // parse
      debug$1('parse %s', uri);
      obj = parseuri(uri);
    }

    // make sure we treat `localhost:80` and `localhost` equally
    if (!obj.port) {
      if (/^(http|ws)$/.test(obj.protocol)) {
        obj.port = '80';
      } else if (/^(http|ws)s$/.test(obj.protocol)) {
        obj.port = '443';
      }
    }

    obj.path = obj.path || '/';

    var ipv6 = obj.host.indexOf(':') !== -1;
    var host = ipv6 ? '[' + obj.host + ']' : obj.host;

    // define unique id
    obj.id = obj.protocol + '://' + host + ':' + obj.port;
    // define href
    obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

    return obj;
  }

  var componentEmitter = createCommonjsModule(function (module) {
  /**
   * Expose `Emitter`.
   */

  {
    module.exports = Emitter;
  }

  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */

  function Emitter(obj) {
    if (obj) return mixin(obj);
  }
  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.on =
  Emitter.prototype.addEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
      .push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.once = function(event, fn){
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.off =
  Emitter.prototype.removeListener =
  Emitter.prototype.removeAllListeners =
  Emitter.prototype.removeEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};

    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }

    // specific event
    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;

    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    }

    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */

  Emitter.prototype.emit = function(event){
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1)
      , callbacks = this._callbacks['$' + event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };

  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */

  Emitter.prototype.listeners = function(event){
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };

  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */

  Emitter.prototype.hasListeners = function(event){
    return !! this.listeners(event).length;
  };
  });

  var toString$1 = {}.toString;

  var isarray = Array.isArray || function (arr) {
    return toString$1.call(arr) == '[object Array]';
  };

  var isBuffer$1 = isBuf;

  var withNativeBuffer = typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function';
  var withNativeArrayBuffer = typeof ArrayBuffer === 'function';

  var isView = function (obj) {
    return typeof ArrayBuffer.isView === 'function' ? ArrayBuffer.isView(obj) : (obj.buffer instanceof ArrayBuffer);
  };

  /**
   * Returns true if obj is a buffer or an arraybuffer.
   *
   * @api private
   */

  function isBuf(obj) {
    return (withNativeBuffer && Buffer.isBuffer(obj)) ||
            (withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)));
  }

  /*global Blob,File*/

  /**
   * Module requirements
   */



  var toString$2 = Object.prototype.toString;
  var withNativeBlob = typeof Blob === 'function' || (typeof Blob !== 'undefined' && toString$2.call(Blob) === '[object BlobConstructor]');
  var withNativeFile = typeof File === 'function' || (typeof File !== 'undefined' && toString$2.call(File) === '[object FileConstructor]');

  /**
   * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
   * Anything with blobs or files should be fed through removeBlobs before coming
   * here.
   *
   * @param {Object} packet - socket.io event packet
   * @return {Object} with deconstructed packet and list of buffers
   * @api public
   */

  var deconstructPacket = function(packet) {
    var buffers = [];
    var packetData = packet.data;
    var pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return {packet: pack, buffers: buffers};
  };

  function _deconstructPacket(data, buffers) {
    if (!data) return data;

    if (isBuffer$1(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isarray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i], buffers);
      }
      return newData;
    } else if (typeof data === 'object' && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key], buffers);
      }
      return newData;
    }
    return data;
  }

  /**
   * Reconstructs a binary packet from its placeholder packet and buffers
   *
   * @param {Object} packet - event packet with placeholders
   * @param {Array} buffers - binary buffers to put in placeholder positions
   * @return {Object} reconstructed packet
   * @api public
   */

  var reconstructPacket = function(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful
    return packet;
  };

  function _reconstructPacket(data, buffers) {
    if (!data) return data;

    if (data && data._placeholder) {
      return buffers[data.num]; // appropriate buffer (should be natural order anyway)
    } else if (isarray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i], buffers);
      }
    } else if (typeof data === 'object') {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key], buffers);
      }
    }

    return data;
  }

  /**
   * Asynchronously removes Blobs or Files from data via
   * FileReader's readAsArrayBuffer method. Used before encoding
   * data as msgpack. Calls callback with the blobless data.
   *
   * @param {Object} data
   * @param {Function} callback
   * @api private
   */

  var removeBlobs = function(data, callback) {
    function _removeBlobs(obj, curKey, containingObject) {
      if (!obj) return obj;

      // convert any blob
      if ((withNativeBlob && obj instanceof Blob) ||
          (withNativeFile && obj instanceof File)) {
        pendingBlobs++;

        // async filereader
        var fileReader = new FileReader();
        fileReader.onload = function() { // this.result == arraybuffer
          if (containingObject) {
            containingObject[curKey] = this.result;
          }
          else {
            bloblessData = this.result;
          }

          // if nothing pending its callback time
          if(! --pendingBlobs) {
            callback(bloblessData);
          }
        };

        fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
      } else if (isarray(obj)) { // handle array
        for (var i = 0; i < obj.length; i++) {
          _removeBlobs(obj[i], i, obj);
        }
      } else if (typeof obj === 'object' && !isBuffer$1(obj)) { // and object
        for (var key in obj) {
          _removeBlobs(obj[key], key, obj);
        }
      }
    }

    var pendingBlobs = 0;
    var bloblessData = data;
    _removeBlobs(bloblessData);
    if (!pendingBlobs) {
      callback(bloblessData);
    }
  };

  var binary = {
  	deconstructPacket: deconstructPacket,
  	reconstructPacket: reconstructPacket,
  	removeBlobs: removeBlobs
  };

  var socket_ioParser = createCommonjsModule(function (module, exports) {
  /**
   * Module dependencies.
   */

  var debug = browser('socket.io-parser');





  /**
   * Protocol version.
   *
   * @api public
   */

  exports.protocol = 4;

  /**
   * Packet types.
   *
   * @api public
   */

  exports.types = [
    'CONNECT',
    'DISCONNECT',
    'EVENT',
    'ACK',
    'ERROR',
    'BINARY_EVENT',
    'BINARY_ACK'
  ];

  /**
   * Packet type `connect`.
   *
   * @api public
   */

  exports.CONNECT = 0;

  /**
   * Packet type `disconnect`.
   *
   * @api public
   */

  exports.DISCONNECT = 1;

  /**
   * Packet type `event`.
   *
   * @api public
   */

  exports.EVENT = 2;

  /**
   * Packet type `ack`.
   *
   * @api public
   */

  exports.ACK = 3;

  /**
   * Packet type `error`.
   *
   * @api public
   */

  exports.ERROR = 4;

  /**
   * Packet type 'binary event'
   *
   * @api public
   */

  exports.BINARY_EVENT = 5;

  /**
   * Packet type `binary ack`. For acks with binary arguments.
   *
   * @api public
   */

  exports.BINARY_ACK = 6;

  /**
   * Encoder constructor.
   *
   * @api public
   */

  exports.Encoder = Encoder;

  /**
   * Decoder constructor.
   *
   * @api public
   */

  exports.Decoder = Decoder;

  /**
   * A socket.io Encoder instance
   *
   * @api public
   */

  function Encoder() {}

  var ERROR_PACKET = exports.ERROR + '"encode error"';

  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   * @param {Function} callback - function to handle encodings (likely engine.write)
   * @return Calls callback with Array of encodings
   * @api public
   */

  Encoder.prototype.encode = function(obj, callback){
    debug('encoding packet %j', obj);

    if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
      encodeAsBinary(obj, callback);
    } else {
      var encoding = encodeAsString(obj);
      callback([encoding]);
    }
  };

  /**
   * Encode packet as string.
   *
   * @param {Object} packet
   * @return {String} encoded
   * @api private
   */

  function encodeAsString(obj) {

    // first is type
    var str = '' + obj.type;

    // attachments if we have them
    if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
      str += obj.attachments + '-';
    }

    // if we have a namespace other than `/`
    // we append it followed by a comma `,`
    if (obj.nsp && '/' !== obj.nsp) {
      str += obj.nsp + ',';
    }

    // immediately followed by the id
    if (null != obj.id) {
      str += obj.id;
    }

    // json data
    if (null != obj.data) {
      var payload = tryStringify(obj.data);
      if (payload !== false) {
        str += payload;
      } else {
        return ERROR_PACKET;
      }
    }

    debug('encoded %j as %s', obj, str);
    return str;
  }

  function tryStringify(str) {
    try {
      return JSON.stringify(str);
    } catch(e){
      return false;
    }
  }

  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   *
   * @param {Object} packet
   * @return {Buffer} encoded
   * @api private
   */

  function encodeAsBinary(obj, callback) {

    function writeEncoding(bloblessData) {
      var deconstruction = binary.deconstructPacket(bloblessData);
      var pack = encodeAsString(deconstruction.packet);
      var buffers = deconstruction.buffers;

      buffers.unshift(pack); // add packet info to beginning of data list
      callback(buffers); // write all the buffers
    }

    binary.removeBlobs(obj, writeEncoding);
  }

  /**
   * A socket.io Decoder instance
   *
   * @return {Object} decoder
   * @api public
   */

  function Decoder() {
    this.reconstructor = null;
  }

  /**
   * Mix in `Emitter` with Decoder.
   */

  componentEmitter(Decoder.prototype);

  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   * @return {Object} packet
   * @api public
   */

  Decoder.prototype.add = function(obj) {
    var packet;
    if (typeof obj === 'string') {
      packet = decodeString(obj);
      if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
        this.reconstructor = new BinaryReconstructor(packet);

        // no attachments, labeled binary but no binary data to follow
        if (this.reconstructor.reconPack.attachments === 0) {
          this.emit('decoded', packet);
        }
      } else { // non-binary full packet
        this.emit('decoded', packet);
      }
    } else if (isBuffer$1(obj) || obj.base64) { // raw binary data
      if (!this.reconstructor) {
        throw new Error('got binary data when not reconstructing a packet');
      } else {
        packet = this.reconstructor.takeBinaryData(obj);
        if (packet) { // received final buffer
          this.reconstructor = null;
          this.emit('decoded', packet);
        }
      }
    } else {
      throw new Error('Unknown type: ' + obj);
    }
  };

  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   * @api private
   */

  function decodeString(str) {
    var i = 0;
    // look up type
    var p = {
      type: Number(str.charAt(0))
    };

    if (null == exports.types[p.type]) {
      return error('unknown packet type ' + p.type);
    }

    // look up attachments if type binary
    if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
      var buf = '';
      while (str.charAt(++i) !== '-') {
        buf += str.charAt(i);
        if (i == str.length) break;
      }
      if (buf != Number(buf) || str.charAt(i) !== '-') {
        throw new Error('Illegal attachments');
      }
      p.attachments = Number(buf);
    }

    // look up namespace (if any)
    if ('/' === str.charAt(i + 1)) {
      p.nsp = '';
      while (++i) {
        var c = str.charAt(i);
        if (',' === c) break;
        p.nsp += c;
        if (i === str.length) break;
      }
    } else {
      p.nsp = '/';
    }

    // look up id
    var next = str.charAt(i + 1);
    if ('' !== next && Number(next) == next) {
      p.id = '';
      while (++i) {
        var c = str.charAt(i);
        if (null == c || Number(c) != c) {
          --i;
          break;
        }
        p.id += str.charAt(i);
        if (i === str.length) break;
      }
      p.id = Number(p.id);
    }

    // look up json data
    if (str.charAt(++i)) {
      var payload = tryParse(str.substr(i));
      var isPayloadValid = payload !== false && (p.type === exports.ERROR || isarray(payload));
      if (isPayloadValid) {
        p.data = payload;
      } else {
        return error('invalid payload');
      }
    }

    debug('decoded %s as %j', str, p);
    return p;
  }

  function tryParse(str) {
    try {
      return JSON.parse(str);
    } catch(e){
      return false;
    }
  }

  /**
   * Deallocates a parser's resources
   *
   * @api public
   */

  Decoder.prototype.destroy = function() {
    if (this.reconstructor) {
      this.reconstructor.finishedReconstruction();
    }
  };

  /**
   * A manager of a binary event's 'buffer sequence'. Should
   * be constructed whenever a packet of type BINARY_EVENT is
   * decoded.
   *
   * @param {Object} packet
   * @return {BinaryReconstructor} initialized reconstructor
   * @api private
   */

  function BinaryReconstructor(packet) {
    this.reconPack = packet;
    this.buffers = [];
  }

  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   * @api private
   */

  BinaryReconstructor.prototype.takeBinaryData = function(binData) {
    this.buffers.push(binData);
    if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
      var packet = binary.reconstructPacket(this.reconPack, this.buffers);
      this.finishedReconstruction();
      return packet;
    }
    return null;
  };

  /**
   * Cleans up binary packet reconstruction variables.
   *
   * @api private
   */

  BinaryReconstructor.prototype.finishedReconstruction = function() {
    this.reconPack = null;
    this.buffers = [];
  };

  function error(msg) {
    return {
      type: exports.ERROR,
      data: 'parser error: ' + msg
    };
  }
  });
  var socket_ioParser_1 = socket_ioParser.protocol;
  var socket_ioParser_2 = socket_ioParser.types;
  var socket_ioParser_3 = socket_ioParser.CONNECT;
  var socket_ioParser_4 = socket_ioParser.DISCONNECT;
  var socket_ioParser_5 = socket_ioParser.EVENT;
  var socket_ioParser_6 = socket_ioParser.ACK;
  var socket_ioParser_7 = socket_ioParser.ERROR;
  var socket_ioParser_8 = socket_ioParser.BINARY_EVENT;
  var socket_ioParser_9 = socket_ioParser.BINARY_ACK;
  var socket_ioParser_10 = socket_ioParser.Encoder;
  var socket_ioParser_11 = socket_ioParser.Decoder;

  var hasCors = createCommonjsModule(function (module) {
  /**
   * Module exports.
   *
   * Logic borrowed from Modernizr:
   *
   *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
   */

  try {
    module.exports = typeof XMLHttpRequest !== 'undefined' &&
      'withCredentials' in new XMLHttpRequest();
  } catch (err) {
    // if XMLHttp support is disabled in IE then it will throw
    // when trying to create
    module.exports = false;
  }
  });

  // browser shim for xmlhttprequest module



  var xmlhttprequest = function (opts) {
    var xdomain = opts.xdomain;

    // scheme must be same when usign XDomainRequest
    // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
    var xscheme = opts.xscheme;

    // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
    // https://github.com/Automattic/engine.io-client/pull/217
    var enablesXDR = opts.enablesXDR;

    // XMLHttpRequest can be disabled on IE
    try {
      if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCors)) {
        return new XMLHttpRequest();
      }
    } catch (e) { }

    // Use XDomainRequest for IE8 if enablesXDR is true
    // because loading bar keeps flashing when using jsonp-polling
    // https://github.com/yujiosaka/socke.io-ie8-loading-example
    try {
      if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
        return new XDomainRequest();
      }
    } catch (e) { }

    if (!xdomain) {
      try {
        return new self[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
      } catch (e) { }
    }
  };

  /**
   * Gets the keys for an object.
   *
   * @return {Array} keys
   * @api private
   */

  var keys = Object.keys || function keys (obj){
    var arr = [];
    var has = Object.prototype.hasOwnProperty;

    for (var i in obj) {
      if (has.call(obj, i)) {
        arr.push(i);
      }
    }
    return arr;
  };

  /* global Blob File */

  /*
   * Module requirements.
   */



  var toString$3 = Object.prototype.toString;
  var withNativeBlob$1 = typeof Blob === 'function' ||
                          typeof Blob !== 'undefined' && toString$3.call(Blob) === '[object BlobConstructor]';
  var withNativeFile$1 = typeof File === 'function' ||
                          typeof File !== 'undefined' && toString$3.call(File) === '[object FileConstructor]';

  /**
   * Module exports.
   */

  var hasBinary2 = hasBinary;

  /**
   * Checks for binary data.
   *
   * Supports Buffer, ArrayBuffer, Blob and File.
   *
   * @param {Object} anything
   * @api public
   */

  function hasBinary (obj) {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (isarray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (hasBinary(obj[i])) {
          return true;
        }
      }
      return false;
    }

    if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
      (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
      (withNativeBlob$1 && obj instanceof Blob) ||
      (withNativeFile$1 && obj instanceof File)
    ) {
      return true;
    }

    // see: https://github.com/Automattic/has-binary/pull/4
    if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
      return hasBinary(obj.toJSON(), true);
    }

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
        return true;
      }
    }

    return false;
  }

  /**
   * An abstraction for slicing an arraybuffer even when
   * ArrayBuffer.prototype.slice is not supported
   *
   * @api public
   */

  var arraybuffer_slice = function(arraybuffer, start, end) {
    var bytes = arraybuffer.byteLength;
    start = start || 0;
    end = end || bytes;

    if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

    if (start < 0) { start += bytes; }
    if (end < 0) { end += bytes; }
    if (end > bytes) { end = bytes; }

    if (start >= bytes || start >= end || bytes === 0) {
      return new ArrayBuffer(0);
    }

    var abv = new Uint8Array(arraybuffer);
    var result = new Uint8Array(end - start);
    for (var i = start, ii = 0; i < end; i++, ii++) {
      result[ii] = abv[i];
    }
    return result.buffer;
  };

  var after_1 = after;

  function after(count, callback, err_cb) {
      var bail = false;
      err_cb = err_cb || noop;
      proxy.count = count;

      return (count === 0) ? callback() : proxy

      function proxy(err, result) {
          if (proxy.count <= 0) {
              throw new Error('after called too many times')
          }
          --proxy.count;

          // after first error, rest are passed to err_cb
          if (err) {
              bail = true;
              callback(err);
              // future error callbacks will go to error handler
              callback = err_cb;
          } else if (proxy.count === 0 && !bail) {
              callback(null, result);
          }
      }
  }

  function noop() {}

  /*! https://mths.be/utf8js v2.1.2 by @mathias */

  var stringFromCharCode = String.fromCharCode;

  // Taken from https://mths.be/punycode
  function ucs2decode(string) {
  	var output = [];
  	var counter = 0;
  	var length = string.length;
  	var value;
  	var extra;
  	while (counter < length) {
  		value = string.charCodeAt(counter++);
  		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
  			// high surrogate, and there is a next character
  			extra = string.charCodeAt(counter++);
  			if ((extra & 0xFC00) == 0xDC00) { // low surrogate
  				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
  			} else {
  				// unmatched surrogate; only append this code unit, in case the next
  				// code unit is the high surrogate of a surrogate pair
  				output.push(value);
  				counter--;
  			}
  		} else {
  			output.push(value);
  		}
  	}
  	return output;
  }

  // Taken from https://mths.be/punycode
  function ucs2encode(array) {
  	var length = array.length;
  	var index = -1;
  	var value;
  	var output = '';
  	while (++index < length) {
  		value = array[index];
  		if (value > 0xFFFF) {
  			value -= 0x10000;
  			output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
  			value = 0xDC00 | value & 0x3FF;
  		}
  		output += stringFromCharCode(value);
  	}
  	return output;
  }

  function checkScalarValue(codePoint, strict) {
  	if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
  		if (strict) {
  			throw Error(
  				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
  				' is not a scalar value'
  			);
  		}
  		return false;
  	}
  	return true;
  }
  /*--------------------------------------------------------------------------*/

  function createByte(codePoint, shift) {
  	return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
  }

  function encodeCodePoint(codePoint, strict) {
  	if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
  		return stringFromCharCode(codePoint);
  	}
  	var symbol = '';
  	if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
  		symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
  	}
  	else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
  		if (!checkScalarValue(codePoint, strict)) {
  			codePoint = 0xFFFD;
  		}
  		symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
  		symbol += createByte(codePoint, 6);
  	}
  	else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
  		symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
  		symbol += createByte(codePoint, 12);
  		symbol += createByte(codePoint, 6);
  	}
  	symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
  	return symbol;
  }

  function utf8encode(string, opts) {
  	opts = opts || {};
  	var strict = false !== opts.strict;

  	var codePoints = ucs2decode(string);
  	var length = codePoints.length;
  	var index = -1;
  	var codePoint;
  	var byteString = '';
  	while (++index < length) {
  		codePoint = codePoints[index];
  		byteString += encodeCodePoint(codePoint, strict);
  	}
  	return byteString;
  }

  /*--------------------------------------------------------------------------*/

  function readContinuationByte() {
  	if (byteIndex >= byteCount) {
  		throw Error('Invalid byte index');
  	}

  	var continuationByte = byteArray[byteIndex] & 0xFF;
  	byteIndex++;

  	if ((continuationByte & 0xC0) == 0x80) {
  		return continuationByte & 0x3F;
  	}

  	// If we end up here, it’s not a continuation byte
  	throw Error('Invalid continuation byte');
  }

  function decodeSymbol(strict) {
  	var byte1;
  	var byte2;
  	var byte3;
  	var byte4;
  	var codePoint;

  	if (byteIndex > byteCount) {
  		throw Error('Invalid byte index');
  	}

  	if (byteIndex == byteCount) {
  		return false;
  	}

  	// Read first byte
  	byte1 = byteArray[byteIndex] & 0xFF;
  	byteIndex++;

  	// 1-byte sequence (no continuation bytes)
  	if ((byte1 & 0x80) == 0) {
  		return byte1;
  	}

  	// 2-byte sequence
  	if ((byte1 & 0xE0) == 0xC0) {
  		byte2 = readContinuationByte();
  		codePoint = ((byte1 & 0x1F) << 6) | byte2;
  		if (codePoint >= 0x80) {
  			return codePoint;
  		} else {
  			throw Error('Invalid continuation byte');
  		}
  	}

  	// 3-byte sequence (may include unpaired surrogates)
  	if ((byte1 & 0xF0) == 0xE0) {
  		byte2 = readContinuationByte();
  		byte3 = readContinuationByte();
  		codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
  		if (codePoint >= 0x0800) {
  			return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
  		} else {
  			throw Error('Invalid continuation byte');
  		}
  	}

  	// 4-byte sequence
  	if ((byte1 & 0xF8) == 0xF0) {
  		byte2 = readContinuationByte();
  		byte3 = readContinuationByte();
  		byte4 = readContinuationByte();
  		codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
  			(byte3 << 0x06) | byte4;
  		if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
  			return codePoint;
  		}
  	}

  	throw Error('Invalid UTF-8 detected');
  }

  var byteArray;
  var byteCount;
  var byteIndex;
  function utf8decode(byteString, opts) {
  	opts = opts || {};
  	var strict = false !== opts.strict;

  	byteArray = ucs2decode(byteString);
  	byteCount = byteArray.length;
  	byteIndex = 0;
  	var codePoints = [];
  	var tmp;
  	while ((tmp = decodeSymbol(strict)) !== false) {
  		codePoints.push(tmp);
  	}
  	return ucs2encode(codePoints);
  }

  var utf8 = {
  	version: '2.1.2',
  	encode: utf8encode,
  	decode: utf8decode
  };

  var base64Arraybuffer = createCommonjsModule(function (module, exports) {
  /*
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */
  (function(){

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    // Use a lookup table to find the index.
    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }

    exports.encode = function(arraybuffer) {
      var bytes = new Uint8Array(arraybuffer),
      i, len = bytes.length, base64 = "";

      for (i = 0; i < len; i+=3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
      }

      if ((len % 3) === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
      } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
      }

      return base64;
    };

    exports.decode =  function(base64) {
      var bufferLength = base64.length * 0.75,
      len = base64.length, i, p = 0,
      encoded1, encoded2, encoded3, encoded4;

      if (base64[base64.length - 1] === "=") {
        bufferLength--;
        if (base64[base64.length - 2] === "=") {
          bufferLength--;
        }
      }

      var arraybuffer = new ArrayBuffer(bufferLength),
      bytes = new Uint8Array(arraybuffer);

      for (i = 0; i < len; i+=4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i+1)];
        encoded3 = lookup[base64.charCodeAt(i+2)];
        encoded4 = lookup[base64.charCodeAt(i+3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
      }

      return arraybuffer;
    };
  })();
  });
  var base64Arraybuffer_1 = base64Arraybuffer.encode;
  var base64Arraybuffer_2 = base64Arraybuffer.decode;

  /**
   * Create a blob builder even when vendor prefixes exist
   */

  var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
    typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
    typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
    typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
    false;

  /**
   * Check if Blob constructor is supported
   */

  var blobSupported = (function() {
    try {
      var a = new Blob(['hi']);
      return a.size === 2;
    } catch(e) {
      return false;
    }
  })();

  /**
   * Check if Blob constructor supports ArrayBufferViews
   * Fails in Safari 6, so we need to map to ArrayBuffers there.
   */

  var blobSupportsArrayBufferView = blobSupported && (function() {
    try {
      var b = new Blob([new Uint8Array([1,2])]);
      return b.size === 2;
    } catch(e) {
      return false;
    }
  })();

  /**
   * Check if BlobBuilder is supported
   */

  var blobBuilderSupported = BlobBuilder
    && BlobBuilder.prototype.append
    && BlobBuilder.prototype.getBlob;

  /**
   * Helper function that maps ArrayBufferViews to ArrayBuffers
   * Used by BlobBuilder constructor and old browsers that didn't
   * support it in the Blob constructor.
   */

  function mapArrayBufferViews(ary) {
    return ary.map(function(chunk) {
      if (chunk.buffer instanceof ArrayBuffer) {
        var buf = chunk.buffer;

        // if this is a subarray, make a copy so we only
        // include the subarray region from the underlying buffer
        if (chunk.byteLength !== buf.byteLength) {
          var copy = new Uint8Array(chunk.byteLength);
          copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
          buf = copy.buffer;
        }

        return buf;
      }

      return chunk;
    });
  }

  function BlobBuilderConstructor(ary, options) {
    options = options || {};

    var bb = new BlobBuilder();
    mapArrayBufferViews(ary).forEach(function(part) {
      bb.append(part);
    });

    return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
  }
  function BlobConstructor(ary, options) {
    return new Blob(mapArrayBufferViews(ary), options || {});
  }
  if (typeof Blob !== 'undefined') {
    BlobBuilderConstructor.prototype = Blob.prototype;
    BlobConstructor.prototype = Blob.prototype;
  }

  var blob = (function() {
    if (blobSupported) {
      return blobSupportsArrayBufferView ? Blob : BlobConstructor;
    } else if (blobBuilderSupported) {
      return BlobBuilderConstructor;
    } else {
      return undefined;
    }
  })();

  var browser$1 = createCommonjsModule(function (module, exports) {
  /**
   * Module dependencies.
   */







  var base64encoder;
  if (typeof ArrayBuffer !== 'undefined') {
    base64encoder = base64Arraybuffer;
  }

  /**
   * Check if we are running an android browser. That requires us to use
   * ArrayBuffer with polling transports...
   *
   * http://ghinda.net/jpeg-blob-ajax-android/
   */

  var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

  /**
   * Check if we are running in PhantomJS.
   * Uploading a Blob with PhantomJS does not work correctly, as reported here:
   * https://github.com/ariya/phantomjs/issues/11395
   * @type boolean
   */
  var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

  /**
   * When true, avoids using Blobs to encode payloads.
   * @type boolean
   */
  var dontSendBlobs = isAndroid || isPhantomJS;

  /**
   * Current protocol version.
   */

  exports.protocol = 3;

  /**
   * Packet types.
   */

  var packets = exports.packets = {
      open:     0    // non-ws
    , close:    1    // non-ws
    , ping:     2
    , pong:     3
    , message:  4
    , upgrade:  5
    , noop:     6
  };

  var packetslist = keys(packets);

  /**
   * Premade error packet.
   */

  var err = { type: 'error', data: 'parser error' };

  /**
   * Create a blob api even for blob builder when vendor prefixes exist
   */



  /**
   * Encodes a packet.
   *
   *     <packet type id> [ <data> ]
   *
   * Example:
   *
   *     5hello world
   *     3
   *     4
   *
   * Binary is encoded in an identical principle
   *
   * @api private
   */

  exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
    if (typeof supportsBinary === 'function') {
      callback = supportsBinary;
      supportsBinary = false;
    }

    if (typeof utf8encode === 'function') {
      callback = utf8encode;
      utf8encode = null;
    }

    var data = (packet.data === undefined)
      ? undefined
      : packet.data.buffer || packet.data;

    if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
      return encodeArrayBuffer(packet, supportsBinary, callback);
    } else if (typeof blob !== 'undefined' && data instanceof blob) {
      return encodeBlob(packet, supportsBinary, callback);
    }

    // might be an object with { base64: true, data: dataAsBase64String }
    if (data && data.base64) {
      return encodeBase64Object(packet, callback);
    }

    // Sending data as a utf-8 string
    var encoded = packets[packet.type];

    // data fragment is optional
    if (undefined !== packet.data) {
      encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
    }

    return callback('' + encoded);

  };

  function encodeBase64Object(packet, callback) {
    // packet data is an object { base64: true, data: dataAsBase64String }
    var message = 'b' + exports.packets[packet.type] + packet.data.data;
    return callback(message);
  }

  /**
   * Encode packet helpers for binary types
   */

  function encodeArrayBuffer(packet, supportsBinary, callback) {
    if (!supportsBinary) {
      return exports.encodeBase64Packet(packet, callback);
    }

    var data = packet.data;
    var contentArray = new Uint8Array(data);
    var resultBuffer = new Uint8Array(1 + data.byteLength);

    resultBuffer[0] = packets[packet.type];
    for (var i = 0; i < contentArray.length; i++) {
      resultBuffer[i+1] = contentArray[i];
    }

    return callback(resultBuffer.buffer);
  }

  function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
    if (!supportsBinary) {
      return exports.encodeBase64Packet(packet, callback);
    }

    var fr = new FileReader();
    fr.onload = function() {
      exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
    };
    return fr.readAsArrayBuffer(packet.data);
  }

  function encodeBlob(packet, supportsBinary, callback) {
    if (!supportsBinary) {
      return exports.encodeBase64Packet(packet, callback);
    }

    if (dontSendBlobs) {
      return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
    }

    var length = new Uint8Array(1);
    length[0] = packets[packet.type];
    var blob$1 = new blob([length.buffer, packet.data]);

    return callback(blob$1);
  }

  /**
   * Encodes a packet with binary data in a base64 string
   *
   * @param {Object} packet, has `type` and `data`
   * @return {String} base64 encoded message
   */

  exports.encodeBase64Packet = function(packet, callback) {
    var message = 'b' + exports.packets[packet.type];
    if (typeof blob !== 'undefined' && packet.data instanceof blob) {
      var fr = new FileReader();
      fr.onload = function() {
        var b64 = fr.result.split(',')[1];
        callback(message + b64);
      };
      return fr.readAsDataURL(packet.data);
    }

    var b64data;
    try {
      b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
    } catch (e) {
      // iPhone Safari doesn't let you apply with typed arrays
      var typed = new Uint8Array(packet.data);
      var basic = new Array(typed.length);
      for (var i = 0; i < typed.length; i++) {
        basic[i] = typed[i];
      }
      b64data = String.fromCharCode.apply(null, basic);
    }
    message += btoa(b64data);
    return callback(message);
  };

  /**
   * Decodes a packet. Changes format to Blob if requested.
   *
   * @return {Object} with `type` and `data` (if any)
   * @api private
   */

  exports.decodePacket = function (data, binaryType, utf8decode) {
    if (data === undefined) {
      return err;
    }
    // String data
    if (typeof data === 'string') {
      if (data.charAt(0) === 'b') {
        return exports.decodeBase64Packet(data.substr(1), binaryType);
      }

      if (utf8decode) {
        data = tryDecode(data);
        if (data === false) {
          return err;
        }
      }
      var type = data.charAt(0);

      if (Number(type) != type || !packetslist[type]) {
        return err;
      }

      if (data.length > 1) {
        return { type: packetslist[type], data: data.substring(1) };
      } else {
        return { type: packetslist[type] };
      }
    }

    var asArray = new Uint8Array(data);
    var type = asArray[0];
    var rest = arraybuffer_slice(data, 1);
    if (blob && binaryType === 'blob') {
      rest = new blob([rest]);
    }
    return { type: packetslist[type], data: rest };
  };

  function tryDecode(data) {
    try {
      data = utf8.decode(data, { strict: false });
    } catch (e) {
      return false;
    }
    return data;
  }

  /**
   * Decodes a packet encoded in a base64 string
   *
   * @param {String} base64 encoded message
   * @return {Object} with `type` and `data` (if any)
   */

  exports.decodeBase64Packet = function(msg, binaryType) {
    var type = packetslist[msg.charAt(0)];
    if (!base64encoder) {
      return { type: type, data: { base64: true, data: msg.substr(1) } };
    }

    var data = base64encoder.decode(msg.substr(1));

    if (binaryType === 'blob' && blob) {
      data = new blob([data]);
    }

    return { type: type, data: data };
  };

  /**
   * Encodes multiple messages (payload).
   *
   *     <length>:data
   *
   * Example:
   *
   *     11:hello world2:hi
   *
   * If any contents are binary, they will be encoded as base64 strings. Base64
   * encoded strings are marked with a b before the length specifier
   *
   * @param {Array} packets
   * @api private
   */

  exports.encodePayload = function (packets, supportsBinary, callback) {
    if (typeof supportsBinary === 'function') {
      callback = supportsBinary;
      supportsBinary = null;
    }

    var isBinary = hasBinary2(packets);

    if (supportsBinary && isBinary) {
      if (blob && !dontSendBlobs) {
        return exports.encodePayloadAsBlob(packets, callback);
      }

      return exports.encodePayloadAsArrayBuffer(packets, callback);
    }

    if (!packets.length) {
      return callback('0:');
    }

    function setLengthHeader(message) {
      return message.length + ':' + message;
    }

    function encodeOne(packet, doneCallback) {
      exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
        doneCallback(null, setLengthHeader(message));
      });
    }

    map(packets, encodeOne, function(err, results) {
      return callback(results.join(''));
    });
  };

  /**
   * Async array map using after
   */

  function map(ary, each, done) {
    var result = new Array(ary.length);
    var next = after_1(ary.length, done);

    var eachWithIndex = function(i, el, cb) {
      each(el, function(error, msg) {
        result[i] = msg;
        cb(error, result);
      });
    };

    for (var i = 0; i < ary.length; i++) {
      eachWithIndex(i, ary[i], next);
    }
  }

  /*
   * Decodes data when a payload is maybe expected. Possible binary contents are
   * decoded from their base64 representation
   *
   * @param {String} data, callback method
   * @api public
   */

  exports.decodePayload = function (data, binaryType, callback) {
    if (typeof data !== 'string') {
      return exports.decodePayloadAsBinary(data, binaryType, callback);
    }

    if (typeof binaryType === 'function') {
      callback = binaryType;
      binaryType = null;
    }

    var packet;
    if (data === '') {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    var length = '', n, msg;

    for (var i = 0, l = data.length; i < l; i++) {
      var chr = data.charAt(i);

      if (chr !== ':') {
        length += chr;
        continue;
      }

      if (length === '' || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, false);

        if (err.type === packet.type && err.data === packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }

    if (length !== '') {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

  };

  /**
   * Encodes multiple messages (payload) as binary.
   *
   * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
   * 255><data>
   *
   * Example:
   * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
   *
   * @param {Array} packets
   * @return {ArrayBuffer} encoded payload
   * @api private
   */

  exports.encodePayloadAsArrayBuffer = function(packets, callback) {
    if (!packets.length) {
      return callback(new ArrayBuffer(0));
    }

    function encodeOne(packet, doneCallback) {
      exports.encodePacket(packet, true, true, function(data) {
        return doneCallback(null, data);
      });
    }

    map(packets, encodeOne, function(err, encodedPackets) {
      var totalLength = encodedPackets.reduce(function(acc, p) {
        var len;
        if (typeof p === 'string'){
          len = p.length;
        } else {
          len = p.byteLength;
        }
        return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
      }, 0);

      var resultArray = new Uint8Array(totalLength);

      var bufferIndex = 0;
      encodedPackets.forEach(function(p) {
        var isString = typeof p === 'string';
        var ab = p;
        if (isString) {
          var view = new Uint8Array(p.length);
          for (var i = 0; i < p.length; i++) {
            view[i] = p.charCodeAt(i);
          }
          ab = view.buffer;
        }

        if (isString) { // not true binary
          resultArray[bufferIndex++] = 0;
        } else { // true binary
          resultArray[bufferIndex++] = 1;
        }

        var lenStr = ab.byteLength.toString();
        for (var i = 0; i < lenStr.length; i++) {
          resultArray[bufferIndex++] = parseInt(lenStr[i]);
        }
        resultArray[bufferIndex++] = 255;

        var view = new Uint8Array(ab);
        for (var i = 0; i < view.length; i++) {
          resultArray[bufferIndex++] = view[i];
        }
      });

      return callback(resultArray.buffer);
    });
  };

  /**
   * Encode as Blob
   */

  exports.encodePayloadAsBlob = function(packets, callback) {
    function encodeOne(packet, doneCallback) {
      exports.encodePacket(packet, true, true, function(encoded) {
        var binaryIdentifier = new Uint8Array(1);
        binaryIdentifier[0] = 1;
        if (typeof encoded === 'string') {
          var view = new Uint8Array(encoded.length);
          for (var i = 0; i < encoded.length; i++) {
            view[i] = encoded.charCodeAt(i);
          }
          encoded = view.buffer;
          binaryIdentifier[0] = 0;
        }

        var len = (encoded instanceof ArrayBuffer)
          ? encoded.byteLength
          : encoded.size;

        var lenStr = len.toString();
        var lengthAry = new Uint8Array(lenStr.length + 1);
        for (var i = 0; i < lenStr.length; i++) {
          lengthAry[i] = parseInt(lenStr[i]);
        }
        lengthAry[lenStr.length] = 255;

        if (blob) {
          var blob$1 = new blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
          doneCallback(null, blob$1);
        }
      });
    }

    map(packets, encodeOne, function(err, results) {
      return callback(new blob(results));
    });
  };

  /*
   * Decodes data when a payload is maybe expected. Strings are decoded by
   * interpreting each byte as a key code for entries marked to start with 0. See
   * description of encodePayloadAsBinary
   *
   * @param {ArrayBuffer} data, callback method
   * @api public
   */

  exports.decodePayloadAsBinary = function (data, binaryType, callback) {
    if (typeof binaryType === 'function') {
      callback = binaryType;
      binaryType = null;
    }

    var bufferTail = data;
    var buffers = [];

    while (bufferTail.byteLength > 0) {
      var tailArray = new Uint8Array(bufferTail);
      var isString = tailArray[0] === 0;
      var msgLength = '';

      for (var i = 1; ; i++) {
        if (tailArray[i] === 255) break;

        // 310 = char length of Number.MAX_VALUE
        if (msgLength.length > 310) {
          return callback(err, 0, 1);
        }

        msgLength += tailArray[i];
      }

      bufferTail = arraybuffer_slice(bufferTail, 2 + msgLength.length);
      msgLength = parseInt(msgLength);

      var msg = arraybuffer_slice(bufferTail, 0, msgLength);
      if (isString) {
        try {
          msg = String.fromCharCode.apply(null, new Uint8Array(msg));
        } catch (e) {
          // iPhone Safari doesn't let you apply to typed arrays
          var typed = new Uint8Array(msg);
          msg = '';
          for (var i = 0; i < typed.length; i++) {
            msg += String.fromCharCode(typed[i]);
          }
        }
      }

      buffers.push(msg);
      bufferTail = arraybuffer_slice(bufferTail, msgLength);
    }

    var total = buffers.length;
    buffers.forEach(function(buffer, i) {
      callback(exports.decodePacket(buffer, binaryType, true), i, total);
    });
  };
  });
  var browser_1$1 = browser$1.protocol;
  var browser_2$1 = browser$1.packets;
  var browser_3$1 = browser$1.encodePacket;
  var browser_4$1 = browser$1.encodeBase64Packet;
  var browser_5$1 = browser$1.decodePacket;
  var browser_6$1 = browser$1.decodeBase64Packet;
  var browser_7$1 = browser$1.encodePayload;
  var browser_8 = browser$1.decodePayload;
  var browser_9 = browser$1.encodePayloadAsArrayBuffer;
  var browser_10 = browser$1.encodePayloadAsBlob;
  var browser_11 = browser$1.decodePayloadAsBinary;

  /**
   * Module dependencies.
   */




  /**
   * Module exports.
   */

  var transport = Transport;

  /**
   * Transport abstract constructor.
   *
   * @param {Object} options.
   * @api private
   */

  function Transport (opts) {
    this.path = opts.path;
    this.hostname = opts.hostname;
    this.port = opts.port;
    this.secure = opts.secure;
    this.query = opts.query;
    this.timestampParam = opts.timestampParam;
    this.timestampRequests = opts.timestampRequests;
    this.readyState = '';
    this.agent = opts.agent || false;
    this.socket = opts.socket;
    this.enablesXDR = opts.enablesXDR;

    // SSL options for Node.js client
    this.pfx = opts.pfx;
    this.key = opts.key;
    this.passphrase = opts.passphrase;
    this.cert = opts.cert;
    this.ca = opts.ca;
    this.ciphers = opts.ciphers;
    this.rejectUnauthorized = opts.rejectUnauthorized;
    this.forceNode = opts.forceNode;

    // results of ReactNative environment detection
    this.isReactNative = opts.isReactNative;

    // other options for Node.js client
    this.extraHeaders = opts.extraHeaders;
    this.localAddress = opts.localAddress;
  }

  /**
   * Mix in `Emitter`.
   */

  componentEmitter(Transport.prototype);

  /**
   * Emits an error.
   *
   * @param {String} str
   * @return {Transport} for chaining
   * @api public
   */

  Transport.prototype.onError = function (msg, desc) {
    var err = new Error(msg);
    err.type = 'TransportError';
    err.description = desc;
    this.emit('error', err);
    return this;
  };

  /**
   * Opens the transport.
   *
   * @api public
   */

  Transport.prototype.open = function () {
    if ('closed' === this.readyState || '' === this.readyState) {
      this.readyState = 'opening';
      this.doOpen();
    }

    return this;
  };

  /**
   * Closes the transport.
   *
   * @api private
   */

  Transport.prototype.close = function () {
    if ('opening' === this.readyState || 'open' === this.readyState) {
      this.doClose();
      this.onClose();
    }

    return this;
  };

  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   * @api private
   */

  Transport.prototype.send = function (packets) {
    if ('open' === this.readyState) {
      this.write(packets);
    } else {
      throw new Error('Transport not open');
    }
  };

  /**
   * Called upon open
   *
   * @api private
   */

  Transport.prototype.onOpen = function () {
    this.readyState = 'open';
    this.writable = true;
    this.emit('open');
  };

  /**
   * Called with data.
   *
   * @param {String} data
   * @api private
   */

  Transport.prototype.onData = function (data) {
    var packet = browser$1.decodePacket(data, this.socket.binaryType);
    this.onPacket(packet);
  };

  /**
   * Called with a decoded packet.
   */

  Transport.prototype.onPacket = function (packet) {
    this.emit('packet', packet);
  };

  /**
   * Called upon close.
   *
   * @api private
   */

  Transport.prototype.onClose = function () {
    this.readyState = 'closed';
    this.emit('close');
  };

  /**
   * Compiles a querystring
   * Returns string representation of the object
   *
   * @param {Object}
   * @api private
   */

  var encode$1 = function (obj) {
    var str = '';

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (str.length) str += '&';
        str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
      }
    }

    return str;
  };

  /**
   * Parses a simple querystring into an object
   *
   * @param {String} qs
   * @api private
   */

  var decode = function(qs){
    var qry = {};
    var pairs = qs.split('&');
    for (var i = 0, l = pairs.length; i < l; i++) {
      var pair = pairs[i].split('=');
      qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
  };

  var parseqs = {
  	encode: encode$1,
  	decode: decode
  };

  var componentInherit = function(a, b){
    var fn = function(){};
    fn.prototype = b.prototype;
    a.prototype = new fn;
    a.prototype.constructor = a;
  };

  var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
    , length = 64
    , map = {}
    , seed = 0
    , i = 0
    , prev;

  /**
   * Return a string representing the specified number.
   *
   * @param {Number} num The number to convert.
   * @returns {String} The string representation of the number.
   * @api public
   */
  function encode$2(num) {
    var encoded = '';

    do {
      encoded = alphabet[num % length] + encoded;
      num = Math.floor(num / length);
    } while (num > 0);

    return encoded;
  }

  /**
   * Return the integer value specified by the given string.
   *
   * @param {String} str The string to convert.
   * @returns {Number} The integer value represented by the string.
   * @api public
   */
  function decode$1(str) {
    var decoded = 0;

    for (i = 0; i < str.length; i++) {
      decoded = decoded * length + map[str.charAt(i)];
    }

    return decoded;
  }

  /**
   * Yeast: A tiny growing id generator.
   *
   * @returns {String} A unique id.
   * @api public
   */
  function yeast() {
    var now = encode$2(+new Date());

    if (now !== prev) return seed = 0, prev = now;
    return now +'.'+ encode$2(seed++);
  }

  //
  // Map each character to its index.
  //
  for (; i < length; i++) map[alphabet[i]] = i;

  //
  // Expose the `yeast`, `encode` and `decode` functions.
  //
  yeast.encode = encode$2;
  yeast.decode = decode$1;
  var yeast_1 = yeast;

  /**
   * Module dependencies.
   */






  var debug$2 = browser('engine.io-client:polling');

  /**
   * Module exports.
   */

  var polling = Polling;

  /**
   * Is XHR2 supported?
   */

  var hasXHR2 = (function () {
    var XMLHttpRequest = xmlhttprequest;
    var xhr = new XMLHttpRequest({ xdomain: false });
    return null != xhr.responseType;
  })();

  /**
   * Polling interface.
   *
   * @param {Object} opts
   * @api private
   */

  function Polling (opts) {
    var forceBase64 = (opts && opts.forceBase64);
    if (!hasXHR2 || forceBase64) {
      this.supportsBinary = false;
    }
    transport.call(this, opts);
  }

  /**
   * Inherits from Transport.
   */

  componentInherit(Polling, transport);

  /**
   * Transport name.
   */

  Polling.prototype.name = 'polling';

  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @api private
   */

  Polling.prototype.doOpen = function () {
    this.poll();
  };

  /**
   * Pauses polling.
   *
   * @param {Function} callback upon buffers are flushed and transport is paused
   * @api private
   */

  Polling.prototype.pause = function (onPause) {
    var self = this;

    this.readyState = 'pausing';

    function pause () {
      debug$2('paused');
      self.readyState = 'paused';
      onPause();
    }

    if (this.polling || !this.writable) {
      var total = 0;

      if (this.polling) {
        debug$2('we are currently polling - waiting to pause');
        total++;
        this.once('pollComplete', function () {
          debug$2('pre-pause polling complete');
          --total || pause();
        });
      }

      if (!this.writable) {
        debug$2('we are currently writing - waiting to pause');
        total++;
        this.once('drain', function () {
          debug$2('pre-pause writing complete');
          --total || pause();
        });
      }
    } else {
      pause();
    }
  };

  /**
   * Starts polling cycle.
   *
   * @api public
   */

  Polling.prototype.poll = function () {
    debug$2('polling');
    this.polling = true;
    this.doPoll();
    this.emit('poll');
  };

  /**
   * Overloads onData to detect payloads.
   *
   * @api private
   */

  Polling.prototype.onData = function (data) {
    var self = this;
    debug$2('polling got data %s', data);
    var callback = function (packet, index, total) {
      // if its the first message we consider the transport open
      if ('opening' === self.readyState) {
        self.onOpen();
      }

      // if its a close packet, we close the ongoing requests
      if ('close' === packet.type) {
        self.onClose();
        return false;
      }

      // otherwise bypass onData and handle the message
      self.onPacket(packet);
    };

    // decode payload
    browser$1.decodePayload(data, this.socket.binaryType, callback);

    // if an event did not trigger closing
    if ('closed' !== this.readyState) {
      // if we got data we're not polling
      this.polling = false;
      this.emit('pollComplete');

      if ('open' === this.readyState) {
        this.poll();
      } else {
        debug$2('ignoring poll - transport state "%s"', this.readyState);
      }
    }
  };

  /**
   * For polling, send a close packet.
   *
   * @api private
   */

  Polling.prototype.doClose = function () {
    var self = this;

    function close () {
      debug$2('writing close packet');
      self.write([{ type: 'close' }]);
    }

    if ('open' === this.readyState) {
      debug$2('transport open - closing');
      close();
    } else {
      // in case we're trying to close while
      // handshaking is in progress (GH-164)
      debug$2('transport not open - deferring close');
      this.once('open', close);
    }
  };

  /**
   * Writes a packets payload.
   *
   * @param {Array} data packets
   * @param {Function} drain callback
   * @api private
   */

  Polling.prototype.write = function (packets) {
    var self = this;
    this.writable = false;
    var callbackfn = function () {
      self.writable = true;
      self.emit('drain');
    };

    browser$1.encodePayload(packets, this.supportsBinary, function (data) {
      self.doWrite(data, callbackfn);
    });
  };

  /**
   * Generates uri for connection.
   *
   * @api private
   */

  Polling.prototype.uri = function () {
    var query = this.query || {};
    var schema = this.secure ? 'https' : 'http';
    var port = '';

    // cache busting is forced
    if (false !== this.timestampRequests) {
      query[this.timestampParam] = yeast_1();
    }

    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }

    query = parseqs.encode(query);

    // avoid port if default for schema
    if (this.port && (('https' === schema && Number(this.port) !== 443) ||
       ('http' === schema && Number(this.port) !== 80))) {
      port = ':' + this.port;
    }

    // prepend ? to query
    if (query.length) {
      query = '?' + query;
    }

    var ipv6 = this.hostname.indexOf(':') !== -1;
    return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
  };

  /* global attachEvent */

  /**
   * Module requirements.
   */





  var debug$3 = browser('engine.io-client:polling-xhr');

  /**
   * Module exports.
   */

  var pollingXhr = XHR;
  var Request_1 = Request;

  /**
   * Empty function
   */

  function empty () {}

  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @api public
   */

  function XHR (opts) {
    polling.call(this, opts);
    this.requestTimeout = opts.requestTimeout;
    this.extraHeaders = opts.extraHeaders;

    if (typeof location !== 'undefined') {
      var isSSL = 'https:' === location.protocol;
      var port = location.port;

      // some user agents have empty `location.port`
      if (!port) {
        port = isSSL ? 443 : 80;
      }

      this.xd = (typeof location !== 'undefined' && opts.hostname !== location.hostname) ||
        port !== opts.port;
      this.xs = opts.secure !== isSSL;
    }
  }

  /**
   * Inherits from Polling.
   */

  componentInherit(XHR, polling);

  /**
   * XHR supports binary
   */

  XHR.prototype.supportsBinary = true;

  /**
   * Creates a request.
   *
   * @param {String} method
   * @api private
   */

  XHR.prototype.request = function (opts) {
    opts = opts || {};
    opts.uri = this.uri();
    opts.xd = this.xd;
    opts.xs = this.xs;
    opts.agent = this.agent || false;
    opts.supportsBinary = this.supportsBinary;
    opts.enablesXDR = this.enablesXDR;

    // SSL options for Node.js client
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;
    opts.requestTimeout = this.requestTimeout;

    // other options for Node.js client
    opts.extraHeaders = this.extraHeaders;

    return new Request(opts);
  };

  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @api private
   */

  XHR.prototype.doWrite = function (data, fn) {
    var isBinary = typeof data !== 'string' && data !== undefined;
    var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
    var self = this;
    req.on('success', fn);
    req.on('error', function (err) {
      self.onError('xhr post error', err);
    });
    this.sendXhr = req;
  };

  /**
   * Starts a poll cycle.
   *
   * @api private
   */

  XHR.prototype.doPoll = function () {
    debug$3('xhr poll');
    var req = this.request();
    var self = this;
    req.on('data', function (data) {
      self.onData(data);
    });
    req.on('error', function (err) {
      self.onError('xhr poll error', err);
    });
    this.pollXhr = req;
  };

  /**
   * Request constructor
   *
   * @param {Object} options
   * @api public
   */

  function Request (opts) {
    this.method = opts.method || 'GET';
    this.uri = opts.uri;
    this.xd = !!opts.xd;
    this.xs = !!opts.xs;
    this.async = false !== opts.async;
    this.data = undefined !== opts.data ? opts.data : null;
    this.agent = opts.agent;
    this.isBinary = opts.isBinary;
    this.supportsBinary = opts.supportsBinary;
    this.enablesXDR = opts.enablesXDR;
    this.requestTimeout = opts.requestTimeout;

    // SSL options for Node.js client
    this.pfx = opts.pfx;
    this.key = opts.key;
    this.passphrase = opts.passphrase;
    this.cert = opts.cert;
    this.ca = opts.ca;
    this.ciphers = opts.ciphers;
    this.rejectUnauthorized = opts.rejectUnauthorized;

    // other options for Node.js client
    this.extraHeaders = opts.extraHeaders;

    this.create();
  }

  /**
   * Mix in `Emitter`.
   */

  componentEmitter(Request.prototype);

  /**
   * Creates the XHR object and sends the request.
   *
   * @api private
   */

  Request.prototype.create = function () {
    var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

    // SSL options for Node.js client
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;

    var xhr = this.xhr = new xmlhttprequest(opts);
    var self = this;

    try {
      debug$3('xhr open %s: %s', this.method, this.uri);
      xhr.open(this.method, this.uri, this.async);
      try {
        if (this.extraHeaders) {
          xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
          for (var i in this.extraHeaders) {
            if (this.extraHeaders.hasOwnProperty(i)) {
              xhr.setRequestHeader(i, this.extraHeaders[i]);
            }
          }
        }
      } catch (e) {}

      if ('POST' === this.method) {
        try {
          if (this.isBinary) {
            xhr.setRequestHeader('Content-type', 'application/octet-stream');
          } else {
            xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
          }
        } catch (e) {}
      }

      try {
        xhr.setRequestHeader('Accept', '*/*');
      } catch (e) {}

      // ie6 check
      if ('withCredentials' in xhr) {
        xhr.withCredentials = true;
      }

      if (this.requestTimeout) {
        xhr.timeout = this.requestTimeout;
      }

      if (this.hasXDR()) {
        xhr.onload = function () {
          self.onLoad();
        };
        xhr.onerror = function () {
          self.onError(xhr.responseText);
        };
      } else {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 2) {
            try {
              var contentType = xhr.getResponseHeader('Content-Type');
              if (self.supportsBinary && contentType === 'application/octet-stream') {
                xhr.responseType = 'arraybuffer';
              }
            } catch (e) {}
          }
          if (4 !== xhr.readyState) return;
          if (200 === xhr.status || 1223 === xhr.status) {
            self.onLoad();
          } else {
            // make sure the `error` event handler that's user-set
            // does not throw in the same tick and gets caught here
            setTimeout(function () {
              self.onError(xhr.status);
            }, 0);
          }
        };
      }

      debug$3('xhr data %s', this.data);
      xhr.send(this.data);
    } catch (e) {
      // Need to defer since .create() is called directly fhrom the constructor
      // and thus the 'error' event can only be only bound *after* this exception
      // occurs.  Therefore, also, we cannot throw here at all.
      setTimeout(function () {
        self.onError(e);
      }, 0);
      return;
    }

    if (typeof document !== 'undefined') {
      this.index = Request.requestsCount++;
      Request.requests[this.index] = this;
    }
  };

  /**
   * Called upon successful response.
   *
   * @api private
   */

  Request.prototype.onSuccess = function () {
    this.emit('success');
    this.cleanup();
  };

  /**
   * Called if we have data.
   *
   * @api private
   */

  Request.prototype.onData = function (data) {
    this.emit('data', data);
    this.onSuccess();
  };

  /**
   * Called upon error.
   *
   * @api private
   */

  Request.prototype.onError = function (err) {
    this.emit('error', err);
    this.cleanup(true);
  };

  /**
   * Cleans up house.
   *
   * @api private
   */

  Request.prototype.cleanup = function (fromError) {
    if ('undefined' === typeof this.xhr || null === this.xhr) {
      return;
    }
    // xmlhttprequest
    if (this.hasXDR()) {
      this.xhr.onload = this.xhr.onerror = empty;
    } else {
      this.xhr.onreadystatechange = empty;
    }

    if (fromError) {
      try {
        this.xhr.abort();
      } catch (e) {}
    }

    if (typeof document !== 'undefined') {
      delete Request.requests[this.index];
    }

    this.xhr = null;
  };

  /**
   * Called upon load.
   *
   * @api private
   */

  Request.prototype.onLoad = function () {
    var data;
    try {
      var contentType;
      try {
        contentType = this.xhr.getResponseHeader('Content-Type');
      } catch (e) {}
      if (contentType === 'application/octet-stream') {
        data = this.xhr.response || this.xhr.responseText;
      } else {
        data = this.xhr.responseText;
      }
    } catch (e) {
      this.onError(e);
    }
    if (null != data) {
      this.onData(data);
    }
  };

  /**
   * Check if it has XDomainRequest.
   *
   * @api private
   */

  Request.prototype.hasXDR = function () {
    return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
  };

  /**
   * Aborts the request.
   *
   * @api public
   */

  Request.prototype.abort = function () {
    this.cleanup();
  };

  /**
   * Aborts pending requests when unloading the window. This is needed to prevent
   * memory leaks (e.g. when using IE) and to ensure that no spurious error is
   * emitted.
   */

  Request.requestsCount = 0;
  Request.requests = {};

  if (typeof document !== 'undefined') {
    if (typeof attachEvent === 'function') {
      attachEvent('onunload', unloadHandler);
    } else if (typeof addEventListener === 'function') {
      var terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';
      addEventListener(terminationEvent, unloadHandler, false);
    }
  }

  function unloadHandler () {
    for (var i in Request.requests) {
      if (Request.requests.hasOwnProperty(i)) {
        Request.requests[i].abort();
      }
    }
  }
  pollingXhr.Request = Request_1;

  /**
   * Module requirements.
   */




  /**
   * Module exports.
   */

  var pollingJsonp = JSONPPolling;

  /**
   * Cached regular expressions.
   */

  var rNewline = /\n/g;
  var rEscapedNewline = /\\n/g;

  /**
   * Global JSONP callbacks.
   */

  var callbacks;

  /**
   * Noop.
   */

  function empty$1 () { }

  /**
   * Until https://github.com/tc39/proposal-global is shipped.
   */
  function glob () {
    return typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : {};
  }

  /**
   * JSONP Polling constructor.
   *
   * @param {Object} opts.
   * @api public
   */

  function JSONPPolling (opts) {
    polling.call(this, opts);

    this.query = this.query || {};

    // define global callbacks array if not present
    // we do this here (lazily) to avoid unneeded global pollution
    if (!callbacks) {
      // we need to consider multiple engines in the same page
      var global = glob();
      callbacks = global.___eio = (global.___eio || []);
    }

    // callback identifier
    this.index = callbacks.length;

    // add callback to jsonp global
    var self = this;
    callbacks.push(function (msg) {
      self.onData(msg);
    });

    // append to query string
    this.query.j = this.index;

    // prevent spurious errors from being emitted when the window is unloaded
    if (typeof addEventListener === 'function') {
      addEventListener('beforeunload', function () {
        if (self.script) self.script.onerror = empty$1;
      }, false);
    }
  }

  /**
   * Inherits from Polling.
   */

  componentInherit(JSONPPolling, polling);

  /*
   * JSONP only supports binary as base64 encoded strings
   */

  JSONPPolling.prototype.supportsBinary = false;

  /**
   * Closes the socket.
   *
   * @api private
   */

  JSONPPolling.prototype.doClose = function () {
    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    if (this.form) {
      this.form.parentNode.removeChild(this.form);
      this.form = null;
      this.iframe = null;
    }

    polling.prototype.doClose.call(this);
  };

  /**
   * Starts a poll cycle.
   *
   * @api private
   */

  JSONPPolling.prototype.doPoll = function () {
    var self = this;
    var script = document.createElement('script');

    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    script.async = true;
    script.src = this.uri();
    script.onerror = function (e) {
      self.onError('jsonp poll error', e);
    };

    var insertAt = document.getElementsByTagName('script')[0];
    if (insertAt) {
      insertAt.parentNode.insertBefore(script, insertAt);
    } else {
      (document.head || document.body).appendChild(script);
    }
    this.script = script;

    var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

    if (isUAgecko) {
      setTimeout(function () {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        document.body.removeChild(iframe);
      }, 100);
    }
  };

  /**
   * Writes with a hidden iframe.
   *
   * @param {String} data to send
   * @param {Function} called upon flush.
   * @api private
   */

  JSONPPolling.prototype.doWrite = function (data, fn) {
    var self = this;

    if (!this.form) {
      var form = document.createElement('form');
      var area = document.createElement('textarea');
      var id = this.iframeId = 'eio_iframe_' + this.index;
      var iframe;

      form.className = 'socketio';
      form.style.position = 'absolute';
      form.style.top = '-1000px';
      form.style.left = '-1000px';
      form.target = id;
      form.method = 'POST';
      form.setAttribute('accept-charset', 'utf-8');
      area.name = 'd';
      form.appendChild(area);
      document.body.appendChild(form);

      this.form = form;
      this.area = area;
    }

    this.form.action = this.uri();

    function complete () {
      initIframe();
      fn();
    }

    function initIframe () {
      if (self.iframe) {
        try {
          self.form.removeChild(self.iframe);
        } catch (e) {
          self.onError('jsonp polling iframe removal error', e);
        }
      }

      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
        iframe = document.createElement(html);
      } catch (e) {
        iframe = document.createElement('iframe');
        iframe.name = self.iframeId;
        iframe.src = 'javascript:0';
      }

      iframe.id = self.iframeId;

      self.form.appendChild(iframe);
      self.iframe = iframe;
    }

    initIframe();

    // escape \n to prevent it from being converted into \r\n by some UAs
    // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
    data = data.replace(rEscapedNewline, '\\\n');
    this.area.value = data.replace(rNewline, '\\n');

    try {
      this.form.submit();
    } catch (e) {}

    if (this.iframe.attachEvent) {
      this.iframe.onreadystatechange = function () {
        if (self.iframe.readyState === 'complete') {
          complete();
        }
      };
    } else {
      this.iframe.onload = complete;
    }
  };

  var require$$1 = {};

  /**
   * Module dependencies.
   */






  var debug$4 = browser('engine.io-client:websocket');

  var BrowserWebSocket, NodeWebSocket;

  if (typeof WebSocket !== 'undefined') {
    BrowserWebSocket = WebSocket;
  } else if (typeof self !== 'undefined') {
    BrowserWebSocket = self.WebSocket || self.MozWebSocket;
  } else {
    try {
      NodeWebSocket = require$$1;
    } catch (e) { }
  }

  /**
   * Get either the `WebSocket` or `MozWebSocket` globals
   * in the browser or try to resolve WebSocket-compatible
   * interface exposed by `ws` for Node-like environment.
   */

  var WebSocketImpl = BrowserWebSocket || NodeWebSocket;

  /**
   * Module exports.
   */

  var websocket = WS;

  /**
   * WebSocket transport constructor.
   *
   * @api {Object} connection options
   * @api public
   */

  function WS (opts) {
    var forceBase64 = (opts && opts.forceBase64);
    if (forceBase64) {
      this.supportsBinary = false;
    }
    this.perMessageDeflate = opts.perMessageDeflate;
    this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
    this.protocols = opts.protocols;
    if (!this.usingBrowserWebSocket) {
      WebSocketImpl = NodeWebSocket;
    }
    transport.call(this, opts);
  }

  /**
   * Inherits from Transport.
   */

  componentInherit(WS, transport);

  /**
   * Transport name.
   *
   * @api public
   */

  WS.prototype.name = 'websocket';

  /*
   * WebSockets support binary
   */

  WS.prototype.supportsBinary = true;

  /**
   * Opens socket.
   *
   * @api private
   */

  WS.prototype.doOpen = function () {
    if (!this.check()) {
      // let probe timeout
      return;
    }

    var uri = this.uri();
    var protocols = this.protocols;
    var opts = {
      agent: this.agent,
      perMessageDeflate: this.perMessageDeflate
    };

    // SSL options for Node.js client
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;
    if (this.extraHeaders) {
      opts.headers = this.extraHeaders;
    }
    if (this.localAddress) {
      opts.localAddress = this.localAddress;
    }

    try {
      this.ws =
        this.usingBrowserWebSocket && !this.isReactNative
          ? protocols
            ? new WebSocketImpl(uri, protocols)
            : new WebSocketImpl(uri)
          : new WebSocketImpl(uri, protocols, opts);
    } catch (err) {
      return this.emit('error', err);
    }

    if (this.ws.binaryType === undefined) {
      this.supportsBinary = false;
    }

    if (this.ws.supports && this.ws.supports.binary) {
      this.supportsBinary = true;
      this.ws.binaryType = 'nodebuffer';
    } else {
      this.ws.binaryType = 'arraybuffer';
    }

    this.addEventListeners();
  };

  /**
   * Adds event listeners to the socket
   *
   * @api private
   */

  WS.prototype.addEventListeners = function () {
    var self = this;

    this.ws.onopen = function () {
      self.onOpen();
    };
    this.ws.onclose = function () {
      self.onClose();
    };
    this.ws.onmessage = function (ev) {
      self.onData(ev.data);
    };
    this.ws.onerror = function (e) {
      self.onError('websocket error', e);
    };
  };

  /**
   * Writes data to socket.
   *
   * @param {Array} array of packets.
   * @api private
   */

  WS.prototype.write = function (packets) {
    var self = this;
    this.writable = false;

    // encodePacket efficient as it uses WS framing
    // no need for encodePayload
    var total = packets.length;
    for (var i = 0, l = total; i < l; i++) {
      (function (packet) {
        browser$1.encodePacket(packet, self.supportsBinary, function (data) {
          if (!self.usingBrowserWebSocket) {
            // always create a new object (GH-437)
            var opts = {};
            if (packet.options) {
              opts.compress = packet.options.compress;
            }

            if (self.perMessageDeflate) {
              var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
              if (len < self.perMessageDeflate.threshold) {
                opts.compress = false;
              }
            }
          }

          // Sometimes the websocket has already been closed but the browser didn't
          // have a chance of informing us about it yet, in that case send will
          // throw an error
          try {
            if (self.usingBrowserWebSocket) {
              // TypeError is thrown when passing the second argument on Safari
              self.ws.send(data);
            } else {
              self.ws.send(data, opts);
            }
          } catch (e) {
            debug$4('websocket closed before onclose event');
          }

          --total || done();
        });
      })(packets[i]);
    }

    function done () {
      self.emit('flush');

      // fake drain
      // defer to next tick to allow Socket to clear writeBuffer
      setTimeout(function () {
        self.writable = true;
        self.emit('drain');
      }, 0);
    }
  };

  /**
   * Called upon close
   *
   * @api private
   */

  WS.prototype.onClose = function () {
    transport.prototype.onClose.call(this);
  };

  /**
   * Closes socket.
   *
   * @api private
   */

  WS.prototype.doClose = function () {
    if (typeof this.ws !== 'undefined') {
      this.ws.close();
    }
  };

  /**
   * Generates uri for connection.
   *
   * @api private
   */

  WS.prototype.uri = function () {
    var query = this.query || {};
    var schema = this.secure ? 'wss' : 'ws';
    var port = '';

    // avoid port if default for schema
    if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
      ('ws' === schema && Number(this.port) !== 80))) {
      port = ':' + this.port;
    }

    // append timestamp to URI
    if (this.timestampRequests) {
      query[this.timestampParam] = yeast_1();
    }

    // communicate binary support capabilities
    if (!this.supportsBinary) {
      query.b64 = 1;
    }

    query = parseqs.encode(query);

    // prepend ? to query
    if (query.length) {
      query = '?' + query;
    }

    var ipv6 = this.hostname.indexOf(':') !== -1;
    return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
  };

  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @api public
   */

  WS.prototype.check = function () {
    return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
  };

  /**
   * Module dependencies
   */






  /**
   * Export transports.
   */

  var polling_1 = polling$1;
  var websocket_1 = websocket;

  /**
   * Polling transport polymorphic constructor.
   * Decides on xhr vs jsonp based on feature detection.
   *
   * @api private
   */

  function polling$1 (opts) {
    var xhr;
    var xd = false;
    var xs = false;
    var jsonp = false !== opts.jsonp;

    if (typeof location !== 'undefined') {
      var isSSL = 'https:' === location.protocol;
      var port = location.port;

      // some user agents have empty `location.port`
      if (!port) {
        port = isSSL ? 443 : 80;
      }

      xd = opts.hostname !== location.hostname || port !== opts.port;
      xs = opts.secure !== isSSL;
    }

    opts.xdomain = xd;
    opts.xscheme = xs;
    xhr = new xmlhttprequest(opts);

    if ('open' in xhr && !opts.forceJSONP) {
      return new pollingXhr(opts);
    } else {
      if (!jsonp) throw new Error('JSONP disabled');
      return new pollingJsonp(opts);
    }
  }

  var transports = {
  	polling: polling_1,
  	websocket: websocket_1
  };

  var indexOf = [].indexOf;

  var indexof = function(arr, obj){
    if (indexOf) return arr.indexOf(obj);
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] === obj) return i;
    }
    return -1;
  };

  /**
   * Module dependencies.
   */



  var debug$5 = browser('engine.io-client:socket');





  /**
   * Module exports.
   */

  var socket = Socket;

  /**
   * Socket constructor.
   *
   * @param {String|Object} uri or options
   * @param {Object} options
   * @api public
   */

  function Socket (uri, opts) {
    if (!(this instanceof Socket)) return new Socket(uri, opts);

    opts = opts || {};

    if (uri && 'object' === typeof uri) {
      opts = uri;
      uri = null;
    }

    if (uri) {
      uri = parseuri(uri);
      opts.hostname = uri.host;
      opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
      opts.port = uri.port;
      if (uri.query) opts.query = uri.query;
    } else if (opts.host) {
      opts.hostname = parseuri(opts.host).host;
    }

    this.secure = null != opts.secure ? opts.secure
      : (typeof location !== 'undefined' && 'https:' === location.protocol);

    if (opts.hostname && !opts.port) {
      // if no port is specified manually, use the protocol default
      opts.port = this.secure ? '443' : '80';
    }

    this.agent = opts.agent || false;
    this.hostname = opts.hostname ||
      (typeof location !== 'undefined' ? location.hostname : 'localhost');
    this.port = opts.port || (typeof location !== 'undefined' && location.port
        ? location.port
        : (this.secure ? 443 : 80));
    this.query = opts.query || {};
    if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
    this.upgrade = false !== opts.upgrade;
    this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
    this.forceJSONP = !!opts.forceJSONP;
    this.jsonp = false !== opts.jsonp;
    this.forceBase64 = !!opts.forceBase64;
    this.enablesXDR = !!opts.enablesXDR;
    this.timestampParam = opts.timestampParam || 't';
    this.timestampRequests = opts.timestampRequests;
    this.transports = opts.transports || ['polling', 'websocket'];
    this.transportOptions = opts.transportOptions || {};
    this.readyState = '';
    this.writeBuffer = [];
    this.prevBufferLen = 0;
    this.policyPort = opts.policyPort || 843;
    this.rememberUpgrade = opts.rememberUpgrade || false;
    this.binaryType = null;
    this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
    this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

    if (true === this.perMessageDeflate) this.perMessageDeflate = {};
    if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
      this.perMessageDeflate.threshold = 1024;
    }

    // SSL options for Node.js client
    this.pfx = opts.pfx || null;
    this.key = opts.key || null;
    this.passphrase = opts.passphrase || null;
    this.cert = opts.cert || null;
    this.ca = opts.ca || null;
    this.ciphers = opts.ciphers || null;
    this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
    this.forceNode = !!opts.forceNode;

    // detect ReactNative environment
    this.isReactNative = (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative');

    // other options for Node.js or ReactNative client
    if (typeof self === 'undefined' || this.isReactNative) {
      if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
        this.extraHeaders = opts.extraHeaders;
      }

      if (opts.localAddress) {
        this.localAddress = opts.localAddress;
      }
    }

    // set on handshake
    this.id = null;
    this.upgrades = null;
    this.pingInterval = null;
    this.pingTimeout = null;

    // set on heartbeat
    this.pingIntervalTimer = null;
    this.pingTimeoutTimer = null;

    this.open();
  }

  Socket.priorWebsocketSuccess = false;

  /**
   * Mix in `Emitter`.
   */

  componentEmitter(Socket.prototype);

  /**
   * Protocol version.
   *
   * @api public
   */

  Socket.protocol = browser$1.protocol; // this is an int

  /**
   * Expose deps for legacy compatibility
   * and standalone browser access.
   */

  Socket.Socket = Socket;
  Socket.Transport = transport;
  Socket.transports = transports;
  Socket.parser = browser$1;

  /**
   * Creates transport of the given type.
   *
   * @param {String} transport name
   * @return {Transport}
   * @api private
   */

  Socket.prototype.createTransport = function (name) {
    debug$5('creating transport "%s"', name);
    var query = clone(this.query);

    // append engine.io protocol identifier
    query.EIO = browser$1.protocol;

    // transport name
    query.transport = name;

    // per-transport options
    var options = this.transportOptions[name] || {};

    // session id if we already have one
    if (this.id) query.sid = this.id;

    var transport = new transports[name]({
      query: query,
      socket: this,
      agent: options.agent || this.agent,
      hostname: options.hostname || this.hostname,
      port: options.port || this.port,
      secure: options.secure || this.secure,
      path: options.path || this.path,
      forceJSONP: options.forceJSONP || this.forceJSONP,
      jsonp: options.jsonp || this.jsonp,
      forceBase64: options.forceBase64 || this.forceBase64,
      enablesXDR: options.enablesXDR || this.enablesXDR,
      timestampRequests: options.timestampRequests || this.timestampRequests,
      timestampParam: options.timestampParam || this.timestampParam,
      policyPort: options.policyPort || this.policyPort,
      pfx: options.pfx || this.pfx,
      key: options.key || this.key,
      passphrase: options.passphrase || this.passphrase,
      cert: options.cert || this.cert,
      ca: options.ca || this.ca,
      ciphers: options.ciphers || this.ciphers,
      rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
      perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
      extraHeaders: options.extraHeaders || this.extraHeaders,
      forceNode: options.forceNode || this.forceNode,
      localAddress: options.localAddress || this.localAddress,
      requestTimeout: options.requestTimeout || this.requestTimeout,
      protocols: options.protocols || void (0),
      isReactNative: this.isReactNative
    });

    return transport;
  };

  function clone (obj) {
    var o = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        o[i] = obj[i];
      }
    }
    return o;
  }

  /**
   * Initializes transport to use and starts probe.
   *
   * @api private
   */
  Socket.prototype.open = function () {
    var transport;
    if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
      transport = 'websocket';
    } else if (0 === this.transports.length) {
      // Emit error on next tick so it can be listened to
      var self = this;
      setTimeout(function () {
        self.emit('error', 'No transports available');
      }, 0);
      return;
    } else {
      transport = this.transports[0];
    }
    this.readyState = 'opening';

    // Retry with the next transport if the transport is disabled (jsonp: false)
    try {
      transport = this.createTransport(transport);
    } catch (e) {
      this.transports.shift();
      this.open();
      return;
    }

    transport.open();
    this.setTransport(transport);
  };

  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @api private
   */

  Socket.prototype.setTransport = function (transport) {
    debug$5('setting transport %s', transport.name);
    var self = this;

    if (this.transport) {
      debug$5('clearing existing transport %s', this.transport.name);
      this.transport.removeAllListeners();
    }

    // set up transport
    this.transport = transport;

    // set up transport listeners
    transport
    .on('drain', function () {
      self.onDrain();
    })
    .on('packet', function (packet) {
      self.onPacket(packet);
    })
    .on('error', function (e) {
      self.onError(e);
    })
    .on('close', function () {
      self.onClose('transport close');
    });
  };

  /**
   * Probes a transport.
   *
   * @param {String} transport name
   * @api private
   */

  Socket.prototype.probe = function (name) {
    debug$5('probing transport "%s"', name);
    var transport = this.createTransport(name, { probe: 1 });
    var failed = false;
    var self = this;

    Socket.priorWebsocketSuccess = false;

    function onTransportOpen () {
      if (self.onlyBinaryUpgrades) {
        var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
        failed = failed || upgradeLosesBinary;
      }
      if (failed) return;

      debug$5('probe transport "%s" opened', name);
      transport.send([{ type: 'ping', data: 'probe' }]);
      transport.once('packet', function (msg) {
        if (failed) return;
        if ('pong' === msg.type && 'probe' === msg.data) {
          debug$5('probe transport "%s" pong', name);
          self.upgrading = true;
          self.emit('upgrading', transport);
          if (!transport) return;
          Socket.priorWebsocketSuccess = 'websocket' === transport.name;

          debug$5('pausing current transport "%s"', self.transport.name);
          self.transport.pause(function () {
            if (failed) return;
            if ('closed' === self.readyState) return;
            debug$5('changing transport and sending upgrade packet');

            cleanup();

            self.setTransport(transport);
            transport.send([{ type: 'upgrade' }]);
            self.emit('upgrade', transport);
            transport = null;
            self.upgrading = false;
            self.flush();
          });
        } else {
          debug$5('probe transport "%s" failed', name);
          var err = new Error('probe error');
          err.transport = transport.name;
          self.emit('upgradeError', err);
        }
      });
    }

    function freezeTransport () {
      if (failed) return;

      // Any callback called by transport should be ignored since now
      failed = true;

      cleanup();

      transport.close();
      transport = null;
    }

    // Handle any error that happens while probing
    function onerror (err) {
      var error = new Error('probe error: ' + err);
      error.transport = transport.name;

      freezeTransport();

      debug$5('probe transport "%s" failed because of error: %s', name, err);

      self.emit('upgradeError', error);
    }

    function onTransportClose () {
      onerror('transport closed');
    }

    // When the socket is closed while we're probing
    function onclose () {
      onerror('socket closed');
    }

    // When the socket is upgraded while we're probing
    function onupgrade (to) {
      if (transport && to.name !== transport.name) {
        debug$5('"%s" works - aborting "%s"', to.name, transport.name);
        freezeTransport();
      }
    }

    // Remove all listeners on the transport and on self
    function cleanup () {
      transport.removeListener('open', onTransportOpen);
      transport.removeListener('error', onerror);
      transport.removeListener('close', onTransportClose);
      self.removeListener('close', onclose);
      self.removeListener('upgrading', onupgrade);
    }

    transport.once('open', onTransportOpen);
    transport.once('error', onerror);
    transport.once('close', onTransportClose);

    this.once('close', onclose);
    this.once('upgrading', onupgrade);

    transport.open();
  };

  /**
   * Called when connection is deemed open.
   *
   * @api public
   */

  Socket.prototype.onOpen = function () {
    debug$5('socket open');
    this.readyState = 'open';
    Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
    this.emit('open');
    this.flush();

    // we check for `readyState` in case an `open`
    // listener already closed the socket
    if ('open' === this.readyState && this.upgrade && this.transport.pause) {
      debug$5('starting upgrade probes');
      for (var i = 0, l = this.upgrades.length; i < l; i++) {
        this.probe(this.upgrades[i]);
      }
    }
  };

  /**
   * Handles a packet.
   *
   * @api private
   */

  Socket.prototype.onPacket = function (packet) {
    if ('opening' === this.readyState || 'open' === this.readyState ||
        'closing' === this.readyState) {
      debug$5('socket receive: type "%s", data "%s"', packet.type, packet.data);

      this.emit('packet', packet);

      // Socket is live - any packet counts
      this.emit('heartbeat');

      switch (packet.type) {
        case 'open':
          this.onHandshake(JSON.parse(packet.data));
          break;

        case 'pong':
          this.setPing();
          this.emit('pong');
          break;

        case 'error':
          var err = new Error('server error');
          err.code = packet.data;
          this.onError(err);
          break;

        case 'message':
          this.emit('data', packet.data);
          this.emit('message', packet.data);
          break;
      }
    } else {
      debug$5('packet received with socket readyState "%s"', this.readyState);
    }
  };

  /**
   * Called upon handshake completion.
   *
   * @param {Object} handshake obj
   * @api private
   */

  Socket.prototype.onHandshake = function (data) {
    this.emit('handshake', data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this.upgrades = this.filterUpgrades(data.upgrades);
    this.pingInterval = data.pingInterval;
    this.pingTimeout = data.pingTimeout;
    this.onOpen();
    // In case open handler closes socket
    if ('closed' === this.readyState) return;
    this.setPing();

    // Prolong liveness of socket on heartbeat
    this.removeListener('heartbeat', this.onHeartbeat);
    this.on('heartbeat', this.onHeartbeat);
  };

  /**
   * Resets ping timeout.
   *
   * @api private
   */

  Socket.prototype.onHeartbeat = function (timeout) {
    clearTimeout(this.pingTimeoutTimer);
    var self = this;
    self.pingTimeoutTimer = setTimeout(function () {
      if ('closed' === self.readyState) return;
      self.onClose('ping timeout');
    }, timeout || (self.pingInterval + self.pingTimeout));
  };

  /**
   * Pings server every `this.pingInterval` and expects response
   * within `this.pingTimeout` or closes connection.
   *
   * @api private
   */

  Socket.prototype.setPing = function () {
    var self = this;
    clearTimeout(self.pingIntervalTimer);
    self.pingIntervalTimer = setTimeout(function () {
      debug$5('writing ping packet - expecting pong within %sms', self.pingTimeout);
      self.ping();
      self.onHeartbeat(self.pingTimeout);
    }, self.pingInterval);
  };

  /**
  * Sends a ping packet.
  *
  * @api private
  */

  Socket.prototype.ping = function () {
    var self = this;
    this.sendPacket('ping', function () {
      self.emit('ping');
    });
  };

  /**
   * Called on `drain` event
   *
   * @api private
   */

  Socket.prototype.onDrain = function () {
    this.writeBuffer.splice(0, this.prevBufferLen);

    // setting prevBufferLen = 0 is very important
    // for example, when upgrading, upgrade packet is sent over,
    // and a nonzero prevBufferLen could cause problems on `drain`
    this.prevBufferLen = 0;

    if (0 === this.writeBuffer.length) {
      this.emit('drain');
    } else {
      this.flush();
    }
  };

  /**
   * Flush write buffers.
   *
   * @api private
   */

  Socket.prototype.flush = function () {
    if ('closed' !== this.readyState && this.transport.writable &&
      !this.upgrading && this.writeBuffer.length) {
      debug$5('flushing %d packets in socket', this.writeBuffer.length);
      this.transport.send(this.writeBuffer);
      // keep track of current length of writeBuffer
      // splice writeBuffer and callbackBuffer on `drain`
      this.prevBufferLen = this.writeBuffer.length;
      this.emit('flush');
    }
  };

  /**
   * Sends a message.
   *
   * @param {String} message.
   * @param {Function} callback function.
   * @param {Object} options.
   * @return {Socket} for chaining.
   * @api public
   */

  Socket.prototype.write =
  Socket.prototype.send = function (msg, options, fn) {
    this.sendPacket('message', msg, options, fn);
    return this;
  };

  /**
   * Sends a packet.
   *
   * @param {String} packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} callback function.
   * @api private
   */

  Socket.prototype.sendPacket = function (type, data, options, fn) {
    if ('function' === typeof data) {
      fn = data;
      data = undefined;
    }

    if ('function' === typeof options) {
      fn = options;
      options = null;
    }

    if ('closing' === this.readyState || 'closed' === this.readyState) {
      return;
    }

    options = options || {};
    options.compress = false !== options.compress;

    var packet = {
      type: type,
      data: data,
      options: options
    };
    this.emit('packetCreate', packet);
    this.writeBuffer.push(packet);
    if (fn) this.once('flush', fn);
    this.flush();
  };

  /**
   * Closes the connection.
   *
   * @api private
   */

  Socket.prototype.close = function () {
    if ('opening' === this.readyState || 'open' === this.readyState) {
      this.readyState = 'closing';

      var self = this;

      if (this.writeBuffer.length) {
        this.once('drain', function () {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }

    function close () {
      self.onClose('forced close');
      debug$5('socket closing - telling transport to close');
      self.transport.close();
    }

    function cleanupAndClose () {
      self.removeListener('upgrade', cleanupAndClose);
      self.removeListener('upgradeError', cleanupAndClose);
      close();
    }

    function waitForUpgrade () {
      // wait for upgrade to finish since we can't send packets while pausing a transport
      self.once('upgrade', cleanupAndClose);
      self.once('upgradeError', cleanupAndClose);
    }

    return this;
  };

  /**
   * Called upon transport error
   *
   * @api private
   */

  Socket.prototype.onError = function (err) {
    debug$5('socket error %j', err);
    Socket.priorWebsocketSuccess = false;
    this.emit('error', err);
    this.onClose('transport error', err);
  };

  /**
   * Called upon transport close.
   *
   * @api private
   */

  Socket.prototype.onClose = function (reason, desc) {
    if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
      debug$5('socket close with reason: "%s"', reason);
      var self = this;

      // clear timers
      clearTimeout(this.pingIntervalTimer);
      clearTimeout(this.pingTimeoutTimer);

      // stop event from firing again for transport
      this.transport.removeAllListeners('close');

      // ensure transport won't stay open
      this.transport.close();

      // ignore further transport communication
      this.transport.removeAllListeners();

      // set ready state
      this.readyState = 'closed';

      // clear session id
      this.id = null;

      // emit close event
      this.emit('close', reason, desc);

      // clean buffers after, so users can still
      // grab the buffers on `close` event
      self.writeBuffer = [];
      self.prevBufferLen = 0;
    }
  };

  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} server upgrades
   * @api private
   *
   */

  Socket.prototype.filterUpgrades = function (upgrades) {
    var filteredUpgrades = [];
    for (var i = 0, j = upgrades.length; i < j; i++) {
      if (~indexof(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
    }
    return filteredUpgrades;
  };

  var lib = socket;

  /**
   * Exports parser
   *
   * @api public
   *
   */
  var parser = browser$1;
  lib.parser = parser;

  var toArray_1 = toArray;

  function toArray(list, index) {
      var array = [];

      index = index || 0;

      for (var i = index || 0; i < list.length; i++) {
          array[i - index] = list[i];
      }

      return array
  }

  /**
   * Module exports.
   */

  var on_1 = on;

  /**
   * Helper for subscriptions.
   *
   * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
   * @param {String} event name
   * @param {Function} callback
   * @api public
   */

  function on (obj, ev, fn) {
    obj.on(ev, fn);
    return {
      destroy: function () {
        obj.removeListener(ev, fn);
      }
    };
  }

  /**
   * Slice reference.
   */

  var slice = [].slice;

  /**
   * Bind `obj` to `fn`.
   *
   * @param {Object} obj
   * @param {Function|String} fn or string
   * @return {Function}
   * @api public
   */

  var componentBind = function(obj, fn){
    if ('string' == typeof fn) fn = obj[fn];
    if ('function' != typeof fn) throw new Error('bind() requires a function');
    var args = slice.call(arguments, 2);
    return function(){
      return fn.apply(obj, args.concat(slice.call(arguments)));
    }
  };

  var socket$1 = createCommonjsModule(function (module, exports) {
  /**
   * Module dependencies.
   */






  var debug = browser('socket.io-client:socket');



  /**
   * Module exports.
   */

  module.exports = exports = Socket;

  /**
   * Internal events (blacklisted).
   * These events can't be emitted by the user.
   *
   * @api private
   */

  var events = {
    connect: 1,
    connect_error: 1,
    connect_timeout: 1,
    connecting: 1,
    disconnect: 1,
    error: 1,
    reconnect: 1,
    reconnect_attempt: 1,
    reconnect_failed: 1,
    reconnect_error: 1,
    reconnecting: 1,
    ping: 1,
    pong: 1
  };

  /**
   * Shortcut to `Emitter#emit`.
   */

  var emit = componentEmitter.prototype.emit;

  /**
   * `Socket` constructor.
   *
   * @api public
   */

  function Socket (io, nsp, opts) {
    this.io = io;
    this.nsp = nsp;
    this.json = this; // compat
    this.ids = 0;
    this.acks = {};
    this.receiveBuffer = [];
    this.sendBuffer = [];
    this.connected = false;
    this.disconnected = true;
    this.flags = {};
    if (opts && opts.query) {
      this.query = opts.query;
    }
    if (this.io.autoConnect) this.open();
  }

  /**
   * Mix in `Emitter`.
   */

  componentEmitter(Socket.prototype);

  /**
   * Subscribe to open, close and packet events
   *
   * @api private
   */

  Socket.prototype.subEvents = function () {
    if (this.subs) return;

    var io = this.io;
    this.subs = [
      on_1(io, 'open', componentBind(this, 'onopen')),
      on_1(io, 'packet', componentBind(this, 'onpacket')),
      on_1(io, 'close', componentBind(this, 'onclose'))
    ];
  };

  /**
   * "Opens" the socket.
   *
   * @api public
   */

  Socket.prototype.open =
  Socket.prototype.connect = function () {
    if (this.connected) return this;

    this.subEvents();
    this.io.open(); // ensure open
    if ('open' === this.io.readyState) this.onopen();
    this.emit('connecting');
    return this;
  };

  /**
   * Sends a `message` event.
   *
   * @return {Socket} self
   * @api public
   */

  Socket.prototype.send = function () {
    var args = toArray_1(arguments);
    args.unshift('message');
    this.emit.apply(this, args);
    return this;
  };

  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @param {String} event name
   * @return {Socket} self
   * @api public
   */

  Socket.prototype.emit = function (ev) {
    if (events.hasOwnProperty(ev)) {
      emit.apply(this, arguments);
      return this;
    }

    var args = toArray_1(arguments);
    var packet = {
      type: (this.flags.binary !== undefined ? this.flags.binary : hasBinary2(args)) ? socket_ioParser.BINARY_EVENT : socket_ioParser.EVENT,
      data: args
    };

    packet.options = {};
    packet.options.compress = !this.flags || false !== this.flags.compress;

    // event ack callback
    if ('function' === typeof args[args.length - 1]) {
      debug('emitting packet with ack id %d', this.ids);
      this.acks[this.ids] = args.pop();
      packet.id = this.ids++;
    }

    if (this.connected) {
      this.packet(packet);
    } else {
      this.sendBuffer.push(packet);
    }

    this.flags = {};

    return this;
  };

  /**
   * Sends a packet.
   *
   * @param {Object} packet
   * @api private
   */

  Socket.prototype.packet = function (packet) {
    packet.nsp = this.nsp;
    this.io.packet(packet);
  };

  /**
   * Called upon engine `open`.
   *
   * @api private
   */

  Socket.prototype.onopen = function () {
    debug('transport is open - connecting');

    // write connect packet if necessary
    if ('/' !== this.nsp) {
      if (this.query) {
        var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
        debug('sending connect packet with query %s', query);
        this.packet({type: socket_ioParser.CONNECT, query: query});
      } else {
        this.packet({type: socket_ioParser.CONNECT});
      }
    }
  };

  /**
   * Called upon engine `close`.
   *
   * @param {String} reason
   * @api private
   */

  Socket.prototype.onclose = function (reason) {
    debug('close (%s)', reason);
    this.connected = false;
    this.disconnected = true;
    delete this.id;
    this.emit('disconnect', reason);
  };

  /**
   * Called with socket packet.
   *
   * @param {Object} packet
   * @api private
   */

  Socket.prototype.onpacket = function (packet) {
    var sameNamespace = packet.nsp === this.nsp;
    var rootNamespaceError = packet.type === socket_ioParser.ERROR && packet.nsp === '/';

    if (!sameNamespace && !rootNamespaceError) return;

    switch (packet.type) {
      case socket_ioParser.CONNECT:
        this.onconnect();
        break;

      case socket_ioParser.EVENT:
        this.onevent(packet);
        break;

      case socket_ioParser.BINARY_EVENT:
        this.onevent(packet);
        break;

      case socket_ioParser.ACK:
        this.onack(packet);
        break;

      case socket_ioParser.BINARY_ACK:
        this.onack(packet);
        break;

      case socket_ioParser.DISCONNECT:
        this.ondisconnect();
        break;

      case socket_ioParser.ERROR:
        this.emit('error', packet.data);
        break;
    }
  };

  /**
   * Called upon a server event.
   *
   * @param {Object} packet
   * @api private
   */

  Socket.prototype.onevent = function (packet) {
    var args = packet.data || [];
    debug('emitting event %j', args);

    if (null != packet.id) {
      debug('attaching ack callback to event');
      args.push(this.ack(packet.id));
    }

    if (this.connected) {
      emit.apply(this, args);
    } else {
      this.receiveBuffer.push(args);
    }
  };

  /**
   * Produces an ack callback to emit with an event.
   *
   * @api private
   */

  Socket.prototype.ack = function (id) {
    var self = this;
    var sent = false;
    return function () {
      // prevent double callbacks
      if (sent) return;
      sent = true;
      var args = toArray_1(arguments);
      debug('sending ack %j', args);

      self.packet({
        type: hasBinary2(args) ? socket_ioParser.BINARY_ACK : socket_ioParser.ACK,
        id: id,
        data: args
      });
    };
  };

  /**
   * Called upon a server acknowlegement.
   *
   * @param {Object} packet
   * @api private
   */

  Socket.prototype.onack = function (packet) {
    var ack = this.acks[packet.id];
    if ('function' === typeof ack) {
      debug('calling ack %s with %j', packet.id, packet.data);
      ack.apply(this, packet.data);
      delete this.acks[packet.id];
    } else {
      debug('bad ack %s', packet.id);
    }
  };

  /**
   * Called upon server connect.
   *
   * @api private
   */

  Socket.prototype.onconnect = function () {
    this.connected = true;
    this.disconnected = false;
    this.emit('connect');
    this.emitBuffered();
  };

  /**
   * Emit buffered events (received and emitted).
   *
   * @api private
   */

  Socket.prototype.emitBuffered = function () {
    var i;
    for (i = 0; i < this.receiveBuffer.length; i++) {
      emit.apply(this, this.receiveBuffer[i]);
    }
    this.receiveBuffer = [];

    for (i = 0; i < this.sendBuffer.length; i++) {
      this.packet(this.sendBuffer[i]);
    }
    this.sendBuffer = [];
  };

  /**
   * Called upon server disconnect.
   *
   * @api private
   */

  Socket.prototype.ondisconnect = function () {
    debug('server disconnect (%s)', this.nsp);
    this.destroy();
    this.onclose('io server disconnect');
  };

  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @api private.
   */

  Socket.prototype.destroy = function () {
    if (this.subs) {
      // clean subscriptions to avoid reconnections
      for (var i = 0; i < this.subs.length; i++) {
        this.subs[i].destroy();
      }
      this.subs = null;
    }

    this.io.destroy(this);
  };

  /**
   * Disconnects the socket manually.
   *
   * @return {Socket} self
   * @api public
   */

  Socket.prototype.close =
  Socket.prototype.disconnect = function () {
    if (this.connected) {
      debug('performing disconnect (%s)', this.nsp);
      this.packet({ type: socket_ioParser.DISCONNECT });
    }

    // remove socket from pool
    this.destroy();

    if (this.connected) {
      // fire events
      this.onclose('io client disconnect');
    }
    return this;
  };

  /**
   * Sets the compress flag.
   *
   * @param {Boolean} if `true`, compresses the sending data
   * @return {Socket} self
   * @api public
   */

  Socket.prototype.compress = function (compress) {
    this.flags.compress = compress;
    return this;
  };

  /**
   * Sets the binary flag
   *
   * @param {Boolean} whether the emitted data contains binary
   * @return {Socket} self
   * @api public
   */

  Socket.prototype.binary = function (binary) {
    this.flags.binary = binary;
    return this;
  };
  });

  /**
   * Expose `Backoff`.
   */

  var backo2 = Backoff;

  /**
   * Initialize backoff timer with `opts`.
   *
   * - `min` initial timeout in milliseconds [100]
   * - `max` max timeout [10000]
   * - `jitter` [0]
   * - `factor` [2]
   *
   * @param {Object} opts
   * @api public
   */

  function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 10000;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
  }

  /**
   * Return the backoff duration.
   *
   * @return {Number}
   * @api public
   */

  Backoff.prototype.duration = function(){
    var ms = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
      var rand =  Math.random();
      var deviation = Math.floor(rand * this.jitter * ms);
      ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
    }
    return Math.min(ms, this.max) | 0;
  };

  /**
   * Reset the number of attempts.
   *
   * @api public
   */

  Backoff.prototype.reset = function(){
    this.attempts = 0;
  };

  /**
   * Set the minimum duration
   *
   * @api public
   */

  Backoff.prototype.setMin = function(min){
    this.ms = min;
  };

  /**
   * Set the maximum duration
   *
   * @api public
   */

  Backoff.prototype.setMax = function(max){
    this.max = max;
  };

  /**
   * Set the jitter
   *
   * @api public
   */

  Backoff.prototype.setJitter = function(jitter){
    this.jitter = jitter;
  };

  /**
   * Module dependencies.
   */







  var debug$6 = browser('socket.io-client:manager');



  /**
   * IE6+ hasOwnProperty
   */

  var has = Object.prototype.hasOwnProperty;

  /**
   * Module exports
   */

  var manager = Manager;

  /**
   * `Manager` constructor.
   *
   * @param {String} engine instance or engine uri/opts
   * @param {Object} options
   * @api public
   */

  function Manager (uri, opts) {
    if (!(this instanceof Manager)) return new Manager(uri, opts);
    if (uri && ('object' === typeof uri)) {
      opts = uri;
      uri = undefined;
    }
    opts = opts || {};

    opts.path = opts.path || '/socket.io';
    this.nsps = {};
    this.subs = [];
    this.opts = opts;
    this.reconnection(opts.reconnection !== false);
    this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
    this.reconnectionDelay(opts.reconnectionDelay || 1000);
    this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
    this.randomizationFactor(opts.randomizationFactor || 0.5);
    this.backoff = new backo2({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    });
    this.timeout(null == opts.timeout ? 20000 : opts.timeout);
    this.readyState = 'closed';
    this.uri = uri;
    this.connecting = [];
    this.lastPing = null;
    this.encoding = false;
    this.packetBuffer = [];
    var _parser = opts.parser || socket_ioParser;
    this.encoder = new _parser.Encoder();
    this.decoder = new _parser.Decoder();
    this.autoConnect = opts.autoConnect !== false;
    if (this.autoConnect) this.open();
  }

  /**
   * Propagate given event to sockets and emit on `this`
   *
   * @api private
   */

  Manager.prototype.emitAll = function () {
    this.emit.apply(this, arguments);
    for (var nsp in this.nsps) {
      if (has.call(this.nsps, nsp)) {
        this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
      }
    }
  };

  /**
   * Update `socket.id` of all sockets
   *
   * @api private
   */

  Manager.prototype.updateSocketIds = function () {
    for (var nsp in this.nsps) {
      if (has.call(this.nsps, nsp)) {
        this.nsps[nsp].id = this.generateId(nsp);
      }
    }
  };

  /**
   * generate `socket.id` for the given `nsp`
   *
   * @param {String} nsp
   * @return {String}
   * @api private
   */

  Manager.prototype.generateId = function (nsp) {
    return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
  };

  /**
   * Mix in `Emitter`.
   */

  componentEmitter(Manager.prototype);

  /**
   * Sets the `reconnection` config.
   *
   * @param {Boolean} true/false if it should automatically reconnect
   * @return {Manager} self or value
   * @api public
   */

  Manager.prototype.reconnection = function (v) {
    if (!arguments.length) return this._reconnection;
    this._reconnection = !!v;
    return this;
  };

  /**
   * Sets the reconnection attempts config.
   *
   * @param {Number} max reconnection attempts before giving up
   * @return {Manager} self or value
   * @api public
   */

  Manager.prototype.reconnectionAttempts = function (v) {
    if (!arguments.length) return this._reconnectionAttempts;
    this._reconnectionAttempts = v;
    return this;
  };

  /**
   * Sets the delay between reconnections.
   *
   * @param {Number} delay
   * @return {Manager} self or value
   * @api public
   */

  Manager.prototype.reconnectionDelay = function (v) {
    if (!arguments.length) return this._reconnectionDelay;
    this._reconnectionDelay = v;
    this.backoff && this.backoff.setMin(v);
    return this;
  };

  Manager.prototype.randomizationFactor = function (v) {
    if (!arguments.length) return this._randomizationFactor;
    this._randomizationFactor = v;
    this.backoff && this.backoff.setJitter(v);
    return this;
  };

  /**
   * Sets the maximum delay between reconnections.
   *
   * @param {Number} delay
   * @return {Manager} self or value
   * @api public
   */

  Manager.prototype.reconnectionDelayMax = function (v) {
    if (!arguments.length) return this._reconnectionDelayMax;
    this._reconnectionDelayMax = v;
    this.backoff && this.backoff.setMax(v);
    return this;
  };

  /**
   * Sets the connection timeout. `false` to disable
   *
   * @return {Manager} self or value
   * @api public
   */

  Manager.prototype.timeout = function (v) {
    if (!arguments.length) return this._timeout;
    this._timeout = v;
    return this;
  };

  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @api private
   */

  Manager.prototype.maybeReconnectOnOpen = function () {
    // Only try to reconnect if it's the first time we're connecting
    if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
      // keeps reconnection from firing twice for the same reconnection loop
      this.reconnect();
    }
  };

  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} optional, callback
   * @return {Manager} self
   * @api public
   */

  Manager.prototype.open =
  Manager.prototype.connect = function (fn, opts) {
    debug$6('readyState %s', this.readyState);
    if (~this.readyState.indexOf('open')) return this;

    debug$6('opening %s', this.uri);
    this.engine = lib(this.uri, this.opts);
    var socket = this.engine;
    var self = this;
    this.readyState = 'opening';
    this.skipReconnect = false;

    // emit `open`
    var openSub = on_1(socket, 'open', function () {
      self.onopen();
      fn && fn();
    });

    // emit `connect_error`
    var errorSub = on_1(socket, 'error', function (data) {
      debug$6('connect_error');
      self.cleanup();
      self.readyState = 'closed';
      self.emitAll('connect_error', data);
      if (fn) {
        var err = new Error('Connection error');
        err.data = data;
        fn(err);
      } else {
        // Only do this if there is no fn to handle the error
        self.maybeReconnectOnOpen();
      }
    });

    // emit `connect_timeout`
    if (false !== this._timeout) {
      var timeout = this._timeout;
      debug$6('connect attempt will timeout after %d', timeout);

      // set timer
      var timer = setTimeout(function () {
        debug$6('connect attempt timed out after %d', timeout);
        openSub.destroy();
        socket.close();
        socket.emit('error', 'timeout');
        self.emitAll('connect_timeout', timeout);
      }, timeout);

      this.subs.push({
        destroy: function () {
          clearTimeout(timer);
        }
      });
    }

    this.subs.push(openSub);
    this.subs.push(errorSub);

    return this;
  };

  /**
   * Called upon transport open.
   *
   * @api private
   */

  Manager.prototype.onopen = function () {
    debug$6('open');

    // clear old subs
    this.cleanup();

    // mark as open
    this.readyState = 'open';
    this.emit('open');

    // add new subs
    var socket = this.engine;
    this.subs.push(on_1(socket, 'data', componentBind(this, 'ondata')));
    this.subs.push(on_1(socket, 'ping', componentBind(this, 'onping')));
    this.subs.push(on_1(socket, 'pong', componentBind(this, 'onpong')));
    this.subs.push(on_1(socket, 'error', componentBind(this, 'onerror')));
    this.subs.push(on_1(socket, 'close', componentBind(this, 'onclose')));
    this.subs.push(on_1(this.decoder, 'decoded', componentBind(this, 'ondecoded')));
  };

  /**
   * Called upon a ping.
   *
   * @api private
   */

  Manager.prototype.onping = function () {
    this.lastPing = new Date();
    this.emitAll('ping');
  };

  /**
   * Called upon a packet.
   *
   * @api private
   */

  Manager.prototype.onpong = function () {
    this.emitAll('pong', new Date() - this.lastPing);
  };

  /**
   * Called with data.
   *
   * @api private
   */

  Manager.prototype.ondata = function (data) {
    this.decoder.add(data);
  };

  /**
   * Called when parser fully decodes a packet.
   *
   * @api private
   */

  Manager.prototype.ondecoded = function (packet) {
    this.emit('packet', packet);
  };

  /**
   * Called upon socket error.
   *
   * @api private
   */

  Manager.prototype.onerror = function (err) {
    debug$6('error', err);
    this.emitAll('error', err);
  };

  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @api public
   */

  Manager.prototype.socket = function (nsp, opts) {
    var socket = this.nsps[nsp];
    if (!socket) {
      socket = new socket$1(this, nsp, opts);
      this.nsps[nsp] = socket;
      var self = this;
      socket.on('connecting', onConnecting);
      socket.on('connect', function () {
        socket.id = self.generateId(nsp);
      });

      if (this.autoConnect) {
        // manually call here since connecting event is fired before listening
        onConnecting();
      }
    }

    function onConnecting () {
      if (!~indexof(self.connecting, socket)) {
        self.connecting.push(socket);
      }
    }

    return socket;
  };

  /**
   * Called upon a socket close.
   *
   * @param {Socket} socket
   */

  Manager.prototype.destroy = function (socket) {
    var index = indexof(this.connecting, socket);
    if (~index) this.connecting.splice(index, 1);
    if (this.connecting.length) return;

    this.close();
  };

  /**
   * Writes a packet.
   *
   * @param {Object} packet
   * @api private
   */

  Manager.prototype.packet = function (packet) {
    debug$6('writing packet %j', packet);
    var self = this;
    if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

    if (!self.encoding) {
      // encode, then write to engine with result
      self.encoding = true;
      this.encoder.encode(packet, function (encodedPackets) {
        for (var i = 0; i < encodedPackets.length; i++) {
          self.engine.write(encodedPackets[i], packet.options);
        }
        self.encoding = false;
        self.processPacketQueue();
      });
    } else { // add packet to the queue
      self.packetBuffer.push(packet);
    }
  };

  /**
   * If packet buffer is non-empty, begins encoding the
   * next packet in line.
   *
   * @api private
   */

  Manager.prototype.processPacketQueue = function () {
    if (this.packetBuffer.length > 0 && !this.encoding) {
      var pack = this.packetBuffer.shift();
      this.packet(pack);
    }
  };

  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @api private
   */

  Manager.prototype.cleanup = function () {
    debug$6('cleanup');

    var subsLength = this.subs.length;
    for (var i = 0; i < subsLength; i++) {
      var sub = this.subs.shift();
      sub.destroy();
    }

    this.packetBuffer = [];
    this.encoding = false;
    this.lastPing = null;

    this.decoder.destroy();
  };

  /**
   * Close the current socket.
   *
   * @api private
   */

  Manager.prototype.close =
  Manager.prototype.disconnect = function () {
    debug$6('disconnect');
    this.skipReconnect = true;
    this.reconnecting = false;
    if ('opening' === this.readyState) {
      // `onclose` will not fire because
      // an open event never happened
      this.cleanup();
    }
    this.backoff.reset();
    this.readyState = 'closed';
    if (this.engine) this.engine.close();
  };

  /**
   * Called upon engine close.
   *
   * @api private
   */

  Manager.prototype.onclose = function (reason) {
    debug$6('onclose');

    this.cleanup();
    this.backoff.reset();
    this.readyState = 'closed';
    this.emit('close', reason);

    if (this._reconnection && !this.skipReconnect) {
      this.reconnect();
    }
  };

  /**
   * Attempt a reconnection.
   *
   * @api private
   */

  Manager.prototype.reconnect = function () {
    if (this.reconnecting || this.skipReconnect) return this;

    var self = this;

    if (this.backoff.attempts >= this._reconnectionAttempts) {
      debug$6('reconnect failed');
      this.backoff.reset();
      this.emitAll('reconnect_failed');
      this.reconnecting = false;
    } else {
      var delay = this.backoff.duration();
      debug$6('will wait %dms before reconnect attempt', delay);

      this.reconnecting = true;
      var timer = setTimeout(function () {
        if (self.skipReconnect) return;

        debug$6('attempting reconnect');
        self.emitAll('reconnect_attempt', self.backoff.attempts);
        self.emitAll('reconnecting', self.backoff.attempts);

        // check again for the case socket closed in above events
        if (self.skipReconnect) return;

        self.open(function (err) {
          if (err) {
            debug$6('reconnect attempt error');
            self.reconnecting = false;
            self.reconnect();
            self.emitAll('reconnect_error', err.data);
          } else {
            debug$6('reconnect success');
            self.onreconnect();
          }
        });
      }, delay);

      this.subs.push({
        destroy: function () {
          clearTimeout(timer);
        }
      });
    }
  };

  /**
   * Called upon successful reconnect.
   *
   * @api private
   */

  Manager.prototype.onreconnect = function () {
    var attempt = this.backoff.attempts;
    this.reconnecting = false;
    this.backoff.reset();
    this.updateSocketIds();
    this.emitAll('reconnect', attempt);
  };

  var lib$1 = createCommonjsModule(function (module, exports) {
  /**
   * Module dependencies.
   */




  var debug = browser('socket.io-client');

  /**
   * Module exports.
   */

  module.exports = exports = lookup;

  /**
   * Managers cache.
   */

  var cache = exports.managers = {};

  /**
   * Looks up an existing `Manager` for multiplexing.
   * If the user summons:
   *
   *   `io('http://localhost/a');`
   *   `io('http://localhost/b');`
   *
   * We reuse the existing instance based on same scheme/port/host,
   * and we initialize sockets for each namespace.
   *
   * @api public
   */

  function lookup (uri, opts) {
    if (typeof uri === 'object') {
      opts = uri;
      uri = undefined;
    }

    opts = opts || {};

    var parsed = url_1(uri);
    var source = parsed.source;
    var id = parsed.id;
    var path = parsed.path;
    var sameNamespace = cache[id] && path in cache[id].nsps;
    var newConnection = opts.forceNew || opts['force new connection'] ||
                        false === opts.multiplex || sameNamespace;

    var io;

    if (newConnection) {
      debug('ignoring socket cache for %s', source);
      io = manager(source, opts);
    } else {
      if (!cache[id]) {
        debug('new io instance for %s', source);
        cache[id] = manager(source, opts);
      }
      io = cache[id];
    }
    if (parsed.query && !opts.query) {
      opts.query = parsed.query;
    }
    return io.socket(parsed.path, opts);
  }

  /**
   * Protocol version.
   *
   * @api public
   */

  exports.protocol = socket_ioParser.protocol;

  /**
   * `connect`.
   *
   * @param {String} uri
   * @api public
   */

  exports.connect = lookup;

  /**
   * Expose constructors for standalone build.
   *
   * @api public
   */

  exports.Manager = manager;
  exports.Socket = socket$1;
  });
  var lib_1 = lib$1.managers;
  var lib_2 = lib$1.protocol;
  var lib_3 = lib$1.connect;
  var lib_4 = lib$1.Manager;
  var lib_5 = lib$1.Socket;

  /*
   *  action types
   */

  const REG_TO_CENTER = 'REG_TO_CENTER';
  const UPDATE_SOCK_STAT = 'UPDATE_SOCK_STAT';

  /*
   *  action creators
   */

  function regToCenter({ EiToken = '', SToken = '', UToken = '' }) {
      return {
          type: REG_TO_CENTER,
          EiToken, SToken, UToken 
      }
  }

  function updateSockStat({ isConnected = false }) {
      return {
          type: UPDATE_SOCK_STAT,
          isConnected
      }
  }

  function sockStat(state = false, action) {
      switch (action.type) {
          case UPDATE_SOCK_STAT:
              return action.isConnected
          default:
              return state
      }
  }

  function mms(state = {}, action) {
      switch (action.type) {
          case REG_TO_CENTER:
              return {
                  EiToken: action.EiToken,
                  SToken: action.SToken,
                  UToken: action.UToken
              }
          default:
              return state
      }
  }

  const reducers = combineReducers({
      sockStat,
      mms
  });

  const getipurl = 'https://env.ypcloud.com/getwip';
  const waitForWIP = () => axios$1({
      method: 'get',
      url: getipurl,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      timeout: 5000
  });

  const mmserr = {
      "OK": { "code": 0, "msg": "OK" },
      "InvalidData": { "code": -10501, "msg": "ms: Invalid data" },
      "InvalidCmd": { "code": -10502, "msg": "ms: Invalid command" },
      "NullSToken": { "code": -10503, "msg": "ms: SToken error" },
      "DCNotConn": { "code": -10504, "msg": "ms: DC not link" },
      "NullCmd": { "code": -10505, "msg": "ms: Blank cmd" }
  };

  Object.freeze(mmserr);

  const inHandler = (inctl, data, ack) => {
      let ddn = '';
      try {
          ddn = inctl.To.DDN ? inctl.To.DDN : ddn;
      } catch (e) {
          ddn = '';
      }

      let { cmd = '' } = data;
      cmd = cmd.toLowerCase();

      let result;
      switch (cmd) {
          case 'ping':
          case 'trace':
          case 'tracedc': {
              let { trace } = data;
              if (Array.isArray(trace) && cmd != 'tracedc') {
                  trace.push({ ddn, time: new Date() });
              }

              result = {
                  response: cmd,
                  ErrCode: mmserr.OK.code,
                  ErrMsg: mmserr.OK.msg,
                  Trace: trace
              };
              break
          }
          default: {
              result = {
                  response: cmd,
                  ErrCode: mmserr.InvalidData.code,
                  ErrMsg: mmserr.InvalidData.msg
              };
              break
          }
      }
      if (typeof cb === 'function') cb(result);
  };

  function createMMS({ wsurl = 'https://lib.ypcloud.com' } = {}) {
      let webmms = {
          events: new Map([]),

          store: createStore(reducers, {
              sockStat: false,
              mms: { EiToken: '', SToken: '', UToken: '' }
          }),

          socket: lib$1(wsurl, {
              reconnection: true,
              reconnectionDelay: 1000,
              reconnectionDelayMax: 5000,
              reconnectionAttempts: Infinity
          }),

          on(name, cb) {
              this.events.set(name, [...(this.events.get(name) || []), cb]);
              return () => this.events.set(name, this.events.get(name).filter(fn => fn !== cb))
          },

          emit(name, ...args) {
              return this.events.has(name) && this.events.get(name).map(fn => fn(...args))
          },

          sendMMS({ topic, DDN, payload } = {}) {
              let { sockStat } = this.store.getState();
              if (!sockStat) return Promise.reject('websocket not ready')

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'send',
                      body: { topic, ddn: DDN, data: payload }
                  }, function (reply) { resolve(reply); });
              })
          },

          callMMS({ topic, DDN, func, payload } = {}) {
              let { sockStat } = this.store.getState();
              if (!sockStat) return Promise.reject('websocket not ready')

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'call',
                      data: { topic, ddn: DDN, func, args: payload }
                  }, function (reply) { resolve(reply); });
              })
          },

          nearby() {
              let { sockStat, mms } = this.store.getState();
              if (!sockStat) return Promise.reject({
                  ErrCode: mmserr.DCNotConn.code,
                  ErrMsg: mmserr.DCNotConn.msg
              })

              let { SToken } = mms;
              if (!SToken) return Promise.reject({
                  ErrCode: mmserr.NullSToken.code,
                  ErrMsg: mmserr.NullSToken.msg
              })

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'nearby',
                      data: { SToken }
                  }, function (reply) { resolve(reply); });
              })
          },

          getDeviceInfo() {
              let { sockStat, mms } = this.store.getState();
              if (!sockStat) return Promise.reject({
                  ErrCode: mmserr.DCNotConn.code,
                  ErrMsg: mmserr.DCNotConn.msg
              })

              let { SToken } = mms;
              if (!SToken) return Promise.reject({
                  ErrCode: mmserr.NullSToken.code,
                  ErrMsg: mmserr.NullSToken.msg
              })

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'getinfo', data: { SToken }
                  }, function (reply) { resolve(reply); });
              })
          },

          setDeviceInfo(deviceInfo) {
              let { sockStat, mms } = this.store.getState();
              if (!sockStat) return Promise.reject({
                  ErrCode: mmserr.DCNotConn.code,
                  ErrMsg: mmserr.DCNotConn.msg
              })

              let { SToken } = mms;
              if (!SToken) return Promise.reject({
                  ErrCode: mmserr.NullSToken.code,
                  ErrMsg: mmserr.NullSToken.msg
              })

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'setinfo',
                      data: { SToken, EdgeInfo: deviceInfo }
                  }, function (reply) { resolve(reply); });
              })
          },

          getAppSetting() {
              let { sockStat, mms } = this.store.getState();
              if (!sockStat) return Promise.reject({
                  ErrCode: mmserr.DCNotConn.code,
                  ErrMsg: mmserr.DCNotConn.msg
              })

              let { SToken } = mms;
              if (!SToken) return Promise.reject({
                  ErrCode: mmserr.NullSToken.code,
                  ErrMsg: mmserr.NullSToken.msg
              })

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'getapp', data: { SToken }
                  }, function (reply) { resolve(reply); });
              })
          },

          setAppSetting(setting) {
              let { sockStat, mms } = this.store.getState();
              if (!sockStat) return Promise.reject({
                  ErrCode: mmserr.DCNotConn.code,
                  ErrMsg: mmserr.DCNotConn.msg
              })

              let { SToken } = mms;
              if (!SToken) return Promise.reject({
                  ErrCode: mmserr.NullSToken.code,
                  ErrMsg: mmserr.NullSToken.msg
              })

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'setapp',
                      data: { SToken, Setting: JSON.stringify(setting) }
                  }, function (reply) { resolve(reply); });
              })
          },

          getQPin() {
              let { sockStat, mms } = this.store.getState();
              if (!sockStat) return Promise.reject({
                  ErrCode: mmserr.DCNotConn.code,
                  ErrMsg: mmserr.DCNotConn.msg
              })

              let { SToken } = mms;
              if (!SToken) return Promise.reject({
                  ErrCode: mmserr.NullSToken.code,
                  ErrMsg: mmserr.NullSToken.msg
              })

              return new Promise(resolve => {
                  this.socket.emit('request', {
                      func: 'getgpin', data: { SToken }
                  }, function (reply) { resolve(reply); });
              })
          }
      };

      webmms.socket.on('connect', async function () {
          let { sockStat, mms } = webmms.store.getState();
          if (sockStat) return
          let { EiToken, SToken } = mms;

          webmms.store.dispatch(updateSockStat({ isConnected: true }));
          let { data: wip } = await waitForWIP();
          webmms.wip = wip;

          let payload = {
              func: 'regdc',
              data: { EiToken, SToken, WIP: wip }
          };

          webmms.socket.emit('request', payload, function (reply) {
              if (reply.ErrCode == mmserr.OK.code) {
                  let { EiToken, SToken } = reply.result;
                  webmms.store.dispatch(regToCenter({
                      EiToken, SToken, UToken: ''
                  }));
                  webmms.dcStat = 'connected';
                  webmms.emit('registered', reply);
              }
          });
      });

      webmms.socket.on('message', function (body, ack) {
          if (typeof body !== 'object') return

          let { method, ctl: inctl, data } = body;
          let { From: from, msgtype = '' } = inctl;
          
          if (!msgtype) {
              webmms.emit('message', method, from, data, ack);
              return
          }

          if (msgtype === 'in') {
              inHandler(inctl, data);
              return
          }

          if (typeof ack === 'function') ack({
              ErrCode: mmserr.InvalidData.code,
              ErrMsg: mmserr.InvalidData.msg
          });
      });

      webmms.socket.on('state', function (msg) {
          webmms.emit('state', `motechat ${msg}`);
      });

      webmms.socket.on('reconnect', function () {
          let { sockStat, mms } = webmms.store.getState();
          if (sockStat) return
          let { EiToken, SToken } = mms;

          webmms.store.dispatch(updateSockStat({ isConnected: true }));

          let payload = {
              func: 'regdc',
              data: { EiToken, SToken, WIP: webmms.wip }
          };

          webmms.socket.emit('request', payload, function (reply) {
              if (reply.ErrCode == mmserr.OK.code) {
                  let { EiToken, SToken } = reply.result;
                  webmms.store.dispatch(regToCenter({
                      EiToken, SToken, UToken: ''
                  }));
                  webmms.dcStat = 'connected';
                  webmms.emit('registered', reply);
              }
          });
      });

      webmms.socket.on('disconnect', function () {
          webmms.store.dispatch(updateSockStat({ isConnected: true }));
          webmms.emit('disconnect', 'websocket disconnect');
      });

      webmms.socket.on('error', function (err) {
          webmms.emit('error', err);
      });

      webmms.socket.on('connect_error', function () {
          webmms.emit('connect_error', 'websocket connect error');
      });

      webmms.socket.on('connect_timeout', function () {
          webmms.emit('connect_timeout', 'websocket connect timeout');
      });

      return webmms
  }

  return createMMS;

}));
