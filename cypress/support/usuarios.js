import { faker } from '@faker-js/faker';

export function gerarUsuarioFake() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'teste',
    administrador: 'true'
  };
}
