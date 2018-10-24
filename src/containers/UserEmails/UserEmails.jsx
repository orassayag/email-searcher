// This container responsible for the user emails list, enable
// him to navigate by pager throw all his emails, select how many
// emails to view in each page, and to remove existing emails
// from his emails list to enable to add new emails from the
// search-page (Home-page). The pager and the counter
// components visible to the user only in this page and not
// in the search-page (Home-page).

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Routes from '../../routes/routes';
import * as actions from '../../store/actions/actions';
import * as enums from '../../enums/enums';
import * as shapes from '../../modals/proptypes/proptypes';
import { scrollToElementByRef, isStandartScreen } from '../../utils/UIUtils';
import { isUserAuthenticated } from '../../utils/userAuthenticationUtils';
import translate from '../../translate/translate';
import { Auxiliary } from '../../hoc';
import { Emails } from '../../components/Email';
import { DeleteEmail } from '../../components/UserEmails';
import { Modal, PageTitle } from '../../components/UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    history: PropTypes.object,
    userAuthentication: shapes.userAuthenticationShape,
    userEmails: shapes.userEmailsShape,
    isComponentMounted: PropTypes.bool.isRequired,
    isScrollToResults: PropTypes.bool.isRequired,
    isLoadingEmails: PropTypes.bool.isRequired,
    isEmailsError: PropTypes.bool.isRequired,
    isShowModal: PropTypes.bool.isRequired,
    isLoadingModal: PropTypes.bool.isRequired,
    errorMessageModal: PropTypes.string,
    deleteEmail: shapes.manageEmailShape,
    onUserGetEmailsProcessStart: PropTypes.func.isRequired,
    onUserToggleEmailMoreInformationStart: PropTypes.func.isRequired,
    onUserCounterUpdateStart: PropTypes.func.isRequired,
    onUserPagerUpdateStart: PropTypes.func.isRequired,
    onUserDeleteEmailModalToggleStart: PropTypes.func.isRequired,
    onUserDeleteEmailModalToggleSuccess: PropTypes.func.isRequired,
    onUserDeleteEmailProcessStart: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {
    history: null,
    userAuthentication: null,
    userEmails: null,
    errorMessageModal: '',
    deleteEmail: null
};

// State properties from sagas.
const mapStateToProps = (state) => {
    return {
        userAuthentication: state.userAuthentication.userAuthentication,
        userEmails: state.userEmails.userEmails,
        isComponentMounted: state.userEmails.isComponentMounted,
        isScrollToResults: state.userEmails.isScrollToResults,
        isLoadingEmails: state.userEmails.isLoadingEmails,
        isEmailsError: state.userEmails.isEmailsError,
        isShowModal: state.userEmails.isShowModal,
        isLoadingModal: state.userEmails.isLoadingModal,
        errorMessageModal: state.userEmails.errorMessageModal,
        deleteEmail: state.userEmails.deleteEmail
    };
};

// Dispatch functions from actions to reducers / sagas.
const mapDispatchToProps = (dispatch) => {
    return {
        onUserGetEmailsProcessStart: (getUserEmailsData) => dispatch(actions.onUserGetEmailsProcessStart(getUserEmailsData)),
        onUserToggleEmailMoreInformationStart: (toggleEmailData) => dispatch(actions.onUserToggleEmailMoreInformationStart(toggleEmailData)),
        onUserCounterUpdateStart: (userCounterUpdateData) => dispatch(actions.onUserCounterUpdateStart(userCounterUpdateData)),
        onUserPagerUpdateStart: (userPagerUpdateData) => dispatch(actions.onUserPagerUpdateStart(userPagerUpdateData)),
        onUserDeleteEmailModalToggleStart: (toggleDeleteEmailModalData) => dispatch(actions.onUserDeleteEmailModalToggleStart(toggleDeleteEmailModalData)),
        onUserDeleteEmailModalToggleSuccess: (deleteEmailData) => dispatch(actions.onUserDeleteEmailModalToggleSuccess(deleteEmailData)),
        onUserDeleteEmailProcessStart: (deleteEmailData) => dispatch(actions.onUserDeleteEmailProcessStart(deleteEmailData))
    };
};

class UserEmails extends Component {

