import { AddressEncodable } from "./AddressEncodable";
import { BooleanEncodable } from "./BooleanEncodable";
import { BufferEncodable } from "./BufferEncodable";
import { BytesEncodable } from "./BytesEncodable";
import { Encodable } from "./Encodable";
import { IntEncodable } from "./IntEncodable";
import { ListEncodable } from "./ListEncodable";
import { OptionEncodable } from "./OptionEncodable";
import { TupleEncodable } from "./TupleEncodable";
import { UintEncodable } from "./UintEncodable";

export { Encodable, AddressEncodable };

export const e = {
  Bytes: (bytes: string | number[] | Uint8Array) => {
    return new BytesEncodable(bytes);
  },
  Buffer: (bytes: string | number[] | Uint8Array) => {
    return new BufferEncodable(bytes);
  },
  Str: (string: string) => {
    return new BufferEncodable(new TextEncoder().encode(string));
  },
  Bool: (boolean: boolean) => {
    return new BooleanEncodable(boolean);
  },
  Addr: (address: string | Uint8Array) => {
    return new AddressEncodable(address);
  },
  U8: (uint: number | bigint) => {
    return new UintEncodable(uint, 1);
  },
  U16: (uint: number | bigint) => {
    return new UintEncodable(uint, 2);
  },
  U32: (uint: number | bigint) => {
    return new UintEncodable(uint, 4);
  },
  U64: (uint: number | bigint) => {
    return new UintEncodable(uint, 8);
  },
  U: (uint: number | bigint) => {
    return new UintEncodable(uint);
  },
  I8: (int: number | bigint) => {
    return new IntEncodable(int, 1);
  },
  I16: (int: number | bigint) => {
    return new IntEncodable(int, 2);
  },
  I32: (int: number | bigint) => {
    return new IntEncodable(int, 4);
  },
  I64: (int: number | bigint) => {
    return new IntEncodable(int, 8);
  },
  I: (int: number | bigint) => {
    return new IntEncodable(int);
  },
  Tuple: (...values: Encodable[]) => {
    return new TupleEncodable(values);
  },
  List: (...values: Encodable[]) => {
    return new ListEncodable(values);
  },
  Option: (optValue: Encodable | null) => {
    return new OptionEncodable(optValue);
  },
};

export function b64ToHex(b64: string) {
  return Array.from(atob(b64), function (char) {
    return char.charCodeAt(0).toString(16).padStart(2, "0");
  }).join("");
}
