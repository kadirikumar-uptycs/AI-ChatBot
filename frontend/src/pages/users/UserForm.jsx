import React, { useEffect, useRef } from 'react';
import { useSnackbar } from '../../hooks/SnackBarProvider';
import './UserForm.css';
import RadioGroup from '../../common/RadioGroup';

const UserForm = ({ handleUserFormSubmit, edit, editFormDetails }) => {
    let formDataRef = useRef({})
    let openSnackbar = useSnackbar()
    let emailRegex = new RegExp("^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$");

    function checkRegexMatch(regex, testString) {
        return regex.test(testString);
    }

    function handleSelectEvent(event, index, option) {
        formDataRef.current = {
            ...formDataRef.current,
            role: option
        }
    }

    let handleInputEvent = (event) => {
        formDataRef.current = {
            ...formDataRef.current,
            [event.currentTarget.name]: event.currentTarget.value
        }
    }

    const setInputValue = (key) => (edit && editFormDetails?.[key]) || '';

    let validateFormData = () => {
        let formData = formDataRef?.current || {};
        if (!formData.name) {
            openSnackbar('Name must be provided', 'danger')
        }
        else if (!formData.email) {
            openSnackbar('Email must be provided', 'danger')
        }
        else if (!checkRegexMatch(emailRegex, formData.email)) {
            openSnackbar('Invalid Email Address', 'danger')
        }
        else if (!formData.role) {
            openSnackbar('Role must be Chosen', 'danger')
        }
        else {
            handleUserFormSubmit(formData, edit, editFormDetails?._id);
        }
    }

    useEffect(() => {
        formDataRef.current = editFormDetails || {};
    }, [editFormDetails])

    return (
        <div className="form-wrapper">
            <div className="user-form--container">
                <div className="text">
                    New User Form
                </div>
                <div className='form'>
                    <div className="form-row">
                        <div className="input-data">
                            <input type="text" name='name' required onInput={handleInputEvent} defaultValue={setInputValue('name')} />
                            <div className="underline"></div>
                            <label>Name</label>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-data">
                            <input type="text" name='email' required onInput={handleInputEvent} defaultValue={setInputValue('email')} />
                            <div className="underline"></div>
                            <label>Email</label>
                        </div>
                    </div>
                    <div className="form-row" style={{
                        marginLeft: '20px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}>
                            <label>Role</label>
                            <RadioGroup
                                type="new-user-role"
                                first="user"
                                second="admin"
                                defaultValue={setInputValue('role')}
                                handleChangeEvent={handleSelectEvent}
                            />
                        </div>
                    </div>
                    <div className="form-row submit-btn">
                        <div className="input-data">
                            <div className="inner"></div>
                            <input type="submit" value="submit" onClick={validateFormData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserForm;