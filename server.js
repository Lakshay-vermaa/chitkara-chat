const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // Serve static files

let gameActive = false;

// List of questions and their full C code
const questions = [
  {
    title: "Reverse a Number",
    code: `#include <stdio.h>
int main() {
    int n, rev = 0, rem;
    scanf("%d", &n);
    while(n != 0) {
        rem = n % 10;
        rev = rev * 10 + rem;
        n /= 10;
    }
    printf("%d", rev);
    return 0;
}`
  },
  {
    title: "Check Prime Number",
    code: `#include <stdio.h>
int main() {
    int n, i, flag = 0;
    scanf("%d", &n);
    for(i = 2; i < n; i++) {
        if(n % i == 0) {
            flag = 1;
            break;
        }
    }
    if(n <= 1) flag = 1;
    if(flag == 0)
        printf("Prime");
    else
        printf("Not Prime");
    return 0;
}`
  },
  {
    title: "Find Factorial",
    code: `#include <stdio.h>
int main() {
    int n, i;
    long long fact = 1;
    scanf("%d", &n);
    for(i = 1; i <= n; i++) {
        fact *= i;
    }
    printf("%lld", fact);
    return 0;
}`
  },
  {
    title: "Fibonacci Series",
    code: `#include <stdio.h>
int main() {
    int n, a = 0, b = 1, c, i;
    scanf("%d", &n);
    for(i = 0; i < n; i++) {
        printf("%d ", a);
        c = a + b;
        a = b;
        b = c;
    }
    return 0;
}`
  },
  {
    title: "Sum of Digits",
    code: `#include <stdio.h>
int main() {
    int n, sum = 0, rem;
    scanf("%d", &n);
    while(n != 0) {
        rem = n % 10;
        sum += rem;
        n = n / 10;
    }
    printf("%d", sum);
    return 0;
}`
  },
  {
    title: "Check Palindrome",
    code: `#include <stdio.h>
int main() {
    int n, original, rev = 0, rem;
    scanf("%d", &n);
    original = n;
    while(n != 0) {
        rem = n % 10;
        rev = rev * 10 + rem;
        n /= 10;
    }
    if(original == rev)
        printf("Palindrome");
    else
        printf("Not Palindrome");
    return 0;
}`
  },
  {
    title: "Swap Two Numbers",
    code: `#include <stdio.h>
int main() {
    int a, b, temp;
    scanf("%d %d", &a, &b);
    temp = a;
    a = b;
    b = temp;
    printf("%d %d", a, b);
    return 0;
}`
  },
  {
    title: "Check Even or Odd",
    code: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    if(n % 2 == 0)
        printf("Even");
    else
        printf("Odd");
    return 0;
}`
  },
  {
    title: "Multiplication Table",
    code: `#include <stdio.h>
int main() {
    int n, i;
    scanf("%d", &n);
    for(i = 1; i <= 10; i++) {
        printf("%d x %d = %d\\n", n, i, n * i);
    }
    return 0;
}`
  }
];

// Function to normalize code by stripping variable names
function normalizeCode(code) {
  return code
    .replace(/\b(int|float|char|double|long|short|long long|unsigned|signed)\s+\w+\s*;/g, "")
    .replace(/\b\w+\s*=\s*\w+;/g, "")
    .replace(/\b\w+\s*\([^)]*\)/g, "")
    .replace(/\b\w+/g, "var");
}

// Function to validate code by comparing normalized versions
function validateCode(code, index) {
  const expectedCode = questions[index].code;
  const normalizedExpectedCode = normalizeCode(expectedCode);
  const normalizedSubmittedCode = normalizeCode(code);

  return normalizedExpectedCode.trim() === normalizedSubmittedCode.trim();
}

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("start-question", (randomQuestion) => {
    if (!gameActive) {
      gameActive = true;
      io.emit("show-question", randomQuestion);
    }
  });

  socket.on("submit-answer", ({ code, index }) => {
    if (gameActive) {
      const isCorrect = validateCode(code, index);

      if (isCorrect) {
        io.emit("declare-winner", "You lose!");
        socket.emit("declare-winner", "You win! 🎉");
        gameActive = false;
      } else {
        socket.emit("declare-winner", "Incorrect code! Try again.");
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));

////                   node server.js
////                 node server/server.js