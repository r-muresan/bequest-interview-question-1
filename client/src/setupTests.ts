const nodeCrypto = require('crypto');
Object.defineProperty(globalThis, 'crypto', {
  value: {
        subtle: nodeCrypto.webcrypto.subtle,   
    }
});