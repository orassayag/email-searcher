// This component is actually the user login / registration form itself. The user can switch between
// modes of login and registration by a bottom link. The user needs to input valid email address
// and valid password to login / register to the application site.

import React from 'react';
import PropTypes from 'prop-types';
import './RegisterLogin.less';
import translate from '../../../translate/translate';
import * as enums from '../../../enums/enums';
import { generateClassName } from '../../../utils/textUtils';
import { validateParameters } from '../../../utils/validationUtils';
import { Auxiliary } from '../../../hoc';
import { FieldBox } from '../';
import { ErrorBox, Loader, SubmitButton } from '../../UI';

// Components parameter and functions PropTypes validations.
const propTypes = {
    isLoading: PropTypes.bool.isRequired,
    userAuthenticationMode: PropTypes.string.isRequired,
    generalError: PropTypes.string,
    emailError: PropTypes.string,
    passwordError: PropTypes.string,
    onUserAuthenticationLoginRegisterClick: PropTypes.func.isRequired,
    onUserAuthenticationInputChange: PropTypes.func.isRequired,
    onUserAuthenticationModeChangeClick: PropTypes.func.isRequired
};

// Components default values.
const defaultProps = {
    generalError: '',
    emailError: '',
    passwordError: ''
};

const RegisterLogin = (props) => {

    // Manually validate parameters just in case.
    validateParameters({
        props: props,
        parametersList: ['userAuthenticationMode']
    });

    // Create the data template that determines logics on the login / registration forms.
    const userAuthenticationData = {
        userAuthenticationBody: null,
        generalErrorClass: generateClassName({
            condition: props.generalError,
            originalClassName: 'bottom-error',
            newClassName: 'active'
        })
    };

    // If the user switch between login / registration and vice versa,
    // display the loading animation for the look and feel.
    if (props.isLoading) {
        userAuthenticationData.userAuthenticationBody = (<Loader isInsideModal={false} />);
    }
    else {

        // Display the form if ready.
        userAuthenticationData.userAuthenticationBody = (
            <div className="register-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            <div className="box-for">
                                <div className="col-md-12 col-xs-12 register-blocks">
                                    <h2>{translate[`user_authentication_form_${props.userAuthenticationMode}_title`]}:</h2>
                                    <form method="post">
                                        <FieldBox
                                            labelText={translate.user_authentication_page_email_label}
                                            inputType={enums.UserAuthenticationInputType.EMAIL}
                                            placeHolder={translate.user_authentication_page_email_placeholder}
                                            onTextBoxChange={props.onUserAuthenticationInputChange}
                                            autoComplete="on"
                                            errorMessage={props.emailError}
                                        />
                                        <FieldBox
                                            labelText={translate.user_authentication_page_password_label}
                                            inputType={enums.UserAuthenticationInputType.PASSWORD}
                                            placeHolder={translate.user_authentication_page_password_placeholder}
                                            onTextBoxChange={props.onUserAuthenticationInputChange}
                                            autoComplete="off"
                                            errorMessage={props.passwordError}
                                        />
                                        <div className="text-center">
                                            <SubmitButton
                                                buttonType="submit"
                                                isDifferentColor={false}
                                                title={translate[`user_authentication_page_${props.userAuthenticationMode}_button`]}
                                                onClick={props.onUserAuthenticationLoginRegisterClick}
                                            />
                                        </div>
                                        <div className={userAuthenticationData.generalErrorClass}>
                                            <ErrorBox
                                                isNoArrow={true}
                                                isSearchOption={false}
                                                isSearchOptionGeneral={false}
                                                text={props.generalError}
                                            />
                                        </div>
                                        <div className="login-registration">
                                            {translate[`user_authentication_page_${props.userAuthenticationMode}_switch_link`]} <a data-id={props.userAuthenticationMode} href={null} onClick={props.onUserAuthenticationModeChangeClick}>{translate[`user_authentication_page_${props.userAuthenticationMode}_link_text`]}</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Auxiliary>
            {userAuthenticationData.userAuthenticationBody}
        </Auxiliary>
    );
};

// Set the PropTypes validations and default values.
RegisterLogin.propTypes = propTypes;
RegisterLogin.defaultProps = defaultProps;

export default RegisterLogin;