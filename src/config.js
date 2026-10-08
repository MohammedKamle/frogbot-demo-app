// FAKE credentials for Frogbot secrets-detection demo. Not real.
module.exports = {
  aws: {
    accessKeyId: "AKIAJ3Q7XK2M5VNB4RTA",
    secretAccessKey: "wJ8hT2kP9vLq4NzXc7YbR1mD5sFgA3uEoK6iHt0W",
  },
  db: {
    url: "postgres://admin:Sup3rS3cretP4ssw0rd!@db.internal.example.com:5432/prod",
  },
  jwtSecret: "7f3a9c1e5b8d2046a1c9e7f3b5d80246",
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
-----END RSA PRIVATE KEY-----`,
};
