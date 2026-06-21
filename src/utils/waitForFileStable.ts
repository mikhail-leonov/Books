import fs from 'fs/promises';

/**
 * Wait until file size stops changing (indicating copy is complete)
 * Starts with fast checks and adaptively slows down on failures
 */
async function _waitForFileStable( filePath: string, initialCheckInterval = 1000, timeout = 3000000 ): Promise<void> {
    const startTime = Date.now();
    let lastSize = -1;
    let stableCount = 0;
    let checkInterval = initialCheckInterval;
    let consecutiveFailures = 0;
    while (Date.now() - startTime < timeout) {
        try {
            const stats = await fs.stat(filePath);
            const currentSize = stats.size;
            
            if (currentSize > 0 && currentSize === lastSize) {
                stableCount++;
                consecutiveFailures = 0; 
            } else {
                stableCount = 0;
                consecutiveFailures = 0; 
            }
            lastSize = currentSize;
            if (stableCount >= 3) {
                try {
                    const handle = await fs.open(filePath, 'r');
                    await handle.close();
                    return;
                } catch (err) {
                    consecutiveFailures++;
                }
            }
        } catch (err) {
            consecutiveFailures++;
        }
        if (consecutiveFailures > 0) {
            checkInterval = Math.floor(checkInterval * 1.5);
        }
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    throw new Error(`Timeout waiting for file: ${filePath}`);
}

export async function waitForFileStableZip( filePath: string, checkInterval = 1000, timeout = 3000000 ): Promise<void> {
    return _waitForFileStable(filePath, checkInterval, timeout);
}

export async function waitForFileStableFb2(filePath: string, checkInterval = 30, timeout = 30000): Promise<void> {
    return _waitForFileStable(filePath, checkInterval, timeout);
}

