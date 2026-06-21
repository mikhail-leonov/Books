import 'dotenv/config';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import Twig from 'twig';
import { networkInterfaces } from 'os';
import { initializeDatabase } from './db/index';
import { logger } from './utils/logger';

import apiBooks   from './routes/apiBooks';
import apiAuthors from './routes/apiAuthors';
import apiGenres  from './routes/apiGenres';
import apiSeries  from './routes/apiSeries';
import apiGroups  from './routes/apiGroups';
import apiMerge   from './routes/apiMerge';
import apiOthers  from './routes/apiOthers';

import uiBooks    from './routes/uiBooks';
import uiAuthors  from './routes/uiAuthors';
import uiGenres   from './routes/uiGenres';
import uiSeries   from './routes/uiSeries';
import uiGroups   from './routes/uiGroups';
import uiMerge    from './routes/uiMerge';
import uiOthers   from './routes/uiOthers';

import pc from 'picocolors';

const packageJsonPath = path.join(process.cwd(), 'package.json');
let SERVER_VERSION = 'unknown';
try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    SERVER_VERSION = packageJson.version || 'unknown';
} catch (err) {
    logger.error(pc.red('Could not read package.json version'));
}

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Helper to get the local network IP address
function getLocalIpAddress(): string {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// Twig setup
Twig.cache(false);
app.set('views', path.join(process.cwd(), 'src/views'));
app.set('view engine', 'twig');

app.use('/public', express.static(path.join(process.cwd(), 'public')));

const requiredDirs = ['inbox', 'library', 'logs'];
for (const dir of requiredDirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 32 * 1024 * 1024 * 1024 }, // 32 GB
    abortOnLimit: true,
    safeFileNames: false,
    preserveExtension: true,
    useTempFiles: false,
    defParamCharset: 'utf8'
}));


initializeDatabase();

app.use('/',     	uiBooks);
app.use('/authors', 	uiAuthors);
app.use('/series',      uiSeries);
app.use('/groups',      uiGroups);
app.use('/genres',      uiGenres);
app.use('/merge',       uiMerge);

app.use('/api/books',   apiBooks);
app.use('/api/authors', apiAuthors);
app.use('/api/series',  apiSeries);
app.use('/api/groups',  apiGroups);
app.use('/api/genres',  apiGenres);
app.use('/api/merge',   apiMerge);

app.use('/api/',  	apiOthers);
app.use('/', 		uiOthers);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Global Error Handler:', err);
    res.redirect('/');
});

const server = app.listen(PORT, '0.0.0.0', () => {
    const localUrl = `http://localhost:${PORT}`;
    const networkUrl = `http://${getLocalIpAddress()}:${PORT}`;
    logger.error(pc.green(`FB2 Manager v${SERVER_VERSION} listening on:`));
    logger.error(pc.green(` - Local:   ${localUrl}`));
    logger.error(pc.green(` - Network: ${networkUrl}`));
    logger.error(pc.green(` - Web request monitor`));
});

async function shutdown() {
    logger.error(pc.green('Shutting down gracefully...'));
    await new Promise<void>((resolve) => {
        server.close(() => {
            logger.info(pc.green('HTTP server closed'));
            resolve();
        });
    });
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
