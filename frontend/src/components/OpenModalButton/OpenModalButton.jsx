// frontend/src/components/OpenModalButton/OpenModalButton.jsx

import { useModal } from '../../context/Modal';

function OpenModalButton({
    isOpen, // boolean that determines if the modal is open
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callack function that will be called once the button that opens the modal is clicked
    onModalClose // optional: callback function that will be called once the modal is closed
}) {
    const { setModalContent, setOnModalClose } = useModal();
    if (!isOpen) return null;
    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === "function") onButtonClick();
    };

    return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;