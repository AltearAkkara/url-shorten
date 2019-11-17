import * as mongoose from 'mongoose';
import UrlShorten from '../interface/urlShorten.interface';

const urlShortenSchema = new mongoose.Schema({
  originalUrl: String,
  urlCode: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const urlShortenModel = mongoose.model<UrlShorten & mongoose.Document>('UrlShorten', urlShortenSchema);
export default urlShortenModel;