import React from 'react';
import './style.css'

const Loader = () => {
    return (
        <>
            <div className="loader-backdrop">
            </div>

            <div className="loader-container">
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    );
};

export default Loader;
