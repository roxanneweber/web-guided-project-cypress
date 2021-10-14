// write tests here
describe('Quotes App', () => {
    beforeEach(() => {
        // Before each test, we need fresh state!
        // aka, we don't want to rely on state
        // left over from a previous test
        cy.visit('http://localhost:1234');
    })

    // Getters to cut down on typing
    const textInput = () => cy.get('input[name=text]');
    const authorInput = () => cy.get('input[name=author]');
    const foobarInput = () => cy.get('input[name=foobar]');
    const submitBtn = () => cy.get("button[id='submitBtn']");
    const cancelBtn = () => cy.get(`button[id="cancelBtn"]`);

    it('sanity check to make sure tests work', () => {
        // "it" is a test
        // "expect" is an assertion
        expect(1 + 2).to.equal(3);
        expect(2 + 2).not.to.equal(5);
        expect({}).not.to.equal({}); // strict ===
        expect({}).to.eql({}); // not strict ==
    })

    it('the proper elements are showing', () => {
        textInput().should('exist');
        foobarInput().should('not.exist');
        authorInput().should('exist');
        submitBtn().should('exist');
        cancelBtn().should('exist');
        cy.contains('Submit Quote').should('exist');
        cy.contains(/submit quote/i).should('exist');
    })

    describe('Filling out the inputs and cancelling', () => {
        // We can use optional describe blocks to organize and group our tests
        // Can we navigate to the url
        it('can navigate to the url', () => {
            cy.url().should('include', 'localhost');
        })

        // submit button should start out disabled
        it('submit button starts out disabled', () => {
            submitBtn().should('be.disabled');
        })

        // type in the inputs
        it('can type in the inputs', () => {
            textInput()
                .should('have.value', '')
                .type('Casey rox!')
                .should('have.value', 'Casey rox!');
            authorInput()
                .should('have.value', '')
                .type('Not Casey')
                .should('have.value', 'Not Casey');
        })
        
        // submit button is NOT disabled after typing in the inputs
        it('the submit button enables when both inputs are filled out', () => {
            authorInput().type('Casey');
            textInput().type('CSS is fun!!!');
            submitBtn().should('not.be.disabled');
        })
        
        // The cancel button works
        it('the cancel button can reset the inputs and disable the submit button', () => {
            authorInput().type('Casey');
            textInput().type('CSS is lame!!');
            cancelBtn().click();
            authorInput().should('have.value', '');
            textInput().should('have.value', '');
            submitBtn().should('be.disabled');
        })
    })

    describe('Adding a new quote', () => {
        it('can submit and delete a new quote', () => {
            textInput().type('JavaScript? More like LAME SCRIPT');
            authorInput().type('Lorem Ipsum');
            submitBtn().click();
            cy.contains('Lorem Ipsum').siblings('button:nth-of-type(2)').click();
            cy.contains('Lorem Ipsum').should('not.exist');
        })

        it('variation of can submit a new quote', () => {
            cy.contains('Lorem Ipsum').should('not.exist');
            textInput().type('I love testing!');
            authorInput().type('CRHarding');
            submitBtn().click();
            cy.contains(/crharding/i).should('exist');
            cy.contains('CRHarding').next().next().click();
            cy.contains('CRHarding').should('not.exist');
        })
    })

    describe('Editing an existing quote', () => {
        it('can edit a quote', () => {
            textInput().type('blah');
            authorInput().type('Casey');
            submitBtn().click();
            cy.contains('Casey').siblings('button:nth-of-type(1)').click();
            authorInput().should('have.value', 'Casey');
            textInput().should('have.value', 'blah');
            textInput().type(' blah blah!');
            authorInput().type(' Harding');
            submitBtn().click();
            cy.contains('blah blah blah! (Casey Harding)');
            // ALWAYS REMOVE SIDE EFFECTS!!!!
            cy.contains('Casey').next().next().click();
            cy.contains('blah blah blah! (Casey Harding)').should('not.exist');
        })
    })
})