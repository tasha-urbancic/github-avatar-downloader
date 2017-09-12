require("dotenv").config();
const request = require("request");

function getOptionsForRepo(owner, repo) {
  const options = {
    url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
    qs: {
      access_token: process.env.GITHUB_TOKEN,
      sort: "pushed"
    },
    headers: {
      "User-Agent": "GitHub Avatar Downloader -- Student Project"
    }
  };
  return options;
}

function getRepoContributors(repoOwner, repoName, cb) {
  const options = getOptionsForRepo(repoOwner, repoName);

  request(options, function(error, response, body) {
    // guard statement
    if (error) {
      console.log(error);
      return;
    }

    const data = JSON.parse(body);

    // data.forEach(contributor => {
    //   console.log(contributor.login, contributor.avatar_url);
    // });

    return data;
  });
}

const repoData = getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

// repoData.forEach(contributor => {
//   console.log(contributor.login, contributor.avatar_url);
// });