    constructor(props) {
        super(props);

        // Will determine if the user authenticated or not.
        this.isUserAuthenticated = isUserAuthenticated(props.userAuthentication);

        // A reference point to scroll down to the emails results on mobile or small devices.
        this.resultsRef = React.createRef();

        // Bind all the functions.
        this.handleCounterChangeClick = this.handleCounterChangeClick.bind(this);
        this.handleChangePageClick = this.handleChangePageClick.bind(this);
        this.handleMoreInformationToggleClick = this.handleMoreInformationToggleClick.bind(this);
    }

    // This life-cycle handler method check if the user is authenticated
    // and gets the emails list after the component is mounted.
    componentDidMount() {

        // Take the scoped props.
        const { props } = this;

        // Check that the user is authenticated.
        this.handleCheckAuthentication();

        // Get the emails of the user on the first load of the page.
        props.onUserGetEmailsProcessStart({
            userAuthentication: props.userAuthentication,
            userEmails: props.userEmails,
            isFirstPageLoad: true,
            updatedPagerValue: null,
            updatedCounterValue: null
        });
    }

    // This life-cycle handler method check that the user is authenticated.
    componentDidUpdate() {

        // Check if the user is authenticated or not.
        this.handleCheckAuthentication();

        // If needed to scroll on mobile or small screens, call the function that do it.
        if (this.props.isScrollToResults) {

            // Scroll to results if any exists.
            this.handleScrollToElement();
        }
    }

    // This handler method called when the user clicks on the X on each email's row icon on
    // the right, to delete the email from this emails list.
    handleToggleDeleteEmailModalClick = (e) => {

        // Stop any default actions.
        e.preventDefault();

        // Take the scoped props.
        const { props } = this;

        // Go to toggle delete email modal saga and try show open the modal to the user.
        props.onUserDeleteEmailModalToggleStart({
            emailActionType: enums.EmailActionType.DELETED,
            emailId: e.currentTarget.dataset.id,
            emails: props.userEmails.userEmailsList
        });
    }

    // This handler method called when the user clicks on the email row item to show / hide the full
    // details within the "More information" panel of each email item.
    handleMoreInformationToggleClick = (e) => {

        // Take the scoped props.
        const { props } = this;

        // Toggle the selected email "More information" panel to
        // display or hide the full information of the email.
        props.onUserToggleEmailMoreInformationStart({
            userEmails: props.userEmails,
            emailId: e.currentTarget.dataset.id,
            className: e.target.className
        });
    }

    // This handler method called when the user clicks on "Delete" button on the delete email modal
    // window, to confirm the removal of the specific email selected.
    handleDeleteEmailClick = () => {

        // Take the scoped props.
        const { props } = this;

        // Call the delete email saga to delete the
        // email from the database and the state.
        props.onUserDeleteEmailProcessStart({
            userAuthentication: props.userAuthentication,
            userEmails: props.userEmails,
            emailId: props.deleteEmail.emailId
        });
    }

    // This handler method handles the "Cancel" button click on the delete modal window.
    // Hide the modal window and reset the delete email object instance.
    handleCancelModalClick = () => {

        // Take the scoped props.
        const { props } = this;

        // Call the success toggle action to hide the delete email modal window.
        props.onUserDeleteEmailModalToggleSuccess({
            isShowModal: false,
            deleteEmail: null
        });
    }

    // This handler method called when the user updates the counter (Change the dropdown select) refresh
    // the page with relevant emails according to the new count of emails.
    handleCounterChangeClick = (e) => {

        // Take the scoped props.
        const { props } = this;

        // Call the counter update saga to update the counter and load the emails again.
        props.onUserCounterUpdateStart({
            userAuthentication: props.userAuthentication,
            userEmails: props.userEmails,
            newCounterValue: e.target.value
        });
    }

    // This handler method called when the user clicks on the bottom pager numbers links
    // or on the arrow links, to change the pager to view other emails.
    handleChangePageClick = (e) => {

        // Take the scoped props.
        const { props } = this;

        // Call the pager update saga to update the pager and load the emails again.
        props.onUserPagerUpdateStart({
            userAuthentication: props.userAuthentication,
            userEmails: props.userEmails,
            newPagerValue: e.currentTarget.dataset.id
        });
    }

