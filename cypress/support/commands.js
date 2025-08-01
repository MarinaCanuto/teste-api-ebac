import { faker } from '@faker-js/faker';


Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": senha 
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
 })

 Cypress.Commands.add('cadastrarProduto' , (token, produto, preco, descricao, quantidade) =>{
    cy.request({
        method: 'POST', 
        url: 'produtos',
        headers: {authorization: token}, 
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
          }, 
          failOnStatusCode: false
    })
 })
 Cypress.Commands.add('cadastrarUsuario', (token) => {
  const nome = faker.person.fullName();
  const email = faker.internet.email(); 
  const senha = "teste";

  return cy.request({
    method: 'POST',
    url: 'usuarios',
    headers: {
      authorization: token
    },
    body: {
      nome,
      email,
      password: senha,
      administrador: "true"
    },
  });
});
