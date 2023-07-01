import { SignableMessage } from "@multiversx/sdk-core";
import { NativeAuthClient } from "@multiversx/sdk-native-auth-client";
import chalk from "chalk";
import { log } from "xsuite/dist/stdio";
import { Proxy } from "xsuite/proxy";
import { KeystoreSigner } from "xsuite/world";

export const requestXegldAction = async ({
  wallet: walletPath,
}: {
  wallet: string;
}) => {
  const signer = await KeystoreSigner.fromFileInteractive(walletPath);
  const address = signer.toString();
  log(`Claiming 30 xEGLD for address ${address} ...`);
  const balance = await devnetProxy.getAccountBalance(address);

  const client = new NativeAuthClient({
    origin: "https://devnet-wallet.multiversx.com",
    apiUrl: "https://devnet-api.multiversx.com",
  });
  const initToken = await client.initialize();
  const dataToSign = new SignableMessage({
    message: Buffer.from(`${address}${initToken}`, "utf8"),
  }).serializeForSigning();
  const signature = await signer
    .sign(dataToSign)
    .then((b) => b.toString("hex"));
  const accessToken = client.getToken(address, initToken, signature);

  const errorMessage = await fetch(
    "https://devnet-extras-api.multiversx.com/faucet",
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
    }
  )
    .then((r) => r.json())
    .then((d) => {
      if (d["status"] !== "success") {
        return d["message"] as string;
      }
    });

  if (errorMessage) {
    log(chalk.red(`Error: ${errorMessage}`));
    process.exit(1);
  }

  let newBalance = balance;
  while (newBalance - balance < 30n * 10n ** 18n) {
    newBalance = await devnetProxy.getAccountBalance(address);
    await new Promise((r) => setTimeout(r, 1000));
  }

  log(chalk.green("Wallet well received 30 xEGLD."));
};

const devnetProxy = new Proxy("https://devnet-gateway.multiversx.com");