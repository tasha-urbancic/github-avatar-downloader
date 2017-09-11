const request = require("request");
require('dotenv').config();

// const options = {
//   url: 'https://api.github.com/repos/jquery/jquery/contributors',
//   qs: {
//     access_token: process.env.GITHUB_ACCESS_TOKEN,
//     sort: 'pushed'
//   }
//   headers: {
//     'User-Agent': 'Natasha Urbancic'
//   }
// }

function getRepoContributors(repoOwner, repoName, cb) {

  // request(options, function(error, response, body) {
    
  //     // guard statement
  //     if (error) {
  //       console.log(error);
  //       return;
  //     }
    
  //     // "avatar_url"
  //     // "login"

  //     });
  

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});


