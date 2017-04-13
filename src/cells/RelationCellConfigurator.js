/*
 * @author David Menger
 */

import BaseCellConfigurator from './BaseCellConfigurator';
import RelationCell from '../components/cells/RelationCell';
import RelationResource from '../RelationResource';

/**
 * Inserts cell, which fetches value from remote API by its ID
 *
 * @class RelationCellConfigurator
 */
class RelationCellConfigurator extends BaseCellConfigurator {

    constructor (attr, name, translator = null) {
        super(attr, name, translator);

        this.config.Cell = RelationCell;

        this.config.resource = null;

        this.config.loaderContent = null;

        this.config.errorContent = 'X';
    }

    /**
     * Sets resource API
     *
     * @param {string|RelationResource} resource - the relation resource
     * @param {string} value - name of value attribute
     * @param {*} key - the idetifier attribute
     */
    setResource (resource, value = null, key = 'id') {
        if (typeof resource === 'string') {
            const res = new RelationResource(resource);
            if (value !== null) {
                res.setKeyValue(value, key);
            }
            this.config.resource = res;
        } else {
            this.config.resource = resource;
        }
        return this;
    }

    /**
     * Sets loader
     *
     * @param {*} loader text or component
     */
    setLoader (loader) {
        this.config.loaderContent = loader;
        return this;
    }

    /**
     * Sets content, when loading fails
     *
     * @param {*} error Error text or component
     */
    setErrorContent (error) {
        this.config.errorContent = error;
        return this;
    }

}

module.exports = RelationCellConfigurator;

