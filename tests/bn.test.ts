import * as NoirBignumWasm from "noir_bignum";
import * as NoirBignum from "../src";
import * as crypto from "crypto";
describe('Compare js and rust implementations of noir-bignum-paramgen', () => {
  it('wasm parity', async () => {
        for (let i = 0; i < 100; i++) {
            // sample random 2048-bit modulus
            let modulusStr = `0x${crypto.randomBytes(256).toString('hex')}`;
            let modulus = BigInt(modulusStr);
            // turn to 120-bit limbs in js and rust
            let limbsJs = NoirBignum.bnToLimbStrArray(modulus);
            let limbsJsStr = NoirBignum.bnToLimbStrArray(modulusStr);
            let limbsWasm = NoirBignumWasm.bn_limbs_from_string(modulusStr);
            // compare limbs
            expect(limbsJs).toEqual(limbsWasm);
            expect(limbsJsStr).toEqual(limbsWasm);
            // compute barrett reduction parameter in js and rust
            let redcJs = NoirBignum.bnToRedcLimbStrArray(modulus);
            let redcJsStr = NoirBignum.bnToRedcLimbStrArray(modulusStr);
            let redcWasm = NoirBignumWasm.redc_limbs_from_string(modulusStr);
            // compare barrett reduction parameter
            expect(redcJs).toEqual(redcWasm);
            expect(redcJsStr).toEqual(redcWasm);
        }
  });
  it('numBits specified', () => {
    const bn = 90614879111360149562786228996118224637742614149008299706703283335415786579067871111959015001174024133140068646870311120647192553141891192525940971269705192895512421832045372550104584513350650295322035669604421648905588255849104702336043502738327018848860840853275435478266200559221803994968816669835715351060025914921550110335206226661599672969691918789515790457051405575700007442541272535389061169046358889843137791705440657063371283452542538757373567557434773041765404720461752266167671538596555935445852033383986043727346875371312167920422347745950882236539558155518644749818152711305924718217963435773432668415n;
    const numBits = 2048;
    const limbs = NoirBignum.bnToLimbStrArray(bn, numBits);
    const redcLimbs = NoirBignum.bnToRedcLimbStrArray(bn, numBits);
    expect(limbs.length).toBe(18);
    expect(redcLimbs.length).toBe(18);
  })
});
