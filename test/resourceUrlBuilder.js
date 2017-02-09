/*
 * @author David Menger
 */

import { assert } from 'chai';
import { resourceUrl, findAll } from '../src/resourceUrlBuilder';

describe('resourceUrlBuilder', function () {

    describe('#resourceUrl()', function () {

        it('should just call a function', function () {
            const RET = {};
            const fn = sinon.spy(() => RET);

            assert.strictEqual(resourceUrl(fn, 123), RET, 'should return fn value');
            assert(fn.calledOnce);
            assert.deepEqual(fn.firstCall.args, [123]);
        });

        it('should simply remove the ID PLACEHOLDER', function () {
            let ret = resourceUrl('/some/:id', 12);
            assert.strictEqual(ret, '/some/12');

            ret = resourceUrl('/some/:id?q=1', 24);
            assert.strictEqual(ret, '/some/24?q=1');

            ret = resourceUrl('/some/:id?q=1', 'str');
            assert.strictEqual(ret, '/some/str?q=1');
        });

    });

    describe('#findAll()', function () {

        it('should just call a function', function () {
            const RET = {};
            const fn = sinon.spy(() => RET);

            assert.strictEqual(findAll(fn, { q: 1 }), RET, 'should return fn value');
            assert(fn.calledOnce);
            assert.deepEqual(fn.firstCall.args, [null, { q: 1 }]);
        });

        it('should simply remove the ID PLACEHOLDER', function () {
            let ret = findAll('/some/:id', { order: 1, other: 'a' });
            assert.strictEqual(ret, '/some?order=1&other=a');

            ret = findAll('/some/:id?', {});
            assert.strictEqual(ret, '/some');

            ret = findAll('/some/:id?k=1', {});
            assert.strictEqual(ret, '/some?k=1');

            ret = findAll('/some/:id?q=1', { order: 1, other: 'a' });
            assert.strictEqual(ret, '/some?q=1&order=1&other=a');
        });

        it('should keep query in querystring and override existing', function () {
            let ret = findAll('/some/url?q=1', { order: 1, other: 'a' });
            assert.strictEqual(ret, '/some/url?q=1&order=1&other=a');

            ret = findAll('/some/url?q=1&other=b', { order: 1, other: 'a' });
            assert.strictEqual(ret, '/some/url?q=1&other=a&order=1');
        });

    });
});
