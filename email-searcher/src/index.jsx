// This index file is the root of all the applications and the first file that
// loaded in the React application. Here loaded all the heart and core logic
// of the application, enable the routing, enable development tools in development
// mode, compose the enhancers, combine the reducers, middleware of all the sagas
// in the root sagas, the action, reducers, sagas, and store, and all the necessary
// logic to perform any actions needed on the application.

import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import './index.less';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './store/sagas/rootSaga';
import rootReducer from './store/reducers/rootReducer';
import { getEnhancers } from './utils/coreUtils';
import { App } from './containers';
import registerServiceWorker from './registerServiceWorker';

// For redux development tools.
const composeEnhancers = getEnhancers(compose);

// Will hold the created saga middleware.
const sagaMiddleware = createSagaMiddleware();

// The store that takes the root reducers (With all the reducers) and the saga middleware.
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

// Register all sagas by loop.
rootSaga.forEach(saga => sagaMiddleware.run(saga));

// The main app component that holds the entire application.
const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

// Inject the app component to the root of the index.html page.
ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();