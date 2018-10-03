### :boom: Careful: This package is no longer maintained and is only here for historic reasons. This means you should very likely not use it. You have been warned. :boom:

---

# ng-passwordstrength

> AngularJS directive for a password strength bar

![Demo image](https://raw.github.com/queicherius/ng-passwordstrength/master/demo.png)

# Demo

[You can see a demo of it working here](https://rawgithub.com/queicherius/ng-passwordstrength/master/demo.html) - [Demo with zxcvbn](https://rawgithub.com/queicherius/ng-passwordstrength/master/demo-zxcvbn.html)

# Usage

```html
<input type="password" ng-model="password" ng-password-strength>
```

# Services

- [**passwordStrengthZxcvbn**](/scripts/services/passwordStrengthZxcvbn.js): this algorithm loads the algorithm from https://github.com/lowe/zxcvbn and gives a more realistic estimation, but loads 700kb worth of dictionaries
- [**passwordStrength**](/scripts/services/passwordStrength.js): this algorithm is based on the rules from http://www.passwordmeter.com/ and gives a rough estimation. It evaluates passwords based on the following rules
    - Number of characters
    - Uppercase letters
    - Lowercase letters
    - Numbers
    - Symbols
    - Middle numbers or symbols
    - Requirements (Minimum 8 characters in length, Contains 3/4 of the following: Uppercase Letters, Lowercase Letters, Numbers, Symbols)
    - Letters only
    - Numbers only
    - Repeat characters
    - Consecutive uppercase letters
    - Consecutive lowercase letters
    - Consecutive numbers
    - Sequential letters (3+)
    - Sequential numbers (3+)
    - Sequential symbols (3+)
    - Small dictionary of most common passwords
