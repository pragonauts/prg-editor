/*
 * @author David Menger
 */

import TextCellConfigurator from './cells/TextCellConfigurator';
import ActionCellConfigurator from './cells/ActionCellConfigurator';
import RelationCellConfigurator from './cells/RelationCellConfigurator';

/**
 * Table columns configurator
 *
 * @class TableBuilder
 */
class TableBuilder {

    /**
     * Creates an instance of TableBuilder.
     *
     * @param {function(text: string) => string} [translator=null]
     */
    constructor (translator = null) {
        this.cols = [];

        this.translator = translator;
    }

    /**
     * Adds text column to table
     *
     * @param {string} attr - attribute name
     * @param {string} name - column name
     * @returns {TextCellConfigurator}
     *
     * @memberOf TableBuilder
     * @example
     * tableBuilder.addText('name', t('Name'))
     *      .orderBy()
     *      .orderByDefault();
     */
    addText (attr, name) {
        const col = new TextCellConfigurator(attr, name, this.translator);
        this.cols.push(col);
        return col;
    }

    /**
     * Adds action column to table
     *
     * @param {string} attr - attribute name
     * @param {string} name - column name
     * @returns {ActionCellConfigurator}
     *
     * @memberOf TableBuilder
     * @example
     * tableBuilder.addAction('id', t('Remove'))
     *      .onClick((e, data) => this.tableEditor.delete(data))
     *      .condition((id, data) => acl.isAllowed('users.remove') && data.isAdministrable);
     */
    addAction (attr, name) {
        const col = new ActionCellConfigurator(attr, name, this.translator);
        this.cols.push(col);
        return col;
    }

    /**
     * Adds relation cell to table
     *
     * @param {string} attr - attribute name
     * @param {string} name - column name
     * @returns {RelationCellConfigurator}
     *
     * @example
     * tableBuilder.addAction('userId', 'User name')
     *     .setResource('/api/users', 'name', 'id');
     */
    addRelationCell (attr, name) {
        const col = new RelationCellConfigurator(attr, name, this.translator);
        this.cols.push(col);
        return col;
    }

    /**
     * Returns the column configuration for {TableEditor}
     *
     * @returns {Object}
     *
     * @memberOf TableBuilder
     */
    getColsConfig () {
        return this.cols.map((col, i) => Object.assign({
            id: `${i}-${col.config.attr}`
        }, col.config));
    }

}

export default TableBuilder;
