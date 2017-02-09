
import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import Table from '../src/components/Table';
import TextCell from '../src/components/cells/TextCell';

const data = [{ id: 12, item: 'value' }];

const colsConfig = [{
    id: '0-item',
    name: 'ColName',
    attr: 'item',
    Cell: TextCell
}];

const orderedColsConfig = [{
    id: '0-item',
    name: 'ColName',
    attr: 'item',
    Cell: TextCell,
    orderBy: 'item'
}];

const orderedColsConfigWithDirection = [{
    id: '0-item',
    name: 'ColName',
    attr: 'item',
    Cell: TextCell,
    orderBy: 'item',
    order: 1
}];

function shouldHaveGoodHeader (app) {
    const thead = app.find('thead');

    assert.equal(thead.length, 1, 'there should be one table header');
    assert.ok(thead.find('th').first().text().indexOf('ColName') !== -1, 'header should contain name of the column');

    return thead;
}

describe('<Table>', function () {

    it('should render nice table depending on configuration', function () {
        const app = mount(
            <Table
                data={data}
                colsConfig={colsConfig}
            />
        );

        const tbody = app.find('tbody');

        assert.equal(tbody.length, 1, 'there should be one table body');
        assert.equal(tbody.find('td').first().text(), 'value', 'td should contain text value');

        shouldHaveGoodHeader(app);
    });

    it('should show the loader, when loading is set to true', function () {
        const app = mount(
            <Table
                data={data}
                colsConfig={colsConfig}
                loading
            />
        );

        const tbody = app.find('tbody');

        assert.equal(tbody.length, 1, 'there should be one table body');
        assert.equal(tbody.find('td').length, 1, 'there should be only one cell');
        assert.strictEqual(tbody.find('td').hasClass('loading'), true, 'it should have loading class');

        shouldHaveGoodHeader(app);
    });

    it('should call onOrderChange() listener, when the order has been changed', function () {

        let onOrderChange = sinon.spy();

        let app = mount(
            <Table
                data={data}
                colsConfig={orderedColsConfig}
                onOrderChange={onOrderChange}
            />
        );

        let thead = shouldHaveGoodHeader(app);

        thead.find('button').simulate('click');

        assert.strictEqual(onOrderChange.calledOnce, true, 'handler should be called, when header is clicked');
        assert.deepEqual(onOrderChange.firstCall.args, ['item', 0], 'handler should be called with right arguments');

        onOrderChange = sinon.spy();

        app = mount(
            <Table
                data={data}
                colsConfig={orderedColsConfig}
                onOrderChange={onOrderChange}
                orderBy="item"
            />
        );

        thead = app.find('thead');

        thead.find('button').simulate('click');

        assert.strictEqual(onOrderChange.called, false, 'handler should not be called when data are nothing has been changed');
    });

    it('should toggle order entries', function () {
        const onOrderChange = sinon.spy();

        let app = mount(
            <Table
                data={data}
                colsConfig={orderedColsConfigWithDirection}
                onOrderChange={onOrderChange}
            />
        );

        let thead = shouldHaveGoodHeader(app);

        thead.find('button').simulate('click');
        assert.strictEqual(onOrderChange.calledOnce, true, 'handler should be called, when header is clicked');
        assert.deepEqual(onOrderChange.firstCall.args, ['item', 1], 'handler should be called with right arguments');

        onOrderChange.reset();

        app = mount(
            <Table
                data={data}
                colsConfig={orderedColsConfigWithDirection}
                onOrderChange={onOrderChange}
                orderBy="item"
                order={1}
            />
        );

        thead = shouldHaveGoodHeader(app);

        thead.find('button').simulate('click');
        assert.strictEqual(onOrderChange.calledOnce, true, 'handler should be called, when header is clicked');
        assert.deepEqual(onOrderChange.firstCall.args, ['item', -1], 'handler should be called with right arguments');

        onOrderChange.reset();

        app = mount(
            <Table
                data={data}
                colsConfig={orderedColsConfigWithDirection}
                onOrderChange={onOrderChange}
                orderBy="item"
                order={-1}
            />
        );

        thead = shouldHaveGoodHeader(app);

        thead.find('button').simulate('click');
        assert.strictEqual(onOrderChange.calledOnce, true, 'handler should be called, when header is clicked');
        assert.deepEqual(onOrderChange.firstCall.args, ['item', 1], 'handler should be called with right arguments');
    });

});
