import dgram from 'dgram';
import readLine from 'readline';

const client = dgram.createSocket('udp4');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  'Par ou ímpar e o número desejado separado por vírgula ',
  (answer) => {
    if (
      answer.toLowerCase().includes('par,') ||
      answer.toLowerCase().includes('impar,')
    ) {
      client.send(answer, 41234, 'localhost', (err) => {
        if (err) console.log('algo deu errado', err);
        console.log('aguardando jogadores...');
      });
    } else {
      console.log(`${answer} não é uma resposta válida. Digite par ou impar!`);
    }
    rl.close();
  }
);

client.on('message', (msg, rinfo) => {
  console.log(msg.toString());
  client.close();
});
