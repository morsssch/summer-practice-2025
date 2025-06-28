import React from 'react';
import './loader.scss';
interface LoaderProps {
    type: 'local' | 'global';
}
declare const Loader: React.FC<LoaderProps>;
export default Loader;
