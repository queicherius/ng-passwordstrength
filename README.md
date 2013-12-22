# ng-passwordstrength

AngularJS directive for a password strength bar

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
    - Number of Characters
    - Uppercase Letters
    - Lowercase Letters
    - Numbers
    - Symbols
    - Middle Numbers or Symbols
    - Requirements (Minimum 8 characters in length, Contains 3/4 of the following: Uppercase Letters, Lowercase Letters, Numbers, Symbols)
    - Letters Only
    - Numbers Only
    - Repeat Characters (Case Insensitive)
    - Consecutive Uppercase Letters
    - Consecutive Lowercase Letters
    - Consecutive Numbers
    - Sequential Letters (3+)
    - Sequential Numbers (3+)
    - Sequential Symbols (3+)
    - Small dictionary of most common passwords