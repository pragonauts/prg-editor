
import React from 'react';
import { mount } from 'enzyme';
import { assert } from 'chai';
import DeleteConfirmator from '../src/components/DeleteConfirmator';

const RESOURCE = '/api/entity/:id';
const ID = '9abc';

function nextTick () {
    return new Promise(r => setTimeout(r, 1));
}

describe('<DeleteConfirmator>', function () {

    it('should render delete confirmator', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'DELETE', `/api/entity/${ID}`,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ id: ID, value: 'response' })]);

        const app = mount(
            <DeleteConfirmator
                resource={RESOURCE}
                id={ID}
            />
        );

        const button = app.find('button.is-danger');
        assert.equal(button.length, 1, 'there should be a button');

        button.simulate('click');
        assert.equal(app.find('.loading').length, 1, 'confirmator must change it`s state to loading');

        return nextTick()
            .then(() => {
                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(app.find('.loading').length, 0, 'confirmator must change it`s state back from loading');
                server.restore();

                app.unmount();
            });
    });

    it('should be ok to unmount the confirmator in time of the request is being performed', function () {
        const server = sinon.fakeServer.create();

        server.respondWith(
            'DELETE', `/api/entity/${ID}`,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify({ id: ID, value: 'response' })]);

        const app = mount(
            <DeleteConfirmator
                resource={RESOURCE}
                id={ID}
            />
        );

        const button = app.find('button.is-danger');
        assert.equal(button.length, 1, 'there should be a button');

        button.simulate('click');
        assert.equal(app.find('.loading').length, 1, 'confirmator must change it`s state to loading');

        return nextTick()
            .then(() => {
                server.restore();
                return nextTick();
            })
            .then(() => {
                app.unmount();
                server.respond();
            });
    });

    it('should render nice error', function () {
        const server = sinon.fakeServer.create();

        const onDeleteDidFail = sinon.spy();

        server.respondWith(
            'DELETE', `/api/entity/${ID}`,
            [400, { 'Content-Type': 'application/json' },
                JSON.stringify({ error: 'bad input' })]);

        const app = mount(
            <DeleteConfirmator
                resource={RESOURCE}
                id={ID}
                onDeleteDidFail={onDeleteDidFail}
            />
        );

        // confirmator is rendered
        assert.equal(app.find('button.is-danger').length, 1, 'there should be a button');
        assert.equal(onDeleteDidFail.called, false, 'onDeleteDidFail() should not be called before');

        // confirm
        app.find('button.is-danger').simulate('click');
        assert.equal(app.find('.loading').length, 1, 'confirmator must change it`s state to loading');
        assert.equal(onDeleteDidFail.called, false, 'onDeleteDidFail() should not be called after submit');

        return nextTick()
            .then(() => {
                server.respond();
                return nextTick();
            })
            .then(() => {
                // response arrived
                assert.equal(onDeleteDidFail.calledOnce, true, 'onDeleteDidFail() should be called after response');
                assert.equal(app.find('.loading').length, 0, 'form must change it`s state back');
                let alert = app.find('div.notification');
                assert.equal(alert.length, 1, 'there should be a nice error box');

                assert(alert.find('span.text').text().indexOf(DeleteConfirmator.defaultProps.deleteErrorMessage) >= 0, 'error must match the default value');

                // close error message
                alert.find('button').simulate('click');

                alert = app.find('div.notification');
                assert.equal(alert.length, 0, 'there should be no error box');

                // submit the form again
                app.find('button.is-danger').simulate('click');

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

        const onDeleteDidFinish = sinon.spy();

        const reponseData = { id: ID, value: 'response' };

        server.respondWith(
            'DELETE', `/api/entity/${ID}`,
            [200, { 'Content-Type': 'application/json' },
                JSON.stringify(reponseData)]);

        const app = mount(
            <DeleteConfirmator
                resource={RESOURCE}
                id={ID}
                onDeleteDidFinish={onDeleteDidFinish}
            />
        );


        app.find('button.is-danger').simulate('click');

        // right method order
        assert.equal(onDeleteDidFinish.called, false, 'finnish should not be called');

        return nextTick()
            .then(() => {
                server.respond();
                return nextTick();
            })
            .then(() => {
                assert.equal(onDeleteDidFinish.called, true, 'finnish should be called');

                // right arguments
                assert.deepEqual(onDeleteDidFinish.firstCall.args, [reponseData], 'finish callback should provide reponse data');

                server.restore();
            });
    });

});
