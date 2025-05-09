document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const startBtn = document.getElementById("start-btn");
  const questionContainer = document.getElementById("question-container");
  const roomInput = document.getElementById("room-link");
  const copyBtn = document.getElementById("copy-btn");

  let currentQuestionIndex = null;

  // Set room link
  roomInput.value = window.location.href;

  // Copy room link
  copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(roomInput.value);
      copyBtn.innerText = "✅ COPIED";
      setTimeout(() => (copyBtn.innerText = "📋 Copy"), 2000);
  });

  // Start button clicked
  startBtn.addEventListener("click", () => {
      if (currentQuestionIndex === null) {
          const index = Math.floor(Math.random() * questionData.length);
          currentQuestionIndex = index;
          socket.emit("start-question", index);
      }
  });

  // Receive and display question
  socket.on("show-question", (index) => {
      currentQuestionIndex = index;
      const question = questionData[index];

      questionContainer.innerHTML = `
          <h2>${question.title}</h2>
          <p>${question.description}</p>
          <textarea id="answer-box" placeholder="Type your C code here..."></textarea>
          <button id="submit-answer">Submit Answer</button>
          <div id="result-message"></div>
          <div id="timer">Time Left: 360s</div>
      `;

      startTimer();

      document.getElementById("submit-answer").addEventListener("click", () => {
          const userCode = document.getElementById("answer-box").value;
          if (userCode.trim()) {
              socket.emit("submit-answer", {
                  code: userCode,
                  index: currentQuestionIndex
              });
          }
      });
  });

  // Display winner/result
  socket.on("declare-winner", (msg) => {
      const resultMessage = document.getElementById("result-message");
      if (resultMessage) {
          resultMessage.innerText = msg;
      }
  });

  // Timer function
  let timerInterval;
  function startTimer() {
      let timeLeft = 360;
      clearInterval(timerInterval);

      timerInterval = setInterval(() => {
          timeLeft--;
          const timerElement = document.getElementById("timer");
          if (timerElement) {
              timerElement.innerText = `Time Left: ${timeLeft}s`;
          }

          if (timeLeft <= 0) {
              clearInterval(timerInterval);
              if (timerElement) {
                  timerElement.innerText = "Time's up!";
              }
          }
      }, 1000);
  }

  // All 9 questions
  const questionData = [
      {
          title: "Reverse a Number",
          description: "Write a C program to reverse a number.",
          code: "#include <stdio.h>\nint main() { int n, r = 0; scanf(\"%d\", &n); while(n) { r = r*10 + n%10; n /= 10; } printf(\"%d\", r); return 0; }"
      },
      {
          title: "Check Prime Number",
          description: "Write a C program to check if a number is prime.",
          code: "#include <stdio.h>\nint main() { int n, i, f=0; scanf(\"%d\", &n); for(i=2;i<n;i++) if(n%i==0) f=1; if(f==0) printf(\"Prime\"); else printf(\"Not Prime\"); return 0; }"
      },
      {
          title: "Factorial using Recursion",
          description: "Write a C program to find the factorial of a number using recursion.",
          code: "#include <stdio.h>\nint fact(int n){ return (n==0)?1:n*fact(n-1); }\nint main() { int n; scanf(\"%d\", &n); printf(\"%d\", fact(n)); return 0; }"
      },
      {
          title: "Sum of Digits",
          description: "Write a C program to find the sum of digits of a number.",
          code: "#include <stdio.h>\nint main() { int n, sum=0; scanf(\"%d\", &n); while(n){ sum += n%10; n /= 10; } printf(\"%d\", sum); return 0; }"
      },
      {
          title: "Fibonacci Series",
          description: "Write a C program to print Fibonacci series up to n terms.",
          code: "#include <stdio.h>\nint main() { int n, a=0, b=1, c, i; scanf(\"%d\", &n); for(i=0;i<n;i++){ printf(\"%d \", a); c = a + b; a = b; b = c; } return 0; }"
      },
      {
          title: "Find Largest Element in Array",
          description: "Write a C program to find the largest element in an array.",
          code: "#include <stdio.h>\nint main() { int n, a[100], i, max; scanf(\"%d\", &n); for(i=0;i<n;i++) scanf(\"%d\", &a[i]); max=a[0]; for(i=1;i<n;i++) if(a[i]>max) max=a[i]; printf(\"%d\", max); return 0; }"
      },
      {
          title: "Check Palindrome Number",
          description: "Write a C program to check whether a number is a palindrome.",
          code: "#include <stdio.h>\nint main() { int n, rev=0, t; scanf(\"%d\", &n); t=n; while(t){ rev=rev*10 + t%10; t/=10; } if(rev==n) printf(\"Palindrome\"); else printf(\"Not Palindrome\"); return 0; }"
      },
      {
          title: "Swap Numbers using Pointers",
          description: "Write a C program to swap two numbers using pointers.",
          code: "#include <stdio.h>\nvoid swap(int *a, int *b){ int t=*a; *a=*b; *b=t; }\nint main() { int x,y; scanf(\"%d%d\", &x, &y); swap(&x,&y); printf(\"%d %d\",x,y); return 0; }"
      },
      {
          title: "Count Vowels in String",
          description: "Write a C program to count the number of vowels in a string.",
          code: "#include <stdio.h>\n#include <string.h>\nint main() { char s[100]; int i,c=0; scanf(\"%s\", s); for(i=0;s[i];i++) if(strchr(\"aeiouAEIOU\",s[i])) c++; printf(\"%d\", c); return 0; }"
      }
  ];
});

