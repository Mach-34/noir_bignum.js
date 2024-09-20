#!/bin/bash
wasm-pack build --target nodejs
cd pkg
npm publish --access public