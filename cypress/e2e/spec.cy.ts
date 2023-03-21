describe('My First Test', () => {
  it('Sanity Test', () => {
    cy.visit('/');
    cy.contains('#header .text-3xl', 'Clipz');
    expect(true);
  });
});
