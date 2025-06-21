// import { localStorageProvider } from './localStorageProvider';
// import apiProvider from './apiProvider';

// export const provider =
//   import.meta.env.VITE_USE_BACKEND === 'true'
//     ? apiProvider
//     : localStorageProvider;

// export default provider;

import { localStorageProvider } from './localStorageProvider';

export const provider = localStorageProvider;
export default provider;