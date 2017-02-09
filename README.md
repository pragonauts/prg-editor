# Prg Editor

> React Table Editor for REST API and Bulma.css.

There is [API Documentation](http://pragonauts.github.io/prg-editor).

## Basic Usage

```javascript

import React, { PropTypes, Component } from 'react';
import { Input, Checkbox } from 'prg-form';
import { TableBuilder, TableEditor, Editor, AjaxResource } from 'prg-editor';

class EditorView extends Component {

    constructor (props) {
        super(props);

        this.validator = new Validator();

        this.validator.add('text')
            .isRequired();

        /**
         * @type {TableEditor}
         */
        this.tableEditor = null;

        const tb = new TableBuilder();

        const { t } = props;

        tb.addText('text', 'Title')
            .orderBy()
            .orderByDefault();


        tb.addAction('id', t('Remove'))
            .onClick((e, data) => this.tableEditor.delete(data))
            .condition((id, data) => data.isAdministrable);

        const resource = new AjaxResource('/api/users/:id');

        resource.mapInput = (...args) => this.mapInput(...args);

        this.state = {
            colsConfig: tb.getColsConfig(),
            resource
        };
    }

    mapInput (data) {
        return Object.assign(data, {
            groups: data.groups
                .filter(group => group.group)
        });
    }

    render () {
        const { t } = this.props;
        const { colsConfig, resource } = this.state;

        return (<TableEditor
            colsConfig={colsConfig}
            resource={resource}
            ref={(c) => { this.tableEditor = c; }}
            t={this.props.t}
        >
            <Editor
                validator={validator}
            >
                <Input name="text" />
            </Editor>
        </TableEditor>);
    }


}

EditorView.propTypes = {
    t: PropTypes.func
};

EditorView.defaultProps = {
    t: w => w
};

export default EditorView;

```

