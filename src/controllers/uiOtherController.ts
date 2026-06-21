import StatService from '../services/statService';
import Helpers from '../utils/helpers';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const UIOtherController = {

    LogPerformance: false,

    async showImport(req: Request, res: Response) {
        const start = performance.now();
        Helpers.renderTwig('import', { title: "Import Books" }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIOtherController.LogPerformance) { logger.error(` - - UIOtherController.showImport = ${duration}`); }
    },
    async showStat(req: Request, res: Response) {
        const start = performance.now();
        const data = await StatService.getStat();
        Helpers.renderTwig('stat', { title: "Lib stat", stats: data }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIOtherController.LogPerformance) { logger.error(` - - UIOtherController.showStat = ${duration}`); }
    },


};

export default UIOtherController;