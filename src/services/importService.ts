import importModel from '../models/importModel';

const ImportService = {
    async runImport(): Promise<{ processed: number; errors: number; log: string[] }> {
        return await importModel.runImport();
    },
};

export default ImportService;