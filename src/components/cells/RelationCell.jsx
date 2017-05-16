/*
 * @author David Menger
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.shape({
        attr: PropTypes.string.isRequired,
        map: PropTypes.func,
        loaderContent: PropTypes.any,
        errorContent: PropTypes.any,
        resource: PropTypes.shape({
            load: PropTypes.func.isRequired,
            abort: PropTypes.func.isRequired
        }).isRequired
    }).isRequired
};

export default RelationCell;
