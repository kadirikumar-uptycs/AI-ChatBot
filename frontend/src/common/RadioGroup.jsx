import React, { useRef } from 'react';
import './RadioGroup.css';
const RadioGroup = ({ type, first, second, last, handleChangeEvent, defaultValue }) => {
    let checkedEleRef = useRef(null);
    if (!defaultValue && checkedEleRef?.current) {
        checkedEleRef.current.checked = false;
    }
    return (
        <div>
            <label htmlFor={`f-option-${type}`} className="l-radio">
                <input
                    type="radio"
                    id={`f-option-${type}`}
                    name={type}
                    tabIndex={1}
                    defaultChecked={defaultValue === first}
                    ref={(defaultValue === first) ? checkedEleRef : null}
                    onClick={(event) => {
                        handleChangeEvent && handleChangeEvent(event, 0, first);
                    }} />
                <span>{first}</span>
            </label>
            <label htmlFor={`s-option-${type}`} className="l-radio">
                <input
                    type="radio"
                    id={`s-option-${type}`}
                    name={type}
                    tabIndex={2}
                    defaultChecked={defaultValue === second}
                    ref={(defaultValue === second) ? checkedEleRef : null}
                    onClick={(event) => {
                        handleChangeEvent && handleChangeEvent(event, 1, second);
                    }} />
                <span>{second}</span>
            </label>
            {last && <label htmlFor={`t-option-${type}`} className="l-radio">
                <input
                    type="radio"
                    id={`t-option-${type}`}
                    name={type}
                    tabIndex={3}
                    defaultChecked={defaultValue === last}
                    ref={(defaultValue === last) ? checkedEleRef : null}
                    onClick={(event) => {
                        handleChangeEvent && handleChangeEvent(event, 2, last);
                    }} />
                <span>{last}</span>
            </label>}
        </div>
    );
}

export default RadioGroup;