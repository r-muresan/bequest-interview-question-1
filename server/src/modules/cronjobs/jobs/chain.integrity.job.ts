import cron from 'node-cron';
import { blockchain } from '../../blockchain/blockchain.factory';
import { CustomError } from '../../../utils/error/custom.errors';

export function recoveringChainFromDatabase() {
    cron.schedule('* * * * *', async () => {
        console.log('Checking if the chain is valid...');
        const validation = await blockchain.isChainValid();
        if(!validation) {
            console.log('The chain is not valid, recovering from database...');
            const dbValidation = await blockchain.recoverChain();
            if(!dbValidation) {
                console.log('The chain could not be recovered from the database!');
                throw new CustomError(
                  'The chain could not be recovered from the database! contact some adminstrator!',
                   500
                );
            }
            console.log('The chain was recovered from the database!');
        }
        console.log('The chain is valid!');
    });
}
