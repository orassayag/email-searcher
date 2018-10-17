// This file merge all containers to one file to be imported on the site.
// It's imported on App container, there the routing is configured for each container.

import UserAuthentication from './UserAuthentication/UserAuthentication';
import UserEmails from './UserEmails/UserEmails';
import NotFound from './NotFound/NotFound';
import Search from './Search/Search';
export { UserAuthentication, UserEmails, NotFound, Search };