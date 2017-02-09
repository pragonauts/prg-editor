
import React from 'react';
import { mount } from 'enzyme';
import { assert } from 'chai';
import ActionCell from '../../src/components/cells/ActionCell';
import ActionCellConfigurator from '../../src/cells/ActionCellConfigurator';

const TEST_DATA = { id: 1, name: 'Foo', attr: 'Bar', array: ['Haha'] };

describe('<ActionCell>', function () {

    it('should work in default configuration', function () {
        const cfg = new ActionCellConfigurator('attr', 'Name');

        const app = mount(
            <ActionCell
                data={TEST_DATA}
                config={cfg.config}
            />
        );

        assert.equal(app.find('a').length, 1, 'There should be a href');
        assert.equal(app.find('a').text(), 'Name', 'Link should have a name');
        assert.equal(app.find('a').node.getAttribute('href'), 'Bar', 'Threre should be href by default');

        // makes nothing
        app.find('a').simulate('click');
    });


    it('should accept classic map parameter', function () {
        const cfg = new ActionCellConfigurator('attr', 'Name');

        const map = sinon.spy(value => `${value}x`);

        cfg.map(map);

        const app = mount(
            <ActionCell
                data={TEST_DATA}
                config={cfg.config}
            />
        );

        assert.equal(app.find('a').length, 1, 'There should be a href');
        assert.equal(app.find('a').text(), 'Name', 'Link should have a name');
        assert.equal(app.find('a').node.getAttribute('href'), 'Barx', 'Threre should be href by default');

        // expected map behavior
        assert(map.calledOnce, 'Map should be called once');
        assert.deepEqual(map.firstCall.args, ['Bar', TEST_DATA]);

        // makes nothing
        app.find('a').simulate('click');
    });


    it('should accept onClick handler', function () {
        const cfg = new ActionCellConfigurator('attr', 'Name');

        const onClick = sinon.spy();

        cfg.onClick(onClick)
            .map(value => `${value}x`);

        const app = mount(
            <ActionCell
                data={TEST_DATA}
                config={cfg.config}
            />
        );

        assert.equal(app.find('a').length, 1, 'There should be a href');
        assert.equal(app.find('a').text(), 'Name', 'Link should have a name');
        assert.equal(app.find('a').node.getAttribute('href'), '#', 'when onClick is used without href, there should be a #');

        // calls spy
        app.find('a').simulate('click');

        // expected map behavior
        assert(onClick.calledOnce, 'onClick() should be called once');
        assert.equal(onClick.firstCall.args.length, 3, 'onClick() should be called with three arguments');
        assert.equal(onClick.firstCall.args[0], 'Barx', 'first arg of onClick() should be mapped value');
        assert.equal(onClick.firstCall.args[1], TEST_DATA, 'second arg of onClick() should be whole data');
        assert.equal(typeof onClick.firstCall.args[2], 'object', 'third arg should be an event');
    });

    it('should accept href parameter as function', function () {
        const cfg = new ActionCellConfigurator('attr', 'Name');

        const href = sinon.spy(value => `/${value}`);

        cfg.href(href)
            .map(value => `${value}x`);

        const app = mount(
            <ActionCell
                data={TEST_DATA}
                config={cfg.config}
            />
        );

        assert.equal(app.find('a').length, 1, 'There should be a href');
        assert.equal(app.find('a').text(), 'Name', 'Link should have a name');
        assert.equal(app.find('a').node.getAttribute('href'), '/Barx', 'Threre should be href by default');

        // expected map behavior
        assert(href.calledOnce, 'Map should be called once');
        assert.deepEqual(href.firstCall.args, ['Barx', TEST_DATA]);

        // makes nothing
        app.find('a').simulate('click');
    });

    it('should accept label parameter as function', function () {
        const cfg = new ActionCellConfigurator('attr', 'Name');

        const label = sinon.spy(value => `do - ${value}`);

        cfg.label(label)
            .map(value => `${value}x`);

        const app = mount(
            <ActionCell
                data={TEST_DATA}
                config={cfg.config}
            />
        );

        assert.equal(app.find('a').length, 1, 'There should be a href');
        assert.equal(app.find('a').text(), 'do - Barx', 'Link should have a name');
        assert.equal(app.find('a').node.getAttribute('href'), 'Barx', 'Threre should be href by default');

        // expected map behavior
        assert(label.calledOnce, 'Map should be called once');
        assert.deepEqual(label.firstCall.args, ['Barx', TEST_DATA]);

        // makes nothing
        app.find('a').simulate('click');
    });
});
