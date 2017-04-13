/*
 * @author David Menger
 */

import React from 'react';
import { mount } from 'enzyme';
import { assert } from 'chai';
import RelationCell from '../../src/components/cells/RelationCell';
import RelationCellConfigurator from '../../src/cells/RelationCellConfigurator';

const TEST_DATA = { id: 1, name: 'Foo', attr: 'Bar', array: ['Haha'] };
const RELATION_DATA = [{ id: 'Bar', field: 'Related Name' }];

describe('<RelationCell>', function () {

    it('should work in default configuration', function (done) {
        const cfg = new RelationCellConfigurator('attr', 'Name');

        cfg.setResource('/api/entity', 'field');

        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: RELATION_DATA })]);

        const app = mount(
            <RelationCell
                data={TEST_DATA}
                config={cfg.config}
            />
        );

        assert.equal(app.find('div').length, 1, 'There should be a div');
        assert.equal(app.find('div').text(), '', 'Content should be empty');


        setTimeout(() => {
            server.respond();

            setTimeout(() => {
                assert.equal(app.find('div').text(), 'Related Name', 'Content should be filled');
                done();
            }, 20);
        }, 20);
    });

    it('should display nice error', function (done) {
        const cfg = new RelationCellConfigurator('attr', 'Name');

        cfg.setResource('/api/entity', 'field');
        cfg.setLoader('L');
        cfg.setErrorContent('E');

        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [500, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: RELATION_DATA })]);

        const app = mount(
            <RelationCell
                data={TEST_DATA}
                config={cfg.config}
            />
        );

        assert.equal(app.find('div').length, 1, 'There should be a div');
        assert.equal(app.find('div').text(), 'L', 'Content should be empty');


        setTimeout(() => {
            server.respond();

            setTimeout(() => {
                assert.equal(app.find('div').text(), 'E', 'Content should be filled');
                done();
            }, 20);
        }, 20);
    });

});
