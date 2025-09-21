import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { ClientRequest, IncomingMessage } from 'http';
import { errorHandler, notFound } from './middlewares';
import api from './api';

// Servis yapılandırması için bir arayüz (interface) tanımlayarak kod okunabilirliğini artırıyoruz.
interface Service {
  route: string;
  target: string;
  pathRewrite?: { [key:string]: string };
  onProxyReq?: (proxyReq: ClientRequest, req: IncomingMessage) => void;
}

// Yönlendirilecek servislerin (API'ların) tanımlanması
const services: Service[] = [
  {
    route: '/weather',
    target: 'https://api.openweathermap.org', // Hedef domain
    onProxyReq: (proxyReq: ClientRequest, req: IncomingMessage) => {
      const apiKey = process.env.WEATHER_API_KEY;
      if (!apiKey) {
        console.error('Weather API key is missing from .env file');
        // İsteği bir hata ile sonlandırarak sunucu yapılandırma hatasını bildirir.
        proxyReq.destroy(new Error('Server configuration error: API key is missing.'));
        return;
      }

      // Gelen isteğin yolunu (/weather) hedef API'nin beklediği yola (/data/2.5/weather) çevirir.
      // Bu işlem, ?q=Helsinki gibi sorgu parametrelerini korur.
      // Bu işlem, ?q=Helsinki gibi sorgu parametrelerini korur ve req.url'in tanımsız olma ihtimaline karşı güvenlidir.
      const newPath = (req.url || '').replace(
        '/weather',
        '/data/2.5/weather'
      );

      // API anahtarını, mevcut sorgu parametrelerini bozmadan URL'ye ekler.
      proxyReq.path = newPath.includes('?')
        ? `${newPath}&appid=${apiKey}`
        : `${newPath}?appid=${apiKey}`;
    },
  },
];

const app = express();

app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

// Her servis için proxy middleware'i ayarla
services.forEach(({ route, target, onProxyReq, pathRewrite }) => {
  const proxyOptions: Options = {
    target,
    changeOrigin: true,
    pathRewrite: pathRewrite, // Her servisin kendi pathRewrite kuralını kullanır.
    secure: process.env.NODE_ENV === 'production',
  };

  // Eğer servis için onProxyReq fonksiyonu tanımlanmışsa, bunu proxy seçeneklerine ekler.
  if (onProxyReq) {
    proxyOptions.on = {
      proxyReq: onProxyReq,
    };
  }

  app.use(route, createProxyMiddleware(proxyOptions));
});

app.use('/api/v1', api);

// Tanımlı olmayan rotalar için 404 hatası üreten middleware.
app.use(notFound);

// Diğer tüm hataları yakalayan genel hata işleyici.
app.use(errorHandler);

export default app;
