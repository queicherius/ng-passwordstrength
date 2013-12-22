/*jslint plusplus: true */
/*global application:false*/
// This algorithm is inspired by the rules on http://www.passwordmeter.com
application.factory('passwordStrength', function () {
    'use strict';

    return {

        calculate: function (password) {

            var strength = 0,
                strength_modifiers = [

                    // Additions
                    'characters',
                    'uppercaseCharacters',
                    'lowercaseCharacters',
                    'numbers',
                    'symbols',
                    'middleNumbersOrSymbols',
                    'requirements',

                    // Deductions
                    'lettersOnly',
                    'numbersOnly',
                    'repeatCharacters',
                    'consecutiveUppercaseCharacters',
                    'consecutiveLowercaseCharacters',
                    'consecutiveNumbers',
                    'sequentialCharacters',
                    'sequentialNumbers',
                    'sequentialSymbols',
                    'dictionary'

                ],
                i = 0;

            if (password === undefined) {
                return undefined;
            }

            password = password.replace(/\s+/g, "");

            if (password === '') {
                return undefined;
            }

            for (i = 0; i !== strength_modifiers.length; i++) {
                strength += this[strength_modifiers[i]](password);
            }

            return this.bounds(strength);

        },
        characters: function (password) {
            return password.length * 4;
        },
        uppercaseCharacters: function (password) {

            var matches, count;

            // First uppercase doesn't count
            password = password.substring(1, password.length);

            matches = password.match(/[A-Z]/g);
            count = (matches === null) ? 0 : matches.length;

            if (count === 0) {
                return 0;
            }

            return (password.length - count) * 2;

        },
        lowercaseCharacters: function (password) {

            var matches, count;

            matches = password.match(/[a-z]/g);
            count = (matches === null) ? 0 : matches.length;

            if (count === 0) {
                return 0;
            }

            return (password.length - count) * 2;

        },
        numbers: function (password) {

            var matches, count;

            matches = password.match(/[\d]/g);
            count = (matches === null) ? 0 : matches.length;

            return (count === password.length) ? 0 : count * 4;

        },
        symbols: function (password) {

            var matches, count;

            matches = password.match(/[^\w]/g);
            count = (matches === null) ? 0 : matches.length;

            return count * 6;

        },
        middleNumbersOrSymbols: function (password) {

            var matches, count;

            password = password.substring(1, password.length - 1);

            matches = password.match(/([^\w]|[\d])/g);
            count = (matches === null) ? 0 : matches.length;

            return count * 2;

        },
        requirements: function (password) {

            /*
             - Minimum 8 characters in length
             - Contains 3/4 of the following items:
             -> Uppercase Letters
             -> Lowercase Letters
             -> Numbers
             -> Symbols
             */

            var requirements_matched = 1, // Base 1 for password length
                regex_array = [/[A-Z]/g, /[a-z]/g, /[0-9]/g, /[^\w]/g],
                i;

            if (password.length < 8) {
                return 0;
            }

            for (i = 0; i < regex_array.length; i++) {

                if (regex_array[i].test(password)) {
                    requirements_matched++;
                }

            }

            // At least 3 of the requirements (excluding password length) have to get matched
            return (requirements_matched >= 4) ? requirements_matched * 2 : 0;

        },
        lettersOnly: function (password) {

            var regex = /^[A-Za-z]*$/,
                match = regex.test(password);

            return (match) ? -(password.length) : 0;

        },
        numbersOnly: function (password) {

            var regex = /^[0-9]*$/,
                match = regex.test(password);

            return (match) ? -(password.length) : 0;

        },
        repeatCharacters: function (password) {

            var password_characters = password.split(""),
                deduction = 0,
                repeated_characters = 0,
                unique_characters = 0,
                character_exists = false,
                a,
                b;

            for (a = 0; a < password_characters.length; a++) {

                character_exists = false;

                for (b = 0; b < password_characters.length; b++) {

                    // Repeated character exists
                    if (password_characters[a] === password_characters[b] && a !== b) {

                        character_exists = true;

                        // Calculate deduction based on proximity to identical characters
                        // Deduction is incremented each time a new match is discovered
                        // Deduction amount is based on total password length divided by the
                        // difference of distance between currently selected match
                        deduction += Math.abs(password_characters.length / (b - a));

                    }

                }

                if (character_exists) {

                    repeated_characters++;
                    unique_characters = password_characters.length - repeated_characters;

                    // Deduction is based on how many unique characters still exist
                    deduction = (unique_characters) ? Math.ceil(deduction / unique_characters) : Math.ceil(deduction);

                }

            }

            return -deduction;

        },
        consecutiveUppercaseCharacters: function (password) {

            var regex = /[A-Z]{2,}/g,
                count = this.consecutiveCount(password, regex);

            return -(count * 2);

        },
        consecutiveLowercaseCharacters: function (password) {

            var regex = /[a-z]{2,}/g,
                count = this.consecutiveCount(password, regex);

            return -(count * 2);

        },
        consecutiveNumbers: function (password) {

            var regex = /[0-9]{2,}/g,
                count = this.consecutiveCount(password, regex);

            return -(count * 2);

        },
        consecutiveCount: function (password, regex) {

            var matches, i, count = 0;

            matches = password.match(regex);
            matches = (matches === null) ? [] : matches;

            for (i = 0; i < matches.length; i++) {
                count += matches[i].length - 1;
            }

            return count;

        },
        sequentialCharacters: function (password) {

            var characters = "abcdefghijklmnopqrstuvwxyz" + // Alphabetical order
                             "qwertzuiopasdfghjklyxcvbnm" + // German keyboard
                             "qwertyuiopasdfghjklzxcvbnm" + // English keyboard
                             "4bcd3f6h1jklmn0pqr57uvwxyz", // Leetspeak
                count = this.sequentialCount(password, characters);

            return -(count * 6);

        },
        sequentialNumbers: function (password) {

            var characters = "01234567890",
                count = this.sequentialCount(password, characters);

            return -(count * 6);

        },
        sequentialSymbols: function (password) {

            var characters = ")!@#$%^&*()-+",
                count = this.sequentialCount(password, characters);

            return -(count * 2);

        },
        sequentialCount: function (password, characters) {

            var s,
                character_triplet,
                reverse_character_triplet,
                count = 0;

            for (s = 0; s < characters.length - 2; s++) {

                character_triplet = characters.substring(s, s + 3); // abc, bcd, cde, ..., xyz
                reverse_character_triplet = character_triplet.split("").reverse().join("");

                // Forward
                if (password.toLowerCase().indexOf(character_triplet) !== -1) {
                    count++;
                }

                // Reverse
                if (password.toLowerCase().indexOf(reverse_character_triplet) !== -1) {
                    count++;
                }

            }

            return count;

        },
        dictionary: function (password) {

            var common_passwords = ['password', '123456', '12345678', 'abc123', 'qwerty', 'monkey', 'letmein', 'dragon', '111111',
                'baseball', 'iloveyou', 'trustno1', '1234567', 'sunshine', 'master', '123123', 'welcome', 'shadow', 'ashley',
                'football', 'jesus', 'michael', 'ninja', 'mustang', '1234', 'pussy', '12345', '696969', 'pass', 'fuckme', '6969',
                'jordan', 'harley', 'ranger', 'iwantu', 'jennifer', 'hunter', 'fuck', '2000', 'test', 'batman', 'thomas', 'tigger',
                'robert', 'access', 'love', 'buster', 'soccer', 'hockey', 'killer', 'george', 'sexy', 'andrew', 'charlie', 'superman',
                'asshole', 'fuckyou', 'dallas', '123456789', 'adobe123', 'photoshop', '1234567890', '000000', 'adobe1', 'macromedia',
                'azerty', 'aaaaaa', '654321', '666666', '123321', 'asdfgh', 'password1', 'princess', 'adobeadobe', 'daniel', 'computer',
                '121212', 'qwertyuiop', '112233', 'asdfasdf', 'jessica', '1q2w3e4r', '1qaz2wsx', '987654321', 'fdsa', '753951', 'chocolate',
                'asdasd', 'asdfghjkl', 'internet', 'michelle', '123qwe', 'zxcvbnm', 'dreamweaver', '7777777', 'maggie', 'qazwsx', 'abcd1234',
                '555555', 'liverpool', 'abc', 'whatever', '11111111', '102030', '123123123', 'andrea', 'pepper', 'nicole', 'abcdef', 'hannah',
                'alexander', '222222', 'joshua', 'freedom', 'samsung', 'asdfghj', 'purple', 'ginger', '123654', 'matrix', 'secret', 'summer',
                '1q2w3e', 'snoopy1', 'panties', '1111', 'austin', 'william', 'golfer', 'heather', 'hammer', 'yankees', 'biteme', 'enter',
                'thunder', 'cowboy', 'silver', 'richard', 'fucker', 'orange', 'merlin', 'corvette', 'bigdog', 'cheese', 'matthew', 'patrick',
                'martin', 'blowjob', 'sparky', 'yellow', 'camaro', 'dick', 'falcon', 'taylor', '131313', 'bitch', 'hello', 'scooter', 'please',
                'porsche', 'guitar', 'chelsea', 'black', 'diamond', 'nascar', 'jackson', 'cameron', 'amanda', 'wizard', 'xxxxxxxx', 'money',
                'phoenix', 'mickey', 'bailey', 'knight', 'iceman', 'tigers', 'horny', 'dakota', 'player', 'morgan', 'starwars', 'boomer',
                'cowboys', 'edward', 'charles', 'girls', 'booboo', 'coffee', 'xxxxxx', 'bulldog', 'ncc1701', 'rabbit', 'peanut',
                'john', 'johnny', 'gandalf', 'spanky', 'winter', 'brandy', 'compaq', 'carlos', 'tennis', 'james', 'mike', 'brandon',
                'fender', 'anthony', 'blowme', 'ferrari', 'cookie', 'chicken', 'maverick', 'chicago', 'joseph', 'diablo', 'sexsex',
                'hardcore', 'willie', 'chris', 'panther', 'yamaha', 'justin', 'banana', 'driver', 'marine', 'angels', 'fishing'];

            return (common_passwords.indexOf(password) !== -1) ? -Infinity : 0;

        },
        bounds: function (strength) {

            // Lower bounds
            if (strength < 0) {
                strength = 0;
            }

            // Upper bounds
            if (strength > 100) {
                strength = 100;
            }

            return strength;

        }

    };

});