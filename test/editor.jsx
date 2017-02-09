
import React from 'react';
import { mount } from 'enzyme';
import { assert } from 'chai';
import { Input } from 'prg-form';
import Editor from '../src/components/Editor';
import AjaxResource from '../src/AjaxResource';

const RESOURCE = '/api/entity/:id';

function nextTick () {
    return new Promise(r => setTimeout(r, 1));
}

function fakeValidator () {
    return {
        validate: sinon.spy(() => Promise.resolve()),
        validateProp: sinon.spy(() => Promise.resolve())
    };
}

describe('<Editor>', function () {

    it('should render nice editor depending on configuration', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'POST', '/api/entity',
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ id: 1, value: 'response' })]);

        const app = mount(
            <Editor
                resource={RESOURCE}
                validator={fakeValidator()}
            >
                <Input name="item" value="" label="Text" type="text" />
                <button type="submit">Go</button>
            </Editor>
        );

        assert.equal(app.find('form').length, 1, 'there should be a form');
        assert.equal(app.find('input[name="item"]').length, 1, 'form with one input called item');

        app.find('form').simulate('submit');

        assert.equal(app.find('.loading').length, 1, 'form must change it`s state to loading');

        return nextTick()
            .then(() => {
                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(app.find('.loading').length, 0, 'form must change it`s state back from loading');
                server.restore();
            });
    });

    it('should render nice error page', function () {
        const server = sinon.fakeServer.create();

        const onSubmitDidFail = sinon.spy();

        server.respondWith(
            'POST', '/api/entity',
            [400, { 'Content-Type': 'application/json' },
                JSON.stringify({ error: 'bad input' })]);

        const app = mount(
            <Editor
                resource={RESOURCE}
                onSubmitDidFail={onSubmitDidFail}
                validator={fakeValidator()}
            >
                <Input name="item" value="" label="Text" type="text" />
                <button type="submit">Go</button>
            </Editor>
        );

        // form is rendered
        assert.equal(app.find('form').length, 1, 'there should be a form');
        assert.equal(app.find('input[name="item"]').length, 1, 'form with one input called item');
        assert.equal(onSubmitDidFail.called, false, 'onSubmitDidFail() should not be called before');

        // submit the form
        app.find('form').simulate('submit');

        return nextTick()
            .then(() => {
                assert.equal(app.find('.loading').length, 1, 'form must change it`s state to loading');
                assert.equal(onSubmitDidFail.called, false, 'onSubmitDidFail() should not be called after submit');

                server.respond();
                return nextTick();
            })
            .then(() => {
                // response arrived
                assert.equal(onSubmitDidFail.calledOnce, true, 'onSubmitDidFail() should be called after response');
                assert.equal(app.find('.loading').length, 0, 'form must change it`s state back');
                assert.equal(app.find('input[name="item"]').length, 1, 'form with one input called item');
                let alert = app.find('div.notification');
                assert.equal(alert.length, 1, 'there should be a nice error box');

                assert.equal(alert.find('span.text').text(), Editor.defaultProps.updateErrorMessage, 'error must match the default value');

                // close error message
                alert.find('button').simulate('click');

                alert = app.find('div.notification');
                assert.equal(alert.length, 0, 'there should be no error box');

                // submit the form again
                app.find('form').simulate('submit');

                return nextTick();
            })
            .then(() => {
                server.respond();
                return nextTick();
            })
            .then(() => {
                const alert = app.find('div.notification');
                assert.equal(alert.length, 1, 'there should be a nice error box again');

                server.restore();
            });
    });

    it('should have right order of callbacks', function () {
        const server = sinon.fakeServer.create();

        const onSubmitDidFinish = sinon.spy();
        const inputMap = sinon.spy(data => data);
        const outputMap = sinon.spy(data => data);

        const reponseData = { id: 1, value: 'response' };

        server.respondWith(
            'POST', '/api/entity',
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify(reponseData)]);

        const resource = new AjaxResource(RESOURCE);

        resource.mapGetOutput = inputMap;
        resource.mapInput = outputMap;

        const app = mount(
            <Editor
                resource={resource}
                onSubmitDidFinish={onSubmitDidFinish}
                validator={fakeValidator()}
            >
                <Input name="item" defaultValue="hello" label="Text" />
                <button type="submit">Go</button>
            </Editor>
        );

        assert.equal(inputMap.calledOnce, false, 'inputMap() must not be called without data');

        app.find('form').simulate('submit');

        return nextTick()
            .then(() => {
                // right method order
                assert.equal(outputMap.calledOnce, true, 'outputMap() must be called');
                assert.equal(onSubmitDidFinish.called, false, 'finnish should not be called');

                // right arguments
                const data = { item: 'hello' };
                assert.deepEqual(outputMap.firstCall.args, [data, undefined], 'outputMap should receive just form data');

                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(onSubmitDidFinish.called, true, 'finnish should not be called');
                assert.equal(outputMap.calledOnce, true, 'outputMap() must be called');

                // right arguments
                assert.deepEqual(onSubmitDidFinish.firstCall.args, [reponseData], 'finish callback should provide reponse data');

                server.restore();
            });
    });

    it('should be able to edit items with data', function () {
        const server = sinon.fakeServer.create();

        const oldData = { id: 1, item: 'old' };
        const oldMappedData = { id: 1, item: 'old2' };
        const newData = { id: 1, item: 'new2' };

        const onSubmitDidFinish = sinon.spy(() => true);
        const inputMap = sinon.spy(() => oldMappedData);
        const outputMap = sinon.spy(data => data);

        server.respondWith(
            'PUT', '/api/entity/abcd',
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify(newData)]);

        const resource = new AjaxResource(RESOURCE);

        resource.mapGetOutput = inputMap;
        resource.mapInput = outputMap;

        const app = mount(
            <Editor
                resource={resource}
                onSubmitDidFinish={onSubmitDidFinish}
                validator={fakeValidator()}
                id="abcd"
                data={oldData}
            >
                <Input name="item" defaultValue="hello" label="Text" type="text" />
                <button type="submit">Go</button>
            </Editor>
        );

        assert.equal(!inputMap.called, true, 'inputMap() should be called');

        assert.equal(app.find('input[name="item"]').length, 1, 'form with one input called item');
        assert.equal(app.find('input[name="item"]').prop('value'), oldData.item, 'form with one input called item');

        app.find('Input').node.setValue('new');

        app.find('form').simulate('submit');

        return nextTick()
            .then(() => {
                const formData = { item: 'new' };
                assert.equal(outputMap.firstCall.args[1], 'abcd', 'outputMap should receive just new form data as first');
                assert.deepEqual(outputMap.firstCall.args[0], formData, 'outputMap should receive just new form data as first');

                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(onSubmitDidFinish.called, true, 'finnish should not be called');
                assert.equal(outputMap.calledOnce, true, 'outputMap() must be called');

                // right arguments
                assert.deepEqual(onSubmitDidFinish.firstCall.args, [oldMappedData], 'finish callback should provide reponse data');

                // form has to contain data from response
                assert.equal(app.find('input[name="item"]').prop('value'), oldMappedData.item, 'form has to contain data from response');

                server.restore();
            });
    });

    it('should load own data, when not provided', function () {
        const server = sinon.fakeServer.create();

        const app = mount(
            <Editor
                resource={RESOURCE}
                id="anyId"
                validator={fakeValidator()}
            >
                <Input name="item" label="Text" type="text" />
                <button type="submit">Go</button>
            </Editor>
        );

        assert(app.find('.loading').length === 1, 'There should be a spinner');

        server.respond('GET', '/api/entity/anyId',
            [500, { 'Content-Type': 'application/json' },
                JSON.stringify({ error: 'Failed' })]);

        return nextTick()
            .then(() => {
                // test bad response
                assert(app.find('.loading').length === 0, 'There should not be a spinner');

                // there should be error with try again button
                assert.equal(app.find('.notification').length, 1, 'There should be a notitfication');
                assert.equal(app.find('button.try-again').length, 1, 'There should be try again btn');

                app.find('button.try-again').simulate('click');
                return nextTick();
            })
            .then(() => {
                assert(app.find('.loading').length === 1, 'There should be a spinner');

                // test good response
                server.respond('GET', '/api/entity/anyId',
                    [200, { 'Content-Type': 'application/json' },
                        JSON.stringify({ id: 1, item: 'response' })]);

                return nextTick();
            })
            .then(() => {
                assert(app.find('.loading').length === 0, 'There should not be a spinner');
                assert.equal(app.find('.notification').length, 0, 'There should not be a notitfication');

                // form should contain data
                assert.equal(app.find('input[name="item"]').prop('value'), 'response');
            });

    });

});
