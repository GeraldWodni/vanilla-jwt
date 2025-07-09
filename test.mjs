import { jwtEncode, jwtDecode } from "./jwt.mjs";

function test() {
    /* example from https://jwt.io/ */
    const jwtSecret = "NuJlDdJmLS2WEAYIu9vTLGFmsTwGK3ZbPp3zmesayBgnFmscPzStKoM0ERDmbbGnqXjDIUSPMEUaMP7vRqTbPU";

    const opts = {
        secrets: {
            "HS256": jwtSecret,
            "HS384": jwtSecret,
            "HS512": jwtSecret,
        },
    };

    const now = Math.round(new Date( 1700000000000 ) / 1000);
    const exp = Math.round(new Date( 4000000000000 ) / 1000);

    const encObj = {
      "sub": "example.com",
      "iat": now,
      "exp": exp,
    };

    const examples = {
        "HS256": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo0MDAwMDAwMDAwfQ.T9k4Gz7E1hRHXO7WFBN-n7vyP7_Em6-Pln_U1zU0Y4c",
        "HS384": "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo0MDAwMDAwMDAwfQ.I8jE6PIwaF0EI49Cswdzn5XbuN_xnUgMKJLe4MZ5EXFN8ay_8MB2IiOJiLKyjGmm",
        "HS512": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo0MDAwMDAwMDAwfQ.V5bUzsS5P3nnxQFw0au39VuiGolrvYFGg0Ikp5M95I9v4LPYOjtaBTJG4B_QQSbdQeTpTWZMP7zHoQlkUyq9BA",
    };

    for( let [ alg, text ] of Object.entries( examples ) ) {
        console.assert( jwtEncode( encObj, alg, opts ) == text, `${alg} encoding test failed` );
        const obj = jwtDecode( text, opts );
        console.assert( obj.sub == "example.com" && obj.iat == now && obj.exp == exp, `${alg} decoding test failed` );
    }

    console.log( "If this is the only line you see, and there are no failed assertions above all is fine :)" );
}

 test();
