// This component represent a floating modal window area that in the background there is
// blank gray color to let the user look and feel that only the modal window he needs
// to be focus on. The modal implements dynamic content, according to the situation
// that the user faced in. This component is actually the wrapper of another component that
// have content to display to the user, according to certain situation. For example,
// when the user tries to add email to this emails list on the search-page (Home-page)
// and he is not authenticated, this modal window will be display with a content that
// the operation is allowed only for authenticated users.

import React from 'react';
import PropTypes from 'prop-types';
import './Modal.less';
import translate from '../../../translate/translate';
import { generateClassName } from '../../../utils/textUtils';
import { validateParameters } from '../../../utils/validationUtils';
import { Loader } from '../';

// Components parameter and functions PropTypes validations.
const propTypes = {
    modalName: PropTypes.string.isRequired,
    isShowModal: PropTypes.bool.isRequired,
    isLoadingModal: PropTypes.bool.isRequired,
    isLargeModal: PropTypes.bool.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    children: PropTypes.node
};

// Components default values.
const defaultProps = {
    errorMessage: '',
    children: null
};

const Modal = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['modalName']
    });

    // Generate data template.
    const modalData = {
        modalClass: generateClassName({
            condition: props.isLargeModal,
            originalClassName: 'modal-dialog',
            newClassName: 'modal-lg'
        }),
        modalNameClass: generateClassName({
            condition: props.modalName,
            originalClassName: 'modal-content',
            newClassName: props.modalName
        }),
        contentModal: props.children,
        closeButton: null
    };

    // if the modal is loading (After some action or before loading a content) - Display loader animation to the user.
    if (props.isLoadingModal) {
        modalData.contentModal = (<Loader isInsideModal={true} />);
    }
    else if (props.errorMessage) {

        // If there is unexpected error - Display a general error to the user. Note that while
        // displaying the error message or the loading animation, there is no X corner button
        // to close the window to display - To avoid the user from stopping some operation in the middle.
        modalData.contentModal = (<p>{props.errorMessage}</p>);
        modalData.modalNameClass = generateClassName({
            condition: true,
            originalClassName: 'modal-content',
            newClassName: 'error'
        });
    }
    else {

        // At this point the modal will be displayed normally to the user, so render X close button in the corner of the modal window.
        modalData.closeButton = (
            <label onClick={props.onCloseClick} htmlFor="modal-switch" className="close" data-dismiss="modal" aria-label={translate.modal_close_button_title} title={translate.modal_close_button_title}>
                <span aria-hidden="true" title={translate.modal_close_button_title}>
                    &times;
                </span>
            </label>
        );
    }

    return (
        <div className="pure-css-bootstrap-modal">
            <input id="modal-switch" type="checkbox" checked={props.isShowModal} onChange={props.onCloseClick} />
            <div className="modal fade" tabIndex="-1" role="dialog">
                <label className="modal-backdrop fade" htmlFor="modal-switch"></label>
                <div className={modalData.modalClass} role="document">
                    <div className={modalData.modalNameClass}>
                        {modalData.closeButton}
                        {modalData.contentModal}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the PropTypes validations and default values.
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;