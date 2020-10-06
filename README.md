<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://raw.githubusercontent.com/studyjourney/codedatasurvey/master/static/fav/android-chrome-512x512.png">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Study Journey Data Survey</h3>

  <p align="center">
    Help us making YOUR Study Journey at Code easier!
    <br />
    <a href="https://studyjourney.de"><strong>Contribute your data »</strong></a>
    <br />
    <br />
    <a href="https://codeuniversity.slack.com/archives/C01A1LVJD3L">Chat with us at Slack</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [LP GraphQL Queries](#data-accessed-at-code)
* [License](#license)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Data Survey Screen Shot][screenshot]](https://raw.githubusercontent.com/studyjourney/codedatasurvey/master/static/img/main.png)

The Study Journey Project wants to help you passing code modules easier. The first step of our project is to gain more knowledge on the current situation. This will help us to provide resources and methods more meaningful for everyone.

Our key principles for this project:
* Only fetch data we actually need
* Be transparent about the data we fetch.
* Anonymize all data and remove any connection to a specific person

To achieve this goal we decided to build a small Express Web App, that takes your Code Learning Platform API Token.
We then fetch some data that gets anonymized and then stored to a Database for later evaluation.

Down below you'll find an indepth description on how and what we will query the LP.

### Built With
The Survey App is Build using the following technologies
* [NodeJS](https://nodejs.org)
* [Express.js](https://expressjs.com)
* [Bootstrap](https://getbootstrap.com)



<!-- GETTING STARTED -->
## Getting Started

If you want to run the project on your local machine, follow the following Description.

### Prerequisites


* node v14.X
The base app is made to run on node version 14.X.
[Download here](https://nodejs.org/en/download/current/)


* npm
All necessary npm modules can be installed by running the following command inside the directory
```sh
npm install
```

* MySQL
Gathered data will be saved to a standard MySQL Database.
The base Template can be found [here](https://github.com/studyjourney/codedatasurvey/blob/master/db.sql)


### Installation

1. Clone the repository
```sh
git clone https://github.com/studyjourney/codedatasurvey.git
```
2. Install NPM dependencies
```sh
npm install
```
3. Import the `db.sql` file into the MySQL Database
4. Rename `.env.sample` to `.env`
Enter the DB Credentials to your MySQL Database
5. Run the app
```sh
npm start
```
6. Open the app at
[localhost:3000](http://localhost:3000)

<!-- DATA QUERIES -->
## Data Accessed at Code

Main MyStudies Query
[codeLearningPlatform.js](https://github.com/studyjourney/codedatasurvey/blob/db70830ce1c145846a78a0ea418c7b6a680a820b/codeLearningPlatform.js#L32-L55)
```JS
    const query = `query {
        myStudies {
            shortCode  # eg SE_36_Fall_2019. We don't need this but I think it's good to have in case we can't work with the semesterModule id later
            assessments {
                assessmentStatus  # present, absent, etc
                assessmentStyle  # standard, alternative, etc
                examinationForms  # oral, written, etc
                proposalText
                grade
                assessmentProtocol
                internalNotes
                externalFeedback
                attempt
                earlyAssessmentProposal
                assessmentType  # normal, reassessment, level up, etc
                ${getProjects ? `project {
                    id
                }` : ''}
                semesterModule {
                    id
                }
            }
        }
    }`
```


<!-- LICENSE -->
## License

TBD
Distributed under the . See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Copyright © 2020, [Study Journey](https://studyjourney.de).