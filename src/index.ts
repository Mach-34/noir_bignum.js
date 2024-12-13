/**
 * https://github.com/noir-lang/noir-bignum-paramgen/blob/main/src/lib.rs#L24
 * @brief compute the reduction parameter used in Barrett reduction
 *        redc param = 2 * ceil(log2(modulus))
 *                     _______________________
 *                            modulus
 */
export function computeBarrettReductionParameter(input: bigint | string, numBits?: number): bigint {
    // Convert hex string to BigInt if necessary
    let bn: bigint;
    if (typeof input === 'string') {
        // Remove '0x' prefix if present and convert to BigInt
        const cleanHex = input.toLowerCase().startsWith('0x') ? input.slice(2) : input;
        if (!/^[0-9a-f]+$/i.test(cleanHex)) {
            throw new Error('Invalid hexadecimal string');
        }
        bn = BigInt('0x' + cleanHex);
    } else bn = input;
    
    // Get the number of bits required to represent the bigint
    if (numBits === undefined)
        numBits = bn.toString(2).length;
    else {
        const actualBits = bn.toString(2).length;
        if (actualBits > numBits) throw new Error("Given bits for bignum limbs is too small");
    }
    

    // multiplicand = 2^(2 * k)
    const overflowBits = 4n;
    const multiplicand = BigInt(1) << (2n * BigInt(numBits) + overflowBits);

    // Compute the Barrett reduction parameter
    const barrettReductionParameter = multiplicand / bn;

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
 * @param input The input BigInt to be converted
 * @param numBits The number of bits in the input
 * @returns An array of strings, each representing a 120-bit limb in "0x..." hexadecimal format
 */
export function bnToLimbStrArray(input: bigint | string, numBits?: number): string[] {
    // Convert hex string to BigInt if necessary
    let bn: bigint;
    if (typeof input === 'string') {
        // Remove '0x' prefix if present and convert to BigInt
        const cleanHex = input.toLowerCase().startsWith('0x') ? input.slice(2) : input;
        if (!/^[0-9a-f]+$/i.test(cleanHex)) {
            throw new Error('Invalid hexadecimal string');
        }
        bn = BigInt('0x' + cleanHex);
    } else bn = input;
    
    // Get the number of bits in the BigInt
    if (numBits === undefined)
        numBits = bn.toString(2).length;
    else {
        const actualBits = bn.toString(2).length;
        if (actualBits > numBits) throw new Error("Given bits for bignum limbs is too small");
    }

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
 * @param numBits - the number of bits the number should have
 * @returns - An array of strings, each representing a 120-bit limb in "0x..." hexadecimal format
 */
export function bnToRedcLimbStrArray(bn: bigint | string, numBits?: number): string[] {
    let redc = computeBarrettReductionParameter(bn, numBits);
    return bnToLimbStrArray(redc);
}
