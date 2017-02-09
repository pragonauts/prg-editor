/**
 * @author David Menger
 */

import React from 'react';

const loading = '@keyframes r-bars-loading-animation {'
    + '0% { transform: scale(1); }'
    + '20% { transform: scale(1, 1.8); }'
    + '40% { transform: scale(1); }'
    + '}';

let styleSheet = document.styleSheets[0];

if (!styleSheet) {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    head.appendChild(style);
    styleSheet = style.sheet;
}

styleSheet.insertRule(loading, styleSheet.cssRules && styleSheet.cssRules.length);

const styles = {
    loaderContainer: {
        minHeight: '20vh',
        margin: ''
    },
    loading: {
        position: 'relative'
    },
    loadingBar: {
        display: 'inline-block',
        width: '4px',
        height: '18px',
        borderRadius: '4px',
        backgroundColor: '#444444',
        margin: '1px'
    },
    n1: {
        animation: 'r-bars-loading-animation 1s ease-in-out infinite'
    },
    n2: {
        animation: 'r-bars-loading-animation 1s ease-in-out .09s infinite'
    },
    n3: {
        animation: 'r-bars-loading-animation 1s ease-in-out .18s infinite'
    },
    n4: {
        animation: 'r-bars-loading-animation 1s ease-in-out .27s infinite'
    }
};

function Spinner () {
    return (<div className="columns is-vcentered is-centered" style={styles.loaderContainer}>
        <div className="column loading has-text-centered" style={styles.loading}>
            <div className="loading-bar" style={Object.assign(styles.n1, styles.loadingBar)} />
            <div className="loading-bar" style={Object.assign(styles.n2, styles.loadingBar)} />
            <div className="loading-bar" style={Object.assign(styles.n3, styles.loadingBar)} />
            <div className="loading-bar" style={Object.assign(styles.n4, styles.loadingBar)} />
        </div>
    </div>);
}

export default Spinner;
