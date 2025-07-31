/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {
  let token;

  before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn });
  });

  it('Deve validar contrato de usuários', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('usuarios');
    });
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('usuarios');
    });
  });

  it('Deve cadastrar um usuário com sucesso usando faker - POST', () => {
    cy.cadastrarUsuario(token)
      .then(response => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Cadastro realizado com sucesso');
      });
  });

  it('Deve validar um usuário com email já cadastrado - POST', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      failOnStatusCode: false,
      body: {
        nome: "Fulano da Silva",
        email: "beltrano@qa.com.br",
        password: "teste",
        administrador: "true"
      }
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Este email já está sendo usado');
    });
  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    const usuarioEditado = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'teste',
      administrador: 'true'
    };

    cy.cadastrarUsuario(token)
      .then(response => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Cadastro realizado com sucesso');
        const id = response.body._id;

        return cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          headers: { authorization: token },
          body: usuarioEditado
        });
      })
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Registro alterado com sucesso');
      });
  });

  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {
    cy.cadastrarUsuario(token)
      .then(response => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Cadastro realizado com sucesso');

        const id = response.body._id;

        return cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
          headers: { authorization: token },
        });
      })
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Registro excluído com sucesso');
      });
  });
});
