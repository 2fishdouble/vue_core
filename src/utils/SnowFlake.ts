// static-snowflake.ts
export class Snowflake {
    private static twepoch = 1609459200000n // 起始时间戳（2021-01-01）

    private static sequence = 0n
    private static lastTimestamp = -1n

    private static machineId = 1n
    private static datacenterId = 1n

    private static sequenceBits = 12n
    private static machineIdBits = 5n
    private static datacenterIdBits = 5n

    private static maxSequence = (1n << this.sequenceBits) - 1n

    private static machineIdShift = this.sequenceBits
    private static datacenterIdShift = this.sequenceBits + this.machineIdBits
    private static timestampLeftShift = this.sequenceBits + this.machineIdBits + this.datacenterIdBits

    public static nextId(): string {
        let timestamp = BigInt(Date.now())

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1n) & this.maxSequence
            if (this.sequence === 0n) {
                timestamp = this.waitUntilNextMillis(this.lastTimestamp)
            }
        } else {
            this.sequence = 0n
        }

        this.lastTimestamp = timestamp

        const id =
            ((timestamp - this.twepoch) << this.timestampLeftShift) |
            (this.datacenterId << this.datacenterIdShift) |
            (this.machineId << this.machineIdShift) |
            this.sequence

        return id.toString()
    }

    private static waitUntilNextMillis(lastTimestamp: bigint): bigint {
        let timestamp = BigInt(Date.now())
        while (timestamp <= lastTimestamp) {
            timestamp = BigInt(Date.now())
        }
        return timestamp
    }
}
