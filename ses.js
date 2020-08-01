const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.accessKeyId,
    secretAccessKey: secrets.accessKeySecret,
    region: "eu-west-1",
});

exports.sendEmail = (to, text, subj) => {
    return ses
        .sendEmail({
            Source: "Kiez Community<majestic.headphones@spicedling.email>",
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Text: {
                        Data: text,
                    },
                },
                Subject: {
                    Data: subj,
                },
            },
        })
        .promise();
};
