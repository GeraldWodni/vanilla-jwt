# JWT - JSON Web Token ([RFC7519](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4)) en-/decoder
lightweight and simple JWT en-/decoder with signature check written in vanilla js

This library uses as little code as possible while still implementing signature checking for HS256, HS384 and HS512.

It also supports setting the `iat` and checking the `exp` registered claim names.

## Usage

### Options for en- and decoding
`opts` are the configuration options as an object for en-/decoding.
Currently the only mandatoy (and available key) is `secrets`. Which is itself an object with algorithms (`alg`) as keys and the secret as value.

Example:
```javascript
const opts = {
    secrets: {
        "HS256": "Bvb1tVQRsu1fFFV626WEfQMZOBmIToGbGJMp0XYkpiB",
        "HS384": "s6TxfHOCxxizFt5f1iGOQMfjn9LshkmQqDhavazOsAHjeIX2qDZ0QiRjxMECTTj43",
        "HS512": "NcWpuqA0oKNshYKosta73vjlil3cc5jkZgOKF0PVYxxMmBdXiSYK1FPE0yw3yHAXEBtjGSPUBqwDAJtcPHM3CF",
    },
};
```

### Decoding via `jwtDecode( text, opts )`
This function will return the payload object on success, and throw an error otherwise.
If `exp` is set and in the past, an error will be thrown as well.

Parameters:
- `text`: a JWT string
- `opts`: see above

Example:
```javascript
import { jwtDecode } from "./jwt.mjs"

const jwtSecret = "NuJlDdJmLS2WEAYIu9vTLGFmsTwGK3ZbPp3zmesayBgnFmscPzStKoM0ERDmbbGnqXjDIUSPMEUaMP7vRqTbPU";
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo0MDAwMDAwMDAwfQ.T9k4Gz7E1hRHXO7WFBN-n7vyP7_Em6-Pln_U1zU0Y4c";

const opts = {
    secrets: {
        "HS256": jwtSecret,
    },
};

console.log( jwtDecode( jwt, opts ) );
// output: { sub: 'example.com', iat: 1700000000, exp: 4000000000 }
```


### Encoding via `jwtEncode( obj, alg, opts )`
Encode `obj` as JWT string using `alg` and secrets from `opts`

Parameters:
- `obj`: payload object
- `alg`: algorithm to use, see [RFC7518](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1) for details. currently supports `HS256`, `HS384` and `HS512`
- `opts`: see above

Example:
```javascript
import { jwtEncode } from "./jwt.mjs"

const jwtSecret = "NuJlDdJmLS2WEAYIu9vTLGFmsTwGK3ZbPp3zmesayBgnFmscPzStKoM0ERDmbbGnqXjDIUSPMEUaMP7vRqTbPU";

const opts = {
    secrets: {
        "HS256": jwtSecret,
    },
};

console.log( jwtEncode({
  "sub": "example.com",
  "exp": Math.round((Date.now() + 24 * 3600 * 1000) / 1000), /* expire in 24h */
}, "HS256", opts) );
// output: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlLmNvbSIsImV4cCI6MTc1MjE3NTgwMSwiaWF0IjoxNzUyMDg5NDAxfQ.8v5_MysNPQhIYTehBNfu_2_ZUIvqGu7oVSPgExuuJPw
```

