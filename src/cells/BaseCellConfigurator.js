/*
 * @author David Menger
 */

/**
 * Common interface of {TableBuilder} cell configurator
 *
 * @class BaseCellConfigurator
 */
class BaseCellConfigurator {

    /**
     * Creates an instance of BaseCellConfigurator.
     *
     * @param {string} attr - Object attribute key
     * @param {string} name - Column name
     * @param {function(text: string): string} [translator=null] - Text translator
     */
    constructor (attr, name, translator = null) {
        this.translator = translator;

        this.config = {
            attr,
            name: translator ? translator(name) : name,
            map: a => a,
            Cell: null,
            order: 0,
            orderBy: null,
            orderByDefault: false
        };
    }

    /**
     * Set Filter function for column
     *
     * @param {function (value: string, data: object): any} fn - Preprocessor function
     * @returns {BaseCellConfigurator} this
     */
    map (fn) {
        this.config.map = fn;
        return this;
    }

    /**
     * Set field to order by
     *
     * @param {number} [defaultDirection=0] - -1=desc, 1=asc, 0=without direction
     * @param {string} [fieldName] - override name of field which will be sent to API
     * @returns {BaseCellConfigurator} this
     */
    orderBy (defaultDirection = 1, fieldName = null) {
        this.config.orderBy = fieldName || this.config.attr;
        this.config.order = defaultDirection;
        return this;
    }

    /**
     * Use this field as default orderer
     *
     * @returns {BaseCellConfigurator} this
     */
    orderByDefault () {
        this.config.orderByDefault = true;
        return this;
    }

}

export default BaseCellConfigurator;
