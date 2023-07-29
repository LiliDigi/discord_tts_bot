
import { Mutex } from 'await-semaphore';

export class ApplicationMutex {
    mutex = new Mutex();

    public Lock(): Promise<() => void> {
        return this.mutex.acquire();
    }
}