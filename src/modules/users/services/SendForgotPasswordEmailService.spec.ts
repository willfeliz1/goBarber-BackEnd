import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
  it('should be able to recover the password using the email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();
    const fakeUserTokensRepository = new FakeUserTokensRepository();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'JohnDoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'JohnDoe@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();
    const fakeUserTokensRepository = new FakeUserTokensRepository();

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );

    await expect(
      sendForgotPasswordEmail.execute({
        email: 'JohnDoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();
    const fakeUserTokensRepository = new FakeUserTokensRepository();

    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'JohnDoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'JohnDoe@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
