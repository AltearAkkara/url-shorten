interface UrlShorten {
    originalUrl: string,
    urlCode: string,
    shortUrl: string,
    createdAt: { type: Date },
    updatedAt: { type: Date }
}

export default UrlShorten;
