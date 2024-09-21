/**
 * https://github.com/noir-lang/noir-bignum-paramgen/blob/main/src/lib.rs#L24
 * @brief compute the reduction parameter used in Barrett reduction
 *        redc param = 2 * ceil(log2(modulus))
 *                     _______________________
 *                            modulus
 */
export function computeBarrettReductionParameter(modulus: bigint): bigint {
    // Compute the number of bits required to represent the modulus
    const k = modulus.toString(2).length; // Number of bits in the binary representation

    // multiplicand = 2^(2 * k)
    const multiplicand = BigInt(1) << (2n * BigInt(k));

    // Compute the Barrett reduction parameter
    const barrettReductionParameter = multiplicand / modulus;

    return barrettReductionParameter;
}

/**
 * https://github.com/noir-lang/noir-bignum-paramgen/blob/main/src/lib.rs#L34
 * Split a BigInt into an array of 120-bit slices
 * @param input The input BigInt to be split
 * @param numBits The number of bits in the input
 * @returns An array of BigInt, each representing a 120-bit slice
 */
export function splitInto120BitLimbs(input: bigint, numBits: number): bigint[] {
    const numLimbs: number = Math.floor(numBits / 120) + (numBits % 120 !== 0 ? 1 : 0);
    const one: bigint = 1n;
    const mask: bigint = (one << 120n) - one;

    const r: bigint[] = [];
    for (let i = 0; i < numLimbs; i++) {
        const slice = input & mask;
        input = input >> 120n;
        r.push(slice);
    }
    return r;
}

/**
 * Convert a BigInt to an array of hexadecimal strings, each representing a 120-bit limb
 * @param bn The input BigInt to be converted
 * @returns An array of strings, each representing a 120-bit limb in "0x..." hexadecimal format
 */
export function bnToLimbStrArray(bn: bigint): string[] {
    // Get the number of bits in the BigInt
    const numBits = bn.toString(2).length;

    // Split into 120-bit limbs
    const limbs = splitInto120BitLimbs(bn, numBits);

    // Convert each limb to a "0x..." hexadecimal string
    return limbs.map(limb => {
        // Convert bigint to hexadecimal string, removing the "0n" suffix that BigInt uses
        let hexString = limb.toString(16);
        
        // Ensure even length for the hex string (excluding "0x")
        if (hexString.length % 2 !== 0) {
            hexString = '0' + hexString;
        }
        
        return '0x' + hexString;
    });
}

/**
 * Compute the Barrett reduction parameter and convert it to an array of 120-bit limbs
 * @param bn - The input BigInt
 * @returns - An array of strings, each representing a 120-bit limb in "0x..." hexadecimal format
 */
export function bnToRedcLimbStrArray(bn: bigint): string[] {
    let redc = computeBarrettReductionParameter(bn);
    return bnToLimbStrArray(redc);
}