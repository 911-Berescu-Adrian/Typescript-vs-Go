import React, { useState } from "react";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants";

export default function AddCd() {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [releasedYear, setReleasedYear] = useState("");
    const [price, setPrice] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (!title || !artist || !genre || !releasedYear || !price) {
            alert("Please fill in all fields");
            return;
        }
        const response = await fetch(BACKEND_URL + "/api/cds/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                artist,
                genre,
                releasedYear: parseInt(releasedYear),
                price: parseFloat(price),
            }),
        });
        if (response.ok) {
            navigate("/");
        } else {
            alert("Failed to add CD");
        }
    };
    return (
        <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20 py-10 text-center flex-flex-col items-center">
            <BackButton />
            <form className="flex flex-col space-y-4 w-64 mx-auto mt-20" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                        Artist
                    </label>
                    <input
                        type="text"
                        id="artist"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        name="artist"
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                        Genre
                    </label>
                    <input
                        type="text"
                        id="genre"
                        name="genre"
                        required
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="releasedYear" className="block text-sm font-medium text-gray-700">
                        Released Year
                    </label>
                    <input
                        type="number"
                        id="releasedYear"
                        name="releasedYear"
                        value={releasedYear}
                        onChange={(e) => setReleasedYear(e.target.value)}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add new CD
                </button>
            </form>
        </div>
    );
}
