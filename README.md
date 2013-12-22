# ng-passwordstrength

AngularJS directive for a password strength bar

![Demo image](https://raw.github.com/queicherius/ng-passwordstrength/master/demo.png)

# Demo

[You can see a demo of it working here](https://rawgithub.com/queicherius/ng-passwordstrength/master/demo.html) - [Demo with zxcvbn](https://rawgithub.com/queicherius/ng-passwordstrength/master/demo-zxcvbn.html)

# Usage

```
<input type="password" ng-model="password" ng-password-strength>
```

# Services

- [**passwordStrength**](/scripts/services/passwordStrength.js): this algorithm is based on the rules from http://www.passwordmeter.com/ and gives a rough estimation
- [**passwordStrengthZxcvbn**](/scripts/services/passwordStrengthZxcvbn.js): this algorithm loads the algorithm from https://github.com/lowe/zxcvbn and gives a more realistic estimation, but loads 700kb worth of dictionaries
