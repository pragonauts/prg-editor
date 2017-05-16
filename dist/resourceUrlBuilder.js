'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resourceUrl = resourceUrl;
exports.findAll = findAll;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ID_PLACEHOLDER = ':id';
var LAST_SLASH = /\/(?=$|\?)/;

function appendQuery(url, queryObject) {
    var parts = url.split('?');
    var queryKeys = Object.keys(queryObject);
    var encodedQuery = void 0;

    if (queryKeys.length !== 0) {
        var query = (parts[1] || '').split('&').filter(function (part) {
            return !!part;
        }).map(function (string) {
            return string.split('=');
        }).map(function (array) {
            return { key: array[0], value: array[1] };
        }).reduce(function (obj, q) {
            return Object.assign(obj, _defineProperty({}, q.key, q.value));
        }, {});

        queryKeys.filter(function (key) {
            return queryObject[key] !== null && queryObject[key] !== undefined;
        }).forEach(function (key) {
            query[encodeURIComponent(key)] = encodeURIComponent(queryObject[key]);
        });

        encodedQuery = Object.keys(query).map(function (key) {
            return key + '=' + query[key];
        }).join('&');

        encodedQuery = '?' + encodedQuery;
    } else if (parts[1]) {
        encodedQuery = '?' + parts[1];
    } else {
        encodedQuery = '';
    }

    return '' + parts[0] + encodedQuery;
}

function resourceUrl(resource) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (typeof resource === 'function') {
        return resource(id);
    }

    var ret = ('' + resource).replace(ID_PLACEHOLDER, encodeURIComponent(id));

    if (!id) {
        ret = ret.replace(LAST_SLASH, '');
    }

    return ret;
}

function findAll(resource) {
    var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof resource === 'function') {
        return resource(null, query);
    }

    var url = resourceUrl(resource);

    return appendQuery(url, query);
}

exports.default = {
    findAll: findAll,
    resourceUrl: resourceUrl
};