
import crypto from "crypto";

const hashAlgorithm = "sha256";

export default function generateHash(data: string, secretKey: string = "") {
    const hash = crypto.createHash(hashAlgorithm);
    hash.update(data);
    if (secretKey) {
      const hmac = crypto.createHmac(hashAlgorithm, secretKey);
      hmac.update(hash.digest());
      return hmac.digest("hex");
    }
    return hash.digest("hex");
  }
  