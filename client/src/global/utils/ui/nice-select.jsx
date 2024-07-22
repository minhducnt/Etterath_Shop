import { useState, useCallback, useRef } from 'react';
import { useClickAway } from 'react-use';

const NiceSelect = ({ options, defaultCurrent, placeholder, className, onChange, name, isReadonly, selectedColor }) => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(options[defaultCurrent]);

    const onClose = useCallback(() => setOpen(false), []);
    const ref = useRef(null);

    useClickAway(ref, onClose);

    const currentHandler = item => {
        if (isReadonly) return;
        setCurrent(item);
        onChange(item, name);
        onClose();
    };

    return (
        <div
            className={`nice-select ${className} ${open && 'open'}`}
            role="button"
            tabIndex={0}
            onClick={() => !isReadonly && setOpen(prev => !prev)}
            ref={ref}
        >
            <span className="current">{current?.text || placeholder}</span>
            <ul className="list" role="menubar" onClick={e => e.stopPropagation()} onKeyPress={e => e.stopPropagation()}>
                {options?.map((item, index) => (
                    <li
                        key={index}
                        data-value={item.value}
                        className={`option text-capitalize ${item.value === current?.value && 'selected focus'}`}
                        role="menuitem"
                        onClick={() => currentHandler(item)}
                        style={item.value === current?.value ? { color: selectedColor } : {}}
                    >
                        {item.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NiceSelect;
