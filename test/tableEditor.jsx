
import React from 'react';
import { mount } from 'enzyme';
import { assert } from 'chai';
import { Input } from 'prg-form';
import TableEditor from '../src/components/TableEditor';
import Editor from '../src/components/Editor';
import TableBuilder from '../src/TableBuilder';
import AjaxResource from '../src/AjaxResource';

const RESOURCE = '/api/entity/:id';

const DEFAULT_DATA = [
    { id: 1, name: 'Foo' },
    { id: 2, name: 'Bar' }
];

function nextTick () {
    return new Promise(r => setTimeout(r, 1));
}

function fakeValidator () {
    return {
        validate: sinon.spy(() => Promise.resolve()),
        validateProp: sinon.spy(() => Promise.resolve())
    };
}

describe('<TableEditor>', function () {

    it('should render nice table-editor depending on configuration', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
            />
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert.equal(server.requests[0].url, '/api/entity?offset=0&order=1&limit=20');

        server.respond();
        return nextTick()
            .then(() => {
                assert.equal(app.find('.error').length, 0, 'there should be no error');
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert.equal(app.find('td').first().text(), 'Foo', 'first should be `Foo`');
                assert.equal(app.find('.add-button').length, 0, 'there should be no add button, when form is missing');

                server.restore();
            });
    });


    it('should render table-editor with working filter', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
            >
                <header>
                    <Input type="text" name="search" />
                </header>
            </TableEditor>
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert.equal(server.requests[0].url, '/api/entity?offset=0&order=1&limit=20');

        server.respond();

        return nextTick()
            .then(() => {
                assert.equal(app.find('.error').length, 0, 'there should be no error');
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert.equal(app.find('td').first().text(), 'Foo', 'first should be `Foo`');
                assert.equal(app.find('.add-button').length, 0, 'there should be no add button, when form is missing');
                assert.equal(app.find('.is-filter-reset').length, 0, 'there should be no filter reset button');

                const formFilter = app.find('form.form-filter');

                assert.equal(formFilter.length, 1, 'there should be form filter');

                // try to submit a form
                formFilter.find('Input').node.setValue('search string');
                formFilter.simulate('submit');

                assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
                assert.equal(server.requests[1].url, '/api/entity?offset=0&order=1&limit=20&search=search%20string&page=0');

                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(app.find('.error').length, 0, 'there should be no error');
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert.equal(app.find('.is-filter-reset').length, 1, 'there should appear filter reset button');

                // click the button
                app.find('button.is-filter-reset').simulate('click');

                assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
                assert.equal(server.requests[2].url, '/api/entity?offset=0&order=1&limit=20');
            })
            .then(() => {
                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(app.find('.error').length, 0, 'there should be no error');
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert.equal(app.find('button.is-filter-reset').length, 0, 'there should be no filter reset button');

                server.restore();
            });
    });


    it('should provide pagination', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA, nextOffset: 20, offset: 0 })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
            />
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert(app.find('.page-next').first().is('button[disabled]'), 'pagination should be disabled during first load');
        assert.equal(server.requests[0].url, '/api/entity?offset=0&order=1&limit=20');

        server.respond();
        return nextTick()
            .then(() => {
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert(app.find('.page-next').first().not('button[disabled]'), 'next page should be enabled after load');

                // load a next page
                app.find('.page-next').at(0).simulate('click');
                return nextTick();
            })
            .then(() => {

                assert.equal(server.requests[1].url, '/api/entity?offset=20&order=1&limit=20');

                assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
                assert(app.find('.page-next').first().is('button[disabled]'), 'next should be disabled during second load');
                assert(app.find('.page-last').first().is('button[disabled]'), 'last should be disabled during second load');
                assert(app.find('.page-prev').first().not('button[disabled]'), 'previous should be enabled during second load');
                assert(app.find('.page-first').first().not('button[disabled]'), 'first should be enabled during second load');

                // finish loading
                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert(app.find('.page-next').first().is('button[disabled]'), 'next page should be disabled, when nextPage is same as current');

                assert(app.find('.page-first').first().not('button[disabled]'), 'first should be disabled during second load');
                assert(app.find('.page-last').first().is('button[disabled]'), 'last should be disabled during second load');
                assert(app.find('.page-prev').first().not('button[disabled]'), 'previous should be enabled during second load');

                server.restore();
            });
    });

    it('should be able to disable pagination', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA, nextOffset: 20, offset: 0 })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
                noPagination
            />
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert.equal(server.requests[0].url, '/api/entity?order=1');

        server.respond();
        return nextTick()
            .then(() => {
                assert.equal(app.find('td').length, 2, 'there should be two cells');

                // there should be no pagination
                assert.equal(app.find('.page-next').length, 0, 'there should be no pagination');
                server.restore();
            });
    });

    it('should make concurrent request, when pagination clicked fast', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA, nextOffset: 20, offset: 0 })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
            />
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');

        server.respond();

        return nextTick()
            .then(() => {
                assert.equal(app.find('div.loading').length, 0, 'table should start in loading state');

                // load a next page
                app.find('.page-last').first().simulate('click');
                return nextTick();
            })
            .then(() => {
                assert.equal(server.requests[1].url, '/api/entity?offset=-1&order=1&limit=20');

                assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');

                // click to first page
                app.find('.page-first').first().simulate('click');
                return nextTick();
            })
            .then(() => {
                assert.equal(server.requests[2].url, '/api/entity?offset=0&order=1&limit=20');

                // finish loading
                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(app.find('.error').length, 0, 'there should be no error');
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert(app.find('.page-next').first().is('button[disabled]'), 'next page should be disabled, when nextPage is same as current');

                assert(app.find('.page-first').first().not('button[disabled]'), 'first should be disabled during second load');
                assert(app.find('.page-last').first().is('button[disabled]'), 'last should be disabled during second load');
                assert(app.find('.page-prev').first().not('button[disabled]'), 'previous should be enabled during second load');

                server.restore();
            });
    });

    it('should render editor, when form is provided', function () {

        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
            >
                <Editor
                    validator={fakeValidator()}
                >
                    <Input type="text" name="another" />
                    <Input type="text" name="name" />
                </Editor>
            </TableEditor>
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert.equal(server.requests[0].url, '/api/entity?offset=0&order=1&limit=20');

        server.respond();
        return nextTick()
            .then(() => {

                assert.equal(app.find('.error').length, 0, 'there should be no error');
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert.equal(app.find('td').first().text(), 'Foo', 'first should be `Foo`');
                assert.equal(app.find('.add-button').length, 1, 'there should be add button');

                // open the editor modal
                app.find('.add-button').simulate('click');

                const modal = app.find('.modal');
                assert.equal(modal.length, 1, 'there should be a modal');
                assert.equal(modal.find('button.close').length, 1, 'modal should have a close button');

                // close the editor modal
                modal.find('button.close').simulate('click');
                // simulate bootstrap close event (because no animation end is triggered)
                assert.equal(app.find('.modal').length, 0, 'there should be no modal after it`s close');

                server.restore();
            });
    });


    it('should be able to open the editor with method', function () {
        const server = sinon.fakeServer.create();

        const expectedData = { id: 1, name: 'modifiedNew' };

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
            >
                <Editor
                    validator={fakeValidator()}
                >
                    <Input type="text" name="name" />
                </Editor>
            </TableEditor>
        );

        server.respond();
        return nextTick()
            .then(() => {

                assert.equal(app.find('.add-button').length, 1, 'there should be no add button');

                // open the editor modal
                app.instance().edit(DEFAULT_DATA[0]);

                const modal = app.find('.modal');
                assert.equal(modal.length, 1, 'there should be a modal');
                assert.equal(modal.find('input[name="name"]').prop('value'), DEFAULT_DATA[0].name, 'input should have still same value');

                // change the value
                modal.find('Input').node.setValue('new');

                // submit the form
                app.find('.form-editor').simulate('submit');

                return nextTick();
            })
            .then(() => {
                assert.equal(server.requests[1].url, '/api/entity/1');
                assert.equal(server.requests[1].method, 'PUT');
                assert.equal(server.requests[1].requestBody, '{"name":"new"}');

                // make bad response and check the behavior
                server.respond('PUT', /^\/api\/entity/,
                    [400, { 'Content-Type': 'application/json' },
                        JSON.stringify({})]);

                return nextTick();
            })
            .then(() => {
                const modal = app.find('.modal');

                assert.equal(modal.find('input[name="name"]').prop('value'), 'new', 'input should have still same value');

                // change the value again
                modal.find('Input').node.setValue('again');

                // submit the form again
                app.find('.form-editor').simulate('submit');

                return nextTick();
            })
            .then(() => {
                assert.equal(server.requests[2].url, '/api/entity/1');
                assert.equal(server.requests[2].method, 'PUT');
                assert.equal(server.requests[2].requestBody, '{"name":"again"}');

                // make good reponse
                server.respond('PUT', /^\/api\/entity/,
                    [200, { 'Content-Type': 'application/json' },
                        JSON.stringify(expectedData)]);
                return nextTick();
            })
            .then(() => {
                assert.equal(server.requests[3].url, '/api/entity?offset=0&order=1&limit=20');
                assert.equal(app.find('.modal').length, 0, 'there should be no modal');
                assert.equal(app.find('div.loading').length, 1, 'table should be in loading state');

                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(app.find('div.loading').length, 0, 'table should not be in loading state');
                assert.equal(app.find('td').length, 2, 'there should be two cells');

                server.restore();
            });
    });

    it('should accept a lot of usefull callbacks', function () {

        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA })]);

        const editorOutputMap = sinon.spy(data => data);
        const resource = new AjaxResource(RESOURCE);
        const updateErrorMessage = sinon.spy(() => 'Just simple error.');
        const collectionMap = sinon.spy(data => data);

        resource.mapInput = editorOutputMap;
        resource.mapGetAllOutput = collectionMap;

        const tb = new TableBuilder();

        tb.addText('name', 'Name');

        const app = mount(
            <TableEditor
                colsConfig={tb.getColsConfig()}
                resource={resource}
            >
                <Editor
                    validator={fakeValidator()}
                    updateErrorMessage={updateErrorMessage}
                >
                    <Input type="text" name="name" />
                </Editor>
            </TableEditor>
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert.equal(server.requests[0].url, '/api/entity?offset=0&order=1&limit=20');

        server.respond();
        return nextTick()
            .then(() => {

                // callback order
                assert.deepEqual(collectionMap.firstCall.args, [{ data: DEFAULT_DATA }]);
                assert.equal(editorOutputMap.called, false, 'should not be called before opening editor');

                assert.equal(app.find('.error').length, 0, 'there should be no error');
                assert.equal(app.find('td').length, 2, 'there should be two cells');
                assert.equal(app.find('td').first().text(), 'Foo', 'first should be `Foo`');
                assert.equal(app.find('.add-button').length, 1, 'there should be no add button');

                // open the editor modal
                app.instance().edit(DEFAULT_DATA[0]);
                const modal = app.find('.modal');
                assert.equal(modal.find('input[name="name"]').length, 1, 'there should be one input');

                // submit the form
                app.find('.form-editor').simulate('submit');

                return nextTick();
            })
            .then(() => {

                assert.equal(editorOutputMap.calledOnce, true, 'should be called after submitting editor');
                assert.deepEqual(editorOutputMap.firstCall.args, [{ name: 'Foo' }, 1], 'editor args');

                assert.equal(server.requests[1].url, '/api/entity/1');
                assert.equal(server.requests[1].method, 'PUT');
                assert.equal(server.requests[1].requestBody, '{"name":"Foo"}');

                // make bad response and check the behavior
                server.respond('PUT', /^\/api\/entity/,
                    [400, { 'Content-Type': 'application/json' },
                        JSON.stringify({})]);

                return nextTick();
            })
            .then(() => {
                assert.equal(editorOutputMap.calledOnce, true, 'should be called after submitting editor');
                server.restore();
            });
    });

    it('should reorder table according to order preferences', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name')
            .orderBy(1)
            .orderByDefault();

        tb.addText('other', 'Other')
            .orderBy(-1);

        const app = mount(
            <TableEditor
                colsConfig={tb.getColsConfig()}
                resource={RESOURCE}
            />
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert.equal(server.requests[0].url, '/api/entity?offset=0&order=1&orderBy=name&limit=20');

        server.respond();
        return nextTick()
            .then(() => {
                const header = app.find('thead');

                assert.equal(header.find('button').length, 2, 'there should be two order buttons');

                header.find('button').at(1).simulate('click');

                assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
                assert.equal(server.requests[1].url, '/api/entity?offset=0&order=-1&orderBy=other&limit=20');

                server.respond();
                return nextTick();
            })
            .then(() => {

                app.find('thead').find('button').at(1).simulate('click');

                assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
                assert.equal(server.requests[2].url, '/api/entity?offset=0&order=1&orderBy=other&limit=20');

                server.restore();
            });
    });

    it('should delegate changes to onParamsChange prop', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'GET', /^\/api\/entity/,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ data: DEFAULT_DATA })]);

        const tb = new TableBuilder();

        tb.addText('name', 'Name')
            .orderBy(1)
            .orderByDefault();

        tb.addText('other', 'Other')
            .orderBy(-1);

        const onParamsChange = sinon.spy();

        const app = mount(
            <TableEditor
                resource={RESOURCE}
                colsConfig={tb.getColsConfig()}
                onParamsChange={onParamsChange}
            >
                <header>
                    <Input type="text" name="search" />
                </header>
            </TableEditor>
        );

        assert.equal(app.find('div.loading').length, 1, 'table should start in loading state');
        assert.equal(server.requests[0].url, '/api/entity?offset=0&order=1&orderBy=name&limit=20');

        server.respond();

        return nextTick()
            .then(() => {
                const header = app.find('thead');

                assert.equal(header.find('button').length, 2, 'there should be two order buttons');
                assert(!onParamsChange.called, 'Params should not be called');

                header.find('button').at(1).simulate('click');

                assert.equal(app.find('div.loading').length, 0, 'table should not be in loading state');
                assert(onParamsChange.calledOnce, 'Params should be called');

                app.setProps({ params: onParamsChange.firstCall.args[0] });


                assert.equal(app.find('div.loading').length, 1, 'table should be in loading state');
                assert(onParamsChange.calledOnce, 'Params should be called');

                assert.equal(server.requests[1].url, '/api/entity?offset=0&order=-1&orderBy=other&limit=20');

                server.respond();
                return nextTick();
            });
    });


});
