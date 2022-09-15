const { readFileSync } = require("fs");
const path = require("path");

const releaseTemplate = readFileSync(path.join("release-template.hbs"));

module.exports = {
  branches: ["main"],
  plugins: [
    [
      "semantic-release-gitmoji",
      {
        releaseRules: {
          major: [":boom:"],
          minor: [":sparkles:"],
          patch: [
            ":zap:",
            ":bug:",
            ":ambulance:",
            ":lipstick:",
            ":lock:",
            ":arrow_down:",
            ":arrow_up:",
            ":pushpin:",
            ":chart_with_upwards_trend:",
            ":heavy_plus_sign:",
            ":heavy_minus_sign:",
            ":wrench:",
            ":globe_with_meridians:",
            ":pencil2:",
            ":rewind:",
            ":package:",
            ":alien:",
            ":bento:",
            ":wheelchair:",
            ":speech_balloon:",
            ":card_file_box:",
            ":children_crossing:",
            ":iphone:",
            ":egg:",
            ":alembic:",
            ":mag:",
            ":label:",
            ":triangular_flag_on_post:",
            ":goal_net:",
            ":dizzy:",
            ":wastebasket:",
            ":passport_control:",
            ":adhesive_bandage:",
            ":necktie:",
          ],
        },
        releaseNotes: { template: releaseTemplate },
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    [
      "@semantic-release/git",
      {
        message:
          ":bookmark: Release v${nextRelease.version}\n\n${nextRelease.notes}\n\n[skip ci]",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        publishCmd:
          "echo ::set-output name=nextVersion::${nextRelease.version}",
      },
    ],
  ],
};
