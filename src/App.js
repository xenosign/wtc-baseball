const MissionUtils = require("@woowacourse/mission-utils");

class App {
  constructor() {
    this.nonDuplicateNumbers = [];
  }

  play() {
    this.gameStartMessage();
    // 결국 컴퓨터가 만든 번호는 this.nonDuplicateNumbers 라는 생성자에 들어가는데 할당이 안되어 있으므로
    // this.nonDuplicateNumbers 생성자에 this.computerRandomNumber() 리턴 값을 할당
    this.nonDuplicateNumbers = this.computerRandomNumber();
    this.getUserNumberInput();
  }

  gameStartMessage() {
    MissionUtils.Console.print("숫자 야구 게임을 시작합니다!.");
  }

  computerRandomNumber() {
    const nonDuplicateNumbers = [];
    while (nonDuplicateNumbers.length < 3) {
      const randomNumber = MissionUtils.Random.pickNumberInRange(1, 9);
      if (!nonDuplicateNumbers.includes(randomNumber)) {
        nonDuplicateNumbers.push(randomNumber);
      }
    }
    return nonDuplicateNumbers;
  }

  getUserNumberInput() {
    MissionUtils.Console.readLine("숫자를 입력해주세요 : ", (userInput) => {
      // checkError 함수에 들어가기 전 부터 배열 형태로 받아야 하는게 아닌가 싶네요.
      // 미리 배열로 자르고 문자열을 숫자로 변경했습니다
      // 결국 연속으로 입력 받은 숫자를 전부 숫자인지 검사해야 하는데, 이는 배열 값으로 들어가야 하니까요.

      // 다만 문자열을 자르실 때 "" 로 자르면 구분이 어려워서 스페이스바로 구분이 가능하도록 split 의 인자를 " " 로 주었습니다!
      const userNumArr = userInput.split("").map(Number);

      // 숫자로 잘려진 배열을 유효성 검사에 삽입!
      this.checkError(userNumArr);
      this.checkAnswer(userNumArr);
    });
  }

  checkError(userNumArr) {
    const NUMBERS = /^[1-9]+$/;

    // 각각의 배열에 들어간 숫자 전부를 체크해 줘야 하므로 반복문 사용
    for (let i = 0; i < userNumArr.length; i++) {
      if (!NUMBERS.test(userNumArr[i]))
        throw new Error("숫자가 입력되지 않았습니다");
    }

    // 각각의 3개의 값이 정확히 잘려서 들어 왔는지 확인
    if (userNumArr.length !== 3) throw new Error("3개의 숫자가 아닙니다.");

    // 배열 내부에 중복을 검사
    if (new Set(userNumArr).size !== 3)
      throw new Error("중복된 숫자가 있습니다.");
  }

  checkAnswer(userNumArr) {
    let STRIKE = 0;
    let BALL = 0;
    let result = "";

    for (let i = 0; i < userNumArr.length; i++) {
      if (userNumArr[i] === this.nonDuplicateNumbers[i]) STRIKE++;
      else if (userNumArr.includes(this.nonDuplicateNumbers[i])) BALL++;
    }

    if (BALL === 0 && STRIKE === 0) {
      result = "낫싱";
    } else if (BALL === 0 && STRIKE !== 0) {
      result = `${STRIKE}스트라이크`;
    } else if (BALL !== 0 && STRIKE === 0) {
      result = `${BALL}볼`;
    } else if (BALL !== 0 && STRIKE !== 0) {
      result = `${BALL}볼 ${STRIKE}스트라이크`;
    } else {
      result = "3스트라이크";
    }

    this.findAnswer(result);
  }

  findAnswer(res) {
    // 콘솔 로그에 스트라이크 볼 여부가 나와야 유추가 가능하므로 콘솔 로그 찍어주기
    MissionUtils.Console.print(res);
    if (res !== "3스트라이크") {
      this.getUserNumberInput();
    } else if (res === "3스트라이크") {
      this.gameEndMessage();
    }
  }

  gameEndMessage() {
    MissionUtils.Console.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료");
    MissionUtils.Console.readLine(
      "게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n",
      (userInput) => {
        if (userInput === "1") app.play();
        else if (userInput === "2") MissionUtils.Console.close();
        else throw new Error("다른 값을 입력하셨습니다");
      }
    );
  }
}

const app = new App();
app.play();

module.exports = App;
