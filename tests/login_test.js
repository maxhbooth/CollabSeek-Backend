
Feature('Log In');

Scenario('Test homepage load and progress to login', (I) => {
    I.amOnPage('/');
    I.click('Log In');
    I.see('Log In');
    I.fillField('email', 'treeswitheyes@gmail.com');
    I.fillField('password', 'test');
    I.click('input[type=submit]');
    I.see('Search');
});

Scenario('Test log in with wrong password', (I) => {
    I.amOnPage('/login');
    I.fillField('email', 'treeswitheyes@gmail.com');
    I.fillField('password', 'false');
    I.click('Log In');
    I.see('Log In');
});


// Scenario('Test successful sign up but no email verification', (I) => {
//     I.amOnPage('/login');
//     I.fillField('email', 'macwatro@cs.unc.edu');
//     I.fillField('password', 'testtest');
//     I.click('Sign Up');
//     let user = yield I.sendGetRequest('/checkTestCreated');
//     I.waitForValue(user.created, "Test account created");
//     I.amOnPage('/profile');
//     I.see('Log In');
// });
