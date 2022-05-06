# Doctolib Test

## Find bugs and test code
### Instructions
The code in the attached zip file provides an algorithm that checks the
availabilities of an agenda depending of the events attached to it. The main
method has a start date for input and is looking for the availabilities of the
next 7 days.

They are two kinds of events:

* `opening`, are the openings for a specific day and they can be recurring
  week by week.
* `appointment`, times when the doctor is already booked.

Unfortunately, the code is broken. Here is your mission:

1. Fix the tests.
2. Optimize and refactor if needed.
3. Allow the function to return availabilities on as many days as
  requested (10 for instance): 
```js
// The function you turn in MUST use this signature. Otherwise it won’t pass
// our tests.
function getAvailabilities(date, numberOfDays = 7) {}
```

Please create a commit after each step. Feel free to refactor or add unit tests
at any moment.

### How to run
 * Install [node](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/)
 * Run `yarn && yarn test`, focus on `src` folder, you are ready!

### How to turn in
Run the `turnin.sh` (`turnin.ps1` if you are on Windows) script which will
build the `turnin.git.zip` archive you should send us back. **Be aware that any
uncommited change won’t be part of the archive!**
