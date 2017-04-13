/*
 * @author David Menger
 */

import React, { Component } from 'react';

class RelationCell extends Component {

    constructor (props) {
        super(props);

        this.resource = props.config.resource;

        this.state = {
            isLoading: true,
            error: null,
            value: null
        };
    }

    componentDidMount () {
        const { data, config } = this.props;
        const identifier = data[config.attr];

        this.resource.load(identifier)
            .then((dict) => {
                let value = dict[identifier];

                if (config.map) {
                    value = config.map(value, data);
                }

                this.setState({ value, isLoading: false });
            })
            .catch((error) => {
                this.setState({ error, isLoading: false });
            });
    }

    componentWillUnmount () {
        this.resource.abort();
        this.resource = null;
    }

    render () {
        const { isLoading, error, value } = this.state;
        const { loaderContent, errorContent } = this.props.config;

        if (isLoading) {
            return <div>{loaderContent}</div>;
        } else if (error) {
            return <div>{errorContent}</div>;
        }

        return <div>{value}</div>;
    }
}

RelationCell.propTypes = {
    data: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
    config: React.PropTypes.shape({
        attr: React.PropTypes.string.isRequired,
        map: React.PropTypes.func,
        loaderContent: React.PropTypes.any,
        errorContent: React.PropTypes.any,
        resource: React.PropTypes.shape({
            load: React.PropTypes.func.isRequired,
            abort: React.PropTypes.func.isRequired
        }).isRequired
    }).isRequired
};

export default RelationCell;
