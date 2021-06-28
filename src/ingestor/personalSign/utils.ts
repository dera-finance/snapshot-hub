import { domain, getTypes } from '@snapshot-labs/snapshot.js/src/client';
import * as ethUtil from 'ethereumjs-util';
import { verifyTypedData } from '@ethersproject/wallet';
import { convertUtf8ToHex } from '@walletconnect/utils';

export function recoverPublicKey(sig: string, hash: string): string {
  const params = ethUtil.fromRpcSig(sig);
  const result = ethUtil.ecrecover(
    ethUtil.toBuffer(hash),
    params.v,
    params.r,
    params.s
  );
  return ethUtil.bufferToHex(ethUtil.publicToAddress(result));
}

export async function verifySignature(
  expectedSignerAddress: string,
  sig: string,
  data: any
): Promise<boolean> {
  const recoveredAddress = verifyTypedData(
    domain,
    getTypes(data.type),
    data,
    sig
  );
  return recoveredAddress === expectedSignerAddress;
}

export function encodePersonalMessage(msg: string): string {
  const data = ethUtil.toBuffer(convertUtf8ToHex(msg));
  const buf = Buffer.concat([
    Buffer.from(
      '\u0019Ethereum Signed Message:\n' + data.length.toString(),
      'utf8'
    ),
    data
  ]);
  return ethUtil.bufferToHex(buf);
}

export function hashPersonalMessage(msg: string): string {
  const data = encodePersonalMessage(msg);
  const buf = ethUtil.toBuffer(data);
  const hash = ethUtil.keccak256(buf);
  return ethUtil.bufferToHex(hash);
}
