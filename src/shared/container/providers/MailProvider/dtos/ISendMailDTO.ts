import IParseMailTemplateDTO from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContatct {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContatct;
  from?: IMailContatct;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
