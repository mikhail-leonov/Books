import StatDB from '../db/statDB';

const StatModel = {

    async getStat(): Promise<any> {
        return await StatDB.getStat();
    },
};

export default StatModel;