import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();
    return (
        <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
                navigate(-1);
            }}
        >
            &larr; Go back
        </button>
    );
}