    // This handler method scrolls to emails list (Only on mobile device or small screens only).
    handleScrollToElement = () => {

        // If the user is not on mobile device or small screen - Don't scroll.
        if (isStandartScreen()) {

            // Stop any further actions.
            return;
        }

        // Animate the scroll if user is on mobile device / small screen.
        scrollToElementByRef(this.resultsRef);
    }

    // This handler method checks if user is not authenticated or the user token expired
    // - Redirect back to search-page (Home-page).
    handleCheckAuthentication = () => {

        // Take the scoped props.
        const { props } = this;

        // If no userEmails instance exists or the user is not authenticated to
        // the site application, or the user token expired, redirect back to the
        // search-page (Home-page).
        if (!props.userEmails || !this.isUserAuthenticated) {

            // Redirect to search-page (Home-page).
            props.history.push(Routes.SEARCH);
        }
    }

    // This handler method generates titles (If exist any and if not) of the emails area.
    handleInitialRender = () => {

        // Take the scoped props.
        const { props } = this;

        // Will hold the data to generate the title and sub title.
        const emailsData = {
            isEmailsError: props.isEmailsError ? translate.error_general : null,
            noEmails: !props.userEmails.userEmailsTotalCount || props.userEmails.userEmailsTotalCount <= 0,
            emailsTitle: null,
            countTitle: null
        };

        // If there was an error in the call to the API for the search process,
        // display a message instead of the emails list.
        if (emailsData.isEmailsError) {
            emailsData.emailsTitle = emailsData.isEmailsError;
            emailsData.countTitle = null;
        }
        else {

            // Check if this is the first load.
            if (!props.isLoadingEmails && props.isComponentMounted) {

                // Check if any emails exists on the user's emails list. If not, display appropriate message.
                if (emailsData.noEmails) {
                    emailsData.emailsTitle = translate.emails_page_no_emails_text;
                    emailsData.countTitle = translate.emails_page_emails_count.replace('#count#', 0);
                }
                else {

                    // If the request is not the first time that the page load, display the title and
                    // sub title by the search key that the user entered.
                    emailsData.emailsTitle = translate.emails_page_main_title;
                    emailsData.countTitle = translate.emails_page_emails_count.replace('#count#', props.userEmails.userEmailsTotalCount);
                }
            }
        }

        // Return rendered titles.
        return emailsData;
    }

    render() {

        // Take the scoped props. Can be split into specific props, but due to saving memory, we can avoid this.
        const { props } = this;

        // Data with all titles.
        const emailsData = this.handleInitialRender();

        return (
            <Auxiliary>
                <PageTitle title={translate.emails_page_title} />
                <Emails
                    isLoadingEmails={props.isLoadingEmails}
                    isEmailsError={props.isEmailsError}
                    isNotFound={emailsData.noEmails}
                    isHomePage={false}
                    topTitle={emailsData.emailsTitle}
                    subTitle={emailsData.countTitle}
                    emailsCountPerPage={props.userEmails.userEmailsCountPerPage}
                    pagesCountToShow={props.userEmails.userEmailsPagesCountToShow}
                    currentPageNumber={props.userEmails.userEmailsCurrentPageNumber}
                    totalEmailsCount={props.userEmails.userEmailsTotalCount}
                    totalPagesCount={props.userEmails.userEmailsPagesTotalCount}
                    emails={props.userEmails.userEmailsList}
                    ref={this.resultsRef}
                    onActionIconClick={this.handleToggleDeleteEmailModalClick}
                    onMoreInformationToggleClick={this.handleMoreInformationToggleClick}
                    onCounterChange={this.handleCounterChangeClick}
                    onChangePage={this.handleChangePageClick}
                />
                <Modal
                    modalName={enums.ModalName.DELETE_EMAIL}
                    isShowModal={props.isShowModal}
                    isLoadingModal={props.isLoadingModal}
                    isLargeModal={false}
                    onCloseClick={this.handleCancelModalClick}
                    errorMessage={props.deleteEmail.errorMessage}
                >
                    <DeleteEmail
                        onDeleteClick={this.handleDeleteEmailClick}
                        onCancelClick={this.handleCancelModalClick}
                        emailAddress={props.deleteEmail.emailAddress}
                        errorMessage={props.deleteEmail.errorMessage}
                    />
                </Modal>
            </Auxiliary>
        );
    }
}

// Set the PropTypes validations and default values.
UserEmails.propTypes = propTypes;
UserEmails.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserEmails);