const subjectData = {
    title: "Sample Subject",
    runningCodes: [
        {
        first: "lex lex.l",
        second: "gcc lex.yy.c",
        third: "./a.out input.txt",
        }
    ],
    questions: [
        {
            question: "Count the number of comments, keywords, identifiers, words, lines, and spaces from input file.",
            code: `
%{
    int c=0,k=0,l=0,i=0,s=0;
    extern FILE *yyin;
%}

alpha [a-zA-Z]
digit [0-9]
comment "//".*
keyword (if|else|for|while|switch|case|break|continue|return|int|float|double|string|boolean)
identifier {alpha}({alpha}|{digit})*
line [\\n]+
space [ \\t]+

%%

{comment} {c++;}
{keyword} {k++;}
{identifier} {i++;}
{line} {l++;}
{space} {s++;}

%%

int yywrap(){
    return 1;
}

int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;
    
    yylex();
    if(l>0){
        l+=1;
    }
    printf("Comments: %d\\n",c);
    printf("Keywords: %d\\n",k);
    printf("Identifiers: %d\\n",i);
    printf("Lines: %d\\n",l);
    printf("Spaces: %d\\n",s);
    printf("Words: %d\\n",i+k+c);

    fclose(fp);
    return 0;   
}
    `,
input: `
int anujesh hello return 123 
//commentif else for while switch 
case break continue return 
int float double string boolean
`,
        },
        {
            question: "Count number of words starting with ‘A’.",
            code: `
%{
    int count =0;
    extern FILE *yyin;    
%}

alpha [a-zA-Z]*
start (A|a){alpha}

%%
{start} {count+=1;}
.|\\n|\\t ;
%%

int yywrap(){
    return 1;
}

int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;

    yylex();
    printf("Words:- %d \\n",count);

    fclose(fp);
    return 0;
}
    `,
input: `
int anujesh hello return 123 
//commentif else for while switch 
case break continue return 
int float double string boolean
`,
        },
        {
            question: "Conversion of lowercase to uppercase and vice versa.",
            code: `
%{
    extern FILE *yyin;
%}

lower [a-z]
upper [A-Z]
space [ \\s]

%%

{lower} {printf("%c", yytext[0] - 32);}
{upper} {printf("%c", yytext[0] + 32);}
\\n {printf("\\n");}
\\t {printf("\\t");}
{space} {printf(" ");}
. ;

%%

int yywrap(){
    return 1;
}

int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;

    yylex();

    fclose(fp);
    return 0;
}
    `,
input: `
int anujesh hello return 123 
//commentif else for while switch 
case break continue return 
int float double string boolean
`,
        },
        {
            question: "Conversion of decimal to hexadecimal number in a file.",
            code: `
%{ 
    int num, r, hex_index = 0, i;
    char a[20];
    extern FILE *yyin;
%} 

DIGIT [0-9]+
NON_DIGIT [^0-9]+

%% 

{DIGIT} { 
    num = atoi(yytext);

    hex_index = 0;
    do {
        r = num % 16;
        if (r < 10) {
            a[hex_index++] = '0' + r;
        } else {
            a[hex_index++] = 'A' + (r - 10);
        }
        num = num / 16;
    } while (num != 0);

    for (i = hex_index - 1; i >= 0; i--) {
        printf("%c", a[i]);
    }
    printf("");
}

{NON_DIGIT} { 
    printf("%s", yytext);
}

%% 

int yywrap() {
    return 1;
}

int main(int argc, char *argv[]) { 
    FILE *fp = fopen(argv[1], "r+");
    yyin = fp;
    yylex(); 
    printf("\\n");
    fclose(fp);
    return 0; 
}
    `,

input: `
int anujesh hello return 123 
//commentif else for while switch 
case break continue return 
int float double string boolean
`,

        },
        {
            question: "Test lines ending with \".com\".",
            code: `
%{
    int count =0;  
    extern FILE *yyin;
%}

alpha [a-zA-Z]
digit [0-9]
symbol [^{alpha}{digit} \\t\\n\\s]
content ({alpha}|{digit}|{symbol})+".com"

%%
{content} {count++;}
.|\\n|\\t ;
%%
int yywrap(){
    return 1;
}
int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;
    yylex();
    printf("Count:- %d\\n",count);
    fclose(fp);
    return 0;
}
    `,
input: `
int anujesh hello return 123 
//commentif else for while switch 
case break continue return 
int float double string boolean
`,
        }
    ]
};




// // Render the running codes and questions with copy buttons
// function renderPageContent() {
//     const runningCodesContainer = document.getElementById("running-codes");
//     const questionsContainer = document.getElementById("questions-container");

//     // Render running codes
//     subjectData.runningCodes.forEach(codeObj => {
//         // Use the specific keys (first, second, third) to create code snippets
//         for (const key in codeObj) {
//             if (codeObj.hasOwnProperty(key)) {
//                 // Create a code snippet with the key as the label
//                 runningCodesContainer.appendChild(createCodeSnippet(codeObj[key], key));
//             }
//         }
//     });

//     // Render questions
//     subjectData.questions.forEach((item, index) => {
//         const questionDiv = document.createElement("div");
//         questionDiv.innerHTML = `<h2>Question ${index + 1}: <span>${item.question}</span></h2>`;
        
//         questionDiv.appendChild(createCodeSnippet(item.code, "lex.l"));
//         questionDiv.appendChild(createCodeSnippet(item.input, "input.txt"));
        
//         questionsContainer.appendChild(questionDiv);
//     });
// }

// // Helper function to create a code snippet element with a copy button
// function createCodeSnippet(content, label) {
//     const container = document.createElement("div");
//     const pre = document.createElement("pre");
//     const codeElem = document.createElement("code");
//     codeElem.textContent = content;

//     const copyBtn = document.createElement("button");
//     copyBtn.textContent = "Copy";
//     copyBtn.className = "copy-btn";
//     copyBtn.onclick = () => handleCopy(content, copyBtn);

//     container.innerHTML = `<strong>${label}:</strong>`;
//     pre.appendChild(codeElem);
//     pre.appendChild(copyBtn);
//     container.appendChild(pre);
    
//     return container;
// }

// // Copy code to clipboard and change button state
// function handleCopy(text, button) {
//     navigator.clipboard.writeText(text).then(() => {
//         button.textContent = "Copied";
//         button.style.backgroundColor = "#3a3d40";
//         setTimeout(() => {
//             button.textContent = "Copy";
//             button.style.backgroundColor = "#238636";
//         }, 2000);
//     }).catch(err => {
//         console.error("Failed to copy text: ", err);
//     });
// }

// // Initialize page content
// document.addEventListener("DOMContentLoaded", renderPageContent);

// Render the running codes and questions with copy buttons
function renderPageContent() {
    const runningCodesContainer = document.getElementById("running-codes");
    const questionsContainer = document.getElementById("questions-container");

    // Render running codes
    subjectData.runningCodes.forEach(codeObj => {
        // Use the specific keys (first, second, third) to create code snippets
        for (const key in codeObj) {
            if (codeObj.hasOwnProperty(key)) {
                // Create a code snippet with the key as the label
                runningCodesContainer.appendChild(createCodeSnippet(codeObj[key], key));
            }
        }
    });

    // Render questions
    subjectData.questions.forEach((item, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `<h2>Question ${index + 1}: <span>${item.question}</span></h2>`;
        
        questionDiv.appendChild(createCodeSnippet(item.code, "lex.l"));
        questionDiv.appendChild(createCodeSnippet(item.input, "input.txt"));
        
        questionsContainer.appendChild(questionDiv);
    });
}

// Helper function to create a code snippet element with a copy button
function createCodeSnippet(content, label) {
    const container = document.createElement("div");
    const pre = document.createElement("pre");
    const codeElem = document.createElement("code");
    codeElem.textContent = content;

    // Make the whole pre element clickable to copy
    pre.onclick = () => handleCopy(content, null);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.className = "copy-btn";
    copyBtn.onclick = (event) => {
        event.stopPropagation(); // Prevent the pre click from firing
        handleCopy(content, copyBtn);
    };

    container.innerHTML = `<strong>${label}:</strong>`;
    pre.appendChild(codeElem);
    pre.appendChild(copyBtn);
    container.appendChild(pre);
    
    return container;
}

// Copy code to clipboard and change button state
function handleCopy(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        if (button) {
            button.textContent = "Copied";
            button.style.backgroundColor = "#3a3d40";
            setTimeout(() => {
                button.textContent = "Copy";
                button.style.backgroundColor = "#238636";
            }, 2000);
        }
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

// Initialize page content
document.addEventListener("DOMContentLoaded", renderPageContent);