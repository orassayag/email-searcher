// This file merge all containers to one file to be imported on the site.
// It's imported on App container, there the routing is configured for each container.

import App from './App/App';
import NotFound from './NotFound/NotFound';
import Search from './Search/Search';
import UserAuthentication from './UserAuthentication/UserAuthentication';
import UserEmails from './UserEmails/UserEmails';
export { App, NotFound, Search, UserAuthentication, UserEmails };