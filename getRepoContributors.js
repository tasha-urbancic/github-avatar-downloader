require("dotenv").config();
const request = require("request");

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

getRepoContributors("jquery", "jquery", function(name, url){
  for (let i = 0; i < name.length; i++) {
    downloadImageByURL(url[i], `./avatars/${name[i]}.png`)
  }
});

function downloadImageByURL(url, name, filePath) {
  request.get(url)
  .on("error", function(err) {
    throw err;
  })
  .on("response", function(response) {
    console.log("Response Status Code: ", response.statusCode);
    console.log("Response Status Message: ", response.statusMessage);
    console.log("Response Content Type: ", response.headers["content-type"]);
  })
  .on('end', () => {
    console.log("Download Complete.");
  })
  .pipe(fs.createWriteStream(filePath).on('end', () => {
    console.log('Done Writing!');
  }));
}




