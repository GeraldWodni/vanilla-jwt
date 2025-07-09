/*
 * JWT - JSON Web Token en-/decoder
 * This library implements signature checking for HS256, HS384 and HS512.
 * It also supports setting the "iat" and checking the "exp" registered claim names.
 *
 * (c)copyright 2025 by Gerald Wodni <gerald.wodni@gmail.com>
 */

import { createHmac } from "node:crypto";

function burltob64( text ) {
    return text.replace( /-/g, '+' ).replace( /_/g, '/' );
}
function b64toburl( text ) {
    return text.replace( /\+/g, '-' ).replace( /\//g, '_' ).replace( /=*$/g, '' );
}
function decodeBase64JSON( burl ) {
    const b64 = burltob64( burl );
    const text = Buffer.from( b64, "base64" ).toString();
    return JSON.parse( text );
}
function encodeBase64OBJ( obj ) {
    const text = JSON.stringify( obj );
    const b64 = Buffer.from( text, "utf-8" ).toString("base64");
    return b64toburl( b64 );
}

function createSignature( { header, rawHeader, rawPayload }, opts ) {
    if( !( header.alg in opts.secrets ) )
        throw new Error( "Creating JWT signature failed: no secret defined for HS256" );
    const secret = opts.secrets[ header.alg ];

    const text = `${rawHeader}.${rawPayload}`;
    let cyrptObj = null;
    /* https://datatracker.ietf.org/doc/html/rfc7518#section-3.1 */
    switch( header.alg ) {
        case "HS256":
            cyrptObj = createHmac('sha256', opts.secrets[ header.alg ] );
            break;
        case "HS384":
            cyrptObj = createHmac('sha384', opts.secrets[ header.alg ] );
            break;
        case "HS512":
            cyrptObj = createHmac('sha512', opts.secrets[ header.alg ] );
            break;
        default:
            throw new Error( "Creating JWT signature failed: Unknown alg" );
    }
    return b64toburl( cyrptObj.update( text ).digest('base64') );
}
function checkSignature( { header, rawHeader, rawPayload, signature }, opts ) {
    const hash = createSignature( { header, rawHeader, rawPayload }, opts );
    return hash == signature;
}

function checkExp( payload ) {
    const exp = new Date( payload.exp * 1000 );
    return exp > Date.now();
}

function jwtDecode( text, opts ) {
    const [ rawHeader, rawPayload, signature ] = text.split(".");
    const header = decodeBase64JSON( rawHeader );

    if( header.typ != "JWT" )
        throw new Error( "Decoding JWT failed: invalid typ" );

    if( !checkSignature( { header, rawHeader, rawPayload, signature }, opts ) )
        throw new Error( "Decoding JWT failed: invalid signature" );

    const payload = decodeBase64JSON( rawPayload );
    /* https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4 */
    if( "exp" in payload && !checkExp( payload ) )
        throw new Error( "JWT expired" );

    return payload
}

function jwtEncode( obj, alg, opts ) {
    const header = {
        alg,
        typ: "JWT",
    };
    const rawHeader = encodeBase64OBJ( header );

    /* https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.6 */
    if( !("iat" in obj) )
        obj.iat = Math.round( (new Date()).getTime() / 1000 );
    const rawPayload = encodeBase64OBJ( obj );

    const signature = createSignature( { header, rawHeader, rawPayload }, opts );
    const text = `${rawHeader}.${rawPayload}.${signature}`;
    return text;
}

export {
    jwtEncode,
    jwtDecode,
};
