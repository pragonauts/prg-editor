/*
 * @author David Menger
 */

import BaseCellConfigurator from './BaseCellConfigurator';
import ActionCell from '../components/cells/ActionCell';


/**
 * Inserts Action Cell into the table
 *
 * @class ActionCellConfigurator
 * @extends {BaseCellConfigurator}
 */
class ActionCellConfigurator extends BaseCellConfigurator {

    constructor (attr, name, translator = null) {
        super(attr, name, translator);

        this.config.Cell = ActionCell;

        this.config.href = null;

        this.config.label = this.config.name;

        this.config.onClick = null;

        this.config.condition = null;
    }

    /**
     * Condition, which shows the action or not
     *
     * @param {Function} callback - `(value, data) => true || false`
     * @returns {this}
     *
     * @memberOf ActionCellConfigurator
     */
    condition (callback) {
        this.config.condition = callback;
        return this;
    }

    /**
     * Sets the url of action
     *
     * @param {Function} callback - `(value, data) => 'string'`
     * @returns {this}
     *
     * @memberOf ActionCellConfigurator
     */
    href (callback) {
        this.config.href = callback;
        return this;
    }

    /**
     * Sets text label of action
     *
     * @param {string|Function} callbackOrString - `(value, data) => 'string'`
     * @returns {this}
     *
     * @memberOf ActionCellConfigurator
     */
    label (callbackOrString) {
        if (typeof callbackOrString === 'string') {
            this.config.label = this.translator(callbackOrString);
        } else {
            this.config.label = callbackOrString;
        }
        return this;
    }

    /**
     * Will be called, when user clicks on the action
     *
     * @param {Function} callback - `(id, data) => {}`
     * @returns {this}
     *
     * @memberOf ActionCellConfigurator
     */
    onClick (callback) {
        this.config.onClick = callback;
        return this;
    }

}

export default ActionCellConfigurator;
