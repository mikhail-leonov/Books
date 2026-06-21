import statModel from '../models/statModel';

const StatService  = {
    async getStat(): Promise<any[]> {
        return statModel.getStat();
    },
};

export default StatService;