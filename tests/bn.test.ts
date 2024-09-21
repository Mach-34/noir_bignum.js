import * as NoirBignumWasm from "noir_bignum";
import * as NoirBignum from "../src";
import * as crypto from "crypto";
describe('Compare js and rust implementations of noir-bignum-paramgen', () => {
  it('test', async () => {
        for (let i = 0; i < 100; i++) {
            // sample random 2048-bit modulus
            let modulusStr = `0x${crypto.randomBytes(256).toString('hex')}`;
            let modulus = BigInt(modulusStr);
            // turn to 120-bit limbs in js and rust
            let limbsJs = NoirBignum.bnToLimbStrArray(modulus);
            let limbsWasm = NoirBignumWasm.bn_limbs_from_string(modulusStr);
            // compare limbs
            expect(limbsJs).toEqual(limbsWasm);
            // compute barrett reduction parameter in js and rust
            let redcBigint = NoirBignum.bnToRedcLimbStrArray(modulus);
            let redcWasm = NoirBignumWasm.redc_limbs_from_string(modulusStr);
            // compare barrett reduction parameter
            expect(redcBigint).toEqual(redcWasm);
        }
  });
});
