require("dotenv").config();
const request = require("request");
var fs = require("fs");

function getOptionsForRepo(owner, repo) {
  return {
    url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
    qs: {
      access_token: process.env.GITHUB_TOKEN,
      sort: "pushed"
    },
    headers: {
      "User-Agent": "GitHub Avatar Downloader -- Student Project"
    }
  };
}

function getRepoContributors(repoOwner, repoName, cb) {

  if (!repoOwner || !repoName) {
    console.log('You need to enter both a repository owner and name as arguments');
    return;
  }

  const options = getOptionsForRepo(repoOwner, repoName);

  request(options, function(error, response, body) {
    // guard statement
    if (error) {
      console.log(error);
      return;
    }

    const data = JSON.parse(body);

    let contributorName = [];
    let contributorUrl = [];

    data.forEach(contributor => {
      contributorName.push(contributor.login);
      contributorUrl.push(contributor.avatar_url);
    });

    cb(contributorName, contributorUrl);
  });
}

function downloadImageByURL(url, filePath) {
  if (!fs.existsSync("./avatars")) {
    fs.mkdirSync("./avatars");
  }

  request.get(url)
    .on("error", err => {
      throw err;
    })
    .on("response", response => {
      console.log("Response Status Code: ", response.statusCode);
      console.log("Response Status Message: ", response.statusMessage);
      console.log("Response Content Type: ", response.headers["content-type"]);
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(process.argv[2], process.argv[3], (name, url) => {
  for (let i = 0; i < name.length; i++) {
    downloadImageByURL(url[i], `./avatars/${name[i]}.png`);
  }
});


