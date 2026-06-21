import Helpers from '../utils/helpers';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const UIMergeController = {

    LogPerformance: false,

    async showMerge(req: Request, res: Response) {
        const start = performance.now();
        Helpers.renderTwig('merge', { title: 'Merge' }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIMergeController.LogPerformance) { logger.error(` - - UIMergeController.showMerge = ${duration}`); }
    },

};

export default UIMergeController;
