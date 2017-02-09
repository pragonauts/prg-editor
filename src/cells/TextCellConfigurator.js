/*
 * @author David Menger
 */

import BaseCellConfigurator from './BaseCellConfigurator';
import TextCell from '../components/cells/TextCell';

/**
 * Just a Text Cell
 *
 *
 * @class TextCellConfigurator
 * @extends {BaseCellConfigurator}
 */
class TextCellConfigurator extends BaseCellConfigurator {

    constructor (attr, name, translator = null) {
        super(attr, name, translator);

        this.config.Cell = TextCell;
    }

}

export default TextCellConfigurator;
