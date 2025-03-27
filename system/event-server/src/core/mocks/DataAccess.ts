export default class {
    static updateProfile(dataAccessObject: Record<string, unknown>): Promise<void> {
        /**
         * Pretend some work is being done by other services
         * updating the database.
         */
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 3000)
        });
    }
}
