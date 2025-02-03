import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

// Function to create multiple commits per day
const makeCommits = (n) => {
  if (n === 0) return git.push();

  const startOf2022 = moment("2023-01-01");
  const endOf2023 = moment("2024-12-31");

  // Generate a random date within the range
  const randomDate = moment(startOf2022)
    .add(random.int(0, endOf2023.diff(startOf2022, "days")), "days");

  const commitCount = random.int(4, 20); // Generate between 4 to 20 commits for the same day

  console.log(`Generating ${commitCount} commits on ${randomDate.format("YYYY-MM-DD")}`);

  const commitData = (count) => {
    if (count === 0) return makeCommits(n - 1); // Move to the next day

    const commitTime = randomDate.clone().add(random.int(0, 23), "hours").add(random.int(0, 59), "minutes").format(); // Randomizing time

    const data = { date: commitTime };

    jsonfile.writeFile(path, data, () => {
      git.add([path])
        .commit(`Commit ${count} on ${commitTime}`, { "--date": commitTime }, () => {
          commitData(count - 1); // Recursively call to make multiple commits per day
        });
    });
  };

  commitData(commitCount); // Start making commits for the selected day
};

// Start making commits
makeCommits(100);