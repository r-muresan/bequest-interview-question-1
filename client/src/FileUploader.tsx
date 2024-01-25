import React, {ReactNode, useRef} from 'react';

interface FileUploadProps {
    children: ReactNode
    disabled: boolean
    handleFile: (File) => void;
}


export const FileUploader = ({children, handleFile, disabled}: FileUploadProps) => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };

    return (
        <>
            <button style={{fontSize: "20px"}} disabled={disabled} onClick={handleClick}>
                {children}
            </button>
            <input
                type="file"
                onChange={handleChange}
                disabled={disabled}
                ref={hiddenFileInput}
                style={{display: 'none'}} // Make the file input element invisible
            />
        </>
    );
}