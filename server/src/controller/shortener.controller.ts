import * as express from 'express';
// import * as nanoid from 'nanoid';
import Controller from '../interface/controller.interface';
import UrlShorten from '../interface/urlShorten.interface';
import urlShortenModel from '../model/urlShortenModel.model';
import * as dns from 'dns';
import * as shortid from 'shortid';

class ShortenerController implements Controller {
    public path = '/shortener';
    public router = express.Router();
    public errorUrl = `https://localhost:${process.env.PORT}/error`;
    public urlShorten = urlShortenModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:code`, this.redirect);
        this.router.post(this.path, this.shortenURL);
    }

    //GET API for redirecting to Original URL
    private redirect = async (request: express.Request, response: express.Response) => {
        // response.status(200).json({ msg: `redirect to ${request.params.code}`});
        const urlCode = request.params.code;
        console.log(request.params);
        const item = await this.urlShorten.findOne({ urlCode: urlCode });
        console.log(item);
        if (item) {
            return response.redirect(item.originalUrl);
        } else {
            return response.redirect(this.errorUrl);
        }
    }

    //POST API for creating short url from Original URL
    private shortenURL = (request: express.Request, response: express.Response) => {
        const urlShortenData: UrlShorten = request.body;
        let originalUrl;
        try {
            originalUrl = new URL(urlShortenData.originalUrl);
        } catch (err) {
            return response.status(400).send({ error: 'invalid URL' });
        }
        dns.lookup(originalUrl.hostname, async (err) => {
            if (err) {
                return response.status(404).send({ error: 'Address not found' });
            };
            const item = await this.urlShorten.findOne({ originalUrl: urlShortenData.originalUrl });
            if (item) {
                response.send(item);
            } else {
                const code = shortid.generate();
                const created = new this.urlShorten({
                    originalUrl: urlShortenData.originalUrl,
                    urlCode: code,
                    shortUrl: `https://localhost:${process.env.PORT}/shortener/${code}`,
                });
                const savedPost = await created.save();
                response.send(savedPost);
            }
        });
    }

}

export default ShortenerController;
