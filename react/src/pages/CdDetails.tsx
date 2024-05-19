import React, { useEffect, useState } from "react";
import { CdType } from "../components/CdCard";
import { BACKEND_URL } from "../constants";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function CdDetails() {
    const [cd, setCd] = useState({} as CdType);
    const { id } = useParams();

    useEffect(() => {
        fetch(BACKEND_URL + "/api/cds/details/" + id)
            .then((response) => response.json())
            .then((data) => setCd(data));
    }, []);

    return (
        <>
            <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20 py-10 text-center flex-flex-col items-center mt-[-2rem]">
                <BackButton />
                <div className="mt-10">
                    <img src={cd.image} alt={cd.title} width={400} height={400} className="mx-auto rounded-lg" />
                    <h1 className="text-3xl font-bold mt-5">{cd.title}</h1>
                    <h2 className="text-2xl mt-2">{cd.artist}</h2>
                    <h3 className="text-lg mt-2">
                        {cd.genre} • {cd.releasedYear}
                    </h3>
                    <h2 className="text-3xl font-bold mt-2">${cd.price}</h2>
                </div>
            </div>
        </>
    );
}
