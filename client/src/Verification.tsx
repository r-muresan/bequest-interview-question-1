import React from "react";

type VerificationResult = boolean | undefined

interface VerificationProps {
    matches: VerificationResult
}

// This is a presentational component that shows the result of the data verification.
function Verification({ matches }: VerificationProps) {
    if (matches == undefined) {
        return null;
    }

    return <div style={{
        padding: 0,
        color: matches ? 'green' : 'red'
    }}>{matches ? "The data verification succeeded!" : "The data verification failed." }
    </div>;
}

export { VerificationResult, Verification }