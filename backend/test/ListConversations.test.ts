import { randomUUID } from 'crypto';
import ListConversations from '../src/application/use-case/ListConversations';
import { Message } from '../src/domain/entity/Message';
import User from '../src/domain/entity/User';
import MessageRepositoryMemory from '../src/infra/repository/MessageRepositoryMemory';
import UserRepositoryMemory from '../src/infra/repository/UserRepositoryMemory';

test('should list all user conversations with the last message', async () => {
  const userRepository = new UserRepositoryMemory();
  const messageRepository = new MessageRepositoryMemory();
  const listConversations = new ListConversations(
    messageRepository,
    userRepository,
  );

  const user1Id = randomUUID();
  const user2Id = randomUUID();
  const user3Id = randomUUID();

  const user1 = new User(
    user1Id,
    user1Id,
    'Usuario1',
    'usuario1',
    'senha1',
    new Date(),
  );
  const user2 = new User(
    user2Id,
    user2Id,
    'Usuario2',
    'usuario2',
    'senha2',
    new Date(),
  );
  const user3 = new User(
    user3Id,
    user3Id,
    'Usuario3',
    'usuario3',
    'senha3',
    new Date(),
  );

  await Promise.all([
    userRepository.save(user1),
    userRepository.save(user2),
    userRepository.save(user3),
  ]);

  const users = await userRepository.listAll();

  const msgFromUser1ToUser2 = Message.create(
    user1.publicId,
    user2.publicId,
    'Olá Usuario2',
  );
  await messageRepository.save(msgFromUser1ToUser2);

  await new Promise((resolve) => setTimeout(resolve, 10));
  const msgFromUser2ToUser1 = Message.create(
    user2.publicId,
    user1.publicId,
    'Olá Usuario1',
  );
  await messageRepository.save(msgFromUser2ToUser1);

  await new Promise((resolve) => setTimeout(resolve, 10));
  const msgFromUser1ToUser3 = Message.create(
    user1.publicId,
    user3.publicId,
    'Olá Usuario3',
  );
  await messageRepository.save(msgFromUser1ToUser3);

  const conversations = await listConversations.execute(user1.publicId);

  expect(conversations).toBeDefined();
  if (!conversations) return;
  expect(conversations).toHaveLength(2);

  const conversationWithUser2 = conversations.find(
    (c) => c.partner.id === user2.id,
  );
  const conversationWithUser3 = conversations.find(
    (c) => c.partner.id === user3.id,
  );

  expect(conversationWithUser2).toBeDefined();
  expect(conversationWithUser2?.partner.name).toBe('Usuario2');
  expect(conversationWithUser2?.lastMessage.text).toBe('Olá Usuario1');
  expect(conversationWithUser2?.lastMessage.id).toBe(msgFromUser2ToUser1.id);

  expect(conversationWithUser3).toBeDefined();
  expect(conversationWithUser3?.partner.name).toBe('Usuario3');
  expect(conversationWithUser3?.lastMessage.text).toBe('Olá Usuario3');
  expect(conversationWithUser3?.lastMessage.id).toBe(msgFromUser1ToUser3.id);
});
