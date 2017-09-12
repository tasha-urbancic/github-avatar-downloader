// load required modules
require("dotenv").config();
const request = require("request");
var fs = require("fs");

// function that generates an object to pass into the server request
// specifically using the github contributors api to return a list of 
// github repo contributors for a specific owner repo name pair
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

// function that requests from the server to get repo contributor data
// from github
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

// function that downloads the images of each contributor and writes
// the images to the directory called avatars (which is 
// created if it doesn't exist)
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

// call the main function using two command line arguments for the
// repo owener and name (in that order), to grab a list of contributors
// for that repo, and downloads and saves the images of those contributors
// to the directory avatars
getRepoContributors(process.argv[2], process.argv[3], (name, url) => {
  for (let i = 0; i < name.length; i++) {
    downloadImageByURL(url[i], `./avatars/${name[i]}.png`);
  }
});


