import { writeFileSync } from "fs";
import { request } from "https";

console.log(
  `This script will download the Gitmoji JSON from the official Gitmoji repository.
Then, it'll produce a release-template.hbs file, used by semantic-release-gitmoji as commit template.`
);

const options = {
  method: "GET",
  hostname: "raw.githubusercontent.com",
  path: "/carloscuesta/gitmoji/master/src/data/gitmojis.json",
  headers: {},
  maxRedirects: 20,
};

function getGitmojis() {
  return new Promise((resolve, reject) => {
    const req = request(options, function (res) {
      var chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const body = Buffer.concat(chunks);
        const data = JSON.parse(body.toString());
        resolve(data);
      });

      res.on("error", (error) => {
        reject(error);
      });
    });
    req.end();
  });
}

const data = await getGitmojis();

const gitmojis = {
  raw: [...data.gitmojis],
  semver: {
    null: [],
    patch: [],
    minor: [],
    major: [],
  },
};

gitmojis.raw.forEach((element) => {
  /**
   * Remove the "." at the end of all descriptions.
   */
  if (element.description.slice(-1) === ".") {
    element.description = element.description.slice(0, -1);
  }

  switch (element.semver) {
    case "major":
      gitmojis.semver.major.push(element);
      break;
    case "minor":
      gitmojis.semver.minor.push(element);
      break;
    case "patch":
      gitmojis.semver.patch.push(element);
      break;
    case null:
      gitmojis.semver.null.push(element);
      break;

    default:
      break;
  }
});

const template = {
  start:
    '{{#if compareUrl}}\n# [v{{nextRelease.version}}]({{compareUrl}}) ({{datetime "UTC:yyyy-mm-dd"}})\n{{else}}\n# v{{nextRelease.version}} ({{datetime "UTC:yyyy-mm-dd"}})\n{{/if}}\n\n{{#with commits}}\n',
  content: "",
  end: "\n{{/with}}",
};

/**
 * There is multiple forEach with multiple Arrays to order the templating
 * by major, then minor, then patch, then null.
 */
gitmojis.semver.major.forEach((element) => {
  template.content += format(element);
});
gitmojis.semver.minor.forEach((element) => {
  template.content += format(element);
});
gitmojis.semver.patch.forEach((element) => {
  if (element.name === "bug") {
    element.description = "Bug fixes";
  }
  template.content += format(element);
});
gitmojis.semver.null.forEach((element) => {
  template.content += format(element);
});

const path = "./release-template.hbs";
const result = template.start + template.content + template.end;

console.log(`Producing template file in ${path}`);
writeFileSync(path, result);

function format(element) {
  return `{{#if ${element.name}}}\n## ${element.emoji} ${element.description}\n{{#each ${element.name}}}\n- {{> commitTemplate}}\n{{/each}}\n{{/if}}\n\n`;
}
