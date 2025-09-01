/**
 * @typedef {'sub'|'unsub'|'rpc'|'ack'|'error'|'event'} MsgType
 * @typedef {'snapshot'|'delta'} EventAction
 *
 * @typedef {Object} Base
 * @property {number} [ts]
 * @property {string} [reqId]
 * @property {string} [sessionId]
 * @property {number} [protocolVersion]
 *
 * @typedef {Object} SubParams
 * @property {'event'|'poll'} [mode]
 * @property {number} [intervalMs]
 * @property {string[]} [fields]
 * @property {string|null} [cursor]
 */
