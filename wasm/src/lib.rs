use js_sys::{Array, JsString};
use noir_bignum_paramgen::{
    bignum_from_string, bn_limbs, bn_limbs_from_string as bn_limbs_str,
    compute_barrett_reduction_parameter, redc_limbs_from_string as redc_limbs_str,
    split_into_120_bit_limbs,
};
use num_bigint::BigUint;
use wasm_bindgen::prelude::*;

// todo: promisify so that failures can be caught in js

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_class = Array, typescript_type = "string[]")]
    pub type StringArray;

    #[wasm_bindgen(constructor, js_class = Array)]
    pub fn new() -> StringArray;

    #[wasm_bindgen(method, js_class = Array)]
    pub fn push(this: &StringArray, value: &JsValue) -> u32;
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}
#[wasm_bindgen]
pub fn bn_limbs_from_string(bn_str: String) -> StringArray {
    // log errors to js console
    console_error_panic_hook::set_once();
    // destringify the bignum
    let bn = bignum_from_string(bn_str);
    // turn into array of limbs
    bn_limbs_to_arr(&bn)
}

#[wasm_bindgen]
pub fn redc_limbs_from_string(bn_str: String) -> StringArray {
    // log errors to js console
    console_error_panic_hook::set_once();
    // destringify the bignum
    let bn = bignum_from_string(bn_str);
    // compute Barrett reduction parameter
    let redc_param = compute_barrett_reduction_parameter(&bn);
    // turn into array of limbs
    bn_limbs_to_arr(&redc_param)
}

fn bn_limbs_to_arr(bn: &BigUint) -> StringArray {
    // split into 120 bit limbs
    let limbs = split_into_120_bit_limbs(&bn, bn.bits());
    // place into js string array
    let arr = StringArray::new();
    for i in 0..limbs.len() {
        let limb = format!("0x{}", hex::encode(limbs[i].to_bytes_be()));
        arr.push(&JsValue::from_str(&limb));
    }
    arr
}

#[wasm_bindgen]
pub fn test_str(str: String) -> String {
    console_error_panic_hook::set_once();
    console_log!("{}", str);
    return "Hello".to_string();
}
