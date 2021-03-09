import dgram from 'dgram';

const server = dgram.createSocket('udp4');

interface Data {
  choice: string;
  number: number;
  address: string;
  port: number;
}

let alreadyEven: Boolean | null;
let alreadyOdd: Boolean | null;

let firstClient: Data | null;
let secondClient: Data | null;

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const [response, number] = msg.toString().split(',');

  if (firstClient) {
    if (alreadyEven && response === 'par') {
      console.log('deu ruim');
      server.send(
        'Par já foi escolhido, tente novamente!',
        rinfo.port,
        rinfo.address
      );
      return;
    }
    if (alreadyOdd && response === 'impar') {
      server.send(
        'Ímpar já foi escolhido, tente novamente!',
        rinfo.port,
        rinfo.address
      );
      return;
    }

    secondClient = {
      choice: response,
      number: Number(number),
      address: rinfo.address,
      port: rinfo.port,
    };
    response === 'par' ? (alreadyEven = true) : (alreadyOdd = true);
  } else {
    firstClient = {
      choice: response,
      number: Number(number),
      address: rinfo.address,
      port: rinfo.port,
    };
    response === 'par' ? (alreadyEven = true) : (alreadyOdd = true);
  }

  if (firstClient && secondClient) {
    const { winner, sum } = calculateWinner(firstClient, secondClient);

    if (winner) {
      const winnerMessage = `Parabéns, você ganhou! | resultado: ${sum}`;
      const loserMessage = `Você perdeu :( | resultado: ${sum}`;
      server.send(
        winner === firstClient.choice ? winnerMessage : loserMessage,
        firstClient.port,
        firstClient.address
      );
      server.send(
        winner === secondClient.choice ? winnerMessage : loserMessage,
        secondClient.port,
        secondClient.address
      );

      firstClient = null;
      secondClient = null;
      alreadyEven = null;
      alreadyOdd = null;
    }
  }
});

const calculateWinner = (playerOne: Data, playerTwo: Data) => {
  const sum = playerOne.number + playerTwo.number;
  const winner = sum % 2 === 0 ? 'par' : 'impar';

  return { winner, sum };
};

server.bind(41234);
