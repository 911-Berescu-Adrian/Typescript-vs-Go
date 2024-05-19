import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";

const BASE_URL = `https://accounts.spotify.com/api`;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export const getAllCds: RequestHandler = async (req, res, next) => {
    try {
        const cds = await prisma.cd.findMany();
        res.json(cds);
    } catch (error) {
        next(createHttpError(500, "Internal server error"));
    }
};

const getSpotifyToken = async () => {
    const res = await fetch(`${BASE_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=" + client_id + "&client_secret=" + client_secret,
    })
        .then((res) => res.json())
        .then((data) => data.access_token);
    return res;
};

const getImageForAlbum = async (album: string, artist: string) => {
    const token = await getSpotifyToken();
    const res = await fetch("https://api.spotify.com/v1/search?q=" + album + "+" + artist + "&type=album", {
        headers: { Authorization: "Bearer " + token },
    })
        .then((res) => res.json())
        .then((data) => data.albums.items[0].images[0].url);
    return res;
};

export const addCd: RequestHandler = async (req, res, next) => {
    const { title, artist, releasedYear, genre, price } = req.body;
    const image = await getImageForAlbum(title as string, artist as string);
    try {
        console.log(title, artist, releasedYear, genre, price, image);
        const cd = await prisma.cd.create({
            data: {
                title: title as string,
                artist: artist as string,
                releasedYear: parseInt(releasedYear as string),
                genre: genre as string,
                image: image as string,
                price: parseFloat(price as string),
            },
        });
        res.json(cd);
    } catch (error) {
        next(createHttpError(500, "Internal server error"));
    }
};

export const getCdById: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);
    try {
        const cd = await prisma.cd.findUnique({
            where: {
                id,
            },
        });
        if (!cd) {
            next(createHttpError(404, "CD not found"));
            return;
        }
        res.json(cd);
    } catch (error) {
        next(createHttpError(500, "Internal server error"));
    }
};
