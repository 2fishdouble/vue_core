export class Singleton {
    private static instance: Singleton | null = null
    private constructor() {}

    static getInstance(): Singleton {
        if (!this.instance) {
            this.instance = new Singleton()
        }
        return this.instance
    }
}
