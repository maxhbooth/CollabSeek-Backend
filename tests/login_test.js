
Feature('Log In');

Scenario('Test homepage load and progress to login', (I) => {
    I.amOnPage('/');
    I.click('Log In');
    I.see('Log In');
    I.fillField('email', 'test@test');
    I.fillField('password', 'test');
    I.click('Log In');
    I.see('Profile');
});

Scenario('Test log in with wrong password', (I) => {
    I.amOnPage('/login');
    I.fillField('email', 'test@test');
    I.fillField('password', 'false');
    I.click('Log In');
    I.see('Log In');
});