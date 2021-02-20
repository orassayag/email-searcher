// This enums file contains all the map dictionaries that
// related to user emails operation in storing data in
// localStorage, or errors, or methods to call the
// API, and so on.

import { createEnum } from '../../utils/coreUtils';

// This enum used in user-emails page for the next and
// previous methods and functions in the EmailPager component.
export const PagerLink = createEnum(new Map([
    ['NEXT', 'next'],
    ['PREVIOUS', 'previous']
]));