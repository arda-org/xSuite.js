import fs from "node:fs";
import path from "node:path";
import {
  UserSigner as BaseUserSigner,
  Mnemonic,
  UserWallet,
} from "@multiversx/sdk-wallet";
import { input, log } from "../_stdio";
import { AddressEncodable } from "../data";

export abstract class Signer extends AddressEncodable {
  abstract sign(data: Buffer): Promise<Buffer>;
}

export class DummySigner extends Signer {
  async sign() {
    return Buffer.from("");
  }
}

export class UserSigner extends Signer {
  #signer: BaseUserSigner;

  constructor(signer: BaseUserSigner) {
    super(signer.getAddress().pubkey());
    this.#signer = signer;
  }

  sign(data: Buffer): Promise<Buffer> {
    return this.#signer.sign(data);
  }
}

export class KeystoreSigner extends UserSigner {
  constructor(keystore: any, password: string, addressIndex?: number) {
    super(BaseUserSigner.fromWallet(keystore, password, addressIndex));
  }

  static async createFile(filePath: string) {
    filePath = path.resolve(filePath);
    log(`Creating keystore wallet at "${filePath}"...`);
    const password = await input.hidden("Enter password: ");
    const passwordAgain = await input.hidden("Re-enter password: ");
    if (password !== passwordAgain) {
      throw new Error("Passwords do not match.");
    }
    this.createFile_unsafe(filePath, password);
  }

  static createFile_unsafe(filePath: string, password: string) {
    const mnemonic = Mnemonic.generate().toString();
    const keystore = UserWallet.fromMnemonic({ mnemonic, password }).toJSON();
    fs.writeFileSync(filePath, JSON.stringify(keystore), "utf8");
  }

  static async fromFile(filePath: string, addressIndex?: number) {
    filePath = path.resolve(filePath);
    log(`Loading keystore wallet at "${filePath}"...`);
    const password = await input.hidden("Enter password: ");
    return this.fromFile_unsafe(filePath, password, addressIndex);
  }

  static fromFile_unsafe(
    filePath: string,
    password: string,
    addressIndex?: number
  ) {
    const keystore = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return new KeystoreSigner(keystore, password, addressIndex);
  }
}
