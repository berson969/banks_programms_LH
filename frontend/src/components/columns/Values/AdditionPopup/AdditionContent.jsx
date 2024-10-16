import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";


const  AdditionContent = React.memo(({ addition }) => {
    const { typeValue, additionValue } = addition;

    const renderField = () => {
        switch (typeValue) {
            case 'text':
                return <span>{additionValue}</span>;
            case 'email':
                return (
                    <a href={`mailto:${additionValue}`} >
                    {additionValue}
                </a>
                );
            case 'url':
                try {
                    let absoluteUrl = additionValue;
                    if (!/^https?:\/\//i.test(additionValue)) {
                        absoluteUrl = `https://${additionValue}`;
                    }
                    const parsedUrl = new URL(absoluteUrl);
                    return (
                        <a
                            href={parsedUrl.href}
                            target="_blank"
                            rel="noopener noreferrer">
                            {additionValue}
                        </a>
                    );
                }
                catch (error) {
                        console.error("Error parsing URL:", error.message);
                        return null;
                }
            default:
                return null;
        }
    };

    return (
        <div className={styles.content}>
            {renderField()}
        </div>
    );
});

AdditionContent.propTypes = {
    addition: PropTypes.shape({
        typeValue: PropTypes.string.isRequired,
        additionValue: PropTypes.string.isRequired
    }).isRequired
}

AdditionContent.displayName = "AdditionContent";
export default AdditionContent;
