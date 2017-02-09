/*
 * @author David Menger
 */

const ID_PLACEHOLDER = ':id';
const LAST_SLASH = /\/(?=$|\?)/;

function appendQuery (url, queryObject) {
    const parts = url.split('?');
    const queryKeys = Object.keys(queryObject);
    let encodedQuery;

    if (queryKeys.length !== 0) {
        const query = (parts[1] || '')
            .split('&')
            .filter(part => !!part)
            .map(string => string.split('='))
            .map(array => ({ key: array[0], value: array[1] }))
            .reduce((obj, q) => Object.assign(obj, { [q.key]: q.value }), {});

        queryKeys
            .filter(key => queryObject[key] !== null && queryObject[key] !== undefined)
            .forEach((key) => {
                query[encodeURIComponent(key)] = encodeURIComponent(queryObject[key]);
            });

        encodedQuery = Object.keys(query)
            .map(key => `${key}=${query[key]}`)
            .join('&');

        encodedQuery = `?${encodedQuery}`;

    } else if (parts[1]) {
        encodedQuery = `?${parts[1]}`;
    } else {
        encodedQuery = '';
    }

    return `${parts[0]}${encodedQuery}`;
}

export function resourceUrl (resource, id = '') {
    if (typeof resource === 'function') {
        return resource(id);
    }

    let ret = `${resource}`.replace(ID_PLACEHOLDER, encodeURIComponent(id));

    if (!id) {
        ret = ret.replace(LAST_SLASH, '');
    }

    return ret;
}

export function findAll (resource, query = {}) {
    if (typeof resource === 'function') {
        return resource(null, query);
    }

    const url = resourceUrl(resource);

    return appendQuery(url, query);
}

export default {
    findAll,
    resourceUrl
};
